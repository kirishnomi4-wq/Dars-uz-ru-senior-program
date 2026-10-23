# YUKLOVCHI SEANS — 23.10.2026 kechki reliz (172 dars → CRM)

Siz yuklovchi Claude seansisiz. Vazifa: tayyor paketdagi 172 dars faylini CRM'ga (go.coddycamp.uz, kurs «AI startup», id 20) yuklash.
Faqat yuklash, tekshirish va hisobot. Kod, darslar, skriptlar, reestr — TEGILMAYDI.
Chatda doim o'zbekcha javob bering. Halol bo'ling: nima qilinmagan yoki tekshirilmagan bo'lsa, ochiq ayting.

## 0. Boshlashdan oldin o'qing (shu tartibda)
1. `/home/kali/Desktop/internetLesson/YUKLASH_PROTOKOLI.md` — doimiy qoidalar (asosiy hujjat).
2. `/home/kali/Desktop/internetLesson/feedback/F-1019-11-crm-yuklash/JURNAL.md` — 19.10 da xuddi shu ish qanday qilingan: usul, tuzoqlar, bo'lim id'lari.
3. Paket: `/home/kali/Desktop/internetLesson/yuklash-2026-10-23-prod/` — `README.md`, `HISOBOT.md`, `yakka/<N>-Modul/ROYXAT.md`, `yuklangan.csv`.
Loyiha papkasi: `/home/kali/Desktop/internetLesson/` (kichik «i»). `InternetLesson` (katta «I») — eski nusxa, tegilmaydi.

## 1. Holat (tekshirilgan, sizga ma'lumot uchun)
- Paket: commit `8aaf193a`, 172 dars (170 tasi v4, Postman v5, Routing v6). smoke-lms ✓, smoke-preview 172/172. Hammasi prod Dars API bilan.
- Server sharti BAJARILGAN (foydalanuvchi, 19:04): GitLab `7dd3d9cb`, prod health `0.1.0+7dd3d9cb`, catalog 183. Serverga hech narsa qilmaysiz.
- Bu relizda nima bor (o'quvchi ko'radigan): uyga vazifa kartasi dars oxirida (101 dars), «O'zim mustaqil ko'raman →» tugmasi (hamma dars), Bilimlar bazasi preview tuzatishi. CodeStrike — avvalgidek.

## 2. Ish tartibi
1. Foydalanuvchidan Chrome'da go.coddycamp.uz ga KIRGANINI tasdiqlab oling. Parol/token kiritmaysiz — kirishni foydalanuvchi o'zi qiladi.
2. Modul tartibida: 2, 3, 4 … 14. Har modul uchun `yakka/<N>-Modul/ROYXAT.md` ochiladi; unda CRM bo'lim id (2→70, 3→73, 4→74, 5→75, 6→90, 7→80, 8→81, 9→108, 10→109, 11→110, 12→111, 13→112, 14→113).
3. Har dars: bo'limda shu darsning Class mavzusi → uz qatori va ru qatori (JSX dars / Lesson Runner) → «Tahrirlash» → **faqat JSX faylni** ROYXAT'dagi YANGI fayl bilan almashtirish (`…-v4.jsx` va h.k.). uz va ru — **bir xil fayl**.
4. Dars mavzusini ROYXAT'dagi **uz nomi** bo'yicha toping. CRM material id'lari ROYXAT'da «?» — ularni o'zingiz topasiz va `yuklangan.csv` ga yozasiz.
5. Usul 19.10 dagidek (JURNAL «Usul» bo'limi): yashirin `<input type=file multiple>` orqali fayllar sahifaga bir marta qo'yiladi → har savol `editQuestion(id)` bilan ochiladi → fayl `#editLessonRunnerFile` ga → forma (`editSubmit`) yuboriladi.
   **TUZOQ:** `editQuestion` formani AJAX bilan qayta chizadi — formani HAR SAFAR qaytadan qidiring, eski havola bilan yuborilsa hech narsa ketmaydi.
6. **Tekshirish (majburiy, har qator):** LMS'dagi yuklangan faylni (`…/uploads/lessons/lesson_runner/<hash>.jsx`) yuklab olib, uning md5'ini ROYXAT'dagi md5 bilan solishtiring. Mos kelmasa — qayta yuklang; ikkinchi marta ham mos kelmasa — TO'XTANG va foydalanuvchiga ayting.
7. Har dars tugagach `yuklangan.csv` dagi shu qatorga: `crm_uz`, `crm_ru` (material id), `yuklandi` = `2026-10-23`, kerak bo'lsa `izoh`.
8. Har modul oxirida qisqa hisobot: nechta dars, uz/ru qatorlar soni, md5 ✓ soni, to'xtagan joylar.

## 3. Taqiqlar
- Sarlavha, tartib, til, tur, holat (Draft/Active) — O'ZGARMAYDI. Faqat fayl.
- Paketda yo'q narsaga tegilmaydi: uyga vazifalar (Practice) — TEGILMAYDI (ular 21.10 da yangilangan); `LMS_REESTR.json` → `crm_tashqari` qatorlari (#2980, 3060, 3062, 3-/4-Modul bo'sh «03» qatorlari) — o'tkazib yuboriladi.
- Learn 3148 (2-Modul, Draft) — TEGILMAYDI.
- Hech narsa o'chirilmaydi, arxivlanmaydi, Active qilinmaydi.
- Nomuvofiqlik bo'lsa (dars topilmadi · nom mos emas · qator soni boshqa · bo'limda ortiqcha JSX qator) — TO'XTANG, foydalanuvchiga ayting, o'zingiz «moslashtirmang».
- Kod, `src/`, `scripts/`, reestr, jurnal fayllariga yozmaysiz (faqat `yuklash-2026-10-23-prod/yuklangan.csv`). Commit, push — YO'Q.
- Parol, token, cookie qiymatlarini chatga yoki faylga yozmang.
- Parallel seans bor: u `/tmp/.../cs-wt` worktree'da CodeStrike ustida ishlayapti. Unga va uning fayllariga tegmang.

## 4. Tugagach
1. Yakuniy hisobot: 172 dars / 344 qator, md5 ✓ soni, to'xtagan va o'tkazib yuborilgan joylar (sababi bilan).
2. `yuklangan.csv` to'liq to'ldirilganini ko'rsating (bo'sh `yuklandi` qolmasin; qolsa — nega).
3. Muhrlashni FOYDALANUVCHI ruxsati bilan yurgizing:
   ```
   cd /home/kali/Desktop/internetLesson && node scripts/lms-farq.mjs muhrla yuklash-2026-10-23-prod/yuklangan.csv --kim claude-yuklovchi-F-1023 --server 7dd3d9cb
   ```
   U `LMS_REESTR.json` va `LMS_DEPLOY_JURNAL.md` ni yangilaydi va health versiyasini tekshiradi. Natijasini foydalanuvchiga ko'rsating. Commit — faqat foydalanuvchi buyrug'i bilan.
4. Prod smoke taklif qiling (foydalanuvchi qiladi): har moduldan 1 dars LMS preview'da ochiladi; bitta texnik darsda oxirgi ekranda «Uyga vazifa» tugmasi → karta ochiladi; darsga kirish oynasida «O'zim mustaqil ko'raman →» tugmasi ko'rinadi.
