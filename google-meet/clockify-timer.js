// ==UserScript==
// @name         Google Meet Clockify Timer
// @namespace    https://github.com/florianpasteur/tampermonkey-extensions
// @version      0.3
// @supportURL   https://github.com/florianpasteur/tampermonkey-extensions/issues
// @updateURL    https://raw.githubusercontent.com/florianpasteur/tampermonkey-extensions/main/google-meet/clockify-timer.js
// @downloadURL  https://raw.githubusercontent.com/florianpasteur/tampermonkey-extensions/main/google-meet/clockify-timer.js
// @description  Stop the current Clockify timer and start a new "Meeting" timer when joining a Google Meet call. Stop it when leaving.
// @author       Florian Pasteur
// @match        https://meet.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=meet.google.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @connect      api.clockify.me
// ==/UserScript==

(function () {
    'use strict';

    const CLOCKIFY_BASE_URL = 'https://api.clockify.me/api/v1';
    const MEETING_PROJECT_NAME = 'Professional Time';
    const MEETING_TASK_NAME = 'meeting';

    // --- Clockify API helpers ---

    function clockifyRequest(method, path, body) {
        return new Promise((resolve, reject) => {
            const apiKey = GM_getValue('clockify_api_key', '');
            if (!apiKey) {
                reject(new Error('Clockify API key not configured. Use the Tampermonkey menu to set it up.'));
                return;
            }
            GM_xmlhttpRequest({
                method,
                url: `${CLOCKIFY_BASE_URL}${path}`,
                headers: {
                    'X-Api-Key': apiKey,
                    'Content-Type': 'application/json',
                },
                data: body ? JSON.stringify(body) : undefined,
                onload(response) {
                    if (response.status >= 200 && response.status < 300) {
                        try {
                            resolve(response.responseText ? JSON.parse(response.responseText) : null);
                        } catch {
                            resolve(null);
                        }
                    } else {
                        reject(new Error(`Clockify API error ${response.status}: ${response.responseText}`));
                    }
                },
                onerror(err) {
                    reject(new Error(`Network error: ${JSON.stringify(err)}`));
                },
            });
        });
    }

    const api = {
        getUser: () => clockifyRequest('GET', '/user'),
        getWorkspaces: () => clockifyRequest('GET', '/workspaces'),
        getProjects: (workspaceId) =>
            clockifyRequest('GET', `/workspaces/${workspaceId}/projects?page-size=500&archived=false`),
        getTasks: (workspaceId, projectId) =>
            clockifyRequest('GET', `/workspaces/${workspaceId}/projects/${projectId}/tasks?page-size=500&is-active=true`),
        stopCurrentTimer: (workspaceId, userId) =>
            clockifyRequest('PATCH', `/workspaces/${workspaceId}/user/${userId}/time-entries`, {
                end: new Date().toISOString(),
            }),
        startTimer: (workspaceId, projectId, taskId, description) =>
            clockifyRequest('POST', `/workspaces/${workspaceId}/time-entries`, {
                start: new Date().toISOString(),
                projectId,
                taskId,
                description,
            }),
    };

    // --- Setup ---

    async function runSetup() {
        const apiKey = prompt('Enter your Clockify API key (found in Clockify → Profile Settings → API):');
        if (!apiKey || !apiKey.trim()) return;

        GM_setValue('clockify_api_key', apiKey.trim());

        try {
            const user = await api.getUser();
            const workspaces = await api.getWorkspaces();

            if (!workspaces || workspaces.length === 0) {
                alert('No Clockify workspaces found. Check your API key.');
                return;
            }

            const workspaceId = user.defaultWorkspace || workspaces[0].id;
            const userId = user.id;

            const projects = await api.getProjects(workspaceId);
            const meetingProject = projects.find(
                (p) => p.name.toLowerCase() === MEETING_PROJECT_NAME.toLowerCase()
            );

            if (!meetingProject) {
                alert(
                    `Project "${MEETING_PROJECT_NAME}" not found in your Clockify workspace.\n` +
                    `Please create a project named exactly "${MEETING_PROJECT_NAME}" and run setup again.`
                );
                return;
            }

            const tasks = await api.getTasks(workspaceId, meetingProject.id);
            const meetingTask = tasks.find(
                (t) => t.name.toLowerCase() === MEETING_TASK_NAME.toLowerCase()
            );

            if (!meetingTask) {
                alert(
                    `Task "${MEETING_TASK_NAME}" not found in project "${MEETING_PROJECT_NAME}".\n` +
                    `Please create a task named exactly "${MEETING_TASK_NAME}" and run setup again.`
                );
                return;
            }

            GM_setValue('clockify_workspace_id', workspaceId);
            GM_setValue('clockify_user_id', userId);
            GM_setValue('clockify_meeting_project_id', meetingProject.id);
            GM_setValue('clockify_meeting_task_id', meetingTask.id);

            alert(
                `Clockify configured!\n` +
                `Workspace: ${workspaces.find((w) => w.id === workspaceId)?.name}\n` +
                `Project: ${meetingProject.name}\n` +
                `Task: ${meetingTask.name}`
            );
        } catch (e) {
            alert(`Setup failed: ${e.message}`);
        }
    }

    GM_registerMenuCommand('Configure Clockify API Key', runSetup);

    // --- Notification toast ---

    function showToast(message, isError = false) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${isError ? '#d93025' : '#1a73e8'};
            color: #ffffff;
            padding: 12px 18px;
            border-radius: 8px;
            font-family: 'Google Sans', sans-serif;
            font-size: 14px;
            font-weight: 500;
            z-index: 99999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.25);
            transition: opacity 0.4s ease;
            opacity: 1;
        `;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 400);
        }, 4000);
    }

    // --- Meeting lifecycle ---

    let meetingActive = false;

    async function onMeetingJoined() {
        if (meetingActive) return;
        meetingActive = true;

        const workspaceId = GM_getValue('clockify_workspace_id', '');
        const userId = GM_getValue('clockify_user_id', '');
        const projectId = GM_getValue('clockify_meeting_project_id', '');
        const taskId = GM_getValue('clockify_meeting_task_id', '');

        if (!workspaceId || !userId || !projectId || !taskId) {
            console.warn('[Clockify Meet] Not configured. Use the Tampermonkey menu → Configure Clockify API Key.');
            return;
        }

        const meetingTitle = document.title.replace(' - Google Meet', '').trim() || 'Meeting';

        try {
            await api.stopCurrentTimer(workspaceId, userId);
            console.log('[Clockify Meet] Previous timer stopped.');
        } catch (e) {
            console.warn('[Clockify Meet] Could not stop previous timer (none may be running):', e.message);
        }

        try {
            await api.startTimer(workspaceId, projectId, taskId, meetingTitle);
            console.log('[Clockify Meet] Meeting timer started.');
            showToast(`Clockify: Meeting timer started`);
        } catch (e) {
            console.error('[Clockify Meet] Failed to start meeting timer:', e.message);
            showToast(`Clockify error: ${e.message}`, true);
        }
    }

    async function onMeetingLeft() {
        if (!meetingActive) return;
        meetingActive = false;

        const workspaceId = GM_getValue('clockify_workspace_id', '');
        const userId = GM_getValue('clockify_user_id', '');

        if (!workspaceId || !userId) return;

        try {
            await api.stopCurrentTimer(workspaceId, userId);
            console.log('[Clockify Meet] Meeting timer stopped.');
            showToast('Clockify: Meeting timer stopped');
        } catch (e) {
            console.warn('[Clockify Meet] Could not stop meeting timer:', e.message);
        }
    }

    // --- Google Meet join detection ---
    // The "Leave call" button only appears once the user has actually joined the meeting.
    // We watch for it via a MutationObserver on the whole body.

    const LEAVE_BUTTON_SELECTORS = [
        '[aria-label="Leave call"]',
        '[data-tooltip="Leave call"]',
        '[jsname="CQylAd"]',
    ].join(', ');

    function isLeaveButtonVisible() {
        return !!document.querySelector(LEAVE_BUTTON_SELECTORS);
    }

    const observer = new MutationObserver(() => {
        if (isLeaveButtonVisible()) {
            if (!meetingActive) onMeetingJoined();
        } else {
            if (meetingActive) onMeetingLeft();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Handle the case where the page already has the leave button on load
    if (isLeaveButtonVisible()) {
        onMeetingJoined();
    }
})();
