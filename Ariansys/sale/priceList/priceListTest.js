const { By, Key } = require("selenium-webdriver");
const BaseArianTechScript = require("../../BaseArianScript/baseArianTechScript");
const baseHelper = require("../../BaseArianScript/baseHelper");
class priceList extends BaseArianTechScript {
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
      "//div[@role='menuitem' and .//span[text()='عملیات']]",
      "//li[@role='menuitem' and .//span[text()='لیست قیمت']]",
      "//button[.//div[text()='افزودن مورد جدید']]",
    ];
    for (const xpath of steps) {
      await driver.findElement(By.xpath(xpath)).click();
      await driver.sleep(100);
    }

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div[1]/div[2]/div[2]/div[2]/div/div[2]/div/div[1]/form/div[1]/div/div[2]/div/div/input"
        )
      )
      .sendKeys(baseHelper._generateNationalId());
    await driver.sleep(1000);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div[1]/div[2]/div[2]/div[2]/div/div[2]/div/div[1]/form/div[2]/div/div[2]/div/div/div/div[1]/div/span/span[1]/input"
        )
      )
      .click();
    await driver.sleep(100);
    const options1 = await driver.findElements(
      By.css(".ant-select-item-option")
    );
    if (options1.length > 0) {
      await driver.executeScript(
        "arguments[0].scrollIntoView(true);",
        options1[0]
      );
      await options1[0].click();
    }
    await driver.sleep(100);

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/div/div[3]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[3]/span/span"
        )
      )
      .click();
    await driver.sleep(100);

    await driver.sleep(1000);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/div/div[3]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[3]/div/div[1]/div/span/span[1]"
        )
      )
      .click();
    await driver.sleep(100);
    // بهترین روش
    const goodsInput = await driver.findElement(By.id("GoodsId"));
    await goodsInput.click();
    await goodsInput.sendKeys("new goods");
    await driver.sleep(300);
    await goodsInput.sendKeys(Key.ENTER);
    await driver.sleep(300);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/div/div[3]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[4]/div/div/input"
        )
      )
      .sendKeys(baseHelper._generateNationalId());
    await driver.sleep(700);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[1]/div/div[2]/div"
        )
      )
      .click();
    await driver.sleep(1000);
    // await driver.navigate().refresh();
    await driver.sleep(700);
    ////ویرایش

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div[1]/div/div/div/div/div/div/table/tbody/tr[1]/td[3]/div/span[1]"
        )
      )
      .click();
    await driver.sleep(300);

    const editInputXpath =
      "/html/body/div[3]/div[1]/div[2]/div[2]/div[2]/div/div[2]/div/div[1]/form/div[1]/div/div[2]/div/div/input";
    const editInput = await this._waitForElement(driver, editInputXpath);
    await editInput.sendKeys(Key.CONTROL + "a");
    await editInput.sendKeys(Key.DELETE);
    await editInput.sendKeys("7654321");
    await driver.sleep(300);
    await driver.findElement(By.css("div.ant-select-selector")).click();

    await driver.sleep(100);
    const options3 = await driver.findElements(
      By.css(".ant-select-item-option")
    );
    if (options3.length > 0) {
      await driver.executeScript(
        "arguments[0].scrollIntoView(true);",
        options3[0]
      );
      await options3[1].click();
    }
    await driver.sleep(100);

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div[3]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[2]/div/div/span"
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
    await driver.sleep(1000);
    // await driver.navigate().refresh();
    const activeBtnXpath =
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div[1]/div/div/div/div/div/div/table/tbody/tr[1]/td[3]/div/span[3]";
    await this._waitForElement(driver, activeBtnXpath);
    await driver.findElement(By.xpath(activeBtnXpath)).click();
    await driver.sleep(100);
    const deleteBtnXpath =
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div[1]/div/div/div/div/div/div/table/tbody/tr[1]/td[3]/div/span[2]";
    await this._waitForElement(driver, deleteBtnXpath);
    await driver.findElement(By.xpath(deleteBtnXpath)).click();
    await driver.sleep(100);
    const saveBtnXpath =
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[3]/div[2]/div/div[1]/div/div/div/div[2]/div/div/button[2]";
    await this._waitForElement(driver, saveBtnXpath);
    await driver.findElement(By.xpath(saveBtnXpath)).click();
    await driver.sleep(700);
  }
}

async function main() {
  let success = false;
  try {
    const test = new priceList();
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

module.exports = priceList;
