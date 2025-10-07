const { Builder, until, By, Key } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const fs = require("fs");
const path = require("path");
const { expect } = require("chai");
const schedule = require("node-schedule");

const colors = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  reset: "\x1b[0m",
};

class customDriver {
  constructor(storageFile = "persistRoot.json") {
    this.storagePath = path.join(__dirname, storageFile);
  }

  // ========================
  // 🎯 Driver & Actions
  // ========================
  getActions() {
    if (!this.driver) throw new Error("❌ Driver is not initialized.");
    this.actions = this.driver.actions({ async: true });
    return this.actions;
  }

  async createDriver(url, withPersist, headless = false) {
    const options = new chrome.Options();
    if (headless) {
      options.addArguments("--headless", "--no-sandbox", "--disable-dev-shm-usage");
    }
    options.setUserPreferences({
      "profile.default_content_setting_values.notifications": 1,
    });

    this.driver = await new Builder().forBrowser("chrome").setChromeOptions(options).build();

    if (url && withPersist === true) {
      await this.driver.get(url);
    }
    await this.driver.manage().setTimeouts({ implicit: 10000 });
    await this.driver.manage().window().maximize();

    return this.driver;
  }

  async quit() {
    if (this.driver) {
      await this.driver.quit();
      this.driver = null;
    }
  }

  // ========================
  // 🎯 Persist Storage
  // ========================
  async savePersist() {
    if (!this.driver) throw new Error("❌ Driver is not initialized.");
    const persisted = await this.driver.executeScript(
      `return window.localStorage.getItem("persist:root");`
    );
    if (persisted) {
      fs.writeFileSync(this.storagePath, persisted, "utf-8");
      console.log(`${colors.green}✅ persist:root saved${colors.reset}`);
    } else {
      console.log(`${colors.red}⚠️ No persist:root found${colors.reset}`);
    }
  }

  async restorePersist() {
    if (fs.existsSync(this.storagePath)) {
      const persisted = fs.readFileSync(this.storagePath, "utf-8");
      await this.driver.executeScript(
        `window.localStorage.setItem("persist:root", arguments[0]);`,
        persisted
      );
      console.log(`${colors.green}📦 persist:root restored${colors.reset}`);
      await this.driver.navigate().refresh();
    }
  }

  // ========================
  // 🎯 Helpers for Elements
  // ========================
  async SelectByTitle(title) {
    const btn = await this.driver.wait(
      until.elementLocated(By.xpath(`//button[contains(@class, "ant-btn") and span[text()="${title}"]]`)),
      5000
    );
    await btn.click();
  }

  async SelectByContainsTitle(title) {
    const btn = await this.driver.wait(
      until.elementLocated(By.xpath(`//*[contains(@title, "${title}")]`)),
      5000
    );
    await btn.click();
  }

  async ClickByText(tag, text) {
    const el = await this.driver.wait(
      until.elementLocated(By.xpath(`//${tag}[contains(text(),"${text}")]`)),
      5000
    );
    await el.click();
  }

  async ClickFirstByClass(className) {
    const els = await this.driver.wait(
      until.elementsLocated(By.css(`.${className}`)),
      5000
    );
    if (els.length > 0) await els[0].click();
  }

  async ClickByClassAndIndex(className, idx) {
    const els = await this.driver.wait(
      until.elementsLocated(By.css(`.${className}`)),
      5000
    );
    if (els.length > idx) await els[idx].click();
  }

  async WaitForTitle(title) {
    await this.driver.wait(
      until.elementLocated(By.xpath(`//*[contains(@title, "${title}")]`)),
      5000
    );
  }

  // نسخه اصلی ساده‌تر (برای سازگاری با کدهای قبلی)
  async selectAntOption(inputXpath, optionTitle) {
    const input = await this.driver.findElement(By.xpath(inputXpath));
    await input.click();
    await this.driver.wait(
      until.elementLocated(By.css(`.ant-select-item-option[title="${optionTitle}"]`)),
      5000
    );
    const option = await this.driver.findElement(
      By.css(`.ant-select-item-option[title="${optionTitle}"]`)
    );
    await option.click();
    await this.driver.sleep(500);
  }

