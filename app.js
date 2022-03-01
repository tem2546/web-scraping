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
const readlineSync = require("readline-sync")
const nekopost = require("./webHandle/nekopost.js");
const yuta = require("./webHandle/yuta.js");

(async () => {
    // Receieved data from user
    const website = ["Nekopost", "Thatjapanesecourse", "Youtube"];
    const indexWebsite = readlineSync.keyInSelect(website, "What website you want to scrape?");
    // const folderName = readlineSync.question("What is your foldername you want to save?");

    // // create a folder if doesn't exist
    // if(!fs.existsSync(`./export/${folderName}`))
    //     fs.mkdirSync(`./export/${folderName}`);

    // scraping and downloading
    switch(indexWebsite) {
        case 0:
            // nekopost.com
            const type = ["comic", "manga", "novel"];
            const indexType = readlineSync.keyInSelect(type, "Which type you want to scrape?");
            const seriesId = readlineSync.question("What is ID of the series?");
            await nekopost(type[indexType], seriesId);
            break;
        case 1:
            // thatjapanesecourse.com
            console.log("This will scrape all of the video in thatjapanesecourse.com");
            break;
        case 2:
            // youtube.com
            break;
    }
    console.log("Complete.");
})()