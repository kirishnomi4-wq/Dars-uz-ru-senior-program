// 19-dars «Bloklar ortidagi kod» ekranlari (E) — 22.11. Matn manbasi: new-junior/manba/019-bloklar-ortidagi-kod.md v1 (qo'shtirnoq ichidagi gaplar — aynan).
// Studiya ekranlari — 18-darsdagi kosmik o'yin (uch personaj) + «Kodini ko‘rsat» (kod.js: kod oynasi javon o'rnida, bloklar yonida). 3-bekat — faqat kod, oldindan aytish.
const fO = (hint) => fB({ hint, label: `${PLAY}Boshlash` })
const st = (o) => studiya({ aktiv: 'K', dunyo: null, ...o })
const qg = (gap) => `<div class="cg qg"><span class="av">${momiqYuz()}</span><p><small>Momiq</small>${gap}</p></div>`
const JV = DARS.javon
const doska = (sar, cg, son, zinaR, kichik, iz = '') => `<div class="chap">${matn('Mashq', sar, cg)}<div class="tugatdi"><small>${kichik}</small><b>${son}<i> / 14</i></b>${yulduzlar14(son)}${iz ? `<span class="tg-iz">${iz}</span>` : ''}</div></div><div class="oyna kosmos-o">${world('kosmos')}${zina(zinaR)}</div>`
// studiya sahnasi: maydon (dushman asli tepada), kapsulalar, sanoq «Dushman: 0»
const sahna = (aktyor, v = { ball: 0 }) => maydon({}, aktyor, { asl: [3, 4] }) + ozgQ(v) + sanoqK()
const bol = (tag, h, iz, id, hint) => {
  const b = DARS.studiya[id], P = b.bosh.personaj
  return { body: () => st({ tag, h, iz, javon: JV, dst: dstP(b.chegara, { cur: P.tanla }), sahna: sahna(qahK()) }), foot: () => fO(hint) }
}
// 3-bekat: faqat kod — dastur ustuni bo'sh (Blockly, kod.js tayyor dasturni qo'yadi), maydonda raketa (start — goTo manzili)
const dstK = () => `<div class="dst" data-z="dastur"><span class="dsb"><b>Raketa dasturi</b></span><span class="bosh">Blokni shu yerga ulang</span><small class="dsn">0 / 12 ta blok</small></div>`
const oqi = (tag, h, iz, start, o = {}) => ({ body: () => st({ tag, h, iz, javon: JV, dst: dstK(), sahna: maydon({ start, ...o }, o.aktyor || qahK()) }), foot: () => fB({ hint: o.hint || H3, label: `${PLAY}${o.yulduz ? 'Ishga tushir' : 'Tekshirish'}` }) })
const H1 = 'Blok va qatorni moslang', H2 = 'Kodda sonni o‘zgartiring — o‘ynang', H3 = 'O‘qing — keyin tekshiring'
const E = {
  P1: { rol: 'p', b: 0, t: 't1', nom: 'Kirish', izoh: '1-qadam. Kosmos maydoni: raketa (ichida Coddy), o‘q, dushman; pastda «O‘tgan darsda» — kosmik o‘yin tayyor.',
    body: () => `<div class="chap">${matn('', 'Bloklar <em>ortida</em> nima bor?', 'Salom! Bugun bloklar ortiga qaraymiz.')}${otganDars()}</div><div class="oyna">${maydon({}, coddyK(), { asl: [3, 4], oq: [[3, 2]] })}</div>`,
    foot: () => fU('Kirdi: 12 / 14', 'Keyingi ›') },
  P2: { rol: 'p', b: 0, t: 't1', nom: 'Savol', izoh: '2-qadam. Chapda blok when → key pressed [move right]; uchta karta.',
    body: () => `<div class="chap">${matn('Savol', DARS.savol, 'Shu bloklarni yozuv bilan yozsak — qanday bo‘ladi?')}${hKartalar({ son: SONI })}</div><div class="oyna">${maydon({ start: [2, 0] }, coddyK())}<div class="gl hk-bl">${mb('k', 'right')}${mb('r')}</div></div>`,
    foot: () => fU('Javob berdi: 14 / 14', 'Sinab ko‘ramiz ›') },
  P2N: { rol: 'b', b: 0, t: 't1', nom: 'Savol (noutbukda)', izoh: '2-qadam, bola: kartani bosishning o‘zi javob.',
    body: () => `<div class="chap">${matn('Savol', DARS.savol, 'Qaysi yozuvni kompyuter bajaradi?')}${hKartalar()}</div><div class="oyna">${maydon({ start: [2, 0] }, coddyK())}<div class="gl hk-bl">${mb('k', 'right')}${mb('r')}</div></div>`,
    foot: () => fJim('Birini tanlang') },
  P2S: { rol: 'p', b: 0, t: 't1', nom: 'Uch sinov', izoh: '3-qadam. Har karta: yozuv kod qutisida, → bosiladi. A, B — raketa joyida; C — qator yonadi, raketa o‘ngga (kod.js kodHuk).',
    body: () => `<div class="chap">${matn('Savol', DARS.savol, 'Shu bloklarni yozuv bilan yozsak — qanday bo‘ladi?')}${hKartalar({ son: SONI, avto: true })}</div><div class="oyna">${maydon({ start: [2, 0] }, coddyK())}</div>`,
    foot: () => fU('', 'Keyingi ›') },
  P2C: { rol: 'p', b: 0, t: 't1', nom: 'Javob', izoh: '4-qadam. A va B xira, C oltin; blok move right va qator moveRight(); yonma-yon.',
    body: () => `<div class="chap">${matn('Javob', 'Har blok — <em>bitta qator</em>', 'Bloklar ortida kod turadi.')}${hKartalar({ son: SONI, nat: true })}</div><div class="oyna">${maydon({ start: [3, 0] }, coddyK())}<div class="gl jv-kod">${mb('r')}<span class="jv-t">=</span>${kodK([kq(K.mr)])}</div></div>`,
    foot: () => fU('', 'Keyingi ›') },
  P3: { rol: 'p', b: 0, t: 't1', nom: 'Yangi so‘z: kod', izoh: '5-qadam. «Keyingi» — birma-bir: blok, qator, bitta dastur ikki ko‘rinishda (studiya.js, raqam).',
    body: () => `<div class="chap">${matn('Yangi so‘z', 'Kod <em>nima</em>?', 'Kod — dastur yozuv ko‘rinishida.')}${kodSoz()}</div><div class="oyna kosmos-o">${world('kosmos')}<div class="gl ta xs-ta" data-r="3"><small class="bsoz">Bugungi so‘z</small><b>Kod</b><span>Dastur yozuv ko‘rinishida: har blok — bitta qator</span></div></div>`,
    foot: () => fU('', 'Keyingi ›') },
  P4: { rol: 'p', b: 0, t: 't2', nom: 'Reja', izoh: '6-qadam.',
    body: () => `<div class="oyna to">${world('kosmos')}<div class="gl pan">${matn('Reja', 'Bugun nima <em>qilamiz</em>?', 'Uchta bekat. Oxirida kodni o‘qiysiz.')}</div>${darsOxiri()}${tepalik({ otdi: 0, joy: 0 })}</div>`,
    foot: () => fU('', 'Boshladik ›') },
  P7: { rol: 'p', b: 1, t: 't3', nom: 'Ko‘ramiz: «Kodini ko‘rsat»', izoh: '7-qadam. Uch dastur tayyor (18-dars o‘yini), «Raketa» tanlangan — ustoz «Kodini ko‘rsat»ni bosadi, blok va qatorni ko‘rsatadi.',
    body: () => st({ tag: 'Ko‘ramiz', h: '<em>Kodini ko‘rsat</em>', javon: JV, dst: dstP(12, { cur: 'raketa' }), sahna: sahna(coddyK()) }),
    foot: () => fU('', 'Keyingi ›') },
  P5: { rol: 'p', b: 1, t: 't1', nom: 'Sinf doskasi: blok va qator', izoh: '8-qadam.',
    body: () => doska('Qatorni <em>toping</em>!', 'Blok va qatorni moslang.', 4, POG.kod, 'Uch pog‘onani tugatdi', 'Har belgi — uch pog‘onani tugatgan bitta bola'),
    foot: () => fU('Yordam so‘radi: 1 ta noutbuk', 'Keyingi ›') },
  P4B: { rol: 'p', b: 2, t: 't2', nom: 'Reja · 2-bekat', izoh: '9-qadam.',
    body: () => `<div class="oyna to">${world('kosmos')}<div class="gl pan">${matn('Reja · 2-bekat', '2 · <em>Kodda son</em>', 'Endi kodda sonni o‘zgartiramiz.')}</div>${darsOxiri()}${tepalik({ otdi: 1, joy: 2 })}</div>`,
    foot: () => fU('', 'Keyingi ›') },
  P8: { rol: 'p', b: 2, t: 't3', nom: 'Ko‘ramiz: kodda son', izoh: '10-qadam. Uch dastur tayyor, «Dushman» tanlangan, kod ochiq — ustoz for qatoridagi 5 ni 8 qiladi va o‘ynaydi.',
    body: () => st({ tag: 'Ko‘ramiz', h: 'Kodda <em>son</em>', javon: JV, dst: dstP(12, { cur: 'dushman' }), sahna: sahna(coddyK()) }),
    foot: () => fU('', 'Keyingi ›') },
  P5G: { rol: 'p', b: 2, t: 't1', nom: 'Sinf doskasi: kodda son', izoh: '11-qadam.',
    body: () => doska('Kodni <em>o‘zgartiring</em>!', 'Kodda sonni o‘zgartiring — o‘ynang.', 5, POG.son, 'Uch pog‘onani tugatdi', 'Har belgi — uch pog‘onani tugatgan bitta bola'),
    foot: () => fU('Yordam so‘radi: 1 ta noutbuk', 'Keyingi ›') },
  P9: { rol: 'p', b: 2, t: 't1', nom: 'Xulosa: kod', izoh: '12-qadam. Ikki karta: bloklar va kod.',
    body: () => `<div class="chap">${matn('Xulosa', '<em>Kod</em>', 'Bitta dastur — ikki ko‘rinish.')}<div class="tf-l"><div class="tf"><div class="tf-r">${mb('k', 'right')}</div><div class="tf-t"><b>Bloklar</b><span>sudrab ulaymiz</span></div></div><div class="tf"><div class="tf-r">${kodK([kq(K.mr)], 'tf-kod')}</div><div class="tf-t"><b>Kod</b><span>kompyuter shuni bajaradi</span></div></div></div></div><div class="oyna">${maydon({ start: [4, 0] }, coddyK(), { asl: [3, 4] })}</div>`,
    foot: () => fU('', 'Keyingi ›') },
  P4C: { rol: 'p', b: 3, t: 't2', nom: 'Reja · 3-bekat', izoh: '13-qadam.',
    body: () => `<div class="oyna to">${world('kosmos')}<div class="gl pan">${matn('Reja · 3-bekat', '3 · <em>Kodni o‘qiymiz</em>', 'Endi bloksiz — faqat kod!')}</div>${darsOxiri()}${tepalik({ otdi: 2, joy: 3 })}</div>`,
    foot: () => fU('', 'Keyingi ›') },
  P10: { rol: 'p', b: 3, t: 't3', nom: 'Ko‘ramiz: kodni o‘qiymiz', izoh: '14-qadam. Faqat kod: goTo(1, 0); moveRight(); moveRight(); — ustoz (3, 0) ga bayroqcha qo‘yadi, «Tekshirish».',
    ...oqi('Ko‘ramiz', 'Kodni <em>o‘qiymiz</em>', 'Har qator — bitta qadam.', [1, 0], { aktyor: coddyK(), hint: '' }) },
  P5B: { rol: 'p', b: 3, t: 't1', nom: 'Sinf doskasi: kodni o‘qiymiz', izoh: '15-qadam.',
    body: () => doska('Kodni <em>o‘qing</em>!', 'O‘qing — keyin tekshiring.', 6, POG.oqi, 'Uch pog‘onani tugatdi', 'Har belgi — uch pog‘onani tugatgan bitta bola'),
    foot: () => fU('Yordam so‘radi: 1 ta noutbuk', 'Keyingi ›') },
  P11: { rol: 'p', b: 3, t: 't3', nom: 'Kodingizni o‘qib bering', izoh: '16-qadam. Kosmik o‘yin, kod ochiq — bola bitta qatorni o‘qiydi, ustoz blokini topadi. Proyektorda ism yo‘q; bola noutbukida — oxirgi yechgan pog‘onasi (A·1).',
    body: () => st({ tag: 'Ko‘rsatish', h: 'Kodingizni <em>o‘qib bering</em>', iz: 'Bitta qatorni o‘qing — men blokini topaman.', javon: JV, dst: dstP(12, { cur: 'raketa' }), sahna: sahna(coddyK(), { ball: 0, jon: 3 }) }),
    foot: () => fU('', 'Keyingi ›') },
  P12: { rol: 'p', b: 4, t: 't2', nom: 'Yakun', izoh: '17-qadam.',
    body: () => `<div class="oyna to">${world('kosmos')}${KONFETI()}<div class="gl pan">${matn('Yakun', 'Bloklar ortida — <em>kod</em>!', '')}<div class="tm ix"><small class="bsoz">Bugungi so‘z</small><div class="tr"><span class="ti d"><i></i><i></i><i></i></span><span><b>Kod</b>Dastur yozuv ko‘rinishida: har blok — bitta qator</span></div></div></div>${keyingiDars()}${tepalik({ otdi: 3, joy: 3, pose: 'quvonadi' })}</div>`,
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
  B1A: { rol: 'b', b: 1, t: 't3', nom: 'Mashq · 1-pog‘ona', izoh: '8-qadam. O‘z o‘yini (18-darsdan; bo‘lmasa tayyor) — «Kodini ko‘rsat», uchala personaj kodi.', ...bol('Mashq · 1-pog‘ona', 'Kodni <em>oching</em>', 'Uchala personajning kodini oching', 'B1A', H1) },
  B1B: { rol: 'b', b: 1, t: 't3', nom: 'Mashq · 2-pog‘ona', izoh: '8-qadam. Dushman, kod ochiq — belgilangan blokning qatorini bosadi (3 marta).', ...bol('Mashq · 2-pog‘ona', 'Qaysi <em>qator</em>?', 'Belgilangan blokning qatorini bosing', 'B1B', H1) },
  B1C: { rol: 'b', b: 1, t: 't3', nom: 'Mashq · 3-pog‘ona', izoh: '8-qadam. O‘q, kod ochiq — belgilangan qatorning blokini bosadi (3 marta).', ...bol('Mashq · 3-pog‘ona', 'Qaysi <em>blok</em>?', 'Belgilangan qatorning blokini bosing', 'B1C', H1) },
  B1Y: { rol: 'b', b: 1, t: 't3', nom: 'Mashq · ★ qo‘shimcha', izoh: '8-qadam. Raketa dasturiga play sound — kodda yangi qator.', ...bol('Mashq · ★ qo‘shimcha', 'Yangi <em>qator</em>', 'Raketa dasturiga play sound qo‘shing — kodda nima paydo bo‘ladi?', 'B1Y', H1) },
  B2A: { rol: 'b', b: 2, t: 't3', nom: 'Mashq · 1-pog‘ona', izoh: '11-qadam. Dushman, kod ochiq — for qatoridagi son 8, o‘ynaydi.', ...bol('Mashq · 1-pog‘ona', 'Ko‘p <em>dushman</em>', 'Kodda dushmanlar sonini 8 qiling va o‘ynang', 'B2A', H2) },
  B2B: { rol: 'b', b: 2, t: 't3', nom: 'Mashq · 2-pog‘ona', izoh: '11-qadam. O‘q, kod ochiq — ball = ball + 2, o‘ynaydi.', ...bol('Mashq · 2-pog‘ona', 'Ikki <em>ball</em>', 'Har dushman 2 ball bersin — kodda o‘zgartiring', 'B2B', H2) },
  B2C: { rol: 'b', b: 2, t: 't3', nom: 'Mashq · 3-pog‘ona', izoh: '11-qadam. Raketa, kod ochiq — jon = 5, o‘ynaydi.', ...bol('Mashq · 3-pog‘ona', 'Ko‘proq <em>jon</em>', 'O‘yin 5 jon bilan boshlansin', 'B2C', H2) },
  B2Y: { rol: 'b', b: 2, t: 't3', nom: 'Mashq · ★ qo‘shimcha', izoh: '11-qadam. Kodda yana ikki son, yutadi.', ...bol('Mashq · ★ qo‘shimcha', 'O‘z <em>sonlaringiz</em>', 'Kodda yana ikki sonni o‘zgartiring va yuting', 'B2Y', H2) },
  B3A: { rol: 'b', b: 3, t: 't3', nom: 'Mashq · 1-pog‘ona', izoh: '15-qadam. goTo(0, 0); moveRight(); moveRight(); moveUp(); — (2, 1).', ...oqi('Mashq · 1-pog‘ona', 'Ikki <em>qadam</em>', 'Raketa qayerda to‘xtaydi? Katakni bosing', [0, 0]) },
  B3B: { rol: 'b', b: 3, t: 't3', nom: 'Mashq · 2-pog‘ona', izoh: '15-qadam. goTo(1, 0); for 4 [moveRight();] — (5, 0).', ...oqi('Mashq · 2-pog‘ona', '<em>Takrorlash</em>', 'Raketa qayerda to‘xtaydi? Katakni bosing', [1, 0]) },
  B3C: { rol: 'b', b: 3, t: 't3', nom: 'Mashq · 3-pog‘ona', izoh: '15-qadam. goTo(6, 2); for 3 [moveLeft();] moveUp(); — (3, 3).', ...oqi('Mashq · 3-pog‘ona', '<em>Orqaga</em>', 'Raketa qayerda to‘xtaydi? Katakni bosing', [6, 2]) },
  B3Y: { rol: 'b', b: 3, t: 't3', nom: 'Mashq · ★ qo‘shimcha', izoh: '15-qadam. goTo(0, 0); for 2 [moveRight();] moveUp(); — kodda 2 → 5, raketa ★ (5, 1) ga.', ...oqi('Mashq · ★ qo‘shimcha', '<em>Nishonga</em>', 'Kodda sonni o‘zgartiring — raketa yulduzga borsin', [0, 0], { yulduz: [5, 1], hint: 'Kodda sonni o‘zgartiring' }) },
  B5: { rol: 'b', b: 4, t: 't1', nom: 'O‘z natijasi', izoh: '17–18-qadam. «Siz bugun» — haqiqiy son.',
    body: () => `<div class="chap">${matn('Sizning natijangiz', 'Kodni <em>o‘qidim</em>!', '')}${qg('Bloklarim ortida kod bor!')}<small class="st-s">Siz bugun</small>${sinfNatija(BOLA_T)}</div><div class="oyna">${maydon({}, qahK(), { asl: [3, 4], oq: [[3, 2]] })}<div class="gl kd2 a-tr"><small>Momiq</small><b>Keyingi darsda takrorlaymiz!</b></div></div>`,
    foot: () => fJim(TUGADI_YOZUV) },
}
