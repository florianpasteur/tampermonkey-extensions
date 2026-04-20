// ==UserScript==
// @name         YouTube Music Download
// @namespace    https://github.com/florianpasteur/tampermonkey-extensions
// @version      0.3
// @supportURL   https://github.com/florianpasteur/tampermonkey-extensions/issues
// @updateURL    https://raw.githubusercontent.com/florianpasteur/tampermonkey-extensions/main/youtube/download-song.js
// @downloadURL  https://raw.githubusercontent.com/florianpasteur/tampermonkey-extensions/main/youtube/download-song.js
// @description  Adds a download option to YouTube Music that opens the song on sosyoutube.com
// @author       Florian Pasteur
// @match        https://music.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=music.youtube.com
// @grant        GM_openInTab
// ==/UserScript==

(function () {
    'use strict';

    const BUTTON_ID = 'yt-music-download-btn';

    function createSvgIcon() {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('width', '24');
        svg.setAttribute('height', '24');
        svg.setAttribute('fill', 'currentColor');

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z');
        svg.appendChild(path);

        return svg;
    }

    function createDownloadButton() {
        const button = document.createElement('button');
        button.id = BUTTON_ID;
        button.appendChild(createSvgIcon());
        button.title = 'Download Song';
        button.style.cssText = `
            background: transparent;
            border: none;
            cursor: pointer;
            padding: 8px;
            margin-left: 8px;
            color: #aaa;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: background-color 0.2s, color 0.2s;
        `;

        button.addEventListener('mouseenter', () => {
            button.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            button.style.color = '#fff';
        });

        button.addEventListener('mouseleave', () => {
            button.style.backgroundColor = 'transparent';
            button.style.color = '#aaa';
        });

        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            openDownloadPage();
        });

        return button;
    }

    function openDownloadPage() {
        const currentUrl = window.location.href;
        const downloadUrl = currentUrl.replace('music.youtube.com', 'sosyoutube.com');
        window.open(downloadUrl, '_blank');
    }

    function insertButton() {
        if (document.getElementById(BUTTON_ID)) return;

        const playerBar = document.querySelector('ytmusic-player-bar');
        if (!playerBar) return;

        const rightControls = playerBar.querySelector('.right-controls-buttons');
        if (!rightControls) return;

        const button = createDownloadButton();
        rightControls.insertBefore(button, rightControls.firstChild);
    }

    const observer = new MutationObserver(() => {
        insertButton();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    insertButton();
})();
