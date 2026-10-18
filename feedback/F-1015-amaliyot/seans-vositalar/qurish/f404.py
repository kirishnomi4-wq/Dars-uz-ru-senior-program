# F-1015-404: m4c-04 08/08 yakun — 3 band kesilgan ekranlarga tayanardi (SEYF saqlash, staging/production, TABLO qo'yish);
# dars hozir o'rgatadigan narsaga almashtirildi (F-401 sinfi). Zaxira: arxiv/F-1015-404-oldin/. Qayta yurgizilmaydi.
import pathlib
P = pathlib.Path('/home/kali/Desktop/internetLesson/src/4c-Modull/FullPipelineProjectLesson.jsx')
s = P.read_text()
def rep(old, new):
    global s
    assert s.count(old) == 1, (s.count(old), old[:90]); s = s.replace(old, new)
rep("""    { uz: "Maxfiy kalitni SEYFda saqlash va lentaga ulashni ko'rdingiz", ru: 'Вы видели, как хранить секретный ключ в СЕЙФЕ и подключать его к конвейеру' },""",
    """    { uz: "Seyf ulanmasa Uchirish 401 bilan yiqiladi — maxfiy kalit lentaga seyfdan beriladi", ru: 'Без СЕЙФА Вылет падает с 401 — секретный ключ конвейер берёт из сейфа' }, // F-1015-404""")
rep("""    { uz: "Sinov reysi (staging) va haqiqiy reys (production) farqini ajratasiz", ru: 'Вы различаете пробный рейс (staging) и настоящий рейс (production)' },""",
    """    { uz: "Bitta nuqta qizarsa keyingilari o'tkazib yuboriladi — lenta xatoni o'tkazmaydi", ru: 'Если одна точка красная — следующие пропускаются: конвейер не пропустит ошибку' },""")
rep("""    { uz: "TABLONI repo sahifasiga qo'yishni bilasiz", ru: 'Вы умеете вешать ТАБЛО на страницу репозитория' }""",
    """    { uz: "TABLO repo sahifasida yashil yoki qizil — lenta holatini bir qarashda ko'rasiz", ru: 'ТАБЛО на странице репозитория зелёное или красное — состояние конвейера видно с одного взгляда' }""")
P.write_text(s); print('OK f404')
