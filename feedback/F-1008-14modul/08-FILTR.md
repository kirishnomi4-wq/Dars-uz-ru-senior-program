# 8-dars «Final pitchingiz 5 daqiqaga tayyormi?» — tashqi audit (ChatGPT) Filtr bilan, 08.10.2026 (F-1008-566)

Filtr tartibi — `01-FILTR.md` dagidek. Zaxira: scratchpad `zaxira-08/`. Skript: scratchpad `f08_tuzat.py` (95 juftlik, har biri faylda aynan bir marta — skript tekshirgan).
Audit bahosi 6.5/10 (ikki «fundamental»: «gap almashtirildi → vaqt o'zgarmadi» modeli; `pm-m12d8-final` sxemasi yakunni tiklashga yetmaydi). Hukm: **Qabul 31 · Qisman 2 · Rad 3 · Allaqachon 12** (48 band + sarlavha + 12 TS + 9 savol + 10 shart; takrorlar birlashtirildi).
⚠️ **Tasdiqlangan matnga tegadigan Qabul (foydalanuvchiga alohida):** (a) 3-ekran modeli — «gap eski gap o'rniga → bo'lak o'z vaqtida qoldi → jami yana 5 daqiqa» (GATE M T1/T11 bilan tasdiqlangan MD) → «gap almashtirilgani reja vaqtini o'zgartirmaydi; haqiqiy vaqt — taymer bilan»; bashorat vaqt o'rniga gap uzunligi haqida («Uzunroq»); (b) final pitch ta'rifi «5 daqiqaga sig'adigan pitch» → «oxirgi pitch versiyangiz; sig'ishini taymer bilan tekshirasiz» (versiya va tayyorlik ajratildi); (c) Mentor Bozor javobi (TS2) → «60 a'zo — nechtasiga kerakligi hali tekshirilmagan»; (d) `pm-m12d8-final` sxemasi kengaytirildi (tayanch 8; 9.24 bajarildi); (e) «Keyingi bo'lak» tugmasi (TS9) olindi; (f) 6-ekran `optionalLive` olindi. Tayanch 1.8 matni o'zgarmadi.

| № | Audit | Hukm | Nima qilindi / sabab |
|---|---|---|---|
| 1 | «Gap almashtirildi → bo'lak vaqti o'zgarmadi → 5 daqiqa» — reja, isbot emas (yangi gaplar uzunroq: 103→116, 139→154, 130→155) | **Qabul** | 3-ekran: bashorat «Yangi gaplar eskisidan qanday?» (Qisqaroq · Taxminan teng · Uzunroq — ✔ Uzunroq); 2-tugma: yangi gap ostida «uzunroq», chiziq boshida «reja»; `QIzoh` «Gap almashtirilgani reja vaqtini o'zgartirmaydi. Haqiqiy vaqtni pitchni aytib, taymer bilan bilasiz.»; xulosa; 3-tugma «reja chizig'i»; A-6, dars ipi, 12-Modul ko'prigi, 4-ekran to'g'ri izohi va vizuali, takrorlash 4, kartochka 4, «Endi siz bilasiz» 2, O'qituvchi eslatmasi, Shubhali. 9.67. |
| 2 | Final pitch ta'rifi doiraviy — versiya va tayyorlikni ajrating | **Qabul** | «Bu darsda tayyorlangan oxirgi pitch versiyangiz — final pitch. Sig'ishini taymer bilan tekshirasiz.» — A-4, 3-ekran `QIzoh`, kartochka 1, «Endi siz bilasiz» 1, sinf 7. 9.67. |
| 3 | 0-ekran «Pitch 5 daqiqada tugaydi» — o'lchanmagan fakt | **Qabul** | → «Bu mashqda pitch uchun 5 daqiqa bor, keyin hakam savol beradi. …» 9.67. |
| 4 | Hook «Aynan!» / «Qiziq fikr!» | **Rad** | T-028, T-067 (01–07 bilan bir). |
| 5 | Bozor javobida 60 a'zo = mahsulot kerak odamlar emas | **Qabul** | → «Guruhda 60 a'zo bor; nechtasiga kerakligi va boshqa mahallalar hali tekshirilmagan — tekshirib aytaman.» (97; ✕ 96 — uzunlik bilan ajralmaydi) — A-6, 2-ekran 3-karta, kartochka 12, O'qituvchi eslatmasi, TS2. Arena 4 ✔ o'zgarmadi (boshqa mahallalar — javobda qoldi). 9.69. |
| 6 | «Fakt — kimdandir eshitilgan narsa» — avtomatik fakt emas | **Qabul** | A-5: «manbasi ko'rsatiladigan, tekshirilgan yoki aniq qayd etilgan ma'lumot»; intervyu gapi — «ular shunday degan». 9.69. |
| 7 | `savollar[].vaqt` yo'q — nishon va yakun vaqtga bog'liq | **Qabul** | `savollar: [{ id, savol, javob, vaqt, tekshiradi }]`; Three Answers! — kalitdan. TS6. 9.68. |
| 8 | «Keyinroq» saqlanmaydi — qolgan tuzatish yo'qoladi | **Qabul** | `tuzatishlar: [{ bolak, holat: 'qollandi' \| 'keyinroq' }]`; KOD 7; uyga ① shundan. 9.68. |
| 9 | `tuzatildi` nomi «qo'llandi» atamasiga zid | **Qabul** | `tuzatildi` olindi — `holat: 'qollandi'` (8-band bilan). TS7. |
| 10 | `bolaklar` — oltala final gap, faqat o'zgarganlar emas | **Qabul** | `bolaklar: { muammo … keyingi }` oltala (o'zgarmaganlari 1-darsdan nusxa); 13-dars birlashtirmaydi. 9.68. |
| 11 | `tur: 'sherik' \| 'yakka'` — QAT'IY | **Qabul** | 6-ekran boshida rejim tanlovi → `tur`; 9.24 rejasi. |
| 12 | A-6 «savol-javobda takrorlanmaydi» ↔ 7-ekran 1-savol = `hakamSavoli` | **Qabul** | A-6 va TS1: Mentor misolining uch savoliga kirmaydi; o'quvchida 7-ekranda yana beriladi. TS5 QAT'IY. 9.69. |
| 13 | Bankda `hakamSavoli` bilan bir xil savol takror chiqishi | **Qabul** | 7-ekran va KOD 9: matni bir xil savol chiqariladi (kichik harf, bo'shliq, tinish tenglashtirib). 9.69. |
| 14 | «Odamlar hozir bu ishni nima bilan qiladi?» — «bu ish» noaniq | Qisman | Bank so'zi aynan (tayanch 9.3; 13-dars so'zma-so'z solishtiradi); 7-ekran kartada savol ostida kulrang «bu ish — pitchingizdagi Muammo». |
| 15 | «Backend oldindan uyg'otilgan» — bajarilgan fakt sifatida | **Qabul** | → «Demo yo'lini bir marta oching va ro'yxat chiqqanini ko'ring»; arena 10 ✔ «Demo yo'li ochilib, ro'yxat chiqqani ko'riladi». 9.70. |
| 16 | «Keyingi bo'lak» tugmasi — sherik operator, pitch bo'linadi | **Qabul** | Olindi: taymer tugmalari «5 daqiqani boshlash · To'xtatish · Qaytadan»; juftlik yo'rig'i, harakat, kartochka 7 (→ «taymer chizig'i nimani ko'rsatadi? — rejani»), arena 11 ✔ «Taymerni boshlab, pitchni oxirigacha tinglaydi», KOD 2, 8, TS9 RAD, GATE M ro'yxati. 9.70. |
| 17 | Qolsa — bo'lak vaqtlarini saqlang | Allaqachon (16 bilan) | Tugma olindi — maydon kerak emas. |
| 18 | «5 daqiqadan oshdi → eng uzun bo'lakdan bitta gap» — mexanik | **Qabul** | 6-ekran `QIzoh` → «takrorlangan yoki ortiqcha gapni toping va qisqartiring»; arena 5 ✔ «Takrorlangan yoki ortiqcha gapni olasiz». 9.67. |
| 19 | +40 belgi — heuristika, qonun emas | **Qabul** | Xabar → «Gap ancha uzaydi — vaqtini taymer bilan tekshiring.»; chegara ichki, o'quvchiga son aytilmaydi; Fix Applied! shartidan olindi. |
| 20 | 160 belgi — manbasi | Allaqachon | `pm-m12d1-pitch.bolaklar` gap ≤160 (tayanch 8, 1-dars) — 5-ekran tekshiruviga yozildi. |
| 21 | «Qo'llandi» = savol yopildi emas | Allaqachon | A-4 shunday deydi. |
| 22 | «51 — hisoblar» — saqlang | Allaqachon | O'zgarishsiz. |
| 23 | Telegram javobi manba bilan — saqlang | Allaqachon | O'zgarishsiz (fakt ta'rifi — 6). |
| 24 | 8-test B «Tekshirib aytaman» — lead yopadi | Allaqachon | O'zgarishsiz. |
| 25 | «Tekshirib aytaman: {nimani}» matnga qo'shish — UI hack | **Qabul** | Alohida maydon «Nimani tekshirasiz?» → `savollar[].tekshiradi`; tekshiruv xabari; KOD 9; PM-020 izohi. 9.68. |
| 26 | Uyga ③ strukturali maydondan | **Qabul** | ③ — `savollar[].tekshiradi` dan; ① — `keyinroq` dan (yakun Izohi). |
| 27 | Yakun 1-holat qolgan tuzatishni hisobga olmaydi | **Qabul** | 6 holat: qolgan tuzatish — ustun («Pitch aytildi — {n} ta tuzatish hali qoldi.»); 1-holat — `keyinroq` yo'q sharti bilan; A-1, KOD 14, sinf 6. 9.68. |
| 28 | Fix Applied! — qo'llandi, «tayyor» emas | Allaqachon | Tavsif «Tuzatishni eski gap o'rniga qo'lladingiz». |
| 29 | Five Minutes! — oxirgi tugallangan urinish | **Qabul** | 6-ekran saqlash va nishon: «Qaytadan» dan keyin yangi urinish hisob. 9.68. |
| 30 | Three Answers! — vaqt kalitda | **Qabul** | 7-band bilan. |
| 31–33 | Sherik baholamaydi · 5-dars savoli qaytadi · juftlik va yakka | Allaqachon | O'zgarishsiz (32 — 12-band). |
| 34 | 6-ekran `optionalLive` — markaziy natija | **Qabul** | 6-ekran jonli darsda majburiy (`optionalLive` olindi — 05-FILTR 28 bilan bir); 7-ekran kamida bitta savol majburiy; 5-ekran `optionalLive` qoldi («Keyinroq» yo'li). 9.70. |
| 35 | «B o'quvchi uyda aytadi» — juftlik tengligi | **Qabul** | A-13 va O'qituvchi eslatmasi: ikkala o'quvchi darsda; vaqt yetmasa 7-ekran 2–3-savol, kartochkalar, arena uyga (05-FILTR 27 bilan bir). 9.70. |
| 36 | 90 daqiqa — 110–135 | Qisman | ⛔ A-13 ga auditor bahosi; «Keyingi bo'lak» olingach va 7-ekran kamida bitta savol — 90–105 ga yaqin; pilotda o'lchanadi. |
| 37 | 12–15 o'quvchi bir vaqtda demo — yuk sinovi bo'lmasin | **Qabul** | O'qituvchi eslatmasi: demo yo'llari navbat bilan ochiladi, B reja; ⛔ Shubhali. 9.70. |
| 38 | Namuna o'yin — sanoq, Telegram, eslatma, taklifdan ajratilgan | Allaqachon | 9.59 darvozasi; «Pitchdan oldin» ga havola. |
| 39 | Uyga ② tanish odam — «Xohlasangiz» | **Qabul** | ② qayta yozildi (bo'lmasa o'zi ovoz chiqarib, bankdagi uch savol); karta ostida ism yozilmaydi; sinf 14. 9.70. |
| 40, 41 | Uyga ③ · «Keyingi dars» qatori | Allaqachon | O'zgarishsiz. |
| 42, 43 | Arena 5 va 11 qayta yozilsin | **Qabul** | 18 va 16-band bilan. |
| 44, 45 | Kartochka 4, takrorlash 4, «Endi siz bilasiz» 2 — yolg'on sabab | **Qabul** | 1-band bilan («keyin vaqt taymer bilan tekshiriladi»). |
| 46 | `savedAt` → `updatedAt` / `completedAt` | **Rad** | Kurs qolipi (02-FILTR 18, 05-FILTR 15); tugallik holat maydonlaridan. |
| 47 | Tanlangan savollar reload-safe bo'lsin | **Qabul** | Savol ochilishi bilan kalitga (`javob: null`) — E 51; KOD 9. 9.68. |
| 48 | Hakam qiyofalari — ismsiz, iqtibossiz | Allaqachon | O'zgarishsiz. |
| S | Sarlavhalar: asosiy QAT'IY QABUL; 3-ekran — payoff «aytmaguncha bilmaysiz» | **Qabul** | Sarlavha qoldi, payoff 1-band bilan. |
| TS | 1 ✓ (+12) · 2 → 5 · 3 ✓ · 4 → 7–11, 25 · 5 ✓ (12, 13) · 6 → 7 · 7 → 9 · 8 ✓ · 9 → 16 (olindi) · 10 ✓ (`pm-m12d6-demo.ssenariy` o'qiladi — tayanch 8) · 11 **Rad** (dars raqami — 06, 07 bilan bir; natija nomiga o'tish uch MD ga tegadi — foydalanuvchi qarori bo'lsa alohida) · 12 ✓ | | Savollar 13–21: 13 → 1 · 14 → 7 · 15 → 8 · 16 → 27 · 17 → 10 · 18 → 13 · 19 → 5 · 20 → 16 · 21 → 34. |

**10 hard fix:** 1 ✓ · 2 ✓ · 3 ✓ · 4 ✓ · 5 ✓ · 6 ✓ · 7 ✓ · 8 ✓ · 9 ✓ · 10 ✓ («Keyingi bo'lak» olindi; 90 daqiqa — ⛔ pilot).

O'lchov bo'limi — Filtrdan oldingi holat; o'zgargan qatorlarning yangi uzunliklari qavsda skript bilan qo'yildi (0-ekran Mentor 103, 3-ekran `QIzoh` 103 / 97, xulosa 103, 4-ekran to'g'ri izohi 58, 6-ekran `QIzoh` 81, 5-ekran xabar 52, 7-ekran xabar 44).

## Sinf-supurish (13 MD + tayanch, grep)
- **«Keyingi bo'lak»** — 13 MD hakam varag'ida «vaqt» bandi («Keyingi bo'lak» bosilgan bo'lsa — faqat ekranda) — 13-dars auditida qaraladi (08 da olindi, TS9).
- **`pm-m12d8-final` o'quvchilari** — 13 (`vaqt`, `savollar` — maydonlar saqlandi; `id` qo'shildi — 13 TS4 so'rovi bajarildi); 09, 11, 12 — o'qimaydi.
- **«60 a'zo / 60 kishi» = ehtiyoj emas** — 01 (01-FILTR 6 da «biz biladigan guruh a'zolari» — mos), 13 (3-ekran 2-vaziyat «Boshqa mahallalarni hali tekshirmaganmiz — tekshirib aytaman» — 13-dars auditida yangi javob bilan tenglashtiriladi).
- **«bo'lak o'z vaqtida qoladi» modeli** — faqat 08 da edi (grep 13 MD: 0).
- **`optionalLive` markaziy ekranda** — 05 (olingan), 08 (olindi); 07 5-ekran `optionalLive` — kutishlar (markaziy emas), qoldi.
- **Uyga vazifa «tanish odam» majburiy** — 05, 07 (ixtiyoriy qilingan), 08 (hozir); boshqa MD larda yo'q.
- **«Backend uyg'otilgan» statik fakt** — faqat 08; 06/07 da xatti-harakat («uyg'oting»).

## Tekshiruv
`lint:til` 08, tayanch — TOZA / 0 error · `mdtekshir.py` 08 — 12/12 ekran, arena 3/3/3/3, uzun 0 · `kesishma.py` takror 0 · `lint:prompt` ✓.
