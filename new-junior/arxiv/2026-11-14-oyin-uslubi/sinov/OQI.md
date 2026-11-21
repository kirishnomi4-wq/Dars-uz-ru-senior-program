# Sinov skriptlari

Dars o'zgargan har safar yurgiziladi. Avval lokal server yoqiladi (loyiha ildizidan):

```
npx vite --config new-junior/vite.config.js --port 5340 --strictPort
```

| Skript | Nima qiladi | Buyruq (loyiha ildizidan) |
|---|---|---|
| `ikki-brauzer.mjs` | **Haqiqiy dars:** ustoz va ikki o'quvchi uchta ALOHIDA brauzerda. O'quvchi ustozni kutadi → sinfga kiradi → bir-biriga ergashadi → ikkinchi o'quvchi alohida o'rin oladi → hukda savol, «YUR!» va sichqoncha bilan sudrash (Coddy joyiga qaytadi, «Keyingi» shundan keyin yonadi) → yonma-yon ko'rik aralashmaydi → sahifa yangilansa dars davom etadi → birinchi dastur yulduzgacha, proyektorda sinf doskasi → 6-sahnada «Keyingi pog'ona» (ekran o'zi o'tmaydi) → o'z sahnasida «sakra»dan keyin ekran o'tib ketmaydi, «O'zingiz yozgan gap» sharti → galereya → yakunda sinf natijasi, «saqlandi» yo'q → ustoz varag'i (44 tekshiruv) | `node new-junior/sinov/ikki-brauzer.mjs "http://localhost:5340"` |
| `yurish.mjs` | 1-darsni yonma-yon ko'rikda boshidan oxirigacha topshiriqlarni bajarib bosib o'tadi (15 sahna), 8–15-sahnani suratga oladi (24 surat), xatolarni chiqaradi | `mkdir -p /tmp/junior-sinov && node new-junior/sinov/yurish.mjs "http://localhost:5340/?rol=yonma#/dars/1" /tmp/junior-sinov/y` |
| `suratlar.mjs` | HAR sahna va HAR qadamni suratga oladi (81 ta surat, proyektor va bola yonma-yon) — ko'z bilan ko'rik uchun; xatolarni ham chiqaradi | `node new-junior/sinov/suratlar.mjs "http://localhost:5340/?rol=yonma#/dars/1" /tmp/junior-sinov/s` |
| `ikki-oyna.mjs` | Bitta brauzerda ikki oyna (proyektor va bola noutbuki) bir-biriga ergashishini 1–4-sahnada tekshiradi (huk, sudrash, birinchi dastur) | `node new-junior/sinov/ikki-oyna.mjs "http://localhost:5340"` |
| `internet-sinov.mjs` | Internet orqali ulanishni (`api/sinf.mjs`) Vercel va Upstash'siz sinash uchun server: yig'ma sayt + funksiya + xotiradagi Upstash o'xshatmasi, lokal sinf serverisiz. Keyin oddiy sinovlar shu manzilga yurgiziladi. `--redissiz` — Upstash ulanmagan holat | `npx vite build --config new-junior/vite.config.js && node new-junior/sinov/internet-sinov.mjs 5360`, so'ng `node new-junior/sinov/ikki-brauzer.mjs "http://localhost:5360"` |
| `ovoz-yarat.py` | Sinov emas — Coddy'ning tayyor gaplarini o'zbekcha mp3 qiladi (`public/ovoz/`, internet kerak). Coddy yangi gap aytadigan bo'lsa ro'yxatga qo'shiladi | `cd new-junior && python3 sinov/ovoz-yarat.py` |
| `matn-olchov.py` | Dars manbasini o'lchaydi: jami daqiqa, tayanch gaplar soni, bolaning birinchi mustaqil ishi, proyektorda ism bor-yo'qligi | `python3 -I new-junior/sinov/matn-olchov.py new-junior/manba/001-tanishuv.md` |

Bilib qo'yish kerak:

- Skriptlar `playwright-core` (ildizdagi `node_modules`) va `/usr/bin/google-chrome` bilan ishlaydi.
- Dars ekranlari o'zgarsa (tugma nomi, qadamlar soni), skriptdagi bosishlar ham yangilanadi — aks holda skript to'xtaydi, dars emas.
- Kompyuterda boshqa seanslarning ko'rinmas brauzerlari ishlab tursa, sinov brauzeri tasodifiy qulashi mumkin («Page crashed»). Bu darsdagi xato emas: qayta yurgiziladi. Begona brauzerlar yopilmaydi.
- Skript bosishi (`force: true`) haqiqiy sichqonchadan farq qiladi: shubha tug'ilsa, `page.mouse` bilan tekshiriladi.
- Harakat va tovush bu skriptlar bilan tekshirilmaydi — faqat odam ko'rib-eshitib baholaydi.
- Yonma-yon ko'rik (`?rol=yonma`) hech qayerga ulanmaydi: undagi bola — alohida, o'z sinfi bilan. Ustoz va o'quvchi oynalari bilan aralashmaydi.
- Aloqa lokal server orqali ketadi (`/__sinf`): `vite.config.js` o'zgarsa server o'zi qayta yoqiladi. Bitta brauzerda bir vaqtda 5 tadan ortiq dars oynasi ochilmaydi (brauzer bitta manzilga 6 ta doimiy ulanishdan ortig'iga yo'l qo'ymaydi) — ko'proq o'quvchi kerak bo'lsa, ikkinchi brauzer ochiladi.
- Dars ko'rinishi o'zgarganda `suratlar.mjs` yurgizilib, suratlar ochib ko'riladi — «xato topilmadi» degani «chiroyli chiqdi» degani emas.
- **Bir soniya ichida bitta faylga bir necha tahrir kiritilsa, lokal server oxirgisini ko'rmay qolishi mumkin** (14.11: `Studiya.jsx` eski holida berilib, sinov «tugma yo'q» deb to'xtagan). Sinovdan oldin fayllarga tegib qo'ying (`touch new-junior/src/dars001/*`) yoki server bergan kodni tekshiring: `curl -s localhost:5340/src/dars001/Studiya.jsx | grep <yangi so'z>`.
- Kengaytma orqali haqiqiy Chrome'da sinalganda klaviatura bosishi fondagi tabga yetmaydi — ustoz «Keyingi» tugmasi bilan boshqariladi.
- Internet orqali ulanishda o'quvchi ekrani ~1 soniya kech yangilanadi: sinovda ustoz oldinga o'tgach o'quvchi ekranini darhol tekshirmang — kuting (`ikki-brauzer.mjs` dagi `gacha` va `kut` shunday qiladi).
