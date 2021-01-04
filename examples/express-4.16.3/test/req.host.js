
var express = require('../')
  , request = require('supertest')

describe('req', function(){
  describe('.host', function(){
it('-232-should return the Host when present', function(done){
      var app = express();

      app.use(function(req, res){
        res.end(req.host);
      });

      request(app)
      .post('/')
      .set('Host', 'example.com')
      .expect('example.com', done);
    })

it('-233-should strip port number', function(done){
      var app = express();

      app.use(function(req, res){
        res.end(req.host);
      });

      request(app)
      .post('/')
      .set('Host', 'example.com:3000')
      .expect('example.com', done);
    })

it('-234-should return undefined otherwise', function(done){
      var app = express();

      app.use(function(req, res){
        req.headers.host = null;
        res.end(String(req.host));
      });

      request(app)
      .post('/')
      .expect('undefined', done);
    })

it('-235-should work with IPv6 Host', function(done){
      var app = express();

      app.use(function(req, res){
        res.end(req.host);
      });

      request(app)
      .post('/')
      .set('Host', '[::1]')
      .expect('[::1]', done);
    })

it('-236-should work with IPv6 Host and port', function(done){
      var app = express();

      app.use(function(req, res){
        res.end(req.host);
      });

      request(app)
      .post('/')
      .set('Host', '[::1]:3000')
      .expect('[::1]', done);
    })

    describe('when "trust proxy" is enabled', function(){
it('-237-should respect X-Forwarded-Host', function(done){
        var app = express();

        app.enable('trust proxy');

        app.use(function(req, res){
          res.end(req.host);
        });

        request(app)
        .get('/')
        .set('Host', 'localhost')
        .set('X-Forwarded-Host', 'example.com')
        .expect('example.com', done);
      })

it('-238-should ignore X-Forwarded-Host if socket addr not trusted', function(done){
        var app = express();

        app.set('trust proxy', '10.0.0.1');

        app.use(function(req, res){
          res.end(req.host);
        });

        request(app)
        .get('/')
        .set('Host', 'localhost')
        .set('X-Forwarded-Host', 'example.com')
        .expect('localhost', done);
      })

it('-239-should default to Host', function(done){
        var app = express();

        app.enable('trust proxy');

        app.use(function(req, res){
          res.end(req.host);
        });

        request(app)
        .get('/')
        .set('Host', 'example.com')
        .expect('example.com', done);
      })

      describe('when trusting hop count', function () {
it('-240-should respect X-Forwarded-Host', function (done) {
          var app = express();

          app.set('trust proxy', 1);

          app.use(function (req, res) {
            res.end(req.host);
          });

          request(app)
          .get('/')
          .set('Host', 'localhost')
          .set('X-Forwarded-Host', 'example.com')
          .expect('example.com', done);
        })
      })
    })

    describe('when "trust proxy" is disabled', function(){
it('-241-should ignore X-Forwarded-Host', function(done){
        var app = express();

        app.use(function(req, res){
          res.end(req.host);
        });

        request(app)
        .get('/')
        .set('Host', 'localhost')
        .set('X-Forwarded-Host', 'evil')
        .expect('localhost', done);
      })
    })
  })
})
