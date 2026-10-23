const mahsulotlar = [
  { nom: "Футболка", narx: 89000, toifa: "kiyim", emoji: "👕" },
  { nom: "Кепка", narx: 45000, toifa: "kiyim", emoji: "🧢" },
  { nom: "Кроссовки", narx: 320000, toifa: "kiyim", emoji: "👟" },
  { nom: "Мяч", narx: 120000, toifa: "sport", emoji: "⚽" },
  { nom: "Ракетка", narx: 210000, toifa: "sport", emoji: "🏸" },
  { nom: "Скакалка", narx: 35000, toifa: "sport", emoji: "🪢" }
];

const katalog = document.getElementById("katalog");

function chiz(toifa) {
  katalog.innerHTML = "";
  for (let i = 0; i < mahsulotlar.length; i++) {
    const m = mahsulotlar[i];
    if (toifa === "hammasi" || m.toifa === toifa) {
      katalog.innerHTML += '<div class="karta"><div class="emoji">' + m.emoji + '</div><h3>' + m.nom + '</h3><div class="narx">' + m.narx + " сум</div></div>";
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
