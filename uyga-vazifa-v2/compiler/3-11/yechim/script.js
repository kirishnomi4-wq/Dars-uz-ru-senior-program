// REJA:
// 1. Har mahsulotga "sevimli" belgisi (true/false) — massivda saqlanadi.
// 2. Har kartochkaga ♥ tugmasi: bosilsa belgi almashadi, katalog qayta chiziladi.
// 3. Tepada "Sevimli: N" — belgilanganlar soni.
// 4. "Faqat sevimlilar" tugmasi — faqat belgilanganlarni ko'rsatadi.

const mahsulotlar = [
  { nom: "Futbolka", narx: 89000, toifa: "kiyim", emoji: "👕", sevimli: false },
  { nom: "Kepka", narx: 45000, toifa: "kiyim", emoji: "🧢", sevimli: false },
  { nom: "Krossovka", narx: 320000, toifa: "kiyim", emoji: "👟", sevimli: false },
  { nom: "To'p", narx: 120000, toifa: "sport", emoji: "⚽", sevimli: false },
  { nom: "Raketka", narx: 210000, toifa: "sport", emoji: "🏸", sevimli: false },
  { nom: "Skakalka", narx: 35000, toifa: "sport", emoji: "🪢", sevimli: false }
];

const katalog = document.getElementById("katalog");
const sevSon = document.getElementById("sevSon");
let joriyToifa = "hammasi";

function chiz(toifa) {
  joriyToifa = toifa;
  katalog.innerHTML = "";
  let son = 0;
  for (let i = 0; i < mahsulotlar.length; i++) {
    const m = mahsulotlar[i];
    if (m.sevimli) son++;
    const korsat = toifa === "hammasi" || m.toifa === toifa || (toifa === "sevimli" && m.sevimli);
    if (korsat) {
      katalog.innerHTML += '<div class="karta"><button class="sev' + (m.sevimli ? ' on' : '') + '" data-i="' + i + '">♥</button><div class="emoji">' + m.emoji + '</div><h3>' + m.nom + '</h3><div class="narx">' + m.narx + " so'm</div></div>";
    }
  }
  sevSon.textContent = "Sevimli: " + son;
}

katalog.addEventListener("click", function (e) {
  if (e.target.classList.contains("sev")) {
    const i = e.target.dataset.i;
    mahsulotlar[i].sevimli = !mahsulotlar[i].sevimli;
    chiz(joriyToifa);
  }
});

const tugmalar = document.querySelectorAll(".toifalar button");
for (let i = 0; i < tugmalar.length; i++) {
  tugmalar[i].addEventListener("click", function () {
    chiz(tugmalar[i].dataset.t);
  });
}

chiz("hammasi");
