# F-1109-06 · Mentor kursi vizual taklifi (09.11)

Artifact (qaror sahifasi): https://claude.ai/artifact/2cVgrMJHBMpg6rPLT5KpT8 — 49 ekran: 34 taklif (oldin/keyin), 15 qoldirish (sababi bilan).
Dars kodiga TEGILMAGAN. «Keyin» suratlari jonli saytda brauzer nusxasida `.mk-scene` almashtirilib olingan (`inject.mjs`).

- `mock/<id>.html` — har taklifning sahna HTML'i (umumiy uslub `z.css` — inject paytida qo'shiladi; pg1-02, pg2-10, pg2-17, jest2-15, ws2-05 o'z CSS'i bilan).
- `qaror/<id>.json` — ekran, naqsh (A gapli karta · B xulosada rasm yo'qoladi · C kichik/xira), oldin/keyin tavsifi yoki qoldirish sababi.
- O'lchov: `olch.mjs` (331 ekran, oxirgi holat) + `toldir.py` (o'ng sahna 447,62,811,580 @1280 — 16px katak, fon emas ulushi) → `natija.tsv`, `stat.json`.
- `build.py` + `sablon.html` → artifact sahifasi. `ekran.py <dars> <n>` — ekran matni va sahna kodi.
- Haqiqiy ma'lumot manbalari: `manba/*-out`, `manba/*-ai/XULOSA.md` (har mock'da faqat shulardan raqam/xabar).

Keyingi qadam: foydalanuvchi qarori (artifactdagi «Javobni nusxalash») → qabul qilinganlari darsga: `z.css` → dvigatelga umumiy komponentlar (Flow, Lanes, Timeline, States, Matrix), har ekran sahnasi `<dars>/parts/0[5-8]*.jsx` da almashtiriladi, segmentlar bilan qadamma-qadam ochiladi; RU tarjima; ovoz; deploy. Qonun taklifi: M50 «gapli karta o'rniga mexanizm chizmasi; xulosa qadamida rasm yashirilmaydi».
Topilmalar: Jest-2 15-ekran chap sarlavhasi kesilgan; WS-1 15-ekran sarlavhasida «42 soniya», haqiqiy 43 s.

## 09.11 19:55 — saqlash (kompyuter qayta yoqilishidan oldin)
- `olchov/` — 331 ekran o'lchov jadvallari (`hammasi.tsv`, `qism.tsv`, `nomzod*.tsv`, dars-bo'yicha `*-0N.tsv`) va yordamchi skriptlar (`dom.mjs`, `qadam.mjs`, `royxat.py`).
- `artifact-index.html` — artifactning o'zi (rasmlarsiz). Rasmlar: `/home/kali/Desktop/zaxira-2026-11-09-F-1109/vizual-rasm/` (git'dan tashqarida, 50 MB).
- `ekran.py` endi shu papkadagi `natija.tsv` ni o'qiydi.
- Foydalanuvchi tanlovlari artifactda brauzer xotirasida (`mk-vizual-f110906`) — qayta yoqilganda saqlanadi; javob chatga «Javobni nusxalash» bilan keladi.
