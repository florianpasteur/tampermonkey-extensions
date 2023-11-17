# Tampermonkey Extensions

A collection of scripts for Tampermonkey.

# Installation

- Install the Tampermonkey extension from [this link](https://www.tampermonkey.net/index.php?locale=en).

Once the extension is installed, follow these steps to add a script:

- Browse this repository and select the script you'd like to install (refer to this documentation to find the corresponding script you need).
- On the script page, click on **Raw**.

![install-github-script.png](docs/install-github-script.png)

- Copy the URL to your clipboard.

![install-github-script-raw.png](docs/install-github-script-raw.png)

- Click on the extension icon in the browser.
- Select **Dashboard**.

![install-extension-utilities.png](docs/install-extension-popup.png)

- Go to the **Utilities tab**.
- Paste the URL into the **Import from URL** field.
- Click **Install**.

![install-extension-import-from-url.png](docs/install-extension-import-from-url.png)

On the confirmation screen, click **Install** (or Re-Install, Update).

![install-extension-install-confirm.png](docs/install-extension-install-confirm.png)

# Scripts

Below is the list of available scripts in this repository:

<!-- start-living-doc -->

## Download Manager Report // version 0.31 

Download manager hierarchy per user

[download-manager-hierarchy.js](bamboohr/download-manager-hierarchy.js)

![Screenshot for Download Manager Report](docs/download-manager-hierarchy.js.png)
----


## Workout extra data // version 0.2 

Adds more data to the workout preview in campus coach, such as pace, distance at the beginning of block

[workout-extra-data.js](campus-coach/workout-extra-data.js)


----


## Decathlon country links // version 0.5 

Create a link to jump between dutch and french website of decathlon on the same product

[decathlon-country-links.js](decathlon-country-links/decathlon-country-links.js)

![Screenshot for Decathlon country links](docs/decathlon-country-links.js.png)
----


## UserId on User search docebo // version 0.5 

Add user id on the search table of users

[user-id-on-users-search.js](docebo/user-id-on-users-search.js)

![Screenshot for UserId on User search docebo](docs/user-id-on-users-search.js.png)
----


## Rise Content Downloader // version 0.6 

Download rise course content as markdown files

[copy-lesson-content.js](rise/copy-lesson-content.js)


----


## Get rise-schema.json content // version 0.3 

Copy list of lessons to be paste on the rise-schema.json for a markdown-to-rise-import

[copy-rise-schema.js](rise/copy-rise-schema.js)

![Screenshot for Get rise-schema.json content](docs/copy-rise-schema.js.png)
----


## Rise insert wistia transcript // version 0.10 

Insert wistia transcript at caret

[insert-wistia-transcript.js](rise/insert-wistia-transcript.js)

![Screenshot for Rise insert wistia transcript](docs/insert-wistia-transcript.js.png)
----


## Edit page // version 0.8 

Make entire page editable, useful to change data before taking screenshot

[edit-html-page.js](utils/edit-html-page.js)


----


## Functions utils // version 0.7 

A collection of utils function to be used in the terminal or in a JS script

[functions.js](utils/functions.js)


----


## Insert code blocks // version 0.3 

If content is editable, insert styled code block

[insert-code-as-html.js](utils/insert-code-as-html.js)


----


## Insert html // version 0.2 

If content is editable, pop a textarea field and insert html at the caret.

[insert-html.js](utils/insert-html.js)


----


## Zwift Fan Activity watcher // version 0.3 

undefined

[activity-watcher.js](zwift/activity-watcher.js)


----

<!-- end-living-doc -->
