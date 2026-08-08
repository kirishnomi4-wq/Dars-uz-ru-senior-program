# Lesson prompt — с разблокировкой следующего урока (`useNextLessonAccess`)

> Самодостаточный промпт: заполните четыре строки ниже и отправьте весь файл Claude
> (Opus/Sonnet 4+) одним сообщением. Ответ — один `.jsx` файл, ничего больше.

## ЗАПОЛНИТЬ

- **ТЕМА:** `[REPLACE: например «Kvadrat tenglamalar» / «Present Simple» / «Pifagor teoremasi»]`
- **КЛАСС:** `[REPLACE: например 5-sinf / 7-8 sinf / 9-10 sinf]`
- **ДЛИТЕЛЬНОСТЬ:** `[REPLACE: например 12-18 minut]`
- **ТОН:** `[REPLACE: например «clear, engaging, age-appropriate»]`

---

You will write a complete lesson as a single `.jsx` file for our learning platform.
**The layout is video-style** — full viewport, cinematic, screen-based. Visual content
(SVG + typography) is the protagonist; text is the caption. Audio narration, sound
effects, AI grading, media assets and the next-lesson unlock are all reached through hooks
imported from `@lesson/runtime` — you never see a URL.

**This lesson owns its final screen:** it unlocks the next lesson itself via
`useNextLessonAccess()` and shows the result there, instead of handing that off to the
platform's result screen. See the `useNextLessonAccess()` section below — it is required,
not optional.

### Topic and audience

Take the topic, grade level, duration and tone from the **ЗАПОЛНИТЬ** block at the top of
this file. Whatever the tone says, keep it age-appropriate and use the student's name often
(visibly). If any of those four lines is still an unfilled `[REPLACE: …]` placeholder, ask
for it instead of inventing one.

### Hard contract (do not deviate)

```jsx
export default function LessonName({ studentName, lang = 'uz', onFinished }) { ... }
```

**Props — that is the entire prop list:**
- `studentName: string` — **for visible text only** (hook title, mid-lesson kicker, result
  hero). Never put it in audio scripts (it would bust the TTS cache per student). Fallback:
  `studentName || (lang === 'ru' ? 'Ученик' : "O'quvchi")`.
- `lang: 'uz' | 'ru'` — content selection (`CONTENT.uz` vs `CONTENT.ru`) and UI strings.
  Helper: `const t = (uz, ru) => (lang === 'ru' ? ru : uz);`
- `onFinished: (result) => void` — call **exactly once**, from the final result screen.

Everything backend-related (TTS endpoint, voice gender, SFX URLs, grading endpoint,
asset base, `lesson_id` / `lesson_name` / `student_uuid`) is provided by the platform and
read through the `@lesson/runtime` hooks. Do **not** add `ttsApiBase`, `aiGradingEndpoint`,
`correctSoundUrl`, `wrongSoundUrl`, `assets`, `assetsBase`, or `studentToken` to the props.

### Imports — use only these

```jsx
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, ArrowLeft, Check, X, Play, Award, Sparkles,
  Volume1, Volume2, VolumeX, RotateCcw, Lightbulb,
  Mic, MicOff, Square, Send, Loader2,
  /* any lucide-react icon you need */
} from 'lucide-react';
import {
  useAudio, useSfx, useGrader, useAssets, useNextLessonAccess,
} from '@lesson/runtime';
// Optional: import { evaluate, parse } from 'mathjs';
```

No other imports. No external audio library, no `fetch`, no `window.speechSynthesis`.

---

## The `@lesson/runtime` SDK (the only API surface)

These hooks read the platform's endpoints + student/lesson identity from context. You call
them; you never pass them configuration.

### `useAudio(segments) → audio`

Streamed TTS narration. Pass the segment queue for the current screen. The endpoint, voice
gender and analytics ids are injected by the platform.

```jsx
const audio = useAudio(segments);
// audio = {
//   isPlaying, muted, waitingFor,
//   triggerEvent(type, target),  // advance a segment that is waiting on an event
//   replay(),                    // replay the current/previous segment
//   pushOneOff(text),            // play a one-off line (e.g. answer feedback)
//   toggleMute(),
// }
```

If TTS is unavailable, the hook is a no-op — every other interaction still works.

### `useSfx() → { playCorrect, playWrong }`

Short correct/wrong sound effects. Call on a **scored** answer reveal. Never on the hook or
info screens.

```jsx
const sfx = useSfx();
if (correct) sfx.playCorrect(); else sfx.playWrong();
```

### `useGrader() → grade(args)`

AI grading for open-ended questions. The endpoint, `lessonId` and `lang` are injected; you
pass only the per-question fields. Returns `{ correct, feedback, transcript? }`, throws on
failure (treat as non-scoring — see §AI-graded open questions).

```jsx
const grade = useGrader();
const verdict = await grade({
  screenIdx, question, rubric,
  mode,                 // 'text' | 'voice'
  answerText,           // text mode
  audioBlob,            // voice mode
});
```

### `useNextLessonAccess() → completeLesson()`

Marks the lesson complete and unlocks the next one. The student token and `lesson_id` are
injected by the platform — **you pass nothing**.

```jsx
const completeLesson = useNextLessonAccess();
const unlock = await completeLesson();
// unlock = null  → capability withheld (e.g. a test after this lesson owns the
//                  unlock), or the request failed — both are normal
// unlock = {}    → succeeded, but the backend returned no payload
// unlock = { coins?, points?, achieved_score?, target?, current?, applied_tries?, tries? }
```

Every field is **optional** — render each one conditionally, exactly like `useAssets()`
media. `null` and `{}` are normal outcomes, not errors.

**Call it exactly once, from the final result screen only**, inside a `useEffect` with a
`useRef` guard. Never in a render body, never on a non-final screen, never in a loop.

