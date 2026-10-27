const products = [
  { name: "Futbolka", price: 89000 },
  { name: "Kepka", price: "45000" },
  { name: "To'p", price: 120000 },
  { name: "Skakalka", price: 35000 }
];
let cart = [];

const catalog = document.getElementById("catalog");
const cartList = document.getElementById("cartList");
const totalEl = document.getElementById("total");

for (let i = 0; i < products.length; i++) {
  catalog.innerHTML += '<div class="card"><h3>' + products[i].name + '</h3><p>' + products[i].price + " so'm</p><button data-i=\"" + i + '">Savatga</button></div>';
}

function total() {
  let s = 0;
  for (let i = 0; i < cart.length; i++) {
    s = s + cart[i].price;
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
