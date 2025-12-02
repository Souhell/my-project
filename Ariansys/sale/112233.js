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
  await driver.executeScript("arguments[0].scrollIntoView(true);", element);
  await element.click();
}

// انتخاب از dropdown های Ant Design
async function selectFromDropdown(
  driver,
  dropdownXpath,
  optionText = null,
  optionIndex = null
) {
  try {
    // کلیک برای باز کردن dropdown (روی selector، نه input)
    const dropdown = await waitForElement(driver, dropdownXpath);
    await driver.wait(until.elementIsVisible(dropdown), 5000);
    await driver.wait(until.elementIsEnabled(dropdown), 5000);
    await driver.executeScript("arguments[0].scrollIntoView(true);", dropdown);
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
          await driver.executeScript(
            "arguments[0].scrollIntoView(true);",
            option
          );
          await option.click();
          return true;
        }
      }
    } else if (optionIndex !== null && options[optionIndex]) {
      const opt = options[optionIndex];
      await driver.executeScript("arguments[0].scrollIntoView(true);", opt);
      await opt.click();
      return true;
    } else if (options.length > 0) {
      // انتخاب اولین گزینه به عنوان fallback
      const opt = options[0];
      await driver.executeScript("arguments[0].scrollIntoView(true);", opt);
      await opt.click();
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
      "//div[@role='menuitem' and .//span[text()='فروش']]",
      "//div[@role='menuitem' and .//span[text()='عملیات']]",
      "//li[@role='menuitem' and .//span[text()='فاکتور فروش']]",
      // "//button[.//div[text()='افزودن مورد جدید']]",
    ];

    for (const xpath of steps) {
      await driver.findElement(By.xpath(xpath)).click();
      await driver.sleep(700);
    }

    const editBtnXpath = "//span[@aria-label='ویرایش']";
    await waitForElement(driver, editBtnXpath);
    await driver.findElement(By.xpath(editBtnXpath)).click();
    await driver.sleep(100);

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[1]/form/div[2]/div/div[2]/div/div/button"
        )
      )
      .click();
    await driver.sleep(700);

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

    //////////// مشتری (CustomerId) - کلیک روی selector به جای input
    const customerSelectorXpath =
      "//input[@id='sellWithCustomerForm_CustomerId']/ancestor::div[contains(@class,'ant-select')]/div[contains(@class,'ant-select-selector')]";

    // انتخاب اولین گزینه مشتری (یا هر چیزی که dropdown برگردونه)
    await selectFromDropdown(driver, customerSelectorXpath, null, 0);
    await driver.sleep(300);

    ////////// نوع فروش (SaleTypeId) - استفاده از selector
    const saleTypeSelectorXpath =
      "//input[@id='sellWithCustomerForm_SaleTypeId']/ancestor::div[contains(@class,'ant-select')]/div[contains(@class,'ant-select-selector')]";

    // انتخاب گزینه با متن «فروش نقدی»
    await selectFromDropdown(driver, saleTypeSelectorXpath, "فروش نقدی", null);
    await driver.sleep(300);

    ////////// روش تسویه (PayOfTypeId) - استفاده از selector
    const payTypeSelectorXpath =
      "//input[@id='sellWithCustomerForm_PayOfTypeId']/ancestor::div[contains(@class,'ant-select')]/div[contains(@class,'ant-select-selector')]";

    // انتخاب گزینه با متن «نقدی»
    await selectFromDropdown(driver, payTypeSelectorXpath, "نقدی", null);
    await driver.sleep(300);

    ///اقلام فاکتور
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

    const goodsInput35 = await driver.findElement(By.id("GoodsId"));
    await goodsInput35.click();
    await goodsInput35.sendKeys("new goods");
    await driver.sleep(300);

    const feeInput9 = await driver.findElement(By.id("Fee"));
    await feeInput9.click();
    await feeInput9.sendKeys(Key.CONTROL + "a");
    await feeInput9.sendKeys("100");
    await driver.sleep(700);

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
    await driver.sleep(2000);

    //تسویه
    const peymentBtnXpath = "//span[@aria-label='تسویه فاکتور']";
    await waitForElement(driver, peymentBtnXpath);
    await driver.findElement(By.xpath(peymentBtnXpath)).click();
    await driver.sleep(100);

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[3]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div/div[3]/div/div[1]/div/div[2]/div/div/button/div/div/div"
        )
      )
      .click();
    await driver.sleep(700);

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[3]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div/div[3]/div/div[2]/div/div[2]/div/div/div/div/input"
        )
      )
      .sendKeys("100");
    await driver.sleep(700);

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[3]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div/div[3]/div/div[4]/div/div/div/div/div/button"
        )
      )
      .click();
    await driver.sleep(300);

    //واریز به بانک
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[3]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div/div[2]/div[2]"
        )
      )
      .click();
    await driver.sleep(300);

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[3]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div/div[3]/div/div[2]/div/div[2]/div/div/div/div/input"
        )
      )
      .sendKeys("100");
    await driver.sleep(300);

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[3]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div/div[3]/div/div[1]/div/div[2]/div/div/button/div/div/div"
        )
      )
      .click();
    await driver.sleep(300);

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[3]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div/div[3]/div/div[3]/div/div[2]/div/div/input"
        )
      )
      .sendKeys("100");

    await selectFromDropdown(
      driver,
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[3]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div/div[3]/div/div[4]/div/div[2]/div/div/div/div[1]",
      null,
      1
    );
    await driver.sleep(300);

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[3]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div/div[3]/div/div[6]/div/div/div/div/div/button"
        )
      )
      .click();
    await driver.sleep(300);

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[3]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div/div[2]/div[3]"
        )
      )
      .click();

    //چک
    await driver.sleep(300);

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[3]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div/div[3]/div/div[2]/div/div[2]/div/div/div/div/input"
        )
      )
      .sendKeys("100");
    await driver.sleep(300);

    const dateButton = await driver.wait(
      until.elementLocated(
        By.xpath("//label[text()='تاریخ چک']/following::button[1]")
      ),
      10000
    );

    await dateButton.click();
    await driver.sleep(300);

    // 2. صبر برای ساخته‌شدن input های سال/ماه/روز
    const year = await driver.wait(
      until.elementLocated(By.xpath("//input[@name='year']")),
      10000
    );
    const month = await driver.findElement(By.xpath("//input[@name='month']"));
    const day = await driver.findElement(By.xpath("//input[@name='day']"));

    // 3. مقداردهی
    await year.sendKeys(Key.CONTROL, "a", Key.DELETE);
    await year.sendKeys("1405");

    await month.sendKeys(Key.CONTROL, "a", Key.DELETE);
    await month.sendKeys("08");

    await day.sendKeys(Key.CONTROL, "a", Key.DELETE);
    await day.sendKeys("26");
    await driver.sleep(300);

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[3]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div/div[3]/div/div[3]/div/div[2]/div/div/input"
        )
      )
      .sendKeys("1111111111111111");
    await driver.sleep(300);

    await selectFromDropdown(
      driver,
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[3]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div/div[3]/div/div[4]/div/div[2]/div/div/div/div[1]",
      null,
      1
    );
    await driver.sleep(300);

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[3]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div/div[3]/div/div[5]/div/div[2]/div/div/input"
        )
      )
      .sendKeys("1");
    await driver.sleep(300);

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[3]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div/div[3]/div/div[6]/div/div/div/div/div/button"
        )
      )
      .click();
    await driver.sleep(300);

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[3]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div/div[1]/div/div/div[2]/button"
        )
      )
      .click();
    await driver.sleep(300);

    //دیلیت
    const activeBtnXpath = "(//table//tr[1]//span[button[@role='switch']])[1]";
    await waitForElement(driver, activeBtnXpath);
    await driver.findElement(By.xpath(activeBtnXpath)).click();
    await driver.sleep(300);

    const deleteBtnXpath = "//span[@aria-label='حذف']";
    await waitForElement(driver, deleteBtnXpath);
    await driver.findElement(By.xpath(deleteBtnXpath)).click();
    await driver.sleep(300);

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
