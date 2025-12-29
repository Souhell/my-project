const { Builder, until, By, Key } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const fs = require("fs");
const path = require("path");
const { expect } = require("chai");
const { spawn } = require("child_process");
const schedule = require("node-schedule");

const colors = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  reset: "\x1b[0m",
};

class customDriver {
  constructor(storageFile = "persistRoot.json") {
    this.storagePath = path.join(__dirname, storageFile);
    this.ffmpegProcess = null;
    this.videoPath = null;
    this.isRecording = false;
    this.driver = null;
    this.actions = null;

    // تنظیم مسیر FFmpeg - قابل تنظیم
    this.FFMPEG_PATH = process.env.FFMPEG_PATH || "C:\\ffmpeg\\bin\\ffmpeg.exe";

    console.log(
      `${colors.cyan}🚀 customDriver v2.0 Initialized${colors.reset}`
    );
  }

  // ========================
  // 🎯 سیستم ضبط ویدیو (از نسخه 1)
  // ========================

  uuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  /**
   * شروع ضبط ویدیو از صفحه
   * @param {Object} options - تنظیمات ضبط
   * @param {string} options.framerate - نرخ فریم (پیش‌فرض: 30)
   * @param {string} options.outputDir - پوشه خروجی
   * @returns {boolean} - موفقیت آمیز بودن
   */
  startRecording(options = {}) {
    try {
      const framerate = options.framerate || "30";
      const outputDir = options.outputDir || __dirname;

      // ایجاد پوشه خروجی اگر وجود ندارد
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      this.videoPath = path.join(outputDir, `${this.uuidv4()}.mp4`);

      // بررسی وجود FFmpeg
      if (!fs.existsSync(this.FFMPEG_PATH)) {
        console.warn(
          `${colors.yellow}⚠️ FFmpeg not found at: ${this.FFMPEG_PATH}${colors.reset}`
        );
        console.log(
          `${colors.blue}💡 Tip: Set FFMPEG_PATH env variable or install FFmpeg${colors.reset}`
        );
        return false;
      }

      // پارامترهای ضبط
      const args = [
        "-y",
        "-f",
        "gdigrab", // برای ویندوز
        "-i",
        "desktop",
        "-framerate",
        framerate,
        "-threads",
        "4",
        "-preset",
        "ultrafast",
        this.videoPath,
      ];

      // برای سیستم‌عامل‌های دیگر
      if (process.platform === "darwin") {
        // macOS
        args[1] = "avfoundation";
        args[3] = "1:none";
      } else if (process.platform === "linux") {
        args[1] = "x11grab";
        args[3] = ":0.0";
      }

      this.ffmpegProcess = spawn(this.FFMPEG_PATH, args);

      // مدیریت خطاها
      this.ffmpegProcess.stderr.on("data", (data) => {
        const output = data.toString();
        if (output.includes("Error") || output.includes("failed")) {
          console.error(
            `${colors.red}❌ FFmpeg Error: ${output.substring(0, 100)}${
              colors.reset
            }`
          );
        }
      });

      this.ffmpegProcess.on("error", (err) => {
        console.error(
          `${colors.red}❌ FFmpeg Process Error: ${err.message}${colors.reset}`
        );
        this.ffmpegProcess = null;
        this.isRecording = false;
      });

      this.ffmpegProcess.on("spawn", () => {
        this.isRecording = true;
        console.log(
          `${colors.green}🎥 Recording started: ${this.videoPath}${colors.reset}`
        );
      });

      return true;
    } catch (error) {
      console.error(
        `${colors.red}❌ Failed to start recording: ${error.message}${colors.reset}`
      );
      return false;
    }
  }

