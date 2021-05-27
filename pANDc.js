function clickPortefeuilleBertrand() {
    printMenu("portefeuille Bertrand");
}
function clickPochetteB() {
    printMenu("pochette Bertrand");
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
    printMenu("pochette Badge");
}

function printMenu(itemId) {
    pieceBox = document.getElementById("pieceBox");
    pieceBox.style.display = "flex";
    setTimeout(() => {
        pieceBox.style.opacity = 1;
    }, 500);
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
        div.onclick = handlePiece.bind(null, piece);
        pieceBox.appendChild(div);
    });
}

function handlePiece(piece) {
    switch (piece.type) {
        case "feuille":
            // Print feuille
            pieceBox.style.opacity = 0;
            pieceBox.ontransitionend = () => {
                pieceBox.style.display = "none";
                pieceBox.ontransitionend = null;

            };
            let div = document.createElement("div");
            div.className = "piece";
            let h = document.createElement("h3");
            h.textContent = piece.titre;
            let p = document.createElement("p");
            p.textContent = piece.texte;
            div.appendChild(h);
            div.appendChild(p);
            pointAndClickBox.appendChild(div);

            image.onclick = () => {
                pointAndClickBox.removeChild(pointAndClickBox.getElementsByClassName("piece"));
                image.onclik = clickMenuToImage;
            }
            break;
        case "photo":

            break;
        default:
            break;
    }
}

function clickMenuToImage() {
    pieceBox = document.getElementById("pieceBox");
    image = document.getElementById("imagePointAndClick");
    // Remove menu
    pieceBox.style.opacity = 0;
    pieceBox.ontransitionend = () => {
        clearNode(pieceBox);
        pieceBox.ontransitionend = null;
    }
    // Prints image back
    image.style.filter = "blur(0px)";
    image.useMap = "#map";
}
