
// ===== Tepalik — reja ekrani rasmlari (16.11, boshliq tanlagan ko'rinish) =====
// bosh.mjs + ekranlar.mjs dan keyin ulanadi: node new-junior/etalon/tepalik-yig.mjs → new-junior/arxiv/tepalik-rasmlar-2026-11-16.html
const ekranT = (id, body, foot, extra = '') => `<div class="ekran hy ${E[id].t} e-${id}" role="img" aria-label="${E[id].nom}">${bosh(E[id].b)}<main class="hm">${body}</main>${foot}${extra}</div>`
const DARSDA = [
  ['P4', 'Reja', 'Dars boshida: Coddy startda, uch bekat tepalikka ko‘tariladi, navbatdagi bekat miltillaydi. Cho‘qqida — dars oxirida nima bo‘lishi.'],
  ['P4B', '2-bekat boshi', 'Birinchi bekat o‘tildi: ✓ belgisi, yoyi oltin. Coddy birinchi pog‘onada.'],
  ['P8', 'Yakun', 'Hamma bekat ✓, Coddy cho‘qqida quvonadi; yo‘l keyingi darsga — Labirintga olib boradi.'],
]
const OBH = [['quyosh', 'Quyoshli', '+18°'], ['bulut', 'Bulutli', '+12°'], ['yomgir', 'Yomg‘irli', '+9°'], ['qor', 'Qorli', '−2°']]
const TOMCHI_T = Array.from({ length: 34 }, (_, i) => `<i style="left:${(i * 29 + 7) % 100}%;top:${(i * 47) % 70 - 10}%;--d:${((i * 0.137) % 0.9).toFixed(2)}s"></i>`).join('')
const obBody = (k) => {
  let b = E.P4.body()
  if (k === 'qor') b = b.replace(/<svg[^>]*class="world"[\s\S]*?<\/svg>/, world('qor'))
  return b.replace(/(<svg[^>]*class="world"[\s\S]*?<\/svg>)/, '$1<div class="ob ob-' + k + '" aria-hidden="true">' + (k === 'yomgir' ? TOMCHI_T : '') + '</div>')
}
const kadr = (n, nom, izoh, ekran) => `<figure class="tr-f"><button type="button" class="tr-kadr" aria-label="${nom} — to‘liq ekranda ochish">${ekran}</button><figcaption><span class="tr-n">${n}</span><b>${nom}</b><span>${izoh}</span></figcaption></figure>`
const TR_CSS = `
/* Sahifa: tepalik rasmlari — bitta ustun, har ekran to'liq kenglikda; bosilsa to'liq ekranda ochiladi (rasmga olish uchun) */
:root{--tr-bg:#F3F1EC;--tr-fg:#0D2137;--tr-muted:#5B6270;--tr-line:#E0DCD2;--tr-chip:#E8EEF7;--tr-accent:#E2431F}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--tr-bg:#0F1724;--tr-fg:#EEF1F6;--tr-muted:#A3ACBA;--tr-line:#253244;--tr-chip:#1C2A3F;--tr-accent:#FF7A59;color-scheme:dark}}
:root[data-theme="dark"]{--tr-bg:#0F1724;--tr-fg:#EEF1F6;--tr-muted:#A3ACBA;--tr-line:#253244;--tr-chip:#1C2A3F;--tr-accent:#FF7A59;color-scheme:dark}
html,body{background:var(--tr-bg)!important;color:var(--tr-fg)}
.tr-sahifa{max-width:1180px;margin:0 auto;padding-block:28px 64px;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));font-family:var(--f-matn);display:flex;flex-direction:column;gap:36px}
.tr-bosh{display:flex;flex-direction:column;gap:10px;max-width:68ch}
.tr-bosh small{font:700 12px/1 var(--f-kod);letter-spacing:.08em;text-transform:uppercase;color:var(--tr-muted)}
.tr-bosh h1{margin:0;font:700 clamp(26px,4vw,40px)/1.1 var(--f-sar);color:var(--tr-fg);text-wrap:balance}
.tr-bosh h1 em{font-style:normal;color:var(--tr-accent)}
.tr-bosh p{margin:0;font-size:16px;line-height:1.55;color:var(--tr-muted)}
.tr-bolim{display:flex;flex-direction:column;gap:22px}
.tr-bolim > h2{margin:0;font:700 22px/1.2 var(--f-sar);color:var(--tr-fg)}
.tr-f{margin:0;display:flex;flex-direction:column;gap:10px}
.tr-kadr{all:unset;display:block;cursor:zoom-in;border-radius:12px}
.tr-kadr:focus-visible{outline:3px solid #3FA2FF;outline-offset:4px}
.tr-kadr .ekran{max-width:100%;box-shadow:0 18px 44px -24px rgba(13,33,55,.55);border-color:var(--tr-line)}
.tr-f figcaption{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap}
.tr-n{font:700 12px/1 var(--f-kod);padding:5px 8px;border-radius:999px;background:var(--tr-chip);color:var(--tr-muted)}
.tr-f figcaption b{font:700 18px/1.2 var(--f-sar);color:var(--tr-fg)}
.tr-f figcaption span:last-child{flex-basis:100%;font-size:15px;line-height:1.5;color:var(--tr-muted)}
.tr-kadr:fullscreen{display:grid;place-items:center;background:#0B1220;cursor:zoom-out;border-radius:0}
.tr-kadr:fullscreen .ekran{width:min(100vw,calc(100vh * 16 / 9));border:0;border-radius:0;box-shadow:none}
/* ob-havo qatlamlari */
.ekran .hb{position:relative}
.ob-pill{position:absolute;right:3cqw;top:50%;transform:translateY(-50%);font:700 1.1cqw/1 var(--f-kod);letter-spacing:.04em;color:#0D2137;background:#fff;border:.1cqw solid #E4E0D6;border-radius:999px;padding:.45cqw .9cqw}
.ob{position:absolute;inset:0;z-index:1;pointer-events:none}
.ob-quyosh{background:radial-gradient(40% 50% at 92% 4%,rgba(255,214,90,.35),transparent 70%)}
.ob-bulut{background:radial-gradient(22% 14% at 18% 16%,rgba(255,255,255,.9),transparent 70%),radial-gradient(26% 16% at 52% 10%,rgba(240,244,250,.95),transparent 70%),radial-gradient(30% 18% at 86% 12%,rgba(236,240,247,.98),transparent 70%),linear-gradient(180deg,rgba(124,140,162,.55),rgba(124,140,162,.18) 55%,rgba(60,70,90,.08))}
.ob-yomgir{overflow:hidden;background:linear-gradient(180deg,rgba(70,86,112,.55),rgba(70,86,112,.25) 60%,rgba(40,50,70,.12))}
.ob-yomgir i{position:absolute;width:.18cqw;height:1.5cqw;border-radius:.2cqw;background:linear-gradient(rgba(225,236,252,0),rgba(225,236,252,.9));transform:rotate(12deg);animation:tomchi .9s linear var(--d) infinite}
@keyframes tomchi{from{translate:0 0}to{translate:-4cqw 30cqw}}
.ob-qor{background:radial-gradient(circle,#fff 0 .22cqw,transparent .26cqw) 0 0/4.2cqw 4.6cqw,radial-gradient(circle,rgba(255,255,255,.85) 0 .16cqw,transparent .2cqw) 1.8cqw 2.2cqw/3.1cqw 3.4cqw;animation:qor 7s linear infinite}
@keyframes qor{to{background-position:1.4cqw 18.4cqw,.2cqw 15.8cqw}}
@media (prefers-reduced-motion:reduce){.ob-yomgir i,.ob-qor{animation:none}}
.oyna:has(.ob-qor) .tp-iz path:not(.otdi){stroke:#7F9CC4}
`
const sahifaT = `<title>Tepalik reja rasmlari</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
${t.match(/<link rel="stylesheet" href="https:\/\/fonts[^>]+>/)[0]}
${t.slice(t.indexOf('<style>'), t.indexOf('</style>') + 8)}
<style>${TR_CSS}</style>
<main class="tr-sahifa">
  <header class="tr-bosh"><small>1-dars · Tanishuv · ustoz ekrani</small><h1>Tepalik — <em>reja ekrani</em></h1>
  <p>Boshliq tanlagan ko‘rinish: yo‘l pastdan yuqoriga ko‘tariladi, cho‘qqida — dars oxiridagi natija. Rasmni bosing — to‘liq ekranda ochiladi; yana bossangiz yoki Esc — qaytadi.</p></header>
  <section class="tr-bolim" aria-label="Darsda"><h2>Darsda — uch holat</h2>
  ${DARSDA.map(([id, nom, iz], i) => kadr(i + 1, nom, iz, ekranT(id, E[id].body(), E[id].foot()))).join('\n  ')}</section>
  <section class="tr-bolim" aria-label="Ob-havo bilan"><h2>Ob-havo bilan — to‘rt holat</h2>
  ${OBH.map(([k, nom, gr], i) => kadr(i + 4, 'Reja · ' + nom, 'Toshkentdagi ob-havoga qarab sahna o‘zi moslashadi (taklif).', ekranT('P4', obBody(k), E.P4.foot()).replace('</header>', `<span class="ob-pill">Toshkent · ${gr} · ${nom.toLowerCase()}</span></header>`))).join('\n  ')}</section>
</main>
<script>
document.querySelectorAll('.tr-kadr').forEach((k) => k.addEventListener('click', () => {
  try {
    if (document.fullscreenElement) { document.exitFullscreen() } else if (k.requestFullscreen) { const p = k.requestFullscreen(); if (p && p.catch) p.catch(() => {}) }
  } catch (e) {}
}))
</script>`
const CHIQ_T = V + '/../arxiv/tepalik-rasmlar-2026-11-16.html'
writeFileSync(CHIQ_T, sahifaT)
console.log('tepalik ok', (sahifaT.length / 1024).toFixed(0) + 'KB →', CHIQ_T)
