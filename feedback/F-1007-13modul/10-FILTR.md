# 10-dars «Loyiha kuni: taklif havolasi va mukofot» — tashqi audit (ChatGPT) Filtr bilan, 08.10.2026

Filtr tartibi (`konveyer/1-MD.md`): har band → darsda bormi (grep) → fakt (tayanch 1.10, 3, 9.36; 11, 12-darslar maydonlarni qanday o'qiydi) → qonun → tasdiqlangan qaror (`GATE_M_JAVOB.md`) → auditoriya. Hukm: Qabul / Qisman / Rad / Allaqachon + sabab.
Zaxira: scratchpad `zaxira-10/`. Skript: scratchpad `f10/tuzat10.py` (10 — 43 juftlik + 4-band qayta yozildi, tayanch — 5 juftlik; 9.36 yangilandi, 9.56 qo'shildi; bir yurishda o'tdi). F-1007-468.

Audit bahosi 6/10 (mukofot tuzilmasi 4/10). Hukm: **Qabul 34 · Qisman 7 · Rad 3 (+ TS 24) · Allaqachon 8** (yakun va sarlavhalar qatori bilan).
⚠️ **Siz tasdiqlagan qarorga zid band — o'zgartirilmadi:** 11 (mukofotni alohida «test rejim» bayrog'i bilan yopish — **M-q3 A**: mashq Pro hamma hisobga ochiq, mukofot ham shu Pro muddati, pul emas) · 24 (menyu ostidagi «unikal» — **NOM-q0 A**) · 30 (hook «Aynan!/Qiziq fikr!» — T-028) · 33 (`.env` ni `git ls-files` bilan tekshirish — tayanch 3: faqat kalit qo'shiladigan darslarda). O'zgartirmoqchi bo'lsangiz — ayting.
⚠️ **Tasdiqlangan tayanch matniga tegadigan Qabul:** 1.10 (kod katta harfga o'tkaziladi; cheklov — **hisobga**, odamga emas; 1-qator «har hisobning o'z taklif kodi») · 3-jadval `10-done` qatori (`oyinchi_qurilmalari`, `taklif_natijalari`) · 9.36 (tekshiruv yo'li) · yangi 9.56. **1.12 (Mentor misolidagi 4-topilma — kichik harf) — 12-dars Filtrida** (bu band 12-darsning Mentor natijasini o'zgartiradi).

| № | Audit | Hukm | Nima qilindi / sabab |
|---|---|---|---|
| 1 | `qurilma_id` — «oxirgisi»: bir qurilmadagi o'zini taklif qilish boshqa qurilmadek ko'rinishi mumkin | **Qabul** | Eng muhim topilma. Yangi jadval `oyinchi_qurilmalari` (hisob + qurilma ID jufti noyob, eskisi o'chmaydi); kirishda ham yoziladi. Shart: «yangi hisob ochilgan qurilma ID si taklif qilganning qurilmalari ichida yo'q». A3 talabi (o'quvchi va Yordam), REPO 5, TS 7, tayanch 9.36, 9.56. |
| 2 | Natija taklif qilingan hisob qatorida — hisob o'chsa haftalik tarix yo'qoladi | **Qabul** | Alohida `taklif_natijalari` (kim taklif qilgan · kim taklif qilingan, noyob, o'chsa — bo'shatiladi, yozuv qoladi · natija · vaqti). REPO 5, TS 8. |
| 3 | `mukofot` maydoni noto'g'ri joyda va nomda | **Qabul** | 2-band: `taklif_natijalari.natija`. |
| 4 | «Bitta odamga haftasiga 2» — Backend odamni emas, hisobni taniydi | **Qabul** | «bitta taklif qilgan **hisobga**» — A-bo'lim 1, tayanch 1.10. |
| 5 | Haftalik cheklov bir vaqtdagi ikki so'rovda oshib ketadi | **Qabul** | Sanashda taklif qilgan hisob qatori qulflanadi (`FOR UPDATE`) — talabda oddiy so'z bilan, Yordamda texnik. |
| 6 | Bir hisob ikki harakatni bir vaqtda qilsa — ikki marta +7 | **Qabul** | `taklif_qilingan_id` noyob — bir hisobga bitta yozuv; `berildi` va `pro_gacha` bitta Database ishida. |
| 7 | Mukofot xatosi asosiy harakatni buzmasin | **Qabul** | «asosiy harakat avval saqlansin; keyin alohida Database ishida … xato bo'lsa — asosiy harakat buzilmasin: logga, yozuv qo'shilmasin, keyingi harakatda yana tekshirilsin». |
| 8 | Qurilma ID — ilova yuboradigan qiymat, isbot emas | **Qabul** | Sinovda «bir qurilma» → «**bir xil ID**», «boshqa qurilma» → «**boshqa ID**»; `QIzoh` «Qoida bir xil qurilma ID ni ushlaydi; boshqa ID dagi hisobni ajratmaydi — …» (109). 5-ekrandagi Mentor misoli (o'sha telefon) — o'zgarmadi. |
| 9 | Maxfiylik gapi ortiqcha va'da beradi («bir odam o'zini taklif qilmasligi uchun») | **Qabul** | «… bir qurilma ID li hisoblarni ajratish uchun». |
| 10 | Maxfiylikda faqat qurilma ID — yetmaydi | **Qabul** | «Taklif kodi bilan kelgan hisoblarda kim kimni taklif qilgani, mukofot natijasi va vaqti, hisob ishlatilgan qurilma ID lari saqlanadi — …» — «Qaysi ma'lumot?» va «Nima uchun?» ga; REPO 7. |
| 11 | Mukofot hamma real foydalanuvchiga ochiq — alohida test rejim bayrog'i kerak | **Rad** | **M-q3 A**: mashq Pro hamma hisobga ochiq; mukofot ham shu Pro muddati — pul ham, chegirma ham emas (Qaror-0 15). Halol qismi — 12-band. |
| 12 | Ofertada mukofot bandi kerak | **Qabul** | `lending/oferta.html` (7-dars) — «Taklif mukofoti»: qoida qatori va berilmaydigan to'rt holat. |
| 13 | Qoida qatori yashirin shartlarni aytmaydi | **Qabul** | 12-band: to'liq shart ofertada; ilovadagi qisqa qator o'zgarmadi (bir qator — sig'adi). |
| 14 | `nomalum` — foydalanuvchi uchun yashirin | **Qabul** | Ofertada ochiq; kirishda ham qurilma yoziladi — bu holat kamayadi. TS 9. |
| 15 | «Har foydalanuvchiga o'z havolasini berasiz» — Mentor ilovasida to'liq rost emas | **Qabul** | Reja sarlavhasi «Bugun har hisobning o'z taklif kodi bo'ladi.» (44); 1-amaliyot: ulashish tugmasi — tashkilotchida. Tayanch 1.10. |
| 16 | Ta'rif «har foydalanuvchining o'z havolasi» | **Qabul** | «Taklif havolasi — hisobning o'z taklif kodi yozilgan havola.» |
| 17 | Kichik harf xatosini 12-darsga ataylab qoldirish | **Qabul** | 9.51 va 12-Modul 9.37 a ga zid edi. Talabda: «bo'shliqlari olib tashlanib katta harfga o'tkazilsin (ab12cd ham AB12CD)». ✎, REPO 4, Shubhali 11. 12-dars topilmasi — 12-Filtrda. |
| 18 | Kod to'qnashuvida qayta yaratish | **Qabul** | «noyoblik to'qnashsa — yangi kod bilan qayta yozilsin, oldindan tekshirib emas». |
| 19 | Kod — ochiq belgi, kalit emas | **Qabul** | «Kod maxfiy emas: u bo'yicha hisob haqida hech narsa ko'rsatilmasin.» |
| 20 | Tekshiruv hisoblari `namuna = false` — real sanoqqa vaqtincha qo'shiladi | **Qisman** | Yangi belgi (masalan `tekshiruv = true`) — olinmadi: 4–12-darslardagi hamma sanoqni o'zgartiradi. Tekshiruv hisoblari shu blokning o'zida o'chiriladi, (5) da `COUNT(*) … 'tekshiruv%'` → `0`. |
| 21 | O'quvchining haqiqiy `pro_gacha` sini o'zgartirib, keyin `UPDATE` bilan qaytarish | **Qabul** | Taklif qiluvchi ham tekshiruv hisobi `tekshiruv1`; qaytarish yo'q. Shubhali 13 yopildi. |
| 22 | Tozalash juda og'ir | **Qisman** | Pro qaytarish olib tashlandi; tozalash — bitta agent so'rovi (`id` lar bilan ro'yxat → «Davom et»). Alohida «tekshiruv yordamchisi» — olinmadi (yangi mexanizm). |
| 23 | Hisob o'chirilsa mukofot tarixi qolsin | **Qabul** | 2-band (`ON DELETE SET NULL`). |
| 24 | «Bir qurilma» sinovi mobil va web'da bir xil emas | **Qabul** | «bir xil ID» / «boshqa ID» — 8-band. |
| 25 | Yashirin oyna «boshqa qurilma» emas | **Qabul** | «bu boshqa qurilma emas, boshqa brauzer ID (alohida xotira) — qoida uchun shunisi yetadi»; tayanch 9.36. |
| 26 | «7 kishi» → «7 hisob» | **Qabul** | 5 joyda qolgan edi (tayanch 1.10 da allaqachon «hisob») — hammasi «hisob». |
| 27 | 18 — tashrif | Allaqachon | — |
| 28 | «taklif havolasi ishlaganini» — toraytirish | **Qabul** | «taklif yo'li ishlaganini ko'rsatadi» (3 joy + tayanch 1.10). |
| 29 | 51 ni bayram qilmaslik | Allaqachon | — |
| 30 | Hook «Aynan!/Qiziq fikr!» | **Rad** | T-028, T-067. |
| 31 | Hook pedagogik jihatdan yaxshi | Allaqachon | — |
| 32 | Mavjud hisoblarga kod — qayta ishga tushsa almashmasin, hammasi to'ldirilsin, noyob | **Qabul** | «mavjud hisoblarning har biriga bir marta (qayta ishga tushsa ham bor kod almashmasin)»; Mentor misolida tekshirish — ⛔ pilot. |
| 33 | `.env` — faqat `git status` emas | **Rad** | Tayanch 3: `git ls-files` faqat kalit qo'shiladigan darslarda; 10-darsda yangi kalit yo'q. |
| 34 | Noto'g'ri kodda hisob ochilmaydi | Allaqachon | Xabar chiqadi (9.36). |
| 35 | Kodni bo'shliqsiz va katta harfga o'tkazish | **Qabul** | 17-band. |
| 36 | Tekshiruv hisobi sanoqni ifloslantiradi | **Qisman** | 20-band. |
| 37 | Birinchi asosiy harakat — qayta so'rovda bir marta | **Qabul** | 6-band (noyob yozuv). |
| 38 | Mukofot xatosida nima bo'ladi | **Qabul** | 7-band. |
| 39 | `berildi` va `pro_gacha` bitta ishda | **Qabul** | «`berildi` bo'lsa, shu Database ishining ichida: {mukofot}». |
| 40 | `namuna` ikkala hisobga | Allaqachon | — |
| 41 | `nomalum` → mukofot yo'q — ochiq shart bo'lsin | **Qabul** | 12, 14-bandlar. |
| 42 | `xato` / `kutilmoqda` holati yo'q | **Qisman** | Yangi holat olinmadi: xato — logga, yozuv yo'q, keyingi harakatda qayta (bu 7-band). |
| 43 | `mukofot IS NULL` — biznes holati sifatida zaif | **Qabul** | «`taklif_natijalari` da yozuv yo'q» — REPO 5. |
| 44 | Namuna va cheklov sinalmagani halol aytilgan | Allaqachon | — |
| 45 | «Rule Checked» tavsifi | **Qabul** | «Bir xil ID va boshqa ID holatini tekshirdingiz». |
| 46 | 1, 2-blok «Bajardim» to'g'rilikni isbotlamaydi | **Qabul** | 1, 2-bloklarga tekshiruv kartasi «Kutilganidek» / «Boshqacha» (3, 8-darslar naqshi); yakun shundan. |
| 47 | Har blokka 4 ta alohida belgi | **Qisman** | Bitta karta (46); to'rt belgi — o'quvchiga og'ir, sinf naqshi bitta. |
| 48 | Spamga undamaslik | Allaqachon | — |
| 49 | Ochiq mukofot — o'sish bosimi | **Qisman** | 48 + ofertadagi band; «takror yozmaslik» — 6, 9-darslar qoidasi. Yangi matn qo'shilmadi. |
| 50 | 90 daqiqa — real emas | **Qisman** | O'lchanmagan; ⛔ pilotda taymer. Pro qaytarish olib tashlangani — bir oz qisqardi. |
| Yak. | Yakuniy sarlavha | **Qabul** | «Havola, sanoq va mukofotning ikki holati tekshirildi.» (53) · 1 yoki 2-blok «Boshqacha» — «Taklif yo'li qurildi — bitta joyni tuzatish qoldi.» (50). |
| Sarl. | Sarlavhalar | Allaqachon | — |
| TS | TAYANCHGA SAVOL 1–27 | — | 1 — Rad (30) · 7 — Qabul (1) · 8 — Qabul (2) · 9 — Qabul (14) · 10 — Qabul (4) · 11 — Qabul (6, 7) · 13 — Qabul (35) · 16 — Qabul (12) · 18 — Qisman (20, 21) · 19 — Qabul (10) · 21 — Qabul (45) · 24 — Rad (NOM-q0 A) · 25 — Qabul (15) · 26 — Qabul (yakun «ikki holati») · qolganlari — auditor qabul qildi. |
| TS+ | 28–36 | Javob berildi | 28 → hamma qurilmalari · 29 → `taklif_natijalari` da qoladi · 30 → qator qulfi · 31 → noyob yozuv · 32 → yo'q, alohida ish · 33 → M-q3 A (11) · 34 → ha, «hisob» · 35 → ha (10) · 36 → ha, «boshqa brauzer ID». |

## Sinf-supurish
- **Kichik harf ataylab qoldirilgan** — 12-dars (35, 38, 65, 227, 248, 466, 533, 558-qatorlar) va tayanch 1.12, 3-jadval `12-done` — 12-dars Filtrida (F-1007-470).
- **`qurilma_id` / `mukofot` o'quvchilari** — 11, 12-darslarda bu maydonlar o'qilmaydi (grep, 0); 12-dars faqat `taklif_qilgan_id` ni o'qiydi — o'zgarmadi.
- **«bitta odamga» cheklov** — 8-darsda «bir odamga … Telegram xabari» — qabul qiluvchi bitta chat, ma'nosi to'g'ri; o'zgartirilmadi.
- **Tekshiruv uchun o'quvchining hisobini o'zgartirib, keyin eski qiymatni qaytarish** — boshqa darslarda yo'q. 05, 07-darslarda o'z hisobidagi mashq Pro bo'sh qilinadi (`pro_gacha = NULL`) — bu boshlang'ich holatga qaytarish, yozib olingan qiymatni qaytarish emas (07-FILTR 30); o'zgartirilmadi.

## Tekshiruv
- `lint:til`: 10 — 0 error, 1 warn (agent so'rovidagi «yoz» — T-002 istisno); tayanch — 0 error, 25 warn (o'zgarmagan). `qisqa.py`: 12 ekran, arena 3/3/3/3.
- Python `len`: reja sarlavhasi 44 · yakun 53, 50 · yashil 92 · qator 51 · kulrang 64 · `QIzoh` 109 — O'lchov yangilandi. ✔ o'rinlari o'zgarmadi.
