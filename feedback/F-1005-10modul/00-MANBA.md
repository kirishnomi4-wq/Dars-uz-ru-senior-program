# LMS 10-Modul «Gipotezani qanday tekshirish + texnik MVP praktikasi» — manba (konveyer 0-bosqich)

Kod: `src/8-Modull` · kalitlar `m8-NN` · App.jsx `id: '8'` · 05.10.2026 · F-ID 150 dan

## 1. Dastur v9 — 10-modul (13 dars: 11 + 2 zaxira)

Maqsad (dasturdan): o'z analitikasi, A/B testlar, kiberxavfsizlik, production deploy. **Texnik cho'qqi:** o'z hodisalar tizimi (event-tracking) + jonli dashboard.
TEX 3 · AI-PRAKT 3 · PM+PRAKT 2 · PM 3 · zaxira 2 · Demo Day **yo'q** (yillik natijalar 10–11-darslarda pitch shaklida; ommaviy himoya — 11-modul, Demo Day 7). Jadvalda: 11–12-oy.

| № | Tip | Mavzu (dastur) | Mazmun | Natija |
|---|---|---|---|---|
| 1 | PM | OKR: maqsad → metrika → tajriba | North Star + OKR; o'lchanadigan maqsadlar | Keyingi oyga OKR |
| 2 | TEX | O'z event-tracking tizimi (cho'qqi) | Hodisa nima, qanday ushlanadi va saqlanadi; o'z trekingimizni quramiz | Mahsulotning 3 hodisasi Database'ga yoziladi |
| 3 | AI-PRAKT | Jonli mini-dashboard | Talab — o'quvchidan, agent deyarli real-time dashboard yig'adi | Dashboard jonli foydalanuvchilarni ko'rsatadi |
| 4 | PM+PRAKT | A/B test: gipoteza + ishga tushirish | 20 daqiqa — gipoteza; B varianti shu darsda foydalanuvchilarga ketadi | 1 A/B test ishga tushirilgan |
| 5 | TEX | Kiberxavfsizlik: asoslar | 2FA, SQL injection, XSS, GDPR, sirlarni saqlash | Zaifliklarni topadi va yopadi |
| 6 | PM+PRAKT | Xavfsizlik — ishonch + audit | 20 daqiqa — ma'lumot sizib chiqishi; keyin audit + maxfiylik siyosati e'lon qilinadi | Audit o'tilgan, siyosat saytda |
| 7 | TEX | Production deploy | Domen, SSL, monitoring, ogohlantirishlar | SSL + uptime-monitoring sozlangan |
| 8 | AI-PRAKT | Loyihani prodga ko'tarish — 1-qism | Eng yaxshi loyihani production darajasiga | Production darajadagi loyiha |
| 9 | AI-PRAKT | Prodga ko'tarish — 2-qism + code review | Code review'da har qarorni tushuntiradi | Kod himoyaga tayyor |
| 10 | PM | Yillik himoya: bir yillik yo'l | Bo'ldi → bo'ldi → keyin nima; hamma loyihalar portfolio sifatida | Yilning vizual vaqt chizig'i |
| 11 | PM | Pitch repetitsiyasi | 5 daqiqalik pitchning to'liq repetitsiyasi, qattiq fidbek | Pitch tuzatilgan |
| 12 | REZERV | Zaxira dars | — | — |
| 13 | REZERV | Zaxira dars | — | — |

## 2. Nomuvofiqlik: App.jsx `id: '8'` bloki dasturga mos emas

| | App.jsx (hozir, eski reja) | Dastur v9 |
|---|---|---|
| Qatorlar | 14 (11 + 2 zaxira + «Demo Day 4 — yillik himoya») | 13 (11 + 2 zaxira), Demo Day yo'q |
| 2-dars | «Analitika amalda» — Plausible/Umami (Umami 9-Modulda allaqachon ulangan) | O'z hodisalar tizimi (TEX, cho'qqi) |
| Dashboard darsi | **yo'q** | 3-dars, AI-PRAKT |
| A/B test | PM | PM+PRAKT (B varianti shu darsda ishga tushadi) |
| Xavfsizlik — ishonch | PM, «privacy as a feature» | PM+PRAKT (audit + maxfiylik siyosati saytda) |
| Loyiha kunlari | 3 ta (apgreyd, prod-apgreyd 1, 2) | 2 ta (8, 9); uchinchi AI-PRAKT — dashboard (3) |
| 11-dars | «Demo Day 4 repetitsiyasi» | Pitch repetitsiyasi (Demo Day 7 — 11-modulda) |
| Kalitlar | `m8-02` … `m8-15` (teshikli) | — |
| Modul nomi · davr | «Gipotezani qanday tekshirish» · oy 10.5–12 | «… + texnik MVP praktikasi» · 11–12-oy |

