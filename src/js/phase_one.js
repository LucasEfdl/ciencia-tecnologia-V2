// ===================================  GENERAL  =================================== //
import data from "./data.json" assert { type: "json" };

const overlay = document.querySelector("[data-js=overlay]");
const userName = document.querySelector("input[for=nameUser]");
const timerRef = document.querySelector(".timerDisplay");
const endPosition = document.querySelector(".final-position");
const halfPosition = document.querySelector(".initial-position");
const halfTimeText = document.querySelector(".half-time-text");
const foxConstVelocityText = document.querySelector(".fox-const-velocity-text");
const label = document.querySelectorAll(".form-check label");
const progressiveBar = document.querySelector(".progress-bar");

var modalElement2 = document.getElementById("meuModal2");
var modal = new bootstrap.Modal(modalElement2);

var modalElement5 = document.getElementById("meuModal5");
var modal5 = new bootstrap.Modal(modalElement5);

let progress = 0;

// ===================================  OBJECTS  =================================== //
const armadillo = document.getElementById("object");
const fox = document.getElementById("object2");

// ===================================  BUTTONS  =================================== //
const intoGameButton = document.getElementById("start-button");
const confirmAnswertButton = document.querySelector("[data-js=confirmAnswert]");
const resetButton = document.getElementById("reset");
const restartButton = document.getElementById("restart");
const radioButtons = document.querySelectorAll(
  'input[type="radio"][name="velocity"]'
);

// ===================================  DATA  =================================== //
let index = 0;
endPosition.innerHTML = data[index].finalPosition;
halfPosition.innerHTML = data[index].halfPosition;
foxConstVelocityText.innerHTML = data[index].foxVelocity;
halfTimeText.innerHTML = data[index].halfTime;

let armadilloVelocity = data[index].armadilloVelocity;
let armadilloInitialPosition = data[index].armadilloInitialPosition;

let foxVelocity = data[index].foxVelocity;
let foxInitialPosition = data[index].foxInitialPosition;

let difference = 0;
let position = 0;

let time = 0;

let spentTime = [];
// ===================================  STOPWATCH  =================================== //
let [milliseconds, seconds, minutes] = [0, 0, 4];
let [stopwatchMilliseconds, stopwatchSeconds, stopwatchmMinutes] = [0, 0, 0];
let timer = null;
let stopwatch = null;

let m = 0;
let s = 0;

// ===================================  GAME  =================================== //
class Game {
  constructor(armadillo, fox) {
    this.armadillo = armadillo;
    this.fox = fox;
  }

  displayGameContainer() {
    document
      .getElementById("initial-screen")
      .classList.replace("d-flex", "d-none");
    document
      .querySelector("[data-js=game-screen]")
      .classList.replace("d-none", "d-flex");
  }

  displayGameContainerStart() {
    document
      .getElementById("initial-screen")
      .classList.replace("d-none", "d-flex");
    document
      .getElementById("start-button")
      .classList.replace("d-none", "d-flex");
    document
      .querySelector("[data-js=game-screen]")
      .classList.replace("d-flex", "d-none");
  }

  startGame() {
    label.forEach((lbl, i) => {
      lbl.textContent = data[index].options[i];
    });

    armadillo.classList.add("isMove");
    fox.classList.add("foxIsMove");

    const mru = setInterval(() => {
      position = armadilloInitialPosition + armadilloVelocity * time;
      if (difference > position) {
        position = difference + armadilloVelocity;
      }
      this.armadillo.style.left = `${position}px`;
      this.fox.style.left = `${foxInitialPosition + foxVelocity * time}px`;
      // se o tempo igual a metade do tempo final
      if (time == data[index].halfTime) {
        clearInterval(mru);
        setTimeout(() => {
          timer = setInterval(this.timer.bind(this), 10);
          stopwatch = setInterval(this.stopwatch.bind(this), 10);

          overlay.classList.replace("d-none", "d-block");
          armadillo.classList.remove("isMove");
          fox.classList.remove("foxIsMove");
        }, 800);
      }

      // se a posição da raposa for maior que a posição do tatu
      if (parseInt(this.fox.style.left) >= position) {
        clearInterval(mru);
        this.fox.style.left = `${parseInt(this.armadillo.style.left) - 20}px`;

        resetButton.disabled = false;
        setTimeout(() => {
          armadillo.classList.remove("isMove");
          fox.classList.remove("foxIsMove");
        }, 800);
      }

      // se o tempo for igual a 40
      if (time == data[index].finalTime) {
        clearInterval(mru);
        this.fox.style.left = "1100px";
        spentTime.push(`${m}:${s}`);
        resetButton.disabled = false;
      }

      time++;
    }, 1000 / 60);
  }

