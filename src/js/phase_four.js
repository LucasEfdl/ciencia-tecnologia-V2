import data from "../data/data.json" assert { type: "json" };

const initialScreen = document.getElementById("initial-screen");
const startGameButton = document.querySelector("[data-start-game]");
const gameScreen = document.querySelector("[data-game-screen]");
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
const progressiveBar = document.querySelectorAll(".progress");
const nextPhaseButtons = document.querySelectorAll("[data-next-phase]");
let remainingAttempts = document.querySelector("[data-attempts]");
let maxAttempts = 3;
let maxQuantityQuestions = 100 / data.length;
const armadilloElement = document.querySelector("[data-armadillo");
const foxElement = document.querySelector("[data-fox");

const timerRef = document.querySelector("[data-timer-display]");
let [milliseconds, seconds, minutes] = [0, 0, 4];
let timer = null;

var completeChallengeModalElement =
  document.getElementById("completeChallenge");
var completeChallengeModal = new bootstrap.Modal(completeChallengeModalElement);
var gameOverModalElement = document.getElementById("gameOverModal");
var gameOverModal = new bootstrap.Modal(gameOverModalElement);
var timeOverModalElement = document.getElementById("timeOverModal");
var timeOverModal = new bootstrap.Modal(timeOverModalElement);
var attemptsGoneModalElement = document.getElementById("attemptsGoneModal");
var attemptsGoneModal = new bootstrap.Modal(attemptsGoneModalElement);
const textOfLogic = document.querySelector('textarea[name="logic"]');
const submitLogicButton = document.getElementById("data-submit-logic");

const velocityWeight = {
  fox: [2, 3, 5],
  armadillo: [3, 5, 5],
};
let progressWin = 0;
let progressLose = 0;
let phase = 0;
let armadilloPosition = data[phase].armadilloPosition;
let armadilloVelocity =
  data[phase].armadilloVelocity * velocityWeight.armadillo[phase];
let foxPosition = data[phase].foxPosition;
let foxVelocity = data[phase].foxVelocity * velocityWeight.fox[phase];
let time = 0;
let difference = 0;

const optionChecked = [];

startPositionText.innerText = data[phase].halfPosition;
endPositionText.innerText = data[phase].finalPosition;
foxVelocityText.innerText = data[phase].foxVelocity;
halfTimeText.innerText = data[phase].halfTime;
distBetweenFoxArmadillo.innerText = data[phase].distBetweenFoxAndArmadillo;

document.addEventListener("DOMContentLoaded", () => {
  startGameButton.addEventListener("click", () => {
    initialScreen.classList.replace("d-block", "d-none");
    gameScreen.style.opacity = "1";
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
      lbl.textContent = data[phase].options[i];
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
      if (time == data[phase].halfTime) {
        clearInterval(mru);
        difference = this.armadillo;
        setTimeout(() => {
          this.armadilloElement.classList.remove("isMove");
          this.foxElement.classList.remove("foxIsMove");
          question.classList.replace("d-none", "d-block");
          timer = setInterval(this.timer.bind(this), 10);
        }, 880);
      }
      if (time == data[phase].finalTime) {
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
    this.armadillo = data[phase].armadilloPosition;
    this.fox = data[phase].foxPosition;
    armadilloVelocity =
      data[phase].armadilloVelocity * velocityWeight.armadillo[phase];
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
      progressLose += maxQuantityQuestions;
      progressiveBar[1].style.width = `${progressLose}%`;
      phase < 2 ? timeOverModal.show() : completeChallengeModal.show();
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
  if (num != data[phase].armadilloVelocity) {
    armadilloVelocity = num;
    game.startGame();
    setTimeout(() => {
      remainingAttempts.innerText = `${--maxAttempts}`;
      if (maxAttempts == 0) {
        progressLose += maxQuantityQuestions;
        progressiveBar[1].style.width = `${progressLose}%`;
        optionChecked.push(num);
        showAttemptsGoneModel();
      } else {
        gameOverModal.show();
      }
    }, 1500);
  } else {
    //armadilloVelocity = num;
    game.startGame();
    setTimeout(() => {
      resetButtons.forEach((resetButton) => {
        resetButton.disabled = false;
      });

      optionChecked.push(num);

      if (phase != 2) {
        var nextPhaseModalElement = document.getElementById("nextPhaseModal");
        var nextPhaseModal = new bootstrap.Modal(nextPhaseModalElement);
        nextPhaseModal.show();
      } else {
        completeChallengeModal.show();
        resetButtons.forEach((resetButton) => {
          resetButton.disabled = true;
        });
      }
      progressWin += maxQuantityQuestions;
      progressiveBar[0].style.width = `${progressWin}%`;
    }, 1500);
  }
});

resetButtons.forEach((resetButton) => {
  resetButton.addEventListener("click", () => {
    game.reset();
  });
});

textOfLogic.addEventListener("input", (e) => {
  if (e.target.value == "") {
    submitLogicButton.classList.add("disabled");
  } else {
    submitLogicButton.classList.remove("disabled");
  }
});

const showAttemptsGoneModel = () => attemptsGoneModal.show();

function nextGame() {
  phase++;
  armadilloVelocity =
    data[phase].armadilloVelocity * velocityWeight.armadillo[phase];
  armadilloPosition = data[phase].armadilloPosition;
  foxVelocity = data[phase].foxVelocity * velocityWeight.fox[phase];
  foxPosition = data[phase].foxPosition;
  endPositionText.innerText = data[phase].finalPosition;
  startPositionText.innerText = data[phase].halfPosition;
  distBetweenFoxArmadillo.innerText = data[phase].distBetweenFoxAndArmadillo;

  halfTimeText.innerText = data[phase].halfTime;

  timerRef.innerText = "04:00";
  [milliseconds, seconds, minutes] = [0, 0, 4];

  maxAttempts = 3;
  remainingAttempts.innerText = `${maxAttempts}`;
  game.reset();
}

submitLogicButton.addEventListener("click", () => {
  completeChallengeModal.hide();
  makeFile();
});

function makeFile() {
  let name = localStorage.getItem("nome");
  let answer = localStorage.getItem("answerChecked");
  let graphic = localStorage.getItem("graphicChecked");
  let velocity = localStorage.getItem("velocityChecked");
  const text = `
  Nome do aluno: ${name}

  === Fase um ===
  Resposta: ${answer}

  === Fase dois ===
  Gráfico marcado: ${graphic}

  == Fase três ==
  Resposta marcada: ${velocity}

  === Fase quatro ===
  Opção marcada na primeira questão: ${optionChecked[0]};
  Opção marcada na segunda questão: ${optionChecked[1]};
  Opção marcada na segunda questão: ${optionChecked[2]};
  Lógida usada: ${textOfLogic.value}  
  `;

  const file = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(file);
  submitLogicButton.href = url;
  submitLogicButton.download = `${name}.txt`;
}
