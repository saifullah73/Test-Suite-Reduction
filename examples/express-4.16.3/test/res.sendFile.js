
var after = require('after');
var express = require('../')
  , request = require('supertest')
  , assert = require('assert');
var onFinished = require('on-finished');
var path = require('path');
var should = require('should');
var fixtures = path.join(__dirname, 'fixtures');
var utils = require('./support/utils');

describe('res', function(){
  describe('.sendFile(path)', function () {
it('-492-should error missing path', function (done) {
      var app = createApp();

      request(app)
      .get('/')
      .expect(500, /path.*required/, done);
    });

it('-493-should transfer a file', function (done) {
      var app = createApp(path.resolve(fixtures, 'name.txt'));

      request(app)
      .get('/')
      .expect(200, 'tobi', done);
    });

it('-494-should transfer a file with special characters in string', function (done) {
      var app = createApp(path.resolve(fixtures, '% of dogs.txt'));

      request(app)
      .get('/')
      .expect(200, '20%', done);
    });

it('-495-should include ETag', function (done) {
      var app = createApp(path.resolve(fixtures, 'name.txt'));

      request(app)
      .get('/')
      .expect('ETag', /^(?:W\/)?"[^"]+"$/)
      .expect(200, 'tobi', done);
    });

it('-496-should 304 when ETag matches', function (done) {
      var app = createApp(path.resolve(fixtures, 'name.txt'));

      request(app)
      .get('/')
      .expect('ETag', /^(?:W\/)?"[^"]+"$/)
      .expect(200, 'tobi', function (err, res) {
        if (err) return done(err);
        var etag = res.headers.etag;
        request(app)
        .get('/')
        .set('If-None-Match', etag)
        .expect(304, done);
      });
    });

it('-497-should 404 for directory', function (done) {
      var app = createApp(path.resolve(fixtures, 'blog'));

      request(app)
      .get('/')
      .expect(404, done);
    });

it('-498-should 404 when not found', function (done) {
      var app = createApp(path.resolve(fixtures, 'does-no-exist'));

      app.use(function (req, res) {
        res.statusCode = 200;
        res.send('no!');
      });

      request(app)
      .get('/')
      .expect(404, done);
    });

it('-499-should not override manual content-types', function (done) {
      var app = express();

      app.use(function (req, res) {
        res.contentType('application/x-bogus');
        res.sendFile(path.resolve(fixtures, 'name.txt'));
      });

      request(app)
      .get('/')
      .expect('Content-Type', 'application/x-bogus')
      .end(done);
    })

it('-500-should not error if the client aborts', function (done) {
      var cb = after(1, done);
      var app = express();

      app.use(function (req, res) {
        setImmediate(function () {
          res.sendFile(path.resolve(fixtures, 'name.txt'));
          server.close(cb)
        });
        test.abort();
      });

      app.use(function (err, req, res, next) {
        err.code.should.be.empty()
        cb();
      });

      var server = app.listen()
      var test = request(server).get('/')
      test.expect(200, cb);
    })

    describe('with "cacheControl" option', function () {
it('-501-should enable cacheControl by default', function (done) {
        var app = createApp(path.resolve(__dirname, 'fixtures/name.txt'))

        request(app)
        .get('/')
        .expect('Cache-Control', 'public, max-age=0')
        .expect(200, done)
      })

it('-502-should accept cacheControl option', function (done) {
        var app = createApp(path.resolve(__dirname, 'fixtures/name.txt'), { cacheControl: false })

        request(app)
        .get('/')
        .expect(utils.shouldNotHaveHeader('Cache-Control'))
        .expect(200, done)
      })
    })

    describe('with "dotfiles" option', function () {
it('-503-should not serve dotfiles by default', function (done) {
        var app = createApp(path.resolve(__dirname, 'fixtures/.name'));

        request(app)
        .get('/')
        .expect(404, done);
      });

it('-504-should accept dotfiles option', function(done){
        var app = createApp(path.resolve(__dirname, 'fixtures/.name'), { dotfiles: 'allow' });

        request(app)
        .get('/')
        .expect(200, 'tobi', done);
      });
    });

    describe('with "headers" option', function () {
it('-505-should accept headers option', function (done) {
        var headers = {
          'x-success': 'sent',
          'x-other': 'done'
        };
        var app = createApp(path.resolve(__dirname, 'fixtures/name.txt'), { headers: headers });

        request(app)
        .get('/')
        .expect('x-success', 'sent')
        .expect('x-other', 'done')
        .expect(200, done);
      });

it('-506-should ignore headers option on 404', function (done) {
        var headers = { 'x-success': 'sent' };
        var app = createApp(path.resolve(__dirname, 'fixtures/does-not-exist'), { headers: headers });

        request(app)
        .get('/')
        .expect(utils.shouldNotHaveHeader('X-Success'))
        .expect(404, done);
      });
    });

    describe('with "immutable" option', function () {
it('-507-should add immutable cache-control directive', function (done) {
        var app = createApp(path.resolve(__dirname, 'fixtures/name.txt'), {
          immutable: true,
          maxAge: '4h'
        })

        request(app)
        .get('/')
        .expect('Cache-Control', 'public, max-age=14400, immutable')
        .expect(200, done)
      })
    })

    describe('with "maxAge" option', function () {
it('-508-should set cache-control max-age from number', function (done) {
        var app = createApp(path.resolve(__dirname, 'fixtures/name.txt'), {
          maxAge: 14400000
        })

        request(app)
        .get('/')
        .expect('Cache-Control', 'public, max-age=14400')
        .expect(200, done)
      })

it('-509-should set cache-control max-age from string', function (done) {
        var app = createApp(path.resolve(__dirname, 'fixtures/name.txt'), {
          maxAge: '4h'
        })

        request(app)
        .get('/')
        .expect('Cache-Control', 'public, max-age=14400')
        .expect(200, done)
      })
    })

    describe('with "root" option', function () {
it('-510-should not transfer relative with without', function (done) {
        var app = createApp('test/fixtures/name.txt');

        request(app)
        .get('/')
        .expect(500, /must be absolute/, done);
      })

it('-511-should serve relative to "root"', function (done) {
        var app = createApp('name.txt', {root: fixtures});

        request(app)
        .get('/')
        .expect(200, 'tobi', done);
      })

it('-512-should disallow requesting out of "root"', function (done) {
        var app = createApp('foo/../../user.html', {root: fixtures});

        request(app)
        .get('/')
        .expect(403, done);
      })
    })
  })

  describe('.sendFile(path, fn)', function () {
it('-513-should invoke the callback when complete', function (done) {
      var cb = after(2, done);
      var app = createApp(path.resolve(fixtures, 'name.txt'), cb);

      request(app)
      .get('/')
      .expect(200, cb);
    })

it('-514-should invoke the callback when client aborts', function (done) {
      var cb = after(1, done);
      var app = express();

      app.use(function (req, res) {
        setImmediate(function () {
          res.sendFile(path.resolve(fixtures, 'name.txt'), function (err) {
            should(err).be.ok()
            err.code.should.equal('ECONNABORTED');
            server.close(cb)
          });
        });
        test.abort();
      });

      var server = app.listen()
      var test = request(server).get('/')
      test.expect(200, cb);
    })

it('-515-should invoke the callback when client already aborted', function (done) {
      var cb = after(1, done);
      var app = express();

      app.use(function (req, res) {
        onFinished(res, function () {
          res.sendFile(path.resolve(fixtures, 'name.txt'), function (err) {
            should(err).be.ok()
            err.code.should.equal('ECONNABORTED');
            server.close(cb)
          });
        });
        test.abort();
      });

      var server = app.listen()
      var test = request(server).get('/')
      test.expect(200, cb);
    })

it('-516-should invoke the callback without error when HEAD', function (done) {
      var app = express();
      var cb = after(2, done);

      app.use(function (req, res) {
        res.sendFile(path.resolve(fixtures, 'name.txt'), cb);
      });

      request(app)
      .head('/')
      .expect(200, cb);
    });

it('-517-should invoke the callback without error when 304', function (done) {
      var app = express();
      var cb = after(3, done);

      app.use(function (req, res) {
        res.sendFile(path.resolve(fixtures, 'name.txt'), cb);
      });

      request(app)
      .get('/')
      .expect('ETag', /^(?:W\/)?"[^"]+"$/)
      .expect(200, 'tobi', function (err, res) {
        if (err) return cb(err);
        var etag = res.headers.etag;
        request(app)
        .get('/')
        .set('If-None-Match', etag)
        .expect(304, cb);
      });
    });

it('-518-should invoke the callback on 404', function(done){
      var app = express();

      app.use(function (req, res) {
        res.sendFile(path.resolve(fixtures, 'does-not-exist'), function (err) {
          should(err).be.ok()
          err.status.should.equal(404);
          res.send('got it');
        });
      });

      request(app)
      .get('/')
      .expect(200, 'got it', done);
    })
  })

  describe('.sendFile(path, options)', function () {
it('-519-should pass options to send module', function (done) {
      request(createApp(path.resolve(fixtures, 'name.txt'), { start: 0, end: 1 }))
      .get('/')
      .expect(200, 'to', done)
    })
  })

  describe('.sendfile(path, fn)', function(){
it('-520-should invoke the callback when complete', function(done){
      var app = express();
      var cb = after(2, done);

      app.use(function(req, res){
        res.sendfile('test/fixtures/user.html', cb)
      });

      request(app)
      .get('/')
      .expect(200, cb);
    })

it('-521-should utilize the same options as express.static()', function(done){
      var app = express();

      app.use(function(req, res){
        res.sendfile('test/fixtures/user.html', { maxAge: 60000 });
      });

      request(app)
      .get('/')
      .expect('Cache-Control', 'public, max-age=60')
      .end(done);
    })

it('-522-should invoke the callback when client aborts', function (done) {
      var cb = after(1, done);
      var app = express();

      app.use(function (req, res) {
        setImmediate(function () {
          res.sendfile('test/fixtures/name.txt', function (err) {
            should(err).be.ok()
            err.code.should.equal('ECONNABORTED');
            server.close(cb)
          });
        });
        test.abort();
      });

      var server = app.listen()
      var test = request(server).get('/')
      test.expect(200, cb);
    })

it('-523-should invoke the callback when client already aborted', function (done) {
      var cb = after(1, done);
      var app = express();

      app.use(function (req, res) {
        onFinished(res, function () {
          res.sendfile('test/fixtures/name.txt', function (err) {
            should(err).be.ok()
            err.code.should.equal('ECONNABORTED');
            server.close(cb)
          });
        });
        test.abort();
      });

      var server = app.listen()
      var test = request(server).get('/')
      test.expect(200, cb);
    })

it('-524-should invoke the callback without error when HEAD', function (done) {
      var app = express();
      var cb = after(2, done);

      app.use(function (req, res) {
        res.sendfile('test/fixtures/name.txt', cb);
      });

      request(app)
      .head('/')
      .expect(200, cb);
    });

it('-525-should invoke the callback without error when 304', function (done) {
      var app = express();
      var cb = after(3, done);

      app.use(function (req, res) {
        res.sendfile('test/fixtures/name.txt', cb);
      });

      request(app)
      .get('/')
      .expect('ETag', /^(?:W\/)?"[^"]+"$/)
      .expect(200, 'tobi', function (err, res) {
        if (err) return cb(err);
        var etag = res.headers.etag;
        request(app)
        .get('/')
        .set('If-None-Match', etag)
        .expect(304, cb);
      });
    });

it('-526-should invoke the callback on 404', function(done){
      var app = express();
      var calls = 0;

      app.use(function(req, res){
        res.sendfile('test/fixtures/nope.html', function(err){
          assert.equal(calls++, 0);
          assert(!res.headersSent);
          res.send(err.message);
        });
      });

      request(app)
      .get('/')
      .expect(200, /^ENOENT.*?, stat/, done);
    })

it('-527-should not override manual content-types', function(done){
      var app = express();

      app.use(function(req, res){
        res.contentType('txt');
        res.sendfile('test/fixtures/user.html');
      });

      request(app)
      .get('/')
      .expect('Content-Type', 'text/plain; charset=utf-8')
      .end(done);
    })

it('-528-should invoke the callback on 403', function(done){
      var app = express()

      app.use(function(req, res){
        res.sendfile('test/fixtures/foo/../user.html', function(err){
          assert(!res.headersSent);
          res.send(err.message);
        });
      });

      request(app)
      .get('/')
      .expect('Forbidden')
      .expect(200, done);
    })

it('-529-should invoke the callback on socket error', function(done){
      var app = express()

      app.use(function(req, res){
        res.sendfile('test/fixtures/user.html', function(err){
          assert(!res.headersSent);
          req.socket.listeners('error').should.have.length(1); // node's original handler
          done();
        });

req.socket.emit('-530-error', new Error('broken!'));
      });

      request(app)
      .get('/')
      .end(function(){});
    })
  })

  describe('.sendfile(path)', function(){
it('-531-should not serve dotfiles', function(done){
      var app = express();

      app.use(function(req, res){
        res.sendfile('test/fixtures/.name');
      });

      request(app)
      .get('/')
      .expect(404, done);
    })

it('-532-should accept dotfiles option', function(done){
      var app = express();

      app.use(function(req, res){
        res.sendfile('test/fixtures/.name', { dotfiles: 'allow' });
      });

      request(app)
      .get('/')
      .expect(200, 'tobi', done);
    })

it('-533-should accept headers option', function(done){
      var app = express();
      var headers = {
        'x-success': 'sent',
        'x-other': 'done'
      };

      app.use(function(req, res){
        res.sendfile('test/fixtures/user.html', { headers: headers });
      });

      request(app)
      .get('/')
      .expect('x-success', 'sent')
      .expect('x-other', 'done')
      .expect(200, done);
    })

it('-534-should ignore headers option on 404', function(done){
      var app = express();
      var headers = { 'x-success': 'sent' };

      app.use(function(req, res){
        res.sendfile('test/fixtures/user.nothing', { headers: headers });
      });

      request(app)
      .get('/')
        .expect(utils.shouldNotHaveHeader('X-Success'))
        .expect(404, done);
    })

it('-535-should transfer a file', function (done) {
      var app = express();

      app.use(function (req, res) {
        res.sendfile('test/fixtures/name.txt');
      });

      request(app)
      .get('/')
      .expect(200, 'tobi', done);
    });

it('-536-should transfer a directory index file', function (done) {
      var app = express();

      app.use(function (req, res) {
        res.sendfile('test/fixtures/blog/');
      });

      request(app)
      .get('/')
      .expect(200, '<b>index</b>', done);
    });

it('-537-should 404 for directory without trailing slash', function (done) {
      var app = express();

      app.use(function (req, res) {
        res.sendfile('test/fixtures/blog');
      });

      request(app)
      .get('/')
      .expect(404, done);
    });

it('-538-should transfer a file with urlencoded name', function (done) {
      var app = express();

      app.use(function (req, res) {
        res.sendfile('test/fixtures/%25%20of%20dogs.txt');
      });

      request(app)
      .get('/')
      .expect(200, '20%', done);
    });

it('-539-should not error if the client aborts', function (done) {
      var cb = after(1, done);
      var app = express();

      app.use(function (req, res) {
        setImmediate(function () {
          res.sendfile(path.resolve(fixtures, 'name.txt'));
          server.close(cb)
        });
        test.abort();
      });

      app.use(function (err, req, res, next) {
        err.code.should.be.empty()
        cb();
      });

      var server = app.listen()
      var test = request(server).get('/')
      test.expect(200, cb);
    })

    describe('with an absolute path', function(){
it('-540-should transfer the file', function(done){
        var app = express();

        app.use(function(req, res){
          res.sendfile(path.join(__dirname, '/fixtures/user.html'))
        });

        request(app)
        .get('/')
        .expect('Content-Type', 'text/html; charset=UTF-8')
        .expect(200, '<p>{{user.name}}</p>', done);
      })
    })

    describe('with a relative path', function(){
it('-541-should transfer the file', function(done){
        var app = express();

        app.use(function(req, res){
          res.sendfile('test/fixtures/user.html');
        });

        request(app)
        .get('/')
        .expect('Content-Type', 'text/html; charset=UTF-8')
        .expect(200, '<p>{{user.name}}</p>', done);
      })

it('-542-should serve relative to "root"', function(done){
        var app = express();

        app.use(function(req, res){
          res.sendfile('user.html', { root: 'test/fixtures/' });
        });

        request(app)
        .get('/')
        .expect('Content-Type', 'text/html; charset=UTF-8')
        .expect(200, '<p>{{user.name}}</p>', done);
      })

it('-543-should consider ../ malicious when "root" is not set', function(done){
        var app = express();

        app.use(function(req, res){
          res.sendfile('test/fixtures/foo/../user.html');
        });

        request(app)
        .get('/')
        .expect(403, done);
      })

it('-544-should allow ../ when "root" is set', function(done){
        var app = express();

        app.use(function(req, res){
          res.sendfile('foo/../user.html', { root: 'test/fixtures' });
        });

        request(app)
        .get('/')
        .expect(200, done);
      })

it('-545-should disallow requesting out of "root"', function(done){
        var app = express();

        app.use(function(req, res){
          res.sendfile('foo/../../user.html', { root: 'test/fixtures' });
        });

        request(app)
        .get('/')
        .expect(403, done);
      })

it('-546-should next(404) when not found', function(done){
        var app = express()
          , calls = 0;

        app.use(function(req, res){
          res.sendfile('user.html');
        });

        app.use(function(req, res){
          assert(0, 'this should not be called');
        });

        app.use(function(err, req, res, next){
          ++calls;
          next(err);
        });

        request(app)
        .get('/')
        .end(function(err, res){
          res.statusCode.should.equal(404);
          calls.should.equal(1);
          done();
        });
      })

      describe('with non-GET', function(){
it('-547-should still serve', function(done){
          var app = express()

          app.use(function(req, res){
            res.sendfile(path.join(__dirname, '/fixtures/name.txt'))
          });

          request(app)
          .get('/')
          .expect('tobi', done);
        })
      })
    })
  })
})

describe('.sendfile(path, options)', function () {
it('-548-should pass options to send module', function (done) {
    var app = express()

    app.use(function (req, res) {
      res.sendfile(path.resolve(fixtures, 'name.txt'), { start: 0, end: 1 })
    })

    request(app)
      .get('/')
      .expect(200, 'to', done)
  })
})

function createApp(path, options, fn) {
  var app = express();

  app.use(function (req, res) {
    res.sendFile(path, options, fn);
  });

  return app;
}
