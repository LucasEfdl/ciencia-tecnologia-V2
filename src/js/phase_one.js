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
var position = 0;
var initialPosition = 0;
var velocity = 30;
var time = 0;

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
    const mru = setInterval(() => {
      position = initialPosition + velocity * time; // fórmula da função horária da posição

      this.object.style.left = `${position}px`;

      if (position == 600) {
        clearInterval(mru); // o objeto tem de parar na metade da width

        setTimeout(() => {
          overlay.classList.replace("d-none", "d-block");
        }, 800);
      }

      if (time == 40) {
        clearInterval(mru);
        this.object.style.left = `${position - 100}px`;
      }

      time++;
    }, 1000 / 60);
  }
}

const game = new Game(mainObject);

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
