# 6-dars «Bitiruvgacha nimani qachon qurasiz?» — yakuniy matn

Fayl: `src/9-Modull/PmRoadmapLesson.jsx` · 16 ekran · Keyingi dars: «Jonli prototip: qog'ozdan bosiladigan ekrangacha»
Holat: 07.10.2026 — kodga mos

Darsning bitta vizuali — uch ufqli roadmap doskasi va ish kartalari. Mentor misoli (dars bo'yi bir xil, «Maydon Jamoa» PRD sidan oltita ish):

| Ish | qamrov | ta'sir | ishonch | mehnat | RICE | ufq | yorliq |
|---|---|---|---|---|---|---|---|
| O'yin e'loni va qo'shilish | 60 | 3 | 80% | 2 | 72 | Hozir | asosiy funksiya |
| O'yin kuni tasdiq | 60 | 2 | 50% | 1 | 60 | Hozir | asosiy funksiya |
| Chiqish va navbat | 60 | 1 | 80% | 1 | 48 | Hozir | asosiy funksiya |
| O'yindan oldin eslatma | 60 | 1 | 50% | 2 | 15 | Keyinroq | «Keyin» qutisidan |
| Ro'yxat o'zi yangilanadi | 60 | 1 | 50% | 3 | 10 | Keyinroq | «Keyin» qutisidan |
| Maydon pulini bo'lishish | 30 | 1 | 50% | 3 | 5 | Uzoqroq | «Keyin» qutisidan |

- Ish kartasi: nom va yorliq; to'rt katak — qamrov · ta'sir · ishonch · mehnat; o'ngda RICE katagi.
- Formula kartasi: qamrov × ta'sir × ishonch ÷ mehnat = RICE.
- Uch ufqli doska: **Hozir** · 11-Modul (birinchi bo'lib blok «Poydevor» · «RICE ga kirmaydi», keyin uch katak «1-asosiy funksiya · 2-asosiy funksiya · 3-asosiy funksiya») · **Keyinroq** · 12–13-Modul · **Uzoqroq** · bitiruvdan keyin.

## 0 · Kirish
- Eyebrow: Kirish
- Sarlavha: Bitiruvgacha nimani *qachon qurasiz?*
- Mentor: Mentor misolida PRD da oltita ish bor — ularni birdan qurib bo'lmaydi. O'zingizga yaqin javobni belgilang.
- Maket: PRD varag'i — yetti bo'lim: 1 Muammo · 2 Dalil · 3 Kim uchun · 4 Yechim · 5 Uchta asosiy funksiya · 6 Qilmaymiz / keyin · 7 Bosh raqam
  - 5-bo'lim ochiq: O'yin e'loni va qo'shilish · O'yin kuni tasdiq · Chiqish va navbat
  - 6-bo'lim ochiq: Keyin: O'yindan oldin eslatma · Ro'yxat o'zi yangilanadi · Maydon pulini bo'lishish
  - O'ngda chiziq: Bugun ——— Bitiruv (tanlovdan keyin oltita ish nomi «Bugun» uchiga uchib, tartibsiz to'p bo'ladi)
- Variantlar:
  - Eng ko'p odamga kerak ishdan
  - Eng tez quriladigan ishdan
  - Eng katta foyda beradigan ishdan
- Javob (uchalasida bir xil): Uchalasi ham RICE ning bir bo'lagi: qamrov, mehnat va ta'sir. Bugun ular bitta hisobda birlashadi.
- Jonli darsda: variantlar ostida sinf ovozlari chizig'i
- Tugma: Bittasini tanlang → Davom etish

## 1 · Reja
- Eyebrow: Reja
- Sarlavha: Bugun *bitiruvgacha reja* tuzasiz.
- Mentor: O'tgan darsda PRD yozildi. Bugun undagi har ish qachon qurilishini belgilaysiz.
- Chap: Dars oxirida: RICE bo'yicha roadmap — uch ustun-skelet, kulrang kartalar 3 · 2 · 1 bo'lib tushadi (matnsiz)
- Reja:
  1. PRD dagi ishlarni RICE bilan tartiblaysiz · RICE
  2. Har ishni uch ufqdan biriga joylaysiz · ufq
  3. Uzum ishni nimadan boshlaganini ko'rasiz · voqea
  4. O'z ishlaringizdan bitiruvgacha reja tuzasiz · roadmap
- Tugmalar: Orqaga · Boshlaymiz

## 2 · Funksiyalarga RICE
- Eyebrow: Tushuncha · RICE tartibi
- Sarlavha: PRD dagi oltita ishni *RICE qanday tartiblaydi?*
- Mentor: 2-darsda g'oyalarni RICE bilan baholagansiz — endi PRD dagi har ish kartasini bosing.
- Bashorat (yorliq: Avval o'zingiz belgilab ko'ring): Qaysi ish RICE bo'yicha birinchi turadi? · O'yin e'loni va qo'shilish · O'yin kuni tasdiq · Ro'yxat o'zi yangilanadi
  - Tanlangach qator: Qaysi ish RICE bo'yicha birinchi turadi? · Taxminingiz: …
- Chap — telefon maketi «Maydon Jamoa» (ostida yorliq: chizma — hali qurilmagan). Boshida: O'yinlar · Shanba, 18:00 · Mahalla maydoni · 8 / 10 · Shanba, 20:00 · Maktab maydoni · 6 / 10
- O'ng — formula kartasi (yorliq: Mentorning taxmini) va oltita ish kartasi (yuqoridagi jadval sonlari, RICE katagi bo'sh). Ish kartasi bosilganda sonlar formulaga kiradi, RICE sanab chiqadi, karta «RICE bo'yicha tartib» ro'yxatiga o'z o'rniga tushadi, telefon ekrani almashadi:
  1. O'yin e'loni va qo'shilish → O'yinlar · e'lon kartasi 8 / 10, tugma «Qo'shilaman» bosiladi → 9 / 10 · Qo'shildingiz
  2. O'yin kuni tasdiq → Shanba, 18:00 · Mahalla maydoni · tugma «Kelaman» · Kelishini tasdiqladi: 7 / 9
  3. Chiqish va navbat → O'yinlar · Shanba, 18:00 · Mahalla maydoni · 10 / 10 · O'yin to'ldi · tugma «Navbatga yozilish»
  4. O'yindan oldin eslatma → qulf ekrani, bildirishnoma: Maydon Jamoa · Bugun, 18:00 · Mahalla maydoni
  5. Ro'yxat o'zi yangilanadi → O'yinlar · 8 / 10 o'zi 9 / 10 ga o'tadi · ekran ochiq — son o'zi yangilandi
  6. Maydon pulini bo'lishish → Kim to'ladi · to'rt doira, ikkitasida ✓
- Oltitasi bosilgach: RICE bo'yicha tartib 72 · 60 · 48 · 15 · 10 · 5; birinchi uch qator yonida qavs «asosiy funksiyalar»
  - Izoh: Bu misolda RICE tartibi PRD bilan bir xil chiqdi: uchta asosiy funksiya — yuqorida.
- Ipucha (harakatsizlikda): Halqadagi ish kartasini bosing — RICE formulada hisoblanib chiqadi.
- Xulosa: Taxminingiz to'g'ri chiqdi ✓ (yoki: Taxminingiz: … ✕ · haqiqatda: o'yin e'loni va qo'shilish) · Mentor misolida uch funksiyaning qamrovi bir xil — tartibni ta'sir, ishonch va mehnat ajratdi.
- Tugmalar: Orqaga · Ishlarni bosing (N/6) → Davom etish

## 3 · 1-savol
- Eyebrow: Tekshiruv · RICE tartibi
- Savol: Mentor misolida uch funksiyaning qamrovi bir xil. *Tartibni nima ajratadi?*
  - Qamrov: oyiga nechta odam ishlatishi
  - ✔ Ta'sir, ishonch va mehnatdagi farq
  - PRD da qaysi biri oldin yozilgani
  - Qaysi birini qurish qiziqroq ekani
- Javob izohlari:
  - To'g'ri: Qamrov teng bo'lsa, RICE ni qolgan uch bo'lak o'zgartiradi.
  - A: Qamrov uchalasida 60 — u tartibni ajratmaydi.
  - C: PRD dagi o'rni emas, RICE ning bo'laklari ajratadi.
  - D: Qiziqish RICE ga kirmaydi — to'rt bo'lakka qarang.
  - Umumiy: Formula kartasida qaysi sonlar har xil — shuni ko'ring.
- Javob topilgach: uch funksiya kartasi (qamrov katagi kulrang, ta'sir · ishonch · mehnat ajratilgan)

## 4 · Uch ufq
- Eyebrow: Tushuncha · ufq
- Sarlavha: Tartibdagi oltita ish *qaysi ufqqa tushadi?*
- Mentor: Tartibdagi eng yuqori ishni bosing — u o'z ufqiga tushadi va sababi ochiladi.
- Bashorat (yorliq: Avval o'zingiz belgilab ko'ring): To'rtinchi ish — «O'yindan oldin eslatma» — qaysi ufqqa tushadi? · «Hozir» · «Keyinroq» · «Uzoqroq»
- Chap: RICE bo'yicha tartib — olti qator (raqam · nom · RICE)
- O'ng: **8-Moduldan:** Ufq — ishlar qachon boshlanishiga qarab ajratilgan vaqt bo'lagi. Ostida uch ufqli doska.
- Ish bosilganda doskaga tushadi, ostida sabab:
  1. O'yin e'loni va qo'shilish — Tartibda birinchi: poydevordan keyin boshlanadi.
  2. O'yin kuni tasdiq — Qo'shilganlarga tayanadi: ular birinchi funksiyada paydo bo'ladi.
  3. Chiqish va navbat — 11-Modulda funksiya uchun uchta loyiha kuni bor.
  4. O'yindan oldin eslatma — Kutadi: telefonga eslatma yuborish — 12-Modul ishi.
  5. Ro'yxat o'zi yangilanadi — Kutadi: ro'yxat o'zi yangilanishi — 12-Modul ishi.
  6. Maydon pulini bo'lishish — Muammo gapidan kelmaydi: bitiruvgacha ishlar jamoa yig'ishga qaratilgan.
- Oltinchidan keyin «Poydevor» bloki ajraladi, doska ustida yorliq «roadmap»
  - Izoh: Poydevor RICE ga kirmaydi: busiz hech bir funksiya ishlamaydi.
- Ipucha: Chapdagi halqali ishni bosing — u qaysi ufqqa tushishini ko'ring.
- Xulosa: Taxminingiz to'g'ri chiqdi ✓ (yoki: Taxminingiz: … ✕ · haqiqatda: «Keyinroq») · Bitiruvgacha shunday uch ufqli reja roadmap deyiladi: qaysi ish qaysi ufqda turadi.
- Tugmalar: Orqaga · Ishlarni joylang (N/6) → Davom etish

## 5 · 2-savol
- Eyebrow: Tekshiruv · kutadigan ish
- Savol: Ish RICE bo'yicha birinchi, lekin 12-Modulni kutadi. *Qayerga qo'yasiz?*
  - «Hozir»ga: tartibda u birinchi turibdi
  - «Uzoqroq»qa: kutgan ish oxirida turadi
  - ✔ «Keyinroq»qa: 12-Modulda boshlanadi
  - Hech qayerga: roadmap'dan o'chiriladi
- Javob izohlari:
  - To'g'ri: Ish unga kerak narsa tayyor bo'lgan ufqda boshlanadi — unga kerak qism 12-Modulda o'tiladi.
  - A: Tartib birinchi, lekin unga kerak narsa hali yo'q.
  - B: U bitiruvgacha kutmaydi — faqat 12-Modulgacha.
  - D: Kutadigan ish o'chirilmaydi — u keyingi ufqda turadi.
  - Umumiy: Ish nimani kutayotganiga qarang.
- Javob topilgach: kichik doska, «Keyinroq» zonasi ajralgan (ichida eslatma va o'zi yangilanadigan ro'yxat)

## 6 · Uzum
- Eyebrow: Biznes olamidan
- Sarlavha: Uzum ishni telefon ekranidan *boshlaganmi?*
- Yorliq: Uzum · N/3 (nuqtalar)
- 1/3 **Bungacha**
  - Mentor: Uzum — narsani telefonda tanlasangiz, yetkazib beradigan internet-magazin. Bungacha odamlar ko'pincha Instagram va Telegram guruhlari orqali xarid qilgan.
  - Sahna: telefonda guruh-chat, yorliq «guruh orqali xarid»
  - Bashorat (yorliq: Uzum · 1/3): Uzum boshida buyurtmani qachon yetkazgan? · ✔ Ertasi kuni · Uch kunda · Bir haftada
- 2/3 **2022-yil oktabr · ishga tushdi**
  - Mentor: Uzum 2022-yil oktabrda ishga tushgan. U saytdan emas, yetkazib berishdan boshlagan: o'z mashinalari, topshirish punktlari va ertasi kuni yetkazish.
  - Sahna: Uzum ilovasi, mashina topshirish punktiga boradi; chiziq «bugun → ertaga»
- 3/3 **Ekranda ko'rinmaydigan qism**
  - Mentor: Xaridor telefonda faqat ekranni ko'radi. Mashina va topshirish punkti ekranda yo'q, lekin buyurtma ular orqali yetib keladi.
  - Sahna: telefonda «buyurtma» tugmasi; yorliqlar «ekranda» va «ekranda ko'rinmaydi» (mashina → topshirish punkti → qutili odam)
- Xulosa: Taxminingiz to'g'ri chiqdi ✓ (yoki: Taxminingiz: … ✕ · haqiqatda: ertasi kuni) · Uzum ishni saytdan emas, yetkazib berishdan boshlagan — bu qism ekranda ko'rinmaydi.
- Tugmalar: Orqaga · Keyingi bosqich (N/3) → Davom etish

## 7 · 3-savol
- Eyebrow: Tekshiruv · Uzum va roadmap
- Savol: Uzum saytdan emas, yetkazib berishdan boshlagan. *Mentor «Hozir»ni nimadan boshlaydi?*
  - RICE bo'yicha eng yuqori funksiyadan
  - Ekranda eng ko'p ko'rinadigan qismdan
  - Mehnati eng kichik bo'lgan ishdan
  - ✔ Har funksiya tayanadigan poydevordan
- Javob izohlari:
  - To'g'ri: Poydevor RICE ga kirmaydi va birinchi turadi: busiz hech bir funksiya ishlamaydi.
  - A: Bu funksiya poydevordan keyin boshlanadi.
  - B: Ko'rinish emas — boshqa ishlar nimaga tayanadi?
  - C: Mehnat RICE bo'lagi, poydevor esa RICE ga kirmaydi.
  - Umumiy: Uzum ham ko'rinmaydigan qismdan boshlagan.
- Javob topilgach: doskaning «Hozir» zonasi — «Poydevor» bloki uch funksiya katagiga chiziqlar bilan ulangan

## 8 · Ishlaringizga RICE
- Eyebrow: Mustaqil ish
- Sarlavha: PRD dagi har ishga *RICE ni hisoblang.*
- Mentor: Har kartada qamrov va mehnatni yozing, ta'sir va ishonchni tanlang — RICE o'zi chiqadi.
- Tepada: Ishlarim · RICE bo'yicha tartib · n / N (saqlanganlar qator bo'lib: raqam · nom · RICE · ✎)
- Ish kartasi (PRD dagi ishlar birma-bir; yorliq «asosiy funksiya» yoki «Keyin» qutisidan):
  - PRD topilmasa: PRD topilmadi — ishlaringizni o'zingiz yozing.
  - Ish nomi (placeholder: Ish nomi)
  - Qamrov — placeholder: Oyiga nechta odam? · ostida (2-dars ma'lumoti bo'lsa): 2-darsda g'oyalaringiz qamrovi: …
  - Ta'sir — 3 · 2 · 1 · 0,5 · 0,25 (juda katta · katta · o'rta · kichik · juda kichik)
  - Ishonch — 100% · 80% · 50%
  - Mehnat — placeholder: Necha hafta?
  - Formula kartasi: qamrov × ta'sir × ishonch ÷ mehnat = RICE
  - Tugmalar: Yordam · + Yana ish qo'shish · Saqlash
- Tekshiruv xabarlari:
  - Qamrov va mehnatni son bilan yozing.
  - Ta'sir va ishonchni tanlang.
  - Bu kursda 100% — o'lchangan raqam uchun. Dalilingiz bormi?
  - Bu modulda bitta ishga 6 haftadan ko'p — bo'lsa bo'ladimi?
  - Shunday qoldirsangiz — yana «Saqlash»ni bosing.
- Yordam (tugma ostida):
  - Qamrov — funksiyani bir oyda nechta odam ishlatadi. Ta'sir — taxmin: funksiya bitta odamning muammosini qanchalik yengillashtiradi. Ishonch — raqamlaringizga qanchalik ishonasiz: dalil qancha kam bo'lsa, shuncha past.
  - Mehnat — bitta odam uni necha haftada quradi. Bir mahsulotning funksiyalarida qamrov yaqin bo'lishi mumkin — Mentor misolida uchalasida 60.
- Hammasi saqlangach:
  - Xulosa: Tartibingiz tayyor: birinchi — «{nom}», oxirgi — «{nom}».
  - «Keyin»dagi ish asosiy funksiyadan yuqori bo'lsa: «{nom}» «Keyin» qutisidan, lekin RICE bo'yicha asosiy funksiyadan yuqori.
  - Tugma: + Yana ish qo'shish (6 tagacha)
- Tugmalar: Orqaga · Yana N ta ishga RICE → Davom etish

## 9 · Bir ishga ikki RICE
- Eyebrow: Juftlikda ish (yakka rejimda: Mustaqil ish)
- Sarlavha: Sherigingiz bir ishga *sizdek RICE beradimi?* (yakka rejimda: Mentorning bir ishiga *qanday RICE berasiz?*)
- Mentor: Bitta ishingizni tanlang: uning ta'siri va ishonchini sherigingiz o'zi belgilaydi.
  - Yakka rejimda: Mentorning raqamlari yopiq: «O'yin kuni tasdiq»ga ta'sir va ishonchni o'zingiz belgilang.
- Qadamlar: 1 Ishni tanlang · 2 Sherigingiz belgilaydi · 3 Solishtiring (yakka: 1 Ishni o'qing · 2 Belgilang · 3 Solishtiring)
- Juftlikda: Ishlarim ro'yxatidan bitta ish tanlanadi → katta karta: nom, qamrov, mehnat; uch katak «yopiq»
  - Ishni sherigingizga bir gap bilan tushuntiring.
- Yakka rejimda: karta «O'yin kuni tasdiq» · Mentor misoli — qamrov 60 · mehnat 1 · uch katak «yopiq»
- Tanlov (yorliq: Sherigingiz, yakkada: Siz): Ta'sir — 3 · 2 · 1 · 0,5 · 0,25 (juda katta · katta · o'rta · kichik · juda kichik) · Ishonch — 100% · 80% · 50% · Saqlash → Ochish
- Solishtirish: Siz — ta'sir · ishonch · RICE | Sherigingiz (yakkada: Mentor) — ta'sir · ishonch · RICE; farq qilgan katak ajraladi
  - Xulosa: Baholaringiz bir xil chiqdi; baribir RICE — taxmin. (yoki) Bir ishga ikki xil RICE chiqdi: qaysi bo'lakda farq bor — dalilga qayting.
  - Tugma: ✎ Raqamni tuzatish (ochilganda: Ta'sir · Ishonch · Saqlash)
- Tugmalar: Orqaga · Solishtiring → Davom etish

## 10 · Uch ufqqa joylash
- Eyebrow: Mustaqil ish · roadmap
- Sarlavha: Ishlaringizni *uch ufqqa joylang.*
- Mentor: RICE bo'yicha yuqoridagi ishdan boshlang va har biriga savol bering: u nimani kutadi?
- 8-ekranda ish bo'lmasa: Avval 9-ekranda ishlaringizga RICE ni hisoblang. (doska bo'sh)
- Tepada — uch ufqli doska (Poydevor · RICE ga kirmaydi; 1-, 2-, 3-asosiy funksiya kataklari; «Hozir»dagi kartalar yonida ↑ ↓)
- Joriy ish kartasi: raqam · nom · RICE · uch tugma: Hozir · 11-Modul · Keyinroq · 12–13-Modul · Uzoqroq · bitiruvdan keyin
- Tekshiruv xabarlari:
  - Bu modulda «Hozir»da uchta ish — har loyiha kuniga bitta.
  - Tartibda yuqoriroq ish uzoqroqda qoldi — u nimani kutadi?
  - Bu PRD dagi asosiy funksiya — nega keyinga qoldi? (ostida maydon «Sabab»)
  - Bu ish PRD dagi uchtasidan emas — PRD ni ham yangilang. (ostida maydon «Sabab»)
  - Bu modulda uchta loyiha kuni — «Hozir»ga uchta ish qo'ying.
  - Shunday qoldirsangiz — yana bosing.
- Yordam (tugma ostida): Ikki savol bering: ish RICE bo'yicha nechanchi? Unga kerak narsa 11-Modulda tayyor bo'ladimi? Bir funksiya boshqasiga tayansa — undan keyin turadi (Mentor misolida tasdiq qo'shilishdan keyin).
- Saqlangach: Roadmap'ingiz tayyor: «Hozir»da 3, «Keyinroq»da 2, «Uzoqroq»da 1 ta ish. (0 bo'lgan bo'lak tushib qoladi) · tepada qator «Roadmap'im» (ufqlardagi sonlar)
- Tugmalar: Orqaga · Ishlarni joylang (n/N) → Saqlash → Davom etish

## 11 · Kod yozish
- Eyebrow: Kod yozish
- Sarlavha: Ishlarni ufqlarga ajratadigan *kod yozamiz.*
- Mentor: Mentorning oltita ishi kodda ro'yxat bo'lib turibdi: har birini o'z ufqi ustuniga chiqaring.
- Qator «Roadmap'im» (10-ekranda saqlangan bo'lsa)
- Chap (vazifa):
  - Savol: `kutadi: "12-Modul"` yozilgan ish qaysi ustunga tushadi? · `"hozir"` · ✔ `"keyinroq"` · `"uzoqroq"`
    - `"hozir"`: Unga kerak narsa 12-Modulda — «Hozir»ga tushmaydi.
    - `"uzoqroq"`: U bitiruvgacha kutmaydi — 12-Modulda boshlanadi.
  - Vazifa:
    1. 12-Modulni kutadigan ish — `"keyinroq"`
    2. «Hozir»da uchtadan kam bo'lsa — `"hozir"`
    3. Qolgani — `"uzoqroq"`
  - Yordam (tugma):
    - Avval kutishni tekshiring: `if (ish.kutadi === "12-Modul") return "keyinroq";`. So'ng «Hozir» sonini: `hozirSoni < 3`. Qolgan holatda — `return "uzoqroq";`.
    - Eslatma (JavaScript darslaridan): `sort` — ro'yxatni tartiblaydi (`b.rice - a.rice` — kattasi oldinda) · `return` — funksiya javobini qaytaradi · `if` — shart rost bo'lsa ishlaydi.
- O'ng — kod namunasi:
```js
// Mentor misoli: oltita ish va RICE;
// kutadi — ish 12-Modulni kutadi
const ishlar = [
  { nom: "Maydon pulini bo'lishish", rice: 5 },
  { nom: "O'yin kuni tasdiq", rice: 60 },
  { nom: "O'yindan oldin eslatma", rice: 15,
    kutadi: "12-Modul" },
  { nom: "O'yin e'loni va qo'shilish", rice: 72 },
  { nom: "Ro'yxat o'zi yangilanadi", rice: 10,
    kutadi: "12-Modul" },
  { nom: "Chiqish va navbat", rice: 48 }
];
  …
function ufq(ish, hozirSoni) {
  // ish qaysi ustunga tushadi:
  // "hozir", "keyinroq" yoki "uzoqroq"
  // hozirSoni — «Hozir» ustuniga allaqachon
  // tushgan ishlar soni
  // boshida hamma ish shu yerda — shu joyni siz yozasiz
  return "uzoqroq";
}
```
- Mentor (tugma ustida): Tugmani bosing — kod oynasi ochiladi: kodni yozasiz va natijasini shu yerda ko'rasiz.
- Tugma: Kompilyatorni ochish
- Kod oynasi: `app.js — ufq funksiyasini yakunlang`
```js
// Mentor misoli: oltita ish va RICE;
// kutadi — ish 12-Modulni kutadi
const ishlar = [
  { nom: "Maydon pulini bo'lishish", rice: 5 },
  { nom: "O'yin kuni tasdiq", rice: 60 },
  { nom: "O'yindan oldin eslatma", rice: 15,
    kutadi: "12-Modul" },
  { nom: "O'yin e'loni va qo'shilish", rice: 72 },
  { nom: "Ro'yxat o'zi yangilanadi", rice: 10,
    kutadi: "12-Modul" },
  { nom: "Chiqish va navbat", rice: 48 }
];

// RICE bo'yicha tartib: kattasi oldinda
// (bu qator tayyor)
ishlar.sort(function (a, b) { return b.rice - a.rice; });

function ufq(ish, hozirSoni) {
  // ish qaysi ustunga tushadi:
  // "hozir", "keyinroq" yoki "uzoqroq"
  // hozirSoni — «Hozir» ustuniga allaqachon
  // tushgan ishlar soni
  // boshida hamma ish shu yerda — shu joyni siz yozasiz
  return "uzoqroq";
}

// har ish — o'z ustunida (bu qism tayyor)
let hozirSoni = 0;
ishlar.forEach(function (ish) {
  const u = ufq(ish, hozirSoni);
  if (u === "hozir") hozirSoni = hozirSoni + 1;
  const p = document.createElement("p");
  p.textContent = ish.nom + " · " + ish.rice;
  document.getElementById(u).appendChild(p);
});
```
  - `index.html` (tayyor): sarlavha «Mentorning roadmap'i» · uch ustun: Hozir · 11-Modul (ichida «Poydevor · RICE ga kirmaydi») · Keyinroq · 12–13-Modul · Uzoqroq · bitiruvdan keyin
  - Shartlar: 12-Modulni kutadigan ish — "keyinroq" · «Hozir»da uchtadan kam bo'lsa — "hozir" · Qolgani — "uzoqroq"
  - Shart xabarlari: 12-Modulni kutadigan ish «Keyinroq»ga tushsin. · «Hozir»ga uchta ish, to'rtinchisi «Uzoqroq»ga. · Ustunlarda 3, 2 va 1 ta ish bo'lsin.
- Bajarilgach: Kod ishlarni tartib va kutishga qarab uch ustunga ajratdi — Mentor doskasidagidek.
- Tugmalar: Orqaga · Javobni tanlang → Kodni yozing → Davom etish

## 12 · Yakuniy savol
- Eyebrow: Yakuniy tekshiruv
- Savol: PRD da yo'q yangi ish RICE da birinchi chiqdi. *Avval nima qilasiz?*
  - ✔ Avval PRD dagi uchta funksiyani qayta ko'raman
  - Uni «Hozir»ga to'rtinchi ish qilib qo'shaman
  - Uni o'chiraman — PRD da yo'q ish kerak emas
  - Eng pastdagisini surib, uni «Hozir»ga qo'yaman
- Javob izohlari:
  - To'g'ri: Roadmap PRD dan ajralmaydi: uchta asosiy funksiya o'zgarsa, PRD ham yangilanadi.
  - B: Bu modulda «Hozir»ga uchta ish sig'adi.
  - C: Yuqori RICE — o'chirishga emas, o'ylashga sabab.
  - D: Surish mumkin, lekin avval PRD qayta ko'riladi.
  - Umumiy: Roadmap'dagi uchta funksiya qaysi hujjatdan keladi?
- Javob topilgach: yonma-yon PRD (5-bo'lim «Uchta asosiy funksiya») va doskaning «Hozir» zonasi, orasida ikki tomonlama chiziq

## 13 · Natijalar (podium) — jonli reyting
Natijalar (podium) — jonli reyting

## 14 · Kartochkalar
- Eyebrow: Takrorlash
- Sarlavha: O'zingizni *sinab ko'ring*.
- Birinchi bosishgacha: Kartani bosing — javob ochiladi

| Old tomon | Orqa tomon |
|---|---|
| Roadmap nima? | Qaysi ish qaysi ufqda turishini ko'rsatadigan reja; bizda — bitiruvgacha uch ufq |
| Ufq nima? | Ishlar qachon boshlanishiga qarab ajratilgan vaqt bo'lagi |
| Bu modulda uchta ufq qaysilar? | «Hozir» — 11-Modul, «Keyinroq» — 12–13-Modul, «Uzoqroq» — bitiruvdan keyin |
| RICE qanday hisoblanib chiqadi? | Qamrovni ta'sirga va ishonchga ko'paytirib, mehnatga bo'lasiz |
| Bu kursda mehnat nima bilan o'lchanadi? | Bitta odam necha hafta ishlashi bilan |
| Funksiyalarning qamrovi teng bo'lsa, tartibni nima ajratadi? | Ta'sir, ishonch va mehnat |
| Nega poydevor RICE ga kirmaydi? | Busiz hech bir funksiya ishlamaydi — u har funksiyadan oldin turadi |
| RICE bo'yicha yuqori ish 12-Modulni kutsa, qayerga tushadi? | «Keyinroq»qa: unga kerak narsa 12-Modulda tayyor bo'ladi |
| Bu modulda «Hozir» ufqiga nechta funksiya sig'adi? | Uchta: 11-Modulda funksiya uchun uchta loyiha kuni bor |
| Bir funksiya boshqasiga tayansa, qaysi biri oldin quriladi? | Boshqasi tayanadigan funksiya: Mentor misolida qo'shilish tasdiqdan oldin |
| Uzum ishni nimadan boshlagan? | Saytdan emas, yetkazib berishdan: o'z mashinalari, topshirish punktlari va ertasi kuni yetkazish |
| Bir ishga ikki odam har xil RICE bersa, bu nimani bildiradi? | RICE — taxmin: farq qilgan bo'lakda dalilga qaytiladi |

- Tugmalar: O'rganilmoqda · N · Bildim · N · karta ag'darilgach: Takrorlash · Bildim
- Oxirida: Hammasini bilasiz! · 12/12 atama yodlandi · Qaytadan takrorlash
- Tugmalar: Orqaga · Yakunlash →

## 15 · Dars yakuni
- Eyebrow: Dars yakuni
- Belgi: ✓ Dars tugadi · N/4 to'g'ri
- Sarlavha: Roadmap'ingiz *tayyor*. (10-ekranda saqlanmagan bo'lsa: Roadmap boshlandi — *qolgani uyda*.)
- Bugungi asosiy fikr: RICE ishlar tartibini ko'rsatadi, ish esa unga kerak narsa tayyor bo'lgan ufqda boshlanadi.
- Qator «Roadmap'im» (saqlangan bo'lsa)
- CODE STRIKE arenasi: 12 SAVOL · 15 SONIYA · PODIUM (jonli darsda mentor boshlaguncha: Mentorni kuting)
- ✓ Endi siz bilasiz:
  - Roadmap — qaysi ish qaysi ufqda turishini ko'rsatadigan reja; bizda — bitiruvgacha uch ufq.
  - Qamrov teng bo'lsa, tartibni ta'sir, ishonch va mehnat ajratadi.
  - Poydevor RICE ga kirmaydi: busiz hech bir funksiya ishlamaydi.
  - Bu modulda «Hozir» ufqiga uchta funksiya sig'adi — har loyiha kuniga bittadan.
  - Uzum ishni saytdan emas, yetkazib berishdan boshlagan.
