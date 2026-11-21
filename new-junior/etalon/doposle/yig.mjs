// «Do/posle» sahifasi: har sahna uchun eski darsning haqiqiy ekrani (v9 kodi, sinov/suratlar.mjs suratlari) ↔ yangi etalon ekranlari.
// Ishlatish (loyiha ildizidan, lokal server shart emas — eski suratlar oldindan olingan bo'lishi kerak):
//   node new-junior/sinov/suratlar.mjs "http://localhost:5340/?rol=yonma#/dars/1" /tmp/v9-surat   (server yoqilgan holda, bir marta)
//   node new-junior/etalon/yig.mjs && node new-junior/etalon/doposle/yig.mjs /tmp/v9-surat [/tmp/blockly-olchov]
// Chiqish: new-junior/etalon/doposle/index.html + rasm/*.jpg (rasmlar sahifa bilan birga chiqariladi).
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
import { mkdirSync, writeFileSync, existsSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
const D = new URL('.', import.meta.url).pathname
const ETALON = new URL('../etalon.html', import.meta.url).pathname
const DO = process.argv[2]
if (!DO || !existsSync(DO)) { console.error('eski suratlar papkasini bering (sinov/suratlar.mjs chiqishi)'); process.exit(1) }
mkdirSync(D + 'rasm', { recursive: true })

// Holat: etalon ko'rigi bo'yicha (HOLAT.md, 16.11): qabul — v3.3 da qabul qilingan va o'zgarmagan; korik — v3.4 da o'zgargan; yangi — v4
const HOLAT = {
  qabul: ['P2N', 'P4', 'P4B', 'B1', 'B2', 'B3', 'B4', 'P6', 'P7', 'P8', 'B5'],
  korik: ['P1', 'P2', 'P2C', 'P3', 'P5'],
  yangi: ['B0', 'BK', 'P2S', 'BY', 'P4T', 'BQ', 'P9', 'P10', 'B6', 'B7', 'P11', 'P12', 'B8A', 'B8', 'P13', 'B9'],
}
const holat = (id) => HOLAT.qabul.includes(id) ? 'qabul' : HOLAT.korik.includes(id) ? 'korik' : 'yangi'
// Sahnalar (manba v10.4): eski suratlar (v9 da shu sahnaga to'g'ri keladigani) va yangi ekranlar
const SAHNA = [
  [1, 'Kirish', ['01-1-kirish', '02-1-kirdi'], ['P1', 'B0', 'BK'], ['Kursning birinchi darsi ekani va bloklardan nima yasalishi (labirint, olma terish, kosmik o‘yin) — v9 da yo‘q edi', 'Coddy bugun nima qilishimizni aytadi; «Keyin — …», «Bugun esa — …»']],
  [2, 'Savol: Coddy’ni qanday yurgizamiz?', ['03-2a-savol', '06-2c-baqirish', '11-2e-javob-1'], ['P2', 'P2N', 'P2S', 'BY', 'P2C'], ['Javob kartalari katta ekranda ham, rasmli; to‘g‘ri javob «buyruq beramiz» (v9: «yozamiz» — keyingi sahnaga zid)', '«Uch taxmin — uch sinov»: natija kartaning o‘zida (✕ qimirlamadi / ✓ ishladi)']],
  [3, 'Dasturlash nima?', [], ['P3'], ['Yangi sahna: dasturchi yozadi — biz bloklarni ulaymiz (blokli dasturlash)']],
  [4, 'Reja va qahramon', ['13-3a-reja', '16-3c-tanlov', '18-3c-sinf-toldi'], ['P4', 'P4T', 'BQ'], ['Reja — yo‘l xaritasi: bekatlar zonacha, rangi — oilasi; xarita har bekat boshida qaytadi', 'Sinf taxtasi: Coddy (Ustoz) + 14 o‘rin, ismsiz']],
  [5, 'Blok studiya: ranglar va birinchi dastur', ['19-4a-bloklar', '23-4b-kam', '24-4b-yetdi'], ['B1', 'B2', 'B3', 'B4'], ['Scratch tartibi: rang doirachalari → bloklar → dastur → sahna; bloklar inglizcha va mozaikadek ulanadi', 'Yo‘lda zonachalar va sakrash yoylari; muammocha pufagi — bitta gap']],
  [6, 'Ko‘ramiz: Coddy bloklarni sanaydi', ['26-5a-savol', '30-5d-kormaydi'], ['P6'], ['v9 dagi «Coddy qayerda to‘xtaydi?» testi olib tashlandi — ustoz ko‘rsatadi va tushuntiradi']],
  [7, 'O‘zingiz: yulduzga yetkazing', ['25-4b-doska', '32-6-pog1', '34-6-pog1-maslahat'], ['P5'], ['Sinf doskasi: pog‘onalar zinapoya — kichik rasm, bir qator topshiriq, nechta bola; vaqt yo‘q']],
  [8, 'Xulosa: blok va dastur', ['43-7a-blok', '44-7b-dastur'], ['P9'], ['Sarlavha bir qatorda; ta’riflar Coddy gapida; uchta blok birin-ketin yonadi']],
  [9, 'Harakatli o‘yin: «Men robotman»', ['45-8-oyin'], ['P10'], ['Bloklar inglizcha: move right · move left · jump; «run!», «fly!» — boshqa buyruq yo‘q']],
  [10, 'Ko‘ramiz: say bloki', ['46-9-xarita', '49-9b-savol', '51-9d-aytdi'], ['P4B', 'P7'], ['Xarita qaytadi: o‘tilgan yoy oltin, Coddy keyingi bekatda', '«de» o‘rniga say; v9 dagi test o‘rniga — ko‘rsatish («Yurmadi — faqat aytdi»)']],
  [11, 'Ism va rang', ['54-10-ism', '56-10-sinf-rangli'], ['B6'], ['Ism (12 harf, «Tasodifiy ism») va sakkiz rang; ism faqat bola noutbukida']],
  [12, 'O‘zingiz: gapirtiramiz', ['59-11-pog1', '60-11-yozmoqda', '65-11-doska'], ['B7'], ['say yozuvi tahrirlanmoqda: qalam, «13 / 30»; binafsha — Gap oilasi']],
  [13, 'Ko‘ramiz: ustozning sahnasi', ['69-12-kosmos-bosh', '70-12-gapiryapti'], ['P11'], ['Kosmosda Coddy: yangi jump bloki (u ham ko‘k — harakat)']],
  [14, 'O‘zingiz: o‘z sahnangiz', ['72-13-joy', '75-13-ozgap', '77-13-doska'], ['P12', 'B8A', 'B8'], ['Sinf doskasi: uch shart va uch joy (tanlaganlar soni, ismsiz)', 'Studiyada uch shart yashil ✓ oladi, «Sahna tayyor!»']],
  [15, 'Ko‘rsatish: galereya', ['78-14-galereya'], ['P13', 'B9'], ['Proyektorda bolaning ishi yo‘q; bola noutbukida sahnasi o‘zi o‘ynaydi']],
  [16, 'Yakun', ['79-15-xarita', '80-15a-sinf-bugun'], ['P8', 'B5'], ['O‘sha xarita — yo‘l oxiri, bugungi so‘zlar; sinf jami yo‘q — har bola o‘z ma’lumotini o‘z noutbukida ko‘radi']],
]
// 1) eski suratlar → JPEG (kenglik 1200)
const kerak = [...new Set(SAHNA.flatMap((s) => s[2]))]
execFileSync('python3', ['-I', '-c', `
import sys
from PIL import Image
src, dst = sys.argv[1], sys.argv[2]
for n in sys.argv[3:]:
    im = Image.open(f"{src}/{n}.png").convert("RGB")
    w = 1200; h = round(im.height * w / im.width)
    im.resize((w, h), Image.LANCZOS).save(f"{dst}/do-{n}.jpg", quality=74, optimize=True, progressive=True)
`, DO, D + 'rasm', ...kerak])
// 1b) Blockly sinovi suratlari (ixtiyoriy 2-argument: sinov/blockly/olchov.mjs chiqishi)
const BL = process.argv[3]
if (BL && existsSync(BL)) execFileSync('python3', ['-I', '-c', `
import sys
from PIL import Image
src, dst = sys.argv[1], sys.argv[2]
for a, b in (('3-sudrab', 'blockly-sudrab'), ('6-say', 'blockly-say')):
    im = Image.open(f"{src}/{a}.png").convert("RGB")
    w = 1100; h = round(im.height * w / im.width)
    im.resize((w, h), Image.LANCZOS).save(f"{dst}/{b}.jpg", quality=78, optimize=True, progressive=True)
`, BL, D + 'rasm'])
// 2) etalon ekranlari → JPEG (1,5×)
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' })
const p = await b.newPage({ viewport: { width: 1500, height: 1000 }, deviceScaleFactor: 1.5, reducedMotion: 'reduce' })
await p.goto('file://' + ETALON); await p.waitForTimeout(1500)
const nom = {}
for (const id of SAHNA.flatMap((s) => s[3])) {
  const e = await p.$(`figure[data-id="${id}"] .ekran`); if (!e) { console.error('ekran yo‘q:', id); process.exit(1) }
  nom[id] = await e.getAttribute('aria-label')
  await e.screenshot({ path: `${D}rasm/posle-${id}.jpg`, type: 'jpeg', quality: 78 })
}
await b.close()
// 3) sahifa
const BADGE = { qabul: ['Qabul', 'Siz qabul qilgansiz (v3.3)'], korik: ['Ko‘rikda', 'v3.4 da o‘zgardi — ko‘rib chiqing'], yangi: ['Yangi', 'v4, tunda chizildi — ko‘rib chiqing'] }
const sanoq = { qabul: 0, korik: 0, yangi: 0 }; SAHNA.forEach((s) => s[3].forEach((id) => sanoq[holat(id)]++))
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')
const sahnaHtml = SAHNA.map(([n, sar, dolar, posle, ozg]) => `
  <section class="sahna" id="s${n}" aria-labelledby="h${n}">
    <header class="s-bosh"><span class="s-n">${n}</span><div><h2 id="h${n}">${esc(sar)}</h2><ul class="ozg">${ozg.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div></header>
    <div class="juft">
      <div class="ust oldin"><p class="yorliq">Oldin · hozirgi kod (v9) — chapda proyektor, o‘ngda bola noutbuki</p>${dolar.length ? dolar.map((f) => `<img src="rasm/do-${f}.jpg" alt="Eski dars, ${n}-sahna: ${f.replace(/^\d+-/, '')}" loading="lazy" width="1200" height="384">`).join('') : '<p class="bosh">Bu sahna eski darsda yo‘q edi — yangi.</p>'}</div>
      <div class="ust keyin"><p class="yorliq">Keyin · etalon v4</p><div class="ekr">${posle.map((id) => `<figure><img src="rasm/posle-${id}.jpg" alt="${esc(nom[id])}" loading="lazy" width="945" height="532"><figcaption><b>${id}</b> ${esc(nom[id].replace(/^\S+\s/, ''))} <span class="chip ${holat(id)}" title="${BADGE[holat(id)][1]}">${BADGE[holat(id)][0]}</span></figcaption></figure>`).join('')}</div></div>
    </div>
  </section>`).join('')
const html = `<title>Tanishuv oldin va keyin</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geologica:wght@600;700&family=Onest:wght@400;500;600;700&family=JetBrains+Mono:wght@600;700&display=swap">
<style>
/* Tartib: tepada tungi ish xulosasi va ertalabki qarorlar; keyin 16 sahna — har birida «oldin» (v9 kodi) va «keyin» (etalon) yonma-yon; oxirida halol ro'yxat. Junior etalonining tokenlari. */
:root{
  --bg:#F6F4EF; --sirt:#FFFFFF; --sirt2:#FBFAF7; --siyoh:#0D2137; --xira:#5A5A60; --chiziq:#E4E0D6;
  --aksent:#E2431F; --ok:#1F7A4D; --ok-bg:#E3F0E8; --oltin:#8A6A0C; --oltin-bg:#FFF3C4; --kok:#1B62B5; --kok-bg:#E3EFFD;
  --f-sar:"Geologica",system-ui,sans-serif; --f-matn:"Onest",system-ui,-apple-system,"Segoe UI",sans-serif; --f-kod:"JetBrains Mono",ui-monospace,monospace;
}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#11161f;--sirt:#18202c;--sirt2:#1d2633;--siyoh:#ECEFF4;--xira:#A4ACB9;--chiziq:#2A3442;--aksent:#FF7A59;--ok:#59C98F;--ok-bg:#163024;--oltin:#E7CA66;--oltin-bg:#3a3010;--kok:#7DBBFA;--kok-bg:#14263c;color-scheme:dark}}
:root[data-theme="dark"]{--bg:#11161f;--sirt:#18202c;--sirt2:#1d2633;--siyoh:#ECEFF4;--xira:#A4ACB9;--chiziq:#2A3442;--aksent:#FF7A59;--ok:#59C98F;--ok-bg:#163024;--oltin:#E7CA66;--oltin-bg:#3a3010;--kok:#7DBBFA;--kok-bg:#14263c;color-scheme:dark}
*{box-sizing:border-box}
body{background:var(--bg);color:var(--siyoh);font:16px/1.55 var(--f-matn);padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));padding-block:28px 72px}
.wrap{max-width:1240px;margin:0 auto;display:flex;flex-direction:column;gap:28px}
h1,h2,h3{font-family:var(--f-sar);letter-spacing:-.02em;text-wrap:balance;margin:0}
p{margin:0}
.tepa{display:flex;flex-direction:column;gap:12px}
.tepa .yorliq{font:700 12px/1 var(--f-kod);letter-spacing:.12em;text-transform:uppercase;color:var(--aksent)}
.tepa h1{font-size:clamp(30px,4.6vw,48px);line-height:1.05}
.tepa p{max-width:72ch;color:var(--xira)}
.sonlar{display:flex;flex-wrap:wrap;gap:8px}
.sonlar span{font:600 14px/1 var(--f-matn);padding:9px 12px;border-radius:999px;background:var(--sirt);border:1px solid var(--chiziq)}
.sonlar b{font-family:var(--f-kod);font-variant-numeric:tabular-nums}
.blok{background:var(--sirt);border:1px solid var(--chiziq);border-radius:14px;padding:22px;display:flex;flex-direction:column;gap:14px}
.blok h2{font-size:24px}
.tun{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px}
.tun > div{background:var(--sirt2);border:1px solid var(--chiziq);border-radius:12px;padding:14px 16px;display:flex;flex-direction:column;gap:6px;min-width:0}
.tun h3{font-size:17px}
.tun p{font-size:14.5px;color:var(--xira)}
.tun a{color:var(--kok);font-weight:600}
.qaror{margin:0;padding-left:20px;display:flex;flex-direction:column;gap:8px}
.qaror li{max-width:90ch}
.chip{display:inline-block;font:700 11.5px/1 var(--f-kod);letter-spacing:.04em;padding:5px 8px;border-radius:999px;vertical-align:1px}
.chip.qabul{background:var(--ok-bg);color:var(--ok)}
.chip.korik{background:var(--oltin-bg);color:var(--oltin)}
.chip.yangi{background:var(--kok-bg);color:var(--kok)}
.izoh{display:flex;flex-wrap:wrap;gap:10px 18px;font-size:14px;color:var(--xira);align-items:center}
.sahna{display:flex;flex-direction:column;gap:14px;padding-top:18px;border-top:1px solid var(--chiziq);scroll-margin-top:12px}
.s-bosh{display:flex;gap:14px;align-items:flex-start}
.s-n{flex:none;width:40px;height:40px;border-radius:50%;display:grid;place-items:center;font:700 17px/1 var(--f-kod);background:var(--siyoh);color:var(--bg)}
.s-bosh h2{font-size:24px;line-height:1.15}
.ozg{margin:6px 0 0;padding-left:18px;color:var(--xira);font-size:14.5px;display:flex;flex-direction:column;gap:2px}
.juft{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.2fr);gap:18px;align-items:start}
@media (max-width:980px){.juft{grid-template-columns:1fr}}
.ust{display:flex;flex-direction:column;gap:10px;min-width:0}
.ust .yorliq{font:700 12px/1.3 var(--f-kod);letter-spacing:.06em;color:var(--xira)}
.ust.keyin .yorliq{color:var(--aksent)}
.ust img{display:block;width:100%;height:auto;border-radius:10px;border:1px solid var(--chiziq);background:var(--sirt2)}
.oldin img{filter:saturate(.85)}
.bosh{font-size:14.5px;color:var(--xira);background:var(--sirt2);border:1px dashed var(--chiziq);border-radius:10px;padding:16px}
.ekr{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px}
.ekr figure{margin:0;display:flex;flex-direction:column;gap:6px;min-width:0}
.ekr figcaption{font-size:13.5px;color:var(--xira);display:flex;flex-wrap:wrap;gap:6px;align-items:baseline}
.ekr figcaption b{font:700 12px/1 var(--f-kod);color:var(--siyoh);background:var(--sirt);border:1px solid var(--chiziq);border-radius:6px;padding:3px 6px}
.chala{margin:0;padding-left:20px;display:flex;flex-direction:column;gap:8px}
.mundarija{display:flex;flex-wrap:wrap;gap:6px}
.mundarija a{font:600 13px/1 var(--f-matn);color:var(--siyoh);text-decoration:none;background:var(--sirt2);border:1px solid var(--chiziq);border-radius:8px;padding:7px 9px}
.mundarija a:focus-visible,.tun a:focus-visible{outline:3px solid #3FA2FF;outline-offset:2px}
.bl-rasm{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px}
.bl-rasm img{width:100%;height:auto;border-radius:10px;border:1px solid var(--chiziq)}
.jad{overflow-x:auto}
table{width:100%;border-collapse:collapse;font-size:14.5px}
th,td{text-align:left;padding:8px 10px;border-bottom:1px solid var(--chiziq);vertical-align:top}
th{font:700 12px/1.2 var(--f-kod);letter-spacing:.06em;color:var(--xira);text-transform:uppercase}
td:last-child{font-family:var(--f-kod);font-variant-numeric:tabular-nums}
</style>
<div class="wrap">
  <header class="tepa">
    <span class="yorliq">Junior · 1-dars «Tanishuv» · tungi ish, 16.11</span>
    <h1>Oldin va keyin</h1>
    <p>Har sahna uchun chapda — hozirgi darsning haqiqiy ekrani (kod hali 9-versiyada, suratlar 16.11 tunda olingan), o‘ngda — etalon v4 dagi yangi ekranlar. Yangi ekranlar hali kod emas: bu — dars qanday ko‘rinishi kerakligining namunasi.</p>
    <div class="sonlar"><span><b>16</b> sahna</span><span><b>${sanoq.qabul + sanoq.korik + sanoq.yangi}</b> yangi ekran</span><span class="chip qabul">Qabul · ${sanoq.qabul}</span><span class="chip korik">Ko‘rikda · ${sanoq.korik}</span><span class="chip yangi">Yangi · ${sanoq.yangi}</span></div>
  </header>

  <section class="blok" aria-labelledby="tun-h">
    <h2 id="tun-h">Tunda nima qilindi</h2>
    <div class="tun">
      <div><h3>Tartib</h3><p>Etalon <code>arxiv/</code> dan <code>new-junior/etalon/</code> ga ko‘chdi (bitta buyruq: <code>node new-junior/etalon/yig.mjs</code>), tekshiruvlar — <code>sinov/etalon/</code> ga. Natija baytma-bayt bir xil. Commit qilinmadi.</p></div>
      <div><h3>Blockly sinovi — o‘tdi</h3><p>4 blok bizning ko‘rinishda; sudrash, bosib qo‘shish, ishga tushirish, yozuvni o‘zgartirish, JavaScript kodi — hammasi ishladi. Tez va yengil. Hukm: <b>Blockly</b>. <a href="https://claude.ai/artifact/V4gd1b6ZVuRsjgueAAC4bg">O‘zingiz o‘ynab ko‘ring</a></p></div>
      <div><h3>Etalon v4 — butun dars</h3><p>16 ta yangi ekran: kutish, qahramon tanlash, YUR! tugmasi, xulosa, «Men robotman», ism va rang, say yozuvi, ustozning sahnasi, o‘z sahnangiz, galereya. 33 ekran setka tekshiruvidan toza. <a href="https://claude.ai/artifact/98WuUFScW38c9u9RyPoJbp">Etalon sahifasi</a></p></div>
      <div><h3>Ekran qonunlari — bitta fayl</h3><p><code>new-junior/etalon/QONUNLAR.md</code>: 26 qonun, har birining manbasi va tekshiruvi, hujjatlar orasidagi ziddiyatlar ro‘yxati.</p></div>
    </div>
  </section>

  <section class="blok" aria-labelledby="qaror-h">
    <h2 id="qaror-h">Ertalab sizdan kerak</h2>
    <ol class="qaror">
      <li><b>Yangi 16 ekran va v3.4 dagi 5 ekranni ko‘rish</b> — etalon sahifasida «Qabul / Boshqa g‘oya», keyin «Javobni nusxalash».</li>
      <li><b>Blockly’ni tasdiqlash.</b> «Ha» bo‘lsa: Blockly fayllari loyihaga qo‘yiladi (sinfda internet bo‘lmasa ham ishlashi uchun) va 1-darsning studiyasi Blockly ustiga ko‘chiriladi.</li>
      <li><b>Ustoz gaplari qayerda turadi?</b> Proyektor ustoz noutbukini takrorlaydi, shuning uchun pastki qatordagi «Ustozga: … deb ayting» sinfga ham ko‘rinadi. Yo faqat varaqda, yo noutbukda alohida ustoz oynasi.</li>
      <li><b>Commit.</b> <code>new-junior/</code> hali git’da yo‘q — bitta xato yoki disk nosozligi bilan hammasi yo‘qolishi mumkin. Buyrug‘ingiz bilan commit qilaman.</li>
    </ol>
  </section>

  <nav class="blok" aria-label="Sahnalar"><h2>Sahnalar</h2><div class="mundarija">${SAHNA.map(([n, sar]) => `<a href="#s${n}">${n} · ${esc(sar)}</a>`).join('')}<a href="#blockly">Blockly sinovi</a><a href="#chala">Hali chala</a></div>
    <div class="izoh"><span class="chip qabul">Qabul</span> siz qabul qilgansiz <span class="chip korik">Ko‘rikda</span> v3.4 da o‘zgardi <span class="chip yangi">Yangi</span> tunda chizildi</div></nav>
  ${sahnaHtml}

  <section class="blok" id="blockly" aria-labelledby="bl-h">
    <h2 id="bl-h">Blockly sinovi</h2>
    <p>Blok studiya Blockly 13.4.0 da (Apache 2.0), etalondagi «Studiya» shablonida: rang doirachalari · bloklar · dastur · sahna. Chapda — sudrab ulangan dastur, o‘ngda — «say» yozuvi o‘zgartirilib, qahramon yulduzga yetgan.</p>
    <div class="bl-rasm"><img src="rasm/blockly-sudrab.jpg" alt="Blockly sinovi: sudrab ulangan to‘rt blok" loading="lazy"><img src="rasm/blockly-say.jpg" alt="Blockly sinovi: say yozuvi o‘zgartirildi, qahramon yulduzda" loading="lazy"></div>
    <div class="jad"><table><thead><tr><th>Nima</th><th>Natija</th></tr></thead><tbody>
      <tr><td>Ish maydoni tayyor</td><td>0,3–0,5 s</td></tr>
      <tr><td>Blockly fayllari (tarmoqdan, siqilgan)</td><td>~170 KB</td></tr>
      <tr><td>4× sekin protsessorda: tayyor · 5 marta bosib qo‘shish</td><td>0,5 s · 0,29 s</td></tr>
      <tr><td>Xotira</td><td>~10 MB</td></tr>
      <tr><td>Bosib qo‘shish · sudrab ulash · ishga tushirish · yozuvni o‘zgartirish · «Kodini ko‘rsat»</td><td>hammasi ishladi</td></tr>
    </tbody></table></div>
    <p>Sinalmagani: sensorli panelda bola barmog‘i bilan sudrash; sinfda internetsiz ishlash (fayllar loyihaga qo‘yiladi); uzun «say» gapi tor ustunda. Hisobot: <code>new-junior/sinov/blockly/HISOBOT.md</code>. <a href="https://claude.ai/artifact/V4gd1b6ZVuRsjgueAAC4bg">Sinov sahifasini ochish</a> — bloklarni bosing yoki sudrang, «Ishga tushir».</p>
  </section>

  <section class="blok" id="chala" aria-labelledby="ch-h">
    <h2 id="ch-h">Hali chala</h2>
    <ul class="chala">
      <li><b>Kod.</b> Dars hali 9-versiyada (chapdagi suratlar). Yangi ko‘rinish kodga ko‘chirilmagan — Blockly tasdig‘i va ekranlar ko‘rigidan keyin.</li>
      <li><b>Bolalarda sinalmagan:</b> inglizcha blok nomlari, bekat belgilari, pog‘ona rasmlari, rasmli javob kartalari.</li>
      <li><b>Proyektorda o‘qilishi o‘lchanmagan:</b> ko‘p yorliq ekran kengligining 1–1,3 foizida.</li>
      <li><b>Birinchi dasturgacha 16–19 daqiqa</b> — kirish, savol, «Dasturlash nima?» va reja ketma-ket. 9 yoshli uchun uzun bo‘lishi mumkin.</li>
      <li><b>Harakat va tovush</b> etalonda faqat qisman; to‘liq — kodda.</li>
    </ul>
  </section>
</div>
`
writeFileSync(D + 'index.html', html)
console.log('ok', (html.length / 1024).toFixed(0) + 'KB,', kerak.length, 'eski +', SAHNA.flatMap((s) => s[3]).length, 'yangi rasm')
