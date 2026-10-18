import sys,shutil,os
S=sys.argv[1]
R={
'src/1-Modull/PmLesson1.jsx':[("AYNAN shu asbob ishlaydi","AYNAN shu kompilyator ishlaydi"),("to'liq-ekran asbob, shuning","to'liq-ekran oyna, shuning")],
'src/1-Modull/PmLesson2.jsx':[("AYNAN shu asbob ishlaydi","AYNAN shu kompilyator ishlaydi"),("to'liq-ekran asbob, shuning","to'liq-ekran oyna, shuning")],
'src/1-Modull/PmLesson3.jsx':[("// asbob, shuning","// oyna, shuning")],
'src/2-Modull/PmLesson4.jsx':[("// asbob, shuning","// oyna, shuning")],
'src/3-Modull/PmLesson9.jsx':[("to'liq-ekran asbob, shuning","to'liq-ekran oyna, shuning"),("Chapda ish-asbob (oyna)","Chapda ish-oynasi")],
'src/4-Modull/PmLesson11.jsx':[("to'liq-ekran asbob, shuning","to'liq-ekran oyna, shuning")],
'src/4-Modull/PmLesson13.jsx':[("to'liq-ekran asbob, shuning","to'liq-ekran oyna, shuning")],
'src/4a-Modull/PmLesson15.jsx':[("to'liq-ekran asbob, shuning","to'liq-ekran oyna, shuning")],
'src/4c-Modull/PmLesson17.jsx':[("to'liq-ekran asbob, shuning","to'liq-ekran oyna, shuning")],
'src/3-Modull/ReactFirstComponentLesson.jsx':[("bitta buyruqda qaysi asbob yaratadi?","bitta buyruqda qaysi dastur yaratadi?"),("quruvchi tez asbob","quruvchi tez dastur")],
'src/3-Modull/ReactIntroLesson.jsx':[
 ("""h: { uz: "React — tayyor asboblar to'plami", ru: 'React — набор готовых инструментов' }""","""h: { uz: "React — tayyor bo'laklar to'plami", ru: 'React — набор готовых блоков' }"""),
 ("<b>tayyor asboblar</b> to'plami, sahifani","<b>tayyor bo'laklar</b> to'plami, sahifani"),
 ("React — набор <b>готовых инструментов</b> на JavaScript","React — набор <b>готовых блоков</b> на JavaScript"),
 ("Kutubxona degani — tayyor asboblar to'plami:","Kutubxona degani — tayyor bo'laklar to'plami:"),
 ("Библиотека — это набор готовых инструментов:","Библиотека — это набор готовых блоков:"),
 ("""uz: "React — interfeys qurish uchun tayyor asboblar to'plami.", ru: 'React — набор готовых инструментов для построения интерфейса.'""","""uz: "React — interfeys qurish uchun tayyor bo'laklar to'plami.", ru: 'React — набор готовых блоков для построения интерфейса.'"""),
 ("""uz: "React kabi tayyor asboblar to'plami qanday ataladi?", ru: 'Как называется набор готовых инструментов, такой как""","""uz: "React kabi tayyor bo'laklar to'plami qanday ataladi?", ru: 'Как называется набор готовых блоков, такой как"""),
],
'src/4-Modull/ApiPostmanLesson.jsx':[
 ("API'ni sinab ko'radigan asbob ·","API'ni sinab ko'radigan dastur ·"),
 ('uz: "Postman — postachi asbob"','uz: "Postman — postachi dastur"'),
 ("</b> degan asbob bilan o'z serveringizga","</b> degan dastur bilan o'z serveringizga"),
 ('— bu "postachi" asbob: siz','— bu "postachi" dastur: siz'),
 ('"Internet tezligini oshiradigan maxsus asbob"','"Internet tezligini oshiradigan maxsus qurilma"'),
 ('uz: "Postman qanday asbob?"','uz: "Postman qanday dastur?"'),
 ("API'ni sinash asbobi\"","API'ni sinash dasturi\""),
],
'src/4-Modull/AuthEnvLesson.jsx':[
 ("bog'liq — u bilaguzukka muhr bosadigan asbob.","bog'liq — bilaguzukdagi muhr shu kalit bilan bosiladi."),
 ("— это инструмент, которым ставят печать на браслет.","— именно им ставят печать на браслет."),
],
'src/4-Modull/NodeServerLesson.jsx':[
 ("""h: { uz: "Asboblar do'koni", ru: 'Магазин инструментов' }""","""h: { uz: "Paketlar do'koni", ru: 'Магазин пакетов' }"""),
 ("(Express — server emas, server yozish asbobi)","(Express — server emas, server yozish paketi)"),
 ("Yo'q — npm tayyor asboblar do'koni, millionlab paketlar. Bitta buyruq bilan kerakli asbobni javonga","Yo'q — npm tayyor paketlar do'koni, ularning soni millionlab. Bitta buyruq bilan kerakli paketni javonga"),
 ("npm nima qiladi? Asboblar do'konini eslang.","npm nima qiladi? Paketlar do'konini eslang."),
 ("""uz: "Tayyor asboblarni (paketlarni) o'rnatadi, masalan express", ru: 'Устанавливает готовые инструменты (пакеты)""","""uz: "Tayyor paketlarni o'rnatadi, masalan express", ru: 'Устанавливает готовые пакеты"""),
 ("O'rnatgan Express asbobini kodga","O'rnatgan Express paketini kodga"),
 ("Установленный инструмент Express","Установленный пакет Express"),
 ("o'rganing: asbobni chaqir, peshtaxtani","o'rganing: paketni chaqir, peshtaxtani"),
 ("Mana butun server! Asbobni chaqirish →","Mana butun server! Paketni chaqirish →"),
 ("hint: { uz: 'asbobni chaqir', ru: 'подключи инструмент' }","hint: { uz: 'paketni chaqir', ru: 'подключи пакет' }"),
 ("quriladi: avval asbobni chaqir,","quriladi: avval paketni chaqir,"),
 ("""uz: "Express — serverni osonlashtiruvchi asbob; endpoint = app.get('/manzil')", ru: "Express — инструмент, упрощающий сервер;""","""uz: "Express — serverni osonlashtiruvchi paket; endpoint = app.get('/manzil')", ru: "Express — пакет, упрощающий сервер;"""),
 ("""uz: "Yirik loyihalarda Express o'rniga qaysi asbob ishlatiladi?", ru: 'Какой инструмент берут""","""uz: "Yirik loyihalarda Express o'rniga qaysi paket ishlatiladi?", ru: 'Какой пакет берут"""),
 ("""{ uz: "Serverni osonlashtiruvchi asbob", ru: 'Инструмент, упрощающий сервер' }""","""{ uz: "Serverni osonlashtiruvchi paket", ru: 'Пакет, упрощающий сервер' }"""),
],
'src/4b-Modull/JestUnitTestLesson.jsx':[
 ("<>Test asbobi kerak — <b","<>Testlarni ishga tushiradigan dastur kerak — <b"),
 ("""uz: "Jest asbobini loyihaga o'rnatib sozlaydi\"""","""uz: "Jest dasturini loyihaga o'rnatib sozlaydi\""""),
 ("""uz: "Testlarni ishga tushiradigan asbob qanday ataladi?\"""","""uz: "Testlarni ishga tushiradigan dastur qanday ataladi?\""""),
],
'src/4c-Modull/PmLesson18.jsx':[
 ("o'lchab turadigan asbob</b> — o'lchagich.","o'lchab turadigan dastur</b> — o'lchagich."),
 ("o'lchab turadigan asbob — o'lchagich deyiladi.","o'lchab turadigan dastur — o'lchagich deyiladi."),
 ("""back: { uz: "Sayt chiqqandan keyin uni to'xtovsiz o'lchab turadigan asbob\"""","""back: { uz: "Sayt chiqqandan keyin uni to'xtovsiz o'lchab turadigan dastur\""""),
 ("""uz: "Chiqqandan keyin saytni o'lchab turadigan asbob\"""","""uz: "Chiqqandan keyin saytni o'lchab turadigan dastur\""""),
 ("oldin tekshiradigan asbob'","oldin tekshiradigan dastur'"),
 ("""tr({ uz: "Sayt chiqqandan keyin uni to'xtovsiz o'lchab turadigan asbob — o'lchagich.\"""","""tr({ uz: "Sayt chiqqandan keyin uni to'xtovsiz o'lchab turadigan dastur — o'lchagich.\""""),
 ("— asbob-yuzasi chipi","— dastur-yuzasi chipi"),
],
}
# JestUnitTest: 2 bir xil qator (1304, 1663) — hammasi almashtiriladi
MULTI={("src/4b-Modull/JestUnitTestLesson.jsx","""uz: "Jest asbobini loyihaga o'rnatib sozlaydi\""""):2}
err=0
new={}
for f,reps in R.items():
    t=open(f,encoding='utf-8').read()
    for o,n in reps:
        c=t.count(o); want=MULTI.get((f,o),1)
        if c!=want: print("XATO",f,c,"≠",want,o[:70]); err+=1; continue
        t=t.replace(o,n)
    new[f]=t
if err: sys.exit(1)
for f,t in new.items():
    shutil.copy(f, os.path.join(S,'oldin-200',f.replace('/','__')))
    open(f,'w',encoding='utf-8').write(t)
print("OK",len(new),"fayl")
