import chai from "chai"
import chaiEvents from 'chai-events'
import EventEmitter from "events"

chai.use(chaiEvents)
const should = chai.should()
let emitter = null
 
describe('Events - thresholdAlerts', () => {

  beforeEach( () => {
    emitter = new EventEmitter()
  })
 
  it('should receive LEVEL_ONE_ALERT event', () => {
    const predicate = emitter.should.emit('LEVEL_ONE_ALERT')

    setTimeout(() => {
      emitter.emit('LEVEL_ONE_ALERT')
    }, 300)

    return predicate
  })
 
  it('should not respond to non defined alert', () => {
    emitter.should.not.emit('NON_DEFINED_ALERT')
  })
 
  it('should not respond to non defined alert', () => {
    emitter.should.not.emit('NON_DEFINED_ALERT', { timeout: 500 })
  })
})