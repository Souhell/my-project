const { Builder, By, Key, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const fs = require("fs");
const path = require("path");
const customDriver = require("../customerDriver");
const { Actions } = require("selenium-webdriver");
const { Entry } = require("selenium-webdriver/lib/logging");
const colors = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  reset: "\x1b[0m",
};

// بهبود waitForElement برای گرفتن المنت با timeout قابل تنظیم
async function waitForElement(driver, xpath, timeout = 10000) {
  return await driver.wait(until.elementLocated(By.xpath(xpath)), timeout);
}

// ایمن‌تر کردن کلیک: ensure visible/enabled سپس تلاش با JS fallback
async function safeClick(driver, xpath, timeout = 10000) {
  const element = await waitForElement(driver, xpath, timeout);
  await driver.wait(until.elementIsVisible(element), timeout);
  await driver.wait(until.elementIsEnabled(element), timeout);
  try {
    // تلاش با actions اول (شبیه کلیک واقعی)
    await driver
      .actions({ async: true })
      .move({ origin: element })
      .click()
      .perform();
  } catch (e) {
    try {
      // fallback: کلیک با JS
      await driver.executeScript("arguments[0].click();", element);
    } catch (e2) {
      // fallback نهایی: native click
      await element.click();
    }
  }
  return element;
}

// بهبود selectFromDropdown با شناسایی opener مناسب و انتظار برای dropdown قابل مشاهده
async function selectFromDropdown(
  driver,
  dropdownXpath,
  optionText = null,
  optionIndex = null,
  timeout = 8000
) {
  try {
    // تلاش برای پیدا کردن opener (input یا selector)
    let opener;
    try {
      opener = await waitForElement(driver, dropdownXpath, 3000);
    } catch (e) {
      // fallback: انتخاب اولین selector کلی موجود
      const selectors = await driver.findElements(
        By.css("div.ant-select-selector, div.ant-select")
      );
      if (selectors.length) opener = selectors[0];
    }

    if (!opener) {
      console.log("⚠️ selectFromDropdown: opener not found");
      return false;
    }

    // اگر opener یک input بود، سعی کن selector والد را کلیک کنی
    try {
      const tag = (await opener.getTagName()).toLowerCase();
      if (tag === "input") {
        const antSelect = await driver.executeScript(
          "return arguments[0].closest('div.ant-select')",
          opener
        );
        if (antSelect) {
          const selector = await antSelect
            .findElement(By.css(".ant-select-selector"))
            .catch(() => null);
          if (selector) opener = selector;
        }
      }
    } catch (e) {}

    // بستن tooltip/hover احتمالی
    try {
      await driver.actions({ async: true }).move({ x: 0, y: 0 }).perform();
      await driver.findElement(By.css("body")).sendKeys(Key.ESCAPE);
    } catch (e) {}

    await driver.executeScript(
      "arguments[0].scrollIntoView({block:'center'});",
      opener
    );
    await driver.sleep(120);
    await driver.executeScript("arguments[0].click();", opener);

    // پیدا کردن option های باز شده در dropdown فعال
    const visibleOptions = By.css(
      ".ant-select-dropdown:not(.ant-select-dropdown-hidden) .ant-select-item-option"
    );
    await driver.wait(until.elementsLocated(visibleOptions), timeout);
    let options = await driver.findElements(visibleOptions);
    if (!options || options.length === 0) {
      await driver.sleep(250);
      options = await driver.findElements(visibleOptions);
    }
    if (!options || options.length === 0) {
      console.log("⚠️ selectFromDropdown: no options found");
      return false;
    }

    // انتخاب بر اساس متن یا ایندکس
    if (optionText) {
      for (let opt of options) {
        const txt = (await opt.getText()).trim();
        if (txt.includes(optionText)) {
          await driver.executeScript("arguments[0].scrollIntoView(true);", opt);
          await driver.executeScript("arguments[0].click();", opt);
          await driver.sleep(150);
          return true;
        }
      }
      return false;
    }
    if (optionIndex !== null && options[optionIndex]) {
      await driver.executeScript(
        "arguments[0].scrollIntoView(true);",
        options[optionIndex]
      );
      await driver.executeScript("arguments[0].click();", options[optionIndex]);
      await driver.sleep(150);
      return true;
    }

    // fallback: انتخاب اولین گزینه
    await driver.executeScript(
      "arguments[0].scrollIntoView(true);",
      options[0]
    );
    await driver.executeScript("arguments[0].click();", options[0]);
    await driver.sleep(150);
    return true;
  } catch (err) {
    console.log("⚠️ selectFromDropdown error:", err.message || err);
    return false;
  }
}

