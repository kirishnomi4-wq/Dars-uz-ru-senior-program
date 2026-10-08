# 7-dars «Foydalanuvchiga shartlarni qanday ochiq aytasiz?» — tashqi audit (ChatGPT) Filtr bilan, 07.10.2026

Filtr tartibi (`konveyer/1-MD.md`): har band → darsda bormi (grep) → fakt (tayanch 1.7, 9.28, 9.29; 4, 5-darslar nima qurgani) → qonun (QOIDALAR, TAQIQLAR) → tasdiqlangan qaror (`GATE_M_JAVOB.md`) → auditoriya. Hukm: Qabul / Qisman / Rad / Allaqachon + sabab.
Zaxira (tahrirdan oldin): scratchpad `zaxira-07/` (hamma MD va tayanch). Tuzatish skripti: scratchpad `f07/tuzat07.py` (07 — 65, tayanch — 5 juftlik; birinchi yurishda hammasi mos). F-1007-465.

Audit bahosi 6.5/10 (PM/pedagogika 8.5 · halollik va maxfiylik 8 · huquqiy aniqlik 4.5 · o'z mahsulotiga ko'chirish 6 · agent va kod bilan tekshirish 7.5 · 90 daqiqa 4). Hukm: **Qabul 14 · Qisman 3 · Rad 5 · Allaqachon 20** (sarlavhalar qatori bilan).
⚠️ **Siz tasdiqlagan qarorlarga zid bandlar — o'zgartirilmadi, sizga aytiladi:** 2 va 38 (halollik gapi — **Qaror-0 6** so'zma-so'z) · 4 (sotuvchi qatori «[real ishga tushirishda — yuridik shaxs yoki YaTT]» — **HJ-q0 A**) · 1 (oferta ta'rifi — tayanch 1.7, siz tasdiqlagansiz). Ulardan birortasini o'zgartirmoqchi bo'lsangiz — ayting; auditor variantlari 1, 2, 4-qatorlarda.
⚠️ **Tasdiqlangan tayanch matniga tegadigan Qabul:** 1.7 siyosat bandining karta gapi («haqiqiy to'lovda uni to'lov xizmati qabul qiladi» olib tashlandi) · 8-jadval va 9.31 (`bandlar[].savol` — `bool`, matndan aniqlanadi) · yangi 9.53.

