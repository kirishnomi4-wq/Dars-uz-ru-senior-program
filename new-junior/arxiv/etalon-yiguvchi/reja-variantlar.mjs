
// ===== Reja ekrani — to'rt ko'rinish (16.11, boshliqqa ko'rsatish uchun) =====
// bosh.mjs + ekranlar.mjs dan keyin ulanadi: node new-junior/etalon/reja-yig.mjs → new-junior/arxiv/reja-variantlar-2026-11-16.html
const ekranR = (cls, body) => `<div class="ekran hy t2 ${cls}" role="img">${bosh(0)}<main class="hm">${body}</main>${fU('', 'Boshladik ›')}</div>`
const sarlavha = () => `<div class="gl pan rv-pan">${matn('Bugungi reja', 'Bugun nima <em>o‘rganamiz</em>?', '')}</div>`
const chip = (f, t) => `<span class="rv-chip f-${f}">${t}</span>`
const pufakR = (t, cls = '') => `<span class="rv-puf ${cls}">${t}</span>`

// B — uch karta: har bekatda bola nima qilishi rasmda
const kartaB = (n, f, nom, sahna, chiplar) => `<div class="gl rv-kb rv-${f}"><div class="kr-r rv-kb-r">${sahna}</div><div class="rv-kb-t"><span class="rv-n">${n}</span><b>${nom}</b></div><div class="rv-chips">${chiplar}</div></div>`
const varB = () => `<div class="oyna to">${world('hovli')}${sarlavha()}<div class="rv-kartalar">
${kartaB(1, 'h', 'Harakatlantirish', `${world('hovli', true)}<span class="rv-iz"></span><span class="rv-mq rv-mq1">${hero({ k: 'momiq', mood: 'xursand', lite: true })}</span><span class="rv-st0">${YUL}</span>`, chip('h', 'move right') + chip('h', 'jump'))}
${kartaB(2, 'g', 'Gapirtirish', `${world('hovli', true)}<span class="rv-mq rv-mq2">${hero({ k: 'momiq', mood: 'xursand', lite: true })}</span>${pufakR('Salom!', 'rv-b2')}`, chip('g', 'say'))}
${kartaB(3, 'y', 'Sahna yaratish', `${world('kosmos', true)}<span class="rv-mq rv-mq3">${hero({ k: 'yulduz', mood: 'xursand', lite: true })}</span>${pufakR('Bu — mening sahnam!', 'rv-b3')}`, chip('y', 'dars oxirida'))}
</div><div class="rv-coddy rv-cb">${robot({ pose: 'korsatadi', yuz: 'xursand' })}</div></div>`

// C — tepalik: yo'l pastdan yuqoriga ko'tariladi, cho'qqida — dars oxiridagi natija
const bekatC = (n, f, nom, ik, l, b) => `<div class="rv-sc rv-${f}" style="left:${l}%;bottom:${b}%"><i>${ik}</i><span class="rv-pl"></span><b><em>${n}</em>${nom}</b></div>`
const varC = () => `<div class="oyna to">${world('hovli')}${sarlavha()}${darsOxiri()}
<svg class="rv-izc" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M13 90 Q20 72 28 84 M32 82 Q40 58 48 70 M52 66 Q60 44 68 56 M72 52 Q78 40 82 46"/></svg>
${bekatC(1, 'h', 'Harakatlantirish', IKON.r, 30, 8)}${bekatC(2, 'g', 'Gapirtirish', IKON.s, 50, 22)}${bekatC(3, 'y', 'Sahna yaratish', YULDUZ_OQ, 70, 36)}
<div class="rv-coddy rv-cc">${robot({ pose: 'salom', yuz: 'xursand' })}</div></div>`

