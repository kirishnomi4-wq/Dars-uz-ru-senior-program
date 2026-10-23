// Мой запрос к AI: "Когда добавляю в корзину Кепку, итог показывает «045000» вместо числа. Цена осталась строкой.
// Пусть итог всегда считается как число — через Number(). Больше ничего не меняй."

const mahsulotlar = [
  { nom: "Футболка", narx: 89000 },
  { nom: "Кепка", narx: "45000" },
  { nom: "Мяч", narx: 120000 },
  { nom: "Скакалка", narx: 35000 }
];
let savat = [];

const katalog = document.getElementById("katalog");
const savatList = document.getElementById("savatList");
const jamiEl = document.getElementById("jami");

for (let i = 0; i < mahsulotlar.length; i++) {
  katalog.innerHTML += '<div class="karta"><h3>' + mahsulotlar[i].nom + '</h3><p>' + mahsulotlar[i].narx + " сум</p><button data-i=\"" + i + '">В корзину</button></div>';
}

function jami() {
  let s = 0;
  for (let i = 0; i < savat.length; i++) {
    s = s + Number(savat[i].narx);
  }
  return s;
}

function chizSavat() {
  savatList.innerHTML = "";
  for (let i = 0; i < savat.length; i++) {
    savatList.innerHTML += "<li>" + savat[i].nom + "</li>";
  }
  jamiEl.textContent = jami();
}

katalog.addEventListener("click", function (e) {
  if (e.target.dataset.i !== undefined) {
    savat.push(mahsulotlar[e.target.dataset.i]);
    chizSavat();
  }
});

// Оформить заказ
const buyurtma = document.getElementById("buyurtma");
const xabar = document.getElementById("xabar");
buyurtma.addEventListener("click", function () {
  if (savat.length === 0) {
    xabar.textContent = "Корзина пуста";
    return;
  }
  xabar.textContent = "Заказ принят: " + jami() + " сум";
  savat = [];
  savatList.innerHTML = "";
  jamiEl.textContent = 0;
});
