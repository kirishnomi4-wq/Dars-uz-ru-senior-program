# Yakuniy MD topshirig'i — 5-Modul (01.10, F-1001-81)

Foydalanuvchi qarori: feedbacklar to'g'rilangan oxirgi matn `feedback/F-0928-QA-5modul/YAKUNIY/` papkasida TOZA MD bo'lib saqlanadi.
Siz bitta dars uchun `YAKUNIY/<NN>-<Nom>.md` ni yozasiz. Boshqa hech qanday faylni tahrirlamaysiz (dars `.jsx` — faqat o'qish).

## Manba
- **1–8-darslar:** matn KODDAN olinadi (`src/5-Modull/<FAYL>.jsx` — razrabotka, sadoqat, vizual tuzatishlardan keyingi holat; bu — haqiqat).
  Tuzilma va tartib uchun — `<NN>-<Nom>-v2.md` (ekranlar tartibi, bo'limlar). Kod va v2 farq qilsa — KOD yutadi; farqni hisobotga yozing.
- **9–12-darslar:** kod hali qurilmagan → matn `<NN>-<Nom>-v2.md` dan (faqat tozalanadi, mazmun o'zgarmaydi).

## Format (aynan shu)
```
# <N>-dars «<Nom>» — yakuniy matn

Fayl: `src/…/<FAYL>.jsx` · <ekran soni> ekran · Keyingi dars: «…»
Holat: 01.10.2026 — kodga mos (1–8) | kod hali qurilmagan, savol 21–23 kutilmoqda (9–12)

## 0 · <ekran nomi>
- Eyebrow: …
- Sarlavha: …
- Mentor: …
- <karta / chat / kod / jadval / tugma — o'quvchi ko'radigan tartibda>
- Savol: … — variantlar ro'yxat bo'lib, to'g'risi oldida ✔
- Javob izohlari: …
(kod bo'lsa — ```js blokida, kodda qanday bo'lsa shunday)

## <keyingi ekranlar…>

## Nishonlar
## Qisqa takrorlash oynalari
## Jonli viktorina (12 savol)
## Kartochkalar
## Yakun
```
- Faqat O'QUVCHI KO'RADIGAN o'zbekcha matn. Bo'lmaydi: `✎` qatorlari, «Ko'rinish:», «Animatsiya:», «Olib tashlanadi:», «KOD» belgilari,
  `[NNN]` qator raqamlari, A-bo'lim (qoidalar), B-bo'lim, «KOD ro'yxati», «Darsning ipi», reja-jadvalidagi ichki yorliqlar, eski matn havolalari,
  mentor-paneli/analitika/ovoz matnlari, ruscha matn.
- Matn kodda/v2 da qanday bo'lsa — so'zma-so'z (tinish belgisi, «» qo'shtirnoq, apostrof ham). O'zingizdan tahrir yo'q.
- Emoji yo'q (o'quvchi matnida ham yo'q). ✔ — faqat to'g'ri javob belgisi sifatida.
- PM darslarida uy vazifasi kartasi kiritilmaydi (v2 dagidek).
- Ekranlar soni kodagi `SCREEN_META` bilan teng; podium ekrani — bitta qator «Natijalar (podium) — jonli reyting».

## Tekshiruv (1–8)
Yozib bo'lgach: kodning `uz:` satrlaridan 30–40 tasini tasodifiy tanlab (`grep -o`), MD'da aynan borligini skript bilan tekshiring; topilmaganlarini ko'rib chiqing
(o'quvchi ko'radimi? — ko'rsa, MD'ga qo'shing). Vaqtinchalik fayllar — `$S/<NN>-yakuniy/` (S = scratchpad).

## Hisobot (qisqa)
Fayl yo'li · ekranlar soni · tasodifiy tekshiruv natijasi (N/N) · kod va v2 orasidagi farqlar ro'yxati (1 qatordan) · shubhali joylar. Turn-byudjeti ≤45.
