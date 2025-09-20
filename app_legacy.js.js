const x = require("./operatordelete");
const y = require("./operatoredit");
const z = require("./operatorall");
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
        await driver.manage().setTimeouts({ implicit: 2000 });
        await driver.manage().window().maximize();

        const loginpath = "/html/body/div[1]/div[1]/form/div";
        await driver.findElement(By.xpath(`${loginpath}/div[2]/div/div/input`)).sendKeys("Admin");
        await driver.findElement(By.xpath(`${loginpath}/div[3]/div/div/input`)).sendKeys("12345678");
        await driver.findElement(By.xpath("//button[text()='ورود']")).click();

        await driver.wait(until.titleIs("پنل مدیریت نوکیا"), 500);

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

        await driver.findElement(By.xpath("//a[contains(text(),'مدیریت تولید')]")).click();
        await driver.wait(until.elementLocated(By.xpath("//button[text()='ایجاد']")), 1000);
        await driver.findElement(By.xpath("//button[text()='ایجاد']")).click();

        await driver.wait(until.elementLocated(By.name("firstname")), 1000);
        await driver.findElement(By.name("firstname")).sendKeys("1");
        await driver.findElement(By.name("lastname")).sendKeys("2");
        await driver.findElement(By.name("nationalId")).sendKeys(result);
        await driver.findElement(By.name("personalId")).sendKeys("4");
        await driver.findElement(By.name("mobile")).sendKeys("0930" + randomNumber);
        await driver.findElement(By.xpath('//*[@type="submit"]')).click();
    } catch (error) {
        console.error(`[ERROR] ${new Date().toISOString()}: ${error.stack}`);
    } finally {
        await driver.quit();
    }
}

(async function run() {
    await operatorcreate();
    //await x.operatordelete();
    //await y.operatoredit();
    //await z.operatorall();
})();
