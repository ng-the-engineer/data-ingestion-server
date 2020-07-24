import chai from 'chai'
import chaiHttp from 'chai-http'
import app from '../app'
import config from '../config'
import { isMainThread } from 'worker_threads'
import { doesNotMatch } from 'assert'

const { expect } = chai

chai.use(chaiHttp)

describe('API Test', () => {
  describe('PUT /data', () => {
    it('should return status 204 if the input is valid', (done) => {
      const reqBody = {
        sensorId: '001',
        time: '2020-07-30:12:30:00:000',
        value: 123.45
      }

      chai.request(`${config.local.host}:${config.local.port}`)
        .put('/data')
        .send(reqBody)
        .end((err, res) => {
          if (err) done(err)
          expect(res).to.have.status(204)
          done()
        })
    })

    it('should return 400 if it does not contain sensorId', (done) => {
      const reqBody = {
        time: '2020-07-30:12:30:00:000',
        value: 123.45
      }

      chai.request(`${config.local.host}:${config.local.port}`)
        .put('/data')
        .send(reqBody)
        .end((err, res) => {
          if (err) done(err)
          expect(res).to.have.status(400)
          done()
        })      
    })

    it('should return 400 if it does not contain time', (done) => {
      const reqBody = {
        sensorId: '001',
        value: 123.45
      }

      chai.request(`${config.local.host}:${config.local.port}`)
        .put('/data')
        .send(reqBody)
        .end((err, res) => {
          if (err) done(err)
          expect(res).to.have.status(400)
          done()
        })      
    })

    it('should return 409 if data is duplicated', (done) => {
      const reqBody = {
        sensorId: '001',
        time: '2020-07-30:12:30:00:000',
        value: 123.45
      }

      chai.request(`${config.local.host}:${config.local.port}`)
        .put('/data')
        .send(reqBody)
        .end((err, res) => {
          if (err) done(err)
          expect(res).to.have.status(200)
          done()
        })
      
      chai.request(`${config.local.host}:${config.local.port}`)
        .put('/data')
        .send(reqBody)
        .end((err, res) => {
          if (err) done(err)
          expect(res).to.have.status(409)
          done()
        })
    })
  })
})