const prices = [12000, 8000, 15000, 5000];

for (let i = 0; i < prices.length; i++) {
  console.log("Товар " + (i + 1) + ": " + prices[i] + " сум");
}

let jami = 0;
for (let i = 0; i < prices.length; i++) {
  jami = jami + prices[i];
}
console.log("Итого: " + jami + " сум");

let money = 0;
let day = 0;
while (money < 20000) {
  money = money + 3000;
  day++;
}
console.log("За " + day + " дней " + money + " сум");
