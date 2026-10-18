# F-1015-385 (17.10, foydalanuvchi «zo'r bo'pti … tarqat hamma praktikaga»): yig'iq prompt kartasi DOIMIY promptli praktikalarga.
# O'quvchi quradigan prompt (forma/tanlov/o'z matni) — ochiq qoladi (o'zgarishni ko'rish — saboq): m1-08, m1-10, m1-11, m2-08 a2, m2-09, m2-11, m2-12 a2, m3-13, m4-14.
import sys, shutil
sys.path.insert(0, '/home/kali/Desktop/internetLesson/feedback/F-1015-amaliyot/seans-vositalar/qurish')
from praktika_ux import prompt_karta
R = '/home/kali/Desktop/internetLesson/'
ISH = {
  'src/2-Modull/PracticeLesson1.jsx': ['<PromptBlok matn={tr(A1_PROMPT)} />'],
  'src/2-Modull/PracticeLesson4.jsx': ['<PromptBlok matn={a1Prompt(kat.nom)} yigil onYigil={() => setYig(y => y + 1)} />'],
  'src/3-Modull/ReactCrudPracticeLesson.jsx': ['<PromptBlok matn={a2Prompt()} yigil onYigil={() => setYig(y => y + 1)} />'],
  'src/3-Modull/ReactRouterPracticeLesson.jsx': ['<PromptBlok matn={a2Prompt()} yigil onYigil={() => setYig(y => y + 1)} />'],
  'src/3-Modull/ReactProjectDayLesson.jsx': ['<PromptBlok matn={prompt} yigil onYigil={() => k.setYig(y => y + 1)} />'],
  'src/4-Modull/FullstackConnectPracticeLesson.jsx': ['<PromptBlok matn={a3Prompt()} />'],
  'src/4-Modull/FullstackProjectDayLesson.jsx': ['<PromptBlok matn={a2Prompt()} />', '<PromptBlok matn={a3Prompt()} />'],
}
for f, eski in ISH.items():
    p = R + f; s = open(p, encoding='utf-8').read()
    if 'F-1015-385' in s: print('=', f); continue
    shutil.copy(p, R + 'arxiv/F-1015-385-oldin/')
    s = prompt_karta(s)
    for e in eski:
        assert s.count(e) == 1, (f, e); m = e.split('matn={', 1)[1].split('}', 1)[0]
        s = s.replace(e, '<PromptKarta matn={' + m + '} /> {/* F-1015-385: yig\'iq prompt */}')
    open(p, 'w', encoding='utf-8').write(s); print('ok', f)
