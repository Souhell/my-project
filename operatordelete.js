const { Builder, By, until } = require("selenium-webdriver");
const fs = require("fs");
const path = require("path");

async function operatordelete() {
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
        await driver.manage().setTimeouts({ implicit: 2000 });
        await driver.manage().window().maximize();

        // ورود اطلاعات لاگین
        const loginpath = "/html/body/div[1]/div[1]/form/div";
        await driver.findElement(By.xpath(loginpath + "/div[2]/div/div/input")).sendKeys("Admin");
        await driver.findElement(By.xpath(loginpath + "/div[3]/div/div/input")).sendKeys("12345678");
        //await driver.findElement(By.xpath(loginpath + "/div[4]/div[2]/div/input")).sendKeys("1");
        await driver.findElement(By.xpath("//button[text()='ورود']")).click();
        await driver.sleep(1000)

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

        // تنظیم لاگ به فایل
        const logFilePath = path.join(__dirname, "log-output.txt");
        const logStream = fs.createWriteStream(logFilePath, { flags: "a" });
        const originalLog = console.log;

        console.log = function (message) {
            logStream.write(`[LOG]: ${message}\n`);
            originalLog(message);
        };

        // کلیک روی لینک "اپراتورها"
        await driver.wait(until.elementLocated(By.xpath("/html/body/div[1]/div/div/div/div[2]/ul/li[2]/div/div[2]")), 1000);
        await driver.findElement(By.xpath("/html/body/div[1]/div/div/div/div[2]/ul/li[2]/div/div[2]")).click();
        await driver.sleep(1000)
        await driver.findElement(By.css('a[href="/admin/production/operators"]')).click();
        await driver.sleep(1000)

        // صبر برای بارگذاری جدول
        await driver.sleep(500);

        // پیدا کردن و کلیک روی عنصر SVG
        await driver.findElement(By.css("svg.MuiSvgIcon-root.MuiSvgIcon-fontSizeMedium.muirtl-15qj732-MuiSvgIcon-root"))    
        .click();
        console.log(await driver.findElement(By.css(".MuiDialog-container button")));
        console.log("==== 66 ====");
        await driver.sleep(2000);
        await driver.findElement(By.css(".MuiDialog-container button+button")).click();;
       // await driver.findElement(By.css(".MuiDialog-container button+button")).click();;
       console.log("==== 70 ====");
        // صبر برای باز شدن دیالوگ حذف
        await driver.sleep(2000);

        // کلیک روی دکمه تایید حذف
        // const confirmDeleteButtonPath = "/html/body/div[3]/div[3]/div/div/div[2]/div/button[2]";
        // await driver.findElement(By.xpath(confirmDeleteButtonPath)).click();

        console.log(`${colors.green}Operator deleted successfully!${colors.reset}`);

    } catch (error) {
        // مدیریت خطاها
        console.error(`${colors.red}Error occurred:${colors.reset}`, error);
    } finally {
        // بستن مرورگر
        await driver.quit();
    }
}
operatordelete();
exports.operatordelete = operatordelete;
