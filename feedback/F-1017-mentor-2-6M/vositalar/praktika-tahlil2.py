import re, sys
ORDER = ['src/1-Modull/InternetLesson.jsx','src/1-Modull/Htmllesson1.jsx','src/1-Modull/Htmllesson2.jsx','src/1-Modull/HtmlTakrorlashLesson.jsx','src/1-Modull/CssLesson1.jsx','src/1-Modull/CssLesson2.jsx','src/1-Modull/VsCodeLesson.jsx','src/1-Modull/HtmlPractice.jsx','src/1-Modull/CssPractice.jsx','src/1-Modull/GitLesson.jsx','src/1-Modull/DeployLesson.jsx','src/2-Modull/JsIntroLesson.jsx','src/2-Modull/JsVarsLesson.jsx','src/2-Modull/JsConditionsLesson.jsx','src/2-Modull/JsLoopsLesson.jsx','src/2-Modull/JsFunctionsLesson.jsx','src/2-Modull/PracticeLesson1.jsx','src/2-Modull/PracticeLesson2.jsx','src/2-Modull/PeanStackLesson.jsx']
def screens(f):
    L = open(f, encoding='utf-8').read().split('\n')
    arr = next(l for l in L if re.search(r'const screens = \[', l))
    names = re.findall(r'\b([A-Z]\w*)\b', arr.split('[',1)[1].split(']')[0])
    starts = {}
    for i,l in enumerate(L):
        m = re.match(r'^(?:const|function)\s+([A-Z]\w*)\b', l)
        if m: starts.setdefault(m.group(1), i)
    tops = sorted(i for i,l in enumerate(L) if re.match(r'^(const|function|let|export|//\s*=====)', l))
    out = []
    for n in names:
        s = starts.get(n)
        if s is None: out.append((n, '')); continue
        e = next((t for t in tops if t > s), len(L))
        out.append((n, '\n'.join(L[s:e])))
    return out, '\n'.join(L)
def strip_ru0(t): return re.sub(r"ru:\s*(\"(?:[^\"\\]|\\.)*\"|'(?:[^'\\]|\\.)*'|`[^`]*`|<>.*?</>)", '', t, flags=re.S)
def strip_ru(t):
    t = re.sub(r"ru:\s*(\"(?:[^\"\\]|\\.)*\"|'(?:[^'\\]|\\.)*'|`[^`]*`|<>.*?</>)", '', t, flags=re.S)
    t = re.sub(r"style=\{\{.*?\}\}", '', t, flags=re.S)
    t = re.sub(r"className=(\"[^\"]*\"|\{`[^`]*`\}|'[^']*')", '', t)
    lits = re.findall(r'"((?:[^"\\\n]|\\.)*)"|\'((?:[^\'\\\n]|\\.)*)\'|`([^`]*)`', t)
    jsx = re.findall(r'>([^<>{}]+)<', t)
    return '\n'.join(a or b or c for a,b,c in lits) + '\n' + '\n'.join(jsx)
