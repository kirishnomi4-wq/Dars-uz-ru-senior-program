# Quruvchi topshiriq-shabloni — 6-Modul v2 → kod (bitta dars = bitta agent = bitta fayl)

Vazifa: `src/6-Modull/<FAYL>.jsx` darsini tasdiqlangan MD-matnga keltiring («MD-birinchi», CLAUDE.md F-retsepti). MD = manba-haqiqat.

MANBA: `feedback/F-0929-QA-6modul/<NN>-<NOM>-v2.md` (to'liq o'qing; `[NNN]` — taxminiy qator; `✎` — izoh, kodga yozilmaydi).
Eski matn (solishtirish): `feedback/F-0929-QA-6modul/<NN>-<NOM>-sozlar.md`.

QOIDALAR:
1. Faqat `uz:` va o'quvchi ko'radigan o'zbekcha satrlar o'zgaradi; `ru:` TEGILMAYDI (alohida bosqich) — yangi `uz` yonida `ru` bo'sh qolmasin (eski ruscha / qisqa tarjima).
2. `INLINE_KEYS`, `QUIZ_BANK.correct`, variantlar TARTIBI o'zgarmaydi — MD'dagi ✔ hozirgi pozitsiyada turishini har testda tekshiring.
3. MD'da «KOD»/⚠️ KOD bandlari bajariladi: <DARSGA XOS RO'YXAT>.
4. 161-QONUN (emoji ≤4/blok, takror yo'q; mentor/savol/variant/izoh/kartochka/kod — emojisiz). MD'dagi emojilar ham limitga tushiriladi.
5. CSS shablon-satri izohida BACKTIK yo'q; bir qatorli funksiya ichida `//` yo'q. Boshqa faylga tegilmaydi. Commit yo'q.

TARTIB: MD → fayl (bir marta) → ekranma-ekran (0 → N) → Qo'shimcha matnlar (ACHIEVEMENTS, RECAPS, QUIZ_BANK, FLASHCARDS) →
har 3–4 ekrandan keyin esbuild → oxirida `npm run gates -- <fayl>` (tell + emoji 0 error) → residue-grep (dars metaforasi so'zlari `uz`da 0).
Turn-byudjeti ≤60. HISOBOT: ekranlar · KOD bandlari · gates · tell/emoji · residue · MD'dan chetlashish · ru-qarz.

## Darsga xos KOD ro'yxatlari
- 02 PmLesson22: 6-ekran (Microsoft) kartalar matni + bashorat variantlari; 15-ekran keyingi dars qatori; podium «sessiya» tegilmaydi (KATTA).
- 03 ArchPatterns: 6-ekran kod-bo'laklari (texnologiya emas); 8-savol matni; 15-ekran Mentor tartibsiz; nishon nomlari; oshxona metaforasi faqat 3-ekranda.
- 04 AgentArchitecture: 12-ekran `CASE_STEPS` `ico` → `phase` maydoni (+ tool hisoblagichi); 15-ekran `FLOW_HINTS` → «1-qadam…5-qadam», Mentor tartibsiz; hook 2 javob; sikl nomlari Idrok/Qaror/Amal; 13-ekran «KEYINGI DARS» bloki olib tashlanadi.
- 05 ClaudeSkills: 3-ekran uch bo'lim (frontmatter/description/body) matni; 7-ekran tugmalar ostida description; 15-ekran joylar «1-qadam…»; nishon nomlari; 11-ekran eyebrow.
- 06 PmLesson23: 2-ekran chegara 3 daraja; 10-ekran savol/variant; 15-ekran keyingi dars + sarlavha `tr()`; arena 8/10-savol nomlari.
- 07 WriteSkill: 13-ekran 3-bo'shliq `---` (variantlar title/name/id · description/summary/trigger · ###/===/---); 15-ekran DnD bo'laklari = jarayon (5), maxsus xato-sharti «kamchilik sinovdan oldin»; nishon nomlari; 19-ekran keyingi dars.
- 08 PipelineProject: 3-ekran tarmoqlanuvchi sxema (Node → PG/Telegram/AI); 7-ekran natijadan AI olib tashlanadi; 16-ekran DnD bo'laklari = buyurtma oqimi (5); 17-ekran qo'shimcha qadam; nishonlar; savol-eyebrow raqamlari.
- 09 ReactNativeBasics: 15-ekran `FLOW_HINTS` → «1-qadam…»; 13-ekran «KEYINGI DARS» kartasi olib tashlanadi; 16-ekran Snack asosiy; nishonlar; hook 3 javob.
- 10 ReactNativeApp: 15-ekran Mentor tartibsiz; 13-ekran kod (`JSON.stringify/parse`), token olib tashlanadi; 9-ekran `BACKEND + '/products'`; 16-ekran bosqichlar; nishonlar; savol-eyebrow raqamlari.
- 11 MobileAppPractice: `explainWrong` kalitlari (s4/s6/s13 — indeks 1 ga); 16-ekran `hints` → «1-qadam…», Mentor tartibsiz; 3-ekran tugma nomlari; 10/13 eyebrow raqamlari; 14-ekran ulashish; 19-ekran keyingi dars.
- 12 PmLesson24: 11-ekran `explainCorrect` matni; 8-ekran «6-darsda» paneli; 15-ekran keyingi dars; Koding/Mustahkamlash eyebrow.
- 13 FullSystemProject: 17-ekran DnD bo'laklari = jarayon (5), `hints`, doneText; 7-ekran sxemadan AI tuguni; 9-ekran 4-ustun «Tasdiq»; eyebrow raqamlari; nishonlar.
- 14 PmLesson25: K12 ko'prik hisoblagichdan chiqariladi (7-karta counter'siz); kod `sanagani: "natija"`, `isbotlar` → `dalillar` + tekshiruv-shartlari; sarlavha `tr()`; keyingi dars; nishon «Result Finder».
