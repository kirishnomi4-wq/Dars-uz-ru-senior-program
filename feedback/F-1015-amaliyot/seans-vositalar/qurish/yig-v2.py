import sys,re
F='src/1-Modull/CssPractice.jsx'
S=open(F,encoding='utf8').read()
NEW=open(sys.argv[1],encoding='utf8').read()
def one(a):
    n=S.count(a); assert n==1,(n,a[:90]); return S.index(a)
def rep(a,b):
    global S; one(a); S=S.replace(a,b)
# 1) qolip bo'limi: s16 (Screen16) pilotdan saqlanadi
i=one("// ===== F-1015-303 · Praktika qolipi (pilot)"); j=one("// ===== 🃏 FLASHCARDS")
blk=S[i:j]; k=blk.index("// ===== s16 — TOPSHIRISH")
S=S[:i]+NEW+"\n"+blk[k:]+S[j:]
# 2) dars nomi (Q5 A)
rep("const LESSON_META = { lessonId: 'css-practice-portfolio-v3', lessonTitle: { uz: 'CSS Praktika — Portfolioni bezaymiz', ru: 'CSS практика — стилизуем портфолио' } };",
    "const LESSON_META = { lessonId: 'css-practice-portfolio-v3', lessonTitle: { uz: 'CSS Praktika — Demo Day saytini bezaymiz', ru: 'CSS практика — оформляем сайт для Demo Day' } }; // lessonId — LMS kaliti, o'zgarmaydi (F-1015-309)")
# 3) kartochka: :hover → font-family
rep("""  { front: { uz: 'Sichqoncha ustida turgan holat qanday yoziladi?', ru: 'Как пишется состояние «мышь над элементом»?' }, back: ':hover', note: { uz: 'masalan: nav a:hover', ru: 'например: nav a:hover' } },""",
    """  { front: { uz: 'Shriftni qaysi xususiyat beradi?', ru: 'Какое свойство задаёт шрифт?' }, back: 'font-family', note: { uz: 'masalan: font-family: Arial, sans-serif', ru: 'например: font-family: Arial, sans-serif' } },""")
rep("""note: { uz: 'masalan: color: #d4380d', ru: 'например: color: #d4380d' } },""","""note: { uz: 'masalan: color: #d4380d', ru: 'например: color: #d4380d' } },""")
# 4) nishonlar (id saqlanadi)
rep("""  spacer:   { icon: '📦', name: 'Spacer',       desc: { uz: 'Menyu havolalarini tugmaga aylantirdingiz', ru: 'Вы превратили ссылки меню в кнопки' } },
  layout:   { icon: '📐', name: 'Lined Up!',    desc: { uz: 'Loyihalarni yonma-yon kartochkalarga tizdingiz', ru: 'Вы выстроили проекты карточками в ряд' } },""",
"""  spacer:   { icon: '🚀', name: 'Kick Off!',    desc: { uz: 'Demo Day saytingiz bosh sahifasini boshladingiz', ru: 'Вы начали главную страницу сайта для Demo Day' } },
  layout:   { icon: '🎨', name: 'Styled!',      desc: { uz: "Saytingizga o'zingiz tanlagan uslubni berdingiz", ru: 'Вы дали сайту выбранный стиль' } },""")
rep("""  color:    { icon: '🎨', name: 'Color Master',""","""  color:    { icon: '🖌️', name: 'Color Master',""")
# 5) yakun: takrorlash, uyga vazifa, audio
rep('''text: "Tabriklayman! Siz dizayner bo'ldingiz: Gemini bergan dizaynni o'qib, o'zgartirdingiz va o'z rangingizni berdingiz."''',
    '''text: "Tabriklayman! Demo Day saytingizning bosh sahifasi tayyor: HTML'ni Gemini yozdi, uslubni siz tanladingiz va rangni o'zingiz berdingiz."''')
