const { By } = require("selenium-webdriver");
const BaseArianTechScript = require("../../BaseArianScript/baseArianTechScript");

class CustomerGroupTest extends BaseArianTechScript {
  constructor() {
    super();
  }

  checkNameAfterAll() {
    return "افزودن شاخه اصلی";
  }

  setScriptName() {
    return "گروه مشتریان";
  }

  async implement(driver, dr) {
    // اجرای گام‌ها
    const steps = [
      "//div[@role='menuitem' and .//span[text()='فروش']]",
      "/html/body/div[3]/div[1]/div[2]/div[1]/div/div[3]/div/ul/li[4]/ul/li[1]",
      "//li[@role='menuitem' and .//span[text()='گروه مشتریان']]",
      "//button[.//span[text()='افزودن شاخه اصلی']]",
    ];

    for (const xpath of steps) {
      await driver.findElement(By.xpath(xpath)).click();
      await driver.sleep(100);
    }

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div[1]/div/div/div[2]/div/div/input"
        )
      )
      .sendKeys("تجهیزات شکار");
    await driver.sleep(1000);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div[2]/div/div/div/div/div/button"
        )
      )
      .click();
    await driver.sleep(1000);
    // await driver
    //   .findElement(
    //     By.xpath(
    //       "/html/body/div[3]/div/div[2]/div[1]/div[2]/div/div[3]/div/ul/li[4]/ul/li[1]/div/span[1]"
    //     )
    //   )
    //   .click();
    // await driver.sleep(700);
    await driver.navigate().refresh();
    ////ویرایش

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/span/input"
        )
      )
      .sendKeys("تجهیزات شکار");
    await driver.sleep(100);

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/div/div/div[3]/div/div/div/div/span[3]"
        )
      )
      .click();
    await driver.sleep(100);

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/div/div/div[3]/div/div/div/div/span[3]/span/div/div[2]/span[3]"
        )
      )
      .click();
    await driver.sleep(1000);
    await dr.ClickByText("span", "گروه کالا");
    await driver.sleep(1000);

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/div/form/div[1]/div/div[2]/div/div/div/div[1]/div/span/span[1]/input"
        )
      )
      .click();
    await driver.sleep(1000);
    const options4 = await driver.findElements(
      By.css(".ant-select-selection-search-input")
    );
    await dr.ClickByText("span", "مواد اولیه");
    await driver.sleep(100);

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/div/form/div[2]/div/div/div/div/div/button"
        )
      )
      .click();
    await driver.sleep(100);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[1]/div/div/div[2]/button"
        )
      )
      .click();
    await driver.sleep(300);

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/div/div/div[3]/div/div/div/div/span[3]/span/div/div[2]/span[3]"
        )
      )
      .click();
    await driver.sleep(300);
    await dr.ClickByText("span", "اعتبار گروه مشتریان");
    await driver.sleep(1000);

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/div/form/div[1]/div/div[2]/div/div/div/div/input"
        )
      )
      .sendKeys("10");
    await driver.sleep(100);

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/div/form/div[4]/div/div[2]/div/div/div/div[1]/div/span/span[1]/input"
        )
      )
      .click();
    await driver.sleep(100);
    const options8 = await driver.findElements(
      By.css(".ant-select-item-option")
    );
    if (options8.length > 0) {
      await driver.executeScript(
        "arguments[0].scrollIntoView(true);",
        options8[0]
      );
      await options8[0].click();
    }
    await driver.sleep(100);

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/div/form/div[5]/div/div/div/div/div/button"
        )
      )
      .click();
    await driver.sleep(100);

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[1]/div/div/div[2]/button"
        )
      )
      .click();
    await driver.sleep(100);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/div/div/div[3]/div/div/div/div/span[3]/span/div/div[2]/span[3]"
        )
      )
      .click();
    await driver.sleep(1000);

    await dr.ClickByText("span", "همکار فروش");
    await driver.sleep(300);

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/div/form/div[1]/div/div[2]/div/div/div/div[1]/div/span/span[1]/input"
        )
      )
      .click();
    await driver.sleep(100);
    const options = await driver.findElements(
      By.css(".ant-select-item-option")
    );
    if (options.length > 0) {
      await driver.executeScript(
        "arguments[0].scrollIntoView(true);",
        options[0]
      );
      await options[0].click();
    }
    await driver.sleep(100);

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/div/form/div[2]/div/div/div/div/div/button"
        )
      )
      .click();
    await driver.sleep(100);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[1]/div/div/div[2]/button"
        )
      )
      .click();
    await driver.sleep(300);

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/div/div/div[3]/div/div/div/div/span[3]/span/div/div[2]/span[3]"
        )
      )
      .click();
    await driver.sleep(1000);

    await dr.ClickByText("span", "تیم مارکتینگ");
    await driver.sleep(1000);

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/div/form/div[1]/div/div[2]/div/div/div/div[1]/div/span/span[1]/input"
        )
      )
      .click();
    await driver.sleep(100);
    const options2 = await driver.findElements(
      By.css(".ant-select-item-option")
    );
    if (options2.length > 0) {
      await driver.executeScript(
        "arguments[0].scrollIntoView(true);",
        options2[0]
      );
      await options2[0].click();
    }
    await driver.sleep(100);

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/div/form/div[2]/div/div/div/div/div/button"
        )
      )
      .click();
    await driver.sleep(100);

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[1]/div/div/div[2]/button"
        )
      )
      .click();
    await driver.sleep(100);
    //
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/div/div/div[3]/div/div/div/div/span[3]/span/div/div[2]/span[3]"
        )
      )
      .click();
    await driver.sleep(1000);
    await dr.ClickByText("span", "تیم فروش");
    await driver.sleep(1000);

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/div/form/div[1]/div/div[2]/div/div/div/div[1]/div/span/span[1]/input"
        )
      )
      .click();
    await driver.sleep(1000);
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
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/div/form/div[2]/div/div/div/div/div/button"
        )
      )
      .click();
    await driver.sleep(100);

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[1]/div/div/div[2]/button"
        )
      )
      .click();
    await driver.sleep(100);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/div/div/div[3]/div/div/div/div/span[3]/span/div/div[2]/span[3]"
        )
      )
      .click();
    await driver.sleep(1000);
    await dr.ClickByText("span", "روش پرداخت");
    await driver.sleep(1000);

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/div/form/div[1]/div/div[2]/div/div/div/div[1]/div/span/span[1]/input"
        )
      )
      .click();
    await driver.sleep(100);
    const options5 = await driver.findElements(
      By.css(".ant-select-item-option")
    );
    if (options5.length > 0) {
      await driver.executeScript(
        "arguments[0].scrollIntoView(true);",
        options5[0]
      );
      await options5[0].click();
    }
    await driver.sleep(100);

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/div/form/div[2]/div/div/div/div/div/button"
        )
      )
      .click();
    await driver.sleep(100);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[1]/div/div/div[2]/button"
        )
      )
      .click();
    await driver.sleep(300);

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/div/div/div[3]/div/div/div/div/span[3]/span/div/div[2]/span[3]"
        )
      )
      .click();
    await driver.sleep(1000);
    await dr.ClickByText("span", "تخصیص کالا");
    await driver.sleep(1000);

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/div/form/div[1]/div/div[2]/div/div/div/div[1]/div/span/span[1]/input"
        )
      )
      .click();
    await driver.sleep(100);
    const options7 = await driver.findElements(
      By.css(".ant-select-item-option")
    );
    if (options7.length > 0) {
      await driver.executeScript(
        "arguments[0].scrollIntoView(true);",
        options7[0]
      );
      await options7[0].click();
    }
    await driver.sleep(100);

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/div/form/div[2]/div/div/div/div/div/button"
        )
      )
      .click();
    await driver.sleep(100);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[1]/div/div/div[2]/button"
        )
      )
      .click();
    await driver.sleep(300);

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/div/div/div[3]/div/div/div/div/span[3]/span/div/div[2]/span[3]"
        )
      )
      .click();
    await driver.sleep(1000);

    await dr.ClickByText("span", "ارز");
    await driver.sleep(1000);

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/div/form/div[1]/div/div[2]/div/div/div/div[1]/div/span/span[1]/input"
        )
      )
      .click();
    await driver.sleep(100);
    const options6 = await driver.findElements(
      By.css(".ant-select-item-option")
    );
    if (options6.length > 0) {
      await driver.executeScript(
        "arguments[0].scrollIntoView(true);",
        options6[0]
      );
      await options6[0].click();
    }
    await driver.sleep(100);

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/div/form/div[2]/div/div/div/div/div/button"
        )
      )
      .click();
    await driver.sleep(100);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[1]/div/div/div[2]/button"
        )
      )
      .click();
    await driver.sleep(300);

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/div/div/div[3]/div/div/div/div/span[3]/span/div/div[2]/span[3]"
        )
      )
      .click();
    await driver.sleep(1000);

    await dr.ClickByText("span", "مالیات");
    await driver.sleep(1000);

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/div/form/div[1]/div/div[2]/div/div/div/div[1]/div/span/span[1]/input"
        )
      )
      .click();
    await driver.sleep(100);
    const options3 = await driver.findElements(
      By.css(".ant-select-item-option")
    );
    if (options3.length > 0) {
      await driver.executeScript(
        "arguments[0].scrollIntoView(true);",
        options3[0]
      );
      await options3[0].click();
    }
    await driver.sleep(100);

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/div/form/div[2]/div/div/div/div/div/button"
        )
      )
      .click();
    await driver.sleep(100);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[1]/div/div/div[2]/button"
        )
      )
      .click();
    await driver.sleep(300);
  }
}

async function main() {
  let success = false;
  try {
    const test = new CustomerGroupTest();
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

module.exports = CustomerGroupTest;
