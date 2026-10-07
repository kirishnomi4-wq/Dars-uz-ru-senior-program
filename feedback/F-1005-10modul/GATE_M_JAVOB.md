# 10-Modul — foydalanuvchi qarorlari (agentlar uchun MAJBURIY)

## Qaror-0 · 05.10.2026 (sahifa `qaror-0.json`, javob: hammasi A, nomlar va manba tasdiqlandi)

1. **Misol-ip — «Maydon» davomi (IP-q0 A).** 9-Moduldagi MVP endi o'lchanadi, sinaladi, himoyalanadi va prodga chiqadi:
   1 OKR (bosh raqam — haftada band qilingan vaqtlar) · 2 uch hodisa o'z jadvalimizga · 3 dashboard · 4 A/B (tugma matni) · 5 ega sahifasi zaifliklari + 2FA ·
   6 telefon raqamlari — maxfiylik siyosati · 7 domen, SSL, monitoring · 8–9 prod va code review · 10–11 yillik yo'l, 5 daqiqalik pitch.
2. **O'quvchi loyihasi (IP-q1 A):** 1–7-darslar — 9-Modulda boshlagan o'z MVP si (Mentor misoli — Maydon) · 8–9 — o'zi tanlagan eng yaxshi loyihasi · 10–11 — yil bo'yi qurgan hamma loyihalari.
3. **Repo (REPO-q0 A):** `maydon` davom etadi, 10-Modul boshlanishi — 9-Modulning `dars-11-done` holati; o'quvchi o'sha fork'da ishlaydi.
   Repo'ga faqat «qur» bosqichida yoziladi — 9-Modul repo'si push qilinib yopilgandan keyin.
4. **Teglar (REPO-q1 A):** `m10-dars-NN-start` / `m10-dars-NN-done`.
5. **Hodisalar (TEX-q0 A):** o'z tizimimiz — `hodisalar` jadvali, `POST /hodisalar`, saytda bitta yozish funksiyasi; uch hodisa: sahifa ochildi · vaqt-tanladi · band-qildi. Umami qoladi — ikki tizim sonini solishtirish.
6. **Dashboard (TEX-q1 A):** har 5 soniyada so'rov; «hozir saytda» = oxirgi 5 daqiqada hodisa yuborgan brauzerlar.
7. **A/B (TEX-q2 A):** o'zimiz — brauzer A yoki B ni tasodifiy oladi va eslab qoladi, har hodisaga `variant`; dashboard'da «band qildi / vaqtni tanladi» ulushi.
   Mentor gipotezasi: tugmada tanlangan soat yozilsa («18:00 ni band qilish»), ko'proq odam band qiladi.
8. **Xavfsizlik (TEX-q3 A):** boshlang'ich tegda ataylab 3 zaiflik (SQL injection — ega qidiruvida xom SQL · XSS — ega sahifasida ism HTML bo'lib chiqadi · sir kodda — `JWT_SECRET` zaxira qiymati);
   o'quvchi topadi va yopadi; 2FA — ega kirishiga telefon ilovasidagi 6 xonali kod; qoida: tekshirish faqat o'z saytingizda.
9. **Domen (TEX-q4 A):** bepul manzil — Netlify sayt nomi, SSL o'zi; domen sotib olish va DNS — Mentor misolida.
10. **Monitoring (TEX-q5 A):** UptimeRobot — sayt va Backend `/health`; bepul kanallar tayanchda tekshiriladi.
11. **A/B foydalanuvchilari (ISH-q0 A):** darsda sinfdoshlar, real odamlar — uyga; natija keyingi darsda dashboard'da; «10 kishi xulosa uchun kam» halol aytiladi.
12. **Code review (ISH-q1 A):** GitHub Pull Request — sinfdosh izoh yozadi, o'quvchi har izohga «nega shunday qildim» deb javob beradi; Mentor misoli — Maydon PR'i.
13. **Pitch (ISH-q2 A):** 5 daqiqa — muammo → yechim → foydalanuvchi hikoyasi → raqamlar → keyingi qadam; juftlikda baholash varag'i bilan.
14. **Nomlar va App.jsx (NOM ✓, NOM-q0 A):** `00-NOMLAR.md` tasdiqlangan; App.jsx 8-blok 13 qator (`m8-01…m8-13`), `comp` «qur» da.

