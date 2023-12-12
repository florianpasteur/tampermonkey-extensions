// ==UserScript==
// @name         Declare woon-week ritten
// @namespace    https://github.com/florianpasteur/tampermonkey-extensions
// @version      0.2
// @supportURL   https://github.com/florianpasteur/tampermonkey-extensions/issues
// @updateURL    https://raw.githubusercontent.com/florianpasteur/tampermonkey-extensions/main/reisbalans/declare-woon-werk-ritten.js
// @downloadURL  https://raw.githubusercontent.com/florianpasteur/tampermonkey-extensions/main/reisbalans/declare-woon-werk-ritten.js
// @description  Declare for the entire week (Mon to Fri) the home to work trip in one click
// @author       Florian Pasteur
// @match        https://mijn.reisbalans.nl/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reisbalans.n
// @grant        none
// @run-at       context-menu
// ==/UserScript==


(function () {
    findAllBySelector('a.add-commuting-ride').slice(0,5).forEach(e => e.click())
})();