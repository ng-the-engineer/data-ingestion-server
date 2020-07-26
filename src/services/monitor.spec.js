import {expect} from 'chai';
import monitor from './monitor';
import forEach from 'mocha-each';

describe('Service - monitor', () => {
  const testData = [
    ['LEVEL_ONE_ALERT', 201],
    ['LEVEL_TWO_ALERT', 199],
    [null, 99],
  ];

  forEach(testData)
      .it('return %s if reading is %d', (expected, reading) => {
        const actual = monitor.getAlertLevel(reading);
        expect(actual).to.equal(expected);
      });
});
