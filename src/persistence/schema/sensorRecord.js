import dynamo from 'dynamodb';
import Joi from 'joi';

const table = {
  hashKey: 'sensorId',
  rangeKey: 'time',
  schema: {
    id: dynamo.types.uuid(),
    sensorId: Joi.string(),
    time: Joi.date().timestamp(),
    value: Joi.number(),
  },
};

module.exports = {
  table,
};
