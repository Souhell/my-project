const { By, until, Key } = require("selenium-webdriver");
const BaseArianTechScript = require("../../BaseArianScript/baseArianTechScript");
// const baseHelper = require("../../BaseArianScript/baseHelper");
// const { send } = require("process");

class returnSalesInvoiceList extends BaseArianTechScript {
  constructor() {
    super();
  }

  checkNameAfterAll() {
    return "افزودن مورد جدید";
  }

  setScriptName() {
    return "بازگشت فروش";
  }

  async implement(driver, dr) {
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
    const goodsInput3 = await driver.findElement(
      By.xpath(
        "/html/body/div[3]/div[1]/div[2]/div[2]/div[2]/div/div[2]/div/div/div[1]/form/div[3]/div/div[2]/div/div/div/div[1]/div/span/span[1]/input"
      )
    );
    await goodsInput3.click();
    await goodsInput3.sendKeys("علی محمدیان");
    await driver.sleep(300);
    await goodsInput3.sendKeys(Key.ENTER);
    await driver.sleep(300);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[1]/form/div[4]/div/div[2]/div/div/input"
        )
      )
      .sendKeys("شرح1");
    await driver.sleep(1000);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div[1]/div[2]/div[2]/div[2]/div/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[3]/span/span"
        )
      )
      .click();

    const goodsInput1 = await driver.findElement(By.id("GoodsId"));
    await goodsInput1.click();
    await goodsInput1.sendKeys("1");
    await driver.sleep(300);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div[1]/div[2]/div[2]/div[2]/div/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[4]/span/span"
        )
      )
      .click();
    const feeInput9 = await driver.findElement(By.id("UnitId"));
    await feeInput9.click();
    await feeInput9.sendKeys("تن11");
    await driver.sleep(1000);
    await driver.findElement(By.id("Quantity")).sendKeys("100");
    await driver.sleep(1000);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[1]/div/div[2]/div"
        )
      )
      .click();
    await driver.sleep(700);
    //
  }
}

async function main() {
  let success = false;
  try {
    const test = new returnSalesInvoiceList();
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

module.exports = returnSalesInvoiceList;
