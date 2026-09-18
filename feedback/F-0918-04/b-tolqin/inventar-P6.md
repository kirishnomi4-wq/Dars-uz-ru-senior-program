# KATTA §41 · B to'lqin — inventar, P6 partiyasi (5-Modull) · 2026-09-19

Manba: `nomzodlar-P6.json` — 30 trigger, 10 fayl. To'liq yozuvlar: `inventar-P6.json`.
**Usul:** har ekran komponenti (va u chaqiradigan ichki komponent) KODDA to'liq o'qildi. **Brauzerda hech biri ochilmadi** —
xulosalar kod o'qishga asoslangan. `src/` ga, qonun va STATE hujjatlariga tegilmadi.

## Hukmlar

| Hukm | Soni | Qaysilar |
|---|---|---|
| **C-halol** (faqat `AchRule` + `miss` orqali F5-saqlov) | 15 | BotAiAgent s5 s7 s9 s11 · BotAiBrain s5 s7 s9 s11 · BotFullProject s5 s7 s9 s11 · BotApiButtons s13 · BotIntro s13 · BotStatefulMemory s13 |
| **A — qo'l ishi** (xato yo'li bor, `correct: true` doim) | 6 | BotAiProject s7 · BotIntro s7 · PmLesson19 s10 · PmLesson20 s10 · PmLesson21 s9 s10 |
| **TEKIN** (xato yo'li yo'q) | 4 | BotApiButtons s9 s11 s12 · PmLesson19 s9 |
| **MEHNAT** (erkin yozma, 152-qonun 5-band) | 3 | PmLesson19 s8 · PmLesson20 s8 · PmLesson21 s8 |
| **NOANIQ** (qaror foydalanuvchida) | 2 | PmLesson20 s4 · PmLesson20 s9 |

Avtomatik saralash bilan farq: «A challenge» deb tushgan 15 tadan faqat **6 tasi haqiqatan A**; **4 tasi aslida TEKIN**
(BotApiButtons s9/s11/s12, PmLesson19 s9), **3 tasi MEHNAT**, 2 tasi NOANIQ. «C' hisoblangan correct» 15 tasining hammasi
tasdiqlandi (C-halol).

## Mexanika

| Mexanika | Soni | Izoh |
|---|---|---|
| tanlov-o'yin — xato variant silkinadi, qayta tanlanadi (`wrongEverRef`) | 7 | builder/chip-to'ldirish; uch xil qolip: `pick(slotId, idx, right)` · `choose(toolId)` · `pick(blank, val)` |
| bir martalik tanlov (tanlov qotadi, `correct: choice === '…'`) | 6 | demo → tanlov; test savoliga o'xshash |
| bir martalik uch qatorli belgilash (`correct: allCorrect`) | 3 | `mark(id, val)` — bir qatorli funksiya (ichiga `//` izoh yozilmaydi) |
| pickKod (kod-savoli + kompilyator yoki VS Code) | 3 | PM 19/20/21 `ScreenCoding` — bir qolip, uch nusxa |
| kashfiyot / yo'naltirilgan demo | 4 | TEKIN'lar |
| erkin yozma | 3 | MEHNAT |
| tekshirish-tugmasi (qator bir marta tekshiriladi) | 1 | PmLesson21 s9 |
| sudrab juftlash + «Smenani boshlash» | 1 | BotIntro s7 `NightShift` |
| ko'p qadamli (test → tashxis → tuzatish) | 1 | BotAiProject s7 |
| kashfiyot + yakuniy tanlov | 1 | PmLesson20 s4 |

## Umumiy komponentlar

- **`DragDropOrder`** 7 ta Bot-darsning hammasida bir xil shaklda ta'riflangan (`{ items, hints, onSolved, doneText, onChange }`,
  `wrong = full && !solved` bor, **`onWrong` ilgagi YO'Q**). Bu partiyadagi 30 ekranning birortasi uni ishlatmaydi —
  u har darsda faqat **`s15` yakuniy tartiblash-testida** turadi (pastdagi «Partiyadan tashqari» bandiga qarang).
