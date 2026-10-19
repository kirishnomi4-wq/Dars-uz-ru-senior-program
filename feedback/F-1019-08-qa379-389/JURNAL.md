# F-1019-08 · QA F-1015-379/380/386/389 (m12-02, m12-05, m12-08) + reja buyruq + 213.23 supurish (11 pitch dars) · 19.10.2026
Manba: `feedback/F-1015-7-14M/F-1015-379-389-pitch-seans-prompt.md` (7–14-M QA seansi). Foydalanuvchi: tashxisga «mayli url larni yangila».
Zaxira: `arxiv/F-1019-08-oldin/` (11 fayl). QA suratlari eski bilddan (m12-02 15 ekranli, «Tugmalarni bosing») — har band hozirgi versiyada tekshirildi.
Dars nomlari: m12-02 = PmStoryPitch · m12-05 = PmPitchTraining · m12-08 = PmFinalPitch (F-1019-04/07 jurnallarida almashib ketgani tuzatildi).

## 1. QA bandlari
| Band | Hukm | Nima qilindi |
|---|---|---|
| 379 m12-02 «Ro'yxat va hikoya» — bo'sh «2 3» uyalar | TASDIQLANDI → tuzatildi | uya faqat javobdan keyin; funksiya chiplari faqat 1-qadamda; telefon olindi (o'zgarish uyada «Juma 9/10») |
| 380 m12-02 «Hikoya va bo'laklar» — 8 qatlam | TASDIQLANDI → tuzatildi | uch hikoya kartasi, vaqt chizig'i, uchish animatsiyasi olindi; olti bo'lak — BITTA karta (sarlavha = hakam savoli, qatorlar chiziq bilan); qadam izohi karta ichida; telefonda qatorlar to'liq kenglikda (oldin o'ng chetdan kesilardi) |
| 379 tugmadagi «(0/3)» | QISMAN | uyalar olingach sanoq yagona ko'rsatkich (213.21 mos); «Uch kartani yozing (n/3)» — tablar bor, sanoq olindi |
| 379 s5 iPhone mobil | OQLANDI | ekran qisqartirishda olib tashlangan (F-1018-12) |
| 386 m12-05 tiqilish | OQLANDI | qaror qadamlari oxirigacha o'tadi (1280 va 390) |
| 386 m12-05 «Baholash varag'i» — bo'sh 6 katak, qora panel | TASDIQLANDI → tuzatildi | `Varaq`: faqat to'lgan yoki joriy qator; bo'sh varaqda bitta kulrang gap; oddiy sarlavha + chiziq; nutq pufagi bo'sh «…» chiqmaydi; tinglovchilar faqat 3-qadamda; varaq pitchdan keyin |
| 386 m12-05 «Tuzatishlar ro'yxati» — bo'sh «1 2 3» | TASDIQLANDI → tuzatildi | `Royxat`: band paydo bo'ladi, uchish nishoni — ko'rinmas langar; xato variant yopiladi (213.22); nav «Savollarga javob bering» |
| 389 m12-08 «Tuzatish va taymer» o'tmaydi | OQLANDI (Chrome) | 3-javobdan keyin taymer 6 s, «Davom etish» ochiladi. Safari — WebKit yo'q, QA qayta ko'radi |
| 389 m12-08 olti bo'lak alohida karta | TASDIQLANDI → tuzatildi | `.fp-bolaklar` bitta karta, qatorlar chiziq bilan, joriy/xato — chap chiziq; telefon olindi (komponent va CSS o'chirildi) |
| 389 m12-08 kirish / savol-javob bo'sh «1:00» | TASDIQLANDI → tuzatildi | bo'sh katak chizilmaydi; savol-javob nav sanog'i olindi (kataklar — ko'rsatkich) |
| 389 Safari vs Chrome s0–s2 | farq yo'q | suratlar solishtirildi |

## 2. Reja — buyruq shakli (KORPUS §REJA-BUYRUQ)
8 dars, 31 qadam (uz + ru): m1-12 PmLesson3 (STEPS), m7-12, m8-11, m9-16, m12-01, m12-02, m12-05, m12-08. m10-11, m10-12 — avval buyruq edi. Sarlavhalar o'zgarmadi. YAKUNIY MD reja qatorlari (6 fayl) moslandi. `reja.py`.

