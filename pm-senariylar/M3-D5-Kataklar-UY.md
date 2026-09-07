# M3-D5 — UYGA VAZIFA SENARIYSI: «Kataklaringiz o'sadi»

> Fayl: `src/3-Modull/PmLesson8.homework.jsx` · HW_ID `pm-m3-05` · Naqsh: PmLesson2.homework (ETALON)
> Dars-manba: PmLesson8.jsx. Darsning To'liq-kapsulasi: «2 ta yangi ish qo'shish → ikkalasiga ikki
> savol + katak → "Rejaga tushadi"dagi uzoq ishni ikkiga bo'lish (bir haftaga sig'adigan bo'lagi
> alohida karta)». Vazifa AYNAN shu. Tasdiq: foydalanuvchi 2026-09-02 («shoshilmasdan yaxshilab»).

## Maqsad (bitta ko'nikma)
Har yangi ishga AYNAN ikki savol berish («Nechta odam so'raydi?» · «Qancha vaqt oladi?») va
katakni javoblar o'zi chiqarishiga ishonish; rejaga tushgan uzoq ishni bo'lish.

## 4 bosqich + Natija (mezon 4/4)

**1-bosqich · Kataklarim.** Darsdagi 3 ish (kirish-artefakt `pm-m3d5-board.items`, avto-to'ladi:
nom + katagi). Har ish: nom (≥4) + katak-chip (🎯 darrov · 🏔 reja · 🌱 keyin · 🗑 yoq).

**2-bosqich · 1-yangi ish.** Nom (≥4) + ikki savol chip bilan: «Nechta odam so'raydi?»
(Deyarli hamma / Kam odam) · «Qancha vaqt oladi?» (Tez — 1–3 kun / Uzoq — bir haftadan ko'p) →
katak DARSDAGI `bahoKatak` bilan O'ZI chiqadi, izohi darsdagi BAHO_SABAB matni bilan.

**3-bosqich · 2-yangi ish.** Xuddi shu; nom 2-bosqichdagidan farq qilsin.

**4-bosqich · Xulosa.** (a) Beshala ishdan 🏔 Rejaga tushgani bo'lsa — o'shani tanlab, bir
haftaga sig'adigan bo'lagini yozish (≥6); rejada ish bo'lmasa bu qadam o'z-o'zidan bajarilgan
(halol izoh bilan). (b) 3 savol birma-bir (bo'lish tugamaguncha test xira):
1. Ko'p odam so'raydi + uzoq vaqt → REJAGA TUSHADI
2. Vaqt teng bo'lsa birinchi qaysi? → ko'proq odam so'ragani (darsdagi qo'shimcha qoida)
3. Rejaga tushgan uzoq ish bilan nima qilish mumkin? → ikkiga bo'lib bir haftalik bo'lagini alohida

**Natija.** 4/4 → bayram → 🏆 + Kataklar-kartasi: 5 ish o'z katagi bilan (yangilari aksent,
bo'lingan bo'lak reja-ishining ostida) → «Vazifani topshirish».

## Payload
`{lessonId:'pm-m3-05', kind:'homework', done, stages:'n/4', place:<1-yangi ish nomi>, durationSec}`

## Relslar
Etalon-relslar · dars-kalitlari faqat O'QILADI · katakni o'quvchi tanlamaydi (yangi ishlarda) —
ikki javob chiqaradi (darsdagi qoida) · misol-olam darsniki (o'yin-klub) — placeholderlar shundan.
