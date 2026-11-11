# YUKLOVCHI PROMPT — 10.11.2026 kechki reliz: 172 dars → CRM (F-1105-03 analitika v2)

Siz yuklovchi Claude seansisiz (loyiha `/home/kali/Desktop/internetLesson/`, kichik «i»). Vazifa: tayyor va tekshirilgan
paketdagi **172 dars JSX faylini** CRM'ga (go.coddycamp.uz, kurs «AI startup» id 20) yuklash va har faylni md5 bilan
tasdiqlash. Chatda o'zbekcha. Har qadam oldidan qisqa reja + rozilik. Halol hisobot: qilinmagan narsa «qilinmadi» deb aytiladi.
Login/parol/token kiritilmaydi va chatga yozilmaydi — CRM'ga foydalanuvchi o'zi kiradi.

## 0. Avval o'qing (shu tartibda, boshqa narsa o'qimasdan)
1. `YUKLASH_PROTOKOLI.md` — doimiy qoidalar.
2. Shu prompt — oxirigacha.

## 1. Nima tayyor (qayta tekshirish shart emas)
- Paket: `yuklash-20261110-prod/` — commit `9f9951b9`, 172 dars, `yakka/<N>-Modul/*.jsx`, `yuklangan.csv` (172 qator; `crm_uz`/`crm_ru` to'ldirilgan, `yuklandi` ustuni BO'SH).
  md5 172/172 = `yuklangan.csv`; smoke-lms ✓, smoke-preview 172/172.
