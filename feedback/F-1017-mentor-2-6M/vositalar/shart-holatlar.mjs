// F-1017-205 · sinov holatlari: want 'pass' — o'tishi SHART (o'tmasa: shart haddan QATTIQ),
// 'fail' — o'tmasligi kerak (o'tsa: shart BO'SH). Har vazifada: kanonik yechim + o'quvchi
// yozishi mumkin bo'lgan to'g'ri variantlar + tipik xato.
const H1 = 'src/1-Modull/Htmllesson1.jsx', H2 = 'src/1-Modull/Htmllesson2.jsx', HT = 'src/1-Modull/HtmlTakrorlashLesson.jsx';
const C1 = 'src/1-Modull/CssLesson1.jsx', C2 = 'src/1-Modull/CssLesson2.jsx', VS = 'src/1-Modull/VsCodeLesson.jsx';
const JV = 'src/2-Modull/JsVarsLesson.jsx', JC = 'src/2-Modull/JsConditionsLesson.jsx', JL = 'src/2-Modull/JsLoopsLesson.jsx';
const JF = 'src/2-Modull/JsFunctionsLesson.jsx', PE = 'src/2-Modull/PeanStackLesson.jsx';
const P1 = 'src/1-Modull/PmLesson1.jsx', P2 = 'src/1-Modull/PmLesson2.jsx', P3 = 'src/1-Modull/PmLesson3.jsx', P4 = 'src/2-Modull/PmLesson4.jsx';
const PMI = 'src/2-Modull/PmMuammoIzlash.jsx', P5 = 'src/2-Modull/PmLesson5.jsx', P6 = 'src/2-Modull/PmLesson6.jsx', P9 = 'src/3-Modull/PmLesson9.jsx';
const P11 = 'src/4-Modull/PmLesson11.jsx', P13 = 'src/4-Modull/PmLesson13.jsx', P15 = 'src/4a-Modull/PmLesson15.jsx', P17 = 'src/4c-Modull/PmLesson17.jsx';

const html = (f, t, name, want, h) => ({ f, t, name, want, codes: { html: h } });
const css = (f, t, name, want, h, c) => ({ f, t, name, want, codes: { 'index.html': h, 'style.css': c } });
const js = (f, t, name, want, j) => ({ f, t, name, want, codes: { 'script.js': j } });
const app = (f, t, name, want, j) => ({ f, t, name, want, codes: { 'app.js': j } });
const SKEL = (b) => `<!DOCTYPE html>\n<html>\n<head>\n  <title>Sahifa</title>\n</head>\n<body>\n${b}\n</body>\n</html>`;

