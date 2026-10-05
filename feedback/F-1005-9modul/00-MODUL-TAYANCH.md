# 9-Modul — modul tayanchi (12 MD uchun bitta manba; har MD ning «A» bo'limi shundan oladi)

Qarorlar: `GATE_M_JAVOB.md` · nomlar: `00-NOMLAR.md` · dastur: `00-MANBA.md`. Bu fayldagi nom, raqam va so'zlar hamma darsda **aynan** shunday.
Bu yerda yo'q tafsilot kerak bo'lsa — MD oxiridagi «TAYANCHGA SAVOL» ro'yxatiga yoziladi, o'zicha o'ylab topilmaydi.

## 1. Misol-ip — «Maydon»

- **Mahsulot:** «Maydon» — mahalladagi mini-futbol maydonchasining bo'sh vaqtini ko'rsatadigan va band qiladigan sayt.
- **Odamlar** (ismsiz, o'ylab topilgan qahramon yo'q): **o'yinchi** — maydonda o'ynaydigan o'smir; **maydon egasi** — vaqtlarni boshqaradi.
- **Muammo (bitta gap):** Maydonga kelasiz — band; bo'sh vaqtni bilish uchun egasiga qo'ng'iroq qilish kerak.
- **Mentor misolidagi 5 intervyu natijasi** (3-dars shu raqamlar bilan ishlaydi; 2-darsda ular hali yo'q):
  5 kishidan 4 tasi — «oxirgi marta kelganimizda maydon band edi»; 3 tasi — «egasi telefonni ko'tarmadi»; 2 tasi — «jamoaga odam yetmadi»; 1 tasi — «pulni bo'lishish qiyin».
  Tanlangan bitta muammo (muammo gapi, GATE M 03-q0 — so'zma-so'z): **«O'yinchilar maydonga borishdan oldin bo'sh vaqtni bilish va uni band qilishda qiynaladi.»**
  Band qilishga dalil — telefon: o'yinchilar kelishdan oldin egasiga qo'ng'iroq qilib, vaqtni kelishib qo'ymoqchi bo'lgan (1-yozuv: «vaqt band qilmoqchi bo'lib egasiga qo'ng'iroq qilgandim»).
- **MVP chegarasi:** qilamiz — kun bo'yicha vaqt kataklari (bo'sh / band) · katakni band qilish (ism + telefon) · egasi uchun bandlar ro'yxati.
  Keyin — to'lov · jamoa yig'ish · eslatma. Qilmaymiz — baho · chat.
- **Sinov vazifasi (10-dars):** «Shanba kuni soat 18:00 ga maydon band qiling.»
- Metafora yo'q. Loyiha va mahsulot (1-dars, GATE M 01-q0 — so'zma-so'z): **Loyiha** — boshlanishi va oxiri bor qurish ishi. **Mahsulot** — odamlar o'z muammosi uchun ishlatadigan sayt, ilova yoki xizmat.
  Bog'lovchi gap: «Saytni qurish — loyiha. Tayyor saytni odamlar o'z ishi uchun ishlatsa, u mahsulot bo'lib ishlaydi.» Mezon — maqsad (o'z ishi uchunmi), manba (havola kimdan kelgani) emas.

## 2. Atamalar (bir ma'no — bir so'z)

| So'z | Ma'nosi | Ishlatilmaydi |
|---|---|---|
| sayt | React ilova (`web/`) | frontend (faqat sxema tugunida «Sayt · React») |
| Backend | NestJS server (`backend/`) | server (prozada) |
| Database | PostgreSQL (Neon) | baza |
| vaqt katagi | bitta soatlik oraliq (masalan 18:00–19:00) | slot |
| band qilish · band | katakni egallash · egallangan katak | bron, buyurtma |
| o'yinchi · maydon egasi | ikki foydalanuvchi | mijoz, admin |
| intervyu | bitta odam bilan suhbat; **yozuv** — shablonga yozilgani | custdev (faqat kartochkada bir marta) |
| sinov | real odam ilovani ishlatadi, siz kuzatasiz | usability test (kartochkada bir marta), test qilish |
| hodisa | analitikaga yoziladigan bitta harakat | event (kod ichida — ha) |
| animatsiya | interfeysdagi ko'rinadigan harakat yoki holatning silliq o'zgarishi (5-darsda — holat o'zgarishini silliq ko'rsatadiganlari); **mikro-harakat** — foydalanuvchi harakatiga yoki holat o'zgarishiga berilgan kichik vizual javob (misol: bosilgan katak kichrayadi) — GATE M 05-q0 | mikrovzaimodeystviya |
| talab | o'quvchi agentga yozadigan vazifa matni (nima qilsin, nima buzilmasin) | spec, TZ |
| agent | Antigravity (6-Moduldan tanish) | — |
| Motion | animatsiya kutubxonasi; bir marta «Motion (oldingi nomi Framer Motion)» | — |

