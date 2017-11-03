import * as mocha from 'mocha'
import * as chai from 'chai'
import chaiHttp = require('chai-http')
import mock = require('mock-require')

import app from '../src/App'

chai.use(chaiHttp)
const expect = chai.expect

describe('baseRoute', () => {

  it('should be json', () => {
    return chai.request(app).get('/find/by-state/Michigan')
      .then(res => {
        expect(res.type).to.eql('application/json');
      })
  })

  const states = [
    { name: "Michigan", isAccepted: true },
    { name: "MI", isAccepted: true },
    { name: "New York", isAccepted: true },
    { name: "District Of Columbia", isAccepted: true },
    { name: "Richigan", isAccepted: false },
    { name: "Belgium", isAccepted: false }
  ]
  states.forEach((state) => {
    var whenAccepted = state.isAccepted ? '' : 'not '
    it(`${state.name} is ${whenAccepted}accepted`, () => {
      return chai.request(app).get(`/find/by-state/${state.name}`)
        .then(res => {
          if (state.isAccepted) {
            expect(res).to.have.status(200)
            expect(res.body.message).to.eql(`Hello ${state.name}!`)
          } else {
            expect.fail(`${state.name} should not be an accepted US State.`)
          }
        }, (err) => {
          if (state.isAccepted) {
            expect.fail(`${state.name} should be an accepted US State.`)
          } else {
            expect(err).to.have.status(500)
            expect(err.response.text).to.contain(`${state.name} is not a US State.`)
          }
        })
    })
  })
  
})