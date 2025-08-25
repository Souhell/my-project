const { Builder, By, Key, until } = require("selenium-webdriver");
const fs = require("fs");
const path = require("path");
const selectorHelper = require("../helperSelector");
const colors = {
    red: "\x1b[31m",
    green: "\x1b[32m",
    reset: "\x1b[0m"
};
async function mewpeople() {
function generateNationalId() {
    let digits = [];
    do {
        digits = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));
    } while (digits.every(d => d === 0));

    const check = digits
        .map((digit, index) => digit * (10 - index))
        .reduce((sum, val) => sum + val, 0) % 11;

    const controlDigit = check < 2 ? check : 11 - check;

    return digits.join('') + controlDigit;
}


function generateMobileNumber() {
    const validPrefixes = [
        '0910', '0911', '0912', '0913', '0914', '0915', '0916', '0917', '0918', '0919',
        '0901', '0902', '0903', '0930', '0933', '0935', '0936', '0937', '0938', '0939',
        '0990', '0991', '0992', '0993', '0994'
    ];

    const prefix = validPrefixes[Math.floor(Math.random() * validPrefixes.length)];
    const lineNumber = Array.from({ length: 7 }, () => Math.floor(Math.random() * 10)).join('');

    return prefix + lineNumber;
}


const nationalId = generateNationalId();
const phone = generateMobileNumber();

console.log("کد ملی تولیدشده:", nationalId);
console.log("شماره موبایل تولیدشده:", phone);
 

const cookiesPath = path.join(__dirname, "cookies.json");

(async () => {
  let driver = await new Builder().forBrowser("chrome").build();
  let helper = new selectorHelper(driver);

  try {
    await driver.get("https://frontbuild.ariansystemdp.local/fa");
    await driver.manage().setTimeouts({ implicit: 5000 });
    await driver.manage().window().maximize();

    // 🍪 Load cookies if available
    if (fs.existsSync(cookiesPath)) {
      const cookies = JSON.parse(fs.readFileSync(cookiesPath, "utf8"));
      for (const cookie of cookies) {
        //delete cookie.sameSite;
        await driver.manage().addCookie(cookie);
      }
      await driver.navigate().refresh();
      console.log("✅ کوکی‌ها بارگذاری و صفحه رفرش شد.");
    } else {
      console.log("⚠️ کوکی یافت نشد. لطفاً ابتدا کوکی را ذخیره کنید.");
    }


  
    //
    await driver.wait(until.elementLocated(By.css("body")), 500);
    console.log("🏁 مرورگر آماده برای ادامه تست.");
    await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[1]/div[2]/div/div[3]/div/ul/li[1]")).click();
    await driver.sleep(100) 
    await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[1]/div[2]/div/div[3]/div/ul/li[1]/ul/li[1]")).click();
    await driver.sleep(100) 
    await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[1]/div[2]/div/div[3]/div/ul/li[1]/ul/li[1]/ul/li[1]")).click();
    await driver.sleep(100)  
    await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/div[1]/div/div/div/div/div/div/table/tbody/tr[1]/td[5]/div/span[4]")).click();
    await driver.sleep(100)
        //await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[3]/div[2]/div/div[1]/div/div/div/div[2]/div/div/button[3]")).click();
        await driver.sleep(100)

        // انتخاب گزینه اول
        await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[3]/div[2]/div/div[1]/div/div/div[2]/div[2]/div/form/div[1]/div/div[2]/div/div/div/div[1]/div/span/span[1]/input")).click();
        await driver.sleep(100);
        const options = await driver.findElements(By.css('.ant-select-item-option'));
        if (options.length > 1) {
            await driver.executeScript("arguments[0].scrollIntoView(true);", options[1]);
            await options[1].click();
        }

        // انتخاب گزینه دوم
        await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[3]/div[2]/div/div[1]/div/div/div[2]/div[2]/div/form/div[2]/div/div[2]/div/div/div/div[1]/div/span/span[1]/input")).click();
        await driver.sleep(100);
        await driver.findElements(By.css('.ant-select-item-option'));
        await driver.executeScript("arguments[0].scrollIntoView(true);", options[1]);
        await driver.findElement(By.css('.ant-select-item-option[title*="سایر "]')).click();
        await driver.sleep(300);

        await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[3]/div[2]/div/div[1]/div/div/div[2]/div[2]/div/form/div[3]/div/div[2]/div/div/input")).sendKeys(phone);
        await driver.sleep(100)
        await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[3]/div[2]/div/div[1]/div/div/div[2]/div[2]/div/form/div[4]/div/div/div/div/div/button")).click();
        await driver.sleep(1000)

        // await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[3]/div/div[2]/div[1]/div/input")).sendKeys(nationalId);
        // await driver.sleep(100)
        // await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[4]/div/div[2]/div/div/input")).sendKeys(nationalId);
        // await driver.sleep(100)
        // await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[5]/div/div[2]/div/div/input")).sendKeys(nationalId);
        // await driver.sleep(100)
        // await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[6]/div/div[2]/div/div/input")).sendKeys(nationalId);
        // await driver.sleep(100)
        // await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[1]/div/button")).click();
        // await driver.sleep(100)
        // await driver.wait(until.elementLocated(By.xpath("YOUR_XPATH_HERE")), 5000);
        // await driver.findElement(By.xpath("YOUR_XPATH_HERE")).click();
        let bodyText = await driver.findElement(By.css("body")).getText();

        if (bodyText.includes("عملیات با موفقیت انجام شد")) {
            await driver.sleep(100);
            console.log(`${colors.green}ok Aryan ${colors.reset}`);
        } else {
            console.log(`${colors.red}not ok Aryan ${colors.reset}`);
        }
    } catch (err) {
        console.error("❌ خطا:", err);
    } finally {
       await driver.quit();
        
    }
})();
}
//mewpeople();
module.exports = mewpeople;