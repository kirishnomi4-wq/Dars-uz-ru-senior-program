# 🎛️ BOSHQARUV-DISPETCHER (har seansda avto-yuklanadi)

> Bu fayl — **yo'l ko'rsatkich**, kontent EMAS. Qoidalar o'z hujjatlarida yashaydi;
> bu yerda faqat «qaysi vaziyatda → qaysi retsept → qaysi hujjat» xaritasi.
> Bu faylni o'zgartirish = jarayonni o'zgartirish — faqat foydalanuvchi roziligi bilan.

## 1. Hujjat-xarita (4 tur, 4 joy)

| Tur | Fayllar | Qoida |
|---|---|---|
| **QONUN** (qanday bo'lishi kerak) | `DARS_ETALON.md` (texnik) · `PM_DARS_ETALON.md` (PM, qonun 1–67) · `MATN_ETALONI.md` (til, umumiy) · **`MATN_KORPUS.md` (oltin-namunalar — matn YOZISHDAN OLDIN o'qiladi, qonunlar tekshiruvga)** · `PM_Prompt_v8.md` (senariy-qonun) · `RU_I18N_SPEC.md` (ru-mexanizm) | Faqat raqamlangan qonun/lug'at. Yangi qonun = yangi raqam, eski raqam o'zgarmaydi |
| **JARAYON** (qaysi tartibda) | `PIPELINE.md` (texnik zanjir) · `PM_PIPELINE.md` (PM zanjir) · `OQUVCHI_DARVOZA.md` (👦 simulyator-spec) | Zanjir/darvoza/o'tish-shartlari. Rol-mazmuni bu yerda YO'Q — u agent-faylda |
| **HOLAT** (nima bo'ldi) | `PIPELINE_STATE.md` · `PM_PIPELINE_STATE.md` | Faqat raund-yozuvlar (sana + nima qilindi + hukm). Har feedback F-ID bilan (quyida) |
| **ROLLAR** | `.claude/agents/role/*` (texnik + umumiy: jonli, verifikator, o'quvchi, qabulchi) · `.claude/agents/pm/*` (PM) | Har rol o'z scope-fence bilan. `.claude/` da FAQAT agentlar+sozlamalar turadi |

Yordamchi joylar: `arxiv/` (eski tarix — L1_TARIX, AVTOPILOT_CHECKPOINT, eski hisobotlar) ·
`feedback/` (foydalanuvchi rasm-annotatsiyalari va tashqi fidbek-fayllar) ·
`pm-senariylar/` (GATE S dan o'tgan senariylar) · `memory/` (seanslararo xotira — avto).

## 2. Vaziyat-jadvali (foydalanuvchi nima desa → qaysi retsept)

| Foydalanuvchi so'zi | Retsept |
|---|---|
| «yangi PM dars yarat / M__-D__ qur» | **A** |
| «bu xato / mana feedback / rasmga qara / bu tushunarsiz» | **B** |
| «shu darsni yaxshila / audit qil / etalonga tortaylik» | **C** |
| «commit / push / deploy» | **D** |
| Texnik (HTML/CSS/JS) dars ustida ish | A/C ning texnik varianti — `PIPELINE.md` |

## 3. Retseptlar

### A — YANGI PM DARS
1. O'qi: `PM_PIPELINE.md` (zanjir) + `PM_DARS_ETALON.md` + `PM_Prompt_v8.md`; manba-namuna = P0 (`src/pm/PmUserStoryLesson.jsx`).
2. Senariy yoz → pm-metodist korrektura → **[GATE S]** foydalanuvchi tasdig'i → `pm-senariylar/`ga saqla.
3. Zanjir (har qadamda esbuild): Quruvchi(+`SCREEN_INTENTS`) → Dizayn → Jonli → **👦 1-o'qish** → Metodist (TUZATILDI/OQLANDI/RAD) → **👦 2-o'qish** (o'tish-shartlari: `OQUVCHI_DARVOZA.md`) → **[GATE 2]** → Tekshiruvchi → Verifikator → Qabulchi → **[GATE 3]**.
4. Yakun: `PM_PIPELINE_STATE.md`ga raund-yozuv. Commit YO'Q (buyruqsiz).

### B — FEEDBACK KELDI (eng tez-tez ishlaydigan retsept)
1. **ID ber:** `F-MMDD-NN` (masalan F-0724-01). Rasm bo'lsa → `feedback/`ga (public/ EMAS — u sayt-papka).
2. **Tashxis AVVAL:** muammoni aniqlab AYT, yechim taklif qil — foydalanuvchi tasdig'ini kut (yechimni so'ramasdan qilma).
3. **Tuzat** (tasdiqdan keyin) → esbuild + tegishli residue-grep.
4. **Qonunlashtirish-marshruti** (har topilma AYNAN bitta joyga; MATN-topilma esa IKKI joyga — avval korpus):
   - matn/ohang/ifoda topilmasi → **AVVAL `MATN_KORPUS.md`ga juftlik** (❌ eski → ✅ yangi + sabab + F-ID), keyin kerak bo'lsa qonun/lug'at
   - so'z/atama muammosi → `MATN_ETALONI.md` LUG'AT (qiyin·sodda·izoh·manba-sana) + grep-lanadigan bo'lsa `til-lint-rules.json`ga qoida
   - UX/tuzilma/dizayn qoidasi → tegishli `*_DARS_ETALON.md`ga YANGI raqamli qonun
   - takror bug-sinf → tekshiruvchi rol-fayliga ov-bandi
   - jarayon-o'zgarish → `PIPELINE*/OQUVCHI_DARVOZA.md`
5. **Jurnal:** `*_STATE.md`ga F-ID bilan raund-yozuv (nima topildi → nima qilindi → qayerga muhrlandi).

### C — MAVJUD DARSNI YAXSHILASH
1. Auditor (yoki pm-auditor) → GAP-hisobot → **[GATE 1]** foydalanuvchi rejani tasdiqlaydi.
2. Faqat kerakli rollar (GAP bo'yicha), har biridan keyin esbuild; matn o'zgargan bo'lsa **👦 2-o'qish** ham.
3. Yakun: STATE-yozuv. Etalon-darslar (P0 UserStory, Jtbd, Metrics, Pitch) uchun qonun-mosligi majburiy.

### D — COMMIT / RELEASE
1. Faqat foydalanuvchi buyrug'i bilan. Oldin: esbuild + `vite build` toza; STATE'da UNCOMMITTED yozuvlari bor-yo'qligini ko'rsat.
2. Deploy: PM-demo = `vite.pm.config.js` (batafsil: memory/darslar-holati).

## 4. O'zgarmas tamoyillar (qisqa eslatma — to'liqlari PIPELINE.md 3-bo'lim)
- Commit/push faqat buyruq bilan · Tashxis avval, yechim keyin · Bir fayl — bir muharrir ·
  esbuild har tahrirdan keyin · maks 2 QA-aylanish, keyin foydalanuvchiga eskalatsiya ·
  **Jim-buzilish darvozasi:** `.jsx` tahrirlangan har seansda `npm run lint:jsx` — 0 topilma
  shart. esbuild/`vite build` faqat SINTAKSISNI ko'radi; bu darvoza ma'no buzilishini tutadi
  (CSS shablon-satri ichidagi backtik → oq ekran; bir-qatorli funksiya ichidagi `//` izoh
  → qatorning qolgani o'chadi). Ikkalasi ham 2026-08-02 da prodga yetib borgan (F-0802-14/15) ·
  **Matn-darvozalari:** dars-matn yozishdan OLDIN `MATN_KORPUS.md` o'qiladi (taqlid-manba);
  matn tegilgan har darsdan keyin `npm run lint:til <fayl>` — 0 error bo'lmaguncha keyingi
  bosqichga o'tilmaydi (qoidalar: `til-lint-rules.json`, lug'at bilan juft o'sadi) ·
  **Prompt-gigiena darvozasi:** rol/qonun/jarayon MD tahrirlangan har seans yakunida
  `npm run lint:prompt` (aralash-yozuv homoglif detektori; jurnal-misollar va ruscha
  defis-birikmalar avto-istisno) — 0 topilma bo'lishi shart ·
  Rol-fayllar `.claude/agents/`dan tashqariga ko'chirilmaydi.
