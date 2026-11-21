// 2-dars e'loni (dvigatel 5b-2, 19.11): «Labirint» — buyruqlar ketma-ketligi. Manba: new-junior/manba/002-ketma-ketlik.md (v1.1, tasdiqlangan).
// Faqat ma'lumot (satr, son, ro'yxat) — funksiya yo'q. Maydonlar ma'nosi — 1-dars e'lonida (darslar/001-tanishuv/dars.mjs) izohlangan; bu yerda faqat farqlari.
// Ekran nomlari — shu papkadagi ekranlar.mjs (E); qadamlar — qadamlar.mjs (QADAM, 0 dan).
const DARS = {
  raqam: 2,
  nom: 'Labirint', // ekranda «2-dars · Labirint» (1-dars yakunidagi va'da; «ketma-ketlik» — 5-qadamdagi yangi so'z)
  savol: 'Coddy’ni <em>labirintdan</em> qanday chiqaramiz?',
  // javonda faqat Harakat oilasi — to'rt yo'nalish (jump, say bu darsda yo'q: labirintda ma'nosiz)
  javon: { h: ['r', 'l', 'u', 'd'] },

  namuna: { qahramon: ['Momiq', 'Zippi'], ism: 'Aziz' },
  // bolaning qahramoni chiziladigan ekranlar (labirintda — o'z qahramoni; har qahramon uchun oldindan chiziladi)
  qahramonli: ['BK', 'B2', 'B2B', 'B2C', 'B2Y', 'B3A', 'B3B', 'B3C', 'B3Y', 'B4A', 'B4B', 'B4Y', 'B5'],
  // qahramoni yo'q bola 2-darsda avval BQ ekranini ko'radi (94-qaror) — shuning uchun Coddy turadigan bola ekrani yo'q
  coddyli: [],

  // ustoz ekranidagi sanoqlar. pog: [tur, «uch pog'ona» chegarasi, zinapoyaning birinchi pog'onasidan oldingi raqam] — pog'onalar butun dars bo'yi
  // ketma-ket raqamlanadi: 1–4 labirintda yuramiz (B2…B2Y), 5–8 xatoni tuzating (B3A…B3Y), 9–11 labirintdan chiqamiz (B4A…B4Y)
  sanoq: { P1: ['kirdi'], P2: ['javob'], P5: ['pog', 3, 0], P5X: ['pog', 7, 4], P5K: ['pog', 9, 8], P14: ['sinf'] },

  bola: {
    javob: 'P2N', // dastur kartasini tanlaydi
    qahramonYoq: 'BQ', // 1-darsda qahramon tanlamagan bola — avval shu ekran, tanlagach o'z joyiga
    yakun: 'B5',
    kutish: 'BK',
    kutishGap: 'Ustozni tinglang',
  },
  ochish: [],
  kichikGap: { B0: 'Dars hozir boshlanadi', P2N: 'Javobingiz qabul qilindi', B2Y: 'Hamma pog‘onalarni bajardingiz!', B3Y: 'Hamma pog‘onalarni bajardingiz!', B4Y: 'Hamma pog‘onalarni bajardingiz!' },

  tugadi: { ustoz: ['Dars tugadi!', 'Ko‘rishguncha — keyingi darsda X va Y bilan!'], bola: 'Dars tugadi. Ko‘rishguncha!' },

  // solo (manba: «Solo» bo'limi): 3-qadamda uch sinovni bola o'zi ishga tushiradi (har kartada «▶ Sinab ko‘rish»); 7, 10, 14-qadamda o'zi
  // «▶ Ishga tushir»ni bosadi (dastur tayyor) va bloklar joyini o'zi almashtiradi; 16 (o'qib berish) va 18 (sinf natijasi) — yo'q; doskalar o'rniga darhol o'z ekrani
  solo: {
    yol: { 0: ['B0', 'P1'], 1: ['P2N'], 2: ['P2S'], 3: ['P2C'], 4: ['P3'], 5: ['P4'], 6: ['P6'], 7: ['B2', 'B2B', 'B2C', 'B2Y'], 8: ['P4B'], 9: ['P7'], 10: ['B3A', 'B3B', 'B3C', 'B3Y'], 11: ['P9'], 12: ['P4C'], 13: ['P8K'], 14: ['B4A', 'B4B', 'B4Y'], 16: ['B5'] },
    keyingi: ['B2', 'B2B', 'B2C', 'B2Y', 'B3A', 'B3B', 'B3C', 'B3Y', 'B4A', 'B4B', 'B4Y'],
    gap: [],
  },

  // Blok studiya: hamma topshiriq — labirint (bosh.sahna 'katak'); tekshiruv — dastur tugaganda qahramon yulduzda (devorga urilmagan, kalit olingan)
  //   prog [jonli, solo] — ustoz ko'rsatadigan ekranda jonli darsda dastur bo'sh (ustoz o'zi tuzadi), solo'da tayyor (bola ishga tushiradi)
  //   gap.urildi / gap.yetdi — [jonli, solo] yoki bitta gap; berilmasa — dvigatelning umumiy gaplari (studiya.js, natija)
  studiya: {
    P2S: { ish: 'huk', gap: { avto: true, yetdi: '✓ chiqdi', urildi: '✕ devorga urildi', kam: '✕ yetmadi', keyingi: 'Keyingi ›', sinab: '▶ Sinab ko‘rish' } },
    P3: { ish: 'raqam' },
    P6: { tur: 'yol', bosh: { sahna: 'katak', prog: [0, 'qoldir'] } },
    P7: { tur: 'yol', bosh: { sahna: 'katak', prog: 'qoldir' }, gap: { urildi: ['Qahramon shu blokda to‘xtadi. Bu yerda qaysi tomonga yurish kerak?', '4-blokni bitta pastga ko‘chiring'] } },
    P8K: { tur: 'yol', bosh: { sahna: 'katak', prog: [0, 'qoldir'] } },
    P11: { tur: 'yol', bosh: { sahna: 'katak', prog: 0 } },
    B2: { tur: 'yol', bosh: { sahna: 'katak', prog: 0, pog: 1 }, maslahat: 'Qahramondan yulduzgacha yo‘lni barmog‘ingiz bilan yuring: qayerda buriladi?' },
    B2B: { tur: 'yol', bosh: { sahna: 'katak', prog: 0, pog: 2 }, maslahat: 'Yo‘l uch bo‘lak: har bo‘lakda nechta katak?' },
    B2C: { tur: 'yol', bosh: { sahna: 'katak', prog: 0, pog: 3 }, maslahat: 'Har burilishda yo‘nalish o‘zgaradi — burilishlarni sanang' },
    B2Y: { tur: 'yol', bosh: { sahna: 'katak', prog: 0, pog: 4 }, maslahat: 'Yo‘lni bo‘laklarga bo‘ling: har burilishgacha nechta katak?' },
    B3A: { tur: 'yol', bosh: { sahna: 'katak', prog: 'qoldir', pog: 5 }, gap: { yetdi: 'Xatoni tuzatdingiz!' }, maslahat: 'Ishga tushiring: qahramon qaysi blokda urildi? Shu blok va qo‘shnisini tekshiring' },
    B3B: { tur: 'yol', bosh: { sahna: 'katak', prog: 'qoldir', pog: 6 }, gap: { yetdi: 'Xatoni tuzatdingiz!' }, maslahat: 'Qaysi blokda urildi? Uning o‘rnida qaysi blok bo‘lishi kerak?' },
    B3C: { tur: 'yol', bosh: { sahna: 'katak', prog: 'qoldir', pog: 7 }, gap: { yetdi: 'Xatoni tuzatdingiz!' }, maslahat: 'Qahramon qayerda urildi? O‘sha joyda qaysi tomonga yurish kerak edi?' },
    B3Y: { tur: 'yol', bosh: { sahna: 'katak', prog: 'qoldir', pog: 8 }, gap: { yetdi: 'Xatoni tuzatdingiz!' }, maslahat: 'Xato ikki joyda — birinchisini tuzatib, yana ishga tushiring' },
    B4A: { tur: 'yol', bosh: { sahna: 'katak', prog: 0, pog: 9 }, gap: { yetdi: 'Labirintdan chiqdingiz!' }, maslahat: 'Avval kalitga boring, keyin eshikka — eshik kalitsiz ochilmaydi' },
    B4B: { tur: 'yol', bosh: { sahna: 'katak', prog: 0, pog: 10 }, gap: { yetdi: 'Labirintdan chiqdingiz!' }, maslahat: 'Kalit qayerda? Avval unga boring, keyin qayting' },
    B4Y: { tur: 'yol', bosh: { sahna: 'katak', prog: 0, pog: 11 }, gap: { yetdi: 'Labirintdan chiqdingiz!' }, maslahat: 'Kalitga borib qayting, keyin yulduzga — bloklar 10 tadan oshmasin' },
    B5: { ish: 'natija' },
  },
  // natija sonlari (17, 18-qadam): qadam — to'rt yo'nalish bloklari; tuzatilgan xato — 2-bekat pog'onalaridan bajarilganlari; labirint — yulduzga yetgan har labirint
  natija: [{ k: 'qadam', blok: 'rlud' }, { k: 'tuzatilgan xato', ekran: ['B3A', 'B3B', 'B3C', 'B3Y'] }, { k: 'labirint', ekran: ['B2', 'B2B', 'B2C', 'B2Y', 'B3A', 'B3B', 'B3C', 'B3Y', 'B4A', 'B4B', 'B4Y'] }],
  gapStandart: 'Salom!',

  // LMS — modul tugagach (93-qaror), hammasi bilan birga; hozir faqat e'lon. Yutuqlar: tuzatuvchi — 2-bekatning 3-pog'onasi (pog 7), labirint — 3-bekatning 1-pog'onasi (pog 9)
  lms: {
    id: 'junior-002-ketma-ketlik-v1', versiya: 'v1', kalit: 'jr002',
    yutuqlar: [{ t: 'pog', n: 7, nom: 'tuzatuvchi' }, { t: 'pog', n: 9, nom: 'labirint' }],
  },

  varaq: [
    '<b>Asosiy fikr:</b> bloklar bir xil bo‘lsa ham, tartib hal qiladi. Hukda, xatoni topishda va kalitda — uch marta, uch xil ko‘rinishda chiqadi.',
    '<b>Yo‘l:</b> huk (savol va uch sinov) → yangi so‘z «ketma-ketlik» → reja → 1-bekat «Labirintda yuramiz» → 2-bekat «Xatoni topamiz» → 3-bekat «Labirintdan chiqamiz» → o‘qib berish → yakun.',
    '<b>Yangi bloklar:</b> move up — tepaga yur, move down — pastga yur. Ikkalasi ham ko‘k — harakat. Birinchi chiqqanda bir marta ayting. Darsda savol bitta — boshidagi huk; qolgan joyda avval ko‘rsating, keyin bolalar o‘zi bajaradi.',
    '<b>Demoda:</b> hukdagi raqamlar haqiqiy (kirdi, javob berdi). Doskalardagi raqamlar — bolalar bajargani bo‘yicha. Blokni ko‘chirish: dasturdagi blokni bosing (tanlanadi), keyin boshqasini — ikkalasining joyi almashadi; ✕ — olib tashlaydi; sudrasa ham bo‘ladi.',
  ],
}
