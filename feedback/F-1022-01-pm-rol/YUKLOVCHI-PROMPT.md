# YUKLOVCHI SEANS — 24.10.2026 qisman reliz (5 PM dars → CRM)

Siz yuklovchi Claude seansisiz. Vazifa: tayyor paketdagi 5 dars faylini CRM'ga (go.coddycamp.uz, kurs «AI startup», id 20) yuklash.
Faqat yuklash, tekshirish va hisobot. Kod, darslar, skriptlar, reestr — TEGILMAYDI.
Chatda doim o'zbekcha javob bering. Halol bo'ling: nima qilinmagan yoki tekshirilmagan bo'lsa, ochiq ayting.

## 0. Boshlashdan oldin o'qing (shu tartibda)
1. `/home/kali/Desktop/internetLesson/YUKLASH_PROTOKOLI.md` — doimiy qoidalar (asosiy hujjat).
2. `/home/kali/Desktop/internetLesson/feedback/F-1019-11-crm-yuklash/JURNAL.md` — «Usul» bo'limi: qanday yuklanadi, tuzoqlar.
3. Paket: `/home/kali/Desktop/internetLesson/yuklash-2026-10-24-prod/` — `README.md`, `HISOBOT.md`, `yakka/<N>-Modul/ROYXAT.md`, `yuklangan.csv`.
Loyiha papkasi: `/home/kali/Desktop/internetLesson/` (kichik «i»). `InternetLesson` (katta «I») — eski nusxa, tegilmaydi.

## 1. Holat (tekshirilgan, ma'lumot uchun)
- Paket: commit `d7ff60ef`, 5 PM dars, hammasi v4 → v5. lint:jsx ✓, smoke-lms ✓, smoke-preview 5/5, hukm O'TDI.
- Server sharti BAJARILGAN (24.10 21:04): GitLab `53b9388`, prod health `0.1.0+53b93883`, catalog 183. Serverga hech narsa qilmaysiz.
- Nima o'zgargan (o'quvchi ko'radigan): o'quvchi — startapchi, ish bajaruvchi — AI («dasturchi» olib tashlandi), m6-02 da gap aytuvchi — «ustoz»; mentor uchun har ekranda «Bu slayd nima uchun»; 1-ekranda mentor «Natijani ochish» tugmasi.

## 2. Yuklanadigan darslar (CRM material id'lari ma'lum — ROYXAT'da va csv'da)
| Modul · bo'lim | Dars (uz nomi) | Yangi fayl | md5 | CRM uz / ru |
|---|---|---|---|---|
| 5 · 75 | Sinfdoshingiz sahifangizni ochsa, nimani ko'radi? | `5-Modul/07-PmLesson12-v5.jsx` | `7ce12e4dcc99b691b6ea270e17abc227` | 16397 / 16396 |
| 5 · 75 | Ilova nimani yozib qoladi? | `5-Modul/12-PmLesson13-v5.jsx` | `7e2d3024cf0939dc21737534f0704aff` | 16406 / 16407 |
| 6 · 90 | Bitta xato — nechta odam ketadi? | `6-Modul/06-PmLesson16-v5.jsx` | `9d2e8bb2d18b7ee8c44e84dfa01d962c` | 16427 / 16424 |
| 6 · 90 | Saytingiz hozir ochilyaptimi? | `6-Modul/13-PmLesson18-v5.jsx` | `857f19e371c3692db008903b0c969bf4` | 16438 / 16441 |
| 8 · 81 | Bitta gapni uch kishi bir xil tushunadimi? | `8-Modul/02-PmLesson22-v5.jsx` | `c4f5a97e8185b1a75b907ee07c69568b` | 17121 / 17122 |
Fayllar: `yuklash-2026-10-24-prod/yakka/<N>-Modul/`. Jami 5 dars, 10 qator (uz + ru, bir xil fayl).

## 3. Ish tartibi
1. Foydalanuvchidan Chrome'da go.coddycamp.uz ga KIRGANINI tasdiqlab oling. Parol/token kiritmaysiz.
2. Har dars: bo'limda shu material (uz id, keyin ru id) → «Tahrirlash» → **faqat JSX faylni** yangi fayl bilan almashtirish. Avval material id va nom ROYXAT bilan mosligini tekshiring.
3. Usul 19.10 dagidek: yashirin `<input type=file multiple>` orqali fayllar sahifaga qo'yiladi → `editQuestion(id)` → fayl `#editLessonRunnerFile` ga → forma (`editSubmit`) yuboriladi.
   **TUZOQ:** `editQuestion` formani AJAX bilan qayta chizadi — formani HAR SAFAR qaytadan qidiring.
4. **Tekshirish (majburiy, har qator):** LMS'dagi yuklangan faylni (`…/uploads/lessons/lesson_runner/<hash>.jsx`) yuklab olib, md5 ni jadval bilan solishtiring. Mos kelmasa — qayta yuklang; ikkinchi marta ham mos kelmasa — TO'XTANG va foydalanuvchiga ayting.
5. Har dars tugagach `yuklangan.csv` dagi shu qatorga: `yuklandi` = `2026-10-24` (material id'lar allaqachon yozilgan — mos kelmasa izohga yozing va to'xtang).

## 4. Taqiqlar
- Sarlavha, tartib, til, tur, holat (Draft/Active) — O'ZGARMAYDI. Faqat fayl.
- Paketda yo'q narsaga tegilmaydi: boshqa darslar, uyga vazifalar (Practice), Learn 3148.
- Hech narsa o'chirilmaydi, arxivlanmaydi, Active qilinmaydi.
- Nomuvofiqlik bo'lsa (material topilmadi · nom mos emas · eski fayl nomi kutilgandek emas) — TO'XTANG, foydalanuvchiga ayting.
- Faqat `yuklash-2026-10-24-prod/yuklangan.csv` ga yozasiz. Kod, `src/`, `scripts/`, reestr, jurnal — yo'q. Commit, push — YO'Q.
- Parol, token, cookie qiymatlarini chatga yoki faylga yozmang.

## 5. Tugagach
1. Hisobot: 5 dars / 10 qator, md5 ✓ soni, to'xtagan joylar (sababi bilan). `yuklangan.csv` ni ko'rsating (bo'sh `yuklandi` qolmasin).
2. Muhrlashni FOYDALANUVCHI ruxsati bilan yurgizing:
   ```
   cd /home/kali/Desktop/internetLesson && node scripts/lms-farq.mjs muhrla yuklash-2026-10-24-prod/yuklangan.csv --kim claude-yuklovchi-F-1022 --server 53b93883
   ```
   Natijasini foydalanuvchiga ko'rsating. Commit — faqat foydalanuvchi buyrug'i bilan.
3. Prod smoke taklif qiling (foydalanuvchi qiladi): 5 darsdan birini LMS preview'da mentor sifatida ochib, 1-ekranda «Natijani ochish» va eslatmada «Bu slayd nima uchun» ko'rinishini tekshirish.
