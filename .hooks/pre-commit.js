const fs = require('fs/promises');
const fsSync = require('fs');
const path = require('path');
const os = require('os');


async function updateDocumentation() {

    const allFiles = await getAllFilesRecursively('.');
    const allMetadata = await getAllFilesMetadata(allFiles);

    function insertScreenshotIfExists(metadata) {
        const screenshotPath = 'docs/' + metadata.filename + '.png';
        if (fsSync.existsSync(screenshotPath)) {
            return `![Screenshot for ${metadata['@name']}](${screenshotPath})`
        }
        return ''
    }

    const documentation = allMetadata.map(metadata => `
# ${metadata['@name']} // version ${metadata['@version']} 

${metadata['@description']}

[${metadata['filename']}](${metadata['relativePath']})

${insertScreenshotIfExists(metadata)}
----
`).join('\n');

    await replaceLivingDocumentationInFile(documentation, "README.md")


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
}

(async function () {
    await bumpVersionOfCommitedFiles();
    await updateDocumentation();
})();

async function bumpVersionOfCommitedFiles() {
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
}