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

        

        console.log("--- Running haqiqi.js ---");
        const haqiqi = require("./haqiqi");
        await haqiqi(driver);

        console.log("--- Running hoquqi.js ---");
        const hoquqi = require("./hoquqi");
        await hoquqi(driver);

        console.log("--- Running ashkhas.js ---");
        const ashkhas = require("./ashkhas");
        await ashkhas(driver);

        console.log("--- Running tamas.js ---");
        const tamas = require("./tamas");
        await tamas(driver);

        console.log("--- Running editashkhas.js ---");
        const editashkhas = require("./editashkhas");
        await editashkhas(driver);

        console.log("--- Running deleteashkhas.js ---");
        const deleteashkhas = require("./deleteashkhas");
        await deleteashkhas(driver);

        

    } catch (err) {
        console.error("Error in scripts:", err);
    } finally {
        console.log("Closing browser...");
        if (driver) await driver.quit();
    }
}
runScriptsSequentially();
