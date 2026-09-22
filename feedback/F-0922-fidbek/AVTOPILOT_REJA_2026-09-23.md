# 🤖 AVTOPILOT REJASI — 2026-09-23 (tun)

> **Bu hujjat yangi seans uchun yozilgan.** Oldingi suhbat konteksti sizda YO'Q — bu yerda
> hamma narsa bor. Foydalanuvchi uxlayapti: **savol berib to'xtab qolmang**, ro'yxatni tartib
> bilan bajaring; qaror talab qiladigan narsalar 6-bo'limda alohida — **ularga TEGILMAYDI**.

---

## 0. Birinchi qadam (majburiy)

```bash
cd /home/kali/Desktop/internetLesson
cat CLAUDE.md                      # boshqaruv-dispetcher (qoidalar shu yerda)
tail -60 PIPELINE_STATE.md         # 22.09 kuni nima qilingan
```

---

## 1. Hozirgi holat (2026-09-23, 00:40)

| | |
|---|---|
| Branch | `main`, oxirgi commit `dcaa93f`, **push kutayotgani 0** |
| O'zgargan | **146 fayl** (118 `.jsx`) — **hammasi UNCOMMITTED** |
| Til qarzi | butun `src` bo'ylab **209 🔴** |
| Yuklash papkalari | `yuklash-2026-09-21` (LMS'da shu turibdi) · `yuklash-2026-09-22` (eskirgan) |

**22.09 kuni uch seans parallel ishladi.** Hammasi tekshirildi, **kesishish/yo'qotish YO'Q**:

- `lint:jsx` 157 fayl **0** · esbuild 118 fayl **toza** · `vite build` ✓ · `lint:prompt` ✓
- `lint:keys` 97 dars **nomos 0** · `SCREEN_META ↔ screens` barcha darsda mos
- `smoke-rejim` uz 9/9 · ru 9/9 · `smoke-homework` **36/36**
- Til qarzi tegilgan darslarda **faqat kamaygan** (JsFunctions/JsLoops 3→0, JsVars 7→4,
  PracticeLesson2 9→6, PracticeLesson3 6→2, PmLesson1 4→2, JsIntro 23→20); `dark` o'zgarmagan

---

## 2. VAZIFA 1 — Layout: ✅ TASHXIS TUGADI, TUZATISH KERAK EMAS

**Bu ish shu seansda yakunlangan — qayta o'lchamang, ko'r-ko'rona tuzatmang.**

`layout-lint --lang ru` 12 darsda nuqson ko'rsatgan edi. Guruhlanganda ma'lum bo'ldi:
**12 alohida xato emas, bir nechta UMUMIY KOMPONENT** (`ach-coll` 42 hodisa 205–313px ·
`gloss` 12 hodisa 383–421px · `frame-soft` 18 hodisa 5–22px va b.).

**🔴 Isbotlandi: bugungi ishdan emas.** Tegilmagan darslar ham o'lchandi (`m3-05`, `m4-02`) —
ular ham toshadi (`button.hw-big`, 12 hodisa). Ya'ni **loyiha bo'ylab eski qarz**.

Shuning uchun CLAUDE.md qoidasi bo'yicha (8+ faylga tegadi) **`KATTA_TOZALASH.md` ga
yozildi** — «LAYOUT TOSHISHI — umumiy komponentlar (F-0923-01)» bo'limi, to'liq jadval va
ustuvorlik bilan. Dalillar: `feedback/F-0922-fidbek/tekshiruv/` (`LAYOUT_TAHLIL.md` +
ikki log).

**Sizdan talab qilinadigan ish: YO'Q.** Ertalab foydalanuvchiga shuni ayting —
tuzatish alohida ish sifatida rejalashtiriladi (uning qaroriga havola qilinadi).

## 3. VAZIFA 2 — `variable`: ✅ BAJARILDI

`src/2-Modull/JsVarsLesson.jsx` — 2 joyda «O'zgaruvchi **(peremennaya)** nima?» →
«O'zgaruvchi **(variable)** nima?» (ruscha tomon tegilmadi — u to'g'ri edi).

Tekshirildi: darvozalar bazaga teng (til 4 = 4 · dark 6 = 6) · esbuild ✓ ·
smoke uz/ru 4/4 · skrinshot ✓. Qoldiq (registrga befarq) **0** — qolgan ikki hodisa
arxiv papkalarida (`src/eski/`, `2-moodull eski/`), ular kursga kirmaydi.

**Sizdan talab qilinadigan ish: YO'Q.**

## 4. VAZIFA 3 — yakuniy regress (hammasi tuzatilgach)

```bash
npm run lint:jsx                                   # 157 fayl · 0 topilma SHART
npm run gate:esbuild -- $(git status --porcelain | grep '\.jsx$' | awk '{print $2}' | tr '\n' ' ')
npx vite build
npm run lint:prompt
npm run lint:keys $(git status --porcelain | grep '\.jsx$' | awk '{print $2}' | tr '\n' ' ')
CHROME=/usr/bin/google-chrome node scripts/ach-probe.mjs \
  $(ls feedback/F-0918-04/b-tolqin/probe/*.json | grep -v solo-yozma | tr '\n' ' ')   # 160/160
CHROME=/usr/bin/google-chrome node scripts/ach-probe.mjs \
  feedback/F-0918-04/b-tolqin/probe/solo-yozma.json --solo                            # 27/27
CHROME=/usr/bin/google-chrome node scripts/smoke-homework.mjs                         # 36/36
CHROME=/usr/bin/google-chrome node scripts/smoke-arena.mjs                            # arena
```
⚠️ `solo-yozma.json` **`--solo` bayrog'isiz yurgizilmaydi** — aks holda 23 ta soxta
«yiqilish» chiqadi (22.09 sabog'i).

⚠️ Fon-buyruqni kutganda `pgrep -f "ach-prob[e]"` qavs-hiylasini ishlating — oddiy
`pgrep -f "ach-probe"` **o'z satrini ko'rib abadiy aylanadi**.

---

## 5. VAZIFA 4 — yuklash papkasini qayta qurish (regress toza bo'lsa)

```bash
node scripts/yuklash-papka.mjs --out yuklash-2026-09-23
sh scripts/yuklash-tekshir.sh yuklash-2026-09-23
```
Tekshiruv: fayl soni · md5 mosligi · katalog. **Yuklashni O'ZINGIZ qilmaysiz** —
foydalanuvchi qo'lda `go.coddycamp.uz` ga yuklaydi (qat'iy qoida: darslar GitLab/serverga
chiqmaydi).

**Muhim:** bu papkada **`m1-06` ekran soni 21 → 22** (yangi Google Fonts ekrani) va
**`m2-02`/`m2-12` atamalari o'zgargan. Ekran soni o'zgargani uchun darsni yarmida qoldirgan
o'quvchining progressi tozalanadi — foydalanuvchi buni biladi va «o'quvchilar dars
qilmayotgan paytda yuklayman» dedi.

---

## 6. 🔴 TEGILMAYDIGAN NARSALAR (foydalanuvchi qarorini kutadi)

Avtopilot bularni **hal qilmaydi va o'zgartirmaydi** — faqat hisobotda eslatadi:

1. **`m2-02` UI hisoblagichlari «karta»** deb ataldi («1-karta · 2-karta · 3-karta»).
   Foydalanuvchi 4-C («hamma joyda muammo va yechim») tanlagan edi; hisoblagichga
   sig'magani uchun «karta» ishlatilgan — **tasdiq kutadi**.
2. **`PmLesson5` (m2-07)** hali eski atamada: «imkoniyat» **45 joy**. Konteksti boshqa
   («tarozidan o'tkazing» — prioritetlash), shuning uchun ko'r-ko'rona almashtirilmadi.
   `KATTA_TOZALASH.md` da yozilgan.
3. **`m2-12` «Shipped It!» nishoni** — «MVP'ni dunyoga chiqardingiz» qoldirilgan
   (bayram matni, atama o'rgatmaydi).
4. **`m2-12` «jilolash/jilolangan»** — 2 joy, «pardoz» bilan bir oilada, aytilmagani uchun tegilmagan.
5. **7-Modul** — foydalanuvchi: «hozir umuman o'ylama». Ligatura qoldig'i (12 fayl · 88 e'lon)
   va bitta «dunyoga chiqarish» `KATTA_TOZALASH.md` da.
6. **Commit / push / deploy** — faqat foydalanuvchi buyrug'i bilan. **O'Z-O'ZIDAN QILMANG.**

---

## 7. LMS holati (ertalab foydalanuvchi bilan)

22.09 kechqurun LMS'da «Natijani saqlab bo'lmadi» muammosi chiqdi. **Sabab aniqlangan va
Axadulla o'z tomonini tuzatgan** (runner endi CRM'ga doim `correct: 1` yuboradi).
Bizdan kod-o'zgarishi **talab qilinmadi** — u ataylab «`passed`ni soxta `true` qilmang» dedi.

**Ertalabgi ish (foydalanuvchi bilan, avtopilot QILMAYDI):**
brauzerda `Ctrl+Shift+R` → savolda ataylab xato → to'g'rilash → oxirigacha →
«Dars muvaffaqiyatli yakunlandi» chiqishi kutiladi. Yiqilsa: vaqt · dars ID ·
Network'dagi `question_try` va `next_lesson_access` javoblari (tokensiz).

Tafsilot: `muammoga-yechim.md` (repo ildizi) va `PIPELINE_STATE.md` 19:2x–19:5x yozuvlari.

---

## 8. Ish uslubi (22.09 da shakllangan — davom ettiring)

1. **Tashxis avval, yechim keyin.** Muammoni o'lchov bilan ko'rsating, keyin tuzating.
2. **Darvozani BAZAGA solishtiring.** `git show HEAD:<fayl>` bilan nusxa olib, o'sha
   raqamlar bilan solishtiring — «2 🔴 bor» degani «men qo'shdim» degani emas.
3. **Aynan-ibora jadvali, regex EMAS** — matn almashtirganda. Har naqsh uchun
   `count()` tekshiruvi; topilmasa — to'xtang.
4. **Qoldiq tekshiruvi registrga BEFARQ** (`grep -ri`) va **eng qisqa o'zakdan**
   (`juft`, `qiyinchili`, `imkoniyat`) — 22.09 da ikki marta shu tufayli o'tkazib yuborilgan.
5. **Oxirgi qadam — matnni O'QISH va SKRINSHOT.** Grep ham, darvoza ham «toza» degan
   joyda nuqson topilgan (BOSH HARFLI yorliqlar; ruscha olmoshlar).
6. **Ekran qo'shsangiz** — `RECAPS` kabi **raqamli indeks** bilan kalitlangan tuzilmalar
   siljiydi. Ov-bandi: `.claude/agents/role/darslik-tekshiruvchi.md` oxirida.
7. **Har raund oxirida** `PIPELINE_STATE.md` ga yozuv (sana + nima topildi + nima qilindi +
   qayerga muhrlandi) va sinf takrorlansa `MATN_KORPUS.md` ga juftlik.

---

## 9. Ertalab foydalanuvchiga hisobot

`PIPELINE_STATE.md` ga raund-yozuvlar + qisqa xulosa:
- Layout: tashxis nima bo'ldi (tizimli sinfmi / eski qarzmi / haqiqiy nuqsonmi), nechta tuzatildi
- `variable` almashtirildimi
- Yakuniy regress raqamlari (prob · smoke · darvozalar)
- Yuklash papkasi tayyormi
- 6-bo'limdagi ochiq qarorlar ro'yxati (o'zgarmagan holda)
