# 🏠 LMS-PAKET — ReactRouterPracticeLesson (M3-11) · savol-turi: Text (kod joylanadi)

> Rasm shart emas. Vazifa o'z kompyuterda (VS Code, Antigravity bilan); isbot — App.jsx kodi + sahifalar ro'yxati.
> Darsning o'z uy-kapsulasi: sahifalar ro'yxati · AI bilan qurish · Link/:id tekshiruvi — vazifa aynan shu.

---

## `uz` · Savol

```
O'z loyihangizni ko'p sahifali qiling, keyin isbotini shu yerga joylang:

1. Sahifalar ro'yxati: loyihangiz uchun 3–4 sahifani yozing (manzili + nomi, masalan: / — Bosh).
2. AI bilan quring: Antigravity'ga Router o'rnatib, sahifalar va menyuni qurishni buyuring.
3. Tekshiring: menyudagi hamma havola <Link>mi (a href emas), bitta sahifada /:id parametri bormi?

Javob sifatida:
— sahifalar ro'yxatingiz (manzil + nom)
— App.jsx (Route'lar turgan fayl) kodini TO'LIQ ko'chirib joylang
— bitta gap: <Link> bosilganda oddiy havoladan farqi nimada ko'rindi?
```

## `uz` · AI prompt

```
Siz 13 yoshli o'quvchining React Router uy vazifasini tekshiryapsiz. Javobda sahifalar ro'yxati, App.jsx kodi va bitta gap bo'lishi kerak.

Qabul mezonlari:
1) 3–4 sahifa ro'yxati bor: har birida manzil va nom;
2) kodda kamida 3 ta <Route path element /> bor va ro'yxatga mos;
3) menyu <Link> bilan qurilgan — a href emas; kamida bitta Route'da /:id parametri bor;
4) bitta gapda farq to'g'ri aytilgan: <Link> sahifani qayta yuklamaydi (oq miltillash yo'q).

Fidbek qoidalari:
- O'quvchiga «siz» deb murojaat qiling, 3–4 gapdan oshirmang.
- Kod yo'q bo'lsa — kod joylashni so'rang.
- a href ko'rinsa — darsdagi farqni eslating: a href butun sahifani qayta yuklaydi, <Link> faqat kerakli joyni almashtiradi.
- :id yo'q bo'lsa — bo'sh katak o'xshatishini eslating: bitta sahifa minglab yozuvga yetadi.
- Tayyor kodni TO'LIQ yozib bermang.
- 4/4 bo'lsa — qisqa maqtang: loyihasi endi ko'p sahifali.
```

---

## `ru` · Savol

```
Сделайте свой проект многостраничным, затем вставьте сюда доказательство:

1. Список страниц: запишите 3–4 страницы вашего проекта (адрес + название, например: / — Главная).
2. Постройте с AI: поручите Antigravity установить Router, собрать страницы и меню.
3. Проверьте: все ли ссылки меню — <Link> (не a href), есть ли на одной странице параметр /:id?

В ответ:
— ваш список страниц (адрес + название)
— вставьте ПОЛНЫЙ код App.jsx (файл с Route)
— одна фраза: в чём вы увидели отличие <Link> от обычной ссылки?
```

## `ru` · AI prompt

```
Вы проверяете домашнее задание по React Router ученика 13 лет. В ответе должны быть список страниц, код App.jsx и одна фраза.

Критерии приёма:
1) есть список из 3–4 страниц: у каждой адрес и название;
2) в коде минимум 3 <Route path element />, и они соответствуют списку;
3) меню собрано на <Link> — не a href; хотя бы в одном Route есть параметр /:id;
4) одной фразой верно названо отличие: <Link> не перезагружает страницу (нет белой вспышки).

Правила фидбека:
- Обращайтесь на «вы», не больше 3–4 предложений.
- Если кода нет — попросите вставить код.
- Если виден a href — напомните разницу из урока: a href перезагружает всю страницу, <Link> меняет только нужное место.
- Если нет :id — напомните сравнение с пустой клеткой: одна страница хватит на тысячи записей.
- НЕ выписывайте готовый код целиком.
- При 4/4 — коротко похвалите: проект теперь многостраничный.
```