**Foydalanuvchi izohi (so'zma-so'z ma'nosi):** halol, aniq, o'ylab, shoshilmasdan, mexanizmga amal qilib. Har dars MD da beriladi — foydalanuvchi ko'radi va ChatGPT auditiga beradi,
keyin to'liq yuboradi. Auditdagi band real mahsulotimiz va qoidalarimizga mos kelsa — olinadi, mos kelmasa — qabul qilinmaydi (Filtr).

## GATE M · 05.10.2026 (sahifa `gatem-1.json`, javob `10M-GATE-1`) — 11 dars ✓, tayanch ✓, taqiqlar ✓

Savollar (hammasi A):
- **M-q0 A — 1-dars kod ekrani:** JS `foiz()` o'rniga **Neon SQL topshirig'i** — o'quvchi bosh raqamni `bandlar` jadvalidan sanaydi (checklist + «Bajardim»); foiz hisobi 6-ekran surgichida qoladi (PM_DARS_ETALON 26).
- **M-q1 A — 7-dars monitoring:** `/health` **Database'ga so'rov yubormaydi** — Backend holatini aytadi; UptimeRobot har 5 daqiqada: Render uyg'oq (bitta xizmat 750 soatga sig'adi), Neon uxlaydi.
  Database xatosi ega sahifasi va dashboard'da ko'rinadi. Darsda qoida: «monitoring ham limit sarflaydi — bitta bepul xizmatni uyg'oq tutasiz».
- **M-q2 A — `synchronize: true`:** 8-dars prod ro'yxatiga bitta tushuntirish qatori (eski teg push qilinmaydi; prod'da `synchronize` xavfli, migratsiya — keyingi modullarda); kod o'zgarmaydi.

MD lar ChatGPT auditidan darsma-dars o'tadi — Filtr bilan (`NN-FILTR.md`).

## GATE M · 05.10.2026 18:47 (sahifa `gatem-2.json`, javob `10M-GATE-2`) — 11 dars ✓, tayanch ✓, taqiqlar ✓

11 MD ning hammasi ChatGPT auditidan Filtr bilan o'tgan (`01-FILTR.md` … `11-FILTR.md`). Savollar (hammasi A):
- **06-q0 A — `hodisalar` saqlash muddati:** 60 kun (oy maqsadi va o'tgan oy, 8-dars A/B yakuni sig'adi); siyosatda «Saytdagi harakatlar 60 kun saqlanadi»; o'chirish — 6-dars A1 kodi.
- **07-q0 A — 7-dars menyu osti:** «sayt yiqilsa, ogohlantirish sizga keladi» (avval «birinchi bo'lib siz bilasiz» — kafolat edi); 6-dars yakunidagi «Keyingi dars» qatori ham shunga.
- **08-q0 A — modul g'oyasi va 8-dars menyu osti:** g'oya «… — MVP haqiqiy foydalanuvchi uchun mustahkamlanadi.» · `m8-08` osti «eng yaxshi loyihangiz prod ro'yxati bo'yicha».
- **09-q0 A — `synchronize: true`:** M-q2 qoladi — kod o'zgarmaydi; 9-darsda birlashtirishdan oldin «Files changed»da jadval fayli (`….entity.ts`) yo'qligi tekshiriladi, README «keyin»da yoziladi.

Qo'llandi: App.jsx 8-blok (`idea`, `m8-07`, `m8-08` osti; esbuild ✓), `00-NOMLAR.md`, 06–09 MD, tayanch 9.16, 9.17, 9.19.
Keyingi bosqich — «qur»: 9-Modul pilotidan keyin, faqat foydalanuvchi buyrug'i bilan (TOTP kutubxonasi, chegara mexanizmi va Render proksi IP usuli — «qur» dan oldin asosiy seans muzlatadi).
