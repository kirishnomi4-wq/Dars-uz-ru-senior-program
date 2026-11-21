
// ===== v3: mozaika bloklar, Scratch tartibidagi studiya =====
const IKON = {
  r: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h13M12 6l6 6-6 6" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  l: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12H7M12 6l-6 6 6 6" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  j: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19C6 6 18 6 20 19" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round"/><path d="M15 16l5 4 2-6" fill="none" stroke="#fff" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  s: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h14a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3h-7l-5 4v-4H5a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3z" fill="#fff"/></svg>',
}
const BL = { r: ['h', 'move right'], l: ['h', 'move left'], j: ['h', 'jump'], s: ['g', 'say'] }
// mb('r') · mb('s','Salom!') · mb('r','', 'yon')
const mb = (t, matn = 'Salom!', cls = '') => { const [f, nom] = BL[t]; return `<span class="mb f-${f} ${cls}">${IKON[t]}<span>${nom}</span>${t === 's' ? `<span class="inp">${matn}</span>` : ''}</span>` }
const yigma = (arr) => `<div class="mbw">${arr.map((x) => (typeof x === 'string' ? mb(x) : mb(...x))).join('')}</div>`
const OILA = { h: ['Harakat', 'r'], g: ['Gap', 's'] }
const rang = (f, cls = '') => `<span class="rd f-${f} ${cls}"><i>${IKON[OILA[f][1]]}</i><small>${OILA[f][0]}</small></span>`
const ranglar = (aktiv, holat = {}) => `<div class="rg" data-z="ranglar">${rang('h', (aktiv === 'h' ? 'on ' : '') + (holat.h || ''))}${rang('g', (aktiv === 'g' ? 'on ' : '') + (holat.g || ''))}</div>`
const PAL = { h: ['r', 'l', 'j'], g: [['s', 'Salom!']] }
const palitra = (f, ochiq = PAL[f].length) => `<div class="pl" data-z="bloklar"><small class="f-${f}">${OILA[f][0]}</small>${PAL[f].map((b, i) => `<div class="mbw${i >= ochiq ? ' yopiq' : ''}">${typeof b === 'string' ? mb(b) : mb(...b)}</div>`).join('')}</div>`
const dastur = (arr, yuz, iz = '') => `<div class="dst" data-z="dastur"><span class="dsb"><span class="dyz">${yuz}</span><b>Dastur</b></span>${arr.length ? yigma(arr) : '<span class="bosh">Blokni shu yerga ulang</span>'}${iz || `<small class="dsn">${arr.length} ta blok</small>`}</div>`
const momiqYuz = () => hero({ k: 'momiq', lite: true })
const coddyYuz = () => bust('xursand')
const ust = (tag, h, iz = '') => `<div class="ust" data-z="sarlavha"><span class="tag">${tag}</span><h3 class="sar">${h}</h3>${iz ? `<span class="iz">${iz}</span>` : ''}</div>`
const studiya = ({ tag, h, iz, aktiv = 'h', holat, ochiq, prog, yuz, sahna, extra = '' }) => `${ust(tag, h, iz)}${ranglar(aktiv, holat)}${palitra(aktiv, ochiq)}${dastur(prog, yuz)}<div class="oyna">${world('hovli')}${sahna}</div>${extra}`
const fB = ({ mas = '', hint = '', label = `${PLAY}Ishga tushir`, chap } = {}) => `<footer class="hn">${chap || `<span class="mas ${mas}">${LAMP}Maslahat</span>`}<span class="hint">${hint}</span><span class="asos">${label}</span></footer>`
const fU = (hint, label) => `<footer class="hn"><span class="orq">‹ Orqaga</span><span class="hint">${hint}</span><span class="asos">${label}</span></footer>`
const kurs = () => `<div class="kurs">
  <div class="gl kr"><div class="kr-r o">${world('kosmos', true)}<span class="kr-q">${hero({ k: 'jele', mood: 'xursand', mv: 'sakraydi', lite: true })}</span><i class="tos"></i><i class="tos t2"></i></div><b>O‘yin</b><small>1-modul</small></div>
  <div class="gl kr"><div class="kr-r s"><span class="br"><i></i><i></i><i></i></span><span class="sq">${hero({ k: 'katak', mood: 'xursand', lite: true })}</span><span class="sl"><i></i><i></i><i class="q"></i></span></div><b>Sayt</b><small>6-modul</small></div>
  <div class="gl kr"><div class="kr-r b"><span class="ch c1">Salom!</span><span class="ch c2"><span class="ba">${hero({ k: 'nihol', mood: 'xursand', lite: true })}</span>Salom, men botman</span><span class="ch c1 k">Ob-havo?</span></div><b>Telegram bot</b><small>8-modul</small></div>
</div>`

