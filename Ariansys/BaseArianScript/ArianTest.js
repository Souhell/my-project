const { By } = require("selenium-webdriver");
const BaseArianTechScript = require("./baseArianTechScript");

class LoginTest extends BaseArianTechScript {
  constructor() {
    super();
    this.nationalId = "1234567890";
  }

  checkNameAfterAll() {
    return "افزودن مورد جدید";
  }

  setScriptName() {
    return "تیم مارکتینگ";
  }

  async implement(driver, dr) {
    console.log("اومدم تو implement");

    const steps = [
      "//div[@role='menuitem' and .//span[text()='فروش']]",
      "/html/body/div[3]/div/div[2]/div[1]/div/div[3]/div/ul/li[4]/ul/li[1]/div",
      "//li[@role='menuitem' and .//span[text()='تیم مارکتینگ']]",
      "//button[.//div[text()='افزودن مورد جدید']]",
    ];

    for (const xpath of steps) {
      try {
        const element = await driver.findElement(By.xpath(xpath));
        await element.click();
        await driver.sleep(100);
        console.log(`${xpath} پیدا شد و کلیک شد`);
      } catch (error) {
        console.error(`خطا در یافتن المان: ${xpath}`, error);
        throw error;
      }
    }

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[1]/div/div[2]/div[1]/div/input"
        )
      )
      .sendKeys(this.nationalId);

    await driver.sleep(100);

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[2]/div/div[2]/div[1]/div/div/div/input"
        )
      )
      .sendKeys("110");

    await driver.sleep(100);

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[1]/div/div[2]/div"
        )
      )
      .click();

    await driver.sleep(700);
  }
}

async function main() {
  let success = false;
  try {
    const test = new LoginTest();
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

module.exports = LoginTest;
