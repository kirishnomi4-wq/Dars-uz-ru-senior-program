# 11-Modul — foydalanuvchi qarorlari (agentlar uchun MAJBURIY)

## Qaror-0 · 06.10.2026 00:30 (sahifa `qaror-0.json`, kod `11M-QAROR-0`; javob: «Ha, hammasi A» — 18 savolning hammasi tavsiya bo'yicha)

Foydalanuvchi izohi (ma'nosi): MD lar ertalabgacha yozilsin; foydalanuvchi ko'radi, ChatGPT auditiga beradi, Filtr bilan tuzatiladi, keyin «qur». MD agentlari — ikki to'lqin (3 pilot + 13).

1. **Mentor misoli (IP-q0 A):** yangi mahsulot «Maydon» olamidan o'sadi — **jamoa yig'ish** mobil ilovasi: o'yinchi «bugun 18:00 da odam kerak» deb e'lon qiladi, boshqalar qo'shiladi.
   Olam tanish (o'yinchi, maydon), mahsulot va repo yangi. 1-darsda bu Mentorning 10 g'oyasidan biri; 2-darsda RICE; 3–4-darslarda 10 intervyu uni ikkinchi g'oya bilan solishtiradi.
   12-modulga yarashadi («kim keladi» — real vaqt, o'yindan oldin eslatma — push). Raqamlar va ikkinchi g'oya — tayanchda, «Mentor misoli» deb.
2. **O'quvchi g'oyalari (IP-q1 A):** uch manba — 9-Modul 1-darsidagi «atrofdan 10 muammo» (saqlangan bo'lsa ochiladi) · o'z MVP sining «Keyin» ro'yxati · yangi kuzatuv.
   Har g'oya — muammo + kim uchun + yechim. O'z MVP sini davom ettirish ham g'oyalardan biri bo'lishi mumkin — RICE hal qiladi.
3. **Nom (IP-q2 A):** **«Maydon Jamoa»**; «jamoa» so'zi faqat bitta ma'noda (futbol jamoasi).
4. **Mentor repo'si (REPO-q0 A):** yangi ochiq repo `maydon-jamoa` (Azizbekcrypto), modul bo'yi bitta: 7-darsda `prototip/` (React + Vite, Motion) · 9-darsdan `app/` (Expo) · 10-darsdan `backend/` (NestJS).
   `maydon` repo'siga tegilmaydi. Repo'ga faqat «qur» bosqichida yoziladi; GitHub'da ochish va push — buyruq bilan.
5. **Teglar (REPO-q1 A):** `m11-dars-NN-start` / `m11-dars-NN-done`.
6. **O'quvchi repo'si (REPO-q2 A):** o'z final repo'sida (7-darsda o'zi ochadi). Blokning har qadami Mentor misolida ko'rsatiladi: prompt namunasi `{…}` joylari bilan + kutilgan natija (telefon maketi);
   o'quvchi promptni o'z mahsulotiga to'ldirib, o'z repo'sida yuboradi. «Ortda qoldingizmi» — Mentor repo'sining tegi (Mentor misolini ochib ko'rish uchun).
7. **Platforma tanlovi (PLAT-q0 A):** 8-dars — PM-qaror: to'rt savol (foydalanuvchi mahsulotni qayerda ochadi · telefon imkoniyati kerakmi — kamera, eslatma · havola bilan tez ulashish muhimmi ·
   qaysi stekni bilasiz) → web yoki mobil + bir gapli asos. Mentor misoli — mobil. 9–14-darslarda blokda Mentor misoli mobil, o'quvchi o'z trekida.
8. **Prototip (PLAT-q1 A):** 7-dars platformaga bog'liq emas — repo'da React (Vite) + Motion (9-Modul animatsiyalari), ma'lumot namuna, 2–3 ekran bosiladi; qog'ozdagi wireframe surati talabga ilova.
   9-darsda mobil trek prototipni agent bilan Expo'ga ko'chiradi, web-trek uni adaptiv qilib PWA ga aylantiradi.
9. **Navigatsiya (PLAT-q2 A):** rasmiy default — `npx create-expo-app@latest`: Expo Router (har fayl — bitta ekran) va TypeScript; 6-Moduldagi Stack Navigator bilan bir gapli ko'prik.
10. **RN kodi darsda (PLAT-q3 A):** o'qiladigan qisqa bo'lak + chizilgan telefon maketi: harakat → telefon ekrani o'zgaradi (6-Modul `m6-09` naqshi). Haqiqiy ishga tushirish — amaliyot blokida
    o'z telefonida Expo Go bilan. Kod oynasi (QKod) faqat web qismida (adaptiv CSS, PWA manifest).
11. **Expo Go (PLAT-q4 A):** har o'quvchi o'z telefonida; QR — bitta Wi-Fi; boshqa tarmoq yoki telefon yo'q bo'lsa — zaxira yo'llar tayanchda rasmiy hujjatdan; har tashqi qadamda xato yo'li bitta gap (P-026).
12. **Stek (PLAT-q5 A):** 9–10-Modul steki — Backend NestJS (TypeORM) + Database Neon + deploy Render; mobil — Expo (React Native), web — React (Vite) + Netlify; agent — Antigravity;
    kirish — token bilan (9-Modul `POST /kirish` naqshi, endi o'yinchilar uchun).
13. **Demo Day 7 (DARS-q0 A):** oldingi Demo Day'lar kabi `type: 'Demo'`, `comp` siz qator — dars qurilmaydi, MD yo'q; tayyorgarlik — 16-dars.
14. **Yakkama-yakka (DARS-q1 A):** 15-dars — qisqa PM dars, 12 ekran: roadmap'ni ochadi, har bandga holat (bajarildi · kechikdi · boshlanmadi), uchta risk va har biriga bitta qadam → tuzatilgan reja
    (16-dars o'qiydi). Suhbatning o'zi — o'qituvchi bilan; Mentor ekranida har o'quvchi varag'i.
15. **Intervyu (ISH-q0 A):** 9-Modul texnikasi bir ekranda eslatiladi; yangisi — ikki g'oyani solishtirish: ikkala auditoriyaga bir xil savollar, «hozir buni qanday hal qilyapsiz?» va harakat belgisi
    (masalan telefon raqamini qoldirdimi). 3-darsda sinfdosh bilan 1–2 intervyu (auditoriya tengdosh bo'lsa — haqiqiy yozuv), qolgani uyda; 4-dars — 10 yozuv jadvali: takrorlangan javoblar sanog'i → final g'oya.
16. **Sinov (ISH-q1 A):** 13-darsdagi sinov uyda — 12-dars uyga vazifasi: auditoriyadan 3 kishi, 9-Modul kuzatuv shabloni; 13-dars yozuvlardan eng muhim muammoni tanlaydi va darsda tuzatadi.
    Yozuv yo'q bo'lsa — dars boshida sinfdosh bilan sinov.
17. **Keyslar (KEYS-q0 A):** 1 K18 Starbucks · 2 K14 Instagram Stories · 3 K4 Airbnb · 4 K15 YouTube · 5 K16 Amazon · 6 K1 Uzum (mintaqaviy) · 13 K10 Cyberpunk 2077 · 15 keyssiz · 16 K19 iPhone.
    TEX va loyiha kunlari (7–12, 14) — keyssiz.
18. **Nomlar va App.jsx (NOM-q0 A):** `00-NOMLAR.md` tasdiq; App.jsx ga `// ---- 9-Modul` izoh-bloki va `id: '9'` bloki — 17 qator (`comp` «qur» da ulanadi), faqat aniq Edit.

---

## GATE M — `11M-GATE-1` (foydalanuvchi, 06.10 ≈07:20) — ✅ TASDIQ

```
GATE M 11M-GATE-1
Darslar: 01 ✓ · 02 ✓ · 03 ✓ · 04 ✓ · 05 ✓ · 06 ✓ · 07 ✓ · 08 ✓ · 09 ✓ · 10 ✓ · 11 ✓ · 12 ✓ · 13 ✓ · 14 ✓ · 15 ✓ · 16 ✓
Savollar: M-q0 A · M-q1 A · M-q2 A · M-q3 A · M-q4 A · M-q5 A · M-q6 A · M-q7 A · 07-q0 A · 11-q0 A
```

| Savol | Javob | MD da |
|---|---|---|
| M-q0 Expo papkasi | A — `mobil/` | allaqachon (tayanch 3, 9–14) |
| M-q1 web-trek token | A — `localStorage`; foydalanuvchi matni sahifada HTML bo'lib chiqmaydi | allaqachon (tayanch 9.7; 10, 11 «Yordam» gapi) |
| M-q2 16-dars «prototip» | A — «ilova», bo'lak «Jonli demo»; nom «G'oyangiz va ilovangiz guruhni ishontiradimi?» (45), osti «muammo → yechim → jonli demo» | **tuzatildi 07:22:** 16 MD (54 qator + belgi sonlari), 15 MD «Keyingi dars» (3), tayanch (1.9, 2 — yangi «jonli demo» qatori, 4), `00-NOMLAR.md`, App.jsx `m9-16` (o'z bloki, aniq Edit, esbuild ✓) |
| M-q3 pitch | A — 3 daqiqa | allaqachon |
| M-q4 qahva/kofe | A — «qahva»; kursdagi farq — MEXANIZM-TAKLIF 6 | allaqachon |
| M-q5 K1 Uzum (6-dars) | A — qoladi | allaqachon |
| M-q6 PM kod ekrani | A — hozirgidek | allaqachon |
| M-q7 «Ali» | A — qoladi | allaqachon |
| 07-q0 repo | A — Public | allaqachon (07 MD 1-qadam) |
| 11-q0 Neon `UPDATE` | A — qoladi (WHERE bilan, qaytariladi) | allaqachon |

Tekshiruv (07:22): `lint:til` 15, 16 — 0 · o'zaro tekshiruv 16/16 (arena 3/3/3/3, «Keyingi dars» nomlari) toza · `prototipingiz` — 0 qoldiq.
ChatGPT auditi bu javobda yo'q — kelsa, «qur» dan oldin `NN-FILTR.md` bilan ko'riladi.

---

## Audit savollari — `11M-AUDIT-1` (foydalanuvchi, 06.10 ≈09:00)

```
11M-AUDIT-1 / Savollar: HB-q0 A · DD-q0
```

- **HB-q0 A** — harakat belgisi: telefon raqami o'rniga **sinab ko'rishga kun belgilash** («Birinchi versiya tayyor bo'lganda, uni sinab ko'rishga 10 daqiqa vaqt berasizmi? Qaysi kunni belgilaysiz?»). Qo'llandi 09:10 — 3, 4, 5, 16-darslar, tayanch 1.3, 2, 8, 9.43, 9.59 (`04-FILTR.md`).
- **DD-q0** — javob bo'sh keldi; `m9-17` osti o'zgartirilmadi, foydalanuvchidan so'raladi.
  **06.10 12:20 javob:** «final g'oya deylik, tamom» — A ham, B ham emas: osti **«final g'oya»** («prototip» ham, «demo» ham yo'q — bir ma'no ikki so'z muammosi yo'qoladi). App.jsx `m9-17` (o'z bloki, aniq Edit), `00-NOMLAR.md`.
