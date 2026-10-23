let score = 78;
if (score >= 90) {
  console.log("Оценка: 5");
} else if (score >= 70) {
  console.log("Оценка: 4");
} else if (score >= 60) {
  console.log("Оценка: 3");
} else {
  console.log("Оценка: 2");
}

let pin = 1234;
let entered = 1111;
if (entered == pin) {
  console.log("Телефон разблокирован");
} else {
  console.log("Неверный PIN");
}

let battery = 15;
if (battery < 20) {
  console.log("Мало заряда!");
} else {
  console.log("Заряда хватает");
}
