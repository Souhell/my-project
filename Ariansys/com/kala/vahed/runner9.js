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

        console.log("--- Running kala.js ---");
        const kala = require("./kala");
        await kala(driver);

        console.log("--- Running moshakhasat.js ---");
        const moshakhasat = require("./moshakhasat");
        await moshakhasat(driver);

        console.log("--- Running vahed.js ---");
        const vahed = require("./vahed");
        await vahed(driver);

        console.log("--- Running vijegi.js ---");
        const vijegi = require("./vijegi");
        await vijegi(driver);

        console.log("--- Running zirvahed.js ---");
        const zirvahed = require("./zirvahed");
        await zirvahed(driver);

        // console.log("--- Running tanzimat.js ---");
        // const tanzimat = require("./tanzimat");
        // await tanzimat(driver);

    } catch (err) {
        console.error("Error in scripts:", err);
    } finally {
        console.log("Closing browser...");
        if (driver) await driver.quit();
    }
}
runScriptsSequentially();
