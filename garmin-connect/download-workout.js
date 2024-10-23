// ==UserScript==
// @name         Download workout
// @namespace    https://github.com/florianpasteur/tampermonkey-extensions
// @version      0.2
// @supportURL   https://github.com/florianpasteur/tampermonkey-extensions/issues
// @updateURL    https://raw.githubusercontent.com/florianpasteur/tampermonkey-extensions/main/garmin-connect/download-workout.js
// @downloadURL  https://raw.githubusercontent.com/florianpasteur/tampermonkey-extensions/main/garmin-connect/download-workout.js
// @description  Adds an action icon to download the workout in garmin connect
// @author       Florian Pasteur
// @match        https://connect.garmin.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=garmin.com
// @require      https://raw.githubusercontent.com/eligrey/FileSaver.js/master/dist/FileSaver.min.js
// ==/UserScript==

(function () {
    debugger
    const processed = new Set();

    setInterval(() => {
        debugger
        document.querySelectorAll('.workout-actions').forEach(e => {
            if (processed.has(e)) return;
            processed.add(e);
            const downloadButton = document.createElement("button");
            downloadButton.innerHTML = "<i class=\"icon-download\"></i>";
            downloadButton.style = "margin-left: 10px";
            downloadButton.onclick = async () => {
                const item = JSON.stringify(localStorage.getItem('token'));
                console.log(item);
                const workoutId = e.querySelector('span').dataset.id;

               const response = await fetch("https://connect.garmin.com/workout-service/workout/" + workoutId, {
                    "headers": {
                        "accept": "application/json, text/javascript, */*; q=0.01",
                        "accept-language": "en-GB,en-US;q=0.9,en;q=0.8,fr;q=0.7",
                        "authorization": "Bearer " + item.access_token,

                    },
                    "referrer": "https://connect.garmin.com/modern/workouts",
                    "referrerPolicy": "strict-origin-when-cross-origin",
                    "body": null,
                    "method": "GET",
                    "mode": "cors",
                    "credentials": "include"
                });

                console.log(await response.json());

                var file = new File(["Hello, world!"], "hello world.txt", {type: "text/plain;charset=utf-8"});
                FileSaver.saveAs(file);

            }
            e.prepend(downloadButton);

        });
    }, 500)
})();

