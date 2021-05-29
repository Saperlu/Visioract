loadData(val => {
    data=val;
    console.log(data);

    document.onkeypress = (e) => {
        let video = document.getElementsByTagName("video")[0];

    
        if (e.key === "e") { // KEY: d ===> Remove selectedNode
            if (video) video.currentTime = video.duration;
        } else if (e.key === "r") {
            handleChoice(currentSceneId);
        } else if (e.key === " ") {
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        }

        choices = choiceBox.getElementsByClassName("choice");
        for(i = 1 ;  i <= choices.length ; i++) {
            if (e.key === i.toString()) {
                choices.item(i-1).click();
            }
        }
    }

    // cacheChoiceBox.ontransitionend = () => {
    //     if (cacheChoiceBox.style.backgroundColor === "transparent") {
    //         cacheChoiceBox.style.zIndex = -1;
    //     } else {
    //         cacheChoiceBox.style.zIndex = 1;
    //     }
    // }


    setupScene(data.entryPoint);
});