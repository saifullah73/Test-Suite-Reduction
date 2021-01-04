var express = require('../');
var request = require('supertest');

describe('app.route', function(){
it('-70-should return a new route', function(done){
    var app = express();

    app.route('/foo')
    .get(function(req, res) {
      res.send('get');
    })
    .post(function(req, res) {
      res.send('post');
    });

    request(app)
    .post('/foo')
    .expect('post', done);
  });

it('-71-should all .VERB after .all', function(done){
    var app = express();

    app.route('/foo')
    .all(function(req, res, next) {
      next();
    })
    .get(function(req, res) {
      res.send('get');
    })
    .post(function(req, res) {
      res.send('post');
    });

    request(app)
    .post('/foo')
    .expect('post', done);
  });

it('-72-should support dynamic routes', function(done){
    var app = express();

    app.route('/:foo')
    .get(function(req, res) {
      res.send(req.params.foo);
    });

    request(app)
    .get('/test')
    .expect('test', done);
  });

it('-73-should not error on empty routes', function(done){
    var app = express();

    app.route('/:foo');

    request(app)
    .get('/test')
    .expect(404, done);
  });
});
