// ==UserScript==
// @name         Rise insert html
// @namespace    https://github.com/florianpasteur/tampermonkey-extensions
// @version      0.2
// @description  Insert custom html at current carret
// @author       Florian Pasteur
// @match        https://rise.articulate.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=articulate.com
// @grant        none
// @run-at       context-menu
// @require      https://cdnjs.cloudflare.com/ajax/libs/marked/9.1.2/marked.min.js


// ==/UserScript==

(function() {
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


    pasteHtmlAtCaret(generateHtmlFromMarkdownWithCustomStyle("# Hello \n **CONTENNTNTTTT**"));
    console.log("Inserted")

    // Your code here...
})();