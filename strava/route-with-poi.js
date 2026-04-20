// ==UserScript==
// @name         Modify POST Requests
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Intercept and modify POST requests
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=strava.com
// ==/UserScript==

(function () {
    'use strict';

    const categories = ["Restroom"
        , "WaterSource"
        , "Generic"
        , "Parking"
        , "Monument"
        , "Park"
        , "Peak"
        , "Beach"
        , "Viewpoint"
        , "Art"
        , "Restaurant"
        , "Bar"
        , "BikeShop"
        , "Grocery"
        , "Pharmacy"
        , "CampSite"
        , "Attraction"
        , "Trailhead"
        , "AidStation"
        , "TransitionZone"
        , "Checkpoint"
        , "MeetingSpot"
        , "RestArea"
        , "Alert"
        , "Lodging"
        , "GasStation"
        , "Coffee"
        , "DistanceMarker"
        , "SegmentStart"
        , "SegmentEnd"];


    const originalFetch = window.fetch;

    window.fetch = async function (input, init) {
        if (init && init.method === 'POST') {
            console.log('Original request:', init);

            // Example: modify JSON body
            if (init.body && typeof init.body === 'string') {
                try {
                    let data = JSON.parse(init.body);

                    data.modifiedByTampermonkey = true;
                    if (data.operationName !== "WebMapsUpdateRoute") {
                        console.log("Not the expected operation, skipping modification");
                        return originalFetch.apply(this, arguments);
                    }

                    const element = data.variables.elements[0];
                    data.variables.elements[1] = {
                        ...element,
                        "elementType": "Waypoint",
                        "waypoint": {
                            ...element.waypoint,
                            "metadata": {
                                "title": "Generated waypoint " + new Date().getTime(),
                                "geocodedTitle": null,
                                "description": "",
                                "categories": [
                                    pickRandom(categories)
                                ],
                                "targetPoint": null
                            }
                        }
                    };

                    data.variables.elements.push({
                        "elementType": "Waypoint",
                        "waypoint": {
                            "points": {
                                "lat":	52.31023,
                                "lng":	5.03506
                            },
                            "metadata": {
                                "title": "Generated waypoint " + new Date().getTime(),
                                "geocodedTitle": null,
                                "description": "",
                                "categories": [
                                    pickRandom(categories)
                                ],
                                "targetPoint": null
                            }
                        }
                    });

                    // // Modify the payload

                    init.body = JSON.stringify(data);

                    console.log('Modified request body:', init.body);
                } catch (e) {
                    console.log('Not JSON, skipping modification', e);
                }
            }
        }

        return originalFetch.apply(this, arguments);
    };
})();


function pickRandom(array) {
    return array[Math.floor(Math.random() * array.length)];
}


