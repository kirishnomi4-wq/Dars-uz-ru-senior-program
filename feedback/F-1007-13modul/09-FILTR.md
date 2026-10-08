# 9-dars «Kim haqiqatan to'lashga tayyor?» — tashqi audit (ChatGPT) Filtr bilan, 08.10.2026

Filtr tartibi (`konveyer/1-MD.md`): har band → darsda bormi (grep) → fakt (tayanch 1.9, 8, 9.47; 6, 11-darslar kalitni qanday o'qiydi) → qonun → tasdiqlangan qaror (`GATE_M_JAVOB.md`) → auditoriya. Hukm: Qabul / Qisman / Rad / Allaqachon + sabab.
Zaxira: scratchpad `zaxira-09/`. Skript: scratchpad `f09/tuzat09.py` (09 — 35, 06 — 2, 11 — 2, tayanch — 2 juftlik + 9.55; ikki yurish to'xtadi — Python qo'shtirnog'i va uchta qator boshi, fayl yozilmadi). F-1007-467.

Audit bahosi 7/10. Hukm: **Qabul 22 · Qisman 1 · Rad 2 · Allaqachon 11** (sarlavhalar qatori bilan).
⚠️ **Siz tasdiqlagan qarorga zid band — o'zgartirilmadi:** 22–23 (kech kelgan javoblarni 11-darsda kiritish — **tayanch 9.47**: kalitga kiritilmaydi, o'quvchi hisobotida aytadi). O'zgartirmoqchi bo'lsangiz — ayting.
⚠️ **Tasdiqlangan tayanch matniga tegadigan Qabul:** 1.9 (Mentor javoblari matni kanonik; halol gap «Uchta yozma tasdiq — …») · 8-jadval (`pm-m11d9-tasdiq`: `aniqlashtirish`, `hisobga`, `oldingiGap`, `qachon` ma'nosi) · yangi 9.55.

| № | Audit | Hukm | Nima qilindi / sabab |
|---|---|---|---|
| 1 | «Javob berdi, lekin tasdiq emas» holati yo'q — «javob yo'q» ga tushadi | **Qabul** | Eng muhim topilma. To'rtinchi holat **«Aniqlashtirish kerak»** (javob bor, narx yoki nima uchun yo'q): A-4 ta'rifi, 6-ekran 3-qism tugmasi, 7-ekran 2-savol tuzatishi, TS 11, tayanch 9.55. Mentor misolida bunday javob yo'q — sonlar o'zgarmadi. |
| 2 | O'zgarmas shart shu holat bilan | **Qabul** | `aniqlashtirish: n`; `soralgan` = `tasdiqlar.length` + `aniqlashtirish` + `hozirYoq` + `javobsiz`. Har odam uchun alohida yozuvga to'liq o'tish — olinmadi: hisoblagichlar modeli qoldi, yetishmagan tarix 9, 10-band bilan yopildi. |
| 3 | «Yozma tasdiq» — to'lovga tayyorlik isboti emas | **Qabul** | 2-ekran `QIzoh`: «Yozma tasdiq — odamning hozirgi niyati, to'lov emas: Mentor hech kimdan pul so'ramadi.» (86). |
| 4 | Tugma «Narx bilan yozdi» — mezonning yarmi | **Qabul** | «Narx va nima uchun yozdi» (10 joy), hisoblagich, `QXato` «Xabarida narx va nima uchun bormi?» (34), bashorat, sarlavha «Kim narxini va nimaga to'lashini yozdi?» (39). |
| 5 | Mentor xabari javob shaklini o'zi beradi | **Qabul** | A-6 da talqin: «Mentor aynan narx va nima uchunini so'radi — javoblar shuning uchun shu shaklda; bu o'z-o'zidan kelgan gap emas.» |
| 6 | Yig'ilgan gaplar «so'zma-so'z» deb berilgan | **Qabul** | A varianti: olti javob matni tayanch 1.9 ga kanonik qilib yozildi (Mentor misoli); MD sarlavhasi shunga moslandi. |
| 7 | `qachon` — kiritilgan kun, dalil sanasi emas | **Qabul** | `qachon` — suhbat yoki javob kelgan kun (sukut — bugun, o'zgartiriladi); kiritilgan vaqt — `savedAt`. 9-dars tasdiqlari, uy suhbatlari va 6-dars `pm-m11d6-suhbat` (sinf-supurish). |
| 8 | `soralgan` — faqat chatda yuborilganlar emas | **Qabul** | «yozma javob so'ralgan odamlar soni (chatda yoki qog'ozda)». |
| 9 | «Yozuvni olib tashlash» tarixni o'chiradi | **Qabul** | «Yozma tasdiq sifatida hisobga olmang» (`hisobga: false`, yozuv qoladi, `soralgan` o'zgarmaydi); «Yozuvni olib tashlash» — faqat o'quvchi o'zi yozgan yozuvda. 7-ekran, saqlash, KOD. 11-dars sanog'i `hisobga: true` bo'yicha (sinf-supurish). |
| 10 | Aniqlashtirish eski gapni yo'qotmasin | **Qabul** | `oldingiGap` — aniqlashtirishdan oldingi javob; yozma tasdiq ikkinchi gapdan olinadi. |
| 11 | So'zma-so'z va maxfiylik — qaysi biri ustun | **Qabul** | «So'zma-so'z — odam yozganidek; faqat ism, telefon va akkaunt nomini [ism], [telefon] bilan almashtiring» — 9-dars Yordami, 6-dars Yordami, tayanch 9.55. |
| 12 | 7+ raqam — narxni bloklamasin | Allaqachon | F-1007-464 da yumshatilgan (3-qism); rol maydonida qattiq qoldi. |
| 13 | Darsda yuborishdan oldin ota-ona xabardorligi | **Qabul** | Rol tugmalari ustida belgi «Bu odamga yozishimdan ota-onam xabardor» (kalitga yozilmaydi); belgilanmasa xabar tayyor turadi, uyda yuboriladi. «Vasiy» — kurs qoidasi «ota-ona» (06-FILTR 22). |
| 14 | «Yangi odamga — uyda» notanish deb o'qilishi mumkin | **Qabul** | «oldin yozmagan tanish to'lovchiga — uyda»; kulrang qator «boshqa tanishga — uyda» (109); notanishga hech qachon. |
| 15 | «Hozir yo'q» va javobsizga qayta yozmaslik | Allaqachon | — |
| 16 | Aniqlashtirishda bir martalik qoida | **Qabul** | «faqat yetishmagan narsani bir marta so'rang; «Hozir yo'q» yoki javob bermagan odamga qayta yozmang». |
| 17 | Bosimsizlikni varaqdan isbotlab bo'lmaydi | **Qabul** | 4-ekran 3-savol: «og'zaki bosim yo'qligi va bir marta yozilgani varaqdan ko'rinmaydi — buni o'quvchi o'zi aytadi». |
| 18–21 | Qabul muhri, 6 dan 3, `pm-m11d2-model.kim`, 6-dars yozuvlari o'zgarmaydi | Allaqachon | — |
| 22 | Kech javoblar 11-darsda kiritilsin | **Rad** | Tayanch 9.47 (M-q0 A): kalitga kiritilmaydi — o'quvchi 11-darsdagi hisobotida aytadi. |
| 23 | 11-darsda sanoqlar yangilansin | **Rad** | 22-band. |
| 24 | Qog'ozdagi javobda ham haqiqiy sana | **Qabul** | 7-band. |
| 25 | Hook «Ishonmayman — faqat gap» | **Qabul** | «Ishonmayman — hali gap» (22; TS 18). |
| 26 | 3-ekran C — real pul kuchsiz dalil emas | **Qabul** | Izoh: «C kuchsiz dalil degani emas — bu darsda real pul olinmaydi». |
| 27–31 | Yakuniy test, Mentor statistikasi, «Checked!», olti holat, `{n}` | Allaqachon | — |
| 32 | Uyga vazifa ① — «tanish to'lovchilar» | **Qabul** | «xabaringizni tanish to'lovchilarga bir marta yuboring». |
| 33 | ④ — tuzatish sababiga qarab | **Qabul** | kim — boshqa haqiqiy to'lovchi · narx — faqat yetishmaganini bir marta so'rash · gap — aynan ko'chirish; bosim bilan olingan — hisobga olinmaydi, qayta yozilmaydi. KOD 12. |
| 34 | «Hisobga olinmaydi» — halolroq | **Qabul** | 9-band. |
| 35 | 90 daqiqa — 100–115 | **Qisman** | O'lchanmagan; ⛔ pilotda taymer. |
| Sarl. | 2-ekran sarlavhasi | **Qabul** | «Kim narxini va nimaga to'lashini yozdi?» (4-band). |
| TS | TAYANCHGA SAVOL 1–18 | — | 2–4 — Qabul (6) · 6 — Qabul (13) · 7 — Qabul (1, 2) · 9 — Rad (22) · 11 — Qabul (1) · 14 — Qabul: halol gap «Uchta yozma tasdiq» · 18 — Qabul (25) · qolganlari — auditor qabul qildi. |
| TS+ | 19–25 | Javob berildi | 19 → «Aniqlashtirish kerak» · 20 → yozma javob so'ralgan hamma · 21 → `hisobga: false`, tarixda qoladi · 22 → javob kuni; kiritilgani `savedAt` · 23 → [ism], [telefon] · 24 → `oldingiGap` saqlanadi · 25 → «ota-onam xabardor» belgisi. |

## Sinf-supurish
- **`qachon` — kiritilgan kun** — 6-dars `pm-m11d6-suhbat` (A-11) → suhbat kuni. Boshqa kalitlarda yo'q.
- **So'zma-so'z va shaxsiy ma'lumot** — 6-dars Yordamiga [ism], [telefon] qoidasi.
- **Yozma tasdiq sanog'i** — 11-dars (2 joy): `tasdiqlar.length` → `hisobga: true` lar.
- **«Uchta tasdiq»** — tayanch 1.9 va 9-dars (4 joy) → «Uchta yozma tasdiq»; 11-darsda 0.

## Tekshiruv
- `lint:til`: 09, 06, 11 — TOZA · tayanch — 0 error, 25 warn (o'zgarmagan). `qisqa.py`: uchalasi 12 ekran, arena 3/3/3/3.
- Python `len`: sarlavha 39 · `QIzoh` 86 · kulrang qator 109 · hook 22 · `QXato` 34 — O'lchov yangilandi. ✔ o'rinlari o'zgarmadi.
