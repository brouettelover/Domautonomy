const request = require('supertest')
const app = require('./app')

describe("Serveur HTTPS", () => {
  test("GET Login Page", function (done) {
    request(app)
      .get('/')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) throw err;
        done()
        })
  })
  test("GET Register Page", function (done) {
    request(app)
      .get('/')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) throw err;
        done()
      })
  })
  test("GET Lost Page", function (done) {
    request(app)
      .get('/')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) throw err;
        done()
      })
  })
  test("GET Dashboard Page", function (done) {
    request(app)
      .get('/')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) throw err;
        done()
      })
  })  
})
