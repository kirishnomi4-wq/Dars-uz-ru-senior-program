# Axadullaga — `question_try.answer` ustuni haqida 3 savol · 2026-09-24

Axadulla, salom.

`onFinished` payload'iga bir necha yangi maydon qo'shmoqchimiz: qaytadan o'tish (`retake`), xato qilingan savollar
ro'yxati (`missed`), ekranlar soni, boshlanish/yakun vaqti, sxema raqami (`detailsVersion: 2`). Shakl o'zgarmaydi,
faqat kalitlar qo'shiladi; `passed`, `scorePercent`, `questions[]` avvalgidek halol qoladi.

Hajm hozir ~6,5 KB (18.09 real yuk). Yangi maydonlar bilan ~7 KB; kelajakda matnli maydonlar (uyga vazifa javoblari,
koding kodi) qo'shilsa 20–30 KB gacha oshishi mumkin. Biz tomonda 48 KB shift qo'ydik: oshsa yuk qisqartiriladi va
`truncated: true` belgisi bilan ketadi, o'quvchi hajm sabab xato ko'rmaydi.

Uch savol:
1. `question_try.answer` ustuni turi va maksimal uzunligi qancha?
2. `index.php` so'rov tanasiga chegara bormi (`post_max_size` / nginx `client_max_body_size`)?
3. Staging va prod'da bu ikkisi bir xilmi?

Sinovni staging'dagi 2848 joyida bitta dars (InternetLesson) bilan qilamiz; yuborilgan so'rovning Content-Length'ini
aytamiz — siz saqlangan `answer` uzunligi bilan solishtirsangiz yetadi. O'tsa, qolgan darslarga tarqatamiz.

Rahmat.
