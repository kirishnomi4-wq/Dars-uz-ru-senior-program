// Ism-yordamchilar: JWT `name` (rasmiy to'liq ism) → jonli-dars nickname (2..24 belgi, sessiyada noyob).
// Ism forma emas, tasdiqlangan claim'dan olinadi (LMS §5.2). Ism yo'q/qisqa bo'lsa — «O'quvchi <id>».

const MAX = 24;

/** "Abdurahmonov Abdulaziz Abdulla o'g'li" → "Abdurahmonov Abdulaziz" (2 so'z, ≤24) */
export function nicknameFrom(name, subjectId) {
  const words = String(name || '').replace(/\s+/g, ' ').trim().split(' ').filter(Boolean);
  let nick = words.slice(0, 2).join(' ');
  if (nick.length > MAX) nick = words[0].slice(0, MAX);
  nick = nick.trim();
  if (nick.length < 2) nick = `O'quvchi ${subjectId}`.slice(0, MAX);
  return nick;
}

/** Band bo'lsa: "Ali Valiyev" → "Ali Valiyev 2", "Ali Valiyev 3"… (24 ichida) */
export function nicknameVariant(base, n) {
  if (n <= 1) return base;
  const suffix = ` ${n}`;
  return `${base.slice(0, MAX - suffix.length).trimEnd()}${suffix}`;
}
