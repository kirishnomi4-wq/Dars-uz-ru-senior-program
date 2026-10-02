# DAVOM — F-0928-06 · v9 bo'yicha tushib qolgan 3 PM dars (2026-09-28 12:25 muhr)

> Yangi seans SHU FAYLDAN boshlaydi. Foydalanuvchi ~4–5 soatdan keyin yozadi (noutbuk zaryadi).
> Parallel seans (5-Modul QA fidbek) alohida ishlayapti — chegara pastda, 6-bo'lim.

## 1. Nima uchun bu ish
v9 dasturi (`CoddyCamp_Senior_2026_v9_14modul .html`) 3 ta PM darsni boshqa modulga ko'chirgan, `App.jsx` eski tartibda edi →
LMS'ga yuklangan modullarda bo'shliq. Raqam-xaritasi: **bizning N-Modul = v9 (N+1)**, 4a/4b/4c = v9 6. v9 1-Modul (Foundation: JS asoslari + Figma/Canva, 20 dars) bizda YO'Q — kim tayyorlashi so'ralmagan/javob yo'q.

## 2. Uchta dars — holat (hammasi GATE 2 kutmoqda)
| Dars | Fayl | App.jsx | Senariy | Holat |
|---|---|---|---|---|
| Muammoni qanday topamiz | `src/2-Modull/PmMuammoIzlash.jsx` (YANGI, lessonId `pm-m2d3-v1`, 18 ekran) | `m2-16`, n:3 (PmLesson4 dan keyin) | `pm-senariylar/M2-D3-MuammoIzlash.md` | 👦2 5/5 PASS (18/18) |
| Bitta natija, uch xil sabab (JTBD) | `src/pm/PmJtbdLesson.jsx` (QAYTA QURILDI, `pm-m3d3-v1`, 17 ekran) | `m3-17`, n:3 (User Story dan keyin) | `pm-senariylar/M3-D3-JTBD.md` | 👦2 5/5 PASS (17/17) |
| Botingiz yaxshi ishlayotganini qaysi raqam aytadi? (Metrika) | `src/pm/PmMetricsLesson.jsx` (QAYTA QURILDI, `pm-m5d11-metrika-v1`, 18 ekran) | `m5-14`, n:11 (PmLesson21 dan oldin) | `pm-senariylar/M5-D11-Metrika.md` | 👦 yakuniy 5/5 PASS (18/18) |

Bajarilgan zanjir (har uchalasida): senariy → metodist korrektura → **GATE S ✓ (20/20 tavsiya, 10:33)** → Quruvchi → Jonli → Dizayn → 👦1 → Metodist → 👦2 (Metrika: 2 aylanish).
Hisobotlar: shu papkada `OQUVCHI1_{MUAMMO,JTBD,METRIKA}.md` (metodist qaror-jadvallari ichida).
Hammasi: gates 7/7 · lint:keys 0 · jonli-ball tekshirilgan · smoke onFinished uz+ru ✓ (Metrika, Muammo, JTBD).