```jsx
function SN_Result({ lang, answers, onFinish }) {
  const completeLesson = useNextLessonAccess();
  const t = (uz, ru) => (lang === 'ru' ? ru : uz);
  const requested = useRef(false);
  const [unlock, setUnlock] = useState(null);

  useEffect(() => {
    if (requested.current) return undefined;   // once per lesson, never per render
    requested.current = true;
    let cancelled = false;
    completeLesson()
      .then((data) => { if (!cancelled) setUnlock(data); })
      .catch(() => { /* non-blocking: the result screen stays fully usable */ });
    return () => { cancelled = true; };
  }, [completeLesson]);

  return (
    <div /* …result hero, score, mistakes list… */>
      {typeof unlock?.coins === 'number' && (
        <p>{t('Tanga', 'Монеты')}: +{unlock.coins}</p>
      )}
      {typeof unlock?.points === 'number' && (
        <p>{t('Ball', 'Баллы')}: +{unlock.points}</p>
      )}
      {/* The finish CTA is NEVER gated on `unlock` — it works even if the call never resolves */}
      <button onClick={onFinish}>{t('Davom etish', 'Продолжить')}</button>
    </div>
  );
}
```

Rules:

- It does **not** replace `onFinished`. Both happen: `completeLesson()` on mount of the
  result screen, `onFinished(payload)` once, when the student presses Continue.
- Never gate the Continue button, the score display or navigation on `unlock`.
- Never navigate anywhere yourself — where the student goes next is the platform's decision.
- Never pass arguments to `completeLesson()`; never touch a token, URL or `lesson_id`.
- All visible strings live in `CONTENT.uz` / `CONTENT.ru` (or a `t(uz, ru)` helper), like
  every other string in the lesson.
- Nothing from `unlock` goes into audio text: TTS is cached by text and these values differ
  per student. Show them visually only.

### `useAssets() → { assets, resolveUrl }`

Media manifest + URL resolver. `resolveUrl` accepts a key (`'img_hook'`) or a raw asset
object and applies the provider base. Always render assets conditionally.

```jsx
const { assets, resolveUrl } = useAssets();
const hookUrl = resolveUrl('img_hook');     // null if the asset is absent
{hookUrl && <img src={hookUrl} alt={assets.img_hook?.description} />}
```

> `resolveAssetUrl(asset, base)` is also exported for advanced use, but prefer `useAssets()`.

---

## Audio segments

```js
// Plays on mount, then waits for the student to pick an option:
[{ id: 'q', text: c.audio_q, trigger: 'on_mount', waits_for: { type: 'option_picked' } }]

// Step-by-step narration, each step gated on a button click:
[
  { id: 's1', text: '...', trigger: 'on_mount',       waits_for: { type: 'button_click', target: 'step' } },
  { id: 's2', text: '...', trigger: 'after_previous', waits_for: { type: 'button_click', target: 'step' } },
  { id: 's3', text: '...', trigger: 'after_previous', waits_for: { type: 'button_click', target: 'next' } },
]
```

`waits_for.type` values: `option_picked`, `check_pressed`, `button_click` (with
`target: 'step'` or `target: 'next'`), or omit `waits_for` to auto-advance. Fire the matching
event from your screen:

```jsx
audio.triggerEvent('option_picked');
audio.triggerEvent('check_pressed');
audio.triggerEvent('button_click', 'step');
audio.triggerEvent('button_click', 'next');
```

After an answer, push a feedback line:

```jsx
audio.pushOneOff(isCorrect ? c.audio_fb_correct : c.audio_fb_wrong);
```

### TTS quality rules

- **Begin every audio string with the host-language pronunciation marker** for `lang`:
  `uz` → `[O'zbekcha tallaffuz]`, `ru` → `[Русское произношение]`. The TTS backend is
  ElevenLabs **v3** (AI multilingual); this leading marker is what makes it pronounce the
  base language correctly. Required on **every** `audio`, `audio_q`, and `audio_fb_*` string —
  any expressive tag or foreign-word insertion comes *after* it.
- Write audio as **complete natural sentences** — they're read aloud.
- **Never include `studentName` in audio text.** Audio is cached server-side by the text —
  per-student names break the cache. Greet generically: "Salom, do'st!" / "Привет, друг!".
- **Never** use `%`, `/`, `²`, `+`, `=`, `×` in audio — write words: "foiz", "bo'lingan",
  "kvadrat", "plyus", "teng", "ko'paytir". Fractions as words: "bir ikkidan", "одна вторая".
- Keep segments under ~25 s (60–80 words). Split long explanations.
- Audio scripts are **static strings**, never functions of `studentName`.

### Expressive audio tags (ElevenLabs)

Inline, lowercase, in square brackets; affects words after it. **0–2 per segment, max.**
Allowed: `[laughs]`, `[laughs harder]`, `[starts laughing]`, `[chuckle]`, `[giggle]`,
`[whispers]`, `[sighs]`, `[gasps]`, `[clears throat]`, `[pause]`, `[long pause]`, `[excited]`,
`[curious]`, `[sarcastic]`, `[mischievously]`.

```js
audio_fb_correct: "[O'zbekcha tallaffuz] [chuckle] Juda to'g'ri!",
audio: "[O'zbekcha tallaffuz] Endi Pifagor teoremasi. [pause] A kvadrat plyus be kvadrat teng se kvadrat.",
```

Never open the lesson with `[laughs]`. Don't put two tags adjacent. Keep info screens (rule,
formula) tag-free. Don't invent new tags.

### Multilingual narration

