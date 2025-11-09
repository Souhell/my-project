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

// اضافه کردن تابع waitForElement
async function waitForElement(driver, xpath, timeout = 10000) {
  return await driver.wait(until.elementLocated(By.xpath(xpath)), timeout);
}
async function safeClick(driver, xpath, timeout = 10000) {
  const element = await waitForElement(driver, xpath, timeout);
  await driver.wait(until.elementIsVisible(element), timeout);
  await driver.wait(until.elementIsEnabled(element), timeout);
  await element.click();
}
async function selectFromDropdown(
  driver,
  dropdownXpath,
  optionText = null,
  optionIndex = null
) {
  try {
    // کلیک برای باز کردن dropdown
    const dropdown = await waitForElement(driver, dropdownXpath);
    await driver.wait(until.elementIsEnabled(dropdown), 5000);
    await dropdown.click();

    // منتظر ماندن برای بارگذاری options
    await driver.sleep(1500);

    // پیدا کردن تمام options
    const options = await driver.findElements(
      By.css(".ant-select-item-option")
    );

    if (options.length === 0) {
      console.log("هیچ گزینه‌ای در dropdown پیدا نشد");
      return false;
    }

    console.log(`تعداد گزینه‌های پیدا شده: ${options.length}`);

    // انتخاب گزینه بر اساس متن یا اندیس
    if (optionText) {
      for (let option of options) {
        const text = await option.getText();
        if (text.includes(optionText)) {
          await option.click();
          return true;
        }
      }
    } else if (optionIndex !== null && options[optionIndex]) {
      await options[optionIndex].click();
      return true;
    } else if (options.length > 0) {
      // انتخاب اولین گزینه به عنوان fallback
      await options[0].click();
      return true;
    }

    return false;
  } catch (error) {
    console.log("خطا در انتخاب از dropdown:", error.message);
    return false;
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

    for (const xpath of steps) {
      await driver.findElement(By.xpath(xpath)).click();
      await driver.sleep(300);
    }
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
    await driver.sleep(700);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[1]/div/div[2]/div"
        )
      )
      .click();
    await driver.sleep(700);

    //بخش دوم
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
    await driver.sleep(300);
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
    await driver.sleep(300);
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
    // await driver.navigate().refresh();
    const activeBtnXpath =
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div[1]/div/div/div/div/div/div/table/tbody/tr[1]/td[3]/div/span[3]";
    await waitForElement(driver, activeBtnXpath);
    await driver.findElement(By.xpath(activeBtnXpath)).click();
    await driver.sleep(100);
    const deleteBtnXpath =
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div[1]/div/div/div/div/div/div/table/tbody/tr[1]/td[3]/div/span[2]";
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
