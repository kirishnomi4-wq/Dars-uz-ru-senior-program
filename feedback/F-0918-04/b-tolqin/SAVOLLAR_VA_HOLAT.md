# SAVOLLAR VA HOLAT — 19.09 (shanba) · kechqurun uchun

> Bitta fayl: qayerdamiz, nima qilindi va sizdan nima kerak. Javobni bir qatorda yozsangiz yetadi, masalan:
> **«S1 ok, S2: P1 ok P3-2 yo'q …, S3 kechqurun qilamiz, S4 A, S5 ok»**.
> Hech narsa push yoki deploy qilinmagan. Lokal commitlar GitHub'dan oldinda (pastda).

## 1. Qayerdamiz (qisqa)

| Nima | Holat |
|---|---|
| 151-qonun (nishon — birinchi urinishga) | ✅ **100 ekran / 66 dars** + bugun yana 2 ta (PmLesson20 s4, PmLesson19 s9); 3 ta tekin nishon testga ko'chdi (bezak, buttonMaster, rightEnvelope) |
| Ball halolligi (153-qonun) | ✅ **35 ta test** birinchi to'liq urinishni sanaydi (26 tartiblash + 7 diskret + 2 debug), F5 dan keyin ham |
| **Solo teshigi (Q1)** | ✅ **yopildi**: uyda o'tilgan darsda maxsus test javobi endi serverga ketadi — **63/63 ekranda brauzerda isbotlandi** (soxta server bilan). Tuzatishdan oldin 15/15 da so'rov umuman ketmagan |
| Q3 · Q4 · Q5 · M2 · M3 | ✅ bajarildi va prob bilan isbotlandi |
| Adversarial tekshiruv | 3 o'tish: kecha 2 YUQORI (Y1, Y1b) — tuzatildi; bugungisi — YUQORI/O'RTA yo'q, 2 PAST — tuzatildi |
| Server | o'zgarmadi: prod `5ecafd67`, staging `a2e07cf6` |
| `lms/` yig'malari | **eski** (qayta yig'ish matnlar tasdig'idan keyin — Q6-A tartibi) |
| GitHub | `8bd0eeb` — lokal **+7 commit** push kutadi (`! git push origin main`) |

**Yakuniy regress (19.09 ~07:10, hamma o'zgarishlardan keyin):** ⏳ (pastda to'ldiriladi)

## 2. Sizdan kerak — savollar

### S1. «Qadoq» so'zi (F-0919-01) va M1 — matn tasdig'i

«Qadoqxona» so'zini o'quvchi **ko'rmaydi** — u faqat koddagi nom (men uni xabarimda ekran nomi deb xato ishlatganman).
Lekin **«qadoq»** so'zi DbSqlNosql darsining audio-matnida 4 marta bor va o'quvchiga notanish:

| Joy | ❌ Hozir | ✅ Taklif |
|---|---|---|
| s0 audio | «…ikki xil **qadoqda**.» | «…ikki xil **ko'rinishda**.» |
| s3 audio | «Endi siz **qadoqlovchisiz**. Instagram-post kartalarini…» | «Endi kartalarni **o'zingiz joylaysiz**. Instagram-post kartalarini…» |
| s3b audio | «…qaysi **qadoq** oson kengayadi?» | «…**quti yoki paket** — qaysi biri oson kengayadi?» |
| s8 audio | «Qaysi **qadoqni** tanlashni to'rt savol hal qiladi…» | «**Qutini yoki paketni** tanlashni to'rt savol hal qiladi…» |

**M1:** DbSql `packageMaster` nishoni s3 (tekin — karta o'zi joyiga tushadi) → **s4 testiga** («Shakli tez-tez o'zgaradigan
ma'lumot uchun qaysi tur qulayroq?»). Tavsif: «O'zgaruvchan ma'lumot uchun qulay turni topdingiz» · «Вы нашли тип, удобный
для меняющихся данных».
- **A (tavsiya):** ikkalasi ham ok — kiritaman, lug'at va korpusga yozaman.
- B: o'z variantingiz.

### S2. Matnlar — `MATN_TAKLIFLAR.md` (49 taklif, Q2-A)

Partiya bo'yicha javob bering: «P1 ok, P2 ok, P3-2 yo'q, P4-5: …». Eng muhimi — javobni urinishdan OLDIN aytadigan Mentor/
audio/maslahat jumlalari (masalan CssLesson2 s14: «display: flex emas, block yozilgan!»). Tasdiqdan keyin: kiritaman →
metodist → 👦 o'quvchi 2-o'qish → `lint:til`.

### S3. Staging'da haqiqiy solo sinovi (Q1-A) — siz bilan, ~15 daqiqa

Yig'ma tayyor: `feedback/F-0918-04/b-tolqin/staging-sinov/AgentArchitectureLesson.jsx` (staging manzili, smoke-lms ✓,
md5 `93b22a274874c8ed36aa1fba633a0886`). Qadamlar:
1. Faylni LMS staging'dagi sinov-dars joyiga yuklaysiz (18.09 dagi kabi — 2848 joyi).
2. O'quvchi sifatida (Sherzod yoki Nigora) darsni **mentor darsni boshlamagan holda** (uyda — solo) ochib o'tasiz;
   yakuniy tartiblash testida **birinchi marta ataylab xato** joylab, keyin tuzatasiz; «Tamom».
