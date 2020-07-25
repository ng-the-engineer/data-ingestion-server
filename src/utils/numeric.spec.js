import { expect } from 'chai'
import forEach from 'mocha-each'
import numericUtil from './numeric'

describe ('Utils - numeric unit tests', () => {
  describe('validateValue', () => {
    const testData = [
      [true, 100],
      [true, -999],
      [true, 657.0336454],
      [true, -362326363.762652363],
      [true, 9007199254740991],
      [false, 9007199254740992],
      [true, -9007199254740991],
      [false, -9007199254740992]
    ]

    forEach(testData)
    .it('return %s if value is %d', (expected, value) => {
      const actual = numericUtil.validateValue(value)
      expect(actual).to.equal(expected)
    })

    const errorData = [
      [false, 'abc'],
      [false, '233.9'],
      [false, '-455']
    ]

    forEach(errorData)
    .it('return %s if value is %s', (expected, value) => {
      const actual = numericUtil.validateValue(value)
      expect(actual).to.equal(expected)
    })
  })
})