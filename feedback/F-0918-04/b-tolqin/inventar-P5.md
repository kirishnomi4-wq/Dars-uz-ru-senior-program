# KATTA §41 · B to'lqin — INVENTAR P5 (4c-Modull + 6-Modull) · 2026-09-19

35 trigger · 13 fayl. Har ekran komponenti (va u chaqiradigan ichki komponent) **kodda to'liq o'qildi**; brauzerda
hech biri ochilmadi. Qator raqamlari — A to'lqindan KEYINGI ishchi daraxtga tegishli. Tafsilot: `inventar-P5.json`.
`src/` ga, qonun va STATE hujjatlariga tegilmadi.

## Hukmlar

| Hukm | Soni | Qaysilar |
|---|---|---|
| **A-qol-ishi** (aniq xato-yo'l bor, `miss(screen)` 1–3 qator) | 11 | FullPipeline s10 · GithubActions s17 · PmLesson17 s9 · ArchPatterns s6, s12 · ClaudeSkills s7, s13 · PmLesson22 s9 · PmLesson23 s9 · PmLesson24 s9 · PmLesson25 s9 |
| **A-umumiy-komponent** (`onWrong` prop kerak) | 2 | FullPipeline s3 (`DebugChallenge`) · s6 (`DragDropOrder`) |
| **C-halol** (nishon allaqachon birinchi urinishga; yetishmaydi: `AchRule` + F5-saqlov) | 5 | AiPipeline s9, s13 · CiCdIntro s13 · WriteSkill s13 · PmLesson18 s9 |
| **TEKIN** (xato yo'li yo'q yoki qum-quti) → bonus | 6 | CiCdIntro s9 · PmLesson18 s4 · PmLesson22 s4 · PmLesson23 s4 · PmLesson24 s4 · PmLesson25 s4 |
| **MEHNAT** (erkin yozma ish) | 6 | PmLesson17 s8 · PmLesson18 s8 · PmLesson22 s8 · PmLesson23 s8 · PmLesson24 s8 · PmLesson25 s8 |
| **NOANIQ — qaror kerak** (koding: kod-savoli + kod yozish) | 5 | PmLesson17 s10 · PmLesson18 s10 · PmLesson22 s10 · PmLesson23 s10 · PmLesson24 s10 |

Avtomatik saralash bilan farq: «A challenge» deb belgilangan 29 tadan **4 tasi aslida TEKIN** (PmLesson18/23/24 s4,
CiCdIntro s9), **6 tasi MEHNAT** (hamma PM s8), **5 tasi koding-qaror**; «C' hisoblangan correct» 9 tadan **2 tasi
TEKIN** (PmLesson22 s4, PmLesson25 s4 — `correct: done2` xatoni emas, bayram vaqtini boshqaradi) va **2 tasi HALOL
EMAS** (ClaudeSkills s7, s13 — pastda).

## Mexanika

| Mexanika | Soni | «Bitta xato urinish» (151-qonun jadvali) |
|---|---|---|
| tanlov-o'yin (xato tanlov rad etiladi / qotadi) | 11 | xato variant bosilgan har qadam |
| bo'shliq-to'ldirish (koddagi bo'shliqqa chip) | 4 | xato chip bosilgan har qadam |
| erkin-yozma | 6 | yo'q (mehnat) |
| pickKod (kod-savoli + kod yozish) | 5 | faqat kod-savolida bor; kod yozishda diskret urinish yo'q |
| kashfiyot / qum-quti | 6 | yo'q |
| dragdrop-tartib · debug-qator · tekshirish-tugmasi | 1 · 1 · 1 | hamma slot to'lib xato · xato qator · tugma bosilib natija xato |

Qo'l sirpanishi: P5 da sudrash faqat `DragDropOrder` da — `wrong = full && !solved` sharti sirpanishni o'zi ajratadi.
PmLesson23 s9 da «qaror tanlanmasdan odam bosildi» holati `return` bilan xato-tarmoqdan OLDIN kesiladi — to'g'ri.

## Umumiy komponentlar

| Komponent | P5 da nechta faylda | Shakli | `onWrong`-ga o'xshash ilgak |
|---|---|---|---|
| `DragDropOrder` | 7 (4c: 4 · 6: 3) | imzo deyarli bir xil (`items, hints, onSolved, doneText, onChange`; GithubActions da `onChange` yo'q), tana md5 lari 7 xil — mayda farqlar | YO'Q. Ichida `const wrong = full && !solved` bor → pilotdagi 2 qator (`onWrong` prop + `useEffect`) to'g'ridan-to'g'ri tushadi. Trigger-ekranda faqat FullPipeline s6 ishlatadi; qolgan 6 faylda u **test** ekranida (`onChange` + `hadWrongRef` — allaqachon halol) |
| `DebugChallenge` | 1 (FullPipeline) | `lines, fixed, explain, onSolved, onProgress` | YO'Q — else-tarmoqqa `onWrong` qo'shiladi |
| `ScreenCoding` (PM) | 5 trigger + PmLesson25 (nishonsiz) | ikki variant: `HtmlCompiler` (17, 23) va VS Code + «Bajardim» (18, 22, 24) | `setMissedOnce(true)` — tayyor xato-nuqta, lekin faqat kod-savolida |
| PM `Screen9` (tekshiruv-o'yin) | 6 | har darsda boshqa o'yin, lekin xato-nuqta bir xil belgida: `setMissedOnce(true)` yoki `setXatoBor(true)` | ilgak shart emas — 1 qator |
| bo'shliq-to'ldirish `Screen13` | 3 (AiPipeline, CiCdIntro, WriteSkill) | deyarli nusxa (`wrongEverRef`, `pick(blank, val)`) | 1 qator |

`AchRule` komponenti va `.ach-rule` CSS **13 faylning birortasida ham yo'q**. `<style>{` shablon-satri har faylda bitta
(qatorlari JSON da). Eslatma: CSS izohiga backtik yozilmaydi.

## Foydalanuvchi qarori kerak

1. **Koding nishoni (5 dars) — mehnatmi yoki kod-savoliga bog'lanadimi?** Ekranlar: PmLesson17 «Ishni haftalarga
   bo'ladigan kod yozamiz» · PmLesson18, 22, 23, 24 ning shu o'rindagi koding ekrani. Nishon tavsifi KOD haqida
   («…kod bilan bo'lib chiqdingiz»), xato qilsa bo'ladigan joy esa faqat oldidagi bitta kod-savoli; kod yozishda
   diskret urinish yo'q (kompilyator shartlarni jonli tekshiradi yoki ish VS Code'da, «Bajardim» bilan).
   **Tavsiya: MEHNAT** (PmMetrics s10 pretsedenti) — bitta savoldagi xato uchun 10 daqiqalik mehnat nishonsiz qolmasin.
   Muqobil: kod-savolidagi xato = `miss` (har darsda 1 qator).
2. **CiCdIntro «Chamadonni o'zingiz yig'ing — lentaga qo'ying» (s9) — qum-qutimi?** Mentor: «xohlaganingizni soling…
   bir necha marta qayta o'ynab… o'zingiz kashf qiling». Tavsiya: **BONUS** (darsda boshqa bonus yo'q). Agar challenge
   desangiz — xato-nuqta tayyor (`setResult('fail')`, 1158). Ikkala holda ham **tavsif tuzatiladi**: hozirgi «Barcha
   buyumlarni tuzatib…» hamma yo'lda rost emas (buzuq bo'lmagan `savatcha.js` ni yakka solsa — hech narsa tuzatmasdan
   yashil). Taklif: «Chamadonni lentadan o'tkazib, samolyotni ko'tardingiz» (matn — sizniki).
3. **PmLesson25 `proofFinder`** — pastda («eng qiyin»).
4. **GithubActions s17:** bo'sh xarita bilan «Lentaga qo'ying» bosilishi xato urinishmi? Tavsiya: signal yoki mashina
   tanlanmagan bo'lsa — urinish sanalmasin.
5. **Beshta PM darsda s4 → BONUS** (PmLesson18, 22, 23, 24, 25): tavsiflari allaqachon rost, o'zgarish nol; 152 reyestriga
   qo'shiladi. PmLesson17/19/21 s4 bilan bir qolip.

## Yon-topilmalar

- **O'lchovdan (343) tashqaridagi nishonlar:** `ClaudeSkills` `beforeAfter` — `recordAnswer` da `data.bonus` bo'yicha
  to'g'ridan-to'g'ri `earn` (2261); kafolatli, tavsifi rost → darsning bonusi, reyestrga qo'shilishi kerak.
  `PmLesson25` `proofFinder` — `ACH_EXTRA` (1806, 3643). Boshqa partiyalarda ham `earn('…')` va `ACH_EXTRA` grep
  qilinishi kerak.
- **«C' = halol» degan taxmin ishonchsiz:** ClaudeSkills s7/s13 `onAnswer` ni HAR bosishda chaqiradi va `correct` —
  joriy bosishniki; xato → to'g'ri ketma-ketligida nishon beriladi. `firstAttemptCorrect` yuboriladi, lekin ildiz o'qimaydi.
- **C-halol ekranlarning hammasida F5 teshigi:** `wrongEverRef` / `verifyWrongEver` xotirada, ekran holati ham
  saqlanmaydi → sahifa yangilansa yangi «birinchi» imkon. `miss(screen)` shu teshikni yopadi (progressga yoziladi).
- PmLesson24 s9: «Keyingi ish →» xato tanlov bilan ham ishlaydi — topshiriq xato joylashuv bilan yopilishi mumkin
  (nishonga ta'siri yo'q, alohida UX-savol).
- PmLesson22–25 va PmLesson19–21 faqat o'zbekcha (`desc` oddiy satr) — `AchRule` matni `tr()` orqali keladi, muammo emas.
- `useStuckValve` qutqaruvi (4c/6 texnik darslar) topshiriqsiz «Davom etish»ni ochadi — `onAnswer` chaqirilmaydi,
  nishon berilmaydi; `AchRule` qatori o'sha holatda ham ko'rinib turadi (zararsiz).
- Neytral yozilgan tavsiflar («…tanladingiz», «…joyladingiz») 151 dan keyin ham rost; «to'g'ri …» deb kuchaytirish
  ixtiyoriy va matn-qaror talab qiladi.

## Eng qiyin 5 ekran

1. **PmLesson25 s4 `proofFinder`** — bitta ekranda ikki nishon: bonus `slideTalker` va mahorat-nishoni `proofFinder`
   (`ACH_EXTRA`). Tanlov qotmaydi → qayta tanlab ham olinadi. `missTry` ekran-id bo'yicha ishlagani uchun bu yerda
   bonusni to'sib qo'yadi — alohida «birinchi tanlov» belgisi, F5-saqlov va `AchRule` ning `ACH_EXTRA` varianti kerak.
2. **Besh koding ekrani** — kod emas, siyosat qarori; qaror (b) bo'lsa `AchRule` faqat 1-bosqichda ko'rinishi kerak.
3. **CiCdIntro s9** — qum-quti/challenge chegarasi + tavsif matni.
4. **AiPipeline s9** — ko'p bosqichli; `AchRule` verify-kartaga emas, doim ko'rinadigan joyga (`</Zoomable>` dan keyin)
   qo'yilishi kerak, aks holda shart «oldindan» aytilmaydi. `askBad` ni xato sanamaslik — muallif qarori (saqlash taklifi).
5. **FullPipeline s6** — `DragDropOrder` ga `onWrong` + shu ekranda oldin kashfiyot-bosqichi bor (4 ssenariy):
   `AchRule` faqat quruvchi ochilgach ko'rinsa mantiqan to'g'ri.

## Hajm

Kod: A-qol-ishi 11 × ~3 qator · A-umumiy 2 × ~5–6 · C-halol 5 × ~3 → **≈ 60 qator** + har ekranda `<AchRule />` 1 qator;
har 13 faylga `AchRule` komponenti + 3 qator CSS (mexanik). Matn qarorlari: 1 tavsif (CiCdIntro s9), ixtiyoriy 1
(PmLesson22 `codeCheck`). Brauzer-sinov: har mexanikadan bittadan — tanlov-o'yin, bo'shliq-to'ldirish, `DragDropOrder`,
`DebugChallenge`, tekshirish-tugmasi (5 ta).
