// ==UserScript==
// @name         Insert markdown
// @namespace    https://github.com/florianpasteur/tampermonkey-extensions
// @version      0.2
// @supportURL   https://github.com/florianpasteur/tampermonkey-extensions/issues
// @updateURL    https://raw.githubusercontent.com/florianpasteur/tampermonkey-extensions/main/utils/insert-markdown.js
// @downloadURL  https://raw.githubusercontent.com/florianpasteur/tampermonkey-extensions/main/utils/insert-markdown.js
// @description  Insert markdown as html at the caret in the page.
// @author       Florian Pasteur
// @match        *
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=js.org
// @grant        none
// @run-at       context-menu
// @require      https://cdn.jsdelivr.net/npm/marked/marked.min.js
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

    let markdown = prompt("Paste your markdown", "# Hello world");

    if (markdown != null) {
        const html = marked.parse(markdown);
        pasteHtmlAtCaret(html);
    }
})();