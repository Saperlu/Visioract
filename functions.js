let data = {};
let seenScenes = {};
let cacheChoiceBox = document.getElementById("cacheChoiceBox");
let choiceBox = document.getElementById("choiceBox");
let videoBox = document.getElementById("videoBox");
let textBox = document.getElementById("textBox");
let currentSceneType;


// TODO : Transitions between scenes

function loadData(callback) {
    let req = new XMLHttpRequest();
    req.open('GET', "data.json");
    req.send();
    req.onreadystatechange = () => {
        if (req.readyState === 4 && req.status === 200) {
            callback(JSON.parse(req.responseText));
        }
    }
}

function handleChoice(sceneId) {
    setupScene(sceneId);
}

function setupScene(sceneId) {
    // TODO : Remove this
    if (sceneId === "pKn_debut") {
        seenScenes = {};
    }

    let choiceBox = document.getElementById("choiceBox");
    clearNode(choiceBox);
    scene = data.scenes[sceneId];
    seenScenes[sceneId] = scene; // Put in seenScenes object;

    // Content
    switch (scene.type) {
        case "text": 
            // TODO transition if not text before
            clearSetup();
            cacheChoiceBox.style.zIndex = -1;
            choiceBox.style.display = "flex";
            textBox = document.createElement("div");
            textBox.id = "textBox";
            textBox.textContent = scene.text;
            videoBox.insertBefore(textBox, choiceBox);
            currentSceneType = scene.type;
            break;
            case "video":
                // TODO : video case
                clearSetup();
                currentSceneType = scene.type;
                video = document.createElement("video");
                video.src = `ressources/videos/${sceneId}.mp4`;
                video.type = "video/mp4";
                video.controls = true;
                video.autoplay = true;
                video.onended = (ev) => {
                    choiceBox.style.display = "flex";
                    let targetHeight = window.innerHeight - choiceBox.clientHeight + "px";
                    video.style.height = targetHeight;
                    cacheChoiceBox.style.height = choiceBox.clientHeight + "px";
                };
                video.ontransitionend = () => {
                    cacheChoiceBox.style.backgroundColor = "transparent";                      
                }
                
                videoBox.insertBefore(video, choiceBox);
                video.style.height = video.clientHeight + "px";

            
            break;
        default:
            break;
    }

    // ChoiceBox
    // TODO : wait for the end of video
    scene.choices.forEach(choice => {
        const isChoiceToPrint = choice.conditions ? checkConditions(sceneId, choice.conditions) : true;
        if (isChoiceToPrint) {
            let div = document.createElement("div");
            div.className = "choice";
            div.textContent = choice.label;
            div.onclick = handleChoice.bind(null, choice.sceneId);
            choiceBox.appendChild(div);
        }
    });
}


function clearSetup() {
    choiceBox.style.display = "none";
    cacheChoiceBox.style.backgroundColor = "black";
    switch (currentSceneType) {
        case "text":
            videoBox.removeChild(textBox);
            cacheChoiceBox.style.zIndex = 1;
            break;
        case "video":
            videoBox.removeChild(document.getElementsByTagName("video")[0]);
        default:
            break;
    }
}
        
function checkConditions(sceneId, conditions) {
    let isChoiceToPrint = true;
    conditions.forEach(condition => {
        if (condition.value === "*this") condition.value = sceneId;
        switch (condition.operator) {
            case "hasSeen":
                // User must have seen a particular scene
                if (!seenScenes[condition.value]) {
                    isChoiceToPrint = false;
                }
                break;
            case "hasNotSeen":
                // User must NOT have seen a particular scene
                if (seenScenes[condition.value]) {
                    isChoiceToPrint = false;
                }
                break;
        
            default:
                console.error("Wrong condition");
                console.error(condition);
                break;
        }
    });
    return isChoiceToPrint;
}

function clearNode(node) {
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
}   