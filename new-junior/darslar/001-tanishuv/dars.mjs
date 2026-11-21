// 1-dars e'loni (dvigatel 3-bosqich, 19.11): dvigatel «qanday ishlaydi»ni biladi, «qaysi darsda nima» — shu yerda.
// Faqat ma'lumot (satr, son, ro'yxat) — funksiya yo'q: demo uni demo.html ga JSON bo'lib yozadi, LMS brauzerga D.DARS bo'lib beradi.
// yigish.mjs ulaydi: bosh.mjs → SHU FAYL → qismlar.mjs → ekranlar.mjs → qadamlar.mjs → malumot.mjs. Ekran nomlari (P… — proyektor, B… — bola noutbuki)
// darslar/001-tanishuv/ekranlar.mjs dagi E bilan bir xil; qadamlar — qadamlar.mjs dagi QADAM tartibida (0 dan).
const DARS = {
  raqam: 1,
  nom: 'Tanishuv', // ekran sarlavhasi, eshik va ustoz varag'ida: «1-dars · Tanishuv»
  demoFayl: 'demo.html', // demo sahifasi (5b-1; boshqa darslar — demo-002.html kabi)
  savol: 'Coddy’ni <em>yulduzga</em> qanday olib boramiz?', // huk savoli (savol shabloni QAYSI — dvigatel/qismlar.mjs)

  // 3c: ekranlardagi namuna nomlar — bolaning o'zinikiga almashadi (qobiq.js, ekran()): qahramon nomi (bola o'z ismini bersa) va bolaning ismi.
  // Almashtirish ekran HTML'i bo'yicha — qahramon rasmining yozuvi (aria-label) ham almashadi. Haqiqiy {qahramon} o'rinlari — keyin, chizma bilan birga.
  namuna: { qahramon: ['Momiq', 'Zippi'], ism: 'Aziz' },
  // bolaning qahramoni chiziladigan ekranlar (har qahramon uchun oldindan chiziladi — malumot.mjs, EKRANLAR_Q)
  qahramonli: ['BK', 'B1', 'B2', 'B4', 'B3X', 'B3Y', 'B2P', 'B2Q', 'B2Y', 'B6', 'B7', 'B8A', 'B8', 'B9', 'B5'],
  // bola hali qahramon tanlamaganda Coddy turadigan ekranlar (EKRANLAR_U)
  coddyli: ['B1', 'B7', 'BK'],

  // ustoz ekranidagi sanoqlar: qaysi ekranda nimani sanaymiz (turlari va yozuvlari — qobiq.js, hisob())
  //   kirdi · javob (javob berganlar / kirganlar) · yur («YUR!» deganlar) · tanladi (qahramon) · ism (qahramonga ism)
  //   pog (n-pog'onani bajarganlar; pog'onalar zinapoyasi bo'lsa — har pog'ona) · sinf («Sinfimiz bugun») · sahna (sahnasi tayyor, joylar bo'yicha)
  sanoq: { P1: ['kirdi'], P2: ['javob'], P2S: ['yur'], P4T: ['tanladi'], P4I: ['ism'], P5A: ['pog', 1], P5: ['pog', 3], P14: ['sinf'], P12: ['sahna'] },

  // bola ekranlarining roli (xatti-harakati qobiq.js da)
  bola: {
    javob: 'P2N', // javob kartasini tanlaydi → ustozga, 0,5 s dan keyin keyingi ekran
    qahramon: 'BQ', // qahramon tanlaydi
    joy: 'B8A', // sahnasi uchun joy tanlaydi
    ism: 'B6', // qahramoniga ism beradi (asosiy tugma → ustozga «ism»)
    yakun: 'B5', // darsning oxirgi ekrani (solo'da — dars tugadi; ustoz tugatganda — konfeti)
    kutish: 'BK', // «Ustozni tinglang» — bola ustozni kutadi; oldingi ekranning qisqa gapi shu yerda chiqadi
    kutishGap: 'Ustozni tinglang', // kutish ekranidagi asl yozuv (o'rniga qisqa gap qo'yiladi)
  },
  // ustoz shu ekranda ko'rsatib bo'lgach (studiya: Coddy yetib bordi) — kutib turgan bola o'z topshirig'iga o'tadi
  ochish: ['P6'],
  // kutish ekranida oldingi ekranga qarab chiqadigan qisqa gap (yo'q bo'lsa — qadamning o'z gapi, QADAM[i][3])
  kichikGap: { B2Y: 'Hamma pog‘onalarni bajardingiz!', B2Q: 'Uch pog‘onani bajardingiz!', B0: 'Dars hozir boshlanadi', P2N: 'Javobingiz qabul qilindi', BQ: 'Qahramoningiz tanlandi', B6: 'Qahramoningizning ismi saqlandi', B7: 'Qahramoningiz gapirdi!', B8: 'Sahnangiz tayyor!' },

  // dars tugaganda: ustoz ekranida (sarlavha, gap) va bola noutbukida (ishora)
  tugadi: { ustoz: ['Dars tugadi!', 'Ko‘rishguncha — keyingi darsda labirintda!'], bola: 'Dars tugadi. Ko‘rishguncha!' },

  // solo (18.11, qaror 4A/5A): har qadamda bola ko'radigan ekranlar (ustoz ekrani — «P» bilan va QADAM[i][1] da; qolgani — bolaning topshirig'i:
  // P2N, B1 ham bolaniki). Yo'q qadam — o'tkazib yuboriladi (sinf doskalari P2 P2S P4T P5A P5 P4I P12, «Men robotman» o'yini P10,
  // ko'rgazma P13, «Sinfimiz bugun» P14 — ustoz va sinfsiz ma'nosiz)
  solo: {
    yol: { 0: ['B0', 'P1'], 1: ['P2N'], 2: ['BY'], 3: ['P2B'], 4: ['P2K'], 5: ['P2C'], 6: ['P3'], 7: ['P4'], 8: ['BQ'], 9: ['B1'], 10: ['B2', 'B4'], 11: ['P6', 'B3X', 'B3Y'], 12: ['B2P', 'B2Q', 'B2Y'], 13: ['P9'], 15: ['P4B'], 16: ['P7A'], 17: ['P7'], 18: ['B6'], 19: ['B7'], 20: ['P11'], 21: ['B8A', 'B8'], 22: ['B9'], 23: ['P8', 'B5'] },
    // «Keyingi ›» qo'shiladigan bola ekranlari (jonli darsda bu yerda ustoz kutilardi)
    keyingi: ['B1', 'B2', 'B4', 'B3X', 'B3Y', 'B2P', 'B2Q', 'B2Y', 'B7', 'B8', 'B9'],
    // ustozsiz o'tilganda ekran matnidagi «ustoz/sinf» gaplari (birinchi uchragani almashadi, tartib bilan)
    gap: [['Ustoz 3 marta bosadi', '3 marta bosing'], ['Bir marta bosing — ovozingiz sinfga qo‘shiladi', 'Bosing va «YUR!» deng'], ['Butun sinf birga', 'Sinab ko‘ring'], ['Zo‘r! Ustoz keyingisini ko‘rsatadi', 'Zo‘r!']],
  },

  // Blok studiya (3b): har ekranda qaysi ish va qanday topshiriq. Ishlarning o'zi (mexanika va umumiy gaplari) — dvigatel/studiya.js.
  //   ish   — topshiriqsiz maxsus ekran: uchBosish (ustoz blokni 3 marta bosadi) · rang (rang doirachalari) · ism (qahramonga ism va rang)
  //           · takror (bolaning dasturi qayta-qayta o'ynaydi) · natija (bolaning yakuniy sonlari) · sudrash (Coddy'ni sichqoncha bilan sudrash)
  //   dunyo — bola tanlagan joy (dunyo) qo'yiladi
  //   tur   — dastur ishga tushgach natija: yol (yulduzga yetish; olma, aniq soni) · korish (tayyor dastur, faqat ko'riladi)
  //           · namoyish (ustoz ko'rsatadi; ortiqcha blok bo'lsa — bolalarda topshiriq ochiladi) · izoh (faqat bitta gap) · gap (o'z gapi) · sahna (o'z sahnasi)
  //   bosh  — boshlang'ich holat: at — qahramon zonachasi; start — ishga tushganda qaytadigan zonacha; olma — olma zonachasi;
  //           aniq — kerakli bloklar soni; pog — pog'ona raqami (ustozdagi doska uchun); prog — 0: dastur bo'sh, 'qoldir': ekrandagi dastur qoladi;
  //           korish — faqat «Qayta ko'rish»; erkin — zonachasiz sahna; q — qahramon tanlovchisi; sana — Coddy yuzida qadam soni
  //   gap   — shu ekranga xos gaplar ([jonli, solo] juftligi — solo'da ikkinchisi); maslahat — «Maslahat» bosilganda; keyin — muvaffaqiyatdan keyin o'tiladigan ekran
  studiya: {
    P2K: { ish: 'uchBosish' },
    B1: { ish: 'rang' },
    B6: { ish: 'ism' },
    B9: { ish: 'takror', dunyo: true },
    B5: { ish: 'natija', dunyo: true },
    P2B: { ish: 'sudrash' },
    B2: { tur: 'yol', bosh: { at: 0, prog: 0, pog: 1 }, keyin: 'B4', maslahat: 'Yulduzgacha katakchalarni barmog‘ingiz bilan sanang' },
    B3X: { tur: 'yol', bosh: { at: 0, prog: 'qoldir' }, maslahat: 'Coddy qayerda to‘xtadi? Yulduzgacha nechta blok kerak — sanang' },
    B2P: { tur: 'yol', bosh: { at: 3, prog: 0, pog: 2 }, gap: { yetdi: 'Yetib bordi! move left bilan orqaga qaytdingiz', kam: 'Yulduz orqada qoldi — move left kerak' }, maslahat: 'Yulduz qaysi tomonda? O‘sha tomonga yuradigan blokni toping' },
    B2Q: { tur: 'yol', bosh: { at: 0, prog: 0, olma: 4, pog: 3 }, maslahat: 'Avval olmagacha sanang, keyin olmadan yulduzgacha' },
    B2Y: { tur: 'yol', bosh: { at: 0, prog: 0, olma: 6, aniq: 9, pog: 4 }, maslahat: 'Yo‘l ikki bo‘lak: olmagacha va olmadan yulduzgacha — har birini sanang' },
    B4: { tur: 'korish', bosh: { at: 3, start: 0, prog: 'qoldir', korish: true }, gap: { yetdi: ['Yetib bordi! Zo‘r! Ustoz keyingisini ko‘rsatadi', 'Yetib bordi! Zo‘r!'] } },
    P6: {
      tur: 'namoyish', bosh: { at: 0, prog: 'qoldir', sana: true },
      gap: {
        sarlavha: '4 ta blok bilan <em>ishga tushiramiz</em>',
        boshla: ['Ishga tushiring — Coddy yurgach, bolalarda topshiriq ochiladi', 'Ishga tushiring — Coddy qadamlarni sanaydi'],
        ortiq: 'Bizga 3 qadam kerak edi — bitta blok ortiqcha.', ortiqIshora: ['Bolalarda topshiriq ochildi. Siz ham ortiqcha blokni bosing, keyin ✕', 'Bitta blok ortiqcha — endi o‘zingiz tuzatasiz'],
        teng: 'Coddy yulduzda to‘xtadi.', kam: 'Yulduzgacha yetmadi.',
      },
    },
    P7A: { tur: 'izoh', bosh: { erkin: true, prog: 'qoldir', q: '.cdy2' }, gap: { matn: 'Gapirdi, lekin yurmadi' } },
    P11: { tur: 'izoh', bosh: { erkin: true, prog: 'qoldir', q: '.cdy3' }, gap: { matn: 'Siznikisi boshqacha bo‘lsin!' } },
    B7: { tur: 'gap', bosh: { at: 0, prog: 'qoldir' }, maslahat: 'Binafsha blokdagi yozuvni bosing va o‘zingiz yozing' },
    B8: { tur: 'sahna', dunyo: true, harakat: 2, bosh: { erkin: true, prog: 0 }, maslahat: 'Ko‘k doirachani bosing — harakat bloklari; binafsha — gap' },
  },
  // natija sonlari (5b-1): bolaning yakunida (B5) va ustozning «Sinfimiz bugun»ida (P14) — data-k bo'yicha; turlari — dvigatel/qobiq.js, natijaSon
  natija: [{ k: 'qadam', blok: 'rl' }, { k: 'sakrash', blok: 'j' }, { k: 'gap', blok: 's' }, { k: 'sahna', tayyor: true }],
  gapStandart: 'Salom!', // say blokining asl yozuvi — bola o'zgartirmagan bo'lsa «o'z gapi» hisoblanmaydi
  ismlar: ['Bulut', 'Chaqmoq', 'Shamol', 'Quvnoq', 'Yulduzcha', 'To‘lqin', 'Mitti', 'Olov'], // «Ism tanlab ber»

  // LMS (CRM) — 3d: dars ro'yxatdagi nomi (server lesson_catalog bilan bir xil bo'lishi shart), versiyasi, noutbukdagi saqlash kalitining boshi
  // (sinf bo'yicha: «jr001:<pin>:…») va yutuqlar: bola xabari t (n — kamida shu son) kelsa, yutuq nom bir marta beriladi (lms/aloqa.js)
  lms: {
    id: 'junior-001-tanishuv-v1', versiya: 'v1', kalit: 'jr001',
    yutuqlar: [{ t: 'pog', n: 1, nom: 'yulduz' }, { t: 'tayyor', nom: 'sahna' }], // yulduz — birinchi dastur (1-pog'ona); sahna — o'z sahnasi tayyor
  },

  // ustoz varag'i (telefonda o'qish uchun) — bosh qismi; har qadam kartasi qadamlar.mjs dagi VARAQ dan. «Boshqaruv» bandi — umumiy (qobiq.js)
  varaq: [
    '<b>Asosiy fikr:</b> kompyuter (Coddy) faqat o‘zi tushunadigan buyruqni — blokni — bajaradi. Ketma-ket bloklar — dastur.',
    '<b>Yo‘l:</b> huk (savol va 3 sinov) → yangi so‘z → reja → 1-bekat «Harakatlantirish» → 2-bekat «Gapirtirish» → 3-bekat «Sahna yaratish» → yakun.',
    '<b>Demoda:</b> hukdagi raqamlar haqiqiy (kirdi, javob berdi, «YUR!»). Qolgan raqamlar — 14 bolali sinfda qanday ko‘rinishi. Studiya ishlaydi: blok bosilsa dasturga qo‘shiladi, dasturdagi blok bosilsa tanlanadi (boshqa blok bosilsa — joyi almashadi, ✕ — olib tashlanadi), «Ishga tushir» — qahramon yuradi, sakraydi, gapiradi. Sudrab qo‘shish — keyingi bosqichda (Blockly).',
  ],
}
