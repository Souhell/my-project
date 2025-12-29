const { By, until, Key } = require("selenium-webdriver");
const BaseArianTechScript = require("../../BaseArianScript/baseArianTechScript");

class DiscountTest extends BaseArianTechScript {
  constructor() {
    super();
  }

  checkNameAfterAll() {
    return "افزودن مورد جدید";
  }

  setScriptName() {
    return "تخفیفات";
  }

  async implement(driver, dr) {
    // اجرای گام‌ها
    const steps = [
      "//div[@role='menuitem' and .//span[text()='فروش']]",
      "//div[@role='menuitem' and .//span[text()='عملیات']]",
      "//li[@role='menuitem' and .//span[text()='تخفیفات']]",
      "//button[.//div[text()='افزودن مورد جدید']]",
    ];

    for (const xpath of steps) {
      await driver.findElement(By.xpath(xpath)).click();
      await driver.sleep(1000);
    }

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/form/div[1]/div/div[2]/div/div/input"
        )
      )
      .sendKeys("تست");
    await driver.sleep(1000);

    await this._selectFromDropdown(
      driver,
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/form/div[2]/div/div/div[2]/div/div/div/div/div[1]/div/span/span[1]/input",
      null,
      0
    );
    await driver.sleep(1000);

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/form/div[3]/div/div[2]/div/div/div/label[1]"
        )
      )
      .click();
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/form/div[4]/div/div[2]/div/div/div/div/input"
        )
      )
      .sendKeys("10");
    await driver.sleep(1000);

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/form/div[5]/div/div[2]/div/div/div/div/input"
        )
      )
      .sendKeys("100");
    await driver.sleep(1000);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/form/div[7]/div/div/div/div/div/div[1]/label"
        )
      )
      .click();
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/form/div[7]/div/div/div/div/div/div[2]/div[1]/button"
        )
      )
      .click();
    await driver.sleep(1000);
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
    //ویرایش
    // async function clearAndType(driver, xpath, text) {
    //   const element = await waitForElement(driver, xpath);
    //   await element.click();
    //   await element.sendKeys(Key.CONTROL + "a");
    //   await element.sendKeys(Key.DELETE);
    //   await element.sendKeys(text);
    // }
    // const editBtnXpath = "//span[@aria-label='ویرایش']";
    // await waitForElement(driver, editBtnXpath);
    // await driver.findElement(By.xpath(editBtnXpath)).click();
    // await driver.sleep(100);
    // await driver
    //   .findElement(
    //     By.xpath(
    //       "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/form/div[1]/div/div[2]/div/div/input"
    //     )
    //   )
    //   .sendKeys("تست");

    //حذف
    const activeBtnXpath = "(//table//tr[1]//span[button[@role='switch']])[1]";
    await this._waitForElement(driver, activeBtnXpath);
    await driver.findElement(By.xpath(activeBtnXpath)).click();
    await driver.sleep(100);
    const deleteBtnXpath = "//span[@aria-label='حذف']";
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
    const test = new DiscountTest();
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

module.exports = DiscountTest;
