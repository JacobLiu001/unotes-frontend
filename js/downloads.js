function changeSubjectButtonsLayout() {
    console.log("Hello!")
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
window.addEventListener('resize', changeSubjectButtonsLayout);

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

function getData(callback, url) {
    let req = new XMLHttpRequest();
    req.open("GET", url);
    req.onload = function () {
        if (req.status == 200) {
            let res = JSON.parse(req.responseText);
            callback(res);
        } else {
            console.log("Error: " + req.status);
        }
    }
    req.send();
}


function updateTab(level, subject) {
    document.querySelectorAll(".active-subject-button").forEach(p => {
        p.classList.remove("active-subject-button");
    });
    document.getElementById(`button-${level}-${subject}`)
    .classList.add("active-subject-button");
    let noteVersionBox = document.getElementById(`notes-versions-${level}`);
    noteVersionBox.innerHTML = `<p class="temp">Loading...</p>`;
    function fillNoteVersionBox(versions) {
        noteVersionBox.innerHTML = "";
        for (const version of versions) {
            let versionDiv = document.createElement("div");
            versionDiv.classList.add("notes-version");
            noteVersionBox.appendChild(versionDiv)
            let versionName = document.createElement("p");
            versionName.innerHTML = version["name"];
            versionName.classList.add("notes-version-name");
            versionDiv.appendChild(versionName);
            let versionDescription = document.createElement("p");
            versionDescription.innerHTML = version["description"];
            versionDiv.appendChild(versionDescription);
            let authorsListTitle = document.createElement("p");
            authorsListTitle.innerHTML = "Authors: ";
            versionDiv.appendChild(authorsListTitle);
            let authorsList = document.createElement("ul");
            versionDiv.appendChild(authorsList);
            authorsList.classList.add("authors-list");
            for (const author of version["authors"]) {
                let authorEntry = document.createElement("li");
                authorEntry.innerHTML = `&gt; ${author["name"]}`;
                authorsList.appendChild(authorEntry);
            }
            let downloadOptions = document.createElement("p");
            downloadOptions.innerHTML = `Download Options: `;
            downloadOptions.innerHTML += `<span class="filesize">(File Size: ${formatFileSize(version["size"])})</span>`
            versionDiv.appendChild(downloadOptions);
            let downloadList = document.createElement("ul");
            versionDiv.appendChild(downloadList);
            downloadList.classList.add("download-list");
            for (const link of version["links"]) {
                let downloadEntry = document.createElement("li");
                downloadEntry.innerHTML = `&gt; <a href="${link["url"]}" target="_blank">${link["name"]}</a>`;
                downloadList.appendChild(downloadEntry);
            }
        }
    }
    getData(fillNoteVersionBox,
        `/dynamic/versions?level=${level}&subject=${subject}`);
}

function addLevelTabs(levels) {
    for (const level of levels) {
        // If you are reading this and being annoyed at why I used client-side
        // JS to render this, I am sorry. My server is a potato and probably
        // can't handle the load of rendering every page into HTML.
        let levelTab = document.createElement("div");
        levelTab.classList.add("level-tabs");
        levelTab.id = level["id"];
        document.getElementById("body-main").appendChild(levelTab);
        let levelTabTitle = document.createElement("h2");
        levelTabTitle.innerHTML = level["name"];

        levelTabTitle.classList.add("level-tabs-title");
        levelTab.appendChild(levelTabTitle);

        let subjectSelect = document.createElement("div");
        subjectSelect.classList.add("subject-select");
        levelTab.appendChild(subjectSelect);

        let subjectSelectBar = document.createElement("div");
        subjectSelectBar.classList.add("subject-select-bar");
        subjectSelect.appendChild(subjectSelectBar);

        let notesVersions = document.createElement("div");
        notesVersions.classList.add("notes-versions");
        notesVersions.id = `notes-versions-${level["id"]}`;
        subjectSelect.appendChild(notesVersions);
        notesVersions.innerHTML = "<p>Click on a subject above.</p>"

        for (const subject of level["subjects"]) {
            let subjectButton = document.createElement("button");
            subjectButton.classList.add("subject-button");
            subjectButton.id = `button-${level["id"]}-${subject["id"]}`;
            subjectButton.innerHTML = subject["name"];
            subjectSelectBar.appendChild(subjectButton);
            subjectButton.addEventListener("click", function () {
                 updateTab(level["id"], subject["id"]);
            });
        }
    }
    changeSubjectButtonsLayout();
}

getData(addLevelTabs, "/dynamic/levels?width=" + window.innerWidth);
