// Мой запрос к AI: "Когда добавляю в корзину Кепку, итог показывает «045000» вместо числа. Цена осталась строкой.
// Пусть итог всегда считается как число — через Number(). Больше ничего не меняй."

const products = [
  { name: "Футболка", price: 89000 },
  { name: "Кепка", price: "45000" },
  { name: "Мяч", price: 120000 },
  { name: "Скакалка", price: 35000 }
];
let cart = [];

const catalog = document.getElementById("catalog");
const cartList = document.getElementById("cartList");
const totalEl = document.getElementById("total");

for (let i = 0; i < products.length; i++) {
  catalog.innerHTML += '<div class="card"><h3>' + products[i].name + '</h3><p>' + products[i].price + " сум</p><button data-i=\"" + i + '">В корзину</button></div>';
}

function total() {
  let s = 0;
  for (let i = 0; i < cart.length; i++) {
    s = s + Number(cart[i].price);
  }
  return s;
}

function renderCart() {
  cartList.innerHTML = "";
  for (let i = 0; i < cart.length; i++) {
    cartList.innerHTML += "<li>" + cart[i].name + "</li>";
  }
  totalEl.textContent = total();
}

catalog.addEventListener("click", function (e) {
  if (e.target.dataset.i !== undefined) {
    cart.push(products[e.target.dataset.i]);
    renderCart();
  }
});

// Оформить заказ
const orderBtn = document.getElementById("orderBtn");
const message = document.getElementById("message");
orderBtn.addEventListener("click", function () {
  if (cart.length === 0) {
    message.textContent = "Корзина пуста";
    return;
  }
  message.textContent = "Заказ принят: " + total() + " сум";
  cart = [];
  cartList.innerHTML = "";
  totalEl.textContent = 0;
});