- Uyga vazifa · Amaliy topshiriqni bajarish → (ochilganda karta):
  - Uyda nima qilasiz?
  - Kim bilan: auditoriyadan bir kishi · Nechta: 3 funksiya · Muddat: keyingi darsgacha
  - ① «Hozir» ufqidagi uchta funksiyani auditoriyangizdan bir kishiga ayting va so'rang: «Qaysi biri sizga birinchi kerak?»
  - ② Javobini yozib oling. Tartibingizdan farq qilsa, «Nega?» deb so'rang — RICE ni faqat yangi dalil chiqsa tahrirlang (✎).
  - ③ «Hozir»dagi uchta funksiyani o'qing: qaysi biri boshqasiga tayanadi? Tartib shunga mos kelmasa, ↑ ↓ bilan almashtiring.
  - Keyingi dars — **«Jonli prototip: qog'ozdan bosiladigan ekrangacha»**
- Nishonlaringiz — N/4 (to'rtta nishon nomi va tavsifi — «Nishonlar» bo'limida)
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓

## Nishonlar
- **RICE Ranker!** — Ishlaringizni RICE bo'yicha tartibladingiz (8-ekran)
- **Pair Score!** — Bir ishga sherigingiz bilan RICE solishtirdingiz (9-ekran)
- **Roadmap Ready!** — Ishlaringizni uch ufqqa joyladingiz (10-ekran)
- **Horizon Coder!** — Ishlarni kod bilan ufqlarga ajratdingiz (11-ekran)
- Yuqoridagi hisoblagich: Nishonlar — N/4
- Nishon olinganda: nomi, tavsifi va «bosib davom eting»

