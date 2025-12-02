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
    console.log(`در حال انتخاب از dropdown: ${dropdownXpath}`);

    // کلیک برای باز کردن dropdown
    const dropdown = await waitForElement(driver, dropdownXpath);
    await driver.wait(until.elementIsEnabled(dropdown), 5000);

    // اسکرول به المنت
    await driver.executeScript("arguments[0].scrollIntoView(true);", dropdown);
    await driver.sleep(500);

    await dropdown.click();

    // منتظر ماندن برای بارگذاری options - این قسمت مهم است!
    await driver.sleep(2000);

    // پیدا کردن options از popover/portal - چندین سلکتور ممکن را امتحان می‌کنیم
    const possibleSelectors = [
      ".ant-select-dropdown:not(.ant-select-dropdown-hidden) .ant-select-item-option",
      ".ant-select-dropdown .ant-select-item-option",
      ".ant-form-item  .ant-form-item-has-success",
      '[id*="select"] .ant-select-item-option',
      ".ant-select-dropdown:not(.ant-select-dropdown-hidden) .ant-select-item-option-content",
      ".ant-select-item-option",
      ".ant-select-item",
      ".ant-select-tree-title",
    ];

    let options = [];
    for (let selector of possibleSelectors) {
      options = await driver.findElements(By.css(selector));
      if (options.length > 0) {
        console.log(
          `با سلکتور ${selector} تعداد ${options.length} گزینه پیدا شد`
        );
        break;
      }
    }

    if (options.length === 0) {
      console.log("هیچ گزینه‌ای در dropdown پیدا نشد");

      // روش جایگزین: استفاده از XPath برای پیدا کردن options
      const optionXPaths = [
        "//div[contains(@class, 'ant-select-item-option')]",
        "//div[contains(@class, 'ant-select-item')]",
      ];

      for (let xpath of optionXPaths) {
        options = await driver.findElements(By.xpath(xpath));
        if (options.length > 0) {
          console.log(
            `با XPath ${xpath} تعداد ${options.length} گزینه پیدا شد`
          );
          break;
        }
      }
    }

    if (options.length === 0) {
      console.log("هنوز هیچ گزینه‌ای پیدا نشد، تلاش با روش پیشرفته...");
      return await selectFromDropdownAdvanced(
        driver,
        dropdownXpath,
        optionText,
        optionIndex
      );
    }

    console.log(`تعداد گزینه‌های پیدا شده: ${options.length}`);

    // انتخاب گزینه بر اساس متن یا اندیس
    if (optionText) {
      for (let option of options) {
        try {
          const text = await option.getText();
          console.log(`گزینه با متن: "${text}"`);
          if (text.includes(optionText)) {
            await driver.executeScript(
              "arguments[0].scrollIntoView(true);",
              option
            );
            await option.click();
            console.log(`گزینه با متن "${optionText}" انتخاب شد`);
            return true;
          }
        } catch (e) {
          console.log("خطا در خواندن متن گزینه:", e.message);
        }
      }
      console.log(`گزینه با متن "${optionText}" پیدا نشد`);
    }

    if (optionIndex !== null && options[optionIndex]) {
      await driver.executeScript(
        "arguments[0].scrollIntoView(true);",
        options[optionIndex]
      );
      await options[optionIndex].click();
      console.log(`گزینه با اندیس ${optionIndex} انتخاب شد`);
      return true;
    }

    if (options.length > 0) {
      // انتخاب اولین گزینه به عنوان fallback
      await driver.executeScript(
        "arguments[0].scrollIntoView(true);",
        options[0]
      );
      await options[0].click();
      console.log("اولین گزینه انتخاب شد");
      return true;
    }

    return false;
  } catch (error) {
    console.log("خطا در انتخاب از dropdown:", error.message);
    return false;
  }
}

async function discount() {
  const nationalId = customDriver.generateNationalId();
  console.log("کد ملی تولید شده:", nationalId);

  let dr = new customDriver();
  const url = "https://frontbuild.ariansystemdp.local/fa";
  let driver = await dr.createDriver(url, true);

  try {
    await dr.login();

    const steps = [
      "//div[@role='menuitem' and .//span[text()='فروش']]",
      "//div[@role='menuitem' and .//span[text()='عملیات']]",
      "//li[@role='menuitem' and .//span[text()='تخفیفات']]",
      "//span[@aria-label='ویرایش']",
    ];

    for (const xpath of steps) {
      await driver.findElement(By.xpath(xpath)).click();
      await driver.sleep(1000);
    }
    async function clearAndType(driver, xpath, text) {
      const element = await waitForElement(driver, xpath);
      await element.click();
      await element.sendKeys(Key.CONTROL + "a");
      await element.sendKeys(Key.DELETE);
      await element.sendKeys(text);
    }
    await clearAndType(
      driver,
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/form/div[1]/div/div[2]/div/div/input",
      "تست1"
    );

    await selectFromDropdown(
      driver,
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/form/div[2]/div/div/div[2]/div/div/div/div/div[1]/div/span/span[1]/input",
      null,
      1
    );
    await driver.sleep(1000);

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/form/div[3]/div/div[2]/div/div/div/label[2]"
        )
      )
      .click();

    await clearAndType(
      driver,
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/form/div[4]/div/div[2]/div/div/div/div/input",
      "20"
    );
    await driver.sleep(1000);

    await clearAndType(
      driver,
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/form/div[5]/div/div[2]/div/div/div/div/input",
      "85"
    );
    await driver.sleep(1000);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/form/div[6]/div/div/div/div/div/div[1]/label"
        )
      )
      .click();
    await driver.sleep(1000);

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/form/div[7]/div/div/div/div/div/div[1]/label"
        )
      )
      .click();
    await driver.sleep(1000);

    await selectFromDropdown(
      driver,
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/form/div[8]/div/div[2]/div/div/div/div[1]/div",
      null,
      0
    );
    await driver.sleep(1000);
    await selectFromDropdown(
      driver,
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/form/div[9]/div/div[2]/div/div/div/div[1]/div",
      null,
      0
    );
    await driver.sleep(1000);
    await selectFromDropdown(
      driver,
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/form/div[10]/div/div[2]/div/div/div/div[1]/div",
      null,
      0
    );
    await driver.sleep(1000);
    // روش درست:
    const goodsInput = await driver.findElement(
      By.id("discountForm_GoodsCategoryDiscountIds")
    );
    await goodsInput.click();
    await driver.sleep(1000);
    await goodsInput.sendKeys(Key.ENTER);
    await driver.sleep(1000);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[1]/div/div[2]/div"
        )
      )
      .click();
    await driver.sleep(1000);

    const bodyText = await driver.findElement(By.css("body")).getText();
    if (bodyText.includes("آرین")) {
      console.log(`${colors.green}ok Aryan${colors.reset}`);
    } else {
      console.log(`${colors.red}not ok Aryan${colors.reset}`);
    }
  } catch (err) {
    console.error("❌ خطا:", err);
    try {
      const screenshot = await driver.takeScreenshot();
      fs.writeFileSync("customerGroup-screenshot.png", screenshot, "base64");
      console.log("اسکرین‌شات از خطا در customerGroup-screenshot.png ذخیره شد");
    } catch (screenshotError) {
      console.log("خطا در گرفتن اسکرین‌شات:", screenshotError);
    }
  } finally {
    await driver.quit();
  }
}

discount();
module.exports = discount;
