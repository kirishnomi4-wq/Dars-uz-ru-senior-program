# KATTA §41 · B to'lqin — INVENTAR P1 (1-Modull + pm) · 2026-09-19

Manba: `nomzodlar-P1.json` — 25 trigger, 14 fayl. To'liq yozuvlar: `inventar-P1.json`.
**Usul:** har ekran komponenti (va u chaqiradigan ichki komponent) KODDA to'liq o'qildi. **Brauzerda hech biri ochilmagan.**
`src/` ga, qonun/STATE/KORPUS hujjatlariga tegilmagan.

## Hukmlar

| Hukm | Soni | Qaysilar |
|---|---|---|
| **A-umumiy-komponent** (ilgak komponentga bir marta qo'yiladi) | 6 | CssLesson2 s3b · HtmlPractice s2, s14 · Htmllesson1 s5, s6 · PmLesson2 s11 |
| **A-qo'l ishi** (ekranning o'z kodida aniq xato-yo'l bor) | 4 | CssLesson2 s7 · HtmlTakrorlash s6 · PmLesson1 s11 · PmJtbd s10 |
| **TEKIN** (xato yo'li yo'q — 152-qonun bo'yicha qaror) | 5 | CssLesson1 s13, s14 · CssLesson2 s14 · Htmllesson2 s14 · VsCodeLesson s3 |
| **MEHNAT** (erkin yozma / ekrandan tashqari ish / kompilyator) | 8 | GitLesson s3, s13 · VsCodeLesson s2 · PmLesson2 koding · PmJtbd practice · PmMetrics practice · PmUserStory practice, s10 |
| **Bajarilgan (pilot)** | 2 | InternetLesson s13b, s13c |
| NOANIQ | 0 | — |

Avtomatik saralash bilan farq: «A challenge» deb kelgan 21 tadan **4 tasi tekin, 7 tasi mehnat** chiqdi; «C' hisoblangan
correct» deb kelgan 2 tasi (VsCodeLesson) halol emas — `correct: all` «hamma qadam belgilandi» degani, bilim tekshiruvi emas.

## Mexanika bo'yicha

| Mexanika | Soni |
|---|---|
| dragdrop-tartib (`DragDropOrder`) | 5 (pilot bilan) |
| debug-qator-topish (`DebugChallenge` yoki o'z kodi) | 3 |
| debug — BITTA bosiladigan qator (tekin) | 3 |
| tanlov-o'yin | 2 (pilot bilan) |
| tekshirish-tugmasi («Egasiga ko'rsat») | 1 |
| pickKod (kod-savol + «Bajardim») | 1 |
| kashfiyot-toggle | 2 |
| tashqi ish («Bajardim» ro'yxati) | 3 |
| erkin yozma (PM ustaxona) | 3 |
| kompilyator — jonli tekshiruv | 2 |

## Umumiy komponentlar

| Komponent | Qayerda | Ilgak |
|---|---|---|
| `DragDropOrder` | 1-Modull da 9 faylda bir xil o'zak (`const wrong = full && !solved;` hammasida bor): CssLesson1 · CssLesson2 · CssPractice · HtmlPractice · HtmlTakrorlash (2 chaqiruv) · Htmllesson1 · VsCodeLesson · PmLesson2 (`onOrder` li variant) · InternetLesson (pilot — `onWrong` BOR). `PmLesson2.homework.jsx` dagi nusxa — uy vazifasi, tegilmaydi | pilotdagi 2 qator: `onWrong` prop + `useEffect(() => { if (wrong) onWrong && onWrong(); }, [wrong]);` — mexanik ko'chiriladi. Signatura 3 xil: `{items, hints, onSolved}` · `+doneText` (CssLesson1) · `+onOrder` (PmLesson2) |
| `DebugChallenge` | HtmlPractice (1454) · Htmllesson1 (1375) — bir xil | `onWrong` prop, `click()` ning `else` tarmog'ida chaqiriladi (1 qator) |
| `DoSteps` / `StepChecklist` («Bajardim») | GitLesson · VsCodeLesson | ilgak kerak emas — mehnat |
| `HtmlCompiler` (`src/compilator/`) | **30 dars** import qiladi | TEGILMAYDI — diskret «urinish» yo'q (jonli tekshiruv); umumiy fayl |

## Foydalanuvchi qarori kerak bo'lgan joylar

1. **«Bitta bosiladigan qator» qolipi — 3 ekran, uch darsda bir xil:** CssLesson1 «CSS ishlamadi — nega?» (s14) ·
   CssLesson2 «Debugging» (s14, to'g'ri qator hatto pulsatsiya qiladi) · Htmllesson2 «DevTools» (s14). Kod qatorlaridan faqat
   xatolisi bosiladi, Mentor va audio javobni oldindan aytadi. Tavsif «…topib tuzatdingiz» yarim-rost.
   Taklif: uchalasini BIR qolipda — qolgan qatorlarni ham bosiladigan qilish (xato → silkinish + «Bu qator to'g'ri» + `miss`),
   ~10 qator/dars + 1 yangi jumla (uz + ru). Muqobil: testga ko'chirish. CssLesson2 da bonus yo'q — u yerda bonus bo'lib
   qolishi ham mumkin, lekin uch dars uch xil bo'lib qoladi.
2. **CssLesson1 «O'zingiz karta bezang» (s13 `bezak`)** — istalgan 3 chip; darsda bonus allaqachon bor (`rang`).
   Taklif: `bezak` → s15 yakuniy yozma test (CSS qoidasini o'zi teradi) yoki s12 test. Hozir bu darsda 4 nishondan 4 tasi kafolatli.
3. **VsCodeLesson «4 qism» (s3 `pilot`)** — kashfiyot; darsda bonus yo'q → bonus bo'lib qolsin (0 qator, tavsif rost).
4. **Kompilyator-koding (PmLesson2 `strategist`, PmUserStory `toolMaker`; loyiha bo'yicha 30 dars)** — `HtmlCompiler` da
   «Tekshirish» tugmasi yo'q, shartlar jonli belgilanadi → «xato urinish» hodisasi mavjud emas. 152-qonun 5-bandiga aniqlik
   kerak: «kompilyatorda kod yozish — mehnat nishoni». Bu bitta qaror hamma partiyalardagi koding-nishonlarni hal qiladi.
5. **«Bajardim» ro'yxatlari (Git o'rnatish/push, VS Code o'rnatish)** va **PM ustaxonalari (3 dars)** — 152-qonun 5-bandiga
   to'g'ridan-to'g'ri tushadi (mehnat); reyestrga qo'shish kifoya, qaror emas — tasdiq.

## Yon-topilmalar

- **HtmlTakrorlash s11 `architect` — «C test (halol)» savatida, lekin halol EMAS.** Meta'da `test` + `scored`, aslida
  `DragDropOrder`: yechilganda doim `correct: true` va `submitAnswer(…, true)` → necha marta adashsa ham nishon HAM, BALL HAM.
  C savatdagi 148 «test» ichida shunday yozma/sudrash «test»lar bo'lishi mumkin (F-0918-06 da JsConditions s15 ham shunday
  topilgan) — C savat ham ko'zdan kechirilishi kerak.
- **HtmlPractice s2:** uchta `<section>` tartibi mantiqdan chiqmaydi — skelet ko'rinishida yorliqlar «…» bilan yashirilgan,
  katak-maslahatlari «birinchi/ikkinchi/uchinchi bo'lim». Birinchi urinish qisman omad → 151 kiritilishidan OLDIN matn/ko'rinish
  aniqlashtirilsin.
- **CssLesson2 s7:** tavsif «to'liq markazga qo'ydingiz» ↔ javob `space-between` (F-0918-06 da ham qayd etilgan); audio va Mentor
  nishonni o'zi va'da qiladi («topsangiz — nishonga tegasiz») — `AchRule` bilan takror; audio javobni deyarli aytadi.
  Boshlang'ich `flex-start` ni qayta bosish urinish sanalmasin: shart `v !== TARGET && v !== jc`.
- **PmJtbd `jobHunter`:** `picked != null` bo'yicha beriladi (javob berilsa bo'ldi), tavsif «yechib chiqdingiz»; qardosh
  darslarda shart `correct`.
- **To'g'ridan-to'g'ri `earn()` nishonlari** (`coder` HtmlPractice:2439, `cardmaster` VsCode:3093, PM agregatlar) `ACH_TRIGGERS` da
  yo'q — saralash ularni ko'rmagan; A to'lqin muzlashi (`earn` ichida) ularga ham ishlaydi.
- `AchRule` komponenti va `.ach-rule` CSS'i P1 da faqat pilotda bor. Kerak bo'ladigan fayllar: **8 ta** (CssLesson2 · HtmlPractice ·
  HtmlTakrorlash · Htmllesson1 · PmLesson1 · PmLesson2 · PmJtbd + TEKIN qarorlariga qarab CssLesson1/Htmllesson2). GitLesson,
  VsCodeLesson, PmMetrics, PmUserStory ga umuman kerak emas. CSS qo'shish joyi har fayl uchun JSON'da (`style_qator`);
  CSS izohiga backtik yozilmaydi.

## Eng qiyin 5 ekran

1. **PmLesson1 s11** — 225 qator, holat-mashinasi (`showing → reject-p / recognize → reject-s / convert`), `miss` `setTimeout`
   ichida chaqiriladi; ikki rad-yo'li ham brauzerda sinalishi shart.
2. **HtmlTakrorlash s6** — ikki xil xato (qator + tuzatish-varianti), ikkala nuqtaga `miss`; s11 `architect` bilan birga
   `DragDropOrder` ham shu faylda ulanadi (ball masalasi alohida qaror).
3. **CssLesson1 / CssLesson2 / Htmllesson2 s14** — mexanikani o'zgartirish (yangi bosiladigan qatorlar + yangi matn) — qaror va
   metodist kerak.
4. **PmLesson2 s11** — `DragDropOrder` varianti (`onOrder`) + `CustomerRun` ko'rgazmasi: urinish ikki marta sanalmasligi.
5. **PmJtbd s10** — halol qism (kod-savol) va vijdon qismi («Bajardim») bitta nishonda; `AchRule` joyi `.kdq` bloki ichida.

## Hajm (taxminiy)

Kod: A-umumiy 6 ekran ≈ 6 qator/dars (komponent 2 + ekran 3–4) · A-qo'l 4 ekran ≈ 4–5 qator · `AchRule` + CSS ≈ 12 qator/dars
(8 dars) · TEKIN-shart (3 dars) ≈ 10 qator/dars + matn. Jami ≈ 170–200 qator, 9–11 faylda. Matn ishi: 3 ta «bu qator to'g'ri»
jumlasi, CssLesson2 `markaz` tavsifi, HtmlPractice s2 maslahatlari, `bezak` ko'chsa tavsifi — hammasi uz + ru, tasdiq bilan.
