function updateTab(levelID, subjectID) {
    let tabID = `${levelID+"-"+subjectID}`
    let buttonID = "button-"+tabID;
    
    document.querySelectorAll(`#${levelID} .subject-tab`).forEach(p => {
        p.style.display = "none";
    });
    document.querySelectorAll(`#${levelID} .subject-button`).forEach(p => {
        p.classList.remove("active-subject-button");
    });
    document.getElementById(tabID).style.display = "block";
    document.getElementById(buttonID).classList.add("active-subject-button")
}

function formatFileSize(sizeInBytes) {
    if (sizeInBytes < 1024) {
        return sizeInBytes + " B";
    }
    if (sizeInBytes < 1024 * 1024) {
        return (sizeInBytes / 1024).toPrecision(3) + " KiB";
    }
    if (sizeInBytes < 1024 * 1024 * 1024) {
        let sizeInMegabytes = sizeInBytes / 1024 / 1024;
        return `${sizeInMegabytes.toPrecision(3)} MiB`;
    }
    let sizeInGigabytes = sizeInBytes / 1024 / 1024 / 1024;
    return `${sizeInGigabytes.toPrecision(3)} GiB`;
}

function displayDownloads(allSubjects) {
    let Body = document.getElementById("body-main");

    for (const level of allSubjects) {
        let levelDiv = document.createElement("div");
        Body.appendChild(levelDiv)
        levelDiv.classList.add("level-tabs");
        levelDiv.id = level["id"];

        let levelName = document.createElement("h2");
        levelDiv.appendChild(levelName);
        levelName.classList.add("level-tabs-title");
        levelName.innerHTML = level["name"];

        let barAndTabs = document.createElement("div");
        levelDiv.appendChild(barAndTabs)
        barAndTabs.classList.add("subject-select")

        let tabsBar = document.createElement("div");
        barAndTabs.appendChild(tabsBar);
        tabsBar.classList.add("subject-select-bar")

        for (const subject of level["subjects"]) {
            let selectButton = document.createElement("button");
            tabsBar.appendChild(selectButton);
            selectButton.classList.add("subject-button");
            selectButton.innerHTML = subject["name"];
            selectButton.onclick = function () {updateTab(level["id"], subject["id"])};
            selectButton.id = "button-" + level["id"] + "-" + subject["id"];

            let tab = document.createElement("div");
            barAndTabs.appendChild(tab);
            tab.classList.add("subject-tab");
            tab.id = `${level["id"]+"-"+subject["id"]}`;

            for (const version of subject["versions"]) {
                let versionDiv = document.createElement("div");
                tab.appendChild(versionDiv);
                versionDiv.classList.add("notes-version")
                let versionName = document.createElement("p");
                versionDiv.appendChild(versionName);
                versionName.innerHTML = version["name"];
                versionName.classList.add("notes-version-name")

                if (version["description"]) {
                    let versionDescription = document.createElement("p");
                    versionDiv.appendChild(versionDescription);
                    versionDescription.innerHTML = version["description"];
                }

                let authorListTitle = document.createElement("p");
                versionDiv.appendChild(authorListTitle);
                authorListTitle.innerHTML = `Authors: `;
                let authorList = document.createElement("ul");
                versionDiv.appendChild(authorList)
                for (const author of version["authors"]) {
                    let authorListItem = document.createElement("li");
                    authorList.appendChild(authorListItem);
                    authorListItem.innerHTML = "> " + author["name"];
                }
                authorList.classList.add("authors-list")

                let downloadListTitle = document.createElement("p");
                versionDiv.appendChild(downloadListTitle)
                downloadListTitle.innerHTML = `Download Options: <span class="filesize">(File Size: ${formatFileSize(version["size"])})</span>`;
                let downloadList = document.createElement("ul");
                versionDiv.appendChild(downloadList);
                downloadList.classList.add("download-list");

                for (const link of version["links"]) {
                    let linkItem = document.createElement("li");
                    downloadList.appendChild(linkItem);
                    linkItem.innerHTML = `&gt; <a href="${link["link"]}" target="_blank">${link["name"]}</a>`;
                }
            }
        }
    }
    let thisURL = new URL(window.location.href);
    let currentLevel = thisURL.searchParams.get("level");
    let currentSubject = thisURL.searchParams.get("subject");

    if (!currentLevel) {
        currentLevel = "A2-level";
    }
    if (!currentSubject) {
        currentSubject = "physics";
    }
    updateTab(currentLevel, currentSubject);
}

function changeSubjectButtonsLayout() {
    if (window.innerWidth < 800) {
        document.querySelectorAll(".subject-select-bar").forEach(p => {
            p.style.gridAutoFlow = "row dense";
        });
    } else {
        document.querySelectorAll(".subject-select-bar").forEach(p => {
            p.style.gridAutoFlow = "column dense";
        });
    }
}

changeSubjectButtonsLayout()
window.addEventListener('resize', changeSubjectButtonsLayout);


function getSubjectData(callback) {
    let req = new XMLHttpRequest();
    req.open("GET", "/dynamic/subjects.json");
    req.onload = function () {
        if (req.status == 200) {
            callback(JSON.parse(req.responseText));
        } else {
            console.log("Error: " + req.status);
        }
    }
    req.send();
}

getSubjectData(displayDownloads);