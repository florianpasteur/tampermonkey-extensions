// ==UserScript==
// @name         Jira Timer and Wheel
// @namespace    https://github.com/florianpasteur/tampermonkey-extensions
// @version      0.5
// @supportURL   https://github.com/florianpasteur/tampermonkey-extensions/issues
// @updateURL    https://raw.githubusercontent.com/florianpasteur/tampermonkey-extensions/main/jira-timer-and-wheel/jira-timer-and-wheel.js
// @downloadURL  https://raw.githubusercontent.com/florianpasteur/tampermonkey-extensions/main/jira-timer-and-wheel/jira-timer-and-wheel.js
// @description  Insert Wheel of names or Timer to Jira page to track daily limits
// @author       Florian Pasteur
// @match        https://*.atlassian.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.atlassian.com
// @grant           GM_registerMenuCommand
// ==/UserScript==


(function() {
    'use strict';
    let offset = 0;

    function wheelOfNames() {
        const draggableElement = macWindow("https://pickerwheel.com/?id=AQ4Dk", '600', '600', 'yes');
        makeDraggable(draggableElement)
    }

    function timer() {
        const draggableElement = macWindow("https://www.bigtimer.net/?minutes=3&repeat=false", '500','300', 'no');
        makeDraggable(draggableElement)
    }

    GM_registerMenuCommand("wheel of names", wheelOfNames);
    GM_registerMenuCommand("timer", timer);


    function bigger(element) {
        element.style.height = element.clientHeight * 1.1 + 'px';
        element.style.width = element.clientWidth * 1.1 + 'px';
    }

    function smaller(element) {
        element.style.height = element.clientHeight * 0.9 + 'px';
        element.style.width = element.clientWidth * 0.9 + 'px';
    }

    function toggle(element) {
        console.log("toggle");
        element.data('initialHeight', element.clientHeight || element.data('initialHeight'));
        if (element.clientHeight === 0) {
            element.style.height = 0 + 'px';
        } else {
            element.style.height = element.data('initialHeight') + 'px';
        }
    }

    function makeDraggable(draggableElement) {
        draggableElement.querySelector('.windowBar').addEventListener('dblclick', () => {
            toggle(draggableElement.querySelector('iframe'));
        })
        draggableElement.querySelector('.close').addEventListener('click', () => {
            draggableElement.parentElement.removeChild(draggableElement);
        })
        draggableElement.querySelector('.minimize').addEventListener('click', () => {
            smaller(draggableElement.querySelector('iframe'));
        })
        draggableElement.querySelector('.maximize').addEventListener('click', () => {
            bigger(draggableElement.querySelector('iframe'));
        })

        // Initialize variables to keep track of dragging state
        var dragging = false;
        var offsetX, offsetY;

        // Function to handle mouse down event
        function handleMouseDown(event) {
            dragging = true;

            // Calculate the offset of mouse pointer relative to the draggable element
            offsetX = event.clientX - draggableElement.getBoundingClientRect().left;
            offsetY = event.clientY - draggableElement.getBoundingClientRect().top;

            // Add event listeners for mouse move and mouse up events
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        // Function to handle mouse move event
        function handleMouseMove(event) {
            if (dragging) {
                // Calculate new position of the draggable element based on mouse position and offset
                var x = event.clientX - offsetX;
                var y = event.clientY - offsetY;

                // Update position of the draggable element
                draggableElement.style.left = x + 'px';
                draggableElement.style.top = y + 'px';
            }
        }

        // Function to handle mouse up event
        function handleMouseUp() {
            dragging = false;

            // Remove event listeners for mouse move and mouse up events
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }

        // Add event listener for mouse down event on the draggable element
        draggableElement.addEventListener('mousedown', handleMouseDown);
    }

    function macWindow(src, width, height, scrollable) {
        const e = document.createElement('div');
        e.style.position = 'absolute';
        e.style.top = '100px';
        e.style.left = (offset + 500) + 'px';
        e.style.cursor = 'move';
        e.style.boxShadow = 'rgba(0, 0, 0, 0.24) 0px 1px 4px 0px'

        offset += 500;

        document.body.append(e);
        e.innerHTML = `
    <div class="windowBar" style="height: 2em; border: 1px solid rgb(238, 238, 238); background: rgb(250, 250, 250); display: flex; align-items: center; padding-left: 0.5em; border-top-left-radius: 5px; border-top-right-radius: 5px; user-select: none;">
        <span class="close" style="cursor: pointer; width: 1em; height: 1em; background: #f87171; margin: 0.3em; border-radius: 50%; display: inline-block;">&nbsp;</span>
        <span class="minimize"
            style="cursor: pointer; width: 1em; height: 1em; background: #facc15; margin: 0.3em; border-radius: 50%; display: inline-block;">&nbsp;</span>
        <span  class="maximize"
            style="cursor: pointer; width: 1em; height: 1em; background: #4ade80; margin: 0.3em; border-radius: 50%; display: inline-block;">&nbsp;</span>
    </div>
    <div style="background: #fcfcfd; padding: 1.5em 0.5em; line-height: 1em; display: flex; align-items: flex-start; border-left: 1px solid rgb(238, 238, 238); border-right: 1px solid rgb(238, 238, 238); border-bottom: 1px solid rgb(238, 238, 238); border-top: none; border-bottom-left-radius: 5px; border-bottom-right-radius: 5px; border-top: none">
        <iframe scrolling="${scrollable}"  height="${height}" width="${width}" src="${src}" frameborder="0" ></iframe>
    </div>`;
        return e;
    }
})();