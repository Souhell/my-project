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

async function sherkatha() {
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
      "/html/body/div[3]/div/div[2]/div[1]/div[2]/div/div[3]/div/ul/li[1]/ul/li[3]",
      "/html/body/div[3]/div/div[2]/div[1]/div[2]/div/div[3]/div/ul/li[1]/ul/li[3]/ul/li[1]",
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[1]/div/button[3]",
    ];

    for (const xpath of steps) {
      await driver.findElement(By.xpath(xpath)).click();
      await driver.sleep(100);
    }
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div[1]/div/div[2]/div/div/div/label[1]"
        )
      )
      .click();
    await driver.sleep(100);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div[2]/div/div[2]/div/div/input"
        )
      )
      .sendKeys("11228");
    await driver.sleep(1000);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div[3]/div/div[2]/div/div/input"
        )
      )
      .sendKeys("aaa");
    await driver.sleep(100);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div[4]/div[1]/div/div[2]/div/div/input"
        )
      )
      .sendKeys("aaa");
    await driver.sleep(100);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div[4]/div[2]/div/div[2]/div/div/input"
        )
      )
      .sendKeys("11229");
    await driver.sleep(100);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div[4]/div[3]/div/div[2]/div/div/input"
        )
      )
      .sendKeys("1111111111");
    await driver.sleep(100);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div[4]/div[4]/div/div[2]/div/div/button/div/div/div/div[2]/div/div"
        )
      )
      .click();
    await driver.sleep(100);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div[4]/div[5]/div[1]/div[2]/div[1]/div/input"
        )
      )
      .sendKeys("1111111111");
    await driver.sleep(100);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div[4]/div[6]/div/div[2]/div/div/input"
        )
      )
      .sendKeys("1");
    await driver.sleep(100);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div[4]/div[7]/div/div[2]/div/div/input"
        )
      )
      .sendKeys("09111111111");
    await driver.sleep(100);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div[4]/div[8]/div/div[2]/div/div/input"
        )
      )
      .sendKeys("1");
    await driver.sleep(100);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div[5]/div/div/div/div/div/button"
        )
      )
      .click();
    await driver.sleep(100);
    ////ویرایش
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/div/div/div[3]/div/div/div/div[2]/span[3]"
        )
      )
      .click();
    await driver.sleep(100);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/div/div/div[3]/div/div/div/div[2]/span[3]/span/div/div[2]/span[3]/button"
        )
      )
      .click();
    await driver.sleep(100);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div[1]/div/div[2]/div/div/div/label[2]"
        )
      )
      .click();
    await driver.sleep(100);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div[2]/div/div[2]/div/div/input"
        )
      )
      .sendKeys(Key.CONTROL + "a");
    await driver.sleep(1000);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div[2]/div/div[2]/div/div/input"
        )
      )
      .sendKeys(Key.DELETE);
    await driver.sleep(1000);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div[2]/div/div[2]/div/div/input"
        )
      )
      .sendKeys("11229");
    await driver.sleep(1000);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div[3]/div/div[2]/div/div/input"
        )
      )
      .sendKeys(Key.CONTROL + "a");
    await driver.sleep(100);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div[3]/div/div[2]/div/div/input"
        )
      )
      .sendKeys(Key.DELETE);
    await driver.sleep(100);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div[3]/div/div[2]/div/div/input"
        )
      )
      .sendKeys("bbb");
    await driver.sleep(100);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div[4]/div[1]/div/div[2]/div/div/input"
        )
      )
      .sendKeys(Key.CONTROL + "a");
    await driver.sleep(100);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div[4]/div[1]/div/div[2]/div/div/input"
        )
      )
      .sendKeys(Key.DELETE);
    await driver.sleep(100);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div[4]/div[1]/div/div[2]/div/div/input"
        )
      )
      .sendKeys("bbb");
    await driver.sleep(100);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div[4]/div[2]/div/div[2]/div/div/input"
        )
      )
      .sendKeys(Key.CONTROL + "a");
    await driver.sleep(100);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div[4]/div[2]/div/div[2]/div/div/input"
        )
      )
      .sendKeys(Key.DELETE);
    await driver.sleep(100);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div[4]/div[2]/div/div[2]/div/div/input"
        )
      )
      .sendKeys("11229");
    await driver.sleep(100);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div[4]/div[3]/div/div[2]/div/div/input"
        )
      )
      .sendKeys(Key.CONTROL + "a");
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div[4]/div[3]/div/div[2]/div/div/input"
        )
      )
      .sendKeys(Key.DELETE);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div[4]/div[3]/div/div[2]/div/div/input"
        )
      )
      .sendKeys("09222222222");
    await driver.sleep(100);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div[4]/div[4]/div/div[2]/div/div/input"
        )
      )
      .sendKeys(Key.CONTROL + "a");
    await driver.sleep(100);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div[4]/div[4]/div/div[2]/div/div/input"
        )
      )
      .sendKeys(Key.DELETE);
    await driver.sleep(100);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div[4]/div[4]/div/div[2]/div/div/input"
        )
      )
      .sendKeys("2");
    await driver.sleep(100);
    // await driver
    //   .findElement(
    //     By.xpath(
    //       "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div[4]/div[5]/div[1]/div[2]/div[1]/div/input")
    //   )
    //   .sendKeys(Key.CONTROL + "a");
    // await driver.sleep(100);
    // await driver
    //   .findElement(
    //     By.xpath(
    //       "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div[4]/div[5]/div[1]/div[2]/div[1]/div/input")
    //   )
    //   .sendKeys(Key.DELETE);
    // await driver.sleep(100);
    // await driver
    //   .findElement(
    //     By.xpath(
    //       "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div[4]/div[5]/div[1]/div[2]/div[1]/div/input")
    //   )
    //   .sendKeys("2222222222");
    // await driver.sleep(100);
    // await driver
    //   .findElement(
    //     By.xpath(
    //       "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div[4]/div[6]/div/div[2]/div/div/input")
    //   )
    //   .sendKeys(Key.CONTROL + "a");
    // await driver.sleep(100);
    // await driver
    //   .findElement(
    //     By.xpath(
    //       "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div[4]/div[6]/div/div[2]/div/div/input")
    //   )
    //   .sendKeys(Key.DELETE);
    // await driver.sleep(100);
    // await driver
    //   .findElement(
    //     By.xpath(
    //       "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div[4]/div[6]/div/div[2]/div/div/input")
    //   )
    //   .sendKeys("2");
    // await driver.sleep(100);
    // await driver
    //   .findElement(
    //     By.xpath(
    //       "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div[4]/div[7]/div/div[2]/div/div/input")
    //   )
    //   .sendKeys(Key.CONTROL + "a");
    // await driver.sleep(100);
    // await driver
    //   .findElement(
    //     By.xpath(
    //       "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div[4]/div[7]/div/div[2]/div/div/input")
    //   )
    //   .sendKeys(Key.DELETE);
    // await driver.sleep(100);
    // await driver
    //   .findElement(
    //     By.xpath(
    //       "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div[4]/div[7]/div/div[2]/div/div/input")
    //   )
    //   .sendKeys("09222222222");
    // await driver.sleep(100);
    // await driver
    //   .findElement(
    //     By.xpath(
    //       "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div[4]/div[8]/div/div[2]/div/div/input")
    //   )
    //   .sendKeys(Key.CONTROL + "a");
    // await driver.sleep(100);
    // await driver
    //   .findElement(
    //     By.xpath(
    //       "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div[4]/div[8]/div/div[2]/div/div/input")
    //   )
    //   .sendKeys(Key.DELETE);
    // await driver.sleep(100);
    // await driver
    //   .findElement(
    //     By.xpath(
    //       "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div[4]/div[8]/div/div[2]/div/div/input")
    //   )
    //   .sendKeys("2");
    // await driver.sleep(100);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/form/div[5]/div/div/div/div/div/button"
        )
      )
      .click();
    await driver.sleep(1000);
    // await driver
    //   .findElement(
    //     By.xpath(
    //       "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/div/div/div[3]/div/div/div/div[2]/span[3]")
    //   )
    //   .click();
    // await driver.sleep(100);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/div/div/div[3]/div/div/div/div[2]/span[3]/span/div/div[2]/span[5]"
        )
      )
      .click();
    await driver.sleep(100);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/div/div/div[3]/div/div/div/div[2]/span[3]/span/div/div[2]/span[4]"
        )
      )
      .click();
    await driver.sleep(100);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div/div/div[2]/div/div/button[2]"
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

sherkatha();
module.exports = sherkatha;
