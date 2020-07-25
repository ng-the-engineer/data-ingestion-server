import dynamo from 'dynamodb'
import sensorRecordModel from '../persistence/model/sensorRecord'

dynamo.AWS.config.update({
  region: 'local',
  endpoint: 'http://localhost:9001',
})

let sensorRecord = sensorRecordModel.defineSensorRecordTable()

const getRecords = (sensorId, since, until) => {
  return new Promise((resolve, reject) => {
    sensorRecord
      .query(sensorId)
      .where('time').between(since, until)
      .attributes([
        'sensorId',
        'time',
        'value'
      ])
      .loadAll()
      .exec((err, record) => {
        if (err) {
          console.log('Get record error', err)
          return reject(err)
        }

        return resolve({
          records: record.Items,
          recordCount: record.Items.length
        })
      })
  })
}

module.exports = {
  getRecords
}