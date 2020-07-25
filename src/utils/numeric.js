import validate from 'validate.js'

const validateValue = (value) => {
  if (value > Number.MAX_SAFE_INTEGER || value < Number.MIN_SAFE_INTEGER)
    return false
  else
    return validate.isNumber(value)
}

module.exports = {
  validateValue
}