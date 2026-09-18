# B to'lqin inventari — P3 (3-Modull · 22 trigger · 11 fayl) · 2026-09-19

Usul: har ekran komponenti (va u chaqiradigan ichki komponent) kodda TO'LIQ o'qildi. **Brauzerda hech biri ochilmadi** —
xatti-harakat kod bo'yicha aytilgan. To'liq yozuvlar: `inventar-P3.json` (`triggerlar` 22 · `darslar` 11). `src/` ga tegilmadi.

## Hukmlar

| Hukm | Soni | Qaysilar |
|---|---|---|
| **A-umumiy-komponent** | 5 | ReactApiPost s13 · ReactFirstComponent s14 · ReactIntro s14 · ReactPropsReuse s14 · ReactRouterPractice s13 |
| **A-qo'l-ishi** | 6 | PmLesson8 s4 · PmLesson8 s9 · PmLesson9 s9 · PmLesson10 s9 · ReactBuildSite s10 · ReactCrudPractice s13 |
| **TEKIN** → bonus taklifi | 4 | PmLesson9 s4 · PmLesson10 s4 · ReactIntro s13 · ReactRouterPractice s9 |
| **MEHNAT** | 7 | PmLesson8 s8 · PmLesson9 s8 · PmLesson10 s8 (erkin yozma) · ReactApiGet s15 (VS Code «Bajardim») · PmLesson8/9/10 s10 (sinf-qaror, pastda) |
| C-halol | 0 | — (bu partiyada hisoblangan `correct` yo'q) |
| NOANIQ | 0 | — |

Saralash skriptining «A challenge» degan 21 tasidan **10 tasi aslida A emas** (4 tekin + 6 mehnat): skript `tries`, `tekshir`,
`miss` so'zlarini xato-belgi deb olgan, ular esa ipucha-hisoblagich, «Tekshiruv» sarlavhasi yoki lokal animatsiya-holati edi.

## Mexanikalar

debug-qator-topish 6 (5 tasi `DebugChallenge`, 1 tasi inline) · tanlov / karta → katak 4 · ketma-ket tartib 1 · ko'p-bosqichli
(tartib + tanlov + debug) 1 · kashfiyot / qum-quti 4 · erkin yozma 3 · tashqi ish 1 · darvoza-mashq + tashqi ish / kompilyator 3.

## Umumiy komponentlar

| Komponent | Fayllar | Ilgak | Eslatma |
|---|---|---|---|
| `DebugChallenge({ lines, fixed, explain, onSolved })` | 5 (ApiPost 630 · FirstComponent 1426 · Intro 740 · PropsReuse 1466 · Router 1421) | `onWrong` YO'Q | `click()` tanasi 5 faylda **harfma-harf bir xil** (`else { setWrongIdx(i); … }`) → codemod: prop + `onWrong && onWrong();`. Har faylda bitta chaqiruv. |
| `DragDropOrder({ items, hints, onSolved })` | 3 (ApiPost 554 · Intro 656 · Router 1346) | `onWrong` YO'Q, lekin `wrong = full && !solved` tayyor | Pilotdagi 2 qator bilan yopiladi. Trigger-ekranda faqat ApiPost s13 da; Intro/Router da test-ekranlarda (bu ro'yxatga kirmaydi). |
| `ScreenLivePractice` | 9 fayl | — | «Bajardim» — mehnat; B to'lqinda tegilmaydi. |
| PM «xato-qolipi» (`setMiss(x); setMissedOnce(true); …`) | PmLesson8/9/10 — s9 va `ScreenCoding` | — | Komponent emas, takror kod: `achMiss.miss(screen)` aynan `setMissedOnce(true)` yoniga qo'yiladi. **Lokal `miss` nomi band** → kontekst `achMiss` deb nomlanadi. |
| `Kataklar` + `tryCell` (`hint: true`) | PmLesson8 s4, s9 | — | mantiq ekranda, komponentga prop kerak emas. |

Infratuzilma: `AchMissCtx` 11/11 faylda bor; **`AchRule` + `.ach-rule` CSS 0/11** — har faylga qo'shiladi (`<style>` qatorlari JSON'da).

## Foydalanuvchi qarori kerak

1. **PM `ScreenCoding` ×3 (PmLesson8/9/10 s10) — sinf-qaror.** Ekran ikki bosqichli: avval kichik darvoza-mashq (xato tanlov
   mumkin), keyin asosiy ish — VS Code'da (PmLesson8, 10) yoki dars ichidagi kompilyatorda (PmLesson9; «Davom» faqat hamma
   talab o'tganda yoqiladi, «Tekshirish» tugmasi yo'q). Nishon asosiy ish tugaganda beriladi. **Tavsiya: MEHNAT** (152-qonun
   5-band). Muqobil — darvozadagi birinchi xatoni `miss` qilish: 10 daqiqalik mehnat nishoni bitta isinish-savoli uchun
   yo'qolardi. Bu qolip boshqa PM darslarda ham bor bo'lishi kerak — qaror bir marta, hamma partiyaga.
