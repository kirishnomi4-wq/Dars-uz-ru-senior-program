import sys
A_OLD = "@media (min-width: 1200px) { .zoomable:not(.zoom-on) > .zoom-btn { top: 0; right: -42px; } .zoomable.z-float:not(.zoom-on) > .zoom-btn { visibility: visible; } }"
A_NEW = "@media (min-width: 1200px) { .zoomable:not(.zoom-on) > .zoom-btn { top: 8px; right: 8px; } .zoomable.z-float:not(.zoom-on) > .zoom-btn { visibility: visible; } }"
P_IN = ".zoomable:not(.z-float):not(.zoom-on) > .split > :last-child > :is(p, h2, h3, h4, .eyebrow, .flow-label, .note-h):first-child, .zoomable:not(.z-float):not(.zoom-on) > .zoom-btn + :is(p, h2, h3, h4, .eyebrow, .flow-label, .note-h) { padding-right: 40px; }"
P_OLD = "@media (max-width: 1199px) { " + P_IN + " }"
C_OLD = "/* F-1004-12: ⛶ matn ustiga tushmasin. Keng ekranda tugma kontentdan tashqarida, o'ng chetda turadi;\n           torroq ekranda ichkarida qoladi va o'ng ustunning birinchi yorlig'iga o'ngdan 40 px joy beriladi. */"
C_NEW = "/* F-1004-12 · F-1015-111: ⛶ matn ustiga tushmasin va kartadan chiqmasin. Har qanday kenglikda ichkarida, o'ng-yuqori burchakda\n           (keng ekranda chetdan 8 px); o'ng ustunning birinchi yorlig'iga o'ngdan 40 px joy beriladi. */"
dry = '--dry' in sys.argv
stat = {'A':0,'P':0,'C':0}
for p in open(sys.argv[1]).read().split():
    t = open(p, encoding='utf8').read(); o = t
    for k, a, b in (('A', A_OLD, A_NEW), ('P', P_OLD, P_IN), ('C', C_OLD, C_NEW)):
        n = t.count(a)
        if n > 1: print('KO\'P', k, p); sys.exit(1)
        if n: t = t.replace(a, b); stat[k] += 1
    if t != o and not dry: open(p, 'w', encoding='utf8').write(t)
print(stat)
