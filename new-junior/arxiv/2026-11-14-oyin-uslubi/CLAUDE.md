# NEW JUNIOR — shu papka qoidalari

Bu papka — CoddyCamp **Junior** kursi (9–13 yosh, 168 dars). AI Startup kursidan **to'liq alohida**.

## Chegara (eng muhim qoida)

- Junior ishi faqat `new-junior/` ichida yashaydi: darslar, umumiy qismlar, hujjatlar, sayt.
- `new-junior/` ichidagi kod `../src/` dagi AI Startup darslaridan **hech narsa chaqirmaydi**. AI Startup'dan biror narsa kerak bo'lsa —
  avval foydalanuvchiga aytiladi (nima, nega), keyin qaror qilinadi.
- Junior ishi paytida papkadan tashqaridagi fayllar (ildizdagi `package.json`, `src/`, skriptlar, qonun-hujjatlar) tahrirlanmaydi.
- Ildizdagi `CLAUDE.md` ning A–G retseptlari, PM qonunlari, konveyer va AI Startup darvozalari Junior'ga **avtomatik o'tmaydi**.
  Junior'ning o'z qoidalari faqat shu papkada yoziladi va faqat sinovdan o'tgach.
- O'zgarmay qoladigan umumiy tamoyillar: commit/push faqat buyruq bilan · tashxis avval, yechim keyin ·
  har qadam oldidan reja aytiladi · CSS izohiga backtik yozilmaydi.

## Hujjat-xarita

| Fayl | Nima | Kim o'zgartiradi |
|---|---|---|
| `dastur/DASTUR.md` (+ `darslar.json`, asl PDF) | NIMA o'qitiladi: 168 dars, natijalar, tekshiruv | Faqat foydalanuvchi |
| `KONSEPSIYA.md` | Darslar QANDAY bo'ladi: Sahna · Parta · Pult · Uy, dars ritmi, ko'rinish, ochiq savollar | Kelishuv bilan |
| `HOLAT.md` | Jurnal: sana + nima qilindi + qaror; hozir nima kutilmoqda | Har ish yakunida |
| `manba/NNN-nom.md` | Dars manbasi: bola va ustoz ko'radigan har so'z, sahna-sahna (ekranda nima · ustoz nima deydi · bola nima qiladi · tekshiruv). Kod shundan quriladi | Kelishuv bilan; matn o'zgarsa avval shu fayl |
| `sinov/` | Sinov skriptlari: darsni avtomatik bosib o'tish, ikki oyna, matn o'lchovi. Qanday yurgizish — `sinov/OQI.md` | Dars o'zgarsa birga yangilanadi |

Yangi dars yoki g'oya ustida ishlashdan oldin birinchi uchta fayl o'qiladi; dars ustida ishlaganda — o'sha darsning manbasi ham.

## Ishga tushirish (ildiz papkadan)

```
npx vite --config new-junior/vite.config.js          # lokal: http://localhost:5340
npx vite build --config new-junior/vite.config.js    # yig'ma: new-junior/dist
```

