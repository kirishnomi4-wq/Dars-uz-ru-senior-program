const toggle = document.getElementById("toggle");
const about = document.getElementById("about");
const nameInput = document.getElementById("name");
const greet = document.getElementById("greet");
const send = document.getElementById("send");
const msg = document.getElementById("msg");

// 1. Ko'rsat / yashir
toggle.addEventListener("click", function () {
  if (about.style.display === "none") {
    about.style.display = "block";
  } else {
    about.style.display = "none";
  }
});

// 2. Jonli salom
nameInput.addEventListener("input", function () {
  greet.textContent = "Salom, " + nameInput.value + "!";
});

// 3. Forma tekshiruvi
send.addEventListener("click", function () {
  if (nameInput.value === "") {
    msg.textContent = "Ism kiriting";
  } else {
    msg.textContent = "Rahmat, " + nameInput.value + "!";
  }
});
