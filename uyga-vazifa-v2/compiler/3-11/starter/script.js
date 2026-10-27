const products = [
  { name: "Futbolka", price: 89000, category: "kiyim", emoji: "👕" },
  { name: "Kepka", price: 45000, category: "kiyim", emoji: "🧢" },
  { name: "Krossovka", price: 320000, category: "kiyim", emoji: "👟" },
  { name: "To'p", price: 120000, category: "sport", emoji: "⚽" },
  { name: "Raketka", price: 210000, category: "sport", emoji: "🏸" },
  { name: "Skakalka", price: 35000, category: "sport", emoji: "🪢" }
];

const catalog = document.getElementById("catalog");

function render(category) {
  catalog.innerHTML = "";
  for (let i = 0; i < products.length; i++) {
    const m = products[i];
    if (category === "all" || m.category === category) {
      catalog.innerHTML += '<div class="card"><div class="emoji">' + m.emoji + '</div><h3>' + m.name + '</h3><div class="price">' + m.price + " so'm</div></div>";
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
