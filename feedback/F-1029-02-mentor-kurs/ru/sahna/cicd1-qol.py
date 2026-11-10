PAIRS = [
 ('05-s01-s07.jsx', r'''<b>≈ 15 soniya</b>''', r'''<b>{t("≈ 15 soniya", "≈ 15 секунд")}</b>'''),
 ('06-s08-s16.jsx', r'''</b>. Run jami {KOD.RUNS['10'].dur}''', r'''</b>{t(". Run jami ", ". Всего run ")}{KOD.RUNS['10'].dur}'''),
 ('06-s08-s16.jsx', r'''<div className="n2-warn">Lenta <b>{t("faqat so'ralgan''', r'''<div className="n2-warn">{t("Lenta ", "Конвейер ")}<b>{t("faqat so'ralgan'''),
 ('06-s08-s16.jsx', r'''<code>npx tsc --noEmit</code> — <code>npm ci</code>dan keyin, <code>npm test</code>dan oldin: 3 soniya, build'gacha bormay to'xtatadi.</div>''',
  r'''{t(<><code>npx tsc --noEmit</code> — <code>npm ci</code>dan keyin, <code>npm test</code>dan oldin: 3 soniya, build'gacha bormay to'xtatadi.</>, <><code>npx tsc --noEmit</code> — после <code>npm ci</code>, до <code>npm test</code>: 3 секунды, останавливает, не доходя до build.</>)}</div>'''),
 ('07-s17-s25.jsx', r'''{box('pkg', T.green, t('Paket tayyor', "Пакет готов"), 'dist/ — lekin .env yo\'q, baza yo\'q')}''', r'''{box('pkg', T.green, t('Paket tayyor', "Пакет готов"), t('dist/ — lekin .env yo\'q, baza yo\'q', "dist/ — но нет .env и базы"))}'''),
]
