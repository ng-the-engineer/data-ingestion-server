import chai from 'chai'
import chaiHttp from 'chai-http'
import app from '../app'
import config from '../config'
import { isMainThread } from 'worker_threads'
import { doesNotMatch } from 'assert'

const { expect } = chai

chai.use(chaiHttp)

describe('API Test', () => {
  describe('GET /data', () => {
    it('should return an array of sensor data', (done) => {
      const sensorId = 'fhfh'
      const since = '2020-07-30T14:20:00.888Z'
      const until = '2020-07-30T14:30:00.888Z'

      chai.request(`${config.local.host}:${config.local.port}`)
        .get(`/data?sensorId=${sensorId}&since=${since}&until=${until}`)
        .end((err, res) => {
          if (err) {
            console.log('Error occur: ', err)
            done(err)
          }
          expect(res).to.have.status(200)
          expect(res).to.be.an('object')
          done()
        })
    })

    it('should return 422 if sensorId is missing', (done) => {
      const since = '2020-07-30:12:30:00:000'
      const until = '2020-07-30:12:40:00:000'

      chai.request(`${config.local.host}:${config.local.port}`)
      .get(`/data?since=${since}&until=${until}`)
      .end((err, res) => {
        if (err) {
          console.log('Error occur: ', err)
          done(err)
        }
        expect(res).to.have.status(422)
        expect(res).to.be.an('object')
        done()
      })
    })

    it('should return 422 if since is missing', (done) => {
      const sensorId = '123'
      const until = '2020-07-30:12:40:00:000'

      chai.request(`${config.local.host}:${config.local.port}`)
      .get(`/data?sensorId=${sensorId}&until=${until}`)
      .end((err, res) => {
        if (err) {
          console.log('Error occur: ', err)
          done(err)
        }
        expect(res).to.have.status(422)
        expect(res).to.be.an('object')
        done()
      })
    })

    it('should return 422 if until is missing', (done) => {
      const sensorId = '123'
      const since = '2020-07-30:12:30:00:000'

      chai.request(`${config.local.host}:${config.local.port}`)
      .get(`/data?sensorId=${sensorId}&since=${since}`)
      .end((err, res) => {
        if (err) {
          console.log('Error occur: ', err)
          done(err)
        }
        expect(res).to.have.status(422)
        expect(res).to.be.an('object')
        done()
      })
    })

  })
})