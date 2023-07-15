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
const balloonFox = document.querySelector(".fox-balloon-desktop");
const balloonFoxNext = document.querySelector(".fox-balloon-next-desktop");
const balloonAmadillo = document.querySelector(".amadillo-balloon-desktop");
const progressWin = document.querySelector("[data-progress-win]");
const progressLose = document.querySelector("[data-progress-lose]");
let remainingAttempts = document.querySelector("[data-attempts]");
const footerElement = document.getElementById("footer");
let maxAttempts = 3;

let questionsQuantity = 100 / data.length;
let progress = 0;

let answer = [];

const labels = document.querySelectorAll(".form-check label");
const attemptsGoneModal = new bootstrap.Modal(attemptsGoneModalElement);
const timeOverModal = new bootstrap.Modal(timeOverModalElement);
//const nextChallengeModal = new bootstrap.Modal(nextChallengeModalElement);
const gameOverModal = new bootstrap.Modal(gameOverModalElement);
const nextPhaseModal = new bootstrap.Modal(nextPhasegeModalElement);

let [milliseconds, seconds, minutes] = [0, 0, 3];
let [elapsedMinutes, elapsedSeconds, elapsedMilliseconds] = [0, 0, 0];
let [minutesSpent, secondsSpent] = [0, 0];
const spentTime = [];
let timer = null;
let t = 0; // variavel para salvar o tempo da resposta
let currentChallenger = 0;

const distBetween = document.querySelectorAll(".dist-between");
const positionUtilEnd = document.querySelectorAll(".position-until-end");
const foxVelocity = document.querySelector(`.fox-velocity${breakpoint}`);
const crashTime = document.querySelector(`.crash-time${breakpoint}`);

startGameButton.addEventListener("click", () => {
  initialScreen.classList.replace("d-block", "d-none");
  gameScreen.style.opacity = "1";
  game();
});

function game() {
  updateOptions();
  updatePositionUntilEnd();
  updateDistBetween();

  armadillo.style.animation = "armadillo-animation-before 2s linear forwards";
  fox.style.animation = "fox-animation-before 2s linear forwards";
  fox.children[0].classList.add("foxIsMoving");

  distBetween.innerText = data[currentChallenger].distBetweenFoxAndArmadillo;
  foxVelocity.innerText = data[currentChallenger].foxVelocity;
  crashTime.innerText = data[currentChallenger].crashTime;

  setTimeout(() => {
    showQuestionButton.disabled = false;

    balloonFox.classList.replace("d-none", "d-flex");
    balloonAmadillo.classList.replace("d-none", "d-flex");
    footerElement.classList.replace("d-none", "d-flex");
    footerElement.style.animation = "footer-animated 0.5s linear forwards";

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

      if (currentChallenger === 2) {
        nextPhaseModal.show();
      } else {
        nextChallengeModal.show();
      }

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
  time();
  if (gameScreen.offsetWidth >= 1200) {
    armadillo.style.left = "600px";
    fox.style.left = "400px";
  } else {
    armadillo.style.left = "220px";
    fox.style.left = "100px";
  }

  answer.pop();
  spentTime.pop();

  armadillo.style.animation = "none";

  fox.style.animation = "none";
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
  balloonFoxNext.classList.replace("d-flex", "d-none");
  fox.children[0].classList.remove("foxIsMoving");

  minutesSpent = 0;
  secondsSpent = 0;
  [milliseconds, seconds, minutes] = [0, 0, 3];
  [elapsedMinutes, elapsedSeconds, elapsedMilliseconds] = [0, 0, 0];
  timerRef.innerText = "03:00";

  footerElement.classList.replace("d-flex", "d-none");
  footerElement.style.animation = "none";

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

function updatePositionUntilEnd() {
  positionUtilEnd.forEach((item) => {
    item.innerText = data[currentChallenger].positionUntilEnd;
  });
}

function updateDistBetween() {
  distBetween.forEach((item) => {
    item.innerText = data[currentChallenger].distBetweenFoxAndArmadillo;
  });
}
updatePositionUntilEnd();
updateDistBetween();

submitAnswerButton.addEventListener("click", () => {
  clearInterval(timer);
  t = `${minutesSpent}:${secondsSpent}`;
  spentTime.push(t);

  showQuestionButton.disabled = true;
  balloonFox.classList.replace("d-flex", "d-none");
  balloonAmadillo.classList.replace("d-flex", "d-none");
  footerElement.classList.replace("d-flex", "d-none");

  options.forEach((option) => {
    if (option.checked) {
      const label = document.querySelector(`label[for="${option.id}"]`);
      const selectedValue = label.textContent;
      const str = selectedValue;
      answer.push(str);
    }
  });

  if (
    answer[currentChallenger] ==
    `${data[currentChallenger].armadilloVelocity}m/s`
  ) {
    animationWin();
    fox.children[0].classList.add("foxIsMoving");

    setTimeout(() => {
      currentChallenger === 2
        ? nextPhaseModal.show()
        : balloonFoxNext.classList.replace("d-none", "d-flex");
      fox.children[0].classList.remove("foxIsMoving");

      progress += questionsQuantity;
      progressWin.style.width = `${progress}%`;
    }, 2000);
  } else {
    animationLose();
    fox.children[0].classList.add("foxIsMoving");

    setTimeout(() => {
      remainingAttempts.innerText = `${--maxAttempts}`;
      fox.children[0].classList.remove("foxIsMoving");
      if (maxAttempts == 0) {
        currentChallenger === 2
          ? nextPhaseModal.show()
          : nextChallengeModal.show();

        progress += questionsQuantity;
        progressLose.style.width = `${progress}%`;
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
    "question-main-01-a-time",
    `tempo gasto: ${spentTime[0]}`
  );
  localStorage.setItem(
    "question-main-01-b-time",
    `tempo gasto: ${spentTime[1]}`
  );
  localStorage.setItem(
    "question-main-01-c-time",
    `tempo gasto: ${spentTime[2]}`
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
