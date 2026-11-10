import base from '/home/kali/Desktop/internetLesson/vite.config.js';
const b = typeof base === 'function' ? base({ mode: 'development', command: 'serve' }) : base;
export default { ...b, server: { ...(b.server || {}), watch: { ignored: ['**/*'] } } };
