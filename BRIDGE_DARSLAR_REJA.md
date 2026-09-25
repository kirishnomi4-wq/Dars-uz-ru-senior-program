# Bridge darslar — reja (Web Senior → AI Startup)

> 2026-09-23 · manba: `CoddyCamp_Senior_2026_v9_14modul (1) (3).html` (v9 dars ketma-ketligi)
> **Kim uchun:** texnik bilimi yetarli, lekin PM darslarini o'tmagan va AI Startup'ning o'rtasidagi modulga qo'shilayotgan o'quvchi.
> **Qayerda o'tiladi:** Vercel URL (LMS emas) · jonli ball eski Supabase orqali · analitika, uyga vazifa va koding qadami yo'q.
> **Hajmi:** bir darsda 20–25 slayddan oshmaydi · hamma darslar bitta ipda: o'quvchining o'z AI startup g'oyasi.

Foundation → HTML-CSS o'tishida bridge **yo'q**, chunki Foundation'da PM darsi yo'q.

---

## v9 bo'yicha PM mavzular (bridge manbasi)

| v9 modul | PM | Mavzular | Bizdagi fayl |
|---|---|---|---|
| 2 · HTML-CSS | 2 | Kim mening foydalanuvchim? · Struktura | `1-Modull/PmLesson1` · `PmLesson2` |
| 3 · JavaScript | 4 | Muammo → yechim · **Muammoni qanday izlash** 🆕 · Dekompozitsiya · Sistemani pitch qilish | `2-Modull/PmLesson4` · **`7-Modull/PmLesson28`** · `PmLesson5` · `PmLesson6` |
| 4 · React | 5 | User Story · **Jobs-to-be-Done** 🆕 · Prioritet · Acceptance Criteria · Frontend pitch | `pm/PmUserStoryLesson` · **`pm/PmJtbdLesson`** · `3-Modull/PmLesson8` · `9` · `10` |
| 5 · Node-Express | 4 | Ma'lumot · Xavfsizlik · Sxema · Fullstack pitch | `4-Modull/PmLesson11–14` |
| 6 · NestJS | 4 | *bridge'ga kirmaydi* | `4a/4b/4c` |

