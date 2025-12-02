const { Builder, By, Key, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const fs = require("fs");
const path = require("path");
const customDriver = require("../customerDriver");
const { Actions } = require("selenium-webdriver");
const { Entry } = require("selenium-webdriver/lib/logging");
const colors = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  reset: "\x1b[0m",
};

async function salesInvoiceList() {
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
      "//div[@role='menuitem' and .//span[text()='فروش']]",
      "//div[@role='menuitem' and .//span[text()='عملیات']]",
      "//li[@role='menuitem' and .//span[text()='فاکتور فروش']]",
      "//button[.//div[text()='افزودن مورد جدید']]",
    ];
    for (const xpath of steps) {
      await driver.findElement(By.xpath(xpath)).click();
      await driver.sleep(500); // افزایش زمان انتظار
    }
    //قروش با اطلاعات مشتری
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[1]/form/div[2]/div/div[2]/div/div/button"
        )
      )
      .click();
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
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[1]/form/div[4]/div/div[2]/div/div/div/div[1]/div/span/span[1]/input"
        )
      )
      .click();
    await driver.sleep(100);
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
    await driver.sleep(300);
    const goodsInput2 = await driver.findElement(
      By.id("sellWithCustomerForm_SaleTypeId")
    );
    await goodsInput2.click();
    await goodsInput2.sendKeys("فروش نقدی");
    await driver.sleep(300);
    await goodsInput2.sendKeys(Key.ENTER);
    await driver.sleep(300);

    const goodsInput3 = await driver.findElement(
      By.id("sellWithCustomerForm_PayOfTypeId")
    );
    await goodsInput3.click();
    await goodsInput3.sendKeys("نقدی");
    await driver.sleep(300);
    await goodsInput3.sendKeys(Key.ENTER);
    await driver.sleep(300);
    ///اقلام فاکتور فروش
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[3]/span/span"
        )
      )
      .click();
    await driver.sleep(1000);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[3]/div/div[1]/div/span/span[1]"
        )
      )
      .click();
    await driver.sleep(100);
    const goodsInput1 = await driver.findElement(By.id("GoodsId"));
    await goodsInput1.click();
    await goodsInput1.sendKeys("new goods");
    await driver.sleep(300);
    const feeInput = await driver.findElement(By.id("Fee"));
    await feeInput.click();
    await feeInput.sendKeys(Key.CONTROL + "a");
    await feeInput.sendKeys("100");
    await driver.sleep(700);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[4]/span/span"
        )
      )
      .click();
    const goodsInput4 = await driver.findElement(By.id("Unit1Id"));
    await goodsInput4.click();
    await goodsInput4.sendKeys("عدد");
    await driver.sleep(300);
    //
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[5]/div"
        )
      )
      .click();
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[5]/div/div/input"
        )
      )
      .sendKeys("1");

    // دکمه منوی سطر
    await driver.findElement(By.css("td:nth-child(2) div div a")).click();
    await driver.sleep(500);
    // افزودن سطر جدید
    await driver
      .findElement(
        By.xpath(
          "//span[contains(@class,'ant-dropdown-menu-title-content')]//span[contains(text(),'تکرار سطر')]"
        )
      )
      .click();

    await driver.sleep(500);
    await driver.findElement(By.css("td:nth-child(2) div div a")).click();
    await driver.sleep(500);
    // افزودن سطر جدید
    await driver
      .findElement(
        By.xpath(
          "//span[contains(@class,'ant-dropdown-menu-title-content')]//span[contains(text(),'تکرار سطر')]"
        )
      )
      .click();

    await driver.sleep(500);
    await driver.findElement(By.css("td:nth-child(2) div div a")).click();
    await driver.sleep(500);
    // افزودن سطر جدید
    await driver
      .findElement(
        By.xpath(
          "//span[contains(@class,'ant-dropdown-menu-title-content')]//span[contains(text(),'تکرار سطر')]"
        )
      )
      .click();

    await driver.sleep(500);
    await driver.findElement(By.css("td:nth-child(2) div div a")).click();
    await driver.sleep(500);
    // افزودن سطر جدید
    await driver
      .findElement(
        By.xpath(
          "//span[contains(@class,'ant-dropdown-menu-title-content')]//span[contains(text(),'تکرار سطر')]"
        )
      )
      .click();

    await driver.sleep(500);
    await driver.findElement(By.css("td:nth-child(2) div div a")).click();
    await driver.sleep(500);
    // افزودن سطر جدید
    await driver
      .findElement(
        By.xpath(
          "//span[contains(@class,'ant-dropdown-menu-title-content')]//span[contains(text(),'تکرار سطر')]"
        )
      )
      .click();

    await driver.sleep(500);
    await driver.findElement(By.css("td:nth-child(2) div div a")).click();
    await driver.sleep(500);
    // افزودن سطر جدید
    await driver
      .findElement(
        By.xpath(
          "//span[contains(@class,'ant-dropdown-menu-title-content')]//span[contains(text(),'تکرار سطر')]"
        )
      )
      .click();

    await driver.sleep(500);
    await driver.findElement(By.css("td:nth-child(2) div div a")).click();
    await driver.sleep(500);
    // افزودن سطر جدید
    await driver
      .findElement(
        By.xpath(
          "//span[contains(@class,'ant-dropdown-menu-title-content')]//span[contains(text(),'تکرار سطر')]"
        )
      )
      .click();

    await driver.sleep(500);
    await driver.findElement(By.css("td:nth-child(2) div div a")).click();
    await driver.sleep(500);
    // افزودن سطر جدید
    await driver
      .findElement(
        By.xpath(
          "//span[contains(@class,'ant-dropdown-menu-title-content')]//span[contains(text(),'تکرار سطر')]"
        )
      )
      .click();

    await driver.sleep(500);
    await driver.findElement(By.css("td:nth-child(2) div div a")).click();
    await driver.sleep(500);
    // افزودن سطر جدید
    await driver
      .findElement(
        By.xpath(
          "//span[contains(@class,'ant-dropdown-menu-title-content')]//span[contains(text(),'تکرار سطر')]"
        )
      )
      .click();

    await driver.sleep(500);
    await driver.findElement(By.css("td:nth-child(2) div div a")).click();
    await driver.sleep(500);
    // افزودن سطر جدید
    await driver
      .findElement(
        By.xpath(
          "//span[contains(@class,'ant-dropdown-menu-title-content')]//span[contains(text(),'تکرار سطر')]"
        )
      )
      .click();

    await driver.sleep(500);
    await driver.findElement(By.css("td:nth-child(2) div div a")).click();
    await driver.sleep(500);
    // افزودن سطر جدید
    await driver
      .findElement(
        By.xpath(
          "//span[contains(@class,'ant-dropdown-menu-title-content')]//span[contains(text(),'تکرار سطر')]"
        )
      )
      .click();

    await driver.sleep(500);
    await driver.findElement(By.css("td:nth-child(2) div div a")).click();
    await driver.sleep(500);
    // افزودن سطر جدید
    await driver
      .findElement(
        By.xpath(
          "//span[contains(@class,'ant-dropdown-menu-title-content')]//span[contains(text(),'تکرار سطر')]"
        )
      )
      .click();

    await driver.sleep(500);
    await driver.findElement(By.css("td:nth-child(2) div div a")).click();
    await driver.sleep(500);
    // افزودن سطر جدید
    await driver
      .findElement(
        By.xpath(
          "//span[contains(@class,'ant-dropdown-menu-title-content')]//span[contains(text(),'تکرار سطر')]"
        )
      )
      .click();

    await driver.sleep(500);
    await driver.findElement(By.css("td:nth-child(2) div div a")).click();
    await driver.sleep(500);
    // افزودن سطر جدید
    await driver
      .findElement(
        By.xpath(
          "//span[contains(@class,'ant-dropdown-menu-title-content')]//span[contains(text(),'تکرار سطر')]"
        )
      )
      .click();

    await driver.sleep(500);
    await driver.findElement(By.css("td:nth-child(2) div div a")).click();
    await driver.sleep(500);
    // افزودن سطر جدید
    await driver
      .findElement(
        By.xpath(
          "//span[contains(@class,'ant-dropdown-menu-title-content')]//span[contains(text(),'تکرار سطر')]"
        )
      )
      .click();

    await driver.sleep(500);
    await driver.findElement(By.css("td:nth-child(2) div div a")).click();
    await driver.sleep(500);
    // افزودن سطر جدید
    await driver
      .findElement(
        By.xpath(
          "//span[contains(@class,'ant-dropdown-menu-title-content')]//span[contains(text(),'تکرار سطر')]"
        )
      )
      .click();

    await driver.sleep(500);
    await driver.findElement(By.css("td:nth-child(2) div div a")).click();
    await driver.sleep(500);
    // افزودن سطر جدید
    await driver
      .findElement(
        By.xpath(
          "//span[contains(@class,'ant-dropdown-menu-title-content')]//span[contains(text(),'تکرار سطر')]"
        )
      )
      .click();

    await driver.sleep(500);
    await driver.findElement(By.css("td:nth-child(2) div div a")).click();
    await driver.sleep(500);
    // افزودن سطر جدید
    await driver
      .findElement(
        By.xpath(
          "//span[contains(@class,'ant-dropdown-menu-title-content')]//span[contains(text(),'تکرار سطر')]"
        )
      )
      .click();

    await driver.sleep(500);
    await driver.findElement(By.css("td:nth-child(2) div div a")).click();
    await driver.sleep(500);
    // افزودن سطر جدید
    await driver
      .findElement(
        By.xpath(
          "//span[contains(@class,'ant-dropdown-menu-title-content')]//span[contains(text(),'تکرار سطر')]"
        )
      )
      .click();

    await driver.sleep(1500);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[1]/form/div[3]/div/div[2]/div/div/div/div/input"
        )
      )
      .sendKeys("1");
    await driver.sleep(1500);
    //تکرار
    // const goodsInput6 = await driver.findElement(
    //   By.xpath(
    //     "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[3]/td[3]/div/div[1]/div/span/span[1]/input"
    //   )
    // );
    // await goodsInput6.click();
    // await goodsInput6.sendKeys("new goods");
    // await driver.sleep(300);
    // const feeInput1 = await driver.findElement(By.id("Fee"));
    // await feeInput1.click();
    // await feeInput1.sendKeys(Key.CONTROL + "a");
    // await feeInput1.sendKeys("100");
    // await driver.sleep(700);
    // await driver
    //   .findElement(
    //     By.xpath(
    //       "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[4]/span/span"
    //     )
    //   )
    //   .click();
    // const goodsInput5 = await driver.findElement(By.id("Unit1Id"));
    // await goodsInput5.click();
    // await goodsInput5.sendKeys("عدد");
    // await driver.sleep(300);
    // //
    // await driver
    //   .findElement(
    //     By.xpath(
    //       "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[5]/div"
    //     )
    //   )
    //   .click();
    // await driver
    //   .findElement(
    //     By.xpath(
    //       "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[5]/div/div/input"
    //     )
    //   )
    //   .sendKeys("1");

    // // دکمه منوی سطر
    // await driver.findElement(By.css("td:nth-child(2) div div a")).click();

    // // افزودن سطر جدید
    // await driver
    //   .findElement(
    //     By.xpath(
    //       "//span[contains(@class,'ant-dropdown-menu-title-content')]//span[contains(text(),'تکرار سطر')]"
    //     )
    //   )
    //   .click();

    // await driver.sleep(500);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[1]/div/div[2]/div"
        )
      )
      .click();

    await driver.sleep(50000);

    // ← این بخش جدید اضافه می‌شود

    ////تکرار

    ////
    const bodyText = await driver.findElement(By.css("body")).getText();
    if (bodyText.includes("آرین")) {
      console.log(`${colors.green}ok Aryan${colors.reset}`);
    } else {
      console.log(`${colors.red}not ok Aryan${colors.reset}`);
    }
  } catch (err) {
    console.error("❌ خطا:", err);
    // گرفتن اسکرین‌شات برای دیباگ
    try {
      const screenshot = await driver.takeScreenshot();
      fs.writeFileSync("customerGroup-screenshot.png", screenshot, "base64");
      console.log("اسکرین‌شات از خطا در customerGroup-screenshot.png ذخیره شد");
    } catch (screenshotError) {
      console.log("خطا در گرفتن اسکرین‌شات:", screenshotError);
    }
  } finally {
    await driver.quit();
  }
}

salesInvoiceList();
module.exports = salesInvoiceList;
