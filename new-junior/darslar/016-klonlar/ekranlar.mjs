// 16-dars «Klonlar» ekranlari (E) — 21.11. Matn manbasi: new-junior/manba/016-klonlar.md v1 (qo'shtirnoq ichidagi gaplar — aynan).
// 1–2-bekat: dushman dasturi («▶ Ishga tushir» — asl nusxa yasaydi, nusxalar tushadi; klon.js), 3-bekat: o'yin («▶ Boshlash»; qahramon ← →, jon 3).
const fO = (hint) => fB({ hint, label: `${PLAY}Boshlash` })
const fI = (hint) => fB({ hint })
const st = (o) => studiya({ aktiv: 'K', dunyo: null, ...o })
const qg = (gap) => `<div class="cg qg"><span class="av">${momiqYuz()}</span><p><small>Momiq</small>${gap}</p></div>`
// javonlar: 1-bekat — Klon, Hodisa, Harakat (move down), Takrorlash; 2-bekat — + go to, random; 3-bekat — + delete this clone
const JAVON = {
  bir: { K: ['C', 'H'], e: ['f'], h: ['d'], b: [['p', '4']] },
  birGo: { K: ['C', 'H'], e: ['f'], h: ['d', ['x', '3,4']], b: [['p', '4']] }, // 1 · ★: go to (3-darsdagi, son ro'yxatdan)
  kop: { K: ['C', 'H'], e: ['f'], h: ['d', ['y', '3,4']], b: [['p', '4']], o: [['m', '0-6']] },
  oyin: { K: ['C', 'H', 'D'], e: ['f'], h: ['d', ['y', '3,4']], b: [['p', '4']], o: [['m', '0-6']] },
}
const doska = (sar, cg, son, zinaR, kichik, iz = '') => `<div class="chap">${matn('Mashq', sar, cg)}<div class="tugatdi"><small>${kichik}</small><b>${son}<i> / 14</i></b>${yulduzlar14(son)}${iz ? `<span class="tg-iz">${iz}</span>` : ''}</div></div><div class="oyna kosmos-o">${world('kosmos')}${zina(zinaR)}</div>`
const sanoqK = (n, m) => `<span class="gl kl-son">Nusxa: ${n}${m ? ' / ' + m : ''}</span>`
const jonK = (v = 3) => `<div class="gl ball-q kl-jon" data-z="jon" data-doim="jon"><span class="ball-k" data-v="jon"><small>jon:</small><b>${v}</b></span></div>`
// bola pog'onasi: asl katagi (klon.js chizadi), qahramon pastda; r — tayyor dastur
const bol = (tag, h, iz, id, hint, { r = [], oyin = false, qah = [0, 0] } = {}) => {
  const b = DARS.studiya[id], k = b.bosh.klon
  return { body: () => st({ tag, h, iz, javon: oyin ? JAVON.oyin : id[1] === '2' ? JAVON.kop : id === 'B1Y' ? JAVON.birGo : JAVON.bir, dst: dstK(r, b.chegara, { oyin }), sahna: maydon({ start: oyin ? [3, 0] : qah }, qahK()) + sanoqK(0, k.soni || k.kamida) + (oyin ? jonK() : '') }), foot: () => (oyin ? fO(hint) : fI(hint)) }
}
const H1 = 'Nusxa yasang — u yerga tushsin', H2 = 'Nechta nusxa kerak? Har biri qayerdan?', H3 = 'Dushman dasturini tuzing, keyin ▶ Boshlash'
const E = {
  P1: { rol: 'p', b: 0, t: 't1', nom: 'Kirish', izoh: '1-qadam. Kosmos maydoni, tepada dushman, Coddy (3, 0) da; pastda «O‘tgan darsda» — xakaton.',
    body: () => `<div class="chap">${matn('', 'Bugun nusxa <em>yasaymiz</em>!', 'Salom! Bugun bitta dushmandan ko‘p nusxa yasaymiz.')}${otganDars()}</div><div class="oyna">${maydonK({}, coddyK())}</div>`,
    foot: () => fU('Kirdi: 12 / 14', 'Keyingi ›') },
  P2: { rol: 'p', b: 0, t: 't1', nom: 'Savol', izoh: '2-qadam. Uchta karta; maydonda tepada bitta dushman, Coddy pastda.',
    body: () => `<div class="chap">${matn('Savol', DARS.savol, 'Bitta dushman tushdi. Bizga beshta kerak.')}${hKartalar({ son: SONI })}</div><div class="oyna">${maydonK({}, coddyK())}</div>`,
    foot: () => fU('Javob berdi: 14 / 14', 'Sinab ko‘ramiz ›') },
  P2N: { rol: 'b', b: 0, t: 't1', nom: 'Savol (noutbukda)', izoh: '2-qadam, bola: kartani bosishning o‘zi javob.',
    body: () => `<div class="chap">${matn('Savol', DARS.savol, 'Beshta dushmanni qaysi yo‘l bilan tushiramiz?')}${hKartalar()}</div><div class="oyna">${maydonK({}, coddyK())}</div>`,
    foot: () => fJim('Birini tanlang') },
  P2S: { rol: 'p', b: 0, t: 't1', nom: 'Uch sinov', izoh: '3-qadam. A — bitta dushman besh marta (osmonda doim bitta); B — beshta dushman, har biri o‘z dasturi bilan; C — nusxalar: bitta dastur (klon.js klonHuk).',
    body: () => `<div class="chap">${matn('Savol', DARS.savol, 'Bitta dushman tushdi. Bizga beshta kerak.')}${hKartalar({ son: SONI, avto: true })}</div><div class="oyna">${maydonK({}, coddyK())}</div>`,
    foot: () => fU('', 'Keyingi ›') },
  P2C: { rol: 'p', b: 0, t: 't1', nom: 'Javob', izoh: '4-qadam. A va B xira, C oltin; tepada asl, pastda beshta nusxa.',
    body: () => `<div class="chap">${matn('Javob', 'Dastur o‘zi <em>nusxa</em> yasaydi', 'Bitta dastur yozdik — dushman o‘zidan beshta nusxa yasadi.')}${hKartalar({ son: SONI, nat: true })}</div><div class="oyna">${maydonK({}, coddyK(), { nus: [[0, 0], [1, 0], [4, 0], [5, 0], [6, 0]] })}</div>`,
    foot: () => fU('', 'Keyingi ›') },
  P3: { rol: 'p', b: 0, t: 't1', nom: 'Yangi so‘z: klon', izoh: '5-qadam. «Keyingi» — birma-bir: asl, nusxa, uchala nusxa tushdi (studiya.js, raqam).',
    body: () => `<div class="chap">${matn('Yangi so‘z', 'Klon <em>nima</em>?', 'Klon — dastur ishlab turganda yasalgan nusxa.')}${klonSoz()}</div><div class="oyna kosmos-o">${world('kosmos')}<div class="gl ta xs-ta" data-r="3"><small class="bsoz">Bugungi so‘z</small><b>Klon</b><span>Dastur ishlab turganda yasalgan nusxa</span></div></div>`,
    foot: () => fU('', 'Keyingi ›') },
  P4: { rol: 'p', b: 0, t: 't2', nom: 'Reja', izoh: '6-qadam.',
    body: () => `<div class="oyna to">${world('kosmos')}<div class="gl pan">${matn('Reja', 'Bugun nima <em>qilamiz</em>?', 'Uchta bekat. Oxirida dushmanlardan qochadigan o‘yin.')}</div>${darsOxiri()}${tepalik({ otdi: 0, joy: 0 })}</div>`,
    foot: () => fU('', 'Boshladik ›') },
  P7: { rol: 'p', b: 1, t: 't3', nom: 'Ko‘ramiz: nusxa yasaymiz', izoh: '7-qadam. Asl (3, 4), Coddy (6, 0); dastur bo‘sh — ustoz ▶[C], keyin K[R4[↓]] qo‘yadi (solo’da tayyor).',
    body: () => st({ tag: 'Ko‘ramiz', h: 'Nusxa <em>yasaymiz</em>', javon: JAVON.bir, dst: dstK([...ASL(['C']), ...NUSXA(TUSH())], 5), sahna: maydon({ start: [6, 0] }, coddyK()) + sanoqK(0, 1) }),
    foot: () => fU('', 'Keyingi ›') },
  P5: { rol: 'p', b: 1, t: 't1', nom: 'Sinf doskasi: bitta nusxa', izoh: '8-qadam.',
    body: () => doska('Nusxani <em>tushiring</em>!', 'Nusxa yasang — u yerga tushsin.', 4, POG.bir, 'Uch pog‘onani tugatdi', 'Har belgi — uch pog‘onani tugatgan bitta bola'),
    foot: () => fU('Yordam so‘radi: 1 ta noutbuk', 'Keyingi ›') },
  P4B: { rol: 'p', b: 2, t: 't2', nom: 'Reja · 2-bekat', izoh: '9-qadam.',
    body: () => `<div class="oyna to">${world('kosmos')}<div class="gl pan">${matn('Reja · 2-bekat', '2 · <em>Ko‘p nusxa</em>', 'Endi ko‘p nusxa — har biri boshqa joydan.')}</div>${darsOxiri()}${tepalik({ otdi: 1, joy: 2 })}</div>`,
    foot: () => fU('', 'Keyingi ›') },
  P8: { rol: 'p', b: 2, t: 't3', nom: 'Ko‘ramiz: ko‘p nusxa', izoh: '10-qadam. Tayyor ▶[C] · K[R4[↓]]; ustoz create clone ni repeat 5 ichiga qo‘yadi (beshtasi bir ustundan), keyin go to x: (random 0 to 6) y: 4 — tanlov 1, 5, 2, 6, 0 (solo’da tayyor).',
    body: () => st({ tag: 'Ko‘ramiz', h: 'Ko‘p <em>nusxa</em>', javon: JAVON.kop, dst: dstK([...ASL(['C']), ...NUSXA(TUSH())], 9), sahna: maydon({ start: [6, 0] }, coddyK()) + sanoqK(0, 5) }),
    foot: () => fU('', 'Keyingi ›') },
  P5G: { rol: 'p', b: 2, t: 't1', nom: 'Sinf doskasi: ko‘p nusxa', izoh: '11-qadam.',
    body: () => doska('Dushman <em>yomg‘iri</em>!', 'Ko‘p nusxa yasang — har biri boshqa joydan.', 5, POG.kop, 'Uch pog‘onani tugatdi', 'Har belgi — uch pog‘onani tugatgan bitta bola'),
    foot: () => fU('Yordam so‘radi: 1 ta noutbuk', 'Keyingi ›') },
  P9: { rol: 'p', b: 2, t: 't1', nom: 'Xulosa: klon', izoh: '12-qadam. Ikki karta: create clone of myself, when I start as a clone.',
    body: () => `<div class="chap">${matn('Xulosa', '<em>Klon</em>', 'Asl bitta. Nusxa — qancha kerak bo‘lsa.')}<div class="tf-l"><div class="tf"><div class="tf-r">${mb('C')}</div><div class="tf-t"><b>create clone of myself</b><span>Asldan nusxa yasaydi</span></div></div><div class="tf"><div class="tf-r">${mb('H')}</div><div class="tf-t"><b>when I start as a clone</b><span>Har nusxa shuni bajaradi</span></div></div></div></div><div class="oyna">${maydonK({ start: [6, 0] }, coddyK(), { nus: [[1, 0], [5, 0], [2, 0], [0, 0], [4, 0]] })}</div>`,
    foot: () => fU('', 'Keyingi ›') },
  P4C: { rol: 'p', b: 3, t: 't2', nom: 'Reja · 3-bekat', izoh: '13-qadam.',
    body: () => `<div class="oyna to">${world('kosmos')}<div class="gl pan">${matn('Reja · 3-bekat', '3 · <em>O‘yin</em>', 'Endi dushmanlardan qochamiz!')}</div>${darsOxiri()}${tepalik({ otdi: 2, joy: 3 })}</div>`,
    foot: () => fU('', 'Keyingi ›') },
  P10: { rol: 'p', b: 3, t: 't3', nom: 'Ko‘ramiz: yerda qolgan nusxa', izoh: '14-qadam. O‘yin: Coddy (3, 0), jon 3; tayyor ▶[R6[C]] · K[go(R0-6, 4) R4[↓]] — nusxalar yerda qoladi; ustoz delete this clone qo‘shadi (solo’da tayyor dastur, bola o‘zi qo‘shadi).',
    body: () => st({ tag: 'Ko‘ramiz', h: 'Tushgan nusxa <em>o‘chsin</em>', javon: JAVON.oyin, dst: dstK([...ASL(tk(6, ['C'])), ...NUSXA(GOR(), TUSH())], 10, { oyin: true }), sahna: maydon({ start: [3, 0] }, coddyK()) + sanoqK(0, 6) + jonK() }),
    foot: () => fU('', 'Keyingi ›') },
  P5B: { rol: 'p', b: 3, t: 't1', nom: 'Sinf doskasi: o‘yin', izoh: '15-qadam.',
    body: () => doska('Dushmandan <em>qoching</em>!', 'Dushman dasturini tuzing — keyin qochib yuting.', 6, POG.oyin, 'Uch pog‘onani tugatdi', 'Har belgi — uch pog‘onani tugatgan bitta bola'),
    foot: () => fU('Yordam so‘radi: 1 ta noutbuk', 'Keyingi ›') },
  P11: { rol: 'p', b: 3, t: 't3', nom: 'Dushman dasturingizni o‘qib bering', izoh: '16-qadam. 15 · ★ maydoni; dushman dasturi bo‘sh — bola o‘qiydi, ustoz qo‘yadi va o‘ynaydi. Proyektorda ism yo‘q; bola noutbukida — oxirgi yechgan pog‘onasi (A·1).',
    body: () => st({ tag: 'Ko‘rsatish', h: 'Dasturingizni <em>o‘qib bering</em>', iz: 'Siz o‘qiysiz — men o‘ynayman.', javon: JAVON.oyin, dst: dstK([], 12, { oyin: true }), sahna: maydon({ start: [3, 0] }, coddyK()) + sanoqK(0) + jonK() }),
    foot: () => fU('', 'Keyingi ›') },
  P12: { rol: 'p', b: 4, t: 't2', nom: 'Yakun', izoh: '17-qadam.',
    body: () => `<div class="oyna to">${world('kosmos')}${KONFETI()}<div class="gl pan">${matn('Yakun', 'Siz nusxa <em>yasadingiz</em>!', '')}<div class="tm ix"><small class="bsoz">Bugungi so‘z</small><div class="tr"><span class="ti d"><i></i><i></i><i></i></span><span><b>Klon</b>Dastur ishlab turganda yasalgan nusxa</span></div></div></div>${keyingiDars()}${tepalik({ otdi: 3, joy: 3, pose: 'quvonadi' })}</div>`,
    foot: () => fU('', 'Keyingi ›') },
  P14: { rol: 'p', b: 4, t: 't1', nom: 'Sinfimiz bugun', izoh: '18-qadam. Butun sinf jami (haqiqiy son, ismsiz).',
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
  B1A: { rol: 'b', b: 1, t: 't3', nom: 'Mashq · 1-pog‘ona', izoh: '8-qadam. Asl (3, 4); tayyor K[R4[↓]] — bola ▶[C] qo‘shadi.', ...bol('Mashq · 1-pog‘ona', 'Bitta <em>nusxa</em>', 'Nusxa yasang: when ▶ clicked ostiga create clone of myself', 'B1A', H1, { r: NUSXA(TUSH()), qah: [0, 0] }) },
  B1B: { rol: 'b', b: 1, t: 't3', nom: 'Mashq · 2-pog‘ona', izoh: '8-qadam. Asl (5, 4); tayyor ▶[C] — bola K[R4[↓]] qo‘shadi.', ...bol('Mashq · 2-pog‘ona', '<em>Yerga</em>', 'Nusxa yerga tushsin', 'B1B', H1, { r: ASL(['C']), qah: [1, 0] }) },
  B1C: { rol: 'b', b: 1, t: 't3', nom: 'Mashq · 3-pog‘ona', izoh: '8-qadam. Asl (2, 4); tayyor K[R4[↓]] — bola ▶[C C].', ...bol('Mashq · 3-pog‘ona', 'Ikki <em>nusxa</em>', 'Ikkita nusxa yerga tushsin', 'B1C', H1, { r: NUSXA(TUSH()), qah: [5, 0] }) },
  B1Y: { rol: 'b', b: 1, t: 't3', nom: 'Mashq · ★ qo‘shimcha', izoh: '8-qadam. Asl (3, 4); tayyor ▶[C] — bola K[go(1, 4) R4[↓]].', ...bol('Mashq · ★ qo‘shimcha', 'Boshqa <em>ustun</em>', 'Nusxa (1, 0) ga tushsin', 'B1Y', H1, { r: ASL(['C']), qah: [5, 0] }) },
  B2A: { rol: 'b', b: 2, t: 't3', nom: 'Mashq · 1-pog‘ona', izoh: '11-qadam. Tayyor K[go(R0-6, 4) R4[↓]] — bola ▶[R5[C]].', ...bol('Mashq · 1-pog‘ona', '<em>Beshta</em>', 'Beshta nusxa tushsin', 'B2A', H2, { r: NUSXA(GOR(), TUSH()), qah: [0, 0] }) },
  B2B: { rol: 'b', b: 2, t: 't3', nom: 'Mashq · 2-pog‘ona', izoh: '11-qadam. Tayyor ▶[R4[C]] · K[go(3, 4) R4[↓]] — bola 3 o‘rniga random.', ...bol('Mashq · 2-pog‘ona', 'Har xil <em>ustun</em>', 'Nusxalar har xil ustundan tushsin', 'B2B', H2, { r: [...ASL(tk(4, ['C'])), ...NUSXA(['y', '3,4'], TUSH())], qah: [0, 0] }) },
  B2C: { rol: 'b', b: 2, t: 't3', nom: 'Mashq · 3-pog‘ona', izoh: '11-qadam. Tayyor ▶[R5[C]] — bola K[go(R0-3, 4) R4[↓]].', ...bol('Mashq · 3-pog‘ona', 'Chap <em>yarmi</em>', 'Nusxalar faqat chap yarmiga tushsin: 0 dan 3 gacha', 'B2C', H2, { r: ASL(tk(5, ['C'])), qah: [6, 0] }) },
  B2Y: { rol: 'b', b: 2, t: 't3', nom: 'Mashq · ★ qo‘shimcha', izoh: '11-qadam. Dastur bo‘sh — bola ▶[R10[C]] · K[go(R0-6, 4) R4[↓]].', ...bol('Mashq · ★ qo‘shimcha', '<em>Yomg‘ir</em>', 'O‘nta nusxa — hammasi yerga', 'B2Y', H2, { r: [], qah: [6, 0] }) },
  B3A: { rol: 'b', b: 3, t: 't3', nom: 'O‘yin · 1-pog‘ona', izoh: '15-qadam. Tayyor ▶[R5[C]] · K[go(R0-6, 4) R4[↓]] — bola delete this clone qo‘shadi.', ...bol('Mashq · 1-pog‘ona', '<em>Tozalang</em>', 'Tushgan nusxa o‘chsin, keyin yuting', 'B3A', H3, { r: [...ASL(tk(5, ['C'])), ...NUSXA(GOR(), TUSH())], oyin: true }) },
  B3B: { rol: 'b', b: 3, t: 't3', nom: 'O‘yin · 2-pog‘ona', izoh: '15-qadam. Tayyor K[go(R0-6, 4) R4[↓] D] — bola ▶[R8[C]].', ...bol('Mashq · 2-pog‘ona', '<em>Sakkizta</em>', 'Sakkizta dushman — va yuting', 'B3B', H3, { r: NUSXA(GOR(), TUSH(), ['D']), oyin: true }) },
  B3C: { rol: 'b', b: 3, t: 't3', nom: 'O‘yin · 3-pog‘ona', izoh: '15-qadam. Tayyor ▶[R6[C]] — bola K[go(R1-5, 4) R4[↓] D].', ...bol('Mashq · 3-pog‘ona', 'Tor <em>yo‘l</em>', 'Dushmanlar 1 dan 5 gacha ustundan tushsin', 'B3C', H3, { r: ASL(tk(6, ['C'])), oyin: true }) },
  B3Y: { rol: 'b', b: 3, t: 't3', nom: 'O‘yin · ★ qo‘shimcha', izoh: '15-qadam. Dastur bo‘sh: kamida 5 nusxa, random, delete this clone, o‘yin yutildi.', ...bol('Mashq · ★ qo‘shimcha', 'O‘z <em>o‘yiningiz</em>', 'Kamida beshta dushman — o‘yinni o‘zingiz tuzing', 'B3Y', H3, { r: [], oyin: true }) },
  B5: { rol: 'b', b: 4, t: 't1', nom: 'O‘z natijasi', izoh: '17–18-qadam. «Siz bugun» — haqiqiy son.',
    body: () => `<div class="chap">${matn('Sizning natijangiz', 'Siz nusxa <em>yasadingiz</em>!', '')}${qg('Bitta dushmandan ko‘p nusxa yasadim!')}<small class="st-s">Siz bugun</small>${sinfNatija(BOLA_T)}</div><div class="oyna">${maydonK({ start: [3, 0] }, qahK(), { nus: [[1, 2], [5, 1]] })}<div class="gl kd2 a-tr"><small>Momiq</small><b>Keyingi darsda kosmik o‘yinda ko‘rishamiz!</b></div></div>`,
    foot: () => fJim('Dars tugadi') },
}
