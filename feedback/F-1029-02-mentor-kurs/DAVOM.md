# F-1029-02 · Mentor kursi — DAVOM (29.10.2026 21:37, chala ishlar yopildi)

## Holat bir qarashda
- Dars: `src/mentor-kurs/NestArchMentorLesson.jsx` — **v3, 39 ekran**, ovozli (segment-sinxron), yig'ilgan fayl.
  Manba — bo'laklar: `src/mentor-kurs/parts/01-asos.jsx` (CSS, importlar) · `02-dvigatel.jsx` (useBeats, Say, Stage, CodePanel, MCRetry, LineCheck, Practice, Lesson) · `03-s01-s05.jsx` · `04-s06-s11.jsx` · `05-s12-s17.jsx` · `06-s18-s23.jsx` · `07-s24-s28.jsx` (ko'prik, o'tish rejasi, Rdb, savollar, sinov, yakun, SCREENS, ildiz).
  **Yig'ish:** `cat src/mentor-kurs/parts/*.jsx > src/mentor-kurs/NestArchMentorLesson.jsx` — bo'laklar manba-haqiqat, yig'ilgan faylga to'g'ridan tegilmaydi.
- Darvozalar (har tahrirdan keyin, hammasi yashil 29.10 21:37):
  `npx esbuild src/mentor-kurs/NestArchMentorLesson.jsx --bundle --outfile=/dev/null --loader:.jsx=jsx --external:react --external:react-dom --external:@lesson/runtime`
  `npx vite build --config vite.mentor-kurs.config.js --logLevel error && rm -rf dist-mentor-kurs` (oxc parser — esbuild o'tkazib yuborgan satr-xatosini tutadi)
  `npm run lint:jsx -- src/mentor-kurs/NestArchMentorLesson.jsx` · `npm run lint:til -- src/mentor-kurs/NestArchMentorLesson.jsx` (0 error; 7 warn eski: sen-imperativ «ol → chaqir → qaytar» yolg'on-musbat, keyingi-darsda 6× ataylab)
  `npm run gates` da esbuild va dark qizil — **kutilgan** (umumiy darvoza `@lesson/runtime`ni bilmaydi; qora kod-panel mentor-dizayn qarori).
- Lokal ko'rish: `python3 feedback/F-1029-02-mentor-kurs/dev/tts-server.py 5332 &` · `npx vite --config vite.mentor-kurs.config.js --port 5333 --strictPort` → http://localhost:5333/mentor-kurs.html (muqovadan «Boshlash» — shunda ovoz ishlaydi; `?s=N` N-ekrandan, faqat dev, autoplay rad bo'lishi mumkin). TTS kesh: `korik/tts-cache/` (yangi matn birinchi marta 3–8 s yasaladi).
- Commit: 29.10 21:37 lokal (foydalanuvchi ruxsati bilan, avtopilot raundi) — `src/mentor-kurs/`, `feedback/F-1029-02-mentor-kurs/`, `mentor-kurs.html`, `vite.mentor-kurs.config.js`; **push YO'Q**. `korik/tts-cache`, `korik/audio`, loglar — papka `.gitignore` (qayta yasaladi). Keyingi commit/push faqat buyruq bilan.

## Nima qilindi (xronologiya)
1. v1 ssenariy 28 ekran → prototip → v2 37 ekran (audit №1 yechimlari: 3 amaliyot, bashorat, satr-tekshiruv, o'tish rejasi, kalit ibora, bir urinishli sinov) — `AUDIT-2026-10-29.md`.
2. 29.10 18:56 — v2 Chrome'da 1→37 to'liq ✓; kichik-ekran avto-aylantirish; qiyshiq apostrof 30 satr → '.
3. 29.10 19:20 — **halol audit №2** `AUDIT-v2-2026-10-29.md` (30 band).
4. 29.10 19:59 — audit №2 yechimlari → **v3, 39 ekran** (JURNAL oxirgi yozuvi batafsil). Haqiqiy chiqishlar `manba/drive2.sh` → `manba/nest-out/10–18`:
   Injectable'siz + bog'liqlik = server ishga tushadi, so'rovda 500 TypeError (darsdagi eski da'vo noto'g'ri edi, tuzatildi) · bo'sh POST → 201 {id} · baza-xatolari: ECONNREFUSED / «client password must be a string» (.env yo'q) / «password authentication failed».

5. 29.10 21:37 — **chala ishlar** (JURNAL batafsil): v3 Chrome'da 1→39 to'liq ✓ (onFinished passed/testPassed/practiceDone ✓) · F-1029-02-01 Rdb 4-holat «database … does not exist» (haqiqiy chiqish nest-out/18) — sarlavha «to'rt xabar, to'rt sabab» · F-1029-02-02 S28 kichik ekranda eslatmaga avto-aylantirish · F-1029-02-03 R2 «Node 20+» · F-1029-02-04 DIGITS: transkriptda raqam (1240, 22, 20, 30–60…) · S5b nuqta tekshirildi — nuqson yo'q.

## Foydalanuvchi qarorlari (o'zgarmas)
JSX + ovoz, video YO'Q, o'yin YO'Q · mentor imtihoni uslubi (atama inglizcha + qavsda izoh, «siz») · ovoz hozir edge-tts Sardor, yakunda ElevenLabs (platforma `useAudio`) · «shoshilmaslik, haqiqiy dars» · yakuniy sinov bir urinishli · amaliyotlar isbot-maydoni bilan · yordam qatori = «mentor-kurs Telegram guruhi» (umumiy) · **Orqaga tugmasi (A12) — keyin, foydalanuvchi ko'rigidan so'ng** · platforma haqida hozir o'ylamaslik.

## KEYINGI QADAM (aynan shu tartibda)
1. **Foydalanuvchi 39 ekranni so'zma-so'z ko'rib chiqadi** → fikrlarini yozadi (F-1029-02 ichida F-ID: F-1029-02-NN yoki sana bo'yicha F-MMDD-NN).
   Har fikr: tashxis → yechim taklifi → tasdiq → tahrir (bo'laklarda) → yig'ish → 4 darvoza → Chrome'da shu ekran → JURNAL.
2. A12 Orqaga: ekran yakuniy holatda, ovozsiz ochilsin, ↺ bosilsa boshidan (dvigatel `useBeats`/`Lesson`).
3. ElevenLabs sayqal: `[English pronunciation] … [end]` atamalarga, `[pause]`, segment ≤25 s (hozir eng uzuni ~80 so'z chegarada).
4. Yuklashga tayyorlash: `jsx optimisation/optimizatsion lesson/tools/tayyorla.sh src/mentor-kurs/NestArchMentorLesson.jsx` → `.oz.jsx`.
5. Qolip muhrlanadi → qolgan 11 NEW dars (parts/01–02 umumiy dvigatel).

## Ochiq (audit №2 dan qolgan)
A12 Orqaga · ruscha ovoz (qaror yo'q) · resume (platforma) · tezlik tugmasi (runtime) · daraxt haqiqiy GitHub repo bilan solishtirilmagan (foydalanuvchi 29.10: «qoldir», repo manzili keyin).
Yopildi 29.10 21:37: «baza mavjud emas» (F-1029-02-01) · S28 kichik ekran (F-1029-02-02) · S5b nuqta (nuqson emas).