**Vercel** (https://coddycamp-junior-dars1.vercel.app, loyiha `coddycamp-junior-dars1`, akkaunt kirishnomi6-9875): yig'ma + ulanish funksiyasi bitta papkada chiqariladi —

```
npx vite build --config new-junior/vite.config.js
D=<vaqtinchalik>/coddycamp-junior-dars1 && mkdir -p $D/api && cp -r new-junior/dist/. $D/ && cp new-junior/api/sinf.mjs $D/api/
cd $D && npx vercel deploy --prod --yes
```

Ustoz va o'quvchi oynalari uch yo'l bilan ulanadi (`sinf.js`, tartib bilan): **lokal** — `vite.config.js` dagi «sinf-aloqa» (`/__sinf`, bitta tarmoqda); **internet** — `api/sinf.mjs` (Vercel funksiyasi + Upstash Redis, har dars o'z sinf kodi bilan: ustoz eshikdan «Darsni boshlash» → `?xona=K7P2`, proyektorda kod, bola eshikda kodni yozadi); **bitta brauzer** — ikkalasi ham bo'lmasa (eshik buni aytadi). Internet yo'li uchun Vercel loyihasida Upstash Redis integratsiyasi bo'lishi kerak (`UPSTASH_REDIS_REST_URL/TOKEN` yoki `KV_REST_API_URL/TOKEN`); integratsiya qo'shilgach qayta chiqariladi. Internet orqali o'quvchi ekrani ustozdan ~1 soniya kech yangilanadi (har 0,7 soniyada so'raydi).

Kutubxonalar (React, Vite) ildizdagi `node_modules` dan olinadi — alohida o'rnatish kerak emas.

## Kod tuzilishi

- `src/App.jsx` — ish xaritasi (9 modul, 168 dars; qaysi dars tayyor). Bu bolalar ko'radigan sahifa emas.
- `src/darslar.js` — tayyor darslar ro'yxati: dars raqami → dars fayli. Yangi dars shu yerga bitta qator bilan ulanadi.
- `src/chizma/` — umumiy chizish dvigateli: qahramonlar, Coddy, zonalar (`dvigatel.js` — SVG satri qaytaradi) va ularning harakati (`harakat.css`). Hamma dars shundan foydalanadi, nusxa olinmaydi.
- `src/dars001/` — 1-dars (etalon): `manba.js` (matnlar; manba-haqiqat `manba/001-tanishuv.md`), `sinf.js` (sinf holati, soxta sinf, ustoz va o'quvchi oynalari aloqasi, sahna va qadam vaqti; `ochildi` — dars ichidagi test natijasi proyektorda ochilgan lahza: shu payt bola noutbukida o'z natijasi chiqadi; sinf serveri yo'q joyda — `useServerli` false), `Studiya.jsx` (Blok studiya: bloklar, dastur tasmasi, bajarish, muammochalar, sanash nuqtalari, «Keyingi pog'ona»), `Manzara.jsx` (manzarali ekranlar: savol, tanlov, kutish, sinf surati, minoralar, xarita, ism va rang, joy, yakun), `Doska.jsx` (sinf doskasi — bolalar ishlayotganda proyektorda: topshiriq, pog'onalar bo'yicha son, qolgan vaqt; yakundagi «Sinfimiz bugun»; panel soati), `Varaq.jsx` (ustozning tayyorgarlik varag'i — `manba/001-tanishuv.md` dan o'zi yig'iladi), `Dars001.jsx` (Sahna va Parta, 15 sahna), `dars.css`, `tovush.js` (tovushlar va Coddy ovozi, faqat proyektorda: «de» gapi ro'yxatda bo'lsa — tayyor mp3 (`public/ovoz/`, `sinov/ovoz-yarat.py` yasaydi: edge-tts, o'zbekcha Sardor ovozi, mentor kursidagi kabi), bo'lmasa — brauzerning o'zbek ovozi, u ham bo'lmasa jim). Coddy yangi gap aytadigan bo'lsa, gap `ovoz-yarat.py` dagi ro'yxatga qo'shilib, skript qayta yurgiziladi. Bekat tasmasi yo'q — reja xaritasi (`RejaXarita`) har yangi bekat boshida qaytadi; dars bo'laklari «bekat» deb ataladi («ish» emas). Ustoz boshqaruvi — ekran ostidagi panel (`UstozPaneli`); o'quvchining yashil tugmasi doim o'ng pastda (`Tasma`). Klass nomi yozishdan oldin `dars.css` da borligini qidiring (14.11: `d1-ustun` ikki marta ishlatilib, ekran buzilgan).
- Dars manzili: `#/dars/1` — dars eshigi (ekran tanlash); `?rol=ustoz#/dars/1` — proyektor (dars egasi; `&yangi=1` — boshidan); `?rol=bola#/dars/1` — o'quvchi (`&ism=Lola` — ismi); `?rol=yonma#/dars/1` — ikkalasi bitta sahifada (tez ko'rik, hech qayerga ulanmaydi); `?rol=varaq#/dars/1` — ustoz varag'i (chop etsa bo'ladi).
- Manbadagi «Darsdan oldin» bo'limi va sahnalar maydonlari («Vaqt», «Qadamlar», «Tayanch gaplar», «O'z so'zi bilan», «Ustoz qiladi», «Bola qiladi», «Parta», «Xatoda») ustoz varag'iga o'zi chiqadi — ularning nomini o'zgartirsangiz, `Varaq.jsx` ham o'zgaradi. Ustoz va o'quvchi oynalari lokal server orqali ulanadi (`vite.config.js` dagi «sinf-aloqa», `/__sinf`) — ikki xil brauzerda ham ishlaydi; har o'quvchi oynasi sinfdagi 14 o'rindan birini egallaydi, qolgan o'rinlar soxta (`sinf.js`).
