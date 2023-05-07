// **********************  GENERAL  ********************** //
const gameContainer = document.getElementById("game-container");
const overlay = document.querySelector("[data-js=overlay]");
const userName = document.querySelector("input[for=nameUser]");

const input = document.getElementById("inputVelocity");

// **********************  OBJECTS  ********************** //
const armadillo = document.getElementById("object");
const fox = document.getElementById("object2");

// **********************  BUTTONS  ********************** //
const intoGameButton = document.getElementById("start-button");
const confirmAnswertButton = document.querySelector("[data-js=confirmAnswert]");
const resetButton = document.getElementById("reset");

// **********************  POSITION TIME FUNCTION VAR  ********************** //
const initialPositions = [0, -450];
const velocities = [30, 40];
let time = 0;

let difference = 0; // variável que guarda a diferença das posições
let currentPosition = 0;

// **********************  GAME  ********************** //
class Game {
  constructor(armadillo, fox) {
    this.armadillo = armadillo;
    this.fox = fox;
  }

  displayGameContainer() {
    document
      .getElementById("initial-screen")
      .classList.replace("d-flex", "d-none");
    document
      .querySelector("[data-js=game-screen]")
      .classList.replace("d-none", "d-flex");
  }

  displayGameContainerStart() {
    document
      .getElementById("initial-screen")
      .classList.replace("d-none", "d-flex");
    document
      .getElementById("start-button")
      .classList.replace("d-none", "d-flex");
    document
      .querySelector("[data-js=game-screen]")
      .classList.replace("d-flex", "d-none");
  }

  startGame() {
    const moveObjects = () => {
      // Calculando a posição dos objetos pela equação horária da posição
      currentPosition = initialPositions[0] + velocities[0] * time;

      // Quando a resposta estiver errada, calcula a diferença de posição
      if (difference > currentPosition) {
        difference -= currentPosition;
      }

      this.armadillo.style.left = `${currentPosition + difference}px`;
      this.fox.style.left = `${initialPositions[1] + velocities[1] * time}px`;

      if (time == 20) {
        clearInterval(mru); // O objeto tem de parar na metade da width

        currentPosition = parseInt(this.armadillo.style.left);

        setTimeout(() => {
          overlay.classList.replace("d-none", "d-block");
        }, 800);
      }
      // Fazendo a raposa parar quando sua posição for muito próxima da posição do Tatu e a resposta do usuário estiver errada
      if (
        parseInt(this.fox.style.left) >
        parseInt(this.armadillo.style.left) - 55
      ) {
        clearInterval(mru);
        resetButton.disabled = false;
      }
      // Quando a resposta estiver certa, o jogo acaba no tempo de 40s
      if (currentPosition >= gameContainer.offsetWidth) {
        clearInterval(mru);
        this.armadillo.style.left = "1100px";
        this.fox.style.left = "1000px";
        resetButton.disabled = false;
      }

      console.log(currentPosition);
      time++;
    };
    const mru = setInterval(moveObjects, 1000 / 60);
  }

  reset() {
    velocities[0] = 30;
    velocities[1] = 40;
    time = 0;

    this.armadillo.style.left = `${initialPositions[0]}px`;
    this.fox.style.left = `${initialPositions[1]}px`;

    input.value = "";

    difference = 0;
    currentPosition = 0;

    resetButton.disabled = true;
    confirmAnswertButton.disabled = true;
  }
}

const game = new Game(armadillo, fox);

intoGameButton.addEventListener("click", () => {
  game.displayGameContainer();
  setTimeout(() => {
    game.startGame();
  }, 1000);
});

input.addEventListener("input", (e) => {
  let numValue = parseInt(e.target.value);
  if (e.target.value != "" && !isNaN(numValue)) {
    confirmAnswertButton.disabled = false;
  } else {
    confirmAnswertButton.disabled = true;
  }
});

confirmAnswertButton.addEventListener("click", () => {
  overlay.classList.replace("d-block", "d-none");
  let num = 0;
  const selectInputValue = input.value;
  const numValue = selectInputValue;
  num = parseInt(numValue);
  if (num < 30) {
    velocities[0] = num;
    difference = currentPosition + velocities[0];
    game.startGame();
    setTimeout(() => {
      var modalElement = document.getElementById("meuModal2");
      var modal = new bootstrap.Modal(modalElement);
      modal.show();
    }, 1500);
  } else {
    velocities[0] = num;
    game.startGame();
    setTimeout(() => {
      var modalElement = document.getElementById("meuModal");
      var modal = new bootstrap.Modal(modalElement);
      modal.show();
    }, 1500);
  }
});

resetButton.addEventListener("click", () => {
  game.reset();
  setTimeout(() => {
    game.startGame();
  }, 3000);
});

document.addEventListener("DOMContentLoaded", function () {
  var botaoReset = document.getElementById("btreset");
  botaoReset.addEventListener("click", resetGame);
});

function resetGame() {
  game.reset();
  setTimeout(() => {
    game.startGame();
  }, 3000);
}

document.addEventListener("DOMContentLoaded", function () {
  var botaoReset = document.getElementById("btGo");
  botaoReset.addEventListener("click", nextGame);
});

function nextGame() {
  window.location.href = "phase_two.html";
}
