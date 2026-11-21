// ===== DEMO sahifasi (16.11; dvigatel 1b, 19.11 — avval etalon/demo.mjs; 2d — bo'laklar yigish.mjs dan): sahifa qolipi → public/demo.html =====
// dvigatel/yig.mjs ulaydi va yuritadi: yigish.chizuvchi(dars) (bosh + qismlar + dars ekranlari + dars qadamlari + malumot) + shu fayl.
// Brauzer skripti va uslub — yigish.mjs dan (LMS ham o'shalardan yig'iladi): skript({ demo: true }), uslub().
//   ?rol=ustoz — proyektor, «Keyingi»/strelka bilan boshqaradi · ?rol=bola — o'quvchi, ustozga ergashadi · ?rol=yonma — ikkalasi yonma-yon (ko'rik)
// Aloqa: aloqa-demo.js — lokal server (vite: /__sinf, SSE), internet (api/sinf) va bitta brauzer ichida BroadcastChannel.
import { writeFileSync } from 'node:fs'
import { skript, uslub } from './yigish.mjs'
const BRAUZER_JS = skript({ demo: true })
const { DARS_CSS, QOBIQ_CSS, SHRIFT } = uslub(process.argv[2]) // dars papkasi — yig.mjs beradi
const DEMO = `<!doctype html>
<html lang="uz"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Junior · ${DARS.raqam}-dars demo</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
${SHRIFT}
<style>${DARS_CSS}</style>
<style>
${QOBIQ_CSS}</style></head>
<body>
<div id="ilova"></div>
<script src="vendor/blockly-13.4.0/blockly_compressed.js"></script>
<script src="vendor/blockly-13.4.0/en.js"></script>
<script>
const EKRANLAR = ${JSON.stringify(EKRANLAR)};
const QADAM = ${JSON.stringify(QADAM)};
const VARAQ = ${JSON.stringify(VARAQ)};
const EKRANLAR_Q = ${JSON.stringify(EKRANLAR_Q)};
const EKRANLAR_U = ${JSON.stringify(EKRANLAR_U)};
const PAL_HTML = ${JSON.stringify(PAL_HTML)};
const PAL_B1 = ${JSON.stringify(PAL_B1)}, QAH_SVG = ${JSON.stringify(QAH_SVG)}, ODAM_SVG = ${JSON.stringify(ODAM)}, MUAM_SVG = ${JSON.stringify(MUAM_SVG)};
const DUNYO_HTML = ${JSON.stringify(DUNYO_HTML)};
const QAHRAMONLAR = ${JSON.stringify(QAHRAMONLAR)}, QNOM = ${JSON.stringify(QNOM)}, JOYLAR = ${JSON.stringify(JOYLAR.map(([k]) => k))};
const DARS = ${JSON.stringify(DARS)};
${BRAUZER_JS}
</script>
</body></html>`
// 5b-1: har dars o'z sahifasi — DARS.demoFayl (1-dars: demo.html, eski manzillar saqlansin), bo'lmasa demo-002.html kabi
const FAYL = DARS.demoFayl || 'demo-' + String(DARS.raqam).padStart(3, '0') + '.html'
writeFileSync(new URL('../public/' + FAYL, import.meta.url).pathname, DEMO)
console.log('demo ok', FAYL, (DEMO.length / 1024).toFixed(0) + 'KB', kerak.length, 'ekran,', QADAM.length, 'qadam')
