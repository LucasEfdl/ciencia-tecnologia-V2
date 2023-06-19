const initialScreen = document.getElementById("initial-screen");
const gameScreen = document.querySelector("[data-game-screen]");
let breakpoint = gameScreen.offsetWidth >= 1024 ? "-desktop" : "-mobile";

const startGameButton = document.querySelector(
  `[data-start-game${breakpoint}]`
);

const armadilloMRU = document.querySelector("[data-armadilloMRU]");
const armadilloMRUV = document.querySelector("[data-armadilloMRUV]");
const armadillosMRU = document.querySelectorAll(".armadilloMRU");
const armadillosMRUV = document.querySelectorAll(".armadilloMRUV");
const timeTextMRU = document.querySelector("[data-time-textMRU]");
const timeTextMRUV = document.querySelector("[data-time-textMRUV]");
const timerRef = document.querySelector("[data-timer-display]");

const timeOverModalElement = document.getElementById(
  `time-over-modal${breakpoint}`
);
const questionModalElement = document.getElementById(`question${breakpoint}`);
const nextPhaseModalElement = document.getElementById(
  `next-phase-modal${breakpoint}`
);
const gameOverModalElement = document.getElementById(
  `game-over-modal${breakpoint}`
);
const options = document.querySelectorAll('input[type="radio"][name="option"]');
const showQuestionButton = document.querySelector(
  `[data-show-question${breakpoint}]`
);
const submitAnswerButton = document.querySelector(
  `[data-submit-answer${breakpoint}]`
);
const progressWin = document.querySelector("[data-progress-win]");
const progressLose = document.querySelector("[data-progress-lose]");

const timeOverModal = new bootstrap.Modal(timeOverModalElement);
const questionModal = new bootstrap.Modal(questionModalElement);
const nextPhaseModal = new bootstrap.Modal(nextPhaseModalElement);
const gameOverModal = new bootstrap.Modal(gameOverModalElement);

let [milliseconds, seconds, minutes] = [0, 0, 3];
let indexMRU = 2;
let indexMRUV = 2;
let time = null;

startGameButton.addEventListener("click", () => {
  initialScreen.classList.replace("d-block", "d-none");
  gameScreen.style.opacity = "1";
  game();
});

let position = gameScreen.offsetWidth - armadilloMRU.offsetWidth;
let pos = position / 4;
let initalPosMRU = pos;

function game() {
  armadilloMRU.style.animation = "armadillo-animation 4s linear";
  armadilloMRUV.style.animation = "armadillo-animation 3s ease-in";

  setTimeout(() => {
    armadilloMRU.style.left = `${position}px`;

    showQuestionButton.disabled = false;
    questionModal.show();
    timer();
  }, 4000);

  setTimeout(() => {
    armadilloMRUV.style.left = `${position}px`;
  }, 3000);

  newArmadillosMRU();
  newArmadillosMRUV();
}

const timer = () => {
  time = setInterval(() => {
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
      clearInterval(time);
      question.classList.replace("d-block", "d-none");
      timeOverModal.show();
      questionModal.hide();
      progressLose.style.width = "100%";

      localStorage.setItem("answerChecked", "sem resposta - tempo total gasto");
    }

    timerRef.innerText = `${min}:${sec}`;
  }, 10);
};

const newArmadillosMRU = () => {
  let newElements = setInterval(() => {
    armadillosMRU[indexMRU++].classList.replace("d-none", "d-block");
    timeTextMRU.textContent = `t = ${indexMRU - 1}`;

    if (indexMRU > 4) {
      clearInterval(newElements);
    }
  }, 1000);
};

armadillosMRU.forEach((armadillo, index) => {
  if (index >= 2 && pos <= position) {
    armadillo.style.left = `${pos}px`;
    pos += initalPosMRU;
  }
});

const newArmadillosMRUV = () => {
  let newElements = setInterval(() => {
    armadillosMRUV[indexMRUV++].classList.replace("d-none", "d-block");
    timeTextMRUV.textContent = `t = ${indexMRUV - 1}`;

    if (indexMRUV > 3) {
      clearInterval(newElements);
    }
  }, 1000);
};

let posMRUVPC = [190, 550];
let posMRUVMOBILE = [183, 363];
let key = 0;

armadillosMRUV.forEach((armadillo, index) => {
  if (index >= 2) {
    position > 800
      ? (armadillo.style.left = `${posMRUVPC[key++]}px`)
      : (armadillo.style.left = `${posMRUVMOBILE[key++]}px`);
  }
});

options.forEach((option) => {
  option.addEventListener("click", () => {
    submitAnswerButton.disabled = false;
  });
});

submitAnswerButton.addEventListener("click", () => {
  let value;
  let answer = 0;
  showQuestionButton.disabled = true;
  options.forEach((option) => {
    if (option.checked) {
      answer = option.id;
    }
  });
  if (answer == "radio-two" || answer == "radio-four") {
    nextPhaseModal.show();
    questionModal.hide();
    progressWin.style.width = "100%";
    value = "A trajetória de cima representa o movimento retilíneo uniforme";
  } else {
    gameOverModal.show();
    questionModal.hide();
    showQuestionButton.disabled = false;
  }

  localStorage.setItem("answerChecked", value);
});
