const { Builder, By, Key, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const fs = require("fs");
const path = require("path");
const customDriver = require("../customerDriver");

const colors = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  reset: "\x1b[0m",
};

// اضافه کردن تابع waitForElement
async function waitForElement(driver, xpath, timeout = 10000) {
  return await driver.wait(until.elementLocated(By.xpath(xpath)), timeout);
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

async function cashList() {
  const nationalId = customDriver.generateNationalId();
  console.log("کد ملی تولید شده:", nationalId);

  let dr = new customDriver();
  const url = "https://frontbuild.ariansystemdp.local/fa";
  let driver = await dr.createDriver(url, true);

  try {
    await dr.login();

    const steps = [
      "/html/body/div[3]/div/div[2]/div[1]/div[2]/div/div[3]/div/ul/li[3]",
      "/html/body/div[3]/div/div[2]/div[1]/div[2]/div/div[3]/div/ul/li[3]/ul/li[1]",
      // "/html/body/div[3]/div/div[2]/div[1]/div[2]/div/div[3]/div/ul/li[3]/ul/li[1]/ul/li[1]",
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[1]/div[1]/div[1]/button",
    ];

    for (const xpath of steps) {
      const el = await waitForElement(driver, xpath);
      await el.click();
      await driver.sleep(300);
    }

    // پر کردن کد ملی
    const nationalIdInputXpath = "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[1]/div/div[2]/div[1]/div/input";
    await waitForElement(driver, nationalIdInputXpath);
    await driver.findElement(By.xpath(nationalIdInputXpath)).sendKeys(nationalId);

    // انتخاب از dropdown ساده
    const dropdownInputXpath = "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[2]/div/div[2]/div[1]/div/input";
    await waitForElement(driver, dropdownInputXpath);
    await driver.findElement(By.xpath(dropdownInputXpath)).sendKeys(nationalId);
    await driver.sleep(100);
    const options = await driver.findElements(By.css(".ant-select-item-option"));
    if (options.length > 1) await options[1].click();

    // ادامه مراحل ساده
    const nextBtnXpath = "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[1]/div/div[2]/div";
    await waitForElement(driver, nextBtnXpath);
    await driver.findElement(By.xpath(nextBtnXpath)).click();
    await driver.sleep(1200);
    // ویرایش اولین ردیف - با انتظار بیشتر
    const editBtnXpath = "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/div[1]/div/div/div/div/div/div/table/tbody/tr[1]/td[4]/div/span[3]";
    await waitForElement(driver, editBtnXpath);
    await driver.findElement(By.xpath(editBtnXpath)).click();
    await driver.sleep(100);
    const firstDropdownXpath = "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[3]/div[2]/div/div[1]/div/div/div[2]/div[2]/div/form/div[1]/div/div[2]/div[1]/div/div/div[1]/div/span/span[1]/input";
    await waitForElement(driver, firstDropdownXpath);
    await driver.findElement(By.xpath(firstDropdownXpath)).click();
    await driver.sleep(100);
    const options1 = await driver.findElements(By.css(".ant-select-item-option"));
    if (options1.length > 1) await options1[1].click();
    const secondDropdownXpath = "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[3]/div[2]/div/div[1]/div/div/div[2]/div[2]/div/form/div[2]/div/div[2]/div[1]/div/div/div[1]/div/span/span[1]/input";
    await waitForElement(driver, secondDropdownXpath);
    await driver.findElement(By.xpath(secondDropdownXpath)).click();
    await driver.sleep(300);
    const secondSelect = await driver.findElement(By.xpath(
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[3]/div[2]/div/div[1]/div/div/div[2]/div[2]/div/form/div[2]/div/div[2]/div/div/div/div[1]/div/span/span[1]/input"
    ));
    await secondSelect.click();
    await driver.sleep(300);
    const dropdowns2 = await driver.findElements(By.css('.ant-select-dropdown:not([aria-hidden="true"])'));
    const options2 = await dropdowns2[dropdowns2.length - 1].findElements(By.css(".ant-select-item-option"));
    await options2[1].click();
    await driver.sleep(700);
    const radio1Xpath = "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[3]/div[2]/div/div[1]/div/div/div[2]/div[2]/div/form/div[4]/div/div/div/div/label/span[2]";
    const radio2Xpath = "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[3]/div[2]/div/div[1]/div/div/div[2]/div[2]/div/form/div[3]/div/div/div/div/label/span[2]";
    const submitBtnXpath = "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[3]/div[2]/div/div[1]/div/div/div[2]/div[2]/div/form/div[5]/div/div/div/div/div/button";
    await waitForElement(driver, radio1Xpath);
    await driver.sleep(500); // صبر برای بسته شدن احتمالی tooltip
    // انتقال موس به گوشه صفحه برای جلوگیری از باز شدن tooltip
    await driver.actions({ bridge: true }).move({ x: 0, y: 0 }).perform();
    try {
      await driver.findElement(By.xpath(radio1Xpath)).click();
    } catch (e) {
      // اگر باز هم خطا بود، دوباره تلاش کن
      await driver.sleep(500);
      await driver.findElement(By.xpath(radio1Xpath)).click();
    }
    await driver.sleep(100);
    await waitForElement(driver, radio2Xpath);
    await driver.actions({ bridge: true }).move({ x: 0, y: 0 }).perform();
    try {
      await driver.findElement(By.xpath(radio2Xpath)).click();
    } catch (e) {
      await driver.sleep(500);
      await driver.findElement(By.xpath(radio2Xpath)).click();
    }
    await driver.sleep(100);
    await waitForElement(driver, submitBtnXpath);
    await driver.findElement(By.xpath(submitBtnXpath)).click();
    await driver.sleep(700);
    // ویرایش اولین ردیف - با انتظار بیشتر
    const editBtn2Xpath = "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/div[1]/div/div/div/div/div/div/table/tbody/tr[1]/td[4]/div/span[1]";
    try {
      const editButton = await waitForElement(driver, editBtn2Xpath);
      await editButton.click();
    } catch (error) {
      console.log("خطا در پیدا کردن دکمه ویرایش:", error.message);
      await driver.navigate().refresh();
      await driver.sleep(1200);
      const editButton = await waitForElement(driver, editBtn2Xpath);
      await editButton.click();
    }
    await driver.sleep(700);

    // پاک کردن و نوشتن مقدار جدید
    const editInputXpath = "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/form/div[1]/div/div[2]/div/div/input";
    const editInput = await waitForElement(driver, editInputXpath);
    await editInput.sendKeys(Key.CONTROL + "a");
    await editInput.sendKeys(Key.DELETE);
    await editInput.sendKeys("7654321");
    await driver.sleep(300);
    const editInput1Xpath = "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[2]/div/div[2]/div[1]/div/input";
    const editInput1 = await waitForElement(driver, editInput1Xpath);
    await editInput1.sendKeys(Key.CONTROL + "a");
    await editInput1.sendKeys(Key.DELETE);
    await editInput1.sendKeys("7654321");
    await driver.sleep(100);

    const nextBtn2Xpath = "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[1]/div/div[2]/div";
    await waitForElement(driver, nextBtn2Xpath);
    await driver.findElement(By.xpath(nextBtn2Xpath)).click();
    await driver.sleep(700);
    const activeBtnXpath = "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/div[1]/div/div/div/div/div/div/table/tbody/tr[1]/td[4]/div/span[4]";
    await waitForElement(driver, activeBtnXpath);
    await driver.findElement(By.xpath(activeBtnXpath)).click();
    await driver.sleep(100);
    const deleteBtnXpath = "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/div[1]/div/div/div/div/div/div/table/tbody/tr[1]/td[4]/div/span[2]";
    await waitForElement(driver, deleteBtnXpath);
    await driver.findElement(By.xpath(deleteBtnXpath)).click();
    await driver.sleep(100);
    const saveBtnXpath = "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[3]/div[2]/div/div[1]/div/div/div/div[2]/div/div/button[2]";
    await waitForElement(driver, saveBtnXpath);
    await driver.findElement(By.xpath(saveBtnXpath)).click();
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
      fs.writeFileSync("error-screenshot.png", screenshot, "base64");
      console.log("اسکرین‌شات از خطا در error-screenshot.png ذخیره شد");
    } catch (screenshotError) {
      console.log("خطا در گرفتن اسکرین‌شات:", screenshotError);
    }
  } finally {
    await driver.quit();
  }
}

cashList();
module.exports = cashList;