  reset() {
    this.armadillo.style.left = `${armadilloInitialPosition}px`;
    this.fox.style.left = `${foxInitialPosition}px`;
    armadilloVelocity = data[index].armadilloVelocity;
    position = 0;
    difference = 0;
    time = 0;
    resetButton.disabled = true;
    radioButtons.forEach((radioButton) => {
      if (radioButton.checked) {
        radioButton.checked = false;
      }
    });
    confirmAnswertButton.disabled = true;
    [milliseconds, seconds, minutes] = [0, 0, 4];
    [stopwatchMilliseconds, stopwatchSeconds, stopwatchmMinutes] = [0, 0, 0];
    timerRef.innerText = "04:00";
    setTimeout(() => {
      game.startGame();
    }, 3000);
  }

  timer() {
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

    timerRef.innerText = `${min}:${sec}`;

    if (minutes == 0 && seconds == 0) {
      clearInterval(timer);
      clearInterval(stopwatch);
      spentTime.push("Tempo esgotado");
      setTimeout(() => {
        overlay.classList.replace("d-block", "d-none");
        modal5.show();
      }, 800);
    }
  }

  stopwatch() {
    stopwatchMilliseconds += 10;
    if (stopwatchMilliseconds == 1000) {
      stopwatchMilliseconds = 0;
      stopwatchSeconds++;
      if (stopwatchSeconds == 60) {
        stopwatchSeconds = 0;
        stopwatchmMinutes++;
      }
    }
    m = stopwatchmMinutes < 10 ? "0" + stopwatchmMinutes : stopwatchmMinutes;
    s = stopwatchSeconds < 10 ? "0" + stopwatchSeconds : stopwatchSeconds;
  }
}

const game = new Game(armadillo, fox);

window.addEventListener("load", () => {
  function start() {
    game.displayGameContainer();
    setTimeout(() => {
      game.startGame();
    }, 1000);
  }

  function handleKeyDown(e) {
    if (e.key == "Enter") {
      start();
    }
  }

  intoGameButton.addEventListener("click", start);

  userName.addEventListener("input", (e) => {
    if (e.target.value != "") {
      document.addEventListener("keydown", handleKeyDown);
      intoGameButton.disabled = false;
    } else {
      document.removeEventListener("keydown", handleKeyDown);
      intoGameButton.disabled = true;
    }
  });
});

radioButtons.forEach((radioButton) => {
  radioButton.addEventListener("click", () => {
    confirmAnswertButton.disabled = false;
  });
});

confirmAnswertButton.addEventListener("click", () => {
  clearInterval(timer); // Para o temporizador
  clearInterval(stopwatch); // Para o cronômetro
  overlay.classList.replace("d-block", "d-none");
  let num = 0;
  radioButtons.forEach((radioButton) => {
    if (radioButton.checked) {
      // Seleciona o elemento label associado ao botão selecionado
      const label = document.querySelector(`label[for="${radioButton.id}"]`);
      // Recupera o valor do texto do label selecionado
      const selectedValue = label.textContent;
      const str = selectedValue;
      num = parseInt(str);
    }
  });
  if (num != data[index].armadilloVelocity) {
    armadilloVelocity = num;
    difference = position;
    game.startGame();
    setTimeout(() => {
      modal.show();
    }, 1500);
  } else {
    armadilloVelocity = num;
    difference = 0;
    game.startGame();
    setTimeout(() => {
      var modalElement = document.getElementById("meuModal");
      var modal = new bootstrap.Modal(modalElement);

      var modalElement3 = document.getElementById("meuModal3");
      var showInfoModal = new bootstrap.Modal(modalElement3);

      var showUserName = document.querySelector("[data-js=showUserName]");
      var showFirstTime = document.querySelector("[data-js=showFirstTime]");
      var showSecondTime = document.querySelector("[data-js=showSecondTime]");
      var showThirdTime = document.querySelector("[data-js=showThirdTime]");
      showUserName.innerHTML = userName.value;
      showFirstTime.innerHTML = spentTime[0];
      showSecondTime.innerHTML = spentTime[1];
      showThirdTime.innerHTML = spentTime[2];

      if (index < 2) {
        modal.show();
      }

      if (index == 2) {
        showInfoModal.show();
      }

      armadillo.classList.remove("isMove");
      fox.classList.remove("foxIsMove");

      progress += 33.33;
      progressiveBar.style.width = `${progress}%`;
    }, 1500);
  }
});

resetButton.addEventListener("click", () => {
  game.reset();
});

document.addEventListener("DOMContentLoaded", function () {
  var botaoReset = document.getElementById("btGo");
  var botaoNext = document.getElementById("btGo2");
  botaoReset.addEventListener("click", nextGame);
  botaoNext.addEventListener("click", nextGame);
});

restartButton.addEventListener("click", () => {
  game.reset();
});

function nextGame() {
  index++;

  endPosition.innerHTML = data[index].finalPosition;
  halfPosition.innerHTML = data[index].halfPosition;
  foxConstVelocityText.innerHTML = data[index].foxVelocity;
  foxVelocity = data[index].foxVelocity;
  armadilloVelocity = data[index].armadilloVelocity;
  halfTimeText.innerHTML = data[index].halfTime;
  foxInitialPosition = data[index].foxInitialPosition;

  game.reset();
}
