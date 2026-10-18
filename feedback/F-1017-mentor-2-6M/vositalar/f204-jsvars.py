f='src/2-Modull/JsVarsLesson.jsx'
t=open(f,encoding='utf-8').read()
R=[
("eski qiymat tushib ketadi, yangisi joylashadi.</>, ru: <>Ваш",
 "eski qiymat tushib ketadi, yangisi joylashadi. Oxirgi qatordagi <span className=\"mono\">console.log(score)</span> qutida nima borligini pastdagi <b style={{ color: T.ink }}>konsolga</b> chiqaradi.</>, ru: <>Ваш"),
("— старое выпадет, новое займёт его место.</> })}</Mentor>",
 "— старое выпадет, новое займёт его место. Последняя строка <span className=\"mono\">console.log(score)</span> выводит содержимое коробки в <b style={{ color: T.ink }}>консоль</b> внизу.</> })}</Mentor>"),
("<span style={{ color: CODE.comment }}>{'// yangilandi'}</span></>}</pre>",
 "<span style={{ color: CODE.comment }}>{'// yangilandi'}</span>{'\\n'}</>}<Vr>console</Vr>.<Vr>log</Vr>(<Vr>score</Vr>)</pre>\n            {/* F-1017-204: console.log birinchi praktikadan oldin — natija konsolda ko'rinadi */}\n            <p className=\"flow-label\" style={{ margin: 0 }}>{tr({ uz: 'Konsol', ru: 'Консоль' })}</p>\n            <pre className=\"code-box\" style={{ fontSize: 'clamp(13px,2vw,15px)', margin: 0 }}><span style={{ color: CODE.comment }}>{'> '}</span><Nm>{ball}</Nm></pre>"),
]
for o,n in R:
    assert t.count(o)==1,(o[:50],t.count(o)); t=t.replace(o,n)
open(f,'w',encoding='utf-8').write(t); print('ok')
