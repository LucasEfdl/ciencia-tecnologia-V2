const initialScreen = document.getElementById("initial-screen");
const gameScreen = document.querySelector("[data-game-screen]");
let breakpoint = gameScreen.offsetWidth >= 1024 ? "-desktop" : "-mobile";

const startGameButton = document.querySelector(
  `[data-start-game${breakpoint}]`
);
const armadillo = document.querySelector(".object");
const fox = document.querySelector(".object-2");
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
const options = document.querySelectorAll(
  'input[type="radio"][name="velocity"]'
);
const showQuestionButton = document.querySelector(
  `[data-show-question${breakpoint}]`
);
const submitAnswerButton = document.querySelector(
  `[data-submit-answer${breakpoint}]`
);
const attemptsGoneModalElement = document.getElementById(
  `attemptsGoneModal${breakpoint}`
);
const resetButton = document.querySelector(`[data-reset${breakpoint}]`);
const progressWin = document.querySelector("[data-progress-win]");
const progressLose = document.querySelector("[data-progress-lose]");
let remainingAttempts = document.querySelector("[data-attempts]");
let maxAttempts = 3;
const attemptsGoneModal = new bootstrap.Modal(attemptsGoneModalElement);
const timeOverModal = new bootstrap.Modal(timeOverModalElement);
const questionModal = new bootstrap.Modal(questionModalElement);
const nextPhaseModal = new bootstrap.Modal(nextPhaseModalElement);
const gameOverModal = new bootstrap.Modal(gameOverModalElement);
let [milliseconds, seconds, minutes] = [0, 0, 3];
let [elapsedMinutes, elapsedSeconds, elapsedMilliseconds] = [0, 0, 0];
let [minutesSpent, secondsSpent] = [0, 0];
let timer = null;

startGameButton.addEventListener("click", () => {
  initialScreen.classList.replace("d-block", "d-none");
  gameScreen.style.opacity = "1";
  game();
});

function game() {
  armadillo.style.animation = "armadillo-animation-before 2s linear forwards";
  fox.style.animation = "fox-animation-before 2s linear forwards";

  setTimeout(() => {
    showQuestionButton.disabled = false;
    questionModal.show();
    time();
  }, 2000);
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

      questionModal.hide();
      timeOverModal.show();
      questionModal.hide();

      progressLose.style.width = "100%";

      localStorage.setItem(
        "question-main-01",
        "Sem resposta - tempo total gasto"
      );
    }

    timerRef.innerText = `${min}:${sec}`;
  }, 10);
};

options.forEach((option) => {
  option.addEventListener("click", () => {
    submitAnswerButton.disabled = false;
  });
});

resetButton.addEventListener("click", () => {
  breakpoint >= 1200
    ? (armadillo.style.left = "600px")
    : (armadillo.style.left = "220px");
  breakpoint >= 1200 ? (fox.style.left = "400px") : (fox.style.left = "100px");

  armadillo.style.animation = "none";

  fox.style.animation = "none";

  questionModal.show();
});

submitAnswerButton.addEventListener("click", () => {
  let answer = 0;

  showQuestionButton.disabled = true;

  options.forEach((option) => {
    if (option.checked) {
      const label = document.querySelector(`label[for="${option.id}"]`);
      const selectedValue = label.textContent;
      const str = selectedValue;
      answer = str;
    }
  });

  if (answer == "10m/s") {
    armadillo.style.animation =
      "armadillo-animation-after 1.3s linear forwards";
    fox.style.animation = "fox-animation-after 1.5s linear forwards";

    setTimeout(() => {
      nextPhaseModal.show();
      questionModal.hide();

      progressWin.style.width = "100%";
    }, 2000);
  } else {
    armadillo.style.animation = "armadillo-animation-lose 1.3s linear forwards";
    fox.style.animation = "fox-animation-win 1.5s linear forwards";

    setTimeout(() => {
      remainingAttempts.innerText = `${--maxAttempts}`;
      questionModal.hide();
      maxAttempts == 0 ? attemptsGoneModal.show() : gameOverModal.show();
      showQuestionButton.disabled = false;
    }, 2000);
  }

  localStorage.setItem("question-main-01", answer);
  localStorage.setItem(
    "question-main-01-time",
    `tempo gasto: ${minutesSpent}:${secondsSpent}`
  );
});
