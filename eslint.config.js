module.exports = [
    {
        rules: {
            // Add rules here.
            const { Builder, By, Key, until } = require("selenium-webdriver");
            const driver = new Builder().forBrowser("chrome").build();
            await driver.get("https://www.google.com");
            await driver.findElement(By.name("q")).sendKeys("Selenium", Key.RETURN);

            await driver.wait(until.titleIs("Selenium - Google Search"), 1000);

        } finally {

            await driver.quit();

        }

    }) ();


















        }
    }
];