const { By } = require("selenium-webdriver");
const path = require("path");
const customDriver = require("../customerDriver");


// رنگ‌ها
const colors = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  reset: "\x1b[0m",
};

// ضبط ویدیو
let ffmpegProcess = null;
const videoPath = path.join(__dirname, "marketingTeam-record.mp4");

// function startRecording() {
//   try {
//     if (!fs.existsSync(FFMPEG_PATH)) {
//       console.warn("⚠️ ffmpeg پیدا نشد، ضبط ویدیو غیرفعال شد:", FFMPEG_PATH);
//       return;
//     }

//     ffmpegProcess = spawn(FFMPEG_PATH, [
//       "-y",
//       "-f",
//       "gdigrab",
//       "-i",
//       "desktop",
//       "-framerate",
//       "30",
//       videoPath,
//     ]);

//     ffmpegProcess.stderr.on("data", (data) => {
//       // اگه خواستی لاگ‌های داخلی ffmpeg رو ببینی:
//       // console.warn("ffmpeg stderr:", data.toString());
//     });

//     ffmpegProcess.on("error", (err) => {
//       console.error("❌ خطا در اجرای ffmpeg:", err.message);
//     });

//     console.log("🎥 ضبط ویدیو شروع شد...");
//   } catch (e) {
//     console.error("❌ نتوانستم ffmpeg را اجرا کنم:", e);
//     ffmpegProcess = null;
//   }
// }

function stopRecording(errorHappened = false) {
  return new Promise((resolve) => {
    if (!ffmpegProcess) return resolve();

    const proc = ffmpegProcess;
    ffmpegProcess = null;

    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;

      console.log("🎞 ضبط ویدیو پایان یافت");
      console.log("📁 مسیر فایل ویدیو:", videoPath);

      try {
        if (!errorHappened && fs.existsSync(videoPath)) {
          fs.unlinkSync(videoPath);
          console.log("✔ بدون خطا → ویدیو حذف شد");
        } else if (errorHappened) {
          if (fs.existsSync(videoPath)) {
            console.log("❗ خطا → ویدیو ذخیره شد:", videoPath);
          } else {
            console.warn("⚠️ خطا بود ولی فایل ویدیو پیدا نشد.");
          }
        }
      } catch (e) {
        console.error("⚠️ خطا هنگام مدیریت فایل ویدیو:", e.message);
      }

      resolve();
    };

    if (proc.exitCode !== null) {
      return finish();
    }

    proc.on("close", () => {
      finish();
    });

    proc.on("error", (e) => {
      console.error("⚠️ خطا در پروسه ffmpeg:", e.message);
      finish();
    });

    try {
      if (proc.stdin) {
        proc.stdin.write("q");
        proc.stdin.end();
      } else {
        finish();
      }
    } catch (e) {
      console.error("⚠️ خطا هنگام بستن ffmpeg:", e.message);
      finish();
    }

    setTimeout(() => {
      if (!finished) {
        console.warn("⚠️ ffmpeg به موقع بسته نشد، ادامه می‌دهیم...");
        finish();
      }
    }, 2000);
  });
}

// 🎯 تابع اصلی
async function marketingTeamList() {
  const nationalId = customDriver.generateNationalId();
  console.log("کد ملی تولید شده:", nationalId);

  let dr;
  let driver;
  let errorHappened = false;

  try {
    dr = new customDriver();
    const url = "https://frontbuild.ariansystemdp.local/fa";
    driver = await dr.createDriver(url, true);

    //startRecording();

    await dr.login();

    const steps = [
      "//div[@role='menuitem' and .//span[text()='فروش']]",
      "/html/body/div[3]/div/div[2]/div[1]/div/div[3]/div/ul/li[4]/ul/li[1]/div",
      "//li[@role='menuitem' and .//span[text()='تیم مارکتینگ']]",
      "//button[.//div[text()='افزودن مورد جدید']]",
    ];

    for (const xpath of steps) {
      await driver.findElement(By.xpath(xpath)).click();
      await driver.sleep(100);
    }

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[1]/div/div[2]/div[1]/div/input"
        )
      )
      .sendKeys(nationalId);
    await driver.sleep(100);

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[2]/form/div[2]/div/div[2]/div[1]/div/div/div/input"
        )
      )
      .sendKeys("1000");
    await driver.sleep(100);

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div[2]/div[2]/div[2]/div/div[1]/div/div[2]/div"
        )
      )
      .click();
    await driver.sleep(1000);
    const errorToastLocator = By.xpath(
      "//*[contains(., 'An error occurred while saving the entity changes')]"
    );

    const bodyText = await driver.findElement(By.css("body")).getText();
    if (bodyText.includes("ذخیره شد")) {
      console.log(`${colors.green}ok Aryan ${colors.reset}`);
    } else {
      console.log(`${colors.red}not ok Aryan ${colors.reset}`);
      errorHappened = true; // 👈 تست از نظر تو fail شده → ویدیو باید بماند
    }
  } catch (err) {
    console.error("❌ خطا:", err);
    errorHappened = true; // 👈 استثناء هم = خطا
  } finally {
    try {
       await dr.stopRecording(errorHappened);
    } catch (e) {
      console.error("⚠️ خطا داخل stopRecording:", e.message);
    }

    if (driver) {
      try {
        await driver.quit();
        console.log("✅ driver.quit() انجام شد");
      } catch (e) {
        console.error("⚠️ خطا داخل driver.quit():", e.message);
      }
    }
  }
}

marketingTeamList();
module.exports = marketingTeamList;
