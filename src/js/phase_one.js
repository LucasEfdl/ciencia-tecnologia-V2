// **********************  GENERAL  ********************** //
const gameContainer = document.getElementById("game-container");
const overlay = document.querySelector("[data-js=overlay]");
const inputValocity = document.getElementById("velocidadeDigitada");

// **********************  OBJECTS  ********************** //
const mainObject = document.getElementById("object");
const secondObject = document.getElementById("object2");

// **********************  BUTTONS  ********************** //
const intoGameBtn = document.getElementById("start-button");
const confirmAnswertBtn = document.querySelector("[data-js=confirmAnswert]");
const resetBtn = document.getElementById("reset");

// **********************  POSITION TIME FUNCTION VAR  ********************** //
var position = [0, 0];
var initialPosition = [0, -450];
var velocity = [30, 40];
var time = 0;

// **********************  GAME  ********************** //
class Game {
  constructor(mObject, sObject) {
    this.object = mObject;
    this.objectTwo = sObject;
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
    const mru = setInterval(() => {
      position[0] = initialPosition[0] + velocity[0] * time; // fórmula da função horária da posição
      position[1] = initialPosition[1] + velocity[1] * time;

      this.object.style.left = `${position[0]}px`;
      this.objectTwo.style.left = `${position[1]}px`;

      if (time == 20) {
        clearInterval(mru); // o objeto tem de parar na metade da width

        setTimeout(() => {
          overlay.classList.replace("d-none", "d-block");
        }, 800);
      }

      if (time == 40) {
        clearInterval(mru);

        this.object.style.left = `${position[0] - 100}px`;
        this.objectTwo.style.left = `${position[1] - 150}px`;
      }

      time++;
    }, 1000 / 60);
  }
}

const game = new Game(mainObject, secondObject);

intoGameBtn.addEventListener("click", () => {
  game.displayGameContainer();

  setTimeout(() => {
    game.startGame();
  }, 1000);
});

confirmAnswertBtn.addEventListener("click", () => {
  overlay.classList.replace("d-block", "d-none");
  game.startGame();
});
