// **********************  GENERAL  ********************** //
import data from "../data/data.json" assert { type: "json" };

const overlay = document.querySelector("[data-js=overlay]");
const input = document.getElementById("inputVelocity");
const inputOfLogic = document.querySelector('input[type="text"][name="logic"]');

const endPosition = document.querySelector('span[class="final-position"]');
const halfPosition = document.querySelector('span[class="initial-position"]');
const halfTimeText = document.querySelector(".half-time-text");
const foxConstVelocityText = document.querySelector(".fox-const-velocity-text");
const distBetweenFoxArmadillo = document.querySelector(
  ".dist-between-fox-armadillo"
);

// **********************  OBJECTS  ********************** //
const armadillo = document.getElementById("object");
const fox = document.getElementById("object2");

// **********************  BUTTONS  ********************** //
const intoGameButton = document.getElementById("start-button");
const confirmAnswertButton = document.querySelector("[data-js=confirmAnswert]");
const resetButton = document.getElementById("reset");
const submitLogicButton = document.querySelector("[data-submit-logic]");

// **********************  DATA  ********************** //
let index = 0;
endPosition.innerHTML = data[index].finalPosition;
halfPosition.innerHTML = data[index].halfPosition;
foxConstVelocityText.innerHTML = data[index].foxVelocity;
halfTimeText.innerHTML = data[index].halfTime;
distBetweenFoxArmadillo.innerText = data[index].distBetweenFoxAndArmadillo;

let armadilloVelocity = data[index].armadilloVelocity;
let armadilloPosition = data[index].armadilloPosition;

let foxVelocity = data[index].foxVelocity;
let foxPosition = data[index].foxPosition;

let time = 0;

let difference = 0; // variável que guarda a diferença das posições
let position = 0;

// **********************  GAME  ********************** //
class Game {
  constructor(armadillo, fox) {
    this.armadillo = armadillo;
    this.fox = fox;
  }

  displayGameContainer() {
    document.querySelector("main").style.backgroundImage = "none";
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
    armadillo.classList.add("isMove");
    fox.classList.add("foxIsMove");
    const moveObjects = () => {
      // Calculando a posição dos objetos pela equação horária da posição
      position = armadilloPosition + armadilloVelocity * time;

      // Quando a resposta estiver errada, calcula a diferença de posição
      if (difference > position) {
        position = difference + armadilloVelocity;
      }

      this.armadillo.style.left = `${position}px`;
      this.fox.style.left = `${foxPosition + foxVelocity * time}px`;

      if (time == data[index].halfTime) {
        clearInterval(mru);
        setTimeout(() => {
          overlay.classList.replace("d-none", "d-block");
          armadillo.classList.remove("isMove");
          fox.classList.remove("foxIsMove");
        }, 800);
      }

      // Fazendo a raposa parar quando sua posição for muito próxima da posição do Tatu e a resposta do usuário estiver errada
      if (parseInt(this.fox.style.left) > parseInt(this.armadillo.style.left)) {
        clearInterval(mru);
        this.fox.style.left = `${parseInt(this.fox.style.left) - 50}px`;
        resetButton.disabled = false;
        setTimeout(() => {
          armadillo.classList.remove("isMove");
          fox.classList.remove("foxIsMove");
        }, 800);
      }

      // Quando a resposta estiver certa, o jogo acaba no tempo de 40s
      if (time == data[index].finalTime) {
        clearInterval(mru);
        this.fox.style.left = "1080px";

        resetButton.disabled = false;
      }
      time++;
    };

    const mru = setInterval(moveObjects, 1000 / 60);
  }

  reset() {
    this.armadillo.style.left = `${armadilloPosition}px`;
    this.fox.style.left = `${foxPosition}px`;
    armadilloVelocity = data[index].armadilloVelocity;
    position = 0;
    difference = 0;
    time = 0;
    input.value = "";
    resetButton.disabled = true;
    confirmAnswertButton.disabled = true;
    setTimeout(() => {
      game.startGame();
    }, 3000);
  }
}

const game = new Game(armadillo, fox);

intoGameButton.addEventListener("click", () => {
  game.displayGameContainer();
  setTimeout(() => {
    game.startGame();
  }, 1000);
});

input.addEventListener("input", (e) => {
  let numValue = parseInt(e.target.value);
  if (
    e.target.value != "" &&
    !isNaN(numValue) &&
    numValue <= data[index].armadilloVelocity
  ) {
    confirmAnswertButton.disabled = false;
  } else {
    confirmAnswertButton.disabled = true;
  }
});

confirmAnswertButton.addEventListener("click", () => {
  overlay.classList.replace("d-block", "d-none");
  let num = 0;
  const selectInputValue = input.value;
  const numValue = selectInputValue;
  num = parseInt(numValue);
  if (num != data[index].armadilloVelocity) {
    armadilloVelocity = num;
    difference = position;
    game.startGame();
    setTimeout(() => {
      var modalElement = document.getElementById("meuModal2");
      var modal = new bootstrap.Modal(modalElement);
      modal.show();
    }, 1500);
  } else {
    armadilloVelocity = num;
    game.startGame();
    setTimeout(() => {
      var modalElement = document.getElementById("meuModal");
      var modal = new bootstrap.Modal(modalElement);

      if (index < 2) {
        modal.show();
      }

      if (index == 2) {
        var completeChallengeModalElement =
          document.getElementById("completeChallenge");
        var completeChallengeModal = new bootstrap.Modal(
          completeChallengeModalElement
        );
        completeChallengeModal.show();
      }

      armadillo.classList.remove("isMove");
      fox.classList.remove("foxIsMove");
    }, 1500);
  }
});

resetButton.addEventListener("click", () => {
  game.reset();
});

document.addEventListener("DOMContentLoaded", function () {
  var botaoReset = document.getElementById("btreset");
  botaoReset.addEventListener("click", resetGame);
});

function resetGame() {
  game.reset();
}

document.addEventListener("DOMContentLoaded", function () {
  var botaoReset = document.getElementById("btGo");
  botaoReset.addEventListener("click", nextGame);
});

inputOfLogic.addEventListener("input", (e) => {
  if (e.target.value == "") {
    submitLogicButton.disabled = true;
  } else {
    submitLogicButton.disabled = false;
  }
});

submitLogicButton.addEventListener("click", () => {
  console.log(inputOfLogic.value);
})

function nextGame() {
  index++;

  endPosition.innerHTML = data[index].finalPosition;
  halfPosition.innerHTML = data[index].halfPosition;
  foxConstVelocityText.innerHTML = data[index].foxVelocity;
  foxVelocity = data[index].foxVelocity;
  foxPosition = data[index].foxPosition;
  armadilloVelocity = data[index].armadilloVelocity;
  halfTimeText.innerHTML = data[index].halfTime;
  distBetweenFoxArmadillo.innerText = data[index].distBetweenFoxAndArmadillo;

  game.reset();
}