O'tilgan atamalar (mahsulot, MVP, User Story, pitch, deploy, token, `.env`) — oldingi darslardagidek; agent yozishdan oldin 5 va 6-Modul YAKUNIY larida grep qiladi.

## 3. Repo — `maydon` (yangi; «qur» bosqichida yoziladi)

- Papkalar: `web/` (React + Vite, `localhost:5173`) · `backend/` (NestJS, `localhost:3000`) · Database — Neon, `.env` da `DATABASE_URL`.
- Jadval `bandlar`: `id` · `kun` · `soat` · `ism` · `telefon` · `yaratilgan`.
- Yo'llar: `GET /vaqtlar?kun=` (kataklar: soat + holat) · `POST /bandlar` (`kun`, `soat`, `ism`, `telefon`) · `POST /kirish` (ega paroli → token) · `GET /bandlar` (faqat token bilan).
- Animatsiyalanadigan uch element (5-dars): 1) vaqt katagi bosilganda kichrayib qaytadi (`transform` + `transition`); 2) katak band bo'lganda rangi silliq o'zgaradi (`transition`);
  3) «Band qilindi» belgisi paydo bo'ladi (Motion).
- Hodisalar (Umami): sahifa ochilishi — avtomatik; `vaqt-tanladi` (6-dars) · `band-qildi` (9-darsda qo'shiladi). Zanjir: ochdi → vaqtni tanladi → band qildi.

| Teg | Dars | Repo holati (dars oxirida) |
|---|---|---|
| `dars-04-done` | 4 · arxitektura | skelet: `web/` + `backend/` + Database ulangan; saytda statik vaqt kataklari (namuna ma'lumot) |
| `dars-05-done` | 5 · animatsiya | statik kataklarda uch element jonlangan |
| `dars-06-done` | 6 · analitika | Umami ulangan; `vaqt-tanladi` hodisasi yoziladi |
| `dars-07-done` | 7 · birinchi ekran | kataklar Backend'dan keladi (`GET /vaqtlar`), kun almashtiriladi |
| `dars-08-done` | 8 · dizayn | bitta tanlangan namuna qo'llangan; ro'yxat va sahifa o'tishi animatsiyasi |
| `dars-09-done` | 9 · MVP tayyor | band qilish ishlaydi (`POST /bandlar`), ega sahifasi parol bilan, `band-qildi` hodisasi, deploy |
| `dars-11-done` | 11 · tuzatish | sinovda topilgan eng muhim bitta muammo tuzatilgan |

Sinovda topiladigan muammolar (10-dars kuzatuvi → 11-dars): 1) o'yinchi «Band qilish» tugmasini topa olmadi — u forma ostida, ko'rinmaydi (**eng muhim, tuzatiladi**);
2) band bo'lgandan keyin nima bo'lganini tushunmadi; 3) kunni almashtirishni sezmadi.
Shuning uchun `dars-09-done` (= `dars-11-start`) da bu uch holat **ataylab qoladi**: tugma telefonda forma ostida (ekrandan pastda), «Band qilindi» belgisi 3 s da yo'qoladi, kun almashtirgichi kichik strelkalar.
`dars-11-done` faqat tugmani tuzatadi (ekran pastiga qotadi, ism va telefon qatorini yopmaydi). O'quvchining o'z saytida muammo boshqacha bo'lsa — 11-darsda o'z ★ muammosini tuzatadi.

## 4. Darslar — qisqa topshiriq

