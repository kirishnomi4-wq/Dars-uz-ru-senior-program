# Ochiq savollar — PM tozalash (yakuniy ko'rikda foydalanuvchiga)

Bosh-agent vaqtincha hal qilgan (o'zgartirish mumkin):
1. PmLesson1 s11 — karta yig'ishda qiymat faqat o'ng kartada (chapda «✓ KIM ↻»). Qoldirildi.
2. PmLesson1 s1 — namuna-karta «↻ Yana ko'rish» tugmasi olindi.
3. PmLesson4 s4 — «logotipga joy topilmadi» bloki olindi (s5 test javobini oldindan aytardi). Olingani qoldi.
4. PmLesson6 s15 — «Kim g'olib?» tarjimasiz edi → ru qo'shildi.

Foydalanuvchi qarori kerak:
5. Sudraladigan chiplar (`dd-chip`, to'yingan to'q sariq gradient) — PmLesson2 s11 va Bot/PM darslari yakuniy tartiblash ekranlari. Yumshatamizmi (oq fon + accent halqa)? — «baland rang» qoidasiga to'g'ri keladi, lekin bu interaktiv element.
6. PmLesson2 s14 — zanjir endi to'liq kenglikda (bo'shroq). Yetarlimi yoki markazda tor ustun?
7. PmLesson5 s1 — namuna-karta faqat chap yarmida, o'ng bo'sh. To'liq kenglik qilinsinmi?
8. Refleksiya ekrani «② ✍️ Endi bir qator yozing» qadam-sarlavhasi — ustunlar tekisligi uchun qoldirilgan (1-qadam bilan juft).

YAKUNIY GLOBAL O'TISH — ✅ BAJARILDI (26.09, `scripts/codemod-taskspec.py`):
- «3 tadan N tasi yozildi» sanog'i — 10 joy olindi; «💡 Yordam / ⭐ Qo'shimcha» uzuq qutilari → matn-havola (17 dars);
  «To'g'ri — / Верно —» prefiksi — 32+ joy; qadam-chipini takrorlagan karta sarlavhasi (PmLesson13/15) olindi.
- `.frame-dash` — PmLesson2 dagi oxirgi 2 ramka olindi (mentor «birma-bir bosing» deydi), ⛶ birinchi bosishgacha
  yashirin (`<Zoomable off={!active}>`). Qolgan `dashed` — ma'noli: sudrash-uyasi (dd-slot, fslot, gp-slot,
  silo-slot), PmLesson24 «uch oydan keyin» ufqi (noaniq kelajak = uzuq), fokus-halqa, demo-varaqning bo'sh kataklari.
- 159-qonun (raqam 156→159: 156 — brend-izoh qonuni, 21.09) 7–11-bandlari yozildi.
- page-audit'ga ZBTN o'lchovi qo'shildi (⛶ bo'sh ustun ustida).

Bosh-agent o'zi hal qilgan (3-bosqich, 17–25):
9. PmLesson18 s8 — «son/sabab yozilmagan» ru tarjimasiz edi → ru qo'shildi.
10. PmLesson23 s4/s9 — sarlavha va yo'riqdagi «o'ng tomonga / chapdagi» neytrallandi (telefonda ustun pastga tushadi).
11. PmLesson24 s1 ru — uzun qator qisqartirildi («Поздравим постоянного клиента с днём рождения»), ✅ endi qatorda.
12. PmLesson16 s4 — ustunlar pastga tushib turardi (`justify-content:center`) → tepadan; «🎯 Bugungi qoida» ru qo'shildi.
13. PmLesson12 s8 — mentordagi «ular pastda turibdi» olindi (qatorlar o'ngda turardi).
14. PmLesson25 s12 «🎯 Bugungi qoida» — dars yakunidagi qoida, boshqa ekranda (s2) aytilgan gap bilan bir sahifada emas → QOLDI.

Foydalanuvchi qarori kerak (3-bosqich agentlaridan, bosh-agent saralagan):
15. PmLesson21 s4 — o'ng panel birinchi kun ochilguncha «Kun ochilganda shu yerda yoziladi» yozuvli bo'sh quti.
    Bridge qoidasi bo'yicha ustun bo'sh tursin (panel faqat kun ochilganda chiqsin)mi?
16. PmLesson20 s10 — «✓ Bajarildi» tugmasi va «✅ Suhbat varag'ingiz kodda chiqdi» yashil yozuvi bir ma'no. Yozuv olinsinmi?
    (Shu naqsh boshqa koding-ekranlarida ham bor — «ha» bo'lsa global qilinadi.)
17. PmLesson17 s8 — «Masalan: «Yozilish» tugmasi…» namunasi endi faqat 💡 Yordam ichida (placeholder'ga savol+namuna sig'maydi).
    Ochiq qolsinmi?
18. PmLesson18 s0 — kirish-ekranidagi bo'sh brauzer-satr «🌐 Saytingiz (Netlify)» (104-qonun imzo-sahnasi). Olinsinmi?
19. PmLesson18 s8 — uch bosqich-chipi TaskSpec ro'yxatini takrorlaydi (80a-qonun). Chiplar yoki ro'yxat — qaysi biri qoladi?
20. s12 turidagi «ovoz chiqarib ayting» ekrani (17–25): yakka rejimda taymer qutisida faqat tugma qoldi. Quti ramkasi olinsinmi?
21. `src/compilator/HtmlCompiler.jsx` (umumiy, ko'p dars ishlatadi) — «Shartlarni bajaring — natija o'ngda ko'rinadi»
    joy so'zi. Umumiy faylga tegishdan oldin ruxsat.
22. PmLesson21 s9 — «🟩 odam kelgan kun» rang-kaliti mentorga yaqin, lekin mentor birinchi javobdan keyin yo'qoladi. Qolsinmi?
