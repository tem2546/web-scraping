// Scroll down untill the end
// Load all src of img elements
const puppeteer = require("puppeteer");
const imgDownloader = require("../downloadMethod/img.js");
/**
 * 
 * @param {puppeteer.Page} page 
 * @param {String} sel
 * @param {String} url
 * @param {String} folderName
 * @returns {Promise<Array<*>>}
 */
module.exports = function(page, url, folderName) {
    return new Promise( async (resolve,reject) => {
        try {
            // goto url
            await page.goto(url, { waitUntil: "networkidle2" });

            // Scroll down untill the end
            for(var i=0;i<30;i++)
                await page.mouse.wheel( { deltaY: 1000 } );
            await page.waitForTimeout(1000);
            console.log("Page loaded.");
        
            // Get all src of img element
            const srcs = await page.$$eval("img", (elements) => {
                return elements.map( (element) => element.getAttribute("src") );
            });
            console.log("Received all src.");

            // downloading src
            var name = 1;
            for(src of srcs) {
                await imgDownloader(src, url, folderName, name);
                name += 1;
            }
            console.log("Done downloading.");
        
            resolve(true);
        } catch(err) {
            reject(err);
        }
    });
}