- **`NightShift`** (BotIntro) — yagona ichki komponent, faqat s7 da; `onSolved` bor, `onWrong` yo'q → prop qo'shiladi.
- **`HtmlCompiler`** — tashqi umumiy modul (`src/compilator/HtmlCompiler.jsx`), PmLesson19/21 s10 da; tegilmaydi
  (urinish kod-savoliga bog'lanadi, kompilyatorga emas).
- **Qoliplar fayllararo takrorlanadi** (nusxa-ko'chirma, umumiy modul emas): `wrongEverRef`-builder 7 joyda, «demo →
  bir martalik tanlov» 6 joyda, `mark` 3 joyda, `ScreenCoding` 3 joyda. Bir xil tuzatish har qolipga bir marta o'ylanadi,
  keyin qo'lda takrorlanadi — skript bilan emas (langarlar har faylda boshqa o'zgaruvchi nomlarida).

## Eng muhim topilma — «C-halol» ekranlarda F5-teshik

15 ekranning hammasi nishonni allaqachon to'g'ri hisoblaydi, lekin **xato belgisi faqat xotirada** (`wrongEverRef`) yoki
javob faqat ekran tugagach yoziladi. O'quvchi xato qilib, ekranni tugatmasdan F5 bossa — «birinchi urinish» qaytadan
beriladi. Yechim pilot bilan bir xil va kichik: xato nuqtasida `achMiss.miss(screen)` (u `ccProgress.missed` ga yoziladi,
ildizdagi `recordAnswer` allaqachon `!missedRef.current.has(id)` ni tekshiradi). Bir martalik YAKKA tanlov ekranlarida
(6 ta) teshik yo'q — u yerda `miss` faqat `AchRule` «lost» holatini to'g'ri ko'rsatishi uchun kerak.

## Foydalanuvchi qarori kerak bo'lgan ekranlar

1. **BotApiButtons — 4 nishondan 3 tasi tekin** (`ACH_TRIGGERS` ustidagi izoh «faqat xato qilish mumkin bo'lgan ekranlar»
   deydi — yolg'on). 152-qonun: ko'pi bilan bitta bonus.
   - «Botjonga tugmalar taxtasini o'zingiz ulang» (s9 🔘 Button Master) → **bonus** bo'lib qolsin (eng ko'p ish qilinadigani).
   - «Javob noto'g'ri odamga ketsa nima bo'ladi?» (s11 ✉️ Right Envelope) → `s10` testga; tavsif ham rost emas
     («xatosini TOPIB» — xatoni ekran ko'rsatadi).
   - «Botjon hech qachon jim qolmasin» (s12 🔔 Never Silent) → `s14` testga.
2. **PmLesson19 «Yigirmata odamni yig'ing» (s9 👥 20 Done!)** — to'rt joyning yig'indisi 23, har qanday tartibda 20 chiqadi.
   Darsda bonus allaqachon bor (s4). Yo'llar: (b) kodda tayyor shart — `kamKordi`: kam beradigan joyni bosmasdan yig'ganga
   nishon (lekin «kam joyni bosib ko'rish» kashfiyoti jazolanadi); (a) `s11` testga ko'chirish.
3. **PmLesson20 — ikki kafolatli nishon:** «stol» ekrani (s4 👂 Good Listener, tavsifi tinglash haqida — rost) va «elak»
   ekrani (s9 🚧 Sharp Sifter — kodda ATAYLAB ishtirok nishoni: «§133 … senariy 10-bo'lim», `hammasi` hisoblanadi-yu
   ishlatilmaydi). Bittasi halol shartga o'tishi kerak. Tavsiyam: s9 → 151-naqsh (to'rt haqiqiy qaror), s4 → bonus.
   Senariyga tegadi — `pm-senariylar/` ko'rib chiqilsin.
4. **BotIntro «Tungi smena» (s7 📋 Sheet Master)** — Mentor: «Varaq yarim bo'lsa ham smenani boshlashingiz mumkin — xato
   qilish MUMKIN». 151-qoida kirsa bu jumla o'quvchini nishonni yo'qotishga undaydi → jumla qarori kerak.
   Shu ekranda **`neverSilent` nishoni `sheetMaster` bilan DOIM birga beriladi** (4/4 sharti Sardorni ham o'z ichiga oladi)
   va `missedRef` tekshiruvidan o'tmaydi (ildiz, 2480-qator) — bitta ish uchun ikki nishon.
5. **pickKod ekranlari (PM 19/20/21 s10):** urinish faqat 1-bosqich kod-savoliga bog'lanadi; nishon tavsifi esa kod yozish
   haqida («Kodingiz uch joyni sanab berdi»). Shu bog'lanish tasdiqlansin.

## Partiyadan tashqari — muhim (ro'yxatda YO'Q, lekin ko'zga tashlandi)

7 ta Bot-darsning `s15` ekrani — `type: 'test'`, `scored: true`, `scope: 'final'`, lekin `QuestionScreen` EMAS: u
`DragDropOrder` bilan tartiblash va natijani **doim** `correct: true, firstAttemptCorrect: true` deb yozadi
(masalan `BotAiProjectLesson.jsx` 1240-qator) — tartib necha marta xato chiqqani sanalmaydi. Saralash skripti bularni
turi `test` bo'lgani uchun «C test (halol)» savatiga qo'ygan va B to'lqindan chiqarib yuborgan. Ikkitasiga nishon
bog'langan: **BotAiProject `director`** va **BotStatefulMemory `memoryKeeper`**; qolganlarida nishon yo'q, lekin **ball**
ham xuddi shunday doim to'g'ri yoziladi. Ya'ni «C test 148» savati ichida `template: 'custom'` bo'lgan test-ekranlar
alohida ko'rib chiqilishi kerak (pilotdagi `DragDropOrder.onWrong` naqshi aynan shu yerga tushadi).

## Texnik ogohlantirishlar (codemod uchun)

- **PmLesson19/20/21 da `tr()` yordamchisi YO'Q** (darslar faqat o'zbekcha; fayldagi yagona `tr(` — CSS'dagi `attr(`).
  Pilotdagi `AchRule` `tr({uz, ru})` ishlatadi → bu fayllarga **uz-only variant** kerak; infratuzilma-codemod ikki shaklli bo'lsin.
- 10 darsning **hech birida `graduate` yo'q**, `AchRule` va `.ach-rule` CSS ham yo'q. `<style>` shablon-satri qatorlari
  JSON'da (`darslar[].style_shablon_qatori`). CSS izohiga backtik yozilmaydi.
- `mark` va `pick` funksiyalari **bir qatorli** — ichiga `//` izoh qo'shilmaydi (F-0802-15 sinfi).
- PM darslarda javob `live.submitAnswer(PRACTICE_BASE + screen, …)` bilan ham ketadi — A to'lqin uni mashq-o'tishida
  o'ramagan (ma'lum chegara, serverda takror e'tiborsiz).

## Yon-topilmalar (tuzatilmagan, faqat qayd)

- BotAiAgent s5: tavsif «idrok → qaror → amal» deydi, ekran «maqsad · asboblar · chegara» ni yig'diradi.
- BotFullProject s11: «tekshiruvni bajardingiz» — nishon faqat hammasi to'g'ri bo'lsa berilgani uchun «to'g'ri» so'zi aniqroq.
- PmLesson21 s9: tavsif ishtirok ohangida («belgiladingiz»); 151-naqshga o'tgach aniqlashtirish kerak.
- `keyMaster` va `neverSilent` kalitlari ikki darsda ikki xil qoida/tavsif bilan uchraydi (katalogda dars-ID ajratadi).
- BotStatefulMemory va BotAiProject da birorta kafolatli nishon yo'q (3 test + 1 topshiriq) — qonun buni talab qilmaydi.

## Eng qiyin 5 ekran

1. **BotIntro s7** — ichki komponentga prop + effekt, ikki-nishon masalasi, Mentor jumlasi, holat saqlanmaydi.
2. **PmLesson20 s9** — senariy qarori bilan ataylab ishtirok nishoni; o'zgartirish senariyga tegadi.
3. **PmLesson19 s9** — xato yo'li yo'q; shart qo'yilsa kashfiyot mexanikasi bilan to'qnashadi.
4. **PM `ScreenCoding` ×3** — ikki bosqich, `AchRule` faqat 1-bosqichda turishi kerak, `tr()` yo'q, tavsif bilan nomuvofiqlik.
5. **BotApiButtons s11** — «b» yo'li tanlansa ekran qayta quriladi (~25 qator + matn, uz + ru).

## Hajm (taxminiy)

Kod: ~106 qator (C-halol 15 × 3–4 · A 6 × 4–9 · ko'chirish 2 × 2) + har darsga `AchRule` + CSS (infratuzilma, alohida).
Matn qarorlari: BotApiButtons 2 tavsif, PmLesson20 1–2 tavsif, PmLesson21 1 tavsif, BotIntro 1 Mentor jumlasi (hammasi uz + ru,
PM darslarda faqat uz).
