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
// ==/UserScript==

(async function () {
    'use strict';

    GM_registerMenuCommand("Download manager report", async function (event) {
        console.log("Loading", axios);

        const bambooData = (await axios.get('https://backbase.bamboohr.com/employee_directory/ajax/get_directory_info')).data;
        const orgData = (await axios.get('https://backbase.bamboohr.com/employees/orgchart.php?pin')).data;

        const employees = await bambooDataToEmployees(bambooData, orgData);

        let tree = list_to_tree(employees);

        const columns = employees.map(e => {
            const managers = getManagers(e);
            return [
                e.firstName,
                e.lastName,
                e.email,
                e.department,
                ...managers.map(m => `${m.firstName} ${m.lastName}`).reverse()
            ].join(',')
        })

        const header = ["Firstname", "Lastname", "email", "Department", ...Array(10).fill(null).map((_, i) => "Manager " + i)].join(',');

        await exportResults([header, ...columns].join("\n"))


    }, {
        autoClose: true
    });
})();



function getManagers(employee) {
    const managers = [];
    while(employee.parent) {
        managers.push(employee.parent);
        employee = employee.parent;
    }
    return managers;
}


function list_to_tree(list) {
    var map = {}, node, roots = [], i;

    for (i = 0; i < list.length; i += 1) {
        map[list[i].personId] = i; // initialize the map
        list[i].children = []; // initialize the children
    }

    for (i = 0; i < list.length; i += 1) {
        node = list[i];
        if (!isNaN(node.supervisorID) && map[node.supervisorID]) {
            let parent = list[map[node.supervisorID]];
            parent.children.push(node);
            node.parent = parent;
        } else {
            roots.push(node);
        }
    }
    return roots;
}

async function bambooDataToEmployees(bambooData, orgData) {
    // const csvContent = (await fs.readFile(path.join(os.tmpdir(), 'general_bamboohr_org_chart.csv'))).toString();
    // const spreadsheet = csvContent.split("\n").slice(1, -1).map(csvLine => csvLine.split(','));
    //
    // return spreadsheet.map(row => ({
    //     personId: parseInt(row[0]),
    //     name: (row[1]).split('"').join(''),
    //     supervisorID: parseInt(row[2]),
    // })).map(employee => ({
    //     ...directory[employee.personId],
    //     ...employee
    // }));

    let scriptTag = new RegExp('<script type="application/json" id="orgchart__data_json">((.|\\n)*)</script>').exec(orgData);

    let orgTree = JSON.parse(scriptTag[1].split('</script>')[0]);
    let reduce = treeToArray(orgTree.OrgChart, "directReports").reduce((map, element) => map.set(element.id, element), new Map());
    bambooData.employees;
}

function treeToArray(tree, childrenKey) {
    const flat = [tree];
    (tree[childrenKey] || []).forEach(c => {
        flat.push(...treeToArray(c, childrenKey))
    });
    return flat;
}




async function exportResults(data) {
    await fs.writeFile('employees-with-all-managers.csv', data);
}