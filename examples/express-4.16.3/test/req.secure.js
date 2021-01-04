
var express = require('../')
  , request = require('supertest');

describe('req', function(){
  describe('.secure', function(){
    describe('when X-Forwarded-Proto is missing', function(){
it('-301-should return false when http', function(done){
        var app = express();

        app.get('/', function(req, res){
          res.send(req.secure ? 'yes' : 'no');
        });

        request(app)
        .get('/')
        .expect('no', done)
      })
    })
  })

  describe('.secure', function(){
    describe('when X-Forwarded-Proto is present', function(){
it('-302-should return false when http', function(done){
        var app = express();

        app.get('/', function(req, res){
          res.send(req.secure ? 'yes' : 'no');
        });

        request(app)
        .get('/')
        .set('X-Forwarded-Proto', 'https')
        .expect('no', done)
      })

it('-303-should return true when "trust proxy" is enabled', function(done){
        var app = express();

        app.enable('trust proxy');

        app.get('/', function(req, res){
          res.send(req.secure ? 'yes' : 'no');
        });

        request(app)
        .get('/')
        .set('X-Forwarded-Proto', 'https')
        .expect('yes', done)
      })

it('-304-should return false when initial proxy is http', function(done){
        var app = express();

        app.enable('trust proxy');

        app.get('/', function(req, res){
          res.send(req.secure ? 'yes' : 'no');
        });

        request(app)
        .get('/')
        .set('X-Forwarded-Proto', 'http, https')
        .expect('no', done)
      })

it('-305-should return true when initial proxy is https', function(done){
        var app = express();

        app.enable('trust proxy');

        app.get('/', function(req, res){
          res.send(req.secure ? 'yes' : 'no');
        });

        request(app)
        .get('/')
        .set('X-Forwarded-Proto', 'https, http')
        .expect('yes', done)
      })

      describe('when "trust proxy" trusting hop count', function () {
it('-306-should respect X-Forwarded-Proto', function (done) {
          var app = express();

          app.set('trust proxy', 1);

          app.get('/', function (req, res) {
            res.send(req.secure ? 'yes' : 'no');
          });

          request(app)
          .get('/')
          .set('X-Forwarded-Proto', 'https')
          .expect('yes', done)
        })
      })
    })
  })
})
