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
    const folderName = readlineSync.question("What is your foldername you want to save?");

    // create a folder if doesn't exist
    if(!fs.existsSync(`./export/${folderName}`))
        fs.mkdirSync(`./export/${folderName}`);

    // scraping and downloading
    switch(indexWebsite) {
        case 0:
            // nekopost.com
            const type = ["comic", "manga", "novel"];
            const indexType = readlineSync.keyInSelect(type, "Which type you want to scrape?");
            const seriesId = readlineSync.question("What is ID of the series?");
            const askEpisodes = "Do you want to scrape all episodes or a specific episode?\nWrite in this format.\nIf you want to scrape all episodes. type -> all\nIf you want to scrape a specific episode. type -> number of that episode EX. 16 for scraping episode 16\nOr type -> range of the episodes EX. 4-23 for scraping episode 4 to episode 23\n"
            const episodes = readlineSync.question(askEpisodes);
            await nekopost(type[indexType], seriesId, episodes, folderName);
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