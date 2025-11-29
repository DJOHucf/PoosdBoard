const utils = require('../utils.js');

test('check generateGameString string is 6 digits', () => {
  expect(generateGameString().length).toBe(6);
});


describe('getRandomInteger properties', () => {
  const randomNumberTest = getRandomInteger(1, 10);
  it('should return a number less than 11', () => {
    expect(randomNumberTest).toBeLessThan(11);
  });
  it('should return a number greater than 0', () => {
    expect(randomNumberTest).toBeGreaterThan(0);
  });
});