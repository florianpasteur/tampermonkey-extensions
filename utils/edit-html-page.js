// ==UserScript==
// @name         Edit page
// @namespace    https://github.com/florianpasteur/tampermonkey-extensions
// @version      0.7
// @supportURL   https://github.com/florianpasteur/tampermonkey-extensions/issues
// @description  Make entire page editable, useful to change data before taking screenshot
// @author       Florian Pasteur
// @match        *
// @run-at       context-menu
// @icon         https://www.google.com/s2/favicons?sz=64&domain=js.org
// @grant        none
// ==/UserScript==

(function () {
    document.body.setAttribute("contenteditable", "enable")
})();

