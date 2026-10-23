function zarar(kuch, bonus) {
  return kuch * 3 + bonus;
}

function jon(qoldi, urilgan) {
  let natija = qoldi - urilgan;
  if (natija < 0) {
    return 0;
  }
  return natija;
}

function jami(narxlar) {
  let s = 0;
  for (let i = 0; i < narxlar.length; i++) {
    s = s + narxlar[i];
  }
  return s;
}

let a = zarar(5, 10);
let b = jon(100, 25);
let c = jon(20, 25);
let d = jami([12000, 8000, 5000]);
console.log(a);
console.log(b);
console.log(c);
console.log(d);
