// ==UserScript==
// @name         UserId on User search docebo
// @namespace    https://github.com/florianpasteur/tampermonkey-extensions
// @version      0.6
// @supportURL   https://github.com/florianpasteur/tampermonkey-extensions/issues
// @updateURL    https://raw.githubusercontent.com/florianpasteur/tampermonkey-extensions/main/docebo/user-id-on-users-search.js
// @downloadURL  https://raw.githubusercontent.com/florianpasteur/tampermonkey-extensions/main/docebo/user-id-on-users-search.js
// @description  Add user id on the search table of users
// @author       Florian Pasteur
// @match        https://CHANGEME-TO-YOUR-LMS-URL.com/manage/users
// @match        https://*.docebosaas.com/manage/users
// @icon         https://www.google.com/s2/favicons?sz=64&domain=docebo.com
// @grant none
// ==/UserScript==

(function() {
    'use strict';

    const nodes = new Set();

    setInterval(() => {
        let table = localStorage.getItem('cache-storage.user_cache_prefix.table-1')

        if (table) {
            table = JSON.parse(table)
            if (table.value && table.value.items && table.value.items.length > 0) {

                addHeader();
                table.value.items.forEach(user => {


                    const usernameTd = Array.from(document.querySelectorAll('[data-id="username"]')).find(e => e.innerText === user.username)
                    insertElementBefore(usernameTd, createUserIDCell(user.user_id))
                })
            }
        }
    }, 1000)

    function insertElementBefore(existingElement, newElement) {
        if (existingElement) {
            if (nodes.has(existingElement)) {
                return;
            }
            nodes.add(existingElement);
            existingElement.parentElement.insertBefore(newElement, existingElement)
        }
    }


    function addHeader() {
        const header = document.querySelector('th[id="username"]');
        insertElementBefore(header, createUserIDHeader());
    }

    function createUserIDHeader() {
        const element = document.createElement("th");
        element.innerText = "User Id";
        return element;
    }
    function createUserIDCell(value) {
        const element = document.createElement("td");
        element.innerText = value;
        return element
    }
})();
