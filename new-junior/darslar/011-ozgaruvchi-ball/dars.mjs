// 11-dars e'loni (21.11): «O‘zgaruvchi: ball». Manba: new-junior/manba/011-ozgaruvchi-ball.md (v1, tavsiya bo'yicha qurildi — «Savollar» 1–11 hammasi A).
// Faqat ma'lumot. Sahna — 4-darsdagi bog' maydoni (devorsiz, X va Y), o'yin — 4-darsdagi (bosh.oyin), lekin boshqaruv tayyor (.bq-q qatori) va ballni bolaning
// dasturi sanaydi: bosh.ball — studiya.js «11-dars» bo'limi (when touching apple / gold apple, when ▶ clicked, set, change; sahnadagi «ball: N»).
const DARS = {
  raqam: 11,
  nom: 'O‘zgaruvchi: ball',
  savol: 'Ballni <em>qanday</em> sanaymiz?',
  // javon: Hodisa (olmaga tekkanda, «▶ Boshlash» bosilganda) va yangi O'zgaruvchi oilasi (change, set). Harakat javonda yo'q — boshqaruv tayyor
  javon: { e: [['q', 'apple'], 'f'], o: [['c', '1'], ['z', '0']] },
  ikonOila: { b: ['p'] }, // 3-bekatdagi tayyor dasturda repeat bor (javonda yo'q) — belgisi uchun
  ozgaruvchi: ['ball'], // bola yangi o'zgaruvchi yaratmaydi («Savollar» 4)
  maydon: { w: 7, h: 5 },
  dasturchalar: true,
  dasturchaBlok: true, // tasma yonida «N ta dasturcha» va «n / 12 ta blok» (boshqaruv qatori sanoqqa kirmaydi)
  blokChegara: 12,
  joyQolmadi: 'Dasturga N ta blok sig‘adi',

  namuna: { qahramon: ['Momiq', 'Zippi'], ism: 'Aziz' },
  qahramonli: ['BK', 'B1A', 'B1B', 'B1C', 'B1Y', 'B2A', 'B2B', 'B2C', 'B2Y', 'B3A', 'B3B', 'B3C', 'B3Y', 'B5'],
  coddyli: [],

  // pog'onalar: 1–4 ball (B1A…B1Y), 5–8 noldan (B2A…B2Y), 9–12 oldindan aytish (B3A…B3Y)
  sanoq: { P1: ['kirdi'], P2: ['javob'], P5: ['pog', 3, 0], P5G: ['pog', 7, 4], P5B: ['pog', 11, 8], P14: ['sinf'] },

  bola: { javob: 'P2N', qahramonYoq: 'BQ', yakun: 'B5', kutish: 'BK', kutishGap: 'Ustozni tinglang' },
  ochish: [],
  oqishGap: 'Dasturingizni ustozga o‘qib bering', // 16-qadam (A·1)
  kichikGap: { B0: 'Dars hozir boshlanadi', P2N: 'Javobingiz qabul qilindi', B1Y: 'Hamma pog‘onalarni bajardingiz!', B2Y: 'Hamma pog‘onalarni bajardingiz!', B3Y: 'Hamma pog‘onalarni bajardingiz!' },

  tugadi: { ustoz: ['Dars tugadi!', 'Ko‘rishguncha — keyingi darsda jon bilan!'], bola: 'Dars tugadi. Ko‘rishguncha!' },

  solo: {
    yol: { 0: ['B0', 'P1'], 1: ['P2N'], 2: ['P2S'], 3: ['P2C'], 4: ['P3'], 5: ['P4'], 6: ['P6'], 7: ['B1A', 'B1B', 'B1C', 'B1Y'], 8: ['P4B'], 9: ['P7'], 10: ['B2A', 'B2B', 'B2C', 'B2Y'], 11: ['P9'], 12: ['P4C'], 13: ['P8'], 14: ['B3A', 'B3B', 'B3C', 'B3Y'], 16: ['B5'] },
    keyingi: ['B1A', 'B1B', 'B1C', 'B1Y', 'B2A', 'B2B', 'B2C', 'B2Y', 'B3A', 'B3B', 'B3C', 'B3Y'],
    gap: [],
  },

  // huk (2–4-qadam) — dasturi ko'rinmaydigan o'yinlar: to'rt strelka va olmaga tekkanda ('apple'); t: blok turi, m: gap matni yoki son
  oyinlar: {
    hukA: [['right', [{ t: 'r' }]], ['left', [{ t: 'l' }]], ['up', [{ t: 'u' }]], ['down', [{ t: 'd' }]], ['apple', [{ t: 's', m: '1' }]]],
    hukB: [['right', [{ t: 'r' }]], ['left', [{ t: 'l' }]], ['up', [{ t: 'u' }]], ['down', [{ t: 'd' }]], ['apple', [{ t: 's', m: '1' }, { t: 's', m: '2' }, { t: 's', m: '3' }]]],
    hukC: [['right', [{ t: 'r' }]], ['left', [{ t: 'l' }]], ['up', [{ t: 'u' }]], ['down', [{ t: 'd' }]], ['apple', [{ t: 'c', m: '1' }]]],
  },

  // bosh.ball — o'yin, ball sanaladi; kerak — yutganda ball shu bo'lsin; v — pog'ona ochilgandagi son (bo'lmasa 0); saqla — «▶ Boshlash» qayta bosilganda ball
  // o'zgarmaydi (1-bekatda yo'q: set bloki hali o'rgatilmagan — «Qurishdagi qarorlar» 2); erkin — ★ «O‘z o‘yiningiz»; olmaIz — «Olma 3 ta — ball 6»;
  // soloSet — solo'da ikkinchi o'yindan keyin set o'zi qo'shiladi (10-qadam). ochiq — javonda nechta blok ochiq (oila bo'yicha). sonBashorat — oldindan aytish
  studiya: {
    P2S: { ish: 'huk', gap: { avto: true, keyingi: 'Keyingi ›', sinab: '▶ Sinab ko‘rish' } },
    P3: { ish: 'raqam' },
    P6: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, ball: true, prog: [0, 'qoldir'] }, ochiq: { e: 1, o: 1 }, gap: { yetdi: 'Siz yutdingiz!' } },
    B1A: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, ball: true, prog: 0, pog: 1, kerak: 3 }, ochiq: { e: 1, o: 1 }, gap: { yetdi: 'Siz yutdingiz!' }, maslahat: 'Qaysi hodisa bloki olmaga tekkanda ishlaydi?' },
    B1B: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, ball: true, prog: 'oldingi', pog: 2, kerak: 8 }, ochiq: { e: 1, o: 1 }, gap: { yetdi: 'Siz yutdingiz!' }, maslahat: 'change blokidagi son — har olmada qancha qo‘shilishi' },
    B1C: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, ball: true, prog: 'oldingi', pog: 3, kerak: 7 }, ochiq: { e: 1, o: 1 }, gap: { yetdi: 'Siz yutdingiz!' }, maslahat: 'Oltin olmaga o‘z dasturchasi kerak: hodisa blokida olma turini tanlang' },
    B1Y: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, ball: true, prog: 'oldingi', pog: 4, kerak: 18 }, ochiq: { e: 1, o: 1 }, gap: { yetdi: 'Siz yutdingiz!' }, maslahat: 'Ikkala dasturchadagi sonni tekshiring' },
    P7: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, ball: true, prog: 'qoldir', saqla: true, olmaIz: true, soloSet: true }, gap: { yetdi: 'Siz yutdingiz!', boshla: ['', 'Ikki marta o‘ynang: ball qanday bo‘ladi?'] } },
    B2A: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, ball: true, prog: 'oldingi', pog: 5, kerak: 4, v: 5, saqla: true }, gap: { yetdi: 'Siz yutdingiz!' }, maslahat: 'O‘yin boshlanganda qaysi hodisa bloki ishlaydi?' },
    B2B: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, ball: true, prog: 'oldingi', pog: 6, kerak: 13, v: 5, saqla: true }, gap: { yetdi: 'Siz yutdingiz!' }, maslahat: 'set blokidagi son — o‘yin boshidagi ball' },
    B2C: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, ball: true, prog: 'oldingi', pog: 7, kerak: 11, v: 5, saqla: true }, gap: { yetdi: 'Siz yutdingiz!' }, maslahat: 'Uchta son bor: o‘yin boshi, olma, oltin olma — har birini tekshiring' },
    B2Y: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, ball: true, prog: 'oldingi', pog: 8, erkin: true, v: 5, saqla: true }, gap: { yetdi: 'O‘yiningiz tayyor!' }, maslahat: 'set va change bloklaridagi sonlarni o‘zingiz tanlang — keyin o‘ynab ko‘ring' },
    P8: { tur: 'yol', bosh: { sonBashorat: true }, oqiydi: true, gap: { yetdi: 'Oldindan aytdingiz!', boshla: ['', '5 kartasini bosing, keyin «Tekshirish»'] } },
    B3A: { tur: 'yol', bosh: { sonBashorat: true, pog: 9 }, gap: { yetdi: 'Oldindan aytdingiz!' }, maslahat: 'set — boshlanish soni. Keyin har change ni qo‘shib boring' },
    B3B: { tur: 'yol', bosh: { sonBashorat: true, pog: 10 }, gap: { yetdi: 'Oldindan aytdingiz!' }, maslahat: 'repeat ichidagi blok necha marta bajariladi?' },
    B3C: { tur: 'yol', bosh: { sonBashorat: true, pog: 11 }, gap: { yetdi: 'Oldindan aytdingiz!' }, maslahat: 'Dasturda ikkita set bor. set nima qilishini eslang' },
    B3Y: { tur: 'yol', bosh: { sonBashorat: true, pog: 12 }, gap: { yetdi: 'Oldindan aytdingiz!' }, maslahat: 'Har safar repeat ichidagi ikkala blok ham bajariladi' },
    P11: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, ball: true, prog: 0, saqla: true }, gap: { yetdi: 'Siz yutdingiz!' } },
    B5: { ish: 'natija' },
  },
  // natija: ta olma terdi — yutilgan o'yinlardagi olmalar; eng katta ball — yutilgan o'yinlardagi eng katta ball (yig'indi emas); marta oldindan aytdi — birinchi urinishda
  natija: [{ k: 'ta olma terdi', blok: 'o' }, { k: 'eng katta ball', eng: 'B' }, { k: 'marta oldindan aytdi', blok: 'A' }],
  gapStandart: 'Salom!',

  lms: {
    id: 'junior-011-ozgaruvchi-ball-v1', versiya: 'v1', kalit: 'jr011',
    // «Hisobchi» — 1-pog'ona (birinchi ball); «Oldindan bildi» — 3-bekat 3-pog'onasi (ikki set) birinchi urinishda (studiya.js: bildir t 'bildi')
    yutuqlar: [{ t: 'pog', n: 1, nom: 'hisobchi' }, { t: 'bildi', n: 11, nom: 'bildi' }],
  },

  varaq: [
    '<b>Asosiy fikr:</b> kompyuter sonni eslab qoladi — o‘zgaruvchida. change — songa qo‘shadi, set — sonni qo‘yadi. Hukda, 10-qadamda («ball 6») va 3-bekatda chiqadi.',
    '<b>Yo‘l:</b> huk (ballni qanday sanaymiz — uch sinov) → yangi so‘z «o‘zgaruvchi» → reja → 1-bekat «Ball» → 2-bekat «Noldan» → 3-bekat «Oldindan aytamiz» → o‘qib berish → yakun.',
    '<b>Yangi oila — O‘zgaruvchi (jigarrang):</b> change ball by 1 — ballga 1 qo‘sh; set ball to 0 — ballni 0 qil. Hodisada ikki yangi blok: when touching apple — olmaga tekkanda (olma turi tanlanadi: olma yoki oltin olma); when ▶ clicked — «▶ Boshlash» bosilganda. Sonni bosib tanlashni sekin ko‘rsating.',
    '<b>Boshqaruv tayyor:</b> to‘rt strelka — dastur tepasidagi «Boshqaruv» qatori (bosilsa ochiladi). 4-darsda olma hisobini o‘yin o‘zi ko‘rsatardi — bu darsda yo‘q: «Bugun o‘yinni o‘zimiz tuzamiz — ballni ham o‘zimiz sanaymiz». Bola «avval o‘zi sanardi-ku» desa — shu gapni ayting.',
    '<b>Belgilar (pog‘onalar javobi):</b> ▶[0] — when ▶ clicked ostida set ball to 0 · O[+1] — when touching apple ostida change ball by 1 · OO[+5] — when touching gold apple ostida change ball by 5 · R3[+2] — repeat 3 ichida change ball by 2. 1-bekat: O[+1] · O[+2] · O[+1] OO[+5] · O[+2] OO[+10]. 2-bekat: ▶[0] O[+1] · ▶[10] O[+1] · ▶[3] O[+2] OO[+4]. 3-bekat javoblari: 9 · 6 · 2 · 14.',
    '<b>Ball saqlanadi:</b> 2-bekat pog‘onalari «ball: 5» bilan ochiladi — bu ataylab: set bo‘lmasa, o‘yin eski sondan boshlanadi. 1-bekatda set bloki hali yo‘q — u yerda har o‘yin pog‘ona sonidan boshlanadi. 3-bekatda dastur tayyor: bola son kartasini tanlaydi va o‘zi tekshiradi (natijada faqat birinchi urinish sanaladi). 16-qadamda proyektorga ism chiqmaydi.',
  ],
}
// har o'yin ekranining chegarasi 12 (manba «Bloklar»): to'lsa Ortiqvoy «Joy qolmadi!»
for (const k in DARS.studiya) if (DARS.studiya[k].bosh && DARS.studiya[k].bosh.ball) DARS.studiya[k].chegara = DARS.blokChegara
