import data from "../data/data.json" assert { type: "json" };

const initialScreen = document.querySelector("[data-inital-screen]");
const startGameButton = document.querySelector("[data-start-game]");
const name = document.querySelector("input[for=name]");
const gameContainer = document.querySelector("[data-container]");
const question = document.querySelector("[data-question]");
const endPositionText = document.querySelector(".end-position-text");
const startPositionText = document.querySelector(".start-position-text");
const halfTimeText = document.querySelector(".half-time-text");
const foxVelocityText = document.querySelector(".fox-velocity-text");
const distBetweenFoxArmadillo = document.querySelector(
  ".dist-between-fox-armadillo"
);
const radioButtons = document.querySelectorAll(
  'input[type="radio"][name="velocity"]'
);
const confirmAnswerButton = document.querySelector("[data-confirm-answer]");
const resetButtons = document.querySelectorAll("[data-reset]");
const label = document.querySelectorAll(".form-check label");
const progressiveBar = document.querySelector(".progress-bar");
const nextPhaseButtons = document.querySelectorAll("[data-next-phase]");
let remainingAttempts = document.querySelector("[data-attempts]");
let maxAttempts = 3;
const armadilloElement = document.querySelector("[data-armadillo");
const foxElement = document.querySelector("[data-fox");

const timerRef = document.querySelector("[data-timer-display]");
let [milliseconds, seconds, minutes] = [0, 0, 4];
let timer = null;
var gameOverModalElement = document.getElementById("gameOverModal");
var gameOverModal = new bootstrap.Modal(gameOverModalElement);
var timeOverModalElement = document.getElementById("timeOverModal");
var timeOverModal = new bootstrap.Modal(timeOverModalElement);
var attemptsGoneModalElement = document.getElementById("attemptsGoneModal");
var attemptsGoneModal = new bootstrap.Modal(attemptsGoneModalElement);
const inputOfLogic = document.querySelector('input[type="text"][name="logic"]');
const submitLogicButton = document.querySelector("[data-submit-logic]");

let progress = 0;
let index = 0;
let armadilloPosition = data[index].armadilloPosition;
let armadilloVelocity = data[index].armadilloVelocity;
let foxPosition = data[index].foxPosition;
let foxVelocity = data[index].foxVelocity;
let time = 0;
let difference = 0;

startPositionText.innerText = data[index].halfPosition;
endPositionText.innerText = data[index].finalPosition;
foxVelocityText.innerText = data[index].foxVelocity;
halfTimeText.innerText = data[index].halfTime;
distBetweenFoxArmadillo.innerText = data[index].distBetweenFoxAndArmadillo;

