const { By, until, Key } = require("selenium-webdriver");
const BaseArianTechScript = require("../../BaseArianScript/baseArianTechScript");
const { generateNationalId } = require("../../customerDriver");
const baseHelper = require("../../BaseArianScript/baseHelper");

class saleTeamListTest extends BaseArianTechScript {
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
      "//li[@role='menuitem' and .//span[text()='تیم فروش']]",
      "//button[.//div[text()='افزودن مورد جدید']]",
    ];

    for (const xpath of steps) {
      await driver.findElement(By.xpath(xpath)).click();
      await driver.sleep(100);
    }
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[1]/div/div[2]/div[1]/div/input"
        )
      )
      .sendKeys(baseHelper._generateNationalId());
    await driver.sleep(100);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[2]/div/div[2]/div[1]/div/div/div/input"
        )
      )
      .sendKeys(10);
    await driver.sleep(100);

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[1]/div/div[2]/div"
        )
      )
      .click();
    await driver.findElement(By.xpath("//div[@id='reload']")).click();
    await driver.sleep(1000);

    await driver.findElement(By.xpath("//span[@aria-label='ویرایش']")).click();
    await driver.sleep(100);
    await this._clearAndType(
      driver,
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[1]/div/div[2]/div[1]/div/input",
      "7654321"
    );
    await driver.sleep(100);
    await this._clearAndType(
      driver,
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[2]/div/div[2]/div[1]/div/div/div/input",
      "20"
    );
    await driver.sleep(100);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[1]/div/div[2]/div"
        )
      )
      .click();
    await driver.sleep(100);
    const personBtnXpath = "//span[@aria-label='نام اشخاص تیم فروش']";
    await this._waitForElement(driver, personBtnXpath);
    await driver.findElement(By.xpath(personBtnXpath)).click();
    await driver.sleep(300);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div[1]/div[2]/div[2]/div[2]/div/div[3]/div[2]/div/div[1]/div/div/div[2]/div[2]/div/form/div[1]/div/div[2]/div/div/div/div[1]/div/span/span[1]/input"
        )
      )
      .click();
    await driver.sleep(100);
    const options = await driver.findElements(
      By.css(".ant-select-item-option")
    );
    if (options.length > 1) {
      await driver.executeScript(
        "arguments[0].scrollIntoView(true);",
        options[1]
      );
      await options[1].click();
    }
    await driver.sleep(100);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div[1]/div[2]/div[2]/div[2]/div/div[3]/div[2]/div/div[1]/div/div/div[2]/div[2]/div/form/div[2]/div/div[2]/div/div/div/div/input"
        )
      )
      .sendKeys("10");

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div[1]/div[2]/div[2]/div[2]/div/div[3]/div[2]/div/div[1]/div/div/div[2]/div[2]/div/form/div[3]/div/div/div/div/div/button"
        )
      )
      .click();
    await driver.sleep(700);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div[1]/div[2]/div[2]/div[2]/div/div[3]/div[2]/div/div[1]/div/div/div[2]/div[2]/div/div[2]/div/div/div/div/div/table/tbody/tr/td[3]/div/span[2]"
        )
      )
      .click();

    await driver.sleep(100);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div[1]/div[2]/div[2]/div[2]/div/div[3]/div[2]/div/div[1]/div/div/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div/div[2]/div/div/button[2]"
        )
      )
      .click();
    await driver.sleep(700);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div[1]/div[2]/div[2]/div[2]/div/div[3]/div[2]/div/div[1]/div/div/div[1]/div/div/div[2]/button"
        )
      )
      .click();
    await driver.sleep(700);

    await driver.findElement(By.xpath("//div[@id='reload']")).click();
    await driver.sleep(300);
    const activeBtnXpath = "(//table//tr[1]//span[button[@role='switch']])[1]";
    await this._waitForElement(driver, activeBtnXpath);
    await driver.findElement(By.xpath(activeBtnXpath)).click();
    await driver.sleep(700);
    await driver.findElement(By.xpath("//div[@id='reload']")).click();
    await driver.sleep(300);
    const deleteBtnXpath = "//span[@aria-label='حذف']";
    await this._waitForElement(driver, deleteBtnXpath);
    await driver.findElement(By.xpath(deleteBtnXpath)).click();
    await driver.sleep(100);
    const saveBtnXpath =
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[3]/div[2]/div/div[1]/div/div/div/div[2]/div/div/button[2]";
    await this._waitForElement(driver, saveBtnXpath);
    await driver.findElement(By.xpath(saveBtnXpath)).click();

    await driver.sleep(1000);
  }
}

async function main() {
  let success = false;
  try {
    const test = new saleTeamListTest();
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

module.exports = saleTeamListTest;
