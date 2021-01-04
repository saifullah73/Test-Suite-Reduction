
var express = require('../')
  , request = require('supertest');

describe('req', function(){
  describe('.stale', function(){
it('-308-should return false when the resource is not modified', function(done){
      var app = express();
      var etag = '"12345"';

      app.use(function(req, res){
        res.set('ETag', etag);
        res.send(req.stale);
      });

      request(app)
      .get('/')
      .set('If-None-Match', etag)
      .expect(304, done);
    })

it('-309-should return true when the resource is modified', function(done){
      var app = express();

      app.use(function(req, res){
        res.set('ETag', '"123"');
        res.send(req.stale);
      });

      request(app)
      .get('/')
      .set('If-None-Match', '"12345"')
      .expect(200, 'true', done);
    })

it('-310-should return true without response headers', function(done){
      var app = express();

      app.disable('x-powered-by')
      app.use(function(req, res){
        res.send(req.stale);
      });

      request(app)
      .get('/')
      .expect(200, 'true', done);
    })
  })
})
