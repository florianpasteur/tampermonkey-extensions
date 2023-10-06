const fs = require('fs/promises');
const fsSync = require('fs');
const path = require('path');
const os = require('os');

// WIP

(async function () {

    for (let file of process.argv) {
        if (fsSync.existsSync(file)) {
            let content = (await fs.readFile(file)).toString();

            let versionResult = new RegExp("// @version +(\\d+\\.)?(\\d+\\.)?(\\*|\\d+)").exec(content);

            console.log(versionResult);

            if (versionResult && versionResult[0]) {
                let version = versionResult[0].split(' ').pop();
                console.log(version);
                let numbers = new RegExp("(\\d+)").exec(version);

                console.log(numbers);

            }

        }
    }

})();