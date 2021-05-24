let data = {};
let seenScenes = {};

let clockBox = document.getElementById("clockBox");
let choiceBox = document.getElementById("choiceBox");
let videoBox = document.getElementById("videoBox");
let textBox = document.getElementById("textBox");
let timeLeft = new Date(2000, 0, 1, 0, 20);
let timeEnd = new Date(2000, 0, 1);
let isTimeToSet = false;
let previousSceneId = "";
let currentSceneId = "";
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
    clearSetup();
    currentSceneId = sceneId;
    currentSceneType = scene.type;
    if (scene.time || scene.time === 0)
        clockBox.className = "displayed";
    // Content
    switch (scene.type) {
        case "text": 
            // TODO transition if not text before
            choiceBox.style.display = "flex";
            choiceBox.style.opacity = 1;
            textBox = document.createElement("div");
            textBox.id = "textBox";
            textBox.textContent = scene.text;
            videoBox.insertBefore(textBox, choiceBox);
            break;
            case "video":
                video = document.createElement("video");
                video.src = `ressources/videos/${sceneId}.mp4`;
                video.type = "video/mp4";
                video.controls = true;
                video.autoplay = true;
                video.onended = (ev) => {
                    choiceBox.style.display = "flex";
                    let targetHeight = window.innerHeight - choiceBox.clientHeight + "px";
                    video.style.height = targetHeight;

                    choiceBox.style.opacity = 1;
                    if (scene.time)
                        setTimeLeft(scene.time);

                        
                };
                videoBox.insertBefore(video, choiceBox);
                video.style.height = video.clientHeight + "px";
            break;
            case "menu video":
                video = document.createElement("video");
                if (isTimeToSet && timeLeft - data.scenes[previousSceneId].time*1000 <= timeEnd) {
                    isTimeToSet = false;
                    video.style.display="none";
                    setTimeLeft(data.scenes[previousSceneId].time);
                } else {
                    video.src = `ressources/videos/${sceneId}.mp4`;
                    video.type = "video/mp4";
                    video.controls = false;
                    video.autoplay = true;
                    video.onplay = (ev) => {
                        if (isTimeToSet){
                            isTimeToSet = false;
                            setTimeLeft(data.scenes[previousSceneId].time);
                        }
                        choiceBox.style.display = "flex";
                        let targetHeight = window.innerHeight - choiceBox.clientHeight + "px";
                        video.style.height = targetHeight;
                        choiceBox.style.opacity = 1;
                        if (scene.time)
                        setTimeLeft(scene.time);
                    };
    
                    video.style.height = video.clientHeight + "px";
                }
                videoBox.insertBefore(video, choiceBox);
            break;
        default: 
            console.error(scene.type);
            break;
    }

    // ChoiceBox
    // TODO : wait for the end of video
    scene.choices.forEach(choice => {
        const isChoiceToPrint = choice.conditions ? checkConditions(choice.sceneId, choice.conditions) : true;
        if (isChoiceToPrint) {
            let div = document.createElement("div");
            div.className = "choice";
            div.textContent = choice.label;
            div.onclick = handleChoice.bind(null, choice.sceneId);
            choiceBox.appendChild(div);
            if (choice.autoChoice && currentSceneType === "video") {
                video.onended = () => {
                    previousSceneId = currentSceneId;
                    if (scene.time)
                        isTimeToSet = true;
                    handleChoice(choice.sceneId);
                }
            }
        }
    });
}


function clearSetup() {
    clockBox.className = "";
    choiceBox.style.display = "none";
    choiceBox.style.transitionProperty = "none";
    choiceBox.style.opacity = 0;
    choiceBox.style.transitionProperty = "opacity";
    switch (currentSceneType) {
        case "text":
            videoBox.removeChild(textBox);
            break;
        case "video":
            videoBox.removeChild(document.getElementsByTagName("video")[0]);
            break;
        case "menu video":
            videoBox.removeChild(document.getElementsByTagName("video")[0]);
            break;
        default:
            break;
    }
}
        
function checkConditions(choiceSceneId, conditions) {
    let isChoiceToPrint = true;
    conditions.forEach(condition => {
        if (condition.value === "*this") condition.value = choiceSceneId;
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

function setTimeLeft(timeTaken) {
    timeTaken *= 1000; // From milliseconds to seconds

    newTimeLeft = new Date(timeLeft - timeTaken);
    if (newTimeLeft <= timeEnd)
        newTimeLeft = timeEnd;


    for (let i = 1; i < 10; i++) {
        setTimeout(() => {
            if (getDizaines(timeLeft.getMinutes()) === getDizaines(newTimeLeft.getMinutes())) {
                if (getUnites(timeLeft.getMinutes()) === getUnites(newTimeLeft.getMinutes())) {
                    if (getDizaines(timeLeft.getSeconds()) === getDizaines(newTimeLeft.getSeconds())) {
                        if (getUnites(timeLeft.getMinutes()) === getUnites(newTimeLeft.getSeconds())) {
                            // On ne fait rien si le temps ne bouge pas
                        } else {
                            USecondes = randomDigit();
                        }   
                    } else {
                        DSecondes = randomDigit();
                        USecondes = randomDigit();
                    }
                } else {
                    UMinutes = randomDigit();
                    DSecondes = randomDigit();
                    USecondes = randomDigit();
                }
            } else {
                DMinutes = randomDigit();
                UMinutes = randomDigit();
                DSecondes = randomDigit();
                USecondes = randomDigit();
            }
            chaine = `${DMinutes}${UMinutes}:${DSecondes}${USecondes}`
            clockBox.textContent = chaine;
        }, i*100);
    }

    setTimeout(() => {
        timeLeft = newTimeLeft;
        DMinutes = getDizaines(timeLeft.getMinutes());
        UMinutes = getUnites(timeLeft.getMinutes());
        DSecondes = getDizaines(timeLeft.getSeconds());
        USecondes = getUnites(timeLeft.getSeconds());
        chaine = `${DMinutes}${UMinutes}:${DSecondes}${USecondes}`
        clockBox.textContent = chaine;
        if (timeLeft === timeEnd)
        {
            clockBox.className = "displayed animated";
            // TODO : Remplacer par accuser les suspects
            setTimeout(() => {
                handleChoice("pKn_alibi")
            }, 2500);
        }
    }, 1020);
}

function randomDigit () {
    return Number.parseInt(Math.random()*10);
} 
function getDizaines (n) {
    return Number.parseInt(n/10);
}

function getUnites (n) {
    return n%10;
}