const { By, Key, until } = require("selenium-webdriver");
const BaseArianTechScript = require("../../BaseArianScript/baseArianTechScript");
const baseHelper = require("../../BaseArianScript/baseHelper");
class pricingCircularTest extends BaseArianTechScript {
  constructor() {
    super();
  }

  checkNameAfterAll() {
    return "افزودن مورد جدید";
  }

  setScriptName() {
    return "قیمت گذاری";
  }

  async implement(driver, dr) {
    const steps = [
      "//div[@role='menuitem' and .//span[text()='فروش']]",
      "//div[@role='menuitem' and .//span[text()='عملیات']]",
      "//li[@role='menuitem' and .//span[text()='قیمت گذاری']]",
      "//button[.//div[text()='افزودن مورد جدید']]",
    ];

    for (const xpath of steps) {
      await driver.findElement(By.xpath(xpath)).click();
      await driver.sleep(300);
    }

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div[1]/div[2]/div[2]/div[2]/div/div[2]/div/div/div[1]/form/div[1]/div/div[2]/div/div/input"
        )
      )
      .sendKeys("تست");
    await driver.sleep(300);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div[1]/div[2]/div[2]/div[2]/div/div[2]/div/div/div[1]/form/div[2]/div/div[2]/div/div/button/div/div/div/div[1]/div"
        )
      )
      .click();

    await this._selectFromDropdown(
      driver,
      "/html/body/div[3]/div[1]/div[2]/div[2]/div[2]/div/div[2]/div/div/div[1]/form/div[3]/div/div[2]/div/div/div/div[1]/div/span/span[1]/input",
      null,
      0
    );
    await driver.sleep(300);

    // await driver
    //   .findElement(
    //     By.xpath(
    //       "/html/body/div[3]/div[1]/div[2]/div[2]/div[2]/div/div[2]/div/div/div[1]/form/div[5]/div/div[1]/label"
    //     )
    //   )
    //   .click();
    // await driver.sleep(300);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div[1]/div[2]/div[2]/div[2]/div/div[2]/div/div/div[1]/form/div[5]/div/div[2]/div[1]/button"
        )
      )
      .click();
    await driver.sleep(300);
    const todayButton = await driver.wait(
      until.elementLocated(
        By.xpath("//button[normalize-space(text())='انتخاب امروز']")
      ),
      700
    );
    await driver.wait(until.elementIsVisible(todayButton), 700);

    await driver.executeScript(
      "arguments[0].scrollIntoView(true);",
      todayButton
    );
    await driver.sleep(300);

    await driver.executeScript("arguments[0].click();", todayButton);

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div[1]/div[2]/div[2]/div[2]/div/div[2]/div/div/div[3]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[3]/span/span"
        )
      )
      .click();
    await driver.sleep(300);
    const goodsInput1 = await driver.findElement(By.id("GoodsId"));
    await goodsInput1.click();
    await goodsInput1.sendKeys("new goods");
    await driver.sleep(700);
    await goodsInput1.sendKeys(Key.ENTER);
    await driver.sleep(300);

    const goodsInput = await driver.findElement(By.id("CurrencyId"));
    await goodsInput.click();
    await driver.sleep(300);
    await goodsInput.sendKeys(Key.ENTER);
    await driver.sleep(300);
    const goodsInput2 = await driver.findElement(By.id("Price"));
    await goodsInput2.click();
    await driver.sleep(300);
    await goodsInput2.sendKeys("100"); // ✅ ابتدا عدد
    await driver.sleep(700);
    // await goodsInput2.sendKeys(Key.ENTER); // ✅ سپس ENTER
    // await driver.sleep(300);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[1]/div/div[2]/div"
        )
      )
      .click();
    await driver.sleep(700);
    // ویرایش;

    const editBtnXpath = "//span[@aria-label='ویرایش']";
    await this._waitForElement(driver, editBtnXpath);
    await driver.findElement(By.xpath(editBtnXpath)).click();
    await driver.sleep(100);
    await this._clearAndType(
      driver,
      "/html/body/div[3]/div[1]/div[2]/div[2]/div[2]/div/div[2]/div/div/div[1]/form/div[1]/div/div[2]/div/div/input",
      "تست1"
    );
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div[1]/div[2]/div[2]/div[2]/div/div[2]/div[1]/div/div[1]/form/div[2]/div/div[2]/div/div/button"
        )
      )
      .click();
    await driver.sleep(300);
    const todayButton1 = await driver.wait(
      until.elementLocated(
        By.xpath("//button[normalize-space(text())='انتخاب امروز']")
      ),
      1000
    );
    await driver.wait(until.elementIsVisible(todayButton1), 1000);

    await driver.executeScript(
      "arguments[0].scrollIntoView(true);",
      todayButton1
    );
    await driver.sleep(300);

    await driver.executeScript("arguments[0].click();", todayButton1);
    await this._selectFromDropdown(
      driver,
      "/html/body/div[3]/div[1]/div[2]/div[2]/div[2]/div/div[2]/div[1]/div/div[1]/form/div[3]/div/div[2]/div/div/div/div[1]",
      null,
      1
    );
    await driver.sleep(700);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div[1]/div[2]/div[2]/div[2]/div/div[2]/div[1]/div/div[1]/form/div[5]/div/div[1]/label"
        )
      )
      .click();
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div[1]/div[2]/div[2]/div[2]/div/div[2]/div[1]/div/div[1]/form/div[6]/div/div[1]/label"
        )
      )
      .click();
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div[1]/div[2]/div[2]/div[2]/div/div[2]/div[1]/div/div[1]/form/div[6]/div/div[2]/div[1]/button"
        )
      )
      .click();
    const todayButton2 = await driver.wait(
      until.elementLocated(
        By.xpath("//button[normalize-space(text())='انتخاب امروز']")
      ),
      1000
    );
    await driver.wait(until.elementIsVisible(todayButton2), 1000);

    await driver.executeScript(
      "arguments[0].scrollIntoView(true);",
      todayButton2
    );
    await driver.sleep(300);

    await driver.executeScript("arguments[0].click();", todayButton2);
    await driver.sleep(300);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div[1]/div[2]/div[2]/div[2]/div/div[2]/div[1]/div/div[1]/form/div[6]/div/div[2]/div[2]/button"
        )
      )
      .click();
    await driver.sleep(300);
    await driver
      .findElement(By.xpath("/html/body/div[5]/div[2]/button[1]"))
      .click();
    await driver.sleep(300);
    await driver
      .findElement(By.xpath("/html/body/div[5]/div[2]/button[2]"))
      .click();
    await driver.sleep(300);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div[1]/div[2]/div[2]/div[2]/div/div[2]/div[1]/div/div[3]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[2]/div/div/span/button"
        )
      )
      .click();
    await driver.sleep(300);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[1]/div/div[2]/div"
        )
      )
      .click();
    await driver.sleep(300);
    // حذف;
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
    const test = new pricingCircularTest();
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

module.exports = pricingCircularTest;
