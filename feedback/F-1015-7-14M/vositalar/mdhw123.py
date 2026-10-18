# F-1015-123 MD sinxroni: Yakun bo'limiga guruhga mos ✎ qaydi; texnik 19 darsda maydon qatori (yangi o'quvchi matni) bloк ichiga.
# python3 mdhw123.py [--yoz]
import re, sys, importlib.util
yoz = '--yoz' in sys.argv
SP = '/tmp/claude-1000/-home-kali-Desktop-internetLesson/82485f6d-16ed-42e1-bfdb-84a1b561cb6f/scratchpad/'
MD = {l.split()[0]: l.split()[2] for l in open(SP + 'md123.txt')}
G = {g.split()[0]: g.split()[1:] for g in open(SP + 'keys123.txt').read().split('\n') if g}
spec = importlib.util.spec_from_file_location('hwtex', __file__.replace('mdhw123.py', 'hwtex.py'))
src = open(__file__.replace('mdhw123.py', 'hwtex.py'), encoding='utf-8').read()
D = eval(re.search(r'\nD = (\{.*?\n\})', src, re.S).group(1)); KIM = eval(re.search(r'\nKIM = (\{.*?\})\n', src, re.S).group(1))
QAYD = {
 'doira': "✎ F-1015-123 (16.10): uy vazifasi kartasi P-025 ko'rinishida — qadam raqami ①②③ belgisi o'rniga raqam-doira (24px), maydonlar ramkali quti; matn o'zgarmagan.",
 'g3': "✎ F-1015-123 (16.10): uy vazifasi kartasi P-025 ko'rinishida — sarlavha «Uyda nima qilasiz?», maydonlar katta quti (yorliq bosh harfda, «:» siz), qadamlar raqam-doira, «Keyingi dars» karta ichida (13.5px); qadam matni o'zgarmagan.",
 'pm': "✎ F-1015-123 (16.10, S2-A): «To'liq / Qisqa» tanlovi qoladi; karta banner ostida JOYIDA ochiladi (popup/varaq yo'q — PM 77/58 dagi qatlam yechimi bekor), «Topshiriq kartasi · TO'LIQ» sarlavha-qatori olindi (tanlangan chip bilan takror), maydonlar quti, qadamlar raqam-doira, bitta ustun; «Keyingi dars» karta ichida; HW ochilganda Yakun siqilmaydi (:has(.hw-chips) qoidalari olindi), banner 138px.",
}
def tex_qayd(k):
    kim, nu, _, _ = D[k]
    return (f"✎ F-1015-123 (16.10, S1-A): uy vazifasi kartasi P-025 — sarlavha «Uyda nima qilasiz?» (bannerdagi «Uyga vazifa» bilan takror emas); "
            f"maydonlar: Kim uchun — {KIM[kim][0]} · Nechta — {nu} · Muddat — keyingi darsgacha (qiymatlar topshiriq matnidan); qadamlar raqam-doira; «Keyingi dars» karta ichida; bezak emoji olindi.")
for g, keys in G.items():
    for k in keys:
        f = MD[k]; s = open(f, encoding='utf-8').read(); L = s.split('\n'); x = []
        if 'F-1015-123' in s: print('..', k, 'allaqachon'); continue
        q = tex_qayd(k) if g == 'tex' else QAYD[g]
        if g == 'tex':  # blok ichiga maydon qatori
            i = next((n for n, l in enumerate(L) if re.match(r"^- Uyga vazifa(?: \((?:bosilgach|ochilganda)\))?:\s*$", l)), None)
            if i is not None:
                kim, nu, _, _ = D[k]
                L[i] = '- Uyda nima qilasiz? (Uyga vazifa bosilgach)'
                L.insert(i + 1, f"  - Kim uchun — {KIM[kim][0]} · Nechta — {nu} · Muddat — keyingi darsgacha")
                j = i + 2
                while j < len(L) and L[j].startswith('  '):
                    L[j] = re.sub(r'(🚀|📝|📱|🎓) ', '', L[j]); j += 1
                x.append('blok')
        # qayd: Yakun bo'limidagi «Tugmalar: … Yakunlash ✓» qatoridan keyin (bo'lmasa F-1015-112 qaydidan keyin)
        t = [n for n, l in enumerate(L) if 'Yakunlash ✓' in l and l.lstrip().startswith('- Tugmalar')]
        if not t:  # 207: yozuv «Yakunlash ✓» — F-1015-112 sinxronida tushib qolgan MD
            t = [n for n, l in enumerate(L) if l.rstrip() == '- Tugmalar: Orqaga · Qaytadan · Yakunlash']
            for n in t: L[n] = L[n].rstrip() + ' ✓'; x.append('✓')
        if not t: t = [n for n, l in enumerate(L) if l.startswith('✎ F-1015-112')]
        if not t: print('!!', k, f, 'langar yo\'q'); continue
        L.insert(t[0] + 1, q); x.append('qayd')
        print(k, g, f.split('/')[-1], ' '.join(x))
        if yoz: open(f, 'w', encoding='utf-8').write('\n'.join(L))
