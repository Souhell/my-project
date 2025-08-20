const { Builder, By, Key, until } = require("selenium-webdriver");

async function extractXpaths() {
    let driver = await new Builder().forBrowser("chrome").build();

    try {
        // باز کردن صفحه
        await driver.get("https://frontbuildstage.ariansystemdp.local/fa ");
        await driver.manage().window().maximize();
        
        // انتظار برای لود کامل صفحه
        await driver.wait(until.elementLocated(By.xpath("//button[text()='ورود']")), 5000);
        
        const loginpath = "/html/body/div[1]/div[1]/form/div";
        await driver.findElement(By.xpath(`${loginpath}/div[2]/div/div/input`)).sendKeys("Admin");
        await driver.sleep(1000)
        await driver.findElement(By.xpath(`${loginpath}/div[3]/div/div/input`)).sendKeys("Aa@123456");
        await driver.sleep(1000)
        await driver.findElement(By.xpath("//button[text()='ورود']")).click();
        await driver.sleep(10000)
        await driver.wait(until.elementLocated(By.xpath("/html/body/div[1]/div/div/div/div[2]/ul/li[2]/div/div[2]")), 1000);
        await driver.sleep(1000)
        await driver.findElement(By.xpath("/html/body/div[1]/div/div/div/div[2]/ul/li[2]/div/div[2]")).click();
        await driver.sleep(1000)
        await driver.findElement(By.css('a[href="/admin/production/phones"]')).click();
        await driver.sleep(1000)   
        await driver.findElement(By.css("button.MuiButtonBase-root.MuiButton-containedPrimary")).click();
        await driver.sleep(1000) 


        const inputFields = await driver.findElements(By.css("input"));
        const selectFields = await driver.findElements(By.css("select"));
        const textAreas = await driver.findElements(By.css("textarea"));
        const buttons = await driver.findElements(By.css("button"));
        console.log("فیلدهای ورودی:");
        for (let input of inputFields) {
            let xpath = await driver.executeScript(
                "function getXPath(element) {" +
                "let idx = 1;" +
                "if (element.id) return `//*[@id='${element.id}']`;" +
                "const tagName = element.tagName.toLowerCase();" +
                "let sibling = element.previousElementSibling;" +
                "while (sibling) {" +
                "if (sibling.tagName === element.tagName) idx++;" +
                "sibling = sibling.previousElementSibling;" +
                "}" +
                "return `//${tagName}[position()=${idx}]`;" +
                "} return getXPath(arguments[0]);", input
            );
            console.log(xpath);
        }

        console.log("\nDropdowns (Select):");
        for (let select of selectFields) {
            let xpath = await driver.executeScript(
                "function getXPath(element) {" +
                "let idx = 1;" +
                "if (element.id) return `//*[@id='${element.id}']`;" +
                "const tagName = element.tagName.toLowerCase();" +
                "let sibling = element.previousElementSibling;" +
                "while (sibling) {" +
                "if (sibling.tagName === element.tagName) idx++;" +
                "sibling = sibling.previousElementSibling;" +
                "}" +
                "return `//${tagName}[position()=${idx}]`;" +
                "} return getXPath(arguments[0]);", select
            );
            console.log(xpath);
        }

        console.log("\nمتن‌ها (Textarea):");
        for (let textArea of textAreas) {
            let xpath = await driver.executeScript(
                "function getXPath(element) {" +
                "let idx = 1;" +
                "if (element.id) return `//*[@id='${element.id}']`;" +
                "const tagName = element.tagName.toLowerCase();" +
                "let sibling = element.previousElementSibling;" +
                "while (sibling) {" +
                "if (sibling.tagName === element.tagName) idx++;" +
                "sibling = sibling.previousElementSibling;" +
                "}" +
                "return `//${tagName}[position()=${idx}]`;" +
                "} return getXPath(arguments[0]);", textArea
            );
            console.log(xpath);
        }

        console.log("\nدکمه‌ها:");
        for (let button of buttons) {
            let xpath = await driver.executeScript(
                "function getXPath(element) {" +
                "let idx = 1;" +
                "if (element.id) return `//*[@id='${element.id}']`;" +
                "const tagName = element.tagName.toLowerCase();" +
                "let sibling = element.previousElementSibling;" +
                "while (sibling) {" +
                "if (sibling.tagName === element.tagName) idx++;" +
                "sibling = sibling.previousElementSibling;" +
                "}" +
                "return `//${tagName}[position()=${idx}]`;" +
                "} return getXPath(arguments[0]);", button
            );
            console.log(xpath);
        }

    } finally {
        await driver.quit();
    }
}

extractXpaths();
