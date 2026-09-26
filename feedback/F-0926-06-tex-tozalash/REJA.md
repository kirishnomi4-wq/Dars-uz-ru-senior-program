# F-0926-06 — Texnik darslar tozalash (1–4c, 52 dars) · REJA

Tuzildi: 2026-09-26 kech. Asos: commit `e4d4ced` (PM 25/25 + 5–6-Modul tayyor). Qonun: DARS_ETALON **159** (1–15-band).

## 0. Hozirgi holat (o'lchandi, 26.09)
| Modul | Dars | Ro'yxat |
|---|---|---|
| 1 | 11 | CssLesson1 · CssLesson2 · CssPractice · Deploy · Git · **Htmllesson1 (etalon)** · Htmllesson2 · HtmlPractice · HtmlTakrorlash · **InternetLesson** (fleshkarta istisno) · VsCode |
| 2 | 10 | JsConditions · JsFunctions · JsIntro · JsLoops · JsVars · PeanStack · Practice1–4 |
| 3 | 10 | ReactApiGet · ReactApiPost · ReactBuildSite · ReactCrudPractice · ReactFirstComponent · ReactIntro · ReactProjectDay · ReactPropsReuse · ReactRouterPractice · ReactStateEffect |
| 4 | 11 | ApiPostman · AuthEnv · BackendCrudPractice · DataIntro · DbSqlNosql · FullstackConnectPractice · FullstackFeedback · FullstackProjectDay · NodeServer · PostgresCrud · Routing |
| 4a/4b/4c | 10 | NestArchAlive/Practice/Resource · EdgeCasesTest · JestUnitTest · AiPipelineProject · **CiCdIntro (etalon)** · FullPipelineProject · FullProPipeline · GithubActions |

- `lint:dizayn` (52 dars): **D1 stripe 545** · D2 kesik 31 · D3 tepa-chiziq 13 · D5 karta ichida «bosing» 409 · D6 yorliqli yo'riq 38 · `ico:` 13 · emoji 195–466/dars.
- Codemod quruq yurish: stripe **554** · qora tugma **109** · frame-dash **91** (bir qismi «QO'LDA») · ico **92**.
- page-audit (ALIGN/SCROLL/DUP/INP/ZBTN) — hali o'lchanmagan (1-bosqichda).

## 1. Tayyorlov (bosh-agent, agent YO'Q)
1. Snapshot: `arxiv/tex-tozalash-oldin-2026-09-26/` (52 fayl) + kalit-token bazasi (`keytok.py` — INLINE_KEYS/correctIdx/correct/lessonId/answerKey/SCREEN_META).
2. Baza-o'lchov: `tools/page-audit.mjs` 52 dars, uz, `--clicks=2 --shots` → `OLCHOV_OLDIN.md` (fonda, 3 parallel, ~40 daq).
3. `TOZALASH_PROMPT.md` (texnik variant) — 159/1–15 + taqiqlar ro'yxati + hisobot shakli, shu papkada.

## 2. Pilot — bitta dars (CssLesson1) → **[GATE P] foydalanuvchi suratni ko'radi**
Tartib: codemodlar (stripe → dark-btn → frame-dash → zbtn-float → ico → ui-clean → taskspec) → 1 agent (159/7–15 ko'z-ishi)
→ bosh-agent: gates 6/6 · lint:jsx · lint:dizayn 0🔴 · kalit AYNAN · page-audit uz+ru · ru-walk · oldin/keyin suratlar (rasmli sahifa).
Pilot sabog'i PROMPT'ga yoziladi, keyin qolgan 51 dars.

## 3. Codemod to'lqini — 51 dars bir yo'la (skript, arzon)
Modul-modul: `--write` → har fayl gates 6/6 + kalit AYNAN. «QO'LDA» qolgan frame-dash joylari ro'yxatga (4-bosqichga).

## 4. Agent to'lqinlari — 5 tadan (≈10 to'lqin)
- Bitta agent = bitta fayl, turn-byudjet ≤80, ~120–170k token; kirish: `audit.json` + suratlar + PROMPT.
- TEGILMAYDI: INLINE_KEYS, set_quiz_keys, correct/correctIdx, answerKey, lessonId, SCREEN_META, checks, evalEquals,
  kod-namuna mantiqi, ekranlar soni/tartibi; umumiy fayllar (`HtmlCompiler.jsx` va b.) — faqat ruxsat bilan.
- Har natijadan keyin bosh-agent: gates · kalit · page-audit uz+ru · ru-walk (`CHROME_PATH`, domcontentloaded) · surat.
- Agent savollari: aniq qoida bo'lsa bosh-agent hal qiladi, didga oid → `OCHIQ_SAVOLLAR.md`.

## 5. Modul yakuni (har modul uchun takrorlanadi)
Rasmli ko'rik-sahifa (oldin/keyin + ochiq savollar, javob tugmalari) → **[GATE M] foydalanuvchi** → tuzatish →
STATE-yozuv → commit (buyruq bilan). Tartib: 1 → 2 → 3 → 4 → 4a/4b/4c.

## 6. Yakun
Qonun/korpus muhri (yangi sinflar) · `KATTA_TOZALASH.md` yangilash · demo-sayt (`npx vercel login` kerak) ·
`yuklash-<sana>/` (CRM: 5→7-M, 6→8-M) · push (buyruq bilan).

## Xavf va choralar
- Token: agent faqat ko'z-ishiga; skript qila oladigani skriptga (memory `subagent-token-sarfi`: 57M/yurish bo'lgan).
- Yolg'on «toza»: ru-walk `CHROME_PATH=/usr/bin/google-chrome`; XATO — yolg'iz qayta yurgiziladi; HtmlCompiler'da `grep -a`.
- Etalon darslar (Htmllesson1, CiCdIntro) — boshqa darslar ulardan nusxa oladi: ular BIRINCHI emas, qaror bilan.
- `.jsx` ichidagi CSS izohiga backtik yo'q; `nom` kabi o'zgaruvchi o'chirilsa — ishlatilishi grep qilinadi (esbuild tutmaydi).

## Taxminiy hajm
Tayyorlov ~1 soat · pilot ~1–1.5 soat · codemod ~1 soat · agentlar ~10 to'lqin × 40–60 daq · har modul ko'rigi siz bilan.
Token: agentlar ≈ 52 × 150k ≈ 8M.

## Foydalanuvchi qarorlari (26.09 kech)
1. Etalonlar (Htmllesson1, CiCdIntro) ham tozalanadi — o'z modulining OXIRIDA.
2. `.homework.jsx` — alohida bosqich, keyin.
3. Har modul oxirida rasmli ko'rik-sahifa (artifact) — foydalanuvchi ko'radi.
4. Pilot — CssLesson1.
