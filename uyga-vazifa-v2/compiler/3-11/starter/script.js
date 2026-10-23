const mahsulotlar = [
  { nom: "Futbolka", narx: 89000, toifa: "kiyim", emoji: "👕" },
  { nom: "Kepka", narx: 45000, toifa: "kiyim", emoji: "🧢" },
  { nom: "Krossovka", narx: 320000, toifa: "kiyim", emoji: "👟" },
  { nom: "To'p", narx: 120000, toifa: "sport", emoji: "⚽" },
  { nom: "Raketka", narx: 210000, toifa: "sport", emoji: "🏸" },
  { nom: "Skakalka", narx: 35000, toifa: "sport", emoji: "🪢" }
];

const katalog = document.getElementById("katalog");

function chiz(toifa) {
  katalog.innerHTML = "";
  for (let i = 0; i < mahsulotlar.length; i++) {
    const m = mahsulotlar[i];
    if (toifa === "hammasi" || m.toifa === toifa) {
      katalog.innerHTML += '<div class="karta"><div class="emoji">' + m.emoji + '</div><h3>' + m.nom + '</h3><div class="narx">' + m.narx + " so'm</div></div>";
    }
  }
}

const tugmalar = document.querySelectorAll(".toifalar button");
for (let i = 0; i < tugmalar.length; i++) {
  tugmalar[i].addEventListener("click", function () {
    chiz(tugmalar[i].dataset.t);
  });
}

chiz("hammasi");