  // 🆕 نسخه جدید کامل‌تر و هوشمندتر
  /**
   * انتخاب گزینه از Ant Design Select
   * @param {string} selectCss - CSS سلکتور برای جعبه Select (مثلاً ".ant-select")
   * @param {number|string} option - اندیس عددی (مثل 0 یا 2) یا متن گزینه ("گروه اسفند ماه 1403")
   */
  async selectAntOptionV2(selectCss, option) {
    const { By, until } = require("selenium-webdriver");

    // 1️⃣ پیدا کردن و کلیک روی Select اصلی
    const selectBox = await this.driver.findElement(By.css(selectCss));
    await this.driver.executeScript("arguments[0].click();", selectBox);

    // 2️⃣ صبر برای رندر dropdown
    await this.driver.wait(
      until.elementLocated(
        By.xpath(
          "//div[contains(@class, 'ant-select-item-option') or contains(@class, 'ant-select-item-option-content')]"
        )
      ),
      8000
    );

    // 3️⃣ گرفتن همه گزینه‌ها
    const options = await this.driver.findElements(
      By.xpath(
        "//div[contains(@class, 'ant-select-item-option') or contains(@class, 'ant-select-item-option-content')]"
      )
    );

    if (options.length === 0)
      throw new Error("❌ هیچ گزینه‌ای در dropdown یافت نشد");

    let targetOption;

    // 4️⃣ انتخاب بر اساس نوع ورودی
    if (typeof option === "number") {
      targetOption = options[option];
    } else {
      for (let el of options) {
        const text = await el.getText();
        if (text.trim() === option.trim()) {
          targetOption = el;
          break;
        }
      }
    }

    if (!targetOption)
      throw new Error(`❌ گزینه '${option}' یافت نشد`);

    // 5️⃣ اسکرول و کلیک امن
    await this.driver.executeScript(
      "arguments[0].scrollIntoView({block:'center'});",
      targetOption
    );
    await this.driver.executeScript("arguments[0].click();", targetOption);

    await this.driver.sleep(300);
  }

  // ========================
  // 🎯 Actions Helpers
  // ========================
  async contextClick(element, offset = null) {
    const actions = this.getActions();
    if (offset) {
      await actions.contextClick(element, offset).perform();
    } else {
      await actions.contextClick(element).perform();
    }
    return this;
  }

  async doubleClick(element) {
    const actions = this.getActions();
    await actions.doubleClick(element).perform();
    return this;
  }

  async click(element) {
    const actions = this.getActions();
    await actions.click(element).perform();
    return this;
  }

  async sendKeys(element, ...keys) {
    const actions = this.getActions();
    await actions.click(element).sendKeys(...keys).perform();
    return this;
  }

  async dragAndDrop(source, target) {
    const actions = this.getActions();
    await actions.dragAndDrop(source, target).perform();
    return this;
  }

  async moveToElement(element, xOffset = 0, yOffset = 0) {
    const actions = this.getActions();
    await actions.move({ origin: element, x: xOffset, y: yOffset }).perform();
    return this;
  }

  async moveToCoordinates(x, y) {
    const actions = this.getActions();
    await actions.move({ x, y }).perform();
    return this;
  }

  async keyDown(key) {
    const actions = this.getActions();
    await actions.keyDown(key).perform();
    return this;
  }

  async keyUp(key) {
    const actions = this.getActions();
    await actions.keyUp(key).perform();
    return this;
  }

  async pause(duration) {
    const actions = this.getActions();
    await actions.pause(duration).perform();
    return this;
  }

  clearActions() {
    this.actions = null;
    return this;
  }

  // ========================
  // 🎯 Static Utils
  // ========================
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

  static generateIranianMobile() {
    const prefixes = [
      "0910","0911","0912","0913","0914","0915","0916","0917","0918","0919",
      "0920","0921","0922","0923","0930","0933","0935","0936","0937","0938","0939",
      "0990","0991","0992","0993","0994"
    ];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const rest = Array.from({ length: 7 }, () => Math.floor(Math.random() * 10)).join("");
    return prefix + rest;
  }

  static generateBankCard() {
    let card = Array.from({ length: 15 }, () => Math.floor(Math.random() * 10));
    let sum = 0;
    for (let i = 0; i < 15; i++) {
      let digit = card[14 - i];
      if (i % 2 === 0) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
    }
    const checkDigit = (10 - (sum % 10)) % 10;
    return card.join("") + checkDigit;
  }

  // ========================
  // 🎯 Login Scenario
  // ========================
  async login(username = "12", password = "12") {
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

    console.log("🔑 login with customDriver");

    const loginpath = "/html/body/div[3]/main/div/div/div/div[3]/form";
    await this.driver.findElement(By.xpath(`${loginpath}/div[1]/div/div[2]/div/div/input`)).sendKeys(username);
    await this.driver.findElement(By.xpath(`${loginpath}/div[2]/div/div/div/div/button`)).click();
    await this.driver.findElement(By.xpath(`${loginpath}/div[1]/div/div[2]/div/div/span/input`)).sendKeys(password);
    await this.driver.findElement(By.xpath(`${loginpath}/div[2]/div/div/div/div/button`)).click();

    await this.driver.sleep(1000);
  }
}

module.exports = customDriver;
