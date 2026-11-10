# Ekran ma'lumotnomasi: python3 ekran.py <dars> <ekran-1dan>  → sarlavha, segmentlar (kalit + ovoz), sahna kodi
import sys,re,glob,json
D={'pg-01':'pg1','pg-02':'pg2','jest-01':'jest1','jest-02':'jest2','cicd-01':'cicd1','cicd-02':'cicd2','tgpg-01':'tgpg','ws1-01':'ws1','ws2-01':'ws2','wh-01':'wh','nest-02':'nest2'}
dars,n=sys.argv[1],int(sys.argv[2]); d=D[dars]; R='/home/kali/Desktop/internetLesson/src/mentor-kurs/'
src=open(R+f'{d}/parts/03-matn.gen.jsx').read()
M=json.loads(src[src.index('const MDT = ')+12:src.rindex(';')])
title=open(f'/home/kali/Desktop/internetLesson/feedback/F-1029-02-mentor-kurs/vizual-taklif-F-1109-06/natija.tsv').read()
t=[l.split('\t')[6] for l in title.split('\n') if l.startswith(dars+'\t'+str(n)+'\t')][0][:40]
key=[k for k,v in M.items() if isinstance(v,dict) and str(v.get('title','')).startswith(t[:30])]
for k in key:
    v=M[k]; print('MDT',k,'·',v.get('eyebrow',''),'\nTITLE',v.get('title'))
    for s in v.get('seg',[]): print(' -',s[0],'| KALIT:',re.sub('<[^>]+>','',s[1])[:160],'\n    OVOZ:',s[2][:600])
txt=''.join(open(f).read() for f in sorted(glob.glob(R+f'{d}/parts/0[5-8]*.jsx')))
b=re.split(r'\n(?=//\s+\d+\s*·)',txt)
for x in b:
    m=re.match(r'//\s+(\d+)\s*·',x)
    if m and int(m.group(1))==n: print('\nSAHNA:\n'+x[:3500])
