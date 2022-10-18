import shortenNum from '../utils/shortenNum.js';
//const {shortenNum} = require('../utils/shortenNum.js');

test('Test shortening a 1M number', () => {
  const input = 1000000;
  const expectedOutput = '1M';

  const actualOutput = shortenNum(input);

  expect(actualOutput).toBe(expectedOutput);
})