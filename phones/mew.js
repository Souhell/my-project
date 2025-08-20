const { Builder, By, Key, until } = require("selenium-webdriver");
const fs = require("fs");
const path = require("path");
const colors = {
    red: "\x1b[31m",
    green: "\x1b[32m",
    reset: "\x1b[0m"
};
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


const nationalId = generateNationalId();
console.log("کد ملی تولیدشده:", nationalId);


const cookiesPath = path.join(__dirname, "cookies.json");

(async () => {
  let driver = await new Builder().forBrowser("chrome").build();
  

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

    await driver.wait(until.elementLocated(By.xpath("/html/body/div[3]/div/div[2]/div[1]/div[2]/div/div/div[3]/div/ul/li[1]"))).click();
    // await driver.sleep(100) 
    await driver.wait(until.elementLocated(By.xpath("/html/body/div[3]/div/div[2]/div[1]/div[2]/div/div/div[3]/div/ul/li[1]/ul/li[1]"))).click();
    // await driver.sleep(100) 
    await driver.wait(until.elementLocated(By.xpath("/html/body/div[3]/div/div[2]/div[1]/div[2]/div/div/div[3]/div/ul/li[1]/ul/li[1]/ul/li[1]"))).click();
    //await driver.sleep(100) 
    await driver.wait(until.elementLocated(By.xpath("/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[1]/div[1]/div[1]/button"))).click();
    //await driver.sleep(100)
    await driver.wait(until.elementLocated(By.xpath("/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[3]/div/div[2]/div[1]/div/input"))).sendKeys(nationalId);
    //await driver.sleep(100)
    await driver.wait(until.elementLocated(By.xpath("/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[4]/div/div[2]/div/div/input"))).sendKeys(nationalId);
    //await driver.sleep(100)
    await driver.wait(until.elementLocated(By.xpath("/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[5]/div/div[2]/div/div/input"))).sendKeys(nationalId);
    //await driver.sleep(100)
    await driver.wait(until.elementLocated(By.xpath("/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[6]/div/div[2]/div/div/input"))).sendKeys(nationalId);
    //await driver.sleep(100)
    await driver.wait(until.elementLocated(By.xpath("/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[1]/div/button"))).click();
    //await driver.sleep(100)
    //await driver.wait(until.elementLocated(By.xpath("YOUR_XPATH_HERE")), 5000);
    //await driver.findElement(By.xpath("YOUR_XPATH_HERE")).click();
    let bodyText = await driver.findElement(By.css("body")).getText();
            if (true) {
              while(!bodyText.includes("ذخیره شده")){ ``
                console.log(`${colors.green}dorost nist ${colors.reset}`);
              }
            } else {
                console.log(`${colors.red}not ok Aryan ${colors.reset}`);
            }















  } catch (err) {
    console.error("❌ خطا:", err);
  } finally {
    await driver.quit();
    // 
  }
})();
