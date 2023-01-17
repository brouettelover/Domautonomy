const request = require('supertest')
const app = require('./app');
const mongoose = require("mongoose");
const User = require('./models/User');
const Module = require('./models/Module');
var params = require("./params/params");

test('PORT correct', () => {
  var port = process.env.PORT
  port = parseInt(port)
  expect(port).toEqual(3100);
});

describe("Serveur HTTP", () => {
  beforeAll( function(done){
    mongoose
    .connect(params.DATABASECONNECTION, {useUnifiedTopology:true})
    done();
  });

  test("GET/HTTP request", function (done) {
    request(app)
      .get('/api/isOn')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) throw err;
        done();
      })
  });

  test("Register/POST request", function (done){
    request(app)
      .post('/api/register')
      .send({
        'name': 'userRegister',
        'email': 'emailregister@gmail.com',
        'password': 'supermotdepasse'
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201)
      .end(function (err, res) {
        if (err) throw err;
        done();
      })
  });

  test("Login/POST request", function (done){
    request(app)
      .post('/api/login')
      .send({
        'email': 'emailregister@gmail.com',
        'password': 'supermotdepasse'
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201)
      .end(function (err, res) {
        if (err) throw err;
        done();
      })
    });

  test("Remove/POST request", function (done){
    request(app)
      .post('/api/remove')
      .send({
        'email': 'emailregister@gmail.com',
        'password': 'supermotdepasse'
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) throw err;
        done();
      })
  });

  test("Lost/PUT request", function (done){
    request(app)
      .put('/api/lost')
      .send({
        'email': 'fleondespam@mail.com',
        'name': 'lostpassworduser'
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) throw err;
        done();
      })
  });

  test("me/GET request without being logged", function (done){
    request(app)
      .get('/api/me')
      .expect('Content-Type', /json/)
      .expect(401)
      .expect({"message": "Authentification Failed"})
      .end(function (err, res) {
        if (err) throw err;
        done();
      })
  });

  
  // test("Modify/PUT request", function (done){
  //   request(app)
  //     .put('/api/lost')
  //     .send({
  //       'email': 'fleondespam@mail.com',
  //       'name': 'lostpassworduser'
  //     })
  //     .set('Content-Type', 'application/json')
  //     .set('Accept', 'application/json')
  //     .expect('Content-Type', /json/)
  //     .expect(200)
  //     .end(function (err, res) {
  //       if (err) throw err;
  //       done();
  //     })
  // });

  afterAll(function (done){
    mongoose.disconnect();
    done();
    });
})

describe("Module add", () => {
  beforeAll( function(done){
    mongoose
    .connect(params.DATABASECONNECTION, {useUnifiedTopology:true})
    done();
  });
  test("GET / Open RFID", function (done) {
    request(app)
      .get('/api/modules/frigo/open')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect({})
      .end(function (err, res) {
        if (err) throw err;
        done();
      })
  });
  test("GET / add Card RFID", function (done) {
    request(app)
      .get('/api/modules/frigo/AddCard')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect({})
      .end(function (err, res) {
        if (err) throw err;
        done();
      })
  });
  test("GET / Temperature", function (done) {
    request(app)
      .get('/api/modules/frigo/Temperature')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect({})
      .end(function (err, res) {
        if (err) throw err;
        done();
      })
  });
  test("GET / Humidity", function (done) {
    request(app)
      .get('/api/modules/frigo/Humidity')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect({})
      .end(function (err, res) {
        if (err) throw err;
        done();
      })
  });
  afterAll(function (done){
    mongoose.disconnect();
    done();
    });

});
describe("Connection to DB", () => {
  beforeAll(function (done){
    mongoose
    .connect(params.DATABASECONNECTION, {useUnifiedTopology:true})
    done()
  });
  test("User by Id", async () => {
    const id = "6388e56b4a792ff80e3a5565";
    const user =  await User.findById(id);
    expect(user.name).toBe("dbtester");
  });
  afterAll(function (done){
    mongoose.disconnect();
    done();
    });
});
      





