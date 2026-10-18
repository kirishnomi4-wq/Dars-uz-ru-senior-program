# F-1015-370 (17.10, foydalanuvchi «Avval tayyorlaning — barcha praktikalarda shuni qo'lla»): 362 oyna-tugma qolgan 17 praktikaga.
# 14 fayl — TayyorTugma bor (tayyor_oyna + css); 1-Modul 3 pilot (Css/Html/Deploy) — doim ochiq blok → tugma (tayyor_blokdan + css_blokdan).
import sys
sys.path.insert(0, '/home/kali/Desktop/internetLesson/feedback/F-1015-amaliyot/seans-vositalar/qurish')
from praktika_ux import tayyor_oyna, css, tayyor_blokdan, css_blokdan
ROOT = '/home/kali/Desktop/internetLesson/'
BLOK = ['src/1-Modull/CssPractice.jsx', 'src/1-Modull/HtmlPractice.jsx', 'src/1-Modull/DeployLesson.jsx']
TUGMA = ['src/2-Modull/PracticeLesson1.jsx', 'src/2-Modull/PracticeLesson2.jsx', 'src/2-Modull/PracticeLesson3.jsx', 'src/3-Modull/ReactBuildSiteLesson.jsx', 'src/3-Modull/ReactRouterPracticeLesson.jsx',
         'src/3-Modull/ReactProjectDayLesson.jsx', 'src/4-Modull/BackendCrudPracticeLesson.jsx', 'src/4-Modull/FullstackConnectPracticeLesson.jsx', 'src/4-Modull/FullstackProjectDayLesson.jsx',
         'src/4-Modull/FullstackFeedbackLesson.jsx', 'src/4a-Modull/NestArchPracticeLesson.jsx', 'src/4c-Modull/FullPipelineProjectLesson.jsx', 'src/4c-Modull/AiPipelineProjectLesson.jsx', 'src/4c-Modull/FullProPipelineLesson.jsx']
for f in BLOK + TUGMA:
    s = open(ROOT + f, encoding='utf-8').read()
    t = css_blokdan(tayyor_blokdan(s)) if f in BLOK else css(tayyor_oyna(s))
    open(ROOT + f, 'w', encoding='utf-8').write(t); print('ok' if t != s else '=', f)
