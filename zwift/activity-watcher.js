// ==UserScript==
// @name         Zwift Fan Activity watcher
// @namespace    https://github.com/florianpasteur/tampermonkey-extensions
// @version      0.2
// @description  Turn on and off Zwift fan when Zwift activity detected
// @author       Florian Pasteur
// @match        https://www.zwiftgps.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zwift.com
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/axios/1.5.1/axios.min.js
// @require      https://raw.githubusercontent.com/florianpasteur/tampermonkey-extensions/main/utils/functions.js
// ==/UserScript==

window.save = function (data, name = 'browserAutomation') {
    localStorage.setItem(name, JSON.stringify(data));
};

window.load = function (name = 'browserAutomation') {
    return JSON.parse(localStorage.getItem(name));
};

(function () {
    const fanIp = load('fanIp');

    if (!fanIp) {
        const fanIp = prompt("What's the IP of the fan");
        if (parseInt(fanIp)) {
            save(fanIp, 'fanIp');
            location.reload();
        }
    } else {
        let status = 'NOT_STARTED'

        const watcher = setInterval(async () => {
            const response = await axios.get('https://www.zwiftgps.com/world/');
            const positions = response.data.positions;
            if (positions && positions[0]) {
                if (status === 'NOT_STARTED') {
                    await Promise.all([on(0), off(1), off(2)])
                    status = 'STARTED'
                }
            } else {
                if (status === 'STARTED') {
                    await Promise.all([off(0), off(1), off(2)])
                    status = 'OVER'
                }
            }
            if (status === 'OVER') {
                clearInterval(watcher);
            }
        }, 2500);
    }

    async function toggle(relayIndex) {
        return (await axios.get(`http://${fanIp}`, {
            params: {
                'm': '1',
                'o': `${relayIndex+1}`
            },
        })).data.match(/ON|OFF/g).map(onOff => onOff === "ON");
    }

    async function getStatus() {
        const axiosResponse = await axios.get(`http://${fanIp}`, {
            params: {
                'm': '1',
            },
        });
        return axiosResponse.data.match(/ON|OFF/g).map(onOff => onOff === "ON");
    }

    async function on(index) {
        const isOn = (await getStatus())[index];
        if (!isOn) {
            await toggle(index)
        }
    }

    async function off(index) {
        const isOn = (await getStatus())[index];
        if (isOn) {
            await toggle(index)
        }
    }
})();

