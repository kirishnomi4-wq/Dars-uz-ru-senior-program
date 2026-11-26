// 15-dars e'loni (21.11): «Xakaton №1». Manba: new-junior/manba/015-xakaton-1.md (v1.1 — foydalanuvchi «Savollar» 1–18 hammasi A; audit filtri — «Qurishdagi qarorlar» 1–30).
// Faqat ma'lumot. Xakaton: yangi blok yo'q; juftlik bitta o'yin noutbukida ikki o'yindan birini («Olma terish» — 4, 7, 11, 12-dars; «Labirint» — 9–10-dars) tanlaydi
// va unga qismlarni navbat bilan qo'shadi (DARS.xakaton; studiya.js «15-dars» bo'limi). Ikkinchi noutbuk — «Juftlikdasiz» (qobiq.js juftlik, QADAM[i][4]).
// Rejasi: new-junior/arxiv/seans-2111/015-qurish-reja.md
const DARS = {
  raqam: 15,
  nom: 'Xakaton №1',
  savol: 'Bitta o‘yinni <em>qanday</em> yasaymiz?',
  // javon (dars bo'yicha, 13-qadam namoyishi) — studiya ekranlarining o'zi ekranlar.mjs da (JAVON: olma, lab)
  javon: { e: [['k', 'right'], 'f', ['q', 'apple'], ['k', 'any'], 'g'], h: ['r', 'l', 'u', 'd'], a: [['i', 'jon:0']], o: [['z', '0'], ['c', '1']], v: [['v', 'xursand']], t: [['n', 'jiring']] },
  ikonOila: { b: ['p'] },
  ozgaruvchi: ['ball', 'jon', 'qadam'],
  changeSonlar: [-3, -2, -1, 1, 2, 3, 4, 5, 10],
  kaktus: true, tugmaAny: true,
  dasturJson: true,
  maydon: { w: 7, h: 5 },
  bezak: { daraxt: [[1, 1], [4, 3], [6, 1]], gul: [[0, 4], [2, 3], [5, 4], [6, 3]] },
  dasturchalar: true,
  dasturchaBlok: true,
  dasturchaUstun: 2,
  masshtabMin: 0.5, // 25.11 (K7): olti dasturchali dastur ikki ustunda sig'sin (blockly.js blMasshtab)
  blokChegara: 30,
  maslahatKeyin: true, // «Maslahat» bir urinishdan keyin (o'yinni boshlash ham urinish); qulf har qismda yangidan
  joyQolmadi: 'Dasturga N ta blok sig‘adi',
  oltinGap: 'Oltin olmaga o‘z dasturchasi kerak — hodisa blokida turini tanlang',
  labirintlar: {
    D1: '##...#*|#K#.##.|#.#..E.|#.#.###|S...###', // 9–10-dars 1-darajasi
    BOSH: '......*|.......|.......|.......|S......', // 2-daraja yasash boshi (10-dars)
  },

  // xakaton (manba «Maydon, o'yinlar va qismlar» jadvali): qism — nom, karta (xaritachi o'qiydi), hajm belgisi, maslahat, oila (maslahat rangi),
  // tayyor — «Qism tayyor» sharti (statik; studiya.js xkTayyor), sina — sinash bandi (3-bekat; studiya.js xkSina), ozi — bog'liq qism, yasash — labirint yasash qismi
  xakaton: {
    olma: {
      nom: 'Olma terish', kamQadam: 17, bosh: 'Avval 1-qismni yasang: «To‘rt strelka»', // eng qisqa yo'l 16 bosish — 16-bosishda qadam 0 bo'lsa, o'yin yulduzdan oldin tugaydi
      qism: [
        { id: 'strelka', nom: 'To‘rt strelka', karta: 'Har strelka qahramonni o‘z tomoniga yurgizsin', hajm: '8 ta blok', oila: 'e', maslahat: '4-dars. Qaysi strelkaning dasturchasi hali yo‘q?', tayyor: { tort: true }, sina: ['tomon', 'Har strelka o‘z tomoniga'], birinchi: true },
        { id: 'ball', nom: 'Ball', karta: 'Olma terilsa — ballga 1. O‘yin noldan boshlansin', hajm: '4 ta blok', oila: 'o', maslahat: '11-dars. Olma terilganda qaysi hodisa ishlaydi? Ball qayerda noldan boshlanadi?', tayyor: { set: 'ball', hodisa: 'apple', change: 'ball' }, sina: ['ball0', 'Ikki marta o‘ynadik — ball noldan boshlandi'] },
        { id: 'jon', nom: 'Jon', karta: 'Kaktusga tegsa — jon kamaysin. Jon 0 — o‘yin tugaydi.', hajm: '6 ta blok', oila: 'a', maslahat: '12-dars. Kaktusga tegilganda qaysi hodisa ishlaydi? O‘yin qachon tugashi kerak?', tayyor: { set: 'jon', hodisa: 'cactus', change: 'jon', qoida: 'jon' }, sina: ['nol:jon', 'Jon 0 da tugaydi'], royxat: 'Ro‘yxatda: Jon — o‘yin jon 0 bo‘lganda tugashi kerak' },
        { id: 'qadam', nom: 'Qadam', karta: 'Har bosishda qadam kamaysin. Qadam 0 — o‘yin tugaydi. Qadam yulduzgacha yetsin.', hajm: '6 ta blok', oila: 'a', maslahat: '12-dars. Har bosishda qaysi hodisa ishlaydi? Qadam nechtadan boshlansa, yulduzgacha yetadi?', tayyor: { set: 'qadam', hodisa: 'any', change: 'qadam', qoida: 'qadam', yetsin: true }, sina: ['nol:qadam', 'Qadam 0 da tugaydi'], royxat: 'Ro‘yxatda: Qadam — o‘yin qadam 0 bo‘lganda tugashi kerak' },
        { id: 'quvonch', nom: 'Quvonch', karta: 'Olma terilsa — qahramon xursand, tovush chalinsin', hajm: '3 ta blok', oila: 'v', maslahat: '7-dars. Olma terilganda qaysi hodisa ishlaydi? Qahramon qanday ko‘rinsin?', tayyor: { hodisa: 'apple', kostyum: 'xursand', tovush: true }, sina: ['quvonch', 'Olma terilganda — xursand va ♪'] },
        { id: 'oltin', nom: 'Oltin olma', karta: 'Oltin olma — 10 ball', hajm: '2 ta blok', oila: 'o', maslahat: '11-dars. Oltin olma terilganda ball nechtaga ko‘paysin?', tayyor: { oltin: 10 }, yulduz: true, ozi: 'ball', bilan: 'Ball bilan' },
      ],
    },
    lab: {
      nom: 'Labirint', bosh: 'Avval 1-qismni yasang: «Strelka va qoida»',
      qism: [
        { id: 'qoida', nom: 'Strelka va qoida', karta: 'Har strelka yurishdan oldin tekshirsin', hajm: '12 ta blok', oila: 'a', maslahat: '9-dars. Strelka yurishdan oldin nimani tekshirsin?', tayyor: { qoida: true }, sina: ['yoq', 'Devor tomonga bosildi — urilmadi'], birinchi: true },
        { id: 'daraja2', nom: '2-daraja', karta: '2-daraja bo‘lsin: labirintni o‘zingiz yasang, kamida 6 ta devor', hajm: '6 ta devor', oila: 'h', maslahat: '10-dars. Devorlar yulduzga yo‘lni to‘smayaptimi?', yasash: { devor: 6 }, sina: ['ikki', 'Ikki daraja yutildi'] },
        { id: 'kalit', nom: 'Kalit va eshik', karta: 'Eshik yo‘lni to‘ssin, kalit eshikdan oldin bo‘lsin.', hajm: '2 ta asbob', oila: 'h', maslahat: '10-dars. Yulduzga qaysi katakdan kiriladi? Kalitga eshikdan o‘tmay yetsa bo‘ladimi?', yasash: { eshik: true }, sina: ['eshik', 'Kalitsiz eshik ochilmadi'], ozi: 'daraja2', bilan: '2-daraja bilan' },
        { id: 'tovush', nom: 'Qadam tovushi', karta: 'Qahramon yurganda tovush chalinsin — turganda jim.', hajm: '1 ta blok', oila: 't', maslahat: '9-dars. Qahramon qachon yuradi? Tovush qachon chalinsin?', tayyor: { tovushIf: true }, sina: ['tovush', 'Yurganda ♪, turganda jim'] },
        { id: 'start', nom: 'Startga qaytish', karta: 'Bitta tugma qahramonni startga qaytarsin.', hajm: '2 ta blok', oila: 'h', maslahat: '9-dars. Qaysi tugma hali bo‘sh? U bosilganda qahramon qayerga borsin?', tayyor: { startga: true }, sina: ['start', 'Tugma bosildi — qahramon startda'] },
        { id: 'uzun', nom: 'Uzun daraja', karta: 'Yo‘l kamida 20 qadam bo‘lsin.', hajm: '20 qadam', oila: 'h', maslahat: '10-dars. Kalit va yulduz bir-biridan uzoqroq bo‘lsa — yo‘l uzayadi.', yasash: { yol: 20 }, yulduz: true, ozi: 'daraja2', bilan: '2-daraja bilan' },
      ],
    },
    yutdi: ['yutdi', 'O‘yin yutildi'], // hamma o'yin uchun — sinash ro'yxatining oxirgi bandi
    // ekran gaplari (xakaton.js XG; N — son yoki nom)
    gap: {
      karta: 'Xaritachi kartani o‘qisin', sinang: 'Hamma holatni sinang', soloDost: 'Kimgadir o‘ynating — uydagilardan biri o‘ynasa bo‘ladi',
      tag: 'Xakaton', qismTag: 'Xakaton · N-qism', yulduzTag: 'Xakaton · ★ qo‘shimcha', tayyor: 'O‘yiningiz tayyor!', tayyorSar: 'O‘yiningiz <em>tayyor</em>!',
      qismTayyor: 'Qism tayyor!', almash: 'Almashing: sichqoncha — do‘stingizga', almash3: 'Almashing: sichqoncha — navbatdagi do‘stingizga', almashdik: 'Almashdik',
      vaqt: 'Vaqt qolsa — qo‘shimcha qism', haydovchi: 'Haydovchi', xaritachi: 'Xaritachi', tugamagan: 'tugamagan', dostlar: 'Do‘stlar o‘ynadi', royxat: 'O‘yiningizda:',
      qadamKam: 'Qadam yetmaydi — yulduzgacha yetib bo‘lmaydi', tugQism: 'Tugamagan qism: N. Tugating yoki olib tashlang — o‘yin ishlasin',
      sinaldi: 'O‘yiningiz sinaldi!', dostKut: 'Endi do‘stlar o‘ynashini kuting', dostTugma: '▶ Do‘stingiz o‘ynaydi',
      yoqdi: 'Sizga yoqdi:', yoqdiK: [['qiziq', 'Qiziq'], ['chiroyli', 'Chiroyli'], ['quvnoq', 'Quvnoq'], ['yana', 'Yana o‘ynayman']], tayyorT: 'Tayyor',
      dost1: 'Do‘stlaringiz o‘ynadi: ', dostN: 'Do‘stlaringiz N marta o‘ynadi: ', yutdi: 'yutdi', yutdiN: 'N marta yutdi', yetmadi: 'yulduzgacha yetmadi',
      teg: 'N marta kaktusga tegdi', devor: 'N marta devor oldida to‘xtadi', belgi: 'Yoqdi: ', joy: 'Joyingizga qayting',
      tanlaO: 'Avval o‘yinni tanlang', yurmaydi: 'Bu qismsiz o‘yin yurmaydi', vaqtQ: 'Vaqt qolsa', tanladik: 'Tanladik', tayyormiz: 'Tayyormiz', birinchi: 'Birinchi haydovchi sichqonchani olsin.',
      natijaYoq: 'Bugun juftlikda o‘yin <em>yasadingiz</em>!',
    },
  },

  namuna: { qahramon: ['Momiq', 'Zippi'], ism: 'Aziz' },
  qahramonli: ['BK', 'BJD', 'BT', 'BXO', 'BXL', 'BSO', 'BSL', 'BDO', 'BDL', 'B5'],
  coddyli: [],

  // doskalar — juftlik bo'yicha (o'yin noutbuklari; maxraj — noutbuklar / 2): pog'onalar 1 juftlik · 2 tanladi · 3–5 qism tayyor · 6 ★ · 7 ro'yxat to'liq · 8 do'stlar o'ynadi
  sanoq: { P1: ['kirdi'], P2: ['javob'], P5: ['juft', 1, 0, '', 'Juftlik bo‘ldi'], P5T: ['juft', 2], P5Y: ['juft', 5, 1, 'hozir'], P5S: ['juft', 7], P5D: ['juft', 8, 0, '', 'O‘ynab ko‘rildi'], P14: ['sinf'] },

  bola: { javob: 'P2N', qahramonYoq: 'BQ', yakun: 'B5', kutish: 'BK', kutishGap: 'Ustozni tinglang' },
  ochish: [],
  kichikGap: { B0: 'Dars hozir boshlanadi', P2N: 'Javobingiz qabul qilindi', BT: 'Ustoz yasashni ochadi' },
  // o'yin turi bo'yicha ekran (qobiq.js bolaId): BX → BXO («Olma terish») yoki BXL («Labirint»)
  ekranTanlov: { BX: ['BXO', 'BXL'], BS: ['BSO', 'BSL'], BD: ['BDO', 'BDL'] },

  tugadi: { ustoz: ['Dars tugadi!', 'Ko‘rishguncha — keyingi darsda klonlar bilan!'], bola: 'Dars tugadi. Ko‘rishguncha!' },

  solo: {
    yol: { 0: ['B0', 'P1'], 1: ['P2N'], 2: ['P2S'], 3: ['P2C'], 4: ['P3'], 5: ['P4'], 6: ['P6'], 8: ['BT'], 9: ['P4B'], 10: ['BX'], 11: ['P4C'], 12: ['P8'], 13: ['BS'], 14: ['BD'], 16: ['B5'] },
    keyingi: ['BXO', 'BXL', 'BSO', 'BSL', 'BDO', 'BDL'],
    // solo'da bola bir o'zi: natijada «Ikkalangiz» o'rniga «Siz» (manba qarori 36)
    gap: [['Ikkalangiz bugun:', 'Siz bugun:'], ['Do‘stim bilan birga yasadik!', 'O‘yinni o‘zim yasadim!'], ['<small class="solo-iz" hidden>', '<small class="solo-iz">']],
  },

  // huk (2–4-qadam): A — ikki bir xil dasturcha (→ ikki marta, ↑ — yo'q), B — ikki yarim o'yin (ketma-ket: strelkalar ballsiz · ball strelkasiz),
  // C — bitta to'liq o'yin (to'rt strelka va ball) — studiya.js hukAvto (data-dastur, data-avto; ',' — ketma-ket ikki o'yin)
  oyinlar: {
    hukA: [['right', [{ t: 'r' }]], ['right', [{ t: 'r' }]]],
    hukB1: [['right', [{ t: 'r' }]], ['left', [{ t: 'l' }]], ['up', [{ t: 'u' }]], ['down', [{ t: 'd' }]]],
    hukB2: [['apple', [{ t: 'c', m: 'ball:1' }]]],
    hukC: [['right', [{ t: 'r' }]], ['left', [{ t: 'l' }]], ['up', [{ t: 'u' }]], ['down', [{ t: 'd' }]], ['apple', [{ t: 'c', m: 'ball:1' }]]],
  },

  studiya: {
    P2S: { ish: 'huk', gap: { avto: true, keyingi: 'Keyingi ›', sinab: '▶ Sinab ko‘rish' } },
    P3: { ish: 'raqam' },
    P6: { ish: 'raqam' },
    BJ: { ish: 'juftlik' },
    BJQ: { ish: 'juftQah' },
    BT: { ish: 'xkTanlov' },
    P11: { ish: 'xkKorsat' },
    // 2-bekat (yasash) va 3-bekat (sinash) — bitta o'yin, bitta holat; BD — do'stlar o'ynaydi (dastur va javon yopiq)
    BXO: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, ball: true, xk: 'olma', bosqich: 'yasash', prog: 'xk' } },
    BXL: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, labirint: true, xk: 'lab', bosqich: 'yasash', prog: 'xk', shartGap: true } },
    BSO: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, ball: true, xk: 'olma', bosqich: 'sinash', prog: 'xk' } },
    BSL: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, labirint: true, xk: 'lab', bosqich: 'sinash', prog: 'xk', shartGap: true } },
    BDO: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, ball: true, xk: 'olma', bosqich: 'dost', prog: 'xk' } },
    BDL: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, labirint: true, xk: 'lab', bosqich: 'dost', prog: 'xk' } },
    // 13-qadam: ustoz namoyishi — to'rt strelka va jon (change jon by −2 — xato); solo'da bola o'zi tuzatadi
    P8: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, ball: true, xk: 'olma', bosqich: 'namoyish', prog: 'qoldir', namoyish: ['strelka', 'jon'] }, gap: { boshla: ['', 'Kaktusga ataylab tegib ko‘ring — jon 0 da tugaydimi?'] } },
    B5: { ish: 'natija' },
  },
  // natija: ta qism yasadingiz · ikkalangiz ham haydadingiz · do'stlar o'ynadi (studiya.js xkNatija; sinf — ustozdagi xk xabarlaridan)
  natija: [{ k: 'ta o‘yin yasaldi', blok: 'W' }, { k: 'ta qism', blok: 'Q' }, { k: 'marta o‘ynab ko‘rildi', blok: 'D' }],
  gapStandart: 'Salom!',

  lms: {
    id: 'junior-015-xakaton-1-v1', versiya: 'v1', kalit: 'jr015',
    // «Xakatonchi» — o'yin ishlaydi (1-qism tayyor) va do'stlar o'ynadi; «Ikki haydovchi» — ikkalasi ham kamida bitta qism yasadi (manba «Savollar» 16)
    yutuqlar: [{ t: 'xk', k: 'xakatonchi', nom: 'xakatonchi' }, { t: 'xk', k: 'ikki', nom: 'ikki_haydovchi' }],
  },

  varaq: [
    '<b>Asosiy fikr:</b> ishni bo‘lamiz, navbat bilan; avval o‘yin ishlasin — keyin qo‘shamiz. Hukda, javobda, 10-qadamda va yakunda chiqadi.',
    '<b>Bu — xakaton:</b> yangi blok yo‘q, siz o‘yin yasab bermaysiz. Ko‘rsatuv bitta — 13-qadam (sinash). Qolgan vaqt juftliklar ishlaydi, siz aylanasiz.',
    '<b>Juftliklarni oldindan tuzing:</b> yoningizdagi do‘st asosida, lekin kuchi juda farq qiladigan ikki bolani birga qo‘ymang. Toq bo‘lsa — bitta uchtalik. Ism proyektorga chiqmaydi — juftlarni og‘zaki ayting.',
    '<b>Vaqt ekranda yo‘q</b> — bekatni siz «Keyingi» bilan almashtirasiz. Mo‘ljal: 47-daqiqada «Yasaymiz» tugaydi, 58:30 da sinash ro‘yxati tugaydi. 11-qadam o‘rtasida bir marta: «Yarmidan o‘tdik. 1-qism tayyor bo‘lmasa — hozir faqat shuni tugating. Tayyor bo‘lsa — keyingisi.»',
    '<b>Aylanganda — rolga qarang, dasturga emas:</b> «Kim haydovchi? Xaritachi, kartada nima deyilgan?». Xaritachi sichqonchaga tegmaydi. Yechimni aytmang — qaysi darsda o‘tilganini ayting: to‘rt strelka — 4-dars; qoida, qadam tovushi, startga qaytish — 9-dars; 2-daraja, kalit va eshik, uzun daraja — 10-dars; ball, oltin olma — 11-dars; jon, qadam — 12-dars; kostyum va tovush — 7-dars.',
    '<b>«Sizga yoqdi:»</b> da yomon belgi yo‘q — har o‘yin kamida bitta «yoqdi» oladi. «Eng yaxshi o‘yin», «kim yutdi» demang; o‘yinlarni solishtirmang.',
  ],
}
