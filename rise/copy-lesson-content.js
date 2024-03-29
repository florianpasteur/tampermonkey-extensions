// ==UserScript==
// @name         Rise Content Downloader
// @namespace    https://github.com/florianpasteur/tampermonkey-extensions
// @version      0.18
// @supportURL   https://github.com/florianpasteur/tampermonkey-extensions/issues
// @updateURL    https://raw.githubusercontent.com/florianpasteur/tampermonkey-extensions/main/rise/copy-lesson-content.js
// @downloadURL  https://raw.githubusercontent.com/florianpasteur/tampermonkey-extensions/main/rise/copy-lesson-content.js
// @description  [WIP] Download rise course content as markdown files
// @author       Florian Pasteur
// @match        https://*.articulate.com/preview/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=articulate.com
// @run-at       context-menu
// @require      https://cdnjs.cloudflare.com/ajax/libs/axios/1.5.1/axios.min.js
// @require      https://cdn.jsdelivr.net/npm/marked/marked.min.js
// @require      https://unpkg.com/turndown/dist/turndown.js
// @require      https://raw.githubusercontent.com/eligrey/FileSaver.js/master/dist/FileSaver.min.js
// @grant        GM_setClipboard
// ==/UserScript==

const turndownService = new TurndownService();

(async function () {
    'use strict';

    const courseId = window.location.href.replace(window.location.hash, '').split('/').pop();
    const courseData = await getCourseData(courseId);

    let markdown = ''

    for (let lesson of courseData.course.lessons) {
        markdown += `<!-- start: ${lesson.title} -->\n`
        for (let item of lesson.items) {
            markdown += itemToMarkdown(item) + '\n'
            // console.log(getItemKey(item), itemToMarkdown(item));
        }
        markdown += `<!-- end: ${lesson.title} -->\n`
    }



    GM_setClipboard(markdown);



    async function getCourseData(lessonId) {
        const rawContent = (await axios.get('https://rise.articulate.com/api/rise-runtime/boot/' + lessonId)).data;
        return JSON.parse(atob(rawContent));
    }
})();

function itemToMarkdown(item) {
    if (!item.items) {
        return JSON.stringify(item)
    }
    if (item.items.length > 1) {
        console.error(item.items);
        // throw new Error('Item has length > 1')
    }
    const content = item.items[0];
    const itemKey = getItemKey(item);
    switch (itemKey) {
        case "divider continue continue":
            return "";
        case "divider divider divider":
            return "----";
        case "image image hero":
            return `![${content.media.image.originalUrl}](${content.media.image.key})`;
        case "image image text aside":
            return  `![${content.media.image.originalUrl}](${content.media.image.key} "float-right")\n\n${turndownService.turndown(content.paragraph)}`;
        case "interactive interactive accordion":
            return `<details>\n<summary>${content.title}</summary>\n\n${content.description}</details>`;
        case "multimedia multimedia attachment":
            return `[${content.media.attachment.originalUrl}](${content.media.attachment.key} "download")`;
        case "multimedia multimedia embed":
                return `[video](${readWistiaUrl(content.media.embed.src)} "video"]`;
        case "text impact a":
            return `###${turndownService.turndown(content.heading)}`;
        case "text impact b":
            return `####${turndownService.turndown(content.heading)}`;
        case "text impact c":
            return `#####${turndownService.turndown(content.heading)}`;
        case "text impact d":
            return `######${turndownService.turndown(content.heading)}`;
        case "text impact note":
            return turndownService.turndown(content.paragraph).split('\n').map(line => `> ${line}`).join('\n');
        case "text text heading":
            return `# ${turndownService.turndown(content.heading)}`;
        case "text text subheading":
            return `## ${turndownService.turndown(content.heading)}`;
        case "text text heading paragraph":
            return `# ${turndownService.turndown(content.heading)}\n\n${turndownService.turndown(content.paragraph)}`;
        case "text text paragraph":
            return turndownService.turndown(content.paragraph);
        case "text text subheading paragraph":
            return `## ${turndownService.turndown(content.heading)}\n\n${turndownService.turndown(content.paragraph)}`;

        default:
            throw new Error('Do not know this element: ' + itemKey)

    }
}

function getItemKey(item) {
    return `${item.type || "no_type"} ${item.family || "no_family"} ${item.variant || "no_variant"}`
}

function readWistiaUrl(src) {
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(src, 'text/html');
    return htmlDoc.querySelector('iframe').src;
}