- **Server sharti BAJARILGAN:** Dars API prod `0.1.0+ab1bfa30`, migratsiya 17 (10.11 21:32 deploy, health tekshirilgan). README'dagi «Server — kerak emas» yozuvi eskirgan — shart bajarilgan, kutish shart emas.
- Ish-xaritasi: `feedback/F-1105-03-analitika/crm-yuklash-20261110/yuklash-xarita.json` — 172 yozuv: `lesson_id`, `m`, `yangi` (paketdagi yo'l), `md5_yangi`,
  `eski` (CRM'dagi hozirgi fayl nomi, reestrdan), `md5_eski`, `uz{qid,sid}`, `ru{qid,sid}`. qid'lar `yuklangan.csv` va `LMS_REESTR.json` bilan 172/172 mos, uz va ru bir xil `sid`.
- **CRM'ga hali HECH NARSA yuklanmagan.**

## 2. Yordamchi fayllar (`feedback/F-1105-03-analitika/crm-yuklash-20261110/`) — 29.10 va 02.11 relizlarida ishlatilgan, yo'llari shu paketga moslangan
| Fayl | Nima |
|---|---|
| `yuklash-xarita.json` | **Asosiy ish-ro'yxati.** |
| `yordamchi-server.mjs` | Lokal server 127.0.0.1:5399: `GET /files/<yakka ichidagi yo'l>` paket faylini beradi, `POST /save?name=X` JSON'ni `dump/X` ga yozadi. CORS faqat go.coddycamp.uz, `Access-Control-Allow-Private-Network: true`. |
| `yukla-sahifa.js` | Sahifaga qo'yiladigan `window.__yukla(qid, relPath, fileName)` — bitta qatorni yuklaydi, yangi qator matni va hash'ini qaytaradi. |

## 3. Ish tartibi
1. Foydalanuvchidan tasdiqlab oling: Chrome'da go.coddycamp.uz ga kirgan, ruxsat rejimi **auto EMAS** (29.10 da auto-rejim birinchi POST'ni «Production Deploy» deb rad etgan; oddiy rejimda har POST so'raladi). Rejim auto bo'lsa — boshlamasdan ayting.
2. Yordamchi server (fon): `node feedback/F-1105-03-analitika/crm-yuklash-20261110/yordamchi-server.mjs` (port band bo'lsa `fuser -k 5399/tcp`).
   Sinov: `curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:5399/files/2-Modul/01-InternetLesson-v6.jsx` → 200.
3. Chrome: `tabs_context_mcp` → yangi tab → `https://go.coddycamp.uz/account/student_courses/section/2374` (m1-01 Internet darsi).
   `javascript_tool` bilan `yukla-sahifa.js` mazmunini sahifaga qo'ying (har navigatsiyadan keyin QAYTA — sahifa yangilanganda yo'qoladi).
4. **Yuklashdan oldin har qator:** section sahifasida shu `qid` qatorining fayl nomi (6-ustun) = xaritadagi `eski` fayl nomi (papkasiz). Mos bo'lmasa — TO'XTANG, foydalanuvchiga ayting.
5. **Sinov — bitta qator:** `await window.__yukla(13381, '2-Modul/01-InternetLesson-v6.jsx', '01-InternetLesson-v6.jsx')`.
   Kutilgan: `status 200`, `rowText` ichida `01-InternetLesson-v6.jsx`, `lang uz`, `type lesson-runner`. So'ng md5 tekshiruvi (6-band). O'tsa — davom; o'tmasa — TO'XTANG.
6. **md5 tekshiruvi (har qator, majburiy):** section sahifasini qayta o'qing, qator `qid` ning `jsx=` havolasidan yangi hash'ni oling,
   faylni shelldan yuklab oling (ochiq URL, cookie kerak emas) — o'z scratchpad papkangizga:
   `curl -s -o <scratchpad>/x.jsx https://go.coddycamp.uz/uploads/lessons/lesson_runner/<hash>.jsx && md5sum <scratchpad>/x.jsx` → `md5_yangi` bilan teng.
   Teng bo'lmasa — qayta yuklang; ikkinchi marta ham bo'lmasa — TO'XTANG.
7. **Ommaviy:** xarita tartibida, modul 2 → 14. Har dars: `navigate` → `section/<sid>` → `yukla-sahifa.js` qo'yish →
   `__yukla(uz.qid, yangi, fayl-nomi)` → `__yukla(ru.qid, yangi, fayl-nomi)` (ikkalasiga BIR XIL fayl). `browser_batch` bilan 3–5 darsni bitta chaqiruvda.
   Har modul oxirida: hash'larni yig'ib (`POST /save?name=hash-mN.json`), shelldan md5, qisqa hisobot (dars, qator, md5 ✓, to'xtagan joy).
8. Har tekshirilgan dars uchun `yuklash-20261110-prod/yuklangan.csv` da `yuklandi` = `2026-11-10` (agar yarim tundan o'tsa — `date +%F` bo'yicha), `izoh` kerak bo'lsa.
   Ish jurnali: `feedback/F-1105-03-analitika/crm-yuklash-20261110/YUKLASH-JURNAL.md` (vaqt `date` bilan; faqat Edit yoki `<<'EOF'`).
   `feedback/F-1105-03-analitika/JURNAL.md` va `DAVOM.md` ga YOZMANG — ularni analitika seansi yuritadi.

## 4. CRM tuzilmasi
- Section sahifasi («Savollar ro'yxati»): ustunlar [1] qid, [2] tartib, [3] til, [4] tur, [5] savol nomi, [6] fayl nomi (havola `…preview?jsx=https://go.coddycamp.uz/uploads/lessons/lesson_runner/<hash>.jsx`), [7] status.
  `editQuestion(qid)` — tahrirlash; `deleteQuestion(qid)` — BOSILMAYDI.
- `#editForm` (multipart): `question_id`, `edit_type` (=lesson-runner), `edit_order1`, `edit_lang`, `edit_question_lesson_runner` (nom),
  `edit_delete_lesson_runner_jsx` (=0, tegilmaydi), `#editLessonRunnerFile`, «Saqlash» = `button[name=editSubmit]`. POST manzili = joriy section URL.

## 5. Tuzoqlar (oldingi relizlarda uchragan)
- `editQuestion` formani AJAX bilan QAYTA chizadi — `__yukla` buni hal qiladi (eskisini belgilab, yangisini kutadi).
- `javascript_tool` 45 s da uziladi, sahifadagi kod davom etadi: uzun ishni `window.__x` ga yig'ib, `POST /save` bilan lokal serverga yuboring. Chiqishda massiv 100 banddan, satr ~1500 belgidan keyin kesiladi.
- Chiqishda hash/hex qiymatlar «[BLOCKED: …]» ko'rinadi — faqat ko'rsatish filtri; qiymatni lokal serverga yuboring.

## 6. Tugagach
Yakuniy hisobot foydalanuvchiga: 172 dars / 344 qator, md5 ✓ soni, to'xtagan joylar. **Muhr (`lms-farq muhrla`), savol kalitlari, commit — siz QILMAYSIZ**: ularni analitika seansi qiladi (foydalanuvchi `yuklangan.csv` tayyor deb aytadi).
Tanlab tekshiruv (foydalanuvchi): prod LMS'da m1-01 Internet va m10-12 ni ochish.

## 7. Taqiqlar
Sarlavha, tartib, til, tur, holat (Draft/Active) o'zgarmaydi — faqat JSX fayl. Paketda yo'q narsaga (uyga vazifalar, Learn qatorlari, `crm_tashqari`) tegilmaydi.
Hech narsa o'chirilmaydi, arxivlanmaydi, Active qilinmaydi. Nomuvofiqlikda TO'XTAB foydalanuvchiga ayting, o'zingiz «moslashtirmang».
`src/`, `scripts/`, `LMS_REESTR.json`, mentor kursi — tegilmaydi. Commit/push — yo'q.
