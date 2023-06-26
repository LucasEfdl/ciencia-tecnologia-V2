const nameInput = document.querySelector("input[for=name]");
const startGameButton = document.querySelector("[data-start-game]");

const randomName = [
  "tatu",
  "peba",
  "cobra",
  "cachorro",
  "gato",
  "baleia",
  "rato",
  "boi",
  "bicho-preguiça",
  "borboleta",
  "aranha",
  "minhoca",
];

nameInput.addEventListener("input", (e) => {
  if (e.target.value != "") {
    startGameButton.classList.remove("disabled");
  } else {
    startGameButton.classList.add("disabled");
  }
});

startGameButton.addEventListener("click", () => {
  const randomNum = Math.floor(Math.random() * 12);
  const nickname = randomName[randomNum];

  localStorage.setItem("nome", nameInput.value);
  localStorage.setItem("nickname", nickname)
});
