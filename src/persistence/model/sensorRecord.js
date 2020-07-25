import dynamo from 'dynamodb'
import sensorRecordSchema from '../schema/sensorRecord'

const defineSensorRecordTable = () => {
  return dynamo.define('SENSOR_RECORD', sensorRecordSchema.table)
} 

module.exports = {
  defineSensorRecordTable
}