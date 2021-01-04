
var assert = require('assert')
var http = require('http')
var request = require('supertest')

var bodyParser = require('..')

describe('bodyParser.urlencoded()', function () {
  var server
  before(function () {
    server = createServer()
  })

it('-147-should parse x-www-form-urlencoded', function (done) {
    request(server)
    .post('/')
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .send('user=tobi')
    .expect(200, '{"user":"tobi"}', done)
  })

it('-148-should 400 when invalid content-length', function (done) {
    var urlencodedParser = bodyParser.urlencoded()
    var server = createServer(function (req, res, next) {
      req.headers['content-length'] = '20' // bad length
      urlencodedParser(req, res, next)
    })

    request(server)
    .post('/')
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .send('str=')
    .expect(400, /content length/, done)
  })

it('-149-should handle Content-Length: 0', function (done) {
    request(server)
    .post('/')
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .set('Content-Length', '0')
    .send('')
    .expect(200, '{}', done)
  })

it('-150-should handle empty message-body', function (done) {
    request(createServer({ limit: '1kb' }))
    .post('/')
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .set('Transfer-Encoding', 'chunked')
    .send('')
    .expect(200, '{}', done)
  })

it('-151-should handle duplicated middleware', function (done) {
    var urlencodedParser = bodyParser.urlencoded()
    var server = createServer(function (req, res, next) {
      urlencodedParser(req, res, function (err) {
        if (err) return next(err)
        urlencodedParser(req, res, next)
      })
    })

    request(server)
    .post('/')
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .send('user=tobi')
    .expect(200, '{"user":"tobi"}', done)
  })

it('-152-should parse extended syntax', function (done) {
    request(server)
    .post('/')
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .send('user[name][first]=Tobi')
    .expect(200, '{"user":{"name":{"first":"Tobi"}}}', done)
  })

  describe('with extended option', function () {
    describe('when false', function () {
      var server
      before(function () {
        server = createServer({ extended: false })
      })

it('-153-should not parse extended syntax', function (done) {
        request(server)
        .post('/')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send('user[name][first]=Tobi')
        .expect(200, '{"user[name][first]":"Tobi"}', done)
      })

it('-154-should parse multiple key instances', function (done) {
        request(server)
        .post('/')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send('user=Tobi&user=Loki')
        .expect(200, '{"user":["Tobi","Loki"]}', done)
      })
    })

    describe('when true', function () {
      var server
      before(function () {
        server = createServer({ extended: true })
      })

it('-155-should parse multiple key instances', function (done) {
        request(server)
        .post('/')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send('user=Tobi&user=Loki')
        .expect(200, '{"user":["Tobi","Loki"]}', done)
      })

it('-156-should parse extended syntax', function (done) {
        request(server)
        .post('/')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send('user[name][first]=Tobi')
        .expect(200, '{"user":{"name":{"first":"Tobi"}}}', done)
      })

it('-157-should parse parameters with dots', function (done) {
        request(server)
        .post('/')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send('user.name=Tobi')
        .expect(200, '{"user.name":"Tobi"}', done)
      })

it('-158-should parse fully-encoded extended syntax', function (done) {
        request(server)
        .post('/')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send('user%5Bname%5D%5Bfirst%5D=Tobi')
        .expect(200, '{"user":{"name":{"first":"Tobi"}}}', done)
      })

it('-159-should parse array index notation', function (done) {
        request(server)
        .post('/')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send('foo[0]=bar&foo[1]=baz')
        .expect(200, '{"foo":["bar","baz"]}', done)
      })

it('-160-should parse array index notation with large array', function (done) {
        var str = 'f[0]=0'

        for (var i = 1; i < 500; i++) {
          str += '&f[' + i + ']=' + i.toString(16)
        }

        request(server)
        .post('/')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send(str)
        .expect(function (res) {
          var obj = JSON.parse(res.text)
          assert.equal(Object.keys(obj).length, 1)
          assert.equal(Array.isArray(obj.f), true)
          assert.equal(obj.f.length, 500)
        })
        .expect(200, done)
      })

it('-161-should parse array of objects syntax', function (done) {
        request(server)
        .post('/')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send('foo[0][bar]=baz&foo[0][fizz]=buzz')
        .expect(200, '{"foo":[{"bar":"baz","fizz":"buzz"}]}', done)
      })

it('-162-should parse deep object', function (done) {
        var str = 'foo'

        for (var i = 0; i < 500; i++) {
          str += '[p]'
        }

        str += '=bar'

        request(server)
        .post('/')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send(str)
        .expect(function (res) {
          var obj = JSON.parse(res.text)
          assert.equal(Object.keys(obj).length, 1)
          assert.equal(typeof obj.foo, 'object')

          var depth = 0
          var ref = obj.foo
          while ((ref = ref.p)) { depth++ }
          assert.equal(depth, 500)
        })
        .expect(200, done)
      })
    })
  })

  describe('with inflate option', function () {
    describe('when false', function () {
      var server
      before(function () {
        server = createServer({ inflate: false })
      })

it('-163-should not accept content-encoding', function (done) {
        var test = request(server).post('/')
        test.set('Content-Encoding', 'gzip')
        test.set('Content-Type', 'application/x-www-form-urlencoded')
        test.write(new Buffer('1f8b080000000000000bcb4bcc4db57db16e170099a4bad608000000', 'hex'))
        test.expect(415, 'content encoding unsupported', done)
      })
    })

    describe('when true', function () {
      var server
      before(function () {
        server = createServer({ inflate: true })
      })

it('-164-should accept content-encoding', function (done) {
        var test = request(server).post('/')
        test.set('Content-Encoding', 'gzip')
        test.set('Content-Type', 'application/x-www-form-urlencoded')
        test.write(new Buffer('1f8b080000000000000bcb4bcc4db57db16e170099a4bad608000000', 'hex'))
        test.expect(200, '{"name":"论"}', done)
      })
    })
  })

  describe('with limit option', function () {
it('-165-should 413 when over limit with Content-Length', function (done) {
      var buf = allocBuffer(1024, '.')
      request(createServer({ limit: '1kb' }))
      .post('/')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Content-Length', '1028')
      .send('str=' + buf.toString())
      .expect(413, done)
    })

it('-166-should 413 when over limit with chunked encoding', function (done) {
      var buf = allocBuffer(1024, '.')
      var server = createServer({ limit: '1kb' })
      var test = request(server).post('/')
      test.set('Content-Type', 'application/x-www-form-urlencoded')
      test.set('Transfer-Encoding', 'chunked')
      test.write('str=')
      test.write(buf.toString())
      test.expect(413, done)
    })

it('-167-should accept number of bytes', function (done) {
      var buf = allocBuffer(1024, '.')
      request(createServer({ limit: 1024 }))
      .post('/')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send('str=' + buf.toString())
      .expect(413, done)
    })

it('-168-should not change when options altered', function (done) {
      var buf = allocBuffer(1024, '.')
      var options = { limit: '1kb' }
      var server = createServer(options)

      options.limit = '100kb'

      request(server)
      .post('/')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send('str=' + buf.toString())
      .expect(413, done)
    })

it('-169-should not hang response', function (done) {
      var buf = allocBuffer(10240, '.')
      var server = createServer({ limit: '8kb' })
      var test = request(server).post('/')
      test.set('Content-Type', 'application/x-www-form-urlencoded')
      test.write(buf)
      test.write(buf)
      test.write(buf)
      test.expect(413, done)
    })
  })

  describe('with parameterLimit option', function () {
    describe('with extended: false', function () {
it('-170-should reject 0', function () {
        assert.throws(createServer.bind(null, { extended: false, parameterLimit: 0 }),
          /TypeError: option parameterLimit must be a positive number/)
      })

it('-171-should reject string', function () {
        assert.throws(createServer.bind(null, { extended: false, parameterLimit: 'beep' }),
          /TypeError: option parameterLimit must be a positive number/)
      })

it('-172-should 413 if over limit', function (done) {
        request(createServer({ extended: false, parameterLimit: 10 }))
        .post('/')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send(createManyParams(11))
        .expect(413, /too many parameters/, done)
      })

it('-173-should work when at the limit', function (done) {
        request(createServer({ extended: false, parameterLimit: 10 }))
        .post('/')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send(createManyParams(10))
        .expect(expectKeyCount(10))
        .expect(200, done)
      })

it('-174-should work if number is floating point', function (done) {
        request(createServer({ extended: false, parameterLimit: 10.1 }))
        .post('/')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send(createManyParams(11))
        .expect(413, /too many parameters/, done)
      })

it('-175-should work with large limit', function (done) {
        request(createServer({ extended: false, parameterLimit: 5000 }))
        .post('/')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send(createManyParams(5000))
        .expect(expectKeyCount(5000))
        .expect(200, done)
      })

it('-176-should work with Infinity limit', function (done) {
        request(createServer({ extended: false, parameterLimit: Infinity }))
        .post('/')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send(createManyParams(10000))
        .expect(expectKeyCount(10000))
        .expect(200, done)
      })
    })

    describe('with extended: true', function () {
it('-177-should reject 0', function () {
        assert.throws(createServer.bind(null, { extended: true, parameterLimit: 0 }),
          /TypeError: option parameterLimit must be a positive number/)
      })

it('-178-should reject string', function () {
        assert.throws(createServer.bind(null, { extended: true, parameterLimit: 'beep' }),
          /TypeError: option parameterLimit must be a positive number/)
      })

it('-179-should 413 if over limit', function (done) {
        request(createServer({ extended: true, parameterLimit: 10 }))
        .post('/')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send(createManyParams(11))
        .expect(413, /too many parameters/, done)
      })

it('-180-should work when at the limit', function (done) {
        request(createServer({ extended: true, parameterLimit: 10 }))
        .post('/')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send(createManyParams(10))
        .expect(expectKeyCount(10))
        .expect(200, done)
      })

it('-181-should work if number is floating point', function (done) {
        request(createServer({ extended: true, parameterLimit: 10.1 }))
        .post('/')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send(createManyParams(11))
        .expect(413, /too many parameters/, done)
      })

it('-182-should work with large limit', function (done) {
        request(createServer({ extended: true, parameterLimit: 5000 }))
        .post('/')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send(createManyParams(5000))
        .expect(expectKeyCount(5000))
        .expect(200, done)
      })

it('-183-should work with Infinity limit', function (done) {
        request(createServer({ extended: true, parameterLimit: Infinity }))
        .post('/')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send(createManyParams(10000))
        .expect(expectKeyCount(10000))
        .expect(200, done)
      })
    })
  })

  describe('with type option', function () {
    describe('when "application/vnd.x-www-form-urlencoded"', function () {
      var server
      before(function () {
        server = createServer({ type: 'application/vnd.x-www-form-urlencoded' })
      })

it('-184-should parse for custom type', function (done) {
        request(server)
        .post('/')
        .set('Content-Type', 'application/vnd.x-www-form-urlencoded')
        .send('user=tobi')
        .expect(200, '{"user":"tobi"}', done)
      })

it('-185-should ignore standard type', function (done) {
        request(server)
        .post('/')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send('user=tobi')
        .expect(200, '{}', done)
      })
    })

    describe('when a function', function () {
it('-186-should parse when truthy value returned', function (done) {
        var server = createServer({ type: accept })

        function accept (req) {
          return req.headers['content-type'] === 'application/vnd.something'
        }

        request(server)
        .post('/')
        .set('Content-Type', 'application/vnd.something')
        .send('user=tobi')
        .expect(200, '{"user":"tobi"}', done)
      })

it('-187-should work without content-type', function (done) {
        var server = createServer({ type: accept })

        function accept (req) {
          return true
        }

        var test = request(server).post('/')
        test.write('user=tobi')
        test.expect(200, '{"user":"tobi"}', done)
      })

it('-188-should not invoke without a body', function (done) {
        var server = createServer({ type: accept })

        function accept (req) {
          throw new Error('oops!')
        }

        request(server)
        .get('/')
        .expect(200, done)
      })
    })
  })

  describe('with verify option', function () {
it('-189-should assert value if function', function () {
      assert.throws(createServer.bind(null, { verify: 'lol' }),
        /TypeError: option verify must be function/)
    })

it('-190-should error from verify', function (done) {
      var server = createServer({verify: function (req, res, buf) {
        if (buf[0] === 0x20) throw new Error('no leading space')
      }})

      request(server)
      .post('/')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send(' user=tobi')
      .expect(403, 'no leading space', done)
    })

it('-191-should allow custom codes', function (done) {
      var server = createServer({verify: function (req, res, buf) {
        if (buf[0] !== 0x20) return
        var err = new Error('no leading space')
        err.status = 400
        throw err
      }})

      request(server)
      .post('/')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send(' user=tobi')
      .expect(400, 'no leading space', done)
    })

it('-192-should allow pass-through', function (done) {
      var server = createServer({verify: function (req, res, buf) {
        if (buf[0] === 0x5b) throw new Error('no arrays')
      }})

      request(server)
      .post('/')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send('user=tobi')
      .expect(200, '{"user":"tobi"}', done)
    })

it('-193-should 415 on unknown charset prior to verify', function (done) {
      var server = createServer({verify: function (req, res, buf) {
        throw new Error('unexpected verify call')
      }})

      var test = request(server).post('/')
      test.set('Content-Type', 'application/x-www-form-urlencoded; charset=x-bogus')
      test.write(new Buffer('00000000', 'hex'))
      test.expect(415, 'unsupported charset "X-BOGUS"', done)
    })
  })

  describe('charset', function () {
    var server
    before(function () {
      server = createServer()
    })

it('-194-should parse utf-8', function (done) {
      var test = request(server).post('/')
      test.set('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8')
      test.write(new Buffer('6e616d653de8aeba', 'hex'))
      test.expect(200, '{"name":"论"}', done)
    })

it('-195-should parse when content-length != char length', function (done) {
      var test = request(server).post('/')
      test.set('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8')
      test.set('Content-Length', '7')
      test.write(new Buffer('746573743dc3a5', 'hex'))
      test.expect(200, '{"test":"å"}', done)
    })

it('-196-should default to utf-8', function (done) {
      var test = request(server).post('/')
      test.set('Content-Type', 'application/x-www-form-urlencoded')
      test.write(new Buffer('6e616d653de8aeba', 'hex'))
      test.expect(200, '{"name":"论"}', done)
    })

it('-197-should fail on unknown charset', function (done) {
      var test = request(server).post('/')
      test.set('Content-Type', 'application/x-www-form-urlencoded; charset=koi8-r')
      test.write(new Buffer('6e616d653dcec5d4', 'hex'))
      test.expect(415, 'unsupported charset "KOI8-R"', done)
    })
  })

  describe('encoding', function () {
    var server
    before(function () {
      server = createServer({ limit: '10kb' })
    })

it('-198-should parse without encoding', function (done) {
      var test = request(server).post('/')
      test.set('Content-Type', 'application/x-www-form-urlencoded')
      test.write(new Buffer('6e616d653de8aeba', 'hex'))
      test.expect(200, '{"name":"论"}', done)
    })

it('-199-should support identity encoding', function (done) {
      var test = request(server).post('/')
      test.set('Content-Encoding', 'identity')
      test.set('Content-Type', 'application/x-www-form-urlencoded')
      test.write(new Buffer('6e616d653de8aeba', 'hex'))
      test.expect(200, '{"name":"论"}', done)
    })

it('-200-should support gzip encoding', function (done) {
      var test = request(server).post('/')
      test.set('Content-Encoding', 'gzip')
      test.set('Content-Type', 'application/x-www-form-urlencoded')
      test.write(new Buffer('1f8b080000000000000bcb4bcc4db57db16e170099a4bad608000000', 'hex'))
      test.expect(200, '{"name":"论"}', done)
    })

it('-201-should support deflate encoding', function (done) {
      var test = request(server).post('/')
      test.set('Content-Encoding', 'deflate')
      test.set('Content-Type', 'application/x-www-form-urlencoded')
      test.write(new Buffer('789ccb4bcc4db57db16e17001068042f', 'hex'))
      test.expect(200, '{"name":"论"}', done)
    })

it('-202-should be case-insensitive', function (done) {
      var test = request(server).post('/')
      test.set('Content-Encoding', 'GZIP')
      test.set('Content-Type', 'application/x-www-form-urlencoded')
      test.write(new Buffer('1f8b080000000000000bcb4bcc4db57db16e170099a4bad608000000', 'hex'))
      test.expect(200, '{"name":"论"}', done)
    })

it('-203-should fail on unknown encoding', function (done) {
      var test = request(server).post('/')
      test.set('Content-Encoding', 'nulls')
      test.set('Content-Type', 'application/x-www-form-urlencoded')
      test.write(new Buffer('000000000000', 'hex'))
      test.expect(415, 'unsupported content encoding "nulls"', done)
    })
  })
})

function allocBuffer (size, fill) {
  if (Buffer.alloc) {
    return Buffer.alloc(size, fill)
  }

  var buf = new Buffer(size)
  buf.fill(fill)
  return buf
}

function createManyParams (count) {
  var str = ''

  if (count === 0) {
    return str
  }

  str += '0=0'

  for (var i = 1; i < count; i++) {
    var n = i.toString(36)
    str += '&' + n + '=' + n
  }

  return str
}

function createServer (opts) {
  var _bodyParser = typeof opts !== 'function'
    ? bodyParser.urlencoded(opts)
    : opts

  return http.createServer(function (req, res) {
    _bodyParser(req, res, function (err) {
      res.statusCode = err ? (err.status || 500) : 200
      res.end(err ? err.message : JSON.stringify(req.body))
    })
  })
}

function expectKeyCount (count) {
  return function (res) {
    assert.equal(Object.keys(JSON.parse(res.text)).length, count)
  }
}
