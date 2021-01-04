
var express = require('..');
var request = require('supertest');

describe('res', function(){
  describe('.set(field, value)', function(){
it('-551-should set the response header field', function(done){
      var app = express();

      app.use(function(req, res){
        res.set('Content-Type', 'text/x-foo; charset=utf-8').end();
      });

      request(app)
      .get('/')
      .expect('Content-Type', 'text/x-foo; charset=utf-8')
      .end(done);
    })

it('-552-should coerce to a string', function (done) {
      var app = express();

      app.use(function (req, res) {
        res.set('X-Number', 123);
        res.end(typeof res.get('X-Number'));
      });

      request(app)
      .get('/')
      .expect('X-Number', '123')
      .expect(200, 'string', done);
    })
  })

  describe('.set(field, values)', function(){
it('-553-should set multiple response header fields', function(done){
      var app = express();

      app.use(function(req, res){
        res.set('Set-Cookie', ["type=ninja", "language=javascript"]);
        res.send(res.get('Set-Cookie'));
      });

      request(app)
      .get('/')
      .expect('["type=ninja","language=javascript"]', done);
    })

it('-554-should coerce to an array of strings', function (done) {
      var app = express();

      app.use(function (req, res) {
        res.set('X-Numbers', [123, 456]);
        res.end(JSON.stringify(res.get('X-Numbers')));
      });

      request(app)
      .get('/')
      .expect('X-Numbers', '123, 456')
      .expect(200, '["123","456"]', done);
    })

it('-555-should not set a charset of one is already set', function (done) {
      var app = express();

      app.use(function (req, res) {
        res.set('Content-Type', 'text/html; charset=lol');
        res.end();
      });

      request(app)
      .get('/')
      .expect('Content-Type', 'text/html; charset=lol')
      .expect(200, done);
    })

it('-556-should throw when Content-Type is an array', function (done) {
      var app = express()

      app.use(function (req, res) {
        res.set('Content-Type', ['text/html'])
        res.end()
      });

      request(app)
      .get('/')
      .expect(500, /TypeError: Content-Type cannot be set to an Array/, done)
    })
  })

  describe('.set(object)', function(){
it('-557-should set multiple fields', function(done){
      var app = express();

      app.use(function(req, res){
        res.set({
          'X-Foo': 'bar',
          'X-Bar': 'baz'
        }).end();
      });

      request(app)
      .get('/')
      .expect('X-Foo', 'bar')
      .expect('X-Bar', 'baz')
      .end(done);
    })

it('-558-should coerce to a string', function (done) {
      var app = express();

      app.use(function (req, res) {
        res.set({ 'X-Number': 123 });
        res.end(typeof res.get('X-Number'));
      });

      request(app)
      .get('/')
      .expect('X-Number', '123')
      .expect(200, 'string', done);
    })
  })
})
