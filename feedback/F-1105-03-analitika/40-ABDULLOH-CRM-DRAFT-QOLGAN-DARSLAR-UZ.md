# Prod CRM: JSX tekshiruvi to'xtab qoldi, 2 dars Draft'da — bugun tuzatish kerak

11 noyabr 2026, 02:50 · 38-hujjatdan keyin

Salom. «Cannot create catalogue lock» xatosini tuzatganingiz uchun rahmat, yuklash ishladi. Lekin hozir **reliz to'xtab turibdi**:

- ikkita dars **Draft'da qolib ketdi** — o'quvchi ularga kira olmaydi;
- CRM'ning JSX tekshiruvi 02:33 dan beri **ishlamayapti**;
- shu sababli qolgan **159 darsni yuklay olmayapmiz**: yuklasak, har biri Draft bo'ladi va tekshiruv ishlamagani uchun Draft'dan chiqmaydi.

## Bugun nima kerak (qisqasi)

1. **JSX tekshiruv navbatini (worker) tiklash** — 3-bo'lim.
2. **Draft'da qolgan 2 darsni qo'lda Active qilish** — 1-bo'lim.
3. **09 «VS Code» dagi B06 xatosi bo'yicha aniq ma'lumot** — 2-bo'lim.
4. **Yangi fayl tekshiruvdan o'tmaguncha eski versiya Active bo'lib tursin** — 5-bo'lim. Shunda yuklash hech qachon darsni o'quvchidan yopib qo'ymaydi.

## Hozirgi holat

| Modul | Yangi versiyada, Active | Draft'da qolgan | Kutyapti (eski versiya ishlayapti) |
|---|---|---|---|
| 2-Modul (14 dars) | 8 ta: 01, 02, 03, 06, 07, 08, 12, 14 | **09 VS Code** | 5 ta: 04, 05, 10, 11, 13 |
| 3-Modul (13 dars) | 3 ta: 01, 02, 04 | **05 if else** | 9 ta |
| 4–14-Modul (145 dars) | — | — | hammasi |

Jami: **11 dars** yangi versiyada, **2 dars** Draft'da, **159 dars** yuklanishni kutyapti.

## 1. Draft'da qolgan 2 dars — qo'lda Active qiling

| Dars | Fayl | Bo'lim | Qator uz / ru | Sabab |
|---|---|---|---|---|
| 2-Modul 09 «VS Code» | `09-VsCodeLesson-v6.jsx` | 2542 | 14097 / 14100 | «Браузер» tekshiruvi: XATO 1 (B06) |
| 3-Modul 05 «if else» | `05-JsConditionsLesson-v6.jsx` | 2434 | 14110 / 14109 | tekshiruv umuman boshlanmadi |

Ikkala darsda ham CRM'dagi fayl bizning paketdagi bilan bayt-bayt bir xil.

## 2. 09 «VS Code» — B06

- 01:52 da saqlandi. «Исходник» OGOH (xato 0). «Браузер» 02:09 da tugadi va 1 ta XATO berdi:
  - **B06** «Содержимое выходит за экран, но прокрутки нет» — «P» pastki 919 px > 900 px, skroll yo'q — `1440-uz #7,8,9,10,13,14…`
  - `validation_id`: `0730bd295d155d865749a7846277d86bfc63bb8c4e87a1845ef48e3ac5a45355`
- **Biz takrorlay olmadik:**
  - o'z brauzerimizda 1440×900 (uz) va 390×844 (ru) da ochdik, 20 ekranning hammasini ko'rdik, Google Fonts o'chiq edi. Ekrandan chiqib ketgan va skrollsiz element yo'q;
  - LMS preview'da (`lms.coddycamp.uz/preview`, 1440×900) ham shunday. Dars matni skroll qilinadigan blok ichida (`.stage-content`, `overflow-y: auto`).
- Darsning tuzilishi (ekran, skroll bloki) B06 siz o'tgan darslar bilan bir xil: 2-Modul 01, 03, 07, 08.
- **Savollar:**
  1. Bu qaysi «P»? Matni, selektori yoki skrinshoti bo'lsa, aniq tuzatamiz.
  2. `#7` — ekran raqamimi yoki tekshiruvdagi qadam raqami?
  3. Tekshiruv qaysi brauzer versiyasi va qaysi shrift bilan ishlaydi? Taxminimiz: internetsiz zaxira shrift kengroq bo'lib, matn 19 px ga sig'may qolyapti.

