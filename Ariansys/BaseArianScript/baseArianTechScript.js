const { By, Key, until } = require("selenium-webdriver"); // ✅ until اضافه شد
const customDriver = require("../customerDriver");
const baseHelper = require("./baseHelper");
const fs = require("fs");

class BaseArianTechScript {
  constructor() {
    if (new.target === BaseArianTechScript) {
      throw new Error(
        "BaseArianTechScript is an abstract class and cannot be instantiated directly"
      );
    }

    // بررسی پیاده‌سازی متدهای انتزاعی
    const proto = Object.getPrototypeOf(this);
    if (proto.implement === BaseArianTechScript.prototype.implement) {
      throw new Error("implement method must be implemented");
    }
    if (
      proto.checkNameAfterAll ===
      BaseArianTechScript.prototype.checkNameAfterAll
    ) {
      throw new Error("checkNameAfterAll method must be implemented");
    }
    if (
      proto.checkNameAfterAll === BaseArianTechScript.prototype.setScriptName
    ) {
      throw new Error("setScriptName method must be implemented");
    }
  }

  async implement(driver, dr) {
    throw new Error("Abstract method: implement must be implemented");
  }

  setScriptName() {
    throw new Error("Abstract method: setScriptName must be implemented");
  }

  checkNameAfterAll() {
    throw new Error("Abstract method: checkNameAfterAll must be implemented");
  }
  async _clickSequence(
    driver,
    xpaths,
    opts = { retries: 3, waitBetween: 250, locateTimeout: 6000 }
  ) {
    for (const xp of xpaths) {
      let clicked = false;
      for (let attempt = 1; attempt <= opts.retries; attempt++) {
        try {
          console.log(`trying click ${xp} (attempt ${attempt})`);
          const el = await driver.wait(
            until.elementLocated(By.xpath(xp)),
            opts.locateTimeout
          );
          await driver.wait(until.elementIsVisible(el), 3000);
          await driver.wait(until.elementIsEnabled(el), 3000);
          await driver.executeScript(
            "arguments[0].scrollIntoView({block:'center'});",
            el
          );
          await driver.sleep(120);

          try {
            await driver
              .actions({ async: true })
              .move({ origin: el })
              .click()
              .perform();
          } catch (e1) {
            try {
              await driver.executeScript("arguments[0].click();", el);
            } catch (e2) {
              await el.click();
            }
          }

          await driver.sleep(180);
          clicked = true;
          break;
        } catch (err) {
          console.log(
            `click ${xp} failed on attempt ${attempt}:`,
            err.message || err
          );
          // تلاش برای باز کردن والد منو در اولین تلاش
          if (attempt === 1) {
            try {
              const parentXpath = xp.replace(/\/ul\/.*/, "");
              if (parentXpath && parentXpath.length) {
                const parents = await driver.findElements(
                  By.xpath(parentXpath)
                );
                if (parents.length > 0) {
                  try {
                    await driver.executeScript(
                      "arguments[0].scrollIntoView({block:'center'});",
                      parents[0]
                    );
                    await driver
                      .actions({ async: true })
                      .move({ origin: parents[0] })
                      .click()
                      .perform();
                    await driver.sleep(250);
                    console.log("toggled parent menu to reveal submenu");
                  } catch (pe) {}
                }
              }
            } catch (pe) {}
          }
          await driver.sleep(opts.waitBetween);
        }
      }

      if (!clicked) {
        try {
          const ts = Date.now();
          const shotName = `click-fail-${ts}.png`;
          const screenshot = await driver.takeScreenshot();
          fs.writeFileSync(shotName, screenshot, "base64");
          console.log(`screenshot saved: ${shotName}`);
          const html = await driver.getPageSource();
          fs.writeFileSync(`page-${ts}.html`, html, "utf8");
          console.log(`page source saved: page-${ts}.html`);
        } catch (sErr) {
          console.log(
            "خطا در گرفتن اسکرین‌شات یا ذخیره HTML:",
            sErr.message || sErr
          );
        }
        throw new Error(
          `Unable to click element after ${opts.retries} attempts: ${xp}`
        );
      }
    }
  }
  async _safeClick(driver, xpath, timeout = 10000) {
    const element = await this._waitForElement(driver, xpath, timeout);
    await driver.wait(until.elementIsVisible(element), timeout);
    await driver.wait(until.elementIsEnabled(element), timeout);
    try {
      // تلاش با actions اول (شبیه کلیک واقعی)
      await driver
        .actions({ async: true })
        .move({ origin: element })
        .click()
        .perform();
    } catch (e) {
      try {
        // fallback: کلیک با JS
        await driver.executeScript("arguments[0].click();", element);
      } catch (e2) {
        // fallback نهایی: native click
        await element.click();
      }
    }
    return element;
  }
  async _uploadVideoFromPath(filePath, isSusccess) {
    // خواندن فایل از مسیر
    const fileBuffer = fs.readFileSync(filePath);
    const fileName = filePath.split("/").pop() || "video.mp4";

    const formData = new FormData();
    formData.append("ScriptName", this.setScriptName());
    formData.append("IsSuccess", isSusccess === true ? "true" : "false");

    // ایجاد Blob از بافر
    if (isSusccess === false) {
      const blob = new Blob([fileBuffer], { type: "video/mp4" });
      const file = new File([blob], fileName, { type: "video/mp4" });
      formData.append("File", file);
    }

    const response = await fetch("http://216.65.200.215:40001/api/errorlog", {
      method: "POST",
      body: formData,
    });

    return await response.json();
  }

