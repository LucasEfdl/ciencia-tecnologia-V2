import data from "../data/data.json" assert { type: "json" };

const initialScreen = document.querySelector("[data-inital-screen]");
const startGameButton = document.querySelector("[data-start-game]");
const name = document.querySelector("input[for=name]");
const gameContainer = document.querySelector("[data-container]");
const gameScreen = document.querySelector("[data-game-screen]");
const question = document.querySelector("[data-question]");
const endPositionText = document.querySelector(".end-position-text");
const startPositionText = document.querySelector(".start-position-text");
const halfTimeText = document.querySelector(".half-time-text");
const foxVelocityText = document.querySelector(".fox-velocity-text");
const radioButtons = document.querySelectorAll(
  'input[type="radio"][name="velocity"]'
);
const confirmAnswerButton = document.querySelector("[data-confirm-answer]");
const resetButton = document.querySelector("[data-reset]");
const label = document.querySelectorAll(".form-check label");
const progressiveBar = document.querySelector(".progress-bar");
const nextPhaseButton = document.querySelector("[data-next-phase]");
const armadilloElement = document.querySelector("[data-armadillo");
const foxElement = document.querySelector("[data-fox");

const timerRef = document.querySelector("[data-timer-display]");
let [milliseconds, seconds, minutes] = [0, 0, 4];
let timer = null;

var gameOverModalElement = document.getElementById("gameOverModal");
var gameOverModal = new bootstrap.Modal(gameOverModalElement);
var timeOverModalElement = document.getElementById("timeOverModal");
var timeOverModal = new bootstrap.Modal(timeOverModalElement);

let progress = 0;
let index = 0;
let armadilloPosition = data[index].armadilloPosition;
let armadilloVelocity = data[index].armadilloVelocity;
let foxPosition = data[index].foxPosition;
let foxVelocity = data[index].foxVelocity;
let time = 0;
startPositionText.innerHTML = data[index].halfPosition;
endPositionText.innerHTML = data[index].finalPosition;
foxVelocityText.innerHTML = data[index].foxVelocity;
halfTimeText.innerHTML = data[index].halfTime;

document.addEventListener("DOMContentLoaded", () => {
  name.addEventListener("input", (e) => {
    if (e.target.value != "") {
      startGameButton.disabled = false;
    } else {
      startGameButton.disabled = true;
    }
  });

  startGameButton.addEventListener("click", () => {
    initialScreen.classList.replace("d-flex", "d-none");
    gameContainer.classList.replace("d-none", "d-flex");

    game.startGame();
  });

  radioButtons.forEach((radioButton) => {
    radioButton.addEventListener("click", () => {
      confirmAnswerButton.disabled = false;
    });
  });

  nextPhaseButton.addEventListener("click", nextGame);
});

class Game {
  constructor(armadilloElement, foxElement) {
    this.armadilloElement = armadilloElement;
    this.foxElement = foxElement;
  }

  startGame() {
    label.forEach((lbl, i) => {
      lbl.textContent = data[index].options[i];
    });
    armadilloElement.classList.add("isMove");
    foxElement.classList.add("foxIsMove");
    const mru = setInterval(() => {
      this.armadillo = armadilloPosition + armadilloVelocity * time;
      this.fox = foxPosition + foxVelocity * time;

      if (this.fox >= this.armadillo) {
        clearInterval(mru);
        armadilloElement.classList.remove("isMove");
        foxElement.classList.remove("foxIsMove");
      }
      if (time == data[index].halfTime) {
        clearInterval(mru);
        setTimeout(() => {
          armadilloElement.classList.remove("isMove");
          foxElement.classList.remove("foxIsMove");
          question.classList.replace("d-none", "d-block");
          timer = setInterval(this.timer.bind(this), 10);
        }, 880);
      }
      if (time == data[index].finalTime) {
        clearInterval(mru);
        this.fox = 1100;
        setTimeout(() => {
          armadilloElement.classList.remove("isMove");
          foxElement.classList.remove("foxIsMove");
        }, 880);
      }

      this.updateDisplay();

      time++;
    }, 1000 / 60);
  }

  updateDisplay() {
    this.armadilloElement.style.left = `${this.armadillo}px`;
    this.foxElement.style.left = `${this.fox}px`;
  }

  timer() {
    milliseconds -= 10;
    if (milliseconds < 0) {
      milliseconds = 990;
      seconds--;
      if (seconds < 0) {
        seconds = 59;
        minutes--;
      }
    }

    let min = minutes < 10 ? "0" + minutes : minutes;
    let sec = seconds < 10 ? "0" + seconds : seconds;

    timerRef.innerText = `${min}:${sec}`;
  }

  reset() {
    this.armadillo = data[index].armadilloPosition;
    this.fox = data[index].foxPosition;
    this.updateDisplay();
    time = 0;
    resetButton.disabled = true;
    radioButtons.forEach((radioButton) => {
      if (radioButton.checked) {
        radioButton.checked = false;
      }
    });
    confirmAnswerButton.disabled = true;
    timerRef.innerText = "04:00";
    [milliseconds, seconds, minutes] = [0, 0, 4];
    setTimeout(() => {
      this.startGame();
    }, 2000);
  }
}

const game = new Game(armadilloElement, foxElement);

confirmAnswerButton.addEventListener("click", () => {
  question.classList.replace("d-block", "d-none");
  clearInterval(timer);
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
  if (num != data[index].armadilloVelocity) {
    armadilloVelocity = num;
    game.startGame();
    setTimeout(() => {
      gameOverModal.show();
    }, 1500);
  } else {
    armadilloVelocity = num;
    game.startGame();
    setTimeout(() => {
      resetButton.disabled = false;

      var nextPhaseModalElement = document.getElementById("nextPhaseModal");
      var nextPhaseModal = new bootstrap.Modal(nextPhaseModalElement);
      nextPhaseModal.show();

      progress += 33.33;
      progressiveBar.style.width = `${progress}%`;
    }, 1500);
  }
});

resetButton.addEventListener("click", () => {
  game.reset();
});

function nextGame() {
  index++;
  endPositionText.innerText = data[index].finalPosition;
  halfTimeText.innerText = data[index].halfPosition;
  foxVelocityText.innerText = data[index].foxVelocity;
  halfTimeText.innerText = data[index].halfTime;
  foxVelocity = data[index].foxVelocity;
  armadilloVelocity = data[index].armadilloVelocity;
  game.reset();
}