// D — kosmos sayohati: uch sayyora — uch bekat; oxirgisida yulduz o'z sahnasida
const sayyora = (n, f, nom, ik, l, t, s) => `<div class="rv-sy rv-${f}" style="left:${l}%;top:${t}%;--s:${s}cqw"><span class="rv-sy-p"><i>${ik}</i></span><b><em>${n}</em>${nom}</b></div>`
const yulduzlarD = Array.from({ length: 46 }, (_, i) => `<i style="left:${(i * 37 + 11) % 100}%;top:${(i * 53 + 7) % 92}%;--o:${0.35 + (i % 5) * 0.13}"></i>`).join('')
const varD = () => `<div class="oyna to rv-kos">${world('kosmos')}${sarlavha()}
<svg class="rv-izd" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M15 66 C18 54 21 55 23.5 57 M32 53 C35 40 37 38 40 40 M50 36 C52 24 54 22 55.5 24"/></svg>
${sayyora(1, 'h', 'Harakatlantirish', IKON.r, 28, 48, 9)}${sayyora(2, 'g', 'Gapirtirish', IKON.s, 45, 30, 9.5)}${sayyora(3, 'y', 'Sahna yaratish', YULDUZ_OQ, 61, 13, 10.5)}
<span class="rv-yq">${hero({ k: 'yulduz', mood: 'xursand', lite: true })}</span>${pufakR('Bu — mening sahnam!', 'rv-bd')}
<div class="rv-coddy rv-cd">${robot({ pose: 'korsatadi', yuz: 'xursand' })}</div></div>`

const VAR = [
  ['A', 'Yo‘l', 'Hozirgi', 'Hovlidagi yo‘l: Coddy startda, uch bekat orasida sakrash yoylari, o‘ngda — dars oxirida nima bo‘lishi. Xarita har bekat boshida qaytadi, o‘tilgani oltinga bo‘yaladi.', 'Darsning boshidan oxirigacha bitta til: bola qayerda turganini doim ko‘radi.', `<div class="oyna to">${world('hovli')}<div class="gl pan">${matn('Bugungi reja', 'Bugun nima <em>o‘rganamiz</em>?', '')}</div>${darsOxiri()}${xarita({ otdi: 0, joy: 0 })}</div>`],
  ['B', 'Uch karta', 'Yangi', 'Har bekat — alohida karta: rasmda bola shu bekatda nima qilishi ko‘rinadi (qahramon yuradi · gapiradi · o‘z sahnasi) va qaysi bloklar bilan.', 'Eng tushunarli: 9 yoshli bola o‘qimasdan ham rasmdan biladi.', varB()],
  ['C', 'Tepalik', 'Yangi', 'Yo‘l pastdan yuqoriga ko‘tariladi: har bekat — bir pog‘ona baland, cho‘qqida — dars oxiridagi natija («Bu — mening sahnam!»).', 'O‘sish hissi: har bekat bolani maqsadga yaqinlashtiradi.', varC()],
  ['D', 'Kosmos sayohati', 'Yangi', 'Coddy Oyda turibdi, uch bekat — uch sayyora; oxirgi, eng katta sayyorada yulduz o‘z sahnasini ko‘rsatadi.', 'Eng «vau»: kosmos bolalarga yoqadi, sayohat — sarguzasht.', varD()],
]