T = {  # fayl: [(ekran, vazifa, [(belgi, regex)])]
'src/1-Modull/Htmllesson1.jsx': [(9,'TASK_HEADINGS',[('h1',r'<h1|\bh1\b'),('h2',r'<h2|\bh2\b'),('h6',r'<h6|\bh6\b')]),(13,'TASK_LINK',[('a',r'<a[\s>]'),('href',r'href')]),(14,'TASK_FINAL',[('p',r'<p[\s>]'),('ul/ol',r'<[uo]l'),('li',r'<li'),('href',r'href')])],
'src/1-Modull/Htmllesson2.jsx': [(3,'TASK_IMG',[('img',r'<img|\bimg\b'),('src',r'\bsrc\b'),('alt',r'\balt\b')]),(9,'TASK_FORM',[('form',r'<form|\bform\b'),('input',r'<input|\binput\b'),('button',r'<button|\bbutton\b')]),(15,'TASK_FINAL',[('header',r'<header|\bheader\b')])],
'src/1-Modull/HtmlTakrorlashLesson.jsx': [(3,'TASK_S1',[('h1',r'<h1'),('p',r'<p[\s>]')]),(5,'TASK_S2',[('ul',r'<ul'),('li',r'<li'),('strong',r'<strong|\bstrong\b')]),(7,'TASK_S3',[('href',r'href')]),(9,'TASK_S4',[('img',r'<img'),('src',r'\bsrc\b'),('alt',r'\balt\b')])],
'src/1-Modull/CssLesson1.jsx': [(8,'TASK_COLOR',[('color',r'\bcolor\s*:'),('background-color',r'background-color'),('style.css',r'style\.css'),('h1 {',r'h1\s*\{')]),(10,'TASK_TEXT',[('font-size',r'font-size'),('text-align',r'text-align')]),(13,'TASK_BOX',[('padding',r'\bpadding'),('margin',r'\bmargin'),('.class selektor',r'\.box\b|class=|\.[a-z]+\s*\{'),('div',r'<div')])],
'src/1-Modull/CssLesson2.jsx': [(8,'TASK_FLEX',[('display:flex',r'display\s*:\s*flex'),('gap',r'\bgap\b'),('span',r'<span')]),(10,'TASK_CENTER',[('justify-content',r'justify-content'),('align-items',r'align-items')]),(13,'TASK_COLUMN',[('flex-direction',r'flex-direction'),('column',r'column')])],
'src/1-Modull/VsCodeLesson.jsx': [(9,'TASK_CARD',[('div class',r'<div class|class='),('nested',r'ichida|ichiga')]),(10,'TASK_STYLE',[('background',r'background'),('border-radius',r'border-radius'),('width',r'\bwidth\b'),('margin auto',r'margin[^;\n]{0,15}auto'),('box-shadow',r'box-shadow'),('rgba',r'rgba')])],
'src/2-Modull/JsVarsLesson.jsx': [(6,'TASK_BALL',[('let',r'\blet\b'),('console.log',r'console\.log'),('qayta yozish score = 25',r'\w+\s*=\s*\d+(?!\s*;?\s*//)')]),(13,'TASK_QUOTES',[('"5" + "5"',r'"5"\s*\+\s*"5"|55')]),(16,'TASK_QUTILAR',[('const',r'\bconst\b'),('birth_year/_ nom',r'birth_year|_')])],
'src/2-Modull/JsConditionsLesson.jsx': [(6,'TASK_RADAR',[('if',r'\bif\b'),('else',r'\belse\b'),('>',r'[^=<>]>\s*\d|katta')]),(12,'TASK_TRANSLATE',[('==',r'==')]),(15,'TASK_RADAR_LEVELS',[('else if',r'else\s+if'),('<=',r'<=')])],
'src/2-Modull/JsLoopsLesson.jsx': [(6,'TASK_SANOQ',[('for',r'\bfor\b'),('i++',r'i\+\+'),('<=',r'<=')]),(15,'TASK_MEVA',[('massiv []',r'\[\s*["\']'),('mevalar[i]',r'\w+\[i\]'),('.length',r'\.length')])],
'src/2-Modull/JsFunctionsLesson.jsx': [(6,'TASK_SALOM',[('function',r'\bfunction\b'),('chaqirish salom()',r'\w+\(\)')]),(13,'TASK_KVADRAT',[('parametr',r'parametr'),('return',r'\breturn\b'),('*',r'\*\s*\d|ko\'paytir'),('console.log(f(x))',r'console\.log\(\w+\(')]),(16,'TASK_QAYTA',[('"Salom, " + ism',r'"\s*\+\s*\w+|\+\s*ism')])],
'src/2-Modull/PeanStackLesson.jsx': [(13,'TASK_HISOB',[('function',r'\bfunction\b'),('return',r'\breturn\b')]),(16,'TASK_BAZA',[('massiv',r'\[\s*["\']'),('for',r'\bfor\b')])],
}
for f, tasks in T.items():
    sc, full = screens(f)
    idx = ORDER.index(f)
    prior = ''.join(strip_ru(open(p,encoding='utf-8').read()) for p in ORDER[:idx] if __import__('os').path.exists(p))
    print('\n##', f.split('/')[-1], f'({len(sc)} ekran)')
    for n, name, kws in tasks:
        before = strip_ru('\n'.join(t for _,t in sc[:n+1])); after = strip_ru('\n'.join(t for _,t in sc[n+1:]))
        res = []
        for lab, rx in kws:
            fb = next((i for i,(_,t) in enumerate(sc[:n+1]) if re.search(rx, strip_ru(t))), None)
            la = next((i for i,(_,t) in enumerate(sc[n+1:], n+1) if re.search(rx, strip_ru(t))), None)
            pr = bool(re.search(rx, prior))
            st = 'OK' if fb is not None else ('oldingi darsda' if pr else ('KEYIN ekran %s' % la if la is not None else 'YO\'Q'))
            res.append(f"{lab}: {st}" + (f" (s{fb})" if fb is not None else ''))
        print(f"  ekran {n} ({sc[n][0]}) → {name}: " + ' | '.join(res))
