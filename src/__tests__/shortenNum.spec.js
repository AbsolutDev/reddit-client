import shortenNum from '../utils/shortenNum.js';
//const {shortenNum} = require('../utils/shortenNum.js');

test('Numbers under 1,000 should not change', () => {
  let input = 900;
  let expectedOutput = 900;
  let actualOutput = shortenNum(input);
  expect(actualOutput).toBe(expectedOutput);

  input = 999;
  expectedOutput = 999;
  actualOutput = shortenNum(input);
  expect(actualOutput).toBe(expectedOutput);
})

test('Numbers under 9,951 should be shortened to #.#k', () => {
  let input = 9000;
  let expectedOutput = '9.0k';
  let actualOutput = shortenNum(input);
  expect(actualOutput).toBe(expectedOutput);

  input = 9100;
  expectedOutput = '9.1k';
  actualOutput = shortenNum(input);
  expect(actualOutput).toBe(expectedOutput);

  input = 8900;
  expectedOutput = '8.9k';
  actualOutput = shortenNum(input);
  expect(actualOutput).toBe(expectedOutput);

  input = 9950;
  expectedOutput = '9.9k';
  actualOutput = shortenNum(input);
  expect(actualOutput).toBe(expectedOutput);
})

test('Numbers 9,951 - 999,499 should be shortened to ##k', () => {
  let input = 9951;
  let expectedOutput = '10k';
  let actualOutput = shortenNum(input);
  expect(actualOutput).toBe(expectedOutput);

  input = 100000;
  expectedOutput = '100k';
  actualOutput = shortenNum(input);
  expect(actualOutput).toBe(expectedOutput);

  input = 120000;
  expectedOutput = '120k';
  actualOutput = shortenNum(input);
  expect(actualOutput).toBe(expectedOutput);

  input = 129000;
  expectedOutput = '129k';
  actualOutput = shortenNum(input);
  expect(actualOutput).toBe(expectedOutput);

  input = 999499;
  expectedOutput = '999k';
  actualOutput = shortenNum(input);
  expect(actualOutput).toBe(expectedOutput);
})

test('Numbers 999,500 - 999,499,999 should be shortened to ###M', () => {
  let input = 999500;
  let expectedOutput = '1M';
  let actualOutput = shortenNum(input);
  expect(actualOutput).toBe(expectedOutput);

  input = 1999500;
  expectedOutput = '2M';
  actualOutput = shortenNum(input);
  expect(actualOutput).toBe(expectedOutput);

  input = 999499999;
  expectedOutput = '999M';
  actualOutput = shortenNum(input);
  expect(actualOutput).toBe(expectedOutput);
});

test('Numbers 999,500,000 should be shortened to ###.#B', () => {
  let input = 999500000;
  let expectedOutput = '1.0B';
  let actualOutput = shortenNum(input);
  expect(actualOutput).toBe(expectedOutput);

  input = 5600000000;
  expectedOutput = '5.6B';
  actualOutput = shortenNum(input);
  expect(actualOutput).toBe(expectedOutput);
});