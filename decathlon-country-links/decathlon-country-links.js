// ==UserScript==
// @name         Decathlon country links
// @namespace    https://github.com/florianpasteur/tampermonkey-extensions
// @version      0.3
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

    // Your code here...

    const model = parseInt(document.querySelector('.current-selected-model').innerText)
    const title = document.querySelector('h1')

    console.log("Model:", model);

    setTimeout(() => {

        if (model) {

            title.after(createLink('🇳🇱', 'https://www.decathlon.nl/search?Ntt=' + model))
            title.after(createLink('🇫🇷', 'https://www.decathlon.fr/search?Ntt=' + model))
        }

    }, 2000)
})();