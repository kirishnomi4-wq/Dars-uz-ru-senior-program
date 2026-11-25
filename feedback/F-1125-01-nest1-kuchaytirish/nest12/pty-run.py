#!/usr/bin/env python3
"""Interaktiv buyruqni soxta terminalda (pty) yurgizadi: savol chiqqanda berilgan tugmani bosadi,
butun ekran chiqishini faylga yozadi. Mentor `nest new` da nimani ko'rishini aynan yozib olish uchun.
Ishlatish: pty-run.py <log> <timeout_s> '<json: [[regex, send], ...]>' -- buyruq ...
Har qoida bir marta, tartib bilan ishlaydi. send ichida \\r = Enter, \\x1b[B = pastga."""
import sys, os, pty, re, json, select, time, codecs, fcntl, termios, struct
log, timeout, rules = sys.argv[1], float(sys.argv[2]), json.loads(sys.argv[3])
cmd = sys.argv[sys.argv.index('--') + 1:]
pid, fd = pty.fork()
if pid == 0:
    os.environ['TERM'] = 'xterm-256color'; os.environ['COLUMNS'] = '120'; os.environ['LINES'] = '40'
    os.execvp(cmd[0], cmd)
# Oyna o'lchami ALBATTA beriladi (40x120): o'lchamsiz terminalda (0 ustun) nest new spinneri
# qatorlarni cheksiz o'chirib, sekundiga megabaytlab yozadi va buyruq hech qachon tugamaydi (25.11 da ikki marta shunday bo'ldi).
fcntl.ioctl(fd, termios.TIOCSWINSZ, struct.pack('HHHH', 40, 120, 0, 0))
buf = ''; t0 = time.time(); idx = 0; out = open(log, 'wb'); dec = codecs.getincrementaldecoder('utf-8')('replace')
ansi = re.compile(r'\x1b\[[0-9;?]*[A-Za-z]|\x1b\][^\x07]*\x07')
while time.time() - t0 < timeout:
    r, _, _ = select.select([fd], [], [], 0.5)
    if fd in r:
        try: data = os.read(fd, 65536)
        except OSError: break
        if not data: break
        out.write(data); out.flush()
        # Bufer faqat qoida qolganda yig'iladi va 20 ming belgi bilan cheklanadi: aks holda spinner oqimi
        # (100+ MB) buferni shishiradi, o'qish sekinlashadi va buyruq terminalga yozishda qotib qoladi (25.11 da shunday bo'ldi).
        if idx < len(rules): buf = (buf + dec.decode(data))[-20000:]
    if idx < len(rules):
        pat, send = rules[idx]
        if re.search(pat, ansi.sub('', buf)):
            time.sleep(1.2)
            os.write(fd, send.encode().decode('unicode_escape').encode())
            sys.stderr.write(f"[pty-run] qoida {idx+1}: /{pat}/ -> {send!r}\n"); buf = ''; idx += 1
    try:
        p, st = os.waitpid(pid, os.WNOHANG)
        if p == pid:
            sys.stderr.write(f"[pty-run] tugadi, kod {os.waitstatus_to_exitcode(st)}, qoidalar {idx}/{len(rules)}\n"); break
    except ChildProcessError: break
else:
    sys.stderr.write("[pty-run] VAQT TUGADI\n")
    try: os.killpg(pid, 9)
    except Exception: os.kill(pid, 9)
out.close()
