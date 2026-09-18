# TUNGI HISOBOT — KATTA §41 B to'lqin (18.09 21:45 → 19.09 ertalab)

> Har band yopilganda yangilanadi. Oxirgi yangilanish vaqti — pastdagi «Jurnal» ning oxirgi qatori.
> Reja va qarorlar: `TUNGI_REJA.md`. Hech narsa push/deploy qilinmagan.

## Qisqa holat

| Band | Holat |
|---|---|
| T0 A to'lqinni commit | ✅ `16791ee` · `9eda330` · `655cd93` |
| T1 vositalar | ✅ `codemod-achrule` · `ach-probe` (pilot 2/2, negativ nazorat ✓) |
| T2 mini-inventar | 🔄 |
| T3 yo'riqnoma | ✅ |
| T4–T8b partiyalar | ⬜ |
| T9 ball + 152-reyestr | ⬜ |
| T10 matn takliflari | ⬜ |
| T11 qonun/hujjat | ⬜ |
| T12 regress | ⬜ |
| T13 muhr | ⬜ |

## Topilmalar (tun davomida)

1. **Pilot qatorining rangi o'qib bo'lmas edi** (18.09 kunduzgi pilot): `.ach-rule` rangi `ink3` — fonga kontrast
   2.22:1 (13px matn uchun kamida 4.5:1 kerak). Endi rang har dars palitrasidan kontrast bo'yicha tanlanadi: 95 darsda
   `ink2` (6.2–6.7:1), 2 darsda `ink3Deep` (4.74:1). Pilot ham tuzatildi.
2. **s13b (o'yin) sinovi beqaror edi** — paket harakatlanayotganda bosish jim e'tiborsiz qoladi (o'yin to'g'ri
   ishlaydi); sinov kutishni oshirib barqaror qilindi (3/3). Xulosa: animatsiyali ekranlarda prob `after` bilan kutadi.

## Jurnal

| Vaqt | Nima |
|---|---|
| 21:50 | T0: 3 commit (A to'lqin: muhrlash · 97 dars · hujjatlar). Oldidan: vite build ✓ · lint:jsx ✓ · unit 11/11 · sir-qidiruv toza |
| 21:55 | Zaxira taymer (har 20 daqiqa: :07 :27 :47) · T2 fonda boshlandi |
| 22:20 | T1 + T3 tayyor; pilot `AchRule` kanonik ko'rinishga (`once` + o'qiladigan rang) |
