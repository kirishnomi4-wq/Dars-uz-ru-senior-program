// 8-dars e'loni (20.11): «Shart: agar … unda». Manba: new-junior/manba/008-shart.md (v1 — agent yozdi; tavsiya bo'yicha qurildi, savollar ko'rik sahifasida).
// Faqat ma'lumot. Har topshiriqda ikki labirint, dastur bitta (bosh.egiz); shart — «yo'l bormi» (if path → then; sahna.js katakShart).
const DARS = {
  raqam: 8,
  nom: 'Shart',
  savol: 'Bitta dastur bilan <em>qanday</em> yetamiz?',
  // javon: yangi Shart (if path →), Takrorlash (repeat 2), Harakat (to'rt move)
  javon: { a: [['a', 'right']], b: [['p', '2']], h: ['r', 'l', 'u', 'd'] },
  blokChegara: 12,
  maydon: { w: 7, h: 5 }, // dastur ustuni eniga moslanadi (blockly.js blMasshtab — ichma-ich if)
  joyQolmadi: 'Dasturga N ta blok sig‘adi',

  namuna: { qahramon: ['Momiq', 'Zippi'], ism: 'Aziz' },
  qahramonli: ['BK', 'B1A', 'B1B', 'B1C', 'B1Y', 'B2A', 'B2B', 'B2C', 'B2Y', 'B3A', 'B3B', 'B3C', 'B3Y', 'B5'],
  coddyli: [],

  // pog'onalar: 1–4 devorgacha (B1A…B1Y), 5–8 ikki shart (B2A…B2Y), 9–12 xatoni topamiz (B3A…B3Y)
  sanoq: { P1: ['kirdi'], P2: ['javob'], P5: ['pog', 3, 0], P5G: ['pog', 7, 4], P5B: ['pog', 11, 8], P14: ['sinf'] },

  bola: { javob: 'P2N', qahramonYoq: 'BQ', yakun: 'B5', kutish: 'BK', kutishGap: 'Ustozni tinglang' },
  ochish: [],
  kichikGap: { B0: 'Dars hozir boshlanadi', P2N: 'Javobingiz qabul qilindi', B1Y: 'Hamma pog‘onalarni bajardingiz!', B2Y: 'Hamma pog‘onalarni bajardingiz!', B3Y: 'Hamma pog‘onalarni bajardingiz!' },

  tugadi: { ustoz: ['Dars tugadi!', 'Ko‘rishguncha — keyingi darsda labirint o‘yini bilan!'], bola: 'Dars tugadi. Ko‘rishguncha!' },

  solo: {
    yol: { 0: ['B0', 'P1'], 1: ['P2N'], 2: ['P2S'], 3: ['P2C'], 4: ['P3'], 5: ['P4'], 6: ['P6'], 7: ['B1A', 'B1B', 'B1C', 'B1Y'], 8: ['P4B'], 9: ['P7'], 10: ['B2A', 'B2B', 'B2C', 'B2Y'], 11: ['P9'], 12: ['P4C'], 13: ['P8'], 14: ['B3A', 'B3B', 'B3C', 'B3Y'], 16: ['B5'] },
    keyingi: ['B1A', 'B1B', 'B1C', 'B1Y', 'B2A', 'B2B', 'B2C', 'B2Y', 'B3A', 'B3B', 'B3C', 'B3Y'],
    gap: [],
  },

  // bosh.egiz — ikki labirint; bosh.shartGap — To'siqvoyning ikki gapi va «N-labirintda yetmadi» (studiya.js natija); bosh.erkinSayr — 15 · ★
  studiya: {
    P2S: { ish: 'huk', gap: { avto: true, keyingi: 'Keyingi ›', sinab: '▶ Sinab ko‘rish' } },
    P3: { ish: 'raqam' },
    P6: { tur: 'yol', chegara: 3, bosh: { sahna: 'katak', prog: [0, 'qoldir'], egiz: true, shartGap: true }, gap: { yetdi: 'Ikkalasida yetdi!' } },
    B1A: { tur: 'yol', chegara: 3, bosh: { sahna: 'katak', prog: 0, pog: 1, egiz: true, shartGap: true }, maslahat: 'Yo‘l qancha — bilmaymiz. Har qadamdan oldin pastni tekshiring', gap: { yetdi: 'Ikkalasida yetdi!' } },
    B1B: { tur: 'yol', chegara: 3, bosh: { sahna: 'katak', prog: 0, pog: 2, egiz: true, shartGap: true }, maslahat: 'repeat soni uzun yo‘lga yetsin — qisqasida shart o‘zi to‘xtatadi', gap: { yetdi: 'Ikkalasida yetdi!' } },
    B1C: { tur: 'yol', chegara: 6, bosh: { sahna: 'katak', prog: 0, pog: 3, egiz: true, shartGap: true }, maslahat: 'Yo‘l ikki bo‘lak: har bo‘lakka o‘z repeat va o‘z sharti', gap: { yetdi: 'Ikkalasida yetdi!' } },
    B1Y: { tur: 'yol', chegara: 9, bosh: { sahna: 'katak', prog: 0, pog: 4, egiz: true, shartGap: true }, maslahat: 'Har burilish — yangi repeat. Har birida shart o‘z tomonini tekshirsin', gap: { yetdi: 'Ikkalasida yetdi!' } },
    P7: { tur: 'yol', chegara: 5, bosh: { sahna: 'katak', prog: 'qoldir', egiz: true, shartGap: true }, gap: { yetdi: 'Ikkalasida yetdi!' } },
    B2A: { tur: 'yol', chegara: 5, joyQolmadi: 'Dasturga N ta blok sig‘adi. Ikki shartni bitta repeat ichiga sig‘diring', bosh: { sahna: 'katak', prog: 0, pog: 5, egiz: true, shartGap: true }, maslahat: 'Yo‘l qaysi ikki tomonga ketyapti? Har tomonga bitta if', gap: { yetdi: 'Ikkalasida yetdi!' } },
    B2B: { tur: 'yol', chegara: 5, joyQolmadi: 'Dasturga N ta blok sig‘adi. Ikki shartni bitta repeat ichiga sig‘diring', bosh: { sahna: 'katak', prog: 0, pog: 6, egiz: true, shartGap: true }, maslahat: 'Qahramondan yulduzga qarang: qaysi ikki tomonni tekshirish kerak?', gap: { yetdi: 'Ikkalasida yetdi!' } },
    B2C: { tur: 'yol', chegara: 5, joyQolmadi: 'Dasturga N ta blok sig‘adi. Ikki shartni bitta repeat ichiga sig‘diring', bosh: { sahna: 'katak', prog: 0, pog: 7, egiz: true, shartGap: true }, maslahat: '2-labirintda yetmasa — repeat soni yetadimi?', gap: { yetdi: 'Ikkalasida yetdi!' } },
    B2Y: { tur: 'yol', chegara: 10, bosh: { sahna: 'katak', prog: 0, pog: 8, egiz: true, shartGap: true }, maslahat: 'Tog‘ ikki bo‘lak: chiqish va tushish. Har bo‘lakka o‘z repeat', gap: { yetdi: 'Ikkalasida yetdi!' } },
    P8: { tur: 'yol', bosh: { sahna: 'katak', prog: 'qoldir', egiz: true, shartGap: true }, gap: { yetdi: 'Xatoni tuzatdingiz!', kam: ['', 'repeat sonini kattaroq qiling va qayta ishga tushiring'] } },
    B3A: { tur: 'yol', chegara: 3, bosh: { sahna: 'katak', prog: 'qoldir', pog: 9, egiz: true, shartGap: true }, maslahat: 'Shart qaysi tomonni tekshiryapti? Qahramon qaysi tomonga yurishi kerak?', gap: { yetdi: 'Xatoni tuzatdingiz!' } },
    B3B: { tur: 'yol', chegara: 5, bosh: { sahna: 'katak', prog: 'qoldir', pog: 10, egiz: true, shartGap: true }, maslahat: 'Qaysi blok urildi? U yurishdan oldin yo‘lni tekshiradimi?', gap: { yetdi: 'Xatoni tuzatdingiz!' } },
    B3C: { tur: 'yol', chegara: 5, bosh: { sahna: 'katak', prog: 'qoldir', pog: 11, egiz: true, shartGap: true }, maslahat: 'Har if ni o‘qing: qaysi tomonni tekshiradi, ichida qaysi tomonga yuradi?', gap: { yetdi: 'Xatoni tuzatdingiz!' } },
    B3Y: { tur: 'yol', chegara: 12, bosh: { sahna: 'katak', prog: 0, pog: 12, erkinSayr: true, shartGap: true }, maslahat: 'Ikki if qo‘ying — har xil tomonga. Qahramon qayerga borishini oldindan o‘ylang', gap: { yetdi: 'Sayringiz tayyor!' } },
    P11: { tur: 'korish', chegara: 12, bosh: { sahna: 'katak', prog: 0 }, gap: { yetdi: 'Sayringiz tayyor!' } },
    B5: { ish: 'natija' },
  },
  // natija: S — muvaffaqiyatli dasturlardagi shart bloklari (har biri bir marta; studiya.js labirintBelgi); L — o'tilgan labirintlar (egizakda 2 ta); xato — 15 · 1–3
  natija: [{ k: 'ta shart qo‘ydi', blok: 'S' }, { k: 'ta labirintdan o‘tdi', blok: 'L' }, { k: 'ta xato tuzatdi', ekran: ['B3A', 'B3B', 'B3C'] }],
  gapStandart: 'Salom!',

  lms: {
    id: 'junior-008-shart-v1', versiya: 'v1', kalit: 'jr008',
    yutuqlar: [{ t: 'pog', n: 3, nom: 'tekshiruvchi' }, { t: 'pog', n: 11, nom: 'izquvar' }],
  },

  varaq: [
    '<b>Asosiy fikr:</b> shart — tekshiriladigan narsa: yo‘l bormi? Ha bo‘lsa — ichidagi bloklar bajariladi, yo‘q bo‘lsa — bajarilmaydi. Dastur bitta — ikki labirintda ham ishlaydi.',
    '<b>Yo‘l:</b> huk (ikki labirint — uch sinov) → yangi so‘z «shart» → reja → 1-bekat «Devorgacha» → 2-bekat «Ikki shart» → 3-bekat «Xatoni topamiz» → o‘qib berish → yakun.',
    '<b>Yangi blok:</b> if path → then — agar yo‘l bo‘lsa, unda (Shart oilasi, kulrang-ko‘k). C-shaklli: javondan bosilsa tanlanadi, keyingi bloklar ichiga tushadi; tanlangan if bo‘lsa, yangi if undan keyin tushadi. Tomon bosib tanlanadi.',
    '<b>Ikki labirint:</b> dastur avval 1-labirintda, keyin 2-labirintda yuradi; har biri yonida ✓ yoki ✕. Sanab yozilgan dastur faqat bittasida ishlaydi — shart bilan yozilgani ikkalasida.',
  ],
}
