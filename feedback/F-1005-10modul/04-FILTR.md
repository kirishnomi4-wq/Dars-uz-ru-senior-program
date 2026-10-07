# 4-dars «Ikki variantdan qaysi biri yaxshiroq ishlaydi?» — tashqi audit (ChatGPT) Filtr bilan, 05.10.2026

Audit bahosi 7.5/10 (pedagogika 9 · A/B arxitekturasi 8.5 · eksperiment mantig'i 6.5). Hukm: **Qabul 14 · Qisman 3 · Rad 1 · O'zgarishsiz 3**. Zaxira: scratchpad `04-oldin-filtr.md`.

| № | Audit | Hukm | Nima qilindi / sabab |
|---|---|---|---|
| 1 | A/B test «chunki» ni (sababni) isbotlamaydi — faqat raqam o'zgardimi | **Qabul** | Rost (T-045: soddalashtirish yolg'on model yasamaydi). 2-ekran: yangi `QIzoh` «"Chunki" — nega shunday kutayotganimiz. A/B test raqam o'zgardimi — shuni ko'rsatadi, sababni o'zi isbotlamaydi»; O'qituvchi eslatmasi (matn aniqligi, tugma uzunligi, tasodif). 2-ekran xulosasi — «qanday natija va nega kutayotganimizni» qo'shildi. |
| 2 | «A va B bir vaqtda — ikki guruh bir xil sharoitda» — juda kuchli | **Qabul** | Yakun: «…boshqa vaqtga xos o'zgarishlar kamroq aralashadi»; arena 5 ✔ «Boshqa vaqtning farqi aralashmasligi uchun» (✔ o'rni A o'zgarmadi). |
| 3 | «Gipotezaning raqami — o'zgarish turgan qadamning foizi» universal emas | **Qabul** | Yakun: «Bu misolda raqam — o'zgarishga eng yaqin qadamning foizi»; recap 3 «Bu misolda…». |
| 4 | 3-ekran: B (haftalik bandlar) ham ta'sirlanadi — «asosiy / eng yaqin raqam» deb so'ralsin | **Qabul** | Savol «…Unga eng yaqin raqam qaysi?»; B izohi «Bandlar ham o'zgarishi mumkin — lekin strelkadan uzoqroq». ✔ o'rni (C) o'zgarmadi. **O'zim topgan:** 2-ekrandagi «haftalik bandlar» bo'lagi ham `QXato` edi → `QIzoh` (xato emas, 01-FILTR 4 bilan bir xil). |
| 5 | Maydon'da birlik — brauzer, «odamlar» emas | **Qisman** | Umumiy A/B ta'rifi («odamlarning bir qismi») — tayanch ta'rifi, qoladi; «Maydon» qismlari allaqachon «brauzer» (5-ekran qatori, kartochka 8, A1, A2). 8-ekran va umumiy xato izohi «kishi» → «brauzer» / «ma'lumot». |
| 6 | Foiz har variant ichida hisoblanadi — denominatorlar aralashmaydi | **Qabul** | A2 natija ostida `QIzoh`: «A ning foizi faqat A ni ko'rgan brauzerlardan, B niki — faqat B ni ko'rganlardan». |
| 7 | «17 ta brauzer kam» — saqlansin; «Hali kam kishi» → «Ma'lumot hali kam» | **Qabul** | 8-ekran ✔ variant «Ma'lumot hali kam — test davom etadi». Statistika (significance) o'rgatilmaydi — auditor ham shunday. |
| 8 | 8-ekran A «B yaxshiroq» — allaqachon xulosa | **Qabul** | A: «B yutdi — hammaga B ni qo'yamiz» (noto'g'ri e'tiqod ochiq ko'rinadi; savol matni takrorlanmaydi — S-008). |
| 9 | «Taxminan yarmi A, yarmi B» — kichik guruhda yo'q | **Qabul** | A1 Yordam: «A yoki B ni teng ehtimol bilan olsin»; O'qituvchi eslatmasi — kichik guruhda teng bo'linmaydi. |
| 10 | A1: «ikkinchi matn chiqmaguncha inkognitoni qayta oching» — omadga bog'liq | **Qabul** | «O'sha matn yana chiqishi ham to'g'ri — tasodif. Ikkala matnni sinfdoshlar telefonida ko'rasiz (Amaliyot 2).» |
| 11 | `synchronize: true` — 8-darsgacha migratsiya qat'iy reja bo'lsin | **Qisman** | A1 O'qituvchi eslatmasi: «kursdagi vaqtinchalik sozlama; eski teg prodga yuborilmaydi; prod'da xavfli — 8-dars «keyin»». Migratsiyani 8-darsda majburiy qilish — **Rad**: foydalanuvchi GATE M M-q2 A da «kod o'zgarmaydi, migratsiya — keyingi modullarda» deb qaror qilgan. |
| 12 | A2 «5 soniya ichida» va Render «taxminan bir daqiqa» | **Qisman** | «5 soniya ichida» — 3-dars Filtrida tuzatilgan edi. Render: manbali fakt qoladi, shakli «kechikishi mumkin — taxminan bir daqiqagacha». Sinf-supurish: 7, 9-darslar ham shunday. |
| 13 | Uyga vazifa: 3–5 kishi bilan xulosa chiqarilmasin | **Qabul** | Kulrang qator: «Bir-ikki kishi kirsa ham yozing — bu kuzatuv, xulosa emas.» |
| Booking | 2017 / 1000+ — bank bilan mos bo'lsin; universal xulosa chiqmasin | **Qabul** | Raqam bank (K9) bilan mos (MD «Manbalar»). Xulosa: «**Booking.com'da** yangi o'zgarish avval foydalanuvchilarning bir qismida tekshiriladi…» |
| 2-ekran | Gipoteza mexanikasi kuchli | **O'zgarishsiz** | — |
| Sarl. 3 | «Kun strelkalari uchun asosiy raqam qaysi?» | **Qabul** | 4-band bilan («eng yaqin raqam»). |
| Sarl. 8 | «B foizi yuqori. Xulosa qilishga yetadimi?» | **Rad** | Variantlar — harakatlar («… qo'yamiz», «test davom etadi»); savol «ha/yo'q» bo'lsa variantlar qayta yozilardi. Mazmun 7–8-bandlar bilan yopildi. |
| Sarl. 10 | Yakun «Gipoteza endi raqam bilan tekshirilmoqda.» | **Qabul** | Natija-gap shakli saqlandi, «odamlarga» olindi. |
| Taq. | Mentor gipotezasi, «Raqam» bo'lagi, butun foiz, `variant` tekshiruvi, kulrang raqamsiz maket, namuna ism/telefon | **O'zgarishsiz** | Auditor tasdiqladi. |

**Sinf-supurish:** «bir xil sharoit», «taxminan yarmi», «o'zgarish turgan qadam» (universal), «Hali kam kishi» — 11 MD: faqat 4-darsda edi. «taxminan bir daqiqa kechikadi» — 7 va 9-darslar → tuzatildi. lint:til 04, 07, 09 — 0.
