# F-1102-22 · Chap panel matni «katta va qo'pol» — variantlar (02.11)

Foydalanuvchi: «juda katta, qo'pol; gapga mos bo'lsin; testlarda ham, kodli joyda ham, boshida ham». Rasm: PG-2 24-ekran chap paneli.
Tashxis — `src/mentor-kurs/parts/01-asos.jsx`: `.mk-title` clamp(20,2.2vw,28px)/800 · `.mk-key` clamp(22,2.1vw,30px)/700 · `.mk-key code` qora blok · `.mk-title.mc-q` 26/800 · `.mk-say.mc .mk-opt` 18 · `.mk-cover h1` 38.

`A.css` (tavsiya) · `B.css` · `C.css` — uslub USTIDAN yoziladigan variantlar; A/B da `.mk-key[data-len="long"]` (gap >110 belgi) bir pog'ona kichik.
Suratlar: https://claude.ai/artifact/2oFH2GkLbK1xmSu6eR3FzW 4-savol (8 ekran × hozir/A/B/C). Foydalanuvchi tanlovi KUTILMOQDA.

**Tanlovdan keyin qanday kiritiladi (dvigatel, 12 darsga birdan):**
1. `parts/01-asos.jsx` — tanlangan CSS qiymatlarini mavjud qoidalarga yozish (ustidan emas, o'rniga). `.mk-key code{white-space:nowrap}` ham.
2. `parts/02-dvigatel.jsx` — `Say` da `.mk-key` ga `data-len` (matn uzunligi: ≤70 short, ≤110 mid, >110 long; tag'larsiz uzunlik), `MCRetry`/`LineCheck` sarlavhasiga ham.
3. `bash dev/yig.sh` → esbuild 12/12 → `npm run lint:jsx` → `npm run lint:til` → e2e (`dev/e2e-hammasi.sh`) 1920 va 1280 → :5334 qayta build.
4. Qonun: MENTOR_DARS_ETALON **M40** «Chap panel matni gapga mos: o'lchamlar, og'irlik, chip, uzun gap» + jurnal F-1102-22.
