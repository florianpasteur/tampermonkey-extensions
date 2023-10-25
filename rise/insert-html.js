// ==UserScript==
// @name         Rise insert wistia transcript
// @namespace    https://github.com/florianpasteur/tampermonkey-extensions
// @version      0.3
// @description  Insert wistia transcript at caret
// @author       Florian Pasteur
// @match        https://rise.articulate.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=articulate.com
// @grant        none
// @run-at       context-menu
// @require      https://cdnjs.cloudflare.com/ajax/libs/marked/9.1.2/marked.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/axios/1.5.1/axios.min.js


// ==/UserScript==

(async function() {
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
                while ( (node = el.firstChild) ) {
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

    function generateHtmlFromMarkdownWithCustomStyle(content) {
        let htmlContent = `<!DOCTYPE html><head><style>
p {
    margin-bottom: 0.5em
}
h1, h2, h3, h4, h5, h6 {
    font-size: 1.5em;
    font-weight: 700;
}
</style></head><body>${marked.parse(content)}</body></html>`
        return inlineAllCss(htmlContent, false)
    }

    function inlineAllCss(html, classStyleOnly) {
        // const iframe = document.createElement('iframe');
        // iframe.src = 'https://www.xylect.com/html/ifmPumpEmpty.htm';
        // const _document = iframe.contentDocument
        // const window = iframe.contentWindow
        // document.body.append(iframe)
        // _document.body.innerHTML = html;
        const iframe = document.createElement('div');
        const _document = document
        document.body.append(iframe)
        const main = iframe;
        main.innerHTML = html
        main.querySelectorAll("*").forEach(e => {
            const computedStyle = window.getComputedStyle(e)
            const element = _document.createElement(e.tagName)
            main.append(element)
            const defaultStyle = window.getComputedStyle(element)
            const inlineStyleDeclaration = Object.keys(computedStyle)
                .filter(styleElement => !isNaN(parseInt(styleElement)))
                .map(styleIndex => computedStyle[styleIndex])
                .filter(
                    styleElement =>
                        !classStyleOnly ||
                        computedStyle[styleElement] !== defaultStyle[styleElement]
                )
                .map(styleElement => styleElement + ":" + computedStyle[styleElement])
                .join(";")
            e.setAttribute("style", inlineStyleDeclaration)
            element.remove()
        })

        const content = main.innerHTML
            .toString()
            .split("\n")
            .join("<br />");
        main.remove();
        return content
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
    let wistiaUrl = prompt("Please enter wistia URL");

    if (wistiaUrl != null) {
        const transcript = await downloadTranscript(wistiaUrl);
        pasteHtmlAtCaret(generateHtmlFromMarkdownWithCustomStyle(transcript));
    }
})();