  /**
   * توقف ضبط ویدیو
   * @param {boolean} keepOnError - نگهداری ویدیو در صورت خطا
   * @returns {Promise<string|null>} - مسیر فایل ویدیو یا null
   */
  async stopRecording(keepOnError = false) {
    if (!this.ffmpegProcess || !this.isRecording) {
      console.log(
        `${colors.yellow}⚠️ No active recording process${colors.reset}`
      );
      return null;
    }

    const proc = this.ffmpegProcess;
    const videoPath = this.videoPath;

    // ریست فیلدها
    this.ffmpegProcess = null;
    this.videoPath = null;
    this.isRecording = false;

    return new Promise((resolve) => {
      let finished = false;

      const finish = (success = false) => {
        if (finished) return;
        finished = true;

        console.log(`${colors.blue}🎬 Recording finished${colors.reset}`);

        // مدیریت فایل ویدیو
        try {
          if (!success && keepOnError && fs.existsSync(videoPath)) {
            console.log(
              `${colors.yellow}📁 Video kept for debugging: ${videoPath}${colors.reset}`
            );
            resolve(videoPath);
          } else if (success && fs.existsSync(videoPath)) {
            fs.unlinkSync(videoPath);
            console.log(
              `${colors.green}✅ Video deleted (test passed)${colors.reset}`
            );
            resolve(null);
          } else if (success) {
            console.log(
              `${colors.green}✅ Recording completed successfully${colors.reset}`
            );
            resolve(null);
          } else {
            console.log(`${colors.red}❌ Recording failed${colors.reset}`);
            resolve(null);
          }
        } catch (error) {
          console.error(
            `${colors.red}❌ Error handling video file: ${error.message}${colors.reset}`
          );
          resolve(null);
        }
      };

      if (proc.exitCode !== null) {
        finish(proc.exitCode === 0);
        return;
      }

      const timeout = setTimeout(() => {
        console.warn(
          `${colors.yellow}⚠️ Force stopping FFmpeg after timeout${colors.reset}`
        );
        try {
          proc.kill("SIGKILL");
        } catch (e) {
          // ignore
        }
        finish(false);
      }, 5000);

      proc.on("close", (code) => {
        clearTimeout(timeout);
        console.log(
          `${colors.blue}📼 FFmpeg closed with code: ${code}${colors.reset}`
        );
        finish(code === 0);
      });

      proc.on("error", (error) => {
        clearTimeout(timeout);
        console.error(
          `${colors.red}❌ FFmpeg process error: ${error.message}${colors.reset}`
        );
        finish(false);
      });

      // ارسال سیگنال توقف به FFmpeg
      try {
        if (proc.stdin && proc.stdin.writable) {
          proc.stdin.write("q");
          proc.stdin.end();
        } else {
          proc.kill("SIGINT");
        }
      } catch (error) {
        console.warn(
          `${colors.yellow}⚠️ Could not send stop signal: ${error.message}${colors.reset}`
        );
        proc.kill("SIGTERM");
      }
    });
  }

  // ========================
  // 🎯 مدیریت Driver (ترکیب دو نسخه)
  // ========================

  getActions() {
    if (!this.driver)
      throw new Error(
        `${colors.red}❌ Driver is not initialized.${colors.reset}`
      );
    this.actions = this.driver.actions({ async: true });
    return this.actions;
  }

  /**
   * ایجاد درایور جدید
   * @param {string} url - آدرس شروع
   * @param {boolean} withPersist - بازیابی localStorage
   * @param {boolean} headless - حالت بدون نمایش
   * @param {boolean} autoRecord - شروع خودکار ضبط
   * @returns {Promise} - instance WebDriver
   */
  async createDriver(
    url,
    withPersist = false,
    headless = false,
    autoRecord = false
  ) {
    console.log(`${colors.cyan}🚗 Creating Chrome Driver...${colors.reset}`);

    const options = new chrome.Options();

    // تنظیمات اضافی برای عملکرد بهتر
    options.addArguments(
      "--disable-blink-features=AutomationControlled",
      "--disable-infobars",
      "--disable-notifications",
      "--disable-popup-blocking",
      "--disable-web-security",
      "--disable-features=IsolateOrigins,site-per-process",
      "--disable-site-isolation-trials"
    );

    if (headless) {
      options.addArguments(
        "--headless=new",
        "--no-sandbox",
        "--disable-dev-shm-usage",
        "--window-size=1920,1080"
      );
    } else {
      options.addArguments("--start-maximized");
    }

    // تنظیمات کاربر
    options.setUserPreferences({
      "profile.default_content_setting_values.notifications": 1,
      credentials_enable_service: false,
      "profile.password_manager_enabled": false,
    });

    // حذف شناسایی اتوماسیون
    options.setExcludeSwitches(["enable-automation", "enable-logging"]);
    options.addArguments("--disable-blink-features=AutomationControlled");

    try {
      this.driver = await new Builder()
        .forBrowser("chrome")
        .setChromeOptions(options)
        .build();

      // مدیریت timeoutها
      await this.driver.manage().setTimeouts({
        implicit: 15000,
        pageLoad: 30000,
        script: 30000,
      });

      if (!headless) {
        await this.driver.manage().window().maximize();
      }

      // رفتن به آدرس اگر مشخص شده
      if (url) {
        await this.driver.get(url);
        console.log(`${colors.green}🌐 Navigated to: ${url}${colors.reset}`);

        // بازیابی localStorage اگر درخواست شده
        if (withPersist) {
          await this.restorePersist();
        }
      }

      // شروع ضبط خودکار اگر فعال باشد
      if (autoRecord) {
        this.startRecording();
      }

      return this.driver;
    } catch (error) {
      console.error(
        `${colors.red}❌ Failed to create driver: ${error.message}${colors.reset}`
      );
      throw error;
    }
  }

