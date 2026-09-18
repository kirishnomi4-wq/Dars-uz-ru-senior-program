# KATTA §41 · B to'lqin — inventar P4 (4-Modull, 34 trigger · 13 dars) — 2026-09-19

Usul: har trigger ekrani va u chaqiradigan ichki komponent **kodda to'liq o'qildi**. **Brauzerda hech biri ochilmagan** —
quyidagi hukmlar kod bo'yicha. Tafsilot (qator, kod parchasi, `miss` taklifi, `AchRule` joyi): `inventar-P4.json`.
Hech narsa o'zgartirilmagan (faqat shu ikki fayl yozildi).

## Hukmlar

| Hukm | Soni | Qaysilar |
|---|---|---|
| **A-qol-ishi** (xato-yo'l aniq, 1–2 qator `miss` + `AchRule`) | 20 | ApiPostman s3 · AuthEnv s7, s13, s14 · BackendCrud s5, s10 · DbSql s14 · FullstackFeedback s5 · NodeServer s13, s14 · PmLesson11 s9, s10 · PmLesson12 s9, s10 · PmLesson13 s4, s9, s10 · PmLesson14 s9, s10 · PostgresCrud s10 |
| **A-umumiy-komponent** (`onWrong` prop) | 3 | PostgresCrud s14 · Routing s11 (`DebugChallenge`) · Routing s13 (`DragDropOrder` — pilot bilan aynan bir qolip) |
| **MEHNAT** (152-qonun 5-band, kod 0) | 6 | PmLesson11–14 s8 (erkin yozma) · BackendCrud spf · FullstackConnect s16 (VS Code, «Bajardim») |
| **TEKIN** (xato-yo'l yo'q) | 3 | ApiPostman s14 · PmLesson11 s4 · PmLesson14 s4 |
| **NOANIQ** (qaror kerak) | 2 | DbSql s3 · PmLesson12 s4 |
| C-halol | 0 | — (pastda izoh) |

**«C' hisoblangan correct» savatidagi ikkalasi (AuthEnv s7, s13) aslida to'liq halol EMAS:** `correct: mistakes === 0` bor,
lekin ekrandagi «↻ Qaytadan» (`restart`) hisobni nolga tushiradi va `savedRef`ni ochadi → ikkinchi o'tishda nishon beriladi;
`mistakes` faqat komponent holatida — F5 uni o'chiradi. Shuning uchun ular A-qol-ishi (bitta qator `miss`).

## Mexanika bo'yicha

| Mexanika | Soni | «Urinish» (151-qonun jadvali) |
|---|---|---|
| tanlov-o'yin (xato tanlov darhol qaytariladi) | 12 | xato tanlangan har qadam |
| pickKod (darvoza-savol + kod) | 4 | faqat darvoza-savoldagi xato variant; kod bosqichida hisoblanadigan urinish yo'q (kompilyator jonli tekshiradi / «Bajardim») |
| dragdrop-moslash (darhol rad etadi) | 4 | noto'g'ri zonaga qo'yilgan har qadam; zonadan tashqariga tashlash kodda ajratilgan — urinish emas |
| debug-qator-topish | 5 | to'g'ri qatorni xato deb bosish (2 tasi `DebugChallenge` orqali) |
| erkin-yozma | 4 | yo'q (mehnat) |
| tashqi-ish («Bajardim») | 2 | yo'q (mehnat) |
| kashfiyot-toggle | 2 | yo'q (tekin) |
| tekshirish-tugmasi | 1 | tugma bosilib xato chiqqani (PmLesson11 s9) |
| dragdrop-tartib (avto-tekshiruv) | 1 | hamma uyacha to'lib tartib xato chiqqan on (Routing s13) |

## Umumiy komponentlar va yarim-mexanik langarlar

- **`DebugChallenge`** — PostgresCrud (1212) va Routing (1125): bir xil `click()` mantig'i, `else { setWrongIdx(i); … }`. `onWrong` ilgagi YO'Q → bitta qator + prop. 4-Modulning qolgan debug ekranlari (ApiPostman s14, AuthEnv s14, BackendCrud s10, DbSql s14, NodeServer s14) bu komponentni ISHLATMAYDI — har biri qo'lda yozilgan `ai-line` ro'yxati.
- **`DragDropOrder`** — faqat Routing (1049); pilotdagi tuzatish (`onWrong` + `useEffect([wrong])`) so'zma-so'z ko'chadi.
- **`ScreenLivePractice`** — 4-Modulda 11 faylda bir xil nusxa; «Bajardim» hech narsani tekshirmaydi → mehnat nishoni, tegilmaydi.
- **PM 11–14: `setMissedOnce(true)` — ishonchli langar.** Sakkizta topshiriq ekranining (s9, s10 × 4) hammasida xato tarmog'i shu qator bilan belgilangan (PmLesson11: 1266, 1445 · 12: 1320, 1445 · 13: 1365, 1520 · 14: 1323, 1486). `if (achMiss) achMiss.miss(screen);` shu qator yoniga tushadi — yarim-mexanik. ⚠ Bu ekranlarda mahalliy `miss` / `setMiss` holati BOR — kontekst o'zgaruvchisi `achMiss` deb nomlanishi shart.
- **`useStuckValve` / `rescue` klapani** (ApiPostman, AuthEnv, BackendCrud, FullstackConnect; PM darslarda `rescue`) NavNext'ni yechmasdan ochadi — bunda `onAnswer` chaqirilmaydi, nishon ham berilmaydi. Tegish shart emas.
- `AchRule` komponenti va `.ach-rule` CSS 13 faylning birortasida yo'q; `<style>{` shablon-satri qatorlari JSON'da (`darslar`). Eslatma: CSS izohiga backtik yozilmaydi.

## Foydalanuvchi qarori kerak (5 ta)

1. **ApiPostman — «AI so'rovida xato bor — 404» (s14, 🔎 `stampReader`) — TEKIN.** Bosiladigan yagona qator — xato qatorning
   o'zi; GET qatori bosilmaydi. Variantlar: (a) darsning bonusi bo'lib qoladi + tavsifdagi «topib» so'zi rostlanadi;
   (b) GET qatori ham bosiladigan bo'ladi va «Bu qator to'g'ri…» fidbeki chiqadi (~8 qator + matn) → haqiqiy topshiriq.
2. **DbSqlNosql — «Qadoqxona» (s3, `packageMaster`) — NOANIQ.** Kartani BOSSA u o'zi to'g'ri joyga tushadi (`autoHome`) —
   xato qilib bo'lmaydi; faqat sudrashda bitta rad etiladigan holat bor (🎵 → SQL). Darsda allaqachon bonus bor (`connector`)
   → bu ikkinchi kafolatli nishon bo'lib qolmoqda, `graduate` esa yo'q. Variantlar: `onWrong` + bosish-avto-joylash qoladi ·
   bosish avto-joylamaydigan qilinadi (~15 qator, mexanika o'zgaradi) · nishon testga ko'chadi.
3. **PmLesson12 — «Sinov · kim nimani ko'radi» (s4, `eyesOpen`) — NOANIQ.** Ochiq qolishi kerak bo'lgan qator bosilsa 🤔 izoh
   chiqadi; kod izohi buni ataylab «XATO EMAS — bu qaror», MentorNote esa «eng foydali xato» deydi. Tavsiyam — bonus.
4. **PmLesson11 s4 (`memoryMaker`) va PmLesson14 s4 (`threeFloors`) — TEKIN → bonus.** Tavsiflari allaqachon rost
   («sinab ko'rdingiz», «ochib chiqdingiz»), darslarda boshqa bonus yo'q. O'zgarish 0 — faqat 152-reyestrga qo'shiladi.
5. **PM 11–14 da yagona siyosat:** s4 «sinov» ekrani = darsning bonusi deyilsa, PmLesson13 s4 (`threadMaster`) ham bonus
   bo'ladi. Men uni A deb baholadim — u yerda haqiqiy moslash topshirig'i bor (4 gap × ustunlar, 🤔 bilan qaytaradi).

## Yon-topilmalar (tuzatilmagan)

- **Javob topshiriqdan OLDIN aytilgan (7 ekran):** DbSql s14 (Mentor va audio mifni so'zma-so'z aytadi) · NodeServer s14 ·
  NodeServer s13 («Keyingi: …» ipuchasi har qadamdan oldin) · PostgresCrud s14 («Jadval nomi products») · Routing s11
  (audio: «@Get turibdi») · BackendCrud s10 (`price` rangli ajratilgan + Mentor xato matnini o'qiydi) · ApiPostman s14.
  Nishon halol bo'lishi uchun bu matnlar ham ko'rilishi kerak — alohida matn-ish, foydalanuvchi tasdig'i bilan.
- **AuthEnv s14:** xato qator bosilsa ekranda HECH NARSA bo'lmaydi (`setFound(false)`). `miss` jim yonadi — qisqa silkinish
  yoki «Bu qator to'g'ri…» bloki qo'shish tavsiya etiladi (+~4 qator).
- **AuthEnv s7 / s13:** yakun matni «qaytadan — xatosiz — o'tib ko'ring» + «↻ Qaytadan» tugmasi; 151 dan keyin qayta
  o'tish nishon bermaydi — `AchRule` «lost» qatori bilan ohang to'qnashmasligi tekshirilsin.
- **DbSql s3 tavsifi** «to'g'ri … joyladingiz» — bosishda joylashni ekran bajaradi (152-qonun 3-band).
- 13 darsning birortasida `graduate` yo'q (4 ta nishon — hammasi ekranga bog'langan; NodeServer'da beshinchisi arenadan).

## Eng qiyin 5 ekran

1. **PmLesson13 s4** — «sana» gapi uchun to'g'ri ustun boshida ekranda YO'Q (➕ uyacha keyin ochiladi); shu holatdagi
   bosish urinish sanalmasligi kerak (`g.col === 'sana' && !slotKor`). Brauzer-sinov shart.
2. **DbSql s3 (Qadoqxona)** — ikki yo'lli mexanika (bosish = avto, sudrash = tekshiruv); qaror + ehtimol mexanika o'zgarishi.
3. **AuthEnv s14** — xato-yo'l kodda bor, ekranda ko'rinmaydi; fidbek qo'shish kerak bo'lishi mumkin.
4. **pickKod × 4 (PmLesson11–14 s10)** — nishonning asosiy qismi mehnat, shart esa faqat darvoza-savolga tushadi;
   `AchRule` aynan savol yonida turmasa «birinchi urinish» nimaga tegishli ekani tushunarsiz.
5. **AuthEnv s7 / s13** — ichki «Qaytadan» (`restart`) bilan markaziy `missed` belgisi birga ishlashi (qayta o'tishda
   nishon berilmasligi, yakun matni ohangi).

## Hajm (taxminiy)

Kod: 23 ekranda ~115 qator (har birida `useContext` + 1–2 qator `miss` + `<AchRule>`); bundan tashqari har 11 darsga
`AchRule` komponenti + 3 qator CSS (FullstackConnect'ga kerak emas; PmLesson11/14 da faqat s9–s10 uchun). Matn: 0 ta yangi
o'quvchi-matni (agar 1–2-qarorlarda (a) tanlansa — 1 tavsif). Har darsda brauzer-sinov: kamida bitta ekran.