3. Menga aytasiz — men staging admin'dan solo-natijani o'qiyman: `total_questions` va `correct_answers` ichida s15
   «xato» bo'lib turishi kerak (oldin umuman yo'q edi).
- Eslatma: server kalitlari mentor darsni staging'da ochganda yangilanadi — agent-arch darsi staging'da ochilgan (kalit 0 o'zgarmagan).

### S4. `jobHunter` (PmJtbd) — muallif niyati

Tunda uni «uchala test BIRINCHI urinishda to'g'ri» ga o'tkazdim (qardosh darslar bilan bir xil, tavsif «yechib chiqdingiz»
rost bo'ldi). Keyin koddagi izohda muallifning ataylab qarori topildi: «birinchi urinish EMAS — bitta xato nishonni yopib
qo'yardi, uchalasiga javob berilgani yetarli».
- **A (tavsiya):** hozirgidek (birinchi urinish) — 151/152-qonun va qardosh darslar bilan izchil.
- B: muallif niyati — «uchalasi yechildi» (`solved`) — xato qilgan ham oladi; bu holda tavsifni ham qarab chiqamiz.

### S5. Chiqarish tartibi (Q6-A) — sizning qo'lingizda bo'ladigan qadamlar

1. `! git push origin main`
2. S1 va S2 javoblaridan keyin men matnlarni kiritaman → to'liq sinov-aylanishi.
3. `lms/` qayta yig'ish (prod manzili) + md5 + `CRM_YUKLASH_ROYXATI.md` — men.
4. Server-deploy (faqat katalog: prod'dagidan **8 nishon** farq qiladi — 7 tavsif + 1 nom; server kodi o'zgarmagan): `! bash scripts/sync-dars-api.sh staging` → men tekshiraman →
   `! bash scripts/sync-dars-api.sh main` + GitLab `deploy` ▶ → men prod'ni `--read-only` tekshiraman.
5. Dushanba: CRM'ga yuklash.

### S6. Keyinga qoladigan ishlar (qaror — qachon)

- **PmLesson19–25 ruschaga tarjima** (7 dars faqat o'zbekcha; M3 ning ruscha tavsifi hozircha faqat katalogda).
- **KATTA §42 «nishon → Badge»** — CRM dan keyin (Q5-A).
- «Variant-indekssiz savol» tarmog'i (`resultDetails.js`) — endi ishlamaydi, tozalash.

## 3. Nima qilindi — commitlar

**Tun (18.09 21:47 → 19.09 01:52):** `16791ee` … `8bd0eeb` (push ✓) — A to'lqin commit, vositalar (`codemod-achrule`,
`ach-probe`), 6 partiya (100 ekran), T9/T9c (26 tartiblash testi), Y1/Y1b, tashqi nishonlar, 152-qonun reyestri,
hisobot/qarorlar. Batafsil: `TUNGI_HISOBOT.md`.

**Ertalab (19.09 05:28 →):**
| Commit | Nima |
|---|---|
| `9cdf279` | Q1 — solo teshigi (97 dars ildizi; `codemod-solo-submit`; `ach-probe --solo`) |
| `193632a` | Q3 a/c/e + Q5 (bezak → s12, buttonMaster → s10, PmLesson20 s4, PmLesson15 qulf, o'lik earn 4) |
| `df11830` | M2 (Command Spotter → s14) · M3 (fullHouse, uz + ru) |
| `c0e51d5` | Q4 — 7 diskret test, Routing s15, NestArch F5; solo isboti 63/63 |
| `036ce83` | 153-qonun (ball halolligi); KATTA §41; staging-sinov yig'masi |
| `0df4ed1` | 3-tekshiruv PAST topilmalari (PmLesson20 qulf, izoh) |

## 4. Halol chegaralar

- Hamma brauzer-sinov — boshsiz Chrome, file:// (esbuild). **Solo — soxta server bilan**; haqiqiy staging'da — S3.
- Jonli (`student`) va mentor rejimlari haqiqiy LMS sessiyasida sinalmagan (kod o'qish + statik).
- **12 ta test-kalit o'zgarishi** (`-1 → 0`, 11 dars: HtmlTakrorlash, JsIntro, PeanStack, PracticeLesson1/3/4, ReactIntro,
  ApiPostman, DataIntro ×2, DbSqlNosql, Routing) serverga mentor darsni ochganda (`set_quiz_keys`) boradi.
- `lms/` va server katalogi hali eski — S5 tartibida.
