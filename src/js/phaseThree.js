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

//COntrolam o tempo
var FPS = 60;
var dt = 100; // ms
var t = 0;

//Variaveis do tatu
var positionInitialTatu = 0;
var positionTatu = positionInitialTatu;
var VelocityTatu = 20;

//Variaveis da raposa
var positionInitialRaposa = 0;
var positionRaposa = positionInitialRaposa;
var VelocityRaposa = 40;

//Variaveis do carro
var positionInitialCarro = 0;
var positionCarro = positionInitialCarro;
var VelocityCarro = 30;

class Game {
  constructor(tatu, raposa, carro) {
    this.tatu = tatu;
    this.raposa = raposa
    this.carro = carro
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
      if (positionTatu >= gameContainer.offsetWidth / 2 - 240) {
        clearInterval(momento_1);
        raposa.style.display = "block";
        carro.style.display = "block";
        startButton2.style.display = "block";
      }
    }, 1000 / FPS);
  }

  start_2() {
    t = 0
    positionInitialTatu = gameContainer.offsetWidth / 2 - 240;
    positionInitialRaposa = 0
    positionInitialCarro = 0
    const momento_2 = setInterval(() => {
      
      t = t + dt / 1000;
      positionTatu = positionInitialTatu + VelocityTatu * t;
      positionRaposa = positionInitialRaposa + VelocityRaposa * t;
      positionCarro= positionInitialCarro + VelocityCarro * t;
      
      this.tatu.style.left = `${positionTatu}px`;
      this.raposa.style.left = `${positionRaposa}px`;
      this.carro.style.top = `${positionCarro}px`;
      if (positionTatu >= gameContainer.offsetWidth - 200) {
        clearInterval(momento_2);
        alert("O tatu escapou com sucesso!!");
      } else if(positionRaposa >= positionTatu){
        clearInterval(momento_2)
        alert("O peba foi pego pela raposa!!")
      }
    }, 1000 / FPS);
  }

  reset() {
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
  startButton2.style.display = "none"
  game.start_2();
})

resetBtn.addEventListener("click", () => {
  game.reset();
  setTimeout(() => {
    game.start_1();
  }, 3000);
});
