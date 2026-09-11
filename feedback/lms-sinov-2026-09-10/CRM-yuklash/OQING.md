# CRM «Umumiy modullar» → test-material — qaysi fayl nima uchun (2026-09-10 20:15)

| Fayl | Nima uchun | Belgilar (grep) |
|---|---|---|
| `1-Internet-YANGI-2026-09-10.jsx` | Asosiy test-dars. Hozirgi CRM nusxasini SHU bilan almashtiring (unda arena onFinished'da yo'q) | staging 1 · ccDetails 1 · LMS_SOLO_RECHECK_MS 2 · arenaBank 1 · supabase 0 |
| `2-HtmlLesson1-YANGI-2026-09-10.jsx` | §5.2 15-qadam — ikkinchi dars (boshqa lesson_id) ko'prikda ishlaydimi | staging 1 · ccDetails 1 · LMS_SOLO_RECHECK_MS 2 · arenaBank 1 · supabase 0 |
| `3-Internet-ESKI-177ee1a.jsx` | §5.2 16-qadam — ko'prikgacha bo'lgan eski JSX: PIN-darvoza, oq ekran yo'q | ko'prik yo'q |
| `eski/` | Ertalabki nusxalar (arena va 20 s qayta-so'rovsiz) — yuklanmaydi | — |

Yig'ish buyrug'i (qayta kerak bo'lsa):
`LMS_OUT_DIR=feedback/lms-sinov-2026-09-10/CRM-yuklash DARS_API_URL=https://staging-dars-api.coddycamp.uz node scripts/build-lms.mjs src/1-Modull/InternetLesson.jsx src/1-Modull/Htmllesson1.jsx`
Bu papka ataylab git'ga qo'shilmaydi (1.4 MB nusxalar).
