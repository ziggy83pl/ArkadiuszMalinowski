const fs = require('fs');

const SW_PATH = './sw.js';
const HTML_PATH = './index.html';

try {
    if (fs.existsSync(SW_PATH)) {
        let swData = fs.readFileSync(SW_PATH, 'utf8');
        let swRegex = /(const CACHE_NAME = ')(.*-v)(\d+)(';)/;
        let swMatch = swData.match(swRegex);

        if (swMatch) {
            let currentVer = parseInt(swMatch[3]);
            let newVer = currentVer + 1;
            let newContent = swData.replace(swRegex, `$1$2${newVer}$4`);
            fs.writeFileSync(SW_PATH, newContent);
            console.log(`✅ Zaktualizowano sw.js: v${currentVer} -> v${newVer}`);
        }
    }

    if (fs.existsSync(HTML_PATH)) {
        let htmlData = fs.readFileSync(HTML_PATH, 'utf8');
        let htmlRegex = /(Koparki v\d+\.\d+\.)(\d+)/;
        let htmlMatch = htmlData.match(htmlRegex);

        if (htmlMatch) {
            let currentPatch = parseInt(htmlMatch[2]);
            let newPatch = currentPatch + 1;
            let newHtml = htmlData.replace(htmlRegex, `$1${newPatch}`);
            fs.writeFileSync(HTML_PATH, newHtml);
            console.log(`✅ Zaktualizowano index.html: ...${currentPatch} -> ...${newPatch}`);
        }
    }

} catch (e) {
    console.error("❌ Błąd:", e.message);
}