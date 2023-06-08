const initialScreen = document.getElementById("initial-screen");
const gameScreen = document.querySelector("[data-game-screen]");
const startGameButton = document.querySelector("[data-start-game]");

const armadillo = document.getElementById("armadillo");
const armadillos = document.querySelectorAll(".armadillo");
const timeText = document.querySelector("[data-time-text]");
const positionText = document.querySelector("[data-text-postion]");
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
let index = 2;
let position = 5;
let maxAttempts = 3;
let timer = null;

startGameButton.addEventListener("click", () => {
  initialScreen.classList.replace("d-block", "d-none");
  gameScreen.style.opacity = "1";
  game();
});

function game() {
  armadillo.style.animation = "armadillo-animation 4s linear";

  setTimeout(() => {
    armadillo.style.left = "1080px";
    showQuestionButton.disabled = false;
    questionModal.show();
    time();
  }, 4000);
  newArmadillos();
}

const time = () => {
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
};

const newArmadillos = () => {
  let elements = setInterval(() => {
    armadillos[index++].classList.replace("d-none", "d-block");
    timeText.textContent = `t = ${index - 1}`;
    positionText.innerText = `${position}m`;
    position += 5;

    if (index > 4) {
      positionText.innerText = `${position}m`;

      clearInterval(elements);
    }
  }, 1000);
};

options.forEach((option) => {
  option.addEventListener("click", () => {
    submitAnswerButton.disabled = false;
  });
});

submitAnswerButton.addEventListener("click", () => {
  let velocity;
  let answer;

  showQuestionButton.disabled = true;
  options.forEach((option) => {
    if (option.checked) {
      const label = document.querySelector(`label[for="${option.id}"]`);
      const selectedValue = label.textContent;
      answer = selectedValue;
    }
  });

  if (answer == "5m/s") {
    nextPhaseModal.show();
    questionModal.hide();
    progressWin.style.width = "100%";
    velocity = `velocidade = ${answer} (certo)`;
  } else {
    gameOverModal.show();
    questionModal.hide();
    showQuestionButton.disabled = false;
    attemptsText.innerText = `${--maxAttempts}`;
  }
  if (maxAttempts == 0) {
    attemptsGoneModal.show();
    progressLose.style.width = "100%";
    velocity = `velocidade = ${answer} (errado)`;
  }

  localStorage.setItem("velocityChecked", velocity);
});
