// Chizma yordamchilari (dvigatel; asli — etalon v3.4, F-1116-11…13). Toza chizish kodi: demo'da Node'da, LMS'da brauzerda yuriladi.
// 2d (19.11): fayl o'qish, V, OUT (etalon.html yo'li), HARAKAT va MAKET bu yerdan olib tashlandi — uslub endi yigish.mjs da (uslub()).
// 3e (19.11): etalon davridan qolgan, hech qayerda ishlatilmaydigan 11 yordamchi olib tashlandi (OYOQ, STAR, blk, daftar, mis, bar, TERM, terminlar,
// natija, fUstoz, fBola) — ular satr yoki funksiya edi, yuklanishda chizmasdi. Eski holi: arxiv/zaxira-2026-11-19-dvigatel-1a-oldin.tar.gz → etalon/bosh.mjs.
import { hero, robot, world } from '../src/chizma/dvigatel.js'

const YUL = '<svg class="yul" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.6l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z" fill="#FFC93C" stroke="#E8A90C" stroke-width="1.2" stroke-linejoin="round"/><path d="M9.3 8.6l1.2-2.4" stroke="#fff6cf" stroke-width="1.4" stroke-linecap="round"/></svg>'
const PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4l13 8-13 8z" fill="#fff"/></svg>'
const QALAM = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20l1.2-4.6L15.6 5a2 2 0 0 1 2.8 0l.6.6a2 2 0 0 1 0 2.8L8.6 18.8z" fill="#E7CA66"/><path d="M4 20l1.2-4.6 3.4 3.4z" fill="#0D2137"/></svg>'
const LAMP = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a6 6 0 0 0-3.5 10.9V16h7v-2.1A6 6 0 0 0 12 3z" fill="#E7CA66"/><rect x="9" y="17.5" width="6" height="2.2" rx="1" fill="#0D2137"/></svg>'
const QAYTA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12a7 7 0 1 0 2.1-5" fill="none" stroke="#0D2137" stroke-width="2.4" stroke-linecap="round"/><path d="M4 4v4.5h4.5" fill="none" stroke="#0D2137" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>'

const bust = (yuz = 'xursand') => robot({ pose: 'salom', yuz, lite: true }).replace('viewBox="0 0 260 240"', 'viewBox="50 -12 160 160"')
const cg = (gap, yuz) => `<div class="cg"><span class="av">${bust(yuz)}</span><p><small>Coddy</small>${gap}</p></div>`
const matn = (tag, h, gap, extra = '', yuz) => `${tag ? `<span class="tag">${tag}</span>` : ''}<h3 class="sar">${h}</h3>${gap ? cg(gap, yuz) : ''}${extra}`
// v3.1 (F-1115-10): yo'l — zonachalar (0 = start) va ular orasida sakrash yoylari; o'tilgan yoy oltin
const zona = (i, star, at) => `<span class="z z${i}${i === 0 ? ' s' : ''}${i === star ? ' y' : ''}">${i ? `<b>${i}</b>` : ''}${i === star && at !== star ? YUL : ''}</span>`
const yoylar = (n, at) => { const C = n + 1, cx = (i) => ((i + 0.5) / C) * 100; return `<svg class="yoy" viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true">${Array.from({ length: n }, (_, i) => `<path class="${i < at ? 'otdi' : ''}" d="M${(cx(i) + 2.5).toFixed(1)} 9.5 Q${((cx(i) + cx(i + 1)) / 2).toFixed(1)} -6 ${(cx(i + 1) - 2.5).toFixed(1)} 9.5"/>`).join('')}</svg>` }
const yol = (cls, aktyor, n = 3, star = 3) => { const at = +((aktyor.match(/\bat(\d)\b/) || [])[1] || 0); return `<div class="yol c${n + 1} ${cls}">${aktyor}${yoylar(n, at)}${Array.from({ length: n + 1 }, (_, i) => zona(i, star, at)).join('')}</div>` }
const coddyQ = (cls = '', pose = 'korsatadi', yuz = 'xursand') => `<div class="q ${cls}">${robot({ pose, yuz })}</div>`
const momiqQ = (cls = '', mood = 'xursand', mv) => globalThis.QAH === 'coddy' ? `<div class="q ${cls}">${robot({ pose: 'turadi', yuz: 'xursand' })}</div>` : `<div class="q kichik ${cls}">${hero({ k: globalThis.QAH || 'momiq', mood, mv })}</div>`
const SH = { A: 'c1', B: 'c2', C: 'c3' }
const kartalar = (arr, cls = '') => `<div class="jv ${cls}">` + arr.map(([l, t, extra = '', k = '']) => `<div class="jk ${SH[l]} ${k}"><i class="sh ${SH[l]}"></i><span class="jt"><b>${l}</b>${t}</span>${extra}</div>`).join('') + '</div>'
const qahramonlar = () => `<div class="qq"><span class="m1">${hero({ k: 'momiq', mood: 'xursand' })}</span><span class="m2">${robot({ pose: 'quvonadi' })}</span><span class="m3">${hero({ k: 'katak', mood: 'xursand' })}</span></div>`

const fJim = (t) => `<footer class="hn jim"><span class="hint">${t}</span></footer>`
// 25.11 (QA F-1125-14, Q14-A): bola yakuni — keyin nima qilish aniq (avval faqat «Dars tugadi» — QA: «keyin nimani bosib chiqiladi?»)
const TUGADI_YOZUV = '✓ Dars tugadi. Natijangiz saqlandi — oynani yopishingiz mumkin'


// 23-dars e'loni (22.11): «Demo Day №1». Manba: new-junior/manba/023-demo-day-1.md (v1 — «Savollar» 1–8 tavsiya A bo'yicha qurildi; foydalanuvchi javobi kutilmoqda).
// Faqat ma'lumot. Demo Day: oxirgi sinov (kosmik.kerak = karta3), mehmon o'ynaydi (oynadi · karta3), uy yo'riqnomasi kartasi Y1 («Yo‘riqnoma tayyor»; Scratch — ota-ona ruxsati bilan).
// Karta — 21-dars saqlagani (DARS.kartaKalit), bo'lmasa namuna; o'yin — 22-dars saqlagani (perKalit17), bo'lmasa karta bo'yicha tayyor. Sinov: sinov/dvigatel/shaxsiy.mjs
const RPR = [[['k', 'right'], ['r']], [['k', 'left'], ['l']]] // raketa: →[→] ←[←]
const OQP = [[['k', 'space'], ['C']], [['H'], ['p', '4', [['u']]], ['D']]] // o'q: S[C] · K[R4[↑] D]
const DK = [['H'], ['y', 'r0-6,4'], ['p', '4', [['d']]], ['D']] // dushman nusxasi: K[go(R0-6, 4) R4[↓] D]
const DSP = (n = 5) => [[['f'], ['p', String(n), [['C']]]], DK] // dushman: ▶[Rn[C]] · K[…]
const OQB = [[['q', 'enemy'], ['c', 'ball:1']]] // o'q: T[change ball by 1]
const RJ = [[['f'], ['z', 'ball:0'], ['z', 'jon:3']], [['q', 'enemy'], ['c', 'jon:-1'], ['i', 'jon:0', [['g']]]]] // raketa: ▶[ball 0, jon 3] · T[jon −1; if jon = 0 → game over]
const PR = { royxat: [{ id: 'raketa', nom: 'Raketa' }, { id: 'oq', nom: 'O‘q' }, { id: 'dushman', nom: 'Dushman' }] }
const pD = { ...PR, tanla: 'dushman' }, pO = { ...PR, tanla: 'oq' }, pR = { ...PR, tanla: 'raketa' }
// 18-darsning to'liq o'yini (saqlanmagan bo'lsa)
const tayyor = () => ({ raketa: [...RPR, ...RJ], oq: [...OQP, ...OQB], dushman: DSP(5) })
const kb = (kosmik, personaj, kod, o = {}) => ({ sahna: 'katak', oyin: true, kosmik: { dushman: { asl: [3, 4] }, ozg: true, ...kosmik }, personaj, prog: 'per', perProg: tayyor(), kod, ...o })
const TEST_M = 'Test paytida maslahat yo‘q'
const DARS = {
  raqam: 23,
  nom: 'Demo Day №1',
  savol: '',
  // javon (loyiha — hammasi, 18-dars + Tovush): ★ «Yangi qator» — play sound
  javon: { e: [['k', 'right'], 'f', ['q', 'enemy'], 'g'], h: ['r', 'l', 'u', 'd', ['y', '3,4']], b: [['p', '4']], K: ['C', 'H', 'D'], o: [['z', 'ball:0'], ['c', 'ball:1'], ['m', '0-6']], a: [['i', 'jon:0']], t: [['n', 'qadam']] },
  maydon: { w: 7, h: 5 },
  masshtabMin: 0.5,
  dasturchalar: 'oyin', // o'yin ekranlari — dasturchalar; 3-bekat (oldindan aytish) — bitta zanjir
  dasturchaBlok: true,
  dasturchaUstun: 1,
  blokChegara: 12,
  maslahatKeyin: true,
  joyQolmadi: 'Dasturga N ta blok sig‘adi',
  ozgaruvchi: ['ball', 'jon'],
  changeSonlar: [-3, -2, -1, 1, 2, 3, 5],
  dushmanTegish: true, // when touching — tur ro'yxatiga «enemy» (blockly.js BL_OLMA_D)
  perKalit17: 'jr022', // oldingi darsda saqlangan o'yin (kosmik.js perTayyorla, prog 'per17') — 22-dars
  klonGap: { sanoq: 'O‘q: N' },
  kartaPog: 4, // yo'riqnoma kartasi — pog'ona 4 (kod.js kartaTayyor)
  kartaKalit: 'jr021', // 21-dars kaliti — karta shu yerdan o'qiladi (kod.js kartaOl)
  kartaNamuna: { kim: 'do‘stim', dush: 5, ball: 2, jon: 3 }, // karta saqlanmagan bo'lsa
  // loyiha kartasi gaplari (kod.js KR; N — son; q_* — bola ekranidagi qator sarlavhalari)
  kartaGap: { kim: 'Kim o‘ynaydi', dush: 'Dushmanlar', ball: 'Har dushman — ball', jon: 'Jon', maqsad: 'Yutish uchun', q_kim: 'Kim o‘ynaydi?', q_dush: 'Dushmanlar', q_ball: 'Har dushman — ball', q_jon: 'Jon',
    toldiring: 'Hamma qatorni tanlang', tayyor: 'Karta tayyor!', kartaYoq: 'Avval kartani to‘ldiring', dushKarta: 'Kartada N ta dushman bor', jonKarta: 'Kartada jon: N', ballKarta: 'Kartada har dushman — N ball',
    uring: 'Dushmanni uring — ball oshadimi?', maqsadKam: 'Yutish uchun N ball kerak', jonQolsin: 'Jon qolsin — yana o‘ynang', bir: 'Hammasi bir ustundan tushdi. Son o‘rniga random qo‘ying', hammasi: 'Hamma N dushmanni uring', oshir: 'Yana uring: kamida N ball kerak' },
  // kosmik o'yin gaplari (kosmik.js KS) — 18-dars bilan bir xil (chek-list — 3-bekat)
  kosmikGap: {
    dasturi: 'dasturi', royxat: 'O‘yiningizda:',
    chek: [['tushadi', 'Dushmanlar tushadi'], ['ball', 'O‘q tegsa — ball +1'], ['jon', 'Dushman tegsa — jon −1'], ['tugaydi', 'Jon tugasa — o‘yin tugaydi'], ['yutdi', 'O‘yin yutildi']],
    oyinYz: 'O‘yin: ← → va space', dushSanoq: 'Dushman: N',
    bosh: 'Avval blokni bosing — u dasturga qo‘shiladi', boshP: 'Bu yerda hech narsa yo‘q-ku…',
    raketaKlon: 'create clone of myself — O‘q yoki Dushman dasturiga', raketaKlonP: 'Raketa ko‘payib ketdi!',
    turib: 'Nusxa when I start as a clone ostidagi bloklarni bajaradi', turibP: 'Men nima qilay?',
    chet: 'O‘q tepadan ham yuqoriga uchmoqchi bo‘ldi. move up necha marta?', chetP: 'Maydon tugadi!',
    chetD: 'Dushman yerdan ham pastga yurmoqchi bo‘ldi. move down necha marta?',
    qoldi: 'Uchib bo‘lgan o‘q o‘chsin — delete this clone', qoldiP: 'Tepada qolib ketdi!',
    yetmadi: 'O‘q tepaga yetmay o‘chdi. move up necha marta?', yetmadiP: 'Oz qoldi!',
    oqQani: 'O‘qni create clone of myself yasaydi — O‘q dasturida', oqQaniP: 'O‘q qani?',
    dushQani: 'Dushman nusxasini create clone of myself yasaydi — Dushman dasturida', dushQaniP: 'Dushman qani?',
    yerda: 'Tushib bo‘lgan dushman o‘chsin — delete this clone', yerdaP: 'Yerda qolib ketdi!',
    ballQani: 'O‘q dushmanni urdi. O‘q dasturida when touching enemy ostiga — change ball by 1', ballQaniP: 'Ball qani?',
    eskiBall: 'O‘yin boshida ball 0 bo‘lsin — set ball to 0', eskiBallP: 'Eski ball!',
    jonQani: 'Dushman tegdi. Raketa dasturida when touching enemy ostiga — change jon by -1', jonQaniP: 'Jon qani?',
    jonTugadi: 'Jon 0 bo‘lsa — o‘yin tugasin: if jon = 0 then → game over', jonTugadiP: 'Jon tugadi-ku!',
    soni: 'N ta dushman tushsin', bir: 'Hammasi bir ustundan tushdi. Son o‘rniga random qo‘ying', birP: 'Yana o‘sha joy!',
    urdiKam: 'Yana uring: N ta dushman', ballKam: 'Ball: N. Yana uring!', ikkiBall: 'Har dushman 2 ball bersin', ozP: 'Oz qoldi!',
    ikkinchi: 'Endi yana ▶ Boshlash — ball 0 dan boshlanadimi?', toliq: 'Yuting: kamida 3 ball, jon qolsin', kamida8: 'Kamida 8 ta dushman bo‘lsin',
    tegsin: 'Ataylab dushman ostida turing — jon kamayadimi?', toliqKam: 'Ro‘yxatga qarang: qaysi band hali ✓ emas?', tugadiYutdi: 'Jon 0 — o‘yin tugadi. Qoida ishlayapti!',
    tugadi: 'O‘yin tugadi. ▶ Boshlash — yana o‘ynang', yutdi: 'Siz yutdingiz!', oynadi: 'O‘yin tugadi — mehmon o‘ynadi!',
  },
  // kod oynasi gaplari (kod.js KG2; N — son)
  kodGap: {
    sarlavha: 'Kod', ochish: 'Kodini ko‘rsat', yopish: 'Kodni yopish',
    korildi: 'Ochildi: N', topildi: 'Topildi: N / 3', ozgardi: 'Kodda o‘zgargan son: N',
    boshqaKarta: 'Endi boshqa personaj kartasini bosing',
    qatorTop: 'Belgilangan blokning qatorini bosing', blokTop: 'Belgilangan qatorning blokini bosing',
    boshqaQ: 'Belgilangan blokka qarang: uning so‘zi qaysi qatorda?', boshqaQP: 'Bu boshqa qator!',
    boshqaB: 'Qatordagi so‘zga qarang: qaysi blok shunday?', boshqaBP: 'Bu boshqa blok!',
    koddaO: 'Sonni kodda o‘zgartiring — qatordagi sonni bosing',
    ozgarmadi: 'Kodda son o‘zgarmadi — qatordagi sonni bosing', dush8: 'Dushman: N. Kodda dushmanlar sonini 8 qiling',
    ball2: 'Har dushman 2 ball bersin — kodda o‘zgartiring', uring: 'Dushmanni uring — ball oshadimi?',
    jon5: 'O‘yin 5 jon bilan boshlansin — kodda o‘zgartiring', jonQolsin: 'Jon qolsin — yana o‘ynang',
    ikkiSon: 'Kodda yana bitta sonni o‘zgartiring', yuting: 'Dushmanni uring va yuting',
    hukSarlavha: 'Kod', hukTushunmadi: 'Tushunmadim…',
    yutdi: 'Siz yutdingiz!',
  },

  namuna: { qahramon: ['Momiq', 'Zippi'], ism: 'Aziz' },
  qahramonli: ['BK', 'B1A', 'B2A', 'B2Y', 'Y1', 'B5'],
  coddyli: [],

  // pog'onalar: 1 oxirgi sinov (B1A), 2–3 mehmon (B2A, B2Y), 4 uy yo'riqnomasi (Y1)
  sanoq: { P1: ['kirdi'], P5: ['pog', 1, 0], P5G: ['pog', 2, 1], P5B: ['pog', 4, 3], P14: ['sinf'] },

  bola: { karta: 'Y1', qahramonYoq: 'BQ', yakun: 'B5', kutish: 'BK', kutishGap: 'Ustozni tinglang' },
  ochish: [],
  oqishGap: 'O‘yiningiz haqida mehmonlarga ayting',
  kichikGap: { B0: 'Dars hozir boshlanadi', Y1: 'Karta tayyor bo‘lsa — tugmani bosing', B2Y: 'Hamma pog‘onalarni bajardingiz!' },

  tugadi: { ustoz: ['Dars tugadi!', 'Ko‘rishguncha — keyingi modulda sun‘iy intellekt!'], bola: 'Dars tugadi. Ko‘rishguncha!' },

  solo: {
    yol: { 0: ['B0', 'P1'], 1: ['P4'], 2: ['P7'], 3: ['B1A'], 4: ['P4B'], 5: ['P8'], 6: ['B2A', 'B2Y'], 7: ['P4C'], 8: ['P10'], 9: ['Y1'], 10: ['B5'] },
    keyingi: ['B1A', 'B2A', 'B2Y'],
    gap: [],
  },

  // bosh.kosmik.kerak — pog'ona sharti (kosmik.js): karta3 (yutdi) · oynadi (bitta o'yin tugadi — yutdi yoki «O‘yin tugadi»). Dastur: 22-dars o'yini (K+'per', perKalit17 = 22-dars kaliti), bo'lmasa karta bo'yicha tayyor.
  studiya: {
    P8: { tur: 'yol', chegara: 12, bosh: kb({}, pR, undefined, { prog: 'per17', kartaProg: true }), gap: { boshla: ['', 'Strelkalar — raketa, probel — o‘q'] } },
    B1A: { tur: 'yol', chegara: 12, bosh: kb({ kerak: 'karta3', chek: true }, pR, undefined, { pog: 1, prog: 'per17', kartaProg: true }), maslahat: 'O‘yin kartadagidek ishlayaptimi? Dushmanlar, jon, ball' },
    B2A: { tur: 'yol', chegara: 12, bosh: kb({ kerak: 'oynadi', chek: true }, pR, undefined, { pog: 2, prog: 'per17', kartaProg: true }), maslahat: 'Mehmon o‘ynaganda aytib bering: nechta dushman, qanday yutiladi' },
    B2Y: { tur: 'yol', chegara: 12, bosh: kb({ kerak: 'karta3', chek: true }, pR, undefined, { pog: 3, prog: 'per17', kartaProg: true }), maslahat: 'Mehmon yutsin — kartadagi maqsadga yetsin' },
    B5: { ish: 'natija' },
  },
  // natija: ta o‘yin tugadi — mehmon o‘ynadi, ta mehmon yutdi — mehmon yutdi, pog‘ona bajardi — 4 pog'ona
  natija: [{ k: 'ta o‘yin tugadi', ekran: ['B2A'] }, { k: 'ta mehmon yutdi', ekran: ['B2Y'] }, { k: 'pog‘ona bajardi', ekran: ['B1A', 'B2A', 'B2Y', 'Y1'] }],
  gapStandart: 'Salom!',

  lms: {
    id: 'junior-023-demo-day-1-v1', versiya: 'v1', kalit: 'jr023',
    // «Namoyishchi» — 2-bekatning 1-pog'onasi (mehmon o‘ynadi); «Modul bitiruvchisi» — yo'riqnoma kartasi (4-pog'ona)
    yutuqlar: [{ t: 'pog', n: 2, nom: 'namoyishchi' }, { t: 'pog', n: 4, nom: 'bitiruvchi' }],
  },

  varaq: [
    '<b>Asosiy fikr:</b> bola o‘z ishini ko‘rsatadi, mehmon o‘ynaydi. Ota-ona bolaning mehnatini ko‘radi.',
    '<b>Yo‘l:</b> reja → qoidalar → 1-bekat «Tayyorlanamiz» (oxirgi sinov) → 2-bekat «Ko‘rsatamiz» (mehmon o‘ynaydi) → 3-bekat «Uyga olib ketamiz» (yo‘riqnoma kartasi) → yakun.',
    '<b>Mehmonlar bilan:</b> noutbuklar tayyor, o‘yinlar saqlangan bo‘lishi kerak (21–22-dars). Mehmon yutmasa — bola «yana urining» deydi. «Mehmon» pog‘onalarida o‘yinni faqat mehmon o‘ynaydi — bola aytib beradi (natijadagi «ta mehmon yutdi» shu o‘yinlar). Ism proyektorga chiqmaydi.',
    '<b>Uy yo‘riqnomasi:</b> Scratch — bepul sayt (scratch.mit.edu); bolalar ota-ona ruxsati bilan kiradi. Blok nomlari deyarli bir xil, lekin o‘zgaruvchi nomi «score» bo‘lishi mumkin.',
    '<b>Himoya:</b> har bolani tinglang — nechta dushman, qanday yutiladi, eng qiyin joyi. «Noto‘g‘ri» deb aytilmaydi.',
  ],
}

