import dynamo from 'dynamodb'
import sensorRecordThroughput from '../throughput/sensorRecord'
import sensorRecordModel from '../model/sensorRecord'

dynamo.AWS.config.update({
  region: 'local',
  endpoint: 'http://localhost:9001',
})

const sensorRecord = sensorRecordModel.defineSensorRecordTable()

let throughput = {}
throughput['SENSOR_RECORD'] = sensorRecordThroughput.capacity

dynamo.deleteTable(throughput, (err) => {
  if (err)
    console.log('Error while deleting table', err)

  console.log('Table is deleted successfully')
})