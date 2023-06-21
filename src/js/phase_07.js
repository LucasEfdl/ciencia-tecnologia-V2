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
const textOfLogic = document.querySelector('textarea[name="logic"]');
const submitLogicButton = document.getElementById("data-submit-logic");
var completeChallengeModalElement =
  document.getElementById("completeChallenge");
const progressWin = document.querySelector("[data-progress-win]");
const progressLose = document.querySelector("[data-progress-lose]");
const timeOverModal = new bootstrap.Modal(timeOverModalElement);
const questionModal = new bootstrap.Modal(questionModalElement);
const gameOverModal = new bootstrap.Modal(gameOverModalElement);
var completeChallengeModal = new bootstrap.Modal(completeChallengeModalElement);
let [milliseconds, seconds, minutes] = [0, 0, 3];
let [elapsedMinutes, elapsedSeconds, elapsedMilliseconds] = [0, 0, 0];
let [minutesSpent, secondsSpent] = [0, 0];
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
  armadillo.style.animation = "armadillo-animation 4s linear forwards";

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
    completeChallengeModal.show();
    questionModal.hide();
    progressWin.style.width = "100%";
    velocity = `velocidade = ${answer} (certo)`;
  } else {
    gameOverModal.show();
    questionModal.hide();
    showQuestionButton.disabled = false;
  }

  localStorage.setItem("question-07", velocity);
  localStorage.setItem(
    "question-07-time",
    `tempo gasto: ${minutesSpent}:${secondsSpent}`
  );
});

textOfLogic.addEventListener("input", (e) => {
  if (e.target.value == "") {
    submitLogicButton.classList.add("disabled");
  } else {
    submitLogicButton.classList.remove("disabled");
  }
});

submitLogicButton.addEventListener("click", () => {
  makeFile();
});

function makeFile() {
  let name = localStorage.getItem("nome");
  let [questionOne, questionOneTime] = [
    localStorage.getItem("question-01"),
    localStorage.getItem("question-01-time"),
  ];
  let [questionTwo, questionTwoTime] = [
    localStorage.getItem("question-02"),
    localStorage.getItem("question-02-time"),
  ];
  let [questionThree, questionThreeTime] = [
    localStorage.getItem("question-03"),
    localStorage.getItem("question-03-time"),
  ];
  let [questionFourA, questionFourB, questionFourC] = [
    localStorage.getItem("question-04-a"),
    localStorage.getItem("question-04-b"),
    localStorage.getItem("question-04-c"),
  ];
  let [questionFive, questionFiveTime] = [
    localStorage.getItem("question-05"),
    localStorage.getItem("question-05-time"),
  ];
  let [questionSix, questionSixTime] = [
    localStorage.getItem("question-06"),
    localStorage.getItem("question-06-time"),
  ];
  let [questionSeven, questionSevenTime] = [
    localStorage.getItem("question-07"),
    localStorage.getItem("question-07-time"),
  ];
  const text = `
  Nome do aluno: ${name}

  === Fase um ===
  Resposta marcada: ${questionOne};
  ${questionOneTime}

  === Fase dois ===
  Resposta marcada: ${questionTwo};
  ${questionTwoTime};

  === Fase três ===
  Resposta marcada: ${questionThree};
  ${questionThreeTime}

  === Fase quatro ===
  Opção marcada na primeira questão: ${questionFourA};
  Opção marcada na segunda questão: ${questionFourB};
  Opção marcada na segunda questão: ${questionFourC};
  
  === Fase cinco ===
  Resposta marcada: ${questionFive};
  ${questionFiveTime}

  === Fase seis ===
  Resposta marcada: ${questionSix};
  ${questionSixTime}

  === Fase Sete ===
  Resposta marcada: ${questionSeven};
  ${questionSevenTime}
  `;

  const file = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(file);
  submitLogicButton.href = url;
  submitLogicButton.download = `${name}.txt`;
}