// Umumiy ekran qismlari (dvigatel 1b, 19.11): bloklar, palitra, studiya, dastur tasmasi, sarlavha, Coddy gapi, footer, kutish, taxta,
// joy kartasi, shartlar, sinf natijasi va h.k. Avval etalon/ekranlar.mjs ichida 1-dars ekranlari bilan aralash edi — mazmuni o'zgarmagan.
// 3c (19.11): 1-darsning o'z bo'laklari (kurs o'yinlari, pog'onalar, huk javoblari, bekatlar, dars oxiri, keyingi dars, sahna shartlari, sinf
// natijasi namunasi) — darslar/001-tanishuv/qismlar.mjs da; sarlavha va huk savoli — DARS dan. Bu yerda faqat kursga umumiy qismlar qoldi
// (qahramonlar, dunyolar, ranglar, bloklar, shablonlar). yigish.mjs: bosh → dars e'loni → shu fayl → dars qismlari → dars ekranlari.

// ===== v3: mozaika bloklar, Scratch tartibidagi studiya =====
const IKON = {
  r: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h13M12 6l6 6-6 6" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  l: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12H7M12 6l-6 6 6 6" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  u: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20V7M6 12l6-6 6 6" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  d: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v13M6 12l6 6 6-6" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  j: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19C6 6 18 6 20 19" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round"/><path d="M15 16l5 4 2-6" fill="none" stroke="#fff" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  s: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h14a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3h-7l-5 4v-4H5a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3z" fill="#fff"/></svg>',
  // 5-dars: takrorlash — aylana strelka
  p: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 12a7.5 7.5 0 0 1 12.8-5.3" fill="none" stroke="#fff" stroke-width="2.8" stroke-linecap="round"/><path d="M18.6 3.4v4.2h-4.2" fill="none" stroke="#fff" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M19.5 12a7.5 7.5 0 0 1-12.8 5.3" fill="none" stroke="#fff" stroke-width="2.8" stroke-linecap="round"/><path d="M5.4 20.6v-4.2h4.2" fill="none" stroke="#fff" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  // 4-dars: hodisa — klaviatura tugmasi (strelka bilan)
  k: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="5" width="19" height="14" rx="3" fill="none" stroke="#fff" stroke-width="2.4"/><path d="M7 12h8.5M12.5 9l3 3-3 3" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  // 3-dars: go to — manzil belgisi (nishon: doira va markaz)
  // 8-dars: shart — ayri yo'l (savol belgisi bilan tarmoq)
  a: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21v-7l-6-6M12 14l6-6" fill="none" stroke="#fff" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 6.5h5v-5M21 6.5h-5v-5" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  // 7-dars: kostyum — futbolka; tovush — nota
  v: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.2 3.5 3 6.6l2.2 4.1 2.6-1.1V20h8.4V9.6l2.6 1.1L21 6.6l-5.2-3.1c-.7 1.5-2.1 2.4-3.8 2.4s-3.1-.9-3.8-2.4z" fill="#fff"/></svg>',
  n: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 17.5V5.2l11-2.2v12.3" fill="none" stroke="#fff" stroke-width="2.6" stroke-linejoin="round"/><circle cx="6.3" cy="17.6" r="3" fill="#fff"/><circle cx="17.3" cy="15.4" r="3" fill="#fff"/></svg>',
  // 11-dars: olmaga tekkanda — barmoq tegishi (nuqta va uch chiziq); «▶ Boshlash» bosilganda — uchburchak; set — «=», change — «+»
  q: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="14" r="4.4" fill="#fff"/><path d="M12 2.6v3.6M4.6 5.6l2.4 2.6M19.4 5.6 17 8.2" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/></svg>',
  f: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.6v14.8L19.4 12z" fill="#fff" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>',
  z: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 9h14M5 15h14" stroke="#fff" stroke-width="3.2" stroke-linecap="round"/></svg>',
  c: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4.6v14.8M4.6 12h14.8" stroke="#fff" stroke-width="3.4" stroke-linecap="round"/></svg>',
  // 12-dars: o'zgaruvchi sharti — «=» belgili ayri yo'l; game over — to'xtash belgisi (sakkizburchak)
  i: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21v-7l-6-6M12 14l6-6" fill="none" stroke="#fff" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 3.6h6M3 7h6" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/></svg>',
  g: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.3 3h7.4L21 8.3v7.4L15.7 21H8.3L3 15.7V8.3z" fill="#fff"/><path d="M8.6 12h6.8" stroke="#F08A24" stroke-width="2.8" stroke-linecap="round"/></svg>',
  // 13-dars: random — zar (uch nuqta)
  m: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.4" y="3.4" width="17.2" height="17.2" rx="4" fill="none" stroke="#fff" stroke-width="2.4"/><circle cx="8.2" cy="8.2" r="1.8" fill="#fff"/><circle cx="12" cy="12" r="1.8" fill="#fff"/><circle cx="15.8" cy="15.8" r="1.8" fill="#fff"/></svg>',
  // 16-dars (21.11): Klon oilasi — C create clone (ikki varaq), H when I start as a clone (varaq va ▶), D delete this clone (varaq va ✕)
  C: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8.4" y="3.6" width="12" height="12" rx="2.6" fill="none" stroke="#fff" stroke-width="2.4"/><rect x="3.6" y="8.4" width="12" height="12" rx="2.6" fill="#fff"/></svg>',
  H: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.4" y="5" width="11" height="14" rx="2.4" fill="#fff"/><path d="M14.6 7.6l6 4.4-6 4.4z" fill="#fff"/></svg>',
  D: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.6" y="3.6" width="16.8" height="16.8" rx="3" fill="none" stroke="#fff" stroke-width="2.4"/><path d="M8.4 8.4l7.2 7.2M15.6 8.4l-7.2 7.2" stroke="#fff" stroke-width="2.8" stroke-linecap="round"/></svg>',
  x: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="7.4" fill="none" stroke="#fff" stroke-width="2.8"/><circle cx="12" cy="12" r="2.6" fill="#fff"/><path d="M12 1.6v4M12 18.4v4M1.6 12h4M18.4 12h4" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/></svg>',
}
const BL = { C: ['K', 'create clone of myself'], H: ['K', 'when I start as a clone'], D: ['K', 'delete this clone'], r: ['h', 'move right'], l: ['h', 'move left'], u: ['h', 'move up'], d: ['h', 'move down'], j: ['h', 'jump'], s: ['g', 'say'], x: ['h', 'go to'], k: ['e', 'when'], p: ['b', 'repeat'], v: ['v', 'switch costume to'], n: ['t', 'play sound'], a: ['a', 'if path'], q: ['e', 'when touching'], f: ['e', 'when ▶ clicked'], z: ['o', 'set'], c: ['o', 'change'], i: ['a', 'if'], g: ['e', 'game over'], y: ['h', 'go to'], m: ['o', 'random'] }
// mb('r') · mb('s','Salom!') · mb('r','', 'yon') · mb('x', '4,2') — go to manzili (3-dars; sonlar oq kapsulada, data-x / data-y — blockly.js, blokXY)
const mbXY = (m) => { const [x = 0, y = 0] = String(m === 'Salom!' ? '0,0' : m).split(','); return [+x || 0, +y || 0] }
// 4-dars: mb('k', 'right') — hodisa bloki, tugma oq kapsulada (data-tugma — blockly.js, blokTugma)
const TUGMA_K = { right: '→', left: '←', up: '↑', down: '↓', space: 'space', any: 'any' } // any — 12-dars
// 5-dars: mb('p', '3') — takrorlash sarlavhasi (data-n); ichidagi bloklar bilan — takror('3', ichki HTML), dvigatel/qismlar.mjs
// 7-dars: mb('v', 'xursand') — kostyum, mb('n', 'qadam') — tovush; qiymat oq kapsulada (data-q — blockly.js, blokQiymat)
const KOS_NOM = { xotirjam: 'xotirjam', xursand: 'xursand', hayron: 'hayron', oylanadi: 'o‘ylanadi' }
// 8-dars: mb('a', 'right') — shart sarlavhasi (data-yon), tomon oq kapsulada; ichidagi bloklar bilan — shart('right', ichki)
// 11-dars: mb('q', 'gold') — olmaga tekkanda (data-q: apple | gold); mb('f') — «▶ Boshlash» bosilganda; mb('z', 0) — set ball to 0, mb('c', 1) — change ball by 1 (data-n)
const OLMA_NOM = { apple: 'apple', gold: 'gold apple', cactus: 'cactus', enemy: 'enemy' } // 18-dars: enemy — dushmanga tekkanda
const mb = (t, matn = 'Salom!', cls = '') => { const [f, nom] = BL[t]; if (t === 'q') { const q = OLMA_NOM[matn] ? matn : 'apple'; return `<span class="mb f-${f} ${cls}" data-tur="q" data-q="${q}">${IKON[t]}<span>${nom}</span><span class="xy"><i>${OLMA_NOM[q]}</i></span></span>` } // 13-dars: mb('y', '0,0') — go to son katakli (katak «rA-B» bo'lsa — ichida random oval), mb('m', '1-10') — random bloki
  const rndI = (sp) => { const [a, c] = sp.slice(1).split('-'); return `<span class="mrnd">random <i>${a}</i> to <i>${c}</i></span>` }
  if (t === 'y') { const [x0 = '0', y0 = '0'] = String(matn === 'Salom!' ? '0,0' : matn).split(','); return `<span class="mb f-${f} ${cls}" data-tur="y" data-x="${x0}" data-y="${y0}">${IKON.x}<span>${nom}</span><span class="xy">x: ${/^r/.test(x0) ? rndI(x0) : `<i>${x0}</i>`} y: ${/^r/.test(y0) ? rndI(y0) : `<i>${y0}</i>`}</span></span>` }
  if (t === 'm') { const [a = '1', c = '10'] = String(matn === 'Salom!' ? '1-10' : matn).split('-'); return `<span class="mb f-${f} mb-oval ${cls}" data-tur="m" data-ra="${a}" data-rb="${c}">${IKON[t]}<span>${nom}</span><span class="xy"><i>${a}</i> to <i>${c}</i></span></span>` }
  if (t === 'f' || t === 'g' || t === 'C' || t === 'H' || t === 'D') return `<span class="mb f-${f} ${cls}" data-tur="${t}">${IKON[t]}<span>${nom}</span></span>`; if (t === 'z' || t === 'c' || t === 'i') { const s0 = String(matn), [v0, n0] = s0.indexOf(':') >= 0 ? s0.split(':') : ['', s0], n = /^-?\d+$/.test(n0) ? n0 : t === 'c' ? '1' : '0', vr = v0 || (typeof DARS !== 'undefined' && DARS.ozgaruvchi && DARS.ozgaruvchi[0]) || 'ball', nk = +n < 0 ? '−' + -n : n; return `<span class="mb f-${f} ${cls}" data-tur="${t}"${v0 ? ` data-v="${v0}"` : ''} data-n="${n}">${IKON[t]}<span>${nom}</span><span class="xy"><i>${vr}</i> ${t === 'z' ? 'to' : t === 'c' ? 'by' : '='} <i>${nk}</i>${t === 'i' ? ' then' : ''}</span></span>` } if (t === 'a') { const y = TUGMA_K[matn] && matn !== 'space' ? matn : 'right'; return `<span class="mb f-${f} ${cls}" data-yon="${y}">${IKON[t]}<span>${nom}</span><span class="xy"><i>${TUGMA_K[y]}</i> then</span></span>` } if (t === 'v' || t === 'n') { const q = matn === 'Salom!' ? (t === 'v' ? 'xursand' : 'qadam') : matn; return `<span class="mb f-${f} ${cls}" data-q="${q}">${IKON[t]}<span>${nom}</span><span class="xy"><i>${KOS_NOM[q] || q}</i></span></span>` } if (t === 'p') { const n = /^\d+$/.test(String(matn)) ? matn : '3'; return `<span class="mb f-${f} ${cls}" data-n="${n}">${IKON[t]}<span>${nom}</span><span class="xy"><i>${n}</i></span></span>` } if (t === 'k') { const k = TUGMA_K[matn] ? matn : 'right'; return `<span class="mb f-${f} ${cls}" data-tugma="${k}">${IKON[t]}<span>${nom}</span><span class="xy"><i>${TUGMA_K[k]}</i> key pressed</span></span>` } if (t === 'x') { const [x, y] = mbXY(matn); return `<span class="mb f-${f} ${cls}" data-x="${x}" data-y="${y}">${IKON[t]}<span>${nom}</span><span class="xy">x: <i>${x}</i> y: <i>${y}</i></span></span>` } return `<span class="mb f-${f} ${cls}">${IKON[t]}<span>${nom}</span>${t === 's' ? `<span class="inp">${matn}</span>` : ''}</span>` }