const BEKAT = ['Kirish', 'Yurgizamiz', 'Gapirtiramiz', 'O‘z sahnangiz', 'Yakun']
const seg = (n) => '<ol class="seg">' + BEKAT.map((q, i) => `<li class="${i < n ? 'otdi' : i === n ? 'hozir' : ''}"><span>${q}</span></li>`).join('') + '</ol>'
const bosh = (n) => `<header class="hb"><span class="hl"><i></i>1-dars · Tanishuv</span>${seg(n)}</header>`
const O = (n, cls = '') => `<span class="O ${cls}">${n}</span>`

const E = {
  P1: { rol: 'p', b: 0, t: 't1', nom: 'Kirish', yangi: 1, fid: '01', izoh: 'YANGI (v3.1: ikki ustun shabloniga o‘tdi — kurs kartalari endi sahnaga tushmaydi). Dars kursning o‘zi bilan ochiladi: bu birinchi dars va kursda nima yasaladi — o‘yin, sayt, bot (har biri o‘zi o‘ynab turgan kichik rasm). Bola blokka shundan keyin keladi.',
    body: () => `<div class="chap">${matn('Kursning birinchi darsi', 'Bu kursda siz <em>yasaysiz</em>:', 'Salom! Men Coddy. Bugun — birinchi qadam.')}${kurs()}</div><div class="oyna">${world('hovli')}${yol('p3b', coddyQ('', 'salom', 'xursand'))}</div>`,
    foot: () => fU('Kirdi: 12 / 14', 'Keyingi ›') },
  P2: { rol: 'p', b: 0, t: 't2', nom: 'Savol (huk)', fid: '03', izoh: 'Darsdagi YAGONA savol. v3.1: javob kartalari tepa qatlamda, Coddy yopilmaydi; yo‘lda zonachalar va sakrash yoylari. Bolalar noutbukda javob tanlaydi, keyin sinf baqirib va sudrab sinab ko‘radi. Javob — ko‘k move right bloki.',
    body: () => `<div class="oyna to">${world('hovli')}<div class="gl pan">${matn('Savol', 'Coddy‘ni <em>yulduzga</em> qanday olib boramiz?', 'Noutbukda bitta javobni tanlang.')}</div>${kartalar([['A', '«YUR!» deb baqiramiz'], ['B', 'Sichqoncha bilan sudraymiz'], ['C', 'Unga buyruq yozamiz']], 'gl a-r')}${yol('p1', coddyQ('', 'oylaydi', 'savol'))}</div>`,
    foot: () => fU('Javob berdi: 9 / 14', 'Javoblarni ochish') },
  P3: { rol: 'p', b: 0, t: 't1', nom: 'Dasturlash nima?', yangi: 1, fid: '01 · 05', izoh: 'YANGI. Dasturchi buyruqni yozadi (bir qator haqiqiy kod — o‘qish shart emas), biz esa bloklarni ulaymiz: bloklar mozaikadek ulanib tushadi va Coddy yuradi. Savol yo‘q.',
    body: () => `<div class="chap">${matn('Yangi so‘z', '<em>Blokli</em> dasturlash', 'Biz buyruqni yozmaymiz — bloklarni ulaymiz.')}<div class="ikki"><div class="kod"><small>Dasturchi yozadi</small><code>coddy.move("right")<br>coddy.move("right")</code></div><span class="ar2">=</span><div class="biz"><small>Biz ulaymiz</small>${yigma(['r', 'r'])}</div></div><p class="izq">Scratch’da millionlab bolalar o‘yinni shunday yasaydi.</p></div><div class="oyna">${world('hovli')}<div class="gl tush">${yigma(['r', ['r', '', 'yangi'], ['r', '', 'tushadi']])}</div>${yol('p3b', coddyQ('yur'))}</div>`,
    foot: () => fU('Ustozga: «Dasturlash — buyruq berish» deb ayting', 'Keyingi ›') },
  P4: { rol: 'p', b: 0, t: 't1', nom: 'Reja', izoh: 'O‘zgarmadi: uch bekat va dars oxiridagi natija.',
    body: () => `<div class="chap">${matn('Bugungi reja', 'Bugun uchta <em>bekat</em> bor.', '')}<ol class="rj"><li class="hozir"><i>1</i><span><b>Yurgizamiz</b>bloklar bilan birinchi dastur</span></li><li><i>2</i><span><b>Gapirtiramiz</b>qahramon salom beradi</span></li><li><i>3</i><span><b>O‘z sahnamiz</b>o‘zingiz yaratasiz</span></li></ol></div><div class="oyna">${world('hovli')}<div class="qq"><span class="m1">${hero({ k: 'momiq', mood: 'xursand' })}</span><span class="m2">${robot({ pose: 'salom', yuz: 'xursand' })}</span><span class="m3">${hero({ k: 'nihol', mood: 'xursand' })}</span></div></div>`,
    foot: () => fU('Ustozga: rejani o‘qib bering', 'Boshladik ›') },
  B1: { rol: 'b', b: 1, t: 't3', nom: 'Ranglar', yangi: 1, fid: '02', izoh: 'YANGI. Studiya bilan tanishuvda har bola rang doirachalarini o‘zi bosadi: ko‘k — Harakat (bosildi ✓), binafsha — Gap (miltillaydi). Qolgan joy xira. Tanlashning o‘zi — harakat, asosiy tugma yo‘q.',
    body: () => `${studiya({ tag: 'Blok studiya', h: 'Har rang — bitta <em>oila</em>', aktiv: 'h', holat: { h: 'ok', g: 'puls' }, prog: [], yuz: momiqYuz(), sahna: yol('b2', momiqQ()) })}<div class="xira"></div><div class="ishora">${O('☝')}Rangli doirachalarni bosing</div>`,
    foot: () => fJim('Ikkala rangni bosing · 1 / 2') },
  B2: { rol: 'b', b: 1, t: 't3', nom: 'Studiya', fid: '05 · 07', izoh: 'Scratch tartibi: ranglar → bloklar → dastur → sahna. Bloklar inglizcha va mozaikadek ustma-ust ulanadi (sudrab yoki bosib). Dastur tepasida qahramonning yuzi.',
    body: () => studiya({ tag: 'Mashq · 1-pog‘ona', h: 'Qahramoningizni <em>yulduzga</em> olib&nbsp;boring.', aktiv: 'h', ochiq: 1, prog: ['r', 'r', 'r'], yuz: momiqYuz(), sahna: yol('b2', momiqQ()) }),
    foot: () => fB({ hint: 'Nuqtalarni sanang: yulduzgacha nechta?' }) },
  P5: { rol: 'p', b: 1, t: 't1', nom: 'Sinf doskasi', fid: '09', izoh: 'Bolalar ishlayotganda katta ekranda topshiriq va sinf holati (faqat son). Vaqt yo‘q — sahnani ustoz tugatadi. Pog‘onalar chapga o‘tdi: bo‘sh joy qolmadi.',
    body: () => `<div class="chap">${matn('Mashq · bolalar ishlayapti', 'Qahramoningizni <em>yulduzga</em> olib&nbsp;boring.', 'Qiynalsangiz — «Maslahat»ni bosing.')}<ol class="pg"><li><span>1</span>Yulduzga yetkazing<b>9</b></li><li><span>2</span>Yulduz orqada qoldi<b>3</b></li><li><span>★</span>Roppa-rosa 9 blok<b>1</b></li></ol></div><div class="oyna">${world('hovli')}<div class="gl doska"><small>Yulduzga yetdi</small><b class="katta">9 <i>/ 14</i></b><div class="yulduzlar">${Array.from({ length: 14 }, (_, i) => `<i class="${i < 9 ? 'on' : ''}">${STAR}</i>`).join('')}</div></div></div>`,
    foot: () => fU('Yordam so‘radi: 1 ta noutbuk', 'Keyingi ›') },
  B3: { rol: 'b', b: 1, t: 't3', nom: 'Xato', izoh: 'Qahramon yetib bormadi: Kamvoy tepalik ortidan mo‘ralaydi, «Maslahat» yonadi. «Xato» so‘zi yo‘q.',
    body: () => studiya({ tag: 'Mashq · 1-pog‘ona', h: 'Qahramoningizni <em>yulduzga</em> olib&nbsp;boring.', aktiv: 'h', ochiq: 1, prog: ['r', 'r'], yuz: momiqYuz(), sahna: `${yol('b2', momiqQ('at2', 'hayron'))}<div class="muam"><span class="mk">${hero({ k: 'kamvoy', mood: 'hayron' })}</span><span class="gl pufak"><b>Oz qoldi!</b>Nuqtalarni sanang.</span></div>` }),
    foot: () => fB({ mas: 'yon', hint: 'Maslahat yondi' }) },
  B4: { rol: 'b', b: 1, t: 't3', nom: 'Yetib bordi', izoh: 'Qahramon yulduzda, bajarilgan bloklar yonib turibdi. Ekran o‘zi o‘tmaydi: bola «Keyingi pog‘ona»ni o‘zi bosadi.',
    body: () => studiya({ tag: 'Mashq · 1-pog‘ona', h: 'Yetib bordi! <em>Birinchi</em> dasturingiz.', aktiv: 'h', ochiq: 1, prog: [['r', '', 'yon'], ['r', '', 'yon'], ['r', '', 'yon']], yuz: momiqYuz(), sahna: `<div class="konfeti">${Array.from({ length: 16 }, (_, i) => `<i style="--x:${(i * 37) % 100}%;--d:${(i % 5) * 0.12}s;--r:${(i * 47) % 360}deg" class="k${i % 4}"></i>`).join('')}</div>${yol('b2', momiqQ('at3', 'xursand'))}` }),
    foot: () => fB({ chap: `<span class="mas">${QAYTA}Qayta ko‘rish</span>`, label: 'Keyingi pog‘ona ›' }) },
  P6: { rol: 'p', b: 1, t: 't3', nom: 'Coddy sanaydi', yangi: 1, fid: '03', izoh: 'SAVOL O‘RNIGA KO‘RSATISH. v2 dagi «Coddy qayerda to‘xtaydi?» testi olib tashlandi: ustoz ishga tushiradi, Coddy bloklarni sanab yulduzdan o‘tib ketadi — keyin tushuntiradi va bitta blokni chiqaradi.',
    body: () => studiya({ tag: 'Ko‘ramiz', h: 'Coddy yulduzni <em>ko‘rmaydi</em>.', iz: 'U bloklarni sanaydi: 4 ta blok — 4 qadam.', aktiv: 'h', ochiq: 1, prog: [['r', '', 'yon'], ['r', '', 'yon'], ['r', '', 'yon'], ['r', '', 'yon hozir']], yuz: coddyYuz(), sahna: `${yol('p5', coddyQ('at4', 'turadi', 'son').replace('>3</text>', '>4</text>'), 4, 3)}<span class="gl yrl y-tox">«To‘xta! Men shu yerdaman!»</span>` }),
    foot: () => fU('Ustozga: oxirgi blokni dasturdan chiqaring', 'Keyingi ›') },
  P7: { rol: 'p', b: 2, t: 't3', nom: 'say bloki', yangi: 1, fid: '02 · 03 · 04', izoh: 'SAVOL O‘RNIGA KO‘RSATISH. Binafsha oila — «Gap». «de» o‘rniga say. Ustoz yozuvni «2 qadam yur» qiladi: Coddy yurmaydi, faqat aytadi — «nima qilishini blok hal qiladi».',
    body: () => studiya({ tag: 'Yangi blok · say', h: '<em>Yurmadi</em> — faqat aytdi.', iz: 'Nima qilishini blok hal qiladi, yozuv emas.', aktiv: 'g', holat: { h: 'ok' }, prog: [['s', '2 qadam yur', 'yon']], yuz: coddyYuz(), sahna: `<div class="cdy2">${robot({ pose: 'tushuntiradi', yuz: 'xursand' })}</div><span class="gl gap-p">2 qadam yur</span>` }),
    foot: () => fU('Ustozga: «say — ayt. Binafsha — gap oilasi»', 'Keyingi ›') },
  P8: { rol: 'p', b: 4, t: 't1', nom: 'Yakun', fid: '08', izoh: 'Bugungi so‘zlar va ikki rang oilasi. Sinfning jami sonlari endi yo‘q — har bolaning ma’lumoti faqat o‘z noutbukida. Keyingi dars — labirint.',
    body: () => `<div class="chap">${matn('Yakun', 'Bugun siz <em>dastur</em> yozdingiz.', 'Uchala bekatdan o‘tdik. Keyingi darsda — labirint!')}<div class="tm"><div class="tr"><span class="ti u">!</span><span><b>Dasturlash</b>Kompyuterga buyruq berish</span></div><div class="tr"><span class="ti b">${IKON.r}</span><span><b>Blok</b>Bitta buyruq · rangi — oilasi</span></div><div class="tr"><span class="ti d"><i></i><i></i><i></i></span><span><b>Dastur</b>Buyruqlar ro‘yxati</span></div></div></div><div class="oyna">${world('hovli')}${qahramonlar()}<div class="gl kd2 a-tr"><small>Keyingi dars</small><b>2 · Labirint</b></div></div>`,
    foot: () => fU('Ustozga: «Noutbukingizga qarang» deb ayting', 'Darsni yakunlash') },
  B5: { rol: 'b', b: 4, t: 't1', nom: 'O‘z ma’lumoti', yangi: 1, fid: '08 · 07', izoh: 'YANGI. Bola bugun qaysi blokni necha marta ishlatganini ko‘radi — blok nomi va rangi bilan. Faqat o‘z noutbukida; proyektorga chiqmaydi.',
    body: () => `<div class="chap">${matn('Sizning natijangiz', 'Bugun <em>uddaladingiz</em>!', '')}<div class="stat"><div>${yigma(['r'])}<b>× 14</b></div><div>${yigma(['l'])}<b>× 3</b></div><div>${yigma(['j'])}<b>× 2</b></div><div>${yigma([['s', 'Men Zippiman!']])}<b>× 5</b></div></div><div class="sahna-ok">✓ O‘z sahnangizni yasadingiz</div></div><div class="oyna">${world('kosmos')}<div class="qq"><span class="m2">${hero({ k: 'yulduz', mood: 'xursand', mv: 'sakraydi' })}</span></div><div class="gl kd2 a-tr"><small>Zippi</small><b>Keyingi darsda kutadi</b></div></div>`,
    foot: () => fJim('Dars tugadi') },
}
const LAHZA = [
  ['1', 'Kirish', 'Bu birinchi dars: kursda nima yasaymiz.', ['P1']],
  ['2', 'Savol va «Dasturlash nima?»', 'Darsdagi yagona savol, keyin fanning o‘zi: dasturlash va blokli dasturlash.', ['P2', 'P3']],
  ['3', 'Reja', 'Uch bekat.', ['P4']],
  ['4', 'Blok studiya', 'Ranglar (bola o‘zi bosadi), birinchi dastur, xato, muvaffaqiyat. Katta ekranda — sinf doskasi.', ['B1', 'B2', 'P5', 'B3', 'B4']],
  ['5', 'Ko‘ramiz — savolsiz', 'Ustoz ko‘rsatadi va tushuntiradi; bola keyin o‘zi bajaradi.', ['P6', 'P7']],
  ['6', 'Yakun', 'Katta ekranda — so‘zlar; bola noutbukida — o‘z ma’lumoti.', ['P8', 'B5']],
]
const ekran = (id) => { const e = E[id]; return `<figure class="${e.rol === 'p' ? 'pr' : 'bo'}" data-id="${id}"><div class="ekran hy ${e.t} e-${id}" role="img" aria-label="${id} ${e.nom}" tabindex="0">${bosh(e.b)}<main class="hm">${e.body()}</main>${e.foot()}</div><figcaption><span class="eid">${id}</span><b>${e.rol === 'p' ? 'Proyektor' : 'Bola noutbuki'} · ${e.nom}${e.fid ? ` <span class="fid">F-1115-${e.fid}</span>` : ''}</b><span class="fiz">${e.izoh}</span></figcaption><div class="ov" role="group" aria-label="${id} bo‘yicha javob"><button type="button" data-v="qabul">Qabul</button><button type="button" data-v="boshqa">Boshqa g‘oya</button><input type="text" placeholder="Izoh (ixtiyoriy)" aria-label="${id} izohi"></div></figure>` }
const lahzalar = LAHZA.map(([n, nom, iz, ids]) => `<section class="lahza" aria-label="${nom}"><div class="l-bosh"><span class="l-n">${n}</span><div><h3>${nom}</h3><p>${iz}</p></div></div><div class="l-ekranlar">${ids.map(ekran).join('')}</div></section>`).join('\n')
const MOZ = `<div class="ekran hy t3 e-MZ namuna-st" role="img" aria-label="Mozaika bloklar">${bosh(1)}<main class="hm">${studiya({ tag: 'Yigma ko‘rinish', h: 'Bloklar <em>ulanadi</em>', iz: 'Sudrab olib boring — «chiq» etib ulanadi. Yoki bosing — oxiriga o‘zi ulanadi.', aktiv: 'h', prog: ['r', 'r', 'l'], yuz: momiqYuz(), sahna: yol('b2', momiqQ()) })}<div class="sudra">${yigma([['j', '', 'qol']])}</div></main>${fB({ hint: 'Qo‘yib yuboring — «chiq» etib ulanadi' })}</div>`

let t = readFileSync(V + '/shablon6.html', 'utf8').replace('{{HARAKAT}}', HARAKAT).replace('{{MAKET}}', MAKET).replace('{{LAHZALAR}}', lahzalar).replace('{{MOZAIKA}}', MOZ)
t = t.replaceAll('"Source Serif 4",Georgia,serif', 'var(--f-sar)').replaceAll('"Source Serif 4",serif', 'var(--f-sar)').replaceAll('"Manrope",sans-serif', 'var(--f-matn)')
t = t.replaceAll('<div class="chap">', '<div class="chap" data-z="matn">').replace(/<div class="oyna([^"]*)">/g, '<div class="oyna$1" data-z="sahna">').replace(/<div class="gl pan">/g, '<div class="gl pan" data-z="sarlavha paneli">')
t = t.replace(/<svg (class="(?:hero|robot|world))/g, '<svg xmlns="http://www.w3.org/2000/svg" $1')
if (/\{\{/.test(t)) { console.error('QOLDI', t.match(/\{\{[^}]*\}\}/g)); process.exit(1) }
writeFileSync(OUT, t); console.log('ok', (t.length / 1024).toFixed(0) + 'KB')
