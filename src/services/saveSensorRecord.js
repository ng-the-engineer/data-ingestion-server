import dynamo from 'dynamodb';
import sensorRecordModel from '../persistence/model/sensorRecord';
import monitorService from './monitor';

dynamo.AWS.config.update({
  region: 'local',
  endpoint: 'http://localhost:9001',
});

const sensorRecord = sensorRecordModel.defineSensorRecordTable();

const saveRecord = (sensorId, time, value) => {
  monitorService.inspect(value);

  const record = {
    sensorId,
    time,
    value,
  };
  return new Promise((resolve, reject) => {
    const params = {};
    params.ConditionExpression = '#time <> :time AND #sensorId <>  :sensorId';
    params.ExpressionAttributeNames = {'#time': 'time', '#sensorId': 'sensorId'};
    params.ExpressionAttributeValues = {':time': time, ':sensorId': sensorId};

    sensorRecord.update(record, params, (err, record) => {
      if (err) {
        return reject({
          'status': 'FAIL_TO_SAVE',
          'message': err.message,
        });
      }

      // console.log('Save record in database', record.attrs.time)
      return resolve({
        'status': 'RECORD_SAVED',
        'record': record,
      });
    });
  });
};

module.exports = {
  saveRecord,
};
