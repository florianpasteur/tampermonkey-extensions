const fs = require('fs/promises');
const fsSync = require('fs');
const path = require('path');
const os = require('os');

(async function () {

    for (let file of process.argv) {
        if (fsSync.existsSync(file)) {
            let fileContent = (await fs.readFile(file)).toString();

            let versionResult = new RegExp("// @version +(\\d+\\.)?(\\d+\\.)?(\\*|\\d+)").exec(fileContent);

            if (versionResult && versionResult[0]) {
                const currentVersionLine = versionResult[0];
                const currentVersion = currentVersionLine.split(' ').pop();
                const numbers = currentVersion
                    .split('.')
                    .reverse()
                    .map(e => parseInt(e));

                numbers[0]++;

                const newVersion = numbers.reverse().join('.');

                const newVersionLine = currentVersionLine.replace(currentVersion, newVersion);

                const updatedVersion = fileContent.replace(currentVersionLine, newVersionLine);

                await fs.writeFile(file, updatedVersion)

                // Not a debug line, used to stage after in the hook
                console.log(file)
            }
        }
    }

})();