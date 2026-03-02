// ==UserScript==
// @name         Trigger github action
// @namespace    https://github.com/florianpasteur/tampermonkey-extensions
// @version      0.3
// @supportURL   https://github.com/florianpasteur/tampermonkey-extensions/issues
// @updateURL    https://raw.githubusercontent.com/florianpasteur/tampermonkey-extensions/main/garmin-connect/trigger-github-action.js
// @downloadURL  https://raw.githubusercontent.com/florianpasteur/tampermonkey-extensions/main/garmin-connect/trigger-github-action.js
// @description  Add a button to trigger a github action from courses screen
// @author       Florian Pasteur
// @match        https://connect.garmin.com/app/course/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=garmin.com
// @run-at       document-end
// @require      https://cdnjs.cloudflare.com/ajax/libs/axios/1.5.1/axios.min.js
// ==/UserScript==

// Work in progress


(function () {


    const actionsSelector = '.CourseDetailsFooter_actionsContainerInner__97NBP';

    const courseId = window.location.href.split('/').pop();

    const button = document.createElement("button");
    button.innerHTML = "Trigger GHA";
    button.style = "margin-left: 10px";
    button.onclick = async () => {
        debugger
        try {

            await triggerGHA({courseId, source: 'garmin'})
        } catch (error) {
            console.log("error triggering GHA", error);
            console.log("Fallvack to link");
            const {owner, ref, repo, token, workflowId} = readGHAConfig();
            const url = `https://github.com/${owner}/${repo}/actions/workflows/${workflowId}?query=${encodeURIComponent(`event:workflow_dispatch courseId:${courseId} source:garmin`)}`;
            window.open(url, '_blank');
        }
    }

    const intervalId = setInterval(() => {
        const actionsContainer = document.querySelector(actionsSelector);
        if (actionsContainer) {
            clearInterval(intervalId);
            actionsContainer.appendChild(button);
        }
    }, 500)



})();

// Expected JSON
// {"token":"GITHUB_PAT","owner":"github-username","repo":"repository-name","workflowId":"workflow-file.yml","ref":"branch-or-tag-name"}
function readGHAConfig() {
    const example = '{"token":"GITHUB_PAT","owner":"github-username","repo":"repository-name","workflowId":"workflow-file.yml","ref":"branch-or-tag-name"}'
    const GHAConfigStr = localStorage.getItem('GHAConfig') || '{}';
    let config = JSON.parse(GHAConfigStr);
    for (let i = 0; i < 3; i++) {
        if (!config.token || !config.owner || !config.repo || !config.workflowId || !config.ref) {

            config = JSON.parse(prompt(`Please enter GHA configuration as JSON. Example: ${example}`))
        } else {
            localStorage.setItem('GHAConfig', JSON.stringify(config));
            return config;
        }
    }
    localStorage.removeItem('GHAConfig');
    alert('GHA configuration incomplete, cannot proceed');
}

async function triggerGHA(args) {
    const {owner, ref, repo, token, workflowId} = readGHAConfig();
    debugger
    const response = await axios.post(
        `https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflowId}/dispatches`,
        `{"ref":"${ref}", "inputs" : ${JSON.stringify(args)}}`,
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
