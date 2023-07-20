import data from "../data/data.json" assert { type: "json" };

const initialScreen = document.getElementById("initial-screen");
const gameScreen = document.querySelector("[data-game-screen]");

let breakpoint = gameScreen.offsetWidth >= 1024 ? "-desktop" : "-mobile";

const startGameButton = document.querySelector(`[data-start-game`);
const armadillo = document.querySelector(".object");
const fox = document.querySelector(".object-2");
const timerRef = document.querySelector("[data-timer-display]");
const nextChallengeModalElement = document.getElementById(
  `next-challenge-modal${breakpoint}`
);
const nextPhaseModalElement = document.getElementById(
  `next-phase-modal${breakpoint}`
);
const options = document.querySelectorAll(
  'input[type="radio"][name="velocity"]'
);
const submitAnswerButton = document.querySelector(`[data-submit-answer`);
const resetButton = document.querySelector(`[data-reset]`);
const nextChallengeBtn = document.querySelector(`[data-next-challenge]`);
const nextChallengeButton = document.querySelector(
  `[data-next-challenge${breakpoint}]`
);
const balloonFox = document.querySelector(`.fox-balloon`);
const balloonFoxNext = document.querySelector(`.fox-balloon-next`);
const balloonAmadillo = document.querySelector(`.amadillo-balloon`);
const ballonnFoxWin = document.querySelector(`.fox-balloon-win`);
const progressWin = document.querySelector("[data-progress-win]");
const progressLose = document.querySelector("[data-progress-lose]");
let remainingAttempts = document.querySelector("[data-attempts]");
const footerElement = document.getElementById("footer");
let maxAttempts = 3;

let questionsQuantity = 100 / data.length;
let progress = 0;

let answer = [];

if (breakpoint == "-mobile") {
  submitAnswerButton.classList.add("btn-sm");
  nextChallengeBtn.classList.add("btn-sm");
}

console.log(balloonAmadillo);

const labels = document.querySelectorAll(".form-check label");
const nextChallengeModal = new bootstrap.Modal(nextChallengeModalElement);
const nextPhaseModal = new bootstrap.Modal(nextPhaseModalElement);

let [milliseconds, seconds, minutes] = [0, 0, 3];
let [elapsedMinutes, elapsedSeconds, elapsedMilliseconds] = [0, 0, 0];
let [minutesSpent, secondsSpent] = [0, 0];
const spentTime = [];
let timer = null;
let t = 0; // variavel para salvar o tempo da resposta
let currentChallenger = 0;

const distBetween = document.querySelectorAll(".dist-between");
const positionUtilEnd = document.querySelectorAll(".position-until-end");
const foxVelocity = document.querySelector(`.fox-velocity`);
const crashTime = document.querySelector(`.crash-time`);

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
    balloonFox.classList.replace("d-none", "d-flex");
    balloonAmadillo.classList.replace("d-none", "d-flex");
    footerElement.classList.replace("d-none", "d-flex");
    footerElement.style.animation = "footer-animated 0.5s linear forwards";
    fox.children[0].classList.replace("foxIsMoving", "fox");
    armadillo.children[0].classList.replace("armadilloIsMoving", "armadillo");
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
    fox.style.left = "280px";
  } else {
    armadillo.style.left = "300px";
    fox.style.left = "140px";
  }

  answer.pop();
  spentTime.pop();
  ballonnFoxWin.classList.replace("d-flex", "d-none");
  armadillo.style.animation = "none";
  fox.style.animation = "none";
  balloonAmadillo.classList.replace("d-none", "d-flex");
  balloonFox.classList.replace("d-none", "d-flex");
  footerElement.classList.replace("d-none", "d-flex");
});

nextChallengeButton.addEventListener("click", nextChallenge);
nextChallengeBtn.addEventListener("click", nextChallenge);

function nextChallenge() {
  currentChallenger++;
  nextChallengeModal.hide();
  balloonFox.classList.replace("d-flex", "d-none");
  balloonAmadillo.classList.replace("d-flex", "d-none");
  updateOptions();

  armadillo.style.left = "0px";
  fox.style.left = "-120px";
  armadillo.style.animation = "none";
  fox.style.animation = "none";
  maxAttempts = 3;
  remainingAttempts.innerText = `${maxAttempts}`;
  balloonFoxNext.classList.replace("d-flex", "d-none");
  fox.children[0].classList.remove("foxIsMoving");
  armadillo.children[0].classList.replace("armadillo", "armadilloIsMoving");

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
}

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

  balloonFox.classList.replace("d-flex", "d-none");
  balloonAmadillo.classList.replace("d-flex", "d-none");
  footerElement.classList.replace("d-flex", "d-none");
  armadillo.children[0].classList.replace("armadillo", "armadilloIsMoving");

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
      armadillo.children[0].classList.replace("armadilloIsMoving", "armadillo");
      if (maxAttempts == 0) {
        currentChallenger === 2
          ? nextPhaseModal.show()
          : nextChallengeModal.show();

        progress += questionsQuantity;
        progressLose.style.width = `${progress}%`;
      } else {
        ballonnFoxWin.classList.replace("d-none", "d-flex");
      }
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
