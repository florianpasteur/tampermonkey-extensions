// ==UserScript==
// @name         UserId on User search docebo
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add user id on the search table of users
// @author       Florian Pasteur
// @match        https://learn.backbase.com/manage/users
// @icon         https://www.google.com/s2/favicons?sz=64&domain=backbase.com
// @grant none
// ==/UserScript==

(function() {
    'use strict';

    let users = {};
    const nodes = new Set();



    setInterval(() => {
        let table = localStorage.getItem('cache-storage.user_cache_prefix.table-1')

        if (table) {
            table = JSON.parse(table)
            if (table.value && table.value.items && table.value.items.length > 0) {

                table.value.items.forEach(user => {
                    users[users.username] = user


                    const usernameTd = Array.from(document.querySelectorAll('[data-id="username"]')).find(e => e.innerText === user.username)
                    if (usernameTd) {
                        if (nodes.has(usernameTd)) {
                            return;
                        }
                        nodes.add(usernameTd);
                        addHeader();

                        const userIdTd = document.createElement("td");
                        userIdTd.innerText = user.user_id
                        usernameTd.parentElement.insertBefore(userIdTd, usernameTd)
                    }
                })
            }
        }
    }, 3000)

    function addHeader() {
        const header = document.querySelector('th[id="username"]');
        if (header) {

            if (nodes.has(header)) {
                return;
            }
            nodes.add(header);
            const userIdTd = document.createElement("th");
            userIdTd.innerText = "User Id";
            header.parentElement.insertBefore(userIdTd, header)
        }
    }
})();