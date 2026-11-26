import { isPhone } from './phone';

describe('isPhone', () => {
  it.each([
    ['to\'g\'ri raqam (+ bilan)', '+998901234567', true],
    ['to\'g\'ri raqam (+ siz)', '998901234567', true],
    ['eng qisqa to\'g\'ri: 9 raqam', '123456789', true],
    ['eng uzun to\'g\'ri: 13 raqam', '+1234567890123', true],
    ['bittaga qisqa: 8 raqam', '12345678', false],
    ['bittaga uzun: 14 raqam', '+12345678901234', false],
    ['harf bor', '99890123abc', false],
    ['bo\'sh satr', '', false],
    ['probel bilan yozilgan raqam', '90 123 45 67', false],
  ])('%s — %s → %s', (_label, input, expected) => {
    expect(isPhone(input)).toBe(expected);
  });
});
