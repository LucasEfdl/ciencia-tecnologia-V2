const initialScreen = document.querySelector("[data-inital-screen]");
const nameInput = document.querySelector("input[for=name]");
const startGameButton = document.querySelector("[data-start-game]");
const gameContainer = document.querySelector("[data-container]");

const armadilloMRU = document.querySelector("[data-armadilloMRU]");
const armadilloMRUV = document.querySelector("[data-armadilloMRUV]");
const armadillosMRU = document.querySelectorAll(".armadilloMRU");
const armadillosMRUV = document.querySelectorAll(".armadilloMRUV");
const timeTextMRU = document.querySelector("[data-time-textMRU]");
const timeTextMRUV = document.querySelector("[data-time-textMRUV]");
const timerRef = document.querySelector("[data-timer-display]");
const attemptsText = document.querySelector("[data-attempts]");
const timeOverModalElement = document.getElementById("timeOverModal");
const questionModalElement = document.querySelector("[data-question]");
const nextPhaseModalElement = document.getElementById("nextPhaseModal");
const gameOverModalElement = document.getElementById("gameOverModal");
const attemptsGoneModalElemenet = document.getElementById("attemptsGoneModal");
const options = document.querySelectorAll('input[type="radio"][name="option"]');
const showQuestionButton = document.querySelector("[data-show-question]");
const submitAnswerButton = document.querySelector("[data-submit-answer]");
const progressWin = document.querySelector("[data-progress-win]");
const progressLose = document.querySelector("[data-progress-lose]");
const timeOverModal = new bootstrap.Modal(timeOverModalElement);
const questionModal = new bootstrap.Modal(questionModalElement);
const nextPhaseModal = new bootstrap.Modal(nextPhaseModalElement);
const gameOverModal = new bootstrap.Modal(gameOverModalElement);
const attemptsGoneModal = new bootstrap.Modal(attemptsGoneModalElemenet);
let [milliseconds, seconds, minutes] = [0, 0, 3];
let indexMRU = 2;
let indexMRUV = 2;
let maxAttempts = 3;
let time = null;

function handleKeyDown(e) {
  if (e.key == "Enter") {
    initialScreen.classList.replace("d-block", "d-none");
    gameContainer.classList.replace("d-none", "d-flex");
    game();
  }
}

nameInput.addEventListener("input", (e) => {
  if (e.target.value != "") {
    startGameButton.disabled = false;
    document.addEventListener("keydown", handleKeyDown);
  } else {
    startGameButton.disabled = true;
    document.removeEventListener("keydown", handleKeyDown);
  }
});

startGameButton.addEventListener("click", () => {
  initialScreen.classList.replace("d-block", "d-none");
  gameContainer.classList.replace("d-none", "d-flex");
  localStorage.setItem("nome", nameInput.value);
  game();
});

function game() {
  setTimeout(() => {
    armadilloMRU.style.left = "1080px";
    showQuestionButton.disabled = false;
    questionModal.show();
    timer();
  }, 4000);
  setInterval(() => {
    armadilloMRUV.style.left = "1080px";
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
    }

    timerRef.innerText = `${min}:${sec}`;
  }, 10);
};

const newArmadillosMRU = () => {
  let newElements = setInterval(() => {
    armadillosMRU[indexMRU++].classList.replace("d-none", "d-block");
    timeTextMRU.textContent = `t = ${indexMRU}`;

    if (indexMRU > 4) {
      clearInterval(newElements);
    }
  }, 1000);
};

const newArmadillosMRUV = () => {
  let newElements = setInterval(() => {
    armadillosMRUV[indexMRUV++].classList.replace("d-none", "d-block");
    timeTextMRUV.textContent = `t = ${indexMRUV - 1}`;

    if (indexMRUV > 3) {
      clearInterval(newElements);
    }
  }, 1000);
};

options.forEach((option) => {
  option.addEventListener("click", () => {
    submitAnswerButton.disabled = false;
  });
});

submitAnswerButton.addEventListener("click", () => {
  let answer = 0;
  let value;
  showQuestionButton.disabled = true;
  options.forEach((option) => {
    if (option.checked) {
      answer = option.id;
    }
  });
  if (answer == "radio-one") {
    nextPhaseModal.show();
    questionModal.hide();
    progressWin.style.width = "100%";
    value = "A trajetória de baixo representa o movimento retilíneo uniforme";
  } else {
    gameOverModal.show();
    questionModal.hide();
    showQuestionButton.disabled = false;
    attemptsText.innerText = `${--maxAttempts}`;
  }
  if (maxAttempts == 0) {
    attemptsGoneModal.show();
    progressLose.style.width = "100%";
    value =
      "A trajetória de cima representa o movimento retilíneo uniformemente variado";
  }

  localStorage.setItem("answerChecked", value);
});
