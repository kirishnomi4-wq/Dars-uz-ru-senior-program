import sys
A_NEW = "@media (min-width: 1200px) { .zoomable:not(.zoom-on) > .zoom-btn { top: 8px; right: 8px; } .zoomable.z-float:not(.zoom-on) > .zoom-btn { visibility: visible; } }"
B = ".zoomable:not(.z-empty):not(.zoom-on) { padding-top: 36px; } .zoomable:not(.zoom-on) > .zoom-btn { top: 0; right: 0; }"
P_LINE = "        .zoomable:not(.z-float):not(.zoom-on) > .split > :last-child > :is(p, h2, h3, h4, .eyebrow, .flow-label, .note-h):first-child, .zoomable:not(.z-float):not(.zoom-on) > .zoom-btn + :is(p, h2, h3, h4, .eyebrow, .flow-label, .note-h) { padding-right: 40px; }\n"
C_OLD = "/* F-1004-12 · F-1015-111: ⛶ matn ustiga tushmasin va kartadan chiqmasin. Har qanday kenglikda ichkarida, o'ng-yuqori burchakda\n           (keng ekranda chetdan 8 px); o'ng ustunning birinchi yorlig'iga o'ngdan 40 px joy beriladi. */"
C_NEW = "/* F-1004-12 · F-1015-111 (B): ⛶ hech narsani yopmaydi va kartadan chiqmaydi — vizual tepasida o'ziga ajratilgan\n           36 px qatorda, o'ng chetda; har kenglikda bir xil (7-Modul U2 naqshi). */"
dry = '--dry' in sys.argv; stat = {'B':0,'P':0,'C':0}
for p in open(sys.argv[1]).read().split():
    t = open(p, encoding='utf8').read(); o = t
    for k, a, b in (('B', A_NEW, B), ('P', P_LINE, ''), ('C', C_OLD, C_NEW)):
        n = t.count(a)
        if n > 1: print('KO\'P', k, p); sys.exit(1)
        if n: t = t.replace(a, b); stat[k] += 1
        elif k != 'C': print('YO\'Q', k, p)
    if t != o and not dry: open(p, 'w', encoding='utf8').write(t)
print(stat)