2. **4 ta TEKIN → bonus** (152-chegara hammasida saqlanadi, tavsiflari rost):
   - PmLesson9 «To'rt shartni o'zingiz bosib tekshiring» (s4) — izlanishli qum-quti; tavsif tekshirildi (4 shartdan 3 tasi nosoz).
   - PmLesson10 «To'rt kadrni bosib, sinfdoshingiz nima deganini o'qing» (s4).
   - ReactIntro «O'z saytingizni bloklardan quring» (s13) — istalgan 3 blok.
   - ReactRouterPractice «Ro'yxat tayyor — endi AI quradi» (s9) — istalgan buyruq + rejani tasdiqlash.
3. **Ko'p-bandli topshiriqda qattiqlik** (151-jadval bo'yicha to'g'ri, lekin «qismaslik»ka tegadi): PmLesson8 «Oltita ishni
   4 katakka joylashtiring» (6 karta) va PmLesson9 «Beshta qadamni ketma-ketlikka joylang» (5 qadam) — bitta noto'g'ri
   bosish butun nishonni oladi. Qoida shunday qolsinmi — bilib qo'yish uchun.

## Yon-topilmalar (tuzatilmagan, faqat qayd)

- **Maslahat javobni urinishdan OLDIN aytadi (3):** ReactCrudPractice s13 (boshlang'ich `hint` `push` ni nomlab beradi) ·
  ReactIntro s14 (`hint` xato qatorning o'z izohini takrorlaydi: «qolgan hammasi») · ReactRouterPractice s13 (`hint`:
  «Qayta yuklash — `<a href>` ning belgisi»). Nishon halol bo'lishi uchun bular ham ko'rilishi kerak (NodeServer s14 sinfi).
- ReactBuildSite s10: ekrandagi qizil ogohlantirish («narx ko'rinmayapti») to'g'ri variantni («narxni qo'sh») aytib turadi.
- PmLesson9 s8: tavsif «tekshiriladigan shart» deydi, lekin baho-so'zli shart ham saqlanadi — §133 bo'yicha chegarada.
- `ACH_TRIGGERS` ustidagi «faqat REAL solve bilan» izohi ReactIntro va ReactRouterPractice da noto'g'ri (qoldiq).
- PM `ScreenCoding`: darvoza va yakun holati `ccProgress` dan tashqarida (`pm-…-code` kaliti) saqlanadi → «Qaytadan»
  mashq-o'tishida ekran bajarilgan bo'lib ochiladi (6-bandga zid emas).
- Ro'yxatdan tashqarida ko'zga tashlandi: ReactCrud s14 / FirstComponent s15 / PropsReuse s15 / Router s14 — meta'da `test`,
  mexanika — yozma regex-tekshiruv (JsConditions s15 sinfi); ReactIntro s15 — `test`, mexanika `DragDropOrder`.

## Eng qiyin 5 ekran

1. **ReactApiPost s13** — bitta ekranda uch mexanika (tartiblash + tanlov + debug), ikki umumiy komponentga `onWrong`,
   `AchRule` uch bosqichga bitta; bosqich holati F5 da yo'qoladi (`missed` qoladi).
2. **PM `ScreenCoding` ×3** — texnik emas, siyosat-qarori; holat alohida kalitda.
3. **ReactCrudPractice s13** — xato-yo'l JSX ichidagi ikki inline `onClick` da (bir qatorli izoh xavfi, F-0802-15 sinfi) +
   javobni oldindan aytadigan maslahat.
4. **PmLesson8 s4** — 6 karta, har noto'g'ri katak xato urinish; qisman holat saqlanmaydi; qattiqlik savoli.
5. **PmLesson9 s4 / PmLesson10 s4** — `tries` va `rescue` klapani xatoga o'xshaydi, aslida emas; bonus deb tasniflash
   to'g'riligi tavsifga bog'liq (tekshirildi — rost).

## Hajm (taxmin)

A-qo'l 6 ekran × ~4 qator · A-umumiy 5 ekran × ~6 qator (+ApiPost ~9) · har faylga `AchRule` komponenti + 3 qator CSS
(8 faylda kerak: mehnat/bonusdan boshqa nishoni bor darslar; ReactApiGet da kerak emas). Matn o'zgarishi: yo'q
(`AchRule` matni §183 dan, o'zgarmaydi).