Every audio string already opens with the host-language marker (`[O'zbekcha tallaffuz]` /
`[Русское произношение]`). To pronounce a **foreign** word/phrase correctly *inside* that
sentence, wrap it: `[English pronunciation] ...phrase... [end]`. `[end]` returns to the host
language (omit it only if the phrase is the segment's tail). Other targets:
`[language: ru] ... [end]`, `[language: tr] ... [end]`.

```js
// Uzbek lesson teaching English — host marker first, English wrapped, returns to Uzbek:
audio_q: "[O'zbekcha tallaffuz] Gapni tahlil qiling. [English pronunciation] She watches TV every day. [end] Qaysi tense?",
```

Use the insertion marker only when real foreign pronunciation is needed; transliterate grammar
terms ("Prezent Simpl") instead. The bracketed phrase must be complete and grammatical. Don't
put expressive tags inside the bracketed region.

---

## SFX rules

- Only on **scored** answers (MC, NumInput, AI-open). Never on the hook or info screens.
- Plays once per reveal — the screen's `revealed` state already guards this.
- Fire-and-forget; if it fails the lesson must still work.

---

## AI-graded open questions

Open-ended questions are graded by an AI server via `useGrader()`. Each AI screen has
**exactly one** input mode, fixed at authoring time:

| Mode    | Student input              | Sent                                   |
|---------|----------------------------|----------------------------------------|
| `text`  | `<textarea>`               | JSON `{ …, answerText }`               |
| `voice` | microphone (WebM blob)     | multipart with the audio blob          |

The server returns `{ correct: boolean, feedback: string, transcript?: string }`. On
**any failure** (network/4xx/5xx/malformed), record `correct: null` (non-scoring), show a soft
message, and let the student advance — AI failures must never block completion. **Never** put
an AI screen as the final test (the final test must be deterministic), and use **1–2 AI
screens per lesson max**.

`feedback` and the `question`/`rubric` you send must **not** contain `studentName`.

---

## Media assets

The platform passes a manifest of mentor-uploaded images/videos/audio. Reference them by key
(`img_*`, `vid_*`, `aud_*`) via `useAssets()` — **never hardcode a URL**. Each entry:

```js
{ path: 'abc.png' /* filename, or absolute https URL */, width, height, aspectRatio, description /* ≤10 words */, duration? }
```

Rules: always optional-chain (`assets?.img_hook`) and render conditionally
(`url && <img .../>`); pass `width`/`height`/`aspectRatio` to avoid layout shift; use
`description` as `alt`; if the manifest pins `USE ON: sN`, place it on that screen; a lesson
with no assets (SVG-only) is valid. The manifest is injected by the platform — only use keys
that appear in the "Available assets" block the mentor pastes.

```jsx
const { assets, resolveUrl } = useAssets();
const vidUrl = resolveUrl('vid_intro');
{vidUrl && (
  <video src={vidUrl} width={assets.vid_intro.width} height={assets.vid_intro.height}
    controls playsInline preload="metadata"
    style={{ width: '100%', maxWidth: 640, height: 'auto', aspectRatio: assets.vid_intro.aspectRatio, borderRadius: 14 }} />
)}
```

---

## Screen-based architecture (mandatory)

The lesson is a sequence of **screens** indexed by `screenIdx`. The top component holds
`screenIdx`, `answers`, and `startTime`, and switches inside `<AnimatePresence mode="wait">`.
Because the hooks read the platform context, the `common` props object is small — it carries
no endpoints, no `sfx`, no `ttsExtras`.

```jsx
const LESSON_ID = 'my-lesson-v1'; // used only in the onFinished payload

export default function MyLesson({ studentName, lang = 'uz', onFinished }) {
  const startTime = useRef(Date.now());
  const [screenIdx, setScreenIdx] = useState(0);
  const [answers, setAnswers] = useState({}); // { [screenIdx]: { picked, correct, type, ... } }

  const totalScreens = CONTENT.TOTAL_SCREENS;
  const progress = ((screenIdx + 1) / totalScreens) * 100;

  const goNext = () => setScreenIdx((i) => Math.min(i + 1, totalScreens - 1));
  const goBack = () => setScreenIdx((i) => Math.max(i - 1, 0));
  const recordAnswer = (idx, payload) => setAnswers((a) => ({ ...a, [idx]: payload }));

  const handleFinish = () => { /* build payload, call onFinished(payload) */ };

  const common = {
    screenIdx, lang, studentName, progress, totalScreens,
    storedAnswer: answers[screenIdx],
    onAnswer: recordAnswer,
    onNext: goNext,
    onBack: screenIdx > 0 ? goBack : null,
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div key={screenIdx}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}>
        {screenIdx === 0 && <S0_Hook {...common} />}
        {/* ... */}
        {screenIdx === 9 && (
          <OpenQuestionScreen {...common} c={CONTENT[lang].s9_open} mode={CONTENT[lang].s9_open.mode} />
        )}
        {/* ... */}
        {screenIdx === totalScreens - 1 && <SN_Result {...common} answers={answers} onFinish={handleFinish} />}
      </motion.div>
    </AnimatePresence>
  );
}
```

Each screen calls the hooks it needs directly (`useAudio(segments)`, `useSfx()`,
`useGrader()`, `useAssets()`). Answers live only in the main lesson's `useState` — never in
`localStorage`/`sessionStorage`/context.

### Recommended screen flow (12–15 screens)

Hook → Analysis → Interactive → Concept → MC mikro → Rule → NumInput → Full analysis →
MC mikro → (optional **AI-open**, 1 per lesson) → Case start → MC step → MC final-case →
**MC/NumInput final test (deterministic, not AI)** → Result. Smaller lessons collapse to
8–10 screens; keep the hook → … → result spine.

---

## `CONTENT` object

All UI strings, audio scripts, and per-option feedback live in one `CONTENT` object (mirror
`uz` and `ru` exactly). Read per screen via `const c = CONTENT[lang].s4;`.

```js
const CONTENT = {
  TOTAL_SCREENS: 15,
  uz: {
    s0: { // hook — title may use the name (VISIBLE); audio is static (NO name)
      kicker: 'Topishmoq',
      title: (name) => `Salom, ${name}! [scenario sentence]`,
      sub: '[provocative line ending in a question]',
      opts: ["Ha, to'g'ri", "Yo'q, noto'g'ri", "Ishonchim komil emas"],
      audio: `[O'zbekcha tallaffuz] Salom, do'st! [excited] [full script — NO student name]`,
    },
    s4: { // MC
      kicker: 'Mashq',
      question: '[question]',
      opts: ['8', '10', '12', '24'], correctIdx: 2,
      correct_text: '12! [why]',
      wrong_0: "8 — [why 8 is wrong]", wrong_1: '10 — [why]', wrong_3: '24 — [why]',
      audio_q: "[O'zbekcha tallaffuz] [question read aloud, no symbols]",
    },
    s6: { // NumInput
      kicker: 'Yozing', title: "1/3 = ?/12. So'roq belgisi o'rniga qaysi son?",
      btnCheck: 'Tekshirish',
      fbCorrectTitle: 'Ajoyib!', fbCorrect: 'Ha, 4! …',
      fbWrongTitle: "Qayta o'ylab ko'ring", fbWrong: '[hint]',
      audio_q: "[O'zbekcha tallaffuz] [read aloud]", audio_fb_correct: "[O'zbekcha tallaffuz] To'g'ri!", audio_fb_wrong: "[O'zbekcha tallaffuz] [hint]",
    },
    s9_open: { // AI-graded (mode fixed at authoring time)
      kicker: "O'z so'zlaringiz bilan",
      question: '[open-ended question]',
      rubric: '[1–2 sentences: what a correct answer must contain — the AI grades against this]',
      hint: "2-3 jumlada tushuntiring.", placeholder: 'Misol uchun: chunki...',
      audio_q: "[O'zbekcha tallaffuz] [read aloud — no symbols, no studentName]",
      mode: 'text', // 'text' | 'voice' — immutable per screen
    },
    s14: { // Result
      kicker: 'Yakun', title: 'Asosiyni', titleEm: 'eslab qolamiz',
      scoreLabel: 'Sizning natijangiz',
      msgExcellent: 'Ajoyib!', msgGood: "Yaxshi, yana mashq qiling.", msgRepeat: "Mavzuni qayta ko'ring.",
      mainLabel: 'Asosiy', main1: '[…]', main2: '[…]', main3: '[…]', main4: '[…]',
      btnFinish: 'Darsni tugatish',
      audio: `[O'zbekcha tallaffuz] Yakunlandi. [recap — NO student name]`,
    },
  },
  ru: { /* mirror of uz, Russian values */ },
};
```

For `voice`-mode AI screens omit `placeholder` and invite a spoken reply in `audio_q`. Always
include a `rubric`.

---

## Color palette (mandatory)

```js
const C = {
  bg: 'rgb(245, 245, 245)', text: '#000', primary: '#fe5b1a',
  green1: '#10b981', green2: '#6ee7b7', green3: '#a7f3d0', green4: '#ecfdf5',
  yellow1: '#fcd34d', yellow2: '#fde68a', yellow3: '#fffbeb', yellow4: '#ffd659',
  gray1: '#94a3b8', gray2: '#5e5e5e33',
  red1: '#ff9090', red2: '#ff6a6a', redBg: '#fff5f5',
  orange1: '#f59e0b', blue: '#019acb', lightOrange: '#ff8b3e',
};
```

Primary action = `C.primary`/`C.text`; success = `C.green1` on `C.green4`; error = `C.primary`
on `C.redBg`; info = `C.blue`; labels = `C.gray1`; borders = `C.gray2`; page bg = `C.bg`,
cards = `#fff`. Don't invent hex values outside `C`.

