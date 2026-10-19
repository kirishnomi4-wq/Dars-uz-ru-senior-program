# lms/ dan ko'chirilgan shared-yo'l fayllari — 2026-10-18 (F-1017-226, DE 221-qonun)

34 ta `*.shared.jsx` (21.09.2026 yig'malari, tashqi kompilyator moduli bilan) + `html-compiler.jsx` (07.09.2026 moduli).
Sabab: LMS'da artefakt almashtirilsa URL o'zgaradi, eski 404 (01.10 tajribasi) — shared yo'li ishlamaydi; 01.10 dan beri hamma dars
kompilyatorni o'z ichida olib yuradi. Relizda shared `.shared` fayli JsLoops/PeanStack `C.logsEach` (F-1017-206) yo'qligidan yiqilgan edi.
Qayta yoqish kerak bo'lsa: `node scripts/build-shared-module.mjs` (yangi modul) → LMS'ga yuklash → yangi URL bilan
`node scripts/preview-reliz.mjs --shared …`. Shu papkadagi fayllar qayta ishlatilmaydi (eskirgan).
