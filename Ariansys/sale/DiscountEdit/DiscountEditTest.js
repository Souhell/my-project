const { By, Key } = require("selenium-webdriver");
const BaseArianTechScript = require("../../BaseArianScript/baseArianTechScript");

class DiscountEditTest extends BaseArianTechScript {
  constructor() {
    super();
  }

  checkNameAfterAll() {
    return "افزودن مورد جدید";
  }

  setScriptName() {
    return "ادیت تخفیفات";
  }

  async implement(driver, dr) {
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

    await this._clearAndType(
      driver,
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/form/div[1]/div/div[2]/div/div/input",
      "تست1"
    );

    await this._selectFromDropdown(
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

    await this._clearAndType(
      driver,
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/form/div[4]/div/div[2]/div/div/div/div/input",
      "20"
    );
    await driver.sleep(1000);

    await this._clearAndType(
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

    await this._selectFromDropdown(
      driver,
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/form/div[8]/div/div[2]/div/div/div/div[1]/div",
      null,
      0
    );
    await driver.sleep(1000);
    await this._selectFromDropdown(
      driver,
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/form/div[9]/div/div[2]/div/div/div/div[1]/div",
      null,
      0
    );
    await driver.sleep(1000);
    await this._selectFromDropdown(
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
  }
}

async function main() {
  let success = false;
  try {
    const test = new DiscountEditTest();
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

module.exports = DiscountEditTest;
