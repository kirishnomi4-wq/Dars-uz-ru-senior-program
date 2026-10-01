# 5-Modul konveyer vositalari (01.10.2026, seans scratchpad'idan saqlandi)

Shablonlar (`../QURUVCHI_SHABLON.md` va boshqalar) shu skriptlarni `$S/<nom>` deb chaqiradi. Yangi seansda: shu fayllarni o'z scratchpad'ingizga
ko'chiring (yoki `S=` ni shu papkaga qarating) va kerak bo'lsa scratchpad ichida `node_modules` ga symlink qiling
(esbuild, playwright-core, react, react-dom, scheduler — repo `node_modules` dan).

| Fayl | Nima qiladi |
|---|---|
| `shots.mjs` | darsni esbuild + Chrome bilan ochib, ekranma-ekran skrinshot (env: SHOT_LANG, SHOT_W/H, SHOT_WAIT, FULL, CLICK, TAG, EVAL, RDIR); har ekranda pageerror |
| `ru-wl.mjs` | RU ish-ro'yxati (HEAD bilan farq qilgan uz satrlari) va `--apply` bilan tarjimani qo'yish |
| `final-check.sh` | yakuniy tekshiruv: gates · ball kalitlari HEAD bilan · ru-gate (`$S/NN-ru/base.jsx`) · uz/ru smoke (`LIST=` bilan tanlash) |
| `site-smoke.mjs` · `live-smoke.mjs` | `dist-m5` lokal va jonli sayt: har dars uz/ru ochiladimi |
| `sweep.py` | 12 faylga bir xil CSS/matn tozalash (F-1001-69) — namuna |
