const { By, Key } = require("selenium-webdriver");
const { generateNationalId } = require("../../customerDriver");
const BaseArianTechScript = require("../../BaseArianScript/baseArianTechScript");
const baseHelper = require("../../BaseArianScript/baseHelper");
class saleTypeListTest extends BaseArianTechScript {
  constructor() {
    super();
  }

  checkNameAfterAll() {
    return "افزودن مورد جدید";
  }

  setScriptName() {
    return "تیم مارکتینگ";
  }

  async implement(driver, dr) {
    const steps = [
      "//div[@role='menuitem' and .//span[text()='فروش']]",
      "/html/body/div[3]/div[1]/div[2]/div[1]/div/div[3]/div/ul/li[4]/ul/li[1]",
      "//li[@role='menuitem' and .//span[text()='نوع فروش']]",
      "//button[.//div[text()='افزودن مورد جدید']]",
    ];

    for (const xpath of steps) {
      const el = await this._waitForElement(driver, xpath);
      await el.click();
      await driver.sleep(300);
    }

    // پر کردن کد ملی
    const nationalIdInputXpath =
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[1]/div/div[2]/div[1]/div/input";
    await this._waitForElement(driver, nationalIdInputXpath);
    await driver
      .findElement(By.xpath(nationalIdInputXpath))
      .sendKeys(baseHelper._generateIranianMobile());

    // انتخاب از dropdown ساده
    const dropdownInputXpath =
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[2]/div/div[2]/div[1]/div/input";
    await this._waitForElement(driver, dropdownInputXpath);
    await driver
      .findElement(By.xpath(dropdownInputXpath))
      .sendKeys(baseHelper._generateNationalId());
    await driver.sleep(100);
    const options = await driver.findElements(
      By.css(".ant-select-item-option")
    );
    if (options.length > 1) await options[1].click();

    // ادامه مراحل ساده
    const nextBtnXpath =
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[1]/div/div[2]/div";
    await this._waitForElement(driver, nextBtnXpath);
    await driver.findElement(By.xpath(nextBtnXpath)).click();
    await driver.sleep(1200);
    const editBtn2Xpath =
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/div[1]/div/div/div/div/div/div/table/tbody/tr[1]/td[4]/div/span[1]";
    try {
      const editButton = await this._waitForElement(driver, editBtn2Xpath);
      await editButton.click();
    } catch (error) {
      console.log("خطا در پیدا کردن دکمه ویرایش:", error.message);
      await driver.navigate().refresh();
      await driver.sleep(1200);
      const editButton = await this._waitForElement(driver, editBtn2Xpath);
      await editButton.click();
    }
    await driver.sleep(700);

    // پاک کردن و نوشتن مقدار جدید
    const editInputXpath =
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/form/div[1]/div/div[2]/div/div/input";
    const editInput = await this._waitForElement(driver, editInputXpath);
    await editInput.sendKeys(Key.CONTROL + "a");
    await editInput.sendKeys(Key.DELETE);
    await editInput.sendKeys("7654321");
    await driver.sleep(300);
    const editInput1Xpath =
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[2]/div/div[2]/div[1]/div/input";
    const editInput1 = await this._waitForElement(driver, editInput1Xpath);
    await editInput1.sendKeys(Key.CONTROL + "a");
    await editInput1.sendKeys(Key.DELETE);
    await editInput1.sendKeys("7654321");
    await driver.sleep(100);

    const nextBtn2Xpath =
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[1]/div/div[2]/div";
    await this._waitForElement(driver, nextBtn2Xpath);
    await driver.findElement(By.xpath(nextBtn2Xpath)).click();
    await driver.sleep(700);
    const activeBtnXpath =
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/div[1]/div/div/div/div/div/div/table/tbody/tr[1]/td[4]/div/span[3]";
    await this._waitForElement(driver, activeBtnXpath);
    await driver.findElement(By.xpath(activeBtnXpath)).click();
    await driver.sleep(100);
    const deleteBtnXpath =
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/div[1]/div/div/div/div/div/div/table/tbody/tr[1]/td[4]/div/span[2]";
    await this._waitForElement(driver, deleteBtnXpath);
    await driver.findElement(By.xpath(deleteBtnXpath)).click();
    await driver.sleep(100);
    const saveBtnXpath =
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[3]/div[2]/div/div[1]/div/div/div/div[2]/div/div/button[2]";
    await this._waitForElement(driver, saveBtnXpath);
    await driver.findElement(By.xpath(saveBtnXpath)).click();
    await driver.sleep(100);
  }
}

async function main() {
  let success = false;
  try {
    const test = new saleTypeListTest();
    success = await test.duty();
  } catch (error) {
    console.error("test has error =>", error);
    success = false;
  }

  // تاخیر کوچک برای اطمینان از بسته شدن کامل
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // خروج از برنامه
  process.exit(success ? 0 : 1);
}

// اجرای اصلی
if (require.main === module) {
  main().catch((error) => {
    console.error("خطای غیرمنتظره:", error);
    process.exit(1);
  });
}

module.exports = saleTypeListTest;
