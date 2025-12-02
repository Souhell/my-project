const { Builder, By, Key, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const fs = require("fs");
const path = require("path");
const customDriver = require("../customerDriver");
const { Actions } = require("selenium-webdriver");
const colors = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  reset: "\x1b[0m",
};

function faToEnDigits(str) {
  if (!str) return str;
  return str
    .replace(/[\u06F0-\u06F9]/g, (d) => "0123456789"[d.charCodeAt(0) - 0x06f0])
    .replace(/[\u0660-\u0669]/g, (d) => "0123456789"[d.charCodeAt(0) - 0x0660]);
}

async function selectFromMuiList(driver, { name, date, price }) {
  const normalizedDate = date;
  const normalizedPrice = price.replace(/[,٬]/g, "");

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const input = await driver.wait(
        until.elementLocated(By.css("input.ant-select-selection-search-input")),
        10000
      );

      await input.click();
      await input.clear();
      await input.sendKeys(name);
      await driver.sleep(800);

      const cards = await driver.wait(
        until.elementsLocated(
          By.xpath(
            `//div[contains(@class,"MuiBox-root") and .//div[contains(text(),"${name}")]]`
          )
        ),
        10000
      );

      for (const card of cards) {
        const rawText = await card.getText();
        const text = faToEnDigits(rawText);
        const textNoSep = text.replace(/[,٬]/g, "");

        if (!text.includes(normalizedDate)) continue;
        if (!textNoSep.includes(normalizedPrice)) continue;

        await driver.executeScript("arguments[0].scrollIntoView(true);", card);
        await driver.sleep(200);

        const radio = await card.findElement(By.css('input[type="radio"]'));
        await driver.executeScript("arguments[0].click();", radio);

        return true;
      }

      throw new Error("not found in this attempt");
    } catch (err) {
      try {
        await driver.actions().sendKeys(Key.ESCAPE).perform();
      } catch {}
      await driver.sleep(500);
      if (attempt === 3) return false;
    }
  }
}

async function returnSalesInvoiceList() {
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
      "//li[@role='menuitem' and .//span[text()='بازگشت فروش']]",
      "//button[.//div[text()='افزودن مورد جدید']]",
    ];

    for (const xpath of steps) {
      const el = await driver.wait(
        until.elementLocated(By.xpath(xpath)),
        10000
      );
      await el.click();
      await driver.sleep(500);
    }

    await driver.sleep(2000);

    const dateButton = await driver.wait(
      until.elementLocated(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[1]/form/div[1]/div/div[2]/div/div/button"
        )
      ),
      10000
    );
    await dateButton.click();
    await driver.sleep(700);

    const todayButton = await driver.wait(
      until.elementLocated(
        By.xpath("//button[normalize-space(text())='انتخاب امروز']")
      ),
      5000
    );
    await driver.wait(until.elementIsVisible(todayButton), 5000);
    await driver.executeScript(
      "arguments[0].scrollIntoView(true);",
      todayButton
    );
    await driver.sleep(200);
    await driver.executeScript("arguments[0].click();", todayButton);
    await driver.sleep(500);
    async function selectWithKeyboard(driver, name) {
      try {
        // پیدا کردن دراپ‌داون
        const dropdown = await driver.findElement(By.css("#rc_select_3"));

        // کلیک و تایپ
        await dropdown.click();
        await driver.sleep(500);
        await dropdown.sendKeys(name);
        await driver.sleep(1500);

        // استفاده از کلیدهای جهت‌دار و اینتر
        await dropdown.sendKeys(Key.ARROW_DOWN);
        await driver.sleep(300);
        await dropdown.sendKeys(Key.ENTER);
        await driver.sleep(1000);

        console.log(`✅ فاکتور "${name}" با کیبورد انتخاب شد`);
        return true;
      } catch (error) {
        console.log("❌ خطا در انتخاب با کیبورد:", error.message);
        return false;
      }
    }
    await selectWithKeyboard(driver, "علی محمدیان");
    // await selectFromDropdownANT(
    //   driver,
    //   "//label[contains(text(), 'فاکتور مرجع')]/following::div[contains(@class, 'ant-select')][1]",
    //   "علی محمدیان"
    // );

    const saleTypeInput = await driver.wait(
      until.elementLocated(By.id("sellWithCustomerForm_SaleTypeId")),
      10000
    );
    await saleTypeInput.click();
    await saleTypeInput.sendKeys("فروش نقدی");
    await driver.sleep(500);
    await saleTypeInput.sendKeys(Key.ENTER);
    await driver.sleep(500);

    const payTypeInput = await driver.wait(
      until.elementLocated(By.id("sellWithCustomerForm_PayOfTypeId")),
      10000
    );
    await payTypeInput.click();
    await payTypeInput.sendKeys("نقدی");
    await driver.sleep(500);
    await payTypeInput.sendKeys(Key.ENTER);
    await driver.sleep(500);

    const bodyText = await driver.findElement(By.css("body")).getText();
    if (bodyText.includes("آرین")) {
      console.log(`${colors.green}✅ ok Aryan${colors.reset}`);
    } else {
      console.log(`${colors.red}❌ not ok Aryan${colors.reset}`);
    }
  } catch (err) {
    console.error("❌ خطا:", err);
    try {
      const screenshot = await driver.takeScreenshot();
      fs.writeFileSync("returnSalesInvoiceList.png", screenshot, "base64");
    } catch (_) {}
  } finally {
    await driver.quit();
  }
}

returnSalesInvoiceList();
module.exports = returnSalesInvoiceList;
