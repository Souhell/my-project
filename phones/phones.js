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
//

const cookiesPath = path.join(__dirname, "cookies.json");
//
async function operatorcreate() {
    let driver = await new Builder().forBrowser("chrome").build();

    try {
        await driver.get("https://frontbuild.ariansystemdp.local/fa");
        await driver.manage().setTimeouts({ implicit: 5000 }); // زمان انتظار افزایش داده شد
        await driver.manage().window().maximize();

        const loginpath = "/html/body/div[3]/main/div/div/div/div[2]/form";
        await driver.findElement(By.xpath(`${loginpath}/div[1]/div/div[2]/div/div/input`)).sendKeys("12");
        await driver.findElement(By.xpath(`${loginpath}/div[2]/div/div[2]/div/div/span/input`)).sendKeys("12");
        await driver.findElement(By.xpath(`${loginpath}/div[4]/div/div[2]/div/div/button`)).click();
        await driver.sleep(1000)



        await driver.wait(until.elementLocated(By.xpath("/html/body/div[3]/div/div[2]/div[1]/div[2]/div/div/div[3]/div/ul/li[4]")), 1000);
        await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[1]/div[2]/div/div/div[3]/div/ul/li[4]")).click();
        await driver.sleep(1000)
        await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[1]/div[2]/div/div/div[3]/div/ul/li[4]/ul/li[2]")).click();
        await driver.sleep(1000)   
        await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[1]/div[2]/div/div/div[3]/div/ul/li[4]/ul/li[2]/ul/li[3]")).click();
        await driver.sleep(1000)  
        
        await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[1]/div[3]/div/div[1]/button")).click();
        await driver.sleep(1000)
        await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[1]/div[3]/div/div[1]/div/div[2]/div/div[1]/div/div/div[2]/div[2]/div/div[2]/button[1]")).click() 
        await driver.sleep(1000)    
        await driver.findElement(By.xpath("/html/body/div[6]/div/div[2]/div/div[3]/div[2]/button")).click();
        await driver.sleep(1000)
        await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[1]/div[3]/div/div[2]/button")).click()
        await driver.sleep(1000) 
         //await driver.findElement(By.id("phoneNameTitle")).sendKeys("123");
         await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[1]/div[3]/div/div[2]/div/div[2]/div/div[1]/div/div/div[2]/div[2]/div/div[2]/button[1]")).click();
         await driver.sleep(1000)
         //شروع تور
         await driver.wait(until.elementLocated(By.xpath("/html/body/div[6]/div/div[2]/div/div[3]/div[2]/button[2]"))).click()
        //await driver.sleep(1000)
        await driver.wait(until.elementLocated(By.xpath("/html/body/div[3]/div/div[2]/div[1]/div[3]/div/div[3]/button"))).click()
        //await driver.sleep(1000)
        await driver.wait(until.elementLocated(By.xpath("/html/body/div[3]/div/div[2]/div[1]/div[3]/div/div[3]/div/div[2]/div/div[1]/div/div/div[2]/div[2]/div/div[2]/button"))).click()
        //await driver.sleep(1000)
        await driver.wait(until.elementLocated(By.xpath("/html/body/div[6]/div/div[2]/div/div[3]/div[2]/button[2]"))).click()
        //await driver.sleep(1000)
        await driver.wait(until.elementLocated(By.xpath("/html/body/div[3]/div/div[2]/div[1]/div[3]/div/div[4]/button"))).click()
        //await driver.sleep(1000)
        await driver.wait(until.elementLocated(By.xpath("/html/body/div[3]/div/div[2]/div[1]/div[3]/div/div[4]/div/div[2]/div/div[1]/div/div/div[2]/div[2]/div/div[2]/button[1]"))).click()
        //await driver.sleep(1000)
        await driver.wait(until.elementLocated(By.xpath("/html/body/div[6]/div/div[2]/div/div[3]/div[2]/button[2]"))).click()
        //await driver.sleep(1000)
        await driver.wait(until.elementLocated(By.xpath("/html/body/div[3]/div/div[2]/div[1]/div[3]/div/div[5]/button"))).click()
        //await driver.sleep(1000)
        await driver.wait(until.elementLocated(By.xpath("/html/body/div[3]/div/div[2]/div[1]/div[3]/div/div[5]/div/div[2]/div/div[1]/div/div/div[2]/div[2]/div/div[2]/button[1]"))).click()
        //await driver.sleep(1000)
        await driver.wait(until.elementLocated(By.xpath("/html/body/div[6]/div/div[2]/div/div[3]/div[2]/button[2]"))).click()
        //await driver.sleep(1000)
        const cookiesPath = path.join(__dirname, "cookies.json");

        const cookies = await driver.manage().getCookies();
        fs.writeFileSync(cookiesPath, JSON.stringify(cookies, null, 2));
        //پایان تور



          
        //await driver.wait(until.titleIs(""), 5000); // زمان صبر افزایش یافت

        let bodyText = await driver.findElement(By.css("body")).getText();
        if (bodyText.includes("آرین")) {
            console.log(`${colors.green}ok Aryan ${colors.reset}`);
        } else {
            console.log(`${colors.red}not ok Aryan ${colors.reset}`);
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