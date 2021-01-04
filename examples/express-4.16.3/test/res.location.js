
var express = require('../')
  , request = require('supertest');

describe('res', function(){
  describe('.location(url)', function(){
it('-414-should set the header', function(done){
      var app = express();

      app.use(function(req, res){
        res.location('http://google.com').end();
      });

      request(app)
      .get('/')
      .expect('Location', 'http://google.com')
      .expect(200, done)
    })

it('-415-should encode "url"', function (done) {
      var app = express()

      app.use(function (req, res) {
        res.location('https://google.com?q=\u2603 §10').end()
      })

      request(app)
      .get('/')
      .expect('Location', 'https://google.com?q=%E2%98%83%20%C2%A710')
      .expect(200, done)
    })

it('-416-should not touch already-encoded sequences in "url"', function (done) {
      var app = express()

      app.use(function (req, res) {
        res.location('https://google.com?q=%A710').end()
      })

      request(app)
      .get('/')
      .expect('Location', 'https://google.com?q=%A710')
      .expect(200, done)
    })

    describe('when url is "back"', function () {
it('-417-should set location from "Referer" header', function (done) {
        var app = express()

        app.use(function (req, res) {
          res.location('back').end()
        })

        request(app)
        .get('/')
        .set('Referer', '/some/page.html')
        .expect('Location', '/some/page.html')
        .expect(200, done)
      })

it('-418-should set location from "Referrer" header', function (done) {
        var app = express()

        app.use(function (req, res) {
          res.location('back').end()
        })

        request(app)
        .get('/')
        .set('Referrer', '/some/page.html')
        .expect('Location', '/some/page.html')
        .expect(200, done)
      })

it('-419-should prefer "Referrer" header', function (done) {
        var app = express()

        app.use(function (req, res) {
          res.location('back').end()
        })

        request(app)
        .get('/')
        .set('Referer', '/some/page1.html')
        .set('Referrer', '/some/page2.html')
        .expect('Location', '/some/page2.html')
        .expect(200, done)
      })

it('-420-should set the header to "/" without referrer', function (done) {
        var app = express()

        app.use(function (req, res) {
          res.location('back').end()
        })

        request(app)
        .get('/')
        .expect('Location', '/')
        .expect(200, done)
      })
    })
  })
})
