#!/usr/bin/env python3
"""Coddy ovozi: darsdagi tayyor gaplarni oldindan mp3 qiladi (mentor kursidagi kabi: edge-tts, o'zbekcha Sardor ovozi).
Natija: public/ovoz/<nom>.mp3 va public/ovoz/royxat.json ({ kalit: fayl }). tovush.js shu ro'yxatdan topsa — mp3 ni qo'yadi,
topmasa — brauzerning o'zbek ovozi, u ham bo'lmasa — jim. Gap qo'shilsa yoki o'zgarsa, shu skript qayta yurgiziladi.
Buyruq (new-junior papkasidan): python3 sinov/ovoz-yarat.py   (edge-tts foydalanuvchi kutubxonasida turadi — -I bilan ishlamaydi)
Kalit tovush.js dagi kalit() bilan aynan bir xil: kichik harf, harf/raqam/bo'shliq/apostrofdan boshqasi olib tashlanadi.
"""
import asyncio, hashlib, json, pathlib, re, sys
import edge_tts

OVOZ, TEZLIK, BALANDLIK = 'uz-UZ-SardorNeural', '+0%', '+10Hz'  # Coddy — robot, ovozi biroz baland
# (ekrandagi yozuv, aytiladigan matn) — raqam so'z bilan aytiladi
GAPLAR = [
    ('Salom!', 'Salom!'),
    ('2 qadam yur', 'Ikki qadam yur.'),
    ('Men Coddyman!', 'Men Koddiman!'),
    ('Bu — mening kosmosim', 'Bu — mening kosmosim!'),
    ('Mening kosmosim', 'Mening kosmosim!'),
    ('Salom, bolalar!', 'Salom, bolalar!'),
    ('Men robotman', 'Men robotman!'),
    ('Bu — mening sahnam!', 'Bu — mening sahnam!'),
    ('Salom! Men Coddyman', 'Salom! Men Koddiman!'),
]

def kalit(s):
    s = s.lower().replace('’', "'").replace('ʻ', "'").replace('ʼ', "'").replace('`', "'")
    s = re.sub(r"[^\w\s']|_", '', s)
    return re.sub(r'\s+', ' ', s).strip()

async def main():
    papka = pathlib.Path(__file__).resolve().parent.parent / 'public' / 'ovoz'
    papka.mkdir(parents=True, exist_ok=True)
    royxat = {}
    for yozuv, aytish in GAPLAR:
        k = kalit(yozuv)
        fayl = hashlib.sha1((OVOZ + BALANDLIK + aytish).encode()).hexdigest()[:12] + '.mp3'
        yol = papka / fayl
        if not yol.exists() or yol.stat().st_size < 1000:
            await edge_tts.Communicate(aytish, OVOZ, rate=TEZLIK, pitch=BALANDLIK).save(str(yol))
        royxat[k] = fayl
        print(f'{yol.stat().st_size:>7}  {fayl}  {k}')
    for eski in papka.glob('*.mp3'):  # ro'yxatda yo'q eski fayllar o'chiriladi
        if eski.name not in royxat.values(): eski.unlink()
    (papka / 'royxat.json').write_text(json.dumps(royxat, ensure_ascii=False, indent=1), encoding='utf-8')

asyncio.run(main())
