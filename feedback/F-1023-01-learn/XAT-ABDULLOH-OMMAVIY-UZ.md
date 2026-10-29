# CodeStrike → Learn: ommaviy yuklashdan oldingi ma'lumotlar (27.10.2026)

Salom, Abdulloh!

Javobingiz uchun rahmat. So'ragan uchta bandni tayyorladik.

## 1. Yangilanadigan fayllar va SHA-256

Ilova: `SHA256-172.csv` — 172 JSX fayl (2–14-Modul). Har qatorda: modul, tartib, `lesson_id`, fayl nomi, hajmi (bayt), SHA-256, CRM'dagi uz/ru material id.

Barcha fayllar bitta yig'madan chiqqan: siz sinagan v2 kod (CodeStrike + BUG-01 tuzatishi) va shundan keyingi dars tuzatishlari.

Tekshiruv: yangi yig'madagi Internet darsi siz sinagan fayl bilan **baytma-bayt bir xil**:

```text
01-InternetLesson   490 810 bayt   SHA-256 ba2268cfcac0ccc5a230d46d9fecc539b6c022992ed67c8ceb7a09f036a30627
```

Demak qolgan 171 darsga ham aynan siz sinagan CodeStrike mantig'i boradi.

Eslatma: CRM'dagi fayl nomidagi versiya raqami (`-v5`, `-v6`) yuklash kuniga qarab bittaga oshishi mumkin. Faylni SHA-256 aniqlaydi, nom emas.

## 2. Class → Learn mosligi va tartib

Ilova: `CLASS-LEARN.md` (o'qish uchun) va `CLASS-LEARN.csv` (to'liq). CRM bugun o'qildi, hech narsa o'zgartirilmadi.

- 13 modulda 181 ta faol Class/Demoday bor. Ulardan 172 tasida JSX dars bor, har biri o'z Class'iga aniq mos keldi.
- **Learn'siz holatlar** — JSX yo'q, Learn ham kerak emas (9 ta): Demoday 2759, 2760, 2788, 2847, 2982, 3022, 3061 va 14-Moduldagi tadbirlar 3060, 3062.
- Bugun Class'dan keyingi birinchi faol dars: uyga vazifa — 82 holatda, boshqa Class — 81, Demoday — 5, modul oxiri — 4. Ya'ni hozir hech bir Class'dan keyin faol Learn yo'q.
- Har Class uchun Learn qaysi `order` bilan qo'yilishini jadvalda yozdik («Learn tartibi (reja)»). Bu raqam Class'dan katta va keyingi faol darsdan kichik, shuning uchun backend aynan Learn'ni oladi. Joy yetmaydigan holat yo'q.
- Mavjud Learn: faqat 3148 (2-Modul, `order` 12, Class 2374 dan keyin, **Draft**).

**Savol:** sizning qoidangizda «faol dars» — CRM'dagi **Active** holatmi? Agar shunday bo'lsa, Draft holatdagi Learn hisobga olinmaydi va CodeStrike uni yashira olmaydi. Unda Learn'lar Active bo'lgandan keyingina mexanizm ishlaydi.

## 3. Preview logikasi saqlangan

Ha. Preview rejimi (21–23.10 dagi tuzatish bilan) umumiy modulda turadi va har dars yig'masiga kiradi. 172 faylning har biri alohida tekshirildi:

| Tekshiruv | Natija |
|---|---|
| Oddiy rejimda dars-api so'rovlari bor | 172/172 |
| Preview rejimida dars-api so'rovi 0 | 172/172 |
| Preview'da «Oldindan ko'rish» belgisi | 172/172 |
| Preview'da PIN oynasi yo'q | 172/172 |

Siz sinagan v2 fayl ham shu preview logikasi bilan yig'ilgan edi. Yangi yig'mada u o'zgarmagan.

## Podium bonusi haqida

`codestrike.podium` (game_id, place, finalized) hozircha yuborilmaydi. Bu ommaviy yuklashga kirmaydi; mukofotlar prod'ga tayyor bo'lganda alohida qo'shamiz.

Savollar JSON'ini CRM'ga o'zimiz yuklaymiz.

Hurmat bilan
