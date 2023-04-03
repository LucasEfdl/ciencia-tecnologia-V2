// **********************  GENERAL  ********************** //
const gameContainer = document.getElementById("game-container");
const text = document.getElementById("question-text");
const overlay = document.querySelector("[data-js=overlay]");
const inputValocity = document.getElementById("velocidadeDigitada");

var answer;

// **********************  OBJECTS  ********************** //
const mainObject = document.getElementById("object");
const secondObject = document.getElementById("object2");

// **********************  BUTTONS  ********************** //
const intoGame = document.getElementById("start-button");
const confirmAnswert = document.querySelector("[data-js=confirmAnswert]");
const resetBtn = document.getElementById("reset");

// **********************  EQUATIONS  ********************** //
var FPS = 60;
var mainPosition = 0;
var secondPosition = 0;
var mainVelocity = 90; // main object
var secondVelocity = 60; // second object
var distance = 100; // ms

var xo = 0;
var xo2 = -500;
var time = 0;

// **********************  THE GAME  ********************** //
class Game {
  constructor(mObject, sObject) {
    this.object = mObject;
    this.object2 = sObject;
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
    const interval = setInterval(() => {
      this.object2.classList.replace("d-none", "d-block");

      time += distance / 1000;
      mainPosition = xo + mainVelocity * time;

      secondPosition = xo2 + secondVelocity * time;

      this.object.style.left = `${mainPosition}px`;
      this.object2.style.left = `${secondPosition}px`;
      xo += 5;
      xo2 += 10;

      if (Math.floor(mainPosition) == 499) {
        clearInterval(interval);
        overlay.classList.replace("d-none", "d-block");
        confirmAnswert.addEventListener("click", () => {
          answer = Number(inputValocity.value);
          mainVelocity = answer;
          overlay.classList.replace("d-block", "d-none");
          this.continue();
        });
      }

      if (this.object2.offsetLeft > this.object.offsetLeft - 100) {
        alert("você perdeu o jogo!");
        clearInterval(interval);
      } else if (mainPosition > gameContainer.offsetWidth - 100) {
        alert("você ganhou o jogo!");
        clearInterval(interval);
      }
    }, 1000 / FPS);
  }

  continue() {
    this.start();
  }

  reset() {
    time = 0;
    xo = 0;
    xo2 = -500;
    mainPosition = 0;
    mainVelocity = 90;
    secondPosition = 0;

    this.object.style.left = 0 + "px";
    this.object2.style.left = -500 + "px";
  }
}

const game = new Game(mainObject, secondObject);

intoGame.addEventListener("click", () => {
  game.displayGameContainer();

  setTimeout(() => {
    game.start();
  }, 3000);
});

resetBtn.addEventListener("click", () => {
  game.reset();

  setTimeout(() => {
    game.start();
  }, 3000);
});
