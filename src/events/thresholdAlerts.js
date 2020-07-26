import events from 'events'

const eventEmitter = new events.EventEmitter()

const levelOneAlertHandler = (reading) => {
  console.info('Level One Alert!', reading)
  // To-do: send email or sms
}

const levelTwoAlertHandler = (reading) => {
  console.info('Level Two Alert', reading)
  // To-do: send email or sms
}

eventEmitter.on('LEVEL_ONE_ALERT', levelOneAlertHandler)
eventEmitter.on('LEVEL_TWO_ALERT', levelTwoAlertHandler)

module.exports = eventEmitter
