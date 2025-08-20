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

const cookiesPath = path.join(__dirname, "cookies.json");

async function saveCookies(driver) {
    const cookies = await driver.manage().getCookies();
    fs.writeFileSync(cookiesPath, JSON.stringify(cookies, null, 2));
}

async function loadCookies(driver) {
    if (fs.existsSync(cookiesPath)) {
        const cookies = JSON.parse(fs.readFileSync(cookiesPath, "utf8"));
        for (let cookie of cookies) {
            delete cookie.expiry;
            await driver.manage().addCookie(cookie);
        }
    }
}

async function operatorcreate() {
    let driver = await new Builder().forBrowser("chrome").build();

    try {
        await driver.get("https://frontbuildstage.ariansystemdp.local/fa");

        if (fs.existsSync(cookiesPath)) {
            await loadCookies(driver);
            await driver.navigate().refresh();
        } else {
            await driver.manage().setTimeouts({ implicit: 5000 });
            await driver.manage().window().maximize();

            const loginpath = "/html/body/div[3]/main/div/div/div/div[2]/form";
            await driver.findElement(By.xpath(`${loginpath}/div[1]/div/div[2]/div/div/input`)).sendKeys("12");
            await driver.findElement(By.xpath(`${loginpath}/div[2]/div/div[2]/div/div/span/input`)).sendKeys("12");
            await driver.findElement(By.xpath(`${loginpath}/div[4]/div/div[2]/div/div/button`)).click();
            await driver.sleep(1000);
            await saveCookies(driver);
        }

        // Continue your workflow here...

        await driver.sleep(100000);

    } catch (e) {
        console.error(e);
    } finally {
        await driver.quit();
    }
}

operatorcreate();
