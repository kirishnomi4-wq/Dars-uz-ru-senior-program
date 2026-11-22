// 17-dars «Kosmik o‘yin 1» ekranlari (E) — 21.11. Matn manbasi: new-junior/manba/017-kosmik-oyin-1.md v1 (qo'shtirnoq ichidagi gaplar — aynan).
// Hamma studiya ekrani — o'yin («▶ Boshlash»): raketa ← →, o'q — space (kosmik.js). Dastur ustunida personaj kartalari «Raketa» · «O‘q».
const fO = (hint) => fB({ hint, label: `${PLAY}Boshlash` })
const st = (o) => studiya({ aktiv: 'e', dunyo: null, ...o })
const qg = (gap) => `<div class="cg qg"><span class="av">${momiqYuz()}</span><p><small>Momiq</small>${gap}</p></div>`
// javonlar: 1-bekat — Hodisa, Harakat (← →, go to), Tovush; 2-bekat — + Klon, move up, Takrorlash
const JAVON = {
  rak: { e: [['k', 'right'], 'f'], h: ['r', 'l', ['x', '3,0']], t: [['n', 'qadam']] },
  oq: { e: [['k', 'space'], 'f'], h: ['r', 'l', 'u', ['x', '3,0']], b: [['p', '4']], K: ['C', 'H', 'D'], t: [['n', 'sakrash']] },
}
const doska = (sar, cg, son, zinaR, kichik, iz = '') => `<div class="chap">${matn('Mashq', sar, cg)}<div class="tugatdi"><small>${kichik}</small><b>${son}<i> / 14</i></b>${yulduzlar14(son)}${iz ? `<span class="tg-iz">${iz}</span>` : ''}</div></div><div class="oyna kosmos-o">${world('kosmos')}${zina(zinaR)}</div>`
const sanoqK = () => `<span class="gl kl-son">O‘q: 0</span>`
// raketa dasturi va o'q dasturi (HTML — tayyor dasturning ko'rinadigan qismi; to'liq dastur — dars.mjs perProg, dvigatel quradi)
const R_RAK = [['k', 'right'], ['r'], ['k', 'left'], ['l']]
// bola pog'onasi
const bol = (tag, h, iz, id, hint, { r = [], cur, start = [3, 0], javon } = {}) => {
  const b = DARS.studiya[id], k = b.bosh.kosmik, P = b.bosh.personaj
  return { body: () => st({ tag, h, iz, javon: javon || (id[1] === '1' ? JAVON.rak : JAVON.oq), dst: dstP(r, b.chegara, { cur: cur || P.tanla, ochiq: P.ochiq || ['raketa', 'oq'] }), sahna: maydon({ start }, qahK(), { nishon: k.nishon || [], bayroq: k.bayroq || [] }) + (id[1] === '1' ? '' : sanoqK()) }), foot: () => fO(hint) }
}
const H1 = 'Raketa strelkalar bilan yursin', H2 = 'Space bosilsa, o‘q uchsin', H3 = 'Hamma nishonni uring — ro‘yxat to‘lsin'
const E = {
  P1: { rol: 'p', b: 0, t: 't1', nom: 'Kirish', izoh: '1-qadam. Kosmos maydoni, pastda raketa (ichida Coddy), tepada uchta nishon; pastda «O‘tgan darsda» — klon.',
    body: () => `<div class="chap">${matn('', 'Bugun raketa <em>uchadi</em>!', 'Salom! Bugun raketa o‘q otadi.')}${otganDars()}</div><div class="oyna">${maydon({}, coddyK(), { nishon: [[1, 4], [3, 3], [5, 4]] })}</div>`,
    foot: () => fU('Kirdi: 12 / 14', 'Keyingi ›') },
  P2: { rol: 'p', b: 0, t: 't1', nom: 'Savol', izoh: '2-qadam. Uchta karta; maydonda raketa (3, 0), nishon (3, 4).',
    body: () => `<div class="chap">${matn('Savol', DARS.savol, 'Space bosilsa, o‘q nishonga uchsin.')}${hKartalar({ son: SONI })}</div><div class="oyna">${maydon({}, coddyK(), { nishon: [[3, 4]] })}</div>`,
    foot: () => fU('Javob berdi: 14 / 14', 'Sinab ko‘ramiz ›') },
  P2N: { rol: 'b', b: 0, t: 't1', nom: 'Savol (noutbukda)', izoh: '2-qadam, bola: kartani bosishning o‘zi javob.',
    body: () => `<div class="chap">${matn('Savol', DARS.savol, 'O‘qni qaysi yo‘l bilan otamiz?')}${hKartalar()}</div><div class="oyna">${maydon({}, coddyK(), { nishon: [[3, 4]] })}</div>`,
    foot: () => fJim('Birini tanlang') },
  P2S: { rol: 'p', b: 0, t: 't1', nom: 'Uch sinov', izoh: '3-qadam. A — raketaning o‘zi uchadi va tepada qoladi; B — bitta o‘q, ikkinchi marta yo‘q; C — o‘q nusxalari: har space — yangi o‘q (kosmik.js kosmikHuk).',
    body: () => `<div class="chap">${matn('Savol', DARS.savol, 'Space bosilsa, o‘q nishonga uchsin.')}${hKartalar({ son: SONI, avto: true })}</div><div class="oyna">${maydon({}, coddyK(), { nishon: [[3, 4]] })}</div>`,
    foot: () => fU('', 'Keyingi ›') },
  P2C: { rol: 'p', b: 0, t: 't1', nom: 'Javob', izoh: '4-qadam. A va B xira, C oltin; maydonda raketa, uchayotgan uch o‘q.',
    body: () => `<div class="chap">${matn('Javob', 'O‘qning o‘z <em>dasturi</em>', 'Raketa yuradi. O‘q esa o‘z dasturi bilan uchadi.')}${hKartalar({ son: SONI, nat: true })}</div><div class="oyna">${maydon({}, coddyK(), { nishon: [[3, 4]], oq: [[3, 1], [3, 2], [3, 3]] })}</div>`,
    foot: () => fU('', 'Keyingi ›') },
  P3: { rol: 'p', b: 0, t: 't1', nom: 'Yangi so‘z: personaj', izoh: '5-qadam. «Keyingi» — birma-bir: raketa dasturi, o‘q dasturi, ikkalasi bitta o‘yinda (studiya.js, raqam).',
    body: () => `<div class="chap">${matn('Yangi so‘z', 'Personaj <em>nima</em>?', 'Personaj — o‘yindagi har bir qatnashchi.')}${perSoz()}</div><div class="oyna kosmos-o">${world('kosmos')}<div class="gl ta xs-ta" data-r="3"><small class="bsoz">Bugungi so‘z</small><b>Personaj</b><span>O‘yindagi har bir qatnashchi: o‘z rasmi va o‘z dasturi bor</span></div></div>`,
    foot: () => fU('', 'Keyingi ›') },
  P4: { rol: 'p', b: 0, t: 't2', nom: 'Reja', izoh: '6-qadam.',
    body: () => `<div class="oyna to">${world('kosmos')}<div class="gl pan">${matn('Reja', 'Bugun nima <em>qilamiz</em>?', 'Uchta bekat. Oxirida raketa nishonlarni uradi.')}</div>${darsOxiri()}${tepalik({ otdi: 0, joy: 0 })}</div>`,
    foot: () => fU('', 'Boshladik ›') },
  P7: { rol: 'p', b: 1, t: 't3', nom: 'Ko‘ramiz: raketaning dasturi', izoh: '7-qadam. Raketa (3, 0); personaj «Raketa»; dastur bo‘sh — ustoz →[→] ←[←] qo‘yadi va o‘ynaydi (solo’da tayyor).',
    body: () => st({ tag: 'Ko‘ramiz', h: 'Raketaning <em>dasturi</em>', javon: JAVON.rak, dst: dstP([], 8), sahna: maydon({}, coddyK()) }),
    foot: () => fU('', 'Keyingi ›') },
  P5: { rol: 'p', b: 1, t: 't1', nom: 'Sinf doskasi: raketa', izoh: '8-qadam.',
    body: () => doska('Raketani <em>yurgizing</em>!', 'Raketa strelkalar bilan yursin.', 4, POG.rak, 'Uch pog‘onani tugatdi', 'Har belgi — uch pog‘onani tugatgan bitta bola'),
    foot: () => fU('Yordam so‘radi: 1 ta noutbuk', 'Keyingi ›') },
  P4B: { rol: 'p', b: 2, t: 't2', nom: 'Reja · 2-bekat', izoh: '9-qadam.',
    body: () => `<div class="oyna to">${world('kosmos')}<div class="gl pan">${matn('Reja · 2-bekat', '2 · <em>O‘q</em>', 'Endi o‘q — ikkinchi personaj.')}</div>${darsOxiri()}${tepalik({ otdi: 1, joy: 2 })}</div>`,
    foot: () => fU('', 'Keyingi ›') },
  P8: { rol: 'p', b: 2, t: 't3', nom: 'Ko‘ramiz: o‘qning dasturi', izoh: '10-qadam. Raketa dasturi tayyor; personaj «O‘q», dastur bo‘sh — ustoz S[C], keyin K[R4[↑] D] qo‘yadi (solo’da tayyor).',
    body: () => st({ tag: 'Ko‘ramiz', h: 'O‘qning <em>dasturi</em>', javon: JAVON.oq, dst: dstP([], 8, { cur: 'oq' }), sahna: maydon({}, coddyK()) + sanoqK() }),
    foot: () => fU('', 'Keyingi ›') },
  P5G: { rol: 'p', b: 2, t: 't1', nom: 'Sinf doskasi: o‘q', izoh: '11-qadam.',
    body: () => doska('O‘q <em>oting</em>!', 'Space bosilsa, o‘q uchsin.', 5, POG.oq, 'Uch pog‘onani tugatdi', 'Har belgi — uch pog‘onani tugatgan bitta bola'),
    foot: () => fU('Yordam so‘radi: 1 ta noutbuk', 'Keyingi ›') },
  P9: { rol: 'p', b: 2, t: 't1', nom: 'Xulosa: personaj', izoh: '12-qadam. Ikki karta: raketa dasturi, o‘q dasturi.',
    body: () => `<div class="chap">${matn('Xulosa', '<em>Personaj</em>', 'Ikki personaj — ikki dastur, bitta o‘yin.')}<div class="tf-l"><div class="tf"><div class="tf-r">${RAK()}</div><div class="tf-t"><b>Raketa dasturi</b><span>yuradi</span></div></div><div class="tf"><div class="tf-r">${OQ('oq-k')}</div><div class="tf-t"><b>O‘q dasturi</b><span>uchadi</span></div></div></div></div><div class="oyna">${maydon({}, coddyK(), { nishon: [[1, 4], [5, 4]], oq: [[3, 2]] })}</div>`,
    foot: () => fU('', 'Keyingi ›') },
  P4C: { rol: 'p', b: 3, t: 't2', nom: 'Reja · 3-bekat', izoh: '13-qadam.',
    body: () => `<div class="oyna to">${world('kosmos')}<div class="gl pan">${matn('Reja · 3-bekat', '3 · <em>Nishonlar</em>', 'Endi nishonlarni uramiz!')}</div>${darsOxiri()}${tepalik({ otdi: 2, joy: 3 })}</div>`,
    foot: () => fU('', 'Keyingi ›') },
  P10: { rol: 'p', b: 3, t: 't3', nom: 'Ko‘ramiz: nishonlar', izoh: '14-qadam. Ikkala dastur tayyor; nishonlar (1, 4), (3, 3), (5, 4); chek-list javon ostida.',
    body: () => st({ tag: 'Ko‘ramiz', h: '<em>Nishonlar</em>', javon: JAVON.oq, dst: dstP(R_RAK, 10), sahna: maydon({}, coddyK(), { nishon: [[1, 4], [3, 3], [5, 4]] }) + sanoqK() }),
    foot: () => fU('', 'Keyingi ›') },
  P5B: { rol: 'p', b: 3, t: 't1', nom: 'Sinf doskasi: nishonlar', izoh: '15-qadam.',
    body: () => doska('Nishonlarni <em>uring</em>!', 'Hamma nishonni uring — ro‘yxat to‘lsin.', 6, POG.nishon, 'Uch o‘yinni yutdi', 'Har belgi — uch o‘yinni yutgan bitta bola'),
    foot: () => fU('Yordam so‘radi: 1 ta noutbuk', 'Keyingi ›') },
  P11: { rol: 'p', b: 3, t: 't3', nom: 'O‘q dasturingizni o‘qib bering', izoh: '16-qadam. Raketa dasturi tayyor, o‘q dasturi bo‘sh — bola o‘qiydi, ustoz qo‘yadi va o‘ynaydi. Proyektorda ism yo‘q; bola noutbukida — oxirgi yechgan pog‘onasi (A·1).',
    body: () => st({ tag: 'Ko‘rsatish', h: 'Dasturingizni <em>o‘qib bering</em>', iz: 'Siz o‘qiysiz — men otaman.', javon: JAVON.oq, dst: dstP([], 10, { cur: 'oq' }), sahna: maydon({}, coddyK(), { nishon: [[1, 4], [3, 3], [5, 4]] }) + sanoqK() }),
    foot: () => fU('', 'Keyingi ›') },
  P12: { rol: 'p', b: 4, t: 't2', nom: 'Yakun', izoh: '17-qadam.',
    body: () => `<div class="oyna to">${world('kosmos')}${KONFETI()}<div class="gl pan">${matn('Yakun', 'Raketa <em>uchdi</em>!', '')}<div class="tm ix"><small class="bsoz">Bugungi so‘z</small><div class="tr"><span class="ti d"><i></i><i></i><i></i></span><span><b>Personaj</b>O‘yindagi har bir qatnashchi: o‘z rasmi va o‘z dasturi bor</span></div></div></div>${keyingiDars()}${tepalik({ otdi: 3, joy: 3, pose: 'quvonadi' })}</div>`,
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
  B1A: { rol: 'b', b: 1, t: 't3', nom: 'Mashq · 1-pog‘ona', izoh: '8-qadam. Raketa (1, 0), bayroq (5, 0); dastur bo‘sh — bola →[→].', ...bol('Mashq · 1-pog‘ona', '<em>O‘ngga</em>', '→ bosilsa, raketa o‘ngga yursin. Bayroqqa yeting', 'B1A', H1, { start: [1, 0] }) },
  B1B: { rol: 'b', b: 1, t: 't3', nom: 'Mashq · 2-pog‘ona', izoh: '8-qadam. Bayroqlar (0, 0) va (6, 0); tayyor →[→] — bola ←[←].', ...bol('Mashq · 2-pog‘ona', 'Ikki <em>tomonga</em>', '← ham ishlasin. Ikkala bayroqqa yeting', 'B1B', H1, { r: R_RAK.slice(0, 2) }) },
  B1C: { rol: 'b', b: 1, t: 't3', nom: 'Mashq · 3-pog‘ona', izoh: '8-qadam. Raketa (0, 0); tayyor →[→] ←[←] — bola ▶[go(3, 0)].', ...bol('Mashq · 3-pog‘ona', '<em>Startga</em>', '▶ bosilganda raketa (3, 0) ga borsin', 'B1C', H1, { r: R_RAK, start: [0, 0] }) },
  B1Y: { rol: 'b', b: 1, t: 't3', nom: 'Mashq · ★ qo‘shimcha', izoh: '8-qadam. Tayyor →[→] ←[←] — bola har dasturchaga play sound qadam.', ...bol('Mashq · ★ qo‘shimcha', 'Qadam <em>tovushi</em>', 'Raketa yurganda tovush chalinsin', 'B1Y', H1, { r: R_RAK }) },
  B2A: { rol: 'b', b: 2, t: 't3', nom: 'Mashq · 1-pog‘ona', izoh: '11-qadam. Raketa tayyor; o‘q: tayyor K[R4[↑] D] — bola S[C].', ...bol('Mashq · 1-pog‘ona', '<em>Otish</em>', 'Space bosilsa, o‘q paydo bo‘lsin', 'B2A', H2) },
  B2B: { rol: 'b', b: 2, t: 't3', nom: 'Mashq · 2-pog‘ona', izoh: '11-qadam. O‘q: tayyor S[C] · K[D] — bola R4[↑] (D dan oldin).', ...bol('Mashq · 2-pog‘ona', '<em>Uchish</em>', 'O‘q tepagacha uchsin', 'B2B', H2) },
  B2C: { rol: 'b', b: 2, t: 't3', nom: 'Mashq · 3-pog‘ona', izoh: '11-qadam. O‘q: tayyor S[C] · K[R4[↑]] — bola D.', ...bol('Mashq · 3-pog‘ona', '<em>O‘chish</em>', 'Tepaga yetgan o‘q o‘chsin', 'B2C', H2) },
  B2Y: { rol: 'b', b: 2, t: 't3', nom: 'Mashq · ★ qo‘shimcha', izoh: '11-qadam. O‘q tayyor — bola S ga play sound sakrash.', ...bol('Mashq · ★ qo‘shimcha', 'Otish <em>tovushi</em>', 'O‘q otilganda tovush chalinsin', 'B2Y', H2) },
  B3A: { rol: 'b', b: 3, t: 't3', nom: 'O‘yin · 1-pog‘ona', izoh: '15-qadam. Nishonlar (1, 4), (4, 3), (6, 4); dasturlar — bolaning 2-bekatdagisi (bo‘lmasa tayyor).', ...bol('Mashq · 1-pog‘ona', 'Uch <em>nishon</em>', 'Hamma nishonni uring', 'B3A', H3, { r: R_RAK }) },
  B3B: { rol: 'b', b: 3, t: 't3', nom: 'O‘yin · 2-pog‘ona', izoh: '15-qadam. Nishonlar (0, 2), (3, 2), (6, 2).', ...bol('Mashq · 2-pog‘ona', 'Pastda <em>nishon</em>', 'Nishonlar pastroqda — hammasini uring', 'B3B', H3, { r: R_RAK }) },
  B3C: { rol: 'b', b: 3, t: 't3', nom: 'O‘yin · 3-pog‘ona', izoh: '15-qadam. Yetti nishon — (0, 4)…(6, 4).', ...bol('Mashq · 3-pog‘ona', '<em>Qator</em>', 'Yetti nishon — hammasini uring', 'B3C', H3, { r: R_RAK }) },
  B3Y: { rol: 'b', b: 3, t: 't3', nom: 'O‘yin · ★ qo‘shimcha', izoh: '15-qadam. Nishonlarni bola o‘zi qo‘yadi (katakni bosib, kamida 4 ta), keyin yutadi.', ...bol('Mashq · ★ qo‘shimcha', 'O‘z <em>nishonlaringiz</em>', 'Katakni bosib kamida to‘rtta nishon qo‘ying — keyin yuting', 'B3Y', H3, { r: R_RAK }) },
  B5: { rol: 'b', b: 4, t: 't1', nom: 'O‘z natijasi', izoh: '17–18-qadam. «Siz bugun» — haqiqiy son.',
    body: () => `<div class="chap">${matn('Sizning natijangiz', 'Raketa <em>uchdi</em>!', '')}${qg('Raketam nishonlarni urdi!')}<small class="st-s">Siz bugun</small>${sinfNatija(BOLA_T)}</div><div class="oyna">${maydon({}, qahK(), { nishon: [[1, 4], [5, 4]], oq: [[3, 2]] })}<div class="gl kd2 a-tr"><small>Momiq</small><b>Keyingi darsda dushmanlar bilan ko‘rishamiz!</b><span class="saqlandi" data-z="saqlandi" hidden>O‘yiningiz saqlandi.</span></div></div>`,
    foot: () => fJim('Dars tugadi') },
}
