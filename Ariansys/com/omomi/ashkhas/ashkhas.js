const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const fs = require("fs");
const path = require("path");
const customDriver = require("../../customerDriver");

const colors = {
    red: "\x1b[31m",
    green: "\x1b[32m",
    reset: "\x1b[0m",
};

async function ashkhas() {
    // تولید کد ملی با متد customerDriver
    const nationalId = customDriver.generateNationalId();
    console.log("کد ملی تولید شده:", nationalId);
    const IranianMobile = customDriver.generateIranianMobile();
    console.log("موبایل:", IranianMobile);

    // ساخت درایور با اکتیو بودن نوتیفیکیشن و ری‌استور persist
    let dr = new customDriver();
    const url = "https://frontbuild.ariansystemdp.local/fa";
    let driver = await dr.createDriver(url, true);

    try {
        // لاگین با متد customerDriver
        await dr.login();
        // اجرای گام‌ها (قابل تغییر/تکمیل بر اساس نیاز)
        const steps = [
            "/html/body/div[3]/div/div[2]/div[1]/div[2]/div/div[3]/div/ul/li[1]",
            "/html/body/div[3]/div/div[2]/div[1]/div[2]/div/div[3]/div/ul/li[1]/ul/li[1]",
            "/html/body/div[3]/div/div[2]/div[1]/div[2]/div/div[3]/div/ul/li[1]/ul/li[1]/ul/li[1]",
            "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/div[1]/div/div/div/div/div/div/table/tbody/tr[1]/td[5]/div/span[4]",
            //   "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[3]/div[2]/div/div[1]/div/div/div/div[2]/div/div/button[3]",
        ];

        for (const xpath of steps) {
            try {
                console.log("در حال انتظار برای:", xpath);
                await driver.wait(until.elementLocated(By.xpath(xpath)), 10000);
                await driver.findElement(By.xpath(xpath)).click();
                await driver.sleep(100);
            } catch (err) {
                console.error("خطا در گام:", xpath, err);
                throw err; // باعث می‌شود finally اجرا شود و مرورگر بسته شود
            }
        }
        // انتخاب گزینه اول
        await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[3]/div[2]/div/div[1]/div/div/div[2]/div[2]/div/form/div[1]/div/div[2]/div/div/div/div[1]/div/span/span[1]/input")).click();
        await driver.sleep(100);
        const options = await driver.findElements(By.css('.ant-select-item-option'));
        if (options.length > 1) {
            await driver.executeScript("arguments[0].scrollIntoView(true);", options[1]);
            await options[1].click();
        }

        // انتخاب گزینه دوم
        await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[3]/div[2]/div/div[1]/div/div/div[2]/div[2]/div/form/div[2]/div/div[2]/div/div/div/div[1]/div/span/span[1]/input")).click();
        await driver.sleep(100);
        await driver.findElements(By.css('.ant-select-item-option'));
        await driver.executeScript("arguments[0].scrollIntoView(true);", options[1]);
        await driver.findElement(By.css('.ant-select-item-option[title*="سایر "]')).click();
        await driver.sleep(300);

        await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[3]/div[2]/div/div[1]/div/div/div[2]/div[2]/div/form/div[3]/div/div[2]/div/div/input")).sendKeys(phone);
        await driver.sleep(100)
        await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[3]/div[2]/div/div[1]/div/div/div[2]/div[2]/div/form/div[4]/div/div/div/div/div/button")).click();
        await driver.sleep(1000)
        const bodyText = await driver.findElement(By.css("body")).getText();
        if (bodyText.includes("آرین")) {
            console.log(`${colors.green}✅ ok Aryan ${colors.reset}`);
        } else {
            console.log(`${colors.red}❌ not ok Aryan ${colors.reset}`);
        }
    } catch (err) {
        console.error("❌ خطا:", err);
    } finally {
        await driver.quit();
    }
}
// ashkhas();
module.exports = ashkhas;