## 3. 213.23 supurish — 11 pitch darsi
Vosita: `sinov/qaror.mjs` ga bo'sh-element detektori (punktir chegara yoki `bosh/joy/uzuq` klass + matnsiz; «yorliqli» — `bosh` klass + qisqa yorliq). TUZOQ: o'zbekcha `bosh` = «sarlavha» ham (`ps-slayd-bosh`, `pr-sl-bosh`, `fp-hk-bosh`, zal `pr-bosh` — boshlar) → har topilma CSS'dan tekshirildi. 1-yurish 93 ekran (`supur.txt`).
Tuzatildi:
- m7-12: slayd qatorlari — bo'sh/«demo» punktir chizilmaydi (joriy nishon qoladi); reja skeleti nom bilan; **s2 passiv «Slaydga qo'ying» → 3 qaror** (213.22; zal savollari «Bu qanday bo'lgan?», «Bu nechta odamda bo'lgan?»).
- m8-11: hali qo'shilmagan slayd uyasi yo'q; matnsiz qator chizig'i yo'q; reja — slayd nomlari navbat bilan; raqam slaydida faqat qo'shilgan qatorlar.
- m9-16: bo'sh bo'lak kartasi chizilmaydi; dalil kartasida qolgan dalillar uchun bo'sh qatorlar yo'q.
- m10-11: dalil ekranidagi bo'sh katak ko'rinmas (uchish nishoni joyida); «Manba» oynasining qora paneli → oddiy sarlavha.
- m10-12: grafikning bo'sh sarlavha chizig'i va ikkinchi qurilmaning bo'sh qutisi ko'rinmas (joy saqlanadi).
- m12-01: qoralama saqlanmagan bo'lsa bo'sh qatorlar yo'q.
- m12-02 «Mustaqil ish · hikoya»: yozilmagan uya yo'q (bo'shda bitta kulrang gap).
Qoldirildi (chiziq, 213.23d ruxsat): taymer bo'linmalari (`h-uzuq`, `gv-tm`), m12-02 maydon chizmasidagi bo'sh o'rindiqlar (ma'no: «2 kishi kelmadi»).

Qo'shimcha (ko'z bilan): m8-11 reja kartasida nom kesilardi («Foydalanuv…») → kichikroq shrift + ko'chirish; yonmagan slayd kartasi chizilmaydi.
Qoldirildi: m7-12 «Fikr yoki va'da» — saralash mashqining nomli nishon ustuni (bo'sh uya emas).

## 4. Tekshiruv
- gates: 11 fayl 13/13 (PmLesson3 emoji 3 — zaxira bilan teng, eski) · `lint:jsx` 256 fayl toza · `lint:prompt` toza · `vite build` toza.
- Supurish 2-yurish (`supur2.txt`, 93 ekran): faqat soxta topilmalar (sarlavha `*-bosh`, zal boshlari, taymer bo'linmalari) — pageerror 0.
- Brauzer: `qaror.mjs` (xato → sabab + yopiladi → to'g'ri → «Davom etish» ochiq; qaytganda tugagan) — m12-02 s2/s3, m12-05 s2, m12-08 s3 (uz 1280 · uz 390 · ru), m7-12 s2 (uz 390 · ru), m8-11 s2/s3, m9-16 s2/s3, m10-12 s3 (390) — hammasi o'tdi, gorizontal aylantirish yo'q. `s4.mjs` (m12-05 tuzatishlar ro'yxati: bo'sh uya 0, qator paydo bo'ladi, xato variant yopiladi), `s2-m1208.mjs` (savol-javob: bo'sh katak yo'q) — 1280 va 390.
- Suratlar ko'rildi: m12-02 s2/s3 (1280, 390), m12-05 s2/s4, m12-08 s0/s2/s3, m8-11 s1/s2, m9-16 s2 (390), m7-12 s2/s3, m10-11 s3, m10-12 s3, m12-01 s6.
- Safari: tekshirilmadi (WebKit o'rnatilmagan) — QA qayta ko'radi.
Commit yo'q.