## Qisqa takrorlash oynalari
Xato javobdan keyin o'quvchi «Qisqa takrorlash — mavzuni yana bir ko'rish» bilan ochadi; jonli darsda Mentor ekranidan. Yorliq: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · oxirgi kartada: ✓ Tushunarli — davom etamiz · Yopish

1. 3-ekran (1-savol) — **Qamrov teng bo'lsa**
   - 1 · RICE: qamrovni ta'sirga va ishonchga ko'paytirib, mehnatga bo'lasiz.
   - 2 · Mentor misolida uch funksiyaning qamrovi — 60.
   - 3 · Qamrov teng bo'lsa, tartibni ta'sir, ishonch va mehnat ajratadi.
   - Sinfga savol: Sizning funksiyalaringizda qaysi bo'lak eng ko'p farq qiladi?
2. 5-ekran (2-savol) — **Kutadigan ish**
   - 1 · Ufq — ishlar qachon boshlanishiga qarab ajratilgan vaqt bo'lagi.
   - 2 · RICE tartibni ko'rsatadi, ish esa unga kerak narsa tayyor bo'lganda boshlanadi.
   - 3 · Eslatma va o'zi yangilanadigan ro'yxat 12-Modulni kutadi — ular «Keyinroq»da.
   - Sinfga savol: Roadmap'ingizdagi qaysi ish nimanidir kutadi?
