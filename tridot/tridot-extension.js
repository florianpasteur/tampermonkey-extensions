// ==UserScript==
// @name         Tridot Extension
// @namespace    https://github.com/florianpasteur/tampermonkey-extensions
// @version      0.19
// @supportURL   https://github.com/florianpasteur/tampermonkey-extensions/issues
// @updateURL    https://raw.githubusercontent.com/florianpasteur/tampermonkey-extensions/main/tridot/tridot-extension.js
// @downloadURL  https://raw.githubusercontent.com/florianpasteur/tampermonkey-extensions/main/tridot/tridot-extension.js
// @description  [WIP] Download rise course content as markdown files
// @author       Florian Pasteur
// @match        https://app.tridot.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tridot.com
// @run-at       document-end
// @require      https://cdnjs.cloudflare.com/ajax/libs/axios/1.5.1/axios.min.js
// @grant        GM_addStyle
// ==/UserScript==


(async function () {
    'use strict';
    const modified = [];

    GM_addStyle(`
            /* CSS */
        .button-4 {
        appearance: none;
        background-color: #FAFBFC;
        border: 1px solid rgba(27, 31, 35, 0.15);
        border-radius: 6px;
        box-shadow: rgba(27, 31, 35, 0.04) 0 1px 0, rgba(255, 255, 255, 0.25) 0 1px 0 inset;
        box-sizing: border-box;
        color: #24292E;
        cursor: pointer;
        display: inline-block;
        font-family: -apple-system, system-ui, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
        font-size: 14px;
        font-weight: 500;
        line-height: 20px;
        list-style: none;
        padding: 6px 16px;
        position: relative;
        transition: background-color 0.2s cubic-bezier(0.3, 0, 0.5, 1);
        user-select: none;
        -webkit-user-select: none;
        touch-action: manipulation;
        vertical-align: middle;
        white-space: nowrap;
        word-wrap: break-word;
    }

.button-4:hover {
        background-color: #F3F4F6;
        text-decoration: none;
        transition-duration: 0.1s;
    }

.button-4:disabled {
        background-color: #FAFBFC;
        border-color: rgba(27, 31, 35, 0.15);
        color: #959DA5;
        cursor: default;
    }

.button-4:active {
        background-color: #EDEFF2;
        box-shadow: rgba(225, 228, 232, 0.2) 0 1px 0 inset;
        transition: none 0s;
    }

.button-4:focus {
        outline: 1px transparent;
    }

.button-4:before {
        display: none;
    }

.button-4:-webkit-details-marker {
        display: none;
    }
    `)

    setInterval(function () {
        const memberId = getAthleteId();
        const token = getToken();


        let newSessions = getAll('[data-sessionid]')
            .filter(session => !modified.includes(session));

        for (const sessionElement of newSessions) {

            const sessionId = sessionElement.dataset.sessionid;
            const isComplete = sessionElement.classList.contains('workout-complete');
            const sessionInfo = sessionElement.querySelector('.session-info')?.textContent?.trim()
            const sessionCard = sessionElement.querySelector('.card-box-mobile') || sessionElement;
            const workoutType = determineWorkoutType(sessionElement);

            const time = timeAmPm => () => setTime(token, memberId, sessionId, timeAmPm);

            switch (workoutType) {
                case 'swim':
                    if (sessionInfo !== '7:00 am' && !isComplete) {
                        addButton("7h", time("07:00AM"), sessionCard)
                    }
                    if (sessionInfo !== '7:00 pm' && !isComplete) {
                        addButton("19h", time("07:00PM"), sessionCard)
                    }
                    break;
                case 'bike':
                    if (sessionInfo !== '9:00 am' && !isComplete) {
                        addButton("9h", time("09:00AM"), sessionCard)
                    }
                    if (sessionInfo !== '5:00 pm' && !isComplete) {
                        addButton("17h", time("05:00PM"), sessionCard)
                    }
                    break;
                case 'run':
                    if (sessionInfo !== '7:00 am' && !isComplete) {
                        addButton("7h", time("07:00AM"), sessionCard)
                    }
                    if (sessionInfo !== '5:00 pm' && !isComplete) {
                        addButton("17h", time("05:00PM"), sessionCard)
                    }
                    break;
                case 'strength':
                    if (sessionInfo !== '7:30 am' && !isComplete) {
                        addButton("7h30", time("07:30"), sessionCard)
                    }
                    if (sessionInfo !== '5:15 pm' && !isComplete) {
                        addButton("17h15", time("05:15PM"), sessionCard)
                    }
                    break;
            }

            modified.push(sessionElement)
        }

    }, 1_000)

    console.log("Tridot extension loaded");
})();


function addButton(text, onClick, locationElement) {

    const button = document.createElement('button');
    button.innerText = text;
    button.classList.add('button-4');
    button.addEventListener('click', onClick);
    locationElement.appendChild(button);
}

function getAll(selector) {
    return Array.from(document.querySelectorAll(selector));
}


function getToken() {
    return localStorage.getItem('accessToken');
}


async function setTime(token, memberId, sessionId, timeAmPm) {
    const response = await axios.patch("https://api.tridot.com/athletesvcs/athlete/schedule/update-location-and-time", {
        memberId: memberId,
        sessionId: String(sessionId),
        sessionTime: timeAmPm,
    }, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })

    if (response.ok) {
        window.location.reload();
    } else {
        alert(`Error updating time: ${response.statusText} ${response.statusCode}`);
        console.log(response.data)
    }
}

function getAthleteId() {
    const athleteData = localStorage.getItem('athleteProfile') || '{}';
    const athlete = JSON.parse(athleteData);
    return athlete.athleteId;
}

function determineWorkoutType(sessionElement) {
    const img = sessionElement.querySelector('img.session-type');

    const src = img?.getAttribute('src') || '';
    if (src.includes('bike')) return 'bike';
    if (src.includes('swim')) return 'swim';
    if (src.includes('run')) return 'run';
    if (src.includes('strength')) return 'strength';
    return 'other';
}
