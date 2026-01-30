// ==UserScript==
// @name         Tridot Extension
// @namespace    https://github.com/florianpasteur/tampermonkey-extensions
// @version      0.23
// @supportURL   https://github.com/florianpasteur/tampermonkey-extensions/issues
// @updateURL    https://raw.githubusercontent.com/florianpasteur/tampermonkey-extensions/main/tridot/tridot-extension.js
// @downloadURL  https://raw.githubusercontent.com/florianpasteur/tampermonkey-extensions/main/tridot/tridot-extension.js
// @description  Tridot extension to quickly set session times and send to Garmin/Zwift
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
            // const sessionCard = sessionElement.querySelector('.card-box-mobile') || sessionElement;
            const sessionCard = sessionElement;
            const workoutType = determineWorkoutType(sessionElement);

            if (isComplete) {
                modified.push(sessionElement);
                continue;
            }

            const time = timeAmPm => () => setTime(token, memberId, sessionId, timeAmPm);

            const askForTime = () => {
                const userTime = prompt("Enter session time in HHMM format", "1330");
                if (userTime && /^[0-2][0-9][0-5][0-9]$/.test(userTime)) {
                    const hours = parseInt(userTime.substring(0, 2), 10);
                    const minutes = parseInt(userTime.substring(2, 4), 10);
                    if (hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60) {
                        const amPmTime = (hours % 12 === 0 ? 12 : hours % 12) + ':' + (minutes < 10 ? '0' + minutes : minutes) + (hours < 12 ? 'AM' : 'PM');
                        setTime(token, memberId, sessionId, amPmTime);
                    } else {
                        alert("Invalid time entered");
                    }
                }
            }


            switch (workoutType) {
                case 'swim':
                    if (sessionInfo !== '7:00 am') {
                        addButton("7h", time("07:00AM"), sessionCard)
                    }
                    if (sessionInfo !== '7:00 pm') {
                        addButton("19h", time("07:00PM"), sessionCard)
                    }
                    break;
                case 'bike':
                    if (sessionInfo !== '9:00 am') {
                        addButton("9h", time("09:00AM"), sessionCard)
                    }
                    if (sessionInfo !== '5:00 pm') {
                        addButton("17h", time("05:00PM"), sessionCard)
                    }
                    break;
                case 'run':
                    if (sessionInfo !== '7:00 am') {
                        addButton("7h", time("07:00AM"), sessionCard)
                    }
                    if (sessionInfo !== '5:00 pm') {
                        addButton("17h", time("05:00PM"), sessionCard)
                    }
                    break;
                case 'strength':
                    if (sessionInfo !== '7:30 am') {
                        addButton("7h30", time("07:30AM"), sessionCard)
                    }
                    if (sessionInfo !== '5:15 pm') {
                        addButton("17h15", time("05:15PM"), sessionCard)
                    }
                    break;
            }

            addButton("🕥", askForTime, sessionCard);

            modified.push(sessionElement)
        }

        const body = document.querySelector('app-single-week');
        if (!modified.includes(body)) {
            addButton("Update calendar", triggerGHA, body);
            modified.push(body);
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

    // alert(response.statusText);
    window.location.reload();
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

// Expected JSON
// {"token":"GITHUB_PAT","owner":"github-username","repo":"repository-name","workflowId":"workflow-file.yml","ref":"branch-or-tag-name"}
function readGHAConfig() {
    const GHAConfigStr = localStorage.getItem('GHAConfig') || '{}';
    let config = JSON.parse(GHAConfigStr);
    for (let i = 0; i < 3; i++) {
        if (!config.token || !config.owner || !config.repo || !config.workflowId || !config.ref) {
            config = JSON.parse(prompt("Please enter GHA configuration as JSON "))
        } else {
            localStorage.setItem('GHAConfig', JSON.stringify(config));
            return config;
        }
    }
    localStorage.removeItem('GHAConfig');
    alert('GHA configuration incomplete, cannot proceed');
}

async function triggerGHA() {
    const {owner, ref, repo, token, workflowId} = readGHAConfig();
    const response = await axios.post(
        `https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflowId}/dispatches`,
        `{"ref":"${ref}"}`,
        {
            headers: {
                'Accept': 'application/vnd.github+json',
                'Authorization': `Bearer ${token}`,
                'X-GitHub-Api-Version': '2022-11-28',
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
    );

    if (response.ok) {
        alert('GHA workflow triggered successfully');
    } else {
        alert(`Error triggering GHA workflow: ${response.statusText} ${response.statusCode}`);
    }
}
