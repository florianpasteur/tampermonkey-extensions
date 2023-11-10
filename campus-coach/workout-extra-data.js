// ==UserScript==
// @name         Workout extra data
// @namespace    https://github.com/florianpasteur/tampermonkey-extensions
// @version      0.2
// @supportURL   https://github.com/florianpasteur/tampermonkey-extensions/issues
// @description  Adds more data to the workout preview in campus coach, such as pace, distance at the beginning of block
// @author       Florian Pasteur
// @match        https://app.campus.coach/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=campus.coach
// @require      https://cdnjs.cloudflare.com/ajax/libs/axios/1.5.1/axios.min.js
// @grant none
// ==/UserScript==

(async function () {
    'use strict';

    const token = localStorage.getItem('atk');

    console.log(token);

    const training = await axios.get('https://api.campus.coach/training/active', {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });

    console.log(training);


})();