// REJA:
// 1. Har mahsulotga "sevimli" belgisi (true/false) — massivda saqlanadi.
// 2. Har kartochkaga ♥ tugmasi: bosilsa belgi almashadi, katalog qayta chiziladi.
// 3. Tepada "Sevimli: N" — belgilanganlar soni.
// 4. "Faqat sevimlilar" tugmasi — faqat belgilanganlarni ko'rsatadi.

const products = [
  { name: "Futbolka", price: 89000, category: "kiyim", emoji: "👕", favorite: false },
  { name: "Kepka", price: 45000, category: "kiyim", emoji: "🧢", favorite: false },
  { name: "Krossovka", price: 320000, category: "kiyim", emoji: "👟", favorite: false },
  { name: "To'p", price: 120000, category: "sport", emoji: "⚽", favorite: false },
  { name: "Raketka", price: 210000, category: "sport", emoji: "🏸", favorite: false },
  { name: "Skakalka", price: 35000, category: "sport", emoji: "🪢", favorite: false }
];

const catalog = document.getElementById("catalog");
const favCount = document.getElementById("favCount");
let currentCategory = "all";

function render(category) {
  currentCategory = category;
  catalog.innerHTML = "";
  let count = 0;
  for (let i = 0; i < products.length; i++) {
    const m = products[i];
    if (m.favorite) count++;
    const visible = category === "all" || m.category === category || (category === "favorites" && m.favorite);
    if (visible) {
      catalog.innerHTML += '<div class="card"><button class="fav' + (m.favorite ? ' on' : '') + '" data-i="' + i + '">♥</button><div class="emoji">' + m.emoji + '</div><h3>' + m.name + '</h3><div class="price">' + m.price + " so'm</div></div>";
    }
  }
  favCount.textContent = "Sevimli: " + count;
}

catalog.addEventListener("click", function (e) {
  if (e.target.classList.contains("fav")) {
    const i = e.target.dataset.i;
    products[i].favorite = !products[i].favorite;
    render(currentCategory);
  }
});

const buttons = document.querySelectorAll(".categories button");
for (let i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener("click", function () {
    render(buttons[i].dataset.t);
  });
}

render("all");
