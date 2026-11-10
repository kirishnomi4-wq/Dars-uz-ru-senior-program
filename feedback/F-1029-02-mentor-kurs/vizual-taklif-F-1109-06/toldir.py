# Sahna kataklarining necha foizi fon emas (16px katak, fon = sahna burchaklari rangi). Ishlatish: python3 toldir.py <tsv> <surat-papka>
import sys
from PIL import Image
tsv, d = sys.argv[1], sys.argv[2]
for line in open(tsv):
    f = line.rstrip('\n').split('\t')
    if len(f) < 6 or f[2] == '-': continue
    dars, n, rect = f[0], int(f[1]), list(map(int, f[2].split(',')))
    im = Image.open(f'{d}/{dars}-{n:02d}.png').convert('RGB')
    x, y, w, h = 447, 62, 811, 580
    crop = im.crop((x, y, x + w, y + h))
    from collections import Counter
    bg = Counter(crop.resize((w // 8, h // 8)).getdata()).most_common(1)[0][0]
    C = 16; occ = tot = 0; rows = []
    for cy in range(0, h - C + 1, C):
        ro = 0
        for cx in range(0, w - C + 1, C):
            tot += 1
            cell = list(crop.crop((cx, cy, cx + C, cy + C)).getdata())
            if any(abs(p[0] - bg[0]) + abs(p[1] - bg[1]) + abs(p[2] - bg[2]) > 24 for p in cell[::7]): occ += 1; ro += 1
        rows.append(ro)
    last = max([i for i, r in enumerate(rows) if r] or [0])
    print('\t'.join([dars, str(n), str(round(100 * occ / tot)), str(round(100 * (last + 1) / len(rows))), f[3], f[4], f[5]]))
