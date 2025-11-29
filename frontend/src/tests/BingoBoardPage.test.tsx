/*import {checkBingo} from '../pages/BingoBoardPage';

// size checks
const lowNumberSet = new Set<number>([1, 2, 3, 4]);
const highNumberSet = new Set<number>([0, 1, 2, 3, 4, 5]);

test('checks false for bingo < 5', () => {
  expect(checkBingo(lowNumberSet)).toBe(false);
});

test('checks false for bingo > 5', () => {
  expect(checkBingo(highNumberSet)).toBe(false);
});


// valid index checks
let rowSet: Set<number> = new Set<number>([0, 1, 2, 3, 4]);
let colSet: Set<number> = new Set<number>([0, 5, 10, 15, 20]);
let diagSet: Set<number> = new Set<number>([0, 6, 12, 18, 24]);

test('checks valid row', () => {
  expect(checkBingo(rowSet)).toBe(true);
});

test('checks valid col', () => {
  expect(checkBingo(colSet)).toBe(true);
});

test('checks valid diag', () => {
  expect(checkBingo(diagSet)).toBe(true);
});

// invalid index checks
let rowSetBad: Set<number> = new Set<number>([0, 1, 2, 3, 8]);
let colSetBad: Set<number> = new Set<number>([0, 5, 10, 15, 22]);
let diagSetBad: Set<number> = new Set<number>([0, 6, 10, 18, 24]);

test('checks invalid row', () => {
  expect(checkBingo(rowSetBad)).toBe(false);
});

test('checks invalid col', () => {
  expect(checkBingo(colSetBad)).toBe(false);
});

test('checks invalid diag', () => {
  expect(checkBingo(diagSetBad)).toBe(false);
});
*/
