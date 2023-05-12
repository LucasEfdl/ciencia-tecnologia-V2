// ===================================  GENERAL  =================================== //
import data from "./data.json" assert { type: "json" };
const overlay = document.querySelector("[data-js=overlay]");
const userName = document.querySelector("input[for=nameUser]");
const timerRef = document.querySelector(".timerDisplay");
const endPosition = document.querySelector('span[class="final-position"]');
const halfPosition = document.querySelector('span[class="initial-position"]');
const label = document.querySelectorAll(".form-check label");
const progressiveBar = document.querySelector(".progress-bar");

let progress = 0;

// ===================================  OBJECTS  =================================== //
const armadillo = document.getElementById("object");
const fox = document.getElementById("object2");

// ===================================  BUTTONS  =================================== //
const intoGameButton = document.getElementById("start-button");
const confirmAnswertButton = document.querySelector("[data-js=confirmAnswert]");
const resetButton = document.getElementById("reset");
const restartButon = document.getElementById("restart");
const radioButtons = document.querySelectorAll(
  'input[type="radio"][name="velocity"]'
);

// ===================================  DATA  =================================== //
let getIndex = 0;
endPosition.innerHTML = data[getIndex].finalPosition;
halfPosition.innerHTML = data[getIndex].halfPosition;

let armadilloVelocity = data[getIndex].armadilloVelocity;
let armadilloInitialPosition = data[getIndex].armadilloInitialPosition;

let foxVelocity = data[getIndex].foxVelocity;
let foxInitialPosition = data[getIndex].foxInitialPosition;

let difference = 0;
let position = 0;

let time = 0;
// ===================================  STOPWATCH  =================================== //
let [milliseconds, seconds, minutes] = [0, 0, 0];
let stopwatch = null;

// ===================================  GAME  =================================== //
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
    label.forEach((label, index) => {
      label.textContent = data[getIndex].options[index];
    });
    armadillo.classList.add("isMove");
    const moveObjects = () => {
      position = armadilloInitialPosition + armadilloVelocity * time;
      if (position < difference) {
        difference -= position;
        difference += armadilloVelocity;
      }

      this.armadillo.style.left = `${position + difference}px`;
      this.fox.style.left = `${foxInitialPosition + foxVelocity * time}px`;

      if (time == data[getIndex].halfTime) {
        clearInterval(mru); // O objeto tem de parar na metade da width
        stopwatch = setInterval(this.stopwatch.bind(this), 10);
        armadillo.classList.remove("isMove");
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
        armadillo.classList.remove("isMove");
        resetButton.disabled = false;
      }
      // Quando a resposta estiver certa, o jogo acaba no tempo de 40s
      if (time == 40) {
        clearInterval(mru);
        armadillo.classList.remove("isMove");
        this.armadillo.style.left = `${1070}px`;
        this.fox.style.left = `${950}px`;
        resetButton.disabled = false;
      }

      time++;
    };
    const mru = setInterval(moveObjects, 1000 / 60);
  }

  reset() {
    this.armadillo.style.left = `${armadilloInitialPosition}px`;
    this.fox.style.left = `${foxInitialPosition}px`;

    armadilloVelocity = data[getIndex].armadilloVelocity;

    time = 0;

    difference = 0;

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
  if (num != data[getIndex].armadilloVelocity) {
    armadilloVelocity = num;
    difference = position;
    game.startGame();
    setTimeout(() => {
      var modalElement = document.getElementById("meuModal2");
      var modal = new bootstrap.Modal(modalElement);
      modal.show();
    }, 1500);
  } else {
    armadilloVelocity = num;
    difference = 0;
    game.startGame();
    setTimeout(() => {
      var modalElement = document.getElementById("meuModal");
      var modal = new bootstrap.Modal(modalElement);
      progress += 50;

      progressiveBar.style.width = `${progress}%`;
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

restartButon.addEventListener("click", () => {
  resetGame();
});

function nextGame() {
  getIndex++;

  endPosition.innerHTML = data[getIndex].finalPosition;
  halfPosition.innerHTML = data[getIndex].halfPosition;

  resetGame();
}
