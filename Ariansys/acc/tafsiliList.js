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

// اضافه کردن تابع waitForElement
async function waitForElement(driver, xpath, timeout = 10000) {
  return await driver.wait(until.elementLocated(By.xpath(xpath)), timeout);
}

async function selectFromDropdown(driver, dropdownXpath, optionText = null, optionIndex = null) {
  try {
    // کلیک برای باز کردن dropdown
    const dropdown = await waitForElement(driver, dropdownXpath);
    await driver.wait(until.elementIsEnabled(dropdown), 5000);
    await dropdown.click();
    
    // منتظر ماندن برای بارگذاری options
    await driver.sleep(1500);
    
    // پیدا کردن تمام options
    const options = await driver.findElements(By.css(".ant-select-item-option"));
    
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

async function tafsili() {
  const nationalId = customDriver.generateNationalId();
  console.log("کد ملی تولید شده:", nationalId);

  let dr = new customDriver();
  const url = "https://frontbuild.ariansystemdp.local/fa";
  let driver = await dr.createDriver(url, true);

  try {
    await dr.login();

    const steps = [
      "/html/body/div[3]/div/div[2]/div[1]/div[2]/div/div[3]/div/ul/li[2]",
      "/html/body/div[3]/div/div[2]/div[1]/div[2]/div/div[3]/div/ul/li[2]/ul/li[1]",
      "/html/body/div[3]/div/div[2]/div[1]/div[2]/div/div[3]/div/ul/li[2]/ul/li[1]/ul/li[1]",
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[1]/div[1]/div[1]/button",
    ];

    for (const xpath of steps) {
      await driver.findElement(By.xpath(xpath)).click();
      await driver.sleep(500); // افزایش زمان انتظار
    }

    // پر کردن کد ملی
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[1]/div/div[2]/div[1]/div/input"
        )
      )
      .sendKeys(nationalId);
    await driver.sleep(100);

    // انتخاب از dropdown ساده
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[2]/div/div[2]/div[1]/div/div/div[1]/div/span/span[1]/input"
        )
      )
      .click();
    await driver.sleep(100);

    const options = await driver.findElements(
      By.css(".ant-select-item-option")
    );
    if (options.length > 1) {
      await options[1].click();
    }

    // ادامه مراحل ساده
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[1]/div/div[2]/div"
        )
      )
      .click();
    await driver.sleep(2000); // افزایش زمان انتظار

    // ویرایش اولین ردیف - با انتظار بیشتر
    try {
      const editButton = await waitForElement(
        driver,
        "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/div[1]/div/div/div/div/div/div/table/tbody/tr[1]/td[5]/div/span[1]"
      );
      await editButton.click();
    } catch (error) {
      console.log("خطا در پیدا کردن دکمه ویرایش:", error.message);
      // اگر المنت پیدا نشد، صفحه رو رفرش کن
      await driver.navigate().refresh();
      await driver.sleep(2000);
      const editButton = await waitForElement(
        driver,
        "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/div[1]/div/div/div/div/div/div/table/tbody/tr[1]/td[5]/div/span[1]"
      );
      await editButton.click();
    }
    
    await driver.sleep(1000);

    // پاک کردن و نوشتن مقدار جدید
    const input = await driver.findElement(
      By.xpath(
        "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/form/div[1]/div/div[2]/div/div/input"
      )
    );
    await input.sendKeys(Key.CONTROL + "a");
    await input.sendKeys(Key.DELETE);
    await input.sendKeys("7654321");
    
    await driver.sleep(500);

    // استفاده از تابع selectFromDropdown برای dropdown ویرایش
    const editDropdownXpath = "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/form/div[2]/div/div[2]/div/div/div/div[1]";
    await selectFromDropdown(driver, editDropdownXpath, null, 2);

    await driver.sleep(100);
    
    await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[1]/div/div[2]/div")).click();
    await driver.sleep(1000);
    // کلیک روی اکتیو
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/div[1]/div/div/div/div/div/div/table/tbody/tr[1]/td[5]/div/span[3]"
        )
      )
      .click();
    await driver.sleep(100);

    // حذف
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/div[1]/div/div/div/div/div/div/table/tbody/tr[1]/td[5]/div/span[2]"
        )
      )
      .click();
    await driver.sleep(100);

    // ذخیره یا ادامه
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[3]/div[2]/div/div[1]/div/div/div/div[2]/div/div/button[2]"
        )
      )
      .click();
    await driver.sleep(100);

    // بررسی نتیجه
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
      fs.writeFileSync('error-screenshot.png', screenshot, 'base64');
      console.log("اسکرین‌شات از خطا در error-screenshot.png ذخیره شد");
    } catch (screenshotError) {
      console.log("خطا در گرفتن اسکرین‌شات:", screenshotError);
    }
  } finally {
    await driver.quit();
  }
}

tafsili();
module.exports = tafsili;
