import sys, shutil, os
S = sys.argv[1]
SH = "0 8px 16px -8px rgba(255,79,40,.6), inset 0 2px 0 rgba(255,255,255,.3)"
R = {
'src/4-Modull/DbSqlNosqlLesson.jsx': [
 ("color: ${T.ink}; background: ${T.paper}; border: none; border-radius: 10px; padding: 9px 13px; cursor: grab; touch-action: none; box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.28);",
  "color: #fff; background: linear-gradient(170deg, #FF8A3D, ${T.accent}); border: none; border-radius: 10px; padding: 9px 13px; cursor: grab; touch-action: none; box-shadow: " + SH + ";"),
 (".qx-card.reject { animation: qx-shake 0.44s cubic-bezier(.36,.07,.19,.97); box-shadow: 0 0 0 2px ${T.accent}, 0 6px 16px -6px rgba(255,79,40,0.5); }",
  ".qx-card.reject { animation: qx-shake 0.44s cubic-bezier(.36,.07,.19,.97); box-shadow: 0 0 0 2px ${T.paper}, 0 0 0 4px ${T.accent}, 0 6px 16px -6px rgba(255,79,40,0.5); } /* F-1017-202: gradient chip — halqa oq+accent */"),
],
'src/1-Modull/VsCodeLesson.jsx': [("bu boshqa vositalar ishi.'", "bu boshqa dasturlar ishi.'"), ("'Rasm tahrirlaydigan kichik vosita'", "'Rasm tahrirlaydigan kichik dastur'")],
'src/2-Modull/JsIntroLesson.jsx': [
 ("ular ikkita kuchli vositadan foydalanadi: sistema va algoritm.", "ular ikkita kuchli usuldan foydalanadi: sistema va algoritm."),
 ("ular ikkita kuchli vositadan foydalanadi: <b", "ular ikkita kuchli usuldan foydalanadi: <b"),
 ("Dasturchining eng kuchli vositasi.</>", "Dasturchining eng kuchli usuli.</>")],
'src/2-Modull/JsLoopsLesson.jsx': [
 ("{ uz: 'Bugungi 2 katta vosita', ru: 'Два больших инструмента дня' }", "{ uz: 'Bugungi 2 katta mavzu', ru: 'Две большие темы дня' }"),
 ("Bugun ikkita vositani ochamiz —", "Bugun ikkita mavzuni ochamiz —"),
 ("{ uz: \"Vositalarni ko'rish\", ru: 'Посмотреть инструменты' }", "{ uz: \"Mavzularni ko'rish\", ru: 'Посмотреть темы' }"),
 ("Sikllar — eng ko'p ishlatiladigan vosita.", "Sikllar — eng ko'p ishlatiladigan usul.")],
'src/2-Modull/PeanStackLesson.jsx': [
 ("note: { uz: 'frontend vositasi', ru: 'инструмент frontend' }", "note: { uz: 'frontend uchun', ru: 'для frontend' }"),
 ("— u bunday vosita emas.\"", "— u bunday dastur emas.\"")],
'src/3-Modull/ReactBuildSiteLesson.jsx': [("qaysi vosita ishlatiladi?\"", "nima ishlatiladi?\"")],
'src/3-Modull/ReactIntroLesson.jsx': [
 ("Buni qiladigan vositaning nomi — <b>React</b>.", "Buni qiladigan narsaning nomi — <b>React</b>."),
 ("\"React Native o'yin yasash vositasi emas.\"", "\"React Native o'yin yasash uchun emas.\""),
 ("\"React bilimi bilan telefon ilovasi yasaydigan vositaning nomi nima?\"", "\"React bilimi bilan telefon ilovasi yasash uchun nima ishlatiladi?\"")],
'src/4-Modull/ApiPostmanLesson.jsx': [
 ("(ikki dastur o'zaro gaplashadigan vosita)", "(ikki dastur o'zaro gaplashadigan qoidalar)"),
 ("\"Sayt sahifasini bezaydigan chizish vositasi\"", "\"Sayt sahifasini bezaydigan chizish dasturi\"")],
'src/4-Modull/DataIntroLesson.jsx': [("Qog'oz o'rniga haqiqiy vosita bilan chizmoqchimisiz?", "Qog'oz o'rniga kompyuterda chizmoqchimisiz?")],
'src/4-Modull/NodeServerLesson.jsx': [("\"npm — tayyor paketlarni o'rnatadigan vosita.\"", "\"npm — tayyor paketlarni o'rnatadigan dastur.\"")],
'src/4a-Modull/NestArchAliveLesson.jsx': [("\"Parolni shifrlaydigan vosita\"", "\"Parolni shifrlaydigan dastur\"")],
'src/4c-Modull/CiCdIntroLesson.jsx': [
 ("shug'ullanadigan vositalar\"", "shug'ullanadigan dasturlar\""),
 ("\"Faqat testlarni yozib beradigan yordamchi vosita\"", "\"Faqat testlarni yozib beradigan yordamchi dastur\"")],
}
new = {}
for f, reps in R.items():
    t = open(f, encoding='utf-8').read()
    for o, n in reps:
        c = t.count(o)
        if c != 1: print('XATO', f, c, o[:70]); sys.exit(1)
        t = t.replace(o, n)
    new[f] = t
for f, t in new.items():
    shutil.copy(f, os.path.join(S, 'oldin-203', f.replace('/', '__'))); open(f, 'w', encoding='utf-8').write(t)
print('OK', len(new), 'fayl')
