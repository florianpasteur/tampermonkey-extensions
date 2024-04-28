// ==UserScript==
// @name         Download videos
// @namespace    https://github.com/florianpasteur/tampermonkey-extensions
// @version      0.2
// @supportURL   https://github.com/florianpasteur/tampermonkey-extensions/issues
// @updateURL    https://raw.githubusercontent.com/florianpasteur/tampermonkey-extensions/main/utils/download-videos.js
// @downloadURL  https://raw.githubusercontent.com/florianpasteur/tampermonkey-extensions/main/utils/download-videos.js
// @description  Find and open videos from a page to new tabs
// @author       Florian Pasteur
// @match        *
// @match        *://*/*
// @run-at       context-menu
// @icon         https://www.google.com/s2/favicons?sz=64&domain=js.org
// @grant        none
// ==/UserScript==

(function () {
    document.querySelectorAll('*').forEach(e => {
        if (e.tagName === "VIDEO") {
            window.open(e.src, "_blank")
        }
    })
})();

