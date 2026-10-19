# F-1019-07: telefonda (<=768) Qaror ekranlarida savol sahnadan KEYIN — Stage pastga surganda savol ko'rinadi
import re
R='/home/kali/Desktop/internetLesson/'
FL=['src/12-Modull/PmInvestorPitchLesson.jsx','src/12-Modull/PmStoryPitchLesson.jsx','src/12-Modull/PmPitchTrainingLesson.jsx','src/12-Modull/PmFinalPitchLesson.jsx','src/10-Modull/PmGrowthPitchLesson.jsx','src/9-Modull/PmPrototypePitchLesson.jsx']
IZ="  const tor = useIsMobile(768); // F-1019-07: telefonda savol sahnadan keyin — pastga surilganda keyingi savol ko'rinadi\n"
for f in FL:
    L=open(R+f).read().split('\n')
    n=0
    for i,l in enumerate(L):
        if 'keng harakatAvval' not in l or 'harakatAvval=' in l: continue
        # shu ekran ichida Qaror bormi (keyingi 14 qator)
        if not any('<Qaror ' in x for x in L[i:i+14]): continue
        # ekran boshini top
        j=i
        while j>0 and not re.match(r'^const \w+ = \(.*\) => \{\s*$', L[j]): j-=1
        blok='\n'.join(L[j:i])
        L[i]=l.replace('keng harakatAvval','keng harakatAvval={!tor}',1)
        if 'const tor = useIsMobile(768)' not in blok:
            L.insert(j+1, IZ.rstrip('\n'))
        n+=1
        print(f, 'ekran:', L[j][:60])
    open(R+f,'w').write('\n'.join(L))
    print(f, n)