function handleKeyDown(e) {
  if (e.key == "Enter") {
    initialScreen.classList.replace("d-flex", "d-none");
    gameContainer.classList.replace("d-none", "d-flex");
    game.startGame();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  name.addEventListener("input", (e) => {
    if (e.target.value != "") {
      startGameButton.disabled = false;
      document.addEventListener("keydown", handleKeyDown);
    } else {
      startGameButton.disabled = true;
      document.removeEventListener("keydown", handleKeyDown);
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

  nextPhaseButtons.forEach((nextPhaseButton) => {
    nextPhaseButton.addEventListener("click", nextGame);
  });
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
    this.armadilloElement.classList.add("isMove");
    this.foxElement.classList.add("foxIsMove");

    const mru = setInterval(() => {
      this.armadillo = armadilloPosition + armadilloVelocity * time;
      if (difference > this.armadillo) {
        this.armadillo = difference + armadilloVelocity;
      }
      this.fox = foxPosition + foxVelocity * time;
      if (this.fox >= this.armadillo) {
        clearInterval(mru);
        this.fox -= 20;
        setTimeout(() => {
          this.armadilloElement.classList.remove("isMove");
          this.foxElement.classList.remove("foxIsMove");
          resetButtons.forEach((resetButton) => {
            resetButton.disabled = false;
          });
        }, 880);
        this.updateDisplay();
      }
      if (time == data[index].halfTime) {
        clearInterval(mru);
        difference = this.armadillo;
        setTimeout(() => {
          this.armadilloElement.classList.remove("isMove");
          this.foxElement.classList.remove("foxIsMove");
          question.classList.replace("d-none", "d-block");
          timer = setInterval(this.timer.bind(this), 10);
        }, 880);
      }
      if (time == data[index].finalTime) {
        clearInterval(mru);
        this.fox = 1100;
        this.updateDisplay();
        setTimeout(() => {
          this.armadilloElement.classList.remove("isMove");
          this.foxElement.classList.remove("foxIsMove");
        }, 880);
      }

      time++;
      this.updateDisplay();
    }, 1000 / 60);
  }

  updateDisplay() {
    this.armadilloElement.style.left = `${this.armadillo}px`;
    this.foxElement.style.left = `${this.fox}px`;
  }

  reset() {
    this.armadillo = data[index].armadilloPosition;
    this.fox = data[index].foxPosition;
    armadilloVelocity = data[index].armadilloVelocity;
    this.updateDisplay();
    time = 0;
    difference = 0;
    resetButtons.forEach((resetButton) => {
      resetButton.disabled = true;
    });
    radioButtons.forEach((radioButton) => {
      if (radioButton.checked) {
        radioButton.checked = false;
      }
    });
    confirmAnswerButton.disabled = true;
    setTimeout(() => {
      this.startGame();
    }, 3000);
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

    if (min == 0 && sec == 0) {
      clearInterval(timer);
      question.classList.replace("d-block", "d-none");
      timeOverModal.show();
    }

    timerRef.innerText = `${min}:${sec}`;
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
      remainingAttempts.innerText = `${--maxAttempts}`;
      if (maxAttempts == 0) {
        showAttemptsGoneModel();
      } else {
        gameOverModal.show();
      }
    }, 1500);
  } else {
    armadilloVelocity = num;
    game.startGame();
    setTimeout(() => {
      resetButtons.forEach((resetButton) => {
        resetButton.disabled = false;
      });

      if (index != 2) {
        var nextPhaseModalElement = document.getElementById("nextPhaseModal");
        var nextPhaseModal = new bootstrap.Modal(nextPhaseModalElement);
        nextPhaseModal.show();
      } else {
        var completeChallengeModalElement =
          document.getElementById("completeChallenge");
        var completeChallengeModal = new bootstrap.Modal(
          completeChallengeModalElement
        );
        completeChallengeModal.show();
        resetButtons.forEach((resetButton) => {
          resetButton.disabled = true;
        });
      }
      progress += 33.33;
      progressiveBar.style.width = `${progress}%`;
    }, 1500);
  }
});

resetButtons.forEach((resetButton) => {
  resetButton.addEventListener("click", () => {
    game.reset();
  });
});

inputOfLogic.addEventListener("input", (e) => {
  if (e.target.value == "") {
    submitLogicButton.disabled = true;
  } else {
    submitLogicButton.disabled = false;
  }
});

const showAttemptsGoneModel = () => attemptsGoneModal.show();

function nextGame() {
  index++;
  armadilloVelocity = data[index].armadilloVelocity;
  armadilloPosition = data[index].armadilloPosition;
  foxVelocity = data[index].foxVelocity;
  foxPosition = data[index].foxPosition;
  endPositionText.innerText = data[index].finalPosition;
  startPositionText.innerText = data[index].halfPosition;
  distBetweenFoxArmadillo.innerText = data[index].distBetweenFoxAndArmadillo;

  timerRef.innerText = "04:00";
  [milliseconds, seconds, minutes] = [0, 0, 4];

  maxAttempts = 3;
  remainingAttempts.innerText = `${maxAttempts}`;
  game.reset();
}
