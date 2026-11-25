# F-1125-01 · Mentor Nest-1 darsini kuchaytirish — DAVOM

> **25.11.2026 16:27 — 1-ish BAJARILDI, LOKAL. Saytda hali eski versiya: commit + deploy foydalanuvchi buyrug'ini kutmoqda (shoshilinch — mentor Nest 12 o'rnatsa 6-ekranda qotadi). Keyingi: 2-ish (kirish matni). YANGI SEANS SHU YERDAN.**
>
> Deploy tartibi (buyruq kelganda): 1) commit — pathspec `src/mentor-kurs feedback/F-1029-02-mentor-kurs feedback/F-1125-01-nest1-kuchaytirish MENTOR_DARS_ETALON.md`, boshqa fayllarga tegilmaydi; 2) 12 dars ovozi `$S/ovoz-sayt-deploy/tts` ga: `node dev/ovoz-matnlar.mjs` uz va ru (`DARSLAR` berilmaydi — 12 dars) → `python3 dev/ovoz-statik.py` (kesh to'liq, yangi 0 bo'lishi kerak); 3) `S=<scratchpad> bash feedback/F-1029-02-mentor-kurs/dev/vercel-deploy.sh`; 4) jonli saytda `?dars=nest-01&s=5` — isbotga 12.0.15 yozib ko'rish. Serverlar: tts :5332, vite :5333 (16:05 dan yoniq).

## Bu nima

Mentor Muhammadbobur Nest-1 darsimiz asosida o'z slaydlarini yasagan (42 slayd, manbasi `slayd-manba/`, havola https://claude.ai/artifact/Nn48hrhft59pb6iLSyNnbW). Foydalanuvchi so'radi: nimasi bizdan ustun, kerakli joylarini olaylik. Tahlildan keyin foydalanuvchi qarori (25.11): bizning dars ancha yaxshi, kamchiliklarini kuchaytiramiz. Auditoriya aniqlandi: mentor Express'ni **videodan** o'rgangan, darsni **yolg'iz** ko'radi.

## Tasdiqlangan reja — 3 ish, shu tartibda (pilot: Nest-1)

1. **Nest 12** (shoshilinch) — ✅ 25.11 16:27 lokal: 6, 11, 12, 22-ekran + RU + ovoz + MD + qonun M54 (batafsil — mentor kursi JURNAL «25.11 16:27»). Saytga chiqmagan.
2. **Kirish matni** — «videodan o'rgangan» mentor uchun: 1–2-ekrandagi «yozgansiz / his qilgansiz», 4-ekranga tur va class, 6-ekranga «kerak bo'ladi» (VS Code, Postman yoki Thunder Client). Boshlanmagan.
3. **AI bloki** — 33-ekrandan keyin bitta ekran + bitta «satrni bosing» tekshiruvi + eslatmaga tekshiruv ro'yxati va lug'at. Avval o'quvchi darsi m4a-01 ning AI bloki o'qiladi. Boshlanmagan.

Olinmaydi: mini-film, Lego/velosiped, kompaniyalar, taymerlar, do'kon loyihasi. Tegilmaydi: «Davom» qulfi, 39 ekran tuzilishi. Guard/DTO/baza — Nest-2 da bor, Nest-1 ga qo'shilmaydi.

Har ish: matn taklifi → tasdiq → kod → darvozalar va suratlar → UZ/RU ovoz → jurnal. Commit/deploy faqat buyruq bilan. Nest-1 qabul bo'lgach — 2- va 3-ish kamchiligi qolgan 11 darsda tekshiriladi.

## 1-ish: sinov xulosasi (to'liq — `nest12/FARQLAR.md`)

- Nest 12 (27.08.2026 dan) `nest new` da 4 savol beradi; standart javoblar bilan (ESM + observe) dars kodi kompilyatsiyadan o'tmaydi, fayllar va terminal satrlari boshqacha.
- `nest new cars-api -p npm --type cjs --no-observe --skip-skills` bilan — savolsiz, va darsdagi hamma chiqish Nest 11 bilan bir xil. Farq: `main.ts` da `void bootstrap();`, versiya raqami, Node talabi.
- Isbot maydoni `11.` ni kutadi (`src/mentor-kurs/parts/03-s01-s05.jsx:241`) — hozir yangi o'rnatgan mentor 6-ekranda qotadi.

## 1-ish: tuzatish (tasdiqlandi 25.11 «Ha shu taklifing maqul», bajarildi)

- 6-ekran: `npm i -g @nestjs/cli@12` (versiya buyruqda qotiriladi) · isbot `12.` · 3-qadam buyrug'i bayroqlar bilan · ovoz b/c/d qayta · «Boshqacha chiqdimi?» ga 2 qator · Node «22 yoki undan yuqori».
- 11-ekran: `void bootstrap();` + ovozda bir gap.
- 12- va 22-ekran «Boshqacha chiqdimi?»: bayroqlarsiz yaratilgan loyiha belgilari (ObserveModule satrlari · TS2307).
- Eslatma (`CHEATSHEET`), RU (`08-ru.jsx`), MD (`dev/nest1-md.py`), yig'ma (`dev/yig.sh`), ovoz (o'zgargan bo'laklar UZ+RU).
- Qonun: `MENTOR_DARS_ETALON.md` yangi band (M54) — versiya buyruqda qotiriladi, isbot shu versiyani kutadi; yozishdan oldin `npm view` bilan solishtiriladi.

## Fayllar

- `slayd-manba/` — Muhammadbobur slaydlari (deck.json, deck.css, slides/*.html).
- `nest12/` — sinov: `drive-nest12.sh`, `solishtir.py`, `pty-run.py`, `out-cjs/`, `out-enter/`, `qolip-*/`, `FARQLAR.md`.
- Vaqtinchalik Nest 12 loyihalari scratchpad'da edi (o'chadi) — qayta yaratish buyrug'i `FARQLAR.md` oxirida.