| № | Fayl (MD) | Tip · qolip | Darsning bitta natijasi | Namuna MD (`feedback/F-0929-QA-6modul/`) |
|---|---|---|---|---|
| 1 | `01-PmProductProblem-v3.md` | PM | 3 ishlaydigan mahsulot tahlili + atrofdan 10 muammo ro'yxati | `14-PmLesson25-v3.md` |
| 2 | `02-PmFiveInterviews-v3.md` | PM | intervyu shabloni + sinfdosh bilan 1 mashq yozuvi; uyga — 5 real intervyu | `14-PmLesson25-v3.md` |
| 3 | `03-PmInterviewMvp-v3.md` | PM | 5 yozuvdan 1 muammo + qilamiz / keyin / qilmaymiz ro'yxati | `12-PmLesson24-v3.md` |
| 4 | `04-MvpArchitecture-v3.md` | TEX | «Maydon» sxemasi + skelet ishga tushgan | `01-SystemArchitecture-v3.md` |
| 5 | `05-Animation-v3.md` | TEX (cho'qqi) | uch element qo'lda jonlantirilgan | `01-SystemArchitecture-v3.md` |
| 6 | `06-PmAnalyticsDayOne-v3.md` | PM qismi + amaliyot bloki | nimani o'lchash tanlangan + Umami ulangan | `14-PmLesson25-v3.md` + `08-PipelineProject-v3.md` |
| 7 | `07-MvpFirstScreen-v3.md` | loyiha kuni: 8 ekran + 3 blok | talab yozilgan, birinchi ekran ishlaydi | `08-PipelineProject-v3.md` |
| 8 | `08-PmDesignMotion-v3.md` | PM qismi + amaliyot bloki | 1 namuna tanlangan + animatsiyalar agent orqali | `14-PmLesson25-v3.md` + `08-PipelineProject-v3.md` |
| 9 | `09-MvpComplete-v3.md` | loyiha kuni: 8 + 3 | ishlaydigan MVP, deploy | `13-FullSystemProject-v3.md` |
| 10 | `10-PmUsabilityTest-v3.md` | PM | sinov rejasi + sinfdosh bilan sinov, kuzatuv yozuvi; uyga — real odam | `14-PmLesson25-v3.md` |
| 11 | `11-MvpIteration-v3.md` | loyiha kuni: 8 + 3 | eng muhim muammo tuzatilgan | `08-PipelineProject-v3.md` |
| 12 | `12-PmUserStoryPitch-v3.md` | PM | muammo → yechim → foydalanuvchi hikoyasi bilan pitch, repetitsiya | `14-PmLesson25-v3.md` |

Hamma darsda: real odam bilan ish — darsda sinfdosh bilan juftlikda, real odam uyga (qaror 7); amaliyot blokida Mentor misoli repo'da, blok oxirida «shu promptni o'z g'oyangizga yozing» (qaror 8);
oldingi va keyingi dars nomi — `00-NOMLAR.md` dan (1-darsdan oldingi dars: 8-Modul «Raqamingiz nimani isbotlaydi?»; 12-darsdan keyin — «Zaxira dars»).

## 5. GATE M kelishuvlari (05.10.2026, tasdiqlangan — hamma MD shu holatda)

- **K1 kataklar:** 6 ta, boshlanishi 16:00 … 21:00 (oxirgisi 21:00–22:00). Repo namuna bandlari: Shanba 17:00 va 20:00; 18:00 bo'sh (10-dars sinov vazifasi). Yakshanba — hammasi bo'sh (repo `dars-07-done` bilan bir xil).
- **K2 `kun`:** sana (`2026-10-10`); ekranda kun nomi («Shanba»). Namunada bugun — Dushanba `2026-10-05`.
- **K3 kun almashtirgichi:** strelkali «‹ Bugun ›» (4-darsda statik «‹ Shanba ›», 7-darsda ishlaydi). 10-dars «kunni sezmadi» muammosi shu kichik strelkalar haqida.
- **K4 intervyu:** 5 yozuv — 5 o'yinchi. Taqsimot: 1, 2, 4 — band + telefon; 3 — band; 4 — yana jamoa; 5 — jamoa + pul. 2-darsdagi maydon egasi suhbati — savol namunasi, beshlikka kirmaydi.
- **K5 sinov:** 10-dars yozuvi — manba: bitta o'yinchi, uch to'xtash (kunni topish 0:00–0:25 · tugma 0:41–1:43 · «Band qilindi» dan keyin 18 s). Tuzatish (11, 12): «Band qilish» tugmasi ekran pastiga qotiriladi.
- **K6 analitika misoli (6-dars):** ochdi 12 · vaqtni tanladi 9 · band qildi 2.
- **K7 nomlar:** `EGA_PAROLI`, `JWT_SECRET`, `WEB_ORIGIN` (`backend/.env`, Render) · `VITE_UMAMI_ID`, `VITE_API_URL` (`web/.env`, Netlify) · ega sahifasi `/ega` · to'qnashuv `409 · Bu vaqt band`.
  Test bandlari: 9-darsda 19:00 (A1) va 21:00 (A3) — 18:00 10-dars sinovi uchun bo'sh qoladi.
- **K8 so'zlar:** «sinov» — faqat real odam bilan (10–12); o'z ishini ko'rish — «tekshirish»; «maydon» — faqat futbol maydoni.
- **K9 keyslar** (takrorlanmaydi): 1 Dropbox · 2 «The Mom Test» (ramka «Kitobdan») · 3 Instagram · 8 Tweetie · 10 «300 million dollarlik tugma» · 12 Canva. 4, 5, 6, 7, 9, 11 — keyssiz.
- **K10 repo:** `github.com/Azizbekcrypto/maydon`. 4-darsda o'quvchi Fork → `git clone https://github.com/{sizning login}/maydon.git`.
  Upstream `main` — bo'sh boshlang'ich holat (o'quvchi noldan quradi); yechim commitlari alohida tarmoqda, teglar `dars-NN-start` va `dars-NN-done` ularda («qur» da yoziladi).
  «Ortda qoldingizmi»: `git fetch https://github.com/Azizbekcrypto/maydon --tags` · `git checkout -f dars-NN-start` (1-blok) yoki `dars-NN-done` (keyingi bloklar) — 8-Modul naqshi.
- **K11 App.jsx osti yozuvi:** 3-dars «sanoq, …», 4-dars «… — chizma».

**Savollar javobi:** M-q1 «O'z g'oyangiz» — blokning alohida 5-qadami · M-q2 «prompt» — agentga xabar; «talab» (7-darsda tug'iladi) — promptning uch qatori: qayerda · nima qilsin · nima buzilmasin ·
M-q3 «zanjir» o'rniga «uch qadam» · M-q4 «chizma» va «stack» · M-q5 dars oldingi dars natijasini o'qiydi, yo'q bo'lsa o'quvchi o'zi yozadi (kalit nomlari «qur» da bitta ro'yxat) ·
M-q6 PM darslarida kod ekrani qoladi · M-q7 deploy: Backend — Render, sayt — Netlify, ikkalasi GitHub'dan (push → o'zi yangilanadi) ·
M-q8 Umami akkauntini o'quvchi o'zi ochadi, ocholmasa — Mentor akkauntiga sayt · M-q9 PM uyga vazifasi — yakun kartasida, alohida fayl yo'q ·
02-q0 keys qoladi, ramka «Kitobdan» · 06-q0 keyssiz · 12-q0 pitch 1 daqiqa, juftlikda 2.

## 6. Darslar orasida saqlanadigan natija (GATE M M-q5; kalitlar — dars MD lari va auditdan, 05.10.2026)

Qoida: dars oldingi dars natijasini o'qiydi; yo'q bo'lsa — o'quvchi o'zi yozadi (erkin qator). Kalit nomi — `pm-m7dN-<nima>`.

| Kalit | Yozadi | O'qiydi | Tarkib |
|---|---|---|---|
| `pm-m7d1-ilovalar` | 1-dars s8 | — | `[{ nom, yechim, muammo, kim }] × 3` |
| `pm-m7d1-muammolar` | 1-dars s10 | 2-dars s8 (ro'yxat) | `{ muammolar: [{ matn, manba }] × 10 }` |
| `pm-m7d1-tanlangan` | 1-dars s13 | 2-dars s8 (tanlangan holda) | `{ matn, kim }` |
| `pm-m7d1-code` | 1-dars s11 (kod oynasi qoralamasi) | — (dars ichida) | HtmlCompiler `storageKey` — 6-Modul naqshi `pm-m6dN-code` (F-1005-74) |
| `pm-m7d2-code` · `pm-m7d10-code` · `pm-m7d12-code` | 2-dars s10 · 10-dars s10 · 12-dars s10 (kod oynasi qoralamasi) | — (dars ichida) | shu naqsh (2-to'lqin, 05.10) |
| `pm-m7d5-code` · `pm-m7d5-code-s8` | 5-dars s5 · s8 (ko'p faylli kod oynasi) | s8 `style.css` ni s5 qoralamasidan o'qiydi | shu naqsh (2-to'lqin, 05.10) |
| `pm-m7d2-shablon` | 2-dars s8 | 2-dars s9, 3-dars | `{ muammo, kimdan, savol1 }` |
| `pm-m7d2-mashq` | 2-dars s9 | 3-dars | `{ kim, voqea, qildi, qiyin }` |
| `pm-m7d3-muammo` · `pm-m7d3-mvp` | 3-dars s8 · s10 | 12-dars (muammo gapi) | 3-dars MD dagi tarkib |

| `pm-m7d6-qadamlar` | 6-dars s7 | 6-dars A2 5-qadam, uyga vazifa | `{ asosiy, oldingi, hodisa }` |
| `pm-m7d10-vazifa` | 10-dars s8 | 10-dars s12 | `{ matn }` |
| `pm-m7d10-sinov` | 10-dars s9, s12 | — (11-dars MD dagidek namuna kuzatuv bilan; F-1005-96 A, 05.10) | `{ toxtashlar: [{ vaqt, matn }], birinchi }` |
| `pm-m7d12-pitch` | 12-dars s9 | 12-dars s12 | `{ raqam, muammoHikoya, yechim, sinovHikoya }` |

`pm-m7d3-muammo` ni 6-dars s7 (kirish qatori) va 12-dars s9 (raqam) ham o'qiydi. Yo'q bo'lsa — o'quvchi o'zi yozadi (M-q5). Yangi kalit kerak bo'lsa — quruvchi hisobotga yozadi, o'zi o'ylab topmaydi.
