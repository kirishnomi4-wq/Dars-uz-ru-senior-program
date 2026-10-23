const toggle = document.getElementById("toggle");
const about = document.getElementById("about");
const nameInput = document.getElementById("name");
const greet = document.getElementById("greet");
const send = document.getElementById("send");
const msg = document.getElementById("msg");

// 1. Показать / скрыть
toggle.addEventListener("click", function () {
  if (about.style.display === "none") {
    about.style.display = "block";
  } else {
    about.style.display = "none";
  }
});

// 2. Живое приветствие
nameInput.addEventListener("input", function () {
  greet.textContent = "Привет, " + nameInput.value + "!";
});

// 3. Проверка формы
send.addEventListener("click", function () {
  if (nameInput.value === "") {
    msg.textContent = "Введите имя";
  } else {
    msg.textContent = "Спасибо, " + nameInput.value + "!";
  }
});
