# LMS 13-Modul «O'sish va monetizatsiya» — manba (konveyer 0-bosqich)

Kod: `src/11-Modull` · kalitlar `m11-NN` · saqlash kalitlari `pm-m11dN-…` · App.jsx `id: '11'` (✅ 07.10 14:01 qo'shilgan, `comp` siz — qayta yaratilmaydi; «qur» da faqat import va `comp`; F-1007-459) · 07.10.2026 · F-ID 450 dan
Bu fayl — faktlar yig'indisi (dastur, App.jsx, grep, rasmiy hujjat). Qarorlar — qaror sahifasidan keyin `GATE_M_JAVOB.md` ga, tayanch — `00-MODUL-TAYANCH.md` ga.

## 1. Dastur v9 — 13-modul (13 dars)

Maqsad (dasturdan): **yunit-ekonomika, to'lov tizimi va o'sish mexanikalari; to'lashga tayyorlikning birinchi tasdig'i.** Texnik cho'qqi: **webhook + referal dvijok.**
TEX 1 · AI-PRAKT 4 · PM+PRAKT 2 · PM 5 · zaxira 1 · Demo Day yo'q. ≈4,5 hafta, jadvalda 14,5–15,5-oy. Keyingi — 14-modul «Bitiruvchi + Performance» (Demo Day 8 — bitiruv himoyasi: 5 daqiqa pitch + savol-javob).

| № | Tip | Mavzu (dastur) | Mazmun | Natija |
|---|---|---|---|---|
| 1 | PM | Юнит-экономика: CAC и LTV | Chuqur, real misollar bilan; o'z mahsuloti uchun hisob | Mahsulotining CAC va LTV'si |
| 2 | PM | Модели монетизации | Freemium, obuna, reklama, B2B, tranzaksiyalar | Asoslangan model tanlovi |
| 3 | TEX | Webhook и внутренности оплаты (cho'qqi) | To'lov real qanday o'tadi: webhook, idempotency, failed payment; sandbox | To'lov oqimi sxemasi + webhook testi |
| 4 | PM+PRAKT | Ценообразование + paywall (v8.1) | GIBRID: xarajat/raqobat/qiymat → narx shu darsda real paywall'ga; mobil trekda paywall — web sahifa orqali (Click/Payme), App Store/Play chetlab | Asoslangan narxli paywall ishlaydi |
| 5 | AI-PRAKT | Платёжная интеграция + «сломай оплату» | Click / Payme / Stripe test mode to'liq, talab — o'quvchidan; sboylar tuzatiladi | To'lov oqimi sboylarga chidaydi |
| 6 | PM | Первый разговор о деньгах | To'lashni qanday taklif qilish; skript, mentor bilan rol o'yini | Narx bo'yicha 3 real suhbat |
| 7 | PM+PRAKT | Юридический минимум + публикация | GIBRID: oferta, siyosat → hujjatlar saytda e'lon qilinadi | Oferta va siyosat saytda |
| 8 | AI-PRAKT | Retention-механики | Email/push: nega ketishadi, qanday ushlab qolish | 1 retention-mexanika qo'shilgan |
| 9 | PM | Чекпоинт монетизации | Kamida 3 kishi to'lashga tayyorligini tasdiqlaydi | 3 tasdiq + yozuvlar |
| 10 | AI-PRAKT | Growth: реферальный движок (cho'qqi davomi) | Unikal havolalar, taklif trekingi, mukofot — virallik kod sifatida | Referal mexanizm ishga tushgan + natija |
| 11 | PM | Рефлексия: где продукт сейчас | Mahsulot vs roadmap; shaxsiy PM-hisobot | Yozma refleksiya |
| 12 | AI-PRAKT | Доработка и стабилизация | Mahsulot final stabilizatsiyasi | Mahsulot barqaror |
| 13 | REZERV | Резервный урок | — | — |

**Dasturning tashkiliy chek-listi (13-modulga tegishli qatorlar, so'zma-so'z ma'nosi):**
- «Merchant masalasi (maktab yuridik shaxsi / ota-ona modeli) — 13-modulgacha hal qilinadi.»
- «Click/Payme/Stripe sandbox-akkauntlar ochilgan — 13-modulgacha.»
- «v8.1: mobil trek uchun paywall web sahifa orqali (Click/Payme havola) — qaror kelishilgan — 13-modulgacha.»
- Dars sifat filtri 2-band: «real element bor: jonli foydalanuvchi, jonli ma'lumot yoki jonli (sandbox) pul».
⚠️ Bu uch tashkiliy band hal bo'lgan-bo'lmagani repo'da yozilmagan — qaror sahifasida savol (TOLOV-q0).

## 2. App.jsx — hozirgi holat (07.10 13:40)

- `// ---- 10-Modul` izoh-qatori (170-qator) va `id: '10'` bloki (422-qator; 12-Modul, `title: 'Real vaqt va ishga tushirish', period: 'oy 13.5–14.5', stage: 2`) — ro'yxatda oxirgi blok.
  13-Modul bloki undan keyin yangidan qo'shiladi: `id: '11', slug: 'm11', period: 'oy 14.5–15.5', stage: 2` (dastur bilan bir xil). App.jsx ni besh seans tahrirlaydi — har safar qayta o'qib, aniq Edit.
- 12-Modul oxiri: `m10-12` «Raqamlaringiz zalni ishontiradimi?» → `m10-13` **«Zaxira dars»** (`type: 'Rezerv'`, `comp` siz, osti «taymer bilan to'liq repetitsiya») → **`m11-01`**. 13-Modul 1-darsining «oldingi darsi» — «Zaxira dars».
- Tip naqshi: PM va PM+PRAKT — `type: 'PM'` (9-Modul `m7-06`, 12-Modul `m10-03` naqshi); AI-PRAKT — `type: 'Proyekt'`; TEX — `type: 'Kod'`; zaxira — `type: 'Rezerv'`, `comp` siz.
- Komponent nomlari (taklif, `src/` da band emas — grep 07.10): `PmUnitEconomicsLesson` · `PmMonetizationLesson` · `PaymentWebhookLesson` · `PmPricingLesson` · `PaymentDayLesson` · `PmMoneyTalkLesson` · `PmTermsLesson` ·
  `WinBackDayLesson` · `PmPayCheckLesson` · `ReferralDayLesson` · `PmReflectionLesson` · `StabilizeDayLesson` (12-Modulda `RetentionDayLesson` band — 8-dars boshqa nom bilan).

## 3. 12-Moduldan keladigan holat (tayanch `feedback/F-1006-12modul/00-MODUL-TAYANCH.md`, GATE M ✅ 06.10)

- **Mentor misoli — «Maydon Jamoa»** (mahalla mini-futboli uchun jamoa yig'adigan mobil ilova; tashkilotchi o'yin e'lon qiladi, o'yinchilar «Qo'shilaman» ni bosadi; «8 / 10»). Repo `maydon-jamoa`: `mobil/` · `backend/` (NestJS, TypeORM, Neon; Render) · `prototip/` · `lending/`.
  12-Modul oxirida bor: real vaqt (socket.io, `oyin-ozgardi`) · «Hozir ko'ryapti» · jonli xabar · rejalashtirilgan eslatmalar (o'yin eslatmasi, uch kunlik) · `login` (telefon so'ralmaydi) · `namuna` ustuni · «Hisobni o'chirish» ·
  `hodisalar` jadvali va sanoq sahifasi (`lending/sanoq.html`, `SANOQ_KALITI`) · mehmon ko'rinishi · `lending/maxfiylik.html` (to'rt savol) · tarqatish: Android APK (EAS) + iPhone brauzer ko'rinishi (Netlify) · «Havolani ulashish» (lending manzili `?kanal=ilova`, 10-dars uyga vazifasi).
- **Oxirgi `-done` tegi:** `m12-dars-10-done` («Havolani ulashish»; 11, 12-darslar repo'ga yozmaydi) → 13-Modul boshlanishi `m13-dars-01-start` = `m12-dars-10-done`.
- **Mentor sonlari (tayanch 1.13 — boshqa son yo'q):** ro'yxatdan o'tgan 20 → 27 → 38 → 44 (11 tasi sinfdosh; 50 ga yetmagan) · asosiy harakatni qilgan 8 → 13 → 19 → 24 ·
  qadamlar (bir hafta keyin): ochdi 61 · ro'yxatdan o'tdi 38 · qo'shildi 18 · kelishini tasdiqladi 14 · qaytganlar foizi: birinchi haftada ochgan 61 qurilmadan 26 tasi ikkinchi haftada ham ochdi (43%) ·
  bosh raqam — haftada to'lgan o'yinlar: 1, keyin 3 · lending (Umami): 74 tashrif · 41 «Qo'shilmoqchiman» · mahalla futbol guruhi — 60 kishi · kanallarga pul sarflanmagan (postlar — tayanch 1.6).
  ⚠️ Mentor misolida **tashkilotchilar soni, narx, xarajat, to'lov** — hech qayerda yo'q. 13-Modul uchun yangi son kerak bo'lsa — qaror sahifasida (MISOL-q2).
- **Mentor pitchining keyingi qadami (12-Modul 12-darsi):** «E'lon berilgach «Havolani ulashish» tugmasi bilan tashkilotchi havolani o'z jamoasiga yuboradi — maqsad 50.» — 13-Modul 10-darsi (referal) shu tugmaning davomi bo'lishi mumkin.
- **11-Modul roadmap'i (tayanch 1.5):** «Maydon pulini bo'lishish» — RICE 5, ufq **«uzoqroq»**, sababi: «muammo gapidan kelmaydi; bitiruvgacha ishlar jamoa yig'ishga qaratilgan». Ruschasi «Делить плату за поле» (11-Modul lug'ati).
- **9.1–9.45 kelishuvlari** (12-Modul tayanch 9) — 13-Modulga ham tegadi: «Bajardim» faqat tekshiruvdan keyin · tekshiruv akkaunti agent ochadi va `id` bo'yicha o'chiradi · xato yo'lida ayb da'vosi yo'q · `.env` qiymatlari agentga yuborilmaydi ·
  web-trek teng yo'l · yakun sarlavhasi holatga qarab · «Ortda qoldingizmi» — o'z repo'sidan tashqarida, yangi papkada.
- **Saqlash kalitlari** — 13-Modul o'qishi mumkin bo'lganlar: `pm-m10d1-lending` (foydalar, `hodisa`) · `pm-m10d6-kanallar` · `pm-m10d7-reja` · `pm-m10d8-qadamlar` · `pm-m10d10-hisobot` (ro'yxat, asosiy harakat, qaytganlar foizi, `zaxira`) ·
  `pm-m10d12-pitch` · 11-Moduldan `pm-m9d5-prd` (muammo, yechim, funksiyalar, `keyin`) · `pm-m9d6-roadmap` (uch ufq, RICE) · `pm-m9d15-reja` (holatlar, risklar) · `pm-m9d8-platforma` (trek).

## 4. O'tilgan atamalar (grep 07.10: 5/6-Modul YAKUNIY, 9/10/11/12-Modul MD v3, `src/**/*.jsx`)

Modul raqami — **LMS raqami**; fayl yo'li — kod raqamida. «0» — o'quvchi matnida hech qayerda yo'q.

| Atama (dastur) | Avval o'tilganmi | Qaysi so'z bilan · qayerda (uz / ru) |
|---|---|---|
| CAC, LTV | **yo'q** (0) | yangi |
| yunit-ekonomika | **yo'q** | faqat 12-Modul MANBA eslatmasida; «юнит» — faqat «юнит-тест» (6-Modul) — boshqa ma'no |
| monetizatsiya | **yo'q** (o'quvchi matnida) | 10, 11, 12-Modul MANBA larida «K2 — monetizatsiya, 13-Modulga» |
| freemium | **yo'q** | yangi |
| obuna | ⚠️ boshqa ma'noda | 1, 2-Modul: «Obuna bo'lish» / «Подписаться» (kanal yoki sayt tugmasi); 7-Modul: «kanalning 5000 obunachisi» · 12-Modul: «sotib olingan obunachi» — pullik obuna ma'nosi YANGI (T-015) |
| reklama | ha (kundalik so'z) | 2-Modul (Uzum keysi), 6-Modul PmLesson16 test varianti — model sifatida yangi |
| B2B, tranzaksiya | B2B — yo'q · tranzaksiya — ⚠️ | 11-Modul 14-darsi: Database tranzaksiyasi (bir nechta yozuv birga) — to'lov tranzaksiyasi boshqa ma'no |
| webhook | **ha** | 7-Modul 1-darsi: «Webhook — yangi xabar kelganda Telegram uni o'zi botning internetdagi manziliga (URL) yuboradi. Buning uchun botga internetda ochiq manzil kerak.» · 7-dars: «Bepul server uxlaydi; webhook xabari uni uyg'otadi.» · ru `Webhook` (lotincha) |
| idempotentlik | **yo'q** (o'quvchi matnida) | faqat PM uyga vazifa fayllari izohida (`idempotency_key`) — yangi |
| to'lov · to'lov tizimi | so'z sifatida ha | 2-Modul amaliyot: «Savat va to'lov tizimi» (sayt bo'limi) — to'lov oqimi yangi; ru «оплата» |
| Click, Payme, Stripe | Payme — brend sifatida | 9-Modul 1-darsi: Payme — «telefon hisobini uydan turib to'ldiradi» (brend maketi, moviy-yashil) · Click, Stripe — yo'q |
| sandbox, test rejim | **yo'q** | «test holati» (12-Modul 4-darsi: eslatma vaqtini vaqtincha qisqartirish) — boshqa ma'no; «sandbox» faqat kodda (`iframe sandbox`) |
| narx | ha (kundalik so'z) | 2-Modul, 7-Modul bot menyusi («narxlar») — narx belgilash yangi |
| paywall | **yo'q** | yangi |
| oferta | **yo'q** | yangi |
| maxfiylik siyosati | ha | 10-Modul 6-darsi: «odamga ma'lumoti bilan nima bo'lishini aytadigan sahifa», to'rt savol · 12-Modul 7-darsi: `lending/maxfiylik.html`; ru «политика конфиденциальности» |
| retention | ha | 7-Modul `PmLesson21`: **«qaytganlar foizi»** (ru «процент вернувшихся»), kartochkada bir marta «inglizchasi: retention» · 12-Modul 9, 10-darslar |
| referal | **yo'q** | yangi; yaqin mexanizm — 12-Modul 6-darsi `?kanal=` belgisi va 10-darsi «Havolani ulashish» |
| konversiya | ha (uzoqda) | 2-Modul `PmLesson2`: «tashrifchi mijozga aylanadi — bu konversiya» (ru «конверсия»); 9–12-Modulda ishlatilmagan — o'rniga **«foiz»** (qadamdan qadamga o'tganlar foizi) |
| voronka | ⚠️ ikki xil | 7-Modul 9-darsi: «voronka» / «воронка» (test va fon so'zi) · 9–12-Modul: **«qadamlar»** (12-Modul tayanchi: «voronka» ishlatilmaydi, kartochkada bir marta «inglizchasi: funnel») |
| tasdiq · Mentor tekshiruvi | ha | 11-Modul 5-darsi «Mentor tekshiruvi: qabul / tuzatish»; 12-Modul 10-darsi — 9-dars «chekpoint» shu so'z bilan |
| roadmap · ufq | ha | 11-Modul 6-darsi: uch ufq (hozir · keyinroq · uzoqroq), RICE; ru «roadmap», «горизонт» |

## 5. Tekshirilgan tashqi faktlar (07.10.2026, rasmiy hujjat; iqtiboslar — aynan)

**Stripe**
- Hisob ochish mumkin bo'lgan davlatlar ro'yxatida **O'zbekiston yo'q** (Qozog'iston ham yo'q); ro'yxat: Avstraliya … AQSh, Hindiston va Indoneziya — «Preview» (stripe.com/global, 07.10.2026).
- Webhook: «Stripe attempts to deliver events to your destination for up to three days with an exponential back off in live mode» · «We retry event deliveries created in a sandbox three times over the course of a few hours» ·
  «Webhook endpoints might occasionally receive the same event more than once. You can guard against duplicated event receipts by logging the event IDs you've processed» ·
  «Stripe doesn't guarantee the delivery of events in the order that they're generated» · imzo — `Stripe-Signature` sarlavhasi, HMAC SHA-256 · «Quickly returns a successful status code (2xx) before any complex logic that might cause a timeout» (docs.stripe.com/webhooks, 07.10.2026).
  Xulosa: Stripe test rejimi O'zbekistondagi o'quvchiga to'g'ridan-to'g'ri ochiq emas (boshqa davlatni ko'rsatib ro'yxatdan o'tish — halol emas); webhook tushunchalari (qayta yuborish, takror, tartib, imzo) — umumiy va rasmiy manbali.

**Payme Business (developer.help.paycom.uz, 07.10.2026)**
- «С кассами могут работать только юридические лица: ИП, ЧП, ООО, АО, ГУП, СП, НОУ» (bosh sahifa).
- Песочница: «Добавьте веб кассу в кабинете мерчанта. После создания веб-кассы, Payme Business выдаст 2 ключа: ключ для кабинета — key; ключ для песочницы — TEST_KEY.» · «Важно чтобы в настройках кассы был указан Endpoint URL — веб-адрес биллинга» · «Веб-адрес песочницы: https://test.paycom.uz».
- Protokol: Payme Business merchant billingiga **o'zi so'rov yuboradi** — JSON-RPC 2.0, HTTPS POST; «Ответы с сервера мерчанта должны возвращаться с HTTP-статусом 200»; avtorizatsiya — «Базовая HTTP-аутентификация» (`Authorization: Basic base64(login:password)`; password — kassa kaliti); so'rovlar faqat ro'yxatdagi Payme IP manzillaridan.
- Metodlar: CheckPerformTransaction · CreateTransaction · PerformTransaction · CancelTransaction · CheckTransaction · GetStatement. Summa — tiyinda.
- **Takror so'rov (idempotentlik):** «В случае потери ответа при вызове метода, Payme Business повторяет запрос с теми же параметрами» · sandbox: «Запросы по методам CreateTransaction, PerformTransaction, CancelTransaction посылаются два раза… При повторных вызовах … ответ должен совпадать с ответом из первого запроса.»
- To'lanmagan tranzaksiya: «Отмена транзакции по таймауту производится через 12 часов … с причиной: “Отмена по таймауту” (4).»
  Xulosa: Payme sandbox kaliti — veb-kassa egasiga (yuridik shaxs yoki YaTT); har kassada **bitta** Endpoint URL; o'smir o'zi ola olmaydi.

**Click (docs.click.uz va rasmiy GitHub `click-llc/click-integration-php`, 07.10.2026)**
- Shop API: ikki so'rov — **Prepare** (`action = 0`) va **Complete** (`action = 1`); Click merchant tomonidagi manzillarga o'zi so'rov yuboradi (webhook turi); maydonlar: `click_trans_id`, `service_id`, `merchant_trans_id`, `amount`, `action`, `sign_time`, `sign_string`, Complete'da `merchant_prepare_id`.
- Kerakli ma'lumotlar: `merchant_id`, `service_id`, `user_id`, `secret_key`; «the user must be connected to Click Merchant using the Shop API scheme» (GitHub README).
- ⚠️ **Tekshirilmagan:** `docs.click.uz/shop-api/requests` va `/errors` sahifalari brauzer skripti bilan chiziladi — `sign_string` formulasi, xato kodlari va test vositasi matni o'qilmadi (tayanch bosqichida brauzerda ochiladi).
  Ulanish tartibi («ariza → shartnoma → merchant kabineti») — faqat uchinchi tomon sahifasida (docs.tgshop.io), rasmiy emas.

**Qonun (lex.uz, O'zbekiston Respublikasi Fuqarolik kodeksi, 07.10.2026)**
- **27-modda** (14–18 yoshli voyaga yetmaganlarning muomala layoqati): «…bitimlarni oʻz ota-onalari, farzandlikka oluvchilari yoki homiylarining yozma roziligi bilan tuzadilar» · roziliksiz: «oʻz ish haqi, stipendiyasi va boshqa daromadlarini tasarruf etish», «…oʻz intellektual faoliyatining … natijasi muallifi huquqini amalga oshirish», omonat.
- **369-modda** (ommaviy oferta): «Shartnomaning barcha asosiy shartlarini oʻz ichiga olgan, taklif kiritayotgan shaxsning javob qaytargan har qanday shaxs bilan … shartnoma tuzishga boʻlgan xohish-irodasi bilinib turgan taklif oferta (ommaviy oferta) hisoblanadi.»
- 10-Modul 6-darsidan (o'zgarmagan): «Shaxsga doir ma'lumotlar to'g'risida»gi Qonun — 4, 17, 18-moddalar; dars yuridik maslahat bermaydi.

**Render (12-Modul tayanchi 6, 06.10.2026 — o'zgarmagan):** bepul xizmat 15 daqiqa so'rovsiz qolsa uxlaydi, uyg'onishi ≈1 daqiqa; production uchun tavsiya qilinmaydi. 7-Modulda o'tilgan: «Bepul server uxlaydi; webhook xabari uni uyg'otadi.»
  Xulosa (3, 5-darslar): uxlagan Backend'ga kelgan to'lov so'rovi kechikadi; Payme javob yo'qolsa qayta yuboradi (rasmiy) — takror so'rov ikki marta hisoblanmasligi kerak.

**Telegram Bot API (core.telegram.org/bots/faq, 07.10.2026):** bitta chatga sekundiga bittadan ko'p xabar yuborilmaydi; guruhda daqiqasiga 20 tadan ko'p emas; ommaviy — sekundiga ≈30 ta.
  ⚠️ «Bot foydalanuvchiga birinchi bo'lib yozolmaydi» — FAQ da yo'q; tayanch bosqichida Bot API hujjatidan tekshiriladi (8-dars varianti uchun).

**Hali tekshirilmagan (tayanch bosqichida yoki pilotda):** Click `sign_string` formulasi va test vositasi · Click/Payme test kassasini maktab ochganmi (tashkiliy) · Payme so'rovini kutish muddati (uxlagan Render ≈1 daqiqa) ·
Click va Payme komissiyasi (ochiq narx sahifasi topilmadi) · email yuborish xizmatlari (8-dars varianti) · Telegram bot faqat /start dan keyin yozishi · O'zbekistonda YaTT/o'zini o'zi band qilgan yosh chegarasi.

## 6. Keys banki (K1–K19) — ishlatilishi va 13-Modulga nomzodlar

Qoida (PM-016): bosh-keys **modul ichida** takrorlanmaydi; mintaqaviy keys (K1, K2) — mavzu yo'l qo'ysa, kamida har 8-darsda; raqam faqat yili bilan; «raqamsiz» keysga raqam qo'shilmaydi.
Qo'shni modullarda: 10-Modul — K9, K1, K12 · 11-Modul — K18, K14, K4, K15, K16, K1, K10, K19 · 12-Modul — K3, K8, K6, K5, K1.
Oxirgi uch modulda ishlatilmagan: **K2 Telegram Premium** (kursda hali bosh-keys emas) · K7 Microsoft · K11 McDonald's · K13 Telegram · K17 Tesla.

| Dars | Mavzu | Nomzod (bank «Темы» maydoni bo'yicha) |
|---|---|---|
| 2 · modellar | monetizatsiya modellari | **K2 Telegram Premium** — «Темы: модели монетизации · freemium · ценообразование»: pullik obuna 2022-yil iyun; bepul Telegram qisqartirilmagan, Premium ustiga qulaylik qo'shadi; 2024-yilda obunachilar uch barobar (12 mln; 2025-yil may — 15 mln), Telegram birinchi marta foydaga chiqqan; 2024-yil daromadi 1 mlrd dollardan oshgan (monetizatsiya darsida summa aytilishi mumkin) |
| 11 · refleksiya | roadmap va hozirgi holat | **K17 Tesla** — «Темы: roadmap · горизонты планирования · стратегия · сроки»: 2006 — ochiq «master-reja» (qimmat sport mashinasi kichik seriyada → shu pulga arzonroq → ommaviy), o'n yildan ortiq bajarilgan; raqamsiz |
| 1 · CAC/LTV | birlik iqtisodi | bankda bu mavzuga keys yo'q (K1 «rost», K5 «retention» — 12-Modulda ishlatilgan) |
| 4 · narx | qiymat va narx | bankda «ценообразование» faqat K2 da (2-darsga); K18 Starbucks «ценность продукта» — 11-Modulda bosh-keys bo'lgan |
| 6, 9 · pul suhbati, tasdiq | sotishdan oldin tekshirish | K7 Microsoft («продать до того, как построил») — voqeada BASIC hali yo'q bo'lgan holda «bor» deyilgan; halollik qoidasiga zid o'qilishi mumkin |
PM+PRAKT (4, 7), TEX (3) va loyiha kunlari (5, 8, 10, 12) — 12-Modul naqshida keyssiz.

## 7. Dars turi → qolip va ekran soni (prompt 3.4, 9–12-Modul tajribasi)

| Tip | Darslar | Qolip · ekran |
|---|---|---|
| PM | 1, 2, 6, 9, 11 | PM dars (QKirish · QReja · QTushuncha · QTest · QVoqea · QMustaqil · QKod · podium · kartochkalar · yakun), ≈15–16 ekran; keyssiz PM — 12 ekran (12-Modul 11-dars shakli) |
| TEX | 3 | texnik dars (QTushuncha, QKod, QTest) + repo bloki, 18–20 ekran |
| PM+PRAKT | 4, 7 | **12 ekran:** PM nazariya → darhol 2 amaliyot bloki → yakuniy test → podium → kartochkalar → yakun |
| AI-PRAKT | 5, 8, 10, 12 | loyiha kuni: **8 ekran + 3 blok + kartochkalar = 12** |
| ZAXIRA | 13 | `comp` siz qator, MD yo'q |
Uyga vazifa — yakun kartasida, alohida `.homework.jsx` yo'q. Amaliyot bloki — 11/12-Modul modeli: o'quvchi hamma qadamni o'z repo'sida, o'z mahsuloti va trekida bajaradi; Mentor misoli — namuna.

## 8. Pul darslarining halollik chegarasi (prompt 4-bo'lim; qaror sahifasida tasdiqlanadi)
- O'smir real to'lov qabul qilmaydi — faqat test rejim; karta ma'lumoti hech qayerda yozilmaydi va ko'rsatilmaydi; maxfiy kalit faqat `.env` da.
- Real suhbatlarda bosim, majburlash va soxta tasdiq yo'q; tasdiq — real to'lov emas, yozma tasdiq.
- Tashqi xizmatlar (Click, Payme, Stripe, Render, Netlify, Neon, Expo, EAS, Telegram) imkoniyati, narxi, komissiyasi, tugma va menyu nomlari — faqat rasmiy hujjatdan, sana bilan (P-028).
