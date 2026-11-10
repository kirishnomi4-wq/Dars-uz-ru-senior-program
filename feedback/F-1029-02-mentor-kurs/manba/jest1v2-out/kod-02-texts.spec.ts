import { som } from './texts';

describe('som', () => {
  it("120000 ni so'mda yozadi", () => {
    expect(som(120000)).toBe("120 000 so'm");
  });
});
