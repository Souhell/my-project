const { Builder, By, until } = require("selenium-webdriver");
const fs = require("fs");
const path = require("path");

const colors = {
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    reset: "\x1b[0m"
};

// تابع تولید کد ملی
function generateNationalId() {
    let digits = [];
    do {
        digits = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));
    } while (digits.every(d => d === 0));

    const check = digits
        .map((digit, index) => digit * (10 - index))
        .reduce((sum, val) => sum + val, 0) % 11;

    const controlDigit = check < 2 ? check : 11 - check;

    return digits.join('') + controlDigit;
}

// تابع اصلی برای ایجاد
async function mewhaqiqi(driver, nationalId) {
    try {
        console.log(`${colors.yellow}🔹 شروع تست ایجاد با کد ملی: ${nationalId}${colors.reset}`);

        await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[1]/div[2]/div/div/div[3]/div/ul/li[1]")).click();
        await driver.sleep(100);
        await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[1]/div[2]/div/div/div[3]/div/ul/li[1]/ul/li[1]")).click();
        await driver.sleep(100);
        await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[1]/div[2]/div/div/div[3]/div/ul/li[1]/ul/li[1]/ul/li[1]")).click();
        await driver.sleep(100);
        await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[1]/div[1]/div[1]/button")).click();
        await driver.sleep(100);

        // پر کردن فرم
        const inputFields = [
            "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[3]/div/div[2]/div[1]/div/input",
            "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[4]/div/div[2]/div/div/input",
            "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[5]/div/div[2]/div/div/input",
            "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[6]/div/div[2]/div/div/input"
        ];

        for (const field of inputFields) {
            await driver.findElement(By.xpath(field)).sendKeys(nationalId);
            await driver.sleep(100);
        }

        await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[1]/div/button")).click();
        await driver.sleep(500);

        // بررسی نتیجه
        const bodyText = await driver.findElement(By.css("body")).getText();
        if (bodyText.includes("ذخیره شده")) {
            console.log(`${colors.green}✅ ایجاد موفق${colors.reset}`);
            return true;
        } else {
            console.log(`${colors.red}⛔ ایجاد ناموفق${colors.reset}`);
            return false;
        }
    } catch (err) {
        console.error(`${colors.red}❌ خطا در تست ایجاد:${colors.reset}`, err);
        return false;
    }
}

// توابع دیگر تست‌ها (با الگوی مشابه)
async function mewedit(driver, nationalId) {
    // پیاده‌سازی ویرایش
}

async function mewcontact(driver, nationalId) {
    // پیاده‌سازی تماس
}

async function mewpeople(driver, nationalId) {
    // پیاده‌سازی افراد
}

async function mewdelete(driver, nationalId) {
    // پیاده‌سازی حذف
}

// تابع اصلی برای اجرای زنجیره تست‌ها
async function mewhaqiqi() {
    const nationalId = generateNationalId();
    console.log(`${colors.yellow}🔹 کد ملی تولیدشده: ${nationalId}${colors.reset}`);

    const cookiesPath = path.join(__dirname, "cookies.json");
    let driver = await new Builder().forBrowser("chrome").build();

    try {
        // تنظیمات اولیه مرورگر
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
            console.log(`${colors.green}✅ کوکی‌ها بارگذاری شدند.${colors.reset}`);
        } else {
            console.log(`${colors.yellow}⚠️ کوکی یافت نشد.${colors.reset}`);
        }

        // اجرای تست‌ها به صورت زنجیره‌ای
        const testResults = {
            create: await mewhoquqi(driver, nationalId),
            edit: await mewedit(driver, nationalId),
            contact: await mewcontact(driver, nationalId),
            people: await mewpeople(driver, nationalId),
            delete: await mewdelete(driver, nationalId)
        };

        console.log(`${colors.yellow}📊 نتایج تست‌ها:${colors.reset}`, testResults);
        return testResults;

    } catch (err) {
        console.error(`${colors.red}❌ خطای کلی در اجرای تست‌ها:${colors.reset}`, err);
        return null;
    } finally {
        await driver.quit();
        console.log(`${colors.green}🚪 مرورگر بسته شد.${colors.reset}`);
    }
}

// اجرای مستقل تابع (در صورت نیاز)
// mewhaqiqi();

module.exports = {
    mewhaqiqi,
    mewhoquqi,
    mewedit,
    mewcontact,
    mewpeople,
    mewdelete
};