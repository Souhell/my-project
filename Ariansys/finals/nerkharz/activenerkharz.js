const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const fs = require("fs");
const path = require("path");
const customDriver = require("../../customerDriver");

const colors = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  reset: "\x1b[0m",
};

async function activenerkharz() {
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
    // اجرای گام‌ها (قابل تغییر/تکمیل بر اساس نیاز)
    const steps = [
      "/html/body/div[3]/div/div[2]/div[1]/div[2]/div/div[3]/div/ul/li[1]",
      "/html/body/div[3]/div/div[2]/div[1]/div[2]/div/div[3]/div/ul/li[1]/ul/li[1]",
      "/html/body/div[3]/div/div[2]/div[1]/div[2]/div/div[3]/div/ul/li[1]/ul/li[1]/ul/li[8]",
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/div[1]/div/div/div/div/div/div/table/tbody/tr[1]/td[6]/div/span[3]",
    //   "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[3]/div[2]/div/div[1]/div/div/div/div[2]/div/div/button[2]",
     ];

    for (const xpath of steps) {
      try {
        console.log("در حال انتظار برای:", xpath);
        await driver.wait(until.elementLocated(By.xpath(xpath)), 10000);
        await driver.findElement(By.xpath(xpath)).click();
        await driver.sleep(100);
      } catch (err) {
        console.error("خطا در گام:", xpath, err);
        throw err; // باعث می‌شود finally اجرا شود و مرورگر بسته شود
      }
    }

    const bodyText = await driver.findElement(By.css("body")).getText();
    if (bodyText.includes("آرین")) {
      console.log(`${colors.green}✅ ok Aryan ${colors.reset}`);
    } else {
      console.log(`${colors.red}❌ not ok Aryan ${colors.reset}`);
    }
  } catch (err) {
    console.error("❌ خطا:", err);
  } finally {
    await driver.quit();
  }
}
// activenerkharz();
module.exports = activenerkharz;
