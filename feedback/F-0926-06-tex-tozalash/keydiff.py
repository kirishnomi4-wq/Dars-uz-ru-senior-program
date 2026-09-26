import re,sys,difflib
def toks(s):
    t=[]
    m=re.search(r'INLINE_KEYS\s*=\s*\{[^}]*\}',s); t.append(('INLINE_KEYS',m.group(0) if m else ''))
    t+= [('cIdx',x) for x in re.findall(r'correctIdx\s*[:=]\s*[^,}\n]+',s)]
    t+= [('correct',x) for x in re.findall(r'\bcorrect\s*:\s*(?:true|false|\d+|\[[^\]]*\]|\'[^\']*\'|"[^"]*")',s)]
    t+= [('lessonId',x) for x in re.findall(r'lessonId\s*:\s*[\'"][^\'"]+',s)]
    t+= [('answerKey',x) for x in re.findall(r'answerKey[^\n]{0,80}',s)]
    m=re.search(r'const\s+SCREEN_META\s*=\s*\[[\s\S]*?\n\];',s); t.append(('SCREEN_META',m.group(0) if m else ''))
    return t
a=toks(open(sys.argv[1]).read()); b=toks(open(sys.argv[2]).read())
for (ka,va),(kb,vb) in zip(a,b):
    if va!=vb:
        print('  ',ka,'|', ' / '.join(l for l in difflib.unified_diff(va.split('\n'),vb.split('\n'),lineterm='',n=0) if l[:1] in '+-' and l[:3] not in ('+++','---'))[:300])
