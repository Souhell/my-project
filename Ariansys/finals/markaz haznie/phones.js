// operatorcreate.js
const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const fs = require("fs");
const path = require("path");
const selectorHelper = require("../../helperSelector");
const customDriver = require("../../customerDriver");

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

    let dr = new customDriver();
    const url = "https://frontbuild.ariansystemdp.local/fa";
    let d = await dr.createDriver(url,true);

    const selector = new selectorHelper(d);

    try {
        const loginpath = "/html/body/div[3]/main/div/div/div/div[2]/form";
        await d.findElement(By.xpath(`${loginpath}/div[1]/div/div[2]/div/div/input`)).sendKeys("12");
        await d.findElement(By.xpath(`${loginpath}/div[2]/div/div[2]/div/div/span/input`)).sendKeys("12");
        await d.findElement(By.xpath(`${loginpath}/div[4]/div/div[2]/div/div/button`)).click();
        await d.sleep(1000);
        await d.findElement(By.xpath("/html/body/div[3]/main/div/div/div/div/div/button")).click();
        await d.sleep(1000);

        await d.wait(until.elementLocated(By.xpath("/html/body/div[4]/div/ul/li[1]")), 5000).click();
        await d.sleep(500);

        await d.wait(until.elementLocated(By.xpath("/html/body/div[3]/div/div[1]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/div/div[2]/button[1]")), 5000).click();
        await d.sleep(500);

        await d.wait(until.elementLocated(By.xpath("/html/body/div[4]/div/ul/li[2]")), 5000).click();
        await d.sleep(500);
        await d.wait(until.elementLocated(By.xpath("/html/body/div[3]/div/div[1]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/div/div[2]/button[1]")), 5000).click();
        await d.sleep(500);
        await d.wait(until.elementLocated(By.xpath("/html/body/div[4]/div/ul/li[3]")), 5000).click();
        await d.sleep(500);
        await d.wait(until.elementLocated(By.xpath(`//button[contains(@class, "ant-btn") and .//span[text()="کینگ مانی"]]`)), 5000).click();
        await d.sleep(500);

        await d.wait(until.elementLocated(By.xpath("/html/body/div[4]/div/ul/li[4]")), 5000).click();
        await d.sleep(500);

        await d.wait(until.elementLocated(By.xpath(`//button[contains(@class, "ant-btn") and .//span[text()="1403"]]`)), 5000).click();
        await d.sleep(500);

        await d.wait(until.elementLocated(By.xpath("/html/body/div[4]/div/ul/li[5]")), 5000).click();
        await d.sleep(500);

        await d.wait(until.elementLocated(By.xpath("/html/body/div[3]/div/div[1]/div[2]/div[2]/div/div[1]/div/div/div[2]/div[2]/div/div[2]/button[1]")), 5000).click();
        await d.sleep(500);

        const cookies = await d.manage().getCookies();
        fs.writeFileSync(cookiesPath, JSON.stringify(cookies, null, 2));

        const bodyText = await d.findElement(By.css("body")).getText();
        if (bodyText.includes("آرین")) {
            console.log(`${colors.green}✅ ok Aryan ${colors.reset}`);
        } else {
            console.log(`${colors.red}❌ not ok Aryan ${colors.reset}`);
        }

    } catch (err) {
        console.error(`${colors.red}خطا در اجرای phones:${colors.reset}`, err);
    } finally {
        await d.quit();
    }
}

phones();
module.exports = phones;
