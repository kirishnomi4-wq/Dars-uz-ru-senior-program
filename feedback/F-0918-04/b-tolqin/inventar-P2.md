# B to'lqin inventari — P2 partiya (2-Modull · 4a-Modull · 4b-Modull)

Sana: 2026-09-19. Manba: `nomzodlar-P2.json` — 32 trigger, 14 fayl. To'liq yozuvlar: `inventar-P2.json`.
**Usul:** har ekran komponenti (va u chaqiradigan ichki komponent) kodda to'liq o'qildi. **Brauzerda hech biri
ochilmadi** — `AchRule` joyi va UX-signallar haqidagi gaplar kod asosida. `src/` ga tegilmadi.

## Hukmlar

| Hukm | Soni | Qaysilar |
|---|---|---|
| A-qo'l-ishi (xato yo'li bor, `miss` bitta-ikki qator) | 15 | JsLoops s14 · PeanStack s13 · PmLesson4 s4 · PmLesson5 s11 · PmLesson6 s2 · NestArchAlive s9 · NestArchPractice s14, s19 · PmLesson15 s4, s9, s10 · EdgeCases s9 · Jest s9 · PmLesson16 s9, s10 |
| A-umumiy-komponent (`onWrong` ilgagi) | 5 | JsFunctions s3 · PracticeLesson3 s5 (DragDropOrder) · NestArchPractice s10 · EdgeCases s15 · Jest s15 (PickLines) |
| C-halol (nishon allaqachon hisoblangan) | 1 | PmLesson6 s10 |
| MEHNAT (yagona to'g'ri javob yoki urinish hodisasi yo'q) | 9 | JsFunctions s13 · PmLesson4 s8, s11 · PmLesson5 s8, s9 · PmLesson6 s9, s11 · PmLesson15 s8 · PmLesson16 s8 |
| TEKIN (xato yo'li yo'q) | 2 | JsConditions s14 · PmLesson16 s4 |
| NOANIQ | 0 | — |

Kod hajmi (taxmin): 20 ekranda jami ~105 qator + har 12 faylga `AchRule` komponenti va CSS (14 fayldan hech birida yo'q).

## Mexanikalar

tanlov-o'yin 9 · erkin yozma 4 · debug-qator 3 · dragdrop-moslash 3 · to'liq-ekran kompilyator 2 (+2 ta pickKod ichida) ·
dragdrop-tartib 2 · pickKod 2 · o'z-qaror mashqi 2 · kod-terish (jonli) 1 · «Ishga tushirish» tugmasi 1 · bir martalik hukm 1 ·
inline DnD + yugurish 1 · kashfiyot 1.

## Umumiy komponentlar

| Komponent | Qayerda | Shakl | Ilgak |
|---|---|---|---|
| `DragDropOrder` | JsFunctions 700 · PracticeLesson3 1665 · NestArchAlive 674 · PeanStack 714 | hammasida `const wrong = full && !solved` bor; imzo 3 xil (`onSolved` · `+doneText` · `+onWrong, doneText, side`) | **PeanStack'da `onWrong` allaqachon bor** (729) — qolganlariga aynan shu ikki qator ko'chadi. P2 da nishonli ishlatilish: JsFunctions s3, PracticeLesson3 s5 |
| `PickLines` | NestArchPractice 643 · EdgeCases 623 · Jest 617 | xato tarmog'i uchalasida harfma-harf bir xil (`else { setShakeId(c.id); setWhy(c.why); … }`); imzo 2 xil (`onProgress`, `doneNote` bilan/siz) | ilgak yo'q → `onWrong` qo'shiladi. Jest'da IKKI joyda ishlatiladi: Screen7 (nishonsiz) va Screen15 — prop faqat Screen15 dan uzatiladi |
| `HtmlCompiler` (`src/compilator/`) | PmLesson4 s11 · PmLesson6 s11 · PmLesson15 s10 (2-bosqich) | shartlar JONLI hisoblanadi (1446 `allPassed`), «Davom etish» faqat hammasi yashil bo'lganda (2304) | tekshirilgan urinish hodisasi YO'Q → `koding` ekranlari mehnat nishoni. Bu xulosa boshqa partiyalardagi kompilyator-ekranlarga ham tegishli |
| pickKod-darvoza | PmLesson15 s10 (1500) · PmLesson16 s10 (1532) | `pickGate` ning else-tarmog'i bir xil, `setMissedOnce(true)` bor | `miss` aynan shu qator yoniga |
| Egizak ekranlar | EdgeCases s9 ≅ Jest s9 | `drop()` va `down()` bir xil | ikki nuqta: tashlash (1086 / 1128) va bosish (1127 / 1169 else) |

## Foydalanuvchi qarori kerak

1. **JsConditions — «Noto'g'ri PIN-kod bilan ham telefon ochilyapti — nega?» (s14, 🐞 `debugger`).** Ikki qatorli kodda faqat
   xato qator bosiladi — adashib bo'lmaydi. Darsda bonus allaqachon bor (s13), `graduate` bilan birga bu uchinchi kafolatli
   nishon (152-qonun 1-band: ko'pi bilan ikkita). Taklif: birinchi qatorni (`let pin = 1111`) ham bosiladigan qilish —
   xato tanlovda «bu yerda = to'g'ri: qiymat berilyapti» izohi. Muqobil: nishonni testga ko'chirish. Qo'shimcha: Mentor va
   audio javobni oldindan aytadi («shartda bitta teng belgisi turibdi»).
2. **PmLesson16 — «Nosozlik narxini uch nuqtada ko'ring» (s4, `cheapFix`).** Kashfiyot, xato yo'li yo'q. Darsda bonus ham,
   `graduate` ham yo'q → shu nishon darsning yagona BONUSI bo'lsin (tavsif rost, kod o'zgarishi 0)?
3. **PmLesson5 — «tarozi» (s8, `weigher`) va «ochilish ro'yxati» (s9, `launcher`).** To'g'ri javobi yo'q o'z-qaror mashqlari.
   152-qonun 5-bandi mehnatni «erkin yozma va ekrandan tashqari ish» deb aytadi — bular tanlovli. Bandni «to'g'ri javobi
   yo'q o'z-qaror ishi» bilan kengaytiramizmi (tavsiya)? Aks holda bu darsda kafolatli nishon 3 ta bo'lib qoladi.
4. **PmLesson6 — «so'z-elagi» (s2, `jargon`).** Xato yo'li bor, lekin bu darsning 2-ekrani: o'quvchi tushunchani hali
   bilmasdan sinab topadi. Darsda bonus yo'q. Birinchi urinish sharti (A) yoki bonus — ikkalasi ham qonuniy.
5. **PmLesson6 — «Tinglovchi kursisi» (s10, `ear`).** Allaqachon halol, lekin bir martalik: KORPUS §183 dagi «…endi bemalol
   to'g'risini toping» matni mos kelmaydi (qayta urinish yo'q). `AchRule` tugagach yashirilsinmi yoki §183 ga uchinchi matn?
6. **JestUnitTest s15 — tavsif vazifaga mos emas** («Yolg'on testni topdingiz — expectsiz», o'quvchi esa HAQIQIY testlarni
   tanlaydi). Matn-topilma, tasdiq bilan tuzatiladi.

## Yon-topilmalar

- O'lik `earn()` chaqiruvlari: JsConditions `earn('logician')` (2430), PeanStack `earn('coder')` (2680) — bu kalitlar
  `ACHIEVEMENTS` da yo'q, jim qaytadi.
- JsFunctions `coder` ikki yo'ldan beriladi: s13 triggeri va praktika-kompilyator (2675).
- PeanStack `striker` — arena tugaganda beriladi (2264): amalda ikkinchi kafolatli nishon.
- PmLesson4 s8: jonli fidbek «yomon» (`fb.bad`) bo'lsa ham «✓ Saqlash» ochiq (`canSave` faqat uzunlik).
- JsLoops s14: xato tanlovdan keyingi izoh javobni to'liq aytadi («Xato esa qadam qismida»).
- PracticeLesson3 s5 va JsFunctions s3: slot-maslahatlari tartibni deyarli aytib turadi.
- To'rt ekranda `miss` nomli MAHALLIY holat bor (PmLesson5 s11 · PmLesson6 s2 · PmLesson15 s9, s10 · PmLesson16 s10) —
  kontekst o'zgaruvchisi har doim `achMiss` deb nomlansin.
- `useStuckValve` qutqaruv-klapani (4a/4b darslari) `onAnswer` siz o'tkazadi — nishon berilmaydi, to'g'ri.
- Meta'da turi `exploration` bo'lgan, aslida haqiqiy topshiriq ekranlar: PmLesson4 s4 · PmLesson5 s11 · PmLesson6 s2, s10 ·
  PracticeLesson3 s5 · PmLesson15 s4 · JsFunctions s3.

## Eng qiyin 5 ekran

1. **NestArchAlive s9** — 200+ qator, ekran ichidagi DnD + uch mijoz yugurishi. Ikki mijoz TO'G'RI yo'lakda ham 400/401 bilan
   to'xtaydi (`res.expected`), shuning uchun mezon `!pathOk` bo'lishi shart. O'quvchi yo'lakni ataylab xato yig'ib
   «qayerda qulashini ko'rishi» dars niyatiga mosmi — Mentor matni bilan solishtirilmadi.
2. **JsConditions s14** — kod emas, kontent qarori: xato yo'li yo'q, javob oldindan aytilgan.
3. **EdgeCases s9 / Jest s9** — ikkita `miss` nuqtasi (tashlash va bosish); zonadan tashqariga tashlash va ataylab
   ko'rsatiladigan «yarim test» yugurishi (`sawPartial` / `sawFake`) urinish EMAS.
4. **PmLesson4 s4** — bitta shartda bilim xatosi (`row.need !== held`) va sirpanish (`place[rowId]` — qator band) qo'shilgan.
5. **NestArchPractice s19** — kod aniq, lekin UX ziddiyatli: bosilgan to'g'ri da'vo «✓ tekshirildi» deb belgilanadi va
   qolganlari `tap-hint` bilan yonadi — «hammasini bittalab bos» degan taassurot; shunda `miss` nohaq tuyuladi.

## Ishonch past joylar

- `AchRule` ning aniq joyi 6 ekranda «brauzerda ko'rib tanlanadi» deb qoldirildi (NestArchAlive s9 · EdgeCases s9 · Jest s9 ·
  PmLesson16 s9 va b.) — JSX qatorlari juda uzun, tartibni kodda ishonchli aytib bo'lmadi.
- NestArchAlive s9 va NestArchPractice s19 — mezon to'g'ri, lekin dars niyati / UX bilan brauzerda solishtirilishi kerak.
- Hajm-baholar taxminiy (qator soni), sinov vaqti kiritilmagan.
