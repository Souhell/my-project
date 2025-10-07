const { Builder, By, until, Key, Actions } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const fs = require("fs");
const path = require("path");
const customDriver = require("../../customerDriver");

const colors = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  reset: "\x1b[0m",
};

async function tanzimat() {
  // تولید کد ملی با متد customerDriver
  const nationalId = customDriver.generateNationalId();
  console.log("کد ملی تولید شده:", nationalId);

  // ساخت درایور با اکتیو بودن نوتیفیکیشن و ری‌استور persist
  let dr = new customDriver();
  const url = "https://frontbuild.ariansystemdp.local/fa";
  let driver = await dr.createDriver(url, true);

  try {
    // لاگین با متد customerDriver
    await dr.login();

    // اجرای گام‌ها
    const steps = [
      "/html/body/div[3]/div/div[2]/div[1]/div[2]/div/div[3]/div/ul/li[1]",
      "/html/body/div[3]/div/div[2]/div[1]/div[2]/div/div[3]/div/ul/li[1]/ul/li[2]",
      "/html/body/div[3]/div/div[2]/div[1]/div[2]/div/div[3]/div/ul/li[1]/ul/li[2]/ul/li[1]",
      // "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[1]/div/button[3]",
    ];

    for (const xpath of steps) {
      await driver.findElement(By.xpath(xpath)).click();
      await driver.sleep(1000);
    }
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
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/div/div[3]/div/div/div/div/span[3]/span/div/span"
        )
      )
      .click();
    await driver.sleep(100);
    // انتخاب گزینه اول
    //     await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[2]/div/div[2]/div[1]/div/div/div[1]/div/span/span[1]/input")).click();
    //     await driver.sleep(100);
    //     const options = await driver.findElements(By.css('.ant-select-item-option'));
    //     if (options.length > 1) {
    //         await driver.executeScript("arguments[0].scrollIntoView(true);", options[1]);
    //         await options[1].click();
    //     }
    // await driver.sleep(100);


    // await driver
    //   .findElement(
    //     By.xpath(
    //       "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[2]/div/div[2]/div[1]/div/div/div/input"
    //     )
    //   )
    //   .sendKeys(10);
    // await driver.sleep(100);

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/div/div[3]/div/div/div/div/span[3]/span/div/div/span[3]"
        )
      )
      .click();
    await driver.sleep(1000);

    await dr.ClickByText("span", "همکار فروش");
    await driver.sleep(1000);

    await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/div/form/div[1]/div/div[2]/div/div/div/div[1]/div/span/span[1]/input")).click();
    await driver.sleep(100);
    const options = await driver.findElements(By.css('.ant-select-item-option'));
    if (options.length > 0) {
      await driver.executeScript("arguments[0].scrollIntoView(true);", options[0]);
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
    await driver.sleep(100);
    //

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/div/div[3]/div/div/div/div/span[3]/span/div/div/span[3]"
        )
      )
      .click();
    await driver.sleep(1000);

    await dr.ClickByText("span", "تیم فروش");
    await driver.sleep(1000);

    await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/div/form/div[1]/div/div[2]/div/div/div/div[1]/div/span/span[1]/input")).click();
    await driver.sleep(1000);
    const option1 = await driver.findElements(By.css('.ant-select-item-option'));
    if (option1.length > 0) {
      await driver.executeScript("arguments[0].scrollIntoView(true);", option1[0]);
      await option1[0].click();
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
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/div/div[3]/div/div/div/div/span[3]/span/div/div/span[3]"
        )
      )
      .click();
    await driver.sleep(1000);

    await dr.ClickByText("span", "تیم مارکتینگ");
    await driver.sleep(1000);

    await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/div/form/div[1]/div/div[2]/div/div/div/div[1]/div/span/span[1]/input")).click();
    await driver.sleep(100);
    const options2 = await driver.findElements(By.css('.ant-select-item-option'));
    if (options2.length > 0) {
      await driver.executeScript("arguments[0].scrollIntoView(true);", options2[0]);
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
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/div/div[3]/div/div/div/div/span[3]/span/div/div/span[3]"
        )
      )
      .click();
    await driver.sleep(1000);

    await dr.ClickByText("span", "مالیات گروه کالا");
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
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/div/form/div[2]/div/div[2]/div/div/div/div/input"
        )
      )
      .sendKeys("10");
    await driver.sleep(100);



    await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/div/form/div[4]/div/div[2]/div/div/div/div[1]/div/span/span[1]/input")).click();
    await driver.sleep(100);
    const options3 = await driver.findElements(By.css('.ant-select-item-option'));
    if (options3.length > 0) {
      await driver.executeScript("arguments[0].scrollIntoView(true);", options3[0]);
      await options3[0].click();
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

    let bodyText = await driver.findElement(By.css("body")).getText();
    if (bodyText.includes("آرین")) {
      console.log(`${colors.green}ok Aryan ${colors.reset}`);
    } else {
      console.log(`${colors.red}not ok Aryan ${colors.reset}`);
    }
  } catch (err) {
    console.error("❌ خطا:", err);
  } finally {
    await driver.quit();
  }
}

tanzimat();
module.exports = tanzimat;