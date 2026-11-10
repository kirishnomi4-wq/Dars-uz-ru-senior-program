PAIRS = [
 ('05-s01-s09.jsx', r'''<div className="mk-rule">Ro'yxat <b>bazada</b>{t(". Uzilishdan''',
  r'''<div className="mk-rule">{t("Ro'yxat ", "Список ")}<b>{t("bazada", "в базе")}</b>{t(". Uzilishdan'''),
 ('05-s01-s09.jsx', r'''<b>qayta so'rashi</b>{t(" kerak. Hozirgi panel buni qilmaydi.", " . Текущая панель этого не делает.")}''',
  r'''<b>{t("qayta so'rashi", "запрашивать заново")}</b>{t(" kerak. Hozirgi panel buni qilmaydi.", ". Текущая панель этого не делает.")}'''),
 ('07-s17-s25.jsx', r'''· запись поломки · исправление ")}<code>ulanish.ts</code> da</p>''',
  r'''· запись поломки · исправление в ")}<code>ulanish.ts</code>{t(" da", "")}</p>'''),
 ('04-yordam.jsx', r'''`${g.rc} qayta ulanishdan keyin`''',
  r'''t(`${g.rc} qayta ulanishdan keyin`, `после ${g.rc}-го переподключения`)'''),
]
