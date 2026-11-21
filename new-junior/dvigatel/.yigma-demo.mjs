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
  x: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="7.4" fill="none" stroke="#fff" stroke-width="2.8"/><circle cx="12" cy="12" r="2.6" fill="#fff"/><path d="M12 1.6v4M12 18.4v4M1.6 12h4M18.4 12h4" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/></svg>',
}
const BL = { r: ['h', 'move right'], l: ['h', 'move left'], u: ['h', 'move up'], d: ['h', 'move down'], j: ['h', 'jump'], s: ['g', 'say'], x: ['h', 'go to'], k: ['e', 'when'], p: ['b', 'repeat'], v: ['v', 'switch costume to'], n: ['t', 'play sound'], a: ['a', 'if path'], q: ['e', 'when touching'], f: ['e', 'when ▶ clicked'], z: ['o', 'set'], c: ['o', 'change'], i: ['a', 'if'], g: ['e', 'game over'], y: ['h', 'go to'], m: ['o', 'random'] }
// mb('r') · mb('s','Salom!') · mb('r','', 'yon') · mb('x', '4,2') — go to manzili (3-dars; sonlar oq kapsulada, data-x / data-y — blockly.js, blokXY)
const mbXY = (m) => { const [x = 0, y = 0] = String(m === 'Salom!' ? '0,0' : m).split(','); return [+x || 0, +y || 0] }
// 4-dars: mb('k', 'right') — hodisa bloki, tugma oq kapsulada (data-tugma — blockly.js, blokTugma)
const TUGMA_K = { right: '→', left: '←', up: '↑', down: '↓', space: 'space', any: 'any' } // any — 12-dars
// 5-dars: mb('p', '3') — takrorlash sarlavhasi (data-n); ichidagi bloklar bilan — takror('3', ichki HTML), dvigatel/qismlar.mjs
// 7-dars: mb('v', 'xursand') — kostyum, mb('n', 'qadam') — tovush; qiymat oq kapsulada (data-q — blockly.js, blokQiymat)
const KOS_NOM = { xotirjam: 'xotirjam', xursand: 'xursand', hayron: 'hayron', oylanadi: 'o‘ylanadi' }
// 8-dars: mb('a', 'right') — shart sarlavhasi (data-yon), tomon oq kapsulada; ichidagi bloklar bilan — shart('right', ichki)
// 11-dars: mb('q', 'gold') — olmaga tekkanda (data-q: apple | gold); mb('f') — «▶ Boshlash» bosilganda; mb('z', 0) — set ball to 0, mb('c', 1) — change ball by 1 (data-n)
const OLMA_NOM = { apple: 'apple', gold: 'gold apple', cactus: 'cactus' }
const mb = (t, matn = 'Salom!', cls = '') => { const [f, nom] = BL[t]; if (t === 'q') { const q = OLMA_NOM[matn] ? matn : 'apple'; return `<span class="mb f-${f} ${cls}" data-tur="q" data-q="${q}">${IKON[t]}<span>${nom}</span><span class="xy"><i>${OLMA_NOM[q]}</i></span></span>` } // 13-dars: mb('y', '0,0') — go to son katakli (katak «rA-B» bo'lsa — ichida random oval), mb('m', '1-10') — random bloki
  const rndI = (sp) => { const [a, c] = sp.slice(1).split('-'); return `<span class="mrnd">random <i>${a}</i> to <i>${c}</i></span>` }
  if (t === 'y') { const [x0 = '0', y0 = '0'] = String(matn === 'Salom!' ? '0,0' : matn).split(','); return `<span class="mb f-${f} ${cls}" data-tur="y" data-x="${x0}" data-y="${y0}">${IKON.x}<span>${nom}</span><span class="xy">x: ${/^r/.test(x0) ? rndI(x0) : `<i>${x0}</i>`} y: ${/^r/.test(y0) ? rndI(y0) : `<i>${y0}</i>`}</span></span>` }
  if (t === 'm') { const [a = '1', c = '10'] = String(matn === 'Salom!' ? '1-10' : matn).split('-'); return `<span class="mb f-${f} mb-oval ${cls}" data-tur="m" data-ra="${a}" data-rb="${c}">${IKON[t]}<span>${nom}</span><span class="xy"><i>${a}</i> to <i>${c}</i></span></span>` }
  if (t === 'f' || t === 'g') return `<span class="mb f-${f} ${cls}" data-tur="${t}">${IKON[t]}<span>${nom}</span></span>`; if (t === 'z' || t === 'c' || t === 'i') { const s0 = String(matn), [v0, n0] = s0.indexOf(':') >= 0 ? s0.split(':') : ['', s0], n = /^-?\d+$/.test(n0) ? n0 : t === 'c' ? '1' : '0', vr = v0 || (typeof DARS !== 'undefined' && DARS.ozgaruvchi && DARS.ozgaruvchi[0]) || 'ball', nk = +n < 0 ? '−' + -n : n; return `<span class="mb f-${f} ${cls}" data-tur="${t}"${v0 ? ` data-v="${v0}"` : ''} data-n="${n}">${IKON[t]}<span>${nom}</span><span class="xy"><i>${vr}</i> ${t === 'z' ? 'to' : t === 'c' ? 'by' : '='} <i>${nk}</i>${t === 'i' ? ' then' : ''}</span></span>` } if (t === 'a') { const y = TUGMA_K[matn] && matn !== 'space' ? matn : 'right'; return `<span class="mb f-${f} ${cls}" data-yon="${y}">${IKON[t]}<span>${nom}</span><span class="xy"><i>${TUGMA_K[y]}</i> then</span></span>` } if (t === 'v' || t === 'n') { const q = matn === 'Salom!' ? (t === 'v' ? 'xursand' : 'qadam') : matn; return `<span class="mb f-${f} ${cls}" data-q="${q}">${IKON[t]}<span>${nom}</span><span class="xy"><i>${KOS_NOM[q] || q}</i></span></span>` } if (t === 'p') { const n = /^\d+$/.test(String(matn)) ? matn : '3'; return `<span class="mb f-${f} ${cls}" data-n="${n}">${IKON[t]}<span>${nom}</span><span class="xy"><i>${n}</i></span></span>` } if (t === 'k') { const k = TUGMA_K[matn] ? matn : 'right'; return `<span class="mb f-${f} ${cls}" data-tugma="${k}">${IKON[t]}<span>${nom}</span><span class="xy"><i>${TUGMA_K[k]}</i> key pressed</span></span>` } if (t === 'x') { const [x, y] = mbXY(matn); return `<span class="mb f-${f} ${cls}" data-x="${x}" data-y="${y}">${IKON[t]}<span>${nom}</span><span class="xy">x: <i>${x}</i> y: <i>${y}</i></span></span>` } return `<span class="mb f-${f} ${cls}">${IKON[t]}<span>${nom}</span>${t === 's' ? `<span class="inp">${matn}</span>` : ''}</span>` }