const yigma = (arr) => `<div class="mbw">${arr.map((x) => (typeof x === 'string' ? mb(x) : mb(...x))).join('')}</div>`
const OILA = { K: ['Klon', 'C'], h: ['Harakat', 'r'], g: ['Gap', 's'], e: ['Hodisa', 'k'], b: ['Takrorlash', 'p'], v: ['Ko‘rinish', 'v'], t: ['Tovush', 'n'], a: ['Shart', 'a'], o: ['O‘zgaruvchi', 'c'] }
// takrorlash bloki ichidagilari bilan (tayyor dastur HTML'i): ichki — [t | [t, m]…]; blockly.js uni ichma-ich o'qiydi (.c-blok)
const shart = (yon, ichki) => `<div class="c-blok" data-yon="${yon}">${mb('a', yon)}<div class="c-ich">${ichki.map((x) => (typeof x === 'string' ? mb(x) : mb(...x))).join('')}</div><span class="c-tub"></span></div>`
const takror = (n, ichki) => `<div class="c-blok" data-n="${n}">${mb('p', String(n))}<div class="c-ich">${ichki.map((x) => (typeof x === 'string' ? mb(x) : mb(...x))).join('')}</div><span class="c-tub"></span></div>`
const rang = (f, cls = '') => `<span class="rd f-${f} ${cls}"><i>${IKON[OILA[f][1]]}</i><small>${OILA[f][0]}</small></span>`
// 5a: javondagi oilalar va bloklar — dars e'lonidan (DARS.javon; 2-darsda faqat Harakat: r, l, u, d), bo'lmasa 1-darsdagi to'plam
const PAL = DARS.javon || { h: ['r', 'l', 'j'], g: [['s', 'Salom!']] }
// 14-dars: J — ekranning o'z javoni (studiya({ javon })); berilmasa — dars javoni (PAL), chiqish avvalgidek
const ranglar = (aktiv, holat = {}, J = PAL) => `<div class="rg" data-z="ranglar">${Object.keys(J).map((f) => rang(f, (aktiv === f ? 'on ' : '') + (holat[f] || ''))).join('')}</div>`
const palitra = (f, ochiq, J = PAL) => `<div class="pl" data-z="bloklar"><small class="f-${f}">${OILA[f][0]}</small>${J[f].map((b, i) => `<div class="mbw${i >= (ochiq == null ? J[f].length : ochiq) ? ' yopiq' : ''}">${typeof b === 'string' ? mb(b) : mb(...b)}</div>`).join('')}</div>`
const dastur = (arr, yuz, iz = '') => `<div class="dst" data-z="dastur"><span class="dsb"><span class="dyz">${yuz}</span><b>Dastur</b></span>${arr.length ? yigma(arr) : '<span class="bosh">Blokni shu yerga ulang</span>'}${iz || `<small class="dsn">${arr.length} ta blok</small>`}</div>`
const momiqYuz = () => (globalThis.QAH === 'coddy' ? bust('xursand') : hero({ k: globalThis.QAH || 'momiq', lite: true }))
const coddyYuz = () => bust('xursand')
const ust = (tag, h, iz = '') => `<div class="ust" data-z="sarlavha"><span class="tag">${tag}</span><h3 class="sar">${h}</h3>${iz ? `<span class="iz">${iz}</span>` : ''}</div>`
// dunyo: null — manzarasiz (labirint butun oynani egallaydi, 99-qaror)
// dst — dastur ustunining o'zi (3-dars «oldindan ayting»: tayyor dastur sanoq yozuvlari bilan); berilmasa — dastur(prog, yuz)
// javon (14-dars) — ekranning o'z oilalari va bloklari; oila almashtirilganda studiya shu ekranning <template class="pal-t"> idan oladi
const studiya = ({ tag, h, iz, aktiv = 'h', holat, ochiq, prog, yuz, sahna, extra = '', dunyo = 'hovli', dst, javon }) => `${ust(tag, h, iz)}${ranglar(aktiv, holat, javon || PAL)}${palitra(aktiv, ochiq, javon || PAL)}${javon ? Object.keys(javon).map((f) => `<template class="pal-t" data-f="${f}">${palitra(f, undefined, javon)}</template>`).join('') : ''}${dst || dastur(prog, yuz)}<div class="oyna">${dunyo ? world(dunyo) : ''}${sahna}</div>${extra}`
const fB = ({ mas = '', hint = '', label = `${PLAY}Ishga tushir`, chap } = {}) => `<footer class="hn">${chap || `<span class="mas ${mas}">${LAMP}Maslahat</span>`}<span class="hint">${hint}</span><span class="asos">${label}</span></footer>`
const fU = (hint, label) => `<footer class="hn"><span class="orq">‹ Orqaga</span><span class="hint">${hint}</span><span class="asos">${label}</span></footer>`
// v3.2 (F-1116-01): kirishda butun kurs emas — Blok studiya modulida yasaladigan o'yinlar (rasmlari; kartalari — dars qismlarida, oyinlar)
const ichSvg = (svg, x, y, w, h) => svg.replace('<svg ', `<svg x="${x}" y="${y}" width="${w}" height="${h}" `)
const OLMA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 8c-.6-2.4-2.6-3.6-2.6-3.6" fill="none" stroke="#6B4423" stroke-width="1.7" stroke-linecap="round"/><path d="M12.6 6.6c1.4-2.4 4.4-2.4 4.4-2.4-.4 2.4-2.6 3.2-4.4 2.4z" fill="#4CB050"/><path d="M12 8.4c-1.6-1.2-7-1.6-7.8 3.8-.6 4.4 2.6 8.8 5.2 8.8 1.2 0 1.6-.6 2.6-.6s1.4.6 2.6.6c2.6 0 5.8-4.4 5.2-8.8-.8-5.4-6.2-5-7.8-3.8z" fill="#F0435A"/><ellipse cx="8.6" cy="11.8" rx="1.3" ry="2.1" fill="#fff" opacity=".5"/></svg>'
const RAKETA = '<svg viewBox="0 0 24 34" aria-hidden="true"><path d="M12 1c4.6 3.8 6.2 9.4 6.2 14.6V23H5.8v-7.4C5.8 10.4 7.4 4.8 12 1z" fill="#F4F6FB"/><circle cx="12" cy="11.5" r="3" fill="#3FA2FF" stroke="#0D2137" stroke-width="1.2"/><path d="M5.8 16.5L1.6 23v3.4l4.2-2.2zM18.2 16.5l4.2 6.5v3.4l-4.2-2.2z" fill="#FF4F28"/><path d="M8.4 23h7.2l-1.5 3.4H9.9z" fill="#0D2137"/><path d="M10 26.4h4l-2 6.4z" fill="#FFC93C"/></svg>'
const dushman = (c) => `<svg viewBox="0 0 24 20" aria-hidden="true"><path d="M6 5L4 1.6M18 5l2-3.4" stroke="${c}" stroke-width="1.8" stroke-linecap="round"/><ellipse cx="12" cy="11.5" rx="10" ry="7.4" fill="${c}"/><circle cx="8.4" cy="10.6" r="2.6" fill="#fff"/><circle cx="15.6" cy="10.6" r="2.6" fill="#fff"/><circle cx="8.9" cy="11" r="1.2" fill="#0D2137"/><circle cx="16.1" cy="11" r="1.2" fill="#0D2137"/></svg>`
const BALL = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.6l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z" fill="#FFC93C"/></svg>'
// labirint: 120x96 maydon, ikki devor; qahramon yo'l bo'ylab yulduzga boradi
const labirint = () => `<svg class="lbs" viewBox="0 0 200 96" aria-hidden="true"><rect x="2" y="2" width="196" height="92" rx="8" fill="#F4FBEF" stroke="#2E7D4F" stroke-width="4"/><path class="lb-d" d="M40 34V94M80 2V62M120 34V94M160 2V62"/><path class="lb-iz" d="M20 80V16H60V80H100V16H140V80H180V30"/><g transform="translate(169 6) scale(.92)"><path d="M12 2.6l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z" fill="#FFC93C" stroke="#E8A90C" stroke-width="1.2" stroke-linejoin="round"/></g><g class="lb-q">${ichSvg(hero({ k: 'katak', mood: 'xursand', lite: true }), -11, -13, 22, 24)}</g></svg>`

// v3.2 (F-1116-04): sinf doskasida pog'onalar — zinapoya. Har pog'ona: raqam, kichik rasm, bir qator topshiriq, nechta bola
const ODAM = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="7.6" r="4.2" fill="currentColor"/><path d="M3.6 21.4c.7-4.8 4.2-7.6 8.4-7.6s7.7 2.8 8.4 7.6z" fill="currentColor"/></svg>'
const miniYol = ({ q, y, yo = [], n = 6 }) => {
  const X = (i) => 9 + i * (82 / (n - 1)), Y = 36
  const yoy = yo.map(([a, b, c = '#FF4F28']) => { const xa = X(a), xb = X(b), h = Math.abs(b - a) > 1 ? 6 : 16, d = b > a ? 1 : -1; return `<path d="M${xa} ${Y - 4} Q${(xa + xb) / 2} ${h} ${xb} ${Y - 5}" fill="none" stroke="${c}" stroke-width="2.2" stroke-linecap="round" stroke-dasharray="3.2 3"/><path d="M${xb - 3 * d} ${Y - 10}L${xb + 0.6 * d} ${Y - 4.4}L${xb + 3.4 * d} ${Y - 11}" fill="none" stroke="${c}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>` }).join('')
  return `<svg class="mini" viewBox="0 0 100 44" aria-hidden="true">${Array.from({ length: n }, (_, i) => `<ellipse cx="${X(i)}" cy="${Y + 2}" rx="6.2" ry="2.8" fill="${i === y ? '#F3D36E' : i === q ? '#CFE0F6' : '#FFFDF7'}" stroke="${i === y ? '#C79F33' : i === q ? '#9DB7DA' : '#C8B892'}" stroke-width="1.1"/>`).join('')}${yoy}<g transform="translate(${X(y) - 6.5} ${Y - 15}) scale(.54)"><path d="M12 2.6l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z" fill="#FFC93C" stroke="#E8A90C" stroke-width="1.4" stroke-linejoin="round"/></g>${ichSvg(hero({ k: 'momiq', mood: 'xursand', lite: true }), X(q) - 8, Y - 17, 16, 18)}</svg>`
}
const bloklar9 = () => `<svg class="mini" viewBox="0 0 100 44" aria-hidden="true">${Array.from({ length: 9 }, (_, i) => `<rect x="${6 + i * 10}" y="${i < 6 ? 14 : 14}" width="8.4" height="14" rx="2" fill="${i < 6 ? '#2F8FF0' : '#7DBBFA'}"/><path d="M${8.4 + i * 10} 21h3.6" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>`).join('')}<text x="50" y="41" text-anchor="middle" font-family="JetBrains Mono, monospace" font-weight="800" font-size="9" fill="#0D2137">6 + 3</text></svg>`
// 5b-2: zinapoya ro'yxati (P) berilishi mumkin — bir darsda bir necha zinapoya (2-darsda uchta); berilmasa — dars qismlaridagi POGONA
const zina = (P = POGONA) => {
  const cx = (i) => 16 + i * 22.5, cy = (i) => 91.3 - i * 5.5
  const yoy = Array.from({ length: P.length - 1 }, (_, i) => i).map((i) => `<path d="M${(cx(i) + 5).toFixed(1)} ${(cy(i) - 1.5).toFixed(1)} Q${((cx(i) + cx(i + 1)) / 2).toFixed(1)} ${(Math.min(cy(i), cy(i + 1)) - 15).toFixed(1)} ${(cx(i + 1) - 5).toFixed(1)} ${(cy(i + 1) - 1.5).toFixed(1)}"/>`).join('')
  return P.map(([n, son, rasm, matn], i) => `<div class="gl pg-k${n === '★' ? ' yd' : ''}" style="--i:${i}" data-z="pog‘ona"><div class="pg-t"><span class="pg-n">${n}</span><span class="pg-s" aria-label="${son} bola">${ODAM}<b>${son}</b></span></div>${rasm}<span class="pg-m">${matn}</span></div>`).join('')
    + `<svg class="zina-yoy" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${yoy}</svg>`
    + P.map(([n], i) => `<span class="z pg-z${n === '★' ? ' y' : ''}" style="--i:${i}">${n === '★' ? YUL : `<b>${n}</b>`}</span>`).join('')
}

// v3.2 (38-qaror): tepada faqat dars nomi — bekat chizig'i yo'q; qayerdaligimizni reja xaritasi har bekat boshida ko'rsatadi
const bosh = () => `<header class="hb"><span class="hl"><i></i>${DARS.raqam}-dars · ${DARS.nom}</span></header>`
const NOUT = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="11" rx="1.6" fill="none" stroke="#0D2137" stroke-width="2"/><path d="M2 19h20" stroke="#0D2137" stroke-width="2.2" stroke-linecap="round"/></svg>'
const O = (n, cls = '') => `<span class="O ${cls}">${n}</span>`

// v3.3 (F-1116-08): javob kartalari rasmli — rang + belgi (karnay, sichqoncha ko'rsatkichi, buyruq strelkasi)
const PIK = {
  A: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9.4v5.2h3.3l7.4 4.4V5L6.3 9.4z" fill="#fff"/><path d="M16.6 9c.9.8 1.4 1.9 1.4 3s-.5 2.2-1.4 3M19 6.6c1.6 1.4 2.5 3.3 2.5 5.4s-.9 4-2.5 5.4" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>',
  B: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.2 3.2l12.2 7.4-5.4 1.5 3.3 6-2.7 1.5-3.3-6-4.1 3.9z" fill="#fff" stroke="#fff" stroke-width="1.2" stroke-linejoin="round"/></svg>',
  C: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h12.5M11.5 6.5L17 12l-5.5 5.5" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
}
// v3.4 (F-1116-11): «uch taxmin — uch sinov»: kartada nechta bola tanlagani (son) va sinov natijasi (✕ qimirlamadi / ✓ ishladi)
const kartalarR = (arr, cls = '', { son = {}, nat = {}, sin = '' } = {}) => `<div class="jv rasmli ${cls}">` + arr.map(([l, t]) => `<div class="jk ${SH[l]}${nat[l] ? (nat[l] === 'ok' ? ' n-ok' : ' n-yoq') : ''}${sin === l ? ' sinov' : ''}"><span class="jr ${SH[l]}">${PIK[l]}${son[l] != null ? `<span class="jr-s" aria-label="${son[l]} bola">${ODAM}${son[l]}</span>` : ''}</span><span class="jt"><span><b>${l}</b>${t}</span>${nat[l] ? `<small class="jn">${nat[l] === 'ok' ? '✓ ishladi' : '✕ qimirlamadi'}</small>` : ''}</span></div>`).join('') + '</div>'
// v4.1 (F-1116-15): savol — o'rgatish ekrani, ikki ustunda: chapda yuqoridan pastga savol → Coddy gapi → javob kartalari; o'ngda faqat sahna (sinov shu yerda bo'ladi)
const QAYSI = (javob, gap = 'Noutbukda bitta javobni tanlang.', { tag = 'Savol', h = DARS.savol, aktyor = coddyQ('', 'oylaydi', 'savol'), chapOst = '', sahna = '' } = {}) => `<div class="chap">${matn(tag, h, gap)}${javob}${chapOst}</div><div class="oyna">${world('hovli')}${sahna}${yol('p3b', aktyor)}</div>`

