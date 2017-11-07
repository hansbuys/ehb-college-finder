import * as mocha from "mocha";
import * as chai from "chai";
import chaiHttp = require("chai-http");

import mock = require("mock-require");
mock("../src/service/collegeScorecard", "./fakes/collegeScorecard");

import app from "../src/App";

chai.use(chaiHttp);
const expect = chai.expect;

describe("GET /find/by-state/:state", () => {

  it("result should be json", (done) => {
    chai.request(app)
      .get("/find/by-state/Michigan")
      .end((err, res) => {
        expect(res.type).to.eql("application/json");
        done();
      });
  });

  const states = [
    { name: "Michigan", isAccepted: true },
    { name: "MI", isAccepted: true },
    { name: "New York", isAccepted: true },
    { name: "District Of Columbia", isAccepted: true },
    { name: "Richigan", isAccepted: false },
    { name: "Belgium", isAccepted: false }
  ];
  states.forEach((state) => {
    const should = state.isAccepted ?
      "return status 200" :
      "return status 500 with error message";

    it(`state parameter "${state.name}" should ${should}`, (done) => {
      chai.request(app)
        .get(`/find/by-state/${state.name}`)
        .end((err, res) => {
          if (state.isAccepted) {
            expect(res).to.have.status(200);
            done();
          } else {
            expect(err).to.have.status(500);
            expect(err.response.text).to.contain(`${state.name} is not a recognized US State identifier.`);
            done();
          }
        });
    });
  });

  it("can get results based on location", (done) => {
    chai.request(app)
      .get("/find/by-state/Michigan")
      .end((err, res) => {
        expect(res.body).to.be.an("array");
        expect(res.body[0]).to.have.property("name");
        expect(res.body[0].name).to.eql("School in MI");
        done();
      });
  });

});