  //internal functions
  async _waitForElement(driver, xpath, timeout = 10000) {
    return await driver.wait(until.elementLocated(By.xpath(xpath)), timeout);
  }

  // Clear & Type
  async _clearAndType(driver, xpath, text) {
    const element = await this._waitForElement(driver, xpath);
    await element.click();
    await element.sendKeys(Key.CONTROL + "a");
    await element.sendKeys(Key.DELETE);
    await element.sendKeys(text);
  }

  // select from select option
  async _selectFromDropdown(
    driver,
    dropdownXpath,
    optionText = null,
    optionIndex = null
  ) {
    try {
      console.log(`در حال انتخاب از dropdown: ${dropdownXpath}`);

      // کلیک برای باز کردن dropdown
      const dropdown = await this._waitForElement(driver, dropdownXpath);
      await driver.wait(until.elementIsEnabled(dropdown), 5000);
      // Clear & Type

      // اسکرول به المنت
      await driver.executeScript(
        "arguments[0].scrollIntoView(true);",
        dropdown
      );
      await driver.sleep(500);

      await dropdown.click();

      // منتظر ماندن برای بارگذاری options - این قسمت مهم است!
      await driver.sleep(2000);

      // پیدا کردن options از popover/portal - چندین سلکتور ممکن را امتحان می‌کنیم
      const possibleSelectors = [
        ".ant-select-dropdown:not(.ant-select-dropdown-hidden) .ant-select-item-option",
        ".ant-select-dropdown .ant-select-item-option",
        ".ant-form-item  .ant-form-item-has-success",
        '[id*="select"] .ant-select-item-option',
        ".ant-select-dropdown:not(.ant-select-dropdown-hidden) .ant-select-item-option-content",
        ".ant-select-item-option",
        ".ant-select-item",
        ".ant-select-tree-title",
      ];

      let options = [];
      for (let selector of possibleSelectors) {
        options = await driver.findElements(By.css(selector));
        if (options.length > 0) {
          console.log(
            `با سلکتور ${selector} تعداد ${options.length} گزینه پیدا شد`
          );
          break;
        }
      }

      if (options.length === 0) {
        console.log("هیچ گزینه‌ای در dropdown پیدا نشد");

        // روش جایگزین: استفاده از XPath برای پیدا کردن options
        const optionXPaths = [
          "//div[contains(@class, 'ant-select-item-option')]",
          "//div[contains(@class, 'ant-select-item')]",
        ];

        for (let xpath of optionXPaths) {
          options = await driver.findElements(By.xpath(xpath));
          if (options.length > 0) {
            console.log(
              `با XPath ${xpath} تعداد ${options.length} گزینه پیدا شد`
            );
            break;
          }
        }
      }

      console.log(`تعداد گزینه‌های پیدا شده: ${options.length}`);

      // انتخاب گزینه بر اساس متن یا اندیس
      if (optionText) {
        for (let option of options) {
          try {
            const text = await option.getText();
            console.log(`گزینه با متن: "${text}"`);
            if (text.includes(optionText)) {
              await driver.executeScript(
                "arguments[0].scrollIntoView(true);",
                option
              );
              await option.click();
              console.log(`گزینه با متن "${optionText}" انتخاب شد`);
              return true;
            }
          } catch (e) {
            console.log("خطا در خواندن متن گزینه:", e.message);
          }
        }
        console.log(`گزینه با متن "${optionText}" پیدا نشد`);
      }

      if (optionIndex !== null && options[optionIndex]) {
        await driver.executeScript(
          "arguments[0].scrollIntoView(true);",
          options[optionIndex]
        );
        await options[optionIndex].click();
        console.log(`گزینه با اندیس ${optionIndex} انتخاب شد`);
        return true;
      }

      if (options.length > 0) {
        // انتخاب اولین گزینه به عنوان fallback
        await driver.executeScript(
          "arguments[0].scrollIntoView(true);",
          options[0]
        );
        await options[0].click();
        console.log("اولین گزینه انتخاب شد");
        return true;
      }

      return false;
    } catch (error) {
      console.log("خطا در انتخاب از dropdown:", error.message);
      return false;
    }
  }