// v3.3 (F-1116-09/10): reja — yo'l xaritasi. Coddy start zonachasida, uch bekat (rangi — oilasi), orasida sakrash yoylari; o'tilgani oltin.
// Xarita darsda to'rt marta chiqadi (38-qaror): reja, 2-bekat boshi, 3-bekat boshi, yakun.
const YULDUZ_OQ = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.6l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z" fill="#fff"/></svg>'
const xarita = ({ otdi = 0, joy = 0, pose = 'salom', yuz = 'xursand' } = {}) => {
  const cx = (i) => 12.5 + i * 25
  const yoy = [0, 1, 2].map((i) => `<path class="${i < otdi ? 'otdi' : ''}" d="M${cx(i) + 6} 64 Q${cx(i) + 12.5} -12 ${cx(i + 1) - 6} 64"/>`).join('')
  const bekat = BEKATLAR.map(([f, nom, ik], i) => { const n = i + 1, h = n <= otdi ? 'otdi' : n === otdi + 1 ? 'hozir' : ''; return `<div class="bk bk-${f} ${h}" style="--i:${n}">${joy === n ? '' : `<span class="bk-i">${ik}</span>`}<span class="bk-z"></span><span class="bk-l">${h === 'otdi' ? '<i>✓</i>' : `<i>${n}</i>`}${nom}</span></div>` }).join('')
  return `<div class="xr"><svg class="xr-yoy" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${yoy}</svg><div class="bk bk-s" style="--i:0"><span class="bk-z"></span></div>${bekat}<div class="xr-q" style="--i:${joy}">${robot({ pose, yuz })}</div></div>`
}
// 16.11 (boshliq tanlovi, C «Tepalik»): reja — pastdan yuqoriga ko'tariladigan yo'l; cho'qqida — dars oxiridagi natija.
// otdi — o'tilgan bekatlar soni (yoyi oltin, belgisi ✓); joy — Coddy turgan joy (0 — start, 1…3 — bekat); cho — cho'qqidagi karta.
const TP = [[30, 8], [50, 22], [70, 36]]
const TP_IZ = ['M13 90 Q20 72 28 84', 'M32 82 Q40 58 48 70', 'M52 66 Q60 44 68 56', 'M72 52 Q78 40 82 46']
const tepalik = ({ otdi = 0, joy = 0, pose = 'salom', yuz = 'xursand' } = {}) => {
  const q = (cls = '') => `<span class="tp-q aktyor ${cls}">${robot({ pose, yuz })}</span>`
  const iz = `<svg class="tp-iz" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${TP_IZ.map((d, i) => `<path class="${i < otdi || (i === 3 && otdi >= 3) ? 'otdi' : ''}" d="${d}"/>`).join('')}</svg>`
  const start = `<div class="tp-st tp-s tp-start">${joy === 0 ? q('katta') : ''}<span class="tp-pl"></span></div>`
  const bekat = BEKATLAR.map(([f, nom, ik], i) => { const n = i + 1, h = n <= otdi ? 'otdi' : n === otdi + 1 ? 'hozir' : ''; return `<div class="tp-st tp-${f} ${h}" style="left:${TP[i][0]}%;bottom:${TP[i][1]}%">${joy === n ? q() : `<i>${ik}</i>`}<span class="tp-pl"></span><b><em>${h === 'otdi' ? '✓' : n}</em>${nom}</b></div>` }).join('')
  return iz + start + bekat
}
const KONFETI = () => `<div class="konfeti">${Array.from({ length: 18 }, (_, i) => `<i style="--x:${(i * 37) % 100}%;--d:${(i % 6) * 0.15}s;--r:${(i * 47) % 360}deg" class="k${i % 4}"></i>`).join('')}</div>`

