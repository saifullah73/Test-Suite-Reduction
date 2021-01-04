
var express = require('../')
  , request = require('supertest');

describe('req', function(){
  describe('.acceptsCharsets(type)', function(){
    describe('when Accept-Charset is not present', function(){
it('-208-should return true', function(done){
        var app = express();

        app.use(function(req, res, next){
          res.end(req.acceptsCharsets('utf-8') ? 'yes' : 'no');
        });

        request(app)
        .get('/')
        .expect('yes', done);
      })
    })

    describe('when Accept-Charset is not present', function(){
it('-209-should return true when present', function(done){
        var app = express();

        app.use(function(req, res, next){
          res.end(req.acceptsCharsets('utf-8') ? 'yes' : 'no');
        });

        request(app)
        .get('/')
        .set('Accept-Charset', 'foo, bar, utf-8')
        .expect('yes', done);
      })

it('-210-should return false otherwise', function(done){
        var app = express();

        app.use(function(req, res, next){
          res.end(req.acceptsCharsets('utf-8') ? 'yes' : 'no');
        });

        request(app)
        .get('/')
        .set('Accept-Charset', 'foo, bar')
        .expect('no', done);
      })
    })
  })
})
