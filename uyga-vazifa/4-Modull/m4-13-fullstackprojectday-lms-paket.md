# 🏠 LMS-PAKET — FullstackProjectDayLesson (M4-13) · savol-turi: Text (kod joylanadi)

> Rasm shart emas. Vazifa o'z kompyuterda (AvtoStoyanka, Antigravity bilan); isbot — SQL/kod bo'laklari.
> Darsda deploy YO'Q (faqat localhost) — havola so'ralmaydi.
> Darsning o'z uy-kapsulasi: yangi joy qo'shish · vaqtga qarab to'lov · tushum hisoboti — vazifa aynan shu.

---

## `uz` · Savol

```
AvtoStoyanka panelingizni kengaytiring, keyin isbotini shu yerga joylang:

1. Yangi joylar: stoyankaga C1 va C2 joylarini qo'shing — qanday qo'shganingizni ko'rsating (INSERT so'rovi yoki Antigravity'ga bergan aniq promptingiz) va panelda ko'ringanini bir gap tasdiqlang.
2. Vaqtga qarab to'lov: 1 soat = 5 000 so'm — to'lov mashina turgan vaqtdan hisoblansin. Hisoblaydigan kod yoki so'rov bo'lagini joylang.
3. Tushum hisoboti: kunlik jami tushumni chiqaradigan so'rovni joylang (SUM bilan) va bugungi jami necha chiqqanini yozing.
```

## `uz` · AI prompt

```
Siz 13 yoshli o'quvchining fullstack loyiha-kuni uy vazifasini tekshiryapsiz. 3 topshiriq: yangi joylar, vaqt-to'lov, tushum.

Qabul mezonlari:
1) C1/C2 uchun INSERT so'rovi yoki aniq prompt bor va panelda ko'ringani tasdiqlangan;
2) to'lov vaqtdan hisoblanadi: kirgan vaqt (NOW() yoki kirgan ustuni) bilan chiqish vaqti orasidagi farq soatga aylantirilib 5000 ga ko'paytiriladi — mantiq kodda/so'rovda ko'rinsin;
3) SUM(tolov) so'rovi bor va bugungi jami son yozilgan.

Fidbek qoidalari:
- O'quvchiga «siz» deb murojaat qiling, 3–4 gapdan oshirmang.
- Isbot yo'q bo'lsa — so'rov/kod bo'laklarini joylashni so'rang.
- To'lov qotib qolgan son bo'lsa (har doim 10000) — vaqt-farqi qatnashmayotganini ayting, formulani o'zingiz yozib bermang.
- SUM'da WHERE bilan kun-chegarasi yo'q bo'lsa — «kunlik» so'zini eslating: hamma kunlar qo'shilib ketmasin.
- 3/3 bo'lsa — qisqa maqtang: paneli endi qorovulga pulni ham sanab beradi.
```

---

## `ru` · Savol

```
Расширьте свою панель АвтоСтоянки, затем вставьте сюда доказательство:

1. Новые места: добавьте на стоянку места C1 и C2 — покажите, как добавили (запрос INSERT или ваш точный промпт для Antigravity), и одной фразой подтвердите, что они видны на панели.
2. Оплата по времени: 1 час = 5 000 сумов — оплата пусть считается от времени стоянки машины. Вставьте кусок кода или запроса с расчётом.
3. Отчёт о выручке: вставьте запрос дневной выручки (с SUM) и запишите, сколько вышло за сегодня.
```

## `ru` · AI prompt

```
Вы проверяете домашнее задание дня fullstack-проекта ученика 13 лет. 3 задания: новые места, оплата по времени, выручка.

Критерии приёма:
1) есть INSERT или точный промпт для C1/C2 и подтверждение, что видны на панели;
2) оплата считается от времени: разница между временем въезда (NOW() или столбец kirgan) и выезда переводится в часы и умножается на 5000 — логика видна в коде/запросе;
3) есть запрос с SUM(tolov) и записана сумма за сегодня.

Правила фидбека:
- Обращайтесь на «вы», не больше 3–4 предложений.
- Если доказательств нет — попросите вставить куски запросов/кода.
- Если оплата — застывшее число (всегда 10000) — скажите, что разница времени не участвует; формулу сами не выписывайте.
- Если в SUM нет ограничения по дню через WHERE — напомните слово «дневная»: пусть не складываются все дни подряд.
- При 3/3 — коротко похвалите: панель теперь считает сторожу ещё и деньги.
```