  //main duty
  async duty() {
    const colors = {
      red: "\x1b[31m",
      green: "\x1b[32m",
      reset: "\x1b[0m",
    };

    let dr = new customDriver();
    const url = "https://frontbuild.ariansystemdp.local/fa";
    let driver = null;
    let Video_Path = null;
    try {
      [driver, Video_Path] = await dr.createDriver(url, true);
      await dr.login();
      //set file path
      let file = Video_Path;
      await this.implement(driver, dr);
      const bodyText = await driver.findElement(By.css("body")).getText();
      if (bodyText.includes(this.checkNameAfterAll())) {
        console.log(`${colors.green}ok Aryan ${colors.reset}`);
        // ارسال لاگ موفقیت
        try {
          let response = await this._uploadVideoFromPath(file, true);
          console.log(response);
          if (response.ok) {
            console.log("✅ لاگ موفقیت به API ارسال شد");
          }
        } catch (apiError) {
          console.error("⚠️ خطا در ارسال لاگ موفقیت:", apiError.message);
        }
      } else {
        console.log(`${colors.red}not ok Aryan ${colors.reset}`);
        let errorHappened = true;
        await dr.stopRecording(errorHappened);
        // ارسال لاگ شکست
        let file = Video_Path;
        try {
          let response = await this._uploadVideoFromPath(file, false);
          if (response.ok) {
            console.log("✅ لاگ شکست به API ارسال شد");
          }
        } catch (apiError) {
          console.error("⚠️ خطا در ارسال لاگ شکست:", apiError.message);
        }
      }
    } catch (err) {
      console.error("❌ خطا:", err);
      await dr.stopRecording(true);
      // ارسال لاگ خطا
      let file = Video_Path;
      console.log("==============>>>>>>>>>>>>>>>>", file);
      try {
        let response = await this._uploadVideoFromPath(file, false);
        if (response.ok) {
          console.log("✅ لاگ خطا به API ارسال شد");
        }
      } catch (apiError) {
        console.error("⚠️ خطا در ارسال لاگ خطا:", apiError.message);
      }
    } finally {
      if (driver) {
        try {
          await driver.quit();
          console.log("✅ driver.quit() انجام شد");
        } catch (quitError) {
          // اگر قبلاً بسته شده باشد، این خطا طبیعی است
          if (!quitError.message.includes("no valid session ID")) {
            console.error("⚠️ خطا در driver.quit():", quitError.message);
          }
        }
      }
    }
  }
}

module.exports = BaseArianTechScript;
