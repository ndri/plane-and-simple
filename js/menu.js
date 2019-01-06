function onLoad() {
    gameState = gameStates.mainMenu;

    document.body.addEventListener("keypress", function(e) {
        if (e.key === "Escape") {
            if (gameState === gameStates.playing) {
                document.getElementById("pauseMenu").classList.remove("hidden");
                gameState = gameStates.paused;
            } else if (gameState === gameStates.paused) {
                document.getElementById("pauseMenu").classList.add("hidden");
                document.getElementById("settingsMenu").classList.add("hidden");
                gameState = gameStates.playing;
            }
        }
    });
}

function startClicked() {
    const mainMenu = document.getElementById("mainMenu");
    const loading = document.getElementById("loading");

    // TODO: Loading screen doesn't show up while loadGame() is happening :(
    loading.classList.remove("hidden");

    mainMenu.classList.add("hidden");



    loadGame();
}

function resumeClicked() {
    const pauseMenu = document.getElementById("pauseMenu");
    pauseMenu.classList.add("hidden");

    gameState = gameStates.playing;
}

function backToMainMenuClicked() {
    const pauseMenu = document.getElementById("pauseMenu");
    const mainMenu = document.getElementById("mainMenu");
    
    const myCanvasContainer = document.getElementById("myCanvasContainer");
    const canvas = document.querySelector("canvas");
    myCanvasContainer.removeChild(canvas);
    myCanvasContainer.appendChild(document.createElement("canvas"));

    pauseMenu.classList.add("hidden");
    mainMenu.classList.remove("hidden");

    gameState = gameStates.mainMenu;
}

function reloadClicked() {
    backToMainMenuClicked();
    startClicked();
}

function settingsClicked() {
    const mainMenu = document.getElementById("mainMenu");
    const pauseMenu = document.getElementById("pauseMenu");
    const settingsMenu = document.getElementById("settingsMenu");

    mainMenu.classList.add("hidden");
    pauseMenu.classList.add("hidden");
    settingsMenu.classList.remove("hidden");

    loadSettings("config");
}

function loadSettings(properties) {
    const settingsButtons = document.getElementById("settingsButtons");
    const settingsPath = document.getElementById("settingsPath");
    const backButton = document.getElementById("backButton");

    settingsButtons.innerHTML = "";
    settingsPath.innerHTML = properties;

    let settings = config;
    let meta = metaconfig;
    let path = properties.split(".");

    path.shift();

    for (let property of path) {
        settings = settings[property];
        meta = meta[property];
    }

    for (let key of Object.keys(settings)) {
        if (settings[key].constructor.name === "Object") {
            let button = document.createElement("button");

            button.onclick = function() {
                loadSettings(properties + "." + key);
            };
            button.innerHTML = key;
            settingsButtons.appendChild(button);
        } else {
            let line = document.createElement("p");

            let label = document.createElement("label");
            label.htmlFor = key;
            label.innerHTML = key + ": ";

            let input = document.createElement("input");
            input.id = key;

            if (meta[key].type === "number") {
                input.type = "number";
                input.value = settings[key];

                if (meta[key].step) {
                    input.step = meta[key].step;
                }
                if (meta[key].min) {
                    input.min = meta[key].min;
                }
                if (meta[key].max) {
                    input.max = meta[key].max;
                }
            } else if (meta[key].type === "enum") {
                input = document.createElement("select");
                input.id = key;

                for (let enumKey of Object.keys(meta[key].enumObject)) {
                    let option = document.createElement("option");
                    option.value = meta[key].enumObject[enumKey];
                    option.innerHTML = enumKey;
                    if (settings[key] === option.value) {
                        option.selected = "selected";
                    }
                    input.appendChild(option);
                }
            } else if (meta[key].type === "boolean") {
                input.type = "checkbox";
                input.checked = settings[key];
            } else if (meta[key].type === "text") {
                input.value = settings[key];
            }

            input.oninput = function() {
                if (input.type === "checkbox") {
                    settings[key] = input.checked;
                } else {
                    settings[key] = input.value;
                }
            };

            line.appendChild(label);
            line.appendChild(input);
            settingsButtons.appendChild(line);
        }
    }

    backButton.onclick = function () {
        let path = properties.split(".");
        path.pop();

        if (path.length > 0) {
            loadSettings(path.join("."));
        } else {
            if (gameState === gameStates.paused) {
                document.getElementById("pauseMenu").classList.remove("hidden");
            } else if (gameState === gameStates.mainMenu) {
                document.getElementById("mainMenu").classList.remove("hidden");
            }
            document.getElementById("settingsMenu").classList.add("hidden");
        }
    }
}


function updateLoading(progress, message) {
    console.log(progress, message);

    const loaded = document.getElementById("loadedBox");
    const loadingMessage = document.getElementById("loadingMessage");

    if (progress >= 100) {
        const loading = document.getElementById("loading");
        loading.classList.add("hidden");
        loaded.style.width = 0;
        loadingMessage.innerText = "";
    }

    loaded.style.width = progress + "%";
    loadingMessage.innerText = message;
}