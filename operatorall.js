const { Builder, By, until } = require("selenium-webdriver");
const fs = require("fs");
const path = require("path");

const colors = {
    red: "\x1b[31m",
    green: "\x1b[32m",
    reset: "\x1b[0m",
};

function generateNationalId() {
    const list = [];
    let sum = 0;

    for (let i = 10; i > 1; i--) {
        const randomDigit = Math.floor(Math.random() * 10);
        list.push(randomDigit);
        sum += randomDigit * i;
    }

    const remainder = sum % 11;
    const checkDigit = remainder < 2 ? remainder : 11 - remainder;

    list.push(checkDigit);
    return list.join('');
}

async function login(driver) {
    await driver.get("https://dev-promans.tabatelecom.dev/auth/login");
    const loginpath = "/html/body/div[1]/div[1]/form/div";
    await driver.findElement(By.xpath(`${loginpath}/div[2]/div/div/input`)).sendKeys("Admin");
    await driver.findElement(By.xpath(`${loginpath}/div[3]/div/div/input`)).sendKeys("123456Aa@");
    await driver.findElement(By.xpath("//button[text()='ورود']")).click();
    await driver.wait(until.titleIs("پنل مدیریت نوکیا"), 10000);
    console.log(`${colors.green}Login successful!${colors.reset}`);
}

async function createOperator(driver) {
    await driver.wait(until.elementLocated(By.css('a[href="/admin/production/operators"]')), 10000);
    await driver.findElement(By.css('a[href="/admin/production/operators"]')).click();
    await driver.wait(until.elementLocated(By.xpath("//button[text()='ایجاد اپراتور']")), 10000);
    await driver.findElement(By.xpath("//button[text()='ایجاد اپراتور']")).click();

    const randomNumber = Array.from({ length: 7 }, () => Math.floor(Math.random() * 10)).join('');
    const nationalId = generateNationalId();

    await driver.findElement(By.name("firstname")).sendKeys("John");
    await driver.findElement(By.name("lastname")).sendKeys("Doe");
    await driver.findElement(By.name("nationalId")).sendKeys(nationalId);
    await driver.findElement(By.name("personalId")).sendKeys("12345");
    await driver.findElement(By.name("mobile")).sendKeys("0930" + randomNumber);

    await driver.findElement(By.xpath('//*[@type="submit"]')).click();
    console.log(`${colors.green}Operator created successfully!${colors.reset}`);
}

async function editOperator(driver) {
    await driver.wait(until.elementLocated(By.xpath("//table/tbody/tr[1]//button[text()='ویرایش']")), 10000);
    await driver.findElement(By.xpath("//table/tbody/tr[1]//button[text()='ویرایش']")).click();

    await driver.findElement(By.name("firstname")).clear();
    await driver.findElement(By.name("firstname")).sendKeys("EditedName");
    await driver.findElement(By.xpath('//*[@type="submit"]')).click();

    console.log(`${colors.green}Operator edited successfully!${colors.reset}`);
}

async function deleteOperator(driver) {
    await driver.wait(until.elementLocated(By.xpath("//table/tbody/tr[1]//button[text()='حذف']")), 10000);
    await driver.findElement(By.xpath("//table/tbody/tr[1]//button[text()='حذف']")).click();
    await driver.wait(until.elementLocated(By.xpath("//button[text()='تایید']")), 5000);
    await driver.findElement(By.xpath("//button[text()='تایید']")).click();

    console.log(`${colors.green}Operator deleted successfully!${colors.reset}`);
}

async function operatorall() {
    let driver = await new Builder().forBrowser("chrome").build();
    try {
        await login(driver);
        await createOperator(driver);
        await editOperator(driver);
        await deleteOperator(driver);
    } catch (error) {
        console.error(`${colors.red}Error occurred:${colors.reset}`, error);
    } finally {
        await driver.quit();
    }
}

// فراخوانی توابع
operatorall();

exports.operatorall = operatorall;
