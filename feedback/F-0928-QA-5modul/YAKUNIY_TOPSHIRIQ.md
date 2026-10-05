> ⚠️ ESKI (tarix) — 04.10.2026 dan amaldagisi: **`konveyer/7-YAKUNIY.md`** (zanjir: `konveyer/README.md`). Bu nusxa F-0928-QA-5m jurnalidagi havolalar uchun saqlandi.

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

## 04.10 YANGILANISHI (5-Modulni yopish Q6 A, F-1004-60) — 12 dars koddan qayta yoziladi

- **Manba — hamma 12 dars KODDAN** (`src/5-Modull/<FAYL>.jsx`, 11-dars `src/pm/PmMetricsLesson.jsx`). Kod — yagona haqiqat.
  Ekranlar tartibi va nomi uchun yordamchi: 5/7/9 — `feedback/F-1002-mexanizm/<NN>-*-v2.md` (11 ekran, 172-qonun);
  3/4/6/10 amaliyot ekrani — `feedback/F-1002-mexanizm/03-04-06-10-amaliyot-v2.md`; qolganlari — `feedback/F-0928-QA-5modul/<NN>-*-v2.md`.
  Kod va v2 farq qilsa — KOD yutadi; farq hisobotga.
- **Ekran soni** = `SCREEN_META`: 1·3·4·6·10 — 20 · 5·7·9 — 11 · 2·8·12 — 16 · 11 — 18.
- **Amaliyot bloki** (5/7/9 A1–A3 va 3/4/6/10 amaliyot ekrani): qadamlar (sarlavha — matn), prompt qutisi (so'zma-so'z, `{…}` joylari bilan),
  xato izohi, «Bajardim», kutilgan natija chati (xabarlar tartibda), «Ortda qoldingizmi — mentor bilan `git …`» qatori, repo teglari.
- **Holat qatori:** `Holat: 04.10.2026 — kodga mos`.
- Fayl nomi o'zgarmaydi (`YAKUNIY/<NN>-<Nom>.md` — eskisining ustiga yoziladi).
- Boshqa qoidalar (format, faqat o'quvchi ko'radigan uz matn, so'zma-so'z, emoji yo'q, ✔, tasodifiy 30–40 satr tekshiruvi, hisobot) — yuqoridagidek.
