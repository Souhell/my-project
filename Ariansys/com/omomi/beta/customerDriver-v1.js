const { Builder, until, By, Actions } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const fs = require("fs");
const path = require("path");
const options = new chrome.Options();
options.addArguments('--headless', '--no-sandbox', '--disable-dev-shm-usage');
const colors = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  reset: "\x1b[0m",
};

class customDriver {
  constructor(storageFile = "persistRoot.json") {
    this.storagePath = path.join(__dirname, storageFile);
  }
  // 🎯 تعریف متدهای Actions
  getActions() {
    if (!this.driver) throw new Error("❌ Driver is not initialized.");
    this.actions = this.driver.actions({ async: true });
    return this.actions;
  }

  async selectAntOption(inputXpath, optionTitle) {
    // کلیک روی فیلد Select
    const input = await this.driver.findElement(By.xpath(inputXpath));
    await input.click();

    // صبر کن dropdown لود بشه
    await this.driver.wait(
      until.elementLocated(By.css(`.ant-select-item-option[title="${optionTitle}"]`)),
      5000
    );

    // انتخاب گزینه
    const option = await this.driver.findElement(
      By.css(`.ant-select-item-option[title="${optionTitle}"]`)
    );
    await option.click();
    await this.driver.sleep(500);
  }
  // 🖱️ کلیک راست روی المنت
  async contextClick(element, offset = null) {
    const actions = this.getActions();
    if (offset) {
      await actions.contextClick(element, offset).perform();
    } else {
      await actions.contextClick(element).perform();
    }
    return this;
  }

  // 🖱️ دابل کلیک روی المنت
  async doubleClick(element) {
    const actions = this.getActions();
    await actions.doubleClick(element).perform();
    return this;
  }

  // 🖱️ کلیک چپ روی المنت
  async click(element) {
    const actions = this.getActions();
    await actions.click(element).perform();
    return this;
  }

  // ⌨️ ارسال کلیدها به المنت
  async sendKeys(element, ...keys) {
    const actions = this.getActions();
    await actions
      .click(element)
      .sendKeys(...keys)
      .perform();
    return this;
  }

  // 🖱️ drag و drop
  async dragAndDrop(source, target) {
    const actions = this.getActions();
    await actions.dragAndDrop(source, target).perform();
    return this;
  }

  // 🖱️ حرکت موس به المنت
  async moveToElement(element, xOffset = 0, yOffset = 0) {
    const actions = this.getActions();
    await actions.move({ origin: element, x: xOffset, y: yOffset }).perform();
    return this;
  }

  // 🖱️ حرکت موس به مختصات خاص
  async moveToCoordinates(x, y) {
    const actions = this.getActions();
    await actions.move({ x: x, y: y }).perform();
    return this;
  }

  // ⌨️ فشار دادن کلید (مانند Ctrl، Shift، etc.)
  async keyDown(key) {
    const actions = this.getActions();
    await actions.keyDown(key).perform();
    return this;
  }

  // ⌨️ رها کردن کلید
  async keyUp(key) {
    const actions = this.getActions();
    await actions.keyUp(key).perform();
    return this;
  }

  // ⏸️ تأخیر (pause)
  async pause(duration) {
    const actions = this.getActions();
    await actions.pause(duration).perform();
    return this;
  }

  // 🧹 ریست اکشن‌ها
  clearActions() {
    this.actions = null;
    return this;
  }
  // 🚀 ساخت درایور با امکان ری‌استور persist:root
  async createDriver(url, withPersist) {
    const options = new chrome.Options();
    options.setUserPreferences({
      "profile.default_content_setting_values.notifications": 1,
    });
    this.driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .build();
    if (url && withPersist == true) {
      await this.driver.get(url);
    }
    await this.driver.manage().setTimeouts({ implicit: 10000 });
    await this.driver.manage().window().maximize();
    // ⬅️ اگر persist:root وجود داشت برش گردون

    return this.driver;
  }

  // 💾 ذخیره persist:root از مرورگر
  async savePersist() {
    if (!this.driver) throw new Error("❌ Driver is not initialized.");
    const persisted = await this.driver.executeScript(
      `return window.localStorage.getItem("persist:root");`
    );
    if (persisted) {
      fs.writeFileSync(this.storagePath, persisted, "utf-8");
      console.log(`${colors.green}✅ persist:root saved${colors.reset}`);
    } else {
      console.log(
        `${colors.red}⚠️ No persist:root found in localStorage${colors.reset}`
      );
    }
  }

  // تابع تولید کد ملی
  static generateNationalId() {
    let digits;
    do {
      digits = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));
    } while (digits.every((d) => d === 0));
    const check =
      digits
        .map((digit, index) => digit * (10 - index))
        .reduce((sum, val) => sum + val, 0) % 11;
    const controlDigit = check < 2 ? check : 11 - check;
    return digits.join("") + controlDigit;
  }

  //اجرای سناریو لاگین
  async login() {
    await this.driver.wait(until.elementLocated(By.css("body")), 10000);
    if (fs.existsSync(this.storagePath)) {
      const persisted = fs.readFileSync(this.storagePath, "utf-8");
      await this.driver.executeScript(
        `window.localStorage.setItem("persist:root", arguments[0]);`,
        persisted
      );
      console.log(`${colors.green}📦 persist:root restored${colors.reset}`);
      await this.driver.navigate().refresh();
    }
    console.log("login with customer driver call");
    const loginpath = "/html/body/div[3]/main/div/div/div/div[2]/form";
    await this.driver
      .findElement(By.xpath(`${loginpath}/div[1]/div/div[2]/div/div/input`))
      .sendKeys("12");
    await this.driver
      .findElement(
        By.xpath(`${loginpath}/div[2]/div/div[2]/div/div/span/input`)
      )
      .sendKeys("12");
    await this.driver
      .findElement(By.xpath(`${loginpath}/div[4]/div/div[2]/div/div/button`))
      .click();
    await this.driver.sleep(1000);

    await this.driver
      .findElement(
        By.xpath("/html/body/div[3]/main/div/div/div/div/div/button")
      )
      .click();
    await this.driver.sleep(1000);
  }

  // 🔴 بستن درایور
  async quit() {
    if (this.driver) {
      await this.driver.quit();
      this.driver = null;
    }
  }
}

module.exports = customDriver;



// // // مثال استفاده در کدهای دیگر
// const customDriver = require('./customDriver');
// const dr = new customDriver();

// async function example() {
//   await dr.createDriver('https://example.com', true);
  
//   const element = await dr.driver.findElement(By.id('my-element'));
  
//   // استفاده از متدهای مختلف Actions
//   await dr.contextClick(element); // کلیک راست
//   await dr.doubleClick(element); // دابل کلیک
//   await dr.moveToElement(element, 10, 10); // حرکت موس
//   await dr.sendKeys(element, 'Hello World'); // ارسال متن
//   await dr.keyDown(Key.CONTROL); // فشار دادن Ctrl
//   await dr.pause(1000); // تأخیر 1 ثانیه
  
//   await dr.quit();
// }