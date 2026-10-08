# 1-dars «Bitta foydalanuvchi sizga qanchaga tushadi?» — tashqi audit (ChatGPT) Filtr bilan, 07.10.2026

Filtr tartibi (`konveyer/1-MD.md`): har band → darsda bormi (grep) → fakt (tayanch, 12-Modul tayanchi, App.jsx) → qonun (QOIDALAR, TAQIQLAR) → tasdiqlangan qaror (`GATE_M_JAVOB.md`) → auditoriya. Hukm: Qabul / Qisman / Rad / Allaqachon + sabab.
Zaxira (tahrirdan oldin): scratchpad `zaxira-01/` (hamma MD, tayanch, MANBA, GATE_M_JAVOB). Tuzatish skripti: scratchpad `f01/tuzat01.py` (79 juftlik, har biri faylda bir marta — skript tekshirgan). F-1007-459.

## 1-qism — dastlabki fikr (tayanch, MANBA, TAQIQLAR bo'yicha; 01 MD hali berilmagan)

| № | Audit | Hukm | Nima qilindi / sabab |
|---|---|---|---|
| 1 | Sarlavhada CAC/LTV yo'q; inglizchasi faqat kartochkada bir marta | Allaqachon | Sarlavha «Bitta foydalanuvchi sizga qanchaga tushadi?»; CAC, LTV — faqat kartochka 1, 2 izohida (A-5, TAQIQLAR 5). |
| 2 | 0 so'm — «tekin» emas: vaqt sarflangan | Allaqachon | 2-ekran `QIzoh`, O'qituvchi eslatmasi, arena 2, kartochka 3, yakun recap. |
| 3 | «0 → 30 000 → mahsulot o'zini oqlaydi» umumiy xulosa bo'lmasin | **Qabul** | 2-qism 1–3 bilan birga yopildi. |
| 4 | Ikki son bir xil odam (to'lovchi) uchun solishtirilsin | Allaqachon | 5-ekran (5 000 ↔ 60 000), 6-ekran, kartochka 8. |
| 5 | 43% — keltiradigan pul emas | Allaqachon | 4-ekran `QIzoh`, 10-ekran D, arena 7, kartochka 10. |
| 6 | Yangi foydalanuvchi 0 → bo'lish yo'q, `null` | Allaqachon | 7-ekran, kod 2-sharti, arena 6, kartochka 11. |
| 7 | Narx va oy taxmin bo'lsa — UI va kalitda taxmin | Allaqachon | Kalit maydonlari `narxTaxmin`, `oyTaxmin`; «taxmin» yorlig'i 4, 5, 7, 9-ekranda. |
| 8 | `tur: 'real' \| 'mashq'` | Allaqachon | A-11, KOD 8; 4 va 11-darslar `tur: 'mashq'` sonini o'quvchiniki deb ko'rsatmaydi (grep). |
| 9 | Real pul yo'q | Allaqachon | A-8: reja kulrang qatori, 2-ekran, uyga vazifa osti. |
| 10 | Kod hisoblasin, «biznes yaxshi» degan qaror chiqarmasin | Allaqachon | O'quvchi qatorida xulosa yo'q (A-10); 2-qism 23–24 bilan aniqlashtirildi. |
| 11 | `00-MANBA.md` da App.jsx `id: '11'` «hali YO'Q» — eskirgan | **Qabul** | Haq: blok 07.10 14:01 da qo'shilgan (jurnal F-1007-450). MANBA sarlavha qatori: «✅ 07.10 14:01 qo'shilgan, `comp` siz — qayta yaratilmaydi». Tayanch va MD larda bu xato yo'q edi (grep). |

## 2-qism — 01 MD ning to'liq auditi

Audit bahosi 7/10 (pedagogika 9 · atamalar 9 · o'z mahsuloti 8.5 · pul/PM aniqligi 5.5 · testlar 8.5 · 90 daqiqa 6). Hukm: **Qabul 16 · Qisman 3 · Rad 1 · Allaqachon 10** (+ «Allaqachon + muhrlandi» 6-band).
⚠️ **Tasdiqlangan matnni o'zgartiradigan Qabul (foydalanuvchiga alohida):** tayanch 1.1 asosiy fikri (GATE M «T ✓») va 9.17, 9.18, 9.19 kelishuvlari (M-q0 A bilan tasdiqlangan) — 1, 2, 3, 4-bandlar. Qaror-0 matni (17-band) o'zgarmadi: unda «o'zini oqlaydi» yo'q.

| № | Audit | Hukm | Nima qilindi / sabab |
|---|---|---|---|
| 1 | «Jalb qilish narxi keltiradigan puldan kam bo'lsagina mahsulot o'zini oqlaydi» — kuchli da'vo: hisobda faqat kanal puli bor | **Qabul** | Haq. «-gina» mantiqan zarur shart edi, lekin muhr bilan birga yetarli shartdek o'qilardi (T-045 — soddalashtirish yolg'on model yasamaydi; tayanch 7, sinf 5). Yangi asosiy fikr (A-2, tayanch 1.1, 9.17): «Keltiradigan pul to'lovchini jalb qilish narxini qoplashi kerak; mahsulotni ushlab turish puli hisobda yo'q.» (108). 5-ekran xulosasi: «… qoplashi kerak; bu misolda qoplamaydi — zarar.» (95). «xarajat» so'zi ishlatilmadi — 4-dars atamasi (A-5). |
| 2 | Muhr «o'zini oqlaydi» — juda keng | **Qabul** | Muhrlar: «qoplanadi» · «zarar» · «teng» · «noma'lum» · «pul sarflanmagan»; ostida doimiy qator «Bu hisobda faqat kanallarga sarflangan pul bor — mahsulotni ushlab turish puli kirmagan.» (88). «zarar» qoldi — u aniq: kanal pul qaytarmaydi, boshqa sarflar faqat yomonlashtiradi. «o'zini oqlaydi» — A-5 «Ishlatilmaydi», tayanch 2 da yangi qator. |
| 3 | Sarf 0 bo'lsa muhr ko'rsatilmasin: 0 < 30 000 hech narsa demaydi | **Qabul** | Yangi holat `'sarfsiz'` — muhr «pul sarflanmagan» (kulrang), halol qator «Kanallarga pul sarflanmagan — vaqt sarflangan, u bu songa kirmaydi.» (67). Ko'p o'quvchida aynan shu holat (O'qituvchi eslatmasi). |
| 4 | Tenglik — «noma'lum» emas, «teng» | **Qabul** | Matematik jihatdan haq — mening TS 4 qarorim (9.19) noto'g'ri edi. `xulosa` ga `'teng'`; halol qator «Ikki son teng: jalb qilish narxi zo'rg'a qoplanadi.» (51; «zo'rg'a qoplanadi» — tayanch 1.4 so'zi). `xulosa` ni hech bir dars o'qimaydi (grep 02–12: 4 va 11-dars faqat `narxTaxmin`, `tur`; 2-dars `kimTolaydi`) — o'zgarish xavfsiz. |
| 5 | Bitta to'lovchi darajasida solishtirish — eng yaxshi qaror, saqlansin | Allaqachon | O'zgarishsiz. |
| 6 | O'quvchi formasida to'lovchilar soni yo'q → xulosa `nomalum` qat'iy bo'lsin | Allaqachon + muhrlandi | KOD 8 da bor edi (③); endi **o'zgarmas shart** sifatida yozildi: `kimTolaydi` rol matni yoki `null` bo'lsa — `'nomalum'`, hamma foydalanuvchi narxi to'lovchi puli bilan hech qachon solishtirilmaydi (KOD 8 ④, tayanch 9.19). `node` namunalari ①–⑤ har biri. |
| 7 | Kod o'quvchi uchun xulosa chiqarmaydi — saqlansin | Allaqachon | O'zgarishsiz. |
| 8 | «44 kishi shu uch kanaldan keldi» — isbotlanmagan bog'lash | **Qabul** | Tekshirildi: 12-Modul tayanchi 1.6 — kanal bo'yicha faqat lendingga tashrif (`?kanal=`, Umami), ro'yxatdan o'tish kanalga bog'lanmagan; «Havolani ulashish» ham bor edi. 2-ekran Mentori: «Mentor shu davrda kanallarga post yozgan — …»; odam belgilari kanal kartalaridan «tushmaydi» — umumiy maydon «Shu davrda ro'yxatdan o'tganlar»ga kiradi; qator «Shu davrda yangi foydalanuvchilar: 44 kishi»; reja vizuali ham. |
| 9 | 0 / 44 — sodda hisob deb chegaralansin | **Qabul** | 2-ekran O'qituvchi eslatmasi: «Bu — sodda hisob: shu davrdagi hamma yangi foydalanuvchi olinadi … «44 kishi shu kanallardan keldi» demang.»; A-6 va tayanch 1.1 ga qator. Ta'rifning o'zi («bir davrda … shu davrda kelgan») allaqachon davrga asoslangan — o'zgarmadi. |
| 10 | «Bepul kanallar chegarali» — umumiy qonun emas, Mentor misoliga | **Qabul** | 2-ekran `QIzoh`: «… Guruh va sinf chatidagi a'zolar soni cheklangan.» (95) · arena 9 savoli «Mentor misolida bepul kanallar nega chegarali?» · kartochka 4 · 7-ekran halol qatoridan «Bepul kanallar chegarali» olib tashlandi (o'quvchining kanallari haqida da'vo edi) · tayanch 1.1. |
| 11 | Hookdagi «Aynan!» / «Qiziq fikr!» olib tashlansin («12-Modulda tozalangan») | **Rad** | T-028 (hookda neytral «Qiziq fikr!»), T-067 (hook javobi shakli) — kurs qonuni; tayanch 7: «tashqi auditda har safar rad». Auditorning «12-Modulda ketma-ket tozalangan» degani faktga zid: 12-Modulda 9 darsda **rad** etilgan, 12-Modul 12-dars hooki aynan shu naqshda (J-026 bilan, `12-PmGrowthPitch-v3.md` 132–134). A javobi «Pulda — rost» deb tan oladi — uyaltirmaydi. TS 17 ga yozildi. |
| 12 | 4-ekran bashorati «bir nechtasi» — o'lchanmaydigan toifa; «o'yinchi ham, tashkilotchi ham to'laydimi?» qilinsin | **Qisman** | «bir nechtasi» → **«ozchiligi»** (yarmidan kam — aniq toifa; S-015 tartibi saqlandi), natija «aslida: ozchiligi — 44 kishidan 6 tasi». Ssenariy-savol rad: «kim to'laydi» — shu ekranning kashfiyoti (tugmalar), bashorat uni ochib qo'yardi (P-036). |
| 13 | Pro 1-darsda — 2-darsning kashfiyotini ochadi (shartli qabul: 2-dars solishtirib asoslasin) | Allaqachon | Shart bajarilgan: 2-dars bashorati «Bu yo'llardan nechtasi Maydon Jamoa'ga hozir mos keladi?» — besh yo'lni qo'yib ko'rish darsi, «sirli javob» emas (02 MD 188; tayanch 9.21: 1-darsda Pro «Mentorning rejasi»). |
| 14 | 43% va 3 oy aralashmaydi — saqlansin | Allaqachon | O'zgarishsiz. |
| 15 | 3 oy — doim taxmin | Allaqachon | O'zgarishsiz. |
| 16 | «Keltiradigan pul ≠ foyda» bir marta aytilsin | **Qabul** | Muhr osti doimiy qatori, A-2, yakun recap («Ikki son bitta to'lovchi uchun solishtiriladi; mahsulotni ushlab turish puli bu hisobga kirmaydi.»), 5-ekran O'qituvchi eslatmasi. «foyda» so'zi ishlatilmadi (A-5: bu darsda yo'q; 2-darsda K2 «foydaga chiqqan» bilan to'qnashmasin — 9.37). |
| 17 | 7-ekran formasi — saqlansin | Allaqachon | O'zgarishsiz. |
| 18 | «12 oydan ko'p» yumshoq ogohlantirish — asossiz chegara | **Qabul** | Haq — 12 manbasiz son (P-028 ruhi). Tekshiruv va «Yorliq» qatori o'chirildi; 7-ekranda yumshoq tekshiruv qolmadi («hammasi bloklaydi»). |
| 19 | Tenglik gapi «oqlaydimi-yo'qmi, aytib bo'lmaydi» noto'g'ri | **Qabul** | 4-band bilan. |
| 20 | Sherik tekshiruvi uch savoli — saqlansin | Allaqachon | O'zgarishsiz. |
| 21 | ✕ dan keyin «son o'zgarmadi» — muammo sonda bo'lmasligi mumkin | **Qabul** | Haq, va o'z topilmam: 1 va 3-savolga kartada mos maydon yo'q (manba, taxmin yorlig'i) — o'quvchi to'g'ri sonni o'zgartirishga majbur bo'lardi. Endi: izohga mos joyni o'zgartirish **yoki** karta ostidagi «Aniqlik: …» qatori (≤ 80, dars progressida, kalitga yozilmaydi). `QXato`: «Izohga mos joyni o'zgartiring yoki aniqlikni yozing.» (52); Mentor gapi «… izohiga mos joyni aniqlashtiring»; xulosa «✕ qatorlar aniqlashtirildi.» |
| 22 | ✕ o'chmasligi — saqlansin | Allaqachon | Yorliq «o'zgartirildi» → «aniqlashtirildi» (21-band bilan). |
| 23 | Kalit yo'q bo'lsa Mentor sonlari «Mahsulotim» deb chiqadi | **Qabul** | `meniki` ga `yorliq`: kalit yo'q yoki `tur: 'mashq'` — «Mashq», `tur: 'real'` — «Mahsulotim»; chiqish qatorlari `meniki.yorliq` dan. Kod 50 qator, eng uzuni 65 (≤ 70). |
| 24 | `som(null)` keltiradigan pul uchun «bo'lib bo'lmaydi» — noto'g'ri | **Qabul** | `pulMatn` — `null` bo'lsa «noma'lum»; «bo'lib bo'lmaydi» faqat yangi 0 da. O'z topilmam: KOD 10 da `oy` yo'q bo'lsa `0` edi → «0 so'm» chiqardi; endi `null` → «noma'lum» (`menPul` sharti `narx` yoki `oy` `null`). |
| 25 | `jalbNarxi(…, 0)` → `null` | Allaqachon | O'zgarishsiz. |
| 26 | 10-ekran: savolda taxmin borligi aytilmagan — B ham himoyalanadi | **Qabul** | Savol: «Narx va oy taxminingiz bor, hech kim to'lamagan. Keltiradigan pulni qanday yozasiz?» (12 so'z — S-001 chegarasida). Variantlar va ✔ A o'zgarmadi; Izoh (MD): taxmin umuman yo'q holat — 7-ekrandagi «Hozircha bilmayman», ziddiyat yo'q. |
| 27 | Uyga vazifa ② — «o'zini oqlashi uchun» | **Qabul** | «… pullik kanal o'z pulini qoplashi uchun bitta to'lovchini jalb qilish narxi necha so'mdan oshmasligi kerak?» |
| 28 | Uyga vazifa ① — «ota-ona yoki tanishingiz» keng; «tanish katta odam» | **Qisman** | «Kim bilan: ota-ona yoki sinfdosh» — TAQIQLAR 3 / Qaror-0 11 xavfsiz ro'yxatidan. «Faqat katta odam» rad: ① — o'z sonini tushuntirish, narx so'ralmaydi, pul haqida kelishilmaydi; sinfdosh — tasdiqlangan xavfsiz doirada. |
| 29 | 90 daqiqa optimistik (100–115) | **Qisman** | Bu ham taxmin, o'lchov emas — ⛔ «qur» pilotida taymer (sinf 1). A-12 ga oldindan belgilangan qisqartirish tartibi: 90 dan oshsa — 8-ekran yakka rejimga, 9-ekran uyga. Shubhali 1 ga audit bahosi. |
| Sarl. | 5-ekran «Pullik kanal Mentor misolida o'zini oqlaydimi?» → «pulini qoplaydimi» | **Qabul** | «Pullik kanal Mentor misolida o'z pulini qoplaydimi?» (51). 6-ekran savoli ham: «Mentor misolida pullik kanal o'z pulini qoplashini qaysi sonlar ko'rsatadi?» (10 so'z; «qoplash» variantlarda yo'q — S-008). Qolgan sarlavhalar — auditor tasdiqladi. |
| TS | TAYANCHGA SAVOL 1–18 qarorlari | — | 1, 2, 5, 6, 8, 9, 10, 11, 12, 13, 15, 16 — auditor qabul qildi (3, 15, 16 yuqoridagi tuzatishlar bilan); 4, 7, 18 — Qabul (1–4-bandlar); 14 — Qisman (12-band); 17 — Rad (11-band). Holat qatorlari MD «TAYANCHGA SAVOL» da. |
| TS+ | Auditorning yangi savollari 19–22 | Javob berildi | 19 → «qoplanadi» faqat kanal puli haqida, doimiy qator bilan · 20 → kalitda `'qoplanadi'` · 21 → keltiradigan pul `null` — «noma'lum» · 22 → savolda aytiladi (26-band). Ochiq savol qolmadi. |

## Sinf-supurish (12 MD + tayanch, grep va ko'z bilan)
- «o'zini oqlaydi» / `'oqlaydi'` — 02–12 da **0** (grep «oqla» topgan 20 ta joy (19 qator) — «yumshoqlari», «bayroqlari» so'zlari ichida, soxta signal; ko'z bilan ko'rildi); tayanch 1.1, 2, 8, 9.17–9.19 — yangilandi.
- «Bepul kanallar chegarali» umumiy gapi — 02–12 da 0. «… kanallardan keldi / kelgan» bog'lash — 02–12 da 0.
- «Son o'zgarmadi» (✕ dan keyin son talab qilish) — 02 da «Karta o'zgarmadi»: u yerda sherik savollari kartadagi matn maydonlariga aynan mos (kim · nima · sabab) — sinf emas, tegilmadi. Boshqalarda 0.
- Manbasiz son chegarali yumshoq ogohlantirish — 02–12 da 0 (06 dagi «1 000 va undan katta» — narxni savol qatoridan ajratadigan belgi, bloklaydigan, sinf emas).
- Uyga vazifa «Kim bilan: ota-ona yoki tanishingiz» — **02 va 04 da ham** (① — model / narxni bir kishiga tushuntirish) → «ota-ona yoki sinfdosh». 06, 09 — real suhbat va tasdiq darslari, o'z xavfsizlik qatorlari bilan (tayanch 1.6, 1.9) — tegilmadi; 11 — «o'zingiz».
- Kod oynasidagi fallback va `null` matni — boshqa kod oynalari: 03 (`qabulQil`, Mentor namunasi «haqiqiy Backend emas»), 02 (Neon SQL) — o'quvchi yorlig'i bilan Mentor sonini chiqaradigan joy yo'q (grep «Mahsulotim»: 02 da faqat nom zaxirasi).

## Tekshiruv
- `lint:til`: 01 — TOZA · 02 — 0 error (1 warn — zaxirada ham) · 04 — TOZA · tayanch — 0 error (25 warn — zaxira bilan bir xil; o'z tahririmdagi «≠» belgisi topilib, so'zga almashtirildi) · MANBA — 3 error zaxirada ham bor (rasmiy iqtiboslar).
- `qisqa.py` 01: 14 ekran, arena 3/3/3/3, sarlavha >55 yo'q · 02: 15 ekran · 04: 12 ekran (skript A1/A2 ni sanamaydi — 10).
- Qavsdagi uzunliklar qayta sanaldi (Python `len`): qo'lda yozgan 5 sonim 1–4 belgiga xato chiqdi — tuzatildi; A-2 birinchi yozilganda 111 edi (≤110 dan oshgan) — qisqartirildi (108). «O'lchov» bo'limiga F-1007-459 qatori.
- ✔ o'rinlari o'zgarmadi (3 — B · 6 — D · 10 — A; arena A·B·C·D ×3); arena 8 A uzunligi 27 → 29 (farq 12%, ✔ D yolg'iz eng uzun emas).
