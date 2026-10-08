# 7-dars «Investor ko'zi bilan: demo buzilmaydimi?» — tashqi audit (ChatGPT) Filtr bilan, 08.10.2026 (F-1008-565)

Filtr tartibi — `01-FILTR.md` dagidek. Zaxira: scratchpad `zaxira-07/`. Skript: scratchpad `f07_tuzat.py` (78 juftlik, har biri faylda aynan bir marta — skript tekshirgan).
Audit bahosi 6.5/10 (uch «blocker»: 2-ekran uch savol mantig'i, login chatda, B rejasiz o'tish ham «uch o'tish»). Hukm: **Qabul 24 · Qisman 5 · Rad 4 · Allaqachon 12** (40 band + sarlavha + 17 TS + 7 savol + 9 shart; takrorlar birlashtirildi).
⚠️ **Tasdiqlangan matnga tegadigan Qabul (foydalanuvchiga alohida):** (a) 2-ekran javob kaliti `[ko'rindi, ko'rindi, ko'rinmadi]` (TS10, GATE M A) → **`[ko'rindi, ko'rinmadi, ko'rinmadi]`**, bashorat «ikkitasiga» → «bittasiga», sarlavha «qaysi savollarga» (1–3-band); tayanch 1.7 uch savol o'zgarmadi; (b) demo tekshiruvi ta'rifi «hakam nimani ko'rishini oldindan bilish» → «ekranda nima bo'lishini oldindan tekshirish» (4-band; tayanch 2 «ataylab buzib tekshiradi» bilan bir); (c) `pm-m12d7-tekshiruv.otishlar` shakli `{ tur, natija, vaqt }`, `bReja` olib tashlandi (24–28-band; tayanch 8; 13-dars faqat `urinishlar[]` ni o'qiydi); (d) tayanch 1.7 «3 marta, xatosiz» — «xatosiz» endi faqat 1, 3-o'tishga, 2-o'tish «B reja bo'yicha tugadi» (tayanch matni o'zgarmadi, talqini 9.65 da); (e) tekshiruv akkaunti — agent ochadi (12-Modul 9.35 saqlandi), lekin login chatga chiqmaydi — 9.58 shunga aniqlashtirildi.

| № | Audit | Hukm | Nima qilindi / sabab |
|---|---|---|---|
| 1 | Oddiy demo o'tishi «bir qarashda bilinadimi?» ga javob bermaydi — ma'lumot bor, tushunganini odam aytadi | **Qabul** | 2-savol ✔ «O'tishda ko'rinmadi» — e'lon kartasi ustida «ma'lumot bor — tinglovchi kerak»; xato izohi «Ma'lumot bor. Birinchi ko'rgan odam tushunganini kim aytadi?» (60); xulosa «Bu misolda o'tish bitta savolga javob berdi. Qolgan ikkitasini tinglovchi va buzish ko'rsatadi.»; A-1 ipi, A-4, 2-ekran eslatmasi, ✎, KOD 5 kaliti, kartochka 2, 3, nishon tavsifi, Shubhali 5 yopildi. TS10. 9.63. |
| 2 | Bashorat to'g'ri javobi «bittasiga» | **Qabul** | «Taxminingiz ✕ — aslida: bittasiga». 9.63. |
| 3 | «Mahsulot jonli ishlaydimi?» — «shu o'tishda jonli o'zgarish ko'rindi» (universal emas) | Qisman | Savol matni qoldi (kurs savoli, tayanch 1.7); dalil qatori «shu o'tishda telefonda «9 / 10» o'zi paydo bo'ldi — «har doim ishlaydi» emas». |
| 4 | Ta'rif «hakam nimani ko'rishini bilish» — antropomorfik | **Qabul** | → «Demoni ataylab buzib, ekranda nima bo'lishini oldindan tekshirish — demo tekshiruvi» — A-4, 2-ekran `QIzoh`, yakun 2-qator, kartochka 1 (4 joy). 9.63. |
| 5 | Tekshiruv akkaunti prompti «Loginini ayt» — login chatga | **Qabul** | Ikkala prompt: «Login va parolni javobingda chiqarma — men unga kirmayman» (o'quvchi bo'sh yozuvni o'z demo hisobidan ochadi); A-5, A-9, kartochka 6 izohi. 9.58 aniqlashtirildi: 7-darsda agent ochadi (12-Modul 9.35), login chiqmaydi. |
| 6 | `id` chatda — shartli qabul, kalitga yozilmasin | Allaqachon | A-12: kalitga `id` yozilmaydi (bor edi); A-9 da aytildi. |
| 7 | `.env` — `git status` yetarli emas, tracked check | **Rad** | 13-Modul 9.41, 03/06-FILTR bilan bir: yangi maxfiy fayl yo'q. |
| 8 | Amaliyot 1 tuzatish zanjiri — saqlang | Allaqachon | O'zgarishsiz. |
| 9 | Ikkinchi tuzatish aylanishi «agent → push → qayta» ga qisqargan | **Qabul** | 4-qadam: 3-qadamdagi zanjir to'liq — `git diff` → lokal → `git add <fayl>` → commit → push → yangi versiya (mobil — qayta eksport) → o'sha usul bilan. 9.64. |
| 10 | «Tuzatish qilindi» tavsifi — «kodda tuzatish uchun o'zgarish qilindi» | **Qabul** | A-5, takrorlash 8, kartochka 10. |
| 11 | `git diff` asosiy invarianti — faqat muammoga tegishli qatorlar | **Qabul** | 3-qadam: «faqat buzish yozuvidagi muammoga tegishli qatorlar o'zgarganmi — asosiy tekshiruv; yangi tugma, ekran, aloqasiz fayl yo'q»; agentga «muammoga aloqasi yo'q — olib tashla». 9.64. |
| 12 | «bir daqiqagacha Ulanmoqda… kuting» — Render bilan boshqa narsa, yangi son | **Qabul** | → «holati o'zgarganini ko'ring; o'zgarmasa — bu ham natija, yozing». Render «bir daqiqagacha» (1-qadam) — tayanch 6, qoldi. 9.66. |
| 13 | Brauzer sahifani qayta yuklasa — pilotdan keyin uch variantdan bittasi muhrlansin | Allaqachon (⛔) | Shubhali 3 ga uch variant yozildi; MD kutilgan xatti-harakatni oldindan yozmaydi. |
| 14 | Ikki marta bosish — Mentor pilotida deterministik usul bilan ham | Qisman | REPO 5 darvozasi: qo'lda va bir xil takrorlanadigan usul bilan (vosita nomi yozilmadi — tayanch 1.9). O'quvchi — qo'lda (Allaqachon). |
| 15 | «Buzilmadi» ostidagi gap — saqlang | Allaqachon | O'zgarishsiz. |
| 16 | Namuna yozuv — sanoq, eslatma, Telegram, taklif, rejalashtirilgan ishlardan chiqarilganmi | **Qabul** | REPO 5 darvozasi (9.59 davomi). |
| 17 | O'chirilgan yozuv rejalashtirilgan ishlarda qolmasin | **Qabul** | REPO 5 (16 bilan). |
| 18 | `XATOLAR.md` — saqlang | Allaqachon | O'zgarishsiz. |
| 19 | «Buzilmagan usullar»ga qilinmaganlar tushmasin — «Tekshirilmagan usullar» | **Qabul** | 4-qadam prompti ikki qator; `{to'liq yozuv}` — «tekshirilmadi — {sabab}»; fayl kartasi, REPO 2, KOD 8. 9.66. |
| 20 | B rejasiz o'tish ham «uch o'tish» — «uchta demo mashqi» | Qisman | Sarlavha va «uch marta to'liq o'tish» qoldi (menyu osti, DE-205); 1-qadamda uch o'tish ta'rifi: 1 jonli · 2 internet uzilgan holat, B reja bilan tugaydi · 3 jonli (26-band). |
| 21 | «videoni uyda yozasiz» — RAD | **Qabul** | → «Video hali yo'q — ikkinchi o'tishni B rejasiz o'ting; B reja bu darsda tekshirilmaydi.» Uyga vazifa ① videoni «demo o'tishingiz uzunligida» (06-FILTR 21 bilan bir), 60 soniya olindi. 9.66. |
| 22 | Uyga vazifa ② tanish odam — ixtiyoriy | **Qabul** | «Xohlasangiz, …; sherik Amaliyot 2 da javob bergan bo'lsa — shu yetadi»; Nechta: «ikkitagacha (② ixtiyoriy)»; A-9, Izoh, sinf 14, TS13 RAD (05-FILTR 30 bilan bir). 9.66. |
| 23 | 2-savol — tashqi fidbekka | **Qabul** | 1-band bilan. |
| 24 | 2-o'tish yorlig'i «B reja bo'yicha tugadi» / «B reja ochilmadi»; `otishlar[1]` ma'nosi muhrlansin | **Qabul** | 3-qadam belgilari shunday; `otishlar[1].natija: 'ochildi' \| 'ochilmadi' \| null`. 9.65. |
| 25 | «Xatosiz = beshala qadam» B reja o'tishiga mos emas — holat modeli | **Qabul** | `otishlar: [{ tur: 'jonli' \| 'breja', natija: 'rejada' \| 'xato' \| 'ochildi' \| 'ochilmadi' \| null, vaqt }]`; `bReja` olindi; «xatosiz» faqat 1, 3; A-5, A-12, 5-ekran saqlash, 7-ekran, yakun 1, 2-holat, KOD 9, sinf 7, TS6, tayanch 8. 9.65. |
| 26 | Ikkinchi o'tish — B reja ssenariysi deb aniq | **Qabul** | 1-qadam qatori (20-band). |
| 27 | Amaliyot 2 da tuzatilsa — o'sha o'tish qaytadan | **Qabul** | 4-qadam: tuzatish → `git diff` → lokal → push → yangi versiya → o'sha o'tishni qaytadan (natija — oxirgisi). 9.64. |
| 28 | O'tish vaqtlari saqlansin (8, 13-dars uchun) | **Qabul** | `otishlar[i].vaqt` (soniya; baho emas); Taymer qatori; TS7. 9.65. |
| 29 | 3-ekran savoli og'ir — «bo'sh holat» bilan qisqartirish | **Rad** | «bo'sh holat» atamasi 4-ekranda tug'iladi (3-ekran Izohi); auditor ham «current saqlash mumkin». |
| 30 | Kutish / oldini olish farqi — saqlang | Allaqachon | O'zgarishsiz. |
| 31 | «Ekran oq emas» — past mezon | **Qabul** | → «O'yin nomi, «0 / 10» va «Qo'shilaman» ko'rinadi» (47; A-6, 4-ekran karta 2, Yordam); Yordamga umumiy qoida: ko'rinadigan mazmun — sarlavha, son yoki tugma. 9.66. |
| 32 | 4-ekran 1-karta kutishi — pilot muhri ⛔ | Allaqachon | Shubhali 3 (13-band bilan). |
| 33 | Reja sarlavhasi — auditor QABUL | Allaqachon | O'zgarishsiz (P-014). |
| 34 | Hook «Aynan!» / «Qiziq fikr!» | **Rad** | T-028, T-067 (01–06 bilan bir). |
| 35 | Hook to'g'ri javobi «Tekshirmaganman» — saqlang | Allaqachon | O'zgarishsiz. |
| 36 | Uch savol — kurs linzasi, hakam gapi emas; 2-savol tashqariga | Allaqachon / 1 | 1-band bilan. |
| 37 | Proyektorda parol kiritish ko'rinmasin — o'qituvchi eslatmasi | **Qabul** | Amaliyot 1 O'qituvchi eslatmasi: oldindan kiring yoki proyektorni bir lahza o'chiring. 9.66. |
| 38 | `XATOLAR.md` ga o'quvchi so'zi so'zma-so'z — saqlang | Allaqachon | «so'zma-so'z ko'chir» bor. |
| 39 | Agent aytgan sabab — taxmin, diff bilan solishtirish | **Qabul** | 3-qadam va A-9: «sabab — taxmin: `git diff` dagi o'zgarish bilan solishtiring». 9.64. |
| 40 | 90 daqiqa — 110–130, muammo chiqsa 150–210 | Qisman | ⛔ Shubhali 1 ga auditor bahosi; pilotda taymer bilan; ulgurmagan yo'l (A-11) bor. |
| S | Sarlavhalar: asosiy QABUL; 2-ekran — mantiq tuzatilgach | **Qabul** | 2-ekran: «Demo o'tishi qaysi savollarga javob bermaydi?» (44). |
| TS | 1 ✓ · 2 ✓ (+16) · 3 ✓ (13) · 4 ✓ · 5 ✓ · 6 → 25 · 7 → 25, 28 · 8 ✓ · 9 ✓ · 10 → 1 (qisman — kalit o'zgardi) · 11 ✓ · 12 ✓ · 13 → 22 (RAD → ixtiyoriy) · 14 ✓ · 15 → 14 · 16 ✓ · 17 ✓ | | Savollar 18–24: 18 → 1 · 19 → 5 · 20 → 25 · 21 → 9 · 22 → 19 · 23 → 28 · 24 → 16. |

**9 hard fix:** 1 ✓ · 2 ✓ · 3 ✓ · 4 Rad (`.env` tracked — 9.41) · 5 ✓ · 6 ✓ · 7 ✓ · 8 ✓ · 9 Qisman (⛔ pilotda o'lchanadi).

O'lchov bo'limi (`md07/olchov.py` natijasi) — Filtrdan oldingi holat; o'zgargan qatorlarning yangi uzunliklari qavsda skript bilan qo'yildi (2-ekran sarlavha 44, xato izohi 60, xulosa 94, ta'rif 90/82, nishon 44, 4-ekran karta 2 ✔ 47, yakun 1-holat 47).

## Sinf-supurish (13 MD + tayanch, grep)
- **«Loginini ayt»** — faqat 07 da edi (06 — 06-FILTR 1 da); 02, 08 — 05-FILTR da tozalangan. 9.58 ikki darsni ajratadi.
- **«Video ochildi»** / `bReja` — faqat 07; 08, 13 `pm-m12d7-tekshiruv.otishlar` ni o'qimaydi (13 — `urinishlar[]`).
- **«videoni uyda yozasiz»** — faqat 07; 06 da video Amaliyot 2 qadami (loyiha kuni).
- **Uyga vazifa «tanish odam» majburiy** — 05 (05-FILTR 30 — ixtiyoriy), 07 (hozir), 02, 09 — grep «tanish odam»: 09 da faqat distraktor va izohlarda (uyga vazifa emas), boshqalarda yo'q.
- **«ekran oq emas»** — faqat 07.
- **«bir daqiqagacha»** — 06, 07 (Render uyg'onishi, tayanch 6 — qoladi); ulanish belgisi uchun faqat 07 da edi.

## Tekshiruv
`lint:til` 07, tayanch — 0 error · `mdtekshir.py` 07 — 12/12 ekran, arena 3/3/3/3, uzun 0 · `kesishma.py` takror 0 · `lint:prompt` ✓.
