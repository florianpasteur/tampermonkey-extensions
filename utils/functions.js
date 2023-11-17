// ==UserScript==
// @name         Functions utils
// @namespace    https://github.com/florianpasteur/tampermonkey-extensions
// @version      0.7
// @supportURL   https://github.com/florianpasteur/tampermonkey-extensions/issues
// @description  A collection of utils function to be used in the terminal or in a JS script
// @author       Florian Pasteur
// @match        *
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=js.org
// @grant        none
// ==/UserScript==

(function () {
    /**
     * Alias for atob
     *
     * Takes a base64 string and decode it to text
     * @param {string} str base64 string
     * @return {string} text string
     * @example base64ToString('SGVsbG8gd29ybGQ=')
     */
    window.base64ToString = function (str) {
        return atob(str);
    }

    /**
     * Alias for btoa
     *
     * Takes a base64 string and decode it to text
     * @param {string} str base64 string
     * @return {string} text string
     * @example stringToBase64('Hello World')
     */
    window.stringToBase64 = function (str) {
        return btoa(str);
    }

    /**
     * Alias for JSON.parse
     *
     * Parse a JSON string to object
     * @param {string} str JSON object as string
     * @return {object} parsed object
     * @example parse('{"message": "Hello World"}')
     */
    window.parse = function (str) {
        return JSON.parse(str);
    }

    /**
     * Alias for JSON.stringify
     *
     * Convert a JSON object to string
     * @param {object} obj JSON object
     * @return {string} object as string
     * @example stringify({message: 'Hello World'})
     */
    window.stringify = function (obj) {
        return JSON.stringify(obj);
    }

    /**
     * Find an element in the context
     * @param {string} selector css selector of element
     * @param {Document} [_document] start point of search
     * @return {HTMLElement} element found
     * @example findBySelector('h2', findBySelector('main'))
     */
    window.findBySelector = function (selector, _document = document) {
        return _document.querySelector(selector)
    }

    /**
     * Find all elements in the context
     * @param {string} selector css selector of elements
     * @param {Document} [_document] start point of search
     * @return {Array<HTMLElement>} elements found
     * @example findAllBySelector('label', findBySelector('p'))
     */
    window.findAllBySelector = function (selector, _document = document) {
        return Array.from(_document.querySelectorAll(selector))
    }

    /**
     * Safely save data in locate storage but merge it with current value for later use (after page refresh for example)
     * @param {*} data object to save
     * @param {string} [name=browserAutomation] name of the object to save
     */
    window.saveUpsert = function (data, name = 'browserAutomation') {
        localStorage.setItem(name, JSON.stringify({
            ...load(name),
            ...data
        }));
    }

    /**
     * Save data in locate storage for later use (after page refresh for example)
     * @param {*} data object to save
     * @param {string} [name=browserAutomation] name of the object to save
     */
    window.save = function (data, name = 'browserAutomation') {
        localStorage.setItem(name, JSON.stringify(data));
    }


    /**
     * Load data from locate storage
     * @param {string} [name=browserAutomation] name of the object to load
     */
    window.load = function (name = 'browserAutomation') {
        return JSON.parse(localStorage.getItem(name));
    }
})();