3. 7-ekran (3-savol) — **Uzum va poydevor**
   - 1 · Uzum 2022-yil oktabrda saytdan emas, yetkazib berishdan boshlagan.
   - 2 · Mashina va topshirish punkti ekranda yo'q, lekin buyurtma ular orqali yetib keladi.
   - 3 · Mentor rejasida «Hozir» poydevordan boshlanadi: busiz hech bir funksiya ishlamaydi.
   - Sinfga savol: Sizning mahsulotingizda ekranda ko'rinmaydigan qaysi qism kerak?
4. 12-ekran (yakuniy savol) — **PRD va roadmap**
   - 1 · Bu modulda «Hozir»ga uchta funksiya sig'adi: 11-Modulda uchta loyiha kuni.
   - 2 · «Hozir»dagi uchta funksiya PRD dan keladi.
   - 3 · Yangi ish yuqori chiqsa — avval PRD qayta ko'riladi, so'ng roadmap.
   - Sinfga savol: Roadmap'ingizga yangi ish qo'shilsa, PRD ning qaysi bo'limi o'zgaradi?

## Jonli viktorina (12 savol)
Arena: CODE STRIKE · 12 SAVOL · 15 SONIYA · PODIUM · «Tezroq to'g'ri bossangiz — ko'proq ball. Ketma-ket to'g'ri javoblar bonus beradi!» · «Mentor testni boshlashini kuting…» · «Javob qabul qilindi — natijani kuting…» · «Adashdingiz — 0 ball. Keyingisida olasiz!» · «Vaqt tugadi — 0 ball. Tezroq bo'ling!» · «Test yakunlandi!» · Qayta ishlash

