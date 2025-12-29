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
  reset: "\x1b[0m",
};

class customDriver {
  constructor(storageFile = "persistRoot.json") {
    this.storagePath = path.join(__dirname, storageFile);
    this.ffmpegProcess = null;
    this.videoPath = null;
  }

  //recorder feilds
  ffmpegProcess;
  FFMPEG_PATH = "C:\\ffmpeg\\bin\\ffmpeg.exe";
  videoPath;
  //make guid code
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

  // ========================
  // 🎯 starting sc record
  // ========================
  _startRecording() {
    try {
      this.videoPath = path.join(
        __dirname,
        "TestVideos",
        `${this.uuidv4()}.mp4`
      );

      if (!fs.existsSync(this.FFMPEG_PATH)) {
        console.warn("⚠️ ffmpeg error in path => ", this.FFMPEG_PATH);
        return;
      }

      this.ffmpegProcess = spawn(this.FFMPEG_PATH, [
        "-y",
        "-f",
        "gdigrab",
        "-i",
        "desktop",
        "-framerate",
        "30",
        this.videoPath,
      ]);

      this.ffmpegProcess.stderr.on("data", (data) => {});

      this.ffmpegProcess.on("error", (err) => {
        console.error("❌ خطا در اجرای ffmpeg:", err.message);
      });

      console.log("🎥 rec started...");
      return this.videoPath;
    } catch (e) {
      console.error("❌ can not run ffmpeg", e);
      this.ffmpegProcess = null;
    }
  }

  // ========================
  // 🎯wait for element
  // ========================
  async waitForElement(driver, xpath, timeout = 10000) {
    return await driver.wait(until.elementLocated(By.xpath(xpath)), timeout);
  }

  // ========================
  // 🎯 stop sc record
  // ========================
  async stopRecording(errorHappened = false) {
    if (!this.ffmpegProcess) {
      console.log("🎞none activate record process");
      return;
    }

    const proc = this.ffmpegProcess;
    const videoPath = this.videoPath;

    this.ffmpegProcess = null;
    this.videoPath = null;

    return new Promise((resolve) => {
      let finished = false;

      const finish = () => {
        if (finished) return;
        finished = true;

        console.log("rec finished");

        try {
          if (!errorHappened && fs.existsSync(videoPath)) {
            fs.unlinkSync(videoPath);
            console.log("rec success without error");
          } else if (errorHappened && fs.existsSync(videoPath)) {
            console.log("rec error =>", videoPath);
          } else if (errorHappened) {
            console.warn("⚠️not found file ");
          }
        } catch (e) {
          console.error("⚠️error :", e.message);
        }

        resolve();
      };

      if (proc.exitCode !== null) {
        return finish();
      }

      proc.on("close", (code) => {
        console.log(`ffmeg with code:${code} closed`);
        finish();
      });

      proc.on("error", (e) => {
        console.error("⚠️ error in ffmpeg process =>", e.message);
        finish();
      });

      try {
        if (proc.stdin && proc.stdin.writable) {
          proc.stdin.write("q");
          proc.stdin.end();
        } else {
          proc.kill("SIGINT");
        }
      } catch (e) {
        console.error("⚠️ error in ffmpeg process =>", e.message);
        try {
          proc.kill("SIGTERM");
        } catch (killErr) {
          console.error("⚠️error ", killErr.message);
        }
      }

      setTimeout(() => {
        if (!finished) {
          console.warn("⚠️ error in killing ffmpeg process.");
          try {
            proc.kill("SIGKILL");
          } catch (e) {
            console.error("⚠️ خطا در SIGKILL:", e.message);
          }
          finish();
        }
      }, 3000);
    });
  }

  // ========================
  // 🎯 Schedule Helper
  // ========================
  scheduleJob(cronOrDate, callback) {
    return schedule.scheduleJob(cronOrDate, callback);
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
      options.addArguments(
        "--headless",
        "--no-sandbox",
        "--disable-dev-shm-usage"
      );
    }
    options.setUserPreferences({
      "profile.default_content_setting_values.notifications": 1,
    });

