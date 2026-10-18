import sys
f=sys.argv[1]; t=open(f,encoding='utf-8').read()
def rep(o,n):
    global t; assert t.count(o)==1,(o[:60],t.count(o)); t=t.replace(o,n)
rep("  const done = items.length >= 3;\n  const MAX = 7;",
    "  const MAX = 8;\n  // F-1017-215 (mentor: «kattaroq, qiziqroq»): maqsad — namunadagi do'kon (menyu + kamida 2 skin + pastki qism), tartib erkin\n  const TARGET = ['nav', 'search', 'card', 'card', 'card', 'footer'];\n  const has = (k, n = 1) => items.filter(x => x === k).length >= n;\n  const done = has('nav') && has('card', 2) && has('footer');\n  const missing = [!has('nav') && COMP.nav.name, !has('card', 2) && (tr({ uz: '2 ta skin kartochka', ru: '2 карточки скина' })), !has('footer') && COMP.footer.name].filter(Boolean);")
i=t.index("<Mentor>{tr({ uz: <>Endi o'zingiz quring. <b style={{ color: T.ink }}>Tugmalarni bosib</b>"); j=t.index("</Mentor>",i)+len("</Mentor>")
t=t[:i]+"""<Mentor>{tr({ uz: <>Endi o'zingiz quring: namunadagi do'konni <b style={{ color: T.ink }}>tugmalarni bosib</b> yig'ing — menyu, qidiruv, <b style={{ color: T.ink }}>3 ta skin</b> va pastki qism. Bitta blok necha marta kerak bo'lsa, shuncha bosing.</>, ru: <>Теперь сами: соберите магазин как в образце, <b style={{ color: T.ink }}>нажимая кнопки</b> — меню, поиск, <b style={{ color: T.ink }}>3 скина</b> и подвал. Один блок можно нажать столько раз, сколько нужно.</> })}</Mentor>"""+t[j:]
rep("""<button key={k} className="gchip" disabled={items.length >= MAX} onClick={() => add(k)}>{COMP[k].name} <span className="mono" style={{ color: CODE.tag, fontSize: 11 }}>{COMP[k].l}</span></button>""",
    """<button key={k} className="gchip" disabled={items.length >= MAX} onClick={() => add(k)}>{COMP[k].name} <span className="mono" style={{ color: CODE.tag, fontSize: 11 }}>{COMP[k].l}</span>{counts[k] > 1 && <span style={{ marginLeft: 6, fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 700, color: T.success }}>×{counts[k]}</span>}</button>""")
rep("""            <p className="flow-label">{tr({ uz: 'Sahifangiz', ru: 'Ваша страница' })}</p>
            <Win title="mening-mc-saytim.uz" minH={130}>""",
    """            <p className="flow-label">{tr({ uz: 'Namuna — shunday bo\\'lsin', ru: 'Образец — так должно быть' })}</p>
            <div className="fade-up delay-1" style={{ display: 'flex', gap: 5, flexWrap: 'wrap', alignItems: 'center', padding: '6px 10px', background: T.bg, borderRadius: 10, marginBottom: 6 }}>
              {TARGET.map((k, i) => <span key={i} className="mono" style={{ fontSize: 11, color: '#C8501F', background: T.paper, borderRadius: 6, padding: '3px 7px' }}>{COMP[k].l}</span>)}
            </div>
            <p className="flow-label">{tr({ uz: 'Sahifangiz', ru: 'Ваша страница' })} <span style={{ color: done ? T.success : T.ink3, fontWeight: 700 }}>{done ? '✓' : `${items.length}/${TARGET.length}`}</span></p>
            <Win title="mening-mc-saytim.uz" minH={260}>""")
rep("<span style={{ width: 34, height: 34, borderRadius: 6, background: sk.bg, backgroundImage: PIXEL, backgroundSize: '8.5px 8.5px'",
    "<span style={{ width: 52, height: 52, borderRadius: 8, background: sk.bg, backgroundImage: PIXEL, backgroundSize: '10px 10px'")
rep("""<span style={{ fontFamily: MANROPE, fontWeight: 700, fontSize: 10.5, color: T.ink }}>{tr(sk.name)}</span>""",
    """<span style={{ fontFamily: MANROPE, fontWeight: 800, fontSize: 13, color: T.ink }}>{tr(sk.name)}</span>""")
rep("""{done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Siz hozir <b>React'cha fikrladingiz</b>: sahifa = komponentlar ro'yxati.</>""",
    """{!done && items.length > 0 && <p className="small fade-step" style={{ margin: 0, color: T.ink2 }}>{tr({ uz: 'Yetishmayapti: ', ru: 'Не хватает: ' })}{missing.join(' · ')}</p>}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Do'kon tayyor! Siz hozir <b>React'cha fikrladingiz</b>: sahifa = komponentlar ro'yxati, bitta <span className="mono">&lt;SkinCard /&gt;</span> — uch xil karta.</>""")
rep("""label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: 'Kamida 3 ta blok', ru: 'Минимум 3 блока' })} (${items.length}/3)`}""",
    """label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: "Do'konni namunadek yig'ing", ru: 'Соберите магазин как в образце' })}""")
open(f,'w',encoding='utf-8').write(t); print('ok')
