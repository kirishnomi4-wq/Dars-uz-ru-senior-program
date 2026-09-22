# LAYOUT TAHLILI — 2026-09-23 (ru, 12 dars)

`layout-lint --lang ru` 12 darsda nuqson ko'rsatdi. Element bo'yicha guruhlanganda
ma'lum bo'ldi: bu **12 ta alohida xato emas**, bir nechta **umumiy komponent**.

| Sinf | hodisa | toshish (px) | nima |
|---|---|---|---|
| `div.card.ach-coll` | 42 | 205–313 | 🏅 nishon-kartasi (yakun ekrani) |
| `div.frame-soft` | 18 | 5–22 | «Yana urinib ko‘ring» — xato javob izohi |
| `div.gloss.fade-up` | 12 | 383–421 | 💡 kalit so‘zlar (glossary) |
| `div.frame-success.fade-step` | 11 | 22–52 | yashil muvaffaqiyat qutisi |
| `div.ms-row.p` | 7 | 112–112 | mentor-statistika qatori |
| `button.btn.cc-run` | 6 | 22–169 | ▶ RUN tugmasi (kompilyator) |
| `div.frame` | 6 | 22–47 | oddiy ramka |
| `div.card.fade-up` | 6 | 303–303 | umumiy karta |
| `div.hint.fade-step` | 4 | 6–6 | maslahat qutisi |
| `div.cl-shelf` | 3 | 18–18 | «keraksizlar» javoni |
| `div.term.fade-up` | 3 | 12–42 | atama kartasi |
| `button.hk-card.picked` | 1 | 102–102 | hook-kartasi |
| `button.k-dot.fill` | 1 | 110–110 | — |

## Xulosa

- **`ach-coll` (42 hodisa, 205–383px)** — eng katta sinf: yakun ekranidagi nishon-kartasi
  ruscha matnda o'z qutisidan chiqadi. Bitta komponent — bitta joyda tuzatiladi.
- **`frame-soft` (18, 9–21px)** — xato-javob izohi; toshish KICHIK (9–21px), ya'ni chegarada.
- Qolganlari — yakka hodisalar.

## ✅ ANIQLANDI: bu bugungi ishdan EMAS

**Tegilmagan** darslar ham o'lchandi (`m3-05`, `m4-02` — 22.09 da hech kim tegmagan):

```
m3-05 s16 · 155px · button.hw-big «клетка время польза сразу план 1 ден»
m4-02 s15 · 134px · button.hw-big «поле раздел хранение прослушивание з»
```
→ **12 hodisa, ular ham toshadi.** Log: `layout-baza-tegilmagan.log`

**Xulosa:** layout toshishi — **loyiha bo'ylab eski qarz**, 22.09 dagi matn-tuzatishlari
sababi emas. Ruscha matn o'zbekchadan uzun, umumiy komponentlar esa qat'iy balandlikda.

## Nima qilinadi

🔴 **Ko'r-ko'rona 12 darsni tuzatish NOTO'G'RI bo'ladi** — tuzatish **komponent
darajasida** (bir nechta umumiy sinf), ya'ni 8+ faylga tegadi → CLAUDE.md qoidasi bo'yicha
bu `KATTA_TOZALASH.md` ishi, dars-siklida ko'tarilmaydi.

Ustuvorlik (toshish hajmi bo'yicha):
1. **`div.gloss.fade-up`** — 383–421px, eng yomoni (glossary yakun ekranida)
2. **`div.card.ach-coll`** — 205–313px, eng ko'p tarqalgani (42 hodisa)
3. **`div.card.fade-up`** · **`button.hw-big`** — 134–303px
4. Qolganlari 5–52px — chegarada, ikkinchi navbat

**Eslatma:** `layout-lint` `npm run gates` ichida EMAS (vite kerak, daqiqalar ketadi) —
asbobning o'z izohida yozilgan: «modul yakunida va relizdan oldin yuritiladi
(MODUL_TUR bandi)». Ya'ni bu qarz shu sababli to'planib qolgan.
