// ПЛАН:
// 1. У каждого товара — флаг "sevimli" (true/false), хранится в массиве.
// 2. На каждой карточке кнопка ♥: при нажатии флаг меняется, каталог перерисовывается.
// 3. Вверху "Избранное: N" — число отмеченных.
// 4. Кнопка "Только избранное" показывает только отмеченные.

const mahsulotlar = [
  { nom: "Футболка", narx: 89000, toifa: "kiyim", emoji: "👕", sevimli: false },
  { nom: "Кепка", narx: 45000, toifa: "kiyim", emoji: "🧢", sevimli: false },
  { nom: "Кроссовки", narx: 320000, toifa: "kiyim", emoji: "👟", sevimli: false },
  { nom: "Мяч", narx: 120000, toifa: "sport", emoji: "⚽", sevimli: false },
  { nom: "Ракетка", narx: 210000, toifa: "sport", emoji: "🏸", sevimli: false },
  { nom: "Скакалка", narx: 35000, toifa: "sport", emoji: "🪢", sevimli: false }
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
      katalog.innerHTML += '<div class="karta"><button class="sev' + (m.sevimli ? ' on' : '') + '" data-i="' + i + '">♥</button><div class="emoji">' + m.emoji + '</div><h3>' + m.nom + '</h3><div class="narx">' + m.narx + " сум</div></div>";
    }
  }
  sevSon.textContent = "Избранное: " + son;
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
