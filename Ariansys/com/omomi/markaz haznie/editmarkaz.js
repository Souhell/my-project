const { Builder, By, until, Key, Actions } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const fs = require("fs");
const path = require("path");
const customDriver = require("../../customerDriver");

const colors = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  reset: "\x1b[0m",
};

async function editmarkaz() {
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
      "/html/body/div[3]/div/div[2]/div[1]/div[2]/div/div[3]/div/ul/li[1]/ul/li[1]/ul/li[3]",
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/div[1]/div/div/div/div/div/div/table/tbody/tr[1]/td[5]/div/span[1]"
    //   "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[1]/div[1]/div[1]/button",
    ];

    for (const xpath of steps) {
      await driver.findElement(By.xpath(xpath)).click();
      await driver.sleep(100);
    }
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[1]/div/div[2]/div[1]/div/input"
        )
      )
      .sendKeys(Key.CONTROL + "a");
    await driver.sleep(100);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[1]/div/div[2]/div[1]/div/input"
        )
      )
      .sendKeys(Key.DELETE);
    await driver.sleep(100);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[1]/div/div[2]/div[1]/div/input"
        )
      )
      .sendKeys(nationalId);
    await driver.sleep(100);
    
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[2]/div/div[2]/div/div/input"
        )
      )
      .sendKeys(Key.CONTROL + "a");
    await driver.sleep(100);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[2]/div/div[2]/div/div/input"
        )
      )
      .sendKeys(Key.DELETE);
    await driver.sleep(100);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[2]/div/div[2]/div/div/input"
        )
      )
      .sendKeys(nationalId);
    await driver.sleep(100);
    // --- برای select دوم ---
    // پیدا کردن المنت اصلی dropdown
const secondSelect = await driver.findElement(
  By.xpath("/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[3]/div/div[2]/div/div/div/div[1]")
);

// کلیک روی المنت اصلی برای باز کردن dropdown
await secondSelect.click();
await driver.sleep(500);

// پیدا کردن dropdown باز شده
const dropdown = await driver.wait(
  until.elementLocated(By.css('.ant-select-dropdown:not([style*="display: none"])')),
  5000
);

// پیدا کردن همه گزینه‌ها
const options = await dropdown.findElements(By.css('.ant-select-item-option'));

// کلیک روی گزینه مورد نظر (اینجا گزینه چهارم)

  await options[3].click();
 
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[1]/div/div[2]/div"
        )
      )
      .click();
    await driver.sleep(100);

    let bodyText = await driver.findElement(By.css("body")).getText();
    if (bodyText.includes("تنظیم شده")) {
      console.log(`${colors.green}ok Aryan ${colors.reset}`);
    } else {
      console.log(`${colors.red}not ok Aryan ${colors.reset}`);
    }
  } catch (err) {
    console.error("❌ خطا:", err);
  } finally {
    await driver.quit();
  }
}

// editmarkaz();
module.exports = editmarkaz;
