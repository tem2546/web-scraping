// Find first 2 HTTP request that has name "?range="
// extract .mp4 of both audio and video
const puppeteer = require("puppeteer");
const fs =  require("fs");
const videoDownloader = require("../downloadMethod/video.js");
/**
 * 
 * @param {puppeteer.Page} page 
 * @param {String} url
 * @param {String} folderName
 * @returns {Promise<*>}
 */
module.exports = function(page, url, folderName) {
    return new Promise( async (resolve, reject) => {
        
        try {
            // login and save cookies
            // await page.goto("https://thatjapanesecourse.com/wp-login.php", { waitUntil: "networkidle2" } );
            // await page.type("#user_login", "hibiki");
            // await page.type("#user_pass", "saoandtem1");
            // await page.click("input[type=submit]");
            // await page.waitForNavigation();
            // cookies = { "cookies": await page.cookies() };
            // fs.writeFileSync("./cookies/yuta.json", JSON.stringify(cookies));

            // Load and set cookies
            const cookies = JSON.parse(await fs.readFileSync("./cookies/yuta.json"))["cookies"];
            await page.setCookie(...cookies);
            
            // Go to url
            await page.goto(url, { waitUntil: "networkidle2" });

            // get video player
            await fs.writeFileSync("./export/test/content4.html",await page.content());
            const src = await page.$eval("iframe", (element) => {
                return element.getAttribute("src");
            });

            // go to video player and click play button
            await page.goto(src, { waitUntil: "networkidle2" });

            // on respone of request we sent for a video
            var audio_already = 0, video_already = 0;
            page.on("response", (res) => {
                if(audio_already&&video_already) resolve(true);    
                // console.log(res.url());
                const res_link = res.url(); 
                const audio = res_link.match(/https.*audio.*\.mp4/);
                const video = res_link.match(/https.*video.*\.mp4/);
                if(audio) {
                    audio_already = 1;
                    console.log(audio[0]);
                    videoDownloader(audio[0], src, folderName, );
                } else if(video) {
                    video_already = 1;
                    console.log(video[0]);
                    videoDownloader(audio[0], src, folderName, );
                }
            });

            await page.click("button.play");
            await page.waitForTimeout(3000);

            resolve(true);
        } catch(err) {
            reject(err);
        }
    });
}