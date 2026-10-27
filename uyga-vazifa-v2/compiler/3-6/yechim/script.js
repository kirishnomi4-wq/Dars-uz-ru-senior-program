function damage(power, bonus) {
  return power * 3 + bonus;
}

function health(left, hit) {
  let result = left - hit;
  if (result < 0) {
    return 0;
  }
  return result;
}

function total(prices) {
  let s = 0;
  for (let i = 0; i < prices.length; i++) {
    s = s + prices[i];
  }
  return s;
}

let a = damage(5, 10);
let b = health(100, 25);
let c = health(20, 25);
let d = total([12000, 8000, 5000]);
console.log(a);
console.log(b);
console.log(c);
console.log(d);
