const { By } = require("selenium-webdriver");
const BaseArianTechScript = require("../../BaseArianScript/baseArianTechScript");
const baseHelper = require("../../BaseArianScript/baseHelper");
class accountTest extends BaseArianTechScript {
  constructor() {
    super();
  }

  checkNameAfterAll() {
    return "افزودن شاخه اصلی";
  }

  setScriptName() {
    return "درخت حسابداری";
  }

  async implement(driver, dr) {
    const steps = [
      "//div[@role='menuitem' and .//span[text()='حسابداری']]",
      "/html/body/div[3]/div[1]/div[2]/div[1]/div/div[3]/div/ul/li[2]/ul/li[1]",
      "//li[@role='menuitem' and .//span[text()='سرفصل حسابها']]",
      "//button[.//span[text()='افزودن شاخه اصلی']]",
    ];

    for (const xpath of steps) {
      await this._safeClick(driver, xpath);
      await driver.sleep(500); // افزایش زمان انتظار
    }

    // پر کردن فیلدهای کد ملی
    await this._clearAndType(
      driver,
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div[1]/div[1]/div/div[2]/div/div/input",
      baseHelper._generateNationalId()
    );

    await this._clearAndType(
      driver,
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div[1]/div[3]/div/div[2]/div/div/input",
      1234
    );

    // انتخاب از dropdown اول
    await this._selectFromDropdown(
      driver,
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div[1]/div[2]/div/div[2]/div/div/div/div[1]/div/span/span[1]/input",
      null,
      1
    );

    // کلیک روی دکمه جستجو
    await this._safeClick(
      driver,
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div[2]/div/div/div/div/div/button"
    );
    await driver.sleep(2000);
    await this._safeClick(
      driver,
      "/html/body/div[3]/div[1]/div[2]/div[2]/div[2]/div/div[2]/span"
    );
    await driver.sleep(2000);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div[1]/div[2]/div[2]/div[2]/div/div[2]/span/input"
        )
      )
      .sendKeys("1234");

    await driver.sleep(2000);

    ///ویرایش - منوی سه نقطه
    // await this._safeClick(
    //   driver,
    //   "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/div/div/div[3]/div/div/div/div/span[2]"
    // );
    // await driver.sleep(1000);
    // await this._safeClick(
    //   driver,
    //   "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/div/div/div[3]/div/div/div/div[2]/span[2]"
    // );
    // await driver.sleep(1000);
    await this._safeClick(
      driver,
      "/html/body/div[3]/div[1]/div[2]/div[2]/div[2]/div/div[2]/div/div/div[3]/div/div/div/div/span[3]"
    );
    await driver.sleep(1000);

    // گزینه ویرایش از منو
    await this._safeClick(
      driver,
      "/html/body/div[3]/div[1]/div[2]/div[2]/div[2]/div/div[2]/div/div/div[3]/div/div/div/div/span[3]/span/div/div[2]/span[2]"
    );
    await driver.sleep(1000);

    // ویرایش فیلدها
    await this._clearAndType(
      driver,
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div[1]/div[1]/div/div[2]/div/div/input",
      "12345677"
    );

    await this._clearAndType(
      driver,
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div[1]/div[3]/div/div[2]/div/div/input",
      baseHelper._generateNationalId()
    );
    await this._selectFromDropdown(
      driver,
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div[1]/div[2]/div/div[2]/div/div/div/div[1]/div/span/span[1]/input",
      null,
      2
    );
    // await this._safeClick(
    //   driver,
    //   "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div[2]/div[1]/div[1]/div/div/div/div/label/span[1]"
    // );
    // await this._safeClick(
    //   driver,
    //   "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div[2]/div[1]/div[2]/div/div/div/div/label/span[1]"
    // );
    // await this._safeClick(
    //   driver,
    //   "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div[2]/div[1]/div[3]/div/div/div/div/label/span[1]"
    // );
    // await this._safeClick(
    //   driver,
    //   "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div[2]/div[2]/div[1]/div/div/div/div/label/span[1]"
    // );
    // await this._safeClick(
    //   driver,
    //   "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div[2]/div[2]/div[2]/div/div/div/div/label/span[1]"
    // );
    // await this._safeClick(
    //   driver,
    //   "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div[2]/div[2]/div[3]/div/div/div/div/label/span[1]"
    // );
    // await this._safeClick(
    //   driver,
    //   "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div[2]/div[2]/div[4]/div/div/div/div/label/span[1]"
    // );
    await this._safeClick(
      driver,
      "/html/body/div[3]/div[1]/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div[2]/div/div/div/div/div/button"
    );
    await driver.sleep(2000);
    // انتخاب از dropdown در حالت ویرایش
    // const editDropdownXpath =
    //   "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div[1]/div[2]/div/div[2]/div/div/div/div[1]";
    // await this._selectFromDropdown(driver, editDropdownXpath, null, 2);

    // await driver.sleep(100);

    // ذخیره تغییرات
    // await this._safeClick(
    //   driver,
    //   "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div[3]/div/div/div/div/div/button"
    // );
    // await driver.sleep(2000);

    ////اکتیو کردن
    await this._safeClick(
      driver,
      "/html/body/div[3]/div[1]/div[2]/div[2]/div[2]/div/div[2]/div/div/div[3]/div/div/div/div/span[2]"
    );
    await driver.sleep(1000);

    // گزینه ویرایش از منو
    // await this._safeClick(
    //   driver,
    //   "/html/body/div[3]/div[1]/div[2]/div[2]/div[2]/div/div[2]/div/div/div[3]/div/div/div/div/span[3]/span/div/div[2]/span[2]"
    // );
    // await driver.sleep(1000);
    await this._safeClick(
      driver,
      "/html/body/div[3]/div[1]/div[2]/div[2]/div[2]/div/div[2]/div/div/div[3]/div/div/div/div[2]/span[3]"
    );
    await driver.sleep(1000);
    //حذف
    await this._safeClick(
      driver,
      "/html/body/div[3]/div[1]/div[2]/div[2]/div[2]/div/div[2]/div/div/div[3]/div/div/div/div[2]/span[3]/span/div/div[2]/span[5]"
    );
    await driver.sleep(1000);
    await this._safeClick(
      driver,
      "/html/body/div[3]/div[1]/div[2]/div[2]/div[2]/div/div[2]/div/div/div[3]/div/div/div/div[2]/span[3]/span/div/div[2]/span[4]"
    );
    await driver.sleep(1000);

    // تایید حذف
    await this._safeClick(
      driver,
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div/div[2]/div/div/button[2]"
    );
    await driver.sleep(2000);
    await this._safeClick(
      driver,
      "/html/body/div[3]/div[1]/div[2]/div[2]/div[2]/div/div[2]/div/div/div[3]/div/div/div/div/span[3]"
    );
    await driver.sleep(1000);
    await this._safeClick(
      driver,
      "/html/body/div[3]/div[1]/div[2]/div[2]/div[2]/div/div[2]/div/div/div[3]/div/div/div/div/span[3]/span/div/div[2]/span[4]"
    );
    await driver.sleep(1000);

    // تایید حذف
    await this._safeClick(
      driver,
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div/div[2]/div/div/button[2]"
    );
    await driver.sleep(2000);
    // تایید حذف
  }
}

async function main() {
  let success = false;
  try {
    const test = new accountTest();
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

module.exports = accountTest;
