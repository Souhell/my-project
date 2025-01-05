const { Builder, By, until } = require("selenium-webdriver");
const fs = require("fs");
const path = require("path");

async function operatoredit() {
    // تعریف WebDriver
    let driver = await new Builder().forBrowser("chrome").build();

    // تعریف رنگ‌ها برای لاگ‌ها
    const colors = {
        red: "\x1b[31m",
        green: "\x1b[32m",
        reset: "\x1b[0m",
    };

    try {
        // باز کردن صفحه لاگین
        await driver.get("https://dev-promans.tabatelecom.dev/auth/login");
        await driver.manage().setTimeouts({ implicit: 20000 });
        await driver.manage().window().maximize();

        // ورود اطلاعات لاگین
        const loginpath = "/html/body/div[1]/div[1]/form/div";
        await driver.findElement(By.xpath(loginpath + "/div[2]/div/div/input")).sendKeys("Admin");
        await driver.findElement(By.xpath(loginpath + "/div[3]/div/div/input")).sendKeys("123456Aa@");
        await driver.findElement(By.id(":R556d7rrrtkq:")).click();

        // بررسی عنوان صفحه
        await driver.wait(until.titleIs("پنل مدیریت نوکیا"), 5000);
        console.log(`${colors.green}Title is correct!${colors.reset}`);

        // بررسی متن موجود در صفحه
        let bodyText = await driver.findElement(By.css("body")).getText();
        if (bodyText.includes("سام‌تل")) {
            console.log(`${colors.green}Text found: سام‌تل${colors.reset}`);
        } else {
            console.log(`${colors.red}Text not found: سام‌تل${colors.reset}`);
        }

        // کلیک روی لینک "اپراتورها"
        await driver.wait(until.elementLocated(By.css('a[href="/admin/production/operators"]')), 5000);
        await driver.findElement(By.css('a[href="/admin/production/operators"]')).click();

        // تولید شماره موبایل تصادفی
        const randomNumber = Array.from({ length: 7 }, () => Math.floor(Math.random() * 10)).join('');
        console.log("Generated Random Number (Mobile):", randomNumber);

        // تنظیم لاگ به فایل
        const logFilePath = path.join(__dirname, "log-output.txt");
        const logStream = fs.createWriteStream(logFilePath, { flags: "a" });
        const originalLog = console.log;

        console.log = function (message) {
            logStream.write(`[LOG]: ${message}\n`);
            originalLog(message);
        };

        // تولید کد ملی تصادفی
        function generateNationalId() {
            const list = [];
            let sum = 0;

            for (let i = 10; i > 1; i--) {
                const randomDigit = Math.floor(Math.random() * 10);
                list.push(randomDigit);
                sum += randomDigit * i;
            }

            const remainder = sum % 11;
            const checkDigit = remainder < 2 ? remainder : 11 - remainder;

            list.push(checkDigit);
            return list.join('');
        }

        const nationalId = generateNationalId();
        console.log("Generated National ID:", nationalId);

        // کلیک روی دکمه "اضافه کردن اپراتور"
        await driver.wait(until.elementLocated(By.xpath("/html/body/div[1]/main/div/div[1]/button")), 5000);
        await driver.findElement(By.xpath("/html/body/div[1]/main/div/div[1]/button")).click();

        // پر کردن فرم اطلاعات اپراتور
        await driver.findElement(By.name("firstname")).sendKeys("111");
        await driver.sleep(10000);

        await driver.findElement(By.name("lastname")).sendKeys("2");
        await driver.findElement(By.name("nationalId")).sendKeys(nationalId);
        await driver.findElement(By.name("personalId")).sendKeys("4");
        await driver.findElement(By.name("mobile")).sendKeys("0930" + randomNumber);

        // ارسال فرم
        await driver.findElement(By.xpath('//*[@type="submit"]')).click();
        console.log(`${colors.green}Form submitted successfully!${colors.reset}`);

    } catch (error) {
        // مدیریت خطاها
        console.error(`${colors.red}Error occurred:${colors.reset}`, error);
    } finally {
        // بستن مرورگر
        await driver.quit();
    }
}

exports.operatoredit = operatoredit;