| № | Audit | Hukm | Nima qilindi / sabab |
|---|---|---|---|
| 1 | «Odam to'lasa — shu shartlarga rozi bo'ladi» — yuridik ishonchni oshirib beradi | **Rad** | Ta'rif — tayanch 1.7 (siz tasdiqlagansiz); sodda shakli 369-moddadagi «javob qaytargan har qanday shaxs bilan shartnoma tuzish» g'oyasini beradi va darsning o'qi shu («to'lovchi nimaga rozi bo'ladi»). Auditor xavotiri (yosh, real kuch) darsda yopilgan: sahifa — «Mashq hujjati», oxirida «Bu hujjat yuridik maslahat emas.», halollik gapi, real ishga tushirish — bu kursda emas. Auditor varianti: «Oferta — to'lovdan oldin ko'rinadigan ochiq shartlar…» + «Haqiqiy to'lovda yuridik kuchi alohida tekshiriladi» — xohlasangiz qo'yiladi. |
| 2 | FK 27 + «yuridik shaxs yoki YaTT» — umumiy formula bo'lmasin | **Rad** | **Qaror-0 6** — gap so'zma-so'z («darsda bir gap»). 03-FILTR 27, 04-FILTR 24 bilan bir. |
| 3 | «Yuridik shaxs» 13 yoshliga izohsiz | **Qabul** | 4-ekran qatori: «… yuridik shaxs (ro'yxatdan o'tgan tashkilot) yoki YaTT (yakka tartibdagi tadbirkor) bilan; bu kursda emas.» (158; so'zlar o'zgarmadi — faqat qavsda ochildi, T-036) · kartochka 6 izohi · TS 6, Shubhali 7. |
| 4 | Sotuvchi qatori neytral bo'lsin («[sotuvchi kimligi yoziladi]») | **Rad** | **HJ-q0 A** — «[real ishga tushirishda — yuridik shaxs yoki YaTT]» so'zma-so'z. |
| 5 | 3-band qolipi faqat obunaga mos — model bo'yicha tarmoqlansin | **Qisman** | Kursda hamma o'quvchi 4, 5-darslarda **muddatli** qulaylik quradi (reklama/B2B/tranzaksiya — alohida mashq ekranida, 9.28) — oferta o'sha qurilgan narsani yozadi, shuning uchun 3-band dumi to'g'ri. Tuzatildi: dum faqat `davrKun` bo'lsa; bo'sh bo'lsa — faqat «{narx} so'm» (5-ekran, KOD 7, TS 7). Har model uchun alohida shablon — yo'q (A-15). |
| 6 | «4-darsdagi ekraningiz uchun yozing» — real modelga zid hujjat qoladi | **Qabul** | Haq. Modeli reklama, B2B yoki tranzaksiya bo'lsa: oferta — 4-darsdagi alohida mashq ekrani uchun **mashq hujjati**; Amaliyot 2 da lending pastiga havola qo'yilmaydi (promptning 2-bandi o'chadi), havola faqat mashq ekranidagi to'lov taklifida — oferta mahsulotning real modeli sifatida e'lon qilinmaydi. A-12, A-15, 5-ekran Yordami, Amaliyot 2 1-qadam, KOD 7, 9, TS 14. |
| 7 | Kod — xatti-harakat isboti emas; «kodda ko'rinadi» va «amalda tekshirildi» ajralsin | **Qabul** | Amaliyot 1 4-qadam (2): «Kod yetmaydi: har gapni mahsulotda ham ko'rgan bo'lishingiz kerak — 4, 5-darslarda tekshirgansiz yoki hozir ilovada tekshiring; tekshira olmagan gapingiz «[savol]» bo'lib qolsin.» · (3), `QIzoh` (78), yashil xulosa (65), A-1, ✎, tayanch 9.53. |
| 8 | Tekshirilmagan gap ommaviy sahifaga chiqmasin (4-band) | **Qabul** | Mentor 4-bandi: «e'lon qilingan o'yinlar qoladi» — 5-darsda tekshirilgan; «yangi o'yin o'zi e'lon qilinmaydi» — 5-darsda **tekshirilmagan**. A-6 ostida ⛔: «qur» da Mentor ilovada tekshiradi (agent o'yin vaqtini o'tgan haftaga, Pro muddatini kechaga qo'yadi); tasdiqlanmasa bu qism «[savol]», 4-ekran va kutilgan natija moslanadi. O'qituvchi eslatmasi, REPO 6. |
| 9 | «Haqiqiy to'lovda kartani to'lov xizmati qabul qiladi» — kelajak arxitekturasi | **Qabul** | Siyosat bugungi holatni aytadi: «Karta ma'lumoti so'ralmaydi — to'lov test rejimda; Maydon Jamoa kartani ko'rmaydi va saqlamaydi.» (A-6, Yordam, 7-ekran kutilgan natijasi, tayanch 1.7) · o'quvchi namunasi, yumshoq tekshiruv «Karta haqida ham yozing: so'raladimi, saqlanadimi?» (50) · kartochka 11, yakun · O'qituvchi eslatmasida haqiqiy xizmat — fon ma'lumoti sifatida, siyosatga yozilmasligi bilan. |
| 10 | Siyosatda hisob va holat ham bo'lsin | **Qabul** | Tayanch 1.7 va Yordamda 9.29 dan bor edi, lekin MD da eski qoldiqlar turardi: A-6 2-qatori, 7-ekran «Nima uchun?» qatori, arena 11 ✔ («To'lov raqami, hisob, holat va summa» — 36), kartochka 11 izohi, REPO 2, TS 1, Shubhali 3 — tuzatildi. |
| 11 | «Nima uchun?» — maqsadlar ajralsin | **Qabul** | 7-ekran kutilgan natijasi endi tayanch 1.7 dagi ikki gap: «To'lov raqami, hisob, holat va summa — to'lovni bir marta hisoblash va «to'lovim qayerda?» savoliga javob berish uchun. Pro muddati — Pro'ni yoqish va to'xtatish uchun.» |
| 12 | O'quvchi gapi → agent solishtiradi → farq bo'lsa qattiq blok | **Qisman** | Mexanizm bor edi: farq yoki koddan bilinmagan joy — «[savol]», o'quvchi kodga qarab yozadi. Qo'shildi: «kodda saqlanadigan, lekin bandda yo'q ma'lumot bo'lsa — «[savol]» qoldir va nimaligini ayt» (o'quvchi prompti va Yordam). Dars kalitida siyosat «[savol]» i alohida sanalmaydi — o'zgarmadi. |
| 13 | «[savol]» — kuchli joy | Allaqachon | — |
| 14 | Yakuniy test faqat koddan keladigan band haqida bo'lsin | **Qabul** | Savol: «Mahsulotingiz ishi haqidagi bandda «[savol]» qoldi. Nima qilasiz?» (8 so'z) · ✔ C «Mahsulot nima qilishini ko'rib, o'zim yozaman» (45; ±15% OK, ✔ yolg'iz eng uzun emas) · izoh: sotuvchi, pulni qaytarish va aloqa koddan kelmaydi — ular kvadrat qavsda · qisqa takrorlash, kartochka 9, yakun, uyga vazifa ① · arena 9 ✔ «Ilovada va kodida o'zim ko'raman». |
| 15 | Bekor qilish va pulni qaytarish — real ishga tushirishda | Allaqachon | — |
| 16 | Aloqaga o'quvchi telefoni yozilmaydi | Allaqachon | — |
| 17 | Hook | Allaqachon | — |
| 18 | 2-ekran «ekranda bor / yo'q» | Allaqachon | — |
| 19 | Sotuvchi — ataylab noma'lum | Allaqachon | — |
| 20 | «Bugun yoziladi» = bugun ishlaydi | Allaqachon | 7-band bilan kuchaydi. |
| 21 | «Nima beriladi» — `pm-m11d2-model.nima` | Allaqachon | 5-ekranda kulrang qator. |
| 22 | Narx 4-darsdan, «taxmin» holati saqlansin | **Qabul** | Yorliq «4-darsdagi narxingiz · taxmin»; bo'sh bo'lsa placeholder «Narx, so'm — taxmin» (6-dars bilan bir). |
| 23 | «Hali bilmayman» → «[savol]» | Allaqachon | — |
| 24 | `savol: bool` — matndan aniqlansin, ajralib qolmasin | **Qabul** | A-12: har saqlashda `matn.includes('[savol]')` dan; qo'lda o'rnatilmaydi; `null` yo'q (band matni doim bor). Tayanch 8 va 9.31 dagi `bool \| null` → `bool`. |
| 25 | `havolalar.*`, `chiqdi` — `bool \| null` | Allaqachon | — |
| 26 | «Terms Live!» natijadan qat'i nazar — nomi «ishlaydi» deydi | **Qabul** | Nom **«Terms Checked!»** (4 joy + `termsChecked`). Berilish sharti o'zgarmadi — natijadan qat'i nazar (M-q6 A naqshi, 04-FILTR 30); endi nom ham tekshiruvni aytadi, «saytda ishlaydi» demaydi. Nom boshqa darslarda yo'q (grep 0). |
| 27 | Yakun sarlavhasi faqat 3/3 da | Allaqachon | — |
| 28 | Netlify kutishi | Allaqachon | Shubhali 5; vaqt — 41. |
| 29 | Expo Go'dan havola — pilot | Allaqachon | Shubhali 4, REPO 4 ⛔. |
| 30 | Tekshiruv akkaunti — og'ir | **Qabul** | Yangi akkaunt ochilmaydi: o'z hisobida Pro Neon'da bo'sh qilinadi — 5-darsdagi so'rov `UPDATE oyinchilar SET pro_gacha = NULL WHERE id = {hisob raqami};` (`WHERE` siz yubormang). 7-ekran 4-qadam (3), A-5, A-9, O'qituvchi eslatmasi, ✎, TS 12, Manbalar, chek-ro'yxat 9, 10. Pro — mashq, qaytarish shart emas. |
| 31 | Agentning SQL bilan hisob o'chirishi — xavfli zaxira | **Qabul** | 30-band bilan olib tashlandi — o'chirish yo'q. |
| 32 | `.env` Git kuzatmasligini `git ls-files` bilan tekshirish | **Rad** | Tayanch 3 «Push odati»: `git ls-files backend/.env` — yangi maxfiy kalit qo'shiladigan darsda bir marta (3, 8; F-1007-461). 7-darsda yangi kalit yo'q, o'zgarish `lending/` va `mobil/` da. |
| 33 | `checkout -f` yangi papkada | Allaqachon | — |
| 34 | `oferta.html` da Umami yo'q | Allaqachon | — |
| 35 | Lending Umami va siyosat mosligi | Allaqachon | Siyosatning eski gaplari 12-Modul 7-darsida kod bilan solishtirilgan (12-Modul 9.39 f, 9.41 a). |
| 36 | «Siyosatning boshqa gaplariga tegma» har doim to'g'ri emas | **Qabul** | Prompt: «to'lov qo'shilgani boshqa javobga ham tegsa (masalan, «Qancha saqlanadi?») — buni ayt, o'zing o'zgartirma». REPO 6 ga ⛔: Mentor kodida hisob o'chirilganda `tolovlar` qatori nima bo'lishi — pilotda agent javobi bilan. |
| 37 | «Database'ni faqat ilova egasi ko'radi» — ko'r-ko'rona nusxa | Allaqachon | 35-band bilan bir — 12-Modulda tekshirilgan siyosat. |
| 38 | 4-ekrandagi huquqiy qator uzun — soddaroq gap | **Rad** | **Qaror-0 6** — gap so'zma-so'z (2-band). Faqat «yuridik shaxs» ochildi (3-band). |
| 39 | 3-ekran testi | Allaqachon | — |
| 40 | Yakuniy test | Allaqachon | 14-band bilan. |
| 41 | 90 daqiqa — 115–140 | **Qisman** | O'lchanmagan baho — Shubhali 1 ga yozildi; ⛔ pilotda taymer; sig'masa (3)-tekshiruv uyga — sizning qaroringiz. 30-band Amaliyot 2 ni yengillatdi (akkaunt ochish va o'chirish yo'q). |
| Sarl. | Sarlavhalar | Allaqachon | Auditor tasdiqladi. |
| TS | TAYANCHGA SAVOL 1–18 | — | 1, 2, 3, 5, 8, 11, 13, 15, 17, 18 — auditor qabul qildi · 4 — Qabul (24) · 6 — Qabul (3) · 7 — Qisman (5) · 9 — Qabul (8) · 10 — Qabul (10) · 12 — Qabul (30) · 14 — Qabul (6) · 16 — 7+ raqam F-1007-464 da yumshatilgan. |
| TS+ | Auditorning yangi savollari 19–23 | Javob berildi | 19 → ta'rif o'zgarmadi (1-band; qaror sizda) · 20 → shablon tarmoqlanmaydi: 3-band dumi faqat `davrKun` bo'lsa; reklama/B2B/tranzaksiya — mashq ekrani uchun, lendingga havolasiz · 21 → kodda **va** mahsulotda ko'rilgan bo'lishi kerak; faqat kodda — «[savol]» · 22 → avtomatik emas: agent kod bilan solishtiradi, farq va yetishmagan ma'lumot — «[savol]» · 23 → akkaunt yo'q: o'z hisobida Pro Neon'da bo'sh qilinadi. |

## Sinf-supurish (12 MD + tayanch)
- **Siyosat gapi kod bilan to'liq solishtirilmaydi (kam ko'rsatish)** — 08 (Telegram qatori, o'quvchi prompti va Yordam) va 10 (taklif mukofoti gapi, 2 joy) promptlariga: «Gapni kod bilan solishtir: kodda shu ish uchun saqlanadigan, lekin gapda yo'q ma'lumot bo'lsa — uni ayt, o'zing qo'shma.» 10-darsda Mentor gapi faqat qurilma ID ni aytadi, `taklif_qilgan_id` va `mukofot` ham saqlanadi — 10 Shubhali 16 ga yozildi, 10-dars auditida.
- **Kelajakdagi to'lov xizmati gapi siyosatda** — 07 va tayanch 1.7 dan tashqari 0.
- **Pro'siz hisob uchun tekshiruv akkaunti** — 0 (4-dars allaqachon `pro_gacha = NULL` so'rovi bilan; 8, 10, 12-darslardagi tekshiruv akkauntlari boshqa ish uchun — sinf emas).
- **«Kod nima qilsa» — yagona dalil** — faqat 07 da edi.
- **3-band qolipi va nishon nomi** — faqat 07 da.

## Tekshiruv
- `lint:til`: 07 — TOZA (birinchi yurishda 1 warn — «hisoblanadi» bog'lamasi, «aniqlanadi» ga almashdi) · 08 — 0 error, 3 warn (zaxirada ham) · 10 — TOZA · tayanch — 0 error, 25 warn (o'zgarmagan; birinchi yurishda +2 «hisoblanadi» — tuzatildi).
- `qisqa.py`: 07 — 12 ekran, arena 3/3/3/3, sarlavha >55 yo'q · 08, 10 — o'zgarmagan.
- Python `len`: 4-ekran halollik qatori 158 · yakuniy savol 65 (8 so'z), ✔ C 45 · arena 9 ✔ 32, arena 11 ✔ 36 · `QIzoh` 78 · yashil xulosa 65 · yumshoq tekshiruv 50 — O'lchov bo'limida yangilandi. ✔ o'rinlari o'zgarmadi.
