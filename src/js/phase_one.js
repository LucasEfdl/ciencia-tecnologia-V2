// **********************  GENERAL  ********************** //
const gameContainer = document.getElementById("game-container");
const overlay = document.querySelector("[data-js=overlay]");
const inputValocity = document.getElementById("velocidadeDigitada");

// **********************  OBJECTS  ********************** //
const mainObject = document.getElementById("object");
const secondObject = document.getElementById("object2");

// **********************  BUTTONS  ********************** //
const intoGameBtn = document.getElementById("start-button");
const confirmAnswertBtn = document.querySelector("[data-js=confirmAnswert]");
const resetBtn = document.getElementById("reset");

// **********************  POSITION TIME FUNCTION VAR  ********************** //
var position = [0, 0];
var initialPosition = [0, -450];
var velocity = [30, 40];
var time = 0;

// **********************  GAME  ********************** //
class Game {
  constructor(mObject, sObject) {
    this.object = mObject;
    this.objectTwo = sObject;
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
  displayGameContainerStart() {
    document.getElementById("initial-screen").style.backgroundImage = "";
    document
      .querySelector("[data-js=game-screen]")
      .classList.replace("d-flex", "d-none");
    document
      .getElementById("start-button")
      .classList.replace("d-none", "d-flex");
  }

  startGame() {
    const mru = setInterval(() => {
      position[0] = initialPosition[0] + velocity[0] * time; // fórmula da função horária da posição
      position[1] = initialPosition[1] + velocity[1] * time;

      this.object.style.left = `${position[0]}px`;
      this.objectTwo.style.left = `${position[1]}px`;

      if (time == 20) {
        clearInterval(mru); // o objeto tem de parar na metade da width

        setTimeout(() => {
          overlay.classList.replace("d-none", "d-block");
        }, 800);
      }

      if (time == 40) {
        clearInterval(mru);

        this.object.style.left = `${position[0] - 100}px`;
        this.objectTwo.style.left = `${position[1] - 150}px`;
      }

      time++;
    }, 1000 / 60);
  }
}

const game = new Game(mainObject, secondObject);

intoGameBtn.addEventListener("click", () => {
  game.displayGameContainer();

  setTimeout(() => {
    game.startGame();
  }, 100);
});

confirmAnswertBtn.addEventListener("click", () => {
  overlay.classList.replace("d-block", "d-none");
  const reset = () => {
    time = 0;
    xo = 0;
    xo2 = -500;
    mainPosition = 0;
    mainVelocity = 90;
    secondPosition = 0;
    this.object.style.left = 0 + "px";
    this.object2.style.left = -500 + "px";
  };

  const radioButtons = document.querySelectorAll(
    'input[type="radio"][name="velocity"]'
  );
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
  if (num != 30) {
    velocity[0] = num;
    setTimeout(() => {
      alert(" A rapose te pegou, resposta incorreta");
      reset();
      game.displayGameContainerStart();
    }, 600);
  } else {
    velocity[0] = num;
    setTimeout(() => {
      alert("Voce ganhou, respota correta!");
      reset();
      game.displayGameContainerStart();
    }, 1500);
  }

  game.startGame();
});
