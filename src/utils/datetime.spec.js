import { expect } from 'chai'
import forEach from 'mocha-each'
import datetimeUtil from './datetime'

describe ('Utils - datetime unit tests', () => {
  describe('validateUTC', () => {
    const testData = [
      [true, '2020-06-04T14:20:00.888Z'],
      [false, '2020-06-04'],
      [false, '2020-06-04T09:00'],
      [false, '2020-06-04 09:00:00.888Z'],
      [false, '2020-06-04T09:00:00.888'],
      [false, '2020-06-04T09:00:00:888Z'],
      [false, '2020-13-04T09:00:00.888Z'],
      [false, '2020-06-31T09:00:00.888Z'],
      [false, '2020-06-04T25:00:00.888Z'],
      [false, '2020-06-04T09:62:00.888Z'],
    ]

    forEach(testData)
    .it('return %s if input is %s', (expected, input) => {
      const actual = datetimeUtil.validateUTC(input)
      expect(actual).to.equal(expected)
    })
  })

  describe('validateSequence', () => {

    const testData = [
      [true, '2020-07-30T14:20:00.888Z', '2020-07-30T14:30:00.888Z'],
      [false, '2020-07-30T14:20:00.888Z', '2020-07-30T14:10:00.888Z'],
      [false, '2020-07-30T14:20:00.888Z', '2020-07-30T14:20:00.888Z'],
    ]

    forEach(testData)
    .it('return %s if %s is earlier than %s', (expected, since, until) => {
      const actual = datetimeUtil.validateSequence(since, until)
      expect(actual).to.equal(expected)
    })

    const testError = [
      ['Not valid UTC format', '2020-07-20', '2020-07-30T14:30:00.888Z'],
      ['Not valid UTC format', '2020-07-30T14:30:00.888Z', '2020-07-20'],
      ['Not valid UTC format', '2020-07-30', '2020-07-20'],
    ]

    forEach(testError)
    .it('return %s if since is %s and until is %s', (errorMessage, since, until) => {
      expect(() => datetimeUtil.validateSequence(since, until)).to.throw(errorMessage)
    })
  })
})