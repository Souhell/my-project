const { Builder, By, Key, until } = require("selenium-webdriver");
const fs = require("fs");
const path = require("path");
const selectorHelper = require("../helperSelector");
const colors = {
    red: "\x1b[31m",
    green: "\x1b[32m",
    reset: "\x1b[0m"
};
async function mewedit() {
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
  let selector = new selectorHelper(driver);

  try {
    await driver.get("https://frontbuild.ariansystemdp.local/fa");
    await driver.manage().setTimeouts({ implicit: 5000 });
    await driver.manage().window().maximize();

    if (fs.existsSync(cookiesPath)) {
      // کوکی‌ها را ست کن
      const cookies = JSON.parse(fs.readFileSync(cookiesPath, "utf8"));
      for (const cookie of cookies) {
        // اگر domain کوکی ست شده بود، حذفش کن تا خطا نده
        delete cookie.domain;
        await driver.manage().addCookie(cookie);
      }
      // صفحه را مجدد باز کن (نه فقط رفرش)
      await driver.get("https://frontbuild.ariansystemdp.local/fa");
      console.log("✅ کوکی‌ها بارگذاری و صفحه مجدد باز شد.");
    } else {
      // لاگین کن و کوکی را ذخیره کن
      const loginpath = "/html/body/div[3]/main/div/div/div/div[2]/form";
      await driver.wait(until.elementLocated(By.xpath(`${loginpath}/div[1]/div/div[2]/div/div/input`))).sendKeys("12");
      await driver.wait(until.elementLocated(By.xpath(`${loginpath}/div[2]/div/div[2]/div/div/span/input`))).sendKeys("12");
      await selector.SelectByTitle("ورود");
      await driver.sleep(2000); // کمی صبر برای لاگین
      const cookies = await driver.manage().getCookies();
      fs.writeFileSync(cookiesPath, JSON.stringify(cookies, null, 2));
      console.log("✅ کوکی ذخیره شد.");
    }

        //
        //    await driver.wait(until.elementLocated(By.css("body")), 500);
        //    console.log("🏁 مرورگر آماده برای ادامه تست.");

        await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[1]/div[2]/div/div[3]/div/ul/li[1]")).click();
    await driver.sleep(100) 
    await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[1]/div[2]/div/div[3]/div/ul/li[1]/ul/li[1]")).click();
    await driver.sleep(100) 
    await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[1]/div[2]/div/div[3]/div/ul/li[1]/ul/li[1]/ul/li[1]")).click();
    await driver.sleep(100) 
        //await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[1]/div[1]/div[1]/button")).click();
        await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/div[1]/div/div/div/div/div/div/table/tbody/tr[1]/td[5]/div/span[1]")).click();
        await driver.sleep(100)
        await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[3]/div/div[2]/div[1]/div/input")).sendKeys(Key.CONTROL + 'a');
        await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[3]/div/div[2]/div[1]/div/input")).sendKeys(Key.DELETE);
        await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[3]/div/div[2]/div[1]/div/input")).sendKeys(nationalId);

        await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[4]/div/div[2]/div/div/input")).sendKeys(Key.CONTROL + 'a');
        await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[4]/div/div[2]/div/div/input")).sendKeys(Key.DELETE);
        await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[4]/div/div[2]/div/div/input")).sendKeys(nationalId);
        await driver.sleep(100)

        await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[5]/div/div[2]/div/div/input")).sendKeys(Key.CONTROL + 'a');
        await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[5]/div/div[2]/div/div/input")).sendKeys(Key.DELETE);
        await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[5]/div/div[2]/div/div/input")).sendKeys(nationalId);
        await driver.sleep(100)

        await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[6]/div/div[2]/div/div/input")).sendKeys(Key.CONTROL + 'a');
        await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[6]/div/div[2]/div/div/input")).sendKeys(Key.DELETE);
        await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[6]/div/div[2]/div/div/input")).sendKeys(nationalId);
        await driver.sleep(100)

        await driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[1]/div/div[2]/div")).click();
        await driver.sleep(100)
        //await driver.wait(until.elementLocated(By.xpath("YOUR_XPATH_HERE")), 5000);
        //await driver.findElement(By.xpath("YOUR_XPATH_HERE")).click();
        let bodyText = await driver.findElement(By.css("body")).getText();

        if (bodyText.includes("تنظیم شده")) {
            await driver.sleep(10000);
            console.log(`${colors.green}ok Aryan ${colors.reset}`);
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
}

//mewedit();
module.exports = mewedit;
