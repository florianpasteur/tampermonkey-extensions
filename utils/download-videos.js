// ==UserScript==
// @name         Download videos
// @namespace    https://github.com/florianpasteur/tampermonkey-extensions
// @version      0.3
// @supportURL   https://github.com/florianpasteur/tampermonkey-extensions/issues
// @updateURL    https://raw.githubusercontent.com/florianpasteur/tampermonkey-extensions/main/utils/download-videos.js
// @downloadURL  https://raw.githubusercontent.com/florianpasteur/tampermonkey-extensions/main/utils/download-videos.js
// @description  Find and open videos from a page to new tabs
// @author       Florian Pasteur
// @match        *
// @grant        GM_registerMenuCommand
// @icon         https://www.google.com/s2/favicons?sz=64&domain=js.org
// ==/UserScript==

(function () {

    debugger

    setInterval(() => {
        for (let contextmenu of window.getEventListeners(document).contextmenu) {
            document.removeEventListener('contextmenu', contextmenu.listener)
            console.log("Context menu listener removed");
        }
    }, 500)


    function downloadAll() {
        document.querySelectorAll('*').forEach(e => {
            if (e.tagName === "VIDEO") {
                window.open(e.src, "_blank")
                console.log("Open video", e.src);
            }
        })
    }

    GM_registerMenuCommand("Download all videos", downloadAll);


})();

