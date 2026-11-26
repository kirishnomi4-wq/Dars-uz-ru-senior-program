# QA fidbeki — 1-modul (25.11)

Manba: QA guruhi «qa test» → «Coddy Web Junior» (21–24.11), @claudeopusssbot orqali forward (24 xabar, 18 surat) — `asl/` (`xabarlar.json`, `NN.jpg` — NN = xabar tartibi).
Bot tokeni chatda ochiq yozildi — ish tugagach @BotFather /revoke taklif qilingan. Botdagi 12 ta AILM guruhi xabariga tegilmagan (offset berilmagan).

Holat: ✅ bugun tuzatilgan · 🔴 xato — tuzatish (tasdiq kutilmoqda) · 🟡 qaror kerak. 25.11 kech: 🔴 lar «ha tuzat» bilan, 🟡 lar ko‘rik sahifasi 11-versiya javoblari (Q02, Q04, Q07, Q10, Q12, Q14, Q17 — hammasi A) bilan yopildi.

| ID | Xabar | Dars / ekran | QA | Tashxis | Holat |
|---|---|---|---|---|---|
| F-1125-01 | 2, 3 | 13 · P1, P2 (Safari) | bloklar kartadan chiqadi | 21.11 F-1121 da tuzatilgan (kichik.js; 4/5/13 1-ekran) | ✅ — WebKit setka bilan qayta tasdiqlanadi (g25d) |
| F-1125-02 | 4–7 | hamma · telefon | o'ngga siqilgan; yotqizish taklifi (Azizbek: «Qabull») | qa.html «faqat kompyuterda»; portretda ekran sig'maydi | ✅ 25.11 Q02-A — tik telefonda «Telefonni yotqizing», yotiqda dars to‘liq sig‘adi (qobiq.css; qa.html matni) |
| F-1125-03 | 8 | 4 · P2S «Uch sinov» (ustoz) | hech narsa bosilmaydi | C kartadagi strelkalar tugmaga o'xshaydi, bosilmaydi; klaviatura kerakligi aytilmagan | ✅ 25.11 — C karta strelkasi bosiladi, ishora «klaviaturada yoki kartada» |
| F-1125-04 | 9 | 4 · yonma, ko'p dasturcha | ustma-ust; scroll taklifi | bola qo'shgan dastur 0,6 masshtabda sig'maydi → Blockly itaradi (K7 faqat tayyor dasturlar) | ✅ 25.11 Q04-A — pastki chegara hamma darsda 13–23-darsdagidek (1440 px da ≈0,45), undan keyin dastur ustuni pastga aylanadi (blockly.js blMasshtab) |
| F-1125-05 | 10, 11 | 6 va hamma kirish · «O‘tgan darsda» | repeat bloki yarashmagan | statik C-blok: ichki blok sarlavhadan keng | ✅ 25.11 — C-blok sarlavhasi ichki blok bilan teng |
| F-1125-06 | 12 | 10 · P2C (1086 px oynada) | kichik labirintlar kartadan chiqqan | setka faqat 1280 px da | ✅ 25.11 — kichik labirintlar kartaga sig‘adi (qutiden.mjs 1086 px) |
| F-1125-07 | 13 | 14 · P6 (ustoz) | blokni sudrab ajratib bo'lmaydi | `blBirlashtir` ajratilgan blokni qaytarib ulaydi; olib tashlash — tanlab ✕ | ✅ 25.11 Q07-A — Scratch’dagidek; tanlanganda ishora «Tanlandi: ✕ — olib tashlash (pastidagilar qoladi), boshqa blok — joy almashadi» (pastki qatorga sig‘ishi uchun qisqa; blockly.js, 3 joy) |
| F-1125-08 | 14 | 15 · P8 | ustma-ust | 25.11 K7 (15: ikki ustun sig'masdi) | ✅ — QA o'lchamida tasdiqlanadi |
| F-1125-09 | 15, 16 | 18 (#global) javon | blok matni qirqilgan | javon tor; setka ushlamagan — sababi aniqlanadi | ✅ 25.11 — sig‘magan javon blokining matni ikkinchi qatorga o‘tadi (faqat o‘sha blok; studiya.js javonSigdir); javon-qirq.mjs |
| F-1125-10 | 15, 16 | 18 «O‘yiningizda:» | «O‘q urganda ball», «Tekkanda jon» noaniq | matn | ✅ 25.11 Q10-A — «O‘q tegsa — ball +1» · «Dushman tegsa — jon −1» (18, 20–23) |
| F-1125-11 | 17 | 18+ sinf natijasi | «ta dushman urdi» | sinf uchun — «urildi» | ✅ 25.11 — «ta dushman urildi» |
| F-1125-12 | 18 | 18 · qiyin o'yinlar | raketa sekin | tezlik / dushman tezligi | ✅ 25.11 Q12-A — raketa ~2 baravar tez (qadam ~170 ms), bosib tursa — uzluksiz |
| F-1125-13 | 18 (suratda) | 18 · P10 va b. | — («11 / 10 ta blok») | tayyor raketa dasturi 11 blok, chegara 10 | ✅ 25.11 — chegara 12 |
| F-1125-14 | 19 | hamma · solo yakuni (B5) | keyin nima bosiladi? | «Dars tugadi» — tugma yo'q | ✅ 25.11 Q14-A — «✓ Dars tugadi. Natijangiz saqlandi — oynani yopishingiz mumkin» (23 dars) |
| F-1125-15 | 20 | 19 · P1 «O‘tgan darsda» | mantiqan xato | rasm ustuni «K» ni yopadi; sarlavha = izoh takrori | ✅ 25.11 — rasm ustuni va sarlavha tuzatildi |
| F-1125-16 | 21, 22 | 19, 20 · «Kod nima?» | kartadan chiqqan | kod kartadan keng | ✅ 25.11 — kod kartaga sig‘adi |
| F-1125-17 | 23 | 21 · P7 «Kartani to‘ldiramiz» (ustoz) | fixedmi yo tanlanadimi? | ustoz kartasi namuna; Coddy «Har qatorda bitta tanlov» chalkashtiradi; sarlavha «Karta|ni» rangi so'z ichida | ✅ 25.11 Q17-A — ustoz kartani bosib to‘ldiradi; sarlavha rangi tuzatildi |
| F-1125-18 | 24 | 23 · P8 | ustma-ust / scroll? | 25.11 K7 | ✅ — QA o'lchamida tasdiqlanadi |
| F-1125-19 | — (oltin sol) | 11 · B3A–B3C solo | — | pastki qatorga sig'masdan «▶ Tekshirish» 2-qatorga tushib, ekran chetida qirqiladi (oltinda ham shunday edi) | ✅ 25.11 — «▶ Tekshirish» pastki qatorda, xira; boshqa darslarda ham qidirildi |
