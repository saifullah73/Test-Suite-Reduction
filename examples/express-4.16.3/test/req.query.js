
var express = require('../')
  , request = require('supertest');

describe('req', function(){
  describe('.query', function(){
it('-283-should default to {}', function(done){
      var app = createApp();

      request(app)
      .get('/')
      .expect(200, '{}', done);
    });

it('-284-should default to parse complex keys', function (done) {
      var app = createApp();

      request(app)
      .get('/?user[name]=tj')
      .expect(200, '{"user":{"name":"tj"}}', done);
    });

    describe('when "query parser" is extended', function () {
it('-285-should parse complex keys', function (done) {
        var app = createApp('extended');

        request(app)
        .get('/?user[name]=tj')
        .expect(200, '{"user":{"name":"tj"}}', done);
      });

it('-286-should parse parameters with dots', function (done) {
        var app = createApp('extended');

        request(app)
        .get('/?user.name=tj')
        .expect(200, '{"user.name":"tj"}', done);
      });
    });

    describe('when "query parser" is simple', function () {
it('-287-should not parse complex keys', function (done) {
        var app = createApp('simple');

        request(app)
        .get('/?user%5Bname%5D=tj')
        .expect(200, '{"user[name]":"tj"}', done);
      });
    });

    describe('when "query parser" is a function', function () {
it('-288-should parse using function', function (done) {
        var app = createApp(function (str) {
          return {'length': (str || '').length};
        });

        request(app)
        .get('/?user%5Bname%5D=tj')
        .expect(200, '{"length":17}', done);
      });
    });

    describe('when "query parser" disabled', function () {
it('-289-should not parse query', function (done) {
        var app = createApp(false);

        request(app)
        .get('/?user%5Bname%5D=tj')
        .expect(200, '{}', done);
      });
    });

    describe('when "query parser" disabled', function () {
it('-290-should not parse complex keys', function (done) {
        var app = createApp(true);

        request(app)
        .get('/?user%5Bname%5D=tj')
        .expect(200, '{"user[name]":"tj"}', done);
      });
    });

    describe('when "query parser fn" is missing', function () {
it('-291-should act like "extended"', function (done) {
        var app = express();

        delete app.settings['query parser'];
        delete app.settings['query parser fn'];

        app.use(function (req, res) {
          res.send(req.query);
        });

        request(app)
        .get('/?user[name]=tj&user.name=tj')
        .expect(200, '{"user":{"name":"tj"},"user.name":"tj"}', done);
      });
    });

    describe('when "query parser" an unknown value', function () {
it('-292-should throw', function () {
        createApp.bind(null, 'bogus').should.throw(/unknown value.*query parser/);
      });
    });
  })
})

function createApp(setting) {
  var app = express();

  if (setting !== undefined) {
    app.set('query parser', setting);
  }

  app.use(function (req, res) {
    res.send(req.query);
  });

  return app;
}
