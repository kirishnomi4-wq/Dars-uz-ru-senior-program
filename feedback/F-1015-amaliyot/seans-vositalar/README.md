# Seans vositalari (15.10, F-1015-3xx) — scratchpad'dan ko'chirildi

Scratchpad seans yopilganda o'chadi — shu yerga olindi. `playwright-core` va `esbuild` repo `node_modules` da bor, alohida o'rnatish shart emas.
Brauzer: `/usr/bin/google-chrome`. Fayl yo'li **absolut** beriladi.

## Sinov (sinov/)
| Skript | Nima qiladi | Chaqirish (repo ildizidan) |
|---|---|---|
| `tekshir.mjs` | CssPractice to'liq sinovi (forma→Saqlash→Tahrirlash, prompt, a4, kontrast, 390 px, saqlov) → `natija.txt` (15.10 ~20:45: 49/49) | `node feedback/F-1015-amaliyot/seans-vositalar/sinov/tekshir.mjs $PWD/feedback/F-1015-amaliyot/seans-vositalar/sinov` |
| `navtest2.mjs` | eski progress bilan ochish → «Orqaga» 0 gacha → oldinga; har ekranda «Davom etish» ochiqmi | `node …/sinov/navtest2.mjs $PWD/src/1-Modull/CssPractice.jsx self 8` |
| `mentor.mjs` | mentor rejimi: qaysi ekran ochiq/yopiq | `node …/sinov/mentor.mjs $PWD/src/1-Modull/CssPractice.jsx` |
| `f316.mjs`, `maket.mjs`, `uslub.mjs`, `oqim.mjs`, `opac.mjs`, `ava.mjs`, `url.mjs` | bir martalik surat/o'lchov yordamchilari; `tekshir.mjs` yig'gan `sinov.html` ni kutadi (argument: sahifa yo'li, chiqish papkasi) | — |

`nav/` — bo'sh papka turishi shart (navtest2/mentor sahifani shu yerga yozadi, papkani o'zi yaratmaydi). `sinov.html` — `tekshir.mjs` har safar qayta yozadi.

## Qurish (qurish/)
`f310.py` · `f313.py` · `f314.py` · `f316.py` — CssPractice'ga qo'llangan tahrir-skriptlari (har biri `assert count==1` bilan; **qayta yurgizilmaydi** — allaqachon qo'llangan, tarix uchun).
`yig.py`/`ekranlar.jsx` — pilot v1, `yig-v2.py`/`ekranlar-v2.jsx` — v2 (Demo Day). `pilot-natija.html` — artifact manbasi.

## Artifact manbalari
`hisobot/praktika-qolipi.html` (18 praktika hisoboti) · `gatem/gatem-m110.html`, `gatem-2M.html`, `gatem-3M.html` (+ `cfg-*.json`) · `v2/v2-reja.html` · `f310/tuzatish.html` · `f314/rasm.html`.

## Suratlar (suratlar/)
`qurish/yakun` (v2 9 ekran 1280 + 390) · `qurish/f313`, `f314`, `f316` (fidbek bo'yicha) · `v2/shots/deploy` (DeployLesson hozirgi 6 ekrani — GATE V2 Q1 uchun) · `gatem/sh`.
Oraliq suratlar (qurish/shots, audit, hisobot/shots) olinmadi — eskirgan.
