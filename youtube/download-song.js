// ==UserScript==
// @name         YouTube Music Download
// @namespace    https://github.com/florianpasteur/tampermonkey-extensions
// @version      0.6
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
    const SHARE_DOWNLOAD_ID = 'yt-music-share-download-btn';
    let lastKnownVideoId = null;

    function createSvgIcon(size = 24) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('width', String(size));
        svg.setAttribute('height', String(size));
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

    function extractVideoIdFromText(text) {
        if (!text) return null;
        const patterns = [
            /[?&]v=([a-zA-Z0-9_-]{11})/,
            /youtu\.be\/([a-zA-Z0-9_-]{11})/,
            /\/watch\/([a-zA-Z0-9_-]{11})/
        ];
        for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match) return match[1];
        }
        return null;
    }

    function createShareDownloadButton(videoId) {
        const container = document.createElement('div');
        container.id = SHARE_DOWNLOAD_ID;
        container.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            padding: 8px 16px;
            min-width: 72px;
        `;

        const iconWrapper = document.createElement('div');
        iconWrapper.style.cssText = `
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background-color: #ff0000;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 8px;
            transition: background-color 0.2s;
        `;
        iconWrapper.appendChild(createSvgIcon(24));
        iconWrapper.querySelector('svg').style.color = '#fff';

        const label = document.createElement('span');
        label.textContent = 'Download';
        label.style.cssText = `
            font-size: 12px;
            color: #fff;
            text-align: center;
        `;

        container.appendChild(iconWrapper);
        container.appendChild(label);

        container.addEventListener('mouseenter', () => {
            iconWrapper.style.backgroundColor = '#cc0000';
        });

        container.addEventListener('mouseleave', () => {
            iconWrapper.style.backgroundColor = '#ff0000';
        });

        container.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const downloadUrl = `https://sosyoutube.com/watch?v=${videoId}`;
            window.open(downloadUrl, '_blank');
        });

        return container;
    }

    function addDownloadToSharePanel() {
        const sharePanel = document.querySelector('ytmusic-unified-share-panel-renderer');
        if (!sharePanel) return;
        if (sharePanel.querySelector(`#${SHARE_DOWNLOAD_ID}`)) return;

        // Find the video ID from the share panel
        let videoId = null;
        
        // Look for the share URL input
        const inputs = sharePanel.querySelectorAll('input');
        for (const input of inputs) {
            videoId = extractVideoIdFromText(input.value);
            if (videoId) break;
        }

        // Also check text content
        if (!videoId) {
            const textContent = sharePanel.textContent;
            videoId = extractVideoIdFromText(textContent);
        }

        if (!videoId) {
            videoId = lastKnownVideoId;
        }

        if (!videoId) {
            console.log('[YT Music Download] Could not find video ID in share panel');
            return;
        }

        lastKnownVideoId = videoId;
        console.log('[YT Music Download] Adding download button to share panel for:', videoId);

        // Find the share options container (where social icons are)
        const shareTargets = sharePanel.querySelector('#share-targets, .share-targets, [class*="share-target"]');
        if (shareTargets) {
            const downloadBtn = createShareDownloadButton(videoId);
            shareTargets.insertBefore(downloadBtn, shareTargets.firstChild);
            return;
        }

        // Alternative: find the row with share buttons
        const buttonRows = sharePanel.querySelectorAll('[class*="button"], [class*="icon"]');
        for (const row of buttonRows) {
            const parent = row.parentElement;
            if (parent && parent.children.length > 2) {
                const downloadBtn = createShareDownloadButton(videoId);
                parent.insertBefore(downloadBtn, parent.firstChild);
                return;
            }
        }

        // Fallback: add before the copy link section
        const copySection = sharePanel.querySelector('#copy-button, [class*="copy"]');
        if (copySection) {
            const downloadBtn = createShareDownloadButton(videoId);
            downloadBtn.style.marginBottom = '16px';
            copySection.parentElement.insertBefore(downloadBtn, copySection);
        }
    }

    function watchSharePopup() {
        const shareDialogs = document.querySelectorAll('ytmusic-unified-share-panel-renderer, tp-yt-paper-dialog, ytmusic-dialog');
        
        shareDialogs.forEach(dialog => {
            const inputs = dialog.querySelectorAll('input[type="text"], input[readonly], .share-url, #share-url');
            inputs.forEach(input => {
                const videoId = extractVideoIdFromText(input.value);
                if (videoId) {
                    lastKnownVideoId = videoId;
                    console.log('[YT Music Download] Captured video ID from share popup:', videoId);
                }
            });

            const textElements = dialog.querySelectorAll('yt-formatted-string, span, div');
            textElements.forEach(el => {
                const videoId = extractVideoIdFromText(el.textContent);
                if (videoId) {
                    lastKnownVideoId = videoId;
                    console.log('[YT Music Download] Captured video ID from share text:', videoId);
                }
            });

            const copyButtons = dialog.querySelectorAll('[aria-label*="Copy"], button');
            copyButtons.forEach(btn => {
                const nearbyInput = btn.closest('div')?.querySelector('input');
                if (nearbyInput) {
                    const videoId = extractVideoIdFromText(nearbyInput.value);
                    if (videoId) {
                        lastKnownVideoId = videoId;
                        console.log('[YT Music Download] Captured video ID near copy button:', videoId);
                    }
                }
            });
        });

        const allInputs = document.querySelectorAll('input');
        allInputs.forEach(input => {
            if (input.value && input.value.includes('youtube.com') || input.value && input.value.includes('youtu.be')) {
                const videoId = extractVideoIdFromText(input.value);
                if (videoId) {
                    lastKnownVideoId = videoId;
                    console.log('[YT Music Download] Captured video ID from input:', videoId);
                }
            }
        });

        // Add download button to share panel
        addDownloadToSharePanel();
    }

    function getCurrentVideoId() {
        const urlParams = new URLSearchParams(window.location.search);
        const urlVideoId = urlParams.get('v');
        if (urlVideoId) return urlVideoId;

        const video = document.querySelector('video');
        if (video && video.src) {
            const match = video.src.match(/[?&]v=([^&]+)/);
            if (match) return match[1];
        }

        const playerBarTitle = document.querySelector('ytmusic-player-bar .title a');
        if (playerBarTitle && playerBarTitle.href) {
            const match = playerBarTitle.href.match(/[?&]v=([^&]+)/);
            if (match) return match[1];
        }

        const thumbnailLink = document.querySelector('ytmusic-player-bar a.image');
        if (thumbnailLink && thumbnailLink.href) {
            const match = thumbnailLink.href.match(/[?&]v=([^&]+)/);
            if (match) return match[1];
        }

        const player = document.querySelector('ytmusic-player');
        if (player) {
            const videoId = player.getAttribute('video-id');
            if (videoId) return videoId;
        }

        const nowPlaying = document.querySelector('ytmusic-player-queue-item[selected] a');
        if (nowPlaying && nowPlaying.href) {
            const match = nowPlaying.href.match(/[?&]v=([^&]+)/);
            if (match) return match[1];
        }

        if (lastKnownVideoId) {
            console.log('[YT Music Download] Using fallback video ID from share popup:', lastKnownVideoId);
            return lastKnownVideoId;
        }

        return null;
    }

    function openDownloadPage() {
        const videoId = getCurrentVideoId();

        if (!videoId) {
            console.error('Could not find video ID');
            alert('Could not find the current song ID. Try opening the Share popup first to capture the song ID, then click download again.');
            return;
        }

        const downloadUrl = `https://sosyoutube.com/watch?v=${videoId}`;
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
        watchSharePopup();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    insertButton();
})();