1. RICE hisobida qamrov nimani bildiradi?
    - ✔ Oyiga nechta odamga yetib borishini
    - Bitta odamga qancha foyda berishini
    - Qurishga necha hafta vaqt ketishini
    - Taxminga qanchalik ishonishingizni
2. Bu kursda RICE ning mehnati nima bilan o'lchanadi?
    - Butun guruh necha oy ishlashi bilan
    - Kodda nechta qator yozilishi bilan
    - ✔ Bitta odam necha hafta ishlashi bilan
    - Nechta ekran chizilishi kerakligi bilan
3. Ikki funksiyada faqat mehnat farq qiladi. Qaysi biri tartibda yuqori?
    - Mehnati ko'proq bo'lgan funksiya
    - ✔ Mehnati kamroq bo'lgan funksiya
    - PRD da birinchi yozilgan funksiya
    - Ko'proq ko'rinadigan funksiya
4. Ish «Keyinroq» ufqida turibdi. Bu nimani bildiradi?
    - 12–13-Modul bo'yi qilinishini
    - 12–13-Modulda tugab bo'lishini
    - Bitiruvdan keyin boshlanishini
    - ✔ 12–13-Modulda boshlanishini
5. Nega poydevor RICE ga kirmaydi?
    - ✔ Busiz hech bir funksiya ishlamaydi
    - Uni qurish hammadan tez va oson
    - Uni foydalanuvchi ekranda ko'rmaydi
    - U PRD dagi birinchi bo'limda turadi
