const { Builder, By, Key, until } = require("selenium-webdriver");
const fs = require("fs");
const path = require("path");

const colors = {
    red: "\x1b[31m",
    green: "\x1b[32m",
    reset: "\x1b[0m"
};

const logFilePath = path.join(__dirname, "log-output.txt");
const logStream = fs.createWriteStream(logFilePath, { flags: "a" });
const originalLog = console.log;
const originalError = console.error;

console.log = function (message) {
    logStream.write(`[LOG]: ${message}\n`);
    originalLog(message);
};

console.error = function (message) {
    logStream.write(`[ERROR]: ${message}\n`);
    originalError(message);
};

async function operatorcreate() {
    let driver = await new Builder().forBrowser("chrome").build();

    try {
        await driver.get("https://dev-promans.tabatelecom.dev/auth/login");
        await driver.manage().setTimeouts({ implicit: 5000 }); // زمان انتظار افزایش داده شد
        await driver.manage().window().maximize();

        const loginpath = "/html/body/div[1]/div[1]/form/div";
        await driver.findElement(By.xpath(`${loginpath}/div[2]/div/div/input`)).sendKeys("Admin");
        await driver.findElement(By.xpath(`${loginpath}/div[3]/div/div/input`)).sendKeys("Aa@123456");
        await driver.findElement(By.xpath("//button[text()='ورود']")).click();
        await driver.sleep(1000)



        await driver.wait(until.elementLocated(By.xpath("/html/body/div[1]/div/div/div/div[2]/ul/li[2]/div/div[2]")), 1000);
        await driver.findElement(By.xpath("/html/body/div[1]/div/div/div/div[2]/ul/li[2]/div/div[2]")).click();
        await driver.sleep(1000)
        await driver.findElement(By.css('a[href="/admin/production/phones"]')).click();
        await driver.sleep(1000)   
        await driver.findElement(By.css("button.MuiButtonBase-root.MuiButton-containedPrimary")).click();
        await driver.sleep(1000)  
        
        await driver.findElement(By.css('div[role="combobox"][aria-haspopup="listbox"]')).click();
        await driver.sleep(1000)
        await driver.findElement(By.xpath("//li[@role='option' and .//span[normalize-space(text())='nokia']]")).click() 
        await driver.sleep(1000)    
        await driver.findElement(By.id('modelCode')).click();
        await driver.sleep(1000)
        await driver.findElement(By.xpath("//li[@role='option' and .//span[normalize-space(text())='1100']]")).click()
        await driver.sleep(1000) 
         //await driver.findElement(By.id("phoneNameTitle")).sendKeys("123");
         await driver.findElement(By.id('year')).click();
         await driver.findElement(By.xpath("//li[@role='option' and .//span[normalize-space(text())='2000']]")).click()
        await driver.sleep(1000)

        

        //await driver.findElement(By.xpath("//div[@role='combobox' and .//p[normalize-space(text())='انتخاب کنید']]")).click()
        //await driver.sleep(1000)
        //await driver.findElement(By.xpath("//li[@role='option' and .//span[normalize-space(text())='2000']]")).click()
        //await driver.sleep(1000)
        await driver.findElement(By.id('network')).click()
        await driver.findElement(By.xpath("//li[@role='option' and .//span[normalize-space(text())='4G']]")).click()
        await driver.sleep(1000)
        await driver.findElement(By.id('technicalCode')).sendKeys("test")
        //await driver.findElement(By.xpath("//li[@role='option' and .//span[normalize-space(text())='4G']]")).click()
        await driver.sleep(1000)
        await driver.findElement(By.id('simCard')).click()
        await driver.sleep(1000)
        await driver.findElement(By.xpath("//li[@role='option' and .//span[normalize-space(text())='2']]")).click()
        await driver.sleep(1000)
        await driver.findElement(By.id('weight')).sendKeys("50")
        await driver.sleep(1000)
        await driver.findElement(By.id('madeInId')).click()
        await driver.sleep(1000)
        await driver.findElement(By.xpath("//li[contains(text(),'امارات')]")).click()

        await driver.sleep(1000)
        await driver.findElement(By.id('assemblyCountryId')).click()
        await driver.sleep(1000)
        await driver.findElement(By.xpath("//li[contains(text(),'امارات')]")).click()
        await driver.sleep(1000)
        await driver.findElement(By.id('boxCode')).sendKeys("test1")
        await driver.sleep(1000)    

        await driver.findElement(By.id('boxWeight')).sendKeys("123")
        await driver.sleep(1000)
        await driver.findElement(By.id('chargerCode')).sendKeys("test18")
        await driver.sleep(1000)
        await driver.findElement(By.id('chargerWeight')).sendKeys("123")
        await driver.sleep(1000)
        await driver.findElement(By.id('batteryCode')).sendKeys("test19")
        await driver.sleep(1000)
        await driver.findElement(By.id('batteryWeight')).sendKeys("123")
        await driver.sleep(1000)
        await driver.findElement(By.id('handsFreeCheck')).click()
        await driver.sleep(1000)
        await driver.findElement(By.id('handsFreeCode')).sendKeys("test20")
        await driver.sleep(1000)
        await driver.findElement(By.id('handsFreeWeight')).sendKeys("123")
        await driver.sleep(1000)
        await driver.findElement(By.id('manualCodeFa')).sendKeys("21")
        await driver.sleep(1000)
        await driver.findElement(By.id('manualFaWeight')).sendKeys("123")
        await driver.sleep(1000)
        await driver.findElement(By.id('manualCodeEn')).sendKeys("22")
        await driver.sleep(1000)
        await driver.findElement(By.id('manualEnWeight')).sendKeys("123")
        await driver.sleep(1000)
        await driver.findElement(By.id('colorFa')).click()
        await driver.sleep(1000)
        await driver.findElement(By.xpath("//li[contains(@data-value, 'قرمز')]")).click();
        await driver.sleep(1000)
        await driver.findElement(By.id('sku')).sendKeys("23")
        await driver.sleep(1000)
        await driver.findElement(By.id('barcode')).sendKeys("24")
        await driver.sleep(1000)
        await driver.findElement(By.id('acceptButton')).click()
        await driver.sleep(1000)
        await driver.findElement(By.id('okSpecification')).click()
        await driver.sleep(1000)
        await driver.findElement(By.id('okCountry')).click()
        await driver.sleep(1000)
        await driver.findElement(By.id('okBox')).click()
        await driver.sleep(1000)
        await driver.findElement(By.id('okCharger')).click()
        await driver.sleep(1000)
        await driver.findElement(By.id('okBattery')).click()
        await driver.sleep(1000)
        await driver.findElement(By.id('okHandsFree')).click()
        await driver.sleep(1000)
        await driver.findElement(By.id('okPersianManual')).click()
        await driver.sleep(1000)
        await driver.findElement(By.id('okEnglishManual')).click()
        await driver.sleep(1000)
        await driver.findElement(By.id('okColor')).click()
        await driver.sleep(1000)
        await driver.findElement(By.id('submitButton')).click()
        await driver.sleep(1000)
        

        


        await driver.wait(until.titleIs("پنل مدیریت نوکیا"), 5000); // زمان صبر افزایش یافت

        let bodyText = await driver.findElement(By.css("body")).getText();
        if (bodyText.includes("سام‌تل")) {
            console.log(`${colors.green}ok sam tel${colors.reset}`);
        } else {
            console.log(`${colors.red}not ok sam tel${colors.reset}`);
        }

        const randomNumber = Array.from({ length: 7 }, () => Math.floor(Math.random() * 10)).join('');
        console.log(randomNumber);

        function generator() {
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

        const result = generator();
        console.log("Generated Number:", result);

    } finally {
        await driver.quit();
    }
}

operatorcreate();