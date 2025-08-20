const { By, until } = require("selenium-webdriver");

class selectorHelper {
    constructor(driver) {
        this.driver = driver;
    }

    // کلیک روی دکمه با عنوان دقیق
    async SelectByTitle(title) {
        const btn = await this.driver.wait(
            until.elementLocated(By.xpath(`//button[contains(@class, "ant-btn") and span[text()="${title}"]]`)),
            5000
        );
        await btn.click();
    }

    // کلیک روی دکمه یا گزینه‌ای که title آن شامل متن مورد نظر باشد
    async SelectByContainsTitle(title) {
        const btn = await this.driver.wait(
            until.elementLocated(By.xpath(`//*[contains(@title, "${title}")]`)),
            5000
        );
        await btn.click();
    }

    // کلیک روی المنتی که متنش شامل مقدار خاصی باشد
    async ClickByText(tag, text) {
        const el = await this.driver.wait(
            until.elementLocated(By.xpath(`//${tag}[contains(text(),"${text}")]`)),
            5000
        );
        await el.click();
    }

    // کلیک روی اولین گزینه لیست با کلاس خاص
    async ClickFirstByClass(className) {
        const els = await this.driver.wait(
            until.elementsLocated(By.css(`.${className}`)),
            5000
        );
        if (els.length > 0) await els[0].click();
    }

    // کلیک روی گزینه با index مشخص
    async ClickByClassAndIndex(className, idx) {
        const els = await this.driver.wait(
            until.elementsLocated(By.css(`.${className}`)),
            5000
        );
        if (els.length > idx) await els[idx].click();
    }

    // صبر تا المنتی با عنوان خاص ظاهر شود
    async WaitForTitle(title) {
        await this.driver.wait(
            until.elementLocated(By.xpath(`//*[contains(@title, "${title}")]`)),
            5000
        );
    }
}

module.exports = selectorHelper;
