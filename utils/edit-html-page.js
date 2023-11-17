// ==UserScript==
// @name         Edit page
// @namespace    https://github.com/florianpasteur/tampermonkey-extensions
// @version      0.8
// @supportURL   https://github.com/florianpasteur/tampermonkey-extensions/issues
// @description  Make entire page editable, useful to change data before taking screenshot
// @author       Florian Pasteur
// @match        *
// @match        *://*/*
// @run-at       context-menu
// @icon         https://www.google.com/s2/favicons?sz=64&domain=js.org
// @grant        none
// ==/UserScript==

(function () {
    document.querySelectorAll('*').forEach(e => {
        e.setAttribute("contenteditable", "true")
    })
})();

