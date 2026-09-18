# KATTA §41 — saralash xulosalari (qo'lda, 2026-09-18)

Manba: `saralash.py` → `saralash.md` / `saralash.json` (avtomatik 1-o'tish). Bu fayl — ko'z bilan tekshirilgan xulosalar.

## Sonlar (98 dars · 343 trigger)

| Savat | Trigger | Fayl | Hukm |
|---|---|---|---|
| C — test | 148 | 63 | tegilmaydi (azaldan `firstAttemptCorrect`) |
| A — xato qilsa bo'ladigan topshiriq | 146 | 68 | 151-naqsh: har ekranda «xato urinish» nuqtasi belgilanadi |
| C' — `correct` hisoblanadi | 30 | 16 | **ko'pi allaqachon halol** — pastga qarang |
| B — xato qilib bo'lmaydi | 19 | 18 | nishon «tekin» — foydalanuvchi qarori (dars-badars taklif bilan) |

## C' savat: loyihada tayyor naqsh bor

4c / 5 / 6-modul darslarining bir qismi birinchi-urinish halolligini o'zicha qilgan:

- `correct: !wrongEverRef.current` — 8+ ekran (`builder` Screen13 oilasi: CiCdIntro, AiPipelineProject, BotIntro, BotApiButtons, BotStatefulMemory, BotAiAgent, WriteSkill)
- `correct: mistakes === 0` — AuthEnvLesson s7, s13
- `correct: choice === '<to'g'ri>'` — bitta tanlovli case (BotAiBrain, BotFullProject, BotAiAgent s9) — birinchi tanlov qotadi
- `firstAttemptCorrect` — ClaudeSkillsLesson s7, s13

Bularda nishon sharti TO'G'RI, lekin 151-qonunning uch bandi yetishmaydi:
1. **Shart oldindan aytilmagan** — `AchRule` qatori yo'q (3-band).
2. **F5 teshigi** — `wrongEverRef` `useRef`, progressga yozilmaydi: xatodan keyin sahifani yangilagan o'quvchi toza boshlaydi (5-band).
3. **«Qaytadan» = mashq** yo'q (6-band) — bu hamma 98 darsga tegishli.

Demak bu ekranlarda ish kichik: `wrongEverRef` o'rniga (yoki yoniga) `achMiss.miss(screen)` + `AchRule`.

Qo'lda ko'rilishi kerak (shart «xatosizlik» emas, «tugatdi»): VsCodeLesson s2/s3 (`correct: all` — hamma bo'limni ko'rdi) ·
PmLesson6 s9/s10 · PmLesson18 s9 · PmLesson22 s4 (`correct: done2`) · PmLesson25 s4 (`correct: duelDone`) — bular mohiyatan B savatga yaqin.

## Skript haqida

1-yurishda FAIL-regex `miss`/`.ok` so'zlarini tanimagan va 13 ta `ScreenCoding` ni xato ravishda B ga tashlagan edi
(PmLesson10 `ScreenCoding` da `pickKod` → `setMiss`/`missedOnce` bor). Tuzatildi: B 37 → 19. Saralash baribir TAXMIN:
A va B dagi har ekran kodga tegishdan oldin ochib tasdiqlanadi.

`src/eski/` — 1 fayl, 2 trigger: arxiv, `lms/` yig'masiga kirmaydi → sweep'dan tashqarida (tasdiqlansin).