## 3. 🔴 KEYINGI QADAM — foydalanuvchidan GATE 2 javobi
Sahifa: **https://claude.ai/artifact/37jh2S7SprcbgXGKpikdvY** (53 ekran surati; har dars A «Ma'qul» / B «Tuzatish kerak» + izoh → «Nusxalash»).
Suratlar nusxasi: scratchpad (seansga bog'liq) — yangi seansda kerak bo'lsa `scripts/shot-screen.mjs` bilan qayta olinadi.

Javobdan keyingi tartib (PM_PIPELINE.md):
1. B bo'lsa — izoh bo'yicha tuzatish (mas'ul rol), keyin qayta surat.
2. **pm-tekshiruvchi** (har dars; token og'ir — turn-budget bering, tuzatmaydigan rejim afzal, [[subagent-token-sarfi]]).
3. **RU tarjima** — hozir faqat o'zbekcha. Hajm: Muammo ~?, JTBD ~650 satr, Metrika ~300+. RU_I18N_SPEC.md; siblinglar: PmLesson5 / PmLesson8 / PmLesson21 (tr({uz,ru})). Keyin ru-gate/ru-walk, `smoke-onfinished-all --lang both`.
4. **Verifikator + pm-qabulchi** → **GATE 3** (foydalanuvchi imzo).
5. Joylash:
   - Metrika → `npx vite build --config vite.m5.config.js` → coddycamp-5modul deploy ([[m5-qa-deploy-tartibi]]). ⚠ Parallel seans ham shu saytga ishlaydi — deploydan oldin foydalanuvchiga ayt.
   - Muammo + JTBD → `src/mentor/lessons.jsx` ga qo'shish (mentor zaxira sayti) + M1DemoApp/M34DemoApp kataloglari (ixtiyoriy) + LMS yuklash papkasi (yuklash-* naqshi; foydalanuvchi qo'lda yuklaydi, [[darslar-gitlabga-chiqmaydi]]).
   - Jonli sinov: yangi PIN, 2 o'quvchi, podium/arena ≠ 0.
6. Commit — faqat buyruq bilan.

## 4. Bugun qilingan boshqa ishlar (shu seans)
- 07:56 tongi 41 javob 16 faylga qo'llandi → commit **0ff0a8e** push ✓ (origin/main).
- AiPipeline 🧳 tuzatildi (commitda).
- `src/3-Modull/PmLesson8.jsx` — «O'tgan darsda» → «User Story darsida» (2 joy, uz+ru) — JTBD oraga kirgani uchun.
- `src/5-Modull/PmLesson21.jsx` — s2 ko'prik-gap (uz+ru) + shapka izohi (Metrika oldinga o'tdi).
- **F-0928-07** `setLiveLang` yo'q edi → PmLesson19/20/21 tuzatildi (smoke 8/8). 6-Modul PmLesson22–25 hali tuzatilmagan → KATTA_TOZALASH.
- `App.jsx`: m7-02, m7-03, m8-01 o'rinlari olindi; PmLesson28 importi izohga aylandi. Qolgan dark/til topilmalari HEAD'da ham bor (yangi emas).
- Yangi vosita **`scripts/ekran-belgi.mjs`** — EKRAN ≤400 o'lchovi: `CHROME=/usr/bin/google-chrome CLICK='sel1,sel2' node scripts/ekran-belgi.mjs <fayl> <ekran>` (SHOW=1 matnni chiqaradi). P0 kalibrovka: s1 492, s15 423.
- Zaxira: `arxiv/f0928-06-oldin/` (eski PmJtbd, PmMetrics, PmLesson28, App.jsx, M5DemoApp, PmLesson8, PmLesson21 + MD5.txt).

## 5. COMMIT b255464 push ✓ (12:3x) — quyidagilar kirdi (eski ro'yxat, ma'lumot uchun)
Tahrirlangan: src/App.jsx · src/m5-demo/M5DemoApp.jsx · src/pm/PmJtbdLesson.jsx · src/pm/PmMetricsLesson.jsx · src/3-Modull/PmLesson8.jsx ·
src/5-Modull/PmLesson19/20/21.jsx (setLiveLang + 21 ko'prik — endi PARALLEL seans hududi) · PM_PIPELINE_STATE.md · KATTA_TOZALASH.md · feedback/lms-sinov-2026-09-16/onfinished-sweep.*
Yangi: src/2-Modull/PmMuammoIzlash.jsx · scripts/ekran-belgi.mjs · pm-senariylar/{M2-D3-MuammoIzlash,M3-D3-JTBD,M5-D11-Metrika}.md · feedback/F-0928-06-yangi-darslar/ · arxiv/f0928-06-oldin/
⚠ Commitda parallel seans fayllari ham aralashadi — commitdan oldin `git status` ni ikkala seans bo'yicha ajratib ko'rsat, `git add -A` ishlatma.

## 6. Parallel seans chegarasi ([[parallel-seans-2026-09-28]])
- **Bu (A) seans:** yuqoridagi 3 dars, App.jsx, m5-demo/*, mentor/*, pm-senariylar (3 yangi), shu papka, PM_PIPELINE_STATE.md, KATTA_TOZALASH.md. F-ID 01…19 (ishlatilgan: 01–07).
- **B seans (5-Modul QA fidbek):** src/5-Modull/* (11 dars), MATN_KORPUS.md egasi, feedback/F-0928-QA-5modul/JURNAL.md, F-ID 20+.
- A seansning korpus-nomzodlari (MATN_KORPUS ga keyin qo'shiladi): (1) keys-slayddagi brend-izohi bashorat javobini aytmasin; (2) belgi kuchi uchun alohida so'z — «kuchi» faqat ko'paytma; (3) «qachon biladi» → «nima bo'lganda sanaladi» (vaqt/voqea ikkilanishi); (4) test varianti javobni o'zi aytmasin (Metrika s8: «50 foiz, birinchisida 25»).

## 7. Ochiq qarorlar / navbat (tegilmagan)
- v9 1-Modul Foundation — kim? (foydalanuvchiga savol)
- 6-Modul PmLesson22–25 setLiveLang (KATTA_TOZALASH F-0928-07)
- U1 bajarilgan tugma yumshoq yashil (KATTA_TOZALASH F-0928-01)
- PM 7–8-Modul RU + «Aziz» (KATTA_TOZALASH, PM1/PM-T3)
- Muammo s1 (435) va s17 (494) — P0 pretsedenti bilan OQLANDI deb hisoblangan; GATE 2 da foydalanuvchi boshqacha desa qisqartiriladi.
