# 13-Modul pilot MD larini mustaqil tekshirish (o'z skriptim, 07.10)
import re,sys,collections
p=sys.argv[1]; s=open(p,encoding='utf-8').read(); L=s.split('\n')
print('###',p, len(L),'qator')
# 1) ekranlar
scr=[l for l in L if re.match(r'^## \d+ · ',l)]
print('ekranlar:',len(scr)); [print('  ',x[:110]) for x in scr]
# 2) sarlavhalar uzunligi
for i,l in enumerate(L):
    m=re.search(r'Sarlavha:\s*\*\*(.+?)\*\*',l)
    if m:
        t=m.group(1); n=len(t)
        if n>55: print(f'  !! sarlavha >55 ({n}) q{i+1}: {t}')
# 3) xulosa
for i,l in enumerate(L):
    m=re.match(r'^- Xulosa[^:]*:\s*(.+?)(\s*\((\d+)\))?\s*$',l)
    if m:
        t=re.sub(r'\s*\(\d+\)\s*$','',m.group(1)); 
        if len(t)>110: print(f'  !! xulosa >110 ({len(t)}) q{i+1}')
# 4) arena ✔ taqsimoti
ar=s[s.find('Jonli viktorina'):] if 'Jonli viktorina' in s else ''
ticks=re.findall(r'✔\s*([ABCD])\b',ar)
print('arena ✔:',collections.Counter(ticks))
# 5) taqiq va xavfli naqshlar (o'quvchi matni + umumiy)
pat={
 'karta raqami':r'\b\d{4}[ -]\d{4}[ -]\d{4}[ -]\d{4}\b|CVV|SMS kod',
 'qonun nomi to\'liq':r'\bFuqarolik',
 'ayb da\'vosi':r'xatongiz emas|sizda emas',
 'kafolat':r'\bhar doim\b|\bhech qachon\b|\bdarhol\b|\bdarrov\b|100%|\bkafolat|\balbatta\b',
 'kelajak':r'tez orada|yaqinda|keyingi darsda',
 'inglizcha atama prozada':r'\b(CAC|LTV|paywall|freemium|sandbox|idempoten\w*|referal)\b',
 'kod raqam':r'\bm11-\d\d|Modul 13\b|src/11',
 'Fon so\'z emoji':r'[\U0001F300-\U0001FAFF]',
 'real pul':r'haqiqiy to.lov qabul|kartangizni ulang',
 'test holati':r'test holati',
 'obuna yolg\'iz':r'(?<!pullik )\bobuna\b',
 'sir/sehr':r'\bsir\b|\bsehr',
}
for k,v in pat.items():
    hits=[(i+1,l.strip()[:140]) for i,l in enumerate(L) if re.search(v,l)]
    if hits:
        print(f'  [{k}] {len(hits)}'); [print('     ',h) for h in hits[:6]]