## 3. JSX tekshiruvi to'xtab qolgan — 3-Modul 05 «if else»

- Saqlandi: uz 02:29:56, ru 02:30:00. Ikkala qator Draft.
- `jsx_validation_report.php` javobi: `validation_id` = `4f0d1729a465d00fa175cba647f0cf98098aa2518c0f15c21cf9474756cd1932`, lekin `static: null`, `browser: null`. 02:50 gacha shunday turibdi, ya'ni 20 daqiqa.
- Oldingi 12 darsda «Исходник» saqlash bilan darhol tugardi, «Браузер» esa ~3 daqiqada (navbat bilan, birin-ketin). Oxirgi muvaffaqiyatli tekshiruv: 3-Modul 04 «JsVars», 02:33 da Active bo'ldi.
- 02:47 da uz qatorini (14110) o'sha fayl bilan qayta saqladik. Saqlash o'tdi va fayl bayt-bayt bir xil, lekin CRM **o'sha `validation_id`** ni qaytardi. 1 daqiqadan keyin ham `static: null`. Demak, qayta saqlash tekshiruvni qayta boshlamaydi: topshiriq navbatda osilib qolgan.
- Bizningcha, tekshiruv navbati (worker) to'xtab qolgan yoki shu topshiriq yo'qolgan. Iltimos, tekshirib bering.

## 4. 2-Modulning 5 darsi tayyor — tekshiruv tiklanishini kutyapti

Bu darslarni CRM saqlashda rad etgan edi. Biz o'z tomonimizda tuzatdik va qayta sinadik (smoke-lms 5/5, smoke-preview 5/5):

| Dars | Avvalgi rad sababi | Nima qildik |
|---|---|---|
| 04 Htmllesson2 | R04 — uyga vazifa rasmi Vercel'da edi | rasmni CRM media kutubxonasiga yukladik: `…/media_library/9676868e5c18da32aaed138d2327fe1a.png` |
| 05 HtmlTakrorlash | R04 — xuddi shunday | `…/media_library/65bb6ee3c9e5941f468a9d7e37f9dbaa.png` |
| 10 HtmlPractice · 11 CssPractice · 13 Deploy | K03 — `react-dom` importi | `createPortal` endi o'zimizning faylimizda (react-dom'dagi bilan bir xil obyekt), `react-dom` importi yo'q |

Boshqa modullardagi xuddi shunday 29 dars ham tuzatildi. K03 va R04 bo'yicha sizdan boshqa iltimos yo'q.

**Nega yuklamayapmiz:** CRM yangi faylni saqlagan zahoti qatorni Draft qiladi va tekshiruv tugamaguncha Active qilishga ruxsat bermaydi. Tekshiruv ishlamayotgani uchun yuklangan har dars Draft'da qotib qoladi va o'quvchi unga kira olmaydi. Tekshiruv tiklangach, 159 darsni navbat bilan yuklaymiz: har darsni tekshiruvdan o'tishini kutib, Active qilib boramiz.

## 5. Savollar va taklif

1. **Draft:** Draft paytida o'quvchi darsni ochib bo'ladimi? Bu savol 38-hujjatda ham bor edi.
2. **Taklif — tekshiruvdan oldin Draft qilmaslik:** yangi fayl tekshiruvdan o'tguncha qatorda eski versiya Active bo'lib tursin, yangi fayl esa faqat tekshiruvdan o'tgach almashsin. Shunda tekshiruv xato bersa yoki to'xtab qolsa ham o'quvchi darssiz qolmaydi.
3. **Orqaga qaytarish:** hozircha tekshiruv XATO bersa yoki to'xtab qolsa, qatorni oldingi faylga (CRM `versions/` da saqlanadi) qaytarish yo'li bormi?
4. **Tezlik:** «Браузер» tekshiruvi fayllarni birma-bir tekshiradi, har biriga ~3 daqiqa ketadi. 159 dars uchun bu ~8 soat degani. Tekshiruvni parallel qilish mumkinmi?
