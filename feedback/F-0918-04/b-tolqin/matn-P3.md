# Matn takliflari — partiya P3 (3-Modull) · 2026-09-18 tun

> Darsdagi matnga TEGILMAGAN (foydalanuvchi qarori 7-A). Har qator — taklif; tasdiqdan keyin kiritiladi.
> Mezon: `MATN_KORPUS.md` §63 (nishon tavsifi ≤ 48 belgi), §133 va §184 (tavsif faqat real ishni aytadi), §183
> (151-qonun qatori). Umumiy muammo: urinishdan OLDIN ko'rinadigan maslahat xato qatorni nomlasa, «birinchi urinishda
> to'g'ri» sharti bilimni emas, o'qishni tekshiradi. Tushuntirish yo'qolmaydi — u xatodan keyin (fidbek) va topilgandan
> keyin (`explain`, «✓ Topdingiz!») baribir chiqadi.

| # | dars · ekran | ❌ hozirgi (aynan) | ✅ taklif | sabab |
|---|---|---|---|---|
| 1 | ReactCrudPractice · s13 (o'ng ustun, boshlang'ich maslahat) | uz: «"+ push"ni bosing — son o'zgarmaydi. push o'sha eski ro'yxatning o'ziga qo'shadi, yangi ro'yxat yasamaydi — React esa faqat yangi ro'yxatni sezadi.» · ru: «Нажмите «+ push» — число не меняется. push добавляет в тот же старый список, а нового не создаёт — React же замечает только новый список.» | uz: «"+ push"ni bosing — son o'zgarmaydi. State darsini eslang: React ro'yxat o'zgarganini qachon sezadi?» · ru: «Нажмите «+ push» — число не меняется. Вспомните урок про state: когда React замечает, что список изменился?» | Maslahat xato qatorni (`push`) nomlaydi va sababini to'liq aytadi. Tajriba-tugmasi («+ push») qoladi — u o'quvchiga muammoni o'zi ko'rsatadi. |
| 2 | ReactCrudPractice · s13 (AI-kodidagi xato qatorning izohi) | uz: «// o'sha ro'yxatning o'ziga qo'shdi» · ru: «// добавил в тот же список» | uz: «// yangi o'yinni qo'shdi» · ru: «// добавил новую игру» | AI o'z xatosini izohda aytib qo'ygan — qatorni o'qimasdan topiladi. Neytral izoh AI'ning «ishonchli, lekin xato» kodiga mos (dars g'oyasi: AI ham adashadi). |
| 3 | ReactIntro · s14 (o'ng ustun, maslahat) | uz: «Komponent — kichik va aniq bo'lak. «Qolgan hammasi» degani esa bitta ulkan monolit. Qaysi qator shunday?» · ru: «Компонент — маленькая и понятная часть. А «всё остальное» — это один огромный монолит. Какая строка такая?» | uz: «Komponent — kichik va aniq bo'lak: bitta blok, bitta vazifa. Qaysi qator bu qoidaga zid?» · ru: «Компонент — маленькая и понятная часть: один блок, одна задача. Какая строка нарушает это правило?» | «Qolgan hammasi» — xato qator izohidagi so'zning («qolgan HAMMASI shu yerda») aynan takrori: maslahat javobni ko'rsatib qo'yadi. «Monolit» atamasi `explain` da (topilgandan keyin) qoladi. |
| 4 | ReactRouterPractice · s13 (o'ng ustun, maslahat) | uz: «Ikkitasi <Link>, bittasi boshqacha. Qayta yuklash — <a href> ning belgisi. Qaysi qator shunga zid?» · ru: «Две строки — <Link>, одна — другая. Перезагрузка — признак <a href>. Какая строка нарушает правило?» | uz: «Uchta havola — bittasi qolganlariga o'xshamaydi. Qaysi teg bosilganda brauzer butun sahifani qayta yuklaydi?» · ru: «Три ссылки — одна не похожа на остальные. При каком теге браузер перезагружает всю страницу?» | Hozirgi maslahat xato tegni (`<a href>`) nomlaydi. Taklif savol qo'yadi — javob darsda o'rgatilgan bilimga tayanadi (Mentor s9: «<Link> … (<a> emas)»). |
| 5 | PmLesson9 · s8 `clearTerms` (nishon tavsifi, MEHNAT) | uz: «Uchta tekshiriladigan shart yozdingiz» · ru: «Вы написали три проверяемых условия» | uz: «Uchta qabul sharti yozdingiz» (27 belgi) · ru: «Вы написали три условия приёмки» | Baho-so'zli («chiroyli») shart ham saqlanadi — javob-qatori faqat ogohlantiradi, bloklamaydi. «Tekshiriladigan» — tekshirilmagan mahorat da'vosi (§133, §184). |

## O'zgartirish tavsiya ETILMAYDI (qayd)

- **ReactBuildSite · s10** — kartochkalarda «narx?» yozuvi va qizil «⚠ Kartochkalarda narx ko'rinmayapti!» nima
  yetishmayotganini ataylab ochiq ko'rsatadi. Topshiriqning bilimi — **aniq, kichik prompt** («narxni qo'sh») ni
  «hammasini qaytadan yozdir» dan ajratish; buni maslahat aytmaydi. Tavsif («AI xatosini aniqlashtiruvchi prompt bilan
  tuzatdingiz») rost. Faqat metodist e'tiboriga: uchinchi variant («Kartochka rangini o'zgartir») juda bo'sh distraktor —
  u senariy/metodist qarori, matn-takrir emas.
- **ReactIntro · s13 / ReactRouterPractice · s9 / ReactCrudPractice** — `ACH_TRIGGERS` ustidagi kod-izohi («faqat REAL
  solve») endi haqiqatga to'g'ri kelmaydi (bonus ekranlar bor). Bu o'quvchi matni emas — kod-izohi; bosh agent qarori.
