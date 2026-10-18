# Suratlarni bitta varaqqa yig'ish: python3 varaq.py chiqish.jpg ustun a.jpg b.jpg ... (har surat ustiga nomi)
import sys, os
from PIL import Image, ImageDraw
out, cols, files = sys.argv[1], int(sys.argv[2]), sys.argv[3:]
ims = [Image.open(f).convert('RGB') for f in files]
w = max(i.width for i in ims); h = max(i.height for i in ims)
# pastki bo'sh qism kesiladi: nav panelidan yuqorisi (≈ 92%) qoldiriladi
crop = int(h * 0.90)
rows = (len(ims) + cols - 1) // cols
sheet = Image.new('RGB', (cols * w, rows * (crop + 18)), 'white')
d = ImageDraw.Draw(sheet)
for k, (im, f) in enumerate(zip(ims, files)):
    x, y = (k % cols) * w, (k // cols) * (crop + 18)
    d.text((x + 6, y + 3), os.path.basename(f), fill='red')
    sheet.paste(im.crop((0, 0, im.width, crop)), (x, y + 18))
sheet.save(out, quality=72)
print(out, sheet.size)
