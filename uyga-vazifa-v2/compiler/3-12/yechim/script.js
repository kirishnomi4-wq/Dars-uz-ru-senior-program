// AI'ga yozgan so'rovim: "Savatga Kepka qo'shsam jami 0 o'rniga «045000» chiqyapti. Narx matn bo'lib qolgan.
// Jami doim son bo'lib hisoblansin — Number() bilan. Boshqa joyni o'zgartirma."

const mahsulotlar = [
  { nom: "Futbolka", narx: 89000 },
  { nom: "Kepka", narx: "45000" },
  { nom: "To'p", narx: 120000 },
  { nom: "Skakalka", narx: 35000 }
];
let savat = [];

const katalog = document.getElementById("katalog");
const savatList = document.getElementById("savatList");
const jamiEl = document.getElementById("jami");

for (let i = 0; i < mahsulotlar.length; i++) {
  katalog.innerHTML += '<div class="karta"><h3>' + mahsulotlar[i].nom + '</h3><p>' + mahsulotlar[i].narx + " so'm</p><button data-i=\"" + i + '">Savatga</button></div>';
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

// Buyurtma berish
const buyurtma = document.getElementById("buyurtma");
const xabar = document.getElementById("xabar");
buyurtma.addEventListener("click", function () {
  if (savat.length === 0) {
    xabar.textContent = "Savat bo'sh";
    return;
  }
  xabar.textContent = "Buyurtma qabul qilindi: " + jami() + " so'm";
  savat = [];
  savatList.innerHTML = "";
  jamiEl.textContent = 0;
});
