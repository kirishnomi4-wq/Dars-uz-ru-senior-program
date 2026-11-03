# F-1102-01 — Learn'dagi CodeStrike savollari: almashadigan 12 qator (02.11.2026)

Manba: dars faylidagi QUIZ_BANK → `codestrike-savollar/lms/…` (`--tekshir` 172/172). Oldingi holat = 28.10 yuklangani (commit 44fadf73 / HEAD~1).
CRM: kurs 20 «AI startup» → bo'lim → Learn (section/<learn id>). Har Learn'da 24 savol: uz 1–12, ru 13–24. Faqat quyidagi tartib raqamlari o'zgaradi, qolgan 9+9 tegilmaydi.

## m3-14 · Learn **3198** «Pre Demo Day: Storytelling test» · bo'lim 74 · Class 2461 · pm-m3d14-v1

| til | tartib | ESKI savol (CRM'da hozir) | YANGI savol | ✔ (0-asos) | fayl |
|---|---|---|---|---|---|
| uz | 10 | Airbnb o'z ishini nima bilan tushuntirgan? | Tugmani bosdingiz, ekranda hech narsa o'zgarmadi. Odam nimani bilmaydi? | 1 — «Ish bajarilganini» | `3198-m3-14-uz.json` |
| uz | 11 | Airbnb taqdimoti nima bilan tugagan? | Qaysi gap ko'rsatuvga yangi narsa qo'shadi? | 0 — ««Ilgari guruhda so'rab yurardik»» | `3198-m3-14-uz.json` |
| uz | 12 | Odam natijani ko'rishi uchun kodda nima kerak? | Tinglovchi «qayerni bosdingiz?» deb so'radi. Bu nimani bildiradi? | 3 — «Harakat aniq aytilmadi» | `3198-m3-14-uz.json` |
| ru | 22 | Чем Airbnb объяснял свою идею? | Вы нажали кнопку, а на экране ничего не изменилось. Чего не узнает человек? | 1 — «Что дело сделано» | `3198-m3-14-ru.json` |
| ru | 23 | Чем закончилась презентация Airbnb? | Какая фраза добавляет к показу новое? | 0 — ««Раньше спрашивали в группе»» | `3198-m3-14-ru.json` |
| ru | 24 | Что нужно в коде, чтобы человек увидел результат? | Слушатель спросил: «а куда вы нажали?». О чём это говорит? | 3 — «Действие названо неточно» | `3198-m3-14-ru.json` |

## m4-15 · Learn **3213** «Guruhda storytelling test» · bo'lim 75 · Class 2477 · pm-m4d15-v1

| til | tartib | ESKI savol (CRM'da hozir) | YANGI savol | ✔ (0-asos) | fayl |
|---|---|---|---|---|---|
| uz | 9 | Airbnb besh qadamida qaysi biri yo'q edi? | «Nega PostgreSQL?» deb so'rashdi. Qaysi javob odamga yetib boradi? | 0 — ««Telefon o'chsa ham joylar saqlanadi»» | `3213-m4-15-uz.json` |
| uz | 10 | Airbnb ishini avval nima bilan tushuntirgan? | Qaysi gap texnik so'zsiz aytilgan? | 2 — ««Bitta joy ikki odamga tushmaydi»» | `3213-m4-15-uz.json` |
| uz | 12 | Ko'rinmas qavat ishlayotganini odam qanday ko'radi? | Tinglovchi «tushunmadim» dedi. Nima qilasiz? | 3 — «Oddiy so'z bilan qayta aytasiz» | `3213-m4-15-uz.json` |
| ru | 21 | Чего не было в пяти шагах Airbnb? | «Почему PostgreSQL?» — спросили вас. Какой ответ дойдёт до человека? | 0 — ««Места сохранятся, даже если телефон выключат»» | `3213-m4-15-ru.json` |
| ru | 22 | Чем Airbnb сначала объяснял свою работу? | Какая фраза сказана без технических слов? | 2 — ««Одно место не достанется двоим»» | `3213-m4-15-ru.json` |
| ru | 24 | Как человек видит, что невидимый этаж работает? | Слушатель сказал: «не понял». Что вы сделаете? | 3 — «Скажете заново простыми словами» | `3213-m4-15-ru.json` |

## Usul (ikki yo'l — CRM tahrir oynasini ko'rib tanlanadi)
- **A. Joyida tahrir** (`editQuestion(qid)`): savol matni, 4 variant, izoh, to'g'ri javob almashadi; qid va tartib saqlanadi (o'quvchi natijalari buzilmaydi). Har qatordan keyin section qayta o'qiladi va matn/variant/javob fayl bilan solishtiriladi.
- **B. O'chirib, qayta yuklash**: 3 savol `deleteQuestion` → Bulk upload (kurs 20 · bo'lim · Learn · til · «Kurs savollari») bilan shu fayldan 3 ta savol (tartib o'sha raqamlar). Qaytarib bo'lmaydi — faqat A ishlamasa va foydalanuvchi roziligi bilan.

Har ikkisida: avval 3198, keyin 3213; har Learn'dan keyin keshsiz qayta o'qish — 24 savol, tartib 1–12/13–24, Active, boshqa 18 savol o'zgarmagan.
