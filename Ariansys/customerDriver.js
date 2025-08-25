const { Builder, until, By } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const fs = require("fs");
const path = require("path");

const colors = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  reset: "\x1b[0m",
};

class customDriver {
  constructor(storageFile = "persistRoot.json") {
    this.storagePath = path.join(__dirname, storageFile);
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
    if (fs.existsSync(this.storagePath)) {
      const persisted = fs.readFileSync(this.storagePath, "utf-8");
      await this.driver.executeScript(
        `window.localStorage.setItem("persist:root", arguments[0]);`,
        persisted
      );
      console.log(`${colors.green}📦 persist:root restored${colors.reset}`);
      await this.driver.navigate().refresh();
    }
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

  //اجرای سناریو لاگین
  async login() {
    await this.driver.wait(until.elementLocated(By.css("body")), 10000);
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