  async quit(keepVideoOnError = false) {
    try {
      // توقف ضبط
      if (this.isRecording) {
        await this.stopRecording(keepVideoOnError);
      }

      // بستن درایور
      if (this.driver) {
        await this.driver.quit();
        this.driver = null;
        console.log(
          `${colors.green}✅ Driver closed successfully${colors.reset}`
        );
      }
    } catch (error) {
      console.error(
        `${colors.red}❌ Error quitting driver: ${error.message}${colors.reset}`
      );
    }
  }

  // ========================
  // 🎯 مدیریت Session (از نسخه 2)
  // ========================

  async savePersist(key = "persist:root") {
    if (!this.driver)
      throw new Error(
        `${colors.red}❌ Driver is not initialized.${colors.reset}`
      );

    try {
      const persisted = await this.driver.executeScript(
        `return window.localStorage.getItem(arguments[0]);`,
        key
      );

      if (persisted) {
        fs.writeFileSync(this.storagePath, persisted, "utf-8");
        console.log(
          `${colors.green}✅ ${key} saved to ${this.storagePath}${colors.reset}`
        );
        return true;
      } else {
        console.log(
          `${colors.yellow}⚠️ No ${key} found in localStorage${colors.reset}`
        );
        return false;
      }
    } catch (error) {
      console.error(
        `${colors.red}❌ Error saving persist: ${error.message}${colors.reset}`
      );
      return false;
    }
  }

  async restorePersist(key = "persist:root") {
    if (!fs.existsSync(this.storagePath)) {
      console.log(
        `${colors.yellow}⚠️ No persist file found at ${this.storagePath}${colors.reset}`
      );
      return false;
    }

    try {
      const persisted = fs.readFileSync(this.storagePath, "utf-8");
      await this.driver.executeScript(
        `window.localStorage.setItem(arguments[0], arguments[1]);`,
        key,
        persisted
      );
      console.log(
        `${colors.green}📦 ${key} restored from ${this.storagePath}${colors.reset}`
      );

      // رفرش صفحه برای اعمال تغییرات
      await this.driver.navigate().refresh();
      await this.driver.sleep(1000);

      return true;
    } catch (error) {
      console.error(
        `${colors.red}❌ Error restoring persist: ${error.message}${colors.reset}`
      );
      return false;
    }
  }

  // ========================
  // 🎯 Helper Methods (ترکیب دو نسخه)
  // ========================

  async SelectByTitle(title) {
    const btn = await this.driver.wait(
      until.elementLocated(
        By.xpath(
          `//button[contains(@class, "ant-btn") and span[text()="${title}"]]`
        )
      ),
      10000,
      `Button with title "${title}" not found`
    );
    await btn.click();
    console.log(`${colors.blue}🖱️ Clicked button: ${title}${colors.reset}`);
    return btn;
  }

  async SelectByContainsTitle(title) {
    const btn = await this.driver.wait(
      until.elementLocated(By.xpath(`//*[contains(@title, "${title}")]`)),
      10000
    );
    await btn.click();
    return btn;
  }

  async ClickByText(tag, text) {
    const el = await this.driver.wait(
      until.elementLocated(By.xpath(`//${tag}[contains(text(),"${text}")]`)),
      10000
    );
    await el.click();
    return el;
  }

  async ClickFirstByClass(className) {
    const els = await this.driver.wait(
      until.elementsLocated(By.css(`.${className}`)),
      10000
    );
    if (els.length > 0) {
      await els[0].click();
      return els[0];
    }
    throw new Error(`No elements found with class: ${className}`);
  }

  async ClickByClassAndIndex(className, idx) {
    const els = await this.driver.wait(
      until.elementsLocated(By.css(`.${className}`)),
      10000
    );
    if (els.length > idx) {
      await els[idx].click();
      return els[idx];
    }
    throw new Error(`Element index ${idx} not found in class: ${className}`);
  }

