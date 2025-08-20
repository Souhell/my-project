const { Builder, By,Key, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const fs = require("fs");
const path = require("path");

const colors = {
    red: "\x1b[31m",
    green: "\x1b[32m",
    reset: "\x1b[0m"
};

function generateNationalId() {
    let digits = [];
    do {
        digits = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));
    } while (digits.every(d => d === 0));

    const check = digits
        .map((digit, index) => digit * (10 - index))
        .reduce((sum, val) => sum + val, 0) % 11;

    const controlDigit = check < 2 ? check : 11 - check;
    return digits.join("") + controlDigit;
}

async function editarz() {
    const nationalId = generateNationalId();
    console.log("کد ملی تولید شده:", nationalId);

    const cookiesPath = path.join(__dirname, "cookies.json");

    // فعال‌سازی اجازه نوتیفیکیشن
    const options = new chrome.Options();
    options.setUserPreferences({
        "profile.default_content_setting_values.notifications": 1 // Allow
    });

    let driver = await new Builder()
        .forBrowser("chrome")
        .setChromeOptions(options)
        .build();

    try {
        await driver.get("https://frontbuild.ariansystemdp.local/fa");
        await driver.manage().setTimeouts({ implicit: 5000 });
        await driver.manage().window().maximize();

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

        await driver.wait(until.elementLocated(By.css("body")), 500);
        console.log("🏁 مرورگر آماده برای ادامه تست.");

        // اجرای گام‌ها
        const steps = [
            "/html/body/div[3]/div/div[2]/div[1]/div[2]/div/div[3]/div/ul/li[1]",
            "/html/body/div[3]/div/div[2]/div[1]/div[2]/div/div[3]/div/ul/li[1]/ul/li[1]",
            "/html/body/div[3]/div/div[2]/div[1]/div[2]/div/div[3]/div/ul/li[1]/ul/li[1]/ul/li[4]",
            "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/div[1]/div/div/div/div/div/div/table/tbody/tr[1]/td[5]/div/span[1]"
        ];

        for (const xpath of steps) {
            await driver.findElement(By.xpath(xpath)).click();
            await driver.sleep(100);
        }

        await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[1]/div/div[2]/div[1]/div/input")).sendKeys(Key.CONTROL + 'a');
        await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[1]/div/div[2]/div[1]/div/input")).sendKeys(Key.DELETE);
        await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[1]/div/div[2]/div[1]/div/input")).sendKeys(nationalId);
        
        await driver.sleep(100);

        await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[2]/div/div[2]/div/div/input")).sendKeys(Key.CONTROL + 'a');
        await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[2]/div/div[2]/div/div/input")).sendKeys(Key.DELETE);
        await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[2]/div/div[2]/div/div/input")).sendKeys(nationalId);
        await driver.sleep(100);

        await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[3]/div/div/div/div/div/label")).click();
        await driver.sleep(1000);
        
        // await driver.findElement(By.css('[title="اداری"]')).click();
        // await driver.sleep(100)

        // await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[3]/div/div[2]/div/div/button")).click();
        // await driver.sleep(100);

        // await driver.findElement(By.xpath("/html/body/div[4]/div[1]/div/div/div[2]/div/div[2]/div[6]/button")).click();
        // await driver.sleep(100);

        await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[1]/div/div[2]/div")).click();
        await driver.sleep(100);

        let bodyText = await driver.findElement(By.css("body")).getText();
        if (bodyText.includes("تنظیم شده")) {
            console.log(`${colors.green}ok Aryan ${colors.reset}`);
        } else {
            console.log(`${colors.red}not ok Aryan ${colors.reset}`);
        }

    } catch (err) {
        console.error("❌ خطا:", err);
    } finally {
        await driver.quit();
    }
}

editarz();
module.exports = editarz;
