const fs = require("fs");
const fetch = require("node-fetch");
const imgDownloader = require("../downloadMethod/img.js");
function mangaType(chapterData, chapterFolder)
{
    return new Promise( async (resolve, reject) => {
        try {
            // Transform img link
            const imgLinks = (function (e) {
                    let t = [],
                    n = e[0].pageName;
                    for (let o = 0; o < e.length; o++) {
                        let a = "https://fs.nekopost.net/collectManga/" 
                            + chapterData["projectId"] 
                            + "/" 
                            + chapterData["chapterId"] 
                            + "/";
                        (a += void 0 === n ? e[o].fileName : e[o].pageName),
                            (e[o].pageName = a),
                            t.push(e[o]);
                    }
                    return t;
                })(chapterData["pageItem"]); 
        
            // Download img
            imgLinks.forEach( async (img) => {
                try {
                    img["title"] = img["title"] ? img["title"] : img["fileName"];
                    
                    await imgDownloader(img["pageName"], "https://www.nekopost.net", chapterFolder, img["title"]);
                    resolve(true);
                } catch(err) {
                    reject(err);
                }
            })
            resolve(true);
        } catch(err) {
            reject(err);
        }
    })
}
/**
 * 
 * @param {String} type
 * @param {String} id
 * @param {String} folderName
 * @returns {Promise<Boolean|String>}
 */
module.exports = function(type, id) {
    // Scraping the page and download it
    return new Promise( async (resolve, reject) => {
        try {
            // get project data
            let projectData = await fetch("https://uatapi.nekopost.net/frontAPI/getProjectInfo/" + id);
            projectData = await projectData.json();
            const projectInfo = projectData["projectInfo"], listChapter = projectData["listChapter"];

            // projectFolder handle
            const projectFolder = "./export/" + projectInfo["projectName"];
            if(!fs.existsSync(projectFolder))
                fs.mkdirSync(projectFolder);

            for(const chapter of listChapter) {
                // folder handle
                const chapterFolder = projectFolder + "/" + chapter["chapterNo"] + " - " + chapter["chapterName"];
                if(!fs.existsSync(chapterFolder))
                    fs.mkdirSync(chapterFolder);

                // get chapter data
                const fetchUrl = "https://fs.nekopost.net/collectManga/" 
                    + projectInfo["projectId"] 
                    + "/"
                    + chapter["chapterId"] 
                    + "/"
                    + projectInfo["projectId"] + "_" + chapter["chapterId"]
                    + ".json";
                let chapterData = await fetch(fetchUrl);
                chapterData = await chapterData.json();

                switch(type) {
                    case "manga":
                        await mangaType(chapterData, chapterFolder);
                        break;
                    case "novel":
                        break;
                    case "comic":
                        break;
                }
            }
            resolve(true);
        } catch(err) {
            reject(err);
        }
    });
}