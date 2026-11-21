// 3-dars e'loni (20.11): «X va Y» — koordinatalar. Manba: new-junior/manba/003-koordinata.md (v1.1, tasdiqlangan).
// Faqat ma'lumot (satr, son, ro'yxat) — funksiya yo'q. Maydonlar ma'nosi — 1-dars e'lonida (darslar/001-tanishuv/dars.mjs) va 2-dars e'lonida; bu yerda faqat farqlari.
// Ekran nomlari — shu papkadagi ekranlar.mjs (E); qadamlar — qadamlar.mjs (QADAM, 0 dan). Manzillar (x, y): boshi pastki chap (0, 0), Y tepaga.
const DARS = {
  raqam: 3,
  nom: 'X va Y', // ekranda «3-dars · X va Y» (2-dars yakunidagi va'da; «koordinata» — 5-qadamdagi yangi so'z)
  savol: 'Yashirin yulduzni qaysi <em>xat</em> bilan topamiz?',
  // javonda faqat Harakat oilasi: yangi go to va 2-darsdagi to'rt yo'nalish
  javon: { h: ['x', 'r', 'l', 'u', 'd'] },
  // maydon o'lchami — go to sonlari shundan (X 0–6, Y 0–4; blockly.js)
  maydon: { w: 7, h: 5 },

  namuna: { qahramon: ['Momiq', 'Zippi'], ism: 'Aziz' },
  // bolaning qahramoni chiziladigan ekranlar (maydonda — o'z qahramoni)
  qahramonli: ['BK', 'B1A', 'B1B', 'B1C', 'B1Y', 'B2A', 'B2B', 'B2C', 'B2Y', 'B3A', 'B3B', 'B3C', 'B3Y', 'B5'],
  coddyli: [],

  // pog'onalar butun dars bo'yi ketma-ket: 1–4 manzilni o'qiymiz (B1A…B1Y), 5–8 manzilga boramiz (B2A…B2Y), 9–12 oldindan aytamiz (B3A…B3Y)
  sanoq: { P1: ['kirdi'], P2: ['javob'], P5: ['pog', 3, 0], P5G: ['pog', 7, 4], P5B: ['pog', 11, 8], P14: ['sinf'] },

  bola: {
    javob: 'P2N', // xat kartasini tanlaydi
    qahramonYoq: 'BQ',
    yakun: 'B5',
    kutish: 'BK',
    kutishGap: 'Ustozni tinglang',
  },
  ochish: [],
  kichikGap: { B0: 'Dars hozir boshlanadi', P2N: 'Javobingiz qabul qilindi', B1Y: 'Hamma pog‘onalarni bajardingiz!', B2Y: 'Hamma pog‘onalarni bajardingiz!', B3Y: 'Hamma pog‘onalarni bajardingiz!' },

  tugadi: { ustoz: ['Dars tugadi!', 'Ko‘rishguncha — keyingi darsda hodisalar bilan!'], bola: 'Dars tugadi. Ko‘rishguncha!' },

  // solo (manba «Solo»): 3-qadamda uch xatni bola o'zi sinaydi; 5, 7-qadamda «Keyingi»ni o'zi bosadi; 10, 14-qadamda dastur tayyor — o'zi ishga tushiradi
  // (14-qadamda bayroqchani o'zi qo'yadi); 16 va 18 — yo'q; doskalar o'rniga darhol o'z ekrani
  solo: {
    yol: { 0: ['B0', 'P1'], 1: ['P2N'], 2: ['P2S'], 3: ['P2C'], 4: ['P3'], 5: ['P4'], 6: ['P6'], 7: ['B1A', 'B1B', 'B1C', 'B1Y'], 8: ['P4B'], 9: ['P7'], 10: ['B2A', 'B2B', 'B2C', 'B2Y'], 11: ['P9'], 12: ['P4C'], 13: ['P8'], 14: ['B3A', 'B3B', 'B3C', 'B3Y'], 16: ['B5'] },
    keyingi: ['B1A', 'B1B', 'B1C', 'B1Y', 'B2A', 'B2B', 'B2C', 'B2Y', 'B3A', 'B3B', 'B3C', 'B3Y'],
    gap: [],
  },

  // Blok studiya va maydon topshiriqlari (bosh.sahna 'katak' — maydon ekranda katak.js maydonHtml bilan chizilgan):
  //   ish 'katakBos' — katak: [[x, y]…] ketma-ket bosiladi (1-bekat); bosh.bashorat — dastur tayyor, bayroqcha (3-bekat); bosh.erkinYol — kamida N xil manzil
  //   bosh.olmaShart: false — olma bor, lekin tekshiruvga kirmaydi (10-qadam: ustoz avval faqat yulduzga, keyin olma orqali)
  studiya: {
    P2S: { ish: 'huk', gap: { avto: true, keyingi: 'Keyingi ›', sinab: '▶ Sinab ko‘rish' } },
    P3: { ish: 'raqam' },
    P6: { ish: 'raqam' },
    B1A: { ish: 'katakBos', katak: [[3, 0]], pog: 1, maslahat: 'Birinchi son — X: chap chetdan o‘ngga sanang. Ikkinchisi — Y: pastdan tepaga' },
    B1B: { ish: 'katakBos', katak: [[0, 2]], pog: 2, maslahat: 'X = 0 bo‘lsa — o‘ngga yurmaymiz. Y ni pastdan sanang' },
    B1C: { ish: 'katakBos', katak: [[4, 3]], pog: 3, maslahat: 'Barmog‘ingiz bilan sanang: avval o‘ngga, keyin tepaga' },
    B1Y: { ish: 'katakBos', katak: [[2, 4], [4, 2]], pog: 4, maslahat: 'Sonlar bir xil, tartibi boshqa — katak ham boshqa' },
    P7: { tur: 'yol', bosh: { sahna: 'katak', prog: [0, 'qoldir'], olmaShart: false } },
    B2A: { tur: 'yol', bosh: { sahna: 'katak', prog: 0, pog: 5 }, maslahat: 'go to blokida birinchi son — X, ikkinchisi — Y. Sarlavhadagi manzilni o‘qing' },
    B2B: { tur: 'yol', bosh: { sahna: 'katak', prog: 0, pog: 6 }, maslahat: 'Ikkita go to kerak: biri olmaga, biri yulduzga. Qaysi biri birinchi?' },
    B2C: { tur: 'yol', bosh: { sahna: 'katak', prog: 0, pog: 7 }, maslahat: 'Uchta go to — yozilgan tartibda' },
    B2Y: { tur: 'yol', bosh: { sahna: 'katak', prog: 0, pog: 8, erkinYol: 3 }, maslahat: 'Har go to blokiga boshqa manzil qo‘ying' },
    P8: { tur: 'yol', bosh: { sahna: 'katak', bashorat: true, prog: 'qoldir' }, gap: { boshla: ['', '(3, 2) katakni bosing — bayroqcha qo‘yiladi'] } },
    B3A: { tur: 'yol', bosh: { sahna: 'katak', bashorat: true, prog: 'qoldir', pog: 9 }, maslahat: 'Har blokni sanang: o‘ngga — X ga bitta qo‘shiladi, tepaga — Y ga' },
    B3B: { tur: 'yol', bosh: { sahna: 'katak', bashorat: true, prog: 'qoldir', pog: 10 }, maslahat: 'move down — Y dan bitta ayiriladi' },
    B3C: { tur: 'yol', bosh: { sahna: 'katak', bashorat: true, prog: 'qoldir', pog: 11 }, maslahat: 'Sanashni go to manzilidan boshlang' },
    B3Y: { tur: 'yol', bosh: { sahna: 'katak', bashorat: true, prog: 'qoldir', pog: 12 }, maslahat: 'Ikkinchi go to qayerga sakratadi? Sanashni o‘sha yerdan boshlang' },
    P11: { tur: 'yol', bosh: { sahna: 'katak', prog: 0, erkinYol: 1 } },
    B5: { ish: 'natija' },
  },
  // natija sonlari (17, 18-qadam): katak topdi — 1-bekatda topilgan kataklar (★ da ikkitasi); manzilga bordi — muvaffaqiyatli dasturlardagi go to bloklari;
  // oldindan aytdi — 3-bekat pog'onalaridan to'g'ri aytilganlari
  natija: [{ k: 'katak topdi', blok: 'c' }, { k: 'manzilga bordi', blok: 'x' }, { k: 'marta oldindan aytdi', ekran: ['B3A', 'B3B', 'B3C', 'B3Y'] }],
  gapStandart: 'Salom!',

  // LMS — modul tugagach (93-qaror). Yutuqlar: manzil — 2-bekatning 1-pog'onasi (pog 5, birinchi go to dasturi), oldindan — 3-bekatning 3-pog'onasi (pog 11)
  lms: {
    id: 'junior-003-koordinata-v1', versiya: 'v1', kalit: 'jr003',
    yutuqlar: [{ t: 'pog', n: 5, nom: 'manzil' }, { t: 'pog', n: 11, nom: 'oldindan' }],
  },

  varaq: [
    '<b>Asosiy fikr:</b> ikki son — bitta katak; avval X, keyin Y. Hukda, xulosada va ★ masalalarda (sonlar almashsa — boshqa katak) chiqadi.',
    '<b>Yo‘l:</b> huk (uchta xat va uch sinov) → yangi so‘z «koordinata» → reja → 1-bekat «Manzilni o‘qiymiz» → 2-bekat «Manzilga boramiz» → 3-bekat «Oldindan aytamiz» → o‘qib berish → yakun.',
    '<b>Yangi blok:</b> go to x: y: — X va Y ga bor. U ham ko‘k — harakat. Birinchi chiqqanda bir marta ayting; sonni bosib tanlashni sekin, ikki marta ko‘rsating. X ni «iks», Y ni «igrek» deb o‘qing; ekranda faqat harf.',
    '<b>Darsda savol bitta</b> — boshidagi huk. 3-bekatdagi «oldindan aytish» — har bolaning o‘z topshirig‘i (bayroqcha qo‘yadi va o‘zi tekshiradi), sinfga savol emas.',
    '<b>Demoda:</b> hukdagi raqamlar haqiqiy (kirdi, javob berdi). Doskalardagi raqamlar — bolalar bajargani bo‘yicha. go to blokidagi sonni bosing — ro‘yxatdan tanlanadi.',
  ],
}
