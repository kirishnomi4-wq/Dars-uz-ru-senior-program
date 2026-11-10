describe('toBe va toEqual', () => {
  it('toBe', () => {
    expect([['◀', '2/3', '▶']]).toBe([['◀', '2/3', '▶']]);
  });

  it('toEqual', () => {
    expect([['◀', '2/3', '▶']]).toEqual([['◀', '2/3', '▶']]);
  });
});
