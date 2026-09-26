import re,sys,hashlib
s=open(sys.argv[1]).read()
toks=[]
m=re.search(r'INLINE_KEYS\s*=\s*\{[^}]*\}',s); toks.append(m.group(0) if m else '')
toks+=re.findall(r'correctIdx\s*[:=]\s*[^,}\n]+',s)
toks+=re.findall(r'\bcorrect\s*:\s*(?:true|false|\d+|\[[^\]]*\]|\'[^\']*\'|"[^"]*")',s)
toks+=re.findall(r'lessonId\s*:\s*[\'"][^\'"]+',s)
toks+=re.findall(r'answerKey[^\n]{0,80}',s)
m=re.search(r'const\s+SCREEN_META\s*=\s*\[[\s\S]*?\n\];',s); toks.append(m.group(0) if m else '')
print(hashlib.md5('\n'.join(toks).encode()).hexdigest()[:10], len(toks))
