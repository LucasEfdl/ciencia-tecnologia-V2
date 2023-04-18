// **********************  GENERAL  ********************** //
const gameContainer = document.getElementById("game-container");
const overlay = document.querySelector("[data-js=overlay]");

// **********************  OBJECTS  ********************** //
const mainObject = document.getElementById("object");
const secondObject = document.getElementById("object2");

// **********************  BUTTONS  ********************** //
const intoGameButton = document.getElementById("start-button");
const confirmAnswertButton = document.querySelector("[data-js=confirmAnswert]");
const resetButton = document.getElementById("reset");

// **********************  POSITION TIME FUNCTION VAR  ********************** //
let positions = [0, 0];
const initialPositions = [0, -450];
const velocities = [30, 40];
let time = 0;

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

  startGame(over) {
    const mru = setInterval(() => {
      if (over != 30) {
        positions[0] = "600px"; // O obejto fica em 600px quando o usuário erra a resposta
      } else {
        positions[0] = initialPositions[0] + velocities[0] * time; // Fórmula da função horária da posição
      }
      positions[1] = initialPositions[1] + velocities[1] * time;
      this.object.style.left = `${positions[0]}px`; // Movimentação do tatu
      this.objectTwo.style.left = `${positions[1]}px`; // Movimentação da raposa
      if (time == 20) {
        clearInterval(mru); // O objeto tem de parar na metade da width
        setTimeout(() => {
          overlay.classList.replace("d-none", "d-block");
        }, 800);
      }
      if (time == 40) {
        clearInterval(mru);
        this.object.style.left = `${positions[0] - 100}px`;
        this.objectTwo.style.left = `${positions[1] - 150}px`;
      }
      time++;
    }, 1000 / 60);
  }

  reset() {
    positions[0] = 0;
    positions[1] = 0;
    velocities[0] = 30;
    velocities[1] = 40;
    time = 0;
    this.object.style.left = `${initialPositions[0]}px`;
    this.objectTwo.style.left = `${initialPositions[1]}px`;
  }
}

const game = new Game(mainObject, secondObject);

intoGameButton.addEventListener("click", () => {
  game.displayGameContainer();
  setTimeout(() => {
    game.startGame(30);
  }, 100);
});

confirmAnswertButton.addEventListener("click", () => {
  overlay.classList.replace("d-block", "d-none");
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
    velocities[0] = num;
    setTimeout(() => {
      alert("A raposa te pegou, resposta incorreta!");
      game.reset();
      game.displayGameContainerStart();
    }, 600);
  } else {
    velocities[0] = num;
    setTimeout(() => {
      alert("Você ganhou, respota correta!");
      game.reset();
      game.displayGameContainerStart();
    }, 1500);
  }

  game.startGame(num);
});

resetButton.addEventListener("click", () => {
  game.reset();
});
