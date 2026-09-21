---
name: pipeline-qoidalari
description: "Rol-pipeline yuritish qoidalari (QOIDA 10-13 + darvozalar) — eski mashinada qimmatga tushib o'rganilgan, hozir ham amal qiladi"
metadata: 
  node_type: memory
  type: project
  originSessionId: c0edd3e6-e97f-4f1c-9d67-b34e8de431a5
  modified: 2026-07-24T19:15:16.731Z
---

**👦 O'QUVCHI-SIMULYATOR DARVOZASI (2026-07-24, kalibrlash o'tdi — YOQILGAN):** yangi agent `role/darslik-oquvchi.md` (Read/Grep/Glob, tahrir YO'Q) — 13-yosh rolida darsni o'qib 4 savolga javob beradi; Jonli'dan keyin (1-o'qish) + Metodist'dan keyin (2-o'qish). Spec: `.claude/PIPELINE_QOSHIMCHA_v2.md`. Kalit-mexanizmlar: JSX-o'qish qoidalari (izoh/CSS/MentorNote = ko'rinmas, reveal-gated = keyin), avto-oqlanish (dars gloss bergan so'z hisobotga tushmaydi), SCREEN_INTENTS (Quruvchi har ekranga 1 gaplik niyat — o'lchov-kaliti; agent AVVAL o'z javobini yozadi, keyin solishtiradi), Metodist TUZATILDI/OQLANDI/RAD (sababsiz RAD taqiq, 2x RAD → inson-bayroq). O'tish: bilmadim 0 · oqlanmagan so'z 0 · gloss-tartib 0 · niyat ≥13/15 · qayta-o'qish ≤2. Front-ajratish: TIL-LINT=mashina (homoglif ball-kalit sindiradi) · Metodist=til · O'quvchi=tushunish. Kalibrlash: A (eski JTBD) ~80% sezgirlik, B (UserStory) 0.6 topilma/ekran. UserStory'da SCREEN_INTENTS yozilgan (export const, 17 ekran).

Rol-pipeline (9 texnik rol `.claude/agents/` + 6 PM-rol `.claude/agents/pm/`) hozirgi repoda ham mavjud; orkestratsiya `PIPELINE.md`/`PM_PIPELINE.md`, tarix-saboqlar `L1_TARIX.md`. Human-gated; subagentlar bir-birini chaqirmaydi.

**QAT'IY QOIDALAR (eski mashinada real bug'lar evaziga o'rganilgan):**
- **QOIDA 10 — agent hisobotiga ishonma, DASTURIY tekshir.** 3 agent «PASS» degan QUIZ_BANK'da skript `012301230123` siklni topdi. Har rol-o'tishdan keyin bosh-agent o'zi skript yuritadi: correct-ketma-ketlik, practice:-1, optionalLive, ACH_TRIGGERS, esbuild. Tuzatish — SWAP usuli (matn o'zgarmaydi, answerKey avto-ergashadi).
- **QOIDA 11 — parallel agentga NOYOB scratch-katalog.** Umumiy nomlar bir-birining bundle'ini ustidan yozgan, bir dars boshqasini «tasdiqlab» yuborishiga sal qolgan. Yakunda esbuild `--metafile` bilan provenance isbotlash.
- **QOIDA 12 — qardosh-darsdan verbatim ko'chirish KONTENTNI ham ko'chiradi.** esbuild/grep toza edi — faqat MAVZU-residue grep fosh qildi. Ko'chirilgan darsga majburiy mavzu-residue grep.
- **QOIDA 13 — uzunlik-tellni GRAPHEME bilan o'lcha** (String.length emoji'da yolg'on): `Intl.Segmenter('uz',{granularity:'grapheme'})`; mezon ≤1.4× ratio.

**Boshqa isbotlangan darvozalar:**
- vite/esbuild YASHIL ≠ ishlaydi: runtime `useAudio/C is not defined` sinflarini faqat SSR-smoke/render-check ushlaydi → yangi darsga SSR smoke yoki brauzer-render majburiy.
- Count-match: SCREEN_META uzunligi == screens massivi (podium-slot unutilsa summary yetib bo'lmaydi — matematik isbot yetarli).
- Fayl-boshi «PLATFORM STANDARD vN» izohi YOLG'ON bo'lishi mumkin — versiyani marker-grep bilan aniqlash (flashcard/ACHIEVEMENTS/picked===correctIdx).
- Takrorlanuvchi bug-sinflar (yangi dars promptiga BOSHIDAN): useAudio ta'rifsiz (stub shart) · mstats a.correct ≠ picked===correctIdx · QUIZ_MS=15000 (20000 emas) · auto-open PIN useEffect taqiq · optionalLive ulanmagan · lokal mentor.png import taqiq (MENTOR_IMG URL) · placeCorrect taqiq · onboarding/TourGuide yangi darsga QO'SHILMAYDI (2026-07-10 qaror) · kompilyator har TASK shartiga sinab tekshiriladi (parseCss qisqa-xossa saboqi).
- Kalit-tekshiruv qator-diff bilan ISHLAMAYDI — faqat qiymat-extract ([[ru-i18n-konvensiya]]).
- API uzilsa parallel agent SendMessage bilan o'z kontekstidan davom ettiriladi.
- Praktika-kompilyator soni = 3 (4-5 emas); CodeStrike neon-brend (cs-cap/qz-dark) — barcha darslarda birxil.