🆕 — v9 da M7 dan ko'chirilgan mavzu. Ikkala dars ham repo'da bor, faqat hali asosiy kursda emas (pastda «Parallel ish» bo'limiga qarang).
Endi sonlar jadvalga to'liq mos: **6 · 11 · 15**.

---

## 1-o'tish — JavaScript moduliga qo'shiladi

**1 ta dars** · 2 ta mavzu

| Dars | Qaysi mavzular o'tiladi |
|---|---|
| **B1 — Kim uchun qilyapmiz?** | Kim mening foydalanuvchim? · Struktura |

---

## 2-o'tish — React moduliga qo'shiladi

**3 ta dars** · 6 ta mavzu (HTML-CSS 2 + JS 4)

| Dars | Qaysi mavzular o'tiladi |
|---|---|
| **B1 — Kim uchun qilyapmiz?** | Kim mening foydalanuvchim? · Struktura |
| **B2 — Muammoni topamiz** | Muammoni qanday izlash · Muammo → yechim |
| **B3 — Birinchi versiya va uni ko'rsatish** | Dekompozitsiya (hozir nima, keyin nima — MVP) · Sistemani pitch qilish |

---

## 3-o'tish — Node-Express moduliga qo'shiladi

**3 ta dars** · 11 ta mavzu (HTML-CSS 2 + JS 4 + React 5)

| Dars | Qaysi mavzular o'tiladi |
|---|---|
| **B4 — Kim uchun va qanday muammo?** | Kim mening foydalanuvchim? + Struktura (bitta blok) · Muammoni qanday izlash · Muammo → yechim · Jobs-to-be-Done |
| **B5 — Nima quramiz va qachon tayyor?** | User Story · Dekompozitsiya (MVP) · Prioritet · Acceptance Criteria |
| **B6 — Qanday ko'rsatamiz?** | Sistemani pitch qilish · Frontend pitch (jonli demo) |

---

## 4-o'tish — NestJS moduliga qo'shiladi

**3 ta dars** · 15 ta mavzu (HTML-CSS 2 + JS 4 + React 5 + Node 4)

| Dars | Qaysi mavzular o'tiladi |
|---|---|
| **B4 — Kim uchun va qanday muammo?** | *3-o'tishdagi bilan bir xil* |
| **B5 — Nima quramiz va qachon tayyor?** | *3-o'tishdagi bilan bir xil* |
| **B7 — Ma'lumot, ishonch va «Qanday ishlaydi?»** | Ma'lumot · Xavfsizlik · Sxema · Fullstack pitch (texnik so'zsiz 3 qavat — sistema va frontend pitchini ham qoplaydi) |

---

## Jami: 7 ta bridge dars

| Dars | Mavzu soni | Qaysi o'tishlarda |
|---|---|---|
| B1 | 2 | 1 · 2 |
| B2 | 2 | 2 |
| B3 | 2 | 2 |
| B4 | 5 | 3 · 4 |
| B5 | 4 | 3 · 4 |
| B6 | 2 | 3 |
| B7 | 4 (+2 qoplangan) | 4 |

**Eng og'ir dars — B4** (5 mavzu). Auditoriya va Struktura bitta blokka birlashtiriladi, shunda amalda 4 blok qoladi. B6 yengil, shuning uchun unda o'quvchi o'z startup g'oyasini ko'rsatishni mashq qiladi.

---

## Parallel ish — asosiy kursga 2 ta dars qo'shiladi

Bu ikki dars bridge uchun ham manba bo'ladi, shuning uchun bridge bilan parallel tayyorlanadi.


---
| Dars | Hozir qayerda | v9 bo'yicha joyi | Nima qilish kerak |
|---|---|---|---|
| **Muammoni qanday izlash** | `7-Modull/PmLesson28` (`pm-problemhunt-28-v16`) | JS moduli, 3-dars (Muammo → yechim'dan keyin, JS — O'zgaruvchilar'dan oldin) | Darajani M7 dan 3-oyga tushirish, JS modul ipiga ulash, yangi `lessonId`, uyga vazifa, RU |
| **Jobs-to-be-Done** | `pm/PmJtbdLesson` (`pm-m7d2-v2`) | React moduli, 3-dars (User Story'dan keyin, Birinchi komponent'dan oldin) | Darajani 4-oyga tushirish, React modul ipiga ulash, yangi `lessonId`, uyga vazifa, RU |

Hal qilinadigan joylar:
- `PmUserStoryLesson` da milkshake (JTBD) ekrani bor. JTBD alohida dars bo'lgach, u takror bo'lib qoladi: qisqartiriladimi yoki «keyingi darsga ilgak» qilib qoldiriladimi?
- LMS dars-kodi hozir muzlatilgan (`passed`-qulf masalasi). Yangi darsni tayyorlash mumkin, lekin CRM'ga yuklash qulf ochilgandan keyin bo'ladi.
- `1-Modull/PmLesson3` (Demo Day nutqi) v9 da PM dars emas, DD-2 ichida o'tadi. Bridge'ga kirmaydi.


## Modul raqamlari (chalkashmaslik uchun)

| v9 | Repo papkasi |
|---|---|
| 2 · HTML-CSS | `2-Modull` |
| 3 · JavaScript | `3-Modull` |
| 4 · React | `4-Modull` |
| 5 · Node-Express | `5-Modull` |
| 6 · NestJS + Test + CI/CD | `6-Modull` |

## Keyingi qadam

1. B1 senariysi → tasdiq (GATE S) → qurish.
2. Parallel: PmLesson28 → JS moduli, PmJtbdLesson → React moduli (C retsepti: audit → reja → tasdiq).
