# 12-dars «Loyiha kuni: barqarorlashtirish» — tashqi audit (ChatGPT) Filtr bilan, 08.10.2026

Filtr tartibi (`konveyer/1-MD.md`): har band → darsda bormi (grep) → fakt (tayanch 1.10, 1.12, 1.13, 3, 9.26, 9.38; 4, 5, 8, 10-darslar) → qonun → tasdiqlangan qaror (`GATE_M_JAVOB.md`) → auditoriya. Hukm: Qabul / Qisman / Rad / Allaqachon + sabab.
Zaxira: scratchpad `zaxira-12/`. Skript: scratchpad `f12/tuzat12.py` (12 — 90 juftlik, tayanch — 3 + 1.13 qatori + 9.58; bir yurishda o'tdi) + 11-darsda Telegram soni (2 joy). F-1007-470.

Audit bahosi 5.5/10. Hukm: **Qabul 18 · Qisman 7 · Rad 3 · Allaqachon 23** (sarlavhalar qatori bilan).
⚠️ **Siz hal qiladigan savol (1, 28-band) — o'zgartirilmadi:** tuzatish `git push` bilan Render'ga chiqadi, keyin qayta tekshiriladi. Kursda lokal Backend yo'q: telefon (Expo Go) va sayt Render'dagi Backend bilan ishlaydi — 05, 08, 10-loyiha kunlari ham shunday.
  Variantlar: **(A)** hozirgidek (sinfda real foydalanuvchi — sinfdoshlar, pul yo'q; qayta tekshiruv darhol, ikkinchi marta ham buzilsa — «qoldi») · **(B)** A + ikkinchi tuzatish ham yiqilsa, agent `git revert` bilan oxirgi tuzatishni qaytaradi va push qiladi (sinamagan kod odamlarda qolmaydi; +3–5 daqiqa) · **(C)** lokal Backend — yangi mexanizm (11–13-Modul tayanchi, hamma loyiha kunlari).
  Mening tavsiyam — **B**: bitta qator qo'shiladi, arxitektura o'zgarmaydi.
⚠️ **Siz tasdiqlagan qarorga zid band — o'zgartirilmadi:** 3 (8-dars «Doimiy o'yin» `GET /oyinlar` da yaratilishi — **M-q4 A**: shu takror 12-dars topilmasi) · 11 (`.env` ni `git ls-files` bilan — tayanch 3) · 32 (hook «Aynan!/Qiziq fikr!» — T-028).
⚠️ **Tasdiqlangan tayanch matniga tegadigan Qabul:** 1.12 (Mentor natijasi — 1, 2, 3, 4 buzilmadi, 5 buzildi) · 1.13 (12-qator: 4 · 1 · 1) · 3-jadval `12-done` · TS 7 (topilma ustuvorligi — GATE M da tasdiqlangan edi) · yangi 9.58.

| № | Audit | Hukm | Nima qilindi / sabab |
|---|---|---|---|
| 1 | Tuzatish qayta tekshirilishidan OLDIN push — Render'ga chiqadi | **Qisman** | ⚠️ Yuqoridagi savol. Kurs arxitekturasi: lokal Backend yo'q, qayta tekshiruv faqat chiqarilgan versiyada mumkin. **B qo'llandi (08.10):** ikkinchi tuzatish ham yiqilsa — agent `git revert` + push; `XATOLAR.md` «qoldi — qaytarildi». A3 4-bandga bitta qator. |
| 2 | 10-dars kichik harf xatosini 12-darsga qoldirish | **Qabul** | 10-darsda tuzatilgan (F-1007-468). 12-darsdan 4-topilma olib tashlandi: Mentor 4-yo'li «buzilmadi» («ab12cd» ham qabul qilinadi), `XATOLAR.md`, 2-amaliyot Yordami, kartochkalar, 2 va 5-ekran sahnalari. |
| 3 | 8-dars arxitekturasi 12-darsga xato bo'lib ko'chmasin | **Rad** | M-q4 A: «Doimiy o'yin» takrori — 12-dars topilmasi. Sabab — real kod (9.51), ataylab qo'yilmaydi; pilotda takrorlanmasa — MD moslanadi. |
| 4 | `12-start` README «ikki topilma bor» — kashfiyotni buzadi | **Qabul** | README'da topilmalar soni va joyi aytilmaydi; REPO 1, TS 14. |
| 5 | Mentor 3/2 natijasi — faqat pilotdan | **Qabul** | 9.51: natija ⛔ pilotda muhrlanadi, o'quv muvozanati uchun tanlanmaydi. Joriy kutilgan natija — 4/1. |
| 6 | Yakun «mahsulotingiz buzilmadi» — juda kuchli | **Qabul** | «Tekshirilgan yo'llarda bu safar topilma chiqmadi.» (49) · A1: «… — bu ham natija.» (65) · A3: «`XATOLAR.md` tayyor: bu safar topilma chiqmadi.» (47). |
| 7 | «Mahsulotimda hali yo'q» bo'lsa «besh yo'l buzilmadi» deyilmasin | **Qabul** | `XATOLAR.md` da tekshirilgan yo'llar — «buzilmagan», «hali yo'q» va ulgurilmagani — «tekshirilmagan»; yakun sarlavhalari «Besh yo'l …» o'rniga «Tekshiruv yozildi — …» (45, 49). |
| 8 | A1 «Davom etish» uchta kartadan keyin — «besh yo'l yozildi» chiqmasin | **Qisman** | «Davom etish» qoidasi qoldi (MD qarori, SABOQ E 55); sarlavhalardan «Besh yo'l» olib tashlandi (7-band), ulgurilmagani `XATOLAR.md` da. |
| 9 | «Bajardim» to'g'rilik emas | Allaqachon | Yakun karta belgilaridan (ko'rilgan natija); «Tuzatish qilindi» va «takrorlanmadi» — alohida. |
| 10 | `git diff --stat` yangi funksiyani ko'rsatmaydi | **Qabul** | «Keyin `git diff`: o'zgargan qatorlarni o'qing (agent ko'rsatgan qatorlar bilan solishtiring)». |
| 11 | `.env` — `git status` yetmaydi | **Rad** | Tayanch 3: `git ls-files` faqat kalit qo'shiladigan darslarda; 12-darsda yangi kalit yo'q. |
| 12 | Topilma ustuvorligi sodda | **Qabul** | «avval — maxfiy ma'lumot, pul yoki yozuvlarga zarar yetkazadigan; keyin — asosiy ishni to'xtatadigan; keyin — noto'g'ri narsa ko'rsatadigan yoki yuboradigan» — 2-amaliyot 1-band, A-4. ⚠️ TS 7. |
| 13 | Kichik harf va takror o'yin — qaysi muhim | **Qabul** | Kichik harf yo'q (2-band); qoida 12-band. |
| 14 | UNIQUE qaysi ustunlarda | **Qabul** | `doimiy = true` qatorlarda tashkilotchi, maydon va o'yin vaqti birga noyob (4-dars yangi o'yinni shu uchtasini nusxalab yaratadi — 9.26); ustun nomlari — 11-Modul jadvalidan, ⛔ pilot. REPO 2. |
| 15 | Telegram — faqat yutgan INSERT da | Allaqachon | REPO 2 + «yaratildi faqat yutgan so'rovda». |
| 16 | Qo'lda ikki telefon — takrorlanmasa ham «yo'q» emas | **Qabul** | Belgilar ostida: «Buzilmadi» — shu urinishda kutilgani bo'ldi; boshqa paytda chiqmaydi degani emas. (82); kartochka 7 shu fikrga almashdi. |
| 17 | Mentor 5-topilmasi — deterministik sinov bilan | **Qabul** | ⛔ REPO 1, 4: avval agent skripti — ikki `GET /oyinlar` bir lahzada, 10 marta; keyin ikki telefon. O'quvchi yo'li — ikki telefon. |
| 18–19 | Tekshiruv hisoblari `namuna = false` · taklif tekshiruvi mo'rt | **Qisman** | Yangi belgi olinmadi (10-FILTR 20); hisoblar `id` bo'yicha o'chiriladi; «asosiy ishni qilmang» ogohlantirishi turibdi. |
| 20 | Tekshiruv o'yinlari real foydalanuvchiga ko'rinadi | **Qisman** | O'qituvchi eslatmasi: «dars oxirigacha qoldirmang»; yashirin o'yin uchun yangi belgi — olinmadi (4–12-darslar sanog'iga tegadi). |
| 21–24 | O'z Telegram'i · tozalash ⛔ · faqat `id` · `XATOLAR.md` shakli | Allaqachon | — |
| 25 | Topilma yo'q `XATOLAR.md` matni rost bo'lsin | **Qabul** | 7-band. |
| 26–27 | «qoldi — vaqt yetmadi» · ikkinchi aylanish bir marta | Allaqachon | — |
| 28 | Ikkinchi tuzatish ham push'dan oldin tekshirilsin | **Qisman** | 1-band savoli. |
| 29 | «Yangi versiya» — chiqarilgan joyda bir marta tekshirilgach | Allaqachon | A3 4-band: «Odamlar ochadigan manzilda … tuzatilgan yo'lni bir marta qaytaring». |
| 30 | APK yo'li ortiqcha | Allaqachon | Faqat `mobil/` o'zgarsa; navbat kutilmaydi. |
| 31 | EAS «15» — eskirishi mumkin | **Qabul** | «bepul rejada Android build soni cheklangan». |
| 32 | Hook «Aynan!/Qiziq fikr!» | **Rad** | T-028, T-067. |
| 33 | Hook varianti besh yo'lni qamramaydi | **Qabul** | «Muhim yo'llarni o'zim birma-bir tekshiraman» (43). |
| 34–36 | 2-ekran xulosasi · 1, 2-savol | Allaqachon | Xulosa endi bitta topilma haqida (91). |
| 37 | «yangi yo'l ochadi» — umumiy | **Qabul** | «yangi funksiya yana tekshirilmagan joy qo'shadi» — 5-ekran xulosasi (105), kartochka. |
| 38–41 | Anti-misollar · `git add <fayl>` · login/parol kalitda yo'q · `id` avval | Allaqachon | — |
| 42 | = 17 | **Qabul** | 17-band. |
| 43 | 5-yo'l nomi | Allaqachon | Tayanch 1.12 (tasdiqlangan). |
| 44 | «tekshiruv — bir marta» to'lov kartasi bilan to'qnashadi | **Qabul** | «bitta yo'l uchun bitta yozuv (ichida bir necha qadam bo'lishi mumkin)». |
| 45–46 | 5-dars qolgan usullari · to'lov qatorlari | Allaqachon | — |
| 47 | «Endi siz bilasiz» 5-qator chala | **Qabul** | «Yangi versiya o'zgargan qismga qarab chiqadi: Backend — Render, ilova — yangi o'rnatish fayli, sayt — Netlify.» (110). |
| 48–49 | «Tuzatish qilindi va … takrorlanmadi» · «barqaror» yo'q | Allaqachon | — |
| 50 | 90 daqiqa — 130–220 | **Qisman** | ⛔ pilotda taymer; ulgurmagan yo'l — «tekshirilmagan». |
| Sarl. | Sarlavhalar | Allaqachon | Hook varianti — 33. |
| TS | TAYANCHGA SAVOL 1–17 | — | 1 — Qabul (5) · 2 — Qabul (17) · 3 — Qabul: Telegram xabarida son yo'q (9.38) · 4 — Qabul (2) · 7 — Qabul (12) · 8 — Qabul: 1-taklif «O'yinlar ro'yxatiga qidiruv qatori qo'shaman.» (tuzatish bitta) · 14 — Qabul (4) · 17 — qoldi · qolganlari — auditor qabul qildi. |
| TS+ | 18–28 | Javob berildi | 18 → savol sizda (1) · 19 → 4-topilma yo'q, Mentor 4/1 · 20 → M-q4 A, o'zgarmaydi · 21 → ha · 22 → olib tashlandi · 23 → yo'q (18) · 24 → tashkilotchi, maydon, vaqt (14) · 25 → «yaratildi» faqat yutgan so'rovda · 26 → ha · 27 → ha (12) · 28 → «Tekshiruv yozildi — …», ulgurilmagani «tekshirilmagan». |

