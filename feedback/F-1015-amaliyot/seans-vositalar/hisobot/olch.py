import re,sys,json
files = """src/1-Modull/HtmlPractice.jsx m1-08
src/1-Modull/CssPractice.jsx m1-10
src/2-Modull/PracticeLesson1.jsx m2-08
src/2-Modull/PracticeLesson2.jsx m2-09
src/2-Modull/PracticeLesson3.jsx m2-11
src/2-Modull/PracticeLesson4.jsx m2-12
src/3-Modull/ReactCrudPracticeLesson.jsx m3-07
src/3-Modull/ReactRouterPracticeLesson.jsx m3-11
src/3-Modull/ReactProjectDayLesson.jsx m3-12
src/3-Modull/ReactBuildSiteLesson.jsx m3-13
src/4-Modull/BackendCrudPracticeLesson.jsx m4-08
src/4-Modull/FullstackConnectPracticeLesson.jsx m4-10
src/4-Modull/FullstackProjectDayLesson.jsx m4-13
src/4-Modull/FullstackFeedbackLesson.jsx m4-14
src/4a-Modull/NestArchPracticeLesson.jsx m4a-04
src/4c-Modull/FullPipelineProjectLesson.jsx m4c-04
src/4c-Modull/AiPipelineProjectLesson.jsx m4c-05
src/4c-Modull/FullProPipelineLesson.jsx m4c-07""".split("\n")
pats = {
 'Bajardim':r'Bajardim','StepChecklist':r'StepChecklist','QBlok':r'\bQBlok\b','QPrompt':r'\bQPrompt\b',
 'Compiler':r'(Html|Css|Js|React|Node|Sql)?Compiler\b','textarea':r'<textarea','input':r'<input',
 'Gemini':r'[Gg]emini','Antigravity':r'Antigravity','ChatGPT':r'ChatGPT','Claude':r'\bClaude\b','Copilot':r'Copilot','Cursor':r'\bCursor\b',
 'VSCode':r'VS ?Code','LiveServer':r'Live Server','Terminal':r'[Tt]erminal','Postman':r'Postman','GitHub':r'GitHub','Vercel':r'Vercel|Netlify|Render',
 'Nusxalash':r'Nusxala','Simul':r'[Ss]imul',
}
out=[]
for line in files:
    f,k=line.split()
    s=open(f,encoding='utf8').read()
    m=re.search(r'SCREEN_META\s*=\s*\[(.*?)\n\];',s,re.S)
    metas=re.findall(r"type:\s*'(\w+)'",m.group(1)) if m else []
    from collections import Counter
    c=Counter(metas)
    row={'k':k,'f':f,'lines':s.count('\n'),'screens':len(metas),'types':dict(c)}
    for n,p in pats.items(): row[n]=len(re.findall(p,s))
    out.append(row)
json.dump(out,open(sys.argv[1],'w'),ensure_ascii=False,indent=1)
for r in out:
    print(r['k'],r['screens'],r['types'],{n:r[n] for n in pats if r[n]})
