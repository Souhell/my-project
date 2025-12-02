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
      "//button[.//div[text()='افزودن مورد جدید']]",
    ];
    for (const xpath of steps) {
      await driver.findElement(By.xpath(xpath)).click();
      await driver.sleep(500); // افزایش زمان انتظار
    }
    // فروش با اطلاعات مشتری
    await driver.sleep(2000);
    await driver
      .findElement(
        By.xpath("//button[contains(.,'انتخاب امروز') or contains(.,'امروز')]")
      )
      .click();
    await driver.sleep(1000);

    // انتخاب نوع فروش
    const saleTypeInput = await driver.findElement(
      By.id("sellWithCustomerForm_SaleTypeId")
    );
    await saleTypeInput.click();
    await saleTypeInput.sendKeys("فروش نقدی");
    await driver.sleep(500);
    await saleTypeInput.sendKeys(Key.ENTER);
    await driver.sleep(500);

    // انتخاب نوع پرداخت
    const payTypeInput = await driver.findElement(
      By.id("sellWithCustomerForm_PayOfTypeId")
    );
    await payTypeInput.click();
    await payTypeInput.sendKeys("نقدی");
    await driver.sleep(500);
    await payTypeInput.sendKeys(Key.ENTER);
    await driver.sleep(500);

    /// اقلام فاکتور فروش - اضافه کردن ردیف‌های متعدد
    console.log("🚀 شروع افزودن ردیف‌های کالا...");

    const totalRows = 15;
    let successfulRows = 0;

    for (let i = 1; i <= totalRows; i++) {
      const success = await interactWithRow(driver, i);
      if (success) {
        successfulRows++;
      }

      // وقفه بین ردیف‌ها
      await driver.sleep(500);
    }

    console.log(
      `${colors.green}🎉 ${successfulRows} از ${totalRows} ردیف با موفقیت اضافه شد${colors.reset}`
    );

    // اعتبارسنجی نهایی
    const bodyText = await driver.findElement(By.css("body")).getText();
    if (bodyText.includes("آرین")) {
      console.log(
        `${colors.green}✅ سیستم آرین با موفقیت تست شد${colors.reset}`
      );
    } else {
      console.log(`${colors.red}❌ مشکل در سیستم آرین${colors.reset}`);
    }
  } catch (err) {
    console.error("❌ خطای کلی:", err);

    // گرفتن اسکرین‌شات برای دیباگ
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const screenshot = await driver.takeScreenshot();
      fs.writeFileSync(`error-${timestamp}.png`, screenshot, "base64");
      console.log(`اسکرین‌شات در error-${timestamp}.png ذخیره شد`);
    } catch (screenshotError) {
      console.log("خطا در گرفتن اسکرین‌شات:", screenshotError);
    }
  } finally {
    await driver.quit();
  }
}

salesInvoiceList();
module.exports = salesInvoiceList;
