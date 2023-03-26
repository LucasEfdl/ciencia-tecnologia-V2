// object animation script
const gameContainer = document.getElementById("game-container");
const tatu = document.getElementById("object");
const raposa = document.getElementById("object2");
const carro = document.getElementById("object3");

//Botao começar
const overlay = document.querySelector(".overlay");

//Butons
const startLevel = document.getElementById("startLevel");
const startBtn = document.getElementById("startGame");
const verifyBtn = document.getElementById("question-options");
const resetBtn = document.getElementById("reset");
const startButton = document.getElementById("start-button");
const startButton2 = document.getElementById("start_button_2");

//Controlam o tempo
var FPS = 60;
var dt = 100; // ms
var t = 0;

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
    document.getElementById("game-start").style.display = "none";
    document.getElementById("game-container").style.display = "block";
  }

  start_1() {
    const momento_1 = setInterval(() => {
      t = t + dt / 1000;
      positionTatu = positionInitialTatu + VelocityTatu * t;
      this.tatu.style.left = `${positionTatu}px`;
      if (positionTatu >= gameContainer.offsetWidth / 2 - 125) {
        clearInterval(momento_1);
        raposa.style.display = "block";
        carro.style.display = "block";
        startButton2.style.display = "block";
      }
    }, 1000 / FPS);
  }

  start_2() {
    resposta = parseFloat(
      prompt("Qual a velocidade do bega para escapa dessa situação?")
    );
    t = 0;
    positionInitialTatu = gameContainer.offsetWidth / 2 - 100;
    positionInitialRaposa = 0;
    positionInitialCarro = 0;
    VelocityTatu2 = resposta;
    const momento_2 = setInterval(() => {
      t = t + dt / 1000;
      positionTatu = positionInitialTatu + VelocityTatu2 * t;
      positionRaposa = positionInitialRaposa + VelocityRaposa * t;
      positionCarro = positionInitialCarro + VelocityCarro * t;

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
        tatu.offsetLeft >= 900 &&
        tatu.offsetLeft <= 980 &&
        carro.offsetTop >= 277 &&
        carro.offsetTop <= 429
      ) {
        alert("O tatu foi atropelado!");
        clearInterval(momento_2);
      } else if (positionRaposa >= gameContainer.offsetWidth) {
        raposa.style.display = "none";
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
    tatu.style.left = 0 + "px";
    raposa.style.left = 0 + "px";
    carro.style.top = 0 + "px";

    //display none
    raposa.style.display = "none";
    carro.style.display = "none";
  }
}

const game = new Game(tatu, raposa, carro);

startButton.addEventListener("click", () => {
  game.displayGameContainer();
  overlay.classList.add("active"); // ajeitar essa merda
  startLevel.addEventListener("click", () => {
    game.start_1();
    overlay.style.display = "none";
  });
});

startButton2.addEventListener("click", () => {
  startButton2.style.display = "none";
  game.start_2();
});

//Defeituoso
resetBtn.addEventListener("click", () => {
  console.log(positionTatu);
  game.reset();
  console.log(positionTatu);
  overlay.style.display = "block";
  startLevel.addEventListener("click", () => {
    overlay.style.display = "none";
    game.start_1();
  });
  startButton2.addEventListener("click", () => {
    startButton2.style.display = "none";
    game.start_2();
  });
});
