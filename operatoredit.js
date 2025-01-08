const { Builder, By, until, Key } = require("selenium-webdriver"); 
const fs = require("fs");
const path = require("path");

async function operatoredit() {
    // تعریف WebDriver
    let driver = await new Builder().forBrowser("chrome").build();


    async  function change(element,text){

        console.log("==== element ====");
        console.log(element)
       
        selectAll = Key.chord(Key.CONTROL, "a");
        await   element.sendKeys(selectAll);
        await   element.sendKeys(text);

        console.log("==== end ===");


    }

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
        await driver.findElement(By.xpath(loginpath + "/div[3]/div/div/input")).sendKeys("12345678");
        await driver.findElement(By.xpath("//button[text()='ورود']")).click();

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
        await driver.wait(until.elementLocated(By.xpath("/html/body/div[1]/div/div/div/div[2]/ul/li[2]/div/div[2]")), 1000);
        await driver.findElement(By.xpath("/html/body/div[1]/div/div/div/div[2]/ul/li[2]/div/div[2]")).click();
        await driver.sleep(1000)
        await driver.findElement(By.css('a[href="/admin/production/operators"]')).click();
        await driver.sleep(1000)

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

        // کلیک روی دکمه "ویرایش اپراتور"
        await driver.findElement(By.css("svg.MuiSvgIcon-root.MuiSvgIcon-fontSizeMedium.muirtl-lw08pq-MuiSvgIcon-root"))    
        .click();
        


        

        // پر کردن فرم اطلاعات اپراتور
        await driver.findElement(By.name("firstname"));
        
        const inputField = await driver.findElement(By.name("firstname"));
        await inputField.sendKeys(Key.chord(Key.CONTROL, "a"), Key.BACK_SPACE);
        await inputField.sendKeys("اپراتور" + randomNumber);


        const element =  await driver.findElement(By.name("lastname"));

        await change(element,"1234");


        



        await driver.sleep(1000000);
        await driver.findElement(By.name("lastname")).sendKeys("تستی");
        await driver.sleep(1000);
        //await driver.findElement(By.name("nationalId")).sendKeys(nationalId);
        await driver.findElement(By.name("personalId")).clear();
        await driver.findElement(By.name("personalId")).sendKeys("0");
        await driver.sleep(1000);
        const inputfield1 = await driver.findElement(By.name("mobile"));
        await inputfield1.sendKeys(Key.chord(Key.CONTROL, "a"), Key.BACK_SPACE);
        await inputfield1.sendKeys("0930" + randomNumber);
        await driver.sleep(1000);
        //await driver.findElement(By.name("mobile")).sendKeys("0930" + randomNumber);
        //await driver.sleep(1000);

        // ارسال فرم
        await driver.findElement(By.xpath('//*[@type="submit"]')).click();
        await driver.sleep(1000);
        console.log(`${colors.green}Form submitted successfully!${colors.reset}`);
        await driver.sleep(1000);

    } catch (error) {
        // مدیریت خطاها
        console.error(`${colors.red}Error occurred:${colors.reset}`, error);
    } finally {
        // بستن مرورگر
        await driver.quit();
    }
}

operatoredit();
exports.operatoredit = operatoredit;
