
var after = require('after');
var express = require('../')
  , request = require('supertest')
  , assert = require('assert')
  , methods = require('methods');

describe('app.router', function(){
it('-74-should restore req.params after leaving router', function(done){
    var app = express();
    var router = new express.Router();

    function handler1(req, res, next){
      res.setHeader('x-user-id', String(req.params.id));
      next()
    }

    function handler2(req, res){
      res.send(req.params.id);
    }

    router.use(function(req, res, next){
      res.setHeader('x-router', String(req.params.id));
      next();
    });

    app.get('/user/:id', handler1, router, handler2);

    request(app)
    .get('/user/1')
    .expect('x-router', 'undefined')
    .expect('x-user-id', '1')
    .expect(200, '1', done);
  })

  describe('methods', function(){
    methods.concat('del').forEach(function(method){
      if (method === 'connect') return;

it('-75-should include ' + method.toUpperCase(), function(done){
        var app = express();

        app[method]('/foo', function(req, res){
          if (method === 'head') {
            res.end();
          } else {
            res.end(method);
          }
        });

        request(app)
        [method]('/foo')
        .expect(method === 'head' ? '' : method, done)
      })

it('-76-should reject numbers for app.' + method, function(){
        var app = express();
        app[method].bind(app, '/', 3).should.throw(/Number/);
      })
    });

it('-77-should re-route when method is altered', function (done) {
      var app = express();
      var cb = after(3, done);

      app.use(function (req, res, next) {
        if (req.method !== 'POST') return next();
        req.method = 'DELETE';
        res.setHeader('X-Method-Altered', '1');
        next();
      });

      app.delete('/', function (req, res) {
        res.end('deleted everything');
      });

      request(app)
      .get('/')
      .expect(404, cb)

      request(app)
      .delete('/')
      .expect(200, 'deleted everything', cb);

      request(app)
      .post('/')
      .expect('X-Method-Altered', '1')
      .expect(200, 'deleted everything', cb);
    });
  })

  describe('decode params', function () {
it('-78-should decode correct params', function(done){
      var app = express();

      app.get('/:name', function(req, res, next){
        res.send(req.params.name);
      });

      request(app)
      .get('/foo%2Fbar')
      .expect('foo/bar', done);
    })

it('-79-should not accept params in malformed paths', function(done) {
      var app = express();

      app.get('/:name', function(req, res, next){
        res.send(req.params.name);
      });

      request(app)
      .get('/%foobar')
      .expect(400, done);
    })

it('-80-should not decode spaces', function(done) {
      var app = express();

      app.get('/:name', function(req, res, next){
        res.send(req.params.name);
      });

      request(app)
      .get('/foo+bar')
      .expect('foo+bar', done);
    })

it('-81-should work with unicode', function(done) {
      var app = express();

      app.get('/:name', function(req, res, next){
        res.send(req.params.name);
      });

      request(app)
      .get('/%ce%b1')
      .expect('\u03b1', done);
    })
  })

it('-82-should be .use()able', function(done){
    var app = express();

    var calls = [];

    app.use(function(req, res, next){
      calls.push('before');
      next();
    });

    app.get('/', function(req, res, next){
      calls.push('GET /')
      next();
    });

    app.use(function(req, res, next){
      calls.push('after');
      res.end();
    });

    request(app)
    .get('/')
    .end(function(res){
      calls.should.eql(['before', 'GET /', 'after'])
      done();
    })
  })

  describe('when given a regexp', function(){
it('-83-should match the pathname only', function(done){
      var app = express();

      app.get(/^\/user\/[0-9]+$/, function(req, res){
        res.end('user');
      });

      request(app)
      .get('/user/12?foo=bar')
      .expect('user', done);
    })

it('-84-should populate req.params with the captures', function(done){
      var app = express();

      app.get(/^\/user\/([0-9]+)\/(view|edit)?$/, function(req, res){
        var id = req.params[0]
          , op = req.params[1];
        res.end(op + 'ing user ' + id);
      });

      request(app)
      .get('/user/10/edit')
      .expect('editing user 10', done);
    })
  })

  describe('case sensitivity', function(){
it('-85-should be disabled by default', function(done){
      var app = express();

      app.get('/user', function(req, res){
        res.end('tj');
      });

      request(app)
      .get('/USER')
      .expect('tj', done);
    })

    describe('when "case sensitive routing" is enabled', function(){
it('-86-should match identical casing', function(done){
        var app = express();

        app.enable('case sensitive routing');

        app.get('/uSer', function(req, res){
          res.end('tj');
        });

        request(app)
        .get('/uSer')
        .expect('tj', done);
      })

it('-87-should not match otherwise', function(done){
        var app = express();

        app.enable('case sensitive routing');

        app.get('/uSer', function(req, res){
          res.end('tj');
        });

        request(app)
        .get('/user')
        .expect(404, done);
      })
    })
  })

  describe('params', function(){
it('-88-should overwrite existing req.params by default', function(done){
      var app = express();
      var router = new express.Router();

      router.get('/:action', function(req, res){
        res.send(req.params);
      });

      app.use('/user/:user', router);

      request(app)
      .get('/user/1/get')
      .expect(200, '{"action":"get"}', done);
    })

it('-89-should allow merging existing req.params', function(done){
      var app = express();
      var router = new express.Router({ mergeParams: true });

      router.get('/:action', function(req, res){
        var keys = Object.keys(req.params).sort();
        res.send(keys.map(function(k){ return [k, req.params[k]] }));
      });

      app.use('/user/:user', router);

      request(app)
      .get('/user/tj/get')
      .expect(200, '[["action","get"],["user","tj"]]', done);
    })

it('-90-should use params from router', function(done){
      var app = express();
      var router = new express.Router({ mergeParams: true });

      router.get('/:thing', function(req, res){
        var keys = Object.keys(req.params).sort();
        res.send(keys.map(function(k){ return [k, req.params[k]] }));
      });

      app.use('/user/:thing', router);

      request(app)
      .get('/user/tj/get')
      .expect(200, '[["thing","get"]]', done);
    })

it('-91-should merge numeric indices req.params', function(done){
      var app = express();
      var router = new express.Router({ mergeParams: true });

      router.get('/*.*', function(req, res){
        var keys = Object.keys(req.params).sort();
        res.send(keys.map(function(k){ return [k, req.params[k]] }));
      });

      app.use('/user/id:(\\d+)', router);

      request(app)
      .get('/user/id:10/profile.json')
      .expect(200, '[["0","10"],["1","profile"],["2","json"]]', done);
    })

it('-92-should merge numeric indices req.params when more in parent', function(done){
      var app = express();
      var router = new express.Router({ mergeParams: true });

      router.get('/*', function(req, res){
        var keys = Object.keys(req.params).sort();
        res.send(keys.map(function(k){ return [k, req.params[k]] }));
      });

      app.use('/user/id:(\\d+)/name:(\\w+)', router);

      request(app)
      .get('/user/id:10/name:tj/profile')
      .expect(200, '[["0","10"],["1","tj"],["2","profile"]]', done);
    })

it('-93-should merge numeric indices req.params when parent has same number', function(done){
      var app = express();
      var router = new express.Router({ mergeParams: true });

      router.get('/name:(\\w+)', function(req, res){
        var keys = Object.keys(req.params).sort();
        res.send(keys.map(function(k){ return [k, req.params[k]] }));
      });

      app.use('/user/id:(\\d+)', router);

      request(app)
      .get('/user/id:10/name:tj')
      .expect(200, '[["0","10"],["1","tj"]]', done);
    })

it('-94-should ignore invalid incoming req.params', function(done){
      var app = express();
      var router = new express.Router({ mergeParams: true });

      router.get('/:name', function(req, res){
        var keys = Object.keys(req.params).sort();
        res.send(keys.map(function(k){ return [k, req.params[k]] }));
      });

      app.use('/user/', function (req, res, next) {
        req.params = 3; // wat?
        router(req, res, next);
      });

      request(app)
      .get('/user/tj')
      .expect(200, '[["name","tj"]]', done);
    })

it('-95-should restore req.params', function(done){
      var app = express();
      var router = new express.Router({ mergeParams: true });

      router.get('/user:(\\w+)/*', function (req, res, next) {
        next();
      });

      app.use('/user/id:(\\d+)', function (req, res, next) {
        router(req, res, function (err) {
          var keys = Object.keys(req.params).sort();
          res.send(keys.map(function(k){ return [k, req.params[k]] }));
        });
      });

      request(app)
      .get('/user/id:42/user:tj/profile')
      .expect(200, '[["0","42"]]', done);
    })
  })

  describe('trailing slashes', function(){
it('-96-should be optional by default', function(done){
      var app = express();

      app.get('/user', function(req, res){
        res.end('tj');
      });

      request(app)
      .get('/user/')
      .expect('tj', done);
    })

    describe('when "strict routing" is enabled', function(){
it('-97-should match trailing slashes', function(done){
        var app = express();

        app.enable('strict routing');

        app.get('/user/', function(req, res){
          res.end('tj');
        });

        request(app)
        .get('/user/')
        .expect('tj', done);
      })

it('-98-should pass-though middleware', function(done){
        var app = express();

        app.enable('strict routing');

        app.use(function (req, res, next) {
          res.setHeader('x-middleware', 'true');
          next();
        });

        app.get('/user/', function(req, res){
          res.end('tj');
        });

        request(app)
        .get('/user/')
        .expect('x-middleware', 'true')
        .expect(200, 'tj', done);
      })

it('-99-should pass-though mounted middleware', function(done){
        var app = express();

        app.enable('strict routing');

        app.use('/user/', function (req, res, next) {
          res.setHeader('x-middleware', 'true');
          next();
        });

        app.get('/user/test/', function(req, res){
          res.end('tj');
        });

        request(app)
        .get('/user/test/')
        .expect('x-middleware', 'true')
        .expect(200, 'tj', done);
      })

it('-100-should match no slashes', function(done){
        var app = express();

        app.enable('strict routing');

        app.get('/user', function(req, res){
          res.end('tj');
        });

        request(app)
        .get('/user')
        .expect('tj', done);
      })

it('-101-should match middleware when omitting the trailing slash', function(done){
        var app = express();

        app.enable('strict routing');

        app.use('/user/', function(req, res){
          res.end('tj');
        });

        request(app)
        .get('/user')
        .expect(200, 'tj', done);
      })

it('-102-should match middleware', function(done){
        var app = express();

        app.enable('strict routing');

        app.use('/user', function(req, res){
          res.end('tj');
        });

        request(app)
        .get('/user')
        .expect(200, 'tj', done);
      })

it('-103-should match middleware when adding the trailing slash', function(done){
        var app = express();

        app.enable('strict routing');

        app.use('/user', function(req, res){
          res.end('tj');
        });

        request(app)
        .get('/user/')
        .expect(200, 'tj', done);
      })

it('-104-should fail when omitting the trailing slash', function(done){
        var app = express();

        app.enable('strict routing');

        app.get('/user/', function(req, res){
          res.end('tj');
        });

        request(app)
        .get('/user')
        .expect(404, done);
      })

it('-105-should fail when adding the trailing slash', function(done){
        var app = express();

        app.enable('strict routing');

        app.get('/user', function(req, res){
          res.end('tj');
        });

        request(app)
        .get('/user/')
        .expect(404, done);
      })
    })
  })

it('-106-should allow escaped regexp', function(done){
    var app = express();

    app.get('/user/\\d+', function(req, res){
      res.end('woot');
    });

    request(app)
    .get('/user/10')
    .expect(200, function (err) {
      if (err) return done(err)
      request(app)
      .get('/user/tj')
      .expect(404, done);
    });
  })

it('-107-should allow literal "."', function(done){
    var app = express();

    app.get('/api/users/:from..:to', function(req, res){
      var from = req.params.from
        , to = req.params.to;

      res.end('users from ' + from + ' to ' + to);
    });

    request(app)
    .get('/api/users/1..50')
    .expect('users from 1 to 50', done);
  })

  describe('*', function(){
it('-108-should capture everything', function (done) {
      var app = express()

      app.get('*', function (req, res) {
        res.end(req.params[0])
      })

      request(app)
      .get('/user/tobi.json')
      .expect('/user/tobi.json', done)
    })

it('-109-should decore the capture', function (done) {
      var app = express()

      app.get('*', function (req, res) {
        res.end(req.params[0])
      })

      request(app)
      .get('/user/tobi%20and%20loki.json')
      .expect('/user/tobi and loki.json', done)
    })

it('-110-should denote a greedy capture group', function(done){
      var app = express();

      app.get('/user/*.json', function(req, res){
        res.end(req.params[0]);
      });

      request(app)
      .get('/user/tj.json')
      .expect('tj', done);
    })

it('-111-should work with several', function(done){
      var app = express();

      app.get('/api/*.*', function(req, res){
        var resource = req.params[0]
          , format = req.params[1];
        res.end(resource + ' as ' + format);
      });

      request(app)
      .get('/api/users/foo.bar.json')
      .expect('users/foo.bar as json', done);
    })

it('-112-should work cross-segment', function(done){
      var app = express();

      app.get('/api*', function(req, res){
        res.send(req.params[0]);
      });

      request(app)
      .get('/api')
      .expect('', function(){
        request(app)
        .get('/api/hey')
        .expect('/hey', done);
      });
    })

it('-113-should allow naming', function(done){
      var app = express();

      app.get('/api/:resource(*)', function(req, res){
        var resource = req.params.resource;
        res.end(resource);
      });

      request(app)
      .get('/api/users/0.json')
      .expect('users/0.json', done);
    })

it('-114-should not be greedy immediately after param', function(done){
      var app = express();

      app.get('/user/:user*', function(req, res){
        res.end(req.params.user);
      });

      request(app)
      .get('/user/122')
      .expect('122', done);
    })

it('-115-should eat everything after /', function(done){
      var app = express();

      app.get('/user/:user*', function(req, res){
        res.end(req.params.user);
      });

      request(app)
      .get('/user/122/aaa')
      .expect('122', done);
    })

it('-116-should span multiple segments', function(done){
      var app = express();

      app.get('/file/*', function(req, res){
        res.end(req.params[0]);
      });

      request(app)
      .get('/file/javascripts/jquery.js')
      .expect('javascripts/jquery.js', done);
    })

it('-117-should be optional', function(done){
      var app = express();

      app.get('/file/*', function(req, res){
        res.end(req.params[0]);
      });

      request(app)
      .get('/file/')
      .expect('', done);
    })

it('-118-should require a preceding /', function(done){
      var app = express();

      app.get('/file/*', function(req, res){
        res.end(req.params[0]);
      });

      request(app)
      .get('/file')
      .expect(404, done);
    })

it('-119-should keep correct parameter indexes', function(done){
      var app = express();

      app.get('/*/user/:id', function (req, res) {
        res.send(req.params);
      });

      request(app)
      .get('/1/user/2')
      .expect(200, '{"0":"1","id":"2"}', done);
    })

it('-120-should work within arrays', function(done){
      var app = express();

      app.get(['/user/:id', '/foo/*', '/:bar'], function (req, res) {
        res.send(req.params.bar);
      });

      request(app)
      .get('/test')
      .expect(200, 'test', done);
    })
  })

  describe(':name', function(){
it('-121-should denote a capture group', function(done){
      var app = express();

      app.get('/user/:user', function(req, res){
        res.end(req.params.user);
      });

      request(app)
      .get('/user/tj')
      .expect('tj', done);
    })

it('-122-should match a single segment only', function(done){
      var app = express();

      app.get('/user/:user', function(req, res){
        res.end(req.params.user);
      });

      request(app)
      .get('/user/tj/edit')
      .expect(404, done);
    })

it('-123-should allow several capture groups', function(done){
      var app = express();

      app.get('/user/:user/:op', function(req, res){
        res.end(req.params.op + 'ing ' + req.params.user);
      });

      request(app)
      .get('/user/tj/edit')
      .expect('editing tj', done);
    })

it('-124-should work following a partial capture group', function(done){
      var app = express();
      var cb = after(2, done);

      app.get('/user(s)?/:user/:op', function(req, res){
        res.end(req.params.op + 'ing ' + req.params.user + (req.params[0] ? ' (old)' : ''));
      });

      request(app)
      .get('/user/tj/edit')
      .expect('editing tj', cb);

      request(app)
      .get('/users/tj/edit')
      .expect('editing tj (old)', cb);
    })

it('-125-should work inside literal parenthesis', function(done){
      var app = express();

      app.get('/:user\\(:op\\)', function(req, res){
        res.end(req.params.op + 'ing ' + req.params.user);
      });

      request(app)
      .get('/tj(edit)')
      .expect('editing tj', done);
    })

it('-126-should work in array of paths', function(done){
      var app = express();
      var cb = after(2, done);

      app.get(['/user/:user/poke', '/user/:user/pokes'], function(req, res){
        res.end('poking ' + req.params.user);
      });

      request(app)
      .get('/user/tj/poke')
      .expect('poking tj', cb);

      request(app)
      .get('/user/tj/pokes')
      .expect('poking tj', cb);
    })
  })

  describe(':name?', function(){
it('-127-should denote an optional capture group', function(done){
      var app = express();

      app.get('/user/:user/:op?', function(req, res){
        var op = req.params.op || 'view';
        res.end(op + 'ing ' + req.params.user);
      });

      request(app)
      .get('/user/tj')
      .expect('viewing tj', done);
    })

it('-128-should populate the capture group', function(done){
      var app = express();

      app.get('/user/:user/:op?', function(req, res){
        var op = req.params.op || 'view';
        res.end(op + 'ing ' + req.params.user);
      });

      request(app)
      .get('/user/tj/edit')
      .expect('editing tj', done);
    })
  })

  describe('.:name', function(){
it('-129-should denote a format', function(done){
      var app = express();

      app.get('/:name.:format', function(req, res){
        res.end(req.params.name + ' as ' + req.params.format);
      });

      request(app)
      .get('/foo.json')
      .expect('foo as json', function(){
        request(app)
        .get('/foo')
        .expect(404, done);
      });
    })
  })

  describe('.:name?', function(){
it('-130-should denote an optional format', function(done){
      var app = express();

      app.get('/:name.:format?', function(req, res){
        res.end(req.params.name + ' as ' + (req.params.format || 'html'));
      });

      request(app)
      .get('/foo')
      .expect('foo as html', function(){
        request(app)
        .get('/foo.json')
        .expect('foo as json', done);
      });
    })
  })

  describe('when next() is called', function(){
it('-131-should continue lookup', function(done){
      var app = express()
        , calls = [];

      app.get('/foo/:bar?', function(req, res, next){
        calls.push('/foo/:bar?');
        next();
      });

      app.get('/bar', function(req, res){
        assert(0);
      });

      app.get('/foo', function(req, res, next){
        calls.push('/foo');
        next();
      });

      app.get('/foo', function(req, res, next){
        calls.push('/foo 2');
        res.end('done');
      });

      request(app)
      .get('/foo')
      .expect('done', function(){
        calls.should.eql(['/foo/:bar?', '/foo', '/foo 2']);
        done();
      })
    })
  })

  describe('when next("route") is called', function(){
it('-132-should jump to next route', function(done){
      var app = express()

      function fn(req, res, next){
        res.set('X-Hit', '1')
        next('route')
      }

      app.get('/foo', fn, function(req, res, next){
        res.end('failure')
      });

      app.get('/foo', function(req, res){
        res.end('success')
      })

      request(app)
      .get('/foo')
      .expect('X-Hit', '1')
      .expect(200, 'success', done)
    })
  })

  describe('when next("router") is called', function () {
it('-133-should jump out of router', function (done) {
      var app = express()
      var router = express.Router()

      function fn (req, res, next) {
        res.set('X-Hit', '1')
        next('router')
      }

      router.get('/foo', fn, function (req, res, next) {
        res.end('failure')
      })

      router.get('/foo', function (req, res, next) {
        res.end('failure')
      })

      app.use(router)

      app.get('/foo', function (req, res) {
        res.end('success')
      })

      request(app)
      .get('/foo')
      .expect('X-Hit', '1')
      .expect(200, 'success', done)
    })
  })

  describe('when next(err) is called', function(){
it('-134-should break out of app.router', function(done){
      var app = express()
        , calls = [];

      app.get('/foo/:bar?', function(req, res, next){
        calls.push('/foo/:bar?');
        next();
      });

      app.get('/bar', function(req, res){
        assert(0);
      });

      app.get('/foo', function(req, res, next){
        calls.push('/foo');
        next(new Error('fail'));
      });

      app.get('/foo', function(req, res, next){
        assert(0);
      });

      app.use(function(err, req, res, next){
        res.end(err.message);
      })

      request(app)
      .get('/foo')
      .expect('fail', function(){
        calls.should.eql(['/foo/:bar?', '/foo']);
        done();
      })
    })

it('-135-should call handler in same route, if exists', function(done){
      var app = express();

      function fn1(req, res, next) {
        next(new Error('boom!'));
      }

      function fn2(req, res, next) {
        res.send('foo here');
      }

      function fn3(err, req, res, next) {
        res.send('route go ' + err.message);
      }

      app.get('/foo', fn1, fn2, fn3);

      app.use(function (err, req, res, next) {
        res.end('error!');
      })

      request(app)
      .get('/foo')
      .expect('route go boom!', done)
    })
  })

it('-136-should allow rewriting of the url', function(done){
    var app = express();

    app.get('/account/edit', function(req, res, next){
      req.user = { id: 12 }; // faux authenticated user
      req.url = '/user/' + req.user.id + '/edit';
      next();
    });

    app.get('/user/:id/edit', function(req, res){
      res.send('editing user ' + req.params.id);
    });

    request(app)
    .get('/account/edit')
    .expect('editing user 12', done);
  })

it('-137-should run in order added', function(done){
    var app = express();
    var path = [];

    app.get('*', function(req, res, next){
      path.push(0);
      next();
    });

    app.get('/user/:id', function(req, res, next){
      path.push(1);
      next();
    });

    app.use(function(req, res, next){
      path.push(2);
      next();
    });

    app.all('/user/:id', function(req, res, next){
      path.push(3);
      next();
    });

    app.get('*', function(req, res, next){
      path.push(4);
      next();
    });

    app.use(function(req, res, next){
      path.push(5);
      res.end(path.join(','))
    });

    request(app)
    .get('/user/1')
    .expect(200, '0,1,2,3,4,5', done);
  })

it('-138-should be chainable', function(){
    var app = express();
    app.get('/', function(){}).should.equal(app);
  })
})
