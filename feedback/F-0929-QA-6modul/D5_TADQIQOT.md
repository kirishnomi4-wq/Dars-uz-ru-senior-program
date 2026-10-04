# Lesson-screen research: W3Schools, Brilliant, Khan Academy, Codecademy

**Honesty note.** WebFetch returned usable data only for the W3Schools tutorial page and the Codecademy curriculum docs. The Brilliant and Khan lesson pages are login-gated or JS-rendered, so I could not open an actual lesson. Brilliant and Khan items marked (S) rest on search snippets. Items marked (K) are from my prior knowledge and are NOT verified. Colour counts and words-per-screen figures are estimates.

URLs opened (fetched):
- https://www.w3schools.com/js/js_if_else.asp
- https://curriculum-documentation.codecademy.com/exercises/le-layouts/code-editor-layout/
- https://ncce.org/?p=315


## 1. W3Schools (verified: js_if_else page)
1. **Anatomy.** Left sidebar holds the topic tree. The main column runs: title, Previous/Next at the top, short prose, code block, "Try it Yourself" button, next block, Previous/Next at the bottom. This is a scroll page, not a screen-by-screen flow. (K) Try-it opens a two-pane page: code left, result right, green "Run" above.
2. **Buttons.** Two levels. "Try it Yourself" is the teal primary button; Previous/Next are secondary. Next sits at the top and the bottom of the page.
3. **Colour.** A teal brand colour plus greys, with a light-grey code background. No emoji in content. Ads and promo banners add noise, which we should not copy.
4. **Interactivity.** The learner edits the example in a new window and presses Run. The result pane updates. Nothing happens on the tutorial page itself.
5. **Density.** About 200-250 words per page, 15-40 words per paragraph, with one code example every few lines.
6. **Borrow:** the pairing "one idea, then a runnable example, then Try" maps to Tushuncha-tajriba and Kod. **Avoid:** the Try-it as a separate window and the long scroll page. We need the action inside the same screen.

## 2. Brilliant (mostly S and K; no lesson page opened)
1. **Anatomy.** (S/K) One short prompt or question on top, one interactive widget in the centre (slider, drag, tap-to-select), and a single bottom button. Lessons are bite-sized, about 15 min a day. (K) A progress bar sits at the top and the screen has no sidebar.
2. **Buttons.** (K) Effectively one level: a big "Continue" or "Check" at the bottom. It is disabled until the learner acts.
3. **Colour.** (K) Dark or light neutral background, one accent colour, and a second colour only for correct or wrong. Visuals are diagrams, not emoji.
4. **Interactivity.** (S) "Try to find a solution before learning the procedure". (K) The learner drags a slider or moves a point, and the diagram or number changes live. Explanation text appears only after the attempt.
5. **Density.** (K) 20-40 words per screen, about 1-2 sentences.
6. **Borrow:** the interaction first, explanation after, with Continue locked until the learner acts. This is Tushuncha-tajriba. **Avoid:** a purely math-style abstract widget with no concrete story. Our learners need the one running example (misol-ip).

## 3. Khan Academy, computing (S; page not retrievable)
1. **Anatomy.** (S) Editor on the left, live output on the right. Code runs on every change. (K) Under the editor sit the "Restart" control and a guide or hints area. Lessons alternate video, article, and exercise.
2. **Buttons.** (K) Few buttons because the code runs live. Exercises have one green primary "Check" and a hint link.
3. **Colour.** (K) White background, one brand teal-green, and blue for links.
4. **Interactivity.** (S) The learner edits a number, or drags a pop-up slider on a number, and the picture on the right changes at once. Errors are highlighted inline.
5. **Density.** (K) Short article steps, about 50-120 words, and videos for explanation.
6. **Borrow:** live output with no Run button, and a number-scrubber that changes the picture. This is Tushuncha-tajriba. **Avoid:** Khan's video-first flow. It is slow to produce and passive.

## 4. Codecademy (verified: official curriculum docs)
1. **Anatomy.** The Learning Environment has 2-5 panes. The first is always the "Narration" pane on the left, with an intro, then **Checkpoints** (a numbered list of steps), then resources. Next comes the Code Editor (tabs for files), then Output, Terminal, or Browser. Each exercise is a single screen.
2. **Buttons.** Run is the main button, and it is replaced by "Check Work" in terminal mode. Autosave mode has no Run button. Next appears after the checkpoints are done. This is about two levels.
3. **Colour.** (K) A dark editor, a light narration pane, and a yellow accent. Checkpoint ticks turn green. (K) Few icons; no emoji.
4. **Interactivity.** Code is auto-checked. A correct submission ticks the checkpoint, and an error message says what went wrong.
5. **Density.** (K) About 60-120 words of narration, plus 2-4 checkpoints of one line each.
6. **Borrow:** the narration pane with numbered checkpoints that tick off automatically. This is Kod. **Avoid:** 3-5 panes on one screen. On a phone and for 13-year-olds it overloads.

## Pattern table

| Pattern | Our screen type | Rule |
|---|---|---|
| One idea per screen, 20-60 words | Kirish, all | Max 60 words and one heading per screen. |
| Interaction before explanation | Tushuncha-tajriba | The learner acts first; the explanation appears after the first action. |
| Continue locked until action | Tushuncha-tajriba | The primary button is disabled until the learner does the required action. |
| Live visual change from a control | Tushuncha-tajriba | A slider or toggle changes the picture or number immediately, with no extra "show" button. |
| Single primary button, bottom | All 7 types | One filled primary button in a fixed spot; everything else is secondary or a text link. |
| Narration plus numbered checkpoints | Kod | Task on the left with 2-4 one-line steps that tick off automatically; editor on the right. |
| Auto-check with an error that says what is wrong | Kod, Test | The error message names the problem; it never says only "wrong". |
| One brand colour plus green/red for correct/wrong | All | Max 1 accent colour plus the two feedback colours; no emoji as decoration. |
