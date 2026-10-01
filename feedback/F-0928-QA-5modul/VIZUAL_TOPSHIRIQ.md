# Vizual tekshiruv: darsni ko'z bilan ko'rish (faqat KO'RISH, TUZATMAYSIZ) — 5-Modul

F-1001-60 sabog'i: sadoqat-tekshiruvi matnni MD bilan solishtiradi, lekin joylashuv buzilishini ko'rmaydi (6-dars: yangi `.ck` CSS klassi
yakun ro'yxatini buzgan, matn esa to'g'ri edi). Siz — ekranni ko'radigan tekshiruvchisiz. Hech qanday faylni tahrirlamaysiz.

## Vosita
`S=/tmp/claude-1000/-home-kali-Desktop-internetLesson/3bd76e5f-7e09-4e18-8722-cf23767cf55b/scratchpad` (`cd /home/kali/Desktop/internetLesson` dan yurgizing)
- Hamma ekran, kompyuter: `SHOT_WAIT=2500 node $S/shots.mjs <FAYL> $S/<NN>-vizual/desk`
- Hamma ekran, telefon: `SHOT_W=390 SHOT_H=844 SHOT_WAIT=2500 node $S/shots.mjs <FAYL> $S/<NN>-vizual/tel`
- Uzun ekran to'liq: `FULL=1 …` · Ekran ichida bosib kirish: `CLICK='<selektor>,<selektor>' TAG=nom … <FAYL> <papka> <ekran>`
- Brauzerda o'lchash: `EVAL='return …' … <ekran>` (JSON chiqaradi)
- Eski versiya bilan solishtirish (regressiyami?): `RDIR=$S/head node $S/shots.mjs $S/head/<FAYL> $S/<NN>-vizual/head <ekran>`
Har natija qatorida «xato: yo'q» bo'lishi kerak — `pageerror` chiqsa, bu ham topilma.

## Nimani qidirasiz (har rasmni o'zingiz Read bilan ko'ring)
1. **Joylashuv buzilgan:** element boshqasining ustiga tushgan; kutilmagan katta bo'sh joy yoki ustun; karta/kod bloki o'z joyidan chiqqan;
   matn kesilgan; gorizontal aylantirish paydo bo'lgan (telefonda).
2. **So'z yoki son ichida bo'linish** (U2): «/st art», «48 / 000 so'm», «Tayyormisiz ?».
3. **Bosiladigan narsa ko'rinmaydi** (U1): harakat tugmasi och/xira, tugmaga o'xshamaydi; ma'lumot kartasi esa tugmaga o'xshaydi.
4. **Emoji** o'quvchi matnida (nishon medali, podium, arena o'yin qatlami va ▶ ✓ ✕ ↻ → ← dan tashqari).
5. **Bo'sh yoki chala holat:** ekran ochilganda faqat sarlavha bor, kontent chiqmagan (animatsiya tugashini `SHOT_WAIT=5000` bilan tekshiring).
Har shubhali joyni HEAD versiyasi bilan solishtiring: buzilish YANGI (regressiya) yoki ESKI (avvaldan bor) ekanini ayting.
Joylashuv sababini topish uchun `EVAL` bilan o'lchang va `grep -n` bilan CSS/klassni toping (masalan bir xil klass nomi ikki joyda).
Vaqtinchalik fayllar — faqat `$S/<NN>-vizual/` ichida.

## Hisobot (qisqa)
| ekran | qurilma (kompyuter/telefon) | nima buzilgan | YANGI / ESKI | sabab (file:line, agar topilsa) | rasm yo'li |
Oxirida: ko'rilgan rasm soni; hukm **TOZA** yoki **TUZATISH KERAK** (faqat YANGI buzilishlar ro'yxati); ESKI buzilishlar alohida ro'yxat.
Turn-byudjeti ≤60 tool-chaqiruv.
