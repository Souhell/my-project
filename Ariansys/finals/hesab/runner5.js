const { Builder, By, until } = require("selenium-webdriver");

async function runScriptsSequentially() {
    let driver;
    try {
        // مرورگر با تنظیمات نوتیفیکیشن Allow
        const chrome = require("selenium-webdriver/chrome");
        const options = new chrome.Options();
        options.addArguments("--disable-popup-blocking");
        options.setUserPreferences({
            "profile.default_content_setting_values.notifications": 1
        });

        driver = await new Builder()
            .forBrowser("chrome")
            .setChromeOptions(options)
            .build();

        // اجرای اسکریپت‌ها به ترتیب و با driver مشترک
        console.log("--- Running phones.js ---");
        const phones = require("./phones");
        await phones(driver);

        console.log("--- Running hesab.js ---");
        const hesab = require("./hesab");
        await hesab(driver);

        console.log("--- Running edithesab.js ---");
        const edithesab = require("./edithesab");
        await edithesab(driver);

        console.log("--- Running deletehesab.js ---");
        const deletehesab = require("./deletehesab");
        await deletehesab(driver);

        console.log("--- Running activehesab.js ---");
        const activehesab = require("./activehesab");
        await activehesab(driver);

    } catch (err) {
        console.error("Error in scripts:", err);
    } finally {
        console.log("Closing browser...");
        if (driver) await driver.quit();
    }
}
runScriptsSequentially();
