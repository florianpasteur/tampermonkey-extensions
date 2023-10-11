// ==UserScript==
// @name         Download manager hierarchy
// @namespace    https://github.com/florianpasteur/tampermonkey-extensions
// @version      0.3
// @description  Download manager hierarchy per user
// @author       Florian Pasteur
// @match        https://backbase.bamboohr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=backbase.com
// @grant        GM_registerMenuCommand
// @require      https://cdnjs.cloudflare.com/ajax/libs/axios/1.5.1/axios.min.js
// @require     https://raw.githubusercontent.com/eligrey/FileSaver.js/master/dist/FileSaver.min.js
// ==/UserScript==

(function () {
    'use strict';

    GM_registerMenuCommand("Download manager report", async function (event) {
        console.log("Loading");
        const overlay = showOverlay();

        try {

        const bambooData = await getBambooData();
        const orgData = await getOrgData();

        const employees =  mergeBambooDataAndOrgData(bambooData, orgData);

        const columns = employees.map(e => {
            return [
                e.firstName,
                e.lastName,
                e.email,
                e.department,
                ...e.managers.slice(1).map(m => `${m.name}`).reverse()
            ].join(',')
        })

        const header = ["Firstname", "Lastname", "email", "Department", ...Array(10).fill(null).map((_, i) => "Manager " + i)].join(',');

        await exportResults([header, ...columns].join("\n"))


        } catch (e) {

        hideOverlay(overlay);
        const htmlDivElement = showErrorOverlay();
        setTimeout(() => hideOverlay(htmlDivElement), 2000)
        }
        hideOverlay(overlay);


    }, {
        autoClose: true
    });
})();


async function getBambooData() {
    return (await axios.get('https://backbase.bamboohr.com/employee_directory/ajax/get_directory_info')).data;
}


async function getOrgData() {
    const orgData = (await axios.get('https://backbase.bamboohr.com/employees/orgchart.php?pin')).data;
    let scriptTag = new RegExp('<script type="application/json" id="orgchart__data_json">((.|\\n)*)</script>').exec(orgData);

    let orgTree = JSON.parse(scriptTag[1].split('</script>')[0]);

    const linkedOrgChart = transformToDoubleLinkedListAndReturnAllElements(orgTree.OrgChart);
    return linkedOrgChart;
}

function transformToDoubleLinkedListAndReturnAllElements(tree) {
    const flat = [tree]
    const directReports = tree.directReports || [];
    for (let directReport of directReports) {
        directReport.parent = tree;
        flat.push(...transformToDoubleLinkedListAndReturnAllElements(directReport))
    }
    return flat;
}

function mergeBambooDataAndOrgData(bambooData, orgData) {
    const orgDataPerId = orgData.reduce((map, e) => {
        map.set(parseInt(e.id), e);
        return map;
    }, new Map());
    return bambooData.employees.map(e => {
        const employeeInOrgChart = orgDataPerId.get(e.id);
        return {
            ...e,
            ...employeeInOrgChart,
            managers: getManagers(employeeInOrgChart)
        }
    })
}

function getManagers(employee) {
    const managers = [];
    while(employee && employee.parent) {
        managers.push(employee.parent);
        employee = employee.parent;
    }
    return managers;
}

async function exportResults(data) {
    var blob = new Blob([data], {type: "text/plain;charset=utf-8"});
    saveAs(blob, 'employees-with-all-managers.csv');
}

function showOverlay() {
    // Create the overlay element
    const overlay = document.createElement('div');
    overlay.style.display = 'none';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    overlay.style.zIndex = '9999';

    // Create the loader element
    const loader = document.createElement('div');
    loader.style.position = 'absolute';
    loader.style.top = '50%';
    loader.style.left = '50%';
    loader.style.transform = 'translate(-50%, -50%)';
    loader.style.border = '4px solid #f3f3f3';
    loader.style.borderTop = '4px solid #3498db';
    loader.style.borderRadius = '50%';
    loader.style.width = '50px';
    loader.style.height = '50px';
    loader.style.animation = 'spin 2s linear infinite';

    // Create the keyframes for the loading animation
    const keyframes = document.createElement('style');
    keyframes.innerHTML = `
        @keyframes spin {
            0% { transform: translate(-50%, -50%) rotate(0deg); }
            100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
    `;

    // Append the loader and keyframes to the overlay
    overlay.appendChild(loader);
    overlay.appendChild(keyframes);

    // Append the overlay to the body
    document.body.appendChild(overlay);

    // Display the overlay
    overlay.style.display = 'block';

    return overlay
}
function showErrorOverlay() {
    // Create the overlay element
    const overlay = document.createElement('div');
    overlay.style.display = 'none';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    overlay.style.zIndex = '9999';

    // Create the loader element
    const loader = document.createElement('div');
    loader.style.position = 'absolute';
    loader.style.top = '50%';
    loader.style.left = '50%';
    loader.style.fontSize = '10em';
    loader.innerText = '⚠️';


    // Append the loader and keyframes to the overlay
    overlay.appendChild(loader);

    // Append the overlay to the body
    document.body.appendChild(overlay);

    // Display the overlay
    overlay.style.display = 'block';

    return overlay
}

// Function to hide and remove the overlay
function hideOverlay(overlay) {
    if (overlay) {
        document.body.removeChild(overlay);
    }
}
