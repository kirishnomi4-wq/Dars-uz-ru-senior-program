# Test izohi va recap — qisqartirish yo'riqnomasi (30.09, seans C)

Foydalanuvchi qarori (qaror-sahifa S8–S11, https://claude.ai/artifact/Vqjn5YYNCNMvLFV4VfomNJ):
**S8=A** to'g'ri javobdan keyin bitta qisqa gap · **S9=A** xato javobdan keyin nega shu variant xato, to'g'ri javob aytilmaydi ·
**S10=B** recap 3 karta qoladi, har kartada bitta gap · **S11=B** hammasi bugun qisqartiriladi, keyin yangi LMS paketi.
Sabab (foydalanuvchi so'zi): «o'quvchi uncha ko'p matnni o'qimaydi… To'g'ri … tamom, 1 qatorgina; xatoda ham shunchaki xato va qisqa tushunarli izohcha».

KOD allaqachon o'zgargan (codemod-izoh.py): ekranda izohdan oldin **«✓ To'g'ri.»** yoki **«✗ Xato.»** o'zi chiqadi,
«Qaytadan urinib ko'ring» sarlavhasi yo'q, recap tugmasi «📖 Eslatma», «Sinfga savol» o'quvchiga ko'rinmaydi.
Sizning ishingiz — faqat MATN (uz va ru).

## Ish tartibi (har fayl uchun)
```
T=feedback/F-0929-LMS-yuklash/vositalar/izoh.py
python3 $T show <fayl.jsx>                  # hamma izoh: id · savol · variantlar (✓ = to'g'ri) · TANLANGAN · eski uz/ru
# yangi matnni yozing: <scratch>/<Dars>.new.json  →  {"correct:0": {"uz": "...", "ru": "..."}, "wrong:0": {...}, "recap:0": {...}, ...}
python3 $T put <fayl.jsx> <Dars>.new.json   # faylga qo'yadi (qo'shtirnoq/apostrofni o'zi ekranlaydi)
python3 $T lint <fayl.jsx>                  # 0 topilma bo'lguncha
npx esbuild <fayl.jsx> --loader:.jsx=jsx --log-level=error --outfile=/dev/null
npm run gates -- <fayl.jsx>                 # esbuild·undef·jsx·keys·dark·til·prompt toza bo'lsin (tell/emoji — eski qarz, e'tibor bermang)
```
- **Faylni qo'lda tahrirlamang**, faqat `put` orqali. HAR id uchun yangi uz VA ru bering (JSON'da hammasi bo'lsin).
- Matn oddiy yoziladi: `O'zgaruvchi` (ekranlash yo'q). Kod — `backtick` ichida (ekranda kod-chip bo'ladi), eski matnda bo'lsa saqlang.
- Recap (`recap:*`) — JSX: `<b>…</b>` ishlatsa bo'ladi (1–2 kalit so'z), boshqa teg/`{}` yo'q.
- Git, commit, boshqa fayl — YO'Q. Faqat sizga berilgan fayllar.

## Qoidalar

**to'g'ri javob izohi (`correct:*`)** — uz ≤ 60 belgi, ru ≤ 75; bitta qator (1–2 qisqa gap).
- Asosiy fikr birinchi so'zlarda: **nega** bu javob to'g'ri (qoida/sabab), variantni so'zma-so'z takrorlamang.
- Maqtov bilan boshlanmaydi: «To'g'ri!», «Aynan!», «Barakalla», «Zo'r», «Aniq topdingiz» · «Верно!», «Точно», «Молодец» — ekranda «✓ To'g'ri.» bor.
- ✅ «npm — tayyor paketlarni o'rnatadigan vosita.» ❌ «To'g'ri! npm (Node Package Manager) — … npm install express bilan Express'ni o'rnatdik.»
- ✅ «O'zgaruvchi — nomli quti, ichida qiymat turadi.» ✅ «GET va SELECT — ikkalasi ham ma'lumot olish.»

**xato javob izohi (`wrong:*`)** — uz ≤ 60, ru ≤ 75; bitta qator. `TANLANGAN` = o'quvchi bosgan variant.
- Aynan **shu tanlangan variant nega noto'g'ri** — uning o'zi haqida gapiring. To'g'ri javobni (✓ variant matnini) AYTMANG —
  o'quvchi qayta o'ylab tanlashi kerak. Yo'naltiruvchi ishora mumkin, javob emas (KORPUS §8, §77).
- «Yo'q —», «Xato —», «Noto'g'ri» · «Нет —», «Неверно» bilan boshlanmaydi — ekranda «✗ Xato.» bor.
- `default` kaliti — umumiy ishora (javobsiz).
- ✅ (TANLANGAN «Sonlar ustida hisob-kitob amali») «Hisob-kitob — bu amal, o'zgaruvchi esa amal emas.»
  ❌ «Yo'q — bu hisoblash emas. O'zgaruvchi qiymat saqlaydigan nomlangan quti.» (javobni aytib qo'ydi)
- ✅ (TANLANGAN «const») «const qulflanadi — keyin qiymatini o'zgartirib bo'lmaydi.»

**recap kartasi (`recap:*`, faqat `body`)** — uz ≤ 90, ru ≤ 110; **aynan bitta gap**. Karta sarlavhasi (h), rasm-qator, savol — tegilmaydi.
- Kartaning asosiy fikri bitta gapda. 2–3 gapdan eng muhimini qoldiring, misol/izoh tushib qolsa ham bo'ladi.
- ✅ «Qutiga qiymat solamiz va uni <b>nom</b> bilan chaqiramiz.» ❌ «O'zgaruvchi — bu <b>qiymat saqlaydigan…</b>. Ichiga biror narsa solamiz, … keyin shu nom bilan chaqiramiz.»

**Til (hammasiga)** — adabiy o'zbek tili, lotin, «siz»; sheva/so'zlashuv yo'q (-votti, bo'pti, -ku/-da); kantselyarit yo'q
(ushbu, hisoblanadi, amalga oshirmoq). Darsning o'z so'zlari va metaforasini ishlating (quti, eshik, …), yangi atama kiritmang.
ru — tabiiy ruscha, «вы», ma'nosi uz bilan bir xil (so'zma-so'z tarjima shart emas). `npm run lint:til` 0 error.

## Hisobot (oxirida, qisqa)
Har fayl: izohlar soni (correct/wrong/recap) · `lint` 0 · gates holati · muammo bo'lsa id va sabab.
Namunaga 3 ta juftlik (eski → yangi) har turdan bittadan.
