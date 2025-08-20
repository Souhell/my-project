const { Builder, By, until } = require("selenium-webdriver");
const fs = require("fs");
const path = require("path");

const colors = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  reset: "\x1b[0m"
};

// تابع تولید کد ملی با پیام‌دهی بهتر
function generateNationalId() {
  let digits;
  do {
    digits = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));
  } while (digits.every(d => d === 0));

  const check = digits
    .map((digit, index) => digit * (10 - index))
    .reduce((sum, val) => sum + val, 0) % 11;
  const controlDigit = check < 2 ? check : 11 - check;

  const nationalId = digits.join('') + controlDigit;
  console.log(`${colors.yellow}🔹 کد ملی تولید شده: ${nationalId}${colors.reset}`);
  return nationalId;
}

// تابع کمکی برای بارگذاری کوکی‌ها
async function loadCookies(driver) {
  const cookiesPath = path.join(__dirname, "cookies.json");
  
  if (!fs.existsSync(cookiesPath)) {
    console.log(`${colors.yellow}⚠️ فایل کوکی یافت نشد.${colors.reset}`);
    return false;
  }

  try {
    const cookies = JSON.parse(fs.readFileSync(cookiesPath, "utf8"));
    for (const cookie of cookies) {
      await driver.manage().addCookie(cookie);
    }
    await driver.navigate().refresh();
    console.log(`${colors.green}✅ کوکی‌ها با موفقیت بارگذاری شدند.${colors.reset}`);
    return true;
  } catch (err) {
    console.error(`${colors.red}❌ خطا در بارگذاری کوکی‌ها:${colors.reset}`, err);
    return false;
  }
}

// تابع اصلی با ساختار بهبودیافته
async function mewhoquqi() {
  const nationalId = generateNationalId();
  const driver = await new Builder().forBrowser("chrome").build();

  try {
    // تنظیمات اولیه مرورگر
    await driver.get("https://frontbuild.ariansystemdp.local/fa");
    await driver.manage().window().maximize();
    await driver.manage().setTimeouts({ implicit: 10000 }); // افزایش زمان انتظار
    
    // بارگذاری کوکی‌ها
    await loadCookies(driver);

    // انتظار برای بارگذاری صفحه
    await driver.wait(until.elementLocated(By.css("body")), 10000);
    console.log(`${colors.green}🏁 صفحه با موفقیت بارگذاری شد.${colors.reset}`);

    // مراحل پیمایش منو
    const menuItems = [
      "/html/body/div[3]/div/div[2]/div[1]/div[2]/div/div/div[3]/div/ul/li[1]",
      "/html/body/div[3]/div/div[2]/div[1]/div[2]/div/div/div[3]/div/ul/li[1]/ul/li[1]",
      "/html/body/div[3]/div/div[2]/div[1]/div[2]/div/div/div[3]/div/ul/li[1]/ul/li[1]/ul/li[1]"
    ];

    for (const item of menuItems) {
      const element = await driver.wait(until.elementLocated(By.xpath(item)), 5000);
      await element.click();
      await driver.sleep(300); // افزایش زمان تاخیر برای اطمینان
    }

    // کلیک روی دکمه افزودن
    await driver.findElement(By.xpath(
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[1]/div[1]/div[1]/button"
    )).click();
    await driver.sleep(500);

    // انتخاب نوع "حقیقی"
    await driver.findElement(By.xpath(
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[1]/div/div[2]/div/div/div/label[2]/span[1]/input"
    )).click();
    await driver.sleep(300);

    // پر کردن فیلدهای کد ملی
    for (let i = 3; i <= 6; i++) {
      const field = await driver.wait(until.elementLocated(By.xpath(
        `/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[${i}]/div/div[2]/div/div/input`
      )), 5000);
      
      await field.clear();
      await field.sendKeys(nationalId);
      await driver.sleep(200);
    }

    // کلیک روی دکمه ذخیره
    await driver.findElement(By.xpath(
      "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[1]/div/button"
    )).click();

    // بررسی نتیجه با انتظار صریح
    await driver.wait(async () => {
      const bodyText = await driver.findElement(By.css("body")).getText();
      return bodyText.includes("ذخیره شده");
    }, 10000);

    console.log(`${colors.green}✅ ذخیره‌سازی با موفقیت انجام شد.${colors.reset}`);
    return nationalId; // بازگشت کد ملی برای استفاده در تست‌های بعدی

  } catch (err) {
    console.error(`${colors.red}❌ خطا در اجرای فرآیند:${colors.reset}`, err);
    
    // گرفتن اسکرین‌شات در صورت خطا
    try {
      const screenshot = await driver.takeScreenshot();
      fs.writeFileSync('error-screenshot.png', screenshot, 'base64');
      console.log(`${colors.yellow}📸 از خطا اسکرین‌شات گرفته شد.${colors.reset}`);
    } catch (screenshotErr) {
      console.error(`${colors.red}❌ خطا در گرفتن اسکرین‌شات:${colors.reset}`, screenshotErr);
    }
    
    return null;
  } finally {
    await driver.quit();
    console.log(`${colors.green}🔚 مرورگر بسته شد.${colors.reset}`);
  }
}

module.exports = { mewhoquqi };