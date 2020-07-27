import chai, {expect} from 'chai';
import saveSensorRecordService from './saveSensorRecord';
import moment from 'moment';
import chaiAsPromised from 'chai-as-promised';
import config from '../config';

chai.use(chaiAsPromised);

describe('Service - saveSensorRecord', () => {
  it('should save the record successfully is sensorId, time, value is valid', async () => {
    const sensorId = '123';
    const time = moment().format(config.format.utc);
    const value = 1000;
    const actual = await saveSensorRecordService.saveRecord(sensorId, time, value);
    expect(actual).to.be.an('object');
    expect(actual.status).to.equal('RECORD_SAVED');
    expect(actual.record.attrs).to.be.an('object');
    expect(actual.record.attrs).to.have.key('value', 'time', 'sensorId');
  });

  it('should fail to save if the record is duplicated (identical sensorId and time)', async () => {
    const sensorId = '0001';
    const time = moment().format(config.format.utc);
    const value = 567.68;
    const actual = await saveSensorRecordService.saveRecord(sensorId, time, value);
    expect(actual).to.be.an('object');
    expect(actual.status).to.equal('RECORD_SAVED');
    expect(actual.record.attrs).to.be.an('object');
    expect(actual.record.attrs).to.have.key('value', 'time', 'sensorId');

    return expect(saveSensorRecordService.saveRecord(sensorId, time, value)).to.be.rejectedWith('The conditional request failed');
  });
});
