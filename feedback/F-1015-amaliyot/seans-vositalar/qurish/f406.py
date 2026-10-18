# F-1015-406: LMS 6-Modul = 4a+4b+4c (foydalanuvchi, 18.10). Modul oxiri faqat m4c-07. Shuning uchun:
# m4c-04 va m4a-04 oxirgi tugma «Modulni yakunlash ✓» → «Yakunlash ✓» (m4c-07 namunasi); m4c-05 «🎉 4c-modulni yakunladingiz…» → dars-matni.
# Zaxira: arxiv/F-1015-406-oldin/ (3 fayl). Qayta yurgizilmaydi.
import pathlib
R = pathlib.Path('/home/kali/Desktop/internetLesson/src')
def rep(path, old, new):
    p = R / path; s = p.read_text()
    assert s.count(old) == 1, (path, s.count(old), old[:60]); p.write_text(s.replace(old, new)); print('OK', path)
BTN_OLD = "{tr({ uz: 'Modulni yakunlash ✓', ru: 'Завершить модуль ✓' })}"
BTN_NEW = "{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}"
rep('4c-Modull/FullPipelineProjectLesson.jsx', BTN_OLD, BTN_NEW)
rep('4a-Modull/NestArchPracticeLesson.jsx', BTN_OLD, BTN_NEW)
rep('4c-Modull/AiPipelineProjectLesson.jsx',
    """uz: "🎉 4c-modulni yakunladingiz — CI/CD, deploy va endi Copilot bilan ishlash. Loyihalaringizda shu ko'nikmalarni birga qo'llang!", ru: '🎉 Модуль 4c завершён — CI/CD, деплой и теперь работа с AI-Copilot. Применяйте эти навыки в своих проектах вместе!'""",
    """uz: "🎉 Copilot bilan lentani boshqardingiz — tezlik undan, qaror sizdan. Keyingi darsda lentani ishonchli qilasiz.", ru: '🎉 Вы управляли лентой вместе с Copilot — скорость от него, решение за Вами. На следующем уроке сделаете ленту надёжной.'""")
