// object animation script
const gameContainer = document.getElementById("game-container");
const gameObject = document.getElementById("object");
const startBtn = document.getElementById("startGame");
const verifyBtn = document.getElementById("question-options");
const resetBtn = document.getElementById("reset");

// question animation script
const text = document.getElementById("question-text");
const startButton = document.getElementById("start-button");
const letters = text.innerHTML.split("");
text.innerHTML = "";

class Game {
  constructor(object) {
    this.object = object;
  }

  animatedText() {
    letters.forEach((letter, index) => {
      setTimeout(() => {
        text.innerHTML += letter;
        text.style.visibility = "visible";
      }, 20 * index);
    });
  }

  displayGameContainer() {
    document.getElementById("game-start").style.display = "none";
    document.getElementById("game-container").style.display = "block";
    document.getElementById("questions").style.display = "block";
    this.animatedText();
  }

  start() {
    var FPS = 60;
    var dt = 100; // ms
    var xo = 0;
    var t = 0; // tempo
    var posX = xo;
    var vox = 90;
    var tempo = 0;

    const obj = this.object;

    const interval = setInterval(() => {
      Math.round((tempo += 0.68));
      document.getElementById("tempo").value = tempo.toFixed(0) + " min";
      t = t + dt / 1000;
      posX = xo + vox * t;
      obj.style.left = `${posX}px`;
      if (posX > gameContainer.offsetWidth - 100) {
        posX = xo;
        t = 0;
        clearInterval(interval);
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

startButton.addEventListener("click", () => {
  game.displayGameContainer();
  setTimeout(() => {
    game.start();
  }, 3000);
});

resetBtn.addEventListener("click", () => {
  game.reset();
  setTimeout(() => {
    game.start();
  }, 3000);

});
