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

        console.log("--- Running salemali.js ---");
        const salemali = require("./salemali");
        await salemali(driver);

        console.log("--- Running editsal.js ---");
        const editsal = require("./editsal");
        await editsal(driver);

        console.log("--- Running deletesal.js ---");
        const deletesal = require("./deletesal");
        await deletesal(driver);

        console.log("--- Running activesal.js ---");
        const activesal = require("./activesal");
        await activesal(driver);

    } catch (err) {
        console.error("Error in scripts:", err);
    } finally {
        console.log("Closing browser...");
        if (driver) await driver.quit();
    }
}
runScriptsSequentially();