## Fonts

```js
const F = {
  sans: '"Inter", system-ui, -apple-system, sans-serif',
  serif: '"Fraunces", Georgia, serif',
  mono: '"JetBrains Mono", ui-monospace, monospace',
};
```

Headings/big numbers/fractions: `F.serif` (often italic). Body: `F.sans`. Labels/counters:
`F.mono`, `letterSpacing: '0.15em'`, `textTransform: 'uppercase'`.

---

## Reusable components (paste verbatim, build screens on top)

These stay in the lesson; the API-touching ones call the SDK hooks internally.

```jsx
function useIsMobile(breakpoint = 640) {
  const [m, setM] = useState(false);
  useEffect(() => {
    const c = () => setM(window.innerWidth < breakpoint);
    c(); window.addEventListener('resize', c);
    return () => window.removeEventListener('resize', c);
  }, [breakpoint]);
  return m;
}

function Frac({ n, d, color, size = 'sm', style = {} }) {
  const sizes = { sm: 'clamp(16px,2.5vw,24px)', mid: 'clamp(26px,5vw,45px)', big: 'clamp(45px,9vw,88px)' };
  return (
    <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center',
      verticalAlign: 'middle', lineHeight: 1, margin: '0 0.08em', fontFamily: F.serif,
      fontSize: sizes[size], color: color || 'inherit', ...style }}>
      <span style={{ padding: '0 0.12em' }}>{n}</span>
      <span style={{ height: '0.08em', background: 'currentColor', width: '100%', margin: '0.08em 0', borderRadius: 2 }} />
      <span style={{ padding: '0 0.12em' }}>{d}</span>
    </span>
  );
}

function AudioIndicator({ audio }) {
  const { isPlaying, muted, replay, toggleMute } = audio;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <button onClick={toggleMute} title={muted ? 'Sound on' : 'Sound off'}
        style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 4,
          display: 'flex', alignItems: 'center', color: muted ? C.gray1 : (isPlaying ? C.primary : C.text) }}>
        {muted ? <VolumeX size={16} /> : isPlaying ? <Volume2 size={16} /> : <Volume1 size={16} />}
      </button>
      {!muted && (
        <button onClick={replay} title="Replay"
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 4,
            display: 'flex', alignItems: 'center', color: C.gray1 }}>
          <RotateCcw size={14} />
        </button>
      )}
    </div>
  );
}

function VideoStage({ children, progress, kicker, screenIdx, totalScreens, audio }) {
  const isMobile = useIsMobile();
  const padX = isMobile ? 12 : 100;
  return (
    <div style={{ height: '100vh', width: '100%', background: C.bg, color: C.text, fontFamily: F.sans,
      display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ flex: '0 0 auto', background: C.bg, borderBottom: `1px solid ${C.gray2}` }}>
        <div style={{ height: 3, background: C.gray2 }}>
          <motion.div animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }}
            style={{ height: '100%', background: C.primary }} />
        </div>
        <div style={{ padding: `12px ${padX}px`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontFamily: F.mono, fontSize: isMobile ? 10 : 11, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: C.gray1, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.primary }} />
            <span>{kicker}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {audio && <AudioIndicator audio={audio} />}
            <div style={{ fontFamily: F.mono, fontSize: isMobile ? 10 : 11, color: C.gray1, letterSpacing: '0.1em' }}>
              {String(screenIdx + 1).padStart(2, '0')} / {String(totalScreens).padStart(2, '0')}
            </div>
          </div>
        </div>
      </div>
      <div style={{ flex: 1, minHeight: 0, width: '100%', display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </div>
  );
}

function Btn({ children, onClick, variant = 'primary', disabled = false, style = {} }) {
  const variants = {
    primary: { background: C.text, color: C.bg, border: `1.5px solid ${C.text}` },
    ghost: { background: 'transparent', color: C.text, border: `1.5px solid ${C.text}` },
    accent: { background: C.primary, color: '#fff', border: `1.5px solid ${C.primary}` },
  };
  return (
    <motion.button onClick={onClick} disabled={disabled} whileTap={disabled ? {} : { scale: 0.96 }}
      whileHover={disabled ? {} : { background: C.primary, borderColor: C.primary, color: '#fff' }}
      style={{ fontFamily: F.sans, fontWeight: 600, padding: 'clamp(12px,2vw,14px) clamp(18px,2.5vw,28px)',
        fontSize: 'clamp(14px,1.8vw,16px)', borderRadius: 12, cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1, display: 'inline-flex', alignItems: 'center', gap: 8,
        ...variants[variant], ...style }}>
      {children}
    </motion.button>
  );
}

function NavBar({ onBack, onNext, nextLabel, nextDisabled, extra }) {
  const isMobile = useIsMobile();
  const padX = isMobile ? 12 : 100;
  return (
    <div style={{ flex: '0 0 auto', background: C.bg, borderTop: `1px solid ${C.gray2}`,
      padding: `${isMobile ? 14 : 18}px ${padX}px`, display: 'flex', gap: 12, alignItems: 'center' }}>
      {onBack && <Btn onClick={onBack} variant="ghost">← {isMobile ? '' : 'Orqaga'}</Btn>}
      {extra}
      <Btn onClick={onNext} variant="primary" disabled={nextDisabled} style={{ marginLeft: 'auto' }}>
        {nextLabel || 'Davom'} <ArrowRight size={16} />
      </Btn>
    </div>
  );
}

function FeedbackBlock({ show, isCorrect, children }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={{ opacity: 0, height: 0, marginTop: 0 }}
          animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
          exit={{ opacity: 0, height: 0, marginTop: 0 }} transition={{ duration: 0.35 }}
          style={{ background: isCorrect ? C.green4 : C.redBg,
            borderLeft: `4px solid ${isCorrect ? C.green1 : C.primary}`,
            borderRadius: 12, padding: 'clamp(14px,2.5vw,20px)', overflow: 'hidden' }}>
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

### `MCScreen` — reusable multiple-choice (covers most question screens)

Calls `useAudio` + `useSfx` itself. Every option needs per-option wrong feedback
(`wrong_0`, `wrong_1`, …).

```jsx
function MCScreen({ screenIdx, lang, c, progress, totalScreens, storedAnswer, onAnswer, onNext, onBack }) {
  const audioSegs = useMemo(
    () => [{ id: 'q', text: c.audio_q, trigger: 'on_mount', waits_for: { type: 'option_picked' } }],
    [c.audio_q]
  );
  const audio = useAudio(audioSegs);
  const sfx = useSfx();

  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const [revealed, setRevealed] = useState(storedAnswer !== undefined);
  const isMobile = useIsMobile();
  const padX = isMobile ? 12 : 100;

  const pick = (i) => {
    if (revealed) return;
    setPicked(i); setRevealed(true);
    audio.triggerEvent('option_picked');
    const correct = i === c.correctIdx;
    onAnswer(screenIdx, { picked: i, correct, type: 'mc' });
    if (correct) sfx.playCorrect(); else sfx.playWrong();
    setTimeout(() => {
      const fb = correct ? c.correct_text : (c[`wrong_${i}`] || (lang === 'ru' ? 'Не совсем' : "Noto'g'ri"));
      audio.pushOneOff(fb.replace(/(\d+)\/(\d+)/g, (_, n, d) => (lang === 'ru' ? `${n} на ${d}` : `${n} bo'lingan ${d}`)));
    }, 400);
  };

  return (
    <VideoStage progress={progress} kicker={c.kicker} screenIdx={screenIdx} totalScreens={totalScreens} audio={audio}>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: `${isMobile ? 20 : 40}px ${padX}px`, overflow: 'hidden' }}>
        <div style={{ width: '100%', maxWidth: 760, margin: '0 auto' }}>
          <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            style={{ fontFamily: F.serif, fontWeight: 600, fontSize: isMobile ? 22 : 'clamp(24px,3.5vw,36px)',
              lineHeight: 1.2, margin: '0 0 24px' }}>
            {c.question}
          </motion.h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {c.opts.map((opt, i) => {
              const sel = picked === i, isC = i === c.correctIdx;
              let bg = '#fff', borderColor = C.text, color = C.text;
              if (revealed) {
                if (isC) { bg = C.green4; borderColor = C.green1; color = C.green1; }
                else if (sel) { bg = C.redBg; borderColor = C.primary; color = C.primary; }
                else { borderColor = C.gray1; color = C.gray1; }
              }
              return (
                <motion.button key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * i }} whileTap={revealed ? {} : { scale: 0.99 }}
                  disabled={revealed} onClick={() => pick(i)}
                  style={{ background: bg, border: `1.5px solid ${borderColor}`, color,
                    padding: 'clamp(14px,2vw,18px) clamp(16px,2.5vw,22px)', borderRadius: 12,
                    cursor: revealed ? 'default' : 'pointer', fontFamily: F.sans,
                    fontSize: 'clamp(15px,1.9vw,17px)', fontWeight: 500, textAlign: 'left',
                    display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontFamily: F.mono, fontSize: 13, minWidth: 20, color: revealed && isC ? C.green1 : C.gray1 }}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span style={{ flex: 1 }}>{opt}</span>
                </motion.button>
              );
            })}
          </div>
          <FeedbackBlock show={revealed} isCorrect={picked === c.correctIdx}>
            <p style={{ margin: '0 0 6px', fontFamily: F.mono, fontSize: 12, fontWeight: 700,
              color: picked === c.correctIdx ? C.green1 : C.primary, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {picked === c.correctIdx ? (lang === 'ru' ? 'Верно' : "To'g'ri") : (lang === 'ru' ? 'Не совсем' : "Noto'g'ri")}
            </p>
            <p style={{ margin: 0, fontSize: 'clamp(14px,1.8vw,16px)', lineHeight: 1.5 }}>
              {picked === c.correctIdx ? c.correct_text
                : (c[`wrong_${picked}`] || (lang === 'ru' ? 'Попробуй ещё раз.' : 'Yana tahlil qiling.'))}
            </p>
          </FeedbackBlock>
        </div>
      </div>
      <NavBar onBack={onBack} onNext={onNext} nextLabel={lang === 'ru' ? 'Далее' : 'Davom'} nextDisabled={!revealed} />
    </VideoStage>
  );
}
```

Render an MC screen the same single-prop way as `OpenQuestionScreen` — one `c` prop holding
that screen's CONTENT entry (`question`, `opts`, `correctIdx`, `correct_text`, `wrong_N`,
`audio_q`, `kicker`):

```jsx
{screenIdx === 4 && <MCScreen {...common} c={CONTENT[lang].s4} />}
```

### `VoiceRecorder` — microphone capture (for voice-mode AI screens)

```jsx
function VoiceRecorder({ lang, disabled, onReady }) {
  const [state, setState] = useState('idle'); // 'idle'|'recording'|'ready'|'denied'
  const [duration, setDuration] = useState(0);
  const recorderRef = useRef(null), chunksRef = useRef([]), streamRef = useRef(null), startRef = useRef(0), timerRef = useRef(null);
  const t = (uz, ru) => (lang === 'ru' ? ru : uz);

  const start = async () => {
    if (state === 'recording' || disabled) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mime = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus'
        : (MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4');
      const rec = new MediaRecorder(stream, { mimeType: mime });
      recorderRef.current = rec; chunksRef.current = [];
      rec.ondataavailable = (e) => { if (e.data && e.data.size > 0) chunksRef.current.push(e.data); };
      rec.onstop = () => {
        const b = new Blob(chunksRef.current, { type: mime });
        setState('ready');
        const d = Math.max(1, Math.round((Date.now() - startRef.current) / 1000));
        setDuration(d); onReady?.(b, d);
        stream.getTracks().forEach((tr) => tr.stop()); streamRef.current = null;
      };
      startRef.current = Date.now(); rec.start(); setState('recording');
      timerRef.current = setInterval(() => setDuration(Math.round((Date.now() - startRef.current) / 1000)), 250);
    } catch (e) { setState('denied'); }
  };
  const stop = () => {
    if (state !== 'recording') return;
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    try { recorderRef.current?.stop(); } catch (e) {}
  };
  const reset = () => { setDuration(0); setState('idle'); onReady?.(null, 0); };
  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current);
    try { recorderRef.current?.stop(); } catch (e) {}
    streamRef.current?.getTracks().forEach((tr) => tr.stop());
  }, []);
  const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      {state === 'denied' && (
        <div style={{ background: C.redBg, color: C.primary, borderRadius: 10, padding: '8px 14px', fontSize: 13, textAlign: 'center' }}>
          {t('Mikrofonga ruxsat berilmagan.', 'Микрофон не разрешён.')}
        </div>
      )}
      {state === 'idle' && (
        <motion.button whileTap={{ scale: 0.95 }} onClick={start} disabled={disabled}
          style={{ width: 96, height: 96, borderRadius: '50%', background: C.primary, color: '#fff', border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: `0 8px 24px ${C.primary}40` }}>
          <Mic size={36} />
        </motion.button>
      )}
      {state === 'recording' && (
        <motion.button onClick={stop} animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 1.2, repeat: Infinity }}
          style={{ width: 96, height: 96, borderRadius: '50%', background: C.red2, color: '#fff',
            border: `3px solid ${C.primary}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <Square size={28} fill="#fff" />
        </motion.button>
      )}
      {state === 'ready' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: C.green4,
          border: `1.5px solid ${C.green1}`, borderRadius: 14, padding: '12px 20px' }}>
          <Check size={22} color={C.green1} />
          <div>
            <div style={{ fontFamily: F.mono, fontSize: 12, color: C.gray1, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              {t('Yozildi', 'Записано')}
            </div>
            <div style={{ fontFamily: F.serif, fontStyle: 'italic', fontSize: 22, color: C.green1, fontWeight: 600 }}>{fmt(duration)}</div>
          </div>
          <button onClick={reset} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: C.gray1, padding: 6, display: 'flex' }}>
            <RotateCcw size={18} />
          </button>
        </div>
      )}
      <div style={{ fontFamily: F.mono, fontSize: 12, color: C.gray1, height: 18 }}>
        {state === 'idle' && t('Tugmani bosib gapiring', 'Нажмите и говорите')}
        {state === 'recording' && <>{t('Yozilmoqda', 'Идёт запись')} · {fmt(duration)}</>}
        {state === 'ready' && t('Yana yozish uchun ↺', 'Записать заново ↺')}
      </div>
    </div>
  );
}
```

### `OpenQuestionScreen` — AI-graded text or voice

Calls `useAudio`, `useSfx`, `useGrader`. `mode` is fixed per screen.

```jsx
function OpenQuestionScreen({ screenIdx, lang, c, mode = 'text', progress, totalScreens, storedAnswer, onAnswer, onNext, onBack }) {
  const isMobile = useIsMobile();
  const padX = isMobile ? 12 : 100;
  const audioSegs = useMemo(
    () => [{ id: 'q', text: c.audio_q, trigger: 'on_mount', waits_for: { type: 'check_pressed' } }],
    [c.audio_q]
  );
  const audio = useAudio(audioSegs);
  const sfx = useSfx();
  const grade = useGrader();

  const [answerText, setAnswerText] = useState(storedAnswer?.answerText ?? '');
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioDuration, setAudioDuration] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [verdict, setVerdict] = useState(storedAnswer
    ? { correct: storedAnswer.correct, feedback: storedAnswer.feedback, transcript: storedAnswer.transcript } : null);

  const canSubmit = !verdict && !submitting && (mode === 'text' ? answerText.trim().length >= 3 : !!audioBlob);
  const onVoiceReady = useCallback((blob, d) => { setAudioBlob(blob); setAudioDuration(d); }, []);

  const submit = async () => {
    if (!canSubmit) return;
    setSubmitting(true); setError(null); audio.triggerEvent('check_pressed');
    try {
      const result = await grade({
        screenIdx, question: c.question || c.title, rubric: c.rubric || '', mode,
        answerText: mode === 'text' ? answerText : undefined,
        audioBlob: mode === 'voice' ? audioBlob : undefined,
      });
      setVerdict(result);
      onAnswer(screenIdx, {
        picked: mode === 'text' ? answerText : `[voice ${audioDuration}s]`,
        answerText: mode === 'text' ? answerText : undefined,
        transcript: result.transcript, correct: result.correct, feedback: result.feedback, type: 'ai-open', mode,
      });
      if (result.correct) sfx.playCorrect(); else sfx.playWrong();
      setTimeout(() => audio.pushOneOff(result.feedback), 300);
    } catch (e) {
      setError(e.message || 'Error');
      onAnswer(screenIdx, { picked: mode === 'text' ? answerText : `[voice ${audioDuration}s]`,
        answerText: mode === 'text' ? answerText : undefined, correct: null, type: 'ai-open', mode, error: e.message });
    } finally { setSubmitting(false); }
  };

  return (
    <VideoStage progress={progress} kicker={c.kicker} screenIdx={screenIdx} totalScreens={totalScreens} audio={audio}>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: `${isMobile ? 20 : 40}px ${padX}px`, overflow: 'hidden' }}>
        <div style={{ width: '100%', maxWidth: 760, margin: '0 auto' }}>
          <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            style={{ fontFamily: F.serif, fontWeight: 600, fontSize: isMobile ? 22 : 'clamp(24px,3.4vw,34px)', lineHeight: 1.2, margin: '0 0 8px' }}>
            {c.question || c.title}
          </motion.h2>
          {c.hint && <p style={{ margin: '0 0 18px', color: C.gray1, fontSize: 'clamp(13px,1.7vw,15px)', lineHeight: 1.5 }}>{c.hint}</p>}

          {mode === 'text' && !verdict && (
            <textarea value={answerText} onChange={(e) => setAnswerText(e.target.value)} disabled={submitting}
              placeholder={c.placeholder || (lang === 'ru' ? 'Напишите ответ…' : 'Javobingizni yozing…')}
              style={{ width: '100%', minHeight: isMobile ? 110 : 140, resize: 'vertical', fontFamily: F.sans,
                fontSize: 'clamp(14px,1.8vw,16px)', lineHeight: 1.5, color: C.text, background: '#fff',
                border: `1.5px solid ${C.text}`, borderRadius: 12, padding: '12px 14px', outline: 'none', marginBottom: 14 }} />
          )}
          {mode === 'voice' && !verdict && (
            <div style={{ display: 'flex', justifyContent: 'center', margin: '12px 0 14px' }}>
              <VoiceRecorder lang={lang} disabled={submitting} onReady={onVoiceReady} />
            </div>
          )}
          {!verdict && (
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <Btn onClick={submit} disabled={!canSubmit} variant="primary">
                {submitting ? <Loader2 size={16} className="spin" /> : <Send size={16} />}{' '}
                {submitting ? (lang === 'ru' ? 'Проверяется…' : 'Tekshirilmoqda…') : (lang === 'ru' ? 'Отправить' : 'Yuborish')}
              </Btn>
              {error && <span style={{ fontSize: 13, color: C.primary }}>{error}</span>}
            </div>
          )}
          <FeedbackBlock show={!!verdict} isCorrect={verdict?.correct === true}>
            <p style={{ margin: '0 0 6px', fontFamily: F.mono, fontSize: 12, fontWeight: 700,
              color: verdict?.correct ? C.green1 : C.primary, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {verdict?.correct ? (lang === 'ru' ? 'Верно' : "To'g'ri") : (lang === 'ru' ? 'Не совсем' : "Noto'g'ri")}
            </p>
            <p style={{ margin: 0, fontSize: 'clamp(14px,1.8vw,16px)', lineHeight: 1.5 }}>{verdict?.feedback}</p>
            {mode === 'voice' && verdict?.transcript && (
              <p style={{ margin: '10px 0 0', fontFamily: F.mono, fontSize: 12, color: C.gray1, lineHeight: 1.4, fontStyle: 'italic' }}>
                "{verdict.transcript}"
              </p>
            )}
          </FeedbackBlock>
        </div>
      </div>
      <NavBar onBack={onBack} onNext={onNext} nextLabel={lang === 'ru' ? 'Далее' : 'Davom'} nextDisabled={!verdict} />
    </VideoStage>
  );
}
```

### Spinner CSS (only allowed CSS exception)

```jsx
if (typeof document !== 'undefined' && !document.getElementById('lesson-spin-kf')) {
  const s = document.createElement('style');
  s.id = 'lesson-spin-kf';
  s.textContent = '@keyframes lesson-spin{to{transform:rotate(360deg)}}.spin{animation:lesson-spin 1s linear infinite;display:inline-block;}';
  document.head.appendChild(s);
}
```

---

## Answer storage (mandatory)

Answers live in the main lesson's `useState({})`; thread `storedAnswer = answers[screenIdx]`
into each screen and initialize local state from it so back-navigation restores the view.
The hook screen records `{ picked, type: 'hook' }` (no `correct`). Never write
`localStorage`/`sessionStorage`/context. Don't fire `onAnswer` twice per visit (except an
explicit NumInput retry). The result screen reads `answers` and lists every wrong scored
answer (question + student pick + correct answer); that mistakes list is the only block
allowed to scroll.

---

## `studentName` — visible only, never in audio

Visible in ≥3 places: hook title, a mid-lesson kicker, the result hero. Audio is always
generic ("Salom, do'st!"). All `audio`/`audio_q`/`audio_fb_*` fields are static strings, never
functions of the name. Resolve the fallback once: `const displayName = studentName || (lang === 'ru' ? 'Ученик' : "O'quvchi")` and use it only in visible JSX.

---

## `onFinished` payload

The result screen does two separate things: it calls `completeLesson()` once on mount (see
`useNextLessonAccess()`), and it calls `onFinished(payload)` once when the student presses
Continue. One never replaces the other.

```js
const handleFinish = () => {
  const scoredIdxs = [4, 6, 8, 10, 11, 12, 13]; // the indexes that count toward the score
  const correct = scoredIdxs.filter((i) => answers[i]?.correct === true).length; // AI failures (null) don't count
  const total = scoredIdxs.length;
  const passed = correct >= total * 0.6;
  onFinished?.({
    lessonId: LESSON_ID,
    lessonTitle: lang === 'ru' ? '[Russian title]' : '[Uzbek title]',
    durationSec: Math.floor((Date.now() - startTime.current) / 1000),
    totalQuestions: total,
    correctAnswers: correct,
    scorePercent: Math.round((correct / total) * 100),
    passed,
    answers: Object.entries(answers).map(([idx, a]) => ({ /* questionIndex, type, question, correct, … */ })),
  });
};
```

---

## Quality bar

- Single self-contained `.jsx`, ~900–1800 lines.
- Every string in both `uz` and `ru`.
- Narration via `useAudio` on every screen; **every audio string opens with the host marker** (`[O'zbekcha tallaffuz]` / `[Русское произношение]`); natural sentences, no symbols; 0–2 ElevenLabs tags/segment.
- SFX via `useSfx()` on scored answers only (never hook/info screens).
- Hook screen first with a concrete scenario; per-option wrong feedback on every MC.
- 1–2 AI screens max via `useGrader()`; pick `mode: 'text'` or `'voice'` per screen; never the final test.
- `storedAnswer` persistence; every screen fits 100vh (only the result mistakes list may scroll).
- Responsive padding `100px` desktop / `12px` mobile via `useIsMobile`; works at 360px.
- Inline styles only (one exception: the spinner keyframes); only colors from `C`.

## Anti-patterns (do not do)

- ❌ Don't add endpoint/token/asset props to the lesson — use the `@lesson/runtime` hooks.
- ❌ Don't build an audio engine, `buildTtsUrl`, `gradeAnswer`, or `resolveAssetUrl` yourself — import the hooks.
- ❌ Don't `fetch()` anything — `useGrader()` is the only network call, and the engine drives `<audio>`.
- ❌ Don't use `window.speechSynthesis`.
- ❌ Don't include `studentName` in any audio / question / rubric / feedback text.
- ❌ Don't write `%`, `/`, `²`, `+`, `=`, `×` in audio (brackets `[...]` are allowed — tags/markers).
- ❌ Don't omit the leading host-language marker — every audio string must start with `[O'zbekcha tallaffuz]` (uz) or `[Русское произношение]` (ru), or ElevenLabs v3 mispronounces the base language.
- ❌ Don't over-tag audio (0–2/segment) or open the hook with `[laughs]`; don't invent new tags.
- ❌ Don't use generic "Incorrect" — write per-option `wrong_N` feedback.
- ❌ Don't render both text and voice in one AI screen; don't make an AI screen the final test; don't block on AI failure (record `correct: null`).
- ❌ Don't fire SFX on hook/info screens.
- ❌ Don't hardcode a media URL in JSX — go through `useAssets()` / `resolveUrl`. SVG is for diagrams you draw yourself.
- ❌ Don't `localStorage`/`sessionStorage`/cookies; keep answers in the main `useState`.
- ❌ Don't use `minHeight: '100vh'` (use `height: '100vh'`) or let a screen scroll (except the result mistakes list).
- ❌ Don't use Tailwind/CSS classes/`<style>` (except the spinner keyframes) or colors outside `C`.
- ❌ Don't import any library not in the imports list; don't use TypeScript syntax.
- ❌ Don't call `onFinished` more than once or before the student finishes.
- ❌ Don't call `completeLesson()` outside the final result screen, in a render body, or more
  than once per lesson.
- ❌ Don't treat `null` / `{}` / a missing field as an error, and don't render an empty
  "+undefined" block.
- ❌ Don't gate the Continue button, the score, or navigation on the `completeLesson()` result.
- ❌ Don't replace `onFinished(payload)` with `completeLesson()` — the lesson still calls
  `onFinished` exactly once.
- ❌ Don't put `coins` / `points` / any per-student value into an audio string.

## Output

Reply with **only the complete `.jsx` file content** — no prose before or after. Start with
the imports, end with the closing `}` of the default export. It must compile cleanly with
Babel-standalone + `@babel/preset-react`.

