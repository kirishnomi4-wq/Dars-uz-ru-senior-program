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
| `etalon/` | Ekranlar ko'rinishining namunasi: har ekran turi, to'rt shablon, qat'iy setka, ekran qonunlari (`QONUNLAR.md`). **19.11 dan muzlatilgan** (4A): `etalon.html` qayta yig'ilmaydi, eski yig'uvchi `arxiv/etalon-yiguvchi/` da; tekshiruvlari `sinov/etalon/` da. Kod shu ko'rinishga qarab quriladi | Kelishuv bilan |
| `dvigatel/` | **Umumiy dvigatel** (19.11, qayta qurilmoqda — reja: https://claude.ai/artifact/9HTJdJXYcnL8sJmXiHzErs). Hozir (2-bosqichdan keyin — **bitta yig'uvchi, ikki chiqish**): `yigish.mjs` — demo ham, LMS ham uchala bo'lakni shundan oladi: `chizuvchi(dars)` (bosh → qismlar → dars ekranlari → dars qadamlari → malumot; tartib SVG ichki raqamlari uchun muhim), `skript({ demo })` (studiya + demoda aloqa-demo + qobiq), `uslub()` (shablon.html + qobiq.css + shrift). Node'ga xos narsa faqat `yigish.mjs`, `sahifa.mjs`, `yig.mjs` da — chizuvchi fayllarida (`bosh.mjs` chizma yordamchilari, `qismlar.mjs` umumiy ekran qismlari, `malumot.mjs` oldindan chiziladigan ekranlar) fayl o'qish yo'q, chunki LMS'da ular brauzerda yuriladi. Brauzer: `qobiq.js` (rollar, qadam, bola → ustoz xabarlari, solo; rol, kalit, ism va aloqa tashqaridan — `KIRISH` obyekti), `aloqa-demo.js` (demo aloqasi: lokal server, internet, bitta brauzer kanali + demo kirishi; LMS'da o'rniga `lms/aloqa.js`, ko'rinishi bir xil: `boshla`, `yubor`), `studiya.js` · `blockly.js` · `tovush.js` · `ijrochi.js` (dastur daraxti, bajarish; to'xtagan blok «urildi» belgisi bilan qoladi) · `sahna.js` (sahna qolipi: `yol`, `erkin`, `katak` — labirint, 5a). `katak.js` — labirint chizmasi (faqat satr, DOM'ga tegmaydi): `yigish.mjs` uni **ikki joyga** qo'shadi — chizuvchiga va brauzer skriptiga (bitta manba). Javondagi bloklar — `DARS.javon` (bo'lmasa 1-darsdagi to'plam). Uslub: `shablon.html` + `maket.css` (dars), `qobiq.css` (demo/LMS qobig'i). `sahifa.mjs` — faqat demo sahifa qolipi. 1-darsning o'zi — `darslar/001-tanishuv/`: `dars.mjs` (**e'lon**, 3-bosqich: faqat ma'lumot — sanoqlar, bola ekranlari roli, qisqa gaplar, solo yo'li, studiya topshiriqlari va maslahatlari, namuna nomlar, LMS nomi/kaliti/yutuqlari, varaq va tugash matnlari; brauzerga `DARS` bo'lib o'tadi), `qismlar.mjs` (darsning o'z ekran bo'laklari: kurs o'yinlari, pog'onalar, huk javoblari, bekatlar, sahna shartlari), `uslub.css` (ekranlarga xos uslub — `.e-P2B` kabi; «== dars ==» qismi dars uslubi oxiriga, «== qobiq ==» qismi qobiq uslubi oxiriga qo'shiladi), `ekranlar.mjs`, `qadamlar.mjs`, `oltin.mjs` (darsning oltin namuna stsenariylari — `sinov/dvigatel/oltin.mjs` ishlatadi; namuna `sinov/dvigatel/oltin/<dars>/`). Dvigatelda (kod ham, uslub ham) ekran nomi yozilmaydi — kerak bo'lsa `DARS` ga maydon yoki dars `uslub.css` ga qoida qo'shiladi. Diqqat: dars uslubi blok oxirida turadi, ya'ni teng kuchdagi umumiy qoidadan doim ustun — umumiy qoida yutishi kerak bo'lsa, dars qoidasi yozilmaydi (3e da shunday 3 o'lik qoida topilib olib tashlandi). Brauzer fayllaridagi izohlar `demo.html` ga aynan o'tadi; `qobiq.js` va studiya fayllarida izohda ham «BroadcastChannel», «EventSource», «/__sinf», «/api/sinf» yozilmaydi — LMS yig'uvchisi bularni demo aloqasi kirib qoldi deb to'xtaydi (chizuvchi fayllarida — «process.», «node:fs», «import.meta»). Demo: `node new-junior/dvigatel/yig.mjs` → `public/demo.html`; LMS: `node new-junior/lms/yig.mjs` (demo.html ga bog'liq emas, tartib ahamiyatsiz). Har o'zgarishdan keyin oltin namuna: `node new-junior/sinov/dvigatel/oltin.mjs sol` — namunasi bor hamma dars, farq 0. **2-dars** — `darslar/002-ketma-ketlik/` (5b-2, 19.11; demo: `node new-junior/dvigatel/yig.mjs 002-ketma-ketlik` → `public/demo-002.html`; oltin namunasi hali yo'q — 5c da). 5b-2 da dvigatelga qo'shilgani (1-dars natijasi o'zgarmaydigan qilib): qadamning bola ro'yxati `null` — bola ekrani o'zgarmaydi (`qobiq.js`, `bolaQ`; yonma-yon ko'rikda ham); studiya `ish: 'raqam'` — asosiy tugma har bosishda bitta `[data-r]` raqamni yoqadi; `bosh.prog` [jonli, solo] juftligi; `zina(P)` — zinapoya ro'yxatini oladi (bir darsda bir necha zinapoya). Dars darvozalari: `sinov/dvigatel/matn.mjs <dars>` (manba gaplari), `setka.mjs <dars>`, `katak.mjs`. **9–10-dars (20.11):** labirint maydonda (`m.devor/kalit/eshik`, `mdXaritaM`), o'yinda qoida (`bosh.labirint`), labirint yasash (`bosh.yasash`, asboblar `DARS.palQosh.L`, atribut `data-t` — `data-a` qobiq tasmasiniki), darajalar (`bosh.darajalar`), «Do‘stingiz o‘ynaydi» (`ish: 'sahnaOyin', dost`), ikki ustunli dasturchalar (`DARS.dasturchaUstun 2`) — `studiya.js` «9-dars», «10-dars» bo'limlari; sinovlar `labirint.mjs`, `labirint2.mjs` | Kelishuv bilan |
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
