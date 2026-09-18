# Har o'zgargan dars uchun til/dark lint natijasini HEAD bilan solishtiradi (qator raqamlari e'tiborga olinmaydi).
# Ishlatish: S=<skretch-papka> python3 feedback/F-0918-04/lintcmp.py [fayl.jsx …]   (fayl berilmasa — git diff dagi hammasi)
import subprocess, re, os, sys
S=os.environ['S']; root=os.getcwd()
files=[a for a in sys.argv[1:] if a.endswith('.jsx')] or [f for f in subprocess.check_output(['git','diff','--name-only',os.environ.get('BASE','HEAD'),'--','src'],text=True).split() if f.endswith('.jsx') and os.path.exists(f)]  # fayl berilsa — faqat o'shalar
ansi=re.compile(r'\x1b\[[0-9;]*m')
def norm(out):
    out=ansi.sub('',out)
    out=re.sub(r'qator [0-9, ]+','qator N',out)       # til-lint qator ro'yxati
    out=re.sub(r':\d+(:\d+)?','',out)                   # fayl:qator
    out=re.sub(r'\bq(ator)?\.?\s*\d+','q N',out)
    out=re.sub(r'\S*?src/','src/',out)
    return sorted(l.strip() for l in out.splitlines() if l.strip() and not l.startswith('>'))
def run(tool,path):
    r=subprocess.run(['node',tool,path],capture_output=True,text=True,cwd=root)
    return norm(r.stdout+r.stderr), r.returncode
bad=0
for f in files:
    hp=os.path.join(S,'head',f); os.makedirs(os.path.dirname(hp),exist_ok=True)
    open(hp,'w',encoding='utf-8').write(subprocess.check_output(['git','show',os.environ.get('BASE','HEAD')+':'+f],text=True))  # BASE=<commit> — boshqa asos bilan
    for tool in ('til-lint.mjs','dark-lint.mjs'):
        a,ra=run(tool,hp); b,rb=run(tool,f)
        if a!=b or ra!=rb:
            bad+=1; print('FARQ',tool,f); 
            for l in sorted(set(b)-set(a))[:4]: print('   + ',l[:200])
            for l in sorted(set(a)-set(b))[:4]: print('   - ',l[:200])
print(f'{len(files)} dars tekshirildi · til/dark farqi: {bad}')
