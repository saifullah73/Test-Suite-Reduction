
var express = require('../')
  , request = require('supertest');

describe('req', function(){
  describe('.accepts(type)', function(){
it('-196-should return true when Accept is not present', function(done){
      var app = express();

      app.use(function(req, res, next){
        res.end(req.accepts('json') ? 'yes' : 'no');
      });

      request(app)
      .get('/')
      .expect('yes', done);
    })

it('-197-should return true when present', function(done){
      var app = express();

      app.use(function(req, res, next){
        res.end(req.accepts('json') ? 'yes' : 'no');
      });

      request(app)
      .get('/')
      .set('Accept', 'application/json')
      .expect('yes', done);
    })

it('-198-should return false otherwise', function(done){
      var app = express();

      app.use(function(req, res, next){
        res.end(req.accepts('json') ? 'yes' : 'no');
      });

      request(app)
      .get('/')
      .set('Accept', 'text/html')
      .expect('no', done);
    })
  })

it('-199-should accept an argument list of type names', function(done){
    var app = express();

    app.use(function(req, res, next){
      res.end(req.accepts('json', 'html'));
    });

    request(app)
    .get('/')
    .set('Accept', 'application/json')
    .expect('json', done);
  })

  describe('.accepts(types)', function(){
it('-200-should return the first when Accept is not present', function(done){
      var app = express();

      app.use(function(req, res, next){
        res.end(req.accepts(['json', 'html']));
      });

      request(app)
      .get('/')
      .expect('json', done);
    })

it('-201-should return the first acceptable type', function(done){
      var app = express();

      app.use(function(req, res, next){
        res.end(req.accepts(['json', 'html']));
      });

      request(app)
      .get('/')
      .set('Accept', 'text/html')
      .expect('html', done);
    })

it('-202-should return false when no match is made', function(done){
      var app = express();

      app.use(function(req, res, next){
        res.end(req.accepts(['text/html', 'application/json']) ? 'yup' : 'nope');
      });

      request(app)
      .get('/')
      .set('Accept', 'foo/bar, bar/baz')
      .expect('nope', done);
    })

it('-203-should take quality into account', function(done){
      var app = express();

      app.use(function(req, res, next){
        res.end(req.accepts(['text/html', 'application/json']));
      });

      request(app)
      .get('/')
      .set('Accept', '*/html; q=.5, application/json')
      .expect('application/json', done);
    })

it('-204-should return the first acceptable type with canonical mime types', function(done){
      var app = express();

      app.use(function(req, res, next){
        res.end(req.accepts(['application/json', 'text/html']));
      });

      request(app)
      .get('/')
      .set('Accept', '*/html')
      .expect('text/html', done);
    })
  })
})
