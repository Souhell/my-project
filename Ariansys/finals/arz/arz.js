// salemali.js
const { Builder, By, until } = require("selenium-webdriver");
const fs = require("fs");
const path = require("path");

const colors = {
    red: "\x1b[31m",
    green: "\x1b[32m",
    reset: "\x1b[0m"
};

function generateNationalId() {
    let digits;
    do {
        digits = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));
    } while (digits.every(d => d === 0));

    const check = digits
        .map((digit, index) => digit * (10 - index))
        .reduce((sum, val) => sum + val, 0) % 11;

    const controlDigit = check < 2 ? check : 11 - check;
    return digits.join('') + controlDigit;
}

async function arz() {
    const nationalId = generateNationalId();
    console.log("کد ملی تولید شده:", nationalId);

    const cookiesPath = path.join(__dirname, "cookies.json");

    // تنظیمات مرورگر برای Allow Notification
    const chrome = require("selenium-webdriver/chrome");
    const options = new chrome.Options();
    options.addArguments("--disable-infobars", "--start-maximized");
    options.setUserPreferences({
        "profile.default_content_setting_values.notifications": 1
    });

    const driver = await new Builder()
        .forBrowser("chrome")
        .setChromeOptions(options)
        .build();

    try {
        await driver.get("https://frontbuild.ariansystemdp.local/fa");
        await driver.manage().setTimeouts({ implicit: 5000 });

        // بارگذاری کوکی‌ها
        if (fs.existsSync(cookiesPath)) {
            const cookies = JSON.parse(fs.readFileSync(cookiesPath, "utf8"));
            for (const cookie of cookies) {
                await driver.manage().addCookie(cookie);
            }
            await driver.navigate().refresh();
            console.log("✅ کوکی‌ها بارگذاری و صفحه رفرش شد.");
        } else {
            console.log("⚠️ کوکی یافت نشد. لطفاً ابتدا کوکی را ذخیره کنید.");
        }

        // اجرای عملیات
        await driver.wait(until.elementLocated(By.css("body")), 500);
        console.log("🏁 مرورگر آماده برای ادامه تست.");

        await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[1]/div[2]/div/div[3]/div/ul/li[1]")).click();
        await driver.sleep(100);
        await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[1]/div[2]/div/div[3]/div/ul/li[1]/ul/li[1]")).click();
        await driver.sleep(100);
        await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[1]/div[2]/div/div[3]/div/ul/li[1]/ul/li[1]/ul/li[4]")).click();
        await driver.sleep(100);
        await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[1]/div[1]/div[1]/button")).click();
        await driver.sleep(100);
        await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[1]/div/div[2]/div[1]/div/input")).sendKeys(nationalId);
        await driver.sleep(100);
        await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[2]/div/div[2]/div/div/input")).sendKeys(nationalId);
        await driver.sleep(100);
        await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[3]/div/div/div/div/div/label")).click();
        await driver.sleep(1000);
        
        // await driver.findElement(By.css('[title="سایر"]')).click();
        // await driver.sleep(100)
        // await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[3]/div/div[2]/div/div/button")).click();
        // await driver.sleep(100);
        // await driver.findElement(By.xpath("/html/body/div[4]/div[1]/div/div/div[2]/div/div[2]/div[6]/button")).click();
        await driver.sleep(100);
        await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[1]/div/div[2]/div")).click();
        await driver.sleep(100);

        const bodyText = await driver.findElement(By.css("body")).getText();
        if (bodyText.includes("تنظیم شده")) {
            console.log(`${colors.green}✅ ok Aryan${colors.reset}`);
        } else {
            console.log(`${colors.red}❌ not ok Aryan${colors.reset}`);
        }

    } catch (err) {
        console.error("❌ خطا:", err);
    } finally {
        await driver.quit();
    }
}
arz();
module.exports = arz;
