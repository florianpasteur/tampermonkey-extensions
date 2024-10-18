// ==UserScript==
// @name         Decathlon country links
// @namespace    https://github.com/florianpasteur/tampermonkey-extensions
// @version      0.7
// @supportURL   https://github.com/florianpasteur/tampermonkey-extensions/issues
// @updateURL    https://raw.githubusercontent.com/florianpasteur/tampermonkey-extensions/main/decathlon-country-links/decathlon-country-links.js
// @downloadURL  https://raw.githubusercontent.com/florianpasteur/tampermonkey-extensions/main/decathlon-country-links/decathlon-country-links.js
// @description  Create a link to jump between dutch and french website of decathlon on the same product
// @author       Florian Pasteur
// @match        https://www.decathlon.nl/*
// @match        https://www.decathlon.fr/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=decathlon.nl
// @grant        none
// ==/UserScript==


(function() {
    'use strict';

    const createLink = (text, destination) => {
        const a = document.createElement('a');
        a.innerText = text;
        a.href = destination;
        a.taget = "_blank"
        a.style = "font-size: 3em;"
        return a
    }

    const [modelV1] = /\d+/.exec(document.querySelector('.current-selected-model').innerText)
    const [modelV2] = /\d+/.exec(document.querySelector('.product-info__product-id').innerText)
    const title = document.querySelector('h1')

    const model = modelV1 || modelV2;

    console.log("Model:", model);

    setTimeout(() => {

        if (model) {

            title.after(createLink('🇳🇱', 'https://www.decathlon.nl/search?Ntt=' + model))
            title.after(createLink('🇫🇷', 'https://www.decathlon.fr/search?Ntt=' + model))
        }

    }, 2000)
})();