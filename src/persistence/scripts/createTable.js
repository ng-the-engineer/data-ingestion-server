import dynamo from 'dynamodb';
import sensorRecordThroughput from '../throughput/sensorRecord';
import sensorRecordModel from '../model/sensorRecord';

dynamo.AWS.config.update({
  region: 'local',
  endpoint: 'http://localhost:9001',
});

sensorRecordModel.defineSensorRecordTable();

const throughput = {};
throughput['SENSOR_RECORD'] = sensorRecordThroughput.capacity;

dynamo.createTables(throughput, (err) => {
  if (err) {
    console.log('Error while creating table', err);
  }

  console.log('Table is created successfully');
});
