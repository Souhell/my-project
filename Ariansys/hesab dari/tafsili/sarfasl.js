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

// اضافه کردن توابع کمکی
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

async function clearAndType(driver, xpath, text) {
  const element = await waitForElement(driver, xpath);
  await element.click();
  await element.sendKeys(Key.CONTROL + "a");
  await element.sendKeys(Key.DELETE);
  await element.sendKeys(text);
}

async function sarfasl() {
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
      "/html/body/div[3]/div/div[2]/div[1]/div[2]/div/div[3]/div/ul/li[2]",
      "/html/body/div[3]/div/div[2]/div[1]/div[2]/div/div[3]/div/ul/li[2]/ul/li[1]",
      "/html/body/div[3]/div/div[2]/div[1]/div[2]/div/div[3]/div/ul/li[2]/ul/li[1]/ul/li[2]",
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[1]/div/button[3]",
    ];

    for (const xpath of steps) {
      await safeClick(driver, xpath);
      await driver.sleep(500); // افزایش زمان انتظار
    }

    // پر کردن فیلدهای کد ملی
    await clearAndType(
      driver,
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div[1]/div[1]/div/div[2]/div/div/input",
      nationalId
    );

    await clearAndType(
      driver,
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div[1]/div[3]/div/div[2]/div/div/input",
      nationalId
    );

    // انتخاب از dropdown اول
    await selectFromDropdown(
      driver,
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div[1]/div[2]/div/div[2]/div/div/div/div[1]/div/span/span[1]/input",
      null,
      1
    );

    // کلیک روی دکمه جستجو
    await safeClick(
      driver,
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div[2]/div/div/div/div/div/button"
    );
    await driver.sleep(2000);

    ///ویرایش - منوی سه نقطه
    await safeClick(
      driver,
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/div/div/div[3]/div/div/div/div/span[2]"
    );
    await driver.sleep(1000);
    await safeClick(
      driver,
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/div/div/div[3]/div/div/div/div[2]/span[2]"
    );
    await driver.sleep(1000);
    await safeClick(
      driver,
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/div/div/div[3]/div/div/div/div[3]/span[3]"
    );
    await driver.sleep(1000);

    // گزینه ویرایش از منو
    await safeClick(
      driver,
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/div/div/div[3]/div/div/div/div[3]/span[3]/span/div/div[2]/span[3]"
    );
    await driver.sleep(1000);

    // ویرایش فیلدها
    await clearAndType(
      driver,
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div[1]/div[1]/div/div[2]/div/div/input",
      "7654321"
    );

    await clearAndType(
      driver,
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div[1]/div[3]/div/div[2]/div/div/input",
      nationalId
    );
    await selectFromDropdown(
      driver,
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div[1]/div[2]/div/div[2]/div/div/div/div[1]/div/span/span[1]/input",
      null,
      2
    );
    await safeClick(
      driver,
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div[2]/div[1]/div[1]/div/div/div/div/label/span[1]"
    );
    await safeClick(
      driver,
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div[2]/div[1]/div[2]/div/div/div/div/label/span[1]"
    );
    await safeClick(
      driver,
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div[2]/div[1]/div[3]/div/div/div/div/label/span[1]"
    );
    await safeClick(
      driver,
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div[2]/div[2]/div[1]/div/div/div/div/label/span[1]"
    );
    await safeClick(
      driver,
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div[2]/div[2]/div[2]/div/div/div/div/label/span[1]"
    );
    await safeClick(
      driver,
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div[2]/div[2]/div[3]/div/div/div/div/label/span[1]"
    );
    await safeClick(
      driver,
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div[2]/div[2]/div[4]/div/div/div/div/label/span[1]"
    );
    // انتخاب از dropdown در حالت ویرایش
    const editDropdownXpath =
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div[1]/div[2]/div/div[2]/div/div/div/div[1]";
    await selectFromDropdown(driver, editDropdownXpath, null, 2);

    await driver.sleep(100);

    // ذخیره تغییرات
    await safeClick(
      driver,
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div[3]/div/div/div/div/div/button"
    );
    await driver.sleep(2000);

    ////اکتیو کردن
    try {
      await safeClick(
        driver,
        "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/div/div/div[3]/div/div/div/div[3]/span[3]/span/div/div[2]/span[5]"
      );
    } catch (error) {
      console.log("خطا در پیدا کردن دکمه اکتیو:", error.message);
      // تلاش با XPath جایگزین
      const alternativeXpaths = [
        "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/div[1]/div/div/div/div/div/div/table/tbody/tr[1]/td[5]/div/span[3]",
        "//span[contains(@class, 'anticon') and contains(@class, 'active')]",
        "//button[contains(text(), 'فعال')]",
      ];

      for (const xpath of alternativeXpaths) {
        try {
          const elements = await driver.findElements(By.xpath(xpath));
          if (elements.length > 0) {
            await elements[0].click();
            break;
          }
        } catch (e) {
          continue;
        }
      }
    }
    await driver.sleep(1000);

    //حذف
    await safeClick(
      driver,
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/div/div/div[3]/div/div/div/div[3]/span[3]/span/div/div[2]/span[4]"
    );
    await driver.sleep(1000);

    // تایید حذف
    await safeClick(
      driver,
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div/div[2]/div/div/button[2]"
    );
    await driver.sleep(2000);

    // بررسی نتیجه
    const bodyText = await driver.findElement(By.css("body")).getText();
    if (bodyText.includes("آرین")) {
      console.log(`${colors.green}ok Aryan ${colors.reset}`);
    } else {
      console.log(`${colors.red}not ok Aryan ${colors.reset}`);
    }
  } catch (err) {
    console.error("❌ خطا:", err);
    // گرفتن اسکرین‌شات برای دیباگ
    try {
      const screenshot = await driver.takeScreenshot();
      fs.writeFileSync("sarfasl-error-screenshot.png", screenshot, "base64");
      console.log("اسکرین‌شات از خطا در sarfasl-error-screenshot.png ذخیره شد");
    } catch (screenshotError) {
      console.log("خطا در گرفتن اسکرین‌شات:", screenshotError);
    }
  } finally {
    await driver.quit();
  }
}

sarfasl();
module.exports = sarfasl;
