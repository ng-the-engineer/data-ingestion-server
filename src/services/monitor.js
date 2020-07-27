import config from '../config';
import eventEmitter from '../events/thresholdAlerts';

const getAlertLevel = (reading) => {
  const alert = config.thresholds.find((t) => reading > t.threshold);
  return (alert ? alert.event : null);
};

const inspect = (reading) => {
  const alert = getAlertLevel(reading);
  if (alert) {
    eventEmitter.emit(alert, reading);
  }
};

module.exports = {
  getAlertLevel,
  inspect,
};
