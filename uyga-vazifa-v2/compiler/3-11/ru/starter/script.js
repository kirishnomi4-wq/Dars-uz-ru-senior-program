const products = [
  { name: "Футболка", price: 89000, category: "kiyim", emoji: "👕" },
  { name: "Кепка", price: 45000, category: "kiyim", emoji: "🧢" },
  { name: "Кроссовки", price: 320000, category: "kiyim", emoji: "👟" },
  { name: "Мяч", price: 120000, category: "sport", emoji: "⚽" },
  { name: "Ракетка", price: 210000, category: "sport", emoji: "🏸" },
  { name: "Скакалка", price: 35000, category: "sport", emoji: "🪢" }
];

const catalog = document.getElementById("catalog");

function render(category) {
  catalog.innerHTML = "";
  for (let i = 0; i < products.length; i++) {
    const m = products[i];
    if (category === "all" || m.category === category) {
      catalog.innerHTML += '<div class="card"><div class="emoji">' + m.emoji + '</div><h3>' + m.name + '</h3><div class="price">' + m.price + " сум</div></div>";
    }
  }
}

const buttons = document.querySelectorAll(".categories button");
for (let i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener("click", function () {
    render(buttons[i].dataset.t);
  });
}

render("all");
