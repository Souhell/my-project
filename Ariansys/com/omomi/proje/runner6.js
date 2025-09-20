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

        console.log("--- Running proje.js ---");
        const proje = require("./proje");
        await proje(driver);

        console.log("--- Running editmarkaz.js ---");
        const editproje = require("./editproje");
        await editproje(driver);

        console.log("--- Running deleteproje.js ---");
        const deleteproje = require("./deleteproje");
        await deleteproje(driver);

        console.log("--- Running activeproje.js ---");
        const activeproje = require("./activeproje");
        await activeproje(driver);

    } catch (err) {
        console.error("Error in scripts:", err);
    } finally {
        console.log("Closing browser...");
        if (driver) await driver.quit();
    }
}
runScriptsSequentially();
