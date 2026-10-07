import re, html, sys, subprocess, os
out = sys.argv[1]
for pair in sys.argv[2:]:
    url, name = pair.split('|')
    raw = subprocess.run(['curl','-sL','-m','40','-A','Mozilla/5.0',url],capture_output=True).stdout.decode('utf-8','ignore')
    open(os.path.join(out,name+'.html'),'w').write(raw)
    m = re.search(r'<article.*?</article>', raw, re.S) or re.search(r'<main.*?</main>', raw, re.S)
    t = m.group(0) if m else raw
    t = re.sub(r'<script.*?</script>|<style.*?</style>','',t,flags=re.S)
    t = re.sub(r'</(p|li|tr|h\d|div|pre|code)>','\n',t); t = re.sub(r'<br\s*/?>','\n',t)
    t = re.sub(r'<[^>]+>',' ',t); t = html.unescape(t); t = re.sub(r'[ \t]+',' ',t); t = re.sub(r'\n\s*\n+','\n',t)
    open(os.path.join(out,name+'.txt'),'w').write(t)
    print(name, len(raw), len(t))
