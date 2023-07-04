import data from "../data/data.json" assert { type: "json" };

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
const nextChallengeModalElement = document.getElementById(
  `next-challenge-modal${breakpoint}`
);
const nextPhasegeModalElement = document.getElementById(
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
const nextChallengeButton = document.querySelector(
  `[data-next-challenge${breakpoint}]`
);
const progressWin = document.querySelector("[data-progress-win]");
const progressLose = document.querySelector("[data-progress-lose]");
let remainingAttempts = document.querySelector("[data-attempts]");
let maxAttempts = 3;

let questionsQuantity = 100 / data.length;
let progress = 0;

const labels = document.querySelectorAll(".form-check label");
const attemptsGoneModal = new bootstrap.Modal(attemptsGoneModalElement);
const timeOverModal = new bootstrap.Modal(timeOverModalElement);
const questionModal = new bootstrap.Modal(questionModalElement);
const nextChallengeModal = new bootstrap.Modal(nextChallengeModalElement);
const gameOverModal = new bootstrap.Modal(gameOverModalElement);
const nextPhaseModal = new bootstrap.Modal(nextPhasegeModalElement);

let [milliseconds, seconds, minutes] = [0, 0, 3];
let [elapsedMinutes, elapsedSeconds, elapsedMilliseconds] = [0, 0, 0];
let [minutesSpent, secondsSpent] = [0, 0];
let timer = null;
let currentChallenger = 0;

const distBetween = document.querySelector(`.dist-between${breakpoint}`);
const positionUtilEnd = document.querySelector(
  `.position-until-end${breakpoint}`
);
const foxVelocity = document.querySelector(`.fox-velocity${breakpoint}`);
const crashTime = document.querySelector(`.crash-time${breakpoint}`);

startGameButton.addEventListener("click", () => {
  initialScreen.classList.replace("d-block", "d-none");
  gameScreen.style.opacity = "1";
  game();
});

function game() {
  updateOptions();

  armadillo.style.animation = "armadillo-animation-before 2s linear forwards";
  fox.style.animation = "fox-animation-before 2s linear forwards";
  fox.children[0].classList.add("foxIsMoving");

  distBetween.innerText = data[currentChallenger].distBetweenFoxAndArmadillo;
  positionUtilEnd.innerText = data[currentChallenger].positionUntilEnd;
  foxVelocity.innerText = data[currentChallenger].foxVelocity;
  crashTime.innerText = data[currentChallenger].crashTime;

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

      progress += questionsQuantity;
      progressLose.style.width = `${progress}%`;

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
  if (gameScreen.offsetWidth >= 1200) {
    armadillo.style.left = "600px";
    fox.style.left = "400px";
  } else {
    armadillo.style.left = "220px";
    fox.style.left = "100px";
  }

  armadillo.style.animation = "none";

  fox.style.animation = "none";

  questionModal.show();
});

nextChallengeButton.addEventListener("click", () => {
  currentChallenger++;
  updateOptions();

  armadillo.style.left = "0px";
  fox.style.left = "-120px";
  armadillo.style.animation = "none";
  fox.style.animation = "none";
  maxAttempts = 3;
  remainingAttempts.innerText = `${maxAttempts}`;
  nextChallengeModal.hide();
  fox.children[0].classList.remove("foxIsMoving");

  setTimeout(() => {
    game();
  }, 1500);
});

function updateOptions() {
  labels.forEach((label, index) => {
    const option = index % data[currentChallenger].options.length;
    label.textContent = data[currentChallenger].options[option];
  });
}

submitAnswerButton.addEventListener("click", () => {
  let answer = [];

  showQuestionButton.disabled = true;

  options.forEach((option) => {
    if (option.checked) {
      const label = document.querySelector(`label[for="${option.id}"]`);
      const selectedValue = label.textContent;
      const str = selectedValue;
      answer.push(str);
    }
  });

  if (answer[0] == "8m/s" || answer[1] == "14m/s" || answer[2] == "5m/s") {
    animationWin();
    fox.children[0].classList.add("foxIsMoving");

    clearInterval(timer);

    setTimeout(() => {
      currentChallenger === 2
        ? nextPhaseModal.show()
        : nextChallengeModal.show();
      questionModal.hide();
      fox.children[0].classList.remove("foxIsMoving");

      progress += questionsQuantity;
      progressWin.style.width = `${progress}%`;
    }, 2000);
  } else {
    animationLose();
    fox.children[0].classList.add("foxIsMoving");

    setTimeout(() => {
      remainingAttempts.innerText = `${--maxAttempts}`;
      questionModal.hide();
      fox.children[0].classList.remove("foxIsMoving");
      if (maxAttempts == 0) {
        attemptsGoneModal.show();
        clearInterval(timer);
      } else {
        gameOverModal.show();
      }
      showQuestionButton.disabled = false;
    }, 2000);
  }

  localStorage.setItem("question-main-01-a", answer[0]);
  localStorage.setItem("question-main-01-b", answer[1]);
  localStorage.setItem("question-main-01-c", answer[2]);
  localStorage.setItem(
    "question-main-01-time",
    `tempo gasto: ${minutesSpent}:${secondsSpent}`
  );
});

function animationWin() {
  armadillo.style.animation = "armadillo-animation-after 1.3s linear forwards";
  fox.style.animation = "fox-animation-after 1.5s linear forwards";
}

function animationLose() {
  armadillo.style.animation = "armadillo-animation-lose 1.3s linear forwards";
  fox.style.animation = "fox-animation-win 1.5s linear forwards";
}
