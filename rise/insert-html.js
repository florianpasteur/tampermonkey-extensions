// ==UserScript==
// @name         Rise insert wistia transcript
// @namespace    https://github.com/florianpasteur/tampermonkey-extensions
// @version      0.4
// @description  Insert wistia transcript at caret
// @author       Florian Pasteur
// @match        https://rise.articulate.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=articulate.com
// @grant        none
// @run-at       context-menu
// @require      https://cdnjs.cloudflare.com/ajax/libs/marked/9.1.2/marked.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/axios/1.5.1/axios.min.js


// ==/UserScript==

(async function () {
    'use strict';

    function pasteHtmlAtCaret(html) {
        var sel, range;
        if (window.getSelection) {
            // IE9 and non-IE
            sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {
                range = sel.getRangeAt(0);
                range.deleteContents();

                // Range.createContextualFragment() would be useful here but is
                // non-standard and not supported in all browsers (IE9, for one)
                var el = document.createElement("div");
                el.innerHTML = html;
                var frag = document.createDocumentFragment(), node, lastNode;
                while ((node = el.firstChild)) {
                    lastNode = frag.appendChild(node);
                }
                range.insertNode(frag);

                // Preserve the selection
                if (lastNode) {
                    range = range.cloneRange();
                    range.setStartAfter(lastNode);
                    range.collapse(true);
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
            }
        } else if (document.selection && document.selection.type != "Control") {
            // IE < 9
            document.selection.createRange().pasteHTML(html);
        }
    }

    async function generateHtmlFromMarkdownWithCustomStyle(content) {
        let styleContent = `<style>
.style p {
    margin-bottom: 0.5em;
    white-space: normal !important;
}
.style h1, .style h2, .style h3, .style h4, .style h5, .style h6 {
    font-size: 1.5em;
    font-weight: 700;
}

</style>`
        let htmlContent = `<div class="style">${marked.parse(content)}</div>`
        return await inlineAllCss(htmlContent, styleContent)
    }

    async function createEmptyIframe() {
        return new Promise(resolve => {

            const iframe = document.createElement('iframe');
            iframe.src = 'about:blank';
            iframe.height = '400px';
            iframe.onload = () => {
                resolve(iframe)
            }
            document.body.append(iframe)
        })
    }

    async function inlineAllCss(html, styleContent) {
        const iframe = await createEmptyIframe();
        const _document = iframe.contentDocument
        const window = iframe.contentWindow
        const main = _document.body;
        main.innerHTML = styleContent + html
        const defaultStylePerElement = await getStandardStyle(html)
        main.querySelectorAll("*").forEach(e => {
            const computedStyle = window.getComputedStyle(e)
            const defaultStyle = defaultStylePerElement.get(e.tagName) || {};
            const inlineStyleDeclaration = Object.keys(computedStyle)
                .filter(styleElement => !isNaN(parseInt(styleElement)))
                .map(styleIndex => computedStyle[styleIndex])
                .filter(styleElement => defaultStyle[kebabCaseToCamelCase(styleElement)])
                .filter(styleElement => {
                    return computedStyle[kebabCaseToCamelCase(styleElement)] !== defaultStyle[kebabCaseToCamelCase(styleElement)];
                })
                .map(styleElement => `${styleElement}:${computedStyle[styleElement]}`)
                .join(";")
            debugger
            e.setAttribute("style", inlineStyleDeclaration)
        })

        const content = main.innerHTML
            .toString()
            .split("\n")
            .join("<br />");
        // main.remove();
        return content
    }

    async function getStandardStyle(html) {
        const iframe = await createEmptyIframe();
        const _document = iframe.contentDocument
        const window = iframe.contentWindow
        const main = _document.body;
        main.innerHTML = `<style> body { width: auto; } </style>` + html
        const defaultStylePerElement = new Map();
        main.querySelectorAll("*").forEach(e => {
            const element = _document.createElement(e.tagName)
            main.append(element)
            const defaultStyle = window.getComputedStyle(element);
            defaultStylePerElement.set(e.tagName, {...defaultStyle})
            element.remove()
        })

        return defaultStylePerElement;
    }


    async function downloadTranscript(link) {
        const videoId = link.split('/').pop();
        try {
            const videoMetadata = await axios.get(`https://fast.wistia.com/embed/medias/${videoId}.json`);
            const captions = videoMetadata.data?.media?.captions?.[0]?.text;

            const chapters = videoMetadata.data?.media?.embedOptions?.plugin?.chapters;
            if (chapters && captions && chapters.on === "true") {
                const videoCaptionsWithTime = await axios.get(`https://fast.wistia.com/embed/captions/${videoId}.json`);

                let captionsLines = videoCaptionsWithTime.data?.captions?.[0]?.hash?.lines;
                if (captionsLines && chapters.chapterList) {
                    let chaptersAsCaptions = chapters.chapterList.map((chapter) => {
                        const chapterTime = parseFloat(chapter.time)
                        return ({
                            "start": chapterTime,
                            "end": chapterTime,
                            "text": [
                                "## " + chapter.title + "\n\n"
                            ]
                        });
                    });

                    const captionsWithChapters = [...chaptersAsCaptions, ...captionsLines].sort((a, b) => a.start - b.start).map(caption => caption.text.join(" ")).join(" ").split('. ').join('.\n\n');

                    if (captionsWithChapters) {
                        return captionsWithChapters;
                    }
                }

            }
            return captions || '';
        } catch (e) {
            console.error("Error while getting transcript")
            console.error(e)
        }
        return '';
    }

    let wistiaUrl = prompt("Please enter wistia URL", "https://backbase-11.wistia.com/medias/777ijlgisl");

    if (wistiaUrl != null) {
        const transcript = await downloadTranscript(wistiaUrl);
        const html = await generateHtmlFromMarkdownWithCustomStyle(transcript);
        pasteHtmlAtCaret(html);
    }

    function kebabCaseToCamelCase(str) {
        return str.replace(/-([a-z])/g, function (match, group1) {
            return group1.toUpperCase();
        });
    }
})();