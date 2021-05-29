function clickPortefeuilleBertrand() {
    printMenu("portefeuille Bertrand");
}
function clickPortefeuilleGeraldine() {
    printMenu("portefeuille Geraldine");
}
function clickPochetteB() {
    printMenu("pochette Bertrand");
}
function clickPochetteG() {
    printMenu("pochette Géraldine");
}
function clickPochetteBleue() {
    printMenu("pochette bleue");
}
function clickBadge() {
    printMenu("badge");
}

function printMenu(itemId) {
    menu = document.getElementById("pieceMenuBox");
    clearNode(menu);
    menu.style.display = "flex";
    setTimeout(() => {
        menu.style.opacity = 1;
    }, 50);
    // Image
    image = document.getElementById("imagePointAndClick");
    image.style.filter = "blur(10px)";
    image.useMap = "#";
    
    image.onclick = clickMenuToImage;
    
    // Menu
    scene.clicks[itemId].forEach(piece => {
        let div = document.createElement("div");
        div.className = "choice";
        div.textContent = piece.label;
        div.onclick = handlePiece.bind(null, piece, itemId);
        menu.appendChild(div);
    });
}

function handlePiece(piece, itemId) {
    hideMenu();
    switch (piece.type) {
        case "feuille":
            // Print feuille
            let feuille = document.createElement("div");
            feuille.className = "feuille";
            let h = document.createElement("h3");
            h.textContent = piece.titre;
            let p = document.createElement("p");
            p.innerHTML = piece.texte;
            feuille.appendChild(h);
            feuille.appendChild(p);
            pointAndClickBox.appendChild(feuille);
            setTimeout(() => {
                feuille.style.opacity = 1;
            }, 50);

            // To menu
            image.onclick = clickPieceToMenu.bind(null, feuille, itemId);
            break;
        case "image":
            let img = document.createElement("img");
            img.className = "img";
            img.src = `ressources/images/${piece.fileName}`;
            pointAndClickBox.appendChild(img);
            setTimeout(() => {
                img.style.opacity = 1;
            }, 50);
            // To menu
            image.onclick = clickPieceToMenu.bind(null, img, itemId);
            break;
        case "scene":
            handleChoice(piece.sceneId);
            default:
            break;
    }
}

function clickMenuToImage() {
    menu = document.getElementById("pieceMenuBox");
    image = document.getElementById("imagePointAndClick");
    // Hide menu
    hideMenu();
    // Prints image back
    image.style.filter = "blur(0px)";
    image.useMap = "#map";
}

function clickPieceToMenu(pieceElement, itemId) {
    pieceElement.style.opacity = 0;
    printMenu(itemId)
    image.onclik = clickMenuToImage;
    pieceElement.ontransitionend = () => {
        pointAndClickBox.removeChild(pieceElement);
    }
}

function hideMenu() {
    menu = document.getElementById("pieceMenuBox");
    menu.style.opacity = 0;
    menu.ontransitionend = () => {
        menu.style.display = "none";
        menu.ontransitionend = null;
    };
}