// ==UserScript==
// @name         Download as markdown
// @namespace    https://github.com/florianpasteur/tampermonkey-extensions
// @version      0.2
// @supportURL   https://github.com/florianpasteur/tampermonkey-extensions/issues
// @updateURL    https://raw.githubusercontent.com/florianpasteur/tampermonkey-extensions/main/utils/download-as-markdown.js
// @downloadURL  https://raw.githubusercontent.com/florianpasteur/tampermonkey-extensions/main/utils/download-as-markdown.js
// @description  Download an HTML content as markdown
// @author       Florian Pasteur
// @match        *
// @grant        none
// @run-at       context-menu
// @icon         https://www.google.com/s2/favicons?sz=64&domain=js.org
// @require      https://unpkg.com/turndown/dist/turndown.js
// ==/UserScript==

(function () {

    const selector = prompt("What's your HTML element? (provide selector)", "body");

    const matchingElement = Array.from(document.querySelectorAll(selector)).length

    if (matchingElement !== 1) {
        alert(`Found ${matchingElement} elements, please provide a more precise selector`);
        return;
    }

    const turndownService = new TurndownService();
    const markdown = turndownService.turndown(document.querySelector(selector));
    console.log(markdown);


})();

