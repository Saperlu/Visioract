let data = {};
let seenScenes = {};

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
            text = document.getElementById("text");
            text.textContent = scene.text;
            break;
        case "video":
            // TODO : video case
            break;
        default:
            break;
    }

    // ChoiceBox
    // TODO : wait for the end of video
    scene.choices.forEach(choice => {
        const isChoiceToPrint = choice.conditions ? checkConditions(choice.conditions) : true;
        if (isChoiceToPrint) {
            let div = document.createElement("div");
            div.className = "choice";
            div.textContent = choice.label;
            div.onclick = handleChoice.bind(null, choice.sceneId);
            choiceBox.appendChild(div);
        }
    });
}

function checkConditions(conditions) {
    let isChoiceToPrint = true;
    conditions.forEach(condition => {
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