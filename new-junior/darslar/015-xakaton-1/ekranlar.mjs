// 15-dars «Xakaton №1» ekranlari (E) — 21.11. Matn manbasi: new-junior/manba/015-xakaton-1.md v1.1 (qo'shtirnoq ichidagi gaplar — aynan).
// Studiya ekranlari (BXO/BXL — yasash, BSO/BSL — sinash, BDO/BDL — do'stlar o'ynaydi) bitta holatdan quriladi: qism kartasi (sarlavha), «O‘yiningizda:»
// ro'yxati, rollar va javon — studiya.js «15-dars» (xkTayyorla). HTML dagi sarlavha — 1-qism (dvigatel o'z holatidan yangilaydi).
const fO = (hint) => fB({ hint, label: `${PLAY}Boshlash` })
const st = (o) => studiya({ aktiv: 'e', dunyo: null, ...o })
const qg = (gap) => `<div class="cg qg"><span class="av">${momiqYuz()}</span><p><small>Momiq</small>${gap}</p></div>`
// javonlar: «Olma terish» — Hodisa (strelka, ▶, olma/kaktus/oltin, istalgan tugma, game over), Harakat, Shart, O'zgaruvchi, Ko'rinish, Tovush;
// «Labirint» — Hodisa, Harakat (to'rt move va go to), Shart (if path), Tovush (+ «Labirint» asboblari — yasash qismlarida)
const JAVON = {
  olma: { e: [['k', 'right'], 'f', ['q', 'apple'], ['k', 'any'], 'g'], h: ['r', 'l', 'u', 'd'], a: [['i', 'jon:0']], o: [['z', '0'], ['c', '1']], v: [['v', 'xursand']], t: [['n', 'jiring']] },
  lab: { e: [['k', 'right']], h: ['r', 'l', 'u', 'd', 'x'], a: [['a', 'right']], t: [['n', 'qadam']] },
}
const dstX = (yuz, r = [], ch = 30) => {
  const html = r.map((x) => (typeof x === 'string' ? x : mb(...x))).join(''), n = r.filter((x) => typeof x !== 'string' && ['q', 'f', 'k'].includes(x[0])).length
  const bl = r.reduce((a, x) => a + (typeof x === 'string' ? (x.match(/class="mb /g) || []).length : 1), 0)
  return `<div class="dst" data-z="dastur"><span class="dsb"><span class="dyz">${yuz}</span><b>Dastur</b></span>${r.length ? `<div class="mbw">${html}</div>` : '<span class="bosh">Blokni shu yerga ulang</span>'}<small class="dsn">${n} ta dasturcha\n${bl} / ${ch} ta blok</small></div>`
}
const shartV = (m, ichki) => `<div class="c-blok sv">${mb('i', m)}<div class="c-ich">${ichki.map((x) => mb(x)).join('')}</div><span class="c-tub"></span></div>`
// 13-qadam: ustoz o'yini — to'rt strelka va jon (xato: change jon by −2)
const NAMOYISH = [['k', 'right'], ['r'], ['k', 'left'], ['l'], ['k', 'up'], ['u'], ['k', 'down'], ['d'], ['f'], ['z', 'jon:3'], ['q', 'cactus'], ['c', 'jon:-2'], shartV('jon:0', ['g'])]
// «O‘yiningizda:» ro'yxati (sahna ustida, o'ngda) — dvigatel to'ldiradi; xk-k — qism kartasi «Maslahat» rangi
const roy = () => '<div class="xk-roy" data-z="ro‘yxat"><small>O‘yiningizda:</small><div class="xk-rq"></div></div>'
// lab studiyasi: rg boshida «Labirint» (asboblar), javon — bloklar (10-darsdagi stYasash teskarisi: asboblar yasash qismida ochiladi)
const stLab = (o) => st({ ...o, javon: JAVON.lab }).replace('<div class="rg" data-z="ranglar">', '<div class="rg" data-z="ranglar">' + RD_L.replace(' on', ''))
const xkO = (tag, h, hint) => ({ body: () => st({ tag, iz: '', h, javon: JAVON.olma, dst: dstX(momiqYuz()), sahna: maydon(OLMA_M, qahK()) + ozgQ({}) + roy() }), foot: () => fO(hint) })
const xkL = (tag, h, hint, d = '') => ({ body: () => stLab({ tag, iz: '', h, dst: dstX(momiqYuz()), sahna: labM(qahK()) + d + roy() }), foot: () => fO(hint) })
const DARAJA = '<span class="gl daraja-yz">Daraja: <b>1 / 2</b></span>' // 2-daraja tayyor bo'lsa ko'rinadi (xakaton.js)
// doskalar — juftlik bo'yicha (maxraj — juftliklar soni; qobiq.js «juft» sanog'i)
const juftBelgi = (n, j = 7) => `<div class="yulduzlar">${Array.from({ length: j }, (_, i) => `<i class="${i < n ? 'on' : ''}">${ODAM}</i>`).join('')}</div>`
const doska = (tag, sar, cg, kichik, son, iz, oyna) => `<div class="chap">${matn(tag, sar, cg)}<div class="tugatdi"><small>${kichik}</small><b>${son}<i> / 7</i></b>${juftBelgi(son)}${iz ? `<span class="tg-iz">${iz}</span>` : ''}</div></div><div class="oyna">${world('hovli')}${oyna}</div>`
const ZINA = [['1', 2, `<span class="pg-rl">${rol(RUL, 'k-rul')}</span>`, '1-qism'], ['2', 3, `<span class="pg-rl">${rol(RUL, 'k-rul')}</span>`, '2-qism'], ['3', 1, `<span class="pg-rl">${rol(RUL, 'k-rul')}</span>`, '3-qism'], ['★', 1, `<span class="pg-rl">${rol(RUL, 'k-rul')}</span>`, 'Qo‘shimcha']]
// stollar aylanasi (15-qadam): olti stol va strelka — keyingi stolga o'tamiz
const AYLANA = `<svg class="xk-ay" viewBox="0 0 200 140" aria-hidden="true"><ellipse cx="100" cy="70" rx="70" ry="44" fill="none" stroke="#FF4F28" stroke-width="3" stroke-dasharray="7 6"/><path d="M166 58l4 12 10-8" fill="none" stroke="#FF4F28" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>${[[100, 18], [162, 44], [162, 96], [100, 122], [38, 96], [38, 44]].map(([x, y]) => `<g transform="translate(${x - 14} ${y - 10})"><rect x="3" y="1" width="22" height="14" rx="2" fill="#fff" stroke="#0D2137" stroke-width="2"/><path d="M0 19h28" stroke="#0D2137" stroke-width="2.6" stroke-linecap="round"/></g>`).join('')}</svg>`
const SINASH_R = '<div class="gl xk-roy xk-roy-d"><small>O‘yiningizda:</small><div class="xk-rq"><i class="ok">✓ To‘rt strelka</i><i class="ok">✓ Jon</i><i class="sn">Sinash: Har strelka o‘z tomoniga</i><i class="sn">Sinash: Jon 0 da tugaydi</i></div></div>'
const BOLA_T = [['h', OYIN_OQ, 'ta qism yasadingiz', 3], ['g', RUL.replace('currentColor', '#fff').replaceAll('currentColor', '#fff'), 'ikkalangiz ham haydadingiz ✓', ''], ['y', DOST_OQ, 'marta o‘ynab ko‘rildi', 2]]
const E = {
  P1: { rol: 'p', b: 0, t: 't1', nom: 'Kirish', izoh: '1-qadam. Maydon, Coddy (0, 0) da; pastda «O‘tgan darsda» — «Bitta qadam».',
    body: () => `<div class="chap">${matn('', 'Bugun juftlikda o‘yin <em>yasaymiz</em>!', 'Salom! Bugun do‘stingiz bilan birga o‘yin yasaysiz.')}${otganDars()}</div><div class="oyna">${maydon({}, coddyK())}</div>`,
    foot: () => fU('Kirdi: 12 / 14', 'Keyingi ›') },
  P2: { rol: 'p', b: 0, t: 't1', nom: 'Savol', izoh: '2-qadam. Uchta karta — A birga bosamiz, B alohida-alohida, C ishni bo‘lamiz; maydonda Coddy, uch olma, kaktuslar, yulduz.',
    body: () => `<div class="chap">${matn('Savol', DARS.savol, 'Ikki do‘st, o‘yin esa bitta.')}${hKartalar({ son: SONI })}</div><div class="oyna">${maydon(hukM(), coddyK())}<span class="gl hk-nt">${NOUT_K}${NOUT_K}</span></div>`,
    foot: () => fU('Javob berdi: 14 / 14', 'Sinab ko‘ramiz ›') },
  P2N: { rol: 'b', b: 0, t: 't1', nom: 'Savol (noutbukda)', izoh: '2-qadam, bola: kartani bosishning o‘zi javob.',
    body: () => `<div class="chap">${matn('Savol', DARS.savol, 'Ikki do‘st bitta o‘yinni qanday yasaydi?')}${hKartalar()}</div><div class="oyna">${maydon(hukM(), coddyK())}<span class="gl hk-nt">${NOUT_K}${NOUT_K}</span></div>`,
    foot: () => fJim('Birini tanlang') },
  P2S: { rol: 'p', b: 0, t: 't1', nom: 'Uch sinov', izoh: '3-qadam. A — ikki bir xil dasturcha: → — ikki katak, ↑ — Bo‘shvoy; B — ikki yarim o‘yin (strelkalar ballsiz, ball strelkasiz); C — to‘liq o‘yin: uch olma, «ball: 3», yulduz (studiya.js hukAvto).',
    body: () => `<div class="chap">${matn('Savol', DARS.savol, 'Ikki do‘st, o‘yin esa bitta.')}${hKartalar({ son: SONI, avto: true })}</div><div class="oyna">${maydon(hukM(), coddyK())}${ballK(0, { yashirin: true })}</div>`,
    foot: () => fU('', 'Keyingi ›') },
  P2C: { rol: 'p', b: 0, t: 't1', nom: 'Javob', izoh: '4-qadam. A va B xira, C oltin; tayyor o‘yin — Coddy yulduzda, «ball: 3»; ro‘yxatda ikki qism ✓, har biri boshqa haydovchi.',
    body: () => `<div class="chap">${matn('Javob', 'Ishni bo‘lamiz, <em>navbat bilan</em>', 'Har qismni bittangiz yasaysiz. Keyin almashasiz.')}${hKartalar({ son: SONI, nat: true })}</div><div class="oyna">${maydon({ olma: [], kaktus: OLMA_M.kaktus, yulduz: OLMA_M.yulduz }, coddyK(), { joy: [6, 4] })}${ballK(3)}<div class="xk-roy"><small>O‘yiningizda:</small><div class="xk-rq"><i class="ok">${rol(RUL, 'k-rul c1')}To‘rt strelka ✓</i><i class="ok">${rol(RUL, 'k-rul c2')}Ball ✓</i></div></div></div>`,
    foot: () => fU('', 'Keyingi ›') },
  P3: { rol: 'p', b: 0, t: 't1', nom: 'Yangi so‘z: xakaton', izoh: '5-qadam. «Keyingi» — birma-bir: juftlik, ro‘yxat, tayyor o‘yin «Tayyor!» (studiya.js, raqam).',
    body: () => `<div class="chap">${matn('Yangi so‘z', 'Xakaton <em>nima</em>?', 'Xakaton — birga, oz vaqtda bitta narsa yasash.')}${xkSoz()}</div><div class="oyna">${world('hovli')}<div class="gl ta xs-ta" data-r="3"><small class="bsoz">Bugungi so‘z</small><b>Xakaton</b><span>Birga, oz vaqtda bitta narsa yasash</span><em>Bugun — juftlikda o‘yin</em></div></div>`,
    foot: () => fU('', 'Keyingi ›') },
  P4: { rol: 'p', b: 0, t: 't2', nom: 'Reja', izoh: '6-qadam.',
    body: () => `<div class="oyna to">${world('hovli')}<div class="gl pan">${matn('Reja', 'Bugun nima <em>qilamiz</em>?', 'Uchta bekat. Oxirida o‘yiningizni do‘stlar o‘ynaydi.')}</div>${darsOxiri()}${tepalik({ otdi: 0, joy: 0 })}</div>`,
    foot: () => fU('', 'Boshladik ›') },
  P6: { rol: 'p', b: 1, t: 't1', nom: 'Bugungi qoida: rul va xarita', izoh: '7-qadam. «Keyingi» — birma-bir: haydovchi, xaritachi, qism tayyor — almashamiz (studiya.js, raqam).',
    body: () => `<div class="chap">${matn('Qoida', 'Rul va <em>xarita</em>', 'Biri rulda, biri xaritaga qaraydi.')}${qoidaQator()}</div><div class="oyna">${world('hovli')}<div class="gl nout-k">${juftRasm()}</div></div>`,
    foot: () => fU('', 'Keyingi ›') },
  P5: { rol: 'p', b: 1, t: 't1', nom: 'Juftligingizni toping', izoh: '8-qadam. Juftliklar soni — o‘yin noutbuklari (maxraj — noutbuklar / 2).',
    body: () => doska('Juftlik', 'Juftligingizni <em>toping</em>', 'Bitta noutbuk, ikki do‘st.', 'Juftlik bo‘ldi', 0, '', `<div class="gl nout-k">${juftRasm()}</div>`),
    foot: () => fU('Juftlik bo‘ldi: 7 / 7', 'Keyingi ›') },
  P5T: { rol: 'p', b: 1, t: 't1', nom: 'Tanlaymiz: o‘yin va qismlar', izoh: '9-qadam. Juftlik ishi boshlandi; har o‘yin kartasi ostida nechta juftlik tanlagani (faqat son).',
    body: () => doska('Xakaton', 'O‘yinni <em>tanlang</em>!', 'Avval kelishib oling: qaysi o‘yin, qaysi qismlar.', 'Tanladi', 3, '', `<div class="gl xk-ok xk-okd">${['olma', 'lab'].map((o, i) => `<span class="xk-o" data-o="${o}">${o === 'olma' ? miniOlma('xk-mk') : miniLab('xk-mk')}<b>${o === 'olma' ? 'Olma terish' : 'Labirint'}</b><span class="jr-s">${ODAM}<b>${[2, 1][i]}</b></span></span>`).join('')}</div>`),
    foot: () => fU('Yordam so‘radi: 0 ta noutbuk', 'Keyingi ›') },
  P4B: { rol: 'p', b: 2, t: 't2', nom: 'Reja · 2-bekat', izoh: '10-qadam.',
    body: () => `<div class="oyna to">${world('hovli')}<div class="gl pan">${matn('Reja · 2-bekat', '2 · <em>Yasaymiz</em>', 'Endi navbat bilan yasaysiz.')}</div>${darsOxiri()}${tepalik({ otdi: 1, joy: 2 })}</div>`,
    foot: () => fU('', 'Keyingi ›') },
  P5Y: { rol: 'p', b: 2, t: 't1', nom: 'Yasaymiz: navbat bilan', izoh: '11-qadam. Zinapoya: har kartada hozir shu qismda nechta juftlik (qism nomlari yo‘q).',
    body: () => doska('Xakaton', 'Navbat bilan <em>yasaymiz</em>!', 'Qism tayyor bo‘lsa — o‘ynab ko‘ring va almashing.', 'Uch qism tayyor', 2, 'Har belgi — o‘yini tayyor bitta juftlik', zina(ZINA)),
    foot: () => fU('Yordam so‘radi: 1 ta noutbuk', 'Keyingi ›') },
  P4C: { rol: 'p', b: 3, t: 't2', nom: 'Reja · 3-bekat', izoh: '12-qadam.',
    body: () => `<div class="oyna to">${world('hovli')}<div class="gl pan">${matn('Reja · 3-bekat', '3 · <em>Sinaymiz</em>', 'Endi o‘yinni do‘stlar o‘ynashidan oldin sinaymiz.')}</div>${darsOxiri()}${tepalik({ otdi: 2, joy: 3 })}</div>`,
    foot: () => fU('', 'Keyingi ›') },
  P8: { rol: 'p', b: 3, t: 't3', nom: 'Ko‘ramiz: hamma holatni sinaymiz', izoh: '13-qadam. Tayyor: to‘rt strelka va jon (change jon by −2 — xato). ▶ — yutadi («Har strelka o‘z tomoniga» ✓); kaktusga ikki tegish — jon −1, Kamvoy «Jon tugadi-ku!»; −2 → −1, uch tegish — «O‘yin tugadi» («Jon 0 da tugaydi» ✓).',
    body: () => st({ tag: 'Ko‘ramiz', h: 'Hammasini <em>sinaymiz</em>', javon: JAVON.olma, dst: dstX(coddyYuz(), NAMOYISH), sahna: maydon(OLMA_M, coddyK()) + ozgQ({ jon: 3 }) + roy() }),
    foot: () => fU('', 'Keyingi ›') },
  P5S: { rol: 'p', b: 3, t: 't1', nom: 'Sinaymiz: ro‘yxat', izoh: '14-qadam.',
    body: () => doska('Xakaton', 'Sinang va <em>tuzating</em>!', 'Ro‘yxatdagi har bandni sinang.', 'Ro‘yxati to‘liq', 2, 'Har belgi — o‘yini sinalgan bitta juftlik', SINASH_R),
    foot: () => fU('Yordam so‘radi: 1 ta noutbuk', 'Keyingi ›') },
  P5D: { rol: 'p', b: 3, t: 't1', nom: 'Do‘stlar o‘ynaydi', izoh: '15-qadam. Juftliklar keyingi stolga o‘tadi; proyektorda ism ham, baho ham yo‘q — faqat son.',
    body: () => doska('Ko‘rsatish', 'Do‘stlar <em>o‘ynaydi</em>', 'Do‘stlaringiz yasagan o‘yinni siz yuta olasizmi?', 'O‘ynab ko‘rildi', 0, 'Har belgi — do‘stlar o‘ynagan bitta o‘yin', `<div class="gl nout-k xk-ayk">${AYLANA}</div>`),
    foot: () => fU('O‘ynab ko‘rildi: 7 / 7', 'Keyingi ›') },
  P11: { rol: 'p', b: 3, t: 't1', nom: 'O‘yiningiz haqida ayting', izoh: '16-qadam. Juftlik og‘zaki aytadi; ustoz o‘yin turi kartasini bosadi — karta yonadi (ism yo‘q).',
    body: () => `<div class="chap">${matn('Ko‘rsatish', 'O‘yiningiz haqida <em>ayting</em>', 'Juftlik o‘z o‘yini haqida aytadi.')}<div class="xyl xk-uch">${['O‘yinda nima bor', 'Kim qaysi qismni yasadi', 'Eng qiyin joyi'].map((t, i) => `<div class="xq on"><span class="hq"><b>${i + 1}</b><span>${t}</span></span></div>`).join('')}</div></div><div class="oyna">${world('hovli')}${oyinKartalar()}</div>`,
    foot: () => fU('', 'Keyingi ›') },
  P12: { rol: 'p', b: 4, t: 't2', nom: 'Yakun', izoh: '17-qadam.',
    body: () => `<div class="oyna to">${world('hovli')}${KONFETI()}<div class="gl pan">${matn('Yakun', 'Siz o‘yin <em>yasadingiz</em>!', '')}<div class="tm ix"><small class="bsoz">Bugungi so‘z</small><div class="tr"><span class="ti d"><i></i><i></i><i></i></span><span><b>Xakaton</b>Birga, oz vaqtda bitta narsa yasash</span></div></div><div class="xk-4">${['Ishni bo‘lamiz', 'Navbat bilan', 'Avval o‘yin ishlasin', 'Keyin qo‘shamiz'].map((t) => `<i>${t}</i>`).join('')}</div></div>${keyingiDars()}${tepalik({ otdi: 3, joy: 3 })}</div>`,
    foot: () => fU('', 'Keyingi ›') },
  P14: { rol: 'p', b: 4, t: 't1', nom: 'Sinfimiz bugun', izoh: '18-qadam.',
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
  BJ: { rol: 'b', b: 1, t: 't1', nom: 'Juftlik', izoh: '8-qadam. Ikki karta: o‘yin shu noutbukda · do‘stimning noutbukida (studiya.js «15-dars», juftlik).',
    body: () => `<div class="chap">${matn('Juftlik', 'Juftligingizni <em>toping</em>', 'Bitta noutbuk, ikki do‘st.')}${juftKartalar()}</div><div class="oyna">${world('hovli')}<div class="gl nout-k">${juftRasm()}</div></div>`,
    foot: () => fJim('Birini tanlang') },
  BJQ: { rol: 'b', b: 1, t: 't2', nom: 'Do‘stingizning qahramoni', izoh: '8-qadam, ikkinchi noutbuk: o‘yin noutbuklaridagi qahramonlar (ustozdan; bo‘lmasa — hammasi).',
    body: () => `<div class="oyna to">${world('hovli')}<div class="gl pan">${matn('Juftlik', 'Do‘stingizning <em>qahramoni</em>', 'O‘yin do‘stingizning noutbukida. Uning qahramonini toping.')}</div><div class="tq jq"></div></div>`,
    foot: () => fJim('Do‘stingizning qahramonini bosing') },
  BJD: { rol: 'b', b: 1, t: 't2', nom: 'Juftlikdasiz', izoh: '8–16-qadam, ikkinchi noutbuk: do‘stining qahramoni, rul va xarita.',
    body: () => `<div class="oyna to">${world('hovli')}<div class="gl pan">${matn('Juftlik', '<em>Juftlikdasiz</em>', 'Siz do‘stingizning noutbukida ishlaysiz. Dars oxirida natija shu yerda ham chiqadi.')}</div><div class="jd"><span class="aktyor jd-q">${qahK()}</span><span class="jd-r">${rol(RUL, 'k-rul')}${rol(XARITA, 'k-xar')}</span></div></div>`,
    foot: () => fJim('') },
  BT: { rol: 'b', b: 1, t: 't1', nom: 'Tanlaymiz', izoh: '9-qadam. O‘yin kartasi → qismlar (1-qism qotgan, to‘rttadan ikkitasi, ★ alohida) → «Tanladik» → «Tayyormiz» (studiya.js xkTanlov).',
    body: () => `<div class="chap">${matn('Xakaton · Tanlaymiz', 'O‘yinni <em>tanlang</em>', 'Ikkalangiz kelishib oling: qaysi o‘yin, qaysi ikki qism.')}<div class="xk-t">${oyinKartalar()}</div></div><div class="oyna">${world('hovli')}<div class="gl xk-pr"><span data-o="olma">${miniOlma('xk-pm')}</span><span data-o="lab">${miniLab('xk-pm')}</span></div></div>`,
    foot: () => fKid('Avval o‘yinni tanlang', 'Tanladik') },
  BXO: { rol: 'b', b: 2, t: 't3', nom: 'Yasaymiz · Olma terish', izoh: '11-qadam. Qismlar navbat bilan; qism tayyor — «Qism tayyor!», rul va xarita almashadi, «Almashdik».', ...xkO('Xakaton · 1-qism', 'To‘rt <em>strelka</em>', 'Xaritachi kartani o‘qisin') },
  BXL: { rol: 'b', b: 2, t: 't3', nom: 'Yasaymiz · Labirint', izoh: '11-qadam. Labirint: 1-qism — strelka va qoida; yasash qismlarida — «Labirint» asboblari.', ...xkL('Xakaton · 1-qism', 'Strelka va <em>qoida</em>', 'Xaritachi kartani o‘qisin') },
  BSO: { rol: 'b', b: 3, t: 't3', nom: 'Sinaymiz · Olma terish', izoh: '14-qadam. Har tayyor qism ostida sinash bandi; dvigatel o‘lchaydi.', ...xkO('Xakaton · Sinaymiz', 'Hammasini <em>sinang</em>', 'Hamma holatni sinang') },
  BSL: { rol: 'b', b: 3, t: 't3', nom: 'Sinaymiz · Labirint', izoh: '14-qadam.', ...xkL('Xakaton · Sinaymiz', 'Hammasini <em>sinang</em>', 'Hamma holatni sinang', DARAJA) },
  BDO: { rol: 'b', b: 3, t: 't3', nom: 'Do‘stlar o‘ynaydi · Olma terish', izoh: '15-qadam. O‘yin rejimi: dastur va ro‘yxat yopiq; o‘ynab bo‘lgach — «Sizga yoqdi:».', ...xkO('Ko‘rsatish', 'Do‘stlar <em>o‘ynaydi</em>', '') },
  BDL: { rol: 'b', b: 3, t: 't3', nom: 'Do‘stlar o‘ynaydi · Labirint', izoh: '15-qadam.', ...xkL('Ko‘rsatish', 'Do‘stlar <em>o‘ynaydi</em>', '', DARAJA) },
  B5: { rol: 'b', b: 4, t: 't1', nom: 'O‘z natijasi', izoh: '17–18-qadam. «Ikkalangiz bugun» — haqiqiy son (studiya.js xkNatija).',
    body: () => `<div class="chap">${matn('Sizning natijangiz', 'Siz o‘yin <em>yasadingiz</em>!', '')}${qg('Do‘stim bilan birga yasadik!')}<small class="st-s">Ikkalangiz bugun:</small>${sinfNatija(BOLA_T)}</div><div class="oyna">${maydon(OLMA_M, qahK())}<div class="xk-roy xk-nr"><small>O‘yiningizda:</small><div class="xk-rq"></div><span class="saqlandi">O‘yiningiz saqlandi.</span></div><div class="gl kd2 a-tr"><small>Momiq</small><b>Keyingi darsda klonlar bilan ko‘rishamiz!</b></div></div>`,
    foot: () => fJim(TUGADI_YOZUV) },
}
