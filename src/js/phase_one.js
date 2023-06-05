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
let timer = null;

// VARIAVEIS USADAS NO CALCULO DO MRUV

const FPS = 60;
let position = 0;
let time = 0;
const dt = 100;
const velocity = 15;
const acceleration = 10;

setTimeout(() => {
  armadilloMRU.style.left = "1080px";
  armadilloMRUV.style.left = "1080px";
  questionModal.show();
  showQuestionButton.disabled = false;

  timer = setInterval(() => {
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
      questionModal.hide();
      progressLose.style.width = "100%";
    }

    timerRef.innerText = `${min}:${sec}`;
  }, 10);
}, 4000);

const newArmadillosMRU = setInterval(() => {
  armadillosMRU[indexMRU++].classList.replace("d-none", "d-block");
  armadillosMRUV[indexMRUV++].classList.replace("d-none", "d-block");
  timeTextMRU.textContent = `t = ${indexMRU - 1}`;

  if (indexMRU > 4) {
    clearInterval(newArmadillosMRU);
  }
}, 1000);

const newArmadillosMRUV = setInterval(() => {
  position = velocity * time + (acceleration * (time * time)) / 2;
  time = time + dt / 1000;
  armadilloMRUV.style.left = `${position}px`;
  timeTextMRUV.textContent = `t = ${indexMRUV - 1}`;
  indexMRUV++;
  if (position > 1080) {
    clearInterval(newArmadillosMRUV);
  }
}, 1000 / FPS);

options.forEach((option) => {
  option.addEventListener("click", () => {
    submitAnswerButton.disabled = false;
  });
});

submitAnswerButton.addEventListener("click", () => {
  showQuestionButton.disabled = true;
  let answer = 0;
  options.forEach((option) => {
    if (option.checked) {
      answer = option.id;
    }
  });
  if (answer == "radio-one") {
    nextPhaseModal.show();
    questionModal.hide();
    progressWin.style.width = "100%";
  } else {
    gameOverModal.show();
    questionModal.hide();
    showQuestionButton.disabled = false;
    attemptsText.innerText = `${--maxAttempts}`;
  }
  if (maxAttempts == 0) {
    attemptsGoneModal.show();
    progressLose.style.width = "100%";
  }
});
