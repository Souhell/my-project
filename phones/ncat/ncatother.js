const { Builder, By, Key, until } = require("selenium-webdriver");
const fs = require("fs");
const path = require("path");
const { log } = require("console");

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
    originalLog(colors.green + message + colors.reset);
};

console.error = function (message) {
    logStream.write(`[ERROR]: ${message}\n`);
    originalError(colors.red + message + colors.reset);
};

async function ncatOther() {
    let driver;
    try {
        driver = await new Builder().forBrowser("chrome").build();
        await driver.manage().window().maximize();
        await driver.manage().setTimeouts({ implicit: 10000 });

        console.log("Navigating to login page...");
        await driver.get("https://dev-ncat.tabatelecom.dev/auth/user-login");

        
        const loginpath = "/html/body/div[1]/div/div[2]/div/form/div";
        await driver.findElement(By.xpath(`${loginpath}/div[1]/div/div/input`)).sendKeys("0069941343");
        await driver.findElement(By.xpath(`${loginpath}/div[2]/div/div/input`)).sendKeys("123");
        await driver.findElement(By.xpath(`${loginpath}/div[3]/div/div/input`)).sendKeys("123");
        await driver.findElement(By.xpath(`${loginpath}/div[4]/div[2]/div/input`)).sendKeys("1");

        await driver.findElement(By.xpath(`${loginpath}/div[5]/button`)).click();
        console.log("Login button clicked.");
        await driver.sleep(1000)  

        await driver.wait(until.urlContains("dashboard"), 15000);
        console.log("Login successful. Redirected to dashboard.");

        
        await driver.findElement(By.xpath("/html/body/div[1]/div[2]/div/div[1]/div/table/tbody/tr/td[6]/span/div/a[1]")).click();
        console.log("explanation button clicked.");
        await driver.sleep(1000)

        //await driver.findElement(By.xpath("/html/body/div[25]/div[3]/div/div/div/form/div/div[2]/div/div/input")).sendKeys("123");
        await driver.sleep(1000)
                                                                             
        const elements = await driver.findElements(By.xpath("(//div[@class='MuiBox-root muirtl-8hj6rj'])[21]/div/button"));

        if (elements.length > 0) {
            await elements[0].click(); // کلیک روی اولین دکمه
        } else {
            console.error("هیچ دکمه‌ای پیدا نشد!");
        }

        await driver.sleep(1000)

        await driver.findElement(By.xpath("/html/body/div[26]/div[3]/div/div/div/form/div/div[4]/div/div/input")).sendKeys("123");
        await driver.sleep(1000)

        await driver.findElement(By.xpath("/html/body/div[26]/div[3]/div/div/div/form/div/div[2]/div/div/input")).sendKeys("0440527457");
        await driver.sleep(1000)

        //await driver.findElement(By.xpath("/html/body/div[25]/div[3]/div/div/div/form/div/div[7]/div/div[2]/div/div/button")).click();
        //await driver.sleep(1000)
        
        const filePath = path.resolve("C:/util/sampleExcel.xlsx");

        
        const fileInput = await driver.findElement(By.xpath("//input[@type='file']")); 

        await driver.findElement(By.name("isOtherEvent")).click();
        
        await driver.findElement(By.name("description")).sendKeys("mew");

        await fileInput.sendKeys(filePath);
        await driver.sleep(1000)
        console.log("File path sent to input.");

        await driver.findElement(By.xpath("/html/body/div[26]/div[3]/div/div/div/form/div/div[3]/div/div/div/input")).click();
        await driver.sleep(1000)

        await driver.findElement(By.xpath("/html/body/div[26]/div[3]/div/div/div/form/div/div[3]/div/div/div/input")).sendKeys("1234567");
        await driver.sleep(1000)

        //await driver.findElement(By.xpath("/html/body/div[26]/div[3]/div/div/div/form/div/div[4]/div/div/input")).sendKeys("123")
        await driver.sleep(1000)

        await driver.findElement(By.xpath("/html/body/div[26]/div[3]/div/div/div/form/div/div[8]/button")).click();
        console.log("Upload button clicked.");
        await driver.sleep(1000)
        




        
        await driver.sleep()

        
        

    } catch (error) {
        console.error("An error occurred:", error);
    } finally {
        if (driver) {
            await driver.quit();
        }
    }
}



module.exports = ncatOther;
