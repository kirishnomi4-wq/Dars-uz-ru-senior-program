// AI'ga yozgan so'rovim: "Savatga Kepka qo'shsam jami 0 o'rniga «045000» chiqyapti. Narx matn bo'lib qolgan.
// Jami doim son bo'lib hisoblansin — Number() bilan. Boshqa joyni o'zgartirma."

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

// Buyurtma berish
const orderBtn = document.getElementById("orderBtn");
const message = document.getElementById("message");
orderBtn.addEventListener("click", function () {
  if (cart.length === 0) {
    message.textContent = "Savat bo'sh";
    return;
  }
  message.textContent = "Buyurtma qabul qilindi: " + total() + " so'm";
  cart = [];
  cartList.innerHTML = "";
  totalEl.textContent = 0;
});
