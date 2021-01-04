
var express = require('../')
  , request = require('supertest');

describe('req', function(){
  describe('.acceptsLanguage', function(){
it('-215-should be true if language accepted', function(done){
      var app = express();

      app.use(function(req, res){
        req.acceptsLanguage('en-us').should.be.ok()
        req.acceptsLanguage('en').should.be.ok()
        res.end();
      });

      request(app)
      .get('/')
      .set('Accept-Language', 'en;q=.5, en-us')
      .expect(200, done);
    })

it('-216-should be false if language not accepted', function(done){
      var app = express();

      app.use(function(req, res){
        req.acceptsLanguage('es').should.not.be.ok()
        res.end();
      });

      request(app)
      .get('/')
      .set('Accept-Language', 'en;q=.5, en-us')
      .expect(200, done);
    })

    describe('when Accept-Language is not present', function(){
it('-217-should always return true', function(done){
        var app = express();

        app.use(function(req, res){
          req.acceptsLanguage('en').should.be.ok()
          req.acceptsLanguage('es').should.be.ok()
          req.acceptsLanguage('jp').should.be.ok()
          res.end();
        });

        request(app)
        .get('/')
        .expect(200, done);
      })
    })
  })
})
