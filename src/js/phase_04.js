import data from "../data/data.json" assert { type: "json" };

const initialScreen = document.getElementById("initial-screen");
const gameScreen = document.querySelector("[data-game-screen]");

let breakpoint = gameScreen.offsetWidth >= 1024 ? "-desktop" : "-mobile";
const startGameButton = document.querySelector(
  `[data-start-game${breakpoint}]`
);
const questionModalElement = document.getElementById(`question${breakpoint}`);
const endPositionText = document.querySelector(".end-position-text");
const startPositionText = document.querySelector(".start-position-text");
const foxVelocityText = document.querySelector(".fox-velocity-text");
const crashTimeText = document.querySelector(".crash-time-text");
const distBetweenFoxArmadillo = document.querySelector(
  ".dist-between-fox-armadillo"
);
const radioButtons = document.querySelectorAll(
  'input[type="radio"][name="velocity"]'
);
const confirmAnswerButton = document.querySelector(
  `[data-confirm-answer${breakpoint}]`
);
const resetButtons = document.querySelectorAll("[data-reset]");
const label = document.querySelectorAll(".form-check label");
const progressiveBar = document.querySelectorAll(".progress");
const nextChallengeButtons = document.querySelectorAll("[data-next-challenge]");
const nextPhaseButtons = document.querySelectorAll("[data-next-phase]");
let remainingAttempts = document.querySelector("[data-attempts]");
let maxAttempts = 3;
let maxQuantityQuestions = 100 / data.length;
const armadilloElement = document.querySelector("[data-armadillo");
const foxElement = document.querySelector("[data-fox");

const timerRef = document.querySelector("[data-timer-display]");
let [milliseconds, seconds, minutes] = [0, 0, 4];
let timer = null;
const questionModal = new bootstrap.Modal(questionModalElement);
const nextPhaseModalElement = document.getElementById(
  `next-phase-modal${breakpoint}`
);
const nextPhaseModal = new bootstrap.Modal(nextPhaseModalElement);
var gameOverModalElement = document.getElementById(
  `game-over-modal${breakpoint}`
);
var gameOverModal = new bootstrap.Modal(gameOverModalElement);
var timeOverModalElement = document.getElementById(
  `timeOverModal${breakpoint}`
);
var timeOverModal = new bootstrap.Modal(timeOverModalElement);
var attemptsGoneModalElement = document.getElementById(
  `attemptsGoneModal${breakpoint}`
);
var attemptsGoneModal = new bootstrap.Modal(attemptsGoneModalElement);

const velocityWeight = {
  fox: [2.5, 2.6666, 2.6666],
  armadillo: [4, 2.2857, 2.461],
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

startPositionText.innerText = data[phase].positionUntilEnd;
endPositionText.innerText = data[phase].finalPosition;
foxVelocityText.innerText = data[phase].foxVelocity;
distBetweenFoxArmadillo.innerText = data[phase].distBetweenFoxAndArmadillo;
crashTimeText.innerText = data[phase].crashTime;

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

  nextChallengeButtons.forEach((nextChallengeButton) => {
    nextChallengeButton.addEventListener("click", nextGame);
  });
});

class Game {
  constructor(armadilloElement, foxElement) {
    this.armadilloElement = armadilloElement;
    this.foxElement = foxElement;
  }

  startGame() {
    label.forEach((lbl, i) => {
      const index = i % data[phase].options.length;
      lbl.textContent = data[phase].options[index];
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
          questionModal.show();
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
      questionModal.hide();
      progressLose += maxQuantityQuestions;
      progressiveBar[1].style.width = `${progressLose}%`;
      timeOverModal.show();
    }

    timerRef.innerText = `${min}:${sec}`;
  }
}

const game = new Game(armadilloElement, foxElement);

confirmAnswerButton.addEventListener("click", () => {
  questionModal.hide();
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
        phase < 2 ? showAttemptsGoneModel() : nextPhaseModal.show();
      } else {
        gameOverModal.show();
      }
    }, 1500);
  } else {
    game.startGame();
    setTimeout(() => {
      resetButtons.forEach((resetButton) => {
        resetButton.disabled = false;
      });

      optionChecked.push(num);

      if (phase != 2) {
        var nextChallengeModalElement = document.getElementById(
          `next-challenge-modal${breakpoint}`
        );
        var nextChallengeModal = new bootstrap.Modal(nextChallengeModalElement);
        nextChallengeModal.show();
      } else {
        localStorage.setItem("question-04-a", optionChecked[0]);
        localStorage.setItem("question-04-b", optionChecked[1]);
        localStorage.setItem("question-04-c", optionChecked[2]);

        nextPhaseModal.show();
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

const showAttemptsGoneModel = () => attemptsGoneModal.show();

function nextGame() {
  phase++;
  if (phase == 2) {
    nextChallengeButtons.forEach((nextChallengeButton) =>
      nextChallengeButton.classList.add("d-none")
    );
    nextPhaseButtons.forEach((nextPhaseButton) =>
      nextPhaseButton.classList.remove("d-none")
    );
  }
  armadilloVelocity =
    data[phase].armadilloVelocity * velocityWeight.armadillo[phase];
  armadilloPosition = data[phase].armadilloPosition;
  foxVelocity = data[phase].foxVelocity * velocityWeight.fox[phase];
  foxPosition = data[phase].foxPosition;
  endPositionText.innerText = data[phase].finalPosition;
  startPositionText.innerText = data[phase].positionUntilEnd;
  distBetweenFoxArmadillo.innerText = data[phase].distBetweenFoxAndArmadillo;
  crashTimeText.innerText = data[phase].crashTime;
  foxVelocityText.innerText = data[phase].foxVelocity;

  timerRef.innerText = "04:00";
  [milliseconds, seconds, minutes] = [0, 0, 4];

  maxAttempts = 3;
  remainingAttempts.innerText = `${maxAttempts}`;
  game.reset();
}
