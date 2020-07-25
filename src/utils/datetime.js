import moment from 'moment'
import config from '../config'

const validateUTC = (input => {
  return moment(input, config.format.utc, true).isValid()
})

const validateSequence = ((since, until) => {
  if (validateUTC(since) && validateUTC(until)) {
    return moment(since).isBefore(moment(until))
  }
  throw new Error('Not valid UTC format')    
})

module.exports = {
  validateUTC,
  validateSequence
}