## Sinf-supurish
- **Telegram xabaridagi son** (8-dars F-1007-466, 9.38 — u yerda supurish to'liq bo'lmagan): 11-dars (2 joy: A-6, 2-ekran 5-karta) va 12-dars (A-3, 2-ekran, TS 3) — son olib tashlandi. Qidirildi: 12 MD, qolgan joylarda «… / 10» — o'yin kartasidagi son (xabar emas).
- **«Ataylab qoldirilgan topilma»** — 05, 08, 10, 12: 05 va 10 tuzatilgan (F-1007-463, 468); 08 — M-q4 A; 12 — endi bitta topilma. 0 qoldi.
- **«Besh yo'l / hammasi buzilmadi» da'vosi** — boshqa loyiha kunlarida yakun belgilardan: 05 — buzish yozuvi belgilari, 08, 10 — «Kutilganidek» / «Boshqacha» kartalari; «hammasi buzilmadi» degan sarlavha yo'q (grep, 0).
- **EAS «15»** — 08, 10-darslarning o'quvchi matnida yo'q (tayanch 9.x — manba sifatida qoldi).

## Tekshiruv
- `lint:til`: 12 — 0 error, 4 warn (zaxira bilan bir xil); 11 — TOZA; FILTR — TOZA; tayanch — 0 error, 25 warn (o'zgarmagan). `qisqa.py`: 12 ekran (zaxira bilan bir xil natija).
- Python `len`: 2-ekran xulosasi 91 · hook varianti 43 · `QXato` 50 · Mentor 89, 67 · 5-ekran xulosasi 105 · A1 yashil 57, 65 · A3 47 · yakun 49, 45, 49 · kamtarlik qatori 82 · recap 110 — O'lchov yangilandi. ✔ o'rinlari o'zgarmadi.
