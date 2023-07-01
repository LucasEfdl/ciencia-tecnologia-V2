const initialScreen = document.getElementById("initial-screen");
const gameScreen = document.querySelector("[data-game-screen]");

let breakpoint = gameScreen.offsetWidth >= 1024 ? "-desktop" : "-mobile";

const startGameButton = document.querySelector(
  `[data-start-game${breakpoint}]`
);
const armadillo = document.querySelector("[data-armadillo]");
const armadilloPositionText = document.querySelector(
  "[data-armadillo-position]"
);
const armadillos = document.querySelectorAll(".object");
const timeText = document.querySelector("[data-time-text]");
const timerRef = document.querySelector("[data-timer-display]");

const questionModalElement = document.getElementById(`question${breakpoint}`);
const timeOverModalElement = document.getElementById(
  `timeOverModal${breakpoint}`
);

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
let [elapsedMinutes, elapsedSeconds, elapsedMilliseconds] = [0, 0, 0];
let [minutesSpent, secondsSpent] = [0, 0];
let index = 2;
let timer = null;

const positionOnMobile = [131, 260, 392];
const positionOnDesktop = [270, 540, 810];
let key = 0;

startGameButton.addEventListener("click", () => {
  initialScreen.classList.replace("d-block", "d-none");
  gameScreen.style.opacity = "1";
  game();
});

function game() {
  armadillo.style.animation = "armadillo-animation 4s linear forwards";

  setTimeout(() => {
    showQuestionButton.disabled = false;
    questionModal.show();
    time();
  }, 4000);
  newArmadillos();
}

const time = () => {
  const countElapsedTime = () => {
    elapsedMilliseconds += 10;
    if (elapsedMilliseconds == 1000) {
      elapsedMilliseconds = 0;
      elapsedSeconds++;
      if (elapsedSeconds == 60) {
        elapsedSeconds = 0;
        elapsedMinutes++;
      }
    }

    minutesSpent = elapsedMinutes < 10 ? "0" + elapsedMinutes : elapsedMinutes;
    secondsSpent = elapsedSeconds < 10 ? "0" + elapsedSeconds : elapsedSeconds;
  };

  timer = setInterval(() => {
    countElapsedTime();

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
      clearInterval(countElapsedTime);

      question.classList.replace("d-block", "d-none");
      timeOverModal.show();
      questionModal.hide();
      progressLose.style.width = "100%";

      localStorage.setItem("question-06", "Sem resposta - tempo total gasto");
    }

    timerRef.innerText = `${min}:${sec}`;
  }, 10);
};

armadillos.forEach((armadillo, index) => {
  if (index >= 2) {
    gameScreen.offsetWidth >= 1200
      ? (armadillo.style.left = `${positionOnDesktop[key++]}px`)
      : (armadillo.style.left = `${positionOnMobile[key++]}px`);
  }
});

const newArmadillos = () => {
  let position = 10;
  let elements = setInterval(() => {
    armadillos[index++].classList.replace("d-none", "d-block");
    timeText.innerHTML = `t = ${index - 1}s`;
    armadilloPositionText.innerHTML = `s = ${position}m`;
    position += 10;

    if (index > 4) {
      clearInterval(elements);
      armadilloPositionText.innerHTML = `s = ${position}m`;
    }
  }, 1000);
};

options.forEach((option) => {
  option.addEventListener("click", () => {
    submitAnswerButton.disabled = false;
  });
});

submitAnswerButton.addEventListener("click", () => {
  let graphic;
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
    clearInterval(timer);
    progressWin.style.width = "100%";
    graphic = "posiçãoXtempo (certo)";
  } else {
    gameOverModal.show();
    questionModal.hide();
    showQuestionButton.disabled = false;
  }

  localStorage.setItem("question-06", graphic);
  localStorage.setItem(
    "question-06-time",
    `tempo gasto: ${minutesSpent}:${secondsSpent}`
  );
});
