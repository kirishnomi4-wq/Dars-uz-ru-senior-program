# 14-Modul — ertalabgi hisobot (tungi avtopilot, 08.10.2026 02:30–04:12, F-1008-550…557)

## Qisqasi
- **13/13 MD v3 yozildi va tekshirildi** (9 263 qator). Har dars: ekran soni rejadagidek (16 · 15 · 19 · 10 × 12), arena A/B/C/D 3/3/3/3, `lint:til` 0 xato, sarlavha ≤55, xulosa ≤110, «Keyingi dars» zanjiri ✓.
- **GATE M sahifasi:** https://claude.ai/artifact/Cg9NcbSosNgaFUtGHNTdYj (kod `14M-GATE-1`). Unda: 12 «Modul bo'yi» savol · TAXMIN T1–T20 · tayanch · o'z auditi · 13 dars (qisqa xulosa + to'liq MD). Javob qatorini nusxalab chatga yuborasiz.
- **Agentlar:** 13 ta (3 pilot + 10), faqat MD yozdi; `.jsx` ga hech kim tegmadi. «Qur» yo'q.
- **Commit:** lokal, faqat `feedback/F-1008-14modul` (push yo'q). `src/App.jsx` dagi 14-Modul bloki (17 qator, `comp` siz) — **commitsiz**. Shu faylda 13-Modul seansining o'zgarishlari ham bor (`m11-03`, `m11-06` ulanishi, 08.10) — ularga tegmadim; commit qilinsa, ikkalasi birga ketadi.

## Sizdan kutiladi (tartib bilan)
1. **GATE M** — «Modul bo'yi» 12 savol (birinchi variant — tavsiya, MD lar shu bilan yozilgan) va TAXMIN T1–T20 (kechasi hammasi A). Boshqa variant tanlasangiz — faqat `<!-- TAXMIN Tn -->` belgili joylar o'zgaradi.
2. Har dars: «Tasdiq» yoki «Izoh» (ekran raqami bilan).
3. Keyin: MD larni ChatGPT auditiga berasiz → men Filtr qilaman → «qur» — alohida buyruq bilan.
4. Eski ochiq savol: **12-Modul o'zgarishlari commit qilinsinmi?** (`src/10-Modull` 12 fayl, `feedback/F-1006-12modul`; QA sayti ishlayapti).

## Eng muhim qarorlar (sizning tasdig'ingiz kerak)
- **Pul yo'q, investitsiya so'ralmaydi** — pitch oxiri «Sizdan bitta so'rov: …» (tanishtirish, maslahat).
- **Upwork yosh sharti** — rasmiy sahifa 403, matn tekshirilmagan → M-q2: sonsiz ibora (tavsiya) yoki «odatda 18 yoshdan».
- **Video (2, 9-darslar)** — yuz va ism ixtiyoriy, ommaviy joyga yuklanmaydi, havola faqat ota-ona roziligi bilan va hech qaysi kalitga yozilmaydi.
- **Diamond Challenge** — faqat rasmiy shartlar (14–18 yosh, 2–4 o'quvchi, 21+ maslahatchi, ingliz tilida, 60 soniyalik video, muddat 14.01.2027); YC — «bugungi yo'l emas».
- **13-dars hakami va 12-dars yakkama-yakka** — 12–15 o'quvchi 90 daqiqaga sig'maydi; ikkalasi savol sifatida (M-q8, M-q10).
- **Imlo «ssenariy» ↔ «stsenariy»** — imlo qoidasi «ssenariy» ni beradi (kun.uz izohi), MD larning ko'pi «stsenariy» (M-q1).

## Kechasi o'zim topib tuzatganlar
- `00-MANBA.md`: «hikoya — o'tilmagan» — **xato edi** (grep «shikoyat» ga ilingan); 9-Modulda o'tilgan → tayanch va RU lug'ati tuzatildi (2-dars agenti topdi).
- 07-dars: arena variantida va KOD zaxira yorlig'ida «Demo Day» (9.13 ga zid) → tuzatildi; ildizi — tayanch 2 dagi hakam ta'rifi, u ham tuzatildi; `mdtekshir.py` endi buni ushlaydi.
- 10-dars: video havolasi qatoriga «Ota-onangiz rozi bo'lsa» qo'shildi.
- 06, 09 (Kod darslari) nishon nomlaridan «!» olib tashlandi (Kod — «!» siz, PM — «!» bilan).
- Parallel agentlar Mentor misolini ikki xil yozmasligi uchun 12 va 13-dars agentlariga oldingi darslar matnini yubordim — ikkalasi mosladi.
- Tayanch 9 ga 2-to'lqindan 9 kelishuv (9.16–9.24); tayanch 6 ga 11-dars agenti qayta ochgan rasmiy faktlar (60 soniya — o'zim tekshirdim).

## Halol: tekshirilmagan / faqat «qur» da
- Mentor misolining Lighthouse, kod hajmi va demo o'tishi sonlari — MD da yo'q, «⛔ pilotda o'lchanadi».
- Darslar 90 daqiqaga sig'ishi (5, 6, 8, 12, 13-darslar og'ir), 1280×800 da skrollsiz sig'ish, sinf tarmog'i, ekran yozish vositasi — faqat qurilgan darsda.
- Upwork rasmiy shartlari, lokal grantlar, Diamond Challenge va Y Combinator brend ranglari — tekshirilmagan.
- Ota-ona roziligini maktab qanday yig'ishi — M-q7.

## Fayllar
`00-MANBA.md` · `qaror-0.json` · `00-NOMLAR.md` · `00-MODUL-TAYANCH.md` (9.1–9.24) · `00-TAQIQLAR.md` · `01…13-*-v3.md` · `01/03/07-OZ-AUDIT.md` · `2TOLQIN-OZ-AUDIT.md` · `gatem-1.json` · `vositalar/mdtekshir.py`, `vositalar/kesishma.py` · `JURNAL.md` (har qadam vaqt bilan, MEXANIZM-TAKLIF 4 band).
