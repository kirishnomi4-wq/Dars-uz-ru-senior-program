# Qaror ma'lumotida to'g'ri variant eng uzun emasligini tekshiradi (uz va ru)
import re,sys
for f,names in [('src/8-Modull/PmPitchRehearsalLesson.jsx',['S2_QAROR','S6_QAROR']),('src/9-Modull/PmPrototypePitchLesson.jsx',['S2_QAROR','S4_QAROR','S8_QAROR']),('src/10-Modull/PmGrowthPitchLesson.jsx',['S2_QAROR','S4_QAROR'])]:
    s=open(f).read()
    for nm in names:
        m=re.search(r'const '+nm+r' = \[(.*?)\n\];',s,re.S); blk=m.group(1)
        for qi,qb in enumerate(re.split(r'\n  \{ savol:',blk)[1:]):
            opts=re.findall(r"\{ (ok: true, )?t: \{ uz: (\"[^\"]*\"|'[^']*'), ru: (\"[^\"]*\"|'[^']*') \}",qb)
            for li,lang in [(1,'uz'),(2,'ru')]:
                L=[(len(o[li])-2, bool(o[0])) for o in opts]
                ok=[l for l,k in L if k][0]; other=max(l for l,k in L if not k)
                if ok>other: print('UZUN', f.split('/')[-1], nm, qi+1, lang, L)
            pos=[i for i,o in enumerate(opts) if o[0]]
            print(f.split('/')[-1][:14], nm, qi+1, 'togri o\'rni', pos, 'variant', len(opts))
