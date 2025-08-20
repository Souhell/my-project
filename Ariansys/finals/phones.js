const { Builder, By, Key, until } = require("selenium-webdriver");
const fs = require("fs");
const path = require("path");
const selectorHelper = require("../helperSelector");

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

const cookiesPath = path.join(__dirname, "cookies.json");

async function phones() {
    let driver = await new Builder().forBrowser("chrome").build();
    let selector = new selectorHelper(driver);

    try {
        await driver.get("https://frontbuild.ariansystemdp.local/fa");
        await driver.manage().setTimeouts({ implicit: 5000 });
        await driver.manage().window().maximize();

        const loginpath = "/html/body/div[3]/main/div/div/div/div[2]/form";
        await driver.wait(until.elementLocated(By.xpath(`${loginpath}/div[1]/div/div[2]/div/div/input`))).sendKeys("12");
        await driver.wait(until.elementLocated(By.xpath(`${loginpath}/div[2]/div/div[2]/div/div/span/input`))).sendKeys("12");
        await selector.SelectByTitle("ورود"); // فرض بر این که دکمه ورود عنوان دارد

        // منوها و دکمه‌ها (در صورت داشتن عنوان یا title)
        // اگر عنوان دکمه‌ها را می‌دانی، این بخش‌ها را هم با helper جایگزین کن:
        // await selector.SelectByTitle("عنوان دکمه");
        // await selector.SelectByContainsTitle("بخشی از عنوان");

        // اگر عنوان ندارند، همان XPath را نگه دار:
        // await driver.wait(until.elementLocated(By.xpath("/html/body/div[3]/div/div[2]/div[1]/div[2]/div/div/div[3]/div/ul/li[4]"))).click();
        // await driver.sleep(500) 
        // await driver.wait(until.elementLocated(By.xpath("/html/body/div[3]/div/div[2]/div[1]/div[2]/div/div/div[3]/div/ul/li[4]/ul/li[2]"))).click();
        // await driver.sleep(500)
        // await driver.wait(until.elementLocated(By.xpath("/html/body/div[3]/div/div[2]/div[1]/div[2]/div/div/div[3]/div/ul/li[4]/ul/li[2]/ul/li[3]"))).click();
        // await driver.sleep(500)
        // await driver.wait(until.elementLocated(By.xpath("/html/body/div[3]/div/div[2]/div[1]/div[3]/div/div[1]/button"))).click();
        // await driver.sleep(500)
        // await driver.wait(until.elementLocated(By.xpath("/html/body/div[3]/div/div[2]/div[1]/div[3]/div/div[1]/div/div[2]/div/div[1]/div/div/div[2]/div[2]/div/div[2]/button[1]"))).click();
        // await driver.sleep(500)
        // await driver.wait(until.elementLocated(By.xpath("/html/body/div[6]/div/div[2]/div/div[3]/div[2]/button"))).click();
        // await driver.sleep(500)
        // await driver.wait(until.elementLocated(By.xpath("/html/body/div[3]/div/div[2]/div[1]/div[3]/div/div[2]/button"))).click();
        // await driver.sleep(500)
        // await driver.wait(until.elementLocated(By.xpath("/html/body/div[3]/div/div[2]/div[1]/div[3]/div/div[2]/div/div[2]/div/div[1]/div/div/div[2]/div[2]/div/div[2]/button[1]"))).click();

        // شروع تور (در صورت داشتن عنوان، با helper جایگزین کن)
        await driver.wait(until.elementLocated(By.xpath("/html/body/div[4]/div/ul/li/span/div/div[1]")), 5000).click();
        await driver.sleep(500)
        await driver.wait(until.elementLocated(By.xpath("/html/body/div[4]/div/ul/li/span/div/div[1]/div/div[2]/div/div[1]/div/div/div[2]/div[2]/div/div[2]/button[1]")), 5000).click();
        await driver.sleep(500)
        await driver.wait(until.elementLocated(By.xpath("/html/body/div[7]/div/div[2]/div/div[3]/div[2]/button")), 5000).click();
        await driver.sleep(500)
        await driver.wait(until.elementLocated(By.xpath("/html/body/div[7]/div/div[2]/div/div[3]/div[2]/button[2]")), 5000).click();
        await driver.sleep(500)
        await driver.wait(until.elementLocated(By.xpath("/html/body/div[4]/div/ul/li/span/div/div[2]")), 5000).click();
        await driver.sleep(500)
        await driver.wait(until.elementLocated(By.xpath("/html/body/div[4]/div/ul/li/span/div/div[2]/div/div[2]/div/div[1]/div/div/div[2]/div[2]/div/div[2]/button[1]")), 5000).click();
        await driver.sleep(500)
        await driver.wait(until.elementLocated(By.xpath("/html/body/div[4]/div/ul/li/span/div/div[3]")), 5000).click();
        await driver.sleep(500)
        await driver.wait(until.elementLocated(By.xpath("/html/body/div[4]/div/ul/li/span/div/div[3]/div/div[2]/div/div[1]/div/div/div[2]/div[2]/div/div[2]/button[3]")), 5000).click();
        await driver.sleep(500)
        await driver.wait(until.elementLocated(By.xpath("/html/body/div[4]/div/ul/li/span/div/div[4]")), 5000).click();
        await driver.sleep(500)
        await driver.wait(until.elementLocated(By.xpath("/html/body/div[4]/div/ul/li/span/div/div[4]/div/div[2]/div/div[1]/div/div/div[2]/div[2]/div/div[2]/button[1]")), 5000).click();
        await driver.sleep(500)

        await driver.wait(until.elementLocated(By.xpath("/html/body/div[4]/div/ul/li/span/div/div[5]")), 5000).click();
        await driver.sleep(500)
        await driver.wait(until.elementLocated(By.xpath("/html/body/div[4]/div/ul/li/span/div/div[5]/div/div[2]/div/div[1]/div/div/div[2]/div[2]/div/div[2]/button[1]")), 5000).click();
        await driver.sleep(500)
        // پایان تور
        const cookies = await driver.manage().getCookies();
        fs.writeFileSync(cookiesPath, JSON.stringify(cookies, null, 2));

        let bodyText = await driver.wait(until.elementLocated(By.css("body"))).getText();
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

//phones();

module.exports = phones;