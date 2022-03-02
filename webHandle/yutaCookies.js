// Login thatjapanesecourse.com and save the cookies
const puppeteer = require("puppeteer");
const fs = require("fs");
require('dotenv').config()

module.exports = function() {
    return new Promise( (resolve, reject) => {
        try {
            // open browser and page
            const browser = await puppeteer.launch();
            const page = await browser.newPage();

            // login and save cookies
            await page.goto("https://thatjapanesecourse.com/wp-login.php", { waitUntil: "networkidle2" } );
            await page.type("#user_login", process.env.USER);
            await page.type("#user_pass", process.env.PASS);
            await page.click("input[type=submit]");
            await page.waitForNavigation();
            cookies = { "cookies": await page.cookies() };
            fs.writeFileSync("./cookies/yuta.json", JSON.stringify(cookies));

            resolve(true);
        } catch(err) {
            reject(err);
        }
    });
}