    this.driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .build();

    if (url && withPersist === true) {
      await this.driver.get(url);
    }
    await this.driver.manage().setTimeouts({ implicit: 10000 });
    await this.driver.manage().window().maximize();

    const videoPath = this._startRecording();
    return [this.driver, videoPath];
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
  // async savePersist() {
  //   if (!this.driver) throw new Error("❌ Driver is not initialized.");
  //   const persisted = await this.driver.executeScript(
  //     `return window.localStorage.getItem("persist:root");`
  //   );
  //   if (persisted) {
  //     fs.writeFileSync(this.storagePath, persisted, "utf-8");
  //     console.log(`${colors.green}✅ persist:root saved${colors.reset}`);
  //   } else {
  //     console.log(`${colors.red}⚠️ No persist:root found${colors.reset}`);
  //   }
  // }

  // async restorePersist() {
  //   if (fs.existsSync(this.storagePath)) {
  //     const persisted = fs.readFileSync(this.storagePath, "utf-8");
  //     await this.driver.executeScript(
  //       `window.localStorage.setItem("persist:root", arguments[0]);`,
  //       persisted
  //     );
  //     console.log(`${colors.green}📦 persist:root restored${colors.reset}`);
  //     await this.driver.navigate().refresh();
  //   }
  // }

  // ========================
  // 🎯 Helpers for Elements
  // ========================
  async SelectByTitle(title) {
    const btn = await this.driver.wait(
      until.elementLocated(
        By.xpath(
          `//button[contains(@class, "ant-btn") and span[text()="${title}"]]`
        )
      ),
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

  async selectAntOption(inputXpath, optionTitle) {
    const input = await this.driver.findElement(By.xpath(inputXpath));
    await input.click();
    await this.driver.wait(
      until.elementLocated(
        By.css(`.ant-select-item-option[title="${optionTitle}"]`)
      ),
      5000
    );
    const option = await this.driver.findElement(
      By.css(`.ant-select-item-option[title="${optionTitle}"]`)
    );
    await option.click();
    await this.driver.sleep(500);
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
    await this.driver
      .findElement(By.xpath(`${loginpath}/div[1]/div/div[2]/div/div/input`))
      .sendKeys(username);
    await this.driver
      .findElement(By.xpath(`${loginpath}/div[2]/div/div/div/div/button`))
      .click();
    await this.driver.sleep(1000);
    await this.driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/main/div/div/div/div[3]/form/div[1]/div/div[2]/div/div/span/input"
        )
      )
      .sendKeys(password);
    await this.driver.sleep(1000);
    await this.driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/main/div/div/div/div[3]/form/div[3]/div/div/div/div/button"
        )
      )
      .click();

    await this.driver.sleep(1000);

    // // const closeBtn = await this.driver.findElement(
    // //   By.xpath("/html/body/div[3]/main/div/div/div/div/div/button")
    // // );
    // // await closeBtn.click();

    // await this.driver.sleep(1000);
  }
}

module.exports = customDriver;

// 🎯 تست نمونه
// console.log("کد ملی:", customDriver.generateNationalId());
// console.log("موبایل:", customDriver.generateIranianMobile());
// console.log("کارت بانکی:", customDriver.generateBankCard());

// 🎯 تست نمونه
// console.log("کد ملی:", customDriver.generateNationalId());
// console.log("موبایل:", customDriver.generateIranianMobile());

// const customDriver = require("./customDriver");

// (async () => {
//   const dr = new customDriver();
//   await dr.createDriver("https://example.com", true, true); // headless=true

//   // استفاده از helperها
//   await dr.SelectByTitle("ثبت");
//   await dr.ClickByText("span", "ورود");
//   await dr.selectAntOption('//input[@id="MainCurrencyId"]', "8249000528");

//   await dr.quit();
// })();
