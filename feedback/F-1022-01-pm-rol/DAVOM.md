# 🔴🔴🔴 DAVOM — yangi seans shu yerdan boshlanadi

Yozilgan: 2026-10-25 02:55 (foydalanuvchi uxlashga ketdi, noutbuk o'chiriladi).

## Holat — F-1022-01 «O'quvchi — startapchi, PM emas» YOPILDI ✅
| Dars | Fayl | Holat |
|---|---|---|
| m3-10 «Qachon «tayyor» deb ayta olamiz?» | `src/3-Modull/PmLesson9.jsx` | ✅ prodda (23.10 relizi) |
| m3-05 «Qaysi ishni birinchi qilasiz?» | `src/3-Modull/PmLesson8.jsx` | ✅ prodda (23.10 relizi) |
| m4-07 · m4-12 · m4b-02 · m4c-06 · m6-02 | PmLesson12 · 13 · 16 · 18 · 22 | ✅ prodda (24.10, v5) |

24.10 zanjiri: kod → commit `d7ff60ef` → paket `yuklash-2026-10-24-prod` (O'TDI) → foydalanuvchi ko'rigi «manga yoqdi» → server sync GitLab `53b9388` → pipeline #2984744019 Passed → prod health `0.1.0+53b93883`, catalog 183 → yuklovchi seans CRM'ga 10 qator (md5 10/10) → `lms-farq muhrla` (reestr 5 dars v5, jami 172).

## Birinchi ish yangi seansda — COMMIT (faqat foydalanuvchi «ha» desa)
Commit qilinmagan fayllar (hammasi diskda, yo'qolmagan):
- `LMS_REESTR.json` — 5 dars v5, server `53b93883`
- `LMS_DEPLOY_JURNAL.md` — 24.10 qatori
- `PM_PIPELINE_STATE.md` — 24.10 21:48 yakun yozuvi
- `feedback/F-1022-01-pm-rol/JURNAL.md` · `YUKLOVCHI-PROMPT.md` · `DAVOM.md` (shu fayl)

Taklif etilgan xabar: `chore(lms): 24.10 qisman reliz muhri — 5 PM dars v5, server 53b93883 (F-1022-01)`.
`yuklash-2026-10-24-prod/` — `.gitignore` da, commitga kirmaydi. Push — faqat alohida buyruq bilan.
Boshqa untracked fayllar (`.shot*.tmp.mjs`, `arxiv/F-1020-*`, `dist-hwqa2/`, `src/hw-qa2/`, `src/taqdimot/`, `feedback/F-1018-pitch/.../_p.html` va h.k.) — oldingi seanslardan, bu commitga QO'SHILMAYDI.

## Ochiq
1. **Prod smoke** (foydalanuvchi): LMS preview'da m6-02 «Bitta gapni uch kishi bir xil tushunadimi?» ni mentor sifatida ochish → 1-ekranda «Natijani ochish» tugmasi, eslatmada «Bu slayd nima uchun».
2. **5-/6-Modul CRM Class nomlari** eski reja nomida («.env va xavfsizlik», «PRD yaratish», «Sifat: bitta xato…», «Monitoring») — avvaldan shunday, tegilmagan; kerak bo'lsa alohida qaror.
3. **1-o'tish «Nima quramiz»** (`src/bridge/lessons/BridgeNimaQuramiz.jsx`) — F-1022-01 qoidasi bo'yicha keyingi ish (alohida sayt).
4. **CodeStrike → Learn (F-1023-01)** — Abdulloh javobi kutilmoqda: `feedback/F-1023-reliz/DAVOM.md` «Ochiq» 3-band.
5. **Push (GitHub)** — 23.10 dan beri push yo'q; foydalanuvchi aytsa `git push origin main`.

## Qoidalar (o'zgarmas)
- Uy vazifalari `*.homework.jsx` — TEGILMAYDI. Atama qoladi (PRD, qabul shartlari) — 110-qonun; gap aytuvchi — ustoz.
- Har tahrir/qadam oldidan reja aytiladi va rozilik olinadi. Commit/push faqat buyruq bilan.
- Server sync — foydalanuvchi o'zi: `! bash scripts/sync-dars-api.sh main` (oldin `… main --check`).