i=one("  const RECAP = [{ uz: \"Gemini bergan `style.css`"); j=S.index("\n",i)
S=S[:i]+'''  const RECAP = [{ uz: "Gemini'ga HTML'ni qismlari bilan aniq so'raysiz", ru: 'Точно просите у Gemini HTML с перечнем частей' }, { uz: 'Uslubni so\\'z bilan tasvirlab, dizayn olasiz', ru: 'Описываете стиль словами и получаете дизайн' }, { uz: '`display: flex` + `gap` — kartalar bir qatorda', ru: '`display: flex` + `gap` — карточки в один ряд' }, { uz: "Rangni butun faylda `Ctrl+H` bilan o'zingiz almashtirasiz", ru: 'Сами меняете цвет во всём файле через `Ctrl+H`' }];'''+S[j:]
rep('''<p className="hw-note">{tr({ uz: 'Tayyor sahifaning skrinshotini platformaga yuklang.', ru: 'Загрузите скриншот готовой страницы на платформу.' })}</p></div>}''',
    '''<p className="hw-note">{tr({ uz: 'Bosh sahifa skrinshotini platformaga yuklang. Keyingi dars — Git va GitHub; Netlify darsida saytni tugatib, internetga chiqarasiz.', ru: 'Загрузите скриншот главной страницы на платформу. Следующий урок — Git и GitHub; на уроке Netlify допишете сайт и выложите его в интернет.' })}</p></div>}''')
