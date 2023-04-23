// **********************  GENERAL  ********************** //
const initialScreen = document.getElementById("initial-screen");
const gameScreen = document.getElementById("game-screen");
const overlay = document.querySelector("[data-js=overlay]");

// **********************  OBJECTS  ********************** //
const armadillo = document.getElementById("object");
const fox = document.getElementById("object2");
const car = document.getElementById("object3");

// **********************  BUTTONS  ********************** //
const startButton = document.getElementById("start-button");

// **********************  POSITION TIME FUNCTION VAR  ********************** //
let positions = [0, 0];
const initialPositions = [0, -450];
const velocities = [21, 40];
let time = 0;

class Game {
  constructor(armadillo, fox) {
    this.armadillo = armadillo;
    this.fox = fox;
  }

  showGameContainer() {
    initialScreen.classList.replace("d-flex", "d-none");
    gameScreen.classList.replace("d-none", "d-flex");
  }

  startGame() {
    const mru = setInterval(() => {
      positions[0] = initialPositions[0] + velocities[0] * time; // Fórmula da função horária da posição
      positions[1] = initialPositions[1] + velocities[1] * time; // Fórmula da função horária da posição
      this.armadillo.style.left = `${positions[0]}px`; // Movimentação do tatu
      this.fox.style.left = `${positions[1]}px`;
      if (time == 20) {
        clearInterval(mru); // O objeto tem de parar na metade da width
        setTimeout(() => {
          overlay.classList.replace("d-none", "d-block");
        }, 800);
      }
      if (time == 40) {
        clearInterval(mru);
        this.armadillo.style.left = `${positions[0] - 100}px`;
        this.objectTwo.style.left = `${positions[1] - 150}px`;
      }
      time++;
    }, 1000 / 60);
  }
}

const game = new Game(armadillo, fox);

startButton.addEventListener("click", () => {
  game.showGameContainer();
  game.startGame();
});
