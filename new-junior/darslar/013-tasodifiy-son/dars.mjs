// 13-dars e'loni (21.11): «Tasodifiy son». Manba: new-junior/manba/013-tasodifiy-son.md (v1, tavsiya bo'yicha qurildi — «Savollar» 1–11 hammasi A).
// Faqat ma'lumot. 1–2-bekatda dastur egasi — olma (bosh.olmaDastur: har go to — bitta olma tushadi), 3-bekatda o'yin: qahramon strelkalar bilan (boshqaruv tayyor),
// olma dasturini bola tuzadi. random — oval son bloki, go to ning X / Y katagiga (studiya.js «13-dars», blockly.js go_to_r, random_n). Sinov: sinov/dvigatel/tasodif.mjs
const q13 = (y, a, b) => Array.from({ length: b - a + 1 }, (_, i) => [a + i, y])
const u13 = (x, a, b) => Array.from({ length: b - a + 1 }, (_, i) => [x, a + i])
const t13 = (x1, x2, y1, y2) => { const r = []; for (let y = y1; y <= y2; y++) for (let x = x1; x <= x2; x++) r.push([x, y]); return r }
const SAVAT13 = {
  P6: q13(0, 1, 5), B1A: q13(2, 0, 6), B1B: q13(0, 2, 4), B1C: u13(3, 0, 4), B1Y: [...q13(4, 1, 3).map((k) => [...k, 1]), ...q13(0, 5, 6).map((k) => [...k, 2])],
  P7: t13(3, 5, 1, 2), B2A: t13(0, 1, 2, 3), B2B: t13(2, 4, 0, 1), B2C: t13(2, 5, 0, 2), B2Y: t13(3, 5, 0, 1),
  P8: q13(0, 0, 6), B3A: t13(3, 5, 0, 2), B3B: q13(4, 1, 4), B3C: u13(0, 0, 3),
}
const DARS = {
  raqam: 13,
  nom: 'Tasodifiy son',
  savol: 'Olma har safar boshqa joyga <em>qanday</em> tushadi?',
  // javon: random (O'zgaruvchi oilasi — «Savollar» 3), Harakat (go to — son katakli), Takrorlash (repeat 2 — 11 · ★ uchun)
  javon: { h: [['y', '0,0']], o: [['m', '1-10']], b: [['p', '2']] },
  maydon: { w: 7, h: 5 },
  masshtabMin: 0.5, // go to (random bilan) keng — dastur ustuniga sig'sin (blockly.js blMasshtab)
  bezak: { daraxt: [[1, 1], [4, 3], [6, 1]], gul: [[0, 4], [2, 3], [5, 4], [6, 3]] }, // ★: olma daraxt va gulga tushmasin
  savatlar: SAVAT13,
  blokChegara: 12,
  joyQolmadi: 'Dasturga N ta blok sig‘adi',

  namuna: { qahramon: ['Momiq', 'Zippi'], ism: 'Aziz' },
  qahramonli: ['BK', 'B1A', 'B1B', 'B1C', 'B1Y', 'B2A', 'B2B', 'B2C', 'B2Y', 'B3A', 'B3B', 'B3C', 'B3Y', 'B5'],
  coddyli: [],

  // pog'onalar: 1–4 bitta son (B1A…B1Y), 5–8 ikki son (B2A…B2Y), 9–12 o'yin (B3A…B3Y)
  sanoq: { P1: ['kirdi'], P2: ['javob'], P5: ['pog', 3, 0], P5G: ['pog', 7, 4], P5B: ['pog', 11, 8], P14: ['sinf'] },

  bola: { javob: 'P2N', qahramonYoq: 'BQ', yakun: 'B5', kutish: 'BK', kutishGap: 'Ustozni tinglang' },
  ochish: [],
  oqishGap: 'Dasturingizni ustozga o‘qib bering', // 16-qadam (A·1)
  kichikGap: { B0: 'Dars hozir boshlanadi', P2N: 'Javobingiz qabul qilindi', B1Y: 'Hamma pog‘onalarni bajardingiz!', B2Y: 'Hamma pog‘onalarni bajardingiz!', B3Y: 'Hamma pog‘onalarni bajardingiz!' },

  tugadi: { ustoz: ['Dars tugadi!', 'Ko‘rishguncha — keyingi darsda xatolarni topamiz!'], bola: 'Dars tugadi. Ko‘rishguncha!' },

  solo: {
    yol: { 0: ['B0', 'P1'], 1: ['P2N'], 2: ['P2S'], 3: ['P2C'], 4: ['P3'], 5: ['P4'], 6: ['P6'], 7: ['B1A', 'B1B', 'B1C', 'B1Y'], 8: ['P4B'], 9: ['P7'], 10: ['B2A', 'B2B', 'B2C', 'B2Y'], 11: ['P9'], 12: ['P4C'], 13: ['P8'], 14: ['B3A', 'B3B', 'B3C', 'B3Y'], 16: ['B5'] },
    keyingi: ['B1A', 'B1B', 'B1C', 'B1Y', 'B2A', 'B2B', 'B2C', 'B2Y', 'B3A', 'B3B', 'B3C', 'B3Y'],
    gap: [],
  },

  // bosh.olmaDastur — olma dasturi; savat — savatlar ([x, y, guruh?]); olmaSoni; erkinOlma — savatsiz ★; oyin — 3-bekat o'yini; tanlov — ko'rish ekranida random tanlovi
  studiya: {
    P2S: { ish: 'huk', gap: { avto: true, keyingi: 'Keyingi ›', sinab: '▶ Sinab ko‘rish' } },
    P3: { ish: 'raqam' },
    P6: { tur: 'yol', bosh: { sahna: 'katak', olmaDastur: true, prog: [0, 'qoldir'], savat: SAVAT13.P6 }, chegara: 2, tanlov: [8, 4, 2, 5], gap: { boshla: ['', 'random sonlarini 1 va 5 ga o‘zgartiring'] } },
    B1A: { tur: 'yol', bosh: { sahna: 'katak', olmaDastur: true, prog: 0, pog: 1, savat: SAVAT13.B1A }, chegara: 2, maslahat: 'Savatlar bitta qatorda — Y bir xil. X qaysi sondan qaysi songacha?' },
    B1B: { tur: 'yol', bosh: { sahna: 'katak', olmaDastur: true, prog: 0, pog: 2, savat: SAVAT13.B1B }, chegara: 2, maslahat: 'Eng chapdagi savatning X i — boshi, eng o‘ngdagisiniki — oxiri' },
    B1C: { tur: 'yol', bosh: { sahna: 'katak', olmaDastur: true, prog: 0, pog: 3, savat: SAVAT13.B1C }, chegara: 2, maslahat: 'Bu safar qaysi son o‘zgaradi: X mi yoki Y mi?' },
    B1Y: { tur: 'yol', bosh: { sahna: 'katak', olmaDastur: true, prog: 0, pog: 4, savat: SAVAT13.B1Y, olmaSoni: 2 }, chegara: 4, maslahat: 'Har olmaga o‘z go to. Birinchi go to — 1-olma' },
    P7: { tur: 'yol', bosh: { sahna: 'katak', olmaDastur: true, prog: 'qoldir', savat: SAVAT13.P7 }, chegara: 3, tanlov: [4, 5, 2, 3, 1, 4, 2], gap: { boshla: ['', 'Y ga ham random qo‘ying'] } },
    B2A: { tur: 'yol', bosh: { sahna: 'katak', olmaDastur: true, prog: 0, pog: 5, savat: SAVAT13.B2A }, chegara: 3, maslahat: 'Savatlar ikki ustun va ikki qator: X qaysi sonlar? Y qaysi sonlar?' },
    B2B: { tur: 'yol', bosh: { sahna: 'katak', olmaDastur: true, prog: 0, pog: 6, savat: SAVAT13.B2B }, chegara: 3, maslahat: 'Chap pastki va o‘ng yuqori savatni toping — ularning X va Y sini o‘qing' },
    B2C: { tur: 'yol', bosh: { sahna: 'katak', olmaDastur: true, prog: 0, pog: 7, savat: SAVAT13.B2C }, chegara: 3, maslahat: 'Chetdagi savatlardan bitta katak ham chiqmasin — yonida daraxt bor' },
    B2Y: { tur: 'yol', bosh: { sahna: 'katak', olmaDastur: true, prog: 0, pog: 8, savat: SAVAT13.B2Y, olmaSoni: 3 }, chegara: 4, maslahat: 'Bitta olmaning dasturini repeat ichiga qo‘ying' },
    P8: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, olmaDastur: true, prog: [0, 'qoldir'], savat: SAVAT13.P8 }, chegara: 2, tanlov: [5, 1, 2, 6, 0, 3], gap: { yetdi: 'Siz yutdingiz!' } },
    B3A: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, olmaDastur: true, prog: 'qoldir', pog: 9, savat: SAVAT13.B3A }, chegara: 3, gap: { yetdi: 'Siz yutdingiz!' }, maslahat: 'Savatlar uch ustun va uch qator — qaysi sonlarga random kerak?' },
    B3B: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, olmaDastur: true, prog: 0, pog: 10, savat: SAVAT13.B3B }, chegara: 2, gap: { yetdi: 'Siz yutdingiz!' }, maslahat: 'Ikki chetda gul bor — chetdagi savatlarning X ini o‘qing' },
    B3C: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, olmaDastur: true, prog: 0, pog: 11, savat: SAVAT13.B3C }, chegara: 2, gap: { yetdi: 'Siz yutdingiz!' }, maslahat: 'Tepada gul bor — eng yuqori savatning Y ini o‘qing' },
    B3Y: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, olmaDastur: true, prog: 0, pog: 12, erkinOlma: true }, chegara: 3, gap: { yetdi: 'O‘yiningiz tayyor!' }, maslahat: 'Daraxt va gullar orasidagi bo‘sh joyni toping — X va Y sini o‘qing' },
    P11: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, olmaDastur: true, prog: 0, erkinOlma: true }, chegara: 3, gap: { yetdi: 'Siz yutdingiz!' } },
    B5: { ish: 'natija' },
  },
  // natija: ta random qo‘ydi — muvaffaqiyatli dasturlardagi random bloklari; ta olma tushirdi — savatga tushgan olmalar; ta olma terdi — o'yinda
  natija: [{ k: 'ta random qo‘ydi', blok: 'R' }, { k: 'ta olma tushirdi', blok: 'T' }, { k: 'ta olma terdi', blok: 'o' }],
  gapStandart: 'Salom!',

  lms: {
    id: 'junior-013-tasodifiy-son-v1', versiya: 'v1', kalit: 'jr013',
    // «Zar» — 8-qadamda 1-pog'ona (birinchi tasodifiy dastur); «Bog‘bon» — 15-qadamda 1-pog'ona (birinchi tasodifiy o'yin)
    yutuqlar: [{ t: 'pog', n: 1, nom: 'zar' }, { t: 'pog', n: 9, nom: 'bogbon' }],
  },

  varaq: [
    '<b>Asosiy fikr:</b> son har doim dasturga yozib qo‘yilmaydi — random uni har safar o‘zi tanlaydi; «dan … gacha» sonlarini savatlarga qarab o‘ylab tanlaymiz; tasodifiy dasturni bir necha marta ishga tushirib tekshiramiz.',
    '<b>Yo‘l:</b> huk (olma har safar boshqa joyga — uch sinov) → yangi so‘z «tasodifiy son» → reja → 1-bekat «Bitta son» → 2-bekat «Ikki son» → 3-bekat «O‘yin» → o‘qib berish → yakun.',
    '<b>Yangi blok:</b> random 1 to 10 — tasodifiy son (oval, O‘zgaruvchi oilasida — jigarrang). O‘zi yurmaydi — go to ning sonida turadi. Qo‘yish: go to dagi sonni bosing — ro‘yxat oxirida «random»; yoki javondan random ni bosing — go to ning bo‘sh soniga tushadi. Ustoz bir marta aytadi: «random — tasodifiy».',
    '<b>Olma dasturi:</b> 1–2-bekatda dastur olmaniki — har go to bitta olmani tushiradi, qahramon kuzatadi. Dvigatel random ning hamma sonini o‘zi sanab tekshiradi; bola uch marta ishga tushiradi («Sinov: N / 3») — olma kamida 2 xil joyga tushsa, «Har safar boshqa joy!». 3-bekatda o‘yin: qahramon strelkalar bilan (boshqaruv tayyor), olma olinsa — olma dasturi yana ishlaydi; 5 ta olma — yutdi.',
    '<b>Tasma va muammocha namunalari:</b> «2 / 2 ta blok», «3 / 3 ta blok»; «Sinov: 1 / 3» — «Yana ishga tushiring — olma qayerga tushadi?»; «Sinov: 3 / 3» — «Har safar boshqa joy!». Ortiqvoy: «random 5 ni ham tanlashi mumkin — olma (5, 0) ga tushadi. random sonlarini tekshiring», «random 7 ni ham tanlashi mumkin — maydonda X 0 dan 6 gacha». Huk: olma doim (3, 0) ga — «Olma: 1 / 3», «2 / 3», «3 / 3». 14-qadamda ikkinchi o‘yin: «Bu safar boshqa joy». Olma tushganda — yengil «tup».',
    '<b>Belgilar (pog‘onalar javobi):</b> «go(R0-6, 2)» — go to x: (random 0 to 6) y: 2; «R3[…]» — repeat 3; «3 ta sinovda 2 xil» — uch ishga tushirishda kamida 2 xil joy. 1-bekat: go(R0-6, 2) · go(R2-4, 0) · go(3, R0-4) · go(R1-3, 4) go(R5-6, 0). 2-bekat: go(R0-1, R2-3) · go(R2-4, R0-1) · go(R2-5, R0-2) · R3[go(R3-5, R0-1)]. 3-bekat: go(R3-5, R0-2) · go(R1-4, 4) · go(0, R0-3).',
    '<b>Ko‘rish ekranlarida</b> (huk, 7, 10, 14-qadam) tanlov oldindan berilgan: 7-qadamda «8» albatta chiqadi (maydondan tashqari), keyin 4, 2, 5. Bola pog‘onalarida tasodif — haqiqiy. 16-qadamda proyektorga ism chiqmaydi.',
  ],
}
for (const k in DARS.studiya) if (DARS.studiya[k].bosh && DARS.studiya[k].bosh.olmaDastur && DARS.studiya[k].chegara == null) DARS.studiya[k].chegara = DARS.blokChegara
