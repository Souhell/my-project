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
      await driver.findElement(By.xpath(xpath)).click();
      await driver.sleep(100);
    }

    // کلیک روی دراپ‌دان اول و انتخاب گزینه
    // --- برای select اول ---
    const firstSelect = await driver.findElement(
      By.xpath(
        "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[1]/div/div[2]/div"
      )
    );
    await firstSelect.click();
    await driver.sleep(500);

    // فقط dropdown باز شده رو بگیر
    const dropdowns1 = await driver.findElements(
      By.css('.ant-select-dropdown:not([aria-hidden="true"])')
    );
    const options1 = await dropdowns1[dropdowns1.length - 1].findElements(
      By.css(".ant-select-item-option")
    );

    // آیتم اول رو کلیک کن
    await options1[0].click();
    await driver.sleep(1000);

    // --- برای select دوم ---
    const secondSelect = await driver.findElement(
      By.xpath(
        "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[2]/div/div[2]/div"
      )
    );
    await secondSelect.click();
    await driver.sleep(500);

    // دوباره فقط dropdown باز شده رو بگیر
    const dropdowns2 = await driver.findElements(
      By.css('.ant-select-dropdown:not([aria-hidden="true"])')
    );
    const options2 = await dropdowns2[dropdowns2.length - 1].findElements(
      By.css(".ant-select-item-option")
    );

    // آیتم دوم رو کلیک کن
    await options2[1].click();
    await driver.sleep(1000);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[3]/div/div[2]/div[1]/div/div/div/input"
        )
      )
      .sendKeys(nationalId);
    await driver.sleep(100);

    await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[1]/div/div[2]/div")).click();
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

// nerkharz();
module.exports = nerkharz;
