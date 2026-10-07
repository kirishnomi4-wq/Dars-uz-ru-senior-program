# 03 · «Mahsulot tezligi: o'lchaymiz va tezlashtiramiz» — o'z auditi (08.10.2026, F-1008-556)

**Mexanik:** ekran 19/19 · arena A3 B3 C3 D3 (bir qatorli shakl, qo'lda sanaldi) · sarlavha ≤55, xulosa ≤110 · keyingi dars ✓ · TAXMIN 29 · `lint:til` 0 error, 0 warn.
Kod oynasi agent tomonidan Chrome headless'da sinalgan (siljish 302 px → 0 px). Taqiq naqshlari — 25 qatorda: meta bo'limlar; «Performance», «Mobile», «Analyze page load» — Lighthouse UI yorliqlari (T19 ruxsati), prozada «performance» yo'q.
Rasmiy chegaralar (LCP 2,5 s · CLS 0,1 · TBT 200 ms) — agent web.dev va Lighthouse hujjatidan tekshirgan («Manbalar»); Mentor sonlari yo'q (`{…}`, ⛔ pilot) — T6 bajarilgan. «Tezlashdi» — faqat oldin/keyin soni bilan.

| TS | Hukm | Natija |
|---|---|---|
| 1 Lighthouse — lending, kod hajmi — ilova | **Qabul** (T5 ni aniqlashtiradi) | tayanch 9.5, 8 (`pm-m12d3-tezlik` izohi) |
| 2 web `npm run build` | **Qabul** | tayanch 9.5 |
| 3 lendingdagi pastki ikki rasm | **Qabul (namuna)** | tayanch 9.15; ⛔ «qur» da Mentor lendingiga moslanadi |
| 4 180 × 320 | **Qabul (namuna)** | tayanch 9.15 |
| 5 kutubxona nomsiz | **Qabul** | «Keraksizi topilmadi» yo'li bor |
| 6 `tuzatishlar` A1 da | **Qabul** | tayanch 8 |
| 7 birliklar | **Qabul** | tayanch 8 — maydon nomi o'zgarmaydi, birlik ta'rifda |
| 8 besh yakun holati | **Qabul** | E 54 |
| 9 nishonlar | **Qabul** | grep 0 |
| 10 hook — lending | **Qabul** | demo stsenariysi 6-darsda |
| 11 «Performance» UI yorlig'i | **Qabul** | T19 |
| 12 «Mobile rejimi» | **Qabul** | tayanch 9.5 |
| 13 «birinchi ekran» | **Qabul** | tayanch 1.3 so'zi |
| 14 web-trek `npm run dev` | **Qabul** | 11-Modul odati |
| 15 APK yangi build | **Qabul** | 12/13-Modul naqshi |
| 16 «Oldin» kartasi bitta | **Qabul** | qisqa sonlar — bir kartada (E 53 uzun matnga) |
| 17–20 | **Qabul** | reyting yo'q · uyga vazifa yengil · reja sarlavhasi · «Ortda» A1 da |
**Qolgan ⛔:** Lighthouse UI nomlari Chrome versiyasiga qarab · Atlas oynasi · Windows'da Atlas buyrug'i · 90 daqiqa · Lighthouse to'q sariq rang tokeni (D3).
