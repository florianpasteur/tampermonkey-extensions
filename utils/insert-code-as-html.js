// ==UserScript==
// @name         Insert code blocks
// @namespace    https://github.com/florianpasteur/tampermonkey-extensions
// @version      0.4
// @supportURL   https://github.com/florianpasteur/tampermonkey-extensions/issues
// @updateURL    https://raw.githubusercontent.com/florianpasteur/tampermonkey-extensions/main/utils/insert-code-as-html.js
// @downloadURL  https://raw.githubusercontent.com/florianpasteur/tampermonkey-extensions/main/utils/insert-code-as-html.js
// @description  If content is editable, insert styled code block
// @author       Florian Pasteur
// @match        *
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=js.org
// @grant        none
// @run-at       context-menu
// @require      https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js
// ==/UserScript==

(async function () {
    'use strict';

    hljs.registerLanguage('bash', bashHljs);

    const code = prompt("Paste the code", "console.log('hello world')");
    const language = prompt("What's the langage ?", "bash, javascript, java");

    if (code && language) {
        pasteHtmlAtCaret(getHighlightedCode(code, language))
    }


})();

function inlineStyles(e) {
    const styles = {
        'hljs': 'color: #2f3337;background: #f6f6f6;',
        'hljs-subst': 'color: #2f3337;',
        'hljs-comment': 'color: #656e77;',
        'hljs-doctag': 'color: #015692;',
        'hljs-keyword': 'color: #015692;',
        'hljs-section': 'color: #015692;',
        'hljs-selector-tag': 'color: #015692;',
        'hljs-attr': 'color: #015692;',
        'hljs-attribute': 'color: #803378;',
        'hljs-name': 'color: #b75501;',
        'hljs-number': 'color: #b75501;',
        'hljs-quote': 'color: #b75501;',
        'hljs-selector-id': 'color: #b75501;',
        'hljs-template-tag': 'color: #b75501;',
        'hljs-type': 'color: #b75501;',
        'hljs-selector-class': 'color: #015692;',
        'hljs-link': 'color: #54790d;',
        'hljs-regexp': 'color: #54790d;',
        'hljs-selector-attr': 'color: #54790d;',
        'hljs-string': 'color: #54790d;',
        'hljs-symbol': 'color: #54790d;',
        'hljs-template-variable': 'color: #54790d;',
        'hljs-variable': 'color: #54790d;',
        'hljs-meta': 'color: #015692;',
        'hljs-selector-pseudo': 'color: #015692;',
        'hljs-built_in': 'color: #b75501;',
        'hljs-literal': 'color: #b75501;',
        'hljs-title': 'color: #b75501;',
        'hljs-bullet': 'color: #535a60;',
        'hljs-code': 'color: #535a60;',
        'hljs-deletion': 'color: #c02d2e;',
        'hljs-addition': 'color: #2f6f44;',
        'hljs-emphasis': 'font-style: italic;',
        'hljs-strong': 'font-weight: 700;',
        'codeblock':'white-space: pre; line-height: 1.3; padding: 3rem; font-size: 1.5rem; color: #313537; border: 1px solid rgb(238, 238, 238); border-radius: 0.3rem; background: rgb(250, 250, 250); overflow: auto;  margin: 0.5em 0;'
    }

    for (let className in styles) {
        if (e.classList.contains(className)) {
            e.setAttribute('style',  (e.getAttribute('style') || '') + styles[className])
        }
    }
}
function bashHljs(hljs) {
    const SUBST = {
        className: 'subst',
        begin: /\$\(/, end: /\)/,
        contains: [hljs.BACKSLASH_ESCAPE]
    };
    const HERE_DOC = {
        begin: /<<-?\s*(?=\w+)/,
        starts: {
            contains: [
                hljs.END_SAME_AS_BEGIN({
                    begin: /(\w+)/,
                    end: /(\w+)/,
                    className: 'string'
                })
            ]
        }
    };
    const QUOTE_STRING = {
        className: 'string',
        begin: /"/, end: /"/,
        contains: [
            hljs.BACKSLASH_ESCAPE,
            SUBST
        ]
    };
    SUBST.contains.push(QUOTE_STRING);
    const ESCAPED_QUOTE = {
        className: '',
        begin: /\\"/

    };
    const APOS_STRING = {
        className: 'string',
        begin: /'/, end: /'/
    };
    const ARITHMETIC = {
        begin: /\$\(\(/,
        end: /\)\)/,
        contains: [
            { begin: /\d+#[0-9a-f]+/, className: "number" },
            hljs.NUMBER_MODE,
        ]
    };
    const SH_LIKE_SHELLS = [
        "fish",
        "bash",
        "zsh",
        "sh",
        "csh",
        "ksh",
        "tcsh",
        "dash",
        "scsh",
    ];
    const KNOWN_SHEBANG = hljs.SHEBANG({
        binary: `(${SH_LIKE_SHELLS.join("|")})`,
        relevance: 10
    });
    const FUNCTION = {
        className: 'function',
        begin: /\w[\w\d_]*\s*\(\s*\)\s*\{/,
        returnBegin: true,
        contains: [hljs.inherit(hljs.TITLE_MODE, {begin: /\w[\w\d_]*/})],
        relevance: 0
    };

    const KEYWORDS = [
        "if",
        "then",
        "else",
        "elif",
        "fi",
        "for",
        "while",
        "in",
        "do",
        "done",
        "case",
        "esac",
        "function"
    ];

    const LITERALS = [
        "true",
        "false"
    ];

    const LONG_OPTIONS = {
        className: 'attribute',
        begin: /--\w+ /,
    };

    const LONG_OPTIONS_WITH_PARAM = {
        className: 'attribute',
        begin: /--\w+/,
        end: /=/,
    };


    const SHORT_OPTIONS = {
        className: 'attribute',
        begin: /-\w /,
    };


    return {
        name: 'Bash',
        aliases: ['sh', 'shell'],
        keywords: {
            $pattern: /\b[a-z._-]+\b/,
            keyword: KEYWORDS,
            literal: LITERALS,
            built_in:
            // Shell built-ins
            // http://www.gnu.org/software/bash/manual/html_node/Shell-Builtin-Commands.html
                'break cd continue eval exec exit export getopts hash pwd readonly return shift test times ' +
                'trap umask unset ' +
                // Bash built-ins
                'alias bind builtin caller command declare echo enable help let local logout mapfile printf ' +
                'read readarray source type typeset ulimit unalias ' +
                // Shell modifiers
                'set shopt ' +
                // Zsh built-ins
                'autoload bg bindkey bye cap chdir clone comparguments compcall compctl compdescribe compfiles ' +
                'compgroups compquote comptags comptry compvalues dirs disable disown echotc echoti emulate ' +
                'fc fg float functions getcap getln history integer jobs kill limit log noglob popd print ' +
                'pushd pushln rehash sched setcap setopt stat suspend ttyctl unfunction unhash unlimit ' +
                'unsetopt vared wait whence where which zcompile zformat zftp zle zmodload zparseopts zprof ' +
                'zpty zregexparse zsocket zstyle ztcp ' +
                // custom
                'npm node mvn docker bb java brew colima git ng npx nx'
        },
        contains: [
            KNOWN_SHEBANG, // to catch known shells and boost relevancy
            hljs.SHEBANG(), // to catch unknown shells but still highlight the shebang
            FUNCTION,
            ARITHMETIC,
            hljs.HASH_COMMENT_MODE,
            HERE_DOC,
            QUOTE_STRING,
            ESCAPED_QUOTE,
            APOS_STRING,
            LONG_OPTIONS,
            LONG_OPTIONS_WITH_PARAM,
            SHORT_OPTIONS
        ]
    };
}
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

function getHighlightedCode(code, language) {
    const highlightedCode = hljs.highlight(code, {language});

    const main = document.createElement('div');
    main.innerHTML = language === 'bash' ? commandTemplate(highlightedCode.value) : codeTemplate(highlightedCode.value);
    [main, ...Array.from(main.querySelectorAll('*'))].forEach(e => {
        inlineStyles(e);
    })

    return main.innerHTML;
}

function codeTemplate(code) {
    return `<div translate="no"  class="codeblock">${code}</div>`;
}

function commandTemplate(command) {
    return `<div translate="no" style="display: flex; flex-direction: column;  user-select: all; cursor: pointer; margin: 0.5em 0;"><div style="height: 2em; border: 1px solid rgb(238, 238, 238); border-top: none;  background: rgb(250, 250, 250); display: flex; align-items: center; padding-left: 0.5em; border-top-left-radius: 5px; border-top-right-radius: 5px; user-select: none;"><span style="width: 0.5em; height: 0.5em; background: #f87171; margin: 0.3em; border-radius: 50%; display: inline-block;">&nbsp;</span><span style="width: 0.5em; height: 0.5em; background: #facc15; margin: 0.3em; border-radius: 50%; display: inline-block;">&nbsp;</span><span style="width: 0.5em; height: 0.5em; background: #4ade80; margin: 0.3em; border-radius: 50%; display: inline-block;">&nbsp;</span></div><div style="background: #fcfcfd; padding: 1.5em 0.5em; line-height: 1em; display: flex; align-items: flex-start; border-left: 1px solid rgb(238, 238, 238); border-right: 1px solid rgb(238, 238, 238); border-bottom: 1px solid rgb(238, 238, 238); border-top: none; border-bottom-left-radius: 5px; border-bottom-right-radius: 5px; border-top: none"><span style="color: #16a34a; margin: 0 15px; font-size: 0.8em;user-select: none; ">❯</span>
        <span className="code-command" translate="no" style=" user-select: text; cursor: auto;">${command}</span></div></div>`
}