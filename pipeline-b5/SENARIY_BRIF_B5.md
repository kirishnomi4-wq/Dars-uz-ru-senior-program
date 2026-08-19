# BATCH 5 — SENARIY-YOZUVCHI BRIFI (2026-08-19). To'rt yozuvchi, har biri O'Z faylida.

> **BAZA:** `pipeline-b3/SENARIY_BRIF_B3.md` — 0/1/2/3/4-bo'limlari AYNAN amal qiladi (o'qish tartibi,
> qat'iy relslar, darvoza, hisobot shakli). Quyida faqat B5 farqlari (delta).

## D1. Pasport — `PM_KEYS_MEXANIKA_REGISTRI.md` «🔒 BATCH 5» ikki bo'limi (R2 jadval + artefakt-shakl muhrlari)
Yo'lakchadan chiqmaysiz: keys · imzo-vizual · TEKSHIRUV · olam · koding · artefakt — oltalasi ham band.
Artefakt-shakl **muhrlangan**, o'zgartirilmaydi; taklif bo'lsa senariyning 14-bo'limiga.

## D2. Modul-ipi (108-qonun) — o'quvchining O'Z TO'LIQ TIZIMI
M6 texnik darslarida yig'iladi: `m6-01` front+back+baza+AI+bot · `m6-04` AI-agent · `m6-05/07` Claude Skills ·
`m6-08` to'liq pipeline · `m6-09…11` mobil versiya · `m6-13` loyiha kuni. To'rt PM darsi bitta ipda:
**hujjat → chegara → yo'l → sahna.** O'quvchi nima BILISHINI tekshiring — qo'shni texnik darslarni oching:
`src/6-Modull/SystemArchitectureLesson.jsx` · `AgentArchitectureLesson.jsx` · `ClaudeSkillsLesson.jsx` ·
`WriteSkillLesson.jsx` · `PipelineProjectLesson.jsx` · `FullSystemProjectLesson.jsx`.
🔴 §40 darvozasi: dars boshida o'quvchida NIMA tayyor — shuni tekshirib yozing (m6-02 da mobil versiya hali YO'Q).

## D3. Har darsning alohida qizil bandi
- **m6-02 (PRD):** «PRD» — darsning O'Z atamasi, lekin hodisadan KEYIN tug'iladi (§104/§126), maqsad-ekranda emas;
  birinchi ko'rinishda gloss. To'rt katak: muammo · kim · yechim · metrika. M2-D7 dekompozitsiya va M3-D2 hikoyadan
  farq-dalili shapkada.
- **m6-06 (etika):** keys YO'Q → **zaxira ilgak** (naqsh: `pm-senariylar/M4-D7-Ishonch.md` shapkasi + sabab).
  Mavzu og'ir — o'smir uchun ANIQ va hayotiy qoling, va'z o'qimang. MatchPairs 🔴band: «oqibat-juftlash»
  qaror↔jabr bo'ladi, nom-juftlash EMAS. Zarar ko'radigan odam — real, aniq, bitta.
- **m6-12 (roadmap):** Timeline 🔴band (M3-D10) va ikki o'qli doska 🔴band (M3-D5). Farq: tartiblash/prioritet emas,
  **UFQqa joylash** — `hozir` · `uch-oy` · `olti-oy`. Farq-dalili shapkada MAJBURIY.
- **m6-14 (metrikali pitch, Demo Day 3):** dasturdagi **5-chi** pitch darsi. `PM_KEYS_MEXANIKA_REGISTRI.md`
  5-bo'limidagi PITCH-OILASI taqiq ro'yxati TO'LIQ, ustiga m4-15 «ARXITEKTURA-QAVATLARI» / «QAROR-SABAB TANLOVI»
  va M3-D14 «GAPSIZ KO'RSATUV» ham taqiq. Imzo: «METRIKA-SLAYDI» — raqam gapiradigan slayd; TEKSHIRUV: raqam-tanlov
  (qaysi raqam isbot, qaysi shovqin).

## D4. 🔴 F-0818-03 ADABIY NORMA (B5 — birinchi batch shu darvoza ostida to'liq)
`MATN_ETALONI.md` **7-C** bo'limi (7-C.1 registr · 7-C.2 kantselyarit · 7-C.3 sheva · 7-C.4 atama · 7-C.5 grammatika)
va `MATN_KORPUS.md` **§136** — yozishdan OLDIN o'qiladi. Bosh test: **tirik o'qituvchi ovoz chiqarib shunday aytarmidi?**
Darvoza: `node til-lint.mjs pm-senariylar/<Fayl>.md` → **0 error** (87 qoida). Warn'lar izohlanadi.

## D5. Korpus — §99–136 (B3 brifida §99–129 edi; §130–136 yangi: F-0817/F-0818 saboqlari)
Ayniqsa **§134** (rang-holati distraktorda faqat rang ma'nosi matnda o'rgatilgan bo'lsa; rang-legendasi majburiy) va
**§135** (matn ekranga zid bo'lmasin · atama ta'rifsiz qolmasin · son-echo · vaqt-so'zi ham tell).

## D6. Band olamlar (96c to'qnashuv-tekshiruvi — grep bilan tasdiqlang)
lavash · OLX · kinoteatr · Uzum · YouTube · o'yin-klub · Airbnb · Starbucks · Duolingo · Instagram · maktab bufeti ·
🏀 maydoncha · musiqa/pleylist ilovasi · maktab baholar-jurnali · kutubxona · 🅿️ AvtoStoyanka · o'quvchining O'Z
Telegram-boti (M5 uchligi). B5 olami = **o'quvchining O'Z to'liq tizimi** (M6) — demo-olam kerak bo'lsa yangisini
tanlang va shapkada 96c dalilini yozing.

## D7. Darvoza va hisobot — B3 brifining 3- va 4-bo'limlari aynan (til-lint 0 error · prompt-lint toza · ~850–1100 qator ·
hisobot ≤20 qator, kod/matn-dump yo'q).

## D8. 🔴 TEXNIK QOIDA (2026-08-19 hodisasidan) — SENARIY BO'LAK-BO'LAK YOZILADI
~900 qatorli faylni BITTA `Write` chaqiruvi bilan yozish ulanishni uzadi va ishni yo'qotadi (bir kunda
ikki yozuvchi shu tarzda yiqildi). Tartib: (1) 0-shapka…4-bo'lim → (2) 5…9-bo'limlar → (3) 10…14-bo'limlar.
Har bo'lakdan keyin fayl oxiri to'g'ri yozilganini tekshiring.