export const CASES = [
  // ── Htmllesson1 ──
  html(H1, 'TASK_HEADINGS', 'kanonik', 'pass', '<h1>Bosh sarlavha</h1>\n<h2>Kichik sarlavha</h2>\n<h6>Eng kichik</h6>'),
  html(H1, 'TASK_HEADINGS', 'to\'liq skelet ichida', 'pass', SKEL('<h1>Salom</h1>\n<h2>Ikkinchi</h2>\n<h6>Oltinchi</h6>')),
  html(H1, 'TASK_HEADINGS', 'h6 yo\'q', 'fail', '<h1>Salom</h1>\n<h2>Ikkinchi</h2>'),
  html(H1, 'TASK_LINK', 'kanonik', 'pass', '<a href="https://coddycamp.uz">CoddyCamp</a>'),
  html(H1, 'TASK_LINK', 'bitta tirnoq href=\'…\'', 'pass', "<a href='https://youtube.com'>YouTube</a>"),
  html(H1, 'TASK_LINK', 'href yo\'q', 'fail', '<a>CoddyCamp</a>'),
  html(H1, 'TASK_FINAL', 'kanonik ul', 'pass', '<h1>Men haqimda</h1>\n<p>Men HTML o\'rganyapman.</p>\n<ul>\n  <li>Futbol</li>\n  <li>Kitob</li>\n</ul>\n<a href="https://coddycamp.uz">CoddyCamp</a>'),
  html(H1, 'TASK_FINAL', 'ol bilan', 'pass', '<h1>Retsept</h1>\n<p>Limonad.</p>\n<ol>\n  <li>Limon</li>\n  <li>Suv</li>\n</ol>\n<a href="https://google.com">Google</a>'),
  html(H1, 'TASK_FINAL', 'bitta li', 'fail', '<h1>Men</h1>\n<p>Gap.</p>\n<ul><li>Futbol</li></ul>\n<a href="https://x.uz">X</a>'),
  // ── Htmllesson2 ──
  html(H2, 'TASK_IMG', 'kanonik', 'pass', '<img src="mushuk.jpg" alt="Mushukcha">'),
  html(H2, 'TASK_IMG', 'o\'zi yopiladigan <img … />', 'pass', '<img src="https://picsum.photos/200" alt="Tog\' manzarasi" />'),
  html(H2, 'TASK_IMG', 'alt yo\'q', 'fail', '<img src="mushuk.jpg">'),
  html(H2, 'TASK_FORM', 'kanonik', 'pass', '<form>\n  <input type="text">\n  <button>Yuborish</button>\n</form>'),
  html(H2, 'TASK_FORM', 'label + placeholder + type=submit', 'pass', '<form>\n  <label>Ismingiz</label>\n  <input type="text" placeholder="Aziza">\n  <button type="submit">Yuborish</button>\n</form>'),
  html(H2, 'TASK_FORM', 'button formadan tashqarida', 'fail', '<form>\n  <input type="text">\n</form>\n<button>Yuborish</button>'),
  html(H2, 'TASK_FINAL', 'kanonik', 'pass', '<header>\n  <h1>Aziza</h1>\n</header>\n<main>\n  <img src="aziza.jpg" alt="Aziza surati">\n  <form>\n    <input type="text">\n    <button>Yuborish</button>\n  </form>\n</main>\n<footer>Aloqa</footer>'),
  html(H2, 'TASK_FINAL', 'header bo\'sh', 'fail', '<header></header>\n<img src="a.jpg" alt="a">\n<form><input></form>'),
  // ── HtmlTakrorlash ──
  html(HT, 'TASK_S1', 'kanonik', 'pass', '<h1>Chempionlar</h1>\n<p>Biz maktab futbol jamoasimiz.</p>'),
  html(HT, 'TASK_S2', 'kanonik', 'pass', '<ul>\n  <li><strong>Aziz</strong></li>\n  <li>Sardor</li>\n  <li>Bek</li>\n</ul>'),
  html(HT, 'TASK_S2', 'strong yo\'q', 'fail', '<ul>\n  <li>Aziz</li>\n  <li>Sardor</li>\n  <li>Bek</li>\n</ul>'),
  html(HT, 'TASK_S3', 'kanonik', 'pass', '<a href="https://t.me/chempionlar">Kanalimiz</a>'),
  html(HT, 'TASK_S4', 'kanonik', 'pass', '<img src="https://go.coddycamp.uz/uploads/media_library/cf55a3f1c3e9436d5febcd736ed7fc43.jpg" alt="Jamoa surati">'),
  html(HT, 'TASK_FINAL', 'kanonik', 'pass', '<h1>Chempionlar</h1>\n<p>Biz jamoamiz.</p>\n<ul>\n  <li><strong>Aziz</strong></li>\n  <li>Sardor</li>\n  <li>Bek</li>\n</ul>\n<a href="https://t.me/chempionlar">Kanalimiz</a>\n<img src="https://go.coddycamp.uz/uploads/media_library/cf55a3f1c3e9436d5febcd736ed7fc43.jpg" alt="Jamoa surati">'),
  // ── CssLesson1 ──
  css(C1, 'TASK_COLOR', 'kanonik', 'pass', '<h1>Mening sahifam</h1>', 'h1 {\n  color: white;\n  background-color: tomato;\n}'),
  css(C1, 'TASK_COLOR', 'hex ranglar', 'pass', '<h1>Mening sahifam</h1>', 'h1 { color: #ffffff; background-color: #ff6347; }'),
  css(C1, 'TASK_COLOR', 'background: qisqa yozuv', 'pass', '<h1>Mening sahifam</h1>', 'h1 { color: white; background: tomato; }'),
  css(C1, 'TASK_COLOR', 'faqat color', 'fail', '<h1>Mening sahifam</h1>', 'h1 { color: red; }'),
  css(C1, 'TASK_TEXT', 'kanonik', 'pass', '<h1>Katta sarlavha</h1>\n<p>Oddiy matn.</p>', 'h1 {\n  font-size: 40px;\n  text-align: center;\n}'),
  css(C1, 'TASK_TEXT', 'text-align: left', 'fail', '<h1>Katta sarlavha</h1>\n<p>Oddiy matn.</p>', 'h1 { font-size: 40px; text-align: left; }'),
  css(C1, 'TASK_BOX', 'kanonik', 'pass', '<div class="box" style="background:#FFE066">Salom!</div>', '.box {\n  padding: 20px;\n  margin: 20px;\n}'),
  css(C1, 'TASK_BOX', 'ikki qiymatli padding/margin', 'pass', '<div class="box" style="background:#FFE066">Salom!</div>', '.box { padding: 10px 20px; margin: 30px 0; }'),
  css(C1, 'TASK_BOX', 'faqat margin-top', 'pass', '<div class="box" style="background:#FFE066">Salom!</div>', '.box { padding: 20px; margin-top: 20px; }'),
  css(C1, 'TASK_BOX', 'margin yo\'q', 'fail', '<div class="box" style="background:#FFE066">Salom!</div>', '.box { padding: 20px; }'),
  // ── CssLesson2 ──
  css(C2, 'TASK_FLEX', 'kanonik', 'pass', '<div class="row">\n  <span>A</span>\n  <span>B</span>\n  <span>C</span>\n</div>', '.row {\n  display: flex;\n  gap: 12px;\n}'),
  css(C2, 'TASK_FLEX', 'gap yo\'q', 'fail', '<div class="row"><span>A</span><span>B</span></div>', '.row { display: flex; }'),
  css(C2, 'TASK_CENTER', 'kanonik', 'pass', '<div class="box" style="height:120px;background:#FFE066">\n  <span>Salom!</span>\n</div>', '.box {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}'),
  css(C2, 'TASK_CENTER', 'display yo\'q', 'fail', '<div class="box"><span>Salom!</span></div>', '.box { justify-content: center; align-items: center; }'),
  css(C2, 'TASK_COLUMN', 'kanonik', 'pass', '<div class="menu">\n  <a>Bosh sahifa</a>\n  <a>Xizmatlar</a>\n  <a>Aloqa</a>\n</div>', '.menu {\n  display: flex;\n  flex-direction: column;\n}'),
  // ── VsCode ──
  html(VS, 'TASK_CARD', 'kanonik', 'pass', '<div class="card">\n  <div class="logo">&lt;/&gt;</div>\n  <h2>Aziza</h2>\n  <p>Frontend developer</p>\n</div>'),
  html(VS, 'TASK_CARD', 'logo ichida oddiy matn', 'pass', '<div class="card">\n  <div class="logo">LOGO</div>\n  <h2>Aziza</h2>\n  <p>Dizayner</p>\n</div>'),
  html(VS, 'TASK_CARD', 'p qutidan tashqarida', 'fail', '<div class="card">\n  <div class="logo">LOGO</div>\n  <h2>Aziza</h2>\n</div>\n<p>Dizayner</p>'),
  css(VS, 'TASK_STYLE', 'kanonik (ekrandagi 4 qator)', 'pass', null, '.card {\n  background: #3FAE2A;\n  width: 260px;\n  margin: 40px auto;\n  border-radius: 18px;\n  box-shadow: 0 14px 34px rgba(0,0,0,0.25);\n}'),
  css(VS, 'TASK_STYLE', 'background-color: green, margin: 0 auto', 'pass', null, '.card {\n  background-color: green;\n  width: 300px;\n  margin: 0 auto;\n  border-radius: 12px;\n  box-shadow: 0 4px 10px gray;\n}'),
  css(VS, 'TASK_STYLE', 'lime nomi', 'pass', null, '.card { background: lime; width: 260px; margin: 40px auto; border-radius: 18px; box-shadow: 0 4px 10px gray; }'),
  css(VS, 'TASK_STYLE', 'blue nomi', 'fail', null, '.card { background-color: blue; width: 260px; margin: 40px auto; border-radius: 18px; box-shadow: 0 4px 10px gray; }'),
  css(VS, 'TASK_STYLE', 'qizil fon', 'fail', null, '.card { background: red; width: 260px; margin: 40px auto; border-radius: 18px; box-shadow: 0 4px 10px gray; }'),
  // ── JsVars ──
  js(JV, 'TASK_BALL', 'kanonik', 'pass', 'let score = 0\nscore = 25\nconsole.log(score)'),
  js(JV, 'TASK_BALL', 'nuqtali vergul bilan', 'pass', 'let score = 0;\nscore = 25;\nconsole.log(score);'),
  js(JV, 'TASK_BALL', 'bir qatorda nuqtali vergul bilan', 'pass', 'let score = 0; score = 25; console.log(score)'),
  js(JV, 'TASK_BALL', 'o\'zgartirmasdan darhol 25', 'fail', 'let score = 25\nconsole.log(score)'),
  js(JV, 'TASK_QUOTES', 'kanonik', 'pass', 'console.log(5 + 5)\nconsole.log("5" + "5")'),
  js(JV, 'TASK_QUOTES', 'bitta tirnoq \'5\'', 'pass', "console.log(5 + 5)\nconsole.log('5' + '5')"),
  js(JV, 'TASK_QUTILAR', 'kanonik', 'pass', 'let name = "Aziza"\nlet age = 14\nconst birth_year = 2011'),
  js(JV, 'TASK_QUTILAR', 'ismda apostrof, nuqtali vergul', 'pass', 'let name = "O\'g\'iloy";\nlet age = 13;\nconst birth_year = 2012;'),
  js(JV, 'TASK_QUTILAR', 'birth_year let bilan', 'fail', 'let name = "Aziza"\nlet age = 14\nlet birth_year = 2011'),
  // ── JsConditions ──
  js(JC, 'TASK_RADAR', 'kanonik', 'pass', 'let speed = 75\n\nif (speed > 60) {\n  console.log("Siz jarimaga tushdingiz")\n} else {\n  console.log("Jarima yo\'q")\n}'),
  js(JC, 'TASK_RADAR', 'undov belgisi bilan', 'pass', 'let speed = 75\nif (speed > 60) {\n  console.log("Siz jarimaga tushdingiz!")\n} else {\n  console.log("Jarima yo\'q!")\n}'),
  js(JC, 'TASK_RADAR', 'else yo\'q', 'fail', 'let speed = 75\nif (speed > 60) {\n  console.log("Siz jarimaga tushdingiz")\n}'),
  js(JC, 'TASK_TRANSLATE', 'kanonik', 'pass', 'let lang = "en"\nif (lang == "uz") {\n  console.log("Salom")\n} else {\n  console.log("Hello")\n}'),
  js(JC, 'TASK_TRANSLATE', '=== bilan', 'pass', 'let lang = "en"\nif (lang === "uz") {\n  console.log("Salom")\n} else {\n  console.log("Hello")\n}'),
  js(JC, 'TASK_RADAR_LEVELS', 'kanonik', 'pass', 'let speed = 85\nif (speed <= 60) {\n  console.log("Jarima yo\'q")\n} else if (speed <= 80) {\n  console.log("Ogohlantirish")\n} else {\n  console.log("Katta jarima")\n}'),
  js(JC, 'TASK_RADAR_LEVELS', 'else if yo\'q', 'fail', 'let speed = 85\nif (speed <= 80) {\n  console.log("Ogohlantirish")\n} else {\n  console.log("Katta jarima")\n}'),
  // ── JsLoops ──
  js(JL, 'TASK_SANOQ', 'kanonik', 'pass', 'for (let i = 1; i <= 5; i++) {\n  console.log(i)\n}'),
  js(JL, 'TASK_SANOQ', 'i < 6 va i = i + 1', 'pass', 'for (let i = 1; i < 6; i = i + 1) {\n  console.log(i)\n}'),
  js(JL, 'TASK_SANOQ', 'while bilan', 'fail', 'let i = 1\nwhile (i <= 5) {\n  console.log(i)\n  i++\n}'),
  js(JL, 'TASK_MEVA', 'kanonik', 'pass', 'let mevalar = ["olma", "banan", "uzum"]\nfor (let i = 0; i < mevalar.length; i++) {\n  console.log(mevalar[i])\n}'),
  js(JL, 'TASK_MEVA', 'i < 3', 'pass', "let mevalar = ['olma', 'banan', 'uzum']\nfor (let i = 0; i < 3; i++) {\n  console.log(mevalar[i])\n}"),
  // ── JsFunctions ──
  js(JF, 'TASK_SALOM', 'kanonik', 'pass', 'function salom() {\n  console.log("Salom")\n}\nsalom()'),
  js(JF, 'TASK_SALOM', 'chaqirilmagan', 'fail', 'function salom() {\n  console.log("Salom")\n}'),
  js(JF, 'TASK_KVADRAT', 'yangi matn: let natija', 'pass', 'function zarar(kuch) {\n  return kuch * 3\n}\nlet natija = zarar(5)\nconsole.log(natija)'),
  js(JF, 'TASK_KVADRAT', 'eski: console.log(zarar(5))', 'pass', 'function zarar(kuch) {\n  return kuch * 3\n}\nconsole.log(zarar(5))'),
  js(JF, 'TASK_QAYTA', 'kanonik', 'pass', 'function salomla(ism) {\n  console.log("Salom, " + ism)\n}\nsalomla("Aziza")\nsalomla("Bobur")'),
  js(JF, 'TASK_QAYTA', 'oxirida undov "!"', 'pass', 'function salomla(ism) {\n  console.log("Salom, " + ism + "!")\n}\nsalomla("Aziza")\nsalomla("Bobur")'),
  js(JF, 'TASK_QAYTA', 'bitta chaqiruv', 'fail', 'function salomla(ism) {\n  console.log("Salom, " + ism)\n}\nsalomla("Aziza")'),
  // ── PeanStack ──
  js(PE, 'TASK_HISOB', 'kanonik', 'pass', 'function narx(soni) {\n  return soni * 25000\n}\nconsole.log(narx(3))'),
  js(PE, 'TASK_HISOB', 'let bilan saqlab', 'pass', 'function narx(soni) {\n  return soni * 25000\n}\nlet jami = narx(3)\nconsole.log(jami)'),
  js(PE, 'TASK_BAZA', 'kanonik', 'pass', 'let mahsulotlar = ["Lavash", "Burger", "Shashlik"]\nfor (let i = 0; i < mahsulotlar.length; i++) {\n  console.log(mahsulotlar[i])\n}'),
  // ── PM ──
  html(P1, 'KOD_TASK', 'kanonik', 'pass', '<h1>Mening saytim</h1>\n<p>Kimga: maktab o\'quvchilari</p>\n<p>Qanday muammoga: uy vazifasini unutishadi</p>\n<p>Qanday yechim: eslatma yuboradi</p>'),
  html(P1, 'KOD_TASK', '[KIM] qolgan', 'fail', '<h1>Mening saytim</h1>\n<p>Kimga: [KIM]</p>\n<p>Qanday muammoga: unutishadi</p>\n<p>Qanday yechim: eslatma</p>'),
  html(P2, 'KOD_TASK', 'kanonik', 'pass', '<header>\n  <h2>OLX</h2>\n</header>\n<main>\n  <h2>Muammo</h2>\n  <p>Eski buyumlar uyda turibdi.</p>\n  <h2>Qanday ishlaydi</h2>\n  <p>Rasm yuklaysiz, xaridor yozadi.</p>\n  <h2>Isbot</h2>\n  <p>Har kuni minglab e\'lon.</p>\n  <h2>Harakat</h2>\n  <p>Hozir e\'lon bering.</p>\n</main>\n<footer>\n  <p>Aloqa: salom@olx.uz</p>\n</footer>'),
  html(P3, 'KOD_TASK', 'kanonik (header h1+p, main h2)', 'pass', '<header>\n  <h1>Eslatgich</h1>\n  <p>Sayt uy vazifasini kechqurun o\'zi eslatib turadi.</p>\n</header>\n<main>\n  <h2>Qanday ishlaydi</h2>\n  <p>Vazifani yozasiz, sayt soat 20:00 da eslatadi.</p>\n</main>'),
  html(P3, 'KOD_TASK', 'yechim jumlasi juda qisqa', 'fail', '<header>\n  <h1>Eslatgich</h1>\n  <p>Eslatadi</p>\n</header>\n<main>\n  <h2>Bo\'lim</h2>\n</main>'),
  html(P4, 'KOD_TASK', 'kanonik', 'pass', '<h2>Kinoteatr sayti nima beradi</h2>\n<ul>\n  <li><b>Seans jadvali</b> — film qachon boshlanishini bilmaydi</li>\n  <li><b>Onlayn chipta</b> — kassada uzun navbatda turadi</li>\n  <li><b>Xarita</b> — kinoteatr qayerdaligini topolmaydi</li>\n</ul>'),
  html(P4, 'KOD_TASK', 'oddiy tire "-"', 'pass', '<ul>\n  <li><b>Seans jadvali</b> - film qachon boshlanishini bilmaydi</li>\n  <li><b>Onlayn chipta</b> - kassada uzun navbatda turadi</li>\n  <li><b>Xarita</b> - kinoteatr qayerdaligini topolmaydi</li>\n</ul>'),
  html(PMI, 'KOD_TASK', 'kanonik', 'pass', '<h2>Atrofimdagi eng kuchli muammolar</h2>\n<ol>\n  <li class="birinchi">Seans vaqti saytda eski turadi — kuchi 9</li>\n  <li>Avtobus kech keladi — kuchi 6</li>\n  <li>Wi-Fi sekin — kuchi 4</li>\n</ol>\n<style>\n  li { margin: 8px 0; }\n  .birinchi { background: gold; }\n</style>'),
  { f: P5, t: 'mkKodTask', extra: ['KODING_STARTER'], mk: { file: 'f' }, name: 'kanonik ===', want: 'pass', codes: { f: 'const nomlar = ["Seanslar va narxlar", "Ish vaqti va manzil", "Chipta band qilish tugmasi",\n                "Chegirma kodi", "Bufet menyusi", "Tomoshabin sharhlari"];\nconst darajalar = ["v1", "v1", "v1", "backlog", "v2", "backlog"];\n\nfunction ochilishRoyxati(nomlar, darajalar) {\n  let natija = "";\n  for (let i = 0; i < nomlar.length; i++) {\n    if (darajalar[i] === "v1") {\n      natija = natija + nomlar[i] + ", ";\n    }\n  }\n  return natija;\n}\n\nconsole.log(ochilishRoyxati(nomlar, darajalar));' } },
  { f: P5, t: 'mkKodTask', mk: { file: 'f' }, name: '== bilan (darsda o\'tilgani)', want: 'pass', codes: { f: 'const nomlar = ["Seanslar va narxlar", "Ish vaqti va manzil", "Chipta band qilish tugmasi",\n                "Chegirma kodi", "Bufet menyusi", "Tomoshabin sharhlari"];\nconst darajalar = ["v1", "v1", "v1", "backlog", "v2", "backlog"];\n\nfunction ochilishRoyxati(nomlar, darajalar) {\n  let natija = "";\n  for (let i = 0; i < nomlar.length; i++) {\n    if (darajalar[i] == "v1") {\n      natija = natija + nomlar[i] + " ";\n    }\n  }\n  return natija;\n}\n\nconsole.log(ochilishRoyxati(nomlar, darajalar));' } },
  { f: P6, t: 'mkKodTask', extra: ['ensureHelper'], mk: { file: 'f', helper: 'ensureHelper' }, name: 'kanonik (massivlar)', want: 'pass', codes: { f: 'const nomlar = ["Ko\'rinadigan qism", "Ishni bajaradigan qism", "Ma\'lumot saqlanadigan joy"];\nconst javoblar = [\n  "Bugungi menyu va narxlar",\n  "Buyurtmani o\'zi qabul qiladi",\n  "Narxlarni eslab qoladi"\n];\nfunction oddiyGap(i) {\n  return nomlar[i] + ": " + javoblar[i];\n}\nfor (let i = 0; i < nomlar.length; i++) {\n  chiqar(oddiyGap(i));\n}' } },
  app(P9, 'KOD_TASK', 'kanonik if-lar', 'pass', 'function qabulQilinadimi(buyurtma) {\n  if (buyurtma.taom === "") return false\n  if (buyurtma.soni < 1) return false\n  if (buyurtma.soni > 9) return false\n  return true\n}'),
  app(P9, 'KOD_TASK', '&& bilan', 'pass', 'function qabulQilinadimi(buyurtma) {\n  return buyurtma.taom !== "" && buyurtma.soni >= 1 && buyurtma.soni <= 9\n}'),
  app(P9, 'KOD_TASK', 'faqat 2 shart', 'fail', 'function qabulQilinadimi(buyurtma) {\n  if (buyurtma.taom === "") return false\n  if (buyurtma.soni < 1) return false\n  return true\n}'),
  app(P11, 'KOD_TASK', 'kanonik for+push', 'pass', "const tarix = [\n  { qoshiq: 'Ohang',  vaqt: '21:40', oxirigacha: true  },\n  { qoshiq: \"Yo'l\",  vaqt: '08:15', oxirigacha: false },\n  { qoshiq: 'Ohang',  vaqt: '22:05', oxirigacha: true  },\n  { qoshiq: 'Shamol', vaqt: '07:50', oxirigacha: true  }\n];\nfunction yoqqanlar(tarix) {\n  const natija = [];\n  for (let i = 0; i < tarix.length; i++) {\n    if (tarix[i].oxirigacha) natija.push(tarix[i].qoshiq);\n  }\n  return natija;\n}\nconsole.log(yoqqanlar(tarix));"),
  app(P11, 'KOD_TASK', 'filter+map', 'pass', "const tarix = [\n  { qoshiq: 'Ohang',  vaqt: '21:40', oxirigacha: true  },\n  { qoshiq: \"Yo'l\",  vaqt: '08:15', oxirigacha: false },\n  { qoshiq: 'Ohang',  vaqt: '22:05', oxirigacha: true  },\n  { qoshiq: 'Shamol', vaqt: '07:50', oxirigacha: true  }\n];\nfunction yoqqanlar(tarix) {\n  return tarix.filter(t => t.oxirigacha).map(t => t.qoshiq);\n}\nconsole.log(yoqqanlar(tarix));"),
  app(P13, 'KOD_TASK', 'kanonik', 'pass', 'var band = {\n  kitob_nomi: "Ikki eshik orasi",\n  holati: "band",\n  band_qilgan: "Aziza",\n  qaytarish_sanasi: "25-oktabr"\n};\nconsole.log("Kim navbatda: " + (band.band_qilgan || "—"));\nconsole.log("Qachon bo\'shaydi: " + (band.qaytarish_sanasi || "—"));'),
  app(P15, 'KOD_TASK', 'kanonik 3 ta if', 'pass', "const sigim = { orindiq: 100, tolov: 500, sahifa: 2000 };\nfunction singanlar(odamlar) {\n  const r = [];\n  if (odamlar > sigim.orindiq) r.push('orindiq');\n  if (odamlar > sigim.tolov) r.push('tolov');\n  if (odamlar > sigim.sahifa) r.push('sahifa');\n  return r;\n}\nconsole.log(singanlar(300));"),
  app(P17, 'KOD_TASK', 'skelet + shart', 'pass', "const bolaklar = [\n  { nom: 'topdim-tugmasi', kun: 1 },\n  { nom: 'egasiga-xabar',  kun: 2 },\n  { nom: 'menda-belgisi',  kun: 2 },\n  { nom: 'rasm-qoshish',   kun: 2 },\n  { nom: 'chat',           kun: 4 },\n];\nconst SIGIM = 5;\nfunction haftalar(bolaklar) {\n  const natija = [];\n  let hafta = [];\n  let kunlar = 0;\n  for (let i = 0; i < bolaklar.length; i++) {\n    const ish = bolaklar[i];\n    if (kunlar + ish.kun > SIGIM) {\n      natija.push(hafta);\n      hafta = [];\n      kunlar = 0;\n    }\n    hafta.push(ish.nom);\n    kunlar = kunlar + ish.kun;\n  }\n  natija.push(hafta);\n  return natija;\n}\nconsole.log(haftalar(bolaklar));"),
  app(P17, 'KOD_TASK', 'skelet o\'zgarmagan (false)', 'fail', "const bolaklar = [\n  { nom: 'topdim-tugmasi', kun: 1 },\n  { nom: 'egasiga-xabar',  kun: 2 },\n  { nom: 'menda-belgisi',  kun: 2 },\n  { nom: 'rasm-qoshish',   kun: 2 },\n  { nom: 'chat',           kun: 4 },\n];\nconst SIGIM = 5;\nfunction haftalar(bolaklar) {\n  const natija = [];\n  let hafta = [];\n  let kunlar = 0;\n  for (let i = 0; i < bolaklar.length; i++) {\n    const ish = bolaklar[i];\n    if (false) {\n      natija.push(hafta);\n      hafta = [];\n      kunlar = 0;\n    }\n    hafta.push(ish.nom);\n    kunlar = kunlar + ish.kun;\n  }\n  natija.push(hafta);\n  return natija;\n}"),
  // ── F-1017-206: harf/probel/tartib ──
  js(JC, 'TASK_TRANSLATE', '206: kichik harf "hello"', 'pass', 'let lang = "en"\nif (lang == "uz") {\n  console.log("salom")\n} else {\n  console.log("hello")\n}'),
  js(JC, 'TASK_RADAR_LEVELS', '206: KATTA HARF', 'pass', 'let speed = 85\nif (speed <= 60) {\n  console.log("Jarima yo\'q")\n} else if (speed <= 80) {\n  console.log("Ogohlantirish")\n} else {\n  console.log("KATTA JARIMA")\n}'),
  js(JC, 'TASK_RADAR_LEVELS', '206: ikki probel', 'pass', 'let speed = 85\nif (speed <= 60) {\n  console.log("Jarima yo\'q")\n} else if (speed <= 80) {\n  console.log("Ogohlantirish")\n} else {\n  console.log("Katta  jarima")\n}'),
  js(JC, 'TASK_RADAR_LEVELS', '206: boshqa so\'z "Jarima katta"', 'fail', 'let speed = 85\nif (speed <= 60) {\n  console.log("Jarima yo\'q")\n} else if (speed <= 80) {\n  console.log("Ogohlantirish")\n} else {\n  console.log("Jarima katta")\n}'),
  js(JL, 'TASK_MEVA', '206: teskari tartib', 'pass', 'let mevalar = ["uzum", "banan", "olma"]\nfor (let i = 0; i < mevalar.length; i++) {\n  console.log(mevalar[i])\n}'),
  js(JL, 'TASK_MEVA', '206: Katta harf bilan', 'pass', 'let mevalar = ["Olma", "Banan", "Uzum"]\nfor (let i = 0; i < mevalar.length; i++) {\n  console.log(mevalar[i])\n}'),
  js(JL, 'TASK_MEVA', '206: faqat ikkita meva', 'fail', 'let mevalar = ["olma", "banan"]\nfor (let i = 0; i < mevalar.length; i++) {\n  console.log(mevalar[i])\n}'),
  js(JL, 'TASK_SANOQ', '206: teskari sanoq 5..1 (tartib ma\'noli)', 'fail', 'for (let i = 5; i >= 1; i--) {\n  console.log(i)\n}'),
  js(PE, 'TASK_BAZA', '206: teskari + kichik harf', 'pass', 'let mahsulotlar = ["shashlik", "burger", "lavash"]\nfor (let i = 0; i < mahsulotlar.length; i++) {\n  console.log(mahsulotlar[i])\n}'),
  js(JF, 'TASK_SALOM', '206: kichik harf "salom"', 'pass', 'function salom() {\n  console.log("salom")\n}\nsalom()'),
  js(JF, 'TASK_QAYTA', '206: teskari tartib Bobur, Aziza', 'pass', 'function salomla(ism) {\n  console.log("Salom, " + ism)\n}\nsalomla("Bobur")\nsalomla("Aziza")'),
  // ── F-1017-209: PmLesson2 skelet + imlo ──
  html(P2, 'KOD_TASK', '209: starter o\'zgarmagan (aralash, p bo\'sh)', 'fail', '<header>\n  <h2>OLX</h2>\n  <p>Ortiqcha buyumingizni soting</p>\n</header>\n<main>\n  <h2>Harakat</h2>\n  <p></p>\n  <h2>Isbot</h2>\n  <p></p>\n  <h2>Muammo</h2>\n  <p></p>\n  <h2>Qanday ishlaydi</h2>\n  <p></p>\n</main>\n<footer>\n  <p>Aloqa: salom@olx.uz</p>\n</footer>'),
  html(P2, 'KOD_TASK', '209: tartiblandi + p yozildi', 'pass', '<header>\n  <h2>OLX</h2>\n  <p>Ortiqcha buyumingizni soting</p>\n</header>\n<main>\n  <h2>Muammo</h2>\n  <p>Eski buyumlar uyda turibdi.</p>\n  <h2>Qanday ishlaydi</h2>\n  <p>Rasm yuklaysiz, xaridor yozadi.</p>\n  <h2>Isbot</h2>\n  <p>Har kuni minglab e\'lon.</p>\n  <h2>Harakat</h2>\n  <p>Hozir e\'lon bering.</p>\n</main>\n<footer>\n  <p>Aloqa: salom@olx.uz</p>\n</footer>'),
  html(P2, 'KOD_TASK', '209: tartib to\'g\'ri, p bo\'sh', 'fail', '<header>\n  <h2>OLX</h2>\n</header>\n<main>\n  <h2>Muammo</h2>\n  <p></p>\n  <h2>Qanday ishlaydi</h2>\n  <p></p>\n  <h2>Isbot</h2>\n  <p></p>\n  <h2>Harakat</h2>\n  <p></p>\n</main>\n<footer>\n  <p>Aloqa</p>\n</footer>'),
  html(P2, 'KOD_TASK', '209: qo\'lda yozgan — muamo / MMUAMO / muomo / Isbott', 'pass', '<header>\n  <h2>OLX</h2>\n</header>\n<main>\n  <h2>muamo</h2>\n  <p>Eski buyumlar uyda turibdi.</p>\n  <h2>qanday ishlaydi</h2>\n  <p>Rasm yuklaysiz.</p>\n  <h2>Isbott</h2>\n  <p>Minglab e\'lon.</p>\n  <h2>HARAKAT</h2>\n  <p>E\'lon bering.</p>\n</main>\n<footer>\n  <p>Aloqa</p>\n</footer>'),
  html(P2, 'KOD_TASK', '209: muomo + mmuamo variantlari', 'pass', '<header>\n  <h2>OLX</h2>\n</header>\n<main>\n  <h2>1. Muomo</h2>\n  <p>Eski buyumlar uyda turibdi.</p>\n  <h2>Qanday ishlidi</h2>\n  <p>Rasm yuklaysiz.</p>\n  <h2>Isbot</h2>\n  <p>Minglab e\'lon.</p>\n  <h2>Harakat</h2>\n  <p>E\'lon bering.</p>\n</main>\n<footer>\n  <p>Aloqa</p>\n</footer>'),
  html(P2, 'KOD_TASK', '209: boshqa so\'z (Savol) — topilmasin', 'fail', '<header>\n  <h2>OLX</h2>\n</header>\n<main>\n  <h2>Savol</h2>\n  <p>Eski buyumlar.</p>\n  <h2>Qanday ishlaydi</h2>\n  <p>Rasm.</p>\n  <h2>Isbot</h2>\n  <p>Minglab.</p>\n  <h2>Harakat</h2>\n  <p>Bering.</p>\n</main>\n<footer>\n  <p>Aloqa</p>\n</footer>'),
];
