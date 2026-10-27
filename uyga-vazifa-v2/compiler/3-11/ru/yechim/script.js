// ПЛАН:
// 1. У каждого товара — флаг "sevimli" (true/false), хранится в массиве.
// 2. На каждой карточке кнопка ♥: при нажатии флаг меняется, каталог перерисовывается.
// 3. Вверху "Избранное: N" — число отмеченных.
// 4. Кнопка "Только избранное" показывает только отмеченные.

const products = [
  { name: "Футболка", price: 89000, category: "kiyim", emoji: "👕", favorite: false },
  { name: "Кепка", price: 45000, category: "kiyim", emoji: "🧢", favorite: false },
  { name: "Кроссовки", price: 320000, category: "kiyim", emoji: "👟", favorite: false },
  { name: "Мяч", price: 120000, category: "sport", emoji: "⚽", favorite: false },
  { name: "Ракетка", price: 210000, category: "sport", emoji: "🏸", favorite: false },
  { name: "Скакалка", price: 35000, category: "sport", emoji: "🪢", favorite: false }
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
      catalog.innerHTML += '<div class="card"><button class="fav' + (m.favorite ? ' on' : '') + '" data-i="' + i + '">♥</button><div class="emoji">' + m.emoji + '</div><h3>' + m.name + '</h3><div class="price">' + m.price + " сум</div></div>";
    }
  }
  favCount.textContent = "Избранное: " + count;
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
