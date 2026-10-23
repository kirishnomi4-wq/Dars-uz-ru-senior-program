const kartalar = document.querySelectorAll(".tarif");
const tanlov = document.getElementById("tanlov");

for (let i = 0; i < kartalar.length; i++) {
  const karta = kartalar[i];
  karta.querySelector(".tanlash").addEventListener("click", function () {
    for (let j = 0; j < kartalar.length; j++) {
      kartalar[j].classList.remove("tanlangan");
    }
    karta.classList.add("tanlangan");
    tanlov.textContent = "Siz tanladingiz: " + karta.dataset.nom;
  });
}