// Ob-havo: sahna Toshkent ob-havosiga moslashadi (taklif) — o'sha «Bugungi reja» ekrani to'rt holatda
const OBHAVO = [['quyosh', 'Quyoshli', '+18°'], ['bulut', 'Bulutli', '+12°'], ['yomgir', 'Yomg‘irli', '+9°'], ['qor', 'Qorli', '−2°']]
const dunyoAlmash = (html, yangi) => html.replace(/<svg[^>]*class="world"[\s\S]*?<\/svg>/, yangi)
const TOMCHI = Array.from({ length: 34 }, (_, i) => `<i style="left:${(i * 29 + 7) % 100}%;top:${(i * 47) % 70 - 10}%;--d:${((i * 0.137) % 0.9).toFixed(2)}s"></i>`).join('')
const obEkran = ([k, nom, gr]) => { let b = E.P4.body(); if (k === 'qor') b = dunyoAlmash(b, world('qor')); b = b.replace(/(<svg[^>]*class="world"[\s\S]*?<\/svg>)/, '$1<div class="ob ob-' + k + '" aria-hidden="true">' + (k === 'yomgir' ? TOMCHI : '') + '</div>'); return `<div class="ob-e" data-ob="${k}"${k === 'qor' ? '' : ' hidden'}>${ekranR('e-RVO', b).replace('</header>', `<span class="ob-pill">Toshkent · ${gr} · ${nom.toLowerCase()}</span></header>`)}</div>` }
const obBolim = () => `<section class="rv-f rv-ob" aria-label="Ob-havo"><div class="ob-ekranlar">${OBHAVO.map(obEkran).join('')}</div>
<div class="ob-tugmalar" role="group" aria-label="Ob-havoni tanlang">${OBHAVO.map(([k, nom]) => `<button type="button" data-ob="${k}" aria-pressed="${k === 'qor'}">${nom}</button>`).join('')}</div>
<div class="rv-izoh"><span class="rv-harf">☁</span><h2>Sahna Toshkent ob-havosiga moslashadi<span>Taklif</span></h2><p>Dars ochilganda Toshkentdagi ob-havo olinadi va sahna o‘zi moslashadi: qor yog‘sa — hovli qorli, yomg‘ir yog‘sa — yomg‘ir, quyosh bo‘lsa — quyoshli. Bola derazadan ko‘rgan narsani ekranda ham ko‘radi.</p><p><b>Bu sahifada</b> — namuna: tugmalar bilan almashtiring. Darsda o‘zi ishlaydi; internet bo‘lmasa — quyoshli hovli.</p></div></section>`
const RV_CSS = `
/* Sahifa: Reja ekrani to'rt ko'rinishi — bitta ustun, har variant to'liq ekran kengligida, ostida qisqa izoh */
:root{--rv-bg:#F3F1EC;--rv-fg:#0D2137;--rv-muted:#5B6270;--rv-line:#E0DCD2;--rv-card:#FFFFFF;--rv-accent:#E2431F;--rv-chip:#EEF3FA}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--rv-bg:#0F1724;--rv-fg:#EEF1F6;--rv-muted:#A3ACBA;--rv-line:#253244;--rv-card:#152031;--rv-accent:#FF7A59;--rv-chip:#1C2A3F;color-scheme:dark}}
:root[data-theme="dark"]{--rv-bg:#0F1724;--rv-fg:#EEF1F6;--rv-muted:#A3ACBA;--rv-line:#253244;--rv-card:#152031;--rv-accent:#FF7A59;--rv-chip:#1C2A3F;color-scheme:dark}
html,body{background:var(--rv-bg)!important;color:var(--rv-fg)}
.rv-sahifa{max-width:1180px;margin:0 auto;padding-block:28px 64px;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));font-family:var(--f-matn);display:flex;flex-direction:column;gap:40px}
.rv-bosh{display:flex;flex-direction:column;gap:10px;max-width:68ch}
.rv-bosh small{font:700 12px/1 var(--f-kod);letter-spacing:.08em;text-transform:uppercase;color:var(--rv-muted)}
.rv-bosh h1{margin:0;font:700 clamp(26px,4vw,40px)/1.1 var(--f-sar);color:var(--rv-fg);text-wrap:balance}
.rv-bosh h1 em{font-style:normal;color:var(--rv-accent)}
.rv-bosh p{margin:0;font-size:16px;line-height:1.55;color:var(--rv-muted)}
.rv-f{margin:0;display:flex;flex-direction:column;gap:14px}
.rv-f .ekran{max-width:100%;box-shadow:0 18px 44px -24px rgba(13,33,55,.55);border-color:var(--rv-line)}
.rv-f figcaption{display:grid;grid-template-columns:auto minmax(0,1fr);gap:4px 14px;align-items:start}
.rv-harf{grid-row:span 3;width:44px;height:44px;border-radius:12px;display:grid;place-items:center;font:800 22px/1 var(--f-sar);background:var(--rv-fg);color:var(--rv-bg)}
.rv-f h2{margin:0;font:700 22px/1.2 var(--f-sar);color:var(--rv-fg);display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.rv-f h2 span{font:700 11px/1 var(--f-kod);letter-spacing:.08em;text-transform:uppercase;padding:5px 8px;border-radius:999px;background:var(--rv-chip);color:var(--rv-muted)}
.rv-f p{margin:0;font-size:15px;line-height:1.5;color:var(--rv-muted);max-width:75ch}
.rv-f p b{color:var(--rv-fg)}
.rv-ob{gap:14px}
.ob-tugmalar{display:flex;flex-wrap:wrap;gap:8px}
.ob-tugmalar button{font:600 15px/1 var(--f-matn);padding:10px 16px;border-radius:999px;border:1px solid var(--rv-line);background:var(--rv-card);color:var(--rv-fg);cursor:pointer}
.ob-tugmalar button[aria-pressed="true"]{background:var(--rv-fg);color:var(--rv-bg);border-color:var(--rv-fg)}
.ob-tugmalar button:focus-visible{outline:3px solid #3FA2FF;outline-offset:2px}
.rv-izoh{display:grid;grid-template-columns:auto minmax(0,1fr);gap:4px 14px;align-items:start}
.ob-pill{position:absolute;right:3cqw;top:50%;transform:translateY(-50%);font:700 1.1cqw/1 var(--f-kod);letter-spacing:.04em;color:#0D2137;background:#fff;border:.1cqw solid #E4E0D6;border-radius:999px;padding:.45cqw .9cqw}
.ekran .hb{position:relative}
.e-RVO .pan{width:auto;max-width:62%}.e-RVO .sar{white-space:nowrap}
.ob{position:absolute;inset:0;z-index:1;pointer-events:none}
.ob-quyosh{background:radial-gradient(40% 50% at 92% 4%,rgba(255,214,90,.35),transparent 70%)}
.ob-bulut{background:radial-gradient(22% 14% at 18% 16%,rgba(255,255,255,.9),transparent 70%),radial-gradient(26% 16% at 52% 10%,rgba(240,244,250,.95),transparent 70%),radial-gradient(30% 18% at 86% 12%,rgba(236,240,247,.98),transparent 70%),linear-gradient(180deg,rgba(124,140,162,.55),rgba(124,140,162,.18) 55%,rgba(60,70,90,.08))}
.ob-yomgir{overflow:hidden;background:linear-gradient(180deg,rgba(70,86,112,.55),rgba(70,86,112,.25) 60%,rgba(40,50,70,.12))}
.ob-yomgir i{position:absolute;width:.18cqw;height:1.5cqw;border-radius:.2cqw;background:linear-gradient(rgba(225,236,252,0),rgba(225,236,252,.9));transform:rotate(12deg);animation:tomchi .9s linear var(--d) infinite}
@keyframes tomchi{from{translate:0 0}to{translate:-4cqw 30cqw}}
.ob-qor{background:radial-gradient(circle,#fff 0 .22cqw,transparent .26cqw) 0 0/4.2cqw 4.6cqw,radial-gradient(circle,rgba(255,255,255,.85) 0 .16cqw,transparent .2cqw) 1.8cqw 2.2cqw/3.1cqw 3.4cqw;animation:qor 7s linear infinite}
@keyframes qor{to{background-position:1.4cqw 18.4cqw,.2cqw 15.8cqw}}
@media (prefers-reduced-motion:reduce){.ob-yomgir i,.ob-qor{animation:none}}
/* --- ekran ichidagi variant uslublari (cqw — ekran kengligiga nisbatan) --- */
.rv-pan{left:1.6cqw;top:1.6cqw;width:auto;max-width:52%;padding:1.6cqw 2.2cqw}
.rv-pan .sar{white-space:nowrap}
.rv-coddy{position:absolute;z-index:4}.rv-coddy svg{width:100%;display:block}
/* B */
.rv-kartalar{position:absolute;z-index:3;left:17%;right:1.6cqw;top:35%;bottom:5%;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1.4cqw}
.rv-kb{position:relative;display:flex;flex-direction:column;gap:.8cqw;padding:1cqw;border-radius:1.4cqw}
.rv-kb-r{flex:1;height:auto!important;min-height:0}
.rv-kb-t{display:flex;align-items:center;gap:.8cqw}.rv-kb-t b{font:700 1.8cqw/1.1 var(--f-sar);color:#0D2137;white-space:nowrap}
.rv-n{width:2.6cqw;height:2.6cqw;border-radius:50%;display:grid;place-items:center;font:800 1.3cqw/1 var(--f-kod);color:#fff;background:var(--c)}
.rv-h{--c:#2F8FF0}.rv-g{--c:#8B5CF6}.rv-y{--c:#F5B82E}
.rv-chips{display:flex;gap:.5cqw;flex-wrap:wrap}
.rv-chip{font:700 1.05cqw/1 var(--f-kod);color:#fff;padding:.45cqw .7cqw;border-radius:.45cqw;background:#2F8FF0}.rv-chip.f-g{background:#8B5CF6}.rv-chip.f-y{background:#E8A90C}
.rv-mq{position:absolute;z-index:2;bottom:8%}.rv-mq svg{height:100%;width:auto;display:block}
.rv-mq1{left:12%;height:44%}.rv-mq2{left:36%;height:46%}.rv-mq3{left:36%;height:50%}
.rv-iz{position:absolute;left:26%;right:24%;bottom:20%;border-bottom:.25cqw dashed rgba(255,255,255,.95)}
.rv-st0{position:absolute;right:10%;bottom:12%;width:22%}.rv-st0 svg{width:100%}
.rv-puf{position:absolute;z-index:3;font:700 1.15cqw/1.1 var(--f-matn);color:#0D2137;background:#fff;border-radius:1cqw;padding:.55cqw .8cqw;white-space:nowrap;box-shadow:0 .3cqw .8cqw rgba(13,33,55,.2)}
.rv-puf.rv-b2{left:50%;top:14%}.rv-puf.rv-b3{left:6%;top:8%}
.rv-cb{left:1.5%;bottom:3%;width:14%}
/* C */
.rv-izc{position:absolute;inset:0;width:100%;height:100%;z-index:2;overflow:visible}
.rv-izc path,.rv-izd path{fill:none;stroke:#fff;stroke-width:3;stroke-dasharray:2 7;stroke-linecap:round;vector-effect:non-scaling-stroke}
.rv-sc{position:absolute;z-index:3;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center}
.rv-sc i{width:5cqw;height:5cqw;border-radius:50%;background:var(--c);display:grid;place-items:center;box-shadow:0 0 0 .3cqw #fff,0 .5cqw 1cqw rgba(13,33,55,.3);position:relative;z-index:2;margin-bottom:-1.2cqw}
.rv-sc i svg,.rv-sy-p i svg{width:55%;height:55%}
.rv-pl{width:9cqw;height:2.6cqw;border-radius:50%;background:radial-gradient(ellipse at 50% 35%,#fff,#F3EEE2 70%);box-shadow:inset 0 -.35cqw 0 var(--c),0 .5cqw .8cqw rgba(13,33,55,.22)}
.rv-sc b,.rv-sy b{margin-top:.8cqw;display:flex;align-items:center;gap:.55cqw;white-space:nowrap;font:700 1.45cqw/1 var(--f-matn);color:#0D2137;background:#fff;border-radius:999px;padding:.4cqw 1.1cqw .4cqw .4cqw;box-shadow:0 .3cqw .8cqw rgba(13,33,55,.18)}
.rv-sc b em,.rv-sy b em{font-style:normal;width:1.9cqw;height:1.9cqw;border-radius:50%;display:grid;place-items:center;background:var(--c);color:#fff;font:800 1.05cqw/1 var(--f-kod)}
.rv-cc{left:3%;bottom:4%;width:13%}
/* D */
.rv-kos{background:#2B1E6E}
.rv-yl i{position:absolute;width:.32cqw;height:.32cqw;border-radius:50%;background:#fff;opacity:var(--o)}
.rv-izd{position:absolute;inset:0;width:100%;height:100%;z-index:2}
.rv-sy{position:absolute;z-index:3;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center}
.rv-sy-p{width:var(--s);height:var(--s);border-radius:50%;display:grid;place-items:center;position:relative;background:radial-gradient(circle at 32% 28%,rgba(255,255,255,.55),transparent 32%),radial-gradient(circle at 50% 50%,var(--c) 55%,color-mix(in srgb,var(--c),#000 35%));box-shadow:0 0 2.4cqw color-mix(in srgb,var(--c),transparent 45%)}
.rv-sy-p i{width:42%;height:42%;border-radius:50%;display:grid;place-items:center;background:rgba(255,255,255,.22)}
.rv-y .rv-sy-p::after{content:"";position:absolute;left:-18%;right:-18%;top:42%;height:16%;border:.35cqw solid rgba(255,230,160,.85);border-radius:50%;transform:rotate(-14deg)}
.rv-yq{position:absolute;z-index:4;left:58%;top:1%;width:5.6cqw}.rv-yq svg{width:100%;display:block}
.rv-puf.rv-bd{left:66%;top:4%}
.rv-oy{position:absolute;z-index:2;left:-6%;bottom:-30%;width:30%;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle at 55% 25%,#E9E5FA,#B9B0E2 60%,#8E84C8);box-shadow:0 0 2.4cqw rgba(201,193,236,.35)}
.rv-oy::before{content:"";position:absolute;left:62%;top:14%;width:9%;height:6%;border-radius:50%;background:rgba(110,100,170,.28);box-shadow:-6cqw 1.2cqw 0 0 rgba(110,100,170,.22)}
.rv-cd{left:6%;bottom:4%;width:12%}
.rv-kos .rv-pan{background:rgba(255,255,255,.86)}
`
const sahifa = `<title>Bugungi reja ko‘rinishlari</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
${t.match(/<link rel="stylesheet" href="https:\/\/fonts[^>]+>/)[0]}
${t.slice(t.indexOf('<style>'), t.indexOf('</style>') + 8)}
<style>${RV_CSS}</style>
<main class="rv-sahifa">
  <header class="rv-bosh"><small>1-dars · Tanishuv · ustoz ekrani (proyektor)</small><h1>Bugungi reja — <em>to‘rt ko‘rinish</em></h1>
  <p>Mazmun hammasida bir xil: uch bekat (harakatlantirish, gapirtirish, sahna yaratish) va dars oxirida bolaning o‘z sahnasi. Farqi — reja bolaga qanday ko‘rinishida.</p></header>
  ${obBolim()}
  ${VAR.map(([h, nom, belgi, izoh, kuch, body]) => `<figure class="rv-f">${ekranR('e-RV' + h, body)}<figcaption><span class="rv-harf">${h}</span><h2>${nom}<span>${belgi}</span></h2><p>${izoh}</p><p><b>Kuchli tomoni:</b> ${kuch}</p></figcaption></figure>`).join('\n  ')}
</main>
<script>
document.querySelectorAll('.ob-tugmalar button').forEach((b) => b.addEventListener('click', () => {
  const k = b.dataset.ob
  document.querySelectorAll('.ob-e').forEach((e) => { e.hidden = e.dataset.ob !== k })
  document.querySelectorAll('.ob-tugmalar button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)))
}))
</script>`
const CHIQ = V + '/../arxiv/reja-variantlar-2026-11-16.html'
writeFileSync(CHIQ, sahifa)
console.log('reja ok', (sahifa.length / 1024).toFixed(0) + 'KB →', CHIQ)
