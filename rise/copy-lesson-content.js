// ==UserScript==
// @name         Rise Content Downloader
// @namespace    https://github.com/florianpasteur/tampermonkey-extensions
// @version      0.2
// @description  Download rise course content as markdown files
// @author       Florian Pasteur
// @match        https://*.articulate.com/preview/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=articulate.com
// @run-at       context-menu
// @require      https://cdnjs.cloudflare.com/ajax/libs/axios/1.5.1/axios.min.js
// @require      https://cdn.jsdelivr.net/npm/marked/marked.min.js
// @require      https://unpkg.com/turndown/dist/turndown.js
// @require      https://raw.githubusercontent.com/eligrey/FileSaver.js/master/dist/FileSaver.min.js
// @grant none
// ==/UserScript==

const turndownService = new TurndownService();

(async function () {
    'use strict';

    const types = new Set();

    const courseId = window.location.href.replace(window.location.hash, '').split('/').pop();
    const courseData = await getCourseData(courseId);

    for (let lesson of courseData.course.lessons.slice(1)) {
        for (let item of lesson.items) {
            types.add(
                `${item.items.length}`,
            );

            console.log(getItemKey(item), itemToMarkdown(item));
        }
    }

    console.log(Array.from(types));


    async function getCourseData(lessonId) {
        const rawContent = (await axios.get('https://rise.articulate.com/api/rise-runtime/boot/' + lessonId)).data;
        return JSON.parse(atob(rawContent));
    }
})();

function itemToMarkdown(item) {
    if (item.items.length > 1) {
        throw new Error('Item has length > 1')
    }
    const content = item.items[0];
    const itemKey = getItemKey(item);
    switch (itemKey) {
        case "divider continue continue":
            return "";
        case "divider divider divider":
            return "----";
        case "image image hero":
            return content;
        case "interactive interactive accordion":
            return content;
        case "multimedia multimedia attachment":
            return content;
        case "multimedia multimedia embed":
            return content;
        case "text impact a":
            return content;
        case "text impact b":
            return content;
        case "text impact c":
            return content;
        case "text impact d":
            return content;
        case "text impact note":
            return content;
        case "text text heading":
            return "# " + turndownService.turndown(content.heading);
        case "text text subheading":
            return "## " + turndownService.turndown(content.heading);
        case "text text heading paragraph":
            return "# " + turndownService.turndown(content.heading) + "\n" + turndownService.turndown(content.paragraph);
        case "text text paragraph":
            return turndownService.turndown(content.paragraph);
        case "text text subheading paragraph":
            return content;

        default:
            throw new Error('Do not know this element: ' + itemKey)

    }
}

function getItemKey(item) {
    return `${item.type || "no_type"} ${item.family || "no_family"} ${item.variant || "no_variant"}`
}