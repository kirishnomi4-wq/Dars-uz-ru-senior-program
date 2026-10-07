# 11-Modul 1-dars — fidbek bo'yicha qayta ishlash (F-1006-270, F-1006-272)

> Foydalanuvchi ruxsati: 06.10.2026 ~14:30 — «ha ruxsat beraman, faqat halol sifatli shoshilmasdan tuzatsin». Faqat `src/9-Modull/PmTenIdeasLesson.jsx`.
> MD `01-PmTenIdeas-v3.md` asosiy seans tomonidan YANGILANGAN (6 g'oya, 4-ekran, 1/2/3-ekran matnlari) — avval qayta o'qing. MD ga tegmaysiz; kerak bo'lsa «MD ga taklif».
> Commit, push, deploy — YO'Q. Boshqa agent yubormaysiz. Asosiy seans faylingizga ikkita narsa qo'shgan: `.zoom-on` CSS qoidasi (⛶) va 9-ekran yakka rejim tuzatishlari («Siz yozgan», `yig`, Pair Check! tavsifi) — saqlang.

## O'qing
1. `QURUVCHI_SABOQ.md` — yangi **D qismi (32–39)**. 2. Fidbek rasmlari `rasm/F-1006-270-1dars-01…14.png` (Read bilan, har birini). 3. MD 01 — yangilangan bandlar (`grep -n "F-1006-27" 01-PmTenIdeas-v3.md`). 4. Tayanch 1.1 — endi 6 g'oya.

## Ro'yxat (rasm raqami → nima qilinadi)
| № | Ekran | Foydalanuvchi | Qilinadi |
|---|---|---|---|
| 1 | hamma (0, 4, 8 …) | «tebranish juda oshib ketibdi» (01, 05) | SABOQ 32: halqa pulsatsiyasi ≤3%, ≤0.35, ≥2 s; guruhda bitta halqa. Faylning hamma `ti-tolqin`/halqa joylari. |
| 2 | **6 g'oya (qaror A)** | «10 ta emas 6 ta» (02, 12) | O'quvchi 6, Mentor 6 (tayanch 1.1: 1 Jamoa yig'ish · 2 Maydon pulini bo'lishish · 3 Mahalla to'garaklari · 4 Sinf uy vazifalari · 5 Eski darsliklar · 6 Yo'qolgan buyumlar). `MENTOR_GOYALAR` 6, `S4_QADAM` indekslari, `S4_QOLGAN` → [2, 3], ro'yxatlar «n / 6», ikki ustun × 3, 8-ekran «Davom etish» 6/6 da, «Yana N ta», nishon `sixIdeas` «Six Ideas!», `LESSON_META.lessonTitle` «Oltita g'oyani qayerdan topasiz?» (ru «Где найти шесть идей?»), sarlavhalar, kartochka, arena, RECAP, HW («Nechta: 6 g'oya»), yakun «Oltita g'oyangiz tayyor.», «Keyingi dars — «Oltita g'oyadan qaysi uchtasi qoladi?»». Hamma «o'nta/10» — MD dagidek. |
| 3 | 1 · Reja | «barchasi bo'sh turadimi» (02) | SABOQ 33: oltita qator — Mentor g'oya nomlari, navbat bilan ✓; oxirida bittasi karta-skeletga (MD 1-ekran). |
| 4 | 2 · boshlanishi | «chapdagi 1-holati yoqmadi» (03) | Vaqt chizig'i nuqtalari o'rniga: «Maydon» ilovasi kartasi (telefon o'lchamida) + «Keyin» qutisi, undan «jamoa yig'ish» chipi ko'tarilib karta nomiga uchadi (MD 2-ekran). Qolgan bosqichlar — o'zgarmaydi («qolganlari normal»). |
| 5 | 3 · 1-savol | «9-Modul ro'yxatida bor edi — kerak emas» (04) | Yorliq olib tashlanadi. |
| 6 | 4 · Uch manba | «chap va o'ng vazifasi har xil, vizual his qilmadim» (05) | SABOQ 35: manbadan olingan yozuv chapda belgilanadi, kartadagi to'ldirgan qatori bilan bir xil belgi; uchish chizig'i ko'rinadi. |
| 7 | 4 · 2-qadam | «u yog'iga o'tolmadim» (07) | SABOQ 34: keyingi manba oldingi qadam ✓ dan ≈1 s keyin o'zi ochiladi; qadam chiplari faqat holatni ko'rsatadi. Mentor gapi qadamga mos. |
| 8 | 4 · 9-Modul ro'yxati | «kamaytiraylik» (06) | `MENTOR_ROYXAT9` — 6 qator, «Eski darsliklar…» qoladi (qolganini 9-Modul ro'yxatidan tanlang, «Oshxonada…» qoladi — 3-ekran unga tayanmaydi endi, ixtiyoriy). |
| 9 | 4 · 3-qadam | «animatsiya xunuk» (08) | Yo'lak sahnasi qayta: real o'quvchi (SABOQ 36), e'lon taxtasida bir nechta qog'oz, eng kattasi «Yo'qoldi: sumka», Mentor yozuvi «Tanaffusda ko'rdim»; jonli kirish. |
| 10 | 4 · yakun | «10 ta ham yarashar ekan» (09) | 6 qator, ikki ustun × 3 — ko'rinishi shu holicha (qaror A). |
| 11 | 6 · Starbucks | «odamni real qilsak … jonsiz» (10) · 3-bosqich «zo'r bo'libdi, yoqdi» (11) | SABOQ 36: uchala bosqichdagi odamlar real (soch, yuz, kiyim, stakan/noutbuk), iliq ranglar; 3-bosqich kompozitsiyasi va animatsiyasi saqlanadi. `PmLesson22` `AltairMock` darajasi. |
| 12 | 8 · O'nta → Oltita | «4–6 qilsak to'g'ri» (12) | 2-band. |
| 13 | 10 · Kod | «juda qiyin emasmi … yecholmadimmi» (13, 14) | SABOQ 37: (a) boshlang'ich kod — har yozuv ko'p qatorli obyekt (har kalit alohida qatorda), qatorlar ≤ 70 belgi; (b) shartlar ma'lumotdan mustaqil: 1 — `qatorlar({muammo:"a",kim:"b",yechim:"c"}).join("|")` = `Muammo: a|Kim uchun: b|Yechim: c`; 2 — `qatorlar({…, yechim:""})[2]` = `Yechim: hali yo'q`; 3 — `.goya` soni = `goyalar.length`, har birida 3 `p`; (c) shart yiqilsa — nima yetishmayotgani (shart matni MD dagidek qisqa). Qiyinlik shu darajada qoladi. Node'da sinang: to'g'ri yechim 3/3, foydalanuvchi holati (uchala `yechim` bo'sh) — 1 va 2 shart o'tadi. |
| 14 | hamma | — | SABOQ 38: ⛶ har vizualda bosib sinalsin (asosiy seans qo'shgan qoida bor). |

## Tekshiruv va hisobot
- `npm run gates -- src/9-Modull/PmTenIdeasLesson.jsx` 12/12 · `npm run -s lint:til -- <fayl>` 0 error · `npm run lint:jsx` 0 · `python3 feedback/F-1005-10modul/stilsiz.py <fayl>`.
- **Oldin/keyin:** har bandning rasmdagi holatini qayta yasab «keyin» suratini oling (1280 va 393) — `scratchpad/01-qayta/`; har birini Read bilan ko'ring; har ekran «4/4» (SABOQ 30).
- Hisobot: band — nima qilindi — surat yo'li · darvozalar aynan · MD ga taklif · hal bo'lmagan joy. Turn-byudjeti ≤ 150. Savol bermang.
