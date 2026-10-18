# F-1015-358 (17.10, foydalanuvchi qarori 12-A): yopilgan m1-10 (CssPractice) va m2-11 (PracticeLesson3) da ham drag-drop chip brend gradientga.
# Joyida qo'llanadi (bu darslar to'liq qayta qurilmaydi — keyingi qo'lda tuzatishlar saqlansin); takror yurgizilsa ham xavfsiz.
ROOT = '/home/kali/Desktop/internetLesson'
Q = ROOT + '/feedback/F-1015-amaliyot/seans-vositalar/qurish/'
exec(open(Q + 'dd_gradient.py', encoding='utf-8').read())
for f in ['/src/1-Modull/CssPractice.jsx', '/src/2-Modull/PracticeLesson3.jsx']:
    p = ROOT + f
    s = open(p, encoding='utf-8').read()
    t = dd_gradient(s)
    open(p, 'w', encoding='utf-8').write(t)
    print(f, 'ozgardi' if t != s else 'avvaldan gradient')