6. O'yin kuni tasdiq qo'shilganlarga tayanadi. U qachon quriladi?
    - Qo'shilish funksiyasidan oldin
    - Qo'shilish bilan bir vaqtda
    - Bitiruvdan keyin, oxirgi bo'lib
    - ✔ Qo'shilish funksiyasidan keyin
7. «Hozir» ufqiga 11-Modulda nechta funksiya sig'adi?
    - Ikkita: qolgani keyingi modulda
    - ✔ Uchta: har loyiha kuniga bitta
    - Oltita: PRD dagi hamma ishlar
    - To'rtta: poydevor bilan birga
8. Uzum'da xaridor telefon ekranida nimani ko'rmaydi?
    - Narsalar ro'yxati va narxini
    - Narsalarning surati va nomini
    - ✔ Mashina va topshirish punktini
    - Do'kon nomi va qidiruv qatorini
9. Uzum'dagidek, rejaning birinchi ishi qanday bo'lishi mumkin?
    - Ekranda eng chiroyli ko'rinadigan qism
    - Reklamada eng ko'p ko'rsatiladigan qism
    - Eng tez va eng oson quriladigan qism
    - ✔ Ekranda ko'rinmasa ham kerakli qism
10. Sherigingiz bir ishga boshqacha RICE berdi. Bu nimani bildiradi?
    - ✔ RICE taxmin ekanini va dalil kerakligini
    - Sherigingiz RICE formulasini bilmasligini
    - Ishni roadmap'dan o'chirish kerakligini
    - Sizning raqamingiz baribir to'g'ri ekanini
11. Roadmap'da har ish haqida nima ko'rinadi?
    - Uni sinfdagi qaysi o'quvchi qurishi
    - Unga qancha pul sarflanishi kerakligi
    - ✔ U qaysi ufqda va qaysi o'rinda turishi
    - Unda necha qator kod yozilishi kerakligi
12. «Uzoqroq» ufqidagi ish bilan bitiruvgacha nima bo'ladi?
    - «Hozir»dagi ishlar bilan birga quriladi
    - ✔ Bitiruvdan keyin boshlanishini kutadi
    - Roadmap'dan butunlay o'chirib tashlanadi
    - 12-Modulda birinchi bo'lib boshlanadi

## Kartochkalar
14-ekrandagi jadval (12 ta karta).

## Yakun
- Endi siz bilasiz — 15-ekrandagi 5 qator.
- Bugungi asosiy fikr: RICE ishlar tartibini ko'rsatadi, ish esa unga kerak narsa tayyor bo'lgan ufqda boshlanadi.
- Keyingi dars — «Jonli prototip: qog'ozdan bosiladigan ekrangacha».
