import re, sys, os
exec(open(sys.argv[1],encoding='utf-8').read().split('T = {')[0])
SEQ=['src/2-Modull/JsIntroLesson.jsx','src/2-Modull/JsVarsLesson.jsx','src/2-Modull/JsConditionsLesson.jsx','src/2-Modull/JsLoopsLesson.jsx','src/2-Modull/JsFunctionsLesson.jsx','#PmLesson5','src/2-Modull/PracticeLesson1.jsx','src/2-Modull/PracticeLesson2.jsx','src/2-Modull/PeanStackLesson.jsx','src/2-Modull/PracticeLesson3.jsx','src/2-Modull/PracticeLesson4.jsx','#PmLesson6',
 'src/3-Modull/ReactIntroLesson.jsx','src/3-Modull/ReactFirstComponentLesson.jsx','src/3-Modull/ReactStateEffectLesson.jsx','src/3-Modull/ReactPropsReuseLesson.jsx','src/3-Modull/ReactCrudPracticeLesson.jsx','src/3-Modull/ReactApiGetLesson.jsx','src/3-Modull/ReactApiPostLesson.jsx','#PmLesson9','src/3-Modull/ReactRouterPracticeLesson.jsx','src/3-Modull/ReactProjectDayLesson.jsx','src/3-Modull/ReactBuildSiteLesson.jsx',
 'src/4-Modull/DataIntroLesson.jsx','#PmLesson11','src/4-Modull/DbSqlNosqlLesson.jsx','src/4-Modull/NodeServerLesson.jsx','src/4-Modull/RoutingLesson.jsx','src/4-Modull/PostgresCrudLesson.jsx','src/4-Modull/BackendCrudPracticeLesson.jsx','src/4-Modull/ApiPostmanLesson.jsx','src/4-Modull/FullstackConnectPracticeLesson.jsx','src/4-Modull/AuthEnvLesson.jsx','#PmLesson13','src/4-Modull/FullstackProjectDayLesson.jsx','src/4-Modull/FullstackFeedbackLesson.jsx','src/4a-Modull/NestArchAliveLesson.jsx','#PmLesson15','src/4a-Modull/NestArchResourceLesson.jsx','src/4a-Modull/NestArchPracticeLesson.jsx','src/4b-Modull/JestUnitTestLesson.jsx','src/4b-Modull/EdgeCasesTestLesson.jsx','src/4c-Modull/CiCdIntroLesson.jsx','#PmLesson17']
K={'===':r'===','&&':r'&&','obyekt {k: v}':r'\{\s*\w+\s*:\s*["\'\d\w]','obj.maydon':r'\b[a-z]\w*\.(?!log|length|js|jsx|css|html|uz|com|map|filter|push|json|env|get|post|put|delete|then|send|listen|use|query|status|body|params)[a-z]\w*\b','obj[kalit]':r'\w+\[\s*\w+\s*\](?!\s*=)','.push(':r'\.push\(','.filter(':r'\.filter\(','.map(':r'\.map\(','Object.keys/for-in':r'Object\.(keys|entries|values)|for\s*\(\s*(let|const|var)\s+\w+\s+in\b','[[ ichma-ich massiv':r'\[\s*\['}
seen={}
for f in SEQ:
    if f.startswith('#'):
        print(f"\n▶ {f[1:]} gacha birinchi ko'rinish: " + ' · '.join(f"{k}={seen.get(k,'YO‘Q')}" for k in K)); continue
    if not os.path.exists(f): continue
    sc,_=screens(f)
    for i,(n,t) in enumerate(sc):
        v=strip_ru(t)
        for k,rx in K.items():
            if k not in seen and re.search(rx,v):
                m=re.search(rx,v); seen[k]=f"{f.split('/')[-1].replace('Lesson.jsx','')}:s{i}"
