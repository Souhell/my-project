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
        // console.log("--- Running phones.js ---");
        // const phones = require("./phones");
        // await phones(driver);

        console.log("--- Running arz.js ---");
        const arz = require("./arz");
        await arz(driver);

        console.log("--- Running editarz.js ---");
        const editarz = require("./editarz");
        await editarz(driver);

        console.log("--- Running activearz.js ---");
        const activearz = require("./activearz");
        await activearz(driver);

        console.log("--- Running deletearz.js ---");
        const deletearz = require("./deletearz");
        await deletearz(driver);

        

    } catch (err) {
        console.error("Error in scripts:", err);
    } finally {
        console.log("Closing browser...");
        if (driver) await driver.quit();
    }
}
runScriptsSequentially();
