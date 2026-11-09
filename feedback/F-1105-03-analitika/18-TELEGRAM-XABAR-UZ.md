# Telegram xabari — Abdullohga paket (09.11.2026)

Fayllar bilan birga yuboriladi: `16-ABDULLOH-JSON-V1.1-VA-OTISH-TARTIBI-UZ.md` · `16a-REESTR-DARS-CLASS-LEARN.csv` · `17-ABDULLOH-50-XABAR-HISOBOT-UZ.md` · `17a-50-XABAR-HISOBOT.csv`

---

Assalomu alaykum Abdulloh. 15-javobingiz bo'yicha hammasi bitta paketda, to'rt fayl:

1. **16 — JSON v1.1 va o'tish tartibi.** Siz so'ragan uch narsa: tuzatilgan JSON namunalari (`attempt_id`, `lesson_version` endi reestr versiyasi, `elapsed_sec` 7 kungacha qirqishsiz, `details` bloki full/partial/omitted, `not_started` to'liq JSON, `201` ma'nosi va v1/v2 javob farqi), brauzer va server kanalining umumiy kaliti bilan tartib qoidalari, kontent yangilanganda ochiq urinishlar va v1 ni to'xtatish sharti. 17 ta qabul ssenariysi ham shu yerda.
2. **16a — reestr.** 172 dars: `lesson_id` + versiya → CRM Class id → Learn id (sizning 3.1 bandingiz).
3. **17 va 17a — 50 ta rad etilgan xabarning sinov-hisoboti.** Hech narsa yuborilmagan. 229 qator (o'quvchi × dars): eski va tuzatilgan ko'rsatkichlar, chiqarilgan tafsilot sababi, bizda chiqariladigan 16 yozuv (shu dars bo'yicha natija allaqachon yetkazilgan). `sizda_tekshirish` ustuni sizniki.

Ikki muhim narsa:
- **2.7 bo'yicha bizning jumla eskirgan edi.** Bo'sh `badges` ning 422 olishi 17.09 dagi holat, Axadulla 18.09 da tuzatgan. Dalil (event_id, request_id) 16-hujjat 1-bo'limida. Chalg'itganimiz uchun uzr.
- **Yangi topilma (16, 2.2-bo'lim).** Tafsilot TZ'sidagi «`answered` = `questions` soni» tengligi sababli Dars API darsni **tugatgan** o'quvchining butun tafsilotini tashlab yuborar ekan: oxirgi 100 xabarda jonli darsda javob bergan 118 o'quvchidan 69 tasida, uyda 69 dan 33 tasida `questions[]` yo'q edi. Sabab — 87 darsdagi yakuniy amaliyot ekrani matnsiz yoziladi. Bugun Dars API qoidasi yumshatildi: `questions[]` `answered` dan kam bo'lishi mumkin, tugatgan o'quvchilarda ham tafsilot keladi. **Savol:** School API bu tenglikni tekshiradimi? Tekshirsa, sizda ham yumshatish kerak, aks holda bunday xabarlar 422 oladi.

Sizdan kutamiz: 16 ning 2, 3, 4-bo'limlariga «ha» yoki tuzatish · 2.2 dagi savolga javob · 17a da qaysi qatorlar yuborilishini belgilash. Keyin kelishilganidek: bitta xabar → sizda tekshiruv → qolganlari. JSON va tartib kelishilgach ish hajmi va muddatlarni birga belgilaymiz.