// helper جدید: کلیک سریالی با retry, چند روش کلیک و گرفتن اسکرین‌شات موقع خطای نهایی
async function clickSequence(
  driver,
  xpaths,
  opts = { retries: 3, waitBetween: 250, locateTimeout: 6000 }
) {
  for (const xp of xpaths) {
    let clicked = false;
    for (let attempt = 1; attempt <= opts.retries; attempt++) {
      try {
        console.log(`trying click ${xp} (attempt ${attempt})`);
        const el = await driver.wait(
          until.elementLocated(By.xpath(xp)),
          opts.locateTimeout
        );
        await driver.wait(until.elementIsVisible(el), 3000);
        await driver.wait(until.elementIsEnabled(el), 3000);
        await driver.executeScript(
          "arguments[0].scrollIntoView({block:'center'});",
          el
        );
        await driver.sleep(120);

        try {
          await driver
            .actions({ async: true })
            .move({ origin: el })
            .click()
            .perform();
        } catch (e1) {
          try {
            await driver.executeScript("arguments[0].click();", el);
          } catch (e2) {
            await el.click();
          }
        }

        await driver.sleep(180);
        clicked = true;
        break;
      } catch (err) {
        console.log(
          `click ${xp} failed on attempt ${attempt}:`,
          err.message || err
        );
        // تلاش برای باز کردن والد منو در اولین تلاش
        if (attempt === 1) {
          try {
            const parentXpath = xp.replace(/\/ul\/.*/, "");
            if (parentXpath && parentXpath.length) {
              const parents = await driver.findElements(By.xpath(parentXpath));
              if (parents.length > 0) {
                try {
                  await driver.executeScript(
                    "arguments[0].scrollIntoView({block:'center'});",
                    parents[0]
                  );
                  await driver
                    .actions({ async: true })
                    .move({ origin: parents[0] })
                    .click()
                    .perform();
                  await driver.sleep(250);
                  console.log("toggled parent menu to reveal submenu");
                } catch (pe) {}
              }
            }
          } catch (pe) {}
        }
        await driver.sleep(opts.waitBetween);
      }
    }

    if (!clicked) {
      try {
        const ts = Date.now();
        const shotName = `click-fail-${ts}.png`;
        const screenshot = await driver.takeScreenshot();
        fs.writeFileSync(shotName, screenshot, "base64");
        console.log(`screenshot saved: ${shotName}`);
        const html = await driver.getPageSource();
        fs.writeFileSync(`page-${ts}.html`, html, "utf8");
        console.log(`page source saved: page-${ts}.html`);
      } catch (sErr) {
        console.log(
          "خطا در گرفتن اسکرین‌شات یا ذخیره HTML:",
          sErr.message || sErr
        );
      }
      throw new Error(
        `Unable to click element after ${opts.retries} attempts: ${xp}`
      );
    }
  }
}

