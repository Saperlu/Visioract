let data = {};
let seenScenes = {};

let clockBox = document.getElementById("clockBox");
let choiceBox = document.getElementById("choiceBox");
let videoBox = document.getElementById("videoBox");
let textBox = document.getElementById("textBox");
let pointAndClickBox = document.getElementById("pointAndClickBox");


let timeLeft = new Date(2000, 0, 1, 0, 20);
let timeEnd = new Date(2000, 0, 1);
let isTimeToSet = false;

let scene;
let previousSceneId = "";
let currentSceneId = "";
let currentSceneType;



function loadData(callback) {
    let req = new XMLHttpRequest();
    req.open('GET', "data.JSON");
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

async function setupScene(sceneId) {
    // TODO : Remove this
    if (sceneId === "p1n_debut") {
        seenScenes = {};
    }

    let choiceBox = document.getElementById("choiceBox");
    clearNode(choiceBox);
    scene = data.scenes[sceneId];
    seenScenes[sceneId] = scene; // Put in seenScenes object;
    await clearSetup();
    currentSceneId = sceneId;
    currentSceneType = scene.type;
    // Content
    switch (scene.type) {
        case "text": 
            choiceBox.style.display = "flex";
            choiceBox.style.opacity = 1;
            textBox = document.createElement("div");
            textBox.id = "textBox";
            textBox.textContent = scene.text;
            videoBox.insertBefore(textBox, choiceBox);
            break;
            case "video":
                video = document.createElement("video");
                if (scene.time !== undefined && (scene.timeDisplayed || scene.timeNotDisplayed)) {
                    video.ontimeupdate = (e) => {
                        vTime=video.currentTime;
                        let notDisplayedTs = -1;
                        let displayedTs = -1;
                        let displayedAnimatedBeginTs = -1;
                        let displayedAnimatedEndTs = -1;
                        if (scene.timeDisplayed)
                            scene.timeDisplayed.forEach(v => {
                                if (v <= vTime) {
                                    displayedTs = v; 
                                }
                            });
                        if (scene.timeNotDisplayed)
                            scene.timeNotDisplayed.forEach(v => {
                                if (v <= vTime) {
                                    notDisplayedTs = v;   
                                }
                            });
                        if (scene.timeDisplayedAnimatedBegin)
                            scene.timeDisplayedAnimatedBegin.forEach(v => {
                                if (v <= vTime) {
                                    displayedAnimatedBeginTs = v;   
                                }
                            });
                        if (scene.timeDisplayedAnimatedEnd)
                            scene.timeDisplayedAnimatedEnd.forEach(v => {
                                if (v <= vTime) {
                                    displayedAnimatedEndTs = v;   
                                }
                            });
                        switch (Math.max(displayedTs, notDisplayedTs, displayedAnimatedBeginTs, displayedAnimatedEndTs)) {
                            case displayedTs:
                                clockBox.className = "displayed";
                                break;
                            case notDisplayedTs:
                                clockBox.className = "";
                                break;
                            case displayedAnimatedBeginTs:
                                clockBox.className = "displayed animatedBegin";
                                break;
                            case displayedAnimatedEndTs:
                                clockBox.className = "displayed animatedEnd";
                                break;
                            default:
                                break;
                        }
                    }
                } else if (scene.time !== undefined) {
                    clockBox.className = "displayed";
                }
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
                if (scene.time !== undefined)
                    clockBox.className = "displayed";
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
            case "point and click":
                let req = new XMLHttpRequest();
                req.open('GET', `ressources/html/${sceneId}.html`);
                req.send();
                req.onreadystatechange = async () => {
                    if (req.readyState === 4 && req.status === 200) {
                        videoBox.style.display = "none";
                        pointAndClickBox.style.display = "inline";
                        html = req.response;
                        pointAndClickBox.innerHTML = html;
                        image= document.getElementById("imagePointAndClick");
                        matches = html.match(new RegExp(/\d+,\d+/,"g"))
                        await sleep(500);

                        // Adapt click zones
                        ratioX = scene.width/image.clientWidth;
                        ratioY = scene.height/image.clientHeight;
                        matches.map(m => {
                            x = m.match(/\d+/)[0];
                            y= m.match(/,\d+/)[0].slice(1);
                            x=Number.parseInt(x/ratioX);
                            y=Number.parseInt(y/ratioY);
                            html=html.replace(m, `${x},${y}`)
                        });
                        pointAndClickBox.innerHTML = html;

                        // Next scene button
                        but = document.createElement("div");
                        but.id="nextSceneButton";
                        but.onclick = handleChoice.bind(null, scene.nextScene.sceneId);
                        but.textContent = scene.nextScene.label;
                        pointAndClickBox.appendChild(but);

                        pointAndClickBox.style.opacity = 1;

                    }
                }


                break;
        default: 
            console.error(scene.type);
            break;
    }

    // ChoiceBox
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


async function clearSetup() {
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
        case "point and click":
            pointAndClickBox.style.opacity = 0;
            pointAndClickBox.ontransitionend = () => {
                pointAndClickBox.style.display = "none";
                clearNode(pointAndClickBox);
                videoBox.style.display = "flex";
                pointAndClickBox.ontransitionend = null;
            }
            await sleep(1000);
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
                handleChoice(data.whenNoTimeScene);
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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
 }


