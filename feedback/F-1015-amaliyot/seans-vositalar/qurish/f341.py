# F-1015-341: m2-11 PracticeLesson3 — a1 «Do'konni yig'ing» (sudrash, bog'liqlik, 40 daqiqa) + jonli katalog (toifa tugmalari, qidiruv)
import pathlib, sys
F = pathlib.Path('/home/kali/Desktop/internetLesson/src/2-Modull/PracticeLesson3.jsx')
BLOK = pathlib.Path(__file__).with_name('f341-blok.jsx').read_text()
s = F.read_text()
def rep(old, new, n=1):
    global s
    c = s.count(old)
    if c != n: sys.exit(f'TOPILMADI ({c}): {old[:80]!r}')
    s = s.replace(old, new)
a = s.index('// ===== SCREEN 1 — REJA (F-1015-340)')
b = s.index('// ===== SCREEN 4 — TEST 1 =====')
s = s[:a] + BLOK + s[b:]
rep("import React, { useState, useEffect, useRef, useCallback, useMemo, createContext, useContext } from 'react';",
    "import React, { useState, useEffect, useLayoutEffect, useRef, useCallback, useMemo, createContext, useContext } from 'react';")
rep("//        keyin faqat 1-qadamni quradi (gemini.google.com: mahsulotlar va narxlar) va Copilot bilan 2 mahsulot qo'shadi. Savat/jami -> 4-dars (o'sha papka).\n",
    "//        keyin faqat 1-qadamni quradi (gemini.google.com: mahsulotlar va narxlar) va Copilot bilan 2 mahsulot qo'shadi. Savat/jami -> 4-dars (o'sha papka).\n"
    "// F-1015-341: a1 = «Do'konni yig'ing» (qismlarni Shart/Keyin ga sudrash, bog'liqlik, 40 daqiqa, o'ngda do'kon jonli quriladi);\n"
    "//        loyiha = jonli katalog: massiv + for (kartochkalar), if (toifa tugmalari) — Gemini; qidiruv funksiyasi — Copilot. Sevimli — uyga vazifa.\n")
# nishonlar
rep("""desc: { uz: "Do'kon rejasini o'zingiz yozdingiz", ru: 'Вы сами написали план магазина' }""",
    """desc: { uz: "Do'kon rejasini o'zingiz tuzdingiz", ru: 'Вы сами составили план магазина' }""")
rep("""desc: { uz: "MVP'ning birinchi qadamini qurdingiz", ru: 'Вы построили первый шаг MVP' }""",
    """desc: { uz: 'Katalog va toifa tugmalarini qurdingiz', ru: 'Вы построили каталог и кнопки категорий' }""")
rep("""desc: { uz: "Do'kon katalogini oxirigacha qurdingiz", ru: 'Вы достроили каталог магазина' }""",
    """desc: { uz: "Qidiruvni qo'shib, MVP'ni tugatdingiz", ru: 'Вы добавили поиск и закончили MVP' }""")
# arena: bugun qidiruv MVP ichida; Gemini'ga bitta qadam emas, rejadagi kichik qism
rep("""{ uz: 'Qidiruv va login', ru: 'Поиск и логин' }""", """{ uz: "To'lov va login", ru: 'Оплата и логин' }""")
rep("""{ uz: 'Rejadagi faqat birinchi qadamni', ru: 'Только первый шаг из плана' }""", """{ uz: 'Rejadagi kichik bir qismni', ru: 'Небольшую часть из плана' }""")
# yakun
rep("""tr({ uz: "«Shart» (MVP) — busiz do'kon ishlamaydi; «keyin» — kutsa bo'ladi", ru: '«Нужно» (MVP) — без этого магазин не работает; «потом» — может подождать' }), tr({ uz: 'Poydevordan boshlaysiz: avval mahsulotlar va narxlar', ru: 'Начинаете с фундамента: сначала товары и цены' }), tr({ uz: "Bitta qadam — bitta so'rov", ru: 'Один шаг — один запрос' }), tr({ uz: 'Copilot naqshni davom ettiradi — mazmunini siz berasiz', ru: 'Copilot продолжает образец — содержание задаёте вы' })]""",
    """tr({ uz: "MVP — vaqtga sig'adigan, lekin ishlaydigan qism; qolgani «keyin»", ru: 'MVP — часть, которая укладывается во время и работает; остальное — «потом»' }), tr({ uz: "Ba'zi qism boshqasisiz ishlamaydi: savat — kartochkalardan keyin", ru: 'Некоторые части не работают без других: корзина — после карточек' }), tr({ uz: 'Mahsulotlar massivda, kartochkalar for sikli bilan, toifa tugmalari if bilan', ru: 'Товары — в массиве, карточки — циклом for, кнопки категорий — через if' }), tr({ uz: 'Copilot izohdan funksiya yozadi — nima qilishini siz aytasiz', ru: 'Copilot пишет функцию по комментарию — что она делает, говорите вы' })]""")
rep("""{ b: tr({ uz: '«Keyin» qadamlar', ru: 'Шаги «потом»' }), t: tr({ uz: "— REJA.md da ularni ham muhimlik bo'yicha tartiblang", ru: '— расставьте и их в REJA.md по важности' }) }""",
    """{ b: tr({ uz: 'Sevimli', ru: 'Избранное' }), t: tr({ uz: "— har kartochkaga yurak tugmasi qo'shing: bosilsa to'ladi (Copilot yoki Gemini bilan)", ru: '— добавьте на каждую карточку кнопку-сердечко: по нажатию закрашивается (с Copilot или Gemini)' }) }""")
# CSS: yetim qoidalar olinadi, yangilari qo'shiladi
rep("""        .rj-up { flex: none; width: 32px; height: 32px; border-radius: 8px; border: 1.5px solid ${T.line}; background: ${T.bg}; color: ${T.ink}; font: 700 14px 'Manrope', sans-serif; cursor: pointer; }
        .rj-up:hover:not(:disabled) { border-color: ${T.ink2}; }
        .rj-up:disabled { opacity: 0.35; cursor: default; }
        .rj-up:focus-visible { outline: 2px solid ${T.accent}; outline-offset: 2px; }
        .am-chip.on.rj-shart { border-color: ${T.success}; color: ${T.success}; box-shadow: 0 0 0 1.5px ${T.success}; }
""", """        .rj-qator .dk-toifa-in { flex: 0 0 118px; padding: 8px 8px; }
""")
rep("""        .dk-yangi { border: 2px solid ${T.success}; }
""", "")
CSS = pathlib.Path(__file__).with_name('f341.css').read_text()
rep("""      `}</style>""", CSS + """      `}</style>""")
F.write_text(s)
print('OK', len(s))
