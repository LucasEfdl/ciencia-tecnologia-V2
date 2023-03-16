// object animation script
const gameContainer = document.getElementById("game-container");
const gameObject = document.getElementById("object");
const startLevel = document.getElementById("startLevel");
const gameObject2 = document.getElementById("object2");
const gameObject3 = document.getElementById("object3");

const startBtn = document.getElementById("startGame");
const verifyBtn = document.getElementById("question-options");
const resetBtn = document.getElementById("reset");

// question animation script
const text = document.getElementById("question-text");
const startButton = document.getElementById("start-button");

class Game {
  constructor(object) {
    this.object = object;
  }

  displayGameContainer() {
    document.getElementById("game-start").style.display = "none";
    document.getElementById("game-container").style.display = "block";
  }

  start() {
    const obj = this.object;
    var FPS = 60;
    var dt = 100; // ms
    var xo = 0;
    var t = 0; // tempo
    var posX = xo;
    var vox = 40;
    var tempo = 0;

    const interval = setInterval(() => {
      Math.round((tempo += 0.87));
      document.getElementById("tempo").value = tempo.toFixed(0) + " min";
      t = t + dt / 1000;
      posX = xo + vox * t;
      obj.style.left = `${posX}px`;
      if (posX >= gameContainer.offsetWidth / 2 - 200) {
        console.log(posX);
        clearInterval(interval);
        gameObject2.style.display = "block";
        gameObject3.style.display = "block";
        overlay2.style.display = "none";
      }
    }, 1000 / FPS);
  }

  reset() {
    const obj = this.object;
    obj.style.left = 0 + "px";
    document.getElementById("tempo").value = "";
  }
}

const game = new Game(gameObject);
const overlay = document.querySelector(".overlay");
const overlay2 = document.querySelector(".overlay2");

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
