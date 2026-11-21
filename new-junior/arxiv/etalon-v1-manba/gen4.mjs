// Etalon v1: H2 asos + H3 «wow» lahzalari + I1–I9, darsning butun oqimi (proyektor + bola noutbuki), qonunlar va qarorlar.
import { hero, robot, world } from '/home/kali/Desktop/internetLesson/new-junior/src/chizma/dvigatel.js'
import { readFileSync, writeFileSync } from 'node:fs'
const V = '/home/kali/Desktop/internetLesson/new-junior/arxiv/etalon-v1-manba'
const OUT = process.argv[2]
const HARAKAT = readFileSync('/home/kali/Desktop/internetLesson/new-junior/src/chizma/harakat.css', 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')
const MAKET = readFileSync(V + '/maket3.css', 'utf8').split('\n').slice(0, 101).join('\n')

const OYOQ = '<svg viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="8" cy="15" rx="3.6" ry="5.4" fill="#fff"/><ellipse cx="16" cy="9" rx="3.6" ry="5.4" fill="#fff"/></svg>'
const YUL = '<svg class="yul" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.6l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z" fill="#FFC93C" stroke="#E8A90C" stroke-width="1.2" stroke-linejoin="round"/><path d="M9.3 8.6l1.2-2.4" stroke="#fff6cf" stroke-width="1.4" stroke-linecap="round"/></svg>'
const PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4l13 8-13 8z" fill="#fff"/></svg>'
const QALAM = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20l1.2-4.6L15.6 5a2 2 0 0 1 2.8 0l.6.6a2 2 0 0 1 0 2.8L8.6 18.8z" fill="#E7CA66"/><path d="M4 20l1.2-4.6 3.4 3.4z" fill="#0D2137"/></svg>'
const LAMP = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a6 6 0 0 0-3.5 10.9V16h7v-2.1A6 6 0 0 0 12 3z" fill="#E7CA66"/><rect x="9" y="17.5" width="6" height="2.2" rx="1" fill="#0D2137"/></svg>'
const QAYTA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12a7 7 0 1 0 2.1-5" fill="none" stroke="#0D2137" stroke-width="2.4" stroke-linecap="round"/><path d="M4 4v4.5h4.5" fill="none" stroke="#0D2137" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>'
const STAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.6l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z"/></svg>'
const blk = (cls = '') => `<span class="blk ${cls}">${OYOQ}1 qadam yur</span>`
const BEKAT = ['Savol', 'Yangi mavzu', 'Mashq', 'Test', 'Xulosa']

const seg = (n) => '<ol class="seg">' + BEKAT.map((q, i) => `<li class="${i < n ? 'otdi' : i === n ? 'hozir' : ''}"><span>${q}</span></li>`).join('') + '</ol>'
const bosh = (n) => `<header class="hb"><span class="hl"><i></i>1-dars · Tanishuv</span>${seg(n)}</header>`
const bust = (yuz = 'xursand') => robot({ pose: 'salom', yuz, lite: true }).replace('viewBox="0 0 260 240"', 'viewBox="50 -12 160 160"')
const cg = (gap, yuz) => `<div class="cg"><span class="av">${bust(yuz)}</span><p><small>Coddy</small>${gap}</p></div>`
const matn = (tag, h, gap, extra = '', yuz) => `<span class="tag">${tag}</span><h3 class="sar">${h}</h3>${gap ? cg(gap, yuz) : ''}${extra}`
const daftar = (t) => `<span class="daf">${QALAM}<span>Daftarga yozing: <b>${t}</b></span></span>`
const mis = () => `<div class="mis"><div>${blk('yonadi')}<span class="ar">→</span><b>1 qadam</b></div><div>${blk()}${blk()}<span class="ar">→</span><b>2 qadam</b></div></div>`
const nuq = (n, star = 3) => Array.from({ length: n }, (_, i) => `<span class="n n${i + 1}${i + 1 === star ? ' y' : ''}">${i + 1}${i + 1 === star ? YUL : ''}</span>`).join('')
const yol = (cls, aktyor, n = 3, star = 3) => `<div class="yol ${n === 4 ? 'to5' : ''} ${cls}">${aktyor}${nuq(n, star)}</div>`
const coddyQ = (cls = '', pose = 'korsatadi', yuz = 'xursand') => `<div class="q ${cls}">${robot({ pose, yuz })}</div>`
const momiqQ = (cls = '', mood = 'xursand', mv) => `<div class="q kichik ${cls}">${hero({ k: 'momiq', mood, mv })}</div>`
const SH = { A: 'c1', B: 'c2', C: 'c3' }
const kartalar = (arr, cls = '') => `<div class="jv ${cls}">` + arr.map(([l, t, extra = '', k = '']) => `<div class="jk ${SH[l]} ${k}"><i class="sh ${SH[l]}"></i><span class="jt"><b>${l}</b>${t}</span>${extra}</div>`).join('') + '</div>'
const bar = (n, foiz) => `<span class="son">${n}</span><span class="bar"><i style="width:${foiz}%"></i></span>`
const TERM = [['u', 'Buyruq', 'Kompyuterga aytiladigan aniq ish'], ['b', 'Blok', 'Bitta buyruq'], ['d', 'Dastur', 'Buyruqlar ro‘yxati']]
const terminlar = () => '<div class="tm">' + TERM.map(([k, n, t]) => `<div class="tr"><span class="ti ${k}">${k === 'u' ? '!' : k === 'b' ? OYOQ : '<i></i><i></i><i></i>'}</span><span><b>${n}</b>${t}</span></div>`).join('') + '</div>'
const natija = (cls = '') => `<div class="nt ${cls}"><small>Sinfimiz bugun</small><div class="ns"><span><b>210</b>qadam</span><span><b>54</b>gap</span><span><b>8</b>sahna</span></div><div class="kd"><small>Keyingi dars</small><b>2 · Labirint</b></div></div>`
const qahramonlar = () => `<div class="qq"><span class="m1">${hero({ k: 'momiq', mood: 'xursand' })}</span><span class="m2">${robot({ pose: 'quvonadi' })}</span><span class="m3">${hero({ k: 'katak', mood: 'xursand' })}</span></div>`

const fUstoz = (hint, soat, label) => `<footer class="hn"><span class="orq">‹ Orqaga</span><span class="hint">${hint}</span><span class="soat">${soat}</span><span class="asos">${label}</span></footer>`
const fBola = ({ mas = '', blok = 3, label = `${PLAY}Ishga tushir`, chap } = {}) => `<footer class="hn dastur">${chap || `<span class="mas ${mas}">${LAMP}Maslahat</span>`}<span class="yz">${hero({ k: 'momiq', lite: true })}</span><span class="pr">${Array.from({ length: blok }, () => blk()).join('')}</span><span class="sanoq">${blok} ta blok</span><span class="asos">${label}</span></footer>`
const fJim = (t) => `<footer class="hn jim"><span class="hint">${t}</span></footer>`

// ===== ekranlar =====
const E = {
  P1: { rol: 'p', b: 0, t: 't2', nom: 'Savol', izoh: 'Dars savol bilan ochiladi. Bolalar noutbukda javob tanlaydi, katta ekranda nechta bola javob bergani chiqadi.',
    body: () => `<div class="oyna to">${world('hovli')}<div class="gl pan">${matn('Savol', 'Coddy‘ni <em>yulduzga</em> qanday olib boramiz?', 'Noutbukda bitta javobni tanlang.')}</div>${kartalar([['A', '«YUR!» deb baqiramiz'], ['B', 'Sichqoncha bilan sudraymiz'], ['C', 'Unga buyruq yozamiz']], 'gl a-r')}${yol('p1', coddyQ('', 'oylaydi', 'savol'))}</div>`,
    foot: () => fUstoz('Javob berdi: 9 / 14', '1:12 / 6 daq', 'Javoblarni ochish') },
  P2: { rol: 'p', b: 0, t: 't1', nom: 'Reja', izoh: 'Darsning rejasi — kitob mundarijasidek: uch bekat, har birida nima qilinadi. Bu xarita darsda yana uch marta qaytadi, bajarilgan bekatda belgi bilan.',
    body: () => `<div class="chap">${matn('Bugungi reja', 'Bugun uchta <em>bekat</em> bor.', '')}<ol class="rj"><li class="hozir"><i>1</i><span><b>Yurgizamiz</b>bloklar bilan birinchi dastur</span></li><li><i>2</i><span><b>Gapirtiramiz</b>qahramon salom beradi</span></li><li><i>3</i><span><b>O‘z sahnamiz</b>o‘zingiz yaratasiz</span></li></ol></div><div class="oyna">${world('hovli')}<div class="qq"><span class="m1">${hero({ k: 'momiq', mood: 'xursand' })}</span><span class="m2">${robot({ pose: 'salom', yuz: 'xursand' })}</span><span class="m3">${hero({ k: 'nihol', mood: 'xursand' })}</span></div></div>`,
    foot: () => fUstoz('Ustozga: rejani o‘qib bering', '0:40 / 2 daq', 'Boshladik ›') },
  P3: { rol: 'p', b: 1, t: 't2', nom: 'Yangi so‘z', izoh: 'Yangi so‘z chiqqan lahza — eng ta‘sirli ekran: hovli to‘liq, so‘z shisha panelda, Coddy jonli namoyish qiladi (blok yonadi → bir qadam).',
    body: () => `<div class="oyna to">${world('hovli')}<div class="gl pan">${matn('Yangi so‘z · 1/2', '<em>Blok</em> — bitta buyruq.', 'Blokni bosing — men bir qadam yuraman.', mis() + daftar('Blok — bitta buyruq'))}</div>${yol('p3', coddyQ('yur'))}<span class="gl yrl y-p3">Bitta blok — bitta qadam</span></div>`,
    foot: () => fUstoz('Ustozga: «Blok — bitta buyruq» deb ayting', '0:41 / 2 daq', 'Keyingi ›') },
  B1: { rol: 'b', b: 1, t: 't2', nom: 'Kutish', izoh: 'Ustoz tushuntirayotganda bolaning noutbuki tinch: bitta ko‘rsatma va daftarga yoziladigan qator. Bosiladigan narsa yo‘q — shuning uchun asosiy tugma ham yo‘q.',
    body: () => `<div class="oyna to kech">${world('hovli')}<div class="parda"></div><div class="gl qarang"><span class="uq">↑</span><b>Katta ekranga qarang</b><span>Ustoz yangi so‘zni tushuntiryapti</span>${daftar('Blok — bitta buyruq')}</div>${yol('b1', momiqQ('', 'qaraydi'))}</div>`,
    foot: () => fJim('Ustoz davom ettiradi') },
  P4: { rol: 'p', b: 2, t: 't1', nom: 'Sinf doskasi', izoh: 'Bolalar o‘zi ishlayotganda katta ekranda topshiriq turadi: boshini ko‘targan bola nima qilishini ko‘radi. O‘ngda — sinf qanchalik yetib borgani (ismsiz).',
    body: () => `<div class="chap">${matn('Mashq · bolalar ishlayapti', 'Qahramoningizni <em>yulduzga</em> olib boring.', 'Qiynalsangiz — «Maslahat»ni bosing.')}<span class="taymer">2:41 <small>qoldi</small></span></div><div class="oyna">${world('hovli')}<div class="gl doska"><small>Yulduzga yetdi</small><b class="katta">9 <i>/ 14</i></b><div class="yulduzlar">${Array.from({ length: 14 }, (_, i) => `<i class="${i < 9 ? 'on' : ''}">${STAR}</i>`).join('')}</div><ol class="pg"><li><span>1</span>Yulduzga yetkazing<b>9</b></li><li><span>2</span>Yulduzda gapirsin<b>3</b></li><li><span>★</span>Roppa-rosa 9 blok<b>1</b></li></ol></div></div>`,
    foot: () => fUstoz('Yordam so‘radi: 1 ta noutbuk', '4:19 / 7 daq', 'Keyingi ›') },
  B2: { rol: 'b', b: 2, t: 't1', nom: 'Studiya', izoh: 'Bolaning ish joyi. Chapda — topshiriq va bloklar, o‘ngda — hovli, pastda — dastur va bitta asosiy tugma.',
    body: () => `<div class="chap">${matn('Mashq · 1-pog‘ona', 'Qahramoningizni <em>yulduzga</em> olib boring.', 'Nuqtalarni sanang: yulduzgacha nechta qadam?')}<div class="jav"><small>Bloklar</small>${blk()}<p>Blokni bosing — u pastdagi dasturga tushadi.</p></div></div><div class="oyna">${world('hovli')}${yol('b2', momiqQ())}</div>`,
    foot: () => fBola() },
  B3: { rol: 'b', b: 2, t: 't1', nom: 'Xato', izoh: 'Qahramon yetib bormadi. Muammocha Kamvoy tepalik ortidan mo‘ralaydi va maslahat beradi. «Maslahat» tugmasi yonadi. Xato — jazo emas, keyingi urinishga yo‘l.',
    body: () => `<div class="chap">${matn('Mashq · 1-pog‘ona', 'Qahramoningizni <em>yulduzga</em> olib boring.', 'Nuqtalarni sanang: yulduzgacha nechta qadam?')}<div class="jav"><small>Bloklar</small>${blk()}<p>Blokni bosing — u pastdagi dasturga tushadi.</p></div></div><div class="oyna">${world('hovli')}${yol('b2', momiqQ('at2', 'hayron'))}<div class="muam"><span class="mk">${hero({ k: 'kamvoy', mood: 'hayron' })}</span><span class="gl pufak"><b>Oz qoldi!</b>Yulduzgacha nechta qadam? Nuqtalarni sanang.</span></div></div>`,
    foot: () => fBola({ mas: 'yon', blok: 2 }) },
  B4: { rol: 'b', b: 2, t: 't1', nom: 'Yetib bordi', izoh: 'Muvaffaqiyat: qahramon yulduzda, qisqa tabrik. Ekran o‘zi o‘tib ketmaydi — bola natijani ko‘radi va keyingi pog‘onaga o‘zi o‘tadi.',
    body: () => `<div class="chap">${matn('Mashq · 1-pog‘ona', 'Qahramoningizni <em>yulduzga</em> olib boring.', 'Zo‘r! Endi keyingi pog‘ona.', '', 'xursand')}<div class="tabrik"><b>Yetib bordi!</b>Bu — sizning birinchi dasturingiz.</div></div><div class="oyna">${world('hovli')}<div class="konfeti">${Array.from({ length: 16 }, (_, i) => `<i style="--x:${(i * 37) % 100}%;--d:${(i % 5) * 0.12}s;--r:${(i * 47) % 360}deg" class="k${i % 4}"></i>`).join('')}</div>${yol('b2', momiqQ('at3', 'xursand'))}</div>`,
    foot: () => fBola({ chap: `<span class="mas">${QAYTA}Qayta ko‘rish</span>`, label: 'Keyingi pog‘ona ›' }) },
  P5: { rol: 'p', b: 3, t: 't1', nom: 'Test', izoh: 'Savol, Coddy‘ning dasturi va hovli. Javoblar harf, rang va shakl bilan — ustoz «ko‘k doira» desa, hamma tushunadi.',
    body: () => `<div class="chap">${matn('Test · 1/3', 'Coddy <em>qayerda</em> to‘xtaydi?', 'Dasturda 4 ta blok. Sanab ko‘ring.')}${kartalar([['A', '2-nuqtada'], ['B', '3-nuqtada, yulduzda'], ['C', '4-nuqtada']])}</div><div class="oyna">${world('hovli')}${yol('p5', coddyQ('', 'oylaydi', 'son'), 4, 3)}<div class="gl dq a-tl"><small>Dastur</small>${blk()}${blk()}${blk()}${blk()}</div></div>`,
    foot: () => fUstoz('Javob berdi: 13 / 14', '0:28 / 3 daq', 'Javobni ochish') },
  B5: { rol: 'b', b: 3, t: 't1', nom: 'Javob berish', izoh: 'Bola noutbukida faqat savol va uchta katta karta. Tanlashning o‘zi — harakat: tugma yo‘q. Tanlagach, karta belgilanadi va «katta ekranga qarang» chiqadi.',
    body: () => `<div class="chap">${matn('Test · 1/3', 'Coddy <em>qayerda</em> to‘xtaydi?', 'Javobingiz qabul qilindi. Katta ekranga qarang!')}<div class="oyna mini">${world('hovli')}${yol('p5', coddyQ('', 'oylaydi', 'son'), 4, 3)}<div class="gl dq a-tl">${blk()}${blk()}${blk()}${blk()}</div></div></div>${kartalar([['A', '2-nuqtada'], ['B', '3-nuqtada, yulduzda', '<span class="belgi">✓ Sizning javobingiz</span>', 'tanlandi'], ['C', '4-nuqtada']], 'katta-k')}`,
    foot: () => fJim('Hamma javob berguncha kutamiz · 13 / 14') },
  P6: { rol: 'p', b: 3, t: 't1', nom: 'Test natijasi', izoh: 'Javob ochilganda Coddy dasturni bajaradi va 4-nuqtada to‘xtaydi. Har javob yonida nechta bola tanlagani. Ismlar yo‘q — hech kim uyalmaydi.',
    body: () => `<div class="chap">${matn('Test · 1/3', 'Coddy <em>4‑nuqtada</em> to‘xtadi.', 'Men yulduzni ko‘rmayman — bloklarni sanayman!', '', 'koz')}${kartalar([['A', '2-nuqtada', bar(2, 15)], ['B', '3-nuqtada, yulduzda', bar(6, 46)], ['C', '4-nuqtada', bar(5, 38), 'togri']], 'natijali')}</div><div class="oyna">${world('hovli')}${yol('p5', coddyQ('at4', 'turadi', 'xursand'), 4, 3)}<div class="gl dq a-tl"><small>Dastur</small>${blk('bajarildi')}${blk('bajarildi')}${blk('bajarildi')}${blk('bajarildi')}</div></div>`,
    foot: () => fUstoz('Ustozga: «Coddy bloklarni sanaydi» deb tushuntiring', '1:40 / 3 daq', 'Keyingi savol ›') },
  P7: { rol: 'p', b: 4, t: 't1', nom: 'Xulosa', izoh: 'Bugun o‘rganilgan uchta so‘z, sinf natijasi va keyingi dars. Bayram qisqa va hech narsani yopmaydi.',
    body: () => `<div class="chap">${matn('Xulosa', 'Bugun siz <em>dastur</em> yozdingiz.', 'Uchala bekatdan o‘tdik. Keyingi darsda — labirint!', terminlar())}</div><div class="oyna">${world('hovli')}${qahramonlar()}${natija('gl a-tr')}</div>`,
    foot: () => fUstoz('Uchala bekatdan o‘tdik', '1:02 / 4 daq', 'Darsni yakunlash') },
}
const LAHZA = [
  ['1', 'Savol', 'Dars savol bilan ochiladi va reja ko‘rsatiladi.', ['P1', 'P2']],
  ['2', 'Yangi so‘z', 'Ustoz tushuntiradi — bola katta ekranga qaraydi.', ['P3', 'B1']],
  ['3', 'Mashq', 'Bolalar o‘zi ishlaydi: studiya, xato, muvaffaqiyat. Katta ekranda — sinf doskasi.', ['B2', 'P4', 'B3', 'B4']],
  ['4', 'Test', 'Savol, bolaning javobi va natija.', ['P5', 'B5', 'P6']],
  ['5', 'Xulosa', 'O‘rganilgan so‘zlar va keyingi dars.', ['P7']],
]
const ekran = (id) => { const e = E[id]; return `<figure class="${e.rol === 'p' ? 'pr' : 'bo'}"><div class="ekran hy ${e.t} e-${id}" role="img" aria-label="${id} ${e.nom}" tabindex="0">${bosh(e.b)}<main class="hm">${e.body()}</main>${e.foot()}</div><figcaption><span class="eid">${id}</span><b>${e.rol === 'p' ? 'Proyektor' : 'Bola noutbuki'} · ${e.nom}</b><span class="fiz">${e.izoh}</span></figcaption></figure>` }
const lahzalar = LAHZA.map(([n, nom, iz, ids]) => `<section class="lahza" aria-label="${nom}"><div class="l-bosh"><span class="l-n">${n}</span><div><h3>${nom}</h3><p>${iz}</p></div></div><div class="l-ekranlar">${ids.map(ekran).join('')}</div></section>`).join('\n')

let t = readFileSync(V + '/shablon4.html', 'utf8').replace('{{HARAKAT}}', HARAKAT).replace('{{MAKET}}', MAKET).replace('{{LAHZALAR}}', lahzalar)
t = t.replace(/<svg (class="(?:hero|robot|world))/g, '<svg xmlns="http://www.w3.org/2000/svg" $1')
if (/\{\{/.test(t)) { console.error('QOLDI', t.match(/\{\{[^}]*\}\}/g)); process.exit(1) }
writeFileSync(OUT, t); console.log('ok', (t.length / 1024).toFixed(0) + 'KB')
