import * as mocha from 'mocha'
import * as chai from 'chai'
import chaiHttp = require('chai-http')
import app from '../src/App'

chai.use(chaiHttp)
const expect = chai.expect

describe('GET /find/by-state/:state', () => {

  it('result should be json', (done) => {
    chai.request(app)
      .get('/find/by-state/Michigan')
      .end((err, res) => {
        expect(res.type).to.eql('application/json');
        done()
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
    it(`state parameter '${state.name}' should ${whenAccepted} be accepted`, (done) => {
      chai.request(app)
        .get(`/find/by-state/${state.name}`)
        .end((err, res) => {
          if (state.isAccepted) {
            expect(res).to.have.status(200)
            expect(res.body.message).to.eql(`Hello ${state.name}!`)
            done()
          } else {
            expect(err).to.have.status(500)
            expect(err.response.text).to.contain(`${state.name} is not a US State.`)
            done()
          }
        })
    })
  })

})