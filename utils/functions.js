// ==UserScript==
// @name         Functions utils
// @namespace    https://github.com/florianpasteur/tampermonkey-extensions
// @version      0.3
// @description  A collection of utils function to be used in the terminal or in a JS script
// @author       Florian Pasteur
// @match        *
// @icon         https://www.google.com/s2/favicons?sz=64&domain=js.org
// @grant        none


(function () {
    window.base64ToString = function () {
        return atob(...arguments);
    }

    window.base64ToString = function () {
        return btoa(...arguments);
    }
})();

