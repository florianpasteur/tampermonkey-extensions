const fs = require('fs/promises');
const fsSync = require('fs');
const path = require('path');
const os = require('os');

(async function () {

    for (let file of process.argv) {
        if (fsSync.existsSync(file)) {
            let content = (await fs.readFile(file)).toString();

            let versions = new RegExp("^// @version +(\d\.)+").exec(content);

            console.log(versions);

            if (versions) {

            }

        }
    }

})();