async function salesInvoiceList() {
  // تولید کد ملی با متد customerDriver
  const nationalId = customDriver.generateNationalId();
  console.log("کد ملی تولید شده:", nationalId);

  // ساخت درایور با اکتیو بودن نوتیفیکیشن و ری‌استور persist
  let dr = new customDriver();
  const url = "https://frontbuild.ariansystemdp.local/fa";
  let driver = await dr.createDriver(url, true);

  try {
    // لاگین با متد customerDriver
    await dr.login();

    // اجرای گام‌ها
    const steps = [
      "/html/body/div[3]/div/div[2]/div[1]/div[2]/div/div[3]/div/ul/li[4]",
      "/html/body/div[3]/div/div[2]/div[1]/div[2]/div/div[3]/div/ul/li[4]/ul/li[2]",
      "/html/body/div[3]/div/div[2]/div[1]/div[2]/div/div[3]/div/ul/li[4]/ul/li[2]/ul/li[3]",
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[1]/div[1]/div[1]/button",
    ];
    await clickSequence(driver, steps, {
      retries: 4,
      waitBetween: 300,
      locateTimeout: 7000,
    });

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[1]/form/div[2]/div/div[2]/div/div/button"
        )
      )
      .click();
    await driver.sleep(700);
    //////
    const todayButton = await driver.wait(
      until.elementLocated(
        By.xpath("//button[normalize-space(text())='انتخاب امروز']")
      ),
      5000
    );
    await driver.wait(until.elementIsVisible(todayButton), 5000);

    await driver.executeScript(
      "arguments[0].scrollIntoView(true);",
      todayButton
    );
    await driver.sleep(200);

    await driver.executeScript("arguments[0].click();", todayButton);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[1]/form/div[4]/div/div[2]/div/div/div/div[1]/div/span/span[1]/input"
        )
      )
      .click();
    await driver.sleep(100);
    const options1 = await driver.findElements(
      By.css(".ant-select-item-option")
    );
    if (options1.length > 0) {
      await driver.executeScript(
        "arguments[0].scrollIntoView(true);",
        options1[0]
      );
      await options1[0].click();
    }
    await driver.sleep(300);
    const goodsInput2 = await driver.findElement(
      By.id("sellWithCustomerForm_SaleTypeId")
    );
    await goodsInput2.click();
    await goodsInput2.sendKeys("فروش نقدی");
    await driver.sleep(300);
    await goodsInput2.sendKeys(Key.ENTER);
    await driver.sleep(300);

    const goodsInput3 = await driver.findElement(
      By.id("sellWithCustomerForm_PayOfTypeId")
    );
    await goodsInput3.click();
    await goodsInput3.sendKeys("نقدی");
    await driver.sleep(300);
    await goodsInput3.sendKeys(Key.ENTER);
    await driver.sleep(300);
    ///
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[3]/span/span"
        )
      )
      .click();
    await driver.sleep(100);

    await driver.sleep(1000);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[3]/div/div[1]/div/span/span[1]"
        )
      )
      .click();
    await driver.sleep(100);
    // بهترین روش
    const goodsInput1 = await driver.findElement(By.id("GoodsId"));
    await goodsInput1.click();
    await goodsInput1.sendKeys("new goods");
    await driver.sleep(300);
    // بعد از Enter در مودال قبلی، صبر کن تا مودال جدید بالا بیاد

    // منتظر شو تا فیلد جدید واقعاً وجود داشته باشه
    const feeInput = await driver.findElement(By.id("Fee"));
    await feeInput.click();
    await feeInput.sendKeys(Key.CONTROL + "a");
    await feeInput.sendKeys("100");
    await driver.sleep(700);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[4]/span/span"
        )
      )
      .click();
    const goodsInput4 = await driver.findElement(By.id("Unit1Id"));
    await goodsInput4.click();
    await goodsInput4.sendKeys("عدد");
    await driver.sleep(300);
    //
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[5]/div"
        )
      )
      .click();
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[5]/div/div/input"
        )
      )
      .sendKeys("1");
    await driver.sleep(1000);
    await safeClick(
      driver,
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[1]/div/div[2]/div"
    );
    await driver.sleep(700);

    //بخش دومپ
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[1]/div[1]/div[1]/button"
        )
      )
      .click();
    await driver.sleep(300);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[1]/div/div[1]/div/div[1]"
        )
      )
      .click();
    await driver.sleep(300);
    await driver
      .findElement(By.xpath("/html/body/div[4]/div/ul/li[3]"))
      .click();
    await driver.sleep(700);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[1]/form/div[2]/div/div[2]/div/div/button"
        )
      )
      .click();
    await driver.sleep(700);
    //////
    const todayButton1 = await driver.wait(
      until.elementLocated(
        By.xpath("//button[normalize-space(text())='انتخاب امروز']")
      ),
      5000
    );
    await driver.wait(until.elementIsVisible(todayButton1), 5000);

    await driver.executeScript(
      "arguments[0].scrollIntoView(true);",
      todayButton1
    );
    await driver.sleep(200);

    await driver.executeScript("arguments[0].click();", todayButton1);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[1]/form/div[4]/div/div[2]/div/div/div/div[1]/div/span/span[1]/input"
        )
      )
      .click();
    await driver.sleep(100);
    const options2 = await driver.findElements(
      By.css(".ant-select-item-option")
    );
    if (options2.length > 0) {
      await driver.executeScript(
        "arguments[0].scrollIntoView(true);",
        options2[0]
      );
      await options2[0].click();
    }
    await driver.sleep(300);
    const goodsInput5 = await driver.findElement(
      By.id("sellWithCustomerForm_SaleTypeId")
    );
    await goodsInput5.click();
    await goodsInput5.sendKeys("فروش نقدی");
    await driver.sleep(300);
    await goodsInput5.sendKeys(Key.ENTER);
    await driver.sleep(300);
    const goodsInput6 = await driver.findElement(
      By.id("sellWithCustomerForm_PayOfTypeId")
    );
    await goodsInput6.click();
    await goodsInput6.sendKeys("نقدی");
    await driver.sleep(300);
    await goodsInput6.sendKeys(Key.ENTER);
    await driver.sleep(300);
    ///
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[3]/span/span"
        )
      )
      .click();
    await driver.sleep(100);

    await driver.sleep(1000);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[3]/div/div[1]/div/span/span[1]"
        )
      )
      .click();
    await driver.sleep(100);
    // بهترین روش
    const goodsInput7 = await driver.findElement(By.id("GoodsId"));
    await goodsInput7.click();
    await goodsInput7.sendKeys("new goods");
    await driver.sleep(300);

    const feeInput1 = await driver.findElement(By.id("Fee"));
    await feeInput1.click();
    await feeInput1.sendKeys(Key.CONTROL + "a");
    await feeInput1.sendKeys("100");
    await driver.sleep(700);

    ////

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[4]/span/span"
        )
      )
      .click();
    const goodsInput8 = await driver.findElement(By.id("Unit1Id"));
    await goodsInput8.click();
    await goodsInput8.sendKeys("عدد");
    await driver.sleep(300);
    //
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[5]/div"
        )
      )
      .click();
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[5]/div/div/input"
        )
      )
      .sendKeys("1");
    await driver.sleep(700);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[1]/div/div[2]/div"
        )
      )
      .click();
    await driver.sleep(700);
    //بخش سوم
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[1]/div[1]/div[1]/button"
        )
      )
      .click();
    await driver.sleep(300);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[1]/div/div[1]/div/div[1]"
        )
      )
      .click();
    await driver.sleep(300);
    await driver
      .findElement(By.xpath("/html/body/div[4]/div/ul/li[4]"))
      .click();
    await driver.sleep(700);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[1]/form/div[2]/div/div[2]/div/div/button"
        )
      )
      .click();
    await driver.sleep(700);
    //////
    const todayButton2 = await driver.wait(
      until.elementLocated(
        By.xpath("//button[normalize-space(text())='انتخاب امروز']")
      ),
      5000
    );
    await driver.wait(until.elementIsVisible(todayButton2), 5000);

    await driver.executeScript(
      "arguments[0].scrollIntoView(true);",
      todayButton2
    );
    await driver.sleep(200);

    await driver.executeScript("arguments[0].click();", todayButton2);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[1]/form/div[4]/div/div[2]/div/div/div/div/input"
        )
      )
      .sendKeys("1");
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[1]/form/div[5]/div/div[2]/div/div/div/div[1]/div/span/span[1]/input"
        )
      )
      .click();
    await driver.sleep(100);
    const options3 = await driver.findElements(
      By.css(".ant-select-item-option")
    );
    if (options3.length > 0) {
      await driver.executeScript(
        "arguments[0].scrollIntoView(true);",
        options3[0]
      );
      await options3[0].click();
    }
    await driver.sleep(300);
    const goodsInput11 = await driver.findElement(
      By.id("sellWithCustomerForm_SaleTypeId")
    );
    await goodsInput11.click();
    await goodsInput11.sendKeys("فروش نقدی");
    await driver.sleep(300);
    await goodsInput11.sendKeys(Key.ENTER);
    await driver.sleep(300);
    const goodsInput12 = await driver.findElement(
      By.id("sellWithCustomerForm_PayOfTypeId")
    );
    await goodsInput12.click();
    await goodsInput12.sendKeys("نقدی");
    await driver.sleep(300);
    await goodsInput12.sendKeys(Key.ENTER);
    await driver.sleep(300);
    ///
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[3]/span/span"
        )
      )
      .click();
    await driver.sleep(100);

    await driver.sleep(1000);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[3]/div/div[1]/div/span/span[1]"
        )
      )
      .click();
    await driver.sleep(100);
    // بهترین روش
    const goodsInput10 = await driver.findElement(By.id("GoodsId"));
    await goodsInput10.click();
    await goodsInput10.sendKeys("new goods");
    await driver.sleep(300);

    const feeInput2 = await driver.findElement(
      By.id("CommissionContractNumber")
    );
    await feeInput2.click();
    await feeInput2.sendKeys(Key.CONTROL + "a");
    await feeInput2.sendKeys("100");
    await feeInput2.sendKeys(Key.ENTER);
    await driver.sleep(700);
    const goodsInput14 = await driver.findElement(By.id("Unit1Id"));
    await goodsInput14.click();
    await goodsInput14.sendKeys("عدد");
    await driver.sleep(300);
    const goodsInput13 = await driver.findElement(By.id("Quantity1"));
    // await goodsInput13.click();
    await goodsInput13.sendKeys("1");
    await goodsInput13.sendKeys(Key.ENTER);
    await driver.sleep(300);

    const feeInput14 = await driver.findElement(By.id("Fee"));
    await feeInput14.click();
    await feeInput14.sendKeys(Key.CONTROL + "a");
    await feeInput14.sendKeys("100");
    await driver.sleep(700);

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[1]/div/div[2]/div"
        )
      )
      .click();
    await driver.sleep(300);
    //بخش چهارم
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[1]/div[1]/div[1]/button"
        )
      )
      .click();
    await driver.sleep(300);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[1]/div/div[1]/div/div[1]"
        )
      )
      .click();
    await driver.sleep(300);
    await driver
      .findElement(By.xpath("/html/body/div[4]/div/ul/li[5]"))
      .click();
    await driver.sleep(700);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[1]/form/div[2]/div/div[2]/div/div/button"
        )
      )
      .click();
    await driver.sleep(700);
    //////
    const todayButton3 = await driver.wait(
      until.elementLocated(
        By.xpath("//button[normalize-space(text())='انتخاب امروز']")
      ),
      5000
    );
    await driver.wait(until.elementIsVisible(todayButton3), 5000);

    await driver.executeScript(
      "arguments[0].scrollIntoView(true);",
      todayButton3
    );
    await driver.sleep(200);

    await driver.executeScript("arguments[0].click();", todayButton3);
    await driver.sleep(300);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[1]/form/div[4]/div/div[2]/div/div/div/div[1]/div/span/span[1]/input"
        )
      )
      .click();
    await driver.sleep(100);
    const options4 = await driver.findElements(
      By.css(".ant-select-item-option")
    );
    if (options4.length > 0) {
      await driver.executeScript(
        "arguments[0].scrollIntoView(true);",
        options4[0]
      );
      await options4[0].click();
    }
    await driver.sleep(300);

    const goodsInput17 = await driver.findElement(
      By.id("sellWithCustomerForm_SaleTypeId")
    );
    await goodsInput17.click();
    await goodsInput17.sendKeys("فروش نقدی");
    await driver.sleep(300);
    await goodsInput17.sendKeys(Key.ENTER);
    await driver.sleep(300);

    const goodsInput9 = await driver.findElement(
      By.id("sellWithCustomerForm_PayOfTypeId")
    );
    await goodsInput9.click();
    await goodsInput9.sendKeys("نقدی");
    await driver.sleep(300);
    await goodsInput9.sendKeys(Key.ENTER);
    await driver.sleep(300);
    ///
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[3]/span/span"
        )
      )
      .click();
    await driver.sleep(100);

    await driver.sleep(1000);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[3]/div/div[1]/div/span/span[1]"
        )
      )
      .click();
    await driver.sleep(100);
    // بهترین روش
    const goodsInput16 = await driver.findElement(By.id("GoodsId"));
    await goodsInput16.click();
    await goodsInput16.sendKeys("new goods");
    await driver.sleep(300);
    // بعد از Enter در مودال قبلی، صبر کن تا مودال جدید بالا بیاد

    // منتظر شو تا فیلد جدید واقعاً وجود داشته باشه
    const feeInput3 = await driver.findElement(By.id("Fee"));
    await feeInput3.click();
    await feeInput3.sendKeys(Key.CONTROL + "a");
    await feeInput3.sendKeys("100");
    await driver.sleep(700);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[4]/span/span"
        )
      )
      .click();
    const goodsInput15 = await driver.findElement(By.id("Unit1Id"));
    await goodsInput15.click();
    await goodsInput15.sendKeys("عدد");
    await driver.sleep(300);
    //
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[5]/div"
        )
      )
      .click();
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[5]/div/div/input"
        )
      )
      .sendKeys("1");
    await driver.sleep(1000);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[1]/div/div[2]/div"
        )
      )
      .click();
    await driver.sleep(700);

    //بخش پنجم
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[1]/div[1]/div[1]/button"
        )
      )
      .click();
    await driver.sleep(300);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[1]/div/div[1]/div/div[1]"
        )
      )
      .click();
    await driver.sleep(300);
    await driver
      .findElement(By.xpath("/html/body/div[4]/div/ul/li[7]"))
      .click();
    await driver.sleep(700);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[1]/form/div[2]/div/div[2]/div/div/button"
        )
      )
      .click();
    await driver.sleep(700);
    //////
    const todayButton4 = await driver.wait(
      until.elementLocated(
        By.xpath("//button[normalize-space(text())='انتخاب امروز']")
      ),
      5000
    );
    await driver.wait(until.elementIsVisible(todayButton4), 5000);

    await driver.executeScript(
      "arguments[0].scrollIntoView(true);",
      todayButton4
    );
    await driver.sleep(200);

    await driver.executeScript("arguments[0].click();", todayButton4);
    await driver.sleep(300);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[1]/form/div[4]/div/div[2]/div/div/div/div[1]/div/span/span[1]/input"
        )
      )
      .click();
    await driver.sleep(100);
    const options5 = await driver.findElements(
      By.css(".ant-select-item-option")
    );
    if (options5.length > 0) {
      await driver.executeScript(
        "arguments[0].scrollIntoView(true);",
        options5[0]
      );
      await options5[0].click();
    }
    await driver.sleep(300);

    const goodsInput21 = await driver.findElement(
      By.id("sellWithCustomerForm_SaleTypeId")
    );
    await goodsInput21.click();
    await goodsInput21.sendKeys("فروش نقدی");
    await driver.sleep(300);
    await goodsInput21.sendKeys(Key.ENTER);
    await driver.sleep(300);

    const goodsInput20 = await driver.findElement(
      By.id("sellWithCustomerForm_PayOfTypeId")
    );
    await goodsInput20.click();
    await goodsInput20.sendKeys("نقدی");
    await driver.sleep(300);
    await goodsInput20.sendKeys(Key.ENTER);
    await driver.sleep(300);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[1]/form/div[7]/div/div[2]/div/div/button/div"
        )
      )
      .click();
    await driver.sleep(300);
    ///اوراق
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[3]/span/span"
        )
      )
      .click();
    await driver.sleep(100);

    await driver.sleep(1000);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[3]/div/div[1]/div/span/span[1]"
        )
      )
      .click();
    await driver.sleep(100);
    // بهترین روش
    const goodsInput19 = await driver.findElement(By.id("GoodsId"));
    await goodsInput19.click();
    await goodsInput19.sendKeys("new goods");
    await driver.sleep(300);
    // بعد از Enter در مودال قبلی، صبر کن تا مودال جدید بالا بیاد

    // منتظر شو تا فیلد جدید واقعاً وجود داشته باشه
    const feeInput4 = await driver.findElement(By.id("Fee"));
    await feeInput4.click();
    await feeInput4.sendKeys(Key.CONTROL + "a");
    await feeInput4.sendKeys("100");
    await driver.sleep(700);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[4]/span/span"
        )
      )
      .click();
    const goodsInput18 = await driver.findElement(By.id("Unit1Id"));
    await goodsInput18.click();
    await goodsInput18.sendKeys("عدد");
    await driver.sleep(300);
    //
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[5]/div"
        )
      )
      .click();
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[5]/div/div/input"
        )
      )
      .sendKeys("1");
    await driver.sleep(1000);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[1]/div/div[2]/div"
        )
      )
      .click();
    await driver.sleep(700);

    //بخش ششم
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[1]/div[1]/div[1]/button"
        )
      )
      .click();
    await driver.sleep(300);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[1]/div/div[1]/div/div[1]"
        )
      )
      .click();
    await driver.sleep(300);
    await driver
      .findElement(By.xpath("/html/body/div[4]/div/ul/li[8]"))
      .click();
    await driver.sleep(700);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[1]/form/div[2]/div/div[2]/div/div/button"
        )
      )
      .click();
    await driver.sleep(700);
    const todayButton5 = await driver.wait(
      until.elementLocated(
        By.xpath("//button[normalize-space(text())='انتخاب امروز']")
      ),
      5000
    );
    await driver.wait(until.elementIsVisible(todayButton5), 5000);

    await driver.executeScript(
      "arguments[0].scrollIntoView(true);",
      todayButton5
    );
    await driver.sleep(200);

    await driver.executeScript("arguments[0].click();", todayButton5);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[1]/form/div[4]/div/div[2]/div/div/div/div[1]/div/span/span[1]/input"
        )
      )
      .click();
    await driver.sleep(100);
    const options6 = await driver.findElements(
      By.css(".ant-select-item-option")
    );
    if (options6.length > 0) {
      await driver.executeScript(
        "arguments[0].scrollIntoView(true);",
        options6[0]
      );
      await options6[0].click();
    }
    await driver.sleep(300);
    const goodsInput25 = await driver.findElement(
      By.id("sellWithCustomerForm_SaleTypeId")
    );
    await goodsInput25.click();
    await goodsInput25.sendKeys("فروش نقدی");
    await driver.sleep(300);
    await goodsInput25.sendKeys(Key.ENTER);
    await driver.sleep(300);

    const goodsInput24 = await driver.findElement(
      By.id("sellWithCustomerForm_PayOfTypeId")
    );
    await goodsInput24.click();
    await goodsInput24.sendKeys("نقدی");
    await driver.sleep(300);
    await goodsInput24.sendKeys(Key.ENTER);
    await driver.sleep(300);

    ///اقلام فاکتور فروش
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[3]/span/span"
        )
      )
      .click();
    await driver.sleep(100);

    await driver.sleep(1000);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[3]/div/div[1]/div/span/span[1]"
        )
      )
      .click();
    await driver.sleep(100);
    // بهترین روش
    const goodsInput23 = await driver.findElement(By.id("GoodsId"));
    await goodsInput23.click();
    await goodsInput23.sendKeys("new goods");
    await driver.sleep(300);
    // بعد از Enter در مودال قبلی، صبر کن تا مودال جدید بالا بیاد

    // منتظر شو تا فیلد جدید واقعاً وجود داشته باشه
    const feeInput5 = await driver.findElement(By.id("CurrencyToRialRate"));
    await feeInput5.click();
    await feeInput5.sendKeys(Key.CONTROL + "a");
    await feeInput5.sendKeys("100");
    await feeInput5.sendKeys(Key.ENTER);
    await driver.sleep(300);

    const feeInput7 = await driver.findElement(By.id("Fee"));
    await feeInput7.click();
    await feeInput7.sendKeys(Key.CONTROL + "a");
    await feeInput7.sendKeys("100");
    await driver.sleep(700);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[4]/span/span"
        )
      )
      .click();
    const goodsInput22 = await driver.findElement(By.id("Unit1Id"));
    await goodsInput22.click();
    await goodsInput22.sendKeys("عدد");
    await driver.sleep(300);
    //
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[5]/div"
        )
      )
      .click();
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[5]/div/div/input"
        )
      )
      .sendKeys("1");
    await driver.sleep(1000);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[1]/div/div[2]/div"
        )
      )
      .click();
    await driver.sleep(700);

    //بخش هفتم
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[1]/div[1]/div[1]/button"
        )
      )
      .click();
    await driver.sleep(300);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[1]/div/div[1]/div/div[1]"
        )
      )
      .click();
    await driver.sleep(300);
    await driver
      .findElement(By.xpath("/html/body/div[4]/div/ul/li[9]"))
      .click();
    await driver.sleep(700);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[1]/form/div[2]/div/div[2]/div/div/button"
        )
      )
      .click();
    await driver.sleep(700);
    //////
    const todayButton6 = await driver.wait(
      until.elementLocated(
        By.xpath("//button[normalize-space(text())='انتخاب امروز']")
      ),
      5000
    );
    await driver.wait(until.elementIsVisible(todayButton6), 5000);

    await driver.executeScript(
      "arguments[0].scrollIntoView(true);",
      todayButton6
    );
    await driver.sleep(200);

    await driver.executeScript("arguments[0].click();", todayButton6);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[1]/form/div[4]/div/div[2]/div/div/div/div[1]/div/span/span[1]/input"
        )
      )
      .click();
    await driver.sleep(100);
    const options7 = await driver.findElements(
      By.css(".ant-select-item-option")
    );
    if (options7.length > 0) {
      await driver.executeScript(
        "arguments[0].scrollIntoView(true);",
        options7[0]
      );
      await options7[0].click();
    }
    await driver.sleep(300);
    const goodsInput26 = await driver.findElement(
      By.id("sellWithCustomerForm_SaleTypeId")
    );
    await goodsInput26.click();
    await goodsInput26.sendKeys("فروش نقدی");
    await driver.sleep(300);
    await goodsInput26.sendKeys(Key.ENTER);
    await driver.sleep(300);
    const goodsInput27 = await driver.findElement(
      By.id("sellWithCustomerForm_PayOfTypeId")
    );
    await goodsInput27.click();
    await goodsInput27.sendKeys("نقدی");
    await driver.sleep(300);
    await goodsInput27.sendKeys(Key.ENTER);
    await driver.sleep(300);
    ///
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[3]/span/span"
        )
      )
      .click();
    await driver.sleep(100);

    await driver.sleep(1000);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[3]/div/div[1]/div/span/span[1]"
        )
      )
      .click();
    await driver.sleep(100);
    // بهترین روش
    const goodsInput28 = await driver.findElement(By.id("GoodsId"));
    await goodsInput28.click();
    await goodsInput28.sendKeys("new goods");
    await driver.sleep(300);

    const feeInput6 = await driver.findElement(By.id("Fee"));
    await feeInput6.click();
    await feeInput6.sendKeys(Key.CONTROL + "a");
    await feeInput6.sendKeys("100");
    await driver.sleep(700);

    ////

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[4]/span/span"
        )
      )
      .click();
    const goodsInput29 = await driver.findElement(By.id("Unit1Id"));
    await goodsInput29.click();
    await goodsInput29.sendKeys("عدد");
    await driver.sleep(300);
    //
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[5]/div"
        )
      )
      .click();
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[5]/div/div/input"
        )
      )
      .sendKeys("1");
    await driver.sleep(700);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[1]/form/div[7]/div/div[2]/div/div/input"
        )
      )
      .sendKeys("1");
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[1]/div/div[2]/div"
        )
      )
      .click();
    await driver.sleep(700);
    //خدمات بیمه ای
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[1]/div[1]/div[1]/button"
        )
      )
      .click();
    await driver.sleep(300);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[1]/div/div[1]/div/div[1]"
        )
      )
      .click();
    await driver.sleep(300);
    await driver
      .findElement(By.xpath("/html/body/div[4]/div/ul/li[10]"))
      .click();
    await driver.sleep(700);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[1]/form/div[2]/div/div[2]/div/div/button"
        )
      )
      .click();
    await driver.sleep(700);
    //////
    const todayButton7 = await driver.wait(
      until.elementLocated(
        By.xpath("//button[normalize-space(text())='انتخاب امروز']")
      ),
      5000
    );
    await driver.wait(until.elementIsVisible(todayButton7), 5000);

    await driver.executeScript(
      "arguments[0].scrollIntoView(true);",
      todayButton7
    );
    await driver.sleep(200);

    await driver.executeScript("arguments[0].click();", todayButton7);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[1]/form/div[4]/div/div[2]/div/div/div/div[1]/div/span/span[1]/input"
        )
      )
      .click();
    await driver.sleep(100);
    const options8 = await driver.findElements(
      By.css(".ant-select-item-option")
    );
    if (options8.length > 0) {
      await driver.executeScript(
        "arguments[0].scrollIntoView(true);",
        options8[0]
      );
      await options8[0].click();
    }
    await driver.sleep(300);
    const goodsInput33 = await driver.findElement(
      By.id("sellWithCustomerForm_SaleTypeId")
    );
    await goodsInput33.click();
    await goodsInput33.sendKeys("فروش نقدی");
    await driver.sleep(300);
    await goodsInput33.sendKeys(Key.ENTER);
    await driver.sleep(300);
    const goodsInput32 = await driver.findElement(
      By.id("sellWithCustomerForm_PayOfTypeId")
    );
    await goodsInput32.click();
    await goodsInput32.sendKeys("نقدی");
    await driver.sleep(300);
    await goodsInput32.sendKeys(Key.ENTER);
    await driver.sleep(300);
    ///
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[3]/span/span"
        )
      )
      .click();
    await driver.sleep(100);

    await driver.sleep(1000);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[3]/div/div[1]/div/span/span[1]"
        )
      )
      .click();
    await driver.sleep(100);
    // بهترین روش
    const goodsInput31 = await driver.findElement(By.id("GoodsId"));
    await goodsInput31.click();
    await goodsInput31.sendKeys("new goods");
    await driver.sleep(300);

    const feeInput8 = await driver.findElement(By.id("Fee"));
    await feeInput8.click();
    await feeInput8.sendKeys(Key.CONTROL + "a");
    await feeInput8.sendKeys("100");
    await driver.sleep(700);

    ////

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[4]/span/span"
        )
      )
      .click();
    const goodsInput30 = await driver.findElement(By.id("Unit1Id"));
    await goodsInput30.click();
    await goodsInput30.sendKeys("عدد");
    await driver.sleep(300);
    //
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[5]/div"
        )
      )
      .click();
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[5]/div/div/input"
        )
      )
      .sendKeys("1");
    await driver.sleep(700);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[1]/form/div[7]/div/div[2]/div/div/input"
        )
      )
      .sendKeys("1");
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[1]/div/div[2]/div"
        )
      )
      .click();
    await driver.sleep(700);
    //بلیط هواپیما
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[1]/div[1]/div[1]/button"
        )
      )
      .click();
    await driver.sleep(300);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[1]/div/div[1]/div/div[1]"
        )
      )
      .click();
    await driver.sleep(300);
    await driver
      .findElement(By.xpath("/html/body/div[4]/div/ul/li[12]"))
      .click();
    await driver.sleep(700);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[1]/form/div[2]/div/div[2]/div/div/button"
        )
      )
      .click();
    await driver.sleep(700);
    //////
    const todayButton8 = await driver.wait(
      until.elementLocated(
        By.xpath("//button[normalize-space(text())='انتخاب امروز']")
      ),
      5000
    );
    await driver.wait(until.elementIsVisible(todayButton8), 5000);

    await driver.executeScript(
      "arguments[0].scrollIntoView(true);",
      todayButton8
    );
    await driver.sleep(200);

    await driver.executeScript("arguments[0].click();", todayButton8);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[1]/form/div[4]/div/div[2]/div/div/div/div[1]/div/span/span[1]/input"
        )
      )
      .click();
    await driver.sleep(100);
    const options9 = await driver.findElements(
      By.css(".ant-select-item-option")
    );
    if (options9.length > 0) {
      await driver.executeScript(
        "arguments[0].scrollIntoView(true);",
        options9[0]
      );
      await options9[0].click();
    }
    await driver.sleep(300);
    const goodsInput37 = await driver.findElement(
      By.id("sellWithCustomerForm_SaleTypeId")
    );
    await goodsInput37.click();
    await goodsInput37.sendKeys("فروش نقدی");
    await driver.sleep(300);
    await goodsInput37.sendKeys(Key.ENTER);
    await driver.sleep(300);
    const goodsInput36 = await driver.findElement(
      By.id("sellWithCustomerForm_PayOfTypeId")
    );
    await goodsInput36.click();
    await goodsInput36.sendKeys("نقدی");
    await driver.sleep(300);
    await goodsInput36.sendKeys(Key.ENTER);
    await driver.sleep(300);
    ///
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[3]/span/span"
        )
      )
      .click();
    await driver.sleep(100);

    await driver.sleep(1000);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[3]/div/div[1]/div/span/span[1]"
        )
      )
      .click();
    await driver.sleep(100);
    // بهترین روش
    const goodsInput35 = await driver.findElement(By.id("GoodsId"));
    await goodsInput35.click();
    await goodsInput35.sendKeys("new goods");
    await driver.sleep(300);

    const feeInput9 = await driver.findElement(By.id("Fee"));
    await feeInput9.click();
    await feeInput9.sendKeys(Key.CONTROL + "a");
    await feeInput9.sendKeys("100");
    await driver.sleep(700);

    ////

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[4]/span/span"
        )
      )
      .click();
    const goodsInput34 = await driver.findElement(By.id("Unit1Id"));
    await goodsInput34.click();
    await goodsInput34.sendKeys("عدد");
    await driver.sleep(300);
    //
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[5]/div"
        )
      )
      .click();
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[5]/div/div/input"
        )
      )
      .sendKeys("1");
    await driver.sleep(700);
    await driver.findElement(By.id("sellWithCustomerForm_FlightType")).click();

    const options10 = await driver.findElements(
      By.id("sellWithCustomerForm_FlightType")
    );
    if (options10.length > 0) {
      await driver.executeScript(
        "arguments[0].scrollIntoView(true);",
        options10[0]
      );
      await options10[0].click();
    }
    await driver.sleep(300);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[1]/div/div[2]/div"
        )
      )
      .click();
    await driver.sleep(700);
    //بارنامه
    // await driver.navigate().refresh();
    const activeBtnXpath =
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div/div/div/div/div/table/tbody/tr[1]/td[8]/div/span[4]";
    await waitForElement(driver, activeBtnXpath);
    await driver.findElement(By.xpath(activeBtnXpath)).click();
    await driver.sleep(100);
    const deleteBtnXpath =
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div/div/div/div/div/table/tbody/tr[1]/td[8]/div/span[2]";
    await waitForElement(driver, deleteBtnXpath);
    await driver.findElement(By.xpath(deleteBtnXpath)).click();
    await driver.sleep(100);
    const saveBtnXpath =
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[3]/div[2]/div/div[1]/div/div/div/div[2]/div/div/button[2]";
    await waitForElement(driver, saveBtnXpath);
    await driver.findElement(By.xpath(saveBtnXpath)).click();
    await driver.sleep(700);

    const bodyText = await driver.findElement(By.css("body")).getText();
    if (bodyText.includes("آرین")) {
      console.log(`${colors.green}ok Aryan${colors.reset}`);
    } else {
      console.log(`${colors.red}not ok Aryan${colors.reset}`);
    }
  } catch (err) {
    console.error("❌ خطا:", err);
    // گرفتن اسکرین‌شات برای دیباگ
    try {
      const screenshot = await driver.takeScreenshot();
      fs.writeFileSync("customerGroup-screenshot.png", screenshot, "base64");
      console.log("اسکرین‌شات از خطا در customerGroup-screenshot.png ذخیره شد");
    } catch (screenshotError) {
      console.log("خطا در گرفتن اسکرین‌شات:", screenshotError);
    }
  } finally {
    await driver.quit();
  }
}

salesInvoiceList();
module.exports = salesInvoiceList;
