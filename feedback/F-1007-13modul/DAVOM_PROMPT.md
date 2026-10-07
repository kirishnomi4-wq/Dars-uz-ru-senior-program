# 13-Modul — davom prompti (yangi seans uchun) · 07.10.2026 17:10

> Tayyorladi: 13-Modul seansi (F-1007-457). Foydalanuvchi pastdagi blokni yangi seansga nusxalab beradi.
> Prompt qisqa: hamma qoida va holat fayllarda — yangi seans ularni o'qiydi.

```
13-Modul seansining DAVOMI (LMS 13-Modul «O'sish va monetizatsiya», kod src/11-Modull, kalitlar m11-NN, F-ID 458 dan).
Oldingi seans 07.10 17:10 da to'xtadi: 12 darsning MD v3 matni tayyor, GATE M sahifasi e'lon qilingan, men javob va ChatGPT auditini olib keldim.

1. Avval o'qing (shu tartibda, to'liq):
   - feedback/F-1007-13modul/00-SEANS_PROMPT.md — 2-bo'lim «Chegara» va 4-bo'lim «Qoidalar» hali ham to'liq kuchda (1-bo'limni qayta o'qish shart emas).
   - feedback/F-1007-13modul/JURNAL.md — Holat jadvali, «Keyingi qadam», Yozuvlar F-1007-450…457, MEXANIZM-TAKLIF.
   - feedback/F-1007-13modul/DAVOM_PROMPT.md — shu faylning pastki qismi (holat, Filtr tartibi, javoblar nimaga tegadi).
   - feedback/F-1007-13modul/00-MODUL-TAYANCH.md (asosiy manba; 9-bo'lim — 47 kelishuv) · 00-TAQIQLAR.md · GATE_M_JAVOB.md · gatem-1.json (8 modul savoli).
   - konveyer/1-MD.md «Filtr» bo'limi · memory: tashqi-audit-filtr · sinonim-taqiq-bir-mano-bir-soz · agentlar-faqat-ruxsat-bilan · seans-13modul-2026-10-07.
   - Filtr namunasi: feedback/F-1006-12modul/01-FILTR.md (shakl) · feedback/F-1007-13modul/vositalar/filtr-sinflar.md (12-Modul auditlari qayerda qoqilgan).
   MD larni (01…12-v3.md) faqat audit kelgan dars uchun to'liq o'qing.

2. O'qib bo'lgach menga 5 qatorda yozing: holat, nimani kutyapsiz, birinchi nima qilasiz. Keyin men beraman:
   (a) GATE M sahifasidagi javob qatori (13M-GATE-1, 8 savol) — https://claude.ai/artifact/RNyooCMmUp1utV8JcYpA1F
   (b) ChatGPT auditi — darsma-dars (bir yoki bir nechta MD bo'yicha).

3. Har audit uchun: NN-FILTR.md (12-Modul shaklida) → zaxira scratchpad'ga → tuzatish → sinf-supurish 12 MD da → tekshiruv → jurnal.
   Har tahrirdan keyin: npm run lint:til <md> (0 error) va python3 feedback/F-1007-13modul/vositalar/qisqa.py <md>.

4. O'zgarmaydi: agent — faqat ruxsatim bilan (oldin qisqa xabar: nechta, nima, qaysi fayl, qancha vaqt) · commit, push, deploy — faqat buyrug'im bilan ·
   «qur» bosqichi — faqat alohida buyrug'im bilan · faqat o'z fayllaringiz (00-SEANS_PROMPT 2-bo'lim) · vaqt faqat `date` bilan ·
   MEMORY.md ni boshqa seanslar ham yozadi — faqat o'z qatoringizni aniq Edit qiling.
```

---

## Holat (07.10 17:10)

| Nima | Holat |
|---|---|
| Qaror-0 (24 savol) | ✅ «hammasi A» → `GATE_M_JAVOB.md` |
| App.jsx | ✅ `// ---- 11-Modul` izoh-qatori va `id: '11'` bloki (13 dars, `comp` siz). «Qur» da faqat import va `comp` qo'shiladi |
| Tayanch, TAQIQLAR, NOMLAR | ✅ tayanch 9-bo'limda 47 kelishuv |
| MD v3 | ✅ 12/12 — lint:til 0 error har biri, arena 3/3/3/3, nomlar va «Keyingi dars» qatorlari mos |
| GATE M sahifasi | ⏳ e'lon qilingan, javob kutilmoqda (`gatem-1.json` → `konveyer/vositalar/gatem/sahifa.py`) |
| ChatGPT auditi | ⏳ kutilmoqda |
| `src/11-Modull/` | yo'q — «qur» hali boshlanmagan |
| Commit | ✅ e3d665b push origin/main (07.10 17:16): modul papkasi + App.jsx dan faqat o'z ikki qismi. Ishchi fayldagi 12-Modul izoh ko'chishi — o'sha seansniki, tegilmaydi |

