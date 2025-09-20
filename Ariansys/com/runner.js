const path = require("path");

// لیست اسکریپت‌ها (نام فایل بدون .js)
const scripts = [
    "phones",
    
    "mewhaqiqi",
    
    "mewhoquqi",
    
    "mewpeople",
    
    "mewcontact",
    
    "mewedit",
    
    "mewdelete",

   
];

async function runScripts() {
    for (const scriptName of scripts) {
        console.log(`\n--- Running ${scriptName}.js ---`);
        try {
            // هر اسکریپت باید یک تابع async به نام main یا مشابه export کند
            const scriptPath = path.join(__dirname, scriptName + ".js");
            const scriptModule = require(scriptPath);

            // اگر تابع اصلی اسکریپت نام دیگری دارد، اینجا اصلاح کن
            if (typeof scriptModule === "function") {
                await scriptModule();
            } else if (typeof scriptModule.main === "function") {
                await scriptModule.main();
            } else {
                console.log(`No runnable function found in ${scriptName}.js`);
            }
        } catch (err) {
            console.error(`Error in ${scriptName}:`, err);
        }
    }
    console.log("\nAll scripts finished.");
}

runScripts();