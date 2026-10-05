# 4 · Vizual tekshiruv: darsni ko'z bilan ko'rish (faqat KO'RISH, TUZATMAYSIZ)

Sadoqat matnni MD bilan solishtiradi, joylashuv buzilishini ko'rmaydi. Siz — ekranni ko'radigan tekshiruvchisiz. Hech qanday faylni tahrirlamaysiz.
`cd /home/kali/Desktop/internetLesson` dan yurgizing; `S` — o'z scratchpad'ingiz.

## Vosita
- Hamma ekran, sinf noutbuki: `SHOT_WAIT=2500 SHOT_H=773 node konveyer/vositalar/shots.mjs <FAYL> $S/<NN>-vizual/desk`
- Arzon noutbuk: `SHOT_W=1366 SHOT_H=768 …` · telefon: `SHOT_W=390 SHOT_H=844 SHOT_WAIT=2500 …`
- Tanlangan ekran + bosishlar: `node konveyer/vositalar/ekran.mjs <FAYL> $S/<NN>-vizual/c "3:.q-chip|.q-tushuncha .q-btn*3"` (W/H, SHOT_LANG env)
- Uzun ekran to'liq: `FULL=1 …` · o'lchash: `EVAL='return …' … <ekran>` (JSON).
- O'lchov: `LESSON_URL=http://localhost:5173 node layout-lint.mjs --keys <m-NN> --vp 1280x773,1366x768` (A–G detektorlari; dev server kerak).
Har natija qatorida «xato: yo'q» bo'lishi kerak — `pageerror` ham topilma.

## Nimani qidirasiz (har rasmni o'zingiz Read bilan ko'ring)
1. **Joylashuv:** ustma-ust; kutilmagan bo'sh joy; karta o'z joyidan chiqqan; matn kesilgan; pastki panel ostiga tushgan (chat 169.4); telefonda gorizontal aylanish.
2. **So'z/son ichida bo'linish:** «/st art», «48 / 000 so'm».
3. **Bosiladigan narsa:** asosiy harakat bitta (QTugma), ikkinchi darajalisi — ikkinchi; ma'lumot kartasi tugmaga o'xshamaydi.
4. **Harakat → vizual:** bosilganda vizual haqiqatan o'zgaradimi; tugagach panel yopilib natija fokusga chiqadimi (199) — `useTugadi` kechikishidan keyin surat.
5. **Emoji** o'quvchi yuzasida (o'yin qatlamidan tashqari) · **bo'sh/chala holat** (`SHOT_WAIT=5000` bilan qayta).
Har shubhali joyni HEAD versiyasi bilan solishtiring: YANGI (regressiya) yoki ESKI. Sababni `EVAL` + `grep -n` bilan toping.

## Hisobot
| ekran | qurilma | nima buzilgan | YANGI / ESKI | sabab (file:line) | rasm yo'li |
Oxirida: ko'rilgan rasm soni; hukm **TOZA** yoki **TUZATISH KERAK** (faqat YANGI); ESKI alohida. Turn-byudjeti ≤60.