## Filtr tartibi (konveyer/1-MD.md, memory tashqi-audit-filtr)

1. Har band: darsda bormi (grep) → fakt (tayanch, App.jsx, 12-Modul MD lari, rasmiy hujjat) → qonun (QOIDALAR, TAQIQLAR) → tasdiqlangan qaror (GATE_M_JAVOB) → auditoriya (Toshkent o'smiri).
2. Hukm: **Qabul / Qisman / Rad / Allaqachon** + sabab. Audit — kirish, qonun emas: xato bandni dalil bilan rad eting.
3. Tasdiqlangan matnni (Qaror-0) o'zgartiradigan Qabul — foydalanuvchiga hisobotda alohida aytiladi.
4. Sinf-supurish: topilma boshqa 11 MD da ham grep qilinadi; natija FILTR ga yoziladi (topilmasa ham).
5. Takror sinf → tayanch 7-bo'lim (oldindan tuzatiladigan sinflar). Kelishuv → tayanch 9-bo'lim (9.48 dan).
6. Tekshiruv: `npm run lint:til <md>` 0 error · `vositalar/qisqa.py <md>` (ekranlar, arena, sarlavha ≤55, taqiqlangan so'zlar) · ✔ o'rni o'zgargan bo'lsa arena sanog'i 3/3/3/3 qayta.
7. Jurnal: F-ID bilan yozuv, Holat jadvali, memory «SHU YERDAN» qatori.

## GATE M javoblari nimaga tegadi (birinchi variant A — tavsiya, MD lar shunga yozilgan)

| Savol | A bo'lsa | B bo'lsa — ish |
|---|---|---|
| M-q0 · 47 kelishuv | o'zgarish yo'q | izohdagi band raqami bo'yicha tayanch va tegishli MD |
| M-q1 · Mentor sonlari (tayanch 1.13) | o'zgarish yo'q | izohdagi son → tayanch 1.x va o'sha sonni ishlatadigan barcha MD (grep) |
| M-q2 · «skript» so'zi | 6-darsda 91, 9-darsda 8 joy «suhbat savollari» ga; kalit nomi `skript` ichki qoladi; tayanch 2-bo'lim atamasi | o'zgarish yo'q |
| M-q3 · mashq to'lov real foydalanuvchilarga | o'zgarish yo'q | 4-dars A1/A2 (Pro faqat namuna va tekshiruv akkauntlariga), 8-dars xabari, tayanch 9.27 |
| M-q4 · 12-dars 5-topilma | o'zgarish yo'q | 12-dars 5-topilma qaytadi + 5-dars A1 va 7-dars oferta 4-bandi qayta yoziladi |
| M-q5 · APK faqat 10 va 12 | o'zgarish yo'q | 4, 5, 7, 8-darslarga APK qadami; tayanch 9.33, 9.45 |
| M-q6 · «Webhook Tested» nishoni | o'zgarish yo'q | 3-dars nishon sharti va yakun ekrani |
| M-q7 · 9-darsda tasdiq xabari | o'zgarish yo'q | 9-dars: darsda faqat yozish va tekshirish, yuborish uyda |

«Skript» haqida: boshqa MD lardagi «skript» so'zlari agentlarning o'lchov izohlari (o'quvchi matni emas) — ularga tegilmaydi.

## Fayllar

- `feedback/F-1007-13modul/` — 00-SEANS_PROMPT · 00-MANBA · 00-NOMLAR · 00-MODUL-TAYANCH · 00-TAQIQLAR · GATE_M_JAVOB · qaror-0.json · gatem-1.json · MD_AGENT_TOPSHIRIQ · MD_TOPSHIRIQ_2 · 01…12-v3.md · JURNAL · DAVOM_PROMPT.
- `vositalar/` — `qisqa.py <md>` (tez tekshiruv) · `mdtekshir.py <md>` (to'liq) · `olish.py <papka> "url|nom"…` (rasmiy sahifani yuklab olish) · `rulugat.py <papka,papka>` (RU lug'atini darslardan o'lchash, «qur» RU bosqichi) · `terms.txt` · `filtr-sinflar.md` · `qaror-13.html` (Qaror-0 sahifasi nusxasi).
- GATE M sahifasini qayta yasash: `python3 konveyer/vositalar/gatem/sahifa.py feedback/F-1007-13modul/gatem-1.json feedback/F-1007-13modul <scratchpad>/gatem-13.html` → Artifact, `url` = yuqoridagi havola (o'sha manzil saqlanadi).
- Artifactlar: Qaror-0 https://claude.ai/artifact/No6rSBwAkyqaSV5ez37mmt · GATE M https://claude.ai/artifact/RNyooCMmUp1utV8JcYpA1F.
