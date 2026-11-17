// F-1112-06 / F-1117-01: kalitli amaliyot ekranlari (question_keys kind=practice) v2 tests'dan chiqariladi.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { practiceIdsFrom, markPracticeKeys } from '../../src/modules/results/v2-service.js';
import { lessonQuestions, questionOrder } from '../../src/modules/results/result-builder.js';

const ROWS = [
  { question_id: 's4', lesson_version: 'v8', kind: 'test' },
  { question_id: 's15', lesson_version: 'v8', kind: 'practice' },
  { question_id: 's15b', lesson_version: 'v8', kind: 'practice' },
  { question_id: 'quiz-0', lesson_version: 'v8', kind: 'arena' },
  // eski versiya: s7 u yerda test, yangi versiyada amaliyot; s9 faqat eski versiyada amaliyot
  { question_id: 's7', lesson_version: 'v5', kind: 'test' },
  { question_id: 's7', lesson_version: 'v7', kind: 'practice' },
  { question_id: 's9', lesson_version: 'v5', kind: 'practice' },
];

test('practiceIdsFrom: urinish versiyasi bo\'yicha; versiya noma\'lum — hamma versiyalar, lekin biror versiyada test bo\'lgan id emas', () => {
  assert.deepEqual([...practiceIdsFrom(ROWS, 'v8')].sort(), ['s15', 's15b']);
  assert.deepEqual([...practiceIdsFrom(ROWS, 'v7')].sort(), ['s7']);
  assert.deepEqual([...practiceIdsFrom(ROWS, null)].sort(), ['s15', 's15b', 's9']); // s7 — v5 da test → olinmaydi
  assert.deepEqual([...practiceIdsFrom(ROWS, 'v99')].sort(), ['s15', 's15b', 's9']); // versiyaga kalit yuklanmagan → zaxira
  assert.equal(practiceIdsFrom([], 'v8').size, 0);
});

test('markPracticeKeys: amaliyot ekrani testlar sonidan va tafsilot tartibidan chiqadi, arena va testlar o\'zgarmaydi', () => {
  const keys = [{ question_id: 's4', correct_idx: 0 }, { question_id: 's15', correct_idx: 0 }, { question_id: 's15b', correct_idx: 0 }, { question_id: 'quiz-0', correct_idx: 2 }];
  assert.deepEqual([...lessonQuestions(keys)].sort(), ['s15', 's15b', 's4']); // tuzatishsiz — 3 «test» (prod xatosi)
  const marked = markPracticeKeys(keys, practiceIdsFrom(ROWS, 'v8'));
  assert.deepEqual([...lessonQuestions(marked)], ['s4']);
  assert.deepEqual([...questionOrder(marked)], [['s4', 1], ['quiz-0', 2]]);
  assert.deepEqual(marked.find((k) => k.question_id === 'quiz-0'), { question_id: 'quiz-0', correct_idx: 2 });
  assert.equal(markPracticeKeys(keys, new Set()), keys); // amaliyot yo'q — o'sha massiv
});
