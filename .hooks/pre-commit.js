const fs = require('fs/promises');
const fsSync = require('fs');
const path = require('path');
const os = require('os');
const exec = require('child_process').exec;

main();

async function main() {
    await bumpVersionOfStagedFiles();
    await updateDocumentation();
    await updateDownloadAndUpdateUrlsLinks();
}
async function updateDocumentation() {

    const allFiles = await getAllFilesRecursively('.');
    const allMetadata = await getAllFilesMetadata(allFiles);

    const newDocumentationSection = getNewDocumentationSection(allMetadata);

    await replaceLivingDocumentationInFile(newDocumentationSection, "README.md")


    exec('git add README.md',
        function (error, stdout, stderr) {
            if (stdout) {
                console.log('stdout: ' + stdout);
            }
            if (stderr) {
                console.error('stderr: ' + stderr);
            }
            if (error !== null) {
                console.log('exec error: ' + error);
            }
        });


    async function getAllFilesRecursively(dir, fileList = []) {
        const files = await fs.readdir(dir);

        for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = await fs.stat(filePath);

            if (stat.isDirectory()) {
                await getAllFilesRecursively(filePath, fileList);
            } else if (stat.isFile()) {
                fileList.push(filePath);
            }
        }

        return fileList;
    }

    async function getAllFilesMetadata(allFiles) {
        const jsFiles = allFiles.filter(file => file.match(/.*\.js/));

        const metadata = []
        for (let file of jsFiles) {
            const fileContent = (await fs.readFile(file)).toString();
            if (!fileContent.startsWith("// ==UserScript==")) {
                continue;
            }
            const tamperMonkeyMetadata = fileContent.split('\n').filter(line => line.startsWith("// @")).map(line => line.split(' ')).reduce((metadata, [_, metadataName, ...value]) => ({[metadataName]: value.filter(v => v).join(' '), ...metadata}), {});
            metadata.push({...tamperMonkeyMetadata, filename: path.basename(file), relativePath: file})
        }
        return metadata;
    }

    async function replaceLivingDocumentationInFile(content, readMeFile) {
        if (!fsSync.existsSync(readMeFile)) {
            throw new Error(readMeFile + " does not exists");
        }
        const readMeFileContent = (await fs.readFile(readMeFile)).toString();

        const existingLivingDocumentationSection = /<!-- start-living-doc -->((.|\n)*)<!-- end-living-doc -->/gm;
        const newLivingDocumentationSection = `<!-- start-living-doc -->\n${content}\n<!-- end-living-doc -->`;

        if (readMeFileContent.match(existingLivingDocumentationSection)) {
            await fs.writeFile(readMeFile, readMeFileContent.replace(existingLivingDocumentationSection, newLivingDocumentationSection));
        } else {
            throw new Error("Couldn't find location for living documentation ie: <!-- start-living-doc --><!-- end-living-doc --> tags")
        }
    }

    function insertScreenshotIfExists(metadata) {
        const screenshotPath = 'docs/' + metadata.filename + '.png';
        if (fsSync.existsSync(screenshotPath)) {
            return `![Screenshot for ${metadata['@name']}](${screenshotPath})`
        }
        return ''
    }

    function getNewDocumentationSection(allMetadata) {
        return allMetadata.map(metadata => `
## ${metadata['@name']} // version ${metadata['@version']} 

${metadata['@description']}

[${metadata['filename']}](${metadata['relativePath']})

${insertScreenshotIfExists(metadata)}
----
`).join('\n');
    }

}

async function bumpVersionOfStagedFiles() {
    for (let file of process.argv.slice(2)) {
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
}

async function updateDownloadAndUpdateUrlsLinks() {
    for (let file of process.argv.slice(2)) {
        if (fsSync.existsSync(file)) {
            console.log(file);
            let fileContent = (await fs.readFile(file)).toString();

            if (!fileContent.startsWith("// ==UserScript==")) {
                // ignore non-tampermonkey-script files
                continue;
            }

            const updateUrl = new RegExp("// @updateURL.*").exec(fileContent);
            const downloadUrl = new RegExp("// @downloadURL.*").exec(fileContent);

            if (updateUrl && updateUrl[0]) {
                const existingUpdateUrl = updateUrl[0];
                const newUpdateUrl = `// @updateURL    https://raw.githubusercontent.com/florianpasteur/tampermonkey-extensions/main/${file}`;

                fileContent = fileContent.replace(existingUpdateUrl, newUpdateUrl);

                await fs.writeFile(file, fileContent)

                // Not a debug line, used to stage after in the hook
                console.log(file)
            }

            if (downloadUrl && downloadUrl[0]) {
                const existingDownloadUrl = downloadUrl[0];
                const newDownloadUrl = `// @downloadURL  https://raw.githubusercontent.com/florianpasteur/tampermonkey-extensions/main/${file}`;

                fileContent = fileContent.replace(existingDownloadUrl, newDownloadUrl);

                await fs.writeFile(file, fileContent)

                // Not a debug line, used to stage after in the hook
                console.log(file)
            }
        }
    }
}