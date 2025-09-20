const { Builder, By, until } = require("selenium-webdriver");
const fs = require("fs");
const path = require("path");

const colors = {
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    reset: "\x1b[0m"
};

// تابع تولید کد ملی با پیام‌دهی بهتر
function generateNationalId() {
    let digits = [];
    do {
        digits = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));
    } while (digits.every(d => d === 0));

    const check = digits
        .map((digit, index) => digit * (10 - index))
        .reduce((sum, val) => sum + val, 0) % 11;

    const controlDigit = check < 2 ? check : 11 - check;
    const nationalId = digits.join('') + controlDigit;
    
    console.log(`${colors.yellow}🔹 کد ملی تولید شده: ${nationalId}${colors.reset}`);
    return nationalId;
}

// تابع تولید شماره موبایل با پیام‌دهی بهتر
function generateMobileNumber() {
    const validPrefixes = [
        '0910', '0911', '0912', '0913', '0914', '0915', '0916', '0917', '0918', '0919',
        '0901', '0902', '0903', '0930', '0933', '0935', '0936', '0937', '0938', '0939',
        '0990', '0991', '0992', '0993', '0994'
    ];

    const prefix = validPrefixes[Math.floor(Math.random() * validPrefixes.length)];
    const lineNumber = Array.from({ length: 7 }, () => Math.floor(Math.random() * 10)).join('');
    const mobileNumber = prefix + lineNumber;
    
    console.log(`${colors.yellow}🔹 شماره موبایل تولید شده: ${mobileNumber}${colors.reset}`);
    return mobileNumber;
}

// تابع کمکی برای بارگذاری کوکی‌ها
async function loadCookies(driver) {
    const cookiesPath = path.join(__dirname, "cookies.json");
    
    if (!fs.existsSync(cookiesPath)) {
        console.log(`${colors.yellow}⚠️ فایل کوکی یافت نشد.${colors.reset}`);
        return false;
    }

    try {
        const cookies = JSON.parse(fs.readFileSync(cookiesPath, "utf8"));
        for (const cookie of cookies) {
            await driver.manage().addCookie(cookie);
        }
        await driver.navigate().refresh();
        console.log(`${colors.green}✅ کوکی‌ها با موفقیت بارگذاری شدند.${colors.reset}`);
        return true;
    } catch (err) {
        console.error(`${colors.red}❌ خطا در بارگذاری کوکی‌ها:${colors.reset}`, err);
        return false;
    }
}

// تابع اصلی با ساختار بهبودیافته
async function mewpeople() {
    const nationalId = generateNationalId();
    const phone = generateMobileNumber();
    const driver = await new Builder().forBrowser("chrome").build();

    try {
        // تنظیمات اولیه مرورگر
        await driver.get("https://frontbuild.ariansystemdp.local/fa");
        await driver.manage().window().maximize();
        await driver.manage().setTimeouts({ implicit: 10000 });
        
        // بارگذاری کوکی‌ها
        await loadCookies(driver);

        // انتظار برای بارگذاری صفحه
        await driver.wait(until.elementLocated(By.css("body")), 10000);
        console.log(`${colors.green}🏁 صفحه با موفقیت بارگذاری شد.${colors.reset}`);
        await driver.sleep(1000);

        // مراحل پیمایش منو
        const menuItems = [
            "/html/body/div[3]/div/div[2]/div[1]/div[2]/div/div/div[3]/div/ul/li[1]",
            "/html/body/div[3]/div/div[2]/div[1]/div[2]/div/div/div[3]/div/ul/li[1]/ul/li[1]",
            "/html/body/div[3]/div/div[2]/div[1]/div[2]/div/div/div[3]/div/ul/li[1]/ul/li[1]/ul/li[1]"
        ];

        for (const item of menuItems) {
            const element = await driver.wait(until.elementLocated(By.xpath(item)), 5000);
            await element.click();
            await driver.sleep(300);
        }

        // کلیک روی آیکون افراد
        await driver.findElement(By.xpath(
            "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/div[1]/div/div/div/div/div/div/table/tbody/tr[1]/td[5]/div/span[4]"
        )).click();
        await driver.sleep(500);

        // انتخاب شخص از لیست
        await driver.findElement(By.xpath(
            "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[3]/div[2]/div/div[1]/div/div/div[2]/div[2]/div/form/div[1]/div/div[2]/div/div/div/div[1]/div/span/span[1]/input"
        )).click();
        await driver.sleep(300);
        
        await driver.findElement(By.css('.ant-select-item-option[title*="Test tir mah"]')).click();
        await driver.sleep(300);

        // انتخاب نوع ارتباط
        await driver.findElement(By.xpath(
            "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[3]/div[2]/div/div[1]/div/div/div[2]/div[2]/div/form/div[2]/div/div[2]/div[1]/div/div/div[1]/div/span/span[1]/input"
        )).click();
        await driver.sleep(300);
        
        await driver.findElement(By.css('.ant-select-item-option[title*="سایر "]')).click();
        await driver.sleep(300);

        // وارد کردن شماره موبایل
        await driver.findElement(By.xpath(
            "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[3]/div[2]/div/div[1]/div/div/div[2]/div[2]/div/form/div[3]/div/div[2]/div/div/input"
        )).sendKeys(phone);
        await driver.sleep(300);

        // کلیک روی دکمه ذخیره
        await driver.findElement(By.xpath(
            "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[3]/div[2]/div/div[1]/div/div/div[2]/div[2]/div/form/div[4]/div/div/div/div/div/button"
        )).click();
        await driver.sleep(1000);

        // بررسی نتیجه با انتظار صریح
        await driver.wait(async () => {
            const bodyText = await driver.findElement(By.css("body")).getText();
            return bodyText.includes("عملیات با موفقیت انجام شد");
        }, 10000);

        console.log(`${colors.green}✅ عملیات با موفقیت انجام شد.${colors.reset}`);
        return { nationalId, phone }; // بازگشت اطلاعات برای استفاده در تست‌های بعدی

    } catch (err) {
        console.error(`${colors.red}❌ خطا در اجرای فرآیند:${colors.reset}`, err);
        
        // گرفتن اسکرین‌شات در صورت خطا
        try {
            const screenshot = await driver.takeScreenshot();
            fs.writeFileSync('error-people.png', screenshot, 'base64');
            console.log(`${colors.yellow}📸 از خطا اسکرین‌شات گرفته شد.${colors.reset}`);
        } catch (screenshotErr) {
            console.error(`${colors.red}❌ خطا در گرفتن اسکرین‌شات:${colors.reset}`, screenshotErr);
        }
        
        return null;
    } finally {
        await driver.quit();
        console.log(`${colors.green}🔚 مرورگر بسته شد.${colors.reset}`);
    }
}

// اجرای مستقل تابع (در صورت نیاز)
// mewpeople();

module.exports = { mewpeople };