const yigma = (arr) => `<div class="mbw">${arr.map((x) => (typeof x === 'string' ? mb(x) : mb(...x))).join('')}</div>`
const OILA = { h: ['Harakat', 'r'], g: ['Gap', 's'], e: ['Hodisa', 'k'], b: ['Takrorlash', 'p'], v: ['Ko‘rinish', 'v'], t: ['Tovush', 'n'], a: ['Shart', 'a'], o: ['O‘zgaruvchi', 'c'] }
// takrorlash bloki ichidagilari bilan (tayyor dastur HTML'i): ichki — [t | [t, m]…]; blockly.js uni ichma-ich o'qiydi (.c-blok)
const shart = (yon, ichki) => `<div class="c-blok" data-yon="${yon}">${mb('a', yon)}<div class="c-ich">${ichki.map((x) => (typeof x === 'string' ? mb(x) : mb(...x))).join('')}</div><span class="c-tub"></span></div>`
const takror = (n, ichki) => `<div class="c-blok" data-n="${n}">${mb('p', String(n))}<div class="c-ich">${ichki.map((x) => (typeof x === 'string' ? mb(x) : mb(...x))).join('')}</div><span class="c-tub"></span></div>`
const rang = (f, cls = '') => `<span class="rd f-${f} ${cls}"><i>${IKON[OILA[f][1]]}</i><small>${OILA[f][0]}</small></span>`
// 5a: javondagi oilalar va bloklar — dars e'lonidan (DARS.javon; 2-darsda faqat Harakat: r, l, u, d), bo'lmasa 1-darsdagi to'plam
const PAL = DARS.javon || { h: ['r', 'l', 'j'], g: [['s', 'Salom!']] }
const ranglar = (aktiv, holat = {}) => `<div class="rg" data-z="ranglar">${Object.keys(PAL).map((f) => rang(f, (aktiv === f ? 'on ' : '') + (holat[f] || ''))).join('')}</div>`
const palitra = (f, ochiq = PAL[f].length) => `<div class="pl" data-z="bloklar"><small class="f-${f}">${OILA[f][0]}</small>${PAL[f].map((b, i) => `<div class="mbw${i >= ochiq ? ' yopiq' : ''}">${typeof b === 'string' ? mb(b) : mb(...b)}</div>`).join('')}</div>`
const dastur = (arr, yuz, iz = '') => `<div class="dst" data-z="dastur"><span class="dsb"><span class="dyz">${yuz}</span><b>Dastur</b></span>${arr.length ? yigma(arr) : '<span class="bosh">Blokni shu yerga ulang</span>'}${iz || `<small class="dsn">${arr.length} ta blok</small>`}</div>`
const momiqYuz = () => (globalThis.QAH === 'coddy' ? bust('xursand') : hero({ k: globalThis.QAH || 'momiq', lite: true }))
const coddyYuz = () => bust('xursand')
const ust = (tag, h, iz = '') => `<div class="ust" data-z="sarlavha"><span class="tag">${tag}</span><h3 class="sar">${h}</h3>${iz ? `<span class="iz">${iz}</span>` : ''}</div>`
// dunyo: null — manzarasiz (labirint butun oynani egallaydi, 99-qaror)
// dst — dastur ustunining o'zi (3-dars «oldindan ayting»: tayyor dastur sanoq yozuvlari bilan); berilmasa — dastur(prog, yuz)
const studiya = ({ tag, h, iz, aktiv = 'h', holat, ochiq, prog, yuz, sahna, extra = '', dunyo = 'hovli', dst }) => `${ust(tag, h, iz)}${ranglar(aktiv, holat)}${palitra(aktiv, ochiq)}${dst || dastur(prog, yuz)}<div class="oyna">${dunyo ? world(dunyo) : ''}${sahna}</div>${extra}`
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

