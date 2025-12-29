const { By, until, Key } = require("selenium-webdriver");
const BaseArianTechScript = require("../../BaseArianScript/baseArianTechScript");
const baseHelper = require("../../BaseArianScript/baseHelper");
class salesInvoiceListTest extends BaseArianTechScript {
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
    const steps = [
      "//div[@role='menuitem' and .//span[text()='فروش']]",
      "//div[@role='menuitem' and .//span[text()='عملیات']]",
      "//li[@role='menuitem' and .//span[text()='فاکتور فروش']]",
      "//button[.//div[text()='افزودن مورد جدید']]",
    ];
    await this._clickSequence(driver, steps, {
      retries: 4,
      waitBetween: 300,
      locateTimeout: 7000,
    });
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
      await options1[2].click();
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
    await driver.sleep(1000);
    await this._safeClick(
      driver,
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[1]/div/div[2]/div"
    );
    await driver.sleep(700);
    //بدون اطلاعات مشتری
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[1]/div[1]/div[1]/button"
        )
      )
      .click();
    await driver.sleep(300);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[1]/div/div[1]/div/div[1]"
        )
      )
      .click();
    await driver.sleep(300);
    await driver
      .findElement(By.xpath("/html/body/div[4]/div/ul/li[2]"))
      .click();
    await driver.sleep(700);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[1]/form/div[2]/div/div[2]/div/div/button"
        )
      )
      .click();
    await driver.sleep(700);
    const todayButton9 = await driver.wait(
      until.elementLocated(
        By.xpath("//button[normalize-space(text())='انتخاب امروز']")
      ),
      5000
    );
    await driver.wait(until.elementIsVisible(todayButton9), 5000);

    await driver.executeScript(
      "arguments[0].scrollIntoView(true);",
      todayButton9
    );
    await driver.sleep(200);

    await driver.executeScript("arguments[0].click();", todayButton9);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[1]/form/div[4]/div/div[2]/div/div/div/div[1]/div/span/span[1]/input"
        )
      )
      .click();
    await driver.sleep(100);
    const options11 = await driver.findElements(
      By.css(".ant-select-item-option")
    );
    if (options11.length > 0) {
      await driver.executeScript(
        "arguments[0].scrollIntoView(true);",
        options11[0]
      );
      await options11[0].click();
    }
    await driver.sleep(300);
    const goodsInput38 = await driver.findElement(
      By.id("sellWithCustomerForm_SaleTypeId")
    );
    await goodsInput38.click();
    await goodsInput38.sendKeys("فروش نقدی");
    await driver.sleep(300);
    await goodsInput38.sendKeys(Key.ENTER);
    await driver.sleep(300);

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[3]/span/span"
        )
      )
      .click();
    await driver.sleep(100);

    await driver.sleep(1000);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[3]/div/div[1]/div/span/span[1]"
        )
      )
      .click();
    await driver.sleep(100);
    const goodsInput39 = await driver.findElement(By.id("GoodsId"));
    await goodsInput39.click();
    await goodsInput39.sendKeys("new goods");
    await driver.sleep(300);

    const feeInput11 = await driver.findElement(By.id("Fee"));
    await feeInput11.click();
    await feeInput11.sendKeys(Key.CONTROL + "a");
    await feeInput11.sendKeys("100");
    await driver.sleep(700);
    //اقلام فاکتور فروش
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[4]/span/span"
        )
      )
      .click();
    const goodsInput40 = await driver.findElement(By.id("Unit1Id"));
    await goodsInput40.click();
    await goodsInput40.sendKeys("عدد");
    await driver.sleep(300);
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
    await driver.sleep(700);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[1]/div/div[2]/div"
        )
      )
      .click();
    await driver.sleep(700);
    //فروش ارزی
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[1]/div[1]/div[1]/button"
        )
      )
      .click();
    await driver.sleep(300);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[1]/div/div[1]/div/div[1]"
        )
      )
      .click();
    await driver.sleep(300);
    await driver
      .findElement(By.xpath("/html/body/div[4]/div/ul/li[3]"))
      .click();
    await driver.sleep(700);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[1]/form/div[2]/div/div[2]/div/div/button"
        )
      )
      .click();
    await driver.sleep(700);
    const todayButton1 = await driver.wait(
      until.elementLocated(
        By.xpath("//button[normalize-space(text())='انتخاب امروز']")
      ),
      5000
    );
    await driver.wait(until.elementIsVisible(todayButton1), 5000);

    await driver.executeScript(
      "arguments[0].scrollIntoView(true);",
      todayButton1
    );
    await driver.sleep(200);

    await driver.executeScript("arguments[0].click();", todayButton1);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[1]/form/div[4]/div/div[2]/div/div/div/div[1]/div/span/span[1]/input"
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
    await driver.sleep(300);
    const goodsInput5 = await driver.findElement(
      By.id("sellWithCustomerForm_SaleTypeId")
    );
    await goodsInput5.click();
    await goodsInput5.sendKeys("فروش نقدی");
    await driver.sleep(300);
    await goodsInput5.sendKeys(Key.ENTER);
    await driver.sleep(300);
    const goodsInput6 = await driver.findElement(
      By.id("sellWithCustomerForm_PayOfTypeId")
    );
    await goodsInput6.click();
    await goodsInput6.sendKeys("نقدی");
    await driver.sleep(300);
    await goodsInput6.sendKeys(Key.ENTER);
    await driver.sleep(300);
    ///اقلام فروش
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[3]/span/span"
        )
      )
      .click();
    await driver.sleep(100);

    await driver.sleep(1000);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[3]/div/div[1]/div/span/span[1]"
        )
      )
      .click();
    await driver.sleep(100);
    const goodsInput7 = await driver.findElement(By.id("GoodsId"));
    await goodsInput7.click();
    await goodsInput7.sendKeys("new goods");
    await driver.sleep(300);

    const feeInput1 = await driver.findElement(By.id("Fee"));
    await feeInput1.click();
    await feeInput1.sendKeys(Key.CONTROL + "a");
    await feeInput1.sendKeys("100");
    await driver.sleep(700);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[4]/span/span"
        )
      )
      .click();
    const goodsInput8 = await driver.findElement(By.id("Unit1Id"));
    await goodsInput8.click();
    await goodsInput8.sendKeys("عدد");
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
    await driver.sleep(1000);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[1]/div/div[2]/div"
        )
      )
      .click();
    await driver.sleep(700);
    //قرارداد پیمانکاری
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[1]/div[1]/div[1]/button"
        )
      )
      .click();
    await driver.sleep(300);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[1]/div/div[1]/div/div[1]"
        )
      )
      .click();
    await driver.sleep(300);
    await driver
      .findElement(By.xpath("/html/body/div[4]/div/ul/li[4]"))
      .click();
    await driver.sleep(700);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[1]/form/div[2]/div/div[2]/div/div/button"
        )
      )
      .click();
    await driver.sleep(700);
    const todayButton2 = await driver.wait(
      until.elementLocated(
        By.xpath("//button[normalize-space(text())='انتخاب امروز']")
      ),
      5000
    );
    await driver.wait(until.elementIsVisible(todayButton2), 5000);

    await driver.executeScript(
      "arguments[0].scrollIntoView(true);",
      todayButton2
    );
    await driver.sleep(200);

    await driver.executeScript("arguments[0].click();", todayButton2);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[1]/form/div[4]/div/div[2]/div/div/div/div/input"
        )
      )
      .sendKeys("1");
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[1]/form/div[5]/div/div[2]/div/div/div/div[1]/div/span/span[1]/input"
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
    await driver.sleep(300);
    const goodsInput11 = await driver.findElement(
      By.id("sellWithCustomerForm_SaleTypeId")
    );
    await goodsInput11.click();
    await goodsInput11.sendKeys("فروش نقدی");
    await driver.sleep(300);
    await goodsInput11.sendKeys(Key.ENTER);
    await driver.sleep(300);
    const goodsInput12 = await driver.findElement(
      By.id("sellWithCustomerForm_PayOfTypeId")
    );
    await goodsInput12.click();
    await goodsInput12.sendKeys("نقدی");
    await driver.sleep(300);
    await goodsInput12.sendKeys(Key.ENTER);
    await driver.sleep(300);
    //اقلام فاکتور
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[3]/span/span"
        )
      )
      .click();
    await driver.sleep(100);

    await driver.sleep(1000);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[3]/div/div[1]/div/span/span[1]"
        )
      )
      .click();
    await driver.sleep(100);
    const goodsInput10 = await driver.findElement(By.id("GoodsId"));
    await goodsInput10.click();
    await goodsInput10.sendKeys("new goods");
    await driver.sleep(300);

    const feeInput2 = await driver.findElement(
      By.id("CommissionContractNumber")
    );
    await feeInput2.click();
    await feeInput2.sendKeys(Key.CONTROL + "a");
    await feeInput2.sendKeys("100");
    await feeInput2.sendKeys(Key.ENTER);
    await driver.sleep(700);
    const goodsInput14 = await driver.findElement(By.id("Unit1Id"));
    await goodsInput14.click();
    await goodsInput14.sendKeys("عدد");
    await driver.sleep(300);
    const goodsInput13 = await driver.findElement(By.id("Quantity1"));
    await goodsInput13.sendKeys("1");
    await goodsInput13.sendKeys(Key.ENTER);
    await driver.sleep(300);

    const feeInput14 = await driver.findElement(By.id("Fee"));
    await feeInput14.click();
    await feeInput14.sendKeys(Key.CONTROL + "a");
    await feeInput14.sendKeys("100");
    await driver.sleep(700);

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[1]/div/div[2]/div"
        )
      )
      .click();
    await driver.sleep(300);
    //طلاوجواهر
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[1]/div[1]/div[1]/button"
        )
      )
      .click();
    await driver.sleep(300);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[1]/div/div[1]/div/div[1]"
        )
      )
      .click();
    await driver.sleep(300);
    await driver
      .findElement(By.xpath("/html/body/div[4]/div/ul/li[5]"))
      .click();
    await driver.sleep(700);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[1]/form/div[2]/div/div[2]/div/div/button"
        )
      )
      .click();
    await driver.sleep(700);
    const todayButton3 = await driver.wait(
      until.elementLocated(
        By.xpath("//button[normalize-space(text())='انتخاب امروز']")
      ),
      5000
    );
    await driver.wait(until.elementIsVisible(todayButton3), 5000);

    await driver.executeScript(
      "arguments[0].scrollIntoView(true);",
      todayButton3
    );
    await driver.sleep(200);

    await driver.executeScript("arguments[0].click();", todayButton3);
    await driver.sleep(300);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[1]/form/div[4]/div/div[2]/div/div/div/div[1]/div/span/span[1]/input"
        )
      )
      .click();
    await driver.sleep(100);
    const options4 = await driver.findElements(
      By.css(".ant-select-item-option")
    );
    if (options4.length > 0) {
      await driver.executeScript(
        "arguments[0].scrollIntoView(true);",
        options4[0]
      );
      await options4[0].click();
    }
    await driver.sleep(300);

    const goodsInput17 = await driver.findElement(
      By.id("sellWithCustomerForm_SaleTypeId")
    );
    await goodsInput17.click();
    await goodsInput17.sendKeys("فروش نقدی");
    await driver.sleep(300);
    await goodsInput17.sendKeys(Key.ENTER);
    await driver.sleep(300);

    const goodsInput9 = await driver.findElement(
      By.id("sellWithCustomerForm_PayOfTypeId")
    );
    await goodsInput9.click();
    await goodsInput9.sendKeys("نقدی");
    await driver.sleep(300);
    await goodsInput9.sendKeys(Key.ENTER);
    await driver.sleep(300);
    ///اقلام سفارش
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[3]/span/span"
        )
      )
      .click();
    await driver.sleep(100);

    await driver.sleep(1000);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[3]/div/div[1]/div/span/span[1]"
        )
      )
      .click();
    await driver.sleep(100);
    const goodsInput16 = await driver.findElement(By.id("GoodsId"));
    await goodsInput16.click();
    await goodsInput16.sendKeys("new goods");
    await driver.sleep(300);
    const feeInput3 = await driver.findElement(By.id("Fee"));
    await feeInput3.click();
    await feeInput3.sendKeys(Key.CONTROL + "a");
    await feeInput3.sendKeys("100");
    await driver.sleep(700);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[4]/span/span"
        )
      )
      .click();
    const goodsInput15 = await driver.findElement(By.id("Unit1Id"));
    await goodsInput15.click();
    await goodsInput15.sendKeys("عدد");
    await driver.sleep(300);
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
    await driver.sleep(1000);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[1]/div/div[2]/div"
        )
      )
      .click();
    await driver.sleep(700);
    //طلا و جواهر بدون اطلاعات خریدار
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[1]/div[1]/div[1]/button"
        )
      )
      .click();
    await driver.sleep(300);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[1]/div/div[1]/div/div[1]"
        )
      )
      .click();
    await driver.sleep(300);
    await driver
      .findElement(By.xpath("/html/body/div[4]/div/ul/li[6]"))
      .click();
    await driver.sleep(700);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[1]/form/div[2]/div/div[2]/div/div/button"
        )
      )
      .click();
    await driver.sleep(700);
    const todayButton10 = await driver.wait(
      until.elementLocated(
        By.xpath("//button[normalize-space(text())='انتخاب امروز']")
      ),
      5000
    );
    await driver.wait(until.elementIsVisible(todayButton10), 5000);

    await driver.executeScript(
      "arguments[0].scrollIntoView(true);",
      todayButton10
    );
    await driver.sleep(200);

    await driver.executeScript("arguments[0].click();", todayButton10);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[1]/form/div[4]/div/div[2]/div/div/div/div[1]/div/span/span[1]/input"
        )
      )
      .click();
    await driver.sleep(100);
    const options12 = await driver.findElements(
      By.css(".ant-select-item-option")
    );
    if (options12.length > 0) {
      await driver.executeScript(
        "arguments[0].scrollIntoView(true);",
        options12[0]
      );
      await options12[0].click();
    }
    await driver.sleep(300);
    const goodsInput41 = await driver.findElement(
      By.id("sellWithCustomerForm_SaleTypeId")
    );
    await goodsInput41.click();
    await goodsInput41.sendKeys("فروش نقدی");
    await driver.sleep(300);
    await goodsInput41.sendKeys(Key.ENTER);
    await driver.sleep(300);

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[3]/span/span"
        )
      )
      .click();
    await driver.sleep(100);

    await driver.sleep(1000);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[3]/div/div[1]/div/span/span[1]"
        )
      )
      .click();
    await driver.sleep(100);
    const goodsInput42 = await driver.findElement(By.id("GoodsId"));
    await goodsInput42.click();
    await goodsInput42.sendKeys("new goods");
    await driver.sleep(300);

    const feeInput10 = await driver.findElement(By.id("Fee"));
    await feeInput10.click();
    await feeInput10.sendKeys(Key.CONTROL + "a");
    await feeInput10.sendKeys("100");
    await driver.sleep(700);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[4]/span/span"
        )
      )
      .click();
    const goodsInput43 = await driver.findElement(By.id("Unit1Id"));
    await goodsInput43.click();
    await goodsInput43.sendKeys("عدد");
    await driver.sleep(300);
    //اقلام سفارش
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
    await driver.sleep(700);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[1]/div/div[2]/div"
        )
      )
      .click();
    await driver.sleep(700);
    //بورس اوراق بهادار
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[1]/div[1]/div[1]/button"
        )
      )
      .click();
    await driver.sleep(300);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[1]/div/div[1]/div/div[1]"
        )
      )
      .click();
    await driver.sleep(300);
    await driver
      .findElement(By.xpath("/html/body/div[4]/div/ul/li[7]"))
      .click();
    await driver.sleep(700);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[1]/form/div[2]/div/div[2]/div/div/button"
        )
      )
      .click();
    await driver.sleep(700);
    const todayButton4 = await driver.wait(
      until.elementLocated(
        By.xpath("//button[normalize-space(text())='انتخاب امروز']")
      ),
      5000
    );
    await driver.wait(until.elementIsVisible(todayButton4), 5000);

    await driver.executeScript(
      "arguments[0].scrollIntoView(true);",
      todayButton4
    );
    await driver.sleep(200);

    await driver.executeScript("arguments[0].click();", todayButton4);
    await driver.sleep(300);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[1]/form/div[4]/div/div[2]/div/div/div/div[1]/div/span/span[1]/input"
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
    await driver.sleep(300);

    const goodsInput21 = await driver.findElement(
      By.id("sellWithCustomerForm_SaleTypeId")
    );
    await goodsInput21.click();
    await goodsInput21.sendKeys("فروش نقدی");
    await driver.sleep(300);
    await goodsInput21.sendKeys(Key.ENTER);
    await driver.sleep(300);

    const goodsInput20 = await driver.findElement(
      By.id("sellWithCustomerForm_PayOfTypeId")
    );
    await goodsInput20.click();
    await goodsInput20.sendKeys("نقدی");
    await driver.sleep(300);
    await goodsInput20.sendKeys(Key.ENTER);
    await driver.sleep(300);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[1]/form/div[7]/div/div[2]/div/div/button/div"
        )
      )
      .click();
    await driver.sleep(300);
    ///اقلام فاکتور
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[3]/span/span"
        )
      )
      .click();
    await driver.sleep(100);

    await driver.sleep(1000);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[3]/div/div[1]/div/span/span[1]"
        )
      )
      .click();
    await driver.sleep(100);
    const goodsInput19 = await driver.findElement(By.id("GoodsId"));
    await goodsInput19.click();
    await goodsInput19.sendKeys("new goods");
    await driver.sleep(300);
    const feeInput4 = await driver.findElement(By.id("Fee"));
    await feeInput4.click();
    await feeInput4.sendKeys(Key.CONTROL + "a");
    await feeInput4.sendKeys("100");
    await driver.sleep(700);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[4]/span/span"
        )
      )
      .click();
    const goodsInput18 = await driver.findElement(By.id("Unit1Id"));
    await goodsInput18.click();
    await goodsInput18.sendKeys("عدد");
    await driver.sleep(300);
    //اقلام فاکتور
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
    await driver.sleep(1000);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[1]/div/div[2]/div"
        )
      )
      .click();
    await driver.sleep(700);

    //صادرات
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[1]/div[1]/div[1]/button"
        )
      )
      .click();
    await driver.sleep(300);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[1]/div/div[1]/div/div[1]"
        )
      )
      .click();
    await driver.sleep(300);
    await driver
      .findElement(By.xpath("/html/body/div[4]/div/ul/li[8]"))
      .click();
    await driver.sleep(700);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[1]/form/div[2]/div/div[2]/div/div/button"
        )
      )
      .click();
    await driver.sleep(700);
    const todayButton5 = await driver.wait(
      until.elementLocated(
        By.xpath("//button[normalize-space(text())='انتخاب امروز']")
      ),
      5000
    );
    await driver.wait(until.elementIsVisible(todayButton5), 5000);

    await driver.executeScript(
      "arguments[0].scrollIntoView(true);",
      todayButton5
    );
    await driver.sleep(200);

    await driver.executeScript("arguments[0].click();", todayButton5);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[1]/form/div[4]/div/div[2]/div/div/div/div[1]/div/span/span[1]/input"
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
      await options6[1].click();
    }
    await driver.sleep(300);
    const goodsInput25 = await driver.findElement(
      By.id("sellWithCustomerForm_SaleTypeId")
    );
    await goodsInput25.click();
    await goodsInput25.sendKeys("فروش نقدی");
    await driver.sleep(300);
    await goodsInput25.sendKeys(Key.ENTER);
    await driver.sleep(300);

    const goodsInput24 = await driver.findElement(
      By.id("sellWithCustomerForm_PayOfTypeId")
    );
    await goodsInput24.click();
    await goodsInput24.sendKeys("نقدی");
    await driver.sleep(300);
    await goodsInput24.sendKeys(Key.ENTER);
    await driver.sleep(300);
    ///اقلام فاکتور فروش
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[3]/span/span"
        )
      )
      .click();
    await driver.sleep(100);

    await driver.sleep(1000);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[3]/div/div[1]/div/span/span[1]"
        )
      )
      .click();
    await driver.sleep(100);
    const goodsInput23 = await driver.findElement(By.id("GoodsId"));
    await goodsInput23.click();
    await goodsInput23.sendKeys("new goods");
    await driver.sleep(300);
    const feeInput5 = await driver.findElement(By.id("CurrencyToRialRate"));
    await feeInput5.click();
    await feeInput5.sendKeys(Key.CONTROL + "a");
    await feeInput5.sendKeys("100");
    await feeInput5.sendKeys(Key.ENTER);
    await driver.sleep(300);

    const feeInput7 = await driver.findElement(By.id("Fee"));
    await feeInput7.click();
    await feeInput7.sendKeys(Key.CONTROL + "a");
    await feeInput7.sendKeys("100");
    await driver.sleep(700);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[4]/span/span"
        )
      )
      .click();
    const goodsInput22 = await driver.findElement(By.id("Unit1Id"));
    await goodsInput22.click();
    await goodsInput22.sendKeys("عدد");
    await driver.sleep(300);
    //اقلام فاکتور فروش
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
    await driver.sleep(1000);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[1]/div/div[2]/div"
        )
      )
      .click();
    await driver.sleep(700);

    //قبوض خدماتی
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[1]/div[1]/div[1]/button"
        )
      )
      .click();
    await driver.sleep(300);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[1]/div/div[1]/div/div[1]"
        )
      )
      .click();
    await driver.sleep(300);
    await driver
      .findElement(By.xpath("/html/body/div[4]/div/ul/li[9]"))
      .click();
    await driver.sleep(700);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[1]/form/div[2]/div/div[2]/div/div/button"
        )
      )
      .click();
    await driver.sleep(700);
    const todayButton6 = await driver.wait(
      until.elementLocated(
        By.xpath("//button[normalize-space(text())='انتخاب امروز']")
      ),
      5000
    );
    await driver.wait(until.elementIsVisible(todayButton6), 5000);

    await driver.executeScript(
      "arguments[0].scrollIntoView(true);",
      todayButton6
    );
    await driver.sleep(200);

    await driver.executeScript("arguments[0].click();", todayButton6);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[1]/form/div[4]/div/div[2]/div/div/div/div[1]/div/span/span[1]/input"
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
    await driver.sleep(300);
    const goodsInput26 = await driver.findElement(
      By.id("sellWithCustomerForm_SaleTypeId")
    );
    await goodsInput26.click();
    await goodsInput26.sendKeys("فروش نقدی");
    await driver.sleep(300);
    await goodsInput26.sendKeys(Key.ENTER);
    await driver.sleep(300);
    const goodsInput27 = await driver.findElement(
      By.id("sellWithCustomerForm_PayOfTypeId")
    );
    await goodsInput27.click();
    await goodsInput27.sendKeys("نقدی");
    await driver.sleep(300);
    await goodsInput27.sendKeys(Key.ENTER);
    await driver.sleep(300);
    ///اقلام فاکتور
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[3]/span/span"
        )
      )
      .click();
    await driver.sleep(100);

    await driver.sleep(1000);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[3]/div/div[1]/div/span/span[1]"
        )
      )
      .click();
    await driver.sleep(100);
    const goodsInput28 = await driver.findElement(By.id("GoodsId"));
    await goodsInput28.click();
    await goodsInput28.sendKeys("new goods");
    await driver.sleep(300);

    const feeInput6 = await driver.findElement(By.id("Fee"));
    await feeInput6.click();
    await feeInput6.sendKeys(Key.CONTROL + "a");
    await feeInput6.sendKeys("100");
    await driver.sleep(700);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[4]/span/span"
        )
      )
      .click();
    const goodsInput29 = await driver.findElement(By.id("Unit1Id"));
    await goodsInput29.click();
    await goodsInput29.sendKeys("عدد");
    await driver.sleep(300);
    //اقلام فاکتور
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
    await driver.sleep(700);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[1]/form/div[7]/div/div[2]/div/div/input"
        )
      )
      .sendKeys("1");
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[1]/div/div[2]/div"
        )
      )
      .click();
    await driver.sleep(700);
    //خدمات بیمه ای
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[1]/div[1]/div[1]/button"
        )
      )
      .click();
    await driver.sleep(300);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[1]/div/div[1]/div/div[1]"
        )
      )
      .click();
    await driver.sleep(300);
    await driver
      .findElement(By.xpath("/html/body/div[4]/div/ul/li[10]"))
      .click();
    await driver.sleep(700);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[1]/form/div[2]/div/div[2]/div/div/button"
        )
      )
      .click();
    await driver.sleep(700);
    const todayButton7 = await driver.wait(
      until.elementLocated(
        By.xpath("//button[normalize-space(text())='انتخاب امروز']")
      ),
      5000
    );
    await driver.wait(until.elementIsVisible(todayButton7), 5000);

    await driver.executeScript(
      "arguments[0].scrollIntoView(true);",
      todayButton7
    );
    await driver.sleep(200);

    await driver.executeScript("arguments[0].click();", todayButton7);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[1]/form/div[4]/div/div[2]/div/div/div/div[1]/div/span/span[1]/input"
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
    await driver.sleep(300);
    const goodsInput33 = await driver.findElement(
      By.id("sellWithCustomerForm_SaleTypeId")
    );
    await goodsInput33.click();
    await goodsInput33.sendKeys("فروش نقدی");
    await driver.sleep(300);
    await goodsInput33.sendKeys(Key.ENTER);
    await driver.sleep(300);
    const goodsInput32 = await driver.findElement(
      By.id("sellWithCustomerForm_PayOfTypeId")
    );
    await goodsInput32.click();
    await goodsInput32.sendKeys("نقدی");
    await driver.sleep(300);
    await goodsInput32.sendKeys(Key.ENTER);
    await driver.sleep(300);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[1]/form/div[7]/div/div[2]/div/div/input"
        )
      )
      .sendKeys("1");
    await driver.sleep(100);
    ///اقلام فاکتور
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[3]/span/span"
        )
      )
      .click();
    await driver.sleep(100);

    await driver.sleep(1000);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[3]/div/div[1]/div/span/span[1]"
        )
      )
      .click();
    await driver.sleep(100);
    const goodsInput31 = await driver.findElement(By.id("GoodsId"));
    await goodsInput31.click();
    await goodsInput31.sendKeys("new goods");
    await driver.sleep(300);

    const feeInput8 = await driver.findElement(By.id("Fee"));
    await feeInput8.click();
    await feeInput8.sendKeys(Key.CONTROL + "a");
    await feeInput8.sendKeys("100");
    await driver.sleep(700);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[4]/span/span"
        )
      )
      .click();
    const goodsInput30 = await driver.findElement(By.id("Unit1Id"));
    await goodsInput30.click();
    await goodsInput30.sendKeys("عدد");
    await driver.sleep(300);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[1]/form/div[7]/div/div[2]/div/div/input"
        )
      )
      .sendKeys("1");
    //اقلام فاکتور
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
    await driver.sleep(700);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[1]/div/div[2]/div"
        )
      )
      .click();
    await driver.sleep(700);
    //خدمات بیمه ای بدون اطلاعات خریدار
    await driver
      .findElement(By.xpath("//button[.//div[text()='افزودن مورد جدید']]"))
      .click();
    await driver.sleep(300);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[1]/div/div[1]/div/div[1]"
        )
      )
      .click();
    await driver.sleep(300);
    await driver
      .findElement(By.xpath("/html/body/div[4]/div/ul/li[11]"))
      .click();
    await driver.sleep(700);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[1]/form/div[2]/div/div[2]/div/div/button"
        )
      )
      .click();
    await driver.sleep(700);
    const todayButton11 = await driver.wait(
      until.elementLocated(
        By.xpath("//button[normalize-space(text())='انتخاب امروز']")
      ),
      5000
    );
    await driver.wait(until.elementIsVisible(todayButton11), 5000);

    await driver.executeScript(
      "arguments[0].scrollIntoView(true);",
      todayButton11
    );
    await driver.sleep(200);

    await driver.executeScript("arguments[0].click();", todayButton11);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[1]/form/div[4]/div/div[2]/div/div/div/div[1]/div/span/span[1]/input"
        )
      )
      .click();
    await driver.sleep(100);
    const options13 = await driver.findElements(
      By.css(".ant-select-item-option")
    );
    if (options13.length > 0) {
      await driver.executeScript(
        "arguments[0].scrollIntoView(true);",
        options13[0]
      );
      await options13[0].click();
    }
    await driver.sleep(300);
    const goodsInput46 = await driver.findElement(
      By.id("sellWithCustomerForm_SaleTypeId")
    );
    await goodsInput46.click();
    await goodsInput46.sendKeys("فروش نقدی");
    await driver.sleep(300);
    await goodsInput46.sendKeys(Key.ENTER);
    await driver.sleep(300);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[1]/form/div[6]/div/div[2]/div/div/input"
        )
      )
      .sendKeys("1");
    await driver.sleep(100);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[3]/span/span"
        )
      )
      .click();
    await driver.sleep(100);

    await driver.sleep(1000);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[3]/div/div[1]/div/span/span[1]"
        )
      )
      .click();
    await driver.sleep(100);
    const goodsInput45 = await driver.findElement(By.id("GoodsId"));
    await goodsInput45.click();
    await goodsInput45.sendKeys("new goods");
    await driver.sleep(300);

    const feeInput12 = await driver.findElement(By.id("Fee"));
    await feeInput12.click();
    await feeInput12.sendKeys(Key.CONTROL + "a");
    await feeInput12.sendKeys("100");
    await driver.sleep(700);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[4]/span/span"
        )
      )
      .click();
    const goodsInput44 = await driver.findElement(By.id("Unit1Id"));
    await goodsInput44.click();
    await goodsInput44.sendKeys("عدد");
    await driver.sleep(300);
    //اقلام فاکتور
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
    await driver.sleep(700);

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[1]/div/div[2]/div"
        )
      )
      .click();
    await driver.sleep(700);
    //بلیط هواپیما
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[1]/div[1]/div[1]/button"
        )
      )
      .click();
    await driver.sleep(300);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[1]/div/div[1]/div/div[1]"
        )
      )
      .click();
    await driver.sleep(300);
    await driver
      .findElement(By.xpath("/html/body/div[4]/div/ul/li[12]"))
      .click();
    await driver.sleep(700);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[1]/form/div[2]/div/div[2]/div/div/button"
        )
      )
      .click();
    await driver.sleep(700);
    const todayButton8 = await driver.wait(
      until.elementLocated(
        By.xpath("//button[normalize-space(text())='انتخاب امروز']")
      ),
      5000
    );
    await driver.wait(until.elementIsVisible(todayButton8), 5000);

    await driver.executeScript(
      "arguments[0].scrollIntoView(true);",
      todayButton8
    );
    await driver.sleep(200);

    await driver.executeScript("arguments[0].click();", todayButton8);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[1]/form/div[4]/div/div[2]/div/div/div/div[1]/div/span/span[1]/input"
        )
      )
      .click();
    await driver.sleep(100);
    const options9 = await driver.findElements(
      By.css(".ant-select-item-option")
    );
    if (options9.length > 0) {
      await driver.executeScript(
        "arguments[0].scrollIntoView(true);",
        options9[0]
      );
      await options9[0].click();
    }
    await driver.sleep(300);
    const goodsInput37 = await driver.findElement(
      By.id("sellWithCustomerForm_SaleTypeId")
    );
    await goodsInput37.click();
    await goodsInput37.sendKeys("فروش نقدی");
    await driver.sleep(300);
    await goodsInput37.sendKeys(Key.ENTER);
    await driver.sleep(300);
    const goodsInput36 = await driver.findElement(
      By.id("sellWithCustomerForm_PayOfTypeId")
    );
    await goodsInput36.click();
    await goodsInput36.sendKeys("نقدی");
    await driver.sleep(300);
    await goodsInput36.sendKeys(Key.ENTER);
    await driver.sleep(300);
    ///اقلام فاکتور
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[3]/span/span"
        )
      )
      .click();
    await driver.sleep(100);

    await driver.sleep(1000);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[3]/div/div[1]/div/span/span[1]"
        )
      )
      .click();
    await driver.sleep(100);
    const goodsInput35 = await driver.findElement(By.id("GoodsId"));
    await goodsInput35.click();
    await goodsInput35.sendKeys("new goods");
    await driver.sleep(300);

    const feeInput9 = await driver.findElement(By.id("Fee"));
    await feeInput9.click();
    await feeInput9.sendKeys(Key.CONTROL + "a");
    await feeInput9.sendKeys("100");
    await driver.sleep(700);
    // await driver
    //   .findElement(
    //     By.xpath(
    //       "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr[2]/td[4]/span/span"
    //     )
    //   )
    //   .click();
    const goodsInput34 = await driver.findElement(By.id("Unit1Id"));
    await goodsInput34.click();
    await goodsInput34.sendKeys("عدد");
    await driver.sleep(300);
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
    await driver.sleep(700);
    await driver.findElement(By.id("sellWithCustomerForm_FlightType")).click();

    const options10 = await driver.findElements(
      By.id("sellWithCustomerForm_FlightType")
    );
    if (options10.length > 0) {
      await driver.executeScript(
        "arguments[0].scrollIntoView(true);",
        options10[0]
      );
      await options10[0].click();
    }
    await driver.sleep(300);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div[1]/div[1]/div/div[2]/div"
        )
      )
      .click();
    await driver.sleep(2000);
    //بارنامه
    //
    await driver.navigate().refresh();
    // const editBtnXpath = "//span[@aria-label='ویرایش']";
    // await this._this._waitForElement(driver, editBtnXpath);
    // await driver.findElement(By.xpath(editBtnXpath)).click();
    // await driver.sleep(100);
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
    const test = new salesInvoiceListTest();
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

module.exports = salesInvoiceListTest;
