loadData(val => {
    data=val;
    console.log(data);

    cacheChoiceBox.ontransitionend = () => {
        if (cacheChoiceBox.style.backgroundColor === "transparent") {
            cacheChoiceBox.style.zIndex = -1;
        } else {
            cacheChoiceBox.style.zIndex = 1;
        }
    }


    setupScene("p1n_debut");
});