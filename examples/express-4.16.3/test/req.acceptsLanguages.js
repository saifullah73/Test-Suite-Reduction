
var express = require('../')
  , request = require('supertest');

describe('req', function(){
  describe('.acceptsLanguages', function(){
it('-218-should be true if language accepted', function(done){
      var app = express();

      app.use(function(req, res){
        req.acceptsLanguages('en-us').should.be.ok()
        req.acceptsLanguages('en').should.be.ok()
        res.end();
      });

      request(app)
      .get('/')
      .set('Accept-Language', 'en;q=.5, en-us')
      .expect(200, done);
    })

it('-219-should be false if language not accepted', function(done){
      var app = express();

      app.use(function(req, res){
        req.acceptsLanguages('es').should.not.be.ok()
        res.end();
      });

      request(app)
      .get('/')
      .set('Accept-Language', 'en;q=.5, en-us')
      .expect(200, done);
    })

    describe('when Accept-Language is not present', function(){
it('-220-should always return true', function(done){
        var app = express();

        app.use(function(req, res){
          req.acceptsLanguages('en').should.be.ok()
          req.acceptsLanguages('es').should.be.ok()
          req.acceptsLanguages('jp').should.be.ok()
          res.end();
        });

        request(app)
        .get('/')
        .expect(200, done);
      })
    })
  })
})
