# LMS 9-Modul «Loyiham kim uchun va nima uchun + animatsiya» — manba (konveyer 0-bosqich)

Kod: `src/7-Modull` · kalitlar `m7-NN` · App.jsx `id: '7'` · 05.10.2026

## 1. Dastur v9 — 9-modul (13 dars: 12 + zaxira)

Maqsad (dasturdan): birinchi marta o'zi uchun emas — real odamning real muammosi bo'yicha mini-MVP, birinchi kundan jonli va animatsiyalangan.
Texnik cho'qqi: animatsiya va mikro-harakatlar. TEX 2 · AI-PRAKT 3 · PM+PRAKT 2 · PM 5 · zaxira 1. Demo Day **yo'q**.

| № | Tip | Mavzu (dastur) | Mazmun | Natija |
|---|---|---|---|---|
| 1 | PM | Mahsulot va loyiha + muammolarni tez ko'rib chiqish | Farqi nima; atrofdan 10 muammo | 3 ishlaydigan mahsulot + 10 yangi muammo |
| 2 | PM | Custdev: 5 real intervyu | 15 daqiqa texnika takrori → 5 real intervyu | Shablon bo'yicha 5 intervyu yozuvi |
| 3 | PM | Intervyu tahlili + MVP | Takrorlar, xulosalar; qilamiz / qilmaymiz / keyin | 1 aniq muammo + MVP funksiyalari ro'yxati |
| 4 | TEX | Mini-MVP arxitekturasi | Qismlar, ma'lumot, stek; baza + kirish + deploy | Sxema + loyiha skeleti |
| 5 | TEX | Animatsiya va mikro-harakatlar (cho'qqi) | Transition, transform, Framer Motion — qo'lda | Interfeysning 3 elementi jonlanadi |
| 6 | PM+PRAKT | Analitika birinchi kundan | 20 daqiqa — nimani o'lchash; keyin analitika shu darsda ulanadi | Birinchi foydalanuvchidan oldin analitika ulangan |
| 7 | AI-PRAKT | MVP ishlab chiqish — 1-qism | O'quvchi talab yozadi, agent birinchi ekranni quradi | MVP ning birinchi ishlaydigan ekrani |
| 8 | PM+PRAKT | Dizayn + MVP ni jonlantirish | Dribbble/Behance; 1 namuna + animatsiyalar agent orqali | MVP jonli ko'rinadi |
| 9 | AI-PRAKT | MVP ishlab chiqish — 2-qism | O'quvchi talabi bo'yicha funksiyalar yakunlanadi | Ishlaydigan MVP |
| 10 | PM | Real odam bilan sinov | Kuzatish, tushuntirmaslik | Sinov + kuzatuv yozuvlari |
| 11 | AI-PRAKT | Fikr bo'yicha tuzatish | O'quvchi tuzatishni ifodalaydi, agent eng muhimini tuzatadi | MVP ning yaxshilangan versiyasi |
| 12 | PM | Pitch: muammo → yechim → foydalanuvchi | Real foydalanuvchi hikoyasi pitchni ishonchli qiladi | Repetitsiya; foydalanuvchi ishtiroki |
| 13 | REZERV | Zaxira dars | — | — |

## 2. Nomuvofiqlik: App.jsx `id: '7'` bloki dasturga mos emas

| | App.jsx (hozir, vaqtincha reja) | Dastur v9 |
|---|---|---|
| Qatorlar | 14 (12 dars + zaxira + Demo Day) | 13 (12 dars + zaxira), Demo Day yo'q |
| Animatsiya darsi (TEX, cho'qqi) | **yo'q** | 5-dars |
| «Mom Test» alohida dars | bor (m7-04) | yo'q — 2-darsda 15 daqiqalik takror |
| Dizayn darsi | PM | PM+PRAKT (animatsiya agent orqali) |
| Kalitlar | m7-01, 04…16 (teshikli) | — |
| Modul nomi · davr | «Kim uchun va nima uchun» · oy 9–10.5 | «Loyiham kim uchun va nima uchun + animatsiya» · oy 10–11 |

Davr (`period`) hamma modulda eski hisobda (6-Modul «oy 11–12.5», dasturda 8.5–10) — bu 7-blokdan tashqari, MEXANIZM-TAKLIF ga yozildi.
Blokdagi `PmJtbdLesson` / `PmMetricsLesson` importlari 3 va 5-Modulda ishlatiladi — tegilmaydi.

## 3. Oldingi modul oxiri va o'tilgan mavzular

- Oldingi dars: `m6-14` «Raqamingiz nimani isbotlaydi?» (keyingisi — zaxira dars, 1-bosqich yakuni). 9-Modul — 2-bosqichning birinchi moduli.
- 6-Modul amaliyoti: repo `github.com/Azizbekcrypto/TelegramBotNest` (AvtoPizza: sayt React `web/` + Backend NestJS + Database PostgreSQL + Bot + AI Gemini + mobil Expo),
  kod — Antigravity bilan, teglar `dars-NN-done`. 6-Modul PM misoli — navbat ilovasi (sartarosh).
- 9-Modul tayanadigan PM darslari (takror — yangi mavzu emas):

| 9-Modul darsi | Oldin o'tilgan | Kalit |
|---|---|---|
| 1 · muammolar | «Muammoni qanday topamiz» · «Muammodan yechimga» | m2-16 · m2-02 |
| 2 · intervyu | «Botingizni ishlatgan odamdan nimani so'raysiz?» (bo'lib o'tgan ishini so'rash) | m5-08 |
| 3 · MVP chegarasi | «Dekompozitsiya» (MVP va backlog) · «Qaysi ishni birinchi qilasiz?» | m2-07 · m3-05 |
| 3 · kim va nima uchun | «User Story» · «Bitta natija, uch xil sabab» | m3-02 · m3-17 |
| 4 · arxitektura | «Komponentlardan tizim» · «Arxitektura patternlari» · kirish va .env | m6-01 · m6-03 · m4-11 |
| 5 · animatsiya | CSS asoslari (1-Modul); `transition`/`transform`/Framer Motion — **yangi** | m1-06 · m1-07 |
| 6 · analitika | «…qaysi raqam aytadi?» · «Kecha kelgan odam bugun ham keldimi?» · «Saytingiz hozir ochilyaptimi?» | m5-14 · m5-11 · m4c-06 |
| 10 · sinov | «Foydalanuvchi fikri va iteratsiya» · «Feedback bilan yaxshilash» | m5-09 · m4-14 |
| 12 · pitch | «Raqamingiz nimani isbotlaydi?» · «Ishlayotgan saytingizni qanday ko'rsatasiz?» | m6-14 · m3-14 |

## 4. Dars turi → qolip

| Tip | Darslar | Qolip |
|---|---|---|
| PM | 1, 2, 3, 10, 12 | PM dars (`PM_DARS_ETALON.md`, QVoqea, QMustaqil, QNatija) |
| TEX | 4, 5 | texnik dars (QTushuncha, QKod, QTest) |
| PM+PRAKT | 6, 8 | PM qismi (≈20 daqiqa) + amaliyot bloki (`QBlok`) |
| AI-PRAKT | 7, 9, 11 | loyiha kuni: 8 ekran + 3 amaliyot bloki (172/173), repo ustida |
| REZERV | 13 | dars qurilmaydi (`comp` siz qator) |

## 5. Taklif (qaror sahifasidagi savollarning tavsiyalari)

**Misol-ip — «Maydon»:** mahalladagi futbol maydonchasini band qilish. Muammo: maydonga kelasiz — band; bo'sh vaqtni bilish uchun egasiga qo'ng'iroq qilish kerak.
Nega shu: o'quvchi u yerga o'zi boradi (95-qonun); intervyu uchun 5 odam — o'ynaydigan tengdoshlar va maydon egasi, topish oson;
MVP aniq kesiladi (qilamiz: bo'sh vaqtlar + band qilish · keyin: to'lov, jamoa yig'ish · qilmaymiz: baho, chat);
animatsiya uchun uch element tabiiy (vaqt katagi bosilishi, band bo'lgan katak, «Band qilindi» belgisi);
analitika zanjiri uch qadam (ochdi → vaqtni tanladi → band qildi); sinovda kuzatiladigan bitta vazifa bor («shanba kuniga maydon band qiling»).
O'ylab topilgan qahramon yo'q — vazifani Mentor beradi.

**Repo — yangi, modul bo'yi bitta:** sayt React (Vite) + Backend NestJS + Database PostgreSQL (Neon) — o'quvchiga 6-Moduldan tanish stek; animatsiya — Motion (Framer Motion);
analitika — Umami; kod — Antigravity. Teglar: `dars-04-done` … `dars-11-done` (kod tegadigan 7 dars: 4, 5, 6, 7, 8, 9, 11).

**Dars nomlari** — qaror sahifasida (PM darslar savol-sarlavha, 6-Modul uslubida).
