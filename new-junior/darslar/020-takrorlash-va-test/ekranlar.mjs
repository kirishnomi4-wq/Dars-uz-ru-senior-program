// 20-dars «Takrorlash va test» ekranlari (E) — 22.11. Matn manbasi: new-junior/manba/020-takrorlash-va-test.md v1 (qo'shtirnoq ichidagi gaplar — aynan).
// Studiya ekranlari — 18-darsdagi kosmik o'yin (uch personaj, kosmik.js; 019 dan kod oynasi). 1-bekat — tezkor takrorlash, 2-bekat — test (maslahatsiz), 3-bekat — katta test.
const fO = (hint) => fB({ hint, label: `${PLAY}Boshlash` })
const st = (o) => studiya({ aktiv: 'K', dunyo: null, ...o })
const qg = (gap) => `<div class="cg qg"><span class="av">${momiqYuz()}</span><p><small>Momiq</small>${gap}</p></div>`
const JV = DARS.javon
const doska = (sar, cg, son, zinaR, kichik, iz = '', yorliq = 'Mashq') => `<div class="chap">${matn(yorliq, sar, cg)}<div class="tugatdi"><small>${kichik}</small><b>${son}<i> / 14</i></b>${yulduzlar14(son)}${iz ? `<span class="tg-iz">${iz}</span>` : ''}</div></div><div class="oyna kosmos-o">${world('kosmos')}${zina(zinaR)}</div>`
// studiya sahnasi: maydon (dushman asli tepada), kapsulalar, sanoq «Dushman: 0»
const sahna = (aktyor, v = { ball: 0 }) => maydon({}, aktyor, { asl: [3, 4] }) + ozgQ(v) + sanoqK()
const bol = (tag, h, iz, id, hint) => {
  const b = DARS.studiya[id], P = b.bosh.personaj
  return { body: () => st({ tag, h, iz, javon: JV, dst: dstP(b.chegara, { cur: P.tanla }), sahna: sahna(qahK()) }), foot: () => fO(hint) }
}
const H1 = 'Maslahat bor — foydalaning', H2 = 'Test: o‘zingiz yeching', H3 = 'Ro‘yxatga qarang'
const E = {
  P1: { rol: 'p', b: 0, t: 't1', nom: 'Kirish', izoh: '1-qadam. Kosmos maydoni: raketa (ichida Coddy), o‘q, dushman; pastda «O‘tgan darsda» — kod.',
    body: () => `<div class="chap">${matn('', 'Bugun <em>test</em>!', 'Salom! Bugun o‘zingizni sinaymiz.')}${otganDars()}</div><div class="oyna">${maydon({}, coddyK(), { asl: [3, 4], oq: [[3, 2]] })}</div>`,
    foot: () => fU('Kirdi: 12 / 14', 'Keyingi ›') },
  P2: { rol: 'p', b: 0, t: 't1', nom: 'Savol', izoh: '2-qadam. Uchta karta: klon, o‘zgaruvchi, shart (baho emas).',
    body: () => `<div class="chap">${matn('Savol', DARS.savol, 'Halol javob bering — shu bo‘yicha takrorlaymiz.')}${hKartalar({ son: SONI })}</div><div class="oyna">${maydon({}, coddyK(), { asl: [3, 4] })}</div>`,
    foot: () => fU('Javob berdi: 14 / 14', 'Keyingi ›') },
  P2N: { rol: 'b', b: 0, t: 't1', nom: 'Savol (noutbukda)', izoh: '2-qadam, bola: kartani bosishning o‘zi javob.',
    body: () => `<div class="chap">${matn('Savol', DARS.savol, 'Qaysi mavzu qiyinroq?')}${hKartalar()}</div><div class="oyna">${maydon({}, coddyK(), { asl: [3, 4] })}</div>`,
    foot: () => fJim('Birini tanlang') },
  P2C: { rol: 'p', b: 0, t: 't1', nom: 'Javob', izoh: '3-qadam. Uchala karta, nechta bola tanlagani; eng ko‘p tanlangani oltin hoshiyada.',
    body: () => `<div class="chap">${matn('Javob', 'Sinf <em>tanlovi</em>', 'Avval shuni takrorlaymiz.')}${hKartalar({ son: SONI, eng: 'C' })}</div><div class="oyna">${maydon({}, coddyK(), { asl: [3, 4] })}</div>`,
    foot: () => fU('', 'Keyingi ›') },
  P3: { rol: 'p', b: 0, t: 't1', nom: 'Eslaymiz', izoh: '4-qadam. «Keyingi» — birma-bir: klon, o‘zgaruvchi, shart (studiya.js, raqam).',
    body: () => `<div class="chap">${matn('Eslaymiz', 'Bugungi test <em>shulardan</em>', 'Uchta mavzu — bitta o‘yin.')}${eslaymiz()}</div><div class="oyna kosmos-o">${world('kosmos')}<div class="gl ta xs-ta" data-r="3"><small class="bsoz">Bugun test</small><b>Klon · O‘zgaruvchi · Shart</b></div></div>`,
    foot: () => fU('', 'Keyingi ›') },
  P4: { rol: 'p', b: 0, t: 't2', nom: 'Reja', izoh: '5-qadam.',
    body: () => `<div class="oyna to">${world('kosmos')}<div class="gl pan">${matn('Reja', 'Bugun nima <em>qilamiz</em>?', 'Uchta bekat. Oxirida natijangizni ko‘rasiz.')}</div>${darsOxiri()}${tepalik({ otdi: 0, joy: 0 })}</div>`,
    foot: () => fU('', 'Boshladik ›') },
  P7: { rol: 'p', b: 1, t: 't3', nom: 'Ko‘ramiz: o‘yin', izoh: '6-qadam. 18-dars o‘yini tayyor, kod yopiq — ustoz «▶ Boshlash»ni bosadi, o‘yin ishlaydi.',
    body: () => st({ tag: 'Ko‘ramiz', h: 'Sizning <em>o‘yiningiz</em>', javon: JV, dst: dstP(12, { cur: 'raketa' }), sahna: sahna(coddyK()) }),
    foot: () => fU('', 'Keyingi ›') },
  P5: { rol: 'p', b: 1, t: 't1', nom: 'Sinf doskasi: takrorlaymiz', izoh: '7-qadam.',
    body: () => doska('Tezkor <em>takrorlash</em>!', 'Maslahat bor — foydalaning.', 4, POG.takr, 'Uch pog‘onani tugatdi', 'Har belgi — uch pog‘onani tugatgan bitta bola'),
    foot: () => fU('Yordam so‘radi: 1 ta noutbuk', 'Keyingi ›') },
  P4B: { rol: 'p', b: 2, t: 't2', nom: 'Reja · 2-bekat', izoh: '8-qadam.',
    body: () => `<div class="oyna to">${world('kosmos')}<div class="gl pan">${matn('Reja · 2-bekat', '2 · <em>Test</em>', 'Endi maslahatsiz — o‘zingiz!')}</div>${darsOxiri()}${tepalik({ otdi: 1, joy: 2 })}</div>`,
    foot: () => fU('', 'Keyingi ›') },
  P5G: { rol: 'p', b: 2, t: 't1', nom: 'Sinf doskasi: test', izoh: '9-qadam.',
    body: () => doska('O‘zingiz <em>yeching</em>!', 'Maslahatsiz — o‘zingiz.', 5, POG.test, 'Uch pog‘onani tugatdi', 'Har belgi — uch pog‘onani tugatgan bitta bola', '', 'Test'),
    foot: () => fU('Yordam so‘radi: 1 ta noutbuk', 'Keyingi ›') },
  P4C: { rol: 'p', b: 3, t: 't2', nom: 'Reja · 3-bekat', izoh: '10-qadam.',
    body: () => `<div class="oyna to">${world('kosmos')}<div class="gl pan">${matn('Reja · 3-bekat', '3 · <em>Katta test</em>', 'Oxirgi bekat: butun o‘yin!')}</div>${darsOxiri()}${tepalik({ otdi: 2, joy: 3 })}</div>`,
    foot: () => fU('', 'Keyingi ›') },
  P10: { rol: 'p', b: 3, t: 't3', nom: 'Ko‘ramiz: ro‘yxat', izoh: '11-qadam. To‘liq o‘yin tayyor; chek-list javon ostida — ustoz o‘ynaydi, band-band ✓ bo‘ladi.',
    body: () => st({ tag: 'Ko‘ramiz', h: '<em>Ro‘yxat</em>', javon: JV, dst: dstP(12, { cur: 'raketa' }), sahna: sahna(coddyK(), { ball: 0, jon: 3 }) }),
    foot: () => fU('', 'Keyingi ›') },
  P5B: { rol: 'p', b: 3, t: 't1', nom: 'Sinf doskasi: katta test', izoh: '12-qadam.',
    body: () => doska('O‘yinni <em>yuting</em>!', 'Hammasi birga ishlasin.', 6, POG.katta, 'O‘yinni yutdi', 'Har belgi — o‘yinni yutgan bitta bola', '', 'Katta test'),
    foot: () => fU('Yordam so‘radi: 1 ta noutbuk', 'Keyingi ›') },
  P13: { rol: 'p', b: 3, t: 't1', nom: 'Qiyin mavzu', izoh: '13-qadam. Test topshiriqlari: nechta bola yechdi; ustoz eng kam yechilganini qayta tushuntiradi.',
    body: () => doska('Qiyin <em>topshiriq</em>', 'Shuni qayta ko‘ramiz.', 5, POG.test, 'Test topshiriqlarini yechdi', 'Har belgi — shu topshiriqni yechgan bitta bola', '', 'Natija'),
    foot: () => fU('', 'Keyingi ›') },
  P12: { rol: 'p', b: 4, t: 't2', nom: 'Yakun', izoh: '14-qadam.',
    body: () => `<div class="oyna to">${world('kosmos')}${KONFETI()}<div class="gl pan">${matn('Yakun', 'Test <em>tugadi</em>!', '')}<div class="tm ix"><small class="bsoz">Bugun</small><div class="tr"><span class="ti d"><i></i><i></i><i></i></span><span><b>Takrorlash · Test · Katta test</b>Siz nimani bilishingizni ko‘rdingiz</span></div></div></div>${keyingiDars()}${tepalik({ otdi: 3, joy: 3, pose: 'quvonadi' })}</div>`,
    foot: () => fU('', 'Keyingi ›') },
  P14: { rol: 'p', b: 4, t: 't1', nom: 'Sinfimiz bugun', izoh: '15-qadam. Butun sinf jami (haqiqiy son, ismsiz).',
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
  B1A: { rol: 'b', b: 1, t: 't3', nom: 'Takrorlash · 1', izoh: '7-qadam. Dushman: tayyor ▶[C] · K[…] — bola ▶[R5[C]].', ...bol('Takrorlash · 1', '<em>Beshta</em> dushman', '▶ bosilganda beshta dushman tushsin', 'B1A', H1) },
  B1B: { rol: 'b', b: 1, t: 't3', nom: 'Takrorlash · 2', izoh: '7-qadam. O‘q: bo‘sh T — bola change ball by 1.', ...bol('Takrorlash · 2', '<em>Ball</em>', 'O‘q urganda ball oshsin', 'B1B', H1) },
  B1C: { rol: 'b', b: 1, t: 't3', nom: 'Takrorlash · 3', izoh: '7-qadam. Raketa: T[jon −1] — bola if jon = 0 then → game over.', ...bol('Takrorlash · 3', 'O‘yin <em>tugaydi</em>', 'Jon 0 bo‘lsa — o‘yin tugasin', 'B1C', H1) },
  B1Y: { rol: 'b', b: 1, t: 't3', nom: 'Takrorlash · 4', izoh: '7-qadam. Kod ochiq — belgilangan blokning qatorini bosadi (3 marta).', ...bol('Takrorlash · 4', 'Qaysi <em>qator</em>?', 'Belgilangan blokning qatorini bosing', 'B1Y', H1) },
  B2A: { rol: 'b', b: 2, t: 't3', nom: 'Test · 1', izoh: '9-qadam. Dushman dasturi noldan: ▶[R5[C]] · K[G R4[↓] D]; kamida 2 ustun.', ...bol('Test · 1', '<em>Dushmanlar</em>', 'Beshta dushman, har xil ustundan tushsin', 'B2A', H2) },
  B2B: { rol: 'b', b: 2, t: 't3', nom: 'Test · 2', izoh: '9-qadam. O‘q: tayyor S[C] · K[…] — bola T[change ball by 2].', ...bol('Test · 2', '<em>Ball</em>', 'Har urilgan dushman 2 ball bersin', 'B2B', H2) },
  B2C: { rol: 'b', b: 2, t: 't3', nom: 'Test · 3', izoh: '9-qadam. Raketa: faqat ← → — bola ▶[set jon 3] · T[jon −1; if jon = 0 → game over].', ...bol('Test · 3', '<em>Jon</em>', 'Jon 0 bo‘lsa — o‘yin tugasin. Sinab ko‘ring', 'B2C', H2) },
  B2Y: { rol: 'b', b: 2, t: 't3', nom: 'Test · 4', izoh: '9-qadam. Kod ochiq — kodda dushmanlar sonini 8 qiladi.', ...bol('Test · 4', '<em>Kodda</em> son', 'Kodda dushmanlar sonini 8 qiling', 'B2Y', H2) },
  B3A: { rol: 'b', b: 3, t: 't3', nom: 'Katta test · 1', izoh: '12-qadam. To‘liq o‘yin noldan: raketa ← →, o‘q S[C], dushman ▶[R5[C]]; yutadi — kamida 3 ball, jon qoldi; ro‘yxat 5 / 5.', ...bol('Katta test · 1', 'To‘liq <em>o‘yin</em>', 'Yuting: kamida 3 ball, jon qolsin', 'B3A', H3) },
  B3Y: { rol: 'b', b: 3, t: 't3', nom: 'Katta test · ★', izoh: '12-qadam. Kamida 8 dushman (dushman dasturidagi repeat), yutadi.', ...bol('Katta test · ★', 'O‘z <em>o‘yiningiz</em>', 'Kamida 8 ta dushman — yuting', 'B3Y', H3) },
  B5: { rol: 'b', b: 4, t: 't1', nom: 'O‘z natijasi', izoh: '14–15-qadam. «Siz bugun» — haqiqiy son.',
    body: () => `<div class="chap">${matn('Sizning natijangiz', 'Test <em>tugadi</em>!', '')}${qg('Testni o‘zim yechdim!')}<small class="st-s">Siz bugun</small>${sinfNatija(BOLA_T)}</div><div class="oyna">${maydon({}, qahK(), { asl: [3, 4], dush: [[5, 2]], oq: [[1, 2]] })}${ozgQ({ ball: 9, jon: 2 })}<div class="gl kd2 a-tr"><small>Momiq</small><b>Keyingi darsda o‘z o‘yiningizni yasaymiz!</b></div></div>`,
    foot: () => fJim('Dars tugadi') },
}
