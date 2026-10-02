#!/usr/bin/env python3
"""Dars faylidan ekranma-ekran DAYJEST: eyebrow/sarlavha + satr-literallardagi HTML teglar/CSS xossalar/JS kalit so'zlar
+ kompilyator topshiriqlari. Faqat o'qiydi. Xarita uchun NOMZOD beradi, hukm qo'lda.
  python3 teg-qidir.py <fayl.jsx> [html|css|js]"""
import re,sys
f=sys.argv[1]; mode=sys.argv[2] if len(sys.argv)>2 else 'html'
s=open(f,encoding='utf8',errors='ignore').read()
HT=set("html head title meta link style script body header nav main section article aside footer h1 h2 h3 h4 h5 h6 p br hr pre blockquote ol ul li dl dt dd figure figcaption div a em strong small code b i u span img video audio canvas table thead tbody tr th td form label input button select option textarea fieldset legend details summary".split())
JSK=set("let const var if else for while function return console.log document.querySelector addEventListener alert prompt innerText textContent classList push length map filter forEach fetch async await JSON.parse JSON.stringify setTimeout Math.random parseInt Number String Boolean true false null undefined === !== && || => class new this try catch".split())
# ekran chegaralari
heads=[(m.start(), m.group(0)) for m in re.finditer(r"^// =+ SCREEN[^\n]*|^const Screen\w+ = |^// — P\d[^\n]*|^const TASK_\w+ = \{|^const KOD_TASK|^const \w*TASK\w* = \{", s, re.M)]
heads.append((len(s),'END'))
strre=re.compile(r"'(?:[^'\\\n]|\\.)*'|\"(?:[^\"\\\n]|\\.)*\"|`(?:[^`\\]|\\.)*`",re.S)
def lit(chunk):
    return ' '.join(m.group(0) for m in strre.finditer(chunk))
print(f"# {f}  ({len(heads)-1} bo'lak)")
for (a,h),(b,_) in zip(heads,heads[1:]):
    ch=s[a:b]; L=lit(ch)
    eye=re.search(r"eyebrow=\{tr\(\{ uz: '([^']*)'",ch); ttl=re.search(r"title: \{ uz: ['\"]([^'\"]*)",ch)
    out=[]
    if mode=='html':
        tags=sorted({t.lower() for t in re.findall(r"<([a-zA-Z][a-zA-Z0-9]*)(?=[\s>/])",L) if t.lower() in HT})
        attrs=sorted(set(re.findall(r"\b(href|src|alt|class|id|type|placeholder|name|for|action|value|style|lang|charset|rel)=",L)))
        # Tg/At komponentlari ham
        tags+=[t for t in sorted({x for x in re.findall(r"<Tg>\{'<([a-z0-9]+)",ch)}) if t not in tags]
        attrs+=[a for a in sorted(set(re.findall(r"<At>([a-z]+)</At>",ch))) if a not in attrs]
        if tags: out.append('teg: '+' '.join(tags))
        if attrs: out.append('atr: '+' '.join(attrs))
    elif mode=='css':
        props=sorted(set(re.findall(r"\b([a-z-]{3,})\s*:\s*[^;{}\n]{1,40};",L)))
        props=[p for p in props if p in "color background background-color font-size font-family font-weight margin padding border border-radius display flex-direction justify-content align-items gap width height max-width text-align line-height list-style text-decoration box-shadow position top left cursor transition grid-template-columns".split()]
        sel=sorted(set(re.findall(r"(?:^|\s)([.#][a-zA-Z][\w-]*)\s*\{",L)))
        cp=sorted(set(re.findall(r"cssProp\('[^']*', '([^']*)'|cssValue\('[^']*', '([^']*)', '([^']*)'",ch) and [x for t in re.findall(r"cssProp\('[^']*', '([^']*)'|cssValue\('[^']*', '([^']*)', '([^']*)'",ch) for x in t if x]))
        if props: out.append('xossa: '+' '.join(props))
        if sel: out.append('selektor: '+' '.join(sel[:8]))
        if cp: out.append('shart: '+' '.join(cp))
    else:
        kw=sorted({k for k in re.findall(r"[A-Za-z_.][A-Za-z0-9_.]*|===|!==|&&|\|\||=>",L) if k in JSK})
        snip=sorted(set(re.findall(r"C\.js\((/[^/]*/)|js: (/[^/]*/)|logs: ['\"]([^'\"]*)|eval: ['\"]([^'\"]*)",ch) and [x for t in re.findall(r"C\.js\((/[^/]*/)|js: (/[^/]*/)|logs: ['\"]([^'\"]*)|eval: ['\"]([^'\"]*)",ch) for x in t if x]))
        if kw: out.append('js: '+' '.join(kw))
        if snip: out.append('shart: '+' | '.join(snip)[:200])
    if out or 'TASK' in h or 'SCREEN' in h:
        print(f"\n## {h.strip()[:60]}  {('«'+eye.group(1)+'»') if eye else ''}{(' · '+ttl.group(1)[:60]) if ttl and 'TASK' in h else ''}")
        for o in out: print('   '+o)