// ===== v4 (16.11 tun): darsning hali chizilmagan ekranlari — kutish, qahramon tanlash, YUR!, xulosa, «Men robotman», ism va rang,
// say yozuvi, ustozning sahnasi, o'z sahnangiz (doska, joy, studiya), galereya. Hammasi o'sha to'rt shablonda.
const fKid = (hint, label) => `<footer class="hn"><span class="hint">${hint}</span><span class="asos">${label}</span></footer>`
const aktyorQ = (svg, cls = '') => `<div class="q aktyor ${cls}">${svg}</div>`
// Kutish shabloni (t4): butun ekran hovli (kechqurun yoki kunduz), tepada o'rtada bitta yozuv, qahramon yo'l qatlamida
const kutish = ({ kech = true, uq = '↑', h, sub = '', aktyor, dunyo = 'hovli', extra = '' }) => `<div class="oyna to${kech ? ' kech' : ''}">${world(dunyo)}${kech ? '<div class="parda"></div>' : ''}<div class="gl qarang" data-z="yozuv">${uq ? `<span class="uq">${uq}</span>` : ''}<b>${h}</b>${sub ? `<span>${sub}</span>` : ''}</div>${extra}${aktyor}</div>`
const yolchaYakka = (aktyor, cls = 'yk') => `<div class="yol c1 ${cls}">${aktyor}<span class="z z0 s"></span></div>`
const QAHRAMONLAR = ['momiq', 'jele', 'katak', 'yulduz', 'nihol']
const QNOM = { momiq: 'Momiq', jele: 'Jele', katak: 'Katak', yulduz: 'Zippi', nihol: 'Nihol' }
// sinf taxtasi: Coddy (ustoz) + 14 o'rin; tanlaganlar qahramoni ismsiz, qolgani bo'sh zonacha
const taxta = (son) => {
  const orin = Array.from({ length: 14 }, (_, i) => i < son ? `<span class="tx-o"><span class="aktyor tx-q">${hero({ k: QAHRAMONLAR[(i * 3) % 5], mood: 'xursand', lite: true })}</span><i class="z"></i></span>` : '<span class="tx-o bosh"><i class="z"></i></span>')
  return `<div class="taxta"><span class="tx-o tx-u"><span class="aktyor tx-q c">${robot({ pose: 'salom', yuz: 'xursand', lite: true })}</span><i class="z s"></i><small>Ustoz</small></span>${orin.join('')}</div>`
}
const tanlovQator = (tanlangan) => `<div class="tq">${QAHRAMONLAR.map((k) => `<span class="tq-o${k === tanlangan ? ' on' : ''}"><span class="aktyor tq-q">${hero({ k, mood: 'xursand', mv: k === tanlangan ? 'sakraydi' : undefined })}</span><i class="z${k === tanlangan ? ' y' : ''}"></i><small>${QNOM[k]}</small></span>`).join('')}</div>`
const olchagich = (foiz) => `<div class="olch" role="img" aria-label="Sinf ovozi ${foiz} foiz"><small>Sinf ovozi</small><span class="olch-b"><i style="width:${foiz}%"></i></span></div>`
const YURPUF = `<div class="yurp" aria-hidden="true">${[[18, 0], [42, .5], [66, 1], [30, 1.4], [56, 1.9]].map(([x, d]) => `<span style="--x:${x}%;--d:${d}s">YUR!</span>`).join('')}</div>`
const BUYRUQ = (t) => `<div class="buy"><span class="buy-b">${yigma([t])}</span></div>`
const RANGLAR8 = ['#FF7A59', '#F5B82E', '#38C793', '#3FA2FF', '#8B5CF6', '#FF5FA2', '#0D2137', '#A7ABB4']
const JOYLAR = [['hovli', 'Hovli'], ['kosmos', 'Kosmos'], ['suv', 'Suv osti']]
const joyKarta = (k, nom, { on = false, son, qq = [] } = {}) => `<div class="gl jy${on ? ' on' : ''}"><div class="jy-r">${world(k, true)}${qq.length ? `<span class="jy-qq">${qq.map((h) => `<i>${hero({ k: h, mood: 'xursand', lite: true })}</i>`).join('')}</span>` : ''}</div><b>${nom}</b>${son != null ? `<span class="pg-s jy-s" aria-label="${son} bola">${ODAM}<b>${son}</b></span>` : ''}</div>`
const SHIK = { jump: IKON.j, joy: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" fill="#fff"/><circle cx="12" cy="9.5" r="2.6" fill="#38C793"/></svg>', blok: IKON.r, gap: IKON.s }
const shartlar = (bajarildi = {}, qisqa = false) => `<div class="sh-l">${SHART.map(([k, t, q]) => `<span class="sh-r sh-${k}${bajarildi[k] ? ' ok' : ''}"><i>${SHIK[k]}</i>${qisqa ? q : t}${bajarildi[k] ? '<b>✓</b>' : ''}</span>`).join('')}</div>`
const zippiQ = (pose = 'xursand', mv) => `<div class="q kichik aktyor">${hero({ k: globalThis.QAH || 'yulduz', mood: pose, mv })}</div>`
const KURSOR = '<span class="kursor-q" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M6.2 3.2l12.2 7.4-5.4 1.5 3.3 6-2.7 1.5-3.3-6-4.1 3.9z" fill="#0D2137" stroke="#fff" stroke-width="1.4" stroke-linejoin="round"/></svg></span>'
const yulduzlar14 = (n) => `<div class="yulduzlar">${Array.from({ length: 14 }, (_, i) => `<i class="${i < n ? 'on' : ''}">${ODAM}</i>`).join('')}</div>`
// olma yo'lning o'zida: zonachasi ustida (yol(...) qatoriga grid elementi bo'lib qo'shiladi)
const yolOlma = (cls, aktyor, n, star, olma) => yol(cls, aktyor, n, star).replace(/<\/div>$/, `<span class="olma-z" style="grid-column:${olma + 1}">${OLMA}</span></div>`)
const sinfNatija = (T = SINF_T) => `<div class="sn">${T.map(([f, ik, nom, son]) => `<div class="sn-t sn-${f}" data-k="${nom}"><i>${ik}</i><span><b>${son}</b><small>${nom}</small></span></div>`).join('')}</div>`

// Katak sahnasi (labirint) — chizma (dvigatel 5a, 19.11; KONSEPSIYA 99-qaror: tepadan qaralgan bog'). Faqat satr qaytaradi, DOM'ga tegmaydi.
// yigish.mjs bu faylni IKKI joyga qo'shadi: chizuvchiga (ekranlar oldindan chiziladi) va brauzer skriptiga (sahna.js katak markazlarini shu yerdan oladi;
// sinov ham labirintni shu funksiya bilan chizadi). Ikki joyda ham bitta fayl — labirint manbasi bitta.
// Xarita — qatorlar ro'yxati, tepadan pastga: '#' buta (devor), '.' yo'lka, 'S' start, '*' yulduz, 'K' kalit, 'E' eshik (kalitsiz yopiq).
// Butun labirint bitta SVG (viewBox — katak 100 birlik): oynaga o'zi sig'adi, o'lchash kerak emas. url(#…) havola ishlatilmaydi — ustoz va
// bola oynasi yonma-yon ochilganda bir xil nom ikki marta bo'ladi va yashirin oynadagi gradient yo'qolishi mumkin.
// Qahramon — .kt-q guruhi (sahna.js uni transform bilan katakdan katakka suradi); uning ichida kalit belgisi (kalit olinganda ko'rinadi).
const KT = 100, KT_CHET = 22
function katakXarita(x) { return Array.isArray(x) ? x : String(x || '').split('|') }
function katakTop(xr, belgi) { for (let y = 0; y < xr.length; y++) { const x = xr[y].indexOf(belgi); if (x >= 0) return [x, y] } return null }
// qahramon katak markazidan: oyog'i markazdan biroz pastda, boshi tepadagi katakka biroz chiqadi
function katakJoy(x, y) { return 'translate(' + (x * KT + 10) + 'px,' + (y * KT - 14) + 'px)' }
const KT_YULDUZ = 'M0,-1 L.29,-.4 .95,-.31 .48,.15 .59,.81 0,.5 -.59,.81 -.48,.15 -.95,-.31 -.29,-.4Z'
const KT_KALIT = '<g class="kt-kb"><circle cx="-9" cy="0" r="9" fill="#F5B82E" stroke="#B9800C" stroke-width="3"/><circle cx="-9" cy="0" r="3.4" fill="#FBF0D2"/><path d="M0 -3.2H20V3.2H0Z M12 3.2V10H17V3.2Z" fill="#F5B82E" stroke="#B9800C" stroke-width="2.4" stroke-linejoin="round"/></g>'
// buta (devor), kalit va eshik chizmasi — katak labirinti va maydon (9-dars) uchun bitta manba; x, y — ichki katak (qator tepadan)
const ktButa = (X, Y) => '<g transform="translate(' + X + ' ' + Y + ')"><rect x="4" y="5" width="92" height="90" rx="30" fill="#3E8E4E"/>'
  + '<circle cx="31" cy="34" r="15" fill="#4FA35D"/><circle cx="67" cy="38" r="14" fill="#4FA35D"/><circle cx="36" cy="68" r="14" fill="#47995A"/><circle cx="68" cy="70" r="13" fill="#47995A"/>'
  + '<circle cx="30" cy="27" r="7" fill="#8CD48F" opacity=".6"/><path d="M14 80Q50 98 86 80" fill="none" stroke="#2E6E3C" stroke-width="5" stroke-linecap="round" opacity=".45"/></g>'
const ktKalit = (x, y) => '<g class="kt-kalit" data-k="' + x + ',' + y + '" transform="translate(' + (x * KT + 52) + ' ' + (y * KT + 54) + ') rotate(-24) scale(1.5)">' + KT_KALIT + '</g>'
const ktEshik = (x, y) => '<g class="kt-eshik" data-k="' + x + ',' + y + '" transform="translate(' + x * KT + ' ' + y * KT + ')"><g class="kt-ev"><rect x="8" y="10" width="84" height="80" rx="8" fill="#B5793F" stroke="#7A4B22" stroke-width="4"/>'
  + '<path d="M29 12V88M50 12V88M71 12V88" stroke="#8E5A2B" stroke-width="5"/><rect x="38" y="40" width="24" height="22" rx="5" fill="#E7CA66" stroke="#7A4B22" stroke-width="3"/><path d="M43 41V35A7 7 0 0 1 57 35V41" fill="none" stroke="#7A4B22" stroke-width="3.4"/><circle cx="50" cy="50" r="3.2" fill="#7A4B22"/></g></g>'
function katakHtml(xarita, o) {
  o = o || {}
  const xr = katakXarita(xarita), kr = xr.length, kq = Math.max(...xr.map((s) => s.length))
  const s = katakTop(xr, 'S') || [0, kr - 1]
  const W = kq * KT, H = kr * KT, c = (x, y) => (xr[y] || '')[x] || '#'
  let yol = '', buta = '', narsa = ''
  for (let y = 0; y < kr; y++) for (let x = 0; x < kq; x++) {
    const b = c(x, y), X = x * KT, Y = y * KT
    if (b === '#') { buta += ktButa(X, Y); continue }
    const fon = b === 'S' ? '#D6E8FA' : b === '*' ? '#F8E3A0' : '#F7EACB'
    yol += '<rect class="kt-c" data-k="' + x + ',' + y + '" x="' + (X + 4) + '" y="' + (Y + 4) + '" width="92" height="92" rx="18" fill="' + fon + '"/>'
      + '<ellipse cx="' + (X + 26) + '" cy="' + (Y + 30) + '" rx="4" ry="2.8" fill="#C9AE78" opacity=".35"/><ellipse cx="' + (X + 70) + '" cy="' + (Y + 66) + '" rx="4.4" ry="3" fill="#C9AE78" opacity=".35"/><ellipse cx="' + (X + 50) + '" cy="' + (Y + 52) + '" rx="3" ry="2" fill="#C9AE78" opacity=".3"/>'
    if (b === '*') narsa += '<g class="kt-yul" transform="translate(' + (X + 50) + ' ' + (Y + 52) + ') scale(30)"><path d="' + KT_YULDUZ + '" fill="#F5B82E" stroke="#C98A0E" stroke-width=".07" stroke-linejoin="round"/></g>'
    if (b === 'K') narsa += ktKalit(x, y)
    if (b === 'E') narsa += ktEshik(x, y)
  }
  return '<div class="katak" data-z="sahna" data-xarita="' + xr.join('|') + '">'
    + '<svg class="kt" viewBox="' + (-KT_CHET) + ' ' + (-KT_CHET) + ' ' + (W + 2 * KT_CHET) + ' ' + (H + 2 * KT_CHET) + '" preserveAspectRatio="xMidYMid meet" aria-hidden="true">'
    + '<rect x="' + (-KT_CHET / 2) + '" y="' + (-KT_CHET / 2) + '" width="' + (W + KT_CHET) + '" height="' + (H + KT_CHET) + '" rx="26" fill="#9AD57C" opacity=".55"/>'
    + yol + '<g class="kt-iz"></g>' + narsa + '<g class="kt-butalar">' + buta + '</g>'
    // qahramon o'z SVG'si bilan (sinfi saqlanadi — nafas, ko'z qisish harakati); o'lchami uslubda: .katak .kt-q > svg
    + '<g class="kt-q" style="transform:' + katakJoy(s[0], s[1]) + '">' + (o.aktyor || '').replace('<svg ', '<svg x="0" y="0" width="80" height="88" ')
    + '<g class="kt-qk" transform="translate(70 66) rotate(-24) scale(1.05)">' + KT_KALIT + '</g></g>'
    + '</svg></div>'
}

// ===== Maydon (3-dars, 20.11; manba 003-koordinata «Maydon va manzillar») — katak sahnasining devorsiz turi, X va Y o'qlari bilan =====
// Koordinata (x, y): boshi pastki chap katak (0, 0), X o'ngga, Y TEPAGA. Ichkarida (data-k, sahna.js) — katak.js tartibi: ustun va qator (tepadan pastga);
// aylantirish: qator = bo'y - 1 - y. Xarita belgilari: '.' yo'lka, 'S' start, '*' yulduz, 'O' olma — devor yo'q, maydondan tashqari — chet.
// m = { w, h, start: [x, y], yulduz: [x, y] | null, yashirin, olma: [[x, y]…], daraxt: [[x, y]…], gul: [[x, y]…], belgi: [[x, y, kostyum]…] (7-dars) } — hammasi (x, y) da.
// o.kostyum (7-dars) — { xotirjam: svg, xursand: svg, … }: qahramonning hamma kostyumi oldindan chiziladi, faqat bittasi ko'rinadi (sahna.js kostyumKor)
function mdKostyumlar(ks) { return Object.keys(ks).map((n, i) => '<g class="kos" data-kos="' + n + '"' + (i ? ' style="display:none"' : '') + '>' + ks[n].replace('<svg ', '<svg x="0" y="0" width="80" height="88" ') + '</g>').join('') }
// o = { aktyor, joy: [x, y] (qahramon startda bo'lmasa), yorliqsiz, yorliqR (yorliq shu raqamda yonadi), izlar (move yo'li — katakma-katak), goIz (go to manzillari), bant: [{ ust: x, r } | { qat: y, r } | { kes: [x, y], r }], bayroq: [x, y], yon: [[x, y]…], izlar: [[x, y]…] }
//   bant — o'qqacha yonadigan ustun/qator, kesishgan katak yoki butun o'q ({ oqX: true } / { oqY: true }); r bo'lsa — data-r (studiya.js «raqam» ishi
//          birma-bir yoqadi), bo'lmasa doim ko'rinadi. O'q soni ham shu bant bilan birga oltin bo'ladi (eng kichik r). yon — huk kartasi yoqqan kataklar
const MD_CH = 74, MD_TEPA = 62, MD_ONG = 96 // chapda Y sonlari, pastda X sonlari, tepada «Y ↑», o'ngda «X →»
const mdQ = (m, y) => m.h - 1 - y // y → ichki qator
function maydonXarita(m) {
  const r = Array.from({ length: m.h }, () => Array(m.w).fill('.'))
  ;(m.olma || []).forEach(([x, y]) => { r[mdQ(m, y)][x] = 'O' })
  ;(m.oltin || []).forEach(([x, y]) => { r[mdQ(m, y)][x] = 'G' }) // 11-dars: oltin olma
  ;(m.kaktus || []).forEach(([x, y]) => { r[mdQ(m, y)][x] = 'C' }) // 12-dars: kaktus (o'tib bo'lmaydi, tegsa — hodisa)
  ;(m.devor || []).forEach(([x, y]) => { r[mdQ(m, y)][x] = '#' }) // 9-dars: labirint maydonda — devor, kalit, eshik
  if (m.kalit) r[mdQ(m, m.kalit[1])][m.kalit[0]] = 'K'
  if (m.eshik) r[mdQ(m, m.eshik[1])][m.eshik[0]] = 'E'
  if (m.yulduz) r[mdQ(m, m.yulduz[1])][m.yulduz[0]] = '*'
  if (m.start) r[mdQ(m, m.start[1])][m.start[0]] = 'S'
  return r.map((q) => q.join('')).join('|')
}
// 10-dars: xarita satri (tepadan pastga, '#' '.' 'S' '*' 'K' 'E') → maydon e'loni (maydonHtml) — labirint yasash va darajalar brauzerda qayta chiziladi
function mdXaritaM(s) {
  const r = katakXarita(s), h = r.length, m = { w: Math.max(...r.map((q) => q.length)), h, start: [0, 0], devor: [], labirint: true }
  r.forEach((q, i) => [...q].forEach((c, x) => { const y = h - 1 - i; if (c === '#') m.devor.push([x, y]); if (c === '*') m.yulduz = [x, y]; if (c === 'K') m.kalit = [x, y]; if (c === 'E') m.eshik = [x, y]; if (c === 'S') m.start = [x, y] }))
  return m
}
const MD_DARAXT = '<ellipse cx="0" cy="34" rx="30" ry="9" fill="#2E6E3C" opacity=".22"/><rect x="-6" y="6" width="12" height="28" rx="5" fill="#8A5A2E"/>'
  + '<circle cx="0" cy="-10" r="27" fill="#3E8E4E"/><circle cx="-15" cy="2" r="17" fill="#47995A"/><circle cx="15" cy="0" r="18" fill="#4FA35D"/><circle cx="-8" cy="-22" r="10" fill="#8CD48F" opacity=".55"/>'
const MD_GUL = (c) => '<circle r="5.5" fill="' + c + '"/><circle cx="-7" cy="0" r="5" fill="' + c + '"/><circle cx="7" cy="0" r="5" fill="' + c + '"/><circle cx="0" cy="-7" r="5" fill="' + c + '"/><circle cx="0" cy="7" r="5" fill="' + c + '"/><circle r="3.6" fill="#FFE08A"/>'
const MD_OLMA = '<g transform="translate(-24 -26) scale(2.1)"><path d="M12 8c-.6-2.4-2.6-3.6-2.6-3.6" fill="none" stroke="#6B4423" stroke-width="1.7" stroke-linecap="round"/><path d="M12.6 6.6c1.4-2.4 4.4-2.4 4.4-2.4-.4 2.4-2.6 3.2-4.4 2.4z" fill="#4CB050"/><path d="M12 8.4c-1.6-1.2-7-1.6-7.8 3.8-.6 4.4 2.6 8.8 5.2 8.8 1.2 0 1.6-.6 2.6-.6s1.4.6 2.6.6c2.6 0 5.8-4.4 5.2-8.8-.8-5.4-6.2-5-7.8-3.8z" fill="#F0435A"/><ellipse cx="8.6" cy="11.8" rx="1.3" ry="2.1" fill="#fff" opacity=".5"/></g>'
// 11-dars: oltin olma — o'sha olma, oltin rangda, yaltirash bilan (oddiy olmadek teriladi: .kt-olma)
const MD_OLMA_G = MD_OLMA.replace('fill="#F0435A"', 'fill="#F5B82E" stroke="#C98A0E" stroke-width=".7"').replace('</g>', '<path d="M17.6 3.2l.7 1.6 1.6.7-1.6.7-.7 1.6-.7-1.6-1.6-.7 1.6-.7z" fill="#FFF6C9"/></g>')
// 12-dars: kaktus — yashil, ikki qo'li, tikanlari; tuvakda
const MD_KAKTUS = '<g class="kt-kak-r"><ellipse cx="0" cy="38" rx="24" ry="6" fill="#2E6E3C" opacity=".22"/><path d="M-15 24h30l-4 14h-22z" fill="#C46A3A"/><rect x="-17" y="20" width="34" height="7" rx="2.5" fill="#D98250"/>'
  + '<rect x="-9" y="-30" width="18" height="52" rx="9" fill="#3FA65A"/><path d="M-9 2h-8a7 7 0 0 1-7-7v-12" stroke="#3FA65A" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M9 -6h8a7 7 0 0 0 7-7v-10" stroke="#3FA65A" stroke-width="9" fill="none" stroke-linecap="round"/>'
  + '<path d="M-3 -22l-4-2M3 -12l4-2M-3 -2l-4-2M3 8l4-2M-3 14l-4-2M-24 -14l-4-1M24 -18l4-1" stroke="#1F6B33" stroke-width="2" stroke-linecap="round"/><path d="M-2 -26v44" stroke="#5CC478" stroke-width="3" stroke-linecap="round" opacity=".55"/></g>'
// 13-dars: savat — yerda kichik to'qima savat (olma tushishi kerak bo'lgan katak); g — guruh raqami (8 · ★: «1», «2»)
const MD_SAVAT = '<g class="kt-savat-r"><ellipse cx="0" cy="30" rx="30" ry="7" fill="#6B4A2B" opacity=".18"/><path d="M-30 4h60l-7 26h-46z" fill="#C9955A" stroke="#8A5A2E" stroke-width="2.4" stroke-linejoin="round"/><path d="M-27 13h54M-25 21h50M-14 5l-3 24M0 5v24M14 5l3 24" stroke="#8A5A2E" stroke-width="1.6" opacity=".55"/><path d="M-24 4c4-14 44-14 48 0" fill="none" stroke="#8A5A2E" stroke-width="3" stroke-linecap="round"/></g>'
const MD_BAYROQ = '<g class="kt-bayroq"><path d="M-10 34V-36" stroke="#5A3B1E" stroke-width="5" stroke-linecap="round"/><path d="M-8 -36L30 -24L-8 -10Z" fill="#FF4F28" stroke="#C7381A" stroke-width="2.4" stroke-linejoin="round"/><ellipse cx="-10" cy="35" rx="10" ry="3.6" fill="#5A3B1E" opacity=".3"/></g>'
const mdYorliq = (x, y) => '(' + x + ', ' + y + ')'
function maydonHtml(m, o) {
  o = o || {}
  const W = m.w * KT, H = m.h * KT, s = m.start || [0, 0]
  let yol = '', bezak = '', narsa = '', bant = ''
  // 9-dars (m.devor): labirint maydon — butalar devor, qolgan kataklar 2- va 8-darsdagi toshli yo'lka (start — ko'kish, yulduz — oltin)
  const lab = !!(m.labirint || (m.devor && m.devor.length)), dv = (x, y) => (m.devor || []).some(([a, c]) => a === x && c === y)
  let buta = ''
  for (let q = 0; q < m.h; q++) for (let x = 0; x < m.w; x++) {
    const X = x * KT, Y = q * KT, y = m.h - 1 - q
    if (lab && dv(x, y)) { buta += ktButa(X, Y); continue }
    const fon = lab ? (x === s[0] && y === s[1] ? '#D6E8FA' : m.yulduz && x === m.yulduz[0] && y === m.yulduz[1] ? '#F8E3A0' : '#F7EACB') : (x + y) % 2 ? '#F7EACB' : '#F3E3BE', rs = (m.rasm || []).some(([a, c]) => a === x && c === y)
    yol += '<rect class="kt-c' + (rs ? ' md-rasm' : '') + '" data-k="' + x + ',' + q + '" x="' + (X + 4) + '" y="' + (Y + 4) + '" width="92" height="92" rx="18" fill="' + fon + '"/>'
    if (lab) yol += '<ellipse cx="' + (X + 26) + '" cy="' + (Y + 30) + '" rx="4" ry="2.8" fill="#C9AE78" opacity=".35"/><ellipse cx="' + (X + 70) + '" cy="' + (Y + 66) + '" rx="4.4" ry="3" fill="#C9AE78" opacity=".35"/><ellipse cx="' + (X + 50) + '" cy="' + (Y + 52) + '" rx="3" ry="2" fill="#C9AE78" opacity=".3"/>'
  }
  if (m.kalit) narsa += ktKalit(m.kalit[0], mdQ(m, m.kalit[1]))
  if (m.eshik) narsa += ktEshik(m.eshik[0], mdQ(m, m.eshik[1]))
  ;(m.gul || []).forEach(([x, y], i) => { bezak += '<g transform="translate(' + (x * KT + 78) + ' ' + (mdQ(m, y) * KT + 80) + ') scale(.9)">' + MD_GUL(['#F07AA8', '#FFFFFF', '#B58CF5'][i % 3]) + '</g>' })
  // 7-dars: kostyum belgisi — katakda kostyum nomi (qahramon shu katakdan shu kostyumda chiqishi kerak)
  ;(m.belgi || []).forEach(([x, y, nom]) => { bezak += '<g class="md-belgi" transform="translate(' + (x * KT + 50) + ' ' + (mdQ(m, y) * KT + 84) + ')"><rect x="-40" y="-13" width="80" height="26" rx="13"/><text y="6">' + (nom === 'oylanadi' ? 'o‘ylanadi' : nom) + '</text></g>' })
  ;(m.daraxt || []).forEach(([x, y]) => { bezak += '<g class="md-d" transform="translate(' + (x * KT + 30) + ' ' + (mdQ(m, y) * KT + 34) + ') scale(.78)">' + MD_DARAXT + '</g>' })
  ;(m.savat || []).forEach(([x, y, g]) => { bezak += '<g class="kt-savat" data-k="' + x + ',' + mdQ(m, y) + '" transform="translate(' + (x * KT + 50) + ' ' + (mdQ(m, y) * KT + 56) + ')">' + MD_SAVAT + (g ? '<g class="kt-sg" transform="translate(26 -30)"><circle r="13"/><text y="6">' + g + '</text></g>' : '') + '</g>' })
  ;(m.kaktus || []).forEach(([x, y]) => { narsa += '<g class="kt-kaktus" data-k="' + x + ',' + mdQ(m, y) + '" transform="translate(' + (x * KT + 50) + ' ' + (mdQ(m, y) * KT + 48) + ')">' + MD_KAKTUS + '</g>' })
  ;(m.oltin || []).forEach(([x, y]) => { narsa += '<g class="kt-olma oltin" data-k="' + x + ',' + mdQ(m, y) + '" transform="translate(' + (x * KT + 50) + ' ' + (mdQ(m, y) * KT + 52) + ')">' + MD_OLMA_G + '</g>' })
  ;(m.olma || []).forEach(([x, y]) => { narsa += '<g class="kt-olma" data-k="' + x + ',' + mdQ(m, y) + '" transform="translate(' + (x * KT + 50) + ' ' + (mdQ(m, y) * KT + 52) + ')">' + MD_OLMA + '</g>' })
  if (m.yulduz) narsa += '<g class="kt-yul' + (m.yashirin ? ' yashirin' : '') + '" transform="translate(' + (m.yulduz[0] * KT + 50) + ' ' + (mdQ(m, m.yulduz[1]) * KT + 52) + ') scale(30)"><path d="' + KT_YULDUZ + '" fill="#F5B82E" stroke="#C98A0E" stroke-width=".07" stroke-linejoin="round"/></g>'
  ;(o.yon || []).forEach(([x, y]) => { narsa += '<rect class="md-yon" x="' + (x * KT + 6) + '" y="' + (mdQ(m, y) * KT + 6) + '" width="88" height="88" rx="16"/>' })
  if (o.bayroq) narsa += '<g class="md-bq" transform="translate(' + (o.bayroq[0] * KT + 50) + ' ' + (mdQ(m, o.bayroq[1]) * KT + 52) + ')">' + MD_BAYROQ + '</g>'
  // o'qqacha yonadigan bantlar: ustun — katakdan pastdagi X soniga, qator — katakdan chapdagi Y soniga
  const nR = { x: {}, y: {} }, nQoy = (o2, i, r) => { if (r == null) r = 0; if (nR[o2][i] == null || r < nR[o2][i]) nR[o2][i] = r }
  ;(o.bant || []).forEach((b) => {
    const r = b.r != null ? ' data-r="' + b.r + '"' : ''
    if (b.oqX) { bant += '<rect class="md-bant md-oqb"' + r + ' x="-8" y="' + (H + 14) + '" width="' + (W + 16) + '" height="52" rx="26"/>'; for (let i = 0; i < m.w; i++) nQoy('x', i, b.r) }
    if (b.oqY) { bant += '<rect class="md-bant md-oqb"' + r + ' x="-62" y="-8" width="52" height="' + (H + 16) + '" rx="26"/>'; for (let i = 0; i < m.h; i++) nQoy('y', i, b.r) }
    if (b.ust != null) nQoy('x', b.ust, b.r)
    if (b.qat != null) nQoy('y', b.qat, b.r)
    if (b.ust != null) { const q0 = b.dan != null ? mdQ(m, b.dan) : 0; bant += '<rect class="md-bant"' + r + ' x="' + (b.ust * KT + 14) + '" y="' + (q0 * KT + 14) + '" width="72" height="' + (H - q0 * KT + 40) + '" rx="36"/>' }
    if (b.qat != null) { const x1 = b.gacha != null ? b.gacha : m.w - 1; bant += '<rect class="md-bant"' + r + ' x="' + (-52) + '" y="' + (mdQ(m, b.qat) * KT + 14) + '" width="' + (x1 * KT + 86 + 52) + '" height="72" rx="36"/>' }
    // kes.yur (4-dars, 5-qadam) — raqam yonganda qahramon shu katakka bir sakraydi (studiya.js raqamBosish); yorlig'ini qahramon o'zi ko'rsatadi
    if (b.kes && b.yur) bant += '<g class="md-kes"' + r + ' data-yur="' + b.kes[0] + ',' + b.kes[1] + '" transform="translate(' + (b.kes[0] * KT + 50) + ' ' + (mdQ(m, b.kes[1]) * KT + 52) + ')"><rect x="-46" y="-46" width="92" height="92" rx="18"/></g>'
    else if (b.kes) bant += '<g class="md-kes"' + r + ' transform="translate(' + (b.kes[0] * KT + 50) + ' ' + (mdQ(m, b.kes[1]) * KT + 52) + ')"><rect x="-46" y="-46" width="92" height="92" rx="18"/>' + (b.yulduz ? '<path transform="scale(30)" d="' + KT_YULDUZ + '" fill="#F5B82E" stroke="#C98A0E" stroke-width=".07"/>' : '') + '<g class="md-kt" transform="translate(0 ' + (b.past ? 60 : -58) + ')"><rect x="-46" y="-17" width="92" height="34" rx="17"/><text y="9">' + mdYorliq(b.kes[0], b.kes[1]) + '</text></g></g>'
  })
  // o'qlar: X sonlari pastda (har ustun ro'parasida), Y sonlari chapda; «X →» o'ngda, «Y ↑» tepada. Sonlar ham data-n bilan (bant yoqqanda oltin bo'ladi)
  let oq = '<g class="md-oq">'
  for (let x = 0; x < m.w; x++) oq += '<text class="md-n md-nx' + (nR.x[x] === 0 ? ' on' : '') + '"' + (nR.x[x] ? ' data-r="' + nR.x[x] + '"' : '') + ' data-x="' + x + '" x="' + (x * KT + 50) + '" y="' + (H + 50) + '">' + x + '</text>'
  for (let y = 0; y < m.h; y++) oq += '<text class="md-n md-ny' + (nR.y[y] === 0 ? ' on' : '') + '"' + (nR.y[y] ? ' data-r="' + nR.y[y] + '"' : '') + ' data-y="' + y + '" x="' + (-36) + '" y="' + (mdQ(m, y) * KT + 64) + '">' + y + '</text>'
  oq += '<text class="md-ax" x="' + (W + 22) + '" y="' + (H + 50) + '">X →</text><text class="md-ax" x="' + (-36) + '" y="' + (-24) + '">Y ↑</text></g>'
  // oldindan chizilgan yo'l: izlar — move yo'li (katakma-katak, nuqtali; kataklar hoshiyali), goIz — go to manzillari (to'g'ri punktir)
  let iz = ''
  const chiz = (p, cls) => p.slice(1).forEach(([x, y], i) => { const [a, b] = p[i]; iz += '<line class="kt-il' + cls + '" x1="' + (a * KT + 50) + '" y1="' + (mdQ(m, b) * KT + 52) + '" x2="' + (x * KT + 50) + '" y2="' + (mdQ(m, y) * KT + 52) + '"/>' })
  if (o.izlar) { chiz(o.izlar, ''); o.izlar.forEach(([x, y]) => { yol = yol.replace('class="kt-c" data-k="' + x + ',' + mdQ(m, y) + '"', 'class="kt-c iz" data-k="' + x + ',' + mdQ(m, y) + '"') }) }
  if (o.goIz) chiz(o.goIz, ' kt-gl')
  const q = o.joy || s
  return '<div class="katak maydon" data-z="sahna" data-xarita="' + maydonXarita(m) + '" data-start="' + s.join(',') + '">'
    + '<svg class="kt" viewBox="' + (-MD_CH) + ' ' + (-MD_TEPA) + ' ' + (W + MD_CH + MD_ONG) + ' ' + (H + MD_TEPA + 74) + '" preserveAspectRatio="xMidYMid meet" aria-hidden="true">'
    + '<rect x="-11" y="-11" width="' + (W + 22) + '" height="' + (H + 22) + '" rx="26" fill="#9AD57C" opacity=".55"/>'
    + yol + bant + bezak + '<g class="kt-iz">' + iz + '</g>' + narsa + (buta ? '<g class="kt-butalar">' + buta + '</g>' : '') + oq
    + '<g class="kt-q" style="transform:' + katakJoy(q[0], mdQ(m, q[1])) + '">' + (o.kostyum ? mdKostyumlar(o.kostyum) : (o.aktyor || '').replace('<svg ', '<svg x="0" y="0" width="80" height="88" '))
    + (o.yorliqsiz ? '' : '<g class="kt-yr" transform="translate(40 101)"' + (o.yorliqR ? ' data-r="' + o.yorliqR + '"' : '') + '><rect x="-38" y="-15" width="76" height="30" rx="15"/><text y="7">' + mdYorliq(q[0], q[1]) + '</text></g>')
    + (m.kalit ? '<g class="kt-qk" transform="translate(70 66) rotate(-24) scale(1.05)">' + KT_KALIT + '</g>' : '')
    + '</g></svg></div>'
}

// 23-dars «Demo Day №1» — darsning o'z ekran bo'laklari (22.11). Manba: new-junior/manba/023-demo-day-1.md. 18–22-dars qismlarining davomi.
// 18-dars qismlarining davomi: «Kosmos» maydoni, raketa (oynachasida qahramon), o'q, dushman, uch personaj kartasi, kapsulalar.
// Yangisi — kod: statik kod qutisi (kodK — kod.js dagi .kodp ko'rinishida), zinapoya uchun kod rasmi (kodRasm). Kod oynasining o'zini dvigatel chizadi (kod.js).
const MB = { w: 7, h: 5, daraxt: [], gul: [] }
const md = (m = {}) => ({ ...MB, start: [3, 0], ...m })
const raketa = (yuz) => `<svg viewBox="0 0 80 88" aria-hidden="true"><path d="M40 3c14 11 19 28 19 44v22H21V47C21 31 26 14 40 3z" fill="#F4F6FB"/><path d="M21 50L7 67v10l14-7zM59 50l14 17v10l-14-7z" fill="#FF4F28"/><path d="M28 69h24l-4 8H32z" fill="#0D2137"/><path d="M33 77h14l-7 10z" fill="#FFC93C"/><circle cx="40" cy="37" r="14" fill="#3FA2FF" stroke="#0D2137" stroke-width="3"/>${yuz.replace('<svg ', '<svg x="29" y="25" width="22" height="24" ')}</svg>`
const coddyK = () => raketa(robot({ pose: 'turadi', yuz: 'xursand' }))
const qahK = () => raketa(globalThis.QAH === 'coddy' ? robot({ pose: 'turadi', yuz: 'xursand' }) : hero({ k: globalThis.QAH || 'momiq', mood: 'xursand' }))
const OQ_SVG = '<svg viewBox="0 0 24 20" aria-hidden="true"><rect x="9.2" y="1" width="5.6" height="15" rx="2.8" fill="#FFC93C"/><rect x="10.7" y="3" width="2.6" height="9.5" rx="1.3" fill="#FFF6D6"/><path d="M9.6 16h4.8L12 19.6z" fill="#FF8A3C"/></svg>'
const DUSH_R = '#8B5CF6'
const DUSH_SVG = dushman(DUSH_R)
DARS.klonSvg = OQ_SVG // klon.js: o'q nusxalari rasmi
DARS.dushSvg = DUSH_SVG // kosmik.js: dushman (asl va nusxalar)
const OQ = (cls = '') => `<span class="oqr ${cls}">${OQ_SVG}</span>` // oqr — o'q rasmi; «oq» shablon.html dagi uchayotgan o'q (absolute, animatsiya) bilan to'qnashardi (22.11)
const DUSH = (cls = '') => `<span class="dsh ${cls}">${DUSH_SVG}</span>`
const RAK = (yuz = robot({ pose: 'turadi', yuz: 'xursand' }), cls = '') => `<span class="rak ${cls}">${raketa(yuz)}</span>`
DARS.perRasm = { raketa: `<span class="rak">${raketa('<svg></svg>')}</span>`, oq: OQ(), dushman: DUSH() }
// maydon: dushman (asli tepada, nusxalari), o'qlar — dvigateldagi .kt-asl / .kt-klon bilan bir xil chizma
const kG = (cls, x, y, svg) => `<g class="${cls}" style="transform:${katakJoy(x, MB.h - 1 - y)}">${svg.replace('<svg ', '<svg x="4" y="18" width="72" height="62" ')}</g>`
const maydon = (m, aktyor, { asl = null, dush = [], oq = [] } = {}) => maydonHtml(md(m), { aktyor }).replace('class="katak maydon', 'class="katak maydon kosmos')
  .replace('<g class="kt-q"', (asl ? kG('kt-asl ks-d', asl[0], asl[1], DUSH_SVG) : '') + dush.map(([x, y]) => kG('kt-klon ks-d', x, y, DUSH_SVG)).join('') + oq.map(([x, y]) => kG('kt-klon', x, y, OQ_SVG)).join('') + '<g class="kt-q"')
// sahnadagi sonlar (12-dars kapsulalari): ball, jon — dasturda ishlatilgani ko'rinadi (studiya.js ozgKorinsin)
const OZG = ['ball', 'jon']
const ozgQ = (v = {}, doim = '') => `<div class="gl ball-q" data-z="o‘zgaruvchilar"${doim ? ` data-doim="${doim}"` : ''}>${OZG.map((n) => `<span class="ball-k${n in v ? '' : ' yoq'}" data-v="${n}"><small>${n}:</small><b>${v[n] || 0}</b></span>`).join('')}</div>`
const sanoqK = (n = 0) => `<span class="gl kl-son">Dushman: ${n}</span>`
const tugadiT = () => '<span class="gl oyin-tugadi">O‘yin tugadi</span>'

// dastur ustuni: uch personaj kartasi
const PER = [['raketa', 'Raketa'], ['oq', 'O‘q'], ['dushman', 'Dushman']]
const perQ = (cur = 'dushman') => `<div class="per-q per-3">${PER.map(([id, nom]) => `<span class="per-k${id === cur ? ' on' : ''}" data-p="${id}" role="button"><i>${DARS.perRasm[id]}</i><b>${nom}</b></span>`).join('')}</div>`
const dstP = (chegara, { cur = 'dushman' } = {}) => `<div class="dst" data-z="dastur"><span class="dsb"><b>${{ raketa: 'Raketa', oq: 'O‘q', dushman: 'Dushman' }[cur]} dasturi</b></span>${perQ(cur)}<span class="bosh">Blokni shu yerga ulang</span><small class="dsn">0 ta dasturcha\n0 / ${chegara} ta blok</small></div>`

// kichik kosmos maydoni (zinapoya, reja): raketa, dushmanlar (tepada · tushish izi), o'q izi, kapsula
const miniKosmos = ({ rak = [3, 0], dush = [], iz = [], oq = [], son = '' } = {}, cls = 'mini') => {
  const W = MB.w * 10, H = MB.h * 10, Y = (y) => (MB.h - 1 - y) * 10
  let h = ''
  for (let q = 0; q < MB.h; q++) for (let x = 0; x < MB.w; x++) h += `<rect x="${x * 10 + 0.6}" y="${q * 10 + 0.6}" width="8.8" height="8.8" rx="2" fill="${(x + q) % 2 ? '#243B6B' : '#1E3360'}"/>`
  ;[[1, 3], [5, 2], [0, 1], [6, 4], [4, 1]].forEach(([x, y]) => { h += `<circle cx="${x * 10 + 7}" cy="${Y(y) + 2.6}" r=".7" fill="#fff" opacity=".8"/>` })
  iz.forEach(([x, a, b]) => { h += `<path d="M${x * 10 + 5} ${Y(a) + 5}V${Y(b) + 5}" stroke="${DUSH_R}" stroke-width="1.4" stroke-dasharray="1.4 1.8" stroke-linecap="round" opacity=".7"/>` })
  oq.forEach(([x, a, b]) => { h += `<path d="M${x * 10 + 5} ${Y(a) + 3}V${Y(b) + 7}" stroke="#FFC93C" stroke-width="1.6" stroke-dasharray="1.6 1.8" stroke-linecap="round"/>` })
  dush.forEach(([x, y]) => { h += `<ellipse cx="${x * 10 + 5}" cy="${Y(y) + 5.4}" rx="3.8" ry="2.8" fill="${DUSH_R}"/><circle cx="${x * 10 + 3.6}" cy="${Y(y) + 5}" r=".9" fill="#fff"/><circle cx="${x * 10 + 6.4}" cy="${Y(y) + 5}" r=".9" fill="#fff"/>` })
  if (rak) h += `<path d="M${rak[0] * 10 + 5} ${Y(rak[1]) + 1}c2.2 1.8 2.8 4.2 2.8 6.6v1.6h-5.6v-1.6c0-2.4.6-4.8 2.8-6.6z" fill="#F4F6FB"/><circle cx="${rak[0] * 10 + 5}" cy="${Y(rak[1]) + 5}" r="1.2" fill="#3FA2FF"/>`
  if (son) h += `<rect x="1" y="1" width="${son.length * 3.4 + 4}" height="7" rx="3.5" fill="#fff"/><text x="3" y="6.4" font-size="5.4" font-weight="800" fill="#0D2137" font-family="sans-serif">${son}</text>`
  return `<svg class="${cls} mk" viewBox="-1 -1 ${W + 2} ${H + 2}" aria-hidden="true"><rect x="-1" y="-1" width="${W + 2}" height="${H + 2}" rx="3" fill="#0F1E3D"/>${h}</svg>`
}
// statik kod qatorlari (huk, javob, yangi so'z, xulosa): [[chuqurlik, html, xira?]…] — kod.js qatorlari bilan bir xil belgilar (<em> funksiya, <u> kalit so'z, <s> satr, <b class="kn"> son)
const kq = (h, d = 0, cls = '') => `<div class="kq${cls ? ' ' + cls : ''}" style="--d:${d}"><code>${h}</code></div>`
const kodK = (qatorlar, cls = '') => `<div class="kodk ${cls}">${qatorlar.join('')}</div>`
const K = { mr: '<em>moveRight</em>();', onR: '<em>onKey</em>(<s>"right"</s>, () =&gt; {', yop: '});' }
// zinapoya va reja uchun kichik kod rasmi: qator uzunliklari (rangli chiziqlar), belgilangan qator, son kapsulasi
const kodRasm = ({ q = [[0, 30, 'f'], [1, 22, 'f'], [0, 8, 'x']], yon = -1, son = -1 } = {}, cls = 'mini') => {
  const R = { f: '#FFC93C', k: '#8FD3FF', x: '#5B6B85', s: '#A6E3A1' }
  let h = ''
  q.forEach(([d, w, t], i) => { const y = 6 + i * 9; if (i === yon) h += `<rect x="2" y="${y - 3}" width="66" height="8" rx="2" fill="#FF6B4A" opacity=".35"/>`; h += `<rect x="${6 + d * 6}" y="${y}" width="${w}" height="3" rx="1.5" fill="${R[t] || R.f}"/>`; if (i === son) h += `<rect x="${8 + d * 6 + w}" y="${y - 2.2}" width="9" height="7" rx="3.5" fill="#fff"/>` })
  return `<svg class="${cls} mk" viewBox="0 0 70 ${10 + q.length * 9}" aria-hidden="true"><rect x="0" y="0" width="70" height="${10 + q.length * 9}" rx="4" fill="#0F1E3D"/>${h}</svg>`
}

// ---- loyiha kartasi (21-darsdan; 23-dars faqat o'qiydi): xulosa «Mening o‘yinim» (bola ekranida .kc-mini — kod.js kartaChiz to'ldiradi) ----
const kartaG = (k) => ((DARS.kartaGap || {})[k] || '')
const kartaQ = (nom, v, bor = true) => `<span class="kx-q${bor ? ' ok' : ''}"><small>${nom}</small><b>${bor ? v : '?'}</b></span>`

// Demo Day qoidalari (3-qadam) va uy yo'riqnomasi (9–10-qadam): qatorlar
const qoQator = (n, nom, iz) => `<div class="ty-q"><i>${n}</i><span><b>${nom}</b><small>${iz}</small></span></div>`
const qoidaKarta = () => `<div class="tq-t">${qoQator(1, 'Mehmon o‘ynaydi', 'strelkalar — raketa, probel — o‘q')}${qoQator(2, 'Bola aytib beradi', 'nechta dushman, qanday yutiladi')}${qoQator(3, 'Savolga javob beradi', 'eng qiyin joyi qaysi edi')}</div>`
// «Blok studiya → Scratch» jadvali: uchta blok (hodisa, klon, o'zgaruvchi)
const SCRATCH_J = [['when ▶ clicked', 'when green flag clicked'], ['create clone of myself', 'create clone of myself'], ['change ball by 1', 'change score by 1']]
const uyKarta = () => `<div class="tq-t uy-t">${qoQator(1, 'Scratch saytiga kiring', 'ota-onangizdan ruxsat so‘rang: scratch.mit.edu')}${qoQator(2, 'Yangi loyiha oching', 'bloklar tanish')}${qoQator(3, 'O‘yiningizni o‘zingiz yasang', 'karta bo‘yicha')}</div><div class="uy-j"><small>Blok studiya → Scratch</small>${SCRATCH_J.map(([a, b]) => `<span class="uy-q"><code>${a}</code><i>→</i><code>${b}</code></span>`).join('')}</div>`

// bekatlar (reja tepaligi): tayyorlanamiz · ko'rsatamiz · uyga olib ketamiz
const BALL_OQ = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.6l2.8 5.8 6.4.9-4.6 4.5 1.1 6.3L12 17.1l-5.7 3 1.1-6.3-4.6-4.5 6.4-.9z" fill="#fff"/></svg>'
const JON_OQ = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.6s-7.6-4.6-7.6-10.2A4.4 4.4 0 0 1 12 7.6a4.4 4.4 0 0 1 7.6 2.8c0 5.6-7.6 10.2-7.6 10.2z" fill="#fff"/></svg>'
const TAYYOR_OQ = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12.5l5 5L20 6.5" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>'
const KORSAT_OQ = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.6-6.4 10-6.4S22 12 22 12s-3.6 6.4-10 6.4S2 12 2 12z" fill="#fff"/><circle cx="12" cy="12" r="3.4" fill="#0F1E3D"/></svg>'
const UY_OQ = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11.5L12 4l9 7.5V20H3z" fill="#fff"/><rect x="9.5" y="13" width="5" height="7" fill="#0F1E3D"/></svg>'
const BEKATLAR = [['h', 'Tayyorlanamiz', TAYYOR_OQ], ['g', 'Ko‘rsatamiz', KORSAT_OQ], ['y', 'Uyga olib ketamiz', UY_OQ]]
const darsOxiri = () => `<div class="gl kd3" data-z="dars oxirida"><small>Dars oxirida · uy yo‘riqnomasi</small><div class="kd3-r lb2">${miniKosmos({ dush: [[1, 3], [5, 2]], oq: [[1, 1, 2]], son: 'ball: 3' }, 'kd-mk')}</div><b>Uyda davom eting</b></div>`
const AI_RASM = '<svg class="kd-xy" viewBox="0 0 100 64" aria-hidden="true"><rect x="0" y="0" width="100" height="64" rx="6" fill="#0F1E3D"/><rect x="26" y="14" width="48" height="36" rx="10" fill="#E6ECF5"/><circle cx="40" cy="30" r="5" fill="#0F1E3D"/><circle cx="60" cy="30" r="5" fill="#0F1E3D"/><path d="M42 41h16" stroke="#0F1E3D" stroke-width="3" stroke-linecap="round"/><path d="M50 14V8" stroke="#E6ECF5" stroke-width="3" stroke-linecap="round"/><circle cx="50" cy="7" r="3" fill="#FFC93C"/></svg>'
const keyingiDars = () => `<div class="gl kd3" data-z="keyingi dars"><small>Keyingi dars</small><div class="kd3-r lb2">${AI_RASM}</div><b>24 · Sun‘iy intellekt (AI) nima</b></div>`
// kirish: «O‘tgan darsda» — taqdimot
const otganDars = () => `<div class="otd"><small>O‘tgan darsda</small><div class="tf-l"><div class="tf"><div class="tf-r otd-k">${kartaQ('Dushmanlar', 5)}${kartaQ('Jon', 3)}</div><div class="tf-t"><b>Taqdimot</b><span>Mening o‘yinim, qanday yutiladi, eng qiyin joyi</span></div></div></div></div>`

// zinapoyalar: 1-bekat (oxirgi sinov — bitta pog'ona), 2-bekat (mehmon), 3-bekat (yo'riqnoma — bitta pog'ona)
const POG = {
  sinov: [['1', 9, miniKosmos({ dush: [[1, 3], [5, 2]], oq: [[1, 1, 2]], son: 'ball: 4' }), 'Oxirgi sinov']],
  mehmon: [['1', 9, miniKosmos({ rak: [2, 0], dush: [[4, 3]], son: 'ball: 2' }), 'Mehmon o‘ynadi'], ['★', 4, miniKosmos({ dush: [[1, 3], [5, 2]], oq: [[1, 1, 2]], son: 'ball: 6' }), 'Mehmon yutdi']],
  yoriq: [['1', 9, kodRasm({ q: [[0, 30, 'f'], [0, 22, 'k'], [0, 26, 'f']] }), 'Yo‘riqnoma']],
}

// natija (11, 12-qadam): sonlar kartaning boshida (natijaSon)
const SINF_T = [['h', BALL_OQ, 'ta o‘yin tugadi', 28], ['g', KORSAT_OQ, 'ta mehmon yutdi', 17], ['y', JON_OQ, 'pog‘ona bajardi', 56]]
const BOLA_T = [['h', BALL_OQ, 'ta o‘yin tugadi', 1], ['g', KORSAT_OQ, 'ta mehmon yutdi', 1], ['y', JON_OQ, 'pog‘ona bajardi', 4]]

// 23-dars «Demo Day №1» ekranlari (E) — 22.11. Matn manbasi: new-junior/manba/023-demo-day-1.md v1 (qo'shtirnoq ichidagi gaplar — aynan).
// Bola noutbukida: kosmik o'yin (mehmon o'ynaydi, kosmik.kerak = karta3/oynadi) va uy yo'riqnomasi kartasi (Y1). Sahnada kichik «Mening o‘yinim» kartasi (.kc-mini).
const fO = (hint) => fB({ hint, label: `${PLAY}Boshlash` })
const st = (o) => studiya({ aktiv: 'K', dunyo: null, ...o })
const qg = (gap) => `<div class="cg qg"><span class="av">${momiqYuz()}</span><p><small>Momiq</small>${gap}</p></div>`
const JV = DARS.javon
const doska = (sar, cg, son, zinaR, kichik, iz = '', yorliq = 'Mashq') => `<div class="chap">${matn(yorliq, sar, cg)}<div class="tugatdi"><small>${kichik}</small><b>${son}<i> / 14</i></b>${yulduzlar14(son)}${iz ? `<span class="tg-iz">${iz}</span>` : ''}</div></div><div class="oyna kosmos-o">${world('kosmos')}${zina(zinaR)}</div>`
// studiya sahnasi: maydon (dushman asli tepada), kapsulalar, sanoq «Dushman: 0», kichik karta
const sahna = (aktyor, v = { ball: 0 }) => maydon({}, aktyor, { asl: [3, 4] }) + ozgQ(v) + sanoqK() + '<div class="gl kc-mini"></div>'
const bol = (tag, h, iz, id, hint) => {
  const b = DARS.studiya[id], P = b.bosh.personaj
  return { body: () => st({ tag, h, iz, javon: JV, dst: dstP(b.chegara, { cur: P.tanla }), sahna: sahna(qahK()) }), foot: () => fO(hint) }
}
const H1 = 'Kartadagidek yuting', H2 = 'Mehmon o‘ynasin'
const E = {
  P1: { rol: 'p', b: 0, t: 't1', nom: 'Kirish', izoh: '1-qadam. Kosmos maydoni; pastda «O‘tgan darsda» — taqdimot.',
    body: () => `<div class="chap">${matn('', '<em>Demo Day</em>!', 'Salom, mehmonlar! O‘yinlarimizni ko‘rsatamiz.')}${otganDars()}</div><div class="oyna">${maydon({}, coddyK(), { asl: [3, 4], oq: [[3, 2]] })}</div>`,
    foot: () => fU('Kirdi: 12 / 14', 'Keyingi ›') },
  P4: { rol: 'p', b: 0, t: 't2', nom: 'Reja', izoh: '2-qadam.',
    body: () => `<div class="oyna to">${world('kosmos')}<div class="gl pan">${matn('Reja', 'Bugun nima <em>qilamiz</em>?', 'Uchta bekat. Oxirida uyga yo‘riqnoma olasiz.')}</div>${darsOxiri()}${tepalik({ otdi: 0, joy: 0 })}</div>`,
    foot: () => fU('', 'Boshladik ›') },
  P7: { rol: 'p', b: 1, t: 't1', nom: 'Ko‘ramiz: Demo Day qoidalari', izoh: '3-qadam. Uch qator: mehmon o‘ynaydi, bola aytib beradi, savolga javob beradi.',
    body: () => `<div class="chap">${matn('Qoidalar', 'Demo Day <em>qoidalari</em>', 'Bolalar o‘z o‘yinini ko‘rsatadi.')}${qoidaKarta()}</div><div class="oyna">${maydon({}, coddyK(), { asl: [3, 4], oq: [[3, 2]] })}</div>`,
    foot: () => fU('', 'Keyingi ›') },
  P5: { rol: 'p', b: 1, t: 't1', nom: 'Sinf doskasi: oxirgi sinov', izoh: '4-qadam.',
    body: () => doska('O‘yinni <em>sinab</em> oling!', 'Mehmonlar kelishidan oldin — oxirgi sinov.', 5, POG.sinov, 'O‘yinni yutdi', 'Har belgi — o‘yinni yutgan bitta bola', '', 'Mashq'),
    foot: () => fU('Yordam so‘radi: 1 ta noutbuk', 'Keyingi ›') },
  P4B: { rol: 'p', b: 2, t: 't2', nom: 'Reja · 2-bekat', izoh: '5-qadam.',
    body: () => `<div class="oyna to">${world('kosmos')}<div class="gl pan">${matn('Reja · 2-bekat', '2 · <em>Ko‘rsatamiz</em>', 'Endi mehmonlar o‘ynaydi!')}</div>${darsOxiri()}${tepalik({ otdi: 1, joy: 2 })}</div>`,
    foot: () => fU('', 'Keyingi ›') },
  P8: { rol: 'p', b: 2, t: 't3', nom: 'Ko‘ramiz: mehmon qanday o‘ynaydi', izoh: '6-qadam. Ustoz o‘yinni o‘ynaydi: ← → va probel.',
    body: () => st({ tag: 'Ko‘ramiz', h: 'Qanday <em>o‘ynaladi</em>', javon: JV, dst: dstP(12, { cur: 'raketa' }), sahna: sahna(coddyK()) }),
    foot: () => fU('', 'Keyingi ›') },
  P5G: { rol: 'p', b: 2, t: 't1', nom: 'Sinf doskasi: mehmon o‘ynaydi', izoh: '7-qadam.',
    body: () => doska('Mehmon <em>o‘ynaydi</em>!', 'Siz aytasiz — mehmon o‘ynaydi.', 6, POG.mehmon, 'O‘yin tugadi', 'Har belgi — mehmon o‘ynagan bitta bola', '', 'Demo Day'),
    foot: () => fU('Yordam so‘radi: 1 ta noutbuk', 'Keyingi ›') },
  P4C: { rol: 'p', b: 3, t: 't2', nom: 'Reja · 3-bekat', izoh: '8-qadam.',
    body: () => `<div class="oyna to">${world('kosmos')}<div class="gl pan">${matn('Reja · 3-bekat', '3 · <em>Uyga olib ketamiz</em>', 'Endi uyga yo‘riqnoma!')}</div>${darsOxiri()}${tepalik({ otdi: 2, joy: 3 })}</div>`,
    foot: () => fU('', 'Keyingi ›') },
  P10: { rol: 'p', b: 3, t: 't1', nom: 'Ko‘ramiz: uy yo‘riqnomasi', izoh: '9-qadam. Uch qadam va jadval «Blok studiya → Scratch».',
    body: () => `<div class="chap">${matn('Uyga', 'Uyda <em>davom eting</em>', 'Scratch — bolalar uchun bepul sayt.')}${uyKarta()}</div><div class="oyna kosmos-o">${world('kosmos')}</div>`,
    foot: () => fU('', 'Keyingi ›') },
  P5B: { rol: 'p', b: 3, t: 't1', nom: 'Sinf doskasi: yo‘riqnoma', izoh: '10-qadam.',
    body: () => doska('Yo‘riqnomani <em>oling</em>!', 'Uyga olib ketasiz.', 6, POG.yoriq, 'Yo‘riqnomani oldi', 'Har belgi — yo‘riqnomani olgan bitta bola', '', 'Uyga'),
    foot: () => fU('Yo‘riqnomani oldi: 6 / 14', 'Keyingi ›') },
  P12: { rol: 'p', b: 4, t: 't2', nom: 'Yakun', izoh: '11-qadam.',
    body: () => `<div class="oyna to">${world('kosmos')}${KONFETI()}<div class="gl pan">${matn('Yakun', 'Demo Day <em>tugadi</em>!', '1-modul tugadi!')}<div class="tm ix"><small class="bsoz">Bugun</small><div class="tr"><span class="ti d"><i></i><i></i><i></i></span><span><b>Tayyorlandik · Ko‘rsatdik · Uyga oldik</b>O‘z o‘yiningizni yasadingiz</span></div></div></div>${keyingiDars()}${tepalik({ otdi: 3, joy: 3, pose: 'quvonadi' })}</div>`,
    foot: () => fU('', 'Keyingi ›') },
  P14: { rol: 'p', b: 4, t: 't1', nom: 'Sinfimiz bugun', izoh: '12-qadam. Butun sinf jami (haqiqiy son, ismsiz).',
    body: () => `<div class="chap">${matn('Sinf natijasi', 'Sinfimiz <em>bugun</em>', 'Hammangiz zo‘r ishladingiz!')}${sinfNatija()}</div><div class="oyna kosmos-o">${world('kosmos')}${KONFETI()}<div class="qq sn-qq"><span class="m1">${hero({ k: 'momiq', mood: 'xursand' })}</span><span class="m2">${robot({ pose: 'quvonadi' })}</span><span class="m3">${hero({ k: 'katak', mood: 'xursand' })}</span></div></div>`,
    foot: () => fU('', 'Darsni yakunlash') },

  // ---- bola noutbuki ----
  B0: { rol: 'b', b: 0, t: 't4', nom: 'Darsga kirish', izoh: '1-qadam.',
    body: () => kutish({ kech: false, uq: '', h: 'Salom, <em>Aziz</em>!', sub: '', dunyo: 'kosmos', aktyor: yolchaYakka(coddyQ('', 'salom', 'xursand')) }),
    foot: () => fKid('Tayyor bo‘lsangiz — tugmani bosing', 'Tayyorman') },
  BK: { rol: 'b', b: 0, t: 't4', nom: 'Ustoz ekraniga qarang', izoh: 'Ustoz ko‘rsatayotganda.',
    body: () => kutish({ h: 'Ustoz ekraniga qarang', sub: 'Ustozni tinglang', dunyo: 'kosmos', aktyor: yolchaYakka(momiqQ('', 'xursand')) }),
    foot: () => fJim('') },
  BQ: { rol: 'b', b: 0, t: 't2', nom: 'Qahramon tanlash', izoh: 'Faqat qahramoni yo‘q bolaga (94-qaror).',
    body: () => `<div class="oyna to">${world('kosmos')}<div class="gl pan">${matn('Qahramon', 'Qahramoningizni <em>tanlang</em>', 'Birini tanlang — bugun unga buyruq berasiz.')}</div>${tanlovQator('momiq')}</div>`,
    foot: () => fJim('Birini tanlang') },
  B1A: { rol: 'b', b: 1, t: 't3', nom: 'Oxirgi sinov', izoh: '4-qadam. 22-dars o‘yini (bo‘lmasa karta bo‘yicha tayyor) — bola kartadagidek yutadi.', ...bol('Oxirgi sinov', '<em>Oxirgi</em> sinov', 'Kartadagidek yuting', 'B1A', H1) },
  B2A: { rol: 'b', b: 2, t: 't3', nom: 'Mehmon · 1', izoh: '7-qadam. Mehmon o‘yinni o‘ynaydi (bola aytib beradi); o‘yin tugashi sanaladi.', ...bol('Mehmon · 1', 'Mehmon <em>o‘ynaydi</em>', 'Mehmon o‘yinni o‘ynasin', 'B2A', H2) },
  B2Y: { rol: 'b', b: 2, t: 't3', nom: 'Mehmon · ★', izoh: '7-qadam. Mehmon yutadi — kartadagidek.', ...bol('Mehmon · ★', 'Mehmon <em>yutdi</em>', 'Mehmon yutsin — kartadagidek', 'B2Y', H2) },
  Y1: { rol: 'b', b: 3, t: 't1', nom: 'Yo‘riqnoma kartasi', izoh: '10-qadam. «Uyda davom eting» kartasi — uch qadam va jadval; asosiy tugma «Yo‘riqnoma tayyor».',
    body: () => `<div class="chap">${matn('Uyga', 'Uyda <em>davom eting</em>', 'Yo‘riqnoma kartasini o‘qing.')}${uyKarta()}</div><div class="oyna kosmos-o">${world('kosmos')}<div class="kc-xul" hidden></div></div>`,
    foot: () => fKid('Uyda ota-onangiz bilan davom etasiz', 'Yo‘riqnoma tayyor') },
  B5: { rol: 'b', b: 4, t: 't1', nom: 'O‘z natijasi', izoh: '11–12-qadam. «Siz bugun» — haqiqiy son.',
    body: () => `<div class="chap">${matn('Sizning natijangiz', 'Demo Day <em>tugadi</em>!', '')}${qg('Mening o‘yinim bor!')}<small class="st-s">Siz bugun</small>${sinfNatija(BOLA_T)}</div><div class="oyna">${maydon({}, qahK(), { asl: [3, 4], dush: [[5, 2]], oq: [[1, 2]] })}${ozgQ({ ball: 6, jon: 3 })}<div class="gl kd2 a-tr"><small>Momiq</small><b>Keyingi darsda sun‘iy intellektni o‘rganamiz!</b></div></div>`,
    foot: () => fJim(TUGADI_YOZUV) },
}

// 23-dars «Demo Day №1» qadamlari (QADAM) va ustoz varag'i (VARAQ) — 22.11. Manba: new-junior/manba/023-demo-day-1.md v1, 12 qadam.
const QADAM = [
  ['Kirish', 'P1', ['B0', 'BK']],
  ['Reja', 'P4', ['BK'], 'Bugun: uchta bekat'],
  ['Ko‘ramiz: Demo Day qoidalari', 'P7', ['BK'], 'Ustoz qoidalarni aytyapti'],
  ['O‘zingiz: oxirgi sinov', 'P5', ['B1A', 'BK']],
  ['2-bekat', 'P4B', ['BK'], '2-bekat: ko‘rsatamiz'],
  ['Ko‘ramiz: mehmon qanday o‘ynaydi', 'P8', ['BK'], 'Ustoz o‘yinni ko‘rsatyapti — kuzating'],
  ['O‘zingiz: mehmon o‘ynaydi', 'P5G', ['B2A', 'B2Y', 'BK']],
  ['3-bekat', 'P4C', ['BK'], '3-bekat: uyga olib ketamiz'],
  ['Ko‘ramiz: uy yo‘riqnomasi', 'P10', ['BK'], 'Ustoz yo‘riqnomani ko‘rsatyapti'],
  ['O‘zingiz: yo‘riqnoma kartasi', 'P5B', ['Y1', 'BK']],
  ['Yakun', 'P12', ['B5']],
  ['Sinfimiz bugun', 'P14', ['B5']],
]
// ustoz varag'i: [Ekranda · Siz (manbadagi tayanch gaplar, aynan) · Bola o'rganadi]
const VARAQ = [
  ['«23-dars · Demo Day №1» — «Demo Day!» Kosmos maydoni: raketa, o‘q, dushman; pastda «O‘tgan darsda» — taqdimot.', '«Hurmatli mehmonlar, xush kelibsiz! Bugun bolalar o‘z o‘yinlarini ko‘rsatadi.» «O‘tgan darsda o‘yinimiz haqida gapirishni mashq qildik.» «Noutbukda «Tayyorman» tugmasini bosing.»', 'Darsga kiradi, mehmonlarni salomlaydi.'],
  ['Reja: tepalik — tayyorlanamiz → ko‘rsatamiz → uyga olib ketamiz; cho‘qqida «Dars oxirida · uy yo‘riqnomasi».', '«Bugun uchta bekat: tayyorlanamiz, ko‘rsatamiz, uyga olib ketamiz.»', 'Darsda qayerda turganini biladi.'],
  ['Qoidalar: «Demo Day qoidalari». Uch qator: mehmon o‘ynaydi · bola aytib beradi · savolga javob beradi.', '«Mehmon o‘ynaydi, bola aytib beradi: nechta dushman, qanday yutiladi, eng qiyin joyi.» «Mehmon yutmasa ham yaxshi: yana urinadi.»', 'Demo Day qoidalarini eshitadi.'],
  ['Mashq: «O‘yinni sinab oling!» — pog‘ona: oxirgi sinov.', '«O‘yiningiz ishlayaptimi? Kartadagidek yuting.» Oxirida: «To‘xtadik. Qo‘llar klaviaturadan.»', 'O‘yinini oxirgi marta sinaydi.'],
  ['Tepalik: 1-bekat ✓ — «Ko‘rsatamiz».', '«Hurmatli mehmonlar, noutbuklarga marhamat.»', 'Darsda qayerda turganini biladi.'],
  ['Ko‘ramiz: mehmon qanday o‘ynaydi. O‘yinni ← → va probel bilan o‘ynaysiz.', '«O‘ynash oson: strelkalar — raketa, probel — o‘q. Dushman tegsa — jon kamayadi.»', 'Mehmonga qanday tushuntirishni ko‘radi.'],
  ['Demo Day: «Mehmon o‘ynaydi!» — zinapoya: 1 mehmon o‘ynadi · ★ mehmon yutdi.', '«Mehmon o‘ynasin. Siz aytib bering: nechta dushman, qanday yutiladi, eng qiyin joyi.» Oxirida: «To‘xtadik. Qo‘llar klaviaturadan.»', 'O‘yinini mehmonga ko‘rsatadi va tushuntiradi.'],
  ['Tepalik: 1, 2 ✓ — «Uyga olib ketamiz».', '«Oxirgi bekat: uyda davom ettirishni o‘rganamiz.»', 'Darsda qayerda turganini biladi.'],
  ['Ko‘ramiz: uy yo‘riqnomasi. «Uyda davom eting» — uch qadam va jadval «Blok studiya → Scratch».', '«Scratch — bolalar uchun bepul dasturlash sayti. Bloklar bizniki bilan deyarli bir xil.» «Saytga kirishdan oldin ota-onangizdan ruxsat so‘rang.»', 'Uyda davom ettirish yo‘lini biladi.'],
  ['Mashq: «Yo‘riqnomani oling!» — pog‘ona: yo‘riqnoma kartasi.', '«Yo‘riqnoma kartasini o‘qing. Uyda ota-onangiz bilan davom etasiz.» Oxirida: «To‘xtadik. Qo‘llar klaviaturadan.»', 'Yo‘riqnomani o‘qiydi.'],
  ['Yakun: «Demo Day tugadi!» «1-modul tugadi!» Keyingi dars — 24 · Sun‘iy intellekt (AI) nima.', '«Uchala bekatdan o‘tdik. Birinchi modul tugadi — o‘z o‘yiningizni yasadingiz!» «Keyingi modulda sun‘iy intellekt bilan tanishamiz.»', 'Modul yakunlanganini biladi.'],
  ['Sinfimiz bugun: nechta o‘yin tugadi, nechta mehmon yutdi, nechta pog‘ona bajarildi (haqiqiy son, ismsiz).', '«Hammangiz zo‘r ishladingiz!» (keyin raqamlarni o‘qiydi; mehmonlarga minnatdorchilik)', 'Sinf natijasini ko‘radi.'],
]

// Dars ma'lumoti (dvigatel 2d, 19.11; avval sahifa.mjs boshida edi — mazmuni o'zgarmagan): oldindan chizilgan ekranlar va tanlov rasmlari.
// yigish.mjs ulaydi: bosh.mjs + qismlar.mjs + darslar/<dars>/ekranlar.mjs + darslar/<dars>/qadamlar.mjs + shu fayl — demo (Node'da chiziladi, demo.html ga ma'lumot bo'lib yoziladi)
// va LMS (o'sha kod brauzerda yuriladi — lms/Dars.jsx import qiladi). Shu sabab bu yerda (va bosh, qismlar, dars fayllarida) Node'ga xos hech narsa yo'q — lms/yig.mjs tekshiradi.
// bola tanlovlari uchun: qahramon variantlari, palitralar, dunyolar
// 11-dars: DARS.ikonOila — javonda yo'q, lekin tayyor dasturda bor bloklar (3-bekatdagi repeat): belgisi shu yerdan olinadi (blockly.js blIkon)
const PAL_HTML = Object.fromEntries([...Object.keys(PAL).map((f) => [f, palitra(f)]), ...Object.entries(DARS.ikonOila || {}).map(([f, r]) => [f, `<div class="pl">${r.map((t) => mb(t)).join('')}</div>`])])
const PAL_B1 = Object.fromEntries(Object.keys(PAL).map((f) => [f, palitra(f, f === 'h' ? 1 : 0)]))
const QAH_SVG = Object.fromEntries(QAHRAMONLAR.map((k) => [k, hero({ k, mood: 'xursand', lite: true })]))
const DUNYO_HTML = { hovli: world('hovli'), kosmos: world('kosmos'), suv: world('suv') }
// muammochalar (qaror 1-B, 18.11): xato chiqqanda sahnada chiqadi — etalon B3 dagi ko'rinish
const MUAM_SVG = Object.fromEntries(['kamvoy', 'ortiqvoy', 'boshvoy'].map((k) => [k, hero({ k, mood: 'hayron' })]))
const ekranHtml = (id) => { const e = E[id]; return `<div class="ekran hy ${e.t} e-${id}" data-id="${id}">${bosh(e.b)}<main class="hm">${e.body()}</main>${e.foot()}</div>` }
// 5b-1: qadamlarda yo'q, lekin kerak bo'ladigan ekran — qahramoni yo'q bolaning tanlash ekrani (DARS.bola.qahramonYoq), oxirida qo'shiladi
// 5b-2: bola ro'yxati null bo'lishi mumkin (bola ekrani o'zgarmaydigan qadam — qobiq.js, bolaQ)
// 15-dars: QADAM[i][4] — ikkinchi noutbuk ro'yxati (juftlik); DARS.ekranTanlov — o'yin turi bo'yicha ekran (BX → BXO, BXL)
const ekranT = (id) => (DARS.ekranTanlov && DARS.ekranTanlov[id]) || [id]
const kerak = [...new Set([...QADAM.flatMap(([, p, b, , b2]) => [p, ...(Array.isArray(b) ? b : []), ...(Array.isArray(b2) ? b2 : [])]).flatMap(ekranT), ...(DARS.bola.qahramonYoq ? [DARS.bola.qahramonYoq] : [])])]
const EKRANLAR = Object.fromEntries(kerak.map((id) => [id, ekranHtml(id)]))
const QAH_IDS = DARS.qahramonli.filter((id) => kerak.includes(id))
// namuna qahramon nomi (DARS.namuna.qahramon) → shu qahramonning nomi; Coddy'li ekranlarda → «Coddy»
const nomQoy = (h, nom) => DARS.namuna.qahramon.reduce((x, n) => x.replaceAll(n, nom), h)
const EKRANLAR_Q = {}
for (const k of QAHRAMONLAR) { globalThis.QAH = k; EKRANLAR_Q[k] = Object.fromEntries(QAH_IDS.map((id) => [id, nomQoy(ekranHtml(id), QNOM[k])])) }
globalThis.QAH = 'coddy'
const EKRANLAR_U = Object.fromEntries(DARS.coddyli.filter((id) => kerak.includes(id)).map((id) => [id, nomQoy(ekranHtml(id), 'Coddy')]))
globalThis.QAH = undefined
// 5a: To'siqvoy (96-qaror) — eng oxirida chiziladi: undan oldingi chizmalarning SVG ichki raqamlari o'zgarmasin (1-dars oltin namunasi)
MUAM_SVG.tosiqvoy = hero({ k: 'tosiqvoy', mood: 'hayron' })
if (VARAQ.length !== QADAM.length) throw new Error('VARAQ ' + VARAQ.length + ' ≠ QADAM ' + QADAM.length)

// ===== DEMO sahifasi (16.11; dvigatel 1b, 19.11 — avval etalon/demo.mjs; 2d — bo'laklar yigish.mjs dan): sahifa qolipi → public/demo.html =====
// dvigatel/yig.mjs ulaydi va yuritadi: yigish.chizuvchi(dars) (bosh + qismlar + dars ekranlari + dars qadamlari + malumot) + shu fayl.
// Brauzer skripti va uslub — yigish.mjs dan (LMS ham o'shalardan yig'iladi): skript({ demo: true }), uslub().
//   ?rol=ustoz — proyektor, «Keyingi»/strelka bilan boshqaradi · ?rol=bola — o'quvchi, ustozga ergashadi · ?rol=yonma — ikkalasi yonma-yon (ko'rik)
// Aloqa: aloqa-demo.js — lokal server (vite: /__sinf, SSE), internet (api/sinf) va bitta brauzer ichida BroadcastChannel.
import { writeFileSync } from 'node:fs'
import { skript, uslub } from './yigish.mjs'
const BRAUZER_JS = skript({ demo: true })
const { DARS_CSS, QOBIQ_CSS, SHRIFT } = uslub(process.argv[2]) // dars papkasi — yig.mjs beradi
const DEMO = `<!doctype html>
<html lang="uz"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Junior · ${DARS.raqam}-dars demo</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
${SHRIFT}
<style>${DARS_CSS}</style>
<style>
${QOBIQ_CSS}</style></head>
<body>
<div id="ilova"></div>
<script src="vendor/blockly-13.4.0/blockly_compressed.js"></script>
<script src="vendor/blockly-13.4.0/en.js"></script>
<script>
const EKRANLAR = ${JSON.stringify(EKRANLAR)};
const QADAM = ${JSON.stringify(QADAM)};
const VARAQ = ${JSON.stringify(VARAQ)};
const EKRANLAR_Q = ${JSON.stringify(EKRANLAR_Q)};
const EKRANLAR_U = ${JSON.stringify(EKRANLAR_U)};
const PAL_HTML = ${JSON.stringify(PAL_HTML)};
const PAL_B1 = ${JSON.stringify(PAL_B1)}, QAH_SVG = ${JSON.stringify(QAH_SVG)}, ODAM_SVG = ${JSON.stringify(ODAM)}, MUAM_SVG = ${JSON.stringify(MUAM_SVG)};
const DUNYO_HTML = ${JSON.stringify(DUNYO_HTML)};
const QAHRAMONLAR = ${JSON.stringify(QAHRAMONLAR)}, QNOM = ${JSON.stringify(QNOM)}, JOYLAR = ${JSON.stringify(JOYLAR.map(([k]) => k))};
const DARS = ${JSON.stringify(DARS)};
${BRAUZER_JS}
</script>
</body></html>`
// 5b-1: har dars o'z sahifasi — DARS.demoFayl (1-dars: demo.html, eski manzillar saqlansin), bo'lmasa demo-002.html kabi
const FAYL = DARS.demoFayl || 'demo-' + String(DARS.raqam).padStart(3, '0') + '.html'
writeFileSync(new URL('../public/' + FAYL, import.meta.url).pathname, DEMO)
console.log('demo ok', FAYL, (DEMO.length / 1024).toFixed(0) + 'KB', kerak.length, 'ekran,', QADAM.length, 'qadam')
