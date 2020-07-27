import chai, {expect} from 'chai';
import getSensorRecordService from './getSensorRecord';
import saveSensorRecordService from './saveSensorRecord';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);

/**
 * Get random Int
 * @param {number} max The maximum of the generated random number.
 * @return {number} The generated random number
 */
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

describe('Service - getSensorRecord', () => {
  it('should get records successfully', async () => {
    const sensorId = getRandomInt(10000000).toString();
    const time = '2020-07-20T01:00:00.000Z';
    const since = '2020-07-20T00:59:00.000Z';
    const until = '2020-07-20T:01:59:59.999Z';

    const saveResult = await saveSensorRecordService.saveRecord(sensorId, time, 789.88);
    expect(saveResult).to.be.an('object');
    expect(saveResult.status).to.equal('RECORD_SAVED');
    expect(saveResult.record.attrs).to.be.an('object');
    expect(saveResult.record.attrs).to.have.key('value', 'time', 'sensorId');

    const actual = await getSensorRecordService.getRecords(sensorId, since, until);

    expect(actual).to.have.key('records', 'recordCount');
    expect(actual.records).to.be.an('array');
    expect(actual.recordCount).to.equal(1);
    expect(actual.records[0].attrs).to.have.key('sensorId', 'time', 'value');
  });

  it('should return zero record', async () => {
    const sensorId = 'nonExistSensorId';
    const since = '2020-07-01T00:00:00.000Z';
    const until = '2020-07-31T:23:59:59.999Z';
    const actual = await getSensorRecordService.getRecords(sensorId, since, until);

    expect(actual).to.have.key('records', 'recordCount');
    expect(actual.records).to.be.an('array');
    expect(actual.recordCount).to.equal(0);
  });
});
