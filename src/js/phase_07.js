const initialScreen = document.getElementById("initial-screen");
const gameScreen = document.querySelector("[data-game-screen]");

let breakpoint = gameScreen.offsetWidth >= 1024 ? "-desktop" : "-mobile";

const startGameButton = document.querySelector(
  `[data-start-game${breakpoint}]`
);
const armadillo = document.querySelector("[data-armadillo]");
const armadillos = document.querySelectorAll(".object");
const timeText = document.querySelector("[data-time-text]");
const positionText = document.querySelector("[data-text-postion]");
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
let index = 2;
let timer = null;

const postionMobile = [134, 264, 394];
const postionDesktop = [270, 540, 810];
let key = 0;

startGameButton.addEventListener("click", () => {
  initialScreen.classList.replace("d-block", "d-none");
  gameScreen.style.opacity = "1";
  game();
});

function game() {
  armadillo.style.animation = "armadillo-animation 4s linear";

  setTimeout(() => {
    armadillo.style.left = `${
      gameScreen.offsetWidth - armadillo.offsetWidth
    }px`;
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

      localStorage.setItem(
        "graphicChecked",
        "Sem resposta - tempo total gasto"
      );
    }

    timerRef.innerText = `${min}:${sec}`;
  }, 10);
};

armadillos.forEach((armadillo, index) => {
  if (index >= 2) {
    gameScreen.offsetWidth >= 1200
      ? (armadillo.style.left = `${postionDesktop[key++]}px`)
      : (armadillo.style.left = `${postionMobile[key++]}px`);
  }
});

const newArmadillos = () => {
  let elements = setInterval(() => {
    armadillos[index++].classList.replace("d-none", "d-block");
    timeText.innerHTML = `t = ${index - 1}s <br/> v = 7m/s`;

    if (index > 4) {
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

  if (answer == "28m") {
    nextPhaseModal.show();
    questionModal.hide();
    progressWin.style.width = "100%";
    velocity = `velocidade = ${answer} (certo)`;
  } else {
    gameOverModal.show();
    questionModal.hide();
    showQuestionButton.disabled = false;
  }

  localStorage.setItem("velocityChecked", velocity);
});