`period` — hamma modulda eski hisobda (9-Modul jurnali, MEXANIZM-TAKLIF 1); bu seans tegmaydi.

## 3. Oldingi modul va 10-Modul tayanadigan narsalar

- Oldingi dars: `m7-12` «Pitchingizda kimning hikoyasi bor?» → `m7-13` «Zaxira dars» → **`m8-01`**. Oxirgi dars `m8-11` → `m8-12`, `m8-13` zaxira → 11-modul (App.jsx da hali yo'q).
- 9-Modul (kod `src/7-Modull`) — **holat:** 12 MD GATE M dan o'tgan, ChatGPT auditi Filtr bilan yopilgan; pilot 1 va 7-darslar qurilgan; qolgani «qur» kutadi.
  Misol-ip «Maydon» (futbol maydonchasini band qilish), repo `maydon` (`~/Desktop/maydon`, remote hali yo'q; `main` + `yechim`, teglar `dars-04…11-start/done`).
  `dars-11-done` holati: sayt React (Vite, `motion`) + Backend NestJS (TypeORM, `pg`, JWT) + Database Neon; yo'llar `GET /vaqtlar` · `POST /bandlar` · `POST /kirish` · `GET /bandlar`;
  ega sahifasi `/ega` parol bilan; Umami hodisalari `vaqt-tanladi`, `band-qildi`; deploy — Backend Render, sayt Netlify; `SINOV.md`.
  **10-Modul tayanchi shu faktlarga suyanadi — 9-Modul tayanchi o'zgarsa, «qur» dan oldin solishtiriladi.**
- O'tilgan atamalar (grep, `.jsx`): «bosh raqam» (5-Modul `m5-14`, 4 fayl) · North Star (2 fayl, «Qutb yulduzi» izohi bilan) · «hodisa» (30 fayl; 9-Modulda — analitikaga yoziladigan bitta harakat) ·
  A/B (8) · 2FA (4) · domen (8) · monitoring (6) · portfolio (5) · OKR, XSS, SQL injection, SSL, code review, dashboard, maxfiylik — 1 tadan. To'liq ro'yxat — tayanchda.

| 10-Modul darsi | Oldin o'tilgan (tayanchda aniqlanadi) |
|---|---|
| 1 · OKR | 5-Modul «Botingiz yaxshi ishlayotganini qaysi raqam aytadi?» (bosh raqam + uch raqam) · 6-Modul «Raqamingiz nimani isbotlaydi?» |
| 2 · hodisalar | 9-Modul 6-dars (Umami, `vaqt-tanladi`) · 6-Modul Backend + Database |
| 4 · A/B | 9-Modul 10–11 (sinov va tuzatish) |
| 5–6 · xavfsizlik | 4-Modul kirish va `.env` · 9-Modul ega sahifasi (parol, JWT) |
| 7 · deploy | 4c-Modul «CI/CD + Deploy» · 9-Modul 9-dars (Render + Netlify) |
| 10–11 · himoya, pitch | 9-Modul 12-dars (1 daqiqalik pitch) · 3-Modul «Ishlayotgan saytingizni qanday ko'rsatasiz?» |

## 4. Dars turi → qolip (foydalanuvchi qoidasi, 05.10)

| Tip | Darslar | Qolip |
|---|---|---|
| PM | 1, 10, 11 | PM dars (`PM_DARS_ETALON.md`, QVoqea, QMustaqil, QNatija) |
| TEX | 2, 5, 7 | texnik dars (QTushuncha, QKod, QTest) + kerak bo'lsa repo bloki |
| PM+PRAKT | 4, 6 | **11 ekran:** PM nazariya → darhol 2 amaliyot bloki → yakuniy test → podium → yakun |
| AI-PRAKT | 3, 8, 9 | loyiha kuni: **8 ekran + 3 blok** (P-058), repo ustida |
| REZERV | 12, 13 | dars qurilmaydi (`comp` siz qator) |

Uyga vazifa — yakun kartasida, alohida `.homework.jsx` yo'q. «Qur» — 9-Modul pilotidan keyin, foydalanuvchi buyrug'i bilan.
