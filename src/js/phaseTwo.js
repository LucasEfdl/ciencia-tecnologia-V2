const gameContainer = document.getElementById("game-container");
const text = document.getElementById("question-text");
const overlay = document.querySelector("[data-js=overlay]");
const inputValocity = document.getElementById("velocidadeDigitada");

var answer;

// **********************  OBJECTS  ********************** //
const mainObject = document.getElementById("object");
const secondObject = document.getElementById("object2");
const carro = document.getElementById("object3");

// **********************  BUTTONS  ********************** //
const intoGame = document.getElementById("start-button");
const confirmAnswert = document.querySelector("[data-js=confirmAnswert]");
const resetBtn = document.getElementById("reset");

// **********************  EQUATIONS  ********************** //
var FPS = 60;
var mainPosition = 0;
var secondPosition = 0;
var mainVelocity = 90; // main object
var secondVelocity = 60; // second object
var distance = 100; // ms

var xo = 0;
var xo2 = -500;
var time = 0;

//Variaveis do tatu
var positionInitialTatu = 0;
var positionTatu = positionInitialTatu;
var VelocityTatu = 20;
var VelocityTatu2;

//Variaveis da raposa
var positionInitialRaposa = 0;
var positionRaposa = positionInitialRaposa;
var VelocityRaposa = 53;

//Variaveis do carro
var positionInitialCarro = 0;
var positionCarro = positionInitialCarro;
var VelocityCarro = 80;
var resposta;

class Game {
  constructor(tatu, raposa, carro) {
    this.tatu = tatu;
    this.raposa = raposa;
    this.carro = carro;
  }

  displayGameContainer() {
    document.getElementById("initial-screen").style.backgroundImage = "none";
    document
      .querySelector("[data-js=game-screen]")
      .classList.replace("d-none", "d-flex");
    document
      .getElementById("start-button")
      .classList.replace("d-flex", "d-none");
  }

  start_1() {
    const momento_1 = setInterval(() => {
      time = time + distance / 1000;
      positionTatu = positionInitialTatu + VelocityTatu * time;
      this.tatu.style.left = `${positionTatu}px`;

      if (positionTatu >= gameContainer.offsetWidth / 2 - 125) {
        clearInterval(momento_1);
        this.raposa.style.display = "block";
        this.carro.style.display = "block";
        confirmAnswert.style.display = "block";

        setTimeout(() => {
          this.start_2();
        }, 1000);
      }
    }, 1000 / FPS);
  }

  start_2() {
    resposta = parseFloat(
      prompt("Qual a velocidade do bega para escapa dessa situação?")
    );
    time = 0;
    positionInitialTatu = gameContainer.offsetWidth / 2 - 100;
    positionInitialRaposa = 0;
    positionInitialCarro = 0;
    VelocityTatu2 = resposta;
    const momento_2 = setInterval(() => {
      time = time + distance / 1000;
      positionTatu = positionInitialTatu + VelocityTatu2 * time;
      positionRaposa = positionInitialRaposa + VelocityRaposa * time;
      positionCarro = positionInitialCarro + VelocityCarro * time;

      this.tatu.style.left = `${positionTatu}px`;
      this.raposa.style.left = `${positionRaposa}px`;
      this.carro.style.top = `${positionCarro}px`;
      if (positionTatu > gameContainer.offsetWidth - 60) {
        clearInterval(momento_2);
        alert("O tatu escapou com sucesso!!");
      } else if (positionRaposa >= positionTatu - 60) {
        clearInterval(momento_2);
        alert("O peba foi pego pela raposa!!");
      } else if (positionCarro >= gameContainer.offsetHeight - 155) {
        carro.style.display = "none";
      } else if (
        this.tatu.offsetLeft >= 900 &&
        this.tatu.offsetLeft <= 980 &&
        this.carro.offsetTop >= 277 &&
        this.carro.offsetTop <= 429
      ) {
        alert("O tatu foi atropelado!");
        clearInterval(momento_2);
      } else if (positionRaposa >= gameContainer.offsetWidth) {
        this.raposa.style.display = "none";
      }
    }, 1000 / FPS);
  }

  reset() {
    //Variaveis do tatu
    positionInitialTatu = 0;
    positionTatu = positionInitialTatu;
    VelocityTatu = 20;
    VelocityTatu2 = 10;

    // Variaveis da raposa
    positionInitialRaposa = 0;
    positionRaposa = positionInitialRaposa;
    VelocityRaposa = 60;

    //Variaveis do carro
    positionInitialCarro = 0;
    positionCarro = positionInitialCarro;
    VelocityCarro = 80;
    resposta;

    //resetando as posições
    this.tatu.style.left = 0 + "px";
    this.raposa.style.left = 0 + "px";
    this.carro.style.top = 0 + "px";

    //display none
    this.raposa.style.display = "none";
    this.carro.style.display = "none";
  }
}

const game = new Game(mainObject, secondObject, carro);

intoGame.addEventListener("click", () => {
  game.displayGameContainer();

  overlay.classList.replace("d-none", "d-block");

  confirmAnswert.addEventListener("click", () => {
    overlay.classList.replace("d-block", "d-none");
    game.start_1();
  });
});

resetBtn.addEventListener("click", () => {
  game.reset();

  setTimeout(() => {
    game.start_1();
  }, 3000);
});
