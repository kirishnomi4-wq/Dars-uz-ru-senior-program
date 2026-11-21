# Blockly bir kunlik sinovi — hisobot (2026-11-16, tun)

**Savol:** 1-modulning Blok studiyasini Blockly bilan quramizmi (A) yoki o'zimiz yozamizmi (B)? Foydalanuvchi qarori: «A, avval sinov» (KONSEPSIYA 74-qaror).

**Nima qurildi:** `index.html` — bitta ekran, etalondagi «Studiya» shabloni: rang doirachalari (Harakat, Gap) · bloklar javoni · dastur · sahna (hovli, zonachalar, sakrash yoylari, Momiq). Bloklar: `move right`, `move left`, `jump`, `say "…"`. Blockly 13.4.0 (Apache 2.0), `zelos` chizish usuli (Scratch'ga o'xshash), o'z mavzumiz: ko'k `#2F8FF0`, binafsha `#8B5CF6`, blok yozuvi JetBrains Mono. Yig'ish: `node new-junior/sinov/blockly/yig.mjs`; o'lchov: `node new-junior/sinov/blockly/olchov.mjs <papka>`.

## O'lchovlar (Chrome, 1500×900, `olchov.mjs`)

| Nima | Natija |
|---|---|
| Blockly fayllari (tarmoqdan) | 167–170 KB (siqilgan); yadro 641 KB siqilmagan |
| Ish maydoni tayyor | 0,3–0,5 s (sahifa to'liq — 1,1–1,3 s) |
| 4× sekin protsessor (zaif noutbuk taxmini) | tayyor 0,5 s; 5 marta bosib qo'shish — 0,29 s |
| Xotira | ~10 MB |
| Konsolda xato | yo'q |
| Bosib qo'shish (javondagi blokni bosish → dastur oxiriga ulanadi) | ishlaydi: 3 marta bosildi → 3 blok, bitta dastur |
| Sudrab ulash | ishlaydi: `move left` dastur oxiriga «chiq» etib ulandi (4 blok, bitta dastur) |
| Ishga tushirish | 3 o'ngga + 1 chapga → 2-zonacha, «Oz qoldi!»; chapga blok olib tashlansa → yulduzda, «Yetib bordi!» |
| `say` yozuvini o'zgartirish | ishlaydi («Men Momiqman!»), sahnada pufak |
| «Kodini ko'rsat» (19-dars uchun) | `coddy.move("right");` … `coddy.say('Men Momiqman!');` — o'zi chiqadi |
| Ko'rinish | etalondagi mozaika bloklarga juda yaqin: shakl (tepada o'yiq, pastda tishcha), rang, shrift bir xil; rang doirachalari ham |

## Halol: nima sinalmadi va xavflar

- **Sensorli panel va haqiqiy sinf noutbuki** — sichqoncha skript bilan sinaldi. Bola barmog'i bilan sudrash sinfda ko'riladi.
- **Internet:** sinov CDN'dan yuklaydi. Sinfda internet bo'lmasligi mumkin → darsga Blockly fayllari loyihaning ichiga qo'yiladi (3 fayl, litsenziya fayli bilan). Bu — keyingi qaror: `new-junior/public/vendor/blockly/` ga nusxa (npm'siz) yoki `new-junior` ga alohida `package.json`.
- **Ichki klasslar:** rang doirachalari Blockly'ning ichki klassiga (`.blocklyTreeRowContentContainer`) tayanadi — Blockly versiyasi yangilansa buzilishi mumkin. Shuning uchun versiya qat'iy (13.4.0) va yangilashdan oldin shu o'lchov qayta yurgiziladi.
- **Javon kategoriya bosilganda almashadi** (Scratch'dagidek bitta uzun javon emas). 1-darsda ikki oila — muammo emas; ko'p oila bo'lsa «continuous toolbox» qo'shimchasi ko'riladi.
- **Dastur tepasidagi qahramon yuzi** va **tayyor dastur bilan boshlanadigan pog'ona** (7-sahna 1-pog'onasi: oltita `move right`) — sinovda yo'q; ikkalasi ham Blockly'da oddiy (ustki qatlam va `serialization.load`).
- **Bajarilayotgan blokni yoqish** `setHighlighted` bilan qilindi; ko'rinishi suratda alohida baholanmadi.

## Hukm

**A — Blockly bilan davom etamiz.** Sinov to'rtta talabning to'rttasini bajardi: ko'rinish etalonga mos, sudrash va bosib qo'shish ishlaydi, tez va yengil, JavaScript kodini o'zi chiqaradi (19-dars). O'zimiz yozsak (B), faqat sudrash-ulash va kod chiqarishning o'zi bir necha kunlik ish va xatoga moyil bo'lardi.

Keyingi qadam (foydalanuvchi tasdig'idan keyin): Blockly fayllarini loyihaga qo'yish (internetsiz ishlashi uchun) → 1-darsning `Studiya.jsx` ini Blockly ustiga ko'chirish (pog'onalar, muammochalar, «Keyingi pog'ona» mantig'i o'zgarmaydi).
