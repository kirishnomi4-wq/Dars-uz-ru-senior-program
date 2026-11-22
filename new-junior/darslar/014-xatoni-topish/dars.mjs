// 14-dars e'loni (21.11): «Amaliyot: xatoni topish va tuzatish». Manba: new-junior/manba/014-xatoni-topish.md (v1.1 — foydalanuvchi 14·1–14·4 A; audit filtri — «Qurishdagi qarorlar» 1–36).
// Faqat ma'lumot. Amaliyot: yangi blok yo'q; har pog'onada tayyor xatoli dastur (prog 'qoldir'), o'z javoni (studiya({ javon }) — ekranlar.mjs) va o'z sahnasi.
// Yangi tugma — «Bitta qadam» (DARS.bittaQadam; studiya.js «14-dars»): har bosish — qahramon bitta qadam; kulrang rasmda rasmdan chiqqan qadamda to'xtaydi.
// 3-bekat: ikki labirint (bosh.egiz), o'yin (bosh.oyin, kerak.tomon, ikkiIshoraYoq), savatlar (olmaDastur, savatKech); ★ — topishmoq (bosh.topishmoq, tahrir.js).
const CHET = 'Qahramon shu blokda to‘xtadi. Shu blokni va undan oldingisini o‘qing'
const OTIB = 'Qahramon yulduzdan o‘tib ketdi. Qaysi blok uni uzoqqa olib bordi?'
const BOSHQA = 'Qahramon (x, y) da. Yulduzning manzilini o‘qing'
const RCHIQ = 'Qahramon (x, y) ga chiqdi — u kulrang emas. Bitta qadam bilan yuring'
const RKAM = 'Kulrang katak qoldi — (x, y). Bitta qadam bilan yuring'
const Y1 = { chet: CHET, otibKetdi: OTIB, boshqa: BOSHQA }
const Y2 = { chet: CHET, rasmChiqdi: RCHIQ, rasmKam: RKAM, yetdi: 'Rasm tayyor!' }
const SAVAT14 = { P8: [[2, 0], [3, 0], [4, 0], [5, 0], [6, 0]], B3C: [[0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2]] }
const DARS = {
  raqam: 14,
  nom: 'Xatoni topish',
  savol: 'Xatoni <em>qanday</em> topamiz?',
  // javon (dars bo'yicha) — 1–2-bekat to'plami; har pog'onaning o'zi — ekranlar.mjs (JAVON)
  javon: { h: ['x', 'r', 'l', 'u', 'd'], b: [['p', '2']] },
  maydon: { w: 7, h: 5 },
  masshtabMin: 0.5, // 3 · 3: go to (random bilan) keng — dastur ustuniga sig'sin (13-dars)
  bezak: { daraxt: [[1, 1], [4, 3], [6, 1]], gul: [[0, 4], [2, 3], [5, 4], [6, 3]] },
  savatlar: SAVAT14,
  dasturchalar: 'oyin', // 3 · 2: bir nechta dasturcha — faqat o'yin ekranida (7-dars)
  bittaQadam: true, // KOD 1: «Bitta qadam» — studiyada «▶ Ishga tushir» yonida
  blokChegara: 12,
  maslahatKeyin: true, // 6-dars KOD 1: «Maslahat» bir urinishdan keyin
  joyQolmadi: 'Dasturga N ta blok sig‘adi',
  gap: { qadamChiqdi: 'N-qadam: qahramon (x, y) ga chiqdi. Shu blokni va undan oldingisini o‘qing', qadamIshora: 'Bitta qadam — qahramon qayerda?' },
  // «Tuzatuvchi» yutug'i: 1–3-bekatning 1–3-pog'onalari (9 ta xatoli dastur) — bajarilganlari soni
  tuzatish: ['B1A', 'B1B', 'B1C', 'B2A', 'B2B', 'B2C', 'B3A', 'B3B', 'B3C'],

  namuna: { qahramon: ['Momiq', 'Zippi'], ism: 'Aziz' },
  qahramonli: ['BK', 'B1A', 'B1B', 'B1C', 'B1Y', 'B2A', 'B2B', 'B2C', 'B2Y', 'B3A', 'B3B', 'B3C', 'B3Y', 'B5'],
  coddyli: [],

  // pog'onalar: 1–4 to'xtagan joy (B1A…B1Y), 5–8 bitta qadam (B2A…B2Y), 9–12 yashirin xato (B3A…B3Y)
  sanoq: { P1: ['kirdi'], P2: ['javob'], P5: ['pog', 3, 0], P5G: ['pog', 7, 4], P5B: ['pog', 11, 8], P14: ['sinf'] },

  bola: { javob: 'P2N', qahramonYoq: 'BQ', yakun: 'B5', kutish: 'BK', kutishGap: 'Ustozni tinglang' },
  ochish: [],
  oqishGap: 'Dasturingizni ustozga o‘qib bering', // 16-qadam (A·1)
  kichikGap: { B0: 'Dars hozir boshlanadi', P2N: 'Javobingiz qabul qilindi', B1Y: 'Hamma pog‘onalarni bajardingiz!', B2Y: 'Hamma pog‘onalarni bajardingiz!', B3Y: 'Hamma pog‘onalarni bajardingiz!' },

  tugadi: { ustoz: ['Dars tugadi!', 'Ko‘rishguncha — keyingi darsda xakaton!'], bola: 'Dars tugadi. Ko‘rishguncha!' },

  solo: {
    yol: { 0: ['B0', 'P1'], 1: ['P2N'], 2: ['P2S'], 3: ['P2C'], 4: ['P3'], 5: ['P4'], 6: ['P6'], 7: ['B1A', 'B1B', 'B1C', 'B1Y'], 8: ['P4B'], 9: ['P7'], 10: ['B2A', 'B2B', 'B2C', 'B2Y'], 11: ['P9'], 12: ['P4C'], 13: ['P8'], 14: ['B3A', 'B3B', 'B3C', 'B3Y'], 16: ['B5'] },
    keyingi: ['B1A', 'B1B', 'B1C', 'B1Y', 'B2A', 'B2B', 'B2C', 'B2Y', 'B3A', 'B3B', 'B3C', 'B3Y'],
    gap: [],
  },

  studiya: {
    // huk: kartalar o'z dasturi bilan (data-daraxt), C — «Bitta qadam» bilan (data-qadam; dvigatel o'zi bosadi)
    P2S: { ish: 'huk', gap: { avto: true, keyingi: 'Keyingi ›', sinab: '▶ Sinab ko‘rish' } },
    P3: { ish: 'raqam' },
    P6: { ish: 'raqam' },
    B1A: { tur: 'yol', chegara: 5, bosh: { sahna: 'katak', prog: 'qoldir', pog: 1, otib: true }, maslahat: 'Yulduz qaysi tomonda? Blok qahramonni qaysi tomonga yurgizyapti?', gap: Y1 },
    B1B: { tur: 'yol', chegara: 3, bosh: { sahna: 'katak', prog: 'qoldir', pog: 2, otib: true }, maslahat: 'Qahramon yulduzdan keyin ham yurdi. Yulduzgacha nechta katak?', gap: Y1 },
    B1C: { tur: 'yol', chegara: 4, bosh: { sahna: 'katak', prog: 'qoldir', pog: 3, otib: true }, maslahat: 'Qaysi olma qoldi? go to qahramonni qayerga sakratdi?', gap: Y1 },
    B1Y: { tur: 'yol', chegara: 5, bosh: { sahna: 'katak', prog: 'qoldir', pog: 4, otib: true }, maslahat: 'Bitta xatoni tuzating va yana ishga tushiring — ikkinchisi ko‘rinadi', gap: Y1 },
    // 10-qadam: ustoz «Bitta qadam»ni ko'rsatadi; solo'da bola joy almashtirishni o'zi qiladi
    P7: { tur: 'yol', chegara: 3, bosh: { sahna: 'katak', prog: 'qoldir' }, gap: { ...Y2, qadamChiqdi: ['', 'move right va move up ni bosing — joyi almashadi'] } },
    B2A: { tur: 'yol', chegara: 6, bosh: { sahna: 'katak', prog: 'qoldir', pog: 5 }, maslahat: 'Bitta qadam bilan yuring: qaysi blokdan keyin qahramon rasmdan chiqdi?', gap: Y2 },
    B2B: { tur: 'yol', chegara: 7, bosh: { sahna: 'katak', prog: 'qoldir', pog: 6 }, maslahat: 'Qahramon qaysi qadamda rasmdan chiqdi? Rasmda o‘sha joyda qaysi tomonga yurish kerak?', gap: Y2 },
    B2C: { tur: 'yol', chegara: 7, bosh: { sahna: 'katak', prog: 'qoldir', pog: 7 }, maslahat: 'Qahramon tepaga chiqqach, qaysi tomonga yurishi kerak edi?', gap: Y2 },
    B2Y: { tur: 'yol', chegara: 9, bosh: { sahna: 'katak', prog: 'qoldir', pog: 8 }, maslahat: 'Har sakrashdan keyin qahramon kulrang katakdami?', gap: Y2 },
    // 14-qadam: savatlar (13-dars olma dasturi), tanlov oldindan — 4, 2, 7 (maydon cheti); tuzatilgach 5, 3, 6
    P8: { tur: 'yol', chegara: 2, bosh: { sahna: 'katak', olmaDastur: true, prog: 'qoldir', savat: SAVAT14.P8, savatKech: true }, tanlov: [4, 2, 7, 5, 3, 6], gap: { boshla: ['', '7 ni 6 ga o‘zgartiring'] } },
    B3A: { tur: 'yol', chegara: 6, bosh: { sahna: 'katak', prog: 'qoldir', pog: 9, egiz: true, shartGap: true }, maslahat: 'Qaysi labirintda to‘xtadi? O‘sha joyda if lar qaysi tomonni tekshiryapti?', gap: { yetdi: 'Ikkalasida yetdi!', kam: 'N-labirintda yulduzgacha yetmadi. O‘sha joyda if larni o‘qing' } },
    B3B: { tur: 'yol', chegara: 9, bosh: { sahna: 'katak', oyin: true, prog: 'qoldir', pog: 10, ikkiIshoraYoq: true, kerak: { tomon: true, gap0: 'Har strelkani bosib ko‘ring: qaysi biri boshqa tomonga yuryapti?' } }, maslahat: 'Har strelka o‘z tomoniga yuryaptimi? Dasturchalarning tugmalarini o‘qing', gap: { yetdi: 'Siz yutdingiz!', oyinIshora: 'Har strelkani bosib ko‘ring', dasturchaYoq: '↓ bosildi — uning dasturchasi yo‘q. Dasturchalarning tugmalarini o‘qing.' } },
    B3C: { tur: 'yol', chegara: 3, bosh: { sahna: 'katak', olmaDastur: true, prog: 'qoldir', pog: 11, savat: SAVAT14.B3C, savatKech: true }, maslahat: 'random qaysi sonlarni tanlay oladi? Savatlar qaysi X larda?' },
    B3Y: { tur: 'yol', chegara: 12, bosh: { sahna: 'katak', prog: 0, pog: 12, topishmoq: { w: 7, h: 5, start: [0, 0], olma: [[2, 2]], yulduz: [4, 2] } }, maslahat: 'Bitta blokni o‘zgartiring: yo‘nalishini, sonini yoki o‘rnini', gap: { yetdi: 'Topishmoq tayyor!' } },
    // 16-qadam: ustoz topishmoqni qo'yadi va «Bitta qadam» bilan topadi (15 · ★ maydoni)
    P11: { tur: 'yol', chegara: 12, bosh: { sahna: 'katak', prog: 0 }, gap: { ...Y1 } },
    B5: { ish: 'natija' },
  },
  // natija: ta xato tuzatdi — 9 ta xatoli dastur (2-dars shakli: ekranlar); marta «Bitta qadam» bosdi — 'Q' (qobiq.js bqQosh); pog‘ona bajardi — 12 pog'ona
  natija: [{ k: 'ta xato tuzatdi', ekran: ['B1A', 'B1B', 'B1C', 'B2A', 'B2B', 'B2C', 'B3A', 'B3B', 'B3C'] }, { k: 'marta «Bitta qadam» bosdi', blok: 'Q' }, { k: 'pog‘ona bajardi', ekran: ['B1A', 'B1B', 'B1C', 'B1Y', 'B2A', 'B2B', 'B2C', 'B2Y', 'B3A', 'B3B', 'B3C', 'B3Y'] }],
  gapStandart: 'Salom!',

  lms: {
    id: 'junior-014-xatoni-topish-v1', versiya: 'v1', kalit: 'jr014',
    // «Tuzatuvchi» — 9 ta xatoli dasturdan kamida 5 tasi (dasturdagi «5 ta dastur»); «Topishmoqchi» — 15 · ★
    yutuqlar: [{ t: 'tuzatdi', n: 5, nom: 'tuzatuvchi' }, { t: 'pog', n: 12, nom: 'topishmoqchi' }],
  },

  varaq: [
    '<b>Asosiy fikr:</b> xato — topiladigan narsa: ishga tushiring, qadam-baqadam yuring, tuzating, yana sinang. Hukda, xulosada (12) va yakunda chiqadi.',
    '<b>Yo‘l:</b> huk (uch usul — uch sinov) → eslaymiz: muammochalar → reja → qoida → 1-bekat «To‘xtagan joy» → 2-bekat «Bitta qadam» → 3-bekat «Yashirin xato» → topishmoqni o‘qib berish → yakun.',
    '<b>Bu — amaliyot darsi:</b> yangi blok yo‘q, siz xatoni tuzatib bermaysiz. 10- va 14-qadamda faqat usulni ko‘rsatasiz («Bitta qadam», ko‘p marta sinash) — bolalarning pog‘onalari boshqa maydonda, boshqa xato bilan.',
    '<b>Bitta qadam</b> — yangi tugma («▶ Ishga tushir» yonida): har bosish — qahramon bitta qadam; repeat sanog‘i va if tekshiruvi o‘sha bosishda ko‘rinadi. Kulrang rasmda qahramon rasmdan chiqqan qadamda dastur to‘xtaydi. «▶ Ishga tushir» — qolganini odatdagidek. 3-bekatning 1–3-pog‘onalarida tugma yo‘q.',
    '<b>Maslahat</b> bir urinishdan keyin ochiladi. Mashq paytida xatoni aytmang: «Qahramon qayerda to‘xtadi? Qayerga borishi kerak edi? Nechanchi qadamda chiqdi?» «Xato qildingiz» demang — «dasturda xato bor, uni topamiz». Muammocha chiqsa — maqtang: u iz beradi.',
    '<b>Bugungi to‘qqiz xato</b> (faqat siz uchun — bolaga turi aytilmaydi). Ko‘p bola tursa: 8 · 1 yo‘nalish — «Yulduz qaysi tomonda?» · 8 · 2 takrorlash soni — «Yulduzgacha nechta katak?» · 8 · 3 go to soni — «Eng o‘ngdagi olmaning X i nechchi?» · 11 · 1 ortiqcha move up — «Rasmda tepaga nechta katak? Dasturda nechta?» · 11 · 2 yetishmaydigan move down — javondan qo‘shilgan blok oxiriga tushishini va joy almashtirishni eslating · 11 · 3 ikki repeat tartibi — «Tepaga chiqqach — qaysi tomonga?» · 15 · 1 shart tomoni — 8-darsdagi «har qadamdan oldin tekshiradi»ni eslating · 15 · 2 hodisa tugmasi — «Har strelkani bittadan bosib ko‘ring» · 15 · 3 random sonlari — «Chap chetdagi savatning X i nechchi?» 12-qadamda bitta qiyin pog‘onani sinf bilan qadam-baqadam o‘qing (xatoni aytmang).',
    '<b>Ko‘rish ekranlarida</b> (huk, 10, 14-qadam) hamma narsa oldindan: 14-qadamda random 4, 2, 7 chiqadi (7 — maydon cheti), tuzatilgach 5, 3, 6. 16-qadamda topishmoqni siz «Bitta qadam» bilan topasiz — sinfdan so‘ramang; proyektorga ism chiqmaydi.',
  ],
}
for (const k in DARS.studiya) if (DARS.studiya[k].bosh && DARS.studiya[k].bosh.olmaDastur && DARS.studiya[k].chegara == null) DARS.studiya[k].chegara = DARS.blokChegara
