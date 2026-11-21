// Etalon sahifasining yig'ilishi (dvigatel 1b, 19.11) — VAQTINCHA. etalon.html muzlatilgan (4A) va endi yozilmaydi;
// lekin demo uslubi (`t` dagi <style>) va SVG ichki raqamlari hali shu sahifa chizilishiga bog'liq. 2-bosqichda yig'uvchi bilan birga olib tashlanadi.
const LAHZA = [
  ['1', 'Kirish', 'Birinchi dars: bloklardan nima yasaymiz. Bola noutbukida — kirish va eng ko‘p chiqadigan «Katta ekranga qarang».', ['P1', 'B0', 'BK']],
  ['2', 'Savol: uch taxmin, uch sinov', 'Darsdagi yagona savol. Javoblar ochiladi, sinf birma-bir sinaydi — natija kartaning o‘zida.', ['P2', 'P2N', 'P2S', 'BY', 'P2B', 'P2K', 'P2C']],
  ['3', 'Dasturlash nima?', 'Dasturchi yozadi, biz bloklarni ulaymiz.', ['P3']],
  ['4', 'Reja va qahramon', 'Bugun nima qilamiz — yo‘l xaritasi; har bola qahramon tanlaydi, katta ekranda sinf taxtasi.', ['P4', 'P4T', 'BQ']],
  ['5', 'Blok studiya', 'Ranglar (bola o‘zi bosadi), birinchi dastur, xato, muvaffaqiyat.', ['P5A', 'B1', 'B2', 'B3', 'B4']],
  ['6', 'Ko‘ramiz, keyin o‘zingiz', 'Ustoz ko‘rsatadi, bolalar pog‘onalarni o‘zi bajaradi, keyin xulosa: blok va dastur.', ['P6', 'B3X', 'B3Y', 'P5', 'B2P', 'B2Q', 'B2Y', 'P9']],
  ['7', 'O‘yin va 2-bekat: gapirtiramiz', '«Men robotman» o‘yini; xarita qaytadi; say bloki; ism va rang; bola qahramonini gapirtiradi.', ['P10', 'P4B', 'P7A', 'P7', 'P4I', 'B6', 'B7']],
  ['8', '3-bekat: o‘z sahnangiz', 'Ustozning sahnasi; bolalar joy tanlab o‘z sahnasini yasaydi; galereya.', ['P11', 'P12', 'B8A', 'B8', 'P13', 'B9']],
  ['9', 'Yakun', 'O‘sha xarita — yo‘l oxiri; bola noutbukida — o‘z ma’lumoti.', ['P8', 'P14', 'B5']],
]
const ekran = (id) => { const e = E[id]; return `<figure class="${e.rol === 'p' ? 'pr' : 'bo'}" data-id="${id}"><div class="ekran hy ${e.t} e-${id}" role="img" aria-label="${id} ${e.nom}" tabindex="0">${bosh(e.b)}<main class="hm">${e.body()}</main>${e.foot()}</div><figcaption><span class="eid">${id}</span><b>${e.rol === 'p' ? 'Proyektor' : 'Bola noutbuki'} · ${e.nom}${e.fid ? ` <span class="fid">${e.fid}</span>` : ''}</b><span class="fiz">${e.izoh}</span></figcaption>${e.ov === 0 ? '' : `<div class="ov" role="group" aria-label="${id} bo‘yicha javob"><button type="button" data-v="qabul">Qabul</button><button type="button" data-v="boshqa">Boshqa g‘oya</button><input type="text" placeholder="Izoh (ixtiyoriy)" aria-label="${id} izohi"></div>`}</figure>` }
const lahzalar = LAHZA.map(([n, nom, iz, ids, qosh = '']) => `<section class="lahza" aria-label="${nom}"><div class="l-bosh"><span class="l-n">${n}</span><div><h3>${nom}</h3><p>${iz}</p></div></div><div class="l-ekranlar">${ids.map(ekran).join('')}</div>${qosh}</section>`).join('\n')
const MOZ = `<div class="ekran hy t3 e-MZ namuna-st" role="img" aria-label="Mozaika bloklar">${bosh(1)}<main class="hm">${studiya({ tag: 'Yigma ko‘rinish', h: 'Bloklar <em>ulanadi</em>', iz: 'Sudrab olib boring — «chiq» etib ulanadi. Yoki bosing — oxiriga o‘zi ulanadi.', aktiv: 'h', prog: ['r', 'r', 'l'], yuz: momiqYuz(), sahna: yol('b2', momiqQ()) })}<div class="sudra">${yigma([['j', '', 'qol']])}</div></main>${fB({ hint: 'Qo‘yib yuboring — «chiq» etib ulanadi' })}</div>`

let t = readFileSync(V + '/shablon.html', 'utf8').replace('{{HARAKAT}}', HARAKAT).replace('{{MAKET}}', MAKET).replace('{{LAHZALAR}}', lahzalar).replace('{{MOZAIKA}}', MOZ)
t = t.replaceAll('"Source Serif 4",Georgia,serif', 'var(--f-sar)').replaceAll('"Source Serif 4",serif', 'var(--f-sar)').replaceAll('"Manrope",sans-serif', 'var(--f-matn)')
t = t.replaceAll('<div class="chap">', '<div class="chap" data-z="matn">').replace(/<div class="oyna([^"]*)">/g, '<div class="oyna$1" data-z="sahna">').replace(/<div class="gl pan">/g, '<div class="gl pan" data-z="sarlavha paneli">')
t = t.replace(/<svg (class="(?:hero|robot|world))/g, '<svg xmlns="http://www.w3.org/2000/svg" $1')
if (/\{\{/.test(t)) { console.error('QOLDI', t.match(/\{\{[^}]*\}\}/g)); process.exit(1) }
// writeFileSync(OUT, t) — 19.11 dan yo'q: etalon.html muzlatilgan (4A). Demo faqat `t` dagi uslubni oladi (sahifa.mjs: USLUB, SHRIFT).
