// 12-dars e'loni (21.11): «Jon va qadam». Manba: new-junior/manba/012-ozgaruvchi-jon-vaqt.md (v1, tavsiya bo'yicha qurildi — «Savollar» 1–10 hammasi A).
// Faqat ma'lumot. 11-darsdagi o'yin (bosh.ball — studiya.js «11-dars» bo'limi) endi kaktus, bir nechta o'zgaruvchi (ball, jon, qadam), shart `if jon = 0 then`,
// `game over` va `when any key pressed` bilan; sinov pog'onalari (bosh.sinov) — o'yin aynan 0 da tugashi kerak.
const DARS = {
  raqam: 12,
  nom: 'Jon va qadam',
  savol: 'Jon tugasa, o‘yinni <em>qanday</em> tugatamiz?',
  // javon: Hodisa (olmaga tekkanda, ▶ bosilganda, game over, istalgan tugma — 3-bekatda), Shart (if … = … then), O'zgaruvchi (change, set)
  javon: { e: [['q', 'apple'], 'f', 'g', ['k', 'any']], a: [['i', 'ball:0']], o: [['c', '1'], ['z', '0']] },
  ikonOila: { b: ['p'] },
  ozgaruvchi: ['ball', 'jon', 'qadam'],
  changeSonlar: [-3, -2, -1, 1, 2, 3, 4, 5, 10],
  kaktus: true, tugmaAny: true,
  dasturJson: true, // dastur pog'onadan pog'onaga if ichidagilari bilan
  oltinGap: 'Oltin olmaga o‘z dasturchasi kerak — hodisa blokida turini tanlang',
  maydon: { w: 7, h: 5 },
  dasturchalar: true,
  dasturchaBlok: true,
  blokChegara: 16,
  joyQolmadi: 'Dasturga N ta blok sig‘adi',

  namuna: { qahramon: ['Momiq', 'Zippi'], ism: 'Aziz' },
  qahramonli: ['BK', 'B1A', 'B1B', 'B1C', 'B1Y', 'B2A', 'B2B', 'B2C', 'B2Y', 'B3A', 'B3B', 'B3C', 'B3Y', 'B5'],
  coddyli: [],

  // pog'onalar: 1–4 jon (B1A…B1Y), 5–8 ball va jon (B2A…B2Y), 9–12 qadam (B3A…B3Y)
  sanoq: { P1: ['kirdi'], P2: ['javob'], P5: ['pog', 3, 0], P5G: ['pog', 7, 4], P5B: ['pog', 11, 8], P14: ['sinf'] },

  bola: { javob: 'P2N', qahramonYoq: 'BQ', yakun: 'B5', kutish: 'BK', kutishGap: 'Ustozni tinglang' },
  ochish: [],
  oqishGap: 'Dasturingizni ustozga o‘qib bering', // 16-qadam (A·1)
  kichikGap: { B0: 'Dars hozir boshlanadi', P2N: 'Javobingiz qabul qilindi', B1Y: 'Hamma pog‘onalarni bajardingiz!', B2Y: 'Hamma pog‘onalarni bajardingiz!', B3Y: 'Hamma pog‘onalarni bajardingiz!' },

  tugadi: { ustoz: ['Dars tugadi!', 'Ko‘rishguncha — keyingi darsda tasodifiy son bilan!'], bola: 'Dars tugadi. Ko‘rishguncha!' },

  solo: {
    yol: { 0: ['B0', 'P1'], 1: ['P2N'], 2: ['P2S'], 3: ['P2C'], 4: ['P3'], 5: ['P4'], 6: ['P6'], 7: ['B1A', 'B1B', 'B1C', 'B1Y'], 8: ['P4B'], 9: ['P7'], 10: ['B2A', 'B2B', 'B2C', 'B2Y'], 11: ['P9'], 12: ['P4C'], 13: ['P8'], 14: ['B3A', 'B3B', 'B3C', 'B3Y'], 16: ['B5'] },
    keyingi: ['B1A', 'B1B', 'B1C', 'B1Y', 'B2A', 'B2B', 'B2C', 'B2Y', 'B3A', 'B3B', 'B3C', 'B3Y'],
    gap: [],
  },

  // huk (2–4-qadam): Coddy'da 3 ta jon, kaktus (2, 0); tayyor bosishlar →→→→→ (studiya.js sahnaBos — kaktusga tegish, game over)
  oyinlar: {
    hukA: [['right', [{ t: 'r' }]], ['left', [{ t: 'l' }]], ['up', [{ t: 'u' }]], ['down', [{ t: 'd' }]], ['cactus', [{ t: 'g' }]]],
    hukB: [['right', [{ t: 'r' }]], ['left', [{ t: 'l' }]], ['up', [{ t: 'u' }]], ['down', [{ t: 'd' }]], ['cactus', [{ t: 'c', m: 'jon:-1' }]]],
    hukC: [['right', [{ t: 'r' }]], ['left', [{ t: 'l' }]], ['up', [{ t: 'u' }]], ['down', [{ t: 'd' }]], ['cactus', [{ t: 'c', m: 'jon:-1' }, { t: 'i', m: 'jon:0', ichki: [{ t: 'g' }] }]]],
  },

  // bosh.ball — o'yin (11-dars); sinov — qoidani sinash: o'yin game over bilan tugasin va shu lahzada ozg = 0 (teg — shuncha tegishda, bosish — shuncha bosishda);
  // qoida — yutganda dasturda shu o'zgaruvchilar qoidasi bo'lsin; oltinJon — oltin olma jon beradi; kaktusBall — kaktus ballni ham oladi; erkin3 — ★ «O‘z o‘yiningiz»
  studiya: {
    P2S: { ish: 'huk', gap: { avto: true, keyingi: 'Keyingi ›', sinab: '▶ Sinab ko‘rish' } },
    P3: { ish: 'raqam' },
    P6: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, ball: true, prog: 'qoldir' }, ochiq: { e: 3 }, gap: { yetdi: 'Siz yutdingiz!', boshla: ['', '↑ ni uch marta bosing — kaktusga teging'] } },
    B1A: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, ball: true, prog: 'qoldir', pog: 1, sinov: { ozg: 'jon' } }, ochiq: { e: 3 }, maslahat: 'Kaktusga tekkanda ikki ish: jon kamayadi, keyin shart uni tekshiradi' },
    B1B: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, ball: true, prog: 'oldingi', pog: 2, sinov: { ozg: 'jon', teg: 2, tegGap: 'Kaktus har tegishda 2 ta jon olsin' } }, ochiq: { e: 3 }, maslahat: 'Ikki son bor: o‘yin boshidagi jon va kaktus oladigan jon' },
    B1C: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, ball: true, prog: 'oldingi', pog: 3, qoida: ['jon'] }, ochiq: { e: 3 }, gap: { yetdi: 'Siz yutdingiz!' }, maslahat: 'Yo‘lni oldindan ko‘z bilan chizing — kaktuslarni aylanib o‘ting' },
    B1Y: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, ball: true, prog: 'oldingi', pog: 4, qoida: ['jon'] }, ochiq: { e: 3 }, gap: { yetdi: 'Siz yutdingiz!' }, maslahat: 'Avval tor joyni toping — undan qanday o‘tasiz?' },
    P7: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, ball: true, prog: 'qoldir' }, ochiq: { e: 3 }, gap: { yetdi: 'Siz yutdingiz!' } },
    B2A: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, ball: true, prog: 'oldingi', pog: 5, kerak: 3, qoida: ['jon'] }, ochiq: { e: 3 }, gap: { yetdi: 'Siz yutdingiz!' }, maslahat: 'Ball uchun ikki joy: o‘yin boshi va olmaga tekkanda' },
    B2B: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, ball: true, prog: 'oldingi', pog: 6, kerak: 3, oltinJon: true, qoida: ['jon'] }, ochiq: { e: 3 }, gap: { yetdi: 'Siz yutdingiz!' }, maslahat: 'Oltin olma qaysi o‘zgaruvchini o‘zgartiradi?' },
    B2C: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, ball: true, prog: 'oldingi', pog: 7, kaktusBall: true, qoida: ['jon'] }, ochiq: { e: 3 }, gap: { yetdi: 'Siz yutdingiz!' }, maslahat: 'Bitta dasturcha ikki o‘zgaruvchini o‘zgartira oladi' },
    B2Y: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, ball: true, prog: 'oldingi', pog: 8, kerak: 10, qoida: ['jon'] }, ochiq: { e: 3 }, gap: { yetdi: 'Siz yutdingiz!' }, maslahat: 'Olmalar orasida kaktuslar ustuni bor — qayerdan aylanib o‘tasiz?' },
    P8: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, ball: true, prog: 'qoldir' }, gap: { yetdi: 'Siz yutdingiz!', boshla: ['', 'Avval istalgan strelkani 6 marta bosing, keyin yulduzga boring'] } },
    B3A: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, ball: true, prog: 'qoldir', pog: 9, sinov: { ozg: 'qadam', bosish: 5, bosishGap: 'Qadam 5 bo‘lsin: 5-bosishda o‘yin tugasin' } }, maslahat: 'Har bosishda ishlaydigan hodisa bloki kerak — 9-darsdagi qoida kabi' },
    B3B: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, ball: true, prog: 'oldingi', pog: 10, kerak: 3, qoida: ['jon', 'qadam'] }, gap: { yetdi: 'Siz yutdingiz!' }, maslahat: 'Bosishdan oldin yo‘lni barmoq bilan sanang' },
    B3C: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, ball: true, prog: 'oldingi', pog: 11, kerak: 3, qoida: ['jon', 'qadam'] }, gap: { yetdi: 'Siz yutdingiz!' }, maslahat: 'Uchala son o‘yin boshida qo‘yiladi — when ▶ clicked ostini tekshiring' },
    B3Y: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, ball: true, prog: 'oldingi', pog: 12, erkin3: true }, gap: { yetdi: 'O‘yiningiz tayyor!' }, maslahat: 'Qadam yo‘lga yetsin: avval sanang, keyin sonni tanlang' },
    P11: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, ball: true, prog: 0 }, gap: { yetdi: 'Siz yutdingiz!' } },
    B5: { ish: 'natija' },
  },
  // natija: ta o‘yin yutdi — yutish pog'onalari; ta shart qo‘ydi — muvaffaqiyatli dasturdagi shartlar (eng ko'pi); ta o‘zgaruvchi ishlatdi — dasturdagi har xil o'zgaruvchilar (eng ko'pi)
  natija: [{ k: 'ta o‘yin yutdi', blok: 'W' }, { k: 'ta shart qo‘ydi', eng: 'S' }, { k: 'ta o‘zgaruvchi ishlatdi', eng: 'V' }],
  gapStandart: 'Salom!',

  lms: {
    id: 'junior-012-ozgaruvchi-jon-vaqt-v1', versiya: 'v1', kalit: 'jr012',
    // «Jon qo‘riqchisi» — 1-pog'ona (birinchi jon qoidasi ishladi); «Uch o‘zgaruvchi» — 3-bekat 3-pog'onasi
    yutuqlar: [{ t: 'pog', n: 1, nom: 'qoriqchi' }, { t: 'pog', n: 11, nom: 'uchala' }],
  },

  varaq: [
    '<b>Asosiy fikr:</b> o‘yinda bir nechta o‘zgaruvchi bo‘ladi; shart o‘zgaruvchining sonini tekshiradi — jon 0 bo‘lsa, o‘yin tugaydi. Hukda (B karta — sanadi, lekin tugatmadi), xulosada va 3-bekatda chiqadi.',
    '<b>Yo‘l:</b> huk (o‘yinni qanday tugatamiz — uch sinov) → yangi so‘z «jon» → reja → 1-bekat «Jon» → 2-bekat «Ball va jon» → 3-bekat «Qadam» → o‘qib berish → yakun.',
    '<b>Yangi bloklar:</b> if jon = 0 then — agar jon 0 ga teng bo‘lsa, unda (Shart oilasi, 8-darsdagi ramka); game over — o‘yin tugadi (Hodisa oilasi). Kaktus (when touching cactus), manfiy son (change jon by −1 — «minus bir», jon bittaga kamayadi), o‘zgaruvchilar ro‘yxati: ball, jon, qadam. 3-bekatda when any key pressed. Ustoz aytadi: «if — Shart oilasidan, 8-darsdagidek. game over — Hodisa oilasida, o‘yin bloklari yonida.»',
    '<b>Qoidani sinash:</b> 1-bekatning 1–2-pog‘onasida va 3-bekatning 1-pog‘onasida bolalar ataylab yutqazadi — «O‘yin tugadi» chiqsa, «Shart ishladi!» deb maqtang. «O‘yin tugadi» — muammo emas: yana «▶ Boshlash». Bolaga «yutqazdingiz» demang. Qadam: «qadam: 12» — 11 ta bosishda yutish kerak (12-bosishda qadam 0 bo‘ladi va o‘yin tugaydi).',
    '<b>Muammocha namunalari:</b> jon 0 dan o‘tdi — Kamvoy «Jon tugadi-ku!» («Jon −1 bo‘ldi, o‘yin esa davom etyapti. Jon 0 bo‘lganda o‘yin tugashi uchun shart kerak»); erta tugadi — Ortiqvoy «Erta tugadi!» («Jon 2 qoldi, o‘yin esa tugadi. Shart qachon «ha» deydi — sonni tekshiring»). Belgilar (pog‘onalar javobi): ▶[jon 3] — when ▶ clicked ostida set jon to 3 · K[−1; =0] — when touching cactus ostida change jon by −1 va if jon = 0 then → game over · O[+1] — when touching apple → change ball by 1 · OO[jon +1] — when touching gold apple → change jon by 1 · Q — when any key pressed → change qadam by −1, if qadam = 0 then → game over.',
  ],
}
// har o'yin ekranining chegarasi 16 (manba «Bloklar»)
for (const k in DARS.studiya) if (DARS.studiya[k].bosh && DARS.studiya[k].bosh.ball) DARS.studiya[k].chegara = DARS.blokChegara
