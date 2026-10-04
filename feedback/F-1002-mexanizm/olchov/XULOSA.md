# 2-bosqich o'lchov — 5-Modul 12 dars, statik skriptlar (02.10 11:15, kod o'zgartirilmagan)
| Skript | Natija | Izoh |
|---|---|---|
| lint:dizayn | 🔴 10 error (D1 stripe 8 · D2 2), 🟡 31 warn (ko'pi D5 «bosing») | PmMetrics 4 error, BotIntro 2 — bu 12 dars «yashil» deb saytga chiqqan edi, lint yurgizilmagan |
| lint:tell | 0 error · 2 warn | gates'da bor |
| lint:emoji | 0 error · 1 warn (BotIntro 🏅×2) | gates'da bor |
| lint:til | 0 error · warnlar (registr-zor-qoyil, kirill-lotin) | gates'da bor |
| lint:layout | yurgizilmadi — port 5300 vite + Chrome kerak | modul-oxiri darvozasi nomzodi |
| page-audit | yurgizilmadi — Chrome | |
Loglar: shu papkada `*-m5.log`.

## Brauzer-lintlar (02.10 11:35–11:53, kod o'zgartirilmagan; m5-12 «Zaxira dars» komponentsiz — 0 ekran, 11-dars = m5-14 bu yurishga kirmagan)
| Skript | Natija |
|---|---|
| lint:layout (uz · self · 1280x773 + 390x844 · 416 ekran · 1850 bosish) | 24 (dars×vp) dan **21 nuqsonli**: «pastki chiziqdan tushgan» (E) **40 holat** (eng ko'pi m5-03 va m5-10 — 1280 da 14 va 15; m5-10 s16 aistudio namuna-kartasi 437 px); «o'quvchi ochgan panel tushadi» 9; yakun ekrani ataylab skroll 147 (yiqitmaydi); A/B/C/D (qirqilish, ustma-ust, chiqish, yopilish) — sinf-ro'yxatda 13–26 qatorlar |
| page-audit (1280x800, `--clicks=2`, 12 dars) | INP 1 (PmLesson20) · ALIGN 0 · SCROLL 2 (BotAiAgent, BotAiBrain) · ZBTN 0 · LOUD 0 · DUP 67 (PmMetrics 12, BotAiAgent 10, BotApiButtons 10) · EQH 29 · LOOSE 107 — DUP/LOOSE/EQH ko'rsatkichlari kalibrovkasiz, yolg'on-musbat bo'lishi mumkin |
Xulosa 2-bosqichga: `lint:dizayn` (10 error) va `lint:layout` E-detektori (40) 5-Modulni «yashil» deb o'tkazgan konveyerda yurmagan. Ikkalasi modul-oxiri darvozasiga nomzod; `page-audit` DUP/LOOSE avval kalibrovka talab qiladi.
