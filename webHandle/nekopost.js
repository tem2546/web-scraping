// Scroll down untill the end
// Load all src of img elements
const fs = require("fs");
const puppeteer = require("puppeteer");
const imgDownloader = require("../downloadMethod/img.js");
/**
 * 
 * @param {String} type
 * @param {String} id
 * @param {String} folderName
 * @returns {Promise<Boolean|String>}
 */
module.exports = function(type, id, folderName) {
    // Scraping the page and download it
    return new Promise( async (resolve,reject) => {
        try {
            // Launch a browser then create a new page and goto the url wanted to scrape
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            const seriesUrl = "https://www.nekopost.net/" + type + "/" + id;

            // goto url
            await page.goto(seriesUrl, { waitUntil: "networkidle2" });

            //fs.writeFileSync(`./export/${folderName}/data.html`,await page.content());
            const links = await page.$$eval(".card a", (elements) => {
                return elements.map( (element) => element.href );
            });
            console.log(links);
            // // Scroll down untill the end
            // for(var i=0;i<30;i++)
            //     await page.mouse.wheel( { deltaY: 1000 } );
            // await page.waitForTimeout(1000);
            // console.log("Page loaded.");
        
            // // Get all src of img element
            // const srcs = await page.$$eval("img", (elements) => {
            //     return elements.map( (element) => element.getAttribute("src") );
            // });
            // console.log("Received all src.");

            // // downloading src
            // var name = 1;
            // for(src of srcs) {
            //     await imgDownloader(src, url, folderName, name);
            //     name += 1;
            // }
            // console.log("Done downloading.");
            browser.close();
        
            resolve(true);
        } catch(err) {
            reject(err);
        }
    });
}