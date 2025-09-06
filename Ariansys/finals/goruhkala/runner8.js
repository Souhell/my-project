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

        console.log("--- Running forushhamkar.js ---");
        const forushhamkar = require("./forushhamkar");
        await forushhamkar(driver);

        console.log("--- Running forushteam.js ---");
        const forushteam = require("./forushteam");
        await forushteam(driver);

        // console.log("--- Running activesal.js ---");
        // const activesal = require("./activesal");
        // await activesal(driver);

        console.log("--- Running maliat.js ---");
        const maliat = require("./maliat");
        await maliat(driver);

        console.log("--- Running marketteam.js ---");
        const marketteam = require("./marketteam");
        await marketteam(driver);
        

    } catch (err) {
        console.error("Error in scripts:", err);
    } finally {
        console.log("Closing browser...");
        if (driver) await driver.quit();
    }
}
runScriptsSequentially();
