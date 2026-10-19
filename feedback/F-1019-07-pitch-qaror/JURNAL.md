# F-1019-07 · Qolgan passiv ekranlar → qaror (DE 213.22) + telefonda savol joyi · 19.10.2026
Foydalanuvchi: «qolgan ishlarni tugataylik … chalalarni yopaylik» (LMS yuklash — alohida, keyin).
Zaxira: `arxiv/F-1019-07-oldin/` (9 fayl, o'zgarishdan oldingi holat).

## 1. Pitch darslari — passiv ekranlar
| Dars | Ekran (o'rni) | Oldin | Endi |
|---|---|---|---|
| m8-11 PmPitchRehearsal | Screen2 (2) «Besh slayd» | 3 tugma | 3 qaror: qaysi slayd javob beradi · Keyingi qadam slaydiga nima · vaqt bo'linishi |
| m8-11 | Screen6 (3) «Raqamlar» | 3 tugma | zalning 3 savoliga qaror: nimani sanagani · solishtirish · halol gap |
| m9-16 PmPrototypePitch | Screen2 (2) «To'rt bo'lak» | 4 qadam | 4 qaror; animatsiya tugaguncha javob berilgan savol turadi (`key = band ? q-1 : q`) |
| m9-16 | Screen4 (3) «Dalil» | 3 qadam | 3 qaror: muammo gapi · necha kishida bo'lgani · kun belgilagani |
| m9-16 | Screen8 (4) «Jonli demo» | 3 qadam | 3 qaror: oldindan ochish · bitta asosiy harakat · sinovdagi tuzatish |
| m10-12 PmGrowthPitch | Screen2 (2) «Besh bo'lak» | 3 tugma | 3 qaror: sanalgan sonlar · «11 tasi sinfdosh» · 5 daqiqa bo'linishi |
| m10-12 | Screen4 (3) «Grafik» | 4 tugma | buzilgan grafikning 4 kamchiligiga qaror (noldan · teng oraliq · sana va son · sarlavha) |
Har joyda: Mentor chorlovi «Har savolga javob bering — … ko'rasiz», nav «Savollarga javob bering» (sanoq olindi — bosqich bitta joyda: nuqtalar/bo'lak kartalari, 213.21), ipucha `IPUCHA_QAROR`. m9-16 `QadamQatori`, m10-12 `TugmaQator` va `S*_QADAM/S*_TUGMA` — o'lik kod o'chirildi.
To'g'ri variant eng uzun emas (uz va ru) — `uzunlik.py`; 2 ruscha variant qisqartirildi. To'g'ri javob o'rni har savolda o'zgaradi.

## 2. Telefonda keyingi savol ekrandan chiqib ketardi (oldingi seans topilmasi)
Tashxis: keng QTushuncha'da `harakatAvval` — savol sahnadan OLDIN; Stage har javobdan keyin pastga (sahna oxiriga) suradi → keyingi savol yuqorida qoladi (m12-02 s2: top −164, m12-05 s2: −102).
Yechim: telefonda (≤768) `harakatAvval={!tor}` — savol sahnadan keyin, pastga surish uni ko'rsatadi. 11 ekran: m12-01 s2 · Jamoa · Keyingi; m12-02 (PmStoryPitch) s2, s6; m12-05 (PmPitchTraining) s2; m12-08 (PmFinalPitch) s3; m10-12 s2, s4, s8; m9-16 s2, s8 (`tartib.py` + qo'lda m10-12 s2). m8-11 s2/s6 va m9-16 s2/s8 ga `scrollSignal` qo'shildi.
m8-11: telefonda zal pufagi markazda (uzun savol 390 da o'ng chetdan chiqardi — oldindan bor nuqson), qadam nuqtalari savol bilan chapga tekis.

## 3. Sinf-supurish (grep: «birma-bir bos/qo'sh/och», «Tugmalarni bosing», «Yoqilgan … bosing», «Har nuqtani/kartani bosib»)
27 fayl moslik. O'z doiram (LMS 2–6 + pitch):
- **Htmllesson1 s5 «Struktura»** (etalon dars): 4 qismni bosish → 4 qaror (oshxona=head · zal=body · o'rab turgan=html · eng boshi=DOCTYPE), keyin sudrab yig'ish o'zgarmadi; qismlar bosilmaydi, tap-hint o'chirildi; nav'dagi ikkinchi sanoq olindi (kod ustidagi «N / 4 ko'rildi» qoldi).
- **VsCodeLesson tur-ekrani**: 4 panelni bosish → 4 qaror (Explorer · Editor · Extensions · Terminal), to'g'ri tanlov panelni yoqadi + izoh kartasi; `onAnswer` shakli o'zgarmadi (seenIds).
- PmLesson9 (tushuncha matni), NestArchPractice/Resource (qaror ichidagi maslahat) — passiv emas, tegilmadi.
Doiradan tashqari (QA seansi / bridge / eski src/pm) — KATTA F-1019-03 ga ro'yxat.

## 4. Muhrlash
MATN_KORPUS §QAROR-CHORLOV (❌ «birma-bir bosing» → ✅ «Har savolga javob bering — … yonadi»; §22/§46 chorlovi shu bilan almashadi). KATTA F-1019-03 holati yangilandi.

## 5. Tekshiruv
- gates: m8-11, m9-16, m10-12, m12-01/02/05/08 — 13/13; Htmllesson1 (tell 1, emoji 7), VsCode (emoji 7), GithubActions (tell 1, emoji 7) — zaxira bilan TENG (eski).
- `lint:jsx` 256 fayl toza · `vite build` toza · `lint:prompt` toza.
- Brauzer `sinov/qaror.mjs` (umumiy: xato → sabab + tugma yopiladi → to'g'ri → keyingi; oxirida nav ochiq; qaytganda tugagan holat): 7 pitch ekrani × (uz 1280 · uz 390 · ru 1280) + Htmllesson1 s5 ×3 + VsCode ×3 + eski 6 pitch ekrani 390 da — hammasi o'tdi, pageerror 0, gorizontal aylantirish yo'q, telefonda ko'rinmagan savol 0. Natijalar `sinov/natija*.txt`, suratlar scratchpad `q07/` (ko'rildi: m8-11 s3, m9-16 s2/s4 390, m10-12 s3, Htmllesson1 s5, VsCode tur).
Commit yo'q (buyruqsiz).
