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

        console.log("--- Running markaz.js ---");
        const markaz = require("./markaz");
        await markaz(driver);

        console.log("--- Running editmarkaz.js ---");
        const editmarkaz = require("./editmarkaz");
        await editmarkaz(driver);

        console.log("--- Running activemarkaz.js ---");
        const activemarkaz = require("./activemarkaz");
        await activemarkaz(driver);

        console.log("--- Running deletemarkaz.js ---");
        const deletemarkaz = require("./deletemarkaz");
        await deletemarkaz(driver);

        

    } catch (err) {
        console.error("Error in scripts:", err);
    } finally {
        console.log("Closing browser...");
        if (driver) await driver.quit();
    }
}
runScriptsSequentially();
