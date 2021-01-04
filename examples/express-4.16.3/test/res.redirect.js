
var express = require('..');
var request = require('supertest');
var utils = require('./support/utils');

describe('res', function(){
  describe('.redirect(url)', function(){
it('-421-should default to a 302 redirect', function(done){
      var app = express();

      app.use(function(req, res){
        res.redirect('http://google.com');
      });

      request(app)
      .get('/')
      .expect('location', 'http://google.com')
      .expect(302, done)
    })

it('-422-should encode "url"', function (done) {
      var app = express()

      app.use(function (req, res) {
        res.redirect('https://google.com?q=\u2603 §10')
      })

      request(app)
      .get('/')
      .expect('Location', 'https://google.com?q=%E2%98%83%20%C2%A710')
      .expect(302, done)
    })

it('-423-should not touch already-encoded sequences in "url"', function (done) {
      var app = express()

      app.use(function (req, res) {
        res.redirect('https://google.com?q=%A710')
      })

      request(app)
      .get('/')
      .expect('Location', 'https://google.com?q=%A710')
      .expect(302, done)
    })
  })

  describe('.redirect(status, url)', function(){
it('-424-should set the response status', function(done){
      var app = express();

      app.use(function(req, res){
        res.redirect(303, 'http://google.com');
      });

      request(app)
      .get('/')
      .expect('Location', 'http://google.com')
      .expect(303, done)
    })
  })

  describe('.redirect(url, status)', function(){
it('-425-should set the response status', function(done){
      var app = express();

      app.use(function(req, res){
        res.redirect('http://google.com', 303);
      });

      request(app)
      .get('/')
      .expect('Location', 'http://google.com')
      .expect(303, done)
    })
  })

  describe('when the request method is HEAD', function(){
it('-426-should ignore the body', function(done){
      var app = express();

      app.use(function(req, res){
        res.redirect('http://google.com');
      });

      request(app)
      .head('/')
      .expect('Location', 'http://google.com')
      .expect(302, '', done)
    })
  })

  describe('when accepting html', function(){
it('-427-should respond with html', function(done){
      var app = express();

      app.use(function(req, res){
        res.redirect('http://google.com');
      });

      request(app)
      .get('/')
      .set('Accept', 'text/html')
      .expect('Content-Type', /html/)
      .expect('Location', 'http://google.com')
      .expect(302, '<p>Found. Redirecting to <a href="http://google.com">http://google.com</a></p>', done)
    })

it('-428-should escape the url', function(done){
      var app = express();

      app.use(function(req, res){
        res.redirect('<la\'me>');
      });

      request(app)
      .get('/')
      .set('Host', 'http://example.com')
      .set('Accept', 'text/html')
      .expect('Content-Type', /html/)
      .expect('Location', '%3Cla\'me%3E')
      .expect(302, '<p>Found. Redirecting to <a href="%3Cla&#39;me%3E">%3Cla&#39;me%3E</a></p>', done)
    })

it('-429-should include the redirect type', function(done){
      var app = express();

      app.use(function(req, res){
        res.redirect(301, 'http://google.com');
      });

      request(app)
      .get('/')
      .set('Accept', 'text/html')
      .expect('Content-Type', /html/)
      .expect('Location', 'http://google.com')
      .expect(301, '<p>Moved Permanently. Redirecting to <a href="http://google.com">http://google.com</a></p>', done);
    })
  })

  describe('when accepting text', function(){
it('-430-should respond with text', function(done){
      var app = express();

      app.use(function(req, res){
        res.redirect('http://google.com');
      });

      request(app)
      .get('/')
      .set('Accept', 'text/plain, */*')
      .expect('Content-Type', /plain/)
      .expect('Location', 'http://google.com')
      .expect(302, 'Found. Redirecting to http://google.com', done)
    })

it('-431-should encode the url', function(done){
      var app = express();

      app.use(function(req, res){
        res.redirect('http://example.com/?param=<script>alert("hax");</script>');
      });

      request(app)
      .get('/')
      .set('Host', 'http://example.com')
      .set('Accept', 'text/plain, */*')
      .expect('Content-Type', /plain/)
      .expect('Location', 'http://example.com/?param=%3Cscript%3Ealert(%22hax%22);%3C/script%3E')
      .expect(302, 'Found. Redirecting to http://example.com/?param=%3Cscript%3Ealert(%22hax%22);%3C/script%3E', done)
    })

it('-432-should include the redirect type', function(done){
      var app = express();

      app.use(function(req, res){
        res.redirect(301, 'http://google.com');
      });

      request(app)
      .get('/')
      .set('Accept', 'text/plain, */*')
      .expect('Content-Type', /plain/)
      .expect('Location', 'http://google.com')
      .expect(301, 'Moved Permanently. Redirecting to http://google.com', done);
    })
  })

  describe('when accepting neither text or html', function(){
it('-433-should respond with an empty body', function(done){
      var app = express();

      app.use(function(req, res){
        res.redirect('http://google.com');
      });

      request(app)
      .get('/')
      .set('Accept', 'application/octet-stream')
      .expect('location', 'http://google.com')
      .expect('content-length', '0')
      .expect(utils.shouldNotHaveHeader('Content-Type'))
      .expect(302, '', done)
    })
  })
})
