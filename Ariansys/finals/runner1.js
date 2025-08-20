const { Builder } = require("selenium-webdriver");

async function runScriptsSequentially() {

    try {
        console.log("--- Running phones.js ---");
        const phones = require("./phones");
        await phones();

        await wait(3000); // فاصله ۲ ثانیه

        console.log("--- Running mewhaqiqi.js ---");
        const mewhaqiqi = require("./mewhaqiqi");
        await mewhaqiqi();

        await wait(10000);

        console.log("--- Running mewhoquqi.js ---");
        const mewhoquqi = require("./mewhoquqi");
        await mewhoquqi();

        await wait(10000);

        console.log("--- Running mewpeople.js ---");
        const mewpeople = require("./mewpeople");
        await mewpeople();

        await wait(10000);

        console.log("--- Running mewcontact.js ---");
        const mewcontact = require("./mewcontact");
        await mewcontact();

        await wait(10000);

        console.log("--- Running mewedit.js ---");
        const mewedit = require("./mewedit");
        await mewedit();

        await wait(12000);

        console.log("--- Running mewdelete.js ---");
        const mewdelete = require("./mewdelete");
        await mewdelete();

        await wait(10000);

      

    } catch (err) {
        console.error("Error in scripts:", err);
    } finally {
        console.log("Closing browser...");
        await driver.quit();
    }
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

runScriptsSequentially();
