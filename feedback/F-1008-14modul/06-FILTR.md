# 6-dars «Demoga tayyorgarlik: risklar va B reja» — tashqi audit (ChatGPT) Filtr bilan, 08.10.2026 (F-1008-564)

Filtr tartibi — `01-FILTR.md` dagidek. Zaxira: scratchpad `zaxira-06/`. Skript: scratchpad `f06_tuzat.py` (60 juftlik, har biri faylda aynan bir marta — skript tekshirgan).
Audit bahosi — berilmagan (uch «blocker»: login chatda, teg o'tishdan oldin, tuzatishdan keyin qayta o'tish yo'q). Hukm: **Qabul 29 · Qisman 4 · Rad 3 · Allaqachon 14** (50 band + sarlavha + 19 TS + 9 savol + 10 shart; takrorlar birlashtirildi).
⚠️ **Tasdiqlangan matnga tegadigan Qabul (foydalanuvchiga alohida):** (a) Amaliyot 3 tartibi **teg → o'tish** edi (TS10, GATE M A) — endi **o'tish → tuzatish → qayta o'tish → teg** (2, 4-band); tayanch 1.6 «teg `m14-demo`» o'zgarmadi, faqat o'rni; (b) namuna akkauntni **agent emas, o'quvchi o'zi** ochadi, agent login/parolni chiqarmaydi (1-band) — tayanch 1.6 «namuna akkaunt» o'zgarmadi, kim ochishi aniqlashtirildi; (c) `pm-m12d6-demo` sxemasiga `keyin` va `videoVaqt` qo'shildi (22, 23-band; tayanch 8).

| № | Audit | Hukm | Nima qilindi / sabab |
|---|---|---|---|
| 1 | Prompt «Ikkala akkauntning loginini menga ayt» — o'sha ekranda «login chatga yozilmaydi» qoidasi bilan zid | **Qabul** | Amaliyot 2 1-qadam prompti qayta yozildi: o'quvchi ikki namuna akkauntni ro'yxatdan o'tish ekranidan o'zi ochadi; agent faqat `namuna = true` belgisini qo'yadi va tasdiqlaydi, «Login va parolni javobingda chiqarma». Qalin qator: parol hech qayerga; login — `DEMO.md`, repo, video, kalitda yo'q. A-9, KOD. 9.58 (7-darsga ham). |
| 2 | Teg `m14-demo` demo tekshirilishidan OLDIN qo'yiladi — xatoli commitda qoladi | **Qabul** | Amaliyot 3 qayta qurildi: 1 Tayyorlov → 2 Demo o'tishi → 3 Natija: tuzatish va qayta o'tish → 4 Teg. Sarlavha «Demoni boshidan oxirigacha o'ting va teg qo'ying.» Reja 03, dars ipi, A-3 (c), yakun 1-holat, REPO 2, KOD s8. TS10 RAD (o'z qarorim teskari). 9.57. |
| 3 | Teg oldin qolsa — nomi «freeze-start» bo'lsin | Allaqachon (2 bilan yopildi) | Teg oxirga o'tdi — yangi teg kiritilmadi. |
| 4 | ✕ dan keyin tuzatilsa, qayta to'liq o'tish majburiy emas | **Qabul** | 3-qadam (c): tuzatish → `git diff` → lokal → push/deploy (mobil — qayta eksport) → **demoni boshidan oxirigacha yana bir marta**; natija — oxirgi o'tishniki; yana ✕ — «hali tugamagan», ikkinchi aylanish darsda yo'q. 9.57. |
| 5 | `DEMO.md` tayyorlov qatorlari bajarilmasdan «bajarilgan gap» sifatida yoziladi | **Qabul** | «## Tayyorlov» — `[ ]` ro'yxat (Amaliyot 1 prompti va `{demo yozuvi}` qavsi); Amaliyot 3 1-qadamda o'quvchi belgilaydi. 9.60. |
| 6 | «B yo'lga yangi kod yozilmaydi» — tuzatish kod talab qilishi mumkin | **Qabul** | → «B yo'l uchun yangi funksiya qo'shmang: bor imkoniyatni oldindan tayyorlang; muammo bo'lsa — faqat tuzatish.» — A-4, 5-ekran kulrang qator va yumshoq xabar, 4-ekran C izohi, «Endi siz bilasiz» 3, kartochka 5, TS1. 9.61. |
| 7 | «Yangi funksiya to'xtatildi» tegdan keyin — saqlang, teg tekshirilgan commitga | Allaqachon | 2-band bilan teg tekshirilgan versiyada. |
| 8 | `.env` — `git status` yetarli emas, tracked-file check | **Rad** | 13-Modul tayanch 3 / 9.41 va 03-FILTR: `git ls-files` faqat yangi maxfiy fayl paydo bo'lganda; bu darsda yangi `.env` yo'q. «`.env` ro'yxatda ko'rinmasin» — tasodifiy `git add` ovchisi sifatida qoladi. |
| 9 | `DEMO.md` ni agent yozgach, commitdan oldin haqiqiy diff ko'rilmaydi | **Qabul** | Amaliyot 1, 2, 3: «`DEMO.md` ni oching va solishtiring → `git diff -- DEMO.md` → `git add DEMO.md` → commit → push». 9.60. |
| 10 | Amaliyot 3 yangi risk qatorida ham diff | **Qabul** | 9-band bilan (3-qadam (a): «faqat shu qator qo'shilganini ko'ring»). |
| 11 | Namuna akkaunt/o'yin — Telegram, eslatma, sanoq, taklif, rejalashtirilgan ishlardan chiqarilganmi — pilot darvozasi | **Qabul** | REPO 5 «Muhrdan oldin» ga qat'iy darvoza (04-FILTR 8 davomi). 9.59. |
| 12 | Namuna o'yin sanasi «Shanba, 18:00» demo kunida o'tib ketadi | **Qabul** | REPO 5: sana demo kunidan keyin bo'lishi — agent ko'chiradi (deterministik tayyorlash pilotda). 9.59. |
| 13 | «Backend uxlagan» Render'ga qattiq bog'langan; xatti-harakat qoidasi muhimroq | Qisman | Son (15 daqiqa, 1 daqiqa) — rasmiy manba, tayanch 6, dars mavzusi — qoldi; 7-ekran to'g'ri izohi xatti-harakat shakliga o'tdi (27-band). |
| 14 | 0-ekran 1-distraktorida manbasiz son «bir-ikki soniyada» | **Qabul** | → «Ro'yxat odatdagidek, kutishsiz chiqib keladi» (45). |
| 15 | Hook «Aynan!» / «Qiziq fikr!» | **Rad** | T-028, T-067, tayanch 7 (01–05-FILTR bilan bir). |
| 16 | Reja sarlavhasi → savol «Demoni hakamlar oldiga qanday tayyorlaysiz?» | **Rad** | P-014: reja sarlavhasi — natija va'dasi, savol emas (01–05 bilan bir); «tayyorlaysiz» — ish, «tayyor bo'ladi» kafolati emas. |
| 17 | «B reja» va «B yo'l» bolalar uchun yaqin — o'qituvchi ko'prigi | **Qabul** | 5-ekran O'qituvchi eslatmasi: «Har B reja — bu risk uchun B yo'l; lekin har B yo'l video emas.» O'quvchi ta'rifi o'zgarmadi (T-015). |
| 18 | B reja — lokal fayl, saqlang | Allaqachon | O'zgarishsiz. |
| 19 | Video tekshiruviga «maxfiy tokenli manzil ko'rinmaydi» | **Qabul** | Amaliyot 2 3-qadam yozishdan oldin va 4-qadam tekshiruvi. |
| 20 | Yuz/ism/ovoz yozilsa — 14-Modul video qoidasi | **Qabul** | Amaliyot 2 3-qadam: yuz yoki ism tushsa — 2-dars video qoidasi (ota-ona roziligi) qo'llanadi. |
| 21 | Video 60 soniya va demo 60–90 orasida ishqalanish | **Qabul** | O'quvchiga «demo o'tishingiz uzunligida» (Mentor — 60 s, tayanch 1.6 o'zgarmadi). 9.62. |
| 22 | B reja gapidagi {N} kalitda saqlansin (`video: {tayyor, vaqt}`) | Qisman | `video: bool \| null` qoldi (tayanch 8, 7-dars o'qiydi); yoniga `videoVaqt: n \| null` qo'shildi — 13-dars `DEMO.md` dan o'qimaydi. TS14. 9.62. |
| 23 | Sxemada `tayyorlov`, `keyin` yo'q — 13-dars uchun zaif | **Qabul** | `keyin: string \| null` qo'shildi (A-12, tayanch 8, KOD 8); `tayyorlov` — kurs qatorlari, `DEMO.md` `[ ]` da (13-dars tayanch 1.13 dan oladi). TS4. 9.62. |
| 24 | Besh qadamga majburlash — «bu mashqda» deb aniq aytilsin | **Qabul** | Amaliyot 1 2-qadam kulrang: «Bu mashqda demongizni besh qadamga bo'ling — qadamlar mazmuni sizniki, soni mashq shakli.» |
| 25 | «Besh qadam» + «Keyin» — saqlang | Allaqachon | O'zgarishsiz. |
| 26 | O'qituvchi eslatmasi «har ma'lumot o'zgartiradigan demo…» — scope | **Qabul** | → «Holatni o'zgartiradigan demo uchun keyingi o'tishdan oldin boshlang'ich holatni qaytaring; o'zgartirmaydigan demoga kerak emas.» |
| 27 | 7-ekran to'g'ri izohi «Backend hali uyg'oq» — kafolat | **Qabul** | → «Navbatdan sal oldin ochsangiz, 15 daqiqa so'rovsiz qolmaydi.» (xatti-harakat shakli). 9.62. |
| 28 | Uyg'ondi = ro'yxat chiqdi — saqlang | Allaqachon | O'zgarishsiz. |
| 29 | «Uyg'otish» — kurs qisqartmasi, saqlang | Allaqachon | O'zgarishsiz. |
| 30 | Tegdan oldin toza ish daraxti va commit GitHub'da bormi | Allaqachon | Tartib: tuzatish commit/push → toza → teg (4-qadam). |
| 31 | «tag already exists → faqat push» — xavfli | **Qabul** | 4-qadam: `git rev-parse HEAD m14-demo` — ikki qator bir xil bo'lsa «Teg GitHub'da», bo'lmasa «Teg mos emas» (ko'chirish o'rgatilmaydi, TS9). 9.57. |
| 32 | `git ls-remote` faqat borligini ko'rsatadi | **Qabul** | 31-band: ikki shart — remote'da bor **va** HEAD bilan bir. |
| 33 | `teg: true` kam ma'lumot — mos emas holati true bo'lmasin | **Qabul** | `teg: true` faqat ikkala shart bajarilganda; «Teg mos emas» — `false`. Sxema turi o'zgarmadi. |
| 34 | `otishVaqt` soniyada — saqlang | Allaqachon | O'zgarishsiz. |
| 35 | «Yechim bo'lagi: 90» — demo 90 ichida tugashi shart degandek | **Qabul** | Taymer belgisi izohi: «pitch mashqida Yechim bo'lagiga 90 soniya ajratilgan, jonli demo shu ichida joylashadi; vaqt baho emas». |
| 36 | Tuzatishdan keyin mobil/web ko'rinish yangilanishi unutilmasin | **Qabul** | 3-qadam (c): mobil — brauzer ko'rinishini qayta eksport, web — Netlify kutish, ikkala qurilmada sahifa yangilanadi; O'qituvchi eslatmasi. 9.57. |
| 37 | «Bajardim» — to'g'rilik emas; Demo Freeze tavsifi rost | Allaqachon | Tavsif qilingan ishni aytadi (P-048). |
| 38 | Yakun 1-holat — tuzatishdan keyingi OXIRGI o'tish bo'lsin | **Qabul** | Natija — oxirgi o'tishniki (qayta o'tishda belgilar kulrangdan boshlanadi); yakun 1-holat sharti: oxirgi o'tishda beshala ✓ + teg mos. |
| 39 | Besh yakun holati — saqlang | Allaqachon | O'zgarishsiz. |
| 40 | «DEMO.md tayyor» yorlig'i Amaliyot 1 dan keyin erta | **Qabul** | Yakun yorlig'i: Amaliyot 1 dan keyin «DEMO.md: ssenariy va risklar», Amaliyot 2 4-qadamdan keyin «DEMO.md tayyor». 9.60. |
| 41 | Lokal video internetsiz ochiladi — oddiy fayl | Allaqachon | «laptopda faylda» — o'zgarishsiz. |
| 42 | Video repo tashqarisida — saqlang | Allaqachon | O'zgarishsiz. |
| 43 | `git add DEMO.md` — saqlang | Allaqachon | O'zgarishsiz. |
| 44 | «Ortda qoldingizmi» — `.env` ga o'z qiymatlarini yozish xavfli | Qisman | Yo'l qoldi (faqat yangi papka, `checkout -f` chegarasi — 03-FILTR); qiymatlar kursning o'z `.env` namunasidan, LMS/chatga emas — matn o'zgarmadi, 13-Modul 9.41 bilan bir. |
| 45 | Agent «real foydalanuvchi bormi»ni qanday aniqlashi — aniq shart | **Qabul** | REPO 5: Database sharti pilotda muhrlanadi. 9.59. |
| 46 | `namuna = true` o'yin — sana filtri va rejalashtirilgan ishlar bilan mos | **Qabul** | 11, 12-band bilan. 9.59. |
| 47 | Hook Render uyqusini qaytaradi — QABUL | Allaqachon | O'zgarishsiz (maqtov — 15-band). |
| 48 | 5 risk — boshlang'ich ro'yxat, majburlanmasin | Allaqachon | «Bu risk demongizda yo'q» yo'li bor. |
| 49 | «Login esdan chiqdi» — parol `DEMO.md` da bo'lmasin | Allaqachon | Qalin qator; 1-band bilan kuchaydi. |
| 50 | 90 daqiqa — 140–190, hammasi tayyor bo'lsa 110–140 | Qisman | ⛔ Shubhali 1 ga auditor bahosi yozildi; o'lchov — pilotda taymer bilan; «uyga vazifa yo'q» (TS13) saqlandi, oshsa video Amaliyot 3 dan keyinga yoki 7-dars ①. |
| S | Sarlavhalar: asosiy QAT'IY QABUL; Reja → savol | Qisman | 16-band Rad; Amaliyot 3 sarlavhasi yangi tartibga (2-band). |
| TS | 1 → 6 · 2 ✓ (pilot) · 3 ✓ · 4 → 23 · 5 ✓ · 6 → 11 (darvoza) · 7 ✓ (pilot) · 8 ✓ · 9 → 31 · 10 → 2 (RAD — o'tish → teg) · 11 ✓ · 12 ✓ · 13 ✓ (50 bilan) · 14 → 22 · 15 → 17 · 16 ✓ · 17 → 35 · 18 ✓ · 19 ✓ | | Savollar 20–28: 20 → 1 · 21 → 2 · 22 → 4 · 23 → 5 · 24 → 31 · 25 → 11 · 26 → 21 · 27 → 22 · 28 → 6. |

**10 hard fix:** 1 ✓ · 2 ✓ · 3 ✓ · 4 ✓ · 5 ✓ · 6 Rad (`.env` tracked — 9.41) · 7 ✓ · 8 ✓ · 9 ✓ (⛔ pilot darvozasi) · 10 Qisman (⛔ pilotda o'lchanadi).

## Sinf-supurish (13 MD + tayanch, grep)
- **Agent chatida login/parol** — 07 MD (tekshiruv akkaunti prompti «Loginini ayt») — 7-dars auditida shu arxitektura bilan tuzatiladi (9.58); 02, 08 — 05-FILTR da tozalangan.
- **Teg tekshirilgan versiyaga** — 07 (`m14-dars-07-done`, REPO) teg «qur» bosqichida, o'quvchi qo'ymaydi; 13 — repo'ga tegilmaydi, git teg yo'q (13 MD 1-ekran eslatmasi).
- **Tuzatishdan keyin qayta to'liq o'tish** — 07 Amaliyot 1 4-qadam (ikkinchi aylanish «agent → push → qayta») — 7-dars auditi 9-bandi bilan.
- **`git diff -- DEMO.md`** — faqat 06 da `DEMO.md` yoziladi; 13 o'qiydi.
- **«yangi kod yozilmaydi»** — grep 13 MD: faqat 06 da edi; 07 da «yangi funksiya qo'shilmaydi» — to'g'ri.
- **Manbasiz son distraktorda** — 06 14-band; boshqa MD larda hook variantlari grep: son yo'q.

## Tekshiruv
`lint:til` 06, tayanch, 05-FILTR — 0 error · `mdtekshir.py` 06 — 12/12 ekran, arena 3/3/3/3, uzun 0 · `kesishma.py` takror 0 · `lint:prompt` ✓.
