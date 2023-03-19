// object animation script
const gameContainer = document.getElementById("game-container");
const gameObject = document.getElementById("object");
const gameObject2 = document.getElementById("object2");
const startBtn = document.getElementById("startGame");
const verifyBtn = document.getElementById("question-options");
const resetBtn = document.getElementById("reset");
const startLevel = document.querySelector("[data-js=startLevel]");
var FPS = 60;
var dt = 100; // ms
var xo = 500;
var t = 0; // tempo
var posX = xo;
var vox2 = 150;
var xo2 = 0;
var posX2 = xo2;

// question animation script
const text = document.getElementById("question-text");
const startButton = document.getElementById("start-button");

// overlay script
const overlay = document.querySelector("[data-js=overlay]");

class Game {
  constructor(object) {
    this.object = object;
    this.object2 = object2;
  }

  displayGameContainer() {
    document.getElementById("initial-screen").style.backgroundImage = "none";
    document
      .querySelector("[data-js=game-screen]")
      .classList.replace("d-none", "d-flex");
    document
      .getElementById("start-button")
      .classList.replace("d-flex", "d-none");
  }

  start() {
    var vox = document.getElementById("velocidadeDigitada").value;
    const interval = setInterval(() => {
      t = t + dt / 1000;
      posX = xo + vox * t;
      posX2 = xo2 + vox2 * t;
      this.object.style.left = `${posX}px`;
      this.object2.style.left = `${posX2}px`;
      if (posX > gameContainer.offsetWidth - 100) {
        posX = xo;
        t = 0;
        clearInterval(interval);
      }
      if (posX2 >= posX - 100) {
        clearInterval(interval);
      }
    }, 1000 / FPS);
  }

  reset() {
    this.object.style.left = 500 + "px";
    this.object2.style.left = 0 + "px";
  }
}

const game = new Game(gameObject);

startButton.addEventListener("click", () => {
  game.displayGameContainer();
  startLevel.addEventListener("click", () => {
    game.start();
    overlay.classList.replace("d-block", "d-none");
  });
});

resetBtn.addEventListener("click", () => {
  game.reset();
  setTimeout(() => {
    game.start();
  }, 3000);
});
