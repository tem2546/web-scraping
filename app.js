/**
 * 
 *            Web Scraping Project
 *      Web scraping project has 3 steps. These application can scrape dynamic content.
 * 1. Load the page we want to scrap.
 * 2. Get data we want to scrap.
 * 3. Download it to export folder.
 * 
 */
const fs = require("fs");
const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout
});
const puppeteer = require("puppeteer");
const nekopost1 = require("./webHandle/nekopost1.js");
const yuta = require("./webHandle/yuta.js");
// Scraping the page and download it
/**
 * 
 * @param {String} url 
 * @param {String} sel 
 * @returns {Promise<Array<*>>}
 */
function scraping(url, folderName) {
    return new Promise( async (resolve, reject) => {
        try {
            // Launch a browser then create a new page and goto the url wanted to scrape
            const browser = await puppeteer.launch();
            const page = await browser.newPage();

            if(/nekopost/.test(url)) // domain is nekopost.net
                await nekopost1(page, url, folderName);
            else if(/thatjapanesecourse/.test(url)) // domain is thatjapanesecourse.com
                await yuta(page, url, folderName);

            await browser.close();
            resolve(true);
        } catch(err) {
            reject(err);
        }
    });
}

// Receieved data from user
readline.question("What URL you want to scrape?", (url) => {
    readline.question("What is your foldername you want to save?", async (folderName) => {
        // create a folder if doesn't have
        if(!fs.existsSync(`./export/${folderName}`))
            fs.mkdirSync(`./export/${folderName}`);

        // scraping and downloading
        await scraping(url, folderName);
        console.log("Complete.");

        readline.close();
    });
});