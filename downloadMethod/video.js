// video downloader
const fetch = require("node-fetch");
const fs = require("fs");
/**
 * 
 * @param {String} url 
 * @param {String} referer 
 * @param {String} folderName
 * @param {String} name 
 * @returns {Promise<*>}
 */
module.exports = async function(url, referer, folderName, name) {
    return new Promise( async (resolve, reject) => {
        try {
            const res = await fetch(url, { referer });
            const dest = fs.createWriteStream(`./export/${folderName}/${name}.jpg`);
            res.body.pipe(dest);
            resolve(true);
        } catch(err) {
            reject(err);
        }
    });
}