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

        // // اجرای اسکریپت‌ها به ترتیب و با driver مشترک
        // console.log("--- Running phones.js ---");
        // const phones = require("./phones");
        // await phones(driver);

        console.log("--- Running nerkharz.js ---");
        const nerkharz = require("./nerkharz");
        await nerkharz(driver);

        console.log("--- Running editnerkharz.js ---");
        const editnerkharz = require("./editnerkharz");
        await editnerkharz(driver);

        console.log("--- Running activenerkharz.js ---");
        const activenerkharz = require("./activenerkharz");
        await activenerkharz(driver);

        console.log("--- Running deletenerkharz.js ---");
        const deletenerkharz = require("./deletenerkharz");
        await deletenerkharz(driver);

        

    } catch (err) {
        console.error("Error in scripts:", err);
    } finally {
        console.log("Closing browser...");
        if (driver) await driver.quit();
    }
}
runScriptsSequentially();
