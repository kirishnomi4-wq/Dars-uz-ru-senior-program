# 1-dars «Mahsulotingizni bir sahifada qanday tanishtirasiz?» — tashqi audit (ChatGPT) Filtr bilan, 06.10.2026

Filtr tartibi (`konveyer/1-MD.md`): har band → darsda bormi (grep) → fakt (App.jsx, oldingi darslar, tayanch) → qonun → tasdiqlangan qaror → auditoriya. Hukm: Qabul / Qisman / Rad + sabab.
Zaxira (tahrirdan oldin): scratchpad `zaxira-1531/`.

## 1-qism — dastlabki fikr (tayanch bo'yicha; 01 MD hali auditorga berilmagan), 06.10 15:35, F-1006-354

| № | Audit | Hukm | Nima qilindi / sabab |
|---|---|---|---|
| 1 | `00-MANBA.md` eskirgan: App.jsx da `id: '10'` «yo'q» deb turibdi — agentlar uni qayta yaratishga urinishi mumkin | **Qabul** | Haq: blok 06.10 12:51 da qo'shilgan (grep: `src/App.jsx` — `id: '10'`, 13 qator). MANBA sarlavha qatori va 2-bo'lim yangilandi: «✅ 12:51 dan bor … qayta yaratilmaydi; «qur» da faqat `comp` va import». Tayanch va topshiriqlarda bu gap yo'q edi (grep — faqat MANBA). |
| 2 | «Qanday qo'shilaman» matni «Ilova tayyorlanmoqda — o'rnatish havolasi shu yerda paydo bo'ladi.» 11-Modul oxiriga mos emas (ilova bor, telefonda ishlaydi, Demo Day 7 dan o'tgan); «paydo bo'ladi» — va'da | **Qabul** (tasdiqlangan matnni o'zgartiradi — pastda) | Haq, ikki sabab bilan: (1) tayanch 1.0 — ilova 11-Moduldan bor; yo'q narsa — ommaviy o'rnatish yo'li, «tayyorlanmoqda» o'quvchini «ilovam hali yo'q» deb adashtiradi (T-044, T-045); (2) «paydo bo'ladi» — kelajak va'dasi: TAQIQLAR 1 «lendingda faqat hozir ishlaydigan narsa», 01 MD ning o'z tekshiruvi ham (9-ekran) «bo'ladi» ni kelajak belgisi deb ushlaydi — MD o'ziga zid edi.
Yangi matn (auditor taklifi, birinchisi): **«Hozircha o'rnatish havolasi yo'q.»** — rost va 7-darsgacha eskirmaydi; 7-darsda bo'lim ikki havolaga almashadi (tayanch 1.7). Qiziqish o'lchovi o'zgarmaydi (tugma bosilishi Umami'da).
Qo'llandi: tayanch 1.1 (izoh bilan) · 01 MD (4 joy: A-6 jadvali, 6-ekran harakati, 11-ekran namuna va Mentor talabi) · 07 MD (5 joy) · `GATE_M_JAVOB.md` 17 ga belgi (asl qator tarix uchun qoladi). ⚠️ Bu Qaror-0 17 (LEND-q0 A) dagi matn — foydalanuvchiga hisobotda aytildi. |
| 3 | Lendingda «eslatma keladi», «ro'yxat o'zi yangilanadi» yo'qligi — to'g'ri | Allaqachon | Tayanch 1.1 «Qoida (halollik)». |
| 4 | Zanjir «funksiya → foyda → sahifa matni → lending → 5 soniyalik sinov → tuzatish → internetga chiqarish» saqlansin | Allaqachon | 01 MD ekran tartibi (4 → 9 → 10 → 11) aynan shu. |

