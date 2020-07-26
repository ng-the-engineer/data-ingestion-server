const local = {
  host: 'localhost',
  port: 8080,
}

const format = {
  utc: 'YYYY-MM-DDTHH:mm:ss.sssZ'
}

const thresholds = [
  {
    threshold: 200,
    event: 'LEVEL_ONE_ALERT'
  }, {
    threshold: 100,
    event: 'LEVEL_TWO_ALERT'
  }
]

module.exports = {
  local,
  format,
  thresholds
}