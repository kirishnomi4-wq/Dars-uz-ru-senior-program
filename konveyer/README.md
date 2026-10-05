# Konveyer — yangi dars qurishning yagona yo'li (04.10.2026)

> Mexanizm taklifining (`feedback/F-0928-QA-5modul/MEXANIZM_TAKLIF_2026-10-01.md`) 3–5-bosqichlari shu papkada yopildi.
> Yangi dars, modul yoki eski darsni qolipga o'tkazish shu zanjir bilan bajariladi.
> Qoidalar bu yerda qayta yozilmaydi. Ular `QOIDALAR.md` (reestr), `DARS_ETALON.md`, `PM_DARS_ETALON.md`, `MATN_KORPUS.md` va
> `src/qolip/QOLIP.md` da turadi. Konveyer faqat **qaysi tartibda, kim, qaysi shablon, qaysi darvoza** ekanini aytadi.

## Zanjir

> **Agentlar faqat foydalanuvchi ruxsati bilan (05.10).** Har bosqichdan oldin bitta qisqa xabar: nechta agent · nima qiladi · qaysi fayllarga tegadi —
> «ha» dan keyin yuboriladi. GATE M tasdig'i — matnni tasdiqlash, agent yuborishga ruxsat EMAS.


| # | Bosqich | Kim | Shablon | Natija | O'tish sharti |
|---|---|---|---|---|---|
| 0 | Manba yig'ish | asosiy seans | `1-MD.md` «0» | dasturdagi o'rni, oldingi/keyingi dars (App.jsx `comp:`), misol-ip, o'tilgan atamalar (grep) | — |
| 1 | **MD v3** — o'quvchi ko'radigan har so'z | asosiy seans yoki MD-agent | `1-MD.md` | `feedback/<modul>/NN-Nom-v3.md` | karta T · P · S · PM belgilangan |
| 2 | **GATE M** | foydalanuvchi | — | `>>` izohlar, tasdiq | foydalanuvchi «tasdiq» |
| 3 | Kod: **skeletdan** | quruvchi (dars = agent = fayl) | `2-QURUVCHI.md` | `src/<N>-Modull/<Nom>Lesson.jsx` | `npm run gates -- <fayl>` 12/12 · `lint:jsx` 0 |
| 4 | Sadoqat (kod ↔ MD) | tekshiruvchi, faqat o'qiydi | `3-SADOQAT.md` | jadval, hukm MOS / QAYTARISH | MOS |
| 5 | Vizual (1280×773 · 1366×768 · 390×844) | tekshiruvchi, faqat ko'radi | `4-VIZUAL.md` | rasm + topilma | TOZA |
| 6 | Tuzatish (ro'yxat bo'yicha) | tuzatuvchi | `5-TUZATUVCHI.md` | — | qayta 4–5 (maks 2 aylanish, keyin foydalanuvchiga) |
| 7 | RU | RU-tarjimon | `6-RU.md` | `ru:` | `ru-gate` TENG · `ru-walk` toza |
| 8 | Yakuniy MD (koddan) | MD-agent | `7-YAKUNIY.md` | `feedback/<modul>/YAKUNIY/NN-Nom.md` | ekran soni = SCREEN_META |
| 9 | **Modul yopish** | asosiy seans | — | `npm run modul:yopish -- <papka>` | hamma darvoza toza → deploy (QA sayti) → commit (buyruq bilan) |

**Fidbek** (QA yoki foydalanuvchi) — CLAUDE.md retsept B. Har tuzatilgan xato **sinf-supurish** bilan yopiladi: shu xato hamma qurilgan
darslarda qidiriladi (grep yoki darvoza), natija jurnalga yoziladi — topilmasa ham («qidirildi: N dars, 0»). Takrorlanishi mumkin bo'lsa —
darvoza (lint) yoki karta qatori (`QOIDALAR.md` → `node scripts/qurish-kartasi.mjs`).

## Fayllar

| Fayl | Nima |
|---|---|
| `QURISH_KARTASI.md` | skript ko'rmaydigan qoidalar, bir sahifa — `QOIDALAR.md` dan **avtomatik** (`node scripts/qurish-kartasi.mjs`; qo'lda tahrirlanmaydi) |
| `1-MD.md` … `7-YAKUNIY.md` | bosqich shablonlari (agentga topshiriq shu fayldan beriladi: fayl yo'li + dars nomi) |
| `../src/skelet/NamunaDars.jsx` | **yangi dars skeleti**: infra (Stage, jonli ball, test, takrorlash oynasi, nishon, arena, podium) + har qolip turidan bitta namuna; 12/12 darvoza |
| `../src/qolip/` | umumiy ekran turlari (`QOLIP.md` — qo'llanma), rang tokenlari, `qolipCss` |
| `vositalar/` | `shots.mjs` (hamma ekran surati) · `ekran.mjs` (tanlangan ekran + bosishlar) · `ru-wl.mjs` (RU ish-ro'yxati) · `final-check.sh` · `sayt-smoke.mjs` (QA sayti uz/ru) · `gatem/sahifa.py` (GATE M sahifasi: modulning hamma MD v3 + savollar, bitta javob qatori — `1-MD.md`) |

## Darvozalar (bitta buyruqda)

- Dars: `npm run gates -- <fayl>` — 12 darvoza (esbuild · undef · jsx · keys · dark · til · tell · emoji · olchov · narrow · qolip · prompt).
- Modul: `npm run modul:yopish -- src/<N>-Modull` — har fayl `gates` · `lint:jsx` · layout (E/F/G, ikki o'lcham) · sarlavha bitta qator ·
  ru-walk · YAKUNIY MD ekran soni · qurish kartasi reestr bilan bir xil.
  Foydalanuvchi qabul qilgan layout turlari — `--qabul E` (manba jurnalda; soni hisobotda qoladi). Brauzer sinovi yiqilsa (Chrome band) bir marta qayta yuriladi va
  «SINOV YIQILDI» deb ajratiladi — nuqson emas, yolg'iz qayta yurgiziladi. Har brauzer sinovida vaqt chegarasi bor (layout — har dars alohida, 10 daq;
  ru-walk/sarlavha — 15 daq): 05.10 da chegarasiz layout 4 soat osilgan edi. Uzoq yurishni Monitor bilan kuzating va muddati tugasa qayta yoqing. Dev server App.jsx ni yig'a olmasa layout «o'lchanmadi» bo'ladi.
- Yangi modul (6-Moduldan keyingi) darsi qolipsiz bo'lsa `gates:qolip` q16 **xato** beradi — skeletsiz dars o'tmaydi.

## Namunalar

- MD v3: `feedback/F-0929-QA-6modul/01-SystemArchitecture-v3.md` (6-Modul 1-dars, pilot).
- Kod: `src/6-Modull/SystemArchitectureLesson.jsx` (to'liq dars qolipda) · skelet `src/skelet/NamunaDars.jsx`.
- Yakuniy MD: `feedback/F-0928-QA-5modul/YAKUNIY/` (12 dars).
- Amaliyot bloki (loyiha kuni, repo ustida, 172/173): qolipda `QBlok` (05.10, GATE M M-q4) + darsdagi ulagich — skelet `src/skelet/NamunaDars.jsx` `ScreenBlok`/`ScreenA1`.
  5-Modulning eski nusxasi (`BotAiProjectLesson.jsx` `ScreenBlok`) — tarix, yangi darsga ko'chirilmaydi.
