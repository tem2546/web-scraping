const fs = require("fs");
const fetch = require("node-fetch");

/**
 * 
 * @param {Object} chapterData 
 * @param {String} chapterFolder 
 * @returns {Promise<Boolean|String>}
 */
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
                    // Some images have stored title in a different place
                    img["title"] = img["title"] ? img["title"] : img["fileName"];
                    
                    const res = await fetch(img["pageName"]);
                    const dest = fs.createWriteStream(`${chapterFolder}/${img["title"]}`);
                    res.body.pipe(dest);

                    resolve(true);
                } catch(err) {
                    reject(err);
                }
            })
            resolve(true);
        } catch(err) {
            reject(err);
        }
    });
}

/**
 * 
 * @param {Object} chapterData 
 * @param {String} chapterFolder 
 * @returns {Promise<Boolean|String>}
 */
function novelType(chapterData, projectFolder) {
    return new Promise( async (resolve, reject) => {
        try {
            // Some chapters have stored novel content in a different place
            if(!chapterData["novelContent"])
                chapterData["novelContent"] = chapterData["pageText"];
            
            // Add some head, body and change font color
            const chapterText = `
            <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width,initial-scale=1">
            <base href="https://www.nekopost.net">
            </head>
            <body>` + String(chapterData["novelContent"]).replaceAll("color:#b7b7b7;", "color:#000000;") + `</body>`;

            // Save novel as a HTML file
            fs.writeFileSync(`${projectFolder}/${chapterData["chapterNo"]}.html`, chapterText);

            resolve(true);
        } catch(err) {
            reject(err);
        }
    });
}

/**
 * 
 * @param {String} id
 * @returns {Promise<Boolean|String>}
 */
module.exports = function(id) {
    // Scraping the page and download it
    return new Promise( async (resolve, reject) => {
        try {
            // Get project data
            let projectData = await fetch("https://uatapi.nekopost.net/frontAPI/getProjectInfo/" + id);
            projectData = await projectData.json();
            const projectInfo = projectData["projectInfo"], listChapter = projectData["listChapter"];
            // project type
            // m = manga
            // n = novel
            // d = orihinal comic
            // f = original novel
            const projectType = projectInfo["projectType"];

            // ProjectFolder handle
            const projectFolder = "./export/" + projectInfo["projectName"];
            if(!fs.existsSync(projectFolder))
                fs.mkdirSync(projectFolder);

            for(const chapter of listChapter) {
                // ChapterFolder handle
                const chapterFolder = projectFolder + "/" + chapter["chapterNo"] + " - " + chapter["chapterName"];
                // Only type manga to create more folder because it has many images.
                if(( projectType == "m" || projectType == "d" ) && !fs.existsSync(chapterFolder))
                    fs.mkdirSync(chapterFolder);

                // Get chapter data
                const fetchUrl = "https://fs.nekopost.net/collectManga/" 
                    + projectInfo["projectId"] 
                    + "/"
                    + chapter["chapterId"] 
                    + "/"
                    + projectInfo["projectId"] + "_" + chapter["chapterId"]
                    + ".json";
                let chapterData = await fetch(fetchUrl);
                chapterData = await chapterData.json();

                switch(projectType) {
                    case "m":
                    case "d":
                        await mangaType(chapterData, chapterFolder);
                        break;
                    case "n":
                    case "f":
                        await novelType(chapterData, projectFolder);
                        break;
                }
            }
            resolve(true);
        } catch(err) {
            reject(err);
        }
    });
}