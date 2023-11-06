// ==UserScript==
// @name         Get rise-schema.json content
// @namespace    https://github.com/florianpasteur/tampermonkey-extensions
// @version      0.2
// @description  Copy list of lessons to be paste on the  rise-schema.json for a markdown-to-rise-import
// @author       Florian Pasteur
// @match        https://rise.articulate.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=articulate.com
// @grant        GM_setClipboard
// @run-at       context-menu
// ==/UserScript==

(async function () {
    'use strict';
    try {
        const riseSchemaContent = riseSchema();
        GM_setClipboard(riseSchemaContent);
        notification("✅ Copied")
    } catch (e) {
        notification("❌ Something went wrong. Are you on the correct page?")
        console.error(e)
    }
})();

function notification(text, timeout = 2500) {
    // Create a new <style> element to insert CSS
    var style = document.createElement('style');
    style.innerHTML = `
        /* CSS styles for a red box */
        .custom-box {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background-color: #333;
      color: #fff;
      padding: 15px;
      border-radius: 5px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
      max-width: 300px;
          cursor: pointer;
        }
        
            .custom-box:hover {
            background-color: #555;
            }
      `;

    // Append the <style> element to the <head> of the document
    document.head.appendChild(style);

    // Create a new <div> element with the specified HTML content
    var div = document.createElement('div');
    div.innerHTML = text;
    div.className = 'custom-box';
    div.onclick = () => {
        div.remove()
    }

    setTimeout(() => {
        if (div) {
            div.remove()
        }
    }, timeout)

    // Append the <div> element to the <body> of the document
    document.body.appendChild(div);

}

function  riseSchema (locations = []) {
    const location = ("" + window.location).replace(/#.*$/, '');
    const pages = Array.from(document.querySelectorAll('input[placeholder="Add a lesson title..."]'))
        .map((element, index) => {
            const id = element.id.substr("input-".length);
            return ({
                title: element.value,
                risePage: location + '#/author/details/' + id,
                markdownLocation: locations[index] || "./",
                markdownFile: "README.md"
            });
        });
    const string = JSON.stringify(pages.slice(0,-1));
    return string.substr(1, string.length-2);
}