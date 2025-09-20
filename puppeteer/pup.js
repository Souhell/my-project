const puppeteer = require("puppeteer");
const notifier = require("node-notifier");

async function checkSaipa() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto("https://www.saipacorp.com/fa/sales", {
      waitUntil: "domcontentloaded",
    });

    // متن صفحه رو بخون
    const bodyText = await page.evaluate(() => document.body.innerText);

    if (bodyText.includes("نتایج") || bodyText.includes("برندگان")) {
      console.log("✅ نتایج اعلام شد!");
      notifier.notify({
        title: "سایپا - C3-XR",
        message: "نتایج ثبت‌نام اعلام شد!",
        sound: true,
      });
    } else {
      console.log("⏳ هنوز خبری نیست...");
    }
  } catch (err) {
    console.error("❌ خطا:", err.message); 
  } finally {
    await browser.close();
  }
}

// هر 5 دقیقه یکبار اجرا
setInterval(checkSaipa, 5 * 60 * 1000);

// اجرای اولین بار
checkSaipa();   
 