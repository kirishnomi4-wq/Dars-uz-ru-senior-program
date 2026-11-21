# Etalon sahifasining eski yig'uvchilari (arxiv, 19.11)

4A qarori bilan `new-junior/etalon/etalon.html` muzlatildi — qayta yig'ilmaydi. Shu sabab uning yig'uvchilari shu yerga ko'chdi
(dvigatel 1a bosqichi, 19.11 02:40):

- `yig.mjs` — etalon sahifasi (`bosh.mjs` + `ekranlar.mjs` → `etalon.html`)
- `reja-yig.mjs` + `reja-variantlar.mjs` — 16.11 dagi reja variantlari sahifasi (`arxiv/reja-variantlar-2026-11-16.html`)
- `tepalik-yig.mjs` + `tepalik-rasmlar.mjs` — 16.11 dagi tepalik rasmlari sahifasi (`arxiv/tepalik-rasmlar-2026-11-16.html`)
- `.yigma*.mjs` — ular yasagan vaqtinchalik fayllar (o'sha kundagi holat)
- `etalon-sahifa.mjs` — 1b da (19.11 02:56) demo yig'masidan ajratilgan etalon sahifasi chizilishi; demo uslubi shundan olinardi.
  2b da (19.11) uslub to'g'ridan-to'g'ri `dvigatel/shablon.html` dan olinadigan bo'ldi va bu fayl shu yerga ko'chdi.
  Yurgizish uchun: `bosh.mjs`, `qismlar.mjs`, `darslar/001-tanishuv/ekranlar.mjs` dan keyin ulanadi (o'zgaruvchilari: `E`, `bosh`, `V`, `HARAKAT`, `MAKET`)

Bu skriptlar `bosh.mjs` va `ekranlar.mjs` ni o'z papkasidan o'qiydi — ular endi `new-junior/dvigatel/` da, shuning uchun bu yerdan
to'g'ridan-to'g'ri ishlamaydi. Kerak bo'lsa: ikkala faylni yoniga nusxalab yurgiziladi. Ko'chishdan oldingi to'liq holat —
`arxiv/zaxira-2026-11-19-dvigatel-1a-oldin.tar.gz`.