  async WaitForTitle(title, timeout = 10000) {
    await this.driver.wait(
      until.elementLocated(By.xpath(`//*[contains(@title, "${title}")]`)),
      timeout
    );
  }

  // نسخه اصلی (برای سازگاری)
  async selectAntOption(inputXpath, optionTitle) {
    const input = await this.driver.findElement(By.xpath(inputXpath));
    await input.click();

    const optionLocator = By.css(
      `.ant-select-item-option[title="${optionTitle}"]`
    );
    await this.driver.wait(until.elementLocated(optionLocator), 8000);

    const option = await this.driver.findElement(optionLocator);
    await option.click();
    await this.driver.sleep(500);

    return option;
  }

  // نسخه پیشرفته V2 (از نسخه 2)
  async selectAntOptionV2(selectCss, option) {
    // 1️⃣ پیدا کردن و کلیک روی Select اصلی
    const selectBox = await this.driver.findElement(By.css(selectCss));
    await this.driver.executeScript("arguments[0].click();", selectBox);

    // 2️⃣ صبر برای رندر dropdown
    const dropdownLocator = By.xpath(
      "//div[contains(@class, 'ant-select-dropdown') and not(contains(@style, 'display: none'))]"
    );
    await this.driver.wait(until.elementLocated(dropdownLocator), 8000);

    // 3️⃣ گرفتن همه گزینه‌ها
    const options = await this.driver.findElements(
      By.xpath("//div[contains(@class, 'ant-select-item-option')]")
    );

    if (options.length === 0) {
      throw new Error("❌ هیچ گزینه‌ای در dropdown یافت نشد");
    }

    let targetOption = null;

    // 4️⃣ انتخاب بر اساس نوع ورودی
    if (typeof option === "number") {
      if (option < options.length) {
        targetOption = options[option];
      }
    } else {
      for (let el of options) {
        const text = await el.getText();
        if (text.trim() === option.trim()) {
          targetOption = el;
          break;
        }
      }
    }

    if (!targetOption) {
      throw new Error(`❌ گزینه '${option}' یافت نشد`);
    }

    // 5️⃣ اسکرول و کلیک امن
    await this.driver.executeScript(
      "arguments[0].scrollIntoView({block:'center'});",
      targetOption
    );
    await this.driver.sleep(300);
    await this.driver.executeScript("arguments[0].click();", targetOption);
    await this.driver.sleep(500);

    return targetOption;
  }

  // ========================
  // 🎯 Actions Helpers (ترکیب)
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
    await actions
      .click(element)
      .sendKeys(...keys)
      .perform();
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
  // 🎯 Schedule Helper (از نسخه 1)
  // ========================

  scheduleJob(cronOrDate, callback) {
    return schedule.scheduleJob(cronOrDate, callback);
  }

  // ========================
  // 🎯 تولرانس‌ها و Waiting بهتر
  // ========================

  async waitForElement(selector, timeout = 10000, pollInterval = 500) {
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      try {
        const element = await this.driver.findElement(By.css(selector));
        if (element && (await element.isDisplayed())) {
          return element;
        }
      } catch (error) {
        // ignore and continue
      }
      await this.driver.sleep(pollInterval);
    }

