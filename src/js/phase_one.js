// **********************  GENERAL  ********************** //
const gameContainer = document.getElementById("game-container");
const overlay = document.querySelector("[data-js=overlay]");
const inputValocity = document.getElementById("velocidadeDigitada");

// **********************  OBJECTS  ********************** //
const mainObject = document.getElementById("object");
const secondObject = document.getElementById("object2");

// **********************  BUTTONS  ********************** //
const intoGame = document.getElementById("start-button");
const confirmAnswert = document.querySelector("[data-js=confirmAnswert]");
const resetBtn = document.getElementById("reset");

// **********************  GAME  ********************** //
class Game {
  constructor(mObject) {
    this.object = mObject;
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

  startGame() {
    var position = 0;
    var initialPosition = 0;
    var velocity = 30;
    var time = 0;

    const mru = setInterval(() => {
      position = initialPosition + velocity * time; // formula da função horária da posição

      this.object.style.left = `${position}px`;

      if (time == 10) {
        clearInterval(mru);
        alert("A posição deste objeto é de 300m (ou px)");
      }

      time++;
    }, 1000 / 60);
  }
}

const game = new Game(mainObject);

intoGame.addEventListener("click", () => {
  game.displayGameContainer();
  game.startGame();
});