**Sinf-supurish** («lending / postda kelajak va'dasi», 12 MD, grep `paydo bo'ladi|tez orada|yaqinda|shu hafta chiqadi`): o'quvchi matnida boshqa topilma yo'q — qolgan «paydo bo'ladi» lar ekran harakati tavsifi (yorliq paydo bo'ladi). «Ilova tayyorlanmoqda» qoldig'i — 0 (faqat tayanch izohida tarix sifatida). ⚠️ **06-FILTR 1 (06.10): bu supurish xato edi** — 6-dars Mentor postidagi va tayanch 1.6 dagi «Ilova shu hafta chiqadi» topilmay qolgan; 06-FILTR da tuzatildi.

## 2-qism — 01 MD ning to'liq auditi, 06.10 15:45, F-1006-355

Audit bahosi 7.5/10 (pedagogika 9 · PM mazmuni 8.5 · 11 → 12 continuity 7 · texnik aniqlik 6 · 90 daqiqa 6). Hukm: **Qabul 12 · Qisman 4 · Rad 1 · Allaqachon / o'zgarishsiz 9**. Zaxira: scratchpad `zaxira-1531/` (01, 07, tayanch).

| № | Audit | Hukm | Nima qilindi / sabab |
|---|---|---|---|
| 1, 26 | «Ilova tayyorlanmoqda» — 11-Modul holatiga zid; hamma joyda (A-6, 6, 11-ekran, Yordam, arena 5) bir xil o'zgarsin | **Qabul** | 1-qismda (2-band) qilingan; endi arena 5 ham: ✔ «Hozircha o'rnatish havolasi yo'qligi» (36; boshqa variantlar 37–40, ✔ o'rni D o'zgarmadi). Grep: «tayyorlan» — 01 da 0. |
| 2 | Instagram ko'prigi «bir va'da, bir tugma» — darsning uch foydali lendingiga zid | **Qabul** | Haq: sahifada sarlavha, osti, uch foyda, bitta tugma. 7-ekran xulosasi: «Bu voqeada hamma funksiya oldinga chiqarilmagan. Lendingda ham — muhim foydalar va bitta tugma.» (95); A-bo'lim ko'prigi, ip qatori, O'qituvchi eslatmasi, tayanch 5 (K3) — shu ma'noga. «Bu voqeada» — T-043 chegarasi. |
| 3 | `pm-m10d1-lending` da mahsulot nomi yo'q — TS 8 ning o'zi «6-dars nomni shu kalitdan oladi» deydi (zid) | **Qabul** | `nom` kalitga qo'shildi (`pm-m9d4-final.goya` dan; yo'q bo'lsa 9-ekranda «Mahsulot nomi» maydoni). Tayanch 8, KOD 9, 9-ekran. 6-dars MD si nomni hozircha boshqa joydan o'qimaydi (grep) — ziddiyat yo'q. |
| 4 | Umami hodisa nomi tahrirlanadi, lekin saqlanmaydi — 6, 7, 10-darslar qayerdan biladi | **Qabul** (A + B) | `hodisa` kalitga qo'shildi; nom tugma yozuvidan yasaladi va **tahrirlanmaydi** (ikkalasi: aniq va saqlangan). Tayanch 1.1, 8; KOD 9, 11. |
| 5 | `funksiyaQatori: [3]` — rasmiy qo'shilsin | Allaqachon | Tayanch 9.21 va 8 (14:14). |
| 6 | `sinov.tur: 'real'` — «real» 11-Modulda «auditoriyadan» ma'nosida; `sherik` aniqroq | **Qabul** | `tur: 'sherik' \| 'mashq'` — 10-ekran, A-bo'lim, KOD 10, tayanch 8 va 9.13. O'quvchi matnida so'z o'zgarmaydi («besh soniyalik sinov» / «mashq»). Boshqa MD lar `sinov.tur` ni o'qimaydi (grep). |
| 7 | «Mos keldi / kelmadi» saqlanmaydi | **Qabul** | `sinov.mos: [bool × 3]` — arzon va keyingi tuzatish uchun foydali; tayanch 8. |
| 8 | «Bu nima? → sarlavha» umumiy UX haqiqati emas | **Qabul** | 10-ekran 3-qismiga kulrang qator: «Bu mashqda: javob mos kelmasa, chiziq ko'rsatgan bo'lakni qayta ko'rasiz.» — bog'lash mashq yordamchisi. |
| 9, 15, 16, 19, 22, 23, 24 | 9-ekran tekshiruvlari · Umami yo'q bo'lsa ham tugma ishlashi · git doirasi · foyda mashqi · trek chipi · holatli yakun · «ikki kishi — kuzatuv» | O'zgarishsiz | Auditor tasdiqladi. «Umami yuklanmasa ham tugma ishlasin» endi uyga vazifa ② talabida. |
| 10 | Kelajak so'zlari detektori soxta signal berishi mumkin («Rejangiz aniq bo'ladi») | **Rad** (o'zgarishsiz) | Yumshoq ogohlantirish, ikkinchi «Saqlash» bilan o'tadi (PM-032 — ≥8 namuna sinovi KOD da) — auditor ham «qoldirish mumkin» degan. |
| 11 | 11-ekran 22 daqiqaga sig'maydi (Umami + agent + push + Netlify + telefon + Umami tekshiruvi) — kamida 30–35 | **Qisman** | Haq — 20 dan ortiq ish. Netlify darsda qoladi (dastur natijasi — «lending e'lon qilingan»); **Umami ulanishi uyga vazifa ② ga** ko'chdi (sahifa manzili ham shunda ma'lum — Domain `localhost` kerak emas). Blok ≈30 daqiqa; vaqt: 2–8 → 24, matn → 13, sinov → 7, yakun qismi → 11 (jami 90). 6-ekrandagi Umami tushunchasi qoladi. Haqiqiy vaqt — pilotda taymer bilan. |
| 12 | Netlify Base/Publish qiymatlari tekshirilmagan — o'quvchiga aniq yo'riq bermang | **Qisman** | Rasmiy hujjat qayta o'qildi (06.10): «Publish directory … is relative to the base directory, which is root by default». Avvalgi «base `lending` + publish shu papka» noaniq edi → **base bo'sh, build bo'sh, publish `lending`** (hujjatdan bir ma'noli). Build command bo'sh qolishi hujjatda yozilmagan — «qur» da Mentor repo'sida real deploy bilan tasdiqlanadi (TS 10 ochiq, Shubhali joylar). GATE M → «qur» tartibi shu (MD «qur» dan keyin yakuniy holatga keladi). |
| 13 | Umami «Views» / «Events» nomlari bugun tekshirilmagan | **Qabul** | «Websites», «Add website», «Save», «Edit», «Tracking code» — docs.umami.is dan 06.10 qayta o'qildi. «Views»/«Events» yorliqlari o'quvchi matnidan olindi — «hodisalar orasida» (umumiy so'z). |
| 14 | «Bu sizning xatongiz emas» — sabab noma'lum (sozlama ham bo'lishi mumkin) | **Qisman** | P-026 ohangni talab qiladi (aybni o'quvchidan olish), lekin bu gap har holatda rost emas (T-045; 11-Modul 16-FILTR 38 da ham olib tashlangan). Almashtirildi: «Sahifa ochilmasa — avval Netlify sozlamasida Publish directory `lending` ekanini tekshiring; keyin xato qatorini agentga yuboring (`.env` qiymatlarini emas).» Ayblovchi so'z yo'q — ohang saqlandi. |
| 17 | «Ortda qoldingizmi» dagi `git checkout -f` o'z repo'sida ishlatilsa o'zgarishlarni o'chiradi | **Qabul** | Qator: «o'z repo'ngizdan tashqarida, yangi papkada oching … oxirgi buyruqni faqat shu yangi papkada ishlating: u papkadagi o'zgarishlarni o'chiradi». Tayanch 3 ga qoida. |
| 18 | Web-trek CTA manzili saqlanmaydi | O'zgarishsiz | Auditor: hozir keyingi darslarga kerak emas, to'qimaymiz. |
| 20 | «Bir bosishda jamoadasiz» — to'lgan o'yinda navbat bor | **Rad** | Tekshirildi: 11-Modul tayanchi 1.7 — to'lgan o'yinda «Qo'shilaman» o'rnida «O'yin to'ldi» / «Navbatga yozilish»; «Qo'shilaman» faqat joy bor o'yinda turadi — foyda rost. TS 15 ga yozildi. |
| 21 | «Kim aniq kelishini o'yindan oldin bilasiz» — «Kelaman» o'yin kuni | O'zgarishsiz | Auditor: zid emas (o'yin kuni ham o'yindan oldin). |
| 25 | Uydagi sinov natijasi qog'ozda — keyingi darslarga kerakmi? | **Qabul** (izoh) | Kerak emas: keyingi darslar sahifa matnini o'qiydi, sinovni emas. Yakun izohiga: «Uydagi sinov natijasi platformaga yozilmaydi — o'quvchi sahifasini o'zi tuzatishi uchun.» |
| Sarl. | Sarlavhalar | O'zgarishsiz | Auditor tasdiqladi. |
| TS | TAYANCHGA SAVOL 1–13 qarorlari | Qabul / yopildi | 5 → `sherik`, `mos` · 7 → Umami uyga, Domain — sahifa manzili · 8 → `nom` · 10 → yangi qiymatlar, «qur» da · 13 → 9.21; yangi 14 (`hodisa`) va 15 (20-band). Holat qatori — MD «TAYANCHGA SAVOL» boshida. |

**Sinf-supurish (12 MD):**
- `git checkout -f` himoya gapi — «Ortda qoldingizmi» qatorlariga qo'shildi: 02 (2), 03 (2), 04 (3), 05 (2), 07 (2), 08 (2), 09 (3), 10 (1), 01 (1); 06, 11, 12 — blok yo'q, 0. KOD dagi `ortda` izohlari (o'quvchi ko'rmaydi) — o'zgarmadi.
- «bu sizning xatongiz emas» — 06 (1) va 07 (1) da ham aniq qadamga almashtirildi; boshqalarda 0.
- Mahsulot nomi va hodisa nomi — 06, 07, 10, 12 MD lari `pm-m10d1-lending` dan `nom`/`hodisa` o'qimaydi (grep); Mentor misolida `qoshilmoqchiman` — o'zgarmaydi.
- `sinov.tur` — boshqa MD lar o'qimaydi (grep, 0).
- Netlify Base/Publish — boshqa MD larda yo'q (07, 08 brauzer ko'rinishi — `netlify deploy --prod --dir dist`, tayanch 9.28).
- Instagram «bir va'da» — 01 va tayanch 5 dan tashqari 0; `00-MANBA.md` dagi nomzod qatori (tarix) qoldi.

Tekshiruv: `lint:til` 01 — 0 error · 12 MD — 0 error · o'lchov: 7-ekran xulosasi 95 (≤110), arena 5 variantlari 36–40 · ekranlar soni (16), testlar ✔ o'rni va arena taqsimoti o'zgarmadi.
