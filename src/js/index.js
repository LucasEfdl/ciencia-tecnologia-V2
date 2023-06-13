const nameInput = document.querySelector("input[for=name]");
const startGameButton = document.querySelector("[data-start-game]");

nameInput.addEventListener("input", (e) => {
  if (e.target.value != "") {
    startGameButton.classList.remove("disabled");
  } else {
    startGameButton.classList.add("disabled");
  }
});

startGameButton.addEventListener("click", () => {
  localStorage.setItem("nome", nameInput.value);
});