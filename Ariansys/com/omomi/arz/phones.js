// operatorcreate.js
const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const fs = require("fs");
const path = require("path");
const selectorHelper = require("../../helperSelector");

const colors = {
    red: "\x1b[31m",
    green: "\x1b[32m",
    reset: "\x1b[0m"
};

const cookiesPath = path.join(__dirname, "cookies.json");

async function phones() {
    // 📌 اضافه کردن گزینه Allow Notifications به مرورگر
    let options = new chrome.Options();
    options.setUserPreferences({
        "profile.default_content_setting_values.notifications": 1 // 1 = Allow, 2 = Block
    });

    let driver = await new Builder()
        .forBrowser("chrome")
        .setChromeOptions(options)
        .build();

    const selector = new selectorHelper(driver);

    try {
        await driver.get("https://frontbuild.ariansystemdp.local/fa");
        await driver.manage().setTimeouts({ implicit: 10000 });
        await driver.manage().window().maximize();

        const loginpath = "/html/body/div[3]/main/div/div/div/div[2]/form";
        await driver.findElement(By.xpath(`${loginpath}/div[1]/div/div[2]/div/div/input`)).sendKeys("12");
        await driver.findElement(By.xpath(`${loginpath}/div[2]/div/div[2]/div/div/span/input`)).sendKeys("12");
        await driver.findElement(By.xpath(`${loginpath}/div[4]/div/div[2]/div/div/button`)).click();
        await driver.sleep(1000);
        await driver.findElement(By.xpath("/html/body/div[3]/main/div/div/div/div/div/button")).click();
        await driver.sleep(1000);

        await driver.wait(until.elementLocated(By.xpath("/html/body/div[4]/div/ul/li/span/div/div[1]")), 5000).click();
        await driver.sleep(500);

        await driver.wait(until.elementLocated(By.xpath("/html/body/div[3]/div/div[1]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/div/div[2]/button[1]")), 5000).click();
        await driver.sleep(500);

        await driver.wait(until.elementLocated(By.xpath("/html/body/div[4]/div/ul/li[1]")), 5000).click();
        await driver.sleep(500);

        await driver.wait(until.elementLocated(By.xpath("/html/body/div[3]/div/div[1]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/div/div[2]/button[1]")), 5000).click();
        await driver.sleep(500);

        await driver.wait(until.elementLocated(By.xpath("/html/body/div[4]/div/ul/li[2]")), 5000).click();
        await driver.sleep(500);
        await driver.wait(until.elementLocated(By.xpath("/html/body/div[3]/div/div[1]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/div/div[2]/button[1]")), 5000).click();
        await driver.sleep(500);
        await driver.wait(until.elementLocated(By.xpath("/html/body/div[4]/div/ul/li[3]")), 5000).click();
        await driver.sleep(500);
        await driver.wait(until.elementLocated(By.xpath(`//button[contains(@class, "ant-btn") and .//span[text()="کینگ مانی"]]`)), 5000).click();
        await driver.sleep(500);

        await driver.wait(until.elementLocated(By.xpath("/html/body/div[4]/div/ul/li[4]")), 5000).click();
        await driver.sleep(500);

        await driver.wait(until.elementLocated(By.xpath(`//button[contains(@class, "ant-btn") and .//span[text()="1403"]]`)), 5000).click();
        await driver.sleep(500);

        await driver.wait(until.elementLocated(By.xpath("/html/body/div[4]/div/ul/li[5]")), 5000).click();
        await driver.sleep(500);

        await driver.wait(until.elementLocated(By.xpath("/html/body/div[3]/div/div[1]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/div/div[2]/button[1]")), 5000).click();
        await driver.sleep(500);

        const cookies = await driver.manage().getCookies();
        fs.writeFileSync(cookiesPath, JSON.stringify(cookies, null, 2));

        const bodyText = await driver.findElement(By.css("body")).getText();
        if (bodyText.includes("آرین")) {
            console.log(`${colors.green}✅ ok Aryan ${colors.reset}`);
        } else {
            console.log(`${colors.red}❌ not ok Aryan ${colors.reset}`);
        }

    } catch (err) {
        console.error(`${colors.red}خطا در اجرای phones:${colors.reset}`, err);
    } finally {
        await driver.quit();
    }
}

phones();
module.exports = phones;
