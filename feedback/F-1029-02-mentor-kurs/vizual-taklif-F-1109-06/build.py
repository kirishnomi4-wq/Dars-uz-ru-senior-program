# Artifact yig'uvchi (F-1109-06): qaror/*.json → artifact2/index.html + img/
import json,glob,os,sys
from PIL import Image
from collections import Counter
S=os.path.dirname(os.path.abspath(__file__)); A=f'{S}/artifact2'; os.makedirs(f'{A}/img',exist_ok=True)
TART=['PG-1','PG-2','Jest-1','Jest-2','CI/CD-1','CI/CD-2','Telegraf + PG','WS-1','WS-2','Webhook','Nest-1','Nest-2']
SLUG={'PG-1':'pg-01','PG-2':'pg-02','Jest-1':'jest-01','Jest-2':'jest-02','CI/CD-1':'cicd-01','CI/CD-2':'cicd-02','WS-1':'ws1-01','WS-2':'ws2-01','Webhook':'wh-01','Nest-1':'nest-01','Nest-2':'nest-02'}
def fill(p):
    im=Image.open(p).convert('RGB'); k=im.width/1280
    x,y,w,h=[int(v*k) for v in (447,62,811,580)]
    c=im.crop((x,y,x+w,y+h)); bg=Counter(c.resize((w//8,h//8)).getdata()).most_common(1)[0][0]
    C=int(16*k); occ=tot=0
    for cy in range(0,h-C+1,C):
        for cx in range(0,w-C+1,C):
            tot+=1; cell=list(c.crop((cx,cy,cx+C,cy+C)).getdata())
            if any(abs(a[0]-bg[0])+abs(a[1]-bg[1])+abs(a[2]-bg[2])>24 for a in cell[::9]): occ+=1
    return round(100*occ/tot)
def jpg(src,dst):
    if os.path.exists(dst) and os.path.getmtime(dst)>=os.path.getmtime(src): return
    Image.open(src).convert('RGB').resize((1440,810),Image.LANCZOS).save(dst,quality=82,optimize=True)
items=[json.load(open(f)) for f in glob.glob(f'{S}/qaror/*.json')]
items.sort(key=lambda r:(TART.index(r['dars']),r['ekran']))
for r in items:
    old=f"{S}/keyin/{r['id']}-oldin.png"
    if not os.path.exists(old): old=f"{S}/surat/{SLUG[r['dars']]}-{r['ekran']:02d}.png"
    jpg(old,f"{A}/img/{r['id']}-oldin.jpg"); r['img_o']=f"img/{r['id']}-oldin.jpg"
    if r['tur']=='taklif':
        new=f"{S}/keyin/{r['id']}-keyin.png"; jpg(new,f"{A}/img/{r['id']}-keyin.jpg"); r['img_k']=f"img/{r['id']}-keyin.jpg"
        r['fill']=[fill(old),fill(new)]
tayyor=[l.strip() for l in open(f'{S}/tayyor.txt') if l.strip()]
stat=json.load(open(f'{S}/stat.json'))
html=open(f'{S}/sablon.html').read().replace('__ITEMS__',json.dumps(items,ensure_ascii=False)).replace('__STAT__',json.dumps(stat,ensure_ascii=False)).replace('__TAYYOR__',json.dumps(tayyor,ensure_ascii=False)).replace('__TART__',json.dumps(TART,ensure_ascii=False))
open(f'{A}/index.html','w').write(html)
print('yozuv',len(items),'taklif',sum(r['tur']=='taklif' for r in items),'tayyor darslar',tayyor)