// 13-dars «Tasodifiy son» — darsning o'z ekran bo'laklari (21.11). Manba: new-junior/manba/013-tasodifiy-son.md («Maydon, savatlar va bloklar», «Topshiriqlar»).
// Maydon — 3–6-darsdagi bog' (katak.js maydonHtml): 7 × 5, (x, y), Y tepaga; savatlar — m.savat ([x, y, guruh?]); tushgan olmalar — dvigatel chizadi.
const MB = { w: 7, h: 5, daraxt: [[1, 1], [4, 3], [6, 1]], gul: [[0, 4], [2, 3], [5, 4], [6, 3]] }
const md = (m = {}) => ({ ...MB, start: [0, 0], ...m })
const maydon = (m, aktyor, o = {}) => maydonHtml(md(m), { aktyor, ...o })
const coddyK = () => robot({ pose: 'turadi', yuz: 'xursand' })
const qahK = () => (globalThis.QAH === 'coddy' ? robot({ pose: 'turadi', yuz: 'xursand' }) : hero({ k: globalThis.QAH || 'momiq', mood: 'xursand' }))
const SV = DARS.savatlar
// har ekranning maydoni: savatlar va qahramon katagi (manba jadvali)
const M13 = {
  HUK: { start: [3, 0] }, P6: { savat: SV.P6, start: [6, 2] },
  B1A: { savat: SV.B1A, start: [3, 0] }, B1B: { savat: SV.B1B, start: [0, 2] }, B1C: { savat: SV.B1C, start: [5, 2] }, B1Y: { savat: SV.B1Y, start: [3, 2] },
  P7: { savat: SV.P7, start: [1, 0] }, B2A: { savat: SV.B2A, start: [3, 2] }, B2B: { savat: SV.B2B, start: [0, 2] }, B2C: { savat: SV.B2C, start: [0, 0] }, B2Y: { savat: SV.B2Y, start: [1, 2] },
  P8: { savat: SV.P8, start: [3, 2] }, B3A: { savat: SV.B3A, start: [4, 4] }, B3B: { savat: SV.B3B, start: [3, 2] }, B3C: { savat: SV.B3C, start: [3, 0] }, B3Y: { start: [3, 2] }, P11: { start: [3, 2] },
}
// dastur ustuni: «Olma dasturi» (tasmada olma), dastur, «n / N ta blok», «Sinov: 0 / 3»; qah — 3-bekat: tepada «Qahramon» qatori (to'rt strelka, tayyor)
const OLMA_IK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 8c-.6-2.4-2.6-3.6-2.6-3.6" fill="none" stroke="#6B4423" stroke-width="1.7" stroke-linecap="round"/><path d="M12.6 6.6c1.4-2.4 4.4-2.4 4.4-2.4-.4 2.4-2.6 3.2-4.4 2.4z" fill="#4CB050"/><path d="M12 8.4c-1.6-1.2-7-1.6-7.8 3.8-.6 4.4 2.6 8.8 5.2 8.8 1.2 0 1.6-.6 2.6-.6s1.4.6 2.6.6c2.6 0 5.8-4.4 5.2-8.8-.8-5.4-6.2-5-7.8-3.8z" fill="#F0435A"/></svg>'
const TORT = [['right', 'r', '→'], ['left', 'l', '←'], ['up', 'u', '↑'], ['down', 'd', '↓']]
const qahQ = () => `<div class="bq-q" role="button" data-z="qahramon"><b>Qahramon:</b><span class="bq-s">${TORT.map(([k, , s]) => `<i data-k="${k}">${s}</i>`).join('')}</span><span class="bq-o">▾</span><div class="bq-och">${TORT.map(([k, t]) => `<div class="bq-d">${mb('k', k)}${mb(t)}</div>`).join('')}<small>Qahramon tayyor — o‘zgartirilmaydi</small></div></div>`
const dst13 = (r, chegara, { qah = false, sinov = true } = {}) => `<div class="dst" data-z="dastur"><span class="dsb"><span class="dyz olma-ega">${OLMA_IK}</span><b>Olma dasturi</b></span>${qah ? qahQ() : ''}${r.length ? `<div class="mbw">${r.map((x) => (typeof x === 'string' ? x : mb(...x))).join('')}</div>` : '<span class="bosh">Blokni shu yerga ulang</span>'}<small class="dsn">${r.filter((x) => !(x[2] || '').includes('solo-faqat')).reduce((a, x) => a + (typeof x === 'string' ? (x.match(/class="mb /g) || []).length : String(x[1] || '').split('r').length), 0)} / ${chegara} ta blok</small>${sinov ? '<small class="sinov-n">Sinov: 0 / 3</small>' : ''}</div>`
// kichik maydon (zinapoya, reja): savatlar (jigarrang kvadratcha), qahramon; dastur va sonlar yo'q (audit saboqlari)
const miniMaydon = (m, { cls = 'mini' } = {}) => {
  const W = MB.w * 10, H = MB.h * 10, Y = (y) => (MB.h - 1 - y) * 10, s = m.start || [0, 0]
  let h = ''
  for (let q = 0; q < MB.h; q++) for (let x = 0; x < MB.w; x++) h += `<rect x="${x * 10 + 0.6}" y="${q * 10 + 0.6}" width="8.8" height="8.8" rx="2" fill="${(x + MB.h - 1 - q) % 2 ? '#F7EACB' : '#F3E3BE'}"/>`
  MB.daraxt.forEach(([x, y]) => { h += `<circle cx="${x * 10 + 3.6}" cy="${Y(y) + 3.6}" r="2.8" fill="#3E8E4E"/>` })
  ;(m.savat || []).forEach(([x, y]) => { h += `<path d="M${x * 10 + 1.6} ${Y(y) + 4}h6.8l-1 4.4h-4.8z" fill="#C9955A" stroke="#8A5A2E" stroke-width=".6"/>` })
  ;(m.olma || []).forEach(([x, y]) => { h += `<circle cx="${x * 10 + 5}" cy="${Y(y) + 4.6}" r="2.4" fill="#F0435A"/>` })
  h += `<circle cx="${s[0] * 10 + 5}" cy="${Y(s[1]) + 5}" r="2.4" fill="#2F8FF0"/>`
  return `<svg class="${cls} mk" viewBox="-1 -1 ${W + 2} ${H + 2}" aria-hidden="true"><rect x="-1" y="-1" width="${W + 2}" height="${H + 2}" rx="3" fill="#9AD57C" opacity=".55"/>${h}</svg>`
}
const mm = (id, o) => miniMaydon(M13[id], o)
const POG = {
  bir: [['1', 10, mm('B1A'), 'Butun qator'], ['2', 8, mm('B1B'), 'Uchta savat'], ['3', 5, mm('B1C'), 'Ustun'], ['★', 2, mm('B1Y'), 'Ikki olma']],
  ikki: [['1', 9, mm('B2A'), 'Kichik kvadrat'], ['2', 7, mm('B2B'), 'To‘rtburchak'], ['3', 5, mm('B2C'), 'Katta to‘rtburchak'], ['★', 2, mm('B2Y'), 'Olma yomg‘iri']],
  oyin: [['1', 8, mm('B3A'), 'Bog‘ o‘rtasi'], ['2', 6, mm('B3B'), 'Tepa qator'], ['3', 4, mm('B3C'), 'Chap ustun'], ['★', 2, mm('B3Y'), 'O‘z o‘yiningiz']],
}
// huk (2–4-qadam): pastki qator, Coddy (3, 0); har kartada ikki o'yin × uch olma — kartaning o'zida ikki qator son
const HUK = [
  ['A', 'Boshqa son qo‘yamiz', { olma: '5,5,5', nat: '✕ ikki o‘yin bir xil', ok: '0' }, () => `<span class="hk-d">${mb('y', '5,0')}</span>`],
  ['B', 'Navbat bilan uch joy', { olma: '1,5,3', nat: '✕ yana bir xil', ok: '0' }, () => `<span class="hk-d">${mb('y', '1,0')}${mb('y', '5,0')}${mb('y', '3,0')}</span><small class="hk-n">1-olma · 2-olma · 3-olma</small>`],
  ['C', 'Dastur o‘zi tanlasin', { tanlov: '4,1,6|2,5,0', nat: '✓ har o‘yin boshqacha', ok: '1' }, () => `<span class="hk-d">${mb('y', 'r0-6,0')}</span>`],
]
const SONI = { A: 3, B: 4, C: 7 }
const PIK_R = { A: 'c1', B: 'c2', C: 'c3' }
const hKartalar = ({ son, nat = false, avto = false } = {}) => `<div class="jv dkv hkv">${HUK.map(([l, t, d, rasm]) => `<div class="jk ${PIK_R[l]}${nat ? (l === 'C' ? ' n-ok' : ' n-yoq') : ''}"${avto ? `${d.olma ? ` data-olma="${d.olma}"` : ''}${d.tanlov ? ` data-tanlov="${d.tanlov}"` : ''} data-ok="${d.ok}"` : ''} data-nat="${d.nat}"><span class="jt"><span><b>${l}</b><q>${t}</q></span>${nat ? `<small class="jn">${d.nat}</small>` : ''}</span><div class="hk-r">${rasm()}<span class="ho-q">${nat ? (l === 'C' ? '<span>1-o‘yin: <b>4 · 1 · 6</b></span><span>2-o‘yin: <b>2 · 5 · 0</b></span>' : l === 'A' ? '<span>1-o‘yin: <b>5 · 5 · 5</b></span><span>2-o‘yin: <b>5 · 5 · 5</b></span>' : '<span>1-o‘yin: <b>1 · 5 · 3</b></span><span>2-o‘yin: <b>1 · 5 · 3</b></span>') : ''}</span></div>${son ? `<span class="jr-s" aria-label="${son[l]} bola">${ODAM}<b>${son[l]}</b></span>` : ''}</div>`).join('')}</div>`
// tushgan olmalar (statik rasm: javob, xulosa, natija) — xira belgi yoki olma
const OLMA_SVG = (x, y, iz) => `<g class="kt-olma${iz ? ' iz-olma' : ''}" transform="translate(${x * 100 + 50} ${(4 - y) * 100 + 52})">${MD_OLMA}</g>`
const olmaliMaydon = (m, aktyor, olmalar, o = {}) => maydon(m, aktyor, o).replace('<g class="kt-q"', olmalar.map(([x, y, iz]) => OLMA_SVG(x, y, iz)).join('') + '<g class="kt-q"')
// 5-qadam: zar va random 1 to 6 — son birma-bir (studiya.js «raqam»: [data-r]; ko'rinadigani — eng oxirgi yongan)
const ZAR = (n) => { const N = { 1: [[12, 12]], 2: [[7, 7], [17, 17]], 3: [[7, 7], [12, 12], [17, 17]], 4: [[7, 7], [17, 7], [7, 17], [17, 17]], 5: [[7, 7], [17, 7], [12, 12], [7, 17], [17, 17]], 6: [[7, 6], [17, 6], [7, 12], [17, 12], [7, 18], [17, 18]] }[n] || []; return `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="1.5" y="1.5" width="21" height="21" rx="5" fill="#fff" stroke="#0D2137" stroke-width="1.4"/>${N.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2" fill="#0D2137"/>`).join('')}</svg>` }
const zarRasm = () => `<div class="zr" data-z="zar"><span class="zr-z"><i class="q0">${ZAR(0)}</i><i class="q1" data-r="2">${ZAR(4)}</i><i class="q3" data-r="3">${ZAR(2)}</i></span><span class="zr-b">${mb('m', '1-6')}<b class="zr-s q1" data-r="2">4</b><b class="zr-s q3" data-r="3">2</b></span></div>`

// bekatlar: bitta son · ikki son · o'yin
const ZAR_OQ = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.4" y="3.4" width="17.2" height="17.2" rx="4" fill="none" stroke="#fff" stroke-width="2.4"/><circle cx="12" cy="12" r="2" fill="#fff"/></svg>'
const IKKI_OQ = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="6" width="9" height="9" rx="2.4" fill="none" stroke="#fff" stroke-width="2"/><rect x="13" y="9" width="9" height="9" rx="2.4" fill="none" stroke="#fff" stroke-width="2"/><circle cx="6.5" cy="10.5" r="1.4" fill="#fff"/><circle cx="17.5" cy="13.5" r="1.4" fill="#fff"/></svg>'
const OLMA_OQ = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 8.4c-1.6-1.2-7-1.6-7.8 3.8-.6 4.4 2.6 8.8 5.2 8.8 1.2 0 1.6-.6 2.6-.6s1.4.6 2.6.6c2.6 0 5.8-4.4 5.2-8.8-.8-5.4-6.2-5-7.8-3.8z" fill="#fff"/><path d="M12 8c-.4-2-1.8-3.4-1.8-3.4" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/></svg>'
const BEKATLAR = [['h', 'Bitta son', ZAR_OQ], ['g', 'Ikki son', IKKI_OQ], ['y', 'O‘yin', OLMA_OQ]]
const darsOxiri = () => `<div class="gl kd3" data-z="dars oxirida"><small>Dars oxirida · o‘z o‘yiningiz · Dasturini o‘qib berasiz</small><div class="kd3-r lb2">${miniMaydon({ ...M13.B3A, olma: [[3, 1], [5, 2], [4, 0]] }, { cls: 'kd-mk' })}</div><b>O‘z o‘yiningiz</b></div>`
const LUPA = '<svg class="kd-xy" viewBox="0 0 100 64" aria-hidden="true"><rect x="0" y="0" width="100" height="64" rx="6" fill="#F4F8FD"/><rect x="14" y="12" width="40" height="11" rx="3" fill="#2F8FF0"/><rect x="14" y="26" width="40" height="11" rx="3" fill="#FF4F28"/><rect x="14" y="40" width="40" height="11" rx="3" fill="#2F8FF0"/><circle cx="70" cy="30" r="13" fill="none" stroke="#0D2137" stroke-width="3.4"/><path d="M79 40l10 10" stroke="#0D2137" stroke-width="4" stroke-linecap="round"/></svg>'
const keyingiDars = () => `<div class="gl kd3" data-z="keyingi dars"><small>Keyingi dars</small><div class="kd3-r lb2">${LUPA}</div><b>14 · Xatoni topish</b></div>`
const otganDars = () => `<div class="otd"><small>O‘tgan darsda</small><div class="tf-l"><div class="tf"><div class="tf-r">${yigma([['c', 'jon:-1']])}</div><div class="tf-t"><b>Jon</b><span>Tugasa, o‘yin tugaydi</span></div></div></div></div>`

// natija (17, 18-qadam): ta random qo‘ydi · ta olma tushirdi · ta olma terdi
const SINF_T = [['h', ZAR_OQ, 'ta random qo‘ydi', 168], ['g', OLMA_OQ, 'ta olma tushirdi', 512], ['y', YULDUZ_OQ, 'ta olma terdi', 140]]
const BOLA_T = [['h', ZAR_OQ, 'ta random qo‘ydi', 14], ['g', OLMA_OQ, 'ta olma tushirdi', 41], ['y', YULDUZ_OQ, 'ta olma terdi', 20]]

// 13-dars «Tasodifiy son» ekranlari (E) — 21.11. Matn manbasi: new-junior/manba/013-tasodifiy-son.md (qo'shtirnoq ichidagi gaplar — aynan).
// 1–2-bekat: olma dasturi («▶ Ishga tushir» — olma tushadi), 3-bekat: o'yin («▶ Boshlash»; qahramon strelkalar bilan, olma dasturi olmani tushiradi).
const fO = (hint) => fB({ hint, label: `${PLAY}Boshlash` })
const fI = (hint) => fB({ hint })
const xyQator = (q) => `<div class="xyl">${q.map(([r, t]) => `<p data-r="${r}">${t}</p>`).join('')}</div>`
const st = (o) => studiya({ aktiv: 'h', dunyo: null, ...o })
const qg = (gap) => `<div class="cg qg"><span class="av">${momiqYuz()}</span><p><small>Momiq</small>${gap}</p></div>`
const doska = (sar, cg, son, zinaR, kichik, iz = '') => `<div class="chap">${matn('Mashq', sar, cg)}<div class="tugatdi"><small>${kichik}</small><b>${son}<i> / 14</i></b>${yulduzlar14(son)}${iz ? `<span class="tg-iz">${iz}</span>` : ''}</div></div><div class="oyna">${world('hovli')}${zina(zinaR)}</div>`
const H1 = 'Savatlarning X va Y sini o‘qing', H2 = 'X ga ham, Y ga ham random', H3 = 'Olma dasturini tuzing, keyin ▶ Boshlash'
const bol = (tag, h, iz, id, hint, { r = [], oyin = false } = {}) => ({ body: () => st({ tag, h, iz, dst: dst13(r, DARS.studiya[id].chegara, { qah: oyin, sinov: !oyin }), sahna: maydon(M13[id], qahK()) }), foot: () => (oyin ? fO(hint) : fI(hint)) })
const E = {
  P1: { rol: 'p', b: 0, t: 't1', nom: 'Kirish', izoh: '1-qadam. Maydon, Coddy (3, 0) da; pastda «O‘tgan darsda» — jon.',
    body: () => `<div class="chap">${matn('', 'Bugun o‘yin har safar <em>boshqacha</em>!', 'Salom! Bugun dastur sonni o‘zi tanlaydi.')}${otganDars()}</div><div class="oyna">${maydon(M13.HUK, coddyK())}</div>`,
    foot: () => fU('Kirdi: 12 / 14', 'Keyingi ›') },
  P2: { rol: 'p', b: 0, t: 't1', nom: 'Savol', izoh: '2-qadam. Olma doim (3, 0) ga tushadi — Coddy qimirlamay yutdi («Olma: 3 / 3»); uchta karta.',
    body: () => `<div class="chap">${matn('Savol', DARS.savol, 'Qimirlamay yutdim. Olma doim shu yerga tushadi.')}${hKartalar({ son: SONI })}</div><div class="oyna">${maydon(M13.HUK, coddyK())}<span class="gl oyin-yz">Olma: <b>3 / 3</b></span><span class="gl ball-qy">Har o‘yin boshqacha bo‘lsin</span></div>`,
    foot: () => fU('Javob berdi: 14 / 14', 'Sinab ko‘ramiz ›') },
  P2N: { rol: 'b', b: 0, t: 't1', nom: 'Savol (noutbukda)', izoh: '2-qadam, bola: kartani bosishning o‘zi javob.',
    body: () => `<div class="chap">${matn('Savol', DARS.savol, 'Qaysi yo‘l bilan har o‘yin boshqacha bo‘ladi?')}${hKartalar()}</div><div class="oyna">${maydon(M13.HUK, coddyK())}<span class="gl ball-qy">Har o‘yin boshqacha bo‘lsin</span></div>`,
    foot: () => fJim('Birini tanlang') },
  P2S: { rol: 'p', b: 0, t: 't1', nom: 'Uch sinov', izoh: '3-qadam. Har kartada ikki o‘yin × uch olma: A — 5 · 5 · 5 ikki marta; B — 1 · 5 · 3 ikki marta; C — 4 · 1 · 6 va 2 · 5 · 0 (tanlov oldindan berilgan; studiya.js hukOlma).',
    body: () => `<div class="chap">${matn('Savol', DARS.savol, 'Qimirlamay yutdim. Olma doim shu yerga tushadi.')}${hKartalar({ son: SONI, avto: true })}</div><div class="oyna">${maydon(M13.HUK, coddyK())}</div>`,
    foot: () => fU('', 'Keyingi ›') },
  P2C: { rol: 'p', b: 0, t: 't1', nom: 'Javob', izoh: '4-qadam. A va B xira, C oltin; maydonda C ning olti tushgan joyi xira belgi bilan.',
    body: () => `<div class="chap">${matn('Javob', 'Dastur o‘zi <em>tanlaydi</em>', 'Endi olma qayerga tushishini men ham bilmayman.')}${hKartalar({ son: SONI, nat: true })}</div><div class="oyna">${olmaliMaydon(M13.HUK, coddyK(), [[4, 0, 1], [1, 0, 1], [6, 0, 1], [2, 0, 1], [5, 0, 1], [0, 0, 1]])}</div>`,
    foot: () => fU('', 'Keyingi ›') },
  P3: { rol: 'p', b: 0, t: 't1', nom: 'Yangi so‘z: tasodifiy son', izoh: '5-qadam. «Keyingi» — birma-bir: zar va random 1 to 6; «4»; «2» (studiya.js, raqam).',
    body: () => `<div class="chap">${matn('Yangi so‘z', '<em>Tasodifiy son</em> nima?', 'Tasodifiy son — dastur o‘zi tanlaydigan son.')}${xyQator([[1, '<span class="hq">1 dan 6 gacha — zar kabi</span>'], [2, '<span class="hq"><b class="zr-k">4</b>Bu safar — 4</span>'], [3, '<span class="hq"><b class="zr-k">2</b>Har safar boshqa son</span>']])}</div><div class="oyna">${world('hovli')}<div class="qt-o" data-r="1">${zarRasm()}</div></div>`,
    foot: () => fU('', 'Keyingi ›') },
  P4: { rol: 'p', b: 0, t: 't2', nom: 'Reja', izoh: '6-qadam. Tepalik: uch bekat; cho‘qqida — dars oxirida nima bo‘lishi.',
    body: () => `<div class="oyna to">${world('hovli')}<div class="gl pan">${matn('Reja', 'Bugun nima <em>qilamiz</em>?', 'Uchta bekat. Birinchisidan boshlaymiz.')}</div>${darsOxiri()}${tepalik({ otdi: 0, joy: 0 })}</div>`,
    foot: () => fU('', 'Boshladik ›') },
  P6: { rol: 'p', b: 1, t: 't3', nom: 'Ko‘ramiz: random bloki', izoh: '7-qadam. Savatlar (1, 0)…(5, 0); Coddy (6, 2); ustoz go to qo‘yadi, X ga random; tanlov: «8» — maydondan tashqari, keyin 1 to 5 bilan 4, 2, 5 (solo’da dastur tayyor).',
    body: () => st({ tag: 'Ko‘ramiz', h: '<em>random</em> — tasodifiy son', dst: dst13([['y', 'r1-10,0', 'solo-faqat']], 2), sahna: maydon(M13.P6, coddyK()) }),
    foot: () => fU('', 'Keyingi ›') },
  P5: { rol: 'p', b: 1, t: 't1', nom: 'Sinf doskasi: bitta son', izoh: '8-qadam.',
    body: () => doska('Endi <em>o‘zingiz</em>!', 'Savatlarni o‘qing va random sonlarini tanlang.', 4, POG.bir, 'Uch pog‘onani tugatdi', 'Har belgi — uch pog‘onani tugatgan bitta bola'),
    foot: () => fU('Yordam so‘radi: 1 ta noutbuk', 'Keyingi ›') },
  P4B: { rol: 'p', b: 2, t: 't2', nom: 'Reja · 2-bekat', izoh: '9-qadam.',
    body: () => `<div class="oyna to">${world('hovli')}<div class="gl pan">${matn('Reja · 2-bekat', '2 · <em>Ikki son</em>', 'Endi X ham, Y ham tasodifiy.')}</div>${darsOxiri()}${tepalik({ otdi: 1, joy: 2 })}</div>`,
    foot: () => fU('', 'Keyingi ›') },
  P7: { rol: 'p', b: 2, t: 't3', nom: 'Ko‘ramiz: ikki son', izoh: '10-qadam. Savatlar (3, 1)…(5, 2); tayyor go to x: (random 3 to 5) y: 1 — «4»: (4, 1), Kamvoy «Bu savat bo‘sh qoladi!»; Y ga random 1 to 2 — (5, 2), (3, 1), (4, 2).',
    body: () => st({ tag: 'Ko‘ramiz', h: 'Ikki son — ikki <em>random</em>', dst: dst13([['y', 'r3-5,1']], 3), sahna: maydon(M13.P7, coddyK()) }),
    foot: () => fU('', 'Keyingi ›') },
  P5G: { rol: 'p', b: 2, t: 't1', nom: 'Sinf doskasi: ikki son', izoh: '11-qadam.',
    body: () => doska('Ikkala son <em>tasodifiy</em>!', 'Savatlarning chetlarini toping — X va Y uchun.', 5, POG.ikki, 'Uch pog‘onani tugatdi'),
    foot: () => fU('Yordam so‘radi: 1 ta noutbuk', 'Keyingi ›') },
  P9: { rol: 'p', b: 2, t: 't1', nom: 'Xulosa: tasodifiy son', izoh: '12-qadam. Ikki karta; o‘ngda 10-qadamdagi savatlar va tushgan joylar.',
    body: () => `<div class="chap">${matn('Xulosa', '<em>Tasodifiy son</em>', 'Dastur sonni o‘zi tanladi — har safar boshqa.')}<div class="tf-l"><div class="tf"><div class="tf-r"><span class="zr-b">${mb('m', '1-6')}<b class="zr-s on">4</b></span></div><div class="tf-t"><b>Tasodifiy son</b><span>Dastur o‘zi tanlaydigan son</span></div></div><div class="tf"><div class="tf-r">${mb('m', '2-4')}</div><div class="tf-t"><b>random 2 to 4</b><span>2, 3 yoki 4</span></div></div></div></div><div class="oyna">${olmaliMaydon(M13.P7, coddyK(), [[4, 1, 1], [5, 2, 1], [3, 1, 1], [4, 2]])}</div>`,
    foot: () => fU('', 'Keyingi ›') },
  P4C: { rol: 'p', b: 3, t: 't2', nom: 'Reja · 3-bekat', izoh: '13-qadam.',
    body: () => `<div class="oyna to">${world('hovli')}<div class="gl pan">${matn('Reja · 3-bekat', '3 · <em>O‘yin</em>', 'Oxirgi bekat: o‘yin har safar boshqacha.')}</div>${darsOxiri()}${tepalik({ otdi: 2, joy: 3 })}</div>`,
    foot: () => fU('', 'Keyingi ›') },
  P8: { rol: 'p', b: 3, t: 't3', nom: 'Ko‘ramiz: o‘yin', izoh: '14-qadam. Savatlar (0, 0)…(6, 0); Coddy (3, 2); «Qahramon» tayyor; ustoz olma dasturiga go to x: (random 0 to 6) y: 0; o‘yin — tanlov 5, 1, keyin yangi o‘yinda 2 (solo’da dastur tayyor).',
    body: () => st({ tag: 'Ko‘ramiz', h: 'O‘yin: <em>olma terish</em>', dst: dst13([['y', 'r0-6,0', 'solo-faqat']], 2, { qah: true, sinov: false }), sahna: maydon(M13.P8, coddyK()) }),
    foot: () => fU('', 'Keyingi ›') },
  P5B: { rol: 'p', b: 3, t: 't1', nom: 'Sinf doskasi: o‘yin', izoh: '15-qadam.',
    body: () => doska('O‘yiningizni <em>tuzing</em>!', 'Olma dasturini tuzing, keyin o‘ynang.', 6, POG.oyin, 'Uch o‘yinni yutdi'),
    foot: () => fU('Yordam so‘radi: 1 ta noutbuk', 'Keyingi ›') },
  P11: { rol: 'p', b: 3, t: 't3', nom: 'Olma dasturingizni o‘qib bering', izoh: '16-qadam. Maydon savatsiz, Coddy (3, 2); olma dasturi bo‘sh — bola o‘qiydi, ustoz qo‘yadi va o‘ynaydi. Proyektorda ism yo‘q; bola noutbukida — oxirgi yechgan pog‘onasi (A·1).',
    body: () => st({ tag: 'Ko‘rsatish', h: 'Olma dasturingizni <em>o‘qib bering</em>', iz: 'Siz o‘qiysiz — men teraman.', dst: dst13([], 3, { qah: true, sinov: false }), sahna: maydon(M13.P11, coddyK()) }),
    foot: () => fU('', 'Keyingi ›') },
  P12: { rol: 'p', b: 4, t: 't2', nom: 'Yakun', izoh: '17-qadam.',
    body: () => `<div class="oyna to">${world('hovli')}${KONFETI()}<div class="gl pan">${matn('Yakun', 'O‘yiningiz har safar <em>boshqacha</em>!', '')}<div class="tm ix"><small class="bsoz">Bugungi so‘z</small><div class="tr"><span class="ti d"><i></i><i></i><i></i></span><span><b>Tasodifiy son</b>Dastur o‘zi tanlaydigan son</span></div></div></div>${keyingiDars()}${tepalik({ otdi: 3, joy: 3, pose: 'quvonadi' })}</div>`,
    foot: () => fU('', 'Keyingi ›') },
  P14: { rol: 'p', b: 4, t: 't1', nom: 'Sinfimiz bugun', izoh: '18-qadam. Butun sinf jami (haqiqiy son, ismsiz).',
    body: () => `<div class="chap">${matn('Sinf natijasi', 'Sinfimiz <em>bugun</em>', 'Hammangiz zo‘r ishladingiz!')}${sinfNatija()}</div><div class="oyna">${world('hovli')}${KONFETI()}<div class="qq sn-qq"><span class="m1">${hero({ k: 'momiq', mood: 'xursand' })}</span><span class="m2">${robot({ pose: 'quvonadi' })}</span><span class="m3">${hero({ k: 'katak', mood: 'xursand' })}</span></div></div>`,
    foot: () => fU('', 'Darsni yakunlash') },

  // ---- bola noutbuki ----
  B0: { rol: 'b', b: 0, t: 't4', nom: 'Darsga kirish', izoh: '1-qadam.',
    body: () => kutish({ kech: false, uq: '', h: 'Salom, <em>Aziz</em>!', sub: '', aktyor: yolchaYakka(coddyQ('', 'salom', 'xursand')) }),
    foot: () => fKid('Tayyor bo‘lsangiz — tugmani bosing', 'Tayyorman') },
  BK: { rol: 'b', b: 0, t: 't4', nom: 'Ustoz ekraniga qarang', izoh: 'Ustoz ko‘rsatayotganda.',
    body: () => kutish({ h: 'Ustoz ekraniga qarang', sub: 'Ustozni tinglang', aktyor: yolchaYakka(momiqQ('', 'xursand')) }),
    foot: () => fJim('') },
  BQ: { rol: 'b', b: 0, t: 't2', nom: 'Qahramon tanlash', izoh: 'Faqat qahramoni yo‘q bolaga (94-qaror).',
    body: () => `<div class="oyna to">${world('hovli')}<div class="gl pan">${matn('Qahramon', 'Qahramoningizni <em>tanlang</em>', 'Birini tanlang — bugun unga buyruq berasiz.')}</div>${tanlovQator('momiq')}</div>`,
    foot: () => fJim('Birini tanlang') },
  B1A: { rol: 'b', b: 1, t: 't3', nom: 'Mashq · 1-pog‘ona', izoh: '8-qadam. go(R0-6, 2).', ...bol('Mashq · 1-pog‘ona', 'Butun <em>qator</em>', 'Olma istalgan savatga tushsin.', 'B1A', H1) },
  B1B: { rol: 'b', b: 1, t: 't3', nom: 'Mashq · 2-pog‘ona', izoh: '8-qadam. go(R2-4, 0).', ...bol('Mashq · 2-pog‘ona', 'Uchta <em>savat</em>', 'Olma faqat savatlarga tushsin.', 'B1B', H1) },
  B1C: { rol: 'b', b: 1, t: 't3', nom: 'Mashq · 3-pog‘ona', izoh: '8-qadam. go(3, R0-4).', ...bol('Mashq · 3-pog‘ona', '<em>Ustun</em>', 'Savatlar ustma-ust.', 'B1C', H1) },
  B1Y: { rol: 'b', b: 1, t: 't3', nom: 'Mashq · ★ qo‘shimcha', izoh: '8-qadam. go(R1-3, 4) go(R5-6, 0).', ...bol('Mashq · ★ qo‘shimcha', 'Ikki <em>olma</em>', '1-olma «1» savatlarga, 2-olma «2» savatlarga.', 'B1Y', H1) },
  B2A: { rol: 'b', b: 2, t: 't3', nom: 'Mashq · 1-pog‘ona', izoh: '11-qadam. go(R0-1, R2-3).', ...bol('Mashq · 1-pog‘ona', 'Kichik <em>kvadrat</em>', 'To‘rtta savat.', 'B2A', H2) },
  B2B: { rol: 'b', b: 2, t: 't3', nom: 'Mashq · 2-pog‘ona', izoh: '11-qadam. go(R2-4, R0-1).', ...bol('Mashq · 2-pog‘ona', '<em>To‘rtburchak</em>', 'Olti savat.', 'B2B', H2) },
  B2C: { rol: 'b', b: 2, t: 't3', nom: 'Mashq · 3-pog‘ona', izoh: '11-qadam. go(R2-5, R0-2).', ...bol('Mashq · 3-pog‘ona', 'Katta <em>to‘rtburchak</em>', 'O‘n ikki savat.', 'B2C', H2) },
  B2Y: { rol: 'b', b: 2, t: 't3', nom: 'Mashq · ★ qo‘shimcha', izoh: '11-qadam. R3[go(R3-5, R0-1)].', ...bol('Mashq · ★ qo‘shimcha', 'Olma <em>yomg‘iri</em>', 'Bir ishga tushirishda uchta olma.', 'B2Y', H2) },
  B3A: { rol: 'b', b: 3, t: 't3', nom: 'O‘yin · 1-pog‘ona', izoh: '15-qadam. Tayyor go(4, 1) — random qo‘shiladi: go(R3-5, R0-2).', ...bol('Mashq · 1-pog‘ona', 'Bog‘ <em>o‘rtasi</em>', 'Olma dasturida random yo‘q.', 'B3A', H3, { r: [['y', '4,1']], oyin: true }) },
  B3B: { rol: 'b', b: 3, t: 't3', nom: 'O‘yin · 2-pog‘ona', izoh: '15-qadam. go(R1-4, 4).', ...bol('Mashq · 2-pog‘ona', 'Tepa <em>qator</em>', 'Savatlar eng tepada.', 'B3B', H3, { oyin: true }) },
  B3C: { rol: 'b', b: 3, t: 't3', nom: 'O‘yin · 3-pog‘ona', izoh: '15-qadam. go(0, R0-3).', ...bol('Mashq · 3-pog‘ona', 'Chap <em>ustun</em>', 'Savatlar chap chetda.', 'B3C', H3, { oyin: true }) },
  B3Y: { rol: 'b', b: 3, t: 't3', nom: 'O‘yin · ★ qo‘shimcha', izoh: '15-qadam. Savatsiz: random bor, maydondan chiqmaydi, daraxt va gulga tushmaydi, kamida 2 joy.', ...bol('Mashq · ★ qo‘shimcha', 'O‘z <em>o‘yiningiz</em>', 'Olmalar qayerga tushishini o‘zingiz tanlang.', 'B3Y', H3, { oyin: true }) },
  B5: { rol: 'b', b: 4, t: 't1', nom: 'O‘z natijasi', izoh: '17–18-qadam. «Siz bugun» — haqiqiy son.',
    body: () => `<div class="chap">${matn('Sizning natijangiz', 'O‘yiningiz har safar <em>boshqacha</em>!', '')}${qg('Olmalarni dastur o‘zi tanlagan joylarga tushirdingiz.')}<small class="st-s">Siz bugun</small>${sinfNatija(BOLA_T)}</div><div class="oyna">${olmaliMaydon(M13.B3A, qahK(), [[3, 1], [5, 2, 1], [4, 0, 1]])}<div class="gl kd2 a-tr"><small>Momiq</small><b>Keyingi darsda xatolarni topamiz — ko‘rishguncha!</b></div></div>`,
    foot: () => fJim('Dars tugadi') },
}

// 13-dars «Tasodifiy son» qadamlari (QADAM) va ustoz varag'i (VARAQ) — 21.11. Manba: new-junior/manba/013-tasodifiy-son.md, 18 qadam.
// 16-qadam bola ro'yxati 'oxirgi' (A·1) — bola noutbukida oxirgi yechgan pog'onasi o'z dasturi bilan.
const QADAM = [
  ['Kirish', 'P1', ['B0', 'BK']],
  ['Savol: olma har safar boshqa joyga qanday tushadi?', 'P2', ['P2N', 'BK']],
  ['Uch sinov', 'P2S', ['BK'], 'Ustoz yo‘llarni sinayapti — kuzating'],
  ['Javob: dastur o‘zi tanlaydi', 'P2C', ['BK']],
  ['Yangi so‘z: tasodifiy son', 'P3', ['BK'], 'Yangi so‘z: tasodifiy son'],
  ['Reja', 'P4', ['BK'], 'Bugun: uchta bekat'],
  ['Ko‘ramiz: random bloki', 'P6', ['BK'], 'Ustoz random blokini ko‘rsatyapti — kuzating'],
  ['Bitta son: pog‘onalar', 'P5', ['B1A', 'B1B', 'B1C', 'B1Y', 'BK']],
  ['2-bekat', 'P4B', ['BK'], '2-bekat: ikki son'],
  ['Ko‘ramiz: ikki son', 'P7', ['BK'], 'Ustoz ikkinchi random qo‘yyapti — kuzating'],
  ['Ikki son: pog‘onalar', 'P5G', ['B2A', 'B2B', 'B2C', 'B2Y', 'BK']],
  ['Xulosa: tasodifiy son', 'P9', ['BK'], 'Xulosa: tasodifiy son'],
  ['3-bekat', 'P4C', ['BK'], '3-bekat: o‘yin'],
  ['Ko‘ramiz: o‘yin', 'P8', ['BK'], 'Ustoz o‘ynayapti — kuzating'],
  ['O‘yin: pog‘onalar', 'P5B', ['B3A', 'B3B', 'B3C', 'B3Y', 'BK']],
  ['Olma dasturingizni o‘qib bering', 'P11', 'oxirgi'],
  ['Yakun', 'P12', ['B5']],
  ['Sinfimiz bugun', 'P14', ['B5']],
]
// ustoz varag'i: [Ekranda · Siz (manbadagi tayanch gaplar, aynan) · Bola o'rganadi]
const VARAQ = [
  ['«13-dars · Tasodifiy son» — «Bugun o‘yin har safar boshqacha!» Maydon, Coddy (3, 0); pastda «O‘tgan darsda» — jon.', '«O‘tgan darsda o‘yinga jon qo‘shdik.» «Bugun olma har safar boshqa joyga tushadi.» «Noutbukda «Tayyorman» tugmasini bosing.»', 'Bugun olma har safar boshqa joyga tushadi.'],
  ['Savol: «Olma har safar boshqa joyga qanday tushadi?» Olma doim (3, 0) ga — Coddy qimirlamay yutdi. Uchta karta: A «Boshqa son qo‘yamiz» · B «Navbat bilan uch joy» · C «Dastur o‘zi tanlasin».', '«Olma doim bir joyga tushadi — o‘ynash qiziq emas. Har o‘yin boshqacha bo‘lsin.» «Har kim noutbukida bitta kartani tanlasin: qanday qilamiz?»', 'Taxmin qiladi — bu huk.'],
  ['Uch sinov: har kartada ikki o‘yin × uch olma. A — «1-o‘yin: 5 · 5 · 5», «2-o‘yin: 5 · 5 · 5» — ✕. «Keyingi» — B: 1 · 5 · 3 ikki marta — ✕. «Keyingi» — C: 4 · 1 · 6 va 2 · 5 · 0 — ✓.', '«Boshqa son ham, navbat ham — ikkinchi o‘yinda o‘sha-o‘sha. Yodlab olsa bo‘ladi.» «Uchinchisida sonni dastur o‘zi tanladi — har o‘yin boshqacha.»', 'Dastur sonni o‘zi tanlay oladi.'],
  ['Javob: «Dastur o‘zi tanlaydi». A va B xira, C oltin; maydonda olti tushgan joy.', '«Sonni o‘zimiz yozmaymiz — dastur har safar o‘zi tanlaydi. Shuning uchun har o‘yin boshqacha.»', 'Dastur o‘zi tanlaydi.'],
  ['Yangi so‘z: «Tasodifiy son nima?» «Keyingi» — birma-bir: zar va random 1 to 6 → «4» → «2».', '«Tasodifiy son — dastur o‘zi tanlaydigan son. Qaysi biri — oldindan bilmaymiz.» «random 1 to 6 — 1 dan 6 gacha istalgan son. Lekin 7 hech qachon chiqmaydi.»', 'Yangi so‘z: tasodifiy son.'],
  ['Reja: tepalik — bitta son → ikki son → o‘yin; cho‘qqida «o‘z o‘yiningiz · Dasturini o‘qib berasiz».', '«Bugun uchta bekat: bitta son, ikki son, o‘yin.» «Dars oxirida olmalari har safar boshqa joyga tushadigan o‘z o‘yiningizni tuzasiz.»', 'Darsda qayerda turganini biladi.'],
  ['Ko‘ramiz: «random — tasodifiy son». Javondan go to x: 0 y: 0; X dagi sonni bosing — «random»: go to x: (random 1 to 10) y: 0. «▶ Ishga tushir»: «8» — olma maydondan chiqdi, Kamvoy «Maydon tugadi!» («random 8 ni tanladi. Maydonda X — 0 dan 6 gacha»). Sonlarni 1 va 5 ga — uch marta: 4, 2, 5 — «Har safar boshqa joy!».', '«random — tasodifiy. Dastur shu sonlar orasidan birini o‘zi tanlaydi.» «Sonlarni savatlarga qarab tanlaymiz: 1 dan 5 gacha.» «Endi o‘zingiz.»', 'random bloki.'],
  ['Mashq: «Endi o‘zingiz!» — zinapoya: 1 butun qator · 2 uchta savat · 3 ustun · ★ ikki olma.', '«Avval savatlarni o‘qing: X i qaysi sondan qaysi songacha? Y i-chi?» «Uch marta ishga tushiring — har safar savatga tushyaptimi?» Oxirida: «To‘xtadik. Qo‘llar klaviaturadan.»', 'Bitta sonni tasodifiy qiladi.'],
  ['Tepalik: 1-bekat ✓ — «Ikki son».', '«Bitta tasodifiy sonni bildik. Endi ikkalasi tasodifiy bo‘ladi.»', 'Darsda qayerda turganini biladi.'],
  ['Ko‘ramiz: «Ikki son — ikki random». Tayyor go to x: (random 3 to 5) y: 1 — «4»: Kamvoy «Bu savat bo‘sh qoladi!» («(3, 2) dagi savatga olma tushmaydi. random sonlarini tekshiring»). Y ga random 1 to 2 — (5, 2), (3, 1), (4, 2).', '«Bitta random — bitta son. Savatlar ikki qatorda bo‘lsa, Y ham tasodifiy bo‘lsin.» «X ning o‘z random i, Y ning o‘z random i. Har biri o‘z sonlari bilan.» «Endi o‘zingiz.»', 'Ikkala sonni tasodifiy qiladi.'],
  ['Mashq: «Ikkala son tasodifiy!» — zinapoya: 1 kichik kvadrat · 2 to‘rtburchak · 3 katta to‘rtburchak · ★ olma yomg‘iri.', '«Chap pastki savat va o‘ng yuqori savat — ularning X va Y si sizga kerak.» «Daraxt va gulga tushmasin — sonlarni ortiqcha olmang.» Oxirida: «To‘xtadik. Qo‘llar klaviaturadan.»', 'X ga ham, Y ga ham random.'],
  ['Xulosa: «Tasodifiy son». Ikki karta: dastur o‘zi tanlaydigan son; random 2 to 4 — 2, 3 yoki 4.', '«Tasodifiy son — dastur o‘zi tanlaydigan son.» «random 2 to 4 — 2, 3 yoki 4. Qaysi biri — bilmaymiz, lekin shu sonlardan biri.»', 'Tasodifiy son nima ekanini aytadi.'],
  ['Tepalik: 1, 2 ✓ — «O‘yin».', '«Ikki bekatdan o‘tdik. Oxirgisi — olma terish o‘yini.»', 'Darsda qayerda turganini biladi.'],
  ['Ko‘ramiz: «O‘yin: olma terish». «Qahramon» tayyor; olma dasturiga go to x: (random 0 to 6) y: 0. «▶ Boshlash»: «O‘yin: strelkalarni bosing · Olma: 0 / 5»; olma (5, 0) ga; ↓ ↓ → → — oldi, «Olma: 1 / 5»; yangi olma (1, 0) ga. «■ To‘xtatish», yana «▶ Boshlash» — birinchi olma endi (2, 0) ga.', '«Qahramonni strelkalar bilan yurgizamiz. Olmani esa dastur tushiradi.» «Olma olindi — olma dasturi yana ishlaydi, random yana son tanlaydi.» «Endi o‘zingiz: olma dasturini tuzing va o‘ynang.»', 'Tasodifiy o‘yin.'],
  ['Mashq: «O‘yiningizni tuzing!» — zinapoya: 1 bog‘ o‘rtasi · 2 tepa qator · 3 chap ustun · ★ o‘z o‘yiningiz.', '«Avval olma dasturi: random sonlari savatlarga qarab. Keyin «▶ Boshlash».» «Beshta olmani terganingizda — yutdingiz.» Oxirida: «To‘xtadik. Qo‘llar klaviaturadan.»', 'O‘z o‘yinini tuzadi.'],
  ['«Olma dasturingizni o‘qib bering». Maydon savatsiz, olma dasturi bo‘sh. Proyektorda ism yo‘q; bola noutbukida — oxirgi yechgan pog‘onasi.', '«Kim olma dasturini o‘qib beradi? Avval X, keyin Y: qaysi sondan qaysi songacha.» «Kuzating: olmalar qayerlarga tushyapti?»', 'Olma dasturini o‘qib beradi.'],
  ['Yakun: «O‘yiningiz har safar boshqacha!» Bugungi so‘z — tasodifiy son; keyingi dars — 14 · Xatoni topish.', '«Uchala bekatdan o‘tdik: bitta son, ikki son, o‘yin.» «Bugungi so‘z — tasodifiy son: dastur o‘zi tanlaydigan son.» «Keyingi darsda dasturlardagi xatolarni topib tuzatamiz.»', 'O‘z natijasini ko‘radi.'],
  ['Sinfimiz bugun: nechta random qo‘yildi, nechta olma tushirildi va terildi (haqiqiy son, ismsiz).', '«Hammangiz zo‘r ishladingiz!» (keyin raqamlarni o‘qiydi) «Kompyuter o‘yinlarida ham shunday: sovg‘a va to‘siq har safar boshqa joyda chiqadi.»', 'Sinf bilan birga natijani ko‘radi.'],
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
const kerak = [...new Set([...QADAM.flatMap(([, p, b]) => [p, ...(Array.isArray(b) ? b : [])]), ...(DARS.bola.qahramonYoq ? [DARS.bola.qahramonYoq] : [])])]
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
