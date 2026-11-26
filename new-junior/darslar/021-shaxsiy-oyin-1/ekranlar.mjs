// 21-dars «Shaxsiy o‘yin 1» ekranlari (E) — 22.11. Matn manbasi: new-junior/manba/021-shaxsiy-oyin-1.md v1 (qo'shtirnoq ichidagi gaplar — aynan).
// Bola noutbukida: loyiha kartasi (K1; kod.js) va kosmik o'yin (karta bo'yicha, kosmik.kerak = karta1/karta2/karta3). Sahnada kichik «Mening o‘yinim» kartasi (.kc-mini).
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
const H1 = 'Kartaga qarang', H2 = 'Kartadagi ball va jon'
const E = {
  P1: { rol: 'p', b: 0, t: 't1', nom: 'Kirish', izoh: '1-qadam. Kosmos maydoni: raketa (ichida Coddy), dushman; pastda «O‘tgan darsda» — test.',
    body: () => `<div class="chap">${matn('', 'Bugun <em>o‘z</em> o‘yiningiz!', 'Salom! Bugun o‘z o‘yiningizni boshlaymiz.')}${otganDars()}</div><div class="oyna">${maydon({}, coddyK(), { asl: [3, 4] })}</div>`,
    foot: () => fU('Kirdi: 12 / 14', 'Keyingi ›') },
  P2: { rol: 'p', b: 0, t: 't1', nom: 'Savol', izoh: '2-qadam. Uchta karta: darhol, reja, do‘st (baho emas).',
    body: () => `<div class="chap">${matn('Savol', DARS.savol, 'Katta o‘yinni qanday boshlaymiz?')}${hKartalar({ son: SONI })}</div><div class="oyna">${maydon({}, coddyK(), { asl: [3, 4] })}</div>`,
    foot: () => fU('Javob berdi: 14 / 14', 'Keyingi ›') },
  P2N: { rol: 'b', b: 0, t: 't1', nom: 'Savol (noutbukda)', izoh: '2-qadam, bola: kartani bosishning o‘zi javob.',
    body: () => `<div class="chap">${matn('Savol', DARS.savol, 'Siz nima qilasiz?')}${hKartalar()}</div><div class="oyna">${maydon({}, coddyK(), { asl: [3, 4] })}</div>`,
    foot: () => fJim('Birini tanlang') },
  P2C: { rol: 'p', b: 0, t: 't1', nom: 'Javob', izoh: '3-qadam. Namuna karta «Mening o‘yinim»: do‘stim · 5 · 2 · 3 · yutish uchun 6.',
    body: () => `<div class="chap">${matn('Javob', 'Avval <em>reja</em>', 'Reja qisqa — bitta karta.')}<div class="kc-xul kc-n">${kartaNamuna(KARTA_N)}</div></div><div class="oyna">${maydon({}, coddyK(), { asl: [3, 4] })}</div>`,
    foot: () => fU('', 'Keyingi ›') },
  P3: { rol: 'p', b: 0, t: 't1', nom: 'Yangi so‘z: loyiha kartasi', izoh: '4-qadam. «Keyingi» — birma-bir: kim o‘ynaydi, qoidalar, maqsad (studiya.js, raqam).',
    body: () => `<div class="chap">${matn('Yangi so‘z', 'Loyiha kartasi <em>nima</em>?', 'Loyiha kartasi — o‘yin rejasi.')}${kartaSoz()}</div><div class="oyna kosmos-o">${world('kosmos')}<div class="gl ta xs-ta" data-r="3"><small class="bsoz">Bugungi so‘z</small><b>Loyiha kartasi</b><span>O‘yin rejasi: kim o‘ynaydi, qoidalari qanday, nimaga erishamiz</span></div></div>`,
    foot: () => fU('', 'Keyingi ›') },
  P4: { rol: 'p', b: 0, t: 't2', nom: 'Reja', izoh: '5-qadam.',
    body: () => `<div class="oyna to">${world('kosmos')}<div class="gl pan">${matn('Reja', 'Bugun nima <em>qilamiz</em>?', 'Uchta bekat. Oxirida o‘yiningiz boshlanadi.')}</div>${darsOxiri()}${tepalik({ otdi: 0, joy: 0 })}</div>`,
    foot: () => fU('', 'Boshladik ›') },
  P7: { rol: 'p', b: 1, t: 't1', nom: 'Ko‘ramiz: karta', izoh: '6-qadam. Ustoz kartani sinf oldida bosib to‘ldiradi (25.11, Q17-A): to‘rt qator bo‘sh, pastda «Mening o‘yinim» — tanlangani o‘zi chiqadi, «Yutish uchun» o‘zi hisoblanadi.',
    body: () => `<div class="chap">${matn('Ko‘ramiz', '<em>Kartani</em> to‘ldiramiz', 'Har qatorda bitta tanlov.')}${kartaEkran({})}</div><div class="oyna">${maydon({}, coddyK(), { asl: [3, 4] })}</div>`,
    foot: () => fU('', 'Keyingi ›') },
  P5: { rol: 'p', b: 1, t: 't1', nom: 'Sinf doskasi: karta', izoh: '7-qadam.',
    body: () => doska('Kartangizni <em>to‘ldiring</em>!', 'O‘z o‘yiningiz qoidalarini tanlang.', 4, POG.karta, 'Kartani to‘ldirdi', 'Har belgi — kartani to‘ldirgan bitta bola'),
    foot: () => fU('Yordam so‘radi: 1 ta noutbuk', 'Keyingi ›') },
  P4B: { rol: 'p', b: 2, t: 't2', nom: 'Reja · 2-bekat', izoh: '8-qadam.',
    body: () => `<div class="oyna to">${world('kosmos')}<div class="gl pan">${matn('Reja · 2-bekat', '2 · <em>Dushmanlar</em>', 'Endi kartadagi dushmanlar tushsin!')}</div>${darsOxiri()}${tepalik({ otdi: 1, joy: 2 })}</div>`,
    foot: () => fU('', 'Keyingi ›') },
  P8: { rol: 'p', b: 2, t: 't3', nom: 'Ko‘ramiz: kartadagi dushmanlar', izoh: '9-qadam. «Dushman» tanlangan, dastur bo‘sh — ustoz kartaga qarab ▶[R5[C]] · K[…] qo‘yadi (solo’da tayyor).',
    body: () => st({ tag: 'Ko‘ramiz', h: '<em>Dushmanlar</em>', javon: JV, dst: dstP(12, { cur: 'dushman' }), sahna: sahna(coddyK()) }),
    foot: () => fU('', 'Keyingi ›') },
  P5G: { rol: 'p', b: 2, t: 't1', nom: 'Sinf doskasi: dushmanlar', izoh: '10-qadam.',
    body: () => doska('Dushmanlar <em>tushsin</em>!', 'Kartadagi son bo‘yicha.', 5, POG.dush, 'Pog‘onani tugatdi', 'Har belgi — pog‘onani tugatgan bitta bola'),
    foot: () => fU('Yordam so‘radi: 1 ta noutbuk', 'Keyingi ›') },
  P4C: { rol: 'p', b: 3, t: 't2', nom: 'Reja · 3-bekat', izoh: '11-qadam.',
    body: () => `<div class="oyna to">${world('kosmos')}<div class="gl pan">${matn('Reja · 3-bekat', '3 · <em>Ball va jon</em>', 'Endi ball va jon — kartadagidek!')}</div>${darsOxiri()}${tepalik({ otdi: 2, joy: 3 })}</div>`,
    foot: () => fU('', 'Keyingi ›') },
  P10: { rol: 'p', b: 3, t: 't3', nom: 'Ko‘ramiz: ball va jon', izoh: '12-qadam. Uch dastur tayyor; «O‘q» tanlangan — ustoz kartaga qarab T[change ball by k], ▶[set jon j] qo‘yadi (solo’da tayyor); chek-list javon ostida.',
    body: () => st({ tag: 'Ko‘ramiz', h: 'Ball va <em>jon</em>', javon: JV, dst: dstP(12, { cur: 'oq' }), sahna: sahna(coddyK(), { ball: 0, jon: 3 }) }),
    foot: () => fU('', 'Keyingi ›') },
  P5B: { rol: 'p', b: 3, t: 't1', nom: 'Sinf doskasi: ball va jon', izoh: '13-qadam.',
    body: () => doska('<em>Kartadagidek</em> yozing!', 'Kartaga qarang — shunday bo‘lsin.', 6, POG.ballJon, 'Pog‘onani tugatdi', 'Har belgi — pog‘onani tugatgan bitta bola'),
    foot: () => fU('Yordam so‘radi: 1 ta noutbuk', 'Keyingi ›') },
  P12: { rol: 'p', b: 4, t: 't2', nom: 'Yakun', izoh: '14-qadam.',
    body: () => `<div class="oyna to">${world('kosmos')}${KONFETI()}<div class="gl pan">${matn('Yakun', 'O‘yinning <em>boshi</em> tayyor!', '')}<div class="tm ix"><small class="bsoz">Bugungi so‘z</small><div class="tr"><span class="ti d"><i></i><i></i><i></i></span><span><b>Loyiha kartasi</b>O‘yin rejasi: kim o‘ynaydi, qoidalari qanday, nimaga erishamiz</span></div></div></div>${keyingiDars()}${tepalik({ otdi: 3, joy: 3, pose: 'quvonadi' })}</div>`,
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
  K1: { rol: 'b', b: 1, t: 't1', nom: 'Loyiha kartasi', izoh: '7-qadam. To‘rt qator (kim · dushmanlar · ball · jon) va pastda «Mening o‘yinim»; hamma qator tanlangach «Karta tayyor».',
    body: () => `<div class="chap">${matn('Karta', 'Kartangizni <em>to‘ldiring</em>', 'O‘z o‘yiningiz qoidalarini tanlang.')}${kartaEkran({})}</div><div class="oyna">${maydon({}, qahK(), { asl: [3, 4] })}</div>`,
    foot: () => fKid('Hamma qatorni tanlang', 'Karta tayyor') },
  B2A: { rol: 'b', b: 2, t: 't3', nom: 'Dushmanlar · 1', izoh: '10-qadam. Dushman: tayyor K[G R4[↓] D] — bola ▶[Rn[C]], n — kartadagi son.', ...bol('Dushmanlar · 1', 'Kartadagi <em>dushmanlar</em>', 'Kartadagi sondagi dushman tushsin', 'B2A', H1) },
  B2Y: { rol: 'b', b: 2, t: 't3', nom: 'Dushmanlar · ★', izoh: '10-qadam. Uch dastur tayyor — bola o‘ynab uchta dushmanni uradi.', ...bol('Dushmanlar · ★', 'O‘q <em>uradi</em>', 'Uchta dushmanni o‘q bilan uring', 'B2Y', H1) },
  B3A: { rol: 'b', b: 3, t: 't3', nom: 'Ball va jon · 1', izoh: '13-qadam. O‘q: bo‘sh T; raketa: ▶ yo‘q — bola T[change ball by k] · ▶[set jon j].', ...bol('Ball va jon · 1', 'Ball va <em>jon</em>', 'Ball va jon kartadagidek bo‘lsin', 'B3A', H2) },
  B3Y: { rol: 'b', b: 3, t: 't3', nom: 'Ball va jon · ★', izoh: '13-qadam. To‘liq o‘yin: yutadi — kartadagi maqsadga yetadi, jon qoladi.', ...bol('Ball va jon · ★', 'To‘liq <em>o‘yin</em>', 'Yuting: kartadagi maqsadga yeting, jon qolsin', 'B3Y', H2) },
  B5: { rol: 'b', b: 4, t: 't1', nom: 'O‘z natijasi', izoh: '14–15-qadam. «Siz bugun» — haqiqiy son; pastda «Mening o‘yinim» kartasi.',
    body: () => `<div class="chap">${matn('Sizning natijangiz', 'O‘yinning <em>boshi</em> tayyor!', '')}${qg('Mening o‘yinim bor!')}<small class="st-s">Siz bugun</small>${sinfNatija(BOLA_T)}<div class="kc-mini kc-b"></div></div><div class="oyna">${maydon({}, qahK(), { asl: [3, 4], dush: [[5, 2]], oq: [[1, 2]] })}${ozgQ({ ball: 6, jon: 3 })}<div class="gl kd2 a-tr"><small>Momiq</small><b>Keyingi darsda o‘yinni tugatamiz!</b></div></div>`,
    foot: () => fJim(TUGADI_YOZUV) },
}
