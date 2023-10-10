// ==UserScript==
// @name         Download manager hierarchy
// @namespace    https://github.com/florianpasteur/tampermonkey-extensions
// @version      0.1
// @description  Download manager hierarchy per user
// @author       Florian Pasteur
// @match        https://backbase.bamboohr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=backbase.com
// @grant        GM_registerMenuCommand
// @require      https://cdnjs.cloudflare.com/ajax/libs/axios/1.5.1/axios.min.js
// @require     https://raw.githubusercontent.com/eligrey/FileSaver.js/master/dist/FileSaver.min.js
// ==/UserScript==

(async function () {
    'use strict';

    GM_registerMenuCommand("Download manager report", async function (event) {
        console.log("Loading");

        const bambooData = await getBambooData();
        const orgData = await getOrgData();

        const employees =  mergeBambooDataAndOrgData(bambooData, orgData);

        const columns = employees.map(e => {
            return [
                e.firstName,
                e.lastName,
                e.email,
                e.department,
                ...e.managers.map(m => `${m.name}`).reverse()
            ].join(',')
        })

        const header = ["Firstname", "Lastname", "email", "Department", ...Array(10).fill(null).map((_, i) => "Manager " + i)].join(',');

        await exportResults([header, ...columns].join("\n"))


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