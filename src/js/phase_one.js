// **********************  GENERAL  ********************** //
const gameContainer = document.getElementById("game-container");
const overlay = document.querySelector("[data-js=overlay]");
const userName = document.querySelector("input[for=nameUser]");

// **********************  OBJECTS  ********************** //
const armadillo = document.getElementById("object");
const fox = document.getElementById("object2");

// **********************  BUTTONS  ********************** //
const intoGameButton = document.getElementById("start-button");
const confirmAnswertButton = document.querySelector("[data-js=confirmAnswert]");
const resetButton = document.getElementById("reset");
const radioButtons = document.querySelectorAll(
  'input[type="radio"][name="velocity"]'
);

// **********************  POSITION TIME FUNCTION VAR  ********************** //
const initialPositions = [0, -450];
const velocities = [30, 40];
let time = 0;

let difference = 0; // variável que guarda a diferença das posições
let currentPosition = 0;

// **********************  STOPWATCH  ********************** //
let [milliseconds, seconds, minutes] = [0, 0, 0];
const timerRef = document.querySelector(".timerDisplay");
let stopwatch = null;

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
        stopwatch = setInterval(this.stopwatch.bind(this), 10);
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
      if (time == 40) {
        clearInterval(mru);
        this.armadillo.style.left = `${
          parseInt(this.armadillo.style.left) - 100
        }px`;
        this.fox.style.left = `${parseInt(this.armadillo.style.left) - 140}px`;
        resetButton.disabled = false;
      }

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

    difference = 0;
    currentPosition = 0;

    resetButton.disabled = true;
    radioButtons.forEach((radioButton) => {
      if (radioButton.checked) {
        radioButton.checked = false;
      }
    });
    confirmAnswertButton.disabled = true;

    [milliseconds, seconds, minutes] = [0, 0, 0];
    timerRef.innerText = "00:00";
  }

  stopwatch() {
    milliseconds += 10;
    if (milliseconds == 1000) {
      milliseconds = 0;
      seconds++;
      if (seconds == 60) {
        seconds = 0;
        minutes++;
      }
    }
    let m = minutes < 10 ? "0" + minutes : minutes;
    let s = seconds < 10 ? "0" + seconds : seconds;

    timerRef.innerText = `${m}:${s}`;
  }
}

const game = new Game(armadillo, fox);

intoGameButton.addEventListener("click", () => {
  game.displayGameContainer();
  setTimeout(() => {
    game.startGame();
  }, 1000);
});

radioButtons.forEach((radioButton) => {
  radioButton.addEventListener("click", () => {
    confirmAnswertButton.disabled = false;
  });
});
confirmAnswertButton.addEventListener("click", () => {
  clearInterval(stopwatch); // Para o cronômetro
  overlay.classList.replace("d-block", "d-none");
  let num = 0;
  radioButtons.forEach((radioButton) => {
    if (radioButton.checked) {
      // Seleciona o elemento label associado ao botão selecionado
      const label = document.querySelector(`label[for="${radioButton.id}"]`);
      // Recupera o valor do texto do label selecionado
      const selectedValue = label.textContent;
      const str = selectedValue;
      num = parseInt(str);
    }
  });
  if (num != 30) {
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

userName.addEventListener("input", (e) => {
  if (e.target.value != "") {
    intoGameButton.disabled = false;
  } else {
    intoGameButton.disabled = true;
  }
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
