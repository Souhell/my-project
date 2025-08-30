const { Builder, By, until,Key, Actions } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const fs = require("fs");
const path = require("path");
const customDriver = require("../../customerDriver");

const colors = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  reset: "\x1b[0m",
};

async function nerkharz() {
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
      "/html/body/div[3]/div/div[2]/div[1]/div[2]/div/div[3]/div/ul/li[1]",
      "/html/body/div[3]/div/div[2]/div[1]/div[2]/div/div[3]/div/ul/li[1]/ul/li[1]",
      "/html/body/div[3]/div/div[2]/div[1]/div[2]/div/div[3]/div/ul/li[1]/ul/li[1]/ul/li[8]",
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[1]/div[1]/div[1]/button",
    ];

    for (const xpath of steps) {
      const el = await driver.wait(until.elementLocated(By.xpath(xpath)), 10000);
      await driver.wait(until.elementIsVisible(el), 10000);
      await driver.wait(until.elementIsEnabled(el), 10000);
      await driver.executeScript("arguments[0].scrollIntoView(true);", el);
      await el.click();
      await driver.sleep(100);
    }
                await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[1]/div/div[2]/div")).click();
                await driver.wait(until.elementLocated(By.css('[title="8249000528"]')), 5000);
                await driver.findElement(By.css('[title="8249000528"]')).click();
                await driver.sleep(1000)
        
                await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[2]/div/div[2]/div")).click();
                await driver.wait(until.elementLocated(By.css('[title="ffdfsfdsdfsd"]')), 5000);
                await driver.findElement(By.css('[title="ffdfsfdsdfsd"]')).click();
                await driver.sleep(1000)
        
                // await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[3]/div/div/div/div/div/label")).click();
                // await driver.sleep(1000);
                await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[3]/div/div[2]")).sendKeys(nationalId);
                await driver.sleep(1000);
                await driver.sleep(1000);
        
        // await driver.findElement(By.css('[title="سایر"]')).click();
        // await driver.sleep(100)
        // await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[3]/div/div[2]/div/div/button")).click();
        // await driver.sleep(100);
        // await driver.findElement(By.xpath("/html/body/div[4]/div[1]/div/div/div[2]/div/div[2]/div[6]/button")).click();
        await driver.sleep(100);
        await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[1]/div/div[2]/div")).click();
        await driver.sleep(100);

        const bodyText = await driver.findElement(By.css("body")).getText();
        if (bodyText.includes("تنظیم شده")) {
            console.log(`${colors.green}✅ ok Aryan${colors.reset}`);
        } else {
            console.log(`${colors.red}❌ not ok Aryan${colors.reset}`);
        }

    } catch (err) {
        console.error("❌ خطا:", err);
    } finally {
        await driver.quit();
    }
}
nerkharz();
module.exports = nerkharz;
