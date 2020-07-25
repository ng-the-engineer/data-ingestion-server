import koaRouter from 'koa-router'
import logger from 'koa-logger'
import datetimeUtil from '../utils/datetime'
import numericUtil from '../utils/numeric'
import config from '../config'
import saveSensorRecordService from '../services/saveSensorRecord'
import getSensorRecordService from '../services/getSensorRecord'

const router = koaRouter()

router.get('/data', async (ctx) => {
  const request = ctx.query
  ctx.assert(request.sensorId, 422, queryParamMessage('sensorId'))
  ctx.assert(request.since, 422, queryParamMessage('since'))
  ctx.assert(request.until, 422, queryParamMessage('until'))
  ctx.assert(datetimeUtil.validateUTC(request.since), 422, utcFormatMessage('Query', 'since'))
  ctx.assert(datetimeUtil.validateUTC(request.until), 422, utcFormatMessage('Query', 'until'))
  ctx.assert(datetimeUtil.validateSequence(request.since, request.until), 422, sequenceMessage('since', 'until'))

  const records = await getSensorRecordService.getRecords(request.sensorId, request.since, request.until)

  ctx.body = records
})

router.put('/data', async (ctx) => {
  const body = ctx.request.body
  ctx.assert(body.sensorId, 400, bodyParamMessage('sensorId'))
  ctx.assert(body.time, 400, bodyParamMessage('time'))
  ctx.assert(body.value, 400, bodyParamMessage('value'))
  ctx.assert(datetimeUtil.validateUTC(body.time), 422, utcFormatMessage('Body', 'time'))
  ctx.assert(numericUtil.validateValue(body.value), 422, valueFormatMessage('value'))

  const record = await saveSensorRecordService.saveRecord(body.sensorId, body.time, body.value)

  ctx.body = record
})

const queryParamMessage = (property) => {
  return `Query parameter "${property}" is mandatory`
}

const bodyParamMessage = (property) => {
  return `Body parameter "${property}" is mandatory`
}

const utcFormatMessage = (type, property) => {
  return `Query parameter "${property}" should be in UTC format ${config.format.utc}`
}

const sequenceMessage = (property1, property2) => {
  return `Query parameter "${property1}" must be earlier than "${property2}"`
}

const valueFormatMessage = (property) => {
  return `Body parameter "${property}" should be between -9007199254740991 and 9007199254740991`
}

module.exports = router