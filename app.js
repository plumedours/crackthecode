const startBtn = document.getElementById("startBtn");
const checkBtn = document.getElementById("checkBtn");
const playBtn = document.querySelectorAll(".padBtn");
const playerCode = document.getElementById("playerCode");
const secretCode = document.getElementById("secretCode");
const tryList = document.getElementById("tryList");
const modalContainer = document.querySelector(".modal-container");
const modalTriggers = document.querySelectorAll(".modal-trigger");
const wordResponse = document.querySelector(".wordResponse");
const replayBtn = document.getElementById("replayBtn");
const highscoreLbl = document.getElementById("highscoreLbl");
const tryLbl = document.getElementById("tryLbl");
const resetHS = document.getElementById("resetHS");

let arrTryList = [];
let goodPlace = 0;
let sequencePlayer = "";
let rndInt = "";
let inGame = false;
let playerTry = 0;
let highScore = localStorage.getItem("highScore");
checkBtn.disabled = true;

highscoreLbl.textContent = localStorage.getItem("highScore");

// Fonction pour nombre entier aléatoire entre deux entiers, min et max compris,
// puis on le converti en chaîne de caractère
function randomIntToStr(min, max) {
  rndInt = Math.floor(Math.random() * (max - min + 1) + min).toString();
}

// Fonction pour activer / désactiver les boutons de jeu
function enabledOrDisabled(bool) {
  playBtn.forEach((btn) => {
    btn.disabled = bool;
  });
}
//end

// Fonction pour comparer la séquence du joueur par rapport à la séquence secrète
function isEqual(a, b) {
  if (a.length != b.length) return false;

  return a === b;
}
//end

// Fonction pour tout réinitialiser
function restParty() {
  // location.reload();
  playerCode.textContent = "_ _ _ _";
  secretCode.textContent = "X X X X";
  playerTry = 0;
  tryLbl.textContent = playerTry;
  sequencePlayer = "";
  goodPlace = 0;
  arrTryList = [];

  while (tryList.firstChild) {
    tryList.removeChild(tryList.lastChild);
  }
}

// On clique sur le bouton START pour obtenir un nombre aléatoire de 4 chiffres, entre 1000 et 9999
startBtn.addEventListener("click", () => {
  enabledOrDisabled(false);
  checkBtn.disabled = false;
  randomIntToStr(1000, 9999);
  console.log(rndInt.toString());
});
// end

// Le joueur clique sur les boutons pour créer une suite de 4 chiffres, à 4 les boutons se désactivent
playBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    sequencePlayer += btn.textContent; // OKAY
    playerCode.textContent = sequencePlayer;
    if (sequencePlayer.length === 4) {
      enabledOrDisabled(true);
    }
  });
});
// end

// On clique sur le bouton CHECK pour comparer la séquence du joueur à celle cachée
// Si il y a une erreur, les boutons sont réactivés et le joueur retente
// Si les deux sont identiques, le joueur gagne
// On affichera uniquement le nombre de chiffre bien placé
checkBtn.addEventListener("click", () => {
  if (sequencePlayer.length === 4) {
    let li = document.createElement("p");
    const fragment = document.createDocumentFragment();
    playerTry++; // On incrémente le nombre de tentative
    tryLbl.textContent = playerTry;

    let testCharPlayer;
    let testCharRnd;

    // On compare la séquence cachée et la séquence du joueur pour chaque index du nombre,
    // Si un chiffre correspond, on incrémente la variable goodPlace de 1
    for (i = 0; i < 4; i++) {
      testCharPlayer = sequencePlayer.charAt(i);
      testCharRnd = rndInt.charAt(i);

      if (testCharPlayer == testCharRnd) {
        goodPlace++;
      }
    }

    // On ajoute au tableau tous les essais de l'utilisateur
    arrTryList.push(
      sequencePlayer + " - " + goodPlace + " chiffre(s) bien placé(s)"
    );

    // On ajouter les essais dans un 'fragment'
    arrTryList.forEach((item) => {
      li.textContent = item;
      fragment.appendChild(li);
    });

    // On affiche le 'fragment' des essais dans le DOM
    tryList.appendChild(fragment);

    goodPlace = 0; // Remise à 0 du compteur de chiffre bien placé

    // On compare le code caché avec le code de l'utilisateur,
    // si ils sont identique, c'est gagné, sinon il recommence
    // et on remet à 0 sa séquence, les chiffres bien placés et le texte. Et on réactive les boutons
    if (isEqual(rndInt, sequencePlayer)) {
      wordResponse.textContent = "Le code était : " + rndInt;
      modalContainer.classList.toggle("active");
      secretCode.textContent = rndInt;
      if (highScore !== null) {
        if (playerTry < highScore) {
          localStorage.setItem("highScore", playerTry);
          highscoreLbl.textContent = playerTry;
        }
      } else {
        localStorage.setItem("highScore", playerTry);
        highscoreLbl.textContent = playerTry;
      }
    } else {
      playerCode.textContent = "_ _ _ _";
      sequencePlayer = "";
      goodPlace = 0;
      enabledOrDisabled(false);
    }
  }
});
// end

// On clique sur Rejouer et on réinitialise tout à 0 en appelant la fonction resetParty
replayBtn.addEventListener("click", () => {
  modalContainer.classList.toggle("active");
  enabledOrDisabled(false);
  randomIntToStr(1000, 9999);
  restParty();
  console.log(rndInt.toString());
});

if (inGame === false) {
  enabledOrDisabled(true);
} else if (inGame === true) {
  enabledOrDisabled(false);
}

// Reset meilleur score
resetHS.addEventListener("click", () => {
  localStorage.clear();
  highscoreLbl.textContent = localStorage.getItem("highScore");
});
// end
