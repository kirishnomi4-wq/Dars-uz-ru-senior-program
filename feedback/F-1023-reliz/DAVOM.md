# DAVOM — 23.10.2026 20:40 (noutbuk o'chirildi). Yangi seans shu fayldan boshlaydi.

## Reliz — TUGADI ✅
- Commit'lar: `8aaf193a` (reliz) · `95b2832b` (muhr, yuklovchi seans) · keyingisi — hujjatlar. **Push YO'Q** — GitHub'ga push faqat buyruq bilan.
- Server: GitLab `7dd3d9cb`, prod health `0.1.0+7dd3d9cb`, catalog 183.
- CRM: 172 dars / 344 qator yuklandi (yuklovchi seans), md5 344/344; `yuklangan.csv` mustaqil tekshirildi (id 344 unikal, bo'sh yo'q).
- `lms-farq muhrla` bajarildi: `LMS_REESTR.json` (170 × v4, Postman v5, Routing v6), `LMS_DEPLOY_JURNAL.md` qatori.
- Relizda: uyga vazifa v2 kartasi (101 dars) · «O'zim mustaqil ko'raman →» tugmasi (172) · Bilimlar bazasi preview tuzatishi · m3-10/m3-05 (F-1022-01) · F-1020 uch dars + qolip. CodeStrike — ESKI format (`codestrike` maydoni yo'q).
- Jurnal: `JURNAL.md` (shu papka).

## Ochiq
1. **Prod smoke** (foydalanuvchi): bitta texnik dars oxirida «Uyga vazifa» → karta; kirish oynasida yangi tugma; har moduldan 1 dars preview.
2. **Tartib uz=2/ru=1** — 35 darsda CRM'da avvaldan shunday (yuklovchi `izoh` ustuniga yozgan). Bugun tegilmadi; kerak bo'lsa alohida.
3. **CodeStrike → Learn (F-1023-01), BUG-01:** Abdullohga v2 namuna yuborilgan (`feedback/F-1023-01-learn/internet-01-v18-codestrike-bug01-v2-20261023.jsx`, SHA `ba2268cf…0627`, xat `XAT-ABDULLOH-BUG01-v2-UZ.md`). Uning brauzer tekshiruvi javobini kutamiz.
   JORIY kod: `feedback/F-1023-01-learn/codestrike-kod-v3-bug01-20261023.patch` (186 fayl). Worktree (`/tmp/.../cs-wt`) o'chirildi — kod faqat shu patch'da.
   Qayta tiklash: `git worktree add --detach <scratch>/cs-wt HEAD && cd <scratch>/cs-wt && git apply --3way <repo>/feedback/F-1023-01-learn/codestrike-kod-v3-bug01-20261023.patch && node --test src/live/*.test.mjs` (44/44 bo'lishi kerak).
   Ochiq chekka holat (xatda aytilgan): yo'q — v2 javobsiz birinchi o'yinni ham yopadi.
4. PM: m6-02 va m4-12 / m4b-02 / m4c-06 / m4-07 — jadvallar tasdiq kutmoqda (`feedback/F-1022-01-pm-rol/DAVOM.md`), keyingi qisman reliz.
5. Push (GitHub) — foydalanuvchi aytsa: `git push origin main`.

## Saboqlar (23.10)
- SHA'ni HAR DOIM yuborilayotgan faylning o'zidan ol (birinchi xatda noto'g'ri SHA ketgan).
- Tartib bo'yicha taxmin (javob raqami) taymautlarni ko'rmaydi — o'yin chegarasi aniq belgi bilan bo'lsin.
- `pkill -f "<naqsh>"` o'z shell'ini o'ldiradi — port bo'yicha `fuser -k <port>/tcp`.
- Import qo'shadigan skript faqat fayl boshidagi import blokiga yozsin (dars ichidagi kod-namunada `import` bor).
- Mening `cd` im sessiya papkasini o'zgartiradi — foydalanuvchining `!` buyrug'i shu papkada yuradi; tekshiruvdan keyin loyiha ildiziga qaytish.
