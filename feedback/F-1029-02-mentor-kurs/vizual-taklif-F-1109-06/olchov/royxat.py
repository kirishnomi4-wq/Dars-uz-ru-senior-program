# Qarorlar ro'yxati: python3 royxat.py add '<json>'  |  python3 royxat.py show
import sys,json,os
P=os.path.join(os.path.dirname(__file__),'royxat.json')
R=json.load(open(P)) if os.path.exists(P) else []
if sys.argv[1]=='add':
    e=json.loads(sys.argv[2]); R=[r for r in R if r['id']!=e['id']]+[e]; json.dump(R,open(P,'w'),ensure_ascii=False,indent=1); print('ok',len(R))
else:
    for r in R: print(r['id'],r['tur'],r.get('mavzu',''))