i=one("export const HOMEWORK = {"); j=S.index("\n};",i)+3
S=S[:i]+'''export const HOMEWORK = {
  type: 'file',
  title: { uz: "Saytingizning qolgan sahifalarini rejalang", ru: 'Спланируйте остальные страницы сайта' },
  brief: {
    uz: "Demo Day saytingiz bosh sahifasi tayyor. Uyda qolgan sahifalarni rejalaysiz — Netlify darsida ularni shu dizaynda qo'shib, saytni internetga chiqarasiz. Bosh sahifa skrinshotini platformaga yuklaysiz.",
    ru: 'Главная страница вашего сайта для Demo Day готова. Дома спланируйте остальные страницы — на уроке Netlify вы добавите их в том же дизайне и выложите сайт в интернет. Скриншот главной страницы загрузите на платформу.'
  },
  items: [
    { uz: "Saytingizda yana qaysi 3 sahifa bo'lishini yozing (masalan, sahifalar.txt)", ru: 'Напишите, какие ещё 3 страницы будут на сайте (например, sahifalar.txt)' },
    { uz: 'Har sahifaga bir gap: unda nima turadi', ru: 'Для каждой страницы — одна фраза: что на ней будет' },
  ],
};'''+S[j:]
# 6) CSS: ps-* → ds-*, am-uslub, am-bank
i=one("        .ps { background:"); j=one("        .ps-halqa {"); j=S.index("\n",j)+1
S=S[:i]+r"""        .am-uslub { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 8px; }
        .am-uslub-btn { display: flex; flex-direction: column; gap: 2px; text-align: left; background: ${T.bg}; border: 1.5px solid ${T.line}; border-radius: 10px; padding: 10px 12px; font-family: 'Manrope', sans-serif; font-size: 14px; color: ${T.ink}; cursor: pointer; }
        .am-uslub-btn span { font-size: 12.5px; color: ${T.ink2}; }
        .am-uslub-btn.on { border-color: ${T.ink}; background: ${T.paper}; box-shadow: 0 0 0 2px ${T.ink}; }
        .am-bank { display: flex; flex-direction: column; gap: 8px; }
        .ds { border-radius: 12px; overflow: hidden; box-shadow: 0 8px 22px -8px rgba(${T.shadowBase},0.22); font-family: Arial, sans-serif; background: #fff; }
        .ds-bar { display: flex; align-items: center; gap: 10px; background: #ECE9E1; padding: 7px 12px; }
        .ds-url { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink2}; }
        .ds-body { --ds-bg: #fff; --ds-ink: #1b1b1b; --ds-mut: #4a4a4a; --ds-acc: #d4380d; --ds-acc-ink: #fff; --ds-card: #fff; --ds-line: #e6e6e6; background: var(--ds-bg); color: var(--ds-ink); max-height: 340px; overflow-y: auto; }
        .ds-hd { display: flex; justify-content: space-between; align-items: center; gap: 10px; padding: 10px 14px; border-bottom: 1px solid var(--ds-line); font-size: 11px; }
        .ds-logo { font-weight: 700; max-width: 55%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .ds-nav { display: flex; gap: 10px; color: var(--ds-mut); }
        .ds-hero { text-align: center; padding: 18px 16px 14px; }
        .ds-h1 { margin: 0 0 6px; font-size: 19px; font-weight: 700; line-height: 1.2; }
        .ds-p { margin: 0; font-size: 11.5px; line-height: 1.45; color: var(--ds-mut); }
        .ds-tugma { display: inline-block; margin-top: 10px; background: var(--ds-acc); color: var(--ds-acc-ink); font-size: 11.5px; font-weight: 700; padding: 6px 14px; border-radius: 8px; }
        .ds-kartalar { display: flex; gap: 8px; padding: 6px 14px 14px; }
        .ds-karta { flex: 1; min-width: 0; background: var(--ds-card); border: 1px solid var(--ds-line); border-radius: 10px; padding: 8px 9px; }
        .ds-h2 { margin: 0 0 3px; font-size: 12px; font-weight: 700; color: var(--ds-acc); }
        .ds-ft { text-align: center; font-size: 10.5px; padding: 8px; border-top: 1px solid var(--ds-line); color: var(--ds-mut); }
        .ds-yorqin .ds-body { --ds-bg: #fff8ef; --ds-acc: #c2410c; --ds-line: #f3d9bf; }
        .ds-yorqin .ds-hd { background: #1d4ed8; color: #fff; border-color: #1d4ed8; } .ds-yorqin .ds-nav { color: #fff; }
        .ds-yorqin .ds-h1 { font-size: 22px; color: #1d4ed8; }
        .ds-qorongi .ds-body { --ds-bg: #111827; --ds-ink: #f3f4f6; --ds-mut: #d1d5db; --ds-acc: #34d399; --ds-acc-ink: #111827; --ds-card: #1f2937; --ds-line: #374151; }
        .ds-gradient .ds-body { --ds-bg: #fdf4ff; --ds-acc: #7e22ce; --ds-line: #f0d5f5; }
        .ds-gradient .ds-hero { background: linear-gradient(135deg, #f3e8ff, #fce7f3); }
        .ds-gradient .ds-karta { border-radius: 14px; box-shadow: 0 4px 12px rgba(126,34,206,0.12); }
        .ds-rang .ds-body { --ds-acc: #15803d; }
        .ds-rang.ds-qorongi .ds-body { --ds-acc: #fbbf24; }
        .ds-xom .ds-body { --ds-bg: #fff; --ds-ink: #000; --ds-mut: #000; --ds-acc: transparent; --ds-acc-ink: #1a0dab; --ds-card: transparent; --ds-line: transparent; font-family: 'Times New Roman', serif; }
        .ds-xom .ds-hd, .ds-xom .ds-hero { display: block; text-align: left; } .ds-xom .ds-nav { display: block; color: #1a0dab; text-decoration: underline; }
        .ds-xom .ds-kartalar { display: block; } .ds-xom .ds-karta { border: none; padding: 2px 0; } .ds-xom .ds-h2 { color: #000; }
        .ds-xom .ds-tugma { padding: 0; text-decoration: underline; font-weight: 400; }
        .ds-halqa { outline: 2.5px dashed ${T.accent}; outline-offset: -3px; border-radius: 10px; }
"""+S[j:]
assert '.ps-' not in S.split('<style>')[1] if '<style>' in S else True
open(F,'w',encoding='utf8').write(S); print('ok', S.count('\n'))
