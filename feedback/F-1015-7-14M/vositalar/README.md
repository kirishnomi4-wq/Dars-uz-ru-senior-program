# F-1015 vositalari (15.10 seansi, scratchpad'dan ko'chirildi)

Hammasi lokal vite'ga ulanadi: `npx vite --port 5300 --strictPort` (alohida terminalda yoki fonda), keyin skript.
Chrome: `/usr/bin/google-chrome`, playwright-core repo `node_modules` dan. Dars fayllarini O'ZGARTIRMAYDI (faqat ochib o'lchaydi), mdfix/zoomfix bundan mustasno.

| Skript | Nima qiladi | Ishlatish |
|---|---|---|
| `ekran-olchov.mjs` | Har ekran: so'z, matn bloki, mayda yozuv, rang, shrift, tugma, input; 3 tugma bosib «bos → matn» | `node ekran-olchov.mjs out.jsonl m7-01,m7-02 4` |
| `emoji-olchov.mjs` | Har ekranda emoji (lint-emoji WHITELIST + `\p{Extended_Pictographic}`), xizmat/o'yin qatlami ajratilgan | `node emoji-olchov.mjs out.jsonl <kalitlar> 4` |
| `emokod.mjs` | Koddagi `uz:` matnlarida emoji (izohsiz, WHITELIST bilan) — modul bo'yicha | `node emokod.mjs` (repo ildizida) |
| `yakunshot.mjs` | Darsning oxirgi ekrani surati (bayram oynasini yopadi) | `node yakunshot.mjs outdir m7-01,m7-02 1280 1500 0.5` |
| `yprobe.mjs` | Yakun ekrani DOM-probe: bloklar tartibi, 2 ustun, bo'shliq, nav (207-qonun tekshiruvi) | `node yprobe.mjs outdir <kalitlar> 1280 1500 0.5` |
| `shotks.mjs` | Ro'yxatdagi [kalit, ekran, jami] ekranlar surati (+ ixtiyoriy tugma bosib «keyin») | `node shotks.mjs outdir list.json [1]` |
| `scr.mjs` | Bitta darsning bir nechta ekrani surati (lessonId va jami ma'lum bo'lsa) | `node scr.mjs outdir m7-01 pm-m7d1-v1 17 1,9,10` |
| `w3.mjs` | w3schools sahifalari surati (tadqiqot) | `node w3.mjs outdir` |
| `zg.mjs`, `z*.mjs`, `zshot*.mjs` | ⛶ popup va ⛶ joyi sinovlari (F-1015-108/111) — jonli sayt yoki lokal | ichida izoh |
| `zoomfix.py`, `zoomfix2.py` | F-1015-111 ⛶ CSS tahriri (aniq satr almashtirish) — BAJARILGAN, qayta yurgizilmaydi | — |
| `mdfix.py` | F-1015-112 MD Yakun sinxroni (`--dry` bilan avval) — BAJARILGAN | — |
| `hw.cjs` | Darsdagi HW_VARIANT/HW_STEPS konstantalarini node bilan o'qish | `node hw.cjs <fayl.jsx>` |

Ma'lumot: `../malumot/` (probe loglari, keysY.txt — kalit→komponent, olchov JSON). Suratlar: `../suratlar/`. Sahifa manbalari: `../sahifalar/`.
Layout-lint (repo vositasi): `node layout-lint.mjs --keys <…> --vp 1280x773 --interact 0 --par 6 --out x.json` — vite 5300 kerak; `--interact 2` juda sekin.

### 16.10 supurish vositalari (F-1015-113…122)
| Skript | Nima qiladi | Ishlatish |
|---|---|---|
| `oldin.sh` | Darsning hamma ekrani surati + 2 varaq (joriy scratchpad'ga; `S=` bilan almashtiriladi) | `bash oldin.sh m6-01 src/6-Modull/X.jsx F-1015-121-oldin` |
| `bos.mjs` / `seq.mjs` | Ekranni ochib tugmalarni ketma-ket bosib surat | `node bos.mjs out m6-02 pm-m6d2-v1 16 6 s6-bos "Keyingi bosqich"` |
| `varaq.py` | Suratlar varag'i (kontakt-list) | `python3 varaq.py out.jpg 3 a.jpg b.jpg …` |
| `umumiy.py` | QReja teglari (`teg`) va voqea nuqtalari (`nuq`) — 208/0 naqshlari | `python3 umumiy.py <fayl> teg` |
| `mdumumiy.py` | MD sinxroni (reja teglari, nuqtalar) + ✎ belgisi | `python3 mdumumiy.py <md> F-ID teg tugma=…` |
| `i116.mjs`, `i119-m05.mjs` | O'quvchi ma'lumoti (localStorage seed) bilan ekran surati | ichida izoh |
| `emooraliq.py` | Dars ekranlari oralig'idagi emoji satrlari (faqat ko'rish) | `python3 emooraliq.py <fayl>` |
| `emoboshi.py` | uz/ru satr boshidagi bezak emojini oladi (maket/sxema/o'yin istisno) | `python3 emoboshi.py <fayl> [--yoz]` |
| `emoqator.py` | Fayldagi barcha emoji satrlari (o'yin belgisi bilan) | `python3 emoqator.py <fayl>` |
| `ekran-olchov.mjs` | Modul yopishda o'lchov (bazaga `olchov-ekran-1553.json` solishtiriladi) | `node ekran-olchov.mjs ../malumot/olchov-1xx-keyin.jsonl <kalitlar> 4` |

### 17.10 avtopilot-2 vositalari (F-1015-135…155)
| Skript | Nima qiladi |
|---|---|
| `scrl.mjs` | `scr.mjs` + til argumenti (`uz`/`ru`, `cc_lang`) — `node scrl.mjs out kalit lessonId jami 1,2 ru` |
| `q136k.mjs` | halqali yopishgan tugma juftlari (klass bilan) |
| `ortda144.py` · `goya145.py` · `ring147.py` · `voqea140.py` · `ovoz149.py` | 144/145/147/140/146+149 kod tahrirlari (bajarilgan) |
| `ball147.mjs` | m8-09 ball sinovi (2/2 va 1/2) |
| `zoomkarta140.mjs` | ⛶ karta o'rtasida qolganmi (karta chetidan masofa) |
| `zsplit141.mjs` | Z2: `.q-split` ustunlarining bo'sh cho'zilishi (oldin/keyin) |
| `toshish151.mjs` | matn bo'yalgan qutisidan chiqqanmi (`LANG_DARS=ru|uz`) |
| `kirish148.mjs` | QKirish 1-ekranlar surati + ustun o'lchovi |
| `uchish139.mjs` · `ovoz149-sinov.mjs` · `hol.mjs` | 139 uchish kadrlari, 149 ovoz sinovi, m6-13 holatli suratlar |
| `deploy-qa.sh` | 7–14-M 8 QA saytini build + vercel deploy + smoke (foydalanuvchi ruxsati bilan) |
