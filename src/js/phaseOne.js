// object animation script
const gameContainer = document.getElementById("game-container");
const gameObject = document.getElementById("object");
const gameObject2 = document.getElementById("object2");
const startBtn = document.getElementById("startGame");
const verifyBtn = document.getElementById("question-options");
const resetBtn = document.getElementById("reset");
const startLevel = document.getElementById("startLevel");

// question animation script
const text = document.getElementById("question-text");
const startButton = document.getElementById("start-button");

class Game {
  constructor(object) {
    this.object = object;
    this.object2 = object2;
  }

  displayGameContainer() {
    document.getElementById("game-start").style.display = "none";
    document.getElementById("game-container").style.display = "block";
  }

  start() {
    var FPS = 60;
    var dt = 100; // ms
    var xo = 500;
    var t = 0; // tempo
    var posX = xo;
    var vox = document.getElementById("velocidadeDigitada").value;
    var vox2 = 150;
    var tempo = 0;
    var xo2 = 0;
    var posX2 = xo2;

    const obj = this.object;
    const obj2 = this.object2;

    const interval = setInterval(() => {
      Math.round((tempo += 0.733));
      document.getElementById("tempo").value = tempo.toFixed(0) + " min";
      t = t + dt / 1000;
      posX = xo + vox * t;
      posX2 = xo2 + vox2 * t;
      obj.style.left = `${posX}px`;
      obj2.style.left = `${posX2}px`;
      if (posX > gameContainer.offsetWidth - 100) {
        posX = xo;
        t = 0;
        clearInterval(interval);
      }
      if (posX2 >= posX - 100){
        clearInterval(interval);
        
      }
    }, 1000 / FPS);
  }

  reset() {
    const obj = this.object;
    const obj2 = this.object2;
    obj.style.left = 500 + "px";
    obj2.style.left = 0 + "px";
    document.getElementById("tempo").value = "";
  }
}

const game = new Game(gameObject);
const overlay = document.querySelector(".overlay");

startButton.addEventListener("click", () => {
  game.displayGameContainer();
  overlay.classList.add("active");
  startLevel.addEventListener("click", () => {
    game.start();
    overlay.style.display = "none";
  });
});

resetBtn.addEventListener("click", () => {
  game.reset();
  setTimeout(() => {
    game.start();
  }, 3000);
});