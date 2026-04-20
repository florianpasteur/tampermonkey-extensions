// ==UserScript==
// @name         Marathon Photo live download photo previews
// @namespace    https://github.com/florianpasteur/tampermonkey-extensions
// @version      0.27
// @supportURL   https://github.com/florianpasteur/tampermonkey-extensions/issues
// @updateURL    https://raw.githubusercontent.com/florianpasteur/tampermonkey-extensions/main/marathonphotoslive/download-photo-previews.js
// @downloadURL  https://raw.githubusercontent.com/florianpasteur/tampermonkey-extensions/main/marathonphotoslive/download-photo-previews.js
// @description  Download all preview photos from the marathon photos live website in one click
// @author       Florian Pasteur
// @match        https://marathonphotos.live/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=marathonphotos.live
// @run-at       document-end
// @require      https://cdnjs.cloudflare.com/ajax/libs/axios/1.5.1/axios.min.js
// @grant        GM_addStyle
// ==/UserScript==


;(async function () {
    'use strict';

    const pid = setInterval(function () {

        const photos = Array.from(document.querySelectorAll('.container img'));

        if (photos.length === 0) {
            console.log("No photos found yet, retrying...");
            return;
        }

        console.log(`Found ${photos.length} photos, adding download button...`);
        clearInterval(pid);

        const button = document.createElement("button");
        button.innerHTML = "Download photos";
        button.style = "position: fixed; top: 300px; right: 300px; z-index: 1000;";
        button.onclick = async () => {
            const photoUrls = Array.from(photos).map(img => img.src);
            for (let url of photoUrls) {
                const response = await axios.get(url, {responseType: 'blob'});
                const blobUrl = URL.createObjectURL(response.data);
                const a = document.createElement('a');
                a.href = blobUrl;
                a.download = url.split('/').pop();
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(blobUrl);
            }
        }
        document.body.appendChild(button);

        console.log(button)

    }, 10_000)




})();
