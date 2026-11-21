// 9-dars e'loni (20.11): «Labirint o‘yini 1». Manba: new-junior/manba/009-labirint-oyini-1.md (v1.1, tavsiya bo'yicha qurildi — «Savollar» 1–15 hammasi A).
// Faqat ma'lumot. Sahna — 3–7-darsdagi bog' maydoni (X va Y) endi butalar bilan (katak.js maydonHtml m.devor, kalit, eshik); o'yin — 4-darsdagi
// (bosh.oyin), qoida — 8-darsdagi if path → then strelka dasturchasida (bosh.labirint — studiya.js «9-dars» bo'limi).
const DARS = {
  raqam: 9,
  nom: 'Labirint o‘yini',
  savol: 'O‘yin <em>to‘xtamasin</em>. Qanday qilamiz?', // 71-qaror: manbadagi «Adashsangiz ham …» uch qator bo'lardi (setka) — manba v1.2
  // javon: hamma oila boshidan (loyiha darsi — «Savollar» 10): Hodisa, Harakat (to'rt move va go to), Shart, Tovush
  javon: { e: [['k', 'right']], h: ['r', 'l', 'u', 'd', 'x'], a: [['a', 'right']], t: [['n', 'qadam']] },
  maydon: { w: 7, h: 5 },
  dasturchalar: true,
  dasturchaBlok: true, // tasma yonida «N ta dasturcha» va «n / 16 ta blok»
  dasturchaUstun: 2, // dasturchalar ikki ustunda (blockly.js blTartib2): to'rt C-blokli dasturcha bitta ustunga o'qiladigan masshtabda sig'maydi (20.11 o'lchov)
  blokChegara: 16,
  joyQolmadi: 'Dasturga N ta blok sig‘adi',

  namuna: { qahramon: ['Momiq', 'Zippi'], ism: 'Aziz' },
  qahramonli: ['BK', 'B1A', 'B1B', 'B1C', 'B1Y', 'B2A', 'B2B', 'B2C', 'B2Y', 'B3A', 'B3B', 'B3Y', 'B5'],
  coddyli: [],

  // pog'onalar: 1–4 boshqaruv (B1A…B1Y), 5–8 qoida (B2A…B2Y), 9–11 kalit va yulduz (B3A, B3B, B3Y)
  sanoq: { P1: ['kirdi'], P2: ['javob'], P5: ['pog', 3, 0], P5G: ['pog', 7, 4], P5B: ['pog', 10, 8], P14: ['sinf'] },

  bola: { javob: 'P2N', qahramonYoq: 'BQ', yakun: 'B5', kutish: 'BK', kutishGap: 'Ustozni tinglang' },
  ochish: [],
  oqishGap: 'Qoidangizni ustozga o‘qib bering', // 16-qadam (A·1)
  kichikGap: { B0: 'Dars hozir boshlanadi', P2N: 'Javobingiz qabul qilindi', B1Y: 'Hamma pog‘onalarni bajardingiz!', B2Y: 'Hamma pog‘onalarni bajardingiz!', B3Y: 'Hamma pog‘onalarni bajardingiz!' },

  tugadi: { ustoz: ['Dars tugadi!', 'Ko‘rishguncha — keyingi darsda o‘z labirintingiz bilan!'], bola: 'Dars tugadi. Ko‘rishguncha!' },

  solo: {
    yol: { 0: ['B0', 'P1'], 1: ['P2N'], 2: ['P2S'], 3: ['P2C'], 4: ['P3'], 5: ['P4'], 6: ['P6'], 7: ['B1A', 'B1B', 'B1C', 'B1Y'], 8: ['P4B'], 9: ['P7'], 10: ['B2A', 'B2B', 'B2C', 'B2Y'], 11: ['P9'], 12: ['P4C'], 13: ['P8'], 14: ['B3A', 'B3B', 'B3Y'], 16: ['B5'] },
    keyingi: ['B1A', 'B1B', 'B1C', 'B1Y', 'B2A', 'B2B', 'B2C', 'B2Y', 'B3A', 'B3B', 'B3Y'],
    gap: [],
  },

  // dasturi ko'rinmaydigan o'yinlar (huk, javob; studiya.js sahnaOyin): [tugma, daraxt] — t: blok turi, yon: shart tomoni, ichki: if ichidagilar
  oyinlar: {
    shartsiz: [['right', [{ t: 'r' }]], ['left', [{ t: 'l' }]], ['up', [{ t: 'u' }]], ['down', [{ t: 'd' }]]],
    tepasiz: [['right', [{ t: 'r' }]], ['left', [{ t: 'l' }]], ['down', [{ t: 'd' }]]], // huk B: ↑ dasturchasi olib tashlandi
    qoida: ['right', 'left', 'up', 'down'].map((y) => [y, [{ t: 'a', yon: y, ichki: [{ t: { right: 'r', left: 'l', up: 'u', down: 'd' }[y] }] }]]),
    qoida2: ['right', 'up'].map((y) => [y, [{ t: 'a', yon: y, ichki: [{ t: { right: 'r', up: 'u' }[y] }] }]]), // 10-qadam solo'da tayyor
  },

  // bosh.labirint — o'yin labirint maydonda (urilsa o'yin to'xtaydi); qoida, yoq, tovushIf, startga, chekTola — pog'ona shartlari; chek — chek-list ko'rinadi;
  // shartGap — 2-bekatdan To'siqvoy gapi; qoidaIshora — qoidasiz strelka ishorasi; saqla — o'yin 10-dars uchun; soloDastur — solo'da tayyor dastur
  studiya: {
    P2: { ish: 'sahnaOyin', dastur: 'shartsiz', avto: '→↑→→↑→↑→↑↑→' },
    P2N: { ish: 'sahnaOyin', dastur: 'shartsiz', avto: '→↑→→↑→↑→↑↑→', soloFaqat: true },
    P2S: { ish: 'huk', gap: { avto: true, keyingi: 'Keyingi ›', sinab: '▶ Sinab ko‘rish' } },
    P2C: { ish: 'sahnaOyin', dastur: 'qoida', gap: { boshla: ['', 'Endi o‘zingiz: ataylab devor tomonga bosing, keyin yuting'] } },
    P3: { ish: 'raqam' },
    P6: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, labirint: true, prog: [0, 'qoldir'] }, gap: { yetdi: 'Siz yutdingiz!' } },
    B1A: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, labirint: true, prog: 0, pog: 1 }, gap: { yetdi: 'Siz yutdingiz!' }, maslahat: 'Yulduz qaysi tomonda? O‘sha strelkaga dasturcha tuzing' },
    B1B: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, labirint: true, prog: 'oldingi', pog: 2 }, gap: { yetdi: 'Siz yutdingiz!' }, maslahat: 'Yo‘l qayerda buriladi? U yerda qaysi strelka kerak?' },
    B1C: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, labirint: true, prog: 'oldingi', pog: 3 }, gap: { yetdi: 'Siz yutdingiz!' }, maslahat: 'Qahramon pastga ham yurishi kerak. Qaysi dasturcha hali yo‘q?' },
    B1Y: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, labirint: true, prog: 'oldingi', pog: 4 }, gap: { yetdi: 'Siz yutdingiz!' }, maslahat: 'Yo‘l orqaga ham qaytadi. Qaysi strelka yetishmayapti?' },
    P7: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, labirint: true, prog: 'qoldir', soloDastur: 'qoida2', shartGap: true }, gap: { yetdi: 'Siz yutdingiz!', boshla: ['', 'Ataylab devor tomonga bosing — qoidani ko‘ring'] } },
    B2A: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, labirint: true, prog: 'oldingi', pog: 5, qoida: true, yoq: true, shartGap: true, qoidaIshora: true }, gap: { yetdi: 'Siz yutdingiz!' }, maslahat: 'Strelka bosilganda qahramon avval nimani tekshirsin? Qaysi tomonni?' },
    B2B: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, labirint: true, prog: 'oldingi', pog: 6, qoida: true, shartGap: true, qoidaIshora: true }, gap: { yetdi: 'Siz yutdingiz!' }, maslahat: 'Yo‘l chapga ham ketadi. Strelkalaringizni tekshiring' },
    B2C: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, labirint: true, prog: 'oldingi', pog: 7, qoida: true, shartGap: true, qoidaIshora: true }, gap: { yetdi: 'Siz yutdingiz!' }, maslahat: 'Avval ko‘z bilan yo‘lni toping, keyin bosing' },
    B2Y: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, labirint: true, prog: 'oldingi', pog: 8, qoida: true, tovushIf: true, shartGap: true, qoidaIshora: true }, gap: { yetdi: 'Siz yutdingiz!' }, maslahat: 'if ichidagi bloklar qachon bajariladi? Tovush qachon chalinsin?' },
    P8: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, labirint: true, prog: 'qoldir', chek: true, shartGap: true }, gap: { yetdi: 'Siz yutdingiz!' } },
    B3A: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, labirint: true, prog: 'oldingi', pog: 9, chek: true, shartGap: true, qoidaIshora: true }, gap: { yetdi: 'Siz yutdingiz!' }, maslahat: 'Kalit qayerda? Eshikdan oldin o‘sha yerga boring' },
    B3B: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, labirint: true, prog: 'oldingi', pog: 10, chek: true, chekTola: true, saqla: true, shartGap: true, qoidaIshora: true }, gap: { yetdi: 'O‘yiningiz tayyor!' }, maslahat: 'Kalit yo‘ldan chetda. Ro‘yxatda qaysi band bo‘sh?' },
    B3Y: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, labirint: true, prog: 'oldingi', pog: 11, chek: true, startga: true, saqla: true, shartGap: true, qoidaIshora: true }, gap: { yetdi: 'Siz yutdingiz!' }, maslahat: 'Qaysi tugma hali bo‘sh? U bosilganda qahramon qayerga borsin?' },
    P11: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, labirint: true, prog: 'qoldir', shartGap: true }, gap: { yetdi: 'Siz yutdingiz!' } },
    B5: { ish: 'natija' },
  },
  // natija: marta tugma bosdi — yutilgan o'yinlardagi bosishlar; marta devor oldida to'xtadi — o'sha o'yinlarda shart «yo'q» bergan bosishlar; labirint yutdi
  natija: [{ k: 'marta tugma bosdi', blok: 't' }, { k: 'marta devor oldida to‘xtadi', blok: 'Y' }, { k: 'labirint yutdi', blok: 'L' }],
  gapStandart: 'Salom!',

  lms: {
    id: 'junior-009-labirint-oyini-1-v1', versiya: 'v1', kalit: 'jr009',
    yutuqlar: [{ t: 'pog', n: 5, nom: 'qoida' }, { t: 'pog', n: 10, nom: 'labirint_oyini' }],
  },

  varaq: [
    '<b>Asosiy fikr:</b> o‘yin = boshqaruv + qoida + maqsad. Qoida — shart: agar yo‘l bo‘lsa, unda yur; adashsangiz ham o‘yin davom etadi.',
    '<b>Yo‘l:</b> huk (adashgan bosish — uch sinov) → yangi so‘z «qoida» → reja → 1-bekat «Boshqaruv» → 2-bekat «Qoida» → 3-bekat «Kalit va yulduz» → o‘qib berish → yakun.',
    '<b>Yangi blok yo‘q:</b> 8-darsdagi if path → then endi hodisa bloki ostida. Qo‘yish: hodisa blokini bosing (dasturcha tanlanadi), javondan if — dasturcha oxiriga tushadi va tanlanadi, keyin move — if ichiga. Eski move ni ✕ bilan olib tashlang.',
    '<b>Ko‘p uchraydigan xato:</b> shart tomoni strelkaniki bilan bir xil emas (↑ dasturchasida if path →). Javobni aytmang — «Bu strelka qaysi tomonni tekshiryapti?» deb so‘rang.',
    '<b>O‘yin:</b> 1-bekatda shartsiz move devorga urilsa — o‘yin to‘xtaydi (bu ataylab: 2-bekatda qoida shu muammoni hal qiladi). Dastur pog‘onadan pog‘onaga o‘tadi. O‘yin paytida proyektorda → va ← qadam almashtirmaydi — «Keyingi» bilan o‘ting.',
  ],
}
// har studiya ekranining chegarasi 16 (manba KOD 10): to'lsa Ortiqvoy «Joy qolmadi!» (studiya.js — topshiriqning o'z chegarasi bo'lsa muammocha)
for (const k in DARS.studiya) if (DARS.studiya[k].bosh) DARS.studiya[k].chegara = DARS.blokChegara
