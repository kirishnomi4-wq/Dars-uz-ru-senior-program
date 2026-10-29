# YUKLOVCHI PROMPT — 29.10.2026 reliz: 172 dars → CRM (F-1023-01 CodeStrike → Learn)

Siz bosh Claude seansisiz (loyiha `/home/kali/Desktop/internetLesson/`, kichik «i»). Vazifa: tayyor va tekshirilgan
paketdagi **172 dars JSX faylini** CRM'ga (go.coddycamp.uz, kurs «AI startup» id 20) yuklash, har faylni md5 bilan
tasdiqlash, so'ng reestrga muhr bosish. Chatda o'zbekcha. Har qadam oldidan qisqa reja + rozilik. Halol hisobot:
qilinmagan narsa «qilinmadi» deb aytiladi. Login/parol/token kiritilmaydi va chatga yozilmaydi — CRM'ga foydalanuvchi o'zi kiradi.

## 0. Avval o'qing (shu tartibda, boshqa narsa o'qimasdan)
1. `YUKLASH_PROTOKOLI.md` — doimiy qoidalar.
2. `feedback/F-1023-01-learn/DAVOM.md` — joriy holat (29.10 20:xx).
3. Shu prompt — oxirigacha.

## 1. Nima tayyor (29.10 19:46 gacha TEKSHIRILGAN, qayta tekshirish shart emas)
- Paket: `yuklash-20261029-prod/` — commit `15039598`, 172 dars, `yakka/<N>-Modul/*.jsx`, `yuklangan.csv` (172 qator, `yuklandi` ustuni BO'SH).
  172/172 fayl md5 = `yuklangan.csv`; smoke-lms ✓, smoke-preview 172/172. Server (dars-api) o'zgarishi KERAK EMAS — prod `0.1.0+0f242c77`, migratsiya 10.
- Abdulloh PODIUM-05 ni tasdiqlagan («hammasi OK, gaz prodga»). Reliz xati KERAK EMAS — foydalanuvchi CodeStrike o'zgarishini o'zi aytgan.
- CRM oldindan-tekshiruv o'tgan: 13 bo'lim → 172 Class mavzu → 344 uz/ru qator, hammasi reestr (`LMS_REESTR.json`) bilan mos:
  material id, til, tur lesson-runner, eski fayl nomi, modul; CRM'dagi eski fayllar yuklab olinib md5 = reestr 344/344; mavzular va qatorlar Active.
  Ortiqcha 2 qator — #13379 / #13380 (sid 2373, Archive, eski sinov) — TEGILMAYDI.
- **CRM'ga hali HECH NARSA yuklanmagan.** Birinchi POST (#13381) Claude Code auto-rejim klassifikatori tomonidan
  «Production Deploy» deb rad etilgan edi. Shuning uchun foydalanuvchi bu seansni **auto emas, oddiy ruxsat rejimida**
  yuritadi (Shift+Tab) — har POST so'raladi va u tasdiqlaydi. Rejim auto bo'lsa, yuklashni boshlamasdan foydalanuvchiga ayting.

## 2. Tayyor fayllar (`feedback/F-1023-01-learn/crm-yuklash-20261029/`)
| Fayl | Nima |
|---|---|
| `yuklash-xarita.json` | 172 yozuv: `lesson_id`, `m` (modul), `yangi` (paketdagi yo'l, masalan `2-Modul/01-InternetLesson-v5.jsx`), `md5_yangi`, `eski`, `md5_eski`, `uz{qid,sid,hash,…}`, `ru{qid,sid,hash,…}`. **Asosiy ish-ro'yxati — shu.** |
| `dump/crm-oldin.json` | CRM'ning yuklashdan OLDINGI holati (bo'lim → mavzu → qatorlar). |
| `yordamchi-server.mjs` | Lokal server 127.0.0.1:5399: `GET /files/<yakka ichidagi yo'l>` paket faylini beradi, `POST /save?name=X` JSON'ni `dump/X` ga yozadi. CORS faqat go.coddycamp.uz, `Access-Control-Allow-Private-Network: true` (shart — usiz brauzer so'rovi o'tmaydi). |
| `yukla-sahifa.js` | Sahifaga qo'yiladigan `window.__yukla(qid, relPath, fileName)` funksiyasi — bitta qatorni yuklaydi va yangi fayl nomi/hash'ini qaytaradi. |
| `oldin-tekshir.mjs` | Oldindan-tekshiruv skripti (bajarilgan; kerak bo'lsa qayta yurgizish xavfsiz). |

## 3. Ish tartibi
1. Foydalanuvchidan tasdiqlab oling: Chrome'da go.coddycamp.uz ga kirgan (Academic Assistant), ruxsat rejimi auto EMAS.
2. Yordamchi serverni ishga tushiring (fon): `node feedback/F-1023-01-learn/crm-yuklash-20261029/yordamchi-server.mjs`
   (port band bo'lsa `fuser -k 5399/tcp`). Sinov: `curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:5399/files/2-Modul/01-InternetLesson-v5.jsx` → 200.
3. Chrome: `tabs_context_mcp` → yangi tab → `https://go.coddycamp.uz/account/student_courses/section/2374` (Internet darsi).
   `javascript_tool` bilan `yukla-sahifa.js` mazmunini sahifaga qo'ying (har navigatsiyadan keyin QAYTA qo'yiladi — sahifa yangilanganda yo'qoladi).
4. **Sinov — bitta qator:** `await window.__yukla(13381, '2-Modul/01-InternetLesson-v5.jsx', '01-InternetLesson-v5.jsx')`.
   Kutilgan: `status 200`, `rowText` ichida `01-InternetLesson-v5.jsx`, `lang uz`, `type lesson-runner`. So'ng tekshiruv (5-band). O'tsa — davom; o'tmasa — TO'XTANG, foydalanuvchiga ayting.
5. **Tekshiruv (har qator, majburiy):** section sahifasini qayta o'qing (fetch yoki navigate), qator `qid` ning `jsx=` havolasidan yangi hash'ni oling,
   faylni shelldan yuklab oling (ochiq URL, cookie kerak emas): `curl -s -o /tmp/x.jsx https://go.coddycamp.uz/uploads/lessons/lesson_runner/<hash>.jsx && md5sum /tmp/x.jsx`
   → `md5_yangi` bilan teng bo'lsin. Teng bo'lmasa — qayta yuklang; ikkinchi marta ham bo'lmasa — TO'XTANG.
6. **Ommaviy:** `yuklash-xarita.json` tartibida, modul 2 → 14. Har dars uchun: `navigate` → `section/<sid>` (uz va ru bir xil sid) → `yukla-sahifa.js` qo'yish →
   `__yukla(uz.qid, yangi, fayl-nomi)` → `__yukla(ru.qid, yangi, fayl-nomi)` (ikkalasiga BIR XIL fayl). `browser_batch` bilan 3–5 darsni bitta chaqiruvda yuring.
   Har modul oxirida: hash'larni yig'ib (brauzerdan `POST /save?name=hash-mN.json`), shelldan md5 tekshiruvi, qisqa hisobot (necha dars, necha qator, md5 ✓, to'xtagan joy).
7. Har tekshirilgan dars uchun `yuklash-20261029-prod/yuklangan.csv` da `yuklandi` = `2026-10-29` (crm_uz/crm_ru allaqachon to'ldirilgan; `izoh` kerak bo'lsa).
   Jurnal: `feedback/F-1023-01-learn/JURNAL.md` ga raund-yozuv, vaqt `date` bilan (faqat Edit yoki `<<'EOF'`).
8. **Tugagach (har biri alohida ruxsat bilan):**
   - yakuniy hisobot: 172 dars / 344 qator, md5 ✓ soni, o'tkazib yuborilgan/to'xtagan joylar;
   - muhr: `node scripts/lms-farq.mjs muhrla yuklash-20261029-prod/yuklangan.csv --kim claude-yuklovchi-F-1023-01 --server 0f242c77`;
   - commit (reestr + jurnal + `feedback/F-1023-01-learn/*`), push — FAQAT foydalanuvchi buyrug'i bilan;
   - DAVOM.md yangilash. Learn'larni Active qilish — ALOHIDA ish, yakshanba 01.11, foydalanuvchi bilan; bu seansda qilinmaydi.

## 4. CRM tuzilmasi (aniqlangan)
- Bo'lim (modul) sahifasi: `/account/student_courses/detail_part/<bolim id>` — 2→70 · 3→73 · 4→74 · 5→75 · 6→90 · 7→80 · 8→81 · 9→108 · 10→109 · 11→110 · 12→111 · 13→112 · 14→113.
  Jadval ustunlari (birinchi katak bo'sh!): [1] id, [2] tartib, [3] nom uz, [4] nom ru, [5] tur (Class/Learn/Practice/Demoday), [6] belgi, [7] status. Har mavzu `/account/student_courses/section/<sid>`.
- Section sahifasi («Savollar ro'yxati»): ustunlar [1] qid, [2] tartib, [3] til, [4] tur, [5] savol nomi, [6] fayl nomi (havola `https://lms.coddycamp.uz/preview?jsx=https://go.coddycamp.uz/uploads/lessons/lesson_runner/<hash>.jsx`), [7] status.
  Tugmalar: `editQuestion(qid)`, `deleteQuestion(qid)` (bosilmaydi).
- `#editForm` (modal `editModal`, multipart): `question_id` (hidden), `edit_type` (=lesson-runner), `edit_order1`, `edit_lang`, `edit_question_lesson_runner` (nom),
  `edit_delete_lesson_runner_jsx` (=0, tegilmaydi), `edit_lesson_runner_file` (`#editLessonRunnerFile`), «Saqlash» = `button[name=editSubmit]#editLessonRunnerButton`.
  POST manzili = joriy section URL. Yuklangan fayllar ochiq URL (cookie'siz `curl` ishlaydi) — md5 shelldan olinadi.

## 5. Tuzoqlar (shu seansda uchragan)
- `editQuestion` formani AJAX bilan QAYTA chizadi — eski `#editForm` havolasi bilan yuborilsa hech narsa ketmaydi. `__yukla` buni eskisini belgilab, yangisini kutib hal qiladi.
- `javascript_tool` 45 s da uziladi, lekin sahifadagi kod davom etadi: uzun ishni `window.__x` ga yig'ib, keyin `POST /save` bilan lokal serverga yuboring. Chiqishdagi massivlar 100 banddan, satrlar ~1500 belgidan keyin kesiladi.
- Chiqishda hash/hex qiymatlar «[BLOCKED: …]» ko'rinadi — bu faqat ko'rsatish filtri; qiymat sahifada bor, lokal serverga yuboring.
- Yordamchi serverda `Access-Control-Allow-Private-Network: true` bo'lmasa brauzer 127.0.0.1 ga so'rov yubormaydi.
- Yakshanba 01.11 Learn Active — bu relizga kirmaydi.

## 6. Taqiqlar
Sarlavha, tartib, til, tur, holat (Draft/Active) o'zgarmaydi — faqat JSX fayl. Paketda yo'q narsaga (uyga vazifalar, Learn qatorlari, #13379/#13380, `crm_tashqari`) tegilmaydi.
Hech narsa o'chirilmaydi, arxivlanmaydi, Active qilinmaydi. Nomuvofiqlikda TO'XTAB foydalanuvchiga ayting, o'zingiz «moslashtirmang».
Kod (`src/`), `scripts/`, reestr — qo'lda tahrir qilinmaydi (reestrga faqat `lms-farq muhrla` yozadi). Commit/push — faqat buyruq bilan.
