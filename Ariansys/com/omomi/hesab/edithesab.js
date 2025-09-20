const { Builder, By, Key, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const fs = require("fs");
const path = require("path");
const customDriver = require("../../customerDriver");
const colors = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  reset: "\x1b[0m",
};



async function edithesab() {
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

    // اگر نیاز به بارگذاری کوکی داشتی، می‌توانی این بخش را فعال کنی:
    /*
        const cookiesPath = path.join(__dirname, "cookies.json");
        if (fs.existsSync(cookiesPath)) {
            const cookies = JSON.parse(fs.readFileSync(cookiesPath, "utf8"));
            for (const cookie of cookies) {
                await driver.manage().addCookie(cookie);
            }
            await driver.navigate().refresh();
            console.log("✅ کوکی‌ها بارگذاری و صفحه رفرش شد.");
        } else {
            console.log("⚠️ کوکی یافت نشد. لطفاً ابتدا کوکی را ذخیره کنید.");
        }
        */

    await driver.wait(until.elementLocated(By.css("body")), 500);
    console.log("🏁 مرورگر آماده برای ادامه تست.");

    // اجرای گام‌ها
    const steps = [
      "/html/body/div[3]/div/div[2]/div[1]/div[2]/div/div[3]/div/ul/li[1]",
      "/html/body/div[3]/div/div[2]/div[1]/div[2]/div/div[3]/div/ul/li[1]/ul/li[1]",
      "/html/body/div[3]/div/div[2]/div[1]/div[2]/div/div[3]/div/ul/li[1]/ul/li[1]/ul/li[5]",
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/div[1]/div/div/div/div/div/div/table/tbody/tr[1]/td[7]/div/span[1]",
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

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[1]/div/div[2]/div/div/div/div[1]"
        )
      )
      .click();
    await driver.sleep(100);
    await driver.findElement(By.css('[title="بانک ذخیره عیدی 404"]')).click();
    await driver.sleep(100);

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[2]/div/div[2]/div/div/input"
        )
      )
      .sendKeys(Key.CONTROL + "a");
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[2]/div/div[2]/div/div/input"
        )
      )
      .sendKeys(Key.DELETE);
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
      .sendKeys(Key.CONTROL + "a");
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[3]/div/div[2]/div/div/input"
        )
      )
      .sendKeys(Key.DELETE);
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
      .sendKeys(Key.CONTROL + "a");
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[4]/div/div[2]/div/div/input"
        )
      )
      .sendKeys(Key.DELETE);
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

    await driver.findElement(By.css('[title="6002754636"]')).click();
    await driver.sleep(100);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[6]/div/div/div/div/div/label"
        )
      )
      .click();
    await driver.sleep(100);

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
// edithesab();
module.exports = edithesab;