    throw new Error(`Element not found: ${selector}`);
  }

  async waitForElementXPath(xpath, timeout = 10000) {
    return await this.driver.wait(
      until.elementLocated(By.xpath(xpath)),
      timeout
    );
  }

  async waitForPageLoad(timeout = 30000) {
    await this.driver.wait(async () => {
      return (
        (await this.driver.executeScript("return document.readyState")) ===
        "complete"
      );
    }, timeout);
  }

  async takeScreenshot(name = "screenshot") {
    if (!this.driver) return null;

    const screenshot = await this.driver.takeScreenshot();
    const screenshotPath = path.join(__dirname, `${name}_${Date.now()}.png`);

    fs.writeFileSync(screenshotPath, screenshot, "base64");
    console.log(
      `${colors.blue}📸 Screenshot saved: ${screenshotPath}${colors.reset}`
    );

    return screenshotPath;
  }

  // ========================
  // 🎯 Login Scenario (بهبود یافته)
  // ========================

  async login(username = "12", password = "12", loginPath = null) {
    console.log(`${colors.cyan}🔑 Starting login process...${colors.reset}`);

    await this.driver.wait(until.elementLocated(By.css("body")), 15000);

    // بازیابی session اگر وجود دارد
    if (fs.existsSync(this.storagePath)) {
      await this.restorePersist();
    }

    // مسیر لاگین پیش‌فرض یا سفارشی
    const loginXPath =
      loginPath || "/html/body/div[3]/main/div/div/div/div[3]/form";

    try {
      // وارد کردن نام کاربری
      const usernameInput = await this.driver.findElement(
        By.xpath(`${loginXPath}/div[1]/div/div[2]/div/div/input`)
      );
      await usernameInput.clear();
      await usernameInput.sendKeys(username);
      console.log(`${colors.green}✅ Username entered${colors.reset}`);

      // کلیک روی دکمه ادامه
      const continueBtn = await this.driver.findElement(
        By.xpath(`${loginXPath}/div[2]/div/div/div/div/button`)
      );
      await continueBtn.click();
      console.log(`${colors.green}✅ Continue button clicked${colors.reset}`);

      await this.driver.sleep(1000);

      // وارد کردن رمز عبور
      const passwordInput = await this.driver.findElement(
        By.xpath(`${loginXPath}/div[1]/div/div[2]/div/div/span/input`)
      );
      await passwordInput.clear();
      await passwordInput.sendKeys(password);
      console.log(`${colors.green}✅ Password entered${colors.reset}`);

      // کلیک روی دکمه ورود
      const loginBtn = await this.driver.findElement(
        By.xpath(`${loginXPath}/div[3]/div/div/div/div/button`)
      );
      await loginBtn.click();
      console.log(`${colors.green}✅ Login button clicked${colors.reset}`);

      // منتظر لاگین موفق
      await this.driver.sleep(2000);
      console.log(`${colors.green}✅ Login process completed${colors.reset}`);

      return true;
    } catch (error) {
      console.error(
        `${colors.red}❌ Login failed: ${error.message}${colors.reset}`
      );
      await this.takeScreenshot("login_error");
      throw error;
    }
  }

  // ========================
  // 🎯 Static Utils (ترکیب)
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
      "0910",
      "0911",
      "0912",
      "0913",
      "0914",
      "0915",
      "0916",
      "0917",
      "0918",
      "0919",
      "0920",
      "0921",
      "0922",
      "0923",
      "0930",
      "0933",
      "0935",
      "0936",
      "0937",
      "0938",
      "0939",
      "0990",
      "0991",
      "0992",
      "0993",
      "0994",
    ];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const rest = Array.from({ length: 7 }, () =>
      Math.floor(Math.random() * 10)
    ).join("");
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

  static generateEmail() {
    const domains = ["gmail.com", "yahoo.com", "outlook.com", "mail.com"];
    const randomString = Math.random().toString(36).substring(2, 10);
    const domain = domains[Math.floor(Math.random() * domains.length)];
    return `${randomString}@${domain}`;
  }

  // ========================
  // 🎯 Utility Methods جدید
  // ========================

  /**
   * اجرای اسکریپت JavaScript در صفحه
   */
  async executeScript(script, ...args) {
    return await this.driver.executeScript(script, ...args);
  }

  /**
   * گرفتن URL جاری
   */
  async getCurrentUrl() {
    return await this.driver.getCurrentUrl();
  }

  /**
   * رفتن به URL
   */
  async navigateTo(url) {
    await this.driver.get(url);
    await this.waitForPageLoad();
  }

  /**
   * گرفتن عنوان صفحه
   */
  async getPageTitle() {
    return await this.driver.getTitle();
  }

  /**
   * رفرش صفحه
   */
  async refreshPage() {
    await this.driver.navigate().refresh();
    await this.waitForPageLoad();
  }

  /**
   * بازگشت به صفحه قبل
   */
  async goBack() {
    await this.driver.navigate().back();
    await this.waitForPageLoad();
  }

  /**
   * رفتن به صفحه بعد
   */
  async goForward() {
    await this.driver.navigate().forward();
    await this.waitForPageLoad();
  }

  /**
   * حذف تمام کوکی‌ها
   */
  async clearCookies() {
    await this.driver.manage().deleteAllCookies();
    console.log(`${colors.green}✅ All cookies cleared${colors.reset}`);
  }

  /**
   * حذف localStorage
   */
  async clearLocalStorage() {
    await this.driver.executeScript("window.localStorage.clear();");
    console.log(`${colors.green}✅ LocalStorage cleared${colors.reset}`);
  }
}

module.exports = customDriver;
