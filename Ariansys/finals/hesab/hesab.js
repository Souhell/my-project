// salemali.js
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

function generateNationalId() {
  let digits;
  do {
    digits = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));
  } while (digits.every((d) => d === 0));

  const check =
    digits
      .map((digit, index) => digit * (10 - index))
      .reduce((sum, val) => sum + val, 0) % 11;

  const controlDigit = check < 2 ? check : 11 - check;
  return digits.join("") + controlDigit;
}

async function hesab() {
  const nationalId = generateNationalId();
  console.log("کد ملی تولید شده:", nationalId);

  // مسیر فایل persistRoot.json که قبلاً در اسکریپت login ساخته می‌شود
  // (در صورت نیاز مسیر را نسبت به محل واقعی فایل اصلاح کن)
  const persistPath = path.join(__dirname, "../hesab/persistRoot.json");

  // تنظیمات مرورگر برای Allow Notification و ماکسیمایز
  const options = new chrome.Options();
  options.addArguments("--disable-infobars", "--start-maximized");
  options.setUserPreferences({
    "profile.default_content_setting_values.notifications": 1,
  });

  let dr = new customDriver();
  const url = "https://frontbuild.ariansystemdp.local/fa";
  let driver = await dr.createDriver(url, true);
  await driver.sleep(100);
  try {
    //login process
    await dr.login();
    await driver.sleep(100);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[1]/div[2]/div/div[3]/div/ul/li[1]"
        )
      )
      .click();
    await driver.sleep(100);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[1]/div[2]/div/div[3]/div/ul/li[1]/ul/li[1]"
        )
      )
      .click();
    await driver.sleep(100);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[1]/div[2]/div/div[3]/div/ul/li[1]/ul/li[1]/ul/li[5]"
        )
      )
      .click();
    await driver.sleep(100);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[1]/div[1]/div[1]/button"
        )
      )
      .click();
    await driver.sleep(100);

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[1]/div/div[2]/div/div/div/div[1]"
        )
      )
      .click();
    await driver.sleep(100);

    await driver.findElement(By.css('[title="xczxc"]')).click();
    await driver.sleep(100);

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[2]/div/div[2]/div/div/input"
        )
      )
      .sendKeys(nationalId);
    await driver.sleep(100);

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[3]/div/div[2]/div/div/input"
        )
      )
      .sendKeys(nationalId);
    await driver.sleep(100);

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[4]/div/div[2]/div/div/input"
        )
      )
      .sendKeys(nationalId);
    await driver.sleep(100);

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[5]/div/div[2]/div"
        )
      )
      .click();
    await driver.sleep(1000);

    await driver.findElement(By.css('[title="8249000528"]')).click();
    await driver.sleep(100);

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[6]/div/div/div/div/div/label"
        )
      )
      .click();
    await driver.sleep(100);

    // await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[3]/div/div[2]/div/div/button")).click();
    // await driver.sleep(100);
    // await driver.findElement(By.xpath("/html/body/div[4]/div[1]/div/div/div[2]/div/div[2]/div[6]/button")).click();

    await driver.sleep(100);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[1]/div/div[2]/div"
        )
      )
      .click();
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

hesab();
module.exports = hesab;
