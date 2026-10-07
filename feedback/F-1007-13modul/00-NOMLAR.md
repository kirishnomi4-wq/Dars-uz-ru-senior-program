# 13-Modul — dars nomlari (✅ tasdiqlangan: Qaror-0 24 — NOM-q0 A, 07.10.2026 14:00; atamalar — ATAMA-q0 A, ATAMA-q1 A)

PM darslar — savol-sarlavha (9–12-Modul uslubi) · texnik dars — mavzu nomi atama bilan («WebSocket: …» naqshi; «webhook» 7-Modulda o'tilgan) · loyiha kuni — «Loyiha kuni: …». Hammasi ≤55 belgi, bitta qator; menyu nomi = dars nomi (DE-205).
Menyu nomi umumiy (o'quvchining o'z mahsulotiga ham to'g'ri keladi); Mentor misoli faqat dars ichida. PM sarlavhasida hali o'tilmagan atama yo'q (T-011) — «oferta», «jalb qilish narxi», «taklif havolasi» faqat osti yozuvida yoki dars ichida tug'iladi.
Osti yozuvlaridagi atamalar — o'zbekcha ibora asosiy (ATAMA-q0 A): «jalb qilish narxi» (CAC) · «foydalanuvchi keltiradigan pul» (LTV) · «to'lov taklifi ekrani» (paywall) · «bepul asos» (freemium) · «pullik obuna» · «taklif havolasi» (referal) · «test rejim» · «takror xabar».

| № | Kalit | Tip (App.jsx) | Dars nomi (menyu = dars) | Belgi | Menyu osti yozuvi | Fayl (`src/11-Modull/`) |
|---|---|---|---|---|---|---|
| 1 | m11-01 | PM | **Bitta foydalanuvchi sizga qanchaga tushadi?** | 43 | jalb qilish narxi va foydalanuvchi keltiradigan pul | `PmUnitEconomicsLesson.jsx` |
| 2 | m11-02 | PM | **Mahsulotingiz qanday pul topadi?** | 32 | besh model: bepul asos, pullik obuna, reklama, B2B, tranzaksiya | `PmMonetizationLesson.jsx` |
| 3 | m11-03 | Kod | **Webhook: to'lov Backend'ga qanday yetib keladi** | 46 | imzo, takror xabar va rad etilgan to'lov — test rejimda | `PaymentWebhookLesson.jsx` |
| 4 | m11-04 | PM (PM+PRAKT) | **Narxni qanday belgilaysiz?** | 26 | xarajat, raqobat, qiymat → narx va to'lov taklifi ekrani | `PmPricingLesson.jsx` |
| 5 | m11-05 | Proyekt | **Loyiha kuni: to'lovni ulaymiz va buzib ko'ramiz** | 47 | test rejimda to'lov oqimi; buzamiz va tuzatamiz | `PaymentDayLesson.jsx` |
| 6 | m11-06 | PM | **Pul haqida qanday gaplashasiz?** | 30 | narx bo'yicha uchta real suhbat | `PmMoneyTalkLesson.jsx` |
| 7 | m11-07 | PM (PM+PRAKT) | **Foydalanuvchiga shartlarni qanday ochiq aytasiz?** | 48 | oferta va maxfiylik siyosati saytda | `PmTermsLesson.jsx` |
| 8 | m11-08 | Proyekt | **Loyiha kuni: ketayotgan foydalanuvchini qaytarish** | 49 | nega ketishadi va bitta qaytarish mexanikasi | `WinBackDayLesson.jsx` |
| 9 | m11-09 | PM | **Kim haqiqatan to'lashga tayyor?** | 31 | Mentor tekshiruvi: uchta yozma tasdiq | `PmPayCheckLesson.jsx` |
| 10 | m11-10 | Proyekt | **Loyiha kuni: taklif havolasi va mukofot** | 39 | unikal havola, sanoq va mukofot | `ReferralDayLesson.jsx` |
| 11 | m11-11 | PM | **Mahsulotingiz hozir qayerda?** | 28 | roadmap bilan solishtirish va shaxsiy hisobot | `PmReflectionLesson.jsx` |
| 12 | m11-12 | Proyekt | **Loyiha kuni: barqarorlashtirish** | 31 | asosiy yo'llarni tekshiramiz va tuzatamiz | `StabilizeDayLesson.jsx` |
| 13 | m11-13 | Rezerv | **Zaxira dars** | 11 | yetib olish / sayqallash | — (`comp` siz, `m8-13` naqshi — DARS-q3 A) |

Komponent nomlari App.jsx va `src/` da band emas (grep, 07.10; 12-Modulda `RetentionDayLesson` band — 8-dars `WinBackDayLesson`). PM+PRAKT (4, 7) App.jsx da `type: 'PM'` (12-Modul `m10-03` naqshi).
App.jsx 11-blok (qo'shildi 07.10 14:01, ikki aniq Edit: `// ---- 11-Modul` izoh-qatori 183-qatorda — 10-Modul importlaridan keyin; `id: '11'` bloki 442-qatordan — `id: '10'` blokidan keyin; 13 qator, `comp` siz; esbuild ✓, `lint:jsx` toza):
`id: '11', slug: 'm11', title: 'O\'sish va monetizatsiya', period: 'oy 14.5–15.5', stage: 2`,
`idea`: «Mahsulot pul topa boshlaydi: narx, test rejimdagi to'lov, taklif havolasi — va birinchi odamlar to'lashga tayyorligini tasdiqlaydi.»
Oldingi dars: `m10-13` «Zaxira dars» (12-Modul) · 13-darsdan keyin — 14-modul (App.jsx da hali yo'q). «Qur» da faqat import va `comp` qo'shiladi, aniq Edit bilan (App.jsx ni besh seans tahrirlaydi).
MD fayl nomlari — `NN-<komponent nomi, Lesson siz>-v3.md` (masalan `03-PaymentWebhook-v3.md`).
