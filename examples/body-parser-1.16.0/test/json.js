
var assert = require('assert')
var http = require('http')
var request = require('supertest')

var bodyParser = require('..')

describe('bodyParser.json()', function () {
it('-41-should parse JSON', function (done) {
    request(createServer())
    .post('/')
    .set('Content-Type', 'application/json')
    .send('{"user":"tobi"}')
    .expect(200, '{"user":"tobi"}', done)
  })

it('-42-should fail gracefully', function (done) {
    request(createServer())
    .post('/')
    .set('Content-Type', 'application/json')
    .send('{"user"')
    .expect(400, /unexpected end/i, done)
  })

it('-43-should handle Content-Length: 0', function (done) {
    request(createServer())
    .get('/')
    .set('Content-Type', 'application/json')
    .set('Content-Length', '0')
    .expect(200, '{}', done)
  })

it('-44-should handle empty message-body', function (done) {
    request(createServer())
    .get('/')
    .set('Content-Type', 'application/json')
    .set('Transfer-Encoding', 'chunked')
    .expect(200, '{}', done)
  })

it('-45-should handle no message-body', function (done) {
    request(createServer())
    .get('/')
    .set('Content-Type', 'application/json')
    .unset('Transfer-Encoding')
    .expect(200, '{}', done)
  })

it('-46-should 400 on malformed JSON', function (done) {
    request(createServer())
    .post('/')
    .set('Content-Type', 'application/json')
    .send('{:')
    .expect(400, /unexpected token/i, done)
  })

it('-47-should 400 when invalid content-length', function (done) {
    var jsonParser = bodyParser.json()
    var server = createServer(function (req, res, next) {
      req.headers['content-length'] = '20' // bad length
      jsonParser(req, res, next)
    })

    request(server)
    .post('/')
    .set('Content-Type', 'application/json')
    .send('{"str":')
    .expect(400, /content length/, done)
  })

it('-48-should handle duplicated middleware', function (done) {
    var jsonParser = bodyParser.json()
    var server = createServer(function (req, res, next) {
      jsonParser(req, res, function (err) {
        if (err) return next(err)
        jsonParser(req, res, next)
      })
    })

    request(server)
    .post('/')
    .set('Content-Type', 'application/json')
    .send('{"user":"tobi"}')
    .expect(200, '{"user":"tobi"}', done)
  })

  describe('when strict is false', function () {
it('-49-should parse primitives', function (done) {
      request(createServer({ strict: false }))
      .post('/')
      .set('Content-Type', 'application/json')
      .send('true')
      .expect(200, 'true', done)
    })
  })

  describe('when strict is true', function () {
    var server
    before(function () {
      server = createServer({ strict: true })
    })

it('-50-should not parse primitives', function (done) {
      request(server)
      .post('/')
      .set('Content-Type', 'application/json')
      .send('true')
      .expect(400, /unexpected token/i, done)
    })

it('-51-should allow leading whitespaces in JSON', function (done) {
      request(server)
      .post('/')
      .set('Content-Type', 'application/json')
      .send('   { "user": "tobi" }')
      .expect(200, '{"user":"tobi"}', done)
    })
  })

  describe('by default', function () {
it('-52-should 400 on primitives', function (done) {
      request(createServer())
      .post('/')
      .set('Content-Type', 'application/json')
      .send('true')
      .expect(400, /unexpected token/i, done)
    })
  })

  describe('with limit option', function () {
it('-53-should 413 when over limit with Content-Length', function (done) {
      var buf = allocBuffer(1024, '.')
      request(createServer({ limit: '1kb' }))
      .post('/')
      .set('Content-Type', 'application/json')
      .set('Content-Length', '1034')
      .send(JSON.stringify({ str: buf.toString() }))
      .expect(413, done)
    })

it('-54-should 413 when over limit with chunked encoding', function (done) {
      var buf = allocBuffer(1024, '.')
      var server = createServer({ limit: '1kb' })
      var test = request(server).post('/')
      test.set('Content-Type', 'application/json')
      test.set('Transfer-Encoding', 'chunked')
      test.write('{"str":')
      test.write('"' + buf.toString() + '"}')
      test.expect(413, done)
    })

it('-55-should accept number of bytes', function (done) {
      var buf = allocBuffer(1024, '.')
      request(createServer({ limit: 1024 }))
      .post('/')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({ str: buf.toString() }))
      .expect(413, done)
    })

it('-56-should not change when options altered', function (done) {
      var buf = allocBuffer(1024, '.')
      var options = { limit: '1kb' }
      var server = createServer(options)

      options.limit = '100kb'

      request(server)
      .post('/')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({ str: buf.toString() }))
      .expect(413, done)
    })

it('-57-should not hang response', function (done) {
      var buf = allocBuffer(10240, '.')
      var server = createServer({ limit: '8kb' })
      var test = request(server).post('/')
      test.set('Content-Type', 'application/json')
      test.write(buf)
      test.write(buf)
      test.write(buf)
      test.expect(413, done)
    })
  })

  describe('with inflate option', function () {
    describe('when false', function () {
      var server
      before(function () {
        server = createServer({ inflate: false })
      })

it('-58-should not accept content-encoding', function (done) {
        var test = request(server).post('/')
        test.set('Content-Encoding', 'gzip')
        test.set('Content-Type', 'application/json')
        test.write(new Buffer('1f8b080000000000000bab56ca4bcc4d55b2527ab16e97522d00515be1cc0e000000', 'hex'))
        test.expect(415, 'content encoding unsupported', done)
      })
    })

    describe('when true', function () {
      var server
      before(function () {
        server = createServer({ inflate: true })
      })

it('-59-should accept content-encoding', function (done) {
        var test = request(server).post('/')
        test.set('Content-Encoding', 'gzip')
        test.set('Content-Type', 'application/json')
        test.write(new Buffer('1f8b080000000000000bab56ca4bcc4d55b2527ab16e97522d00515be1cc0e000000', 'hex'))
        test.expect(200, '{"name":"论"}', done)
      })
    })
  })

  describe('with type option', function () {
    describe('when "application/vnd.api+json"', function () {
      var server
      before(function () {
        server = createServer({ type: 'application/vnd.api+json' })
      })

it('-60-should parse JSON for custom type', function (done) {
        request(server)
        .post('/')
        .set('Content-Type', 'application/vnd.api+json')
        .send('{"user":"tobi"}')
        .expect(200, '{"user":"tobi"}', done)
      })

it('-61-should ignore standard type', function (done) {
        request(server)
        .post('/')
        .set('Content-Type', 'application/json')
        .send('{"user":"tobi"}')
        .expect(200, '{}', done)
      })
    })

    describe('when a function', function () {
it('-62-should parse when truthy value returned', function (done) {
        var server = createServer({ type: accept })

        function accept (req) {
          return req.headers['content-type'] === 'application/vnd.api+json'
        }

        request(server)
        .post('/')
        .set('Content-Type', 'application/vnd.api+json')
        .send('{"user":"tobi"}')
        .expect(200, '{"user":"tobi"}', done)
      })

it('-63-should work without content-type', function (done) {
        var server = createServer({ type: accept })

        function accept (req) {
          return true
        }

        var test = request(server).post('/')
        test.write('{"user":"tobi"}')
        test.expect(200, '{"user":"tobi"}', done)
      })

it('-64-should not invoke without a body', function (done) {
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
it('-65-should assert value if function', function () {
      assert.throws(createServer.bind(null, { verify: 'lol' }),
        /TypeError: option verify must be function/)
    })

it('-66-should error from verify', function (done) {
      var server = createServer({verify: function (req, res, buf) {
        if (buf[0] === 0x5b) throw new Error('no arrays')
      }})

      request(server)
      .post('/')
      .set('Content-Type', 'application/json')
      .send('["tobi"]')
      .expect(403, 'no arrays', done)
    })

it('-67-should allow custom codes', function (done) {
      var server = createServer({verify: function (req, res, buf) {
        if (buf[0] !== 0x5b) return
        var err = new Error('no arrays')
        err.status = 400
        throw err
      }})

      request(server)
      .post('/')
      .set('Content-Type', 'application/json')
      .send('["tobi"]')
      .expect(400, 'no arrays', done)
    })

it('-68-should allow pass-through', function (done) {
      var server = createServer({verify: function (req, res, buf) {
        if (buf[0] === 0x5b) throw new Error('no arrays')
      }})

      request(server)
      .post('/')
      .set('Content-Type', 'application/json')
      .send('{"user":"tobi"}')
      .expect(200, '{"user":"tobi"}', done)
    })

it('-69-should work with different charsets', function (done) {
      var server = createServer({verify: function (req, res, buf) {
        if (buf[0] === 0x5b) throw new Error('no arrays')
      }})

      var test = request(server).post('/')
      test.set('Content-Type', 'application/json; charset=utf-16')
      test.write(new Buffer('feff007b0022006e0061006d00650022003a00228bba0022007d', 'hex'))
      test.expect(200, '{"name":"论"}', done)
    })

it('-70-should 415 on unknown charset prior to verify', function (done) {
      var server = createServer({verify: function (req, res, buf) {
        throw new Error('unexpected verify call')
      }})

      var test = request(server).post('/')
      test.set('Content-Type', 'application/json; charset=x-bogus')
      test.write(new Buffer('00000000', 'hex'))
      test.expect(415, 'unsupported charset "X-BOGUS"', done)
    })
  })

  describe('charset', function () {
    var server
    before(function () {
      server = createServer()
    })

it('-71-should parse utf-8', function (done) {
      var test = request(server).post('/')
      test.set('Content-Type', 'application/json; charset=utf-8')
      test.write(new Buffer('7b226e616d65223a22e8aeba227d', 'hex'))
      test.expect(200, '{"name":"论"}', done)
    })

it('-72-should parse utf-16', function (done) {
      var test = request(server).post('/')
      test.set('Content-Type', 'application/json; charset=utf-16')
      test.write(new Buffer('feff007b0022006e0061006d00650022003a00228bba0022007d', 'hex'))
      test.expect(200, '{"name":"论"}', done)
    })

it('-73-should parse when content-length != char length', function (done) {
      var test = request(server).post('/')
      test.set('Content-Type', 'application/json; charset=utf-8')
      test.set('Content-Length', '13')
      test.write(new Buffer('7b2274657374223a22c3a5227d', 'hex'))
      test.expect(200, '{"test":"å"}', done)
    })

it('-74-should default to utf-8', function (done) {
      var test = request(server).post('/')
      test.set('Content-Type', 'application/json')
      test.write(new Buffer('7b226e616d65223a22e8aeba227d', 'hex'))
      test.expect(200, '{"name":"论"}', done)
    })

it('-75-should fail on unknown charset', function (done) {
      var test = request(server).post('/')
      test.set('Content-Type', 'application/json; charset=koi8-r')
      test.write(new Buffer('7b226e616d65223a22cec5d4227d', 'hex'))
      test.expect(415, 'unsupported charset "KOI8-R"', done)
    })
  })

  describe('encoding', function () {
    var server
    before(function () {
      server = createServer({ limit: '1kb' })
    })

it('-76-should parse without encoding', function (done) {
      var test = request(server).post('/')
      test.set('Content-Type', 'application/json')
      test.write(new Buffer('7b226e616d65223a22e8aeba227d', 'hex'))
      test.expect(200, '{"name":"论"}', done)
    })

it('-77-should support identity encoding', function (done) {
      var test = request(server).post('/')
      test.set('Content-Encoding', 'identity')
      test.set('Content-Type', 'application/json')
      test.write(new Buffer('7b226e616d65223a22e8aeba227d', 'hex'))
      test.expect(200, '{"name":"论"}', done)
    })

it('-78-should support gzip encoding', function (done) {
      var test = request(server).post('/')
      test.set('Content-Encoding', 'gzip')
      test.set('Content-Type', 'application/json')
      test.write(new Buffer('1f8b080000000000000bab56ca4bcc4d55b2527ab16e97522d00515be1cc0e000000', 'hex'))
      test.expect(200, '{"name":"论"}', done)
    })

it('-79-should support deflate encoding', function (done) {
      var test = request(server).post('/')
      test.set('Content-Encoding', 'deflate')
      test.set('Content-Type', 'application/json')
      test.write(new Buffer('789cab56ca4bcc4d55b2527ab16e97522d00274505ac', 'hex'))
      test.expect(200, '{"name":"论"}', done)
    })

it('-80-should be case-insensitive', function (done) {
      var test = request(server).post('/')
      test.set('Content-Encoding', 'GZIP')
      test.set('Content-Type', 'application/json')
      test.write(new Buffer('1f8b080000000000000bab56ca4bcc4d55b2527ab16e97522d00515be1cc0e000000', 'hex'))
      test.expect(200, '{"name":"论"}', done)
    })

it('-81-should 415 on unknown encoding', function (done) {
      var test = request(server).post('/')
      test.set('Content-Encoding', 'nulls')
      test.set('Content-Type', 'application/json')
      test.write(new Buffer('000000000000', 'hex'))
      test.expect(415, 'unsupported content encoding "nulls"', done)
    })

it('-82-should 400 on malformed encoding', function (done) {
      var test = request(server).post('/')
      test.set('Content-Encoding', 'gzip')
      test.set('Content-Type', 'application/json')
      test.write(new Buffer('1f8b080000000000000bab56cc4d55b2527ab16e97522d00515be1cc0e000000', 'hex'))
      test.expect(400, done)
    })

it('-83-should 413 when inflated value exceeds limit', function (done) {
      // gzip'd data exceeds 1kb, but deflated below 1kb
      var test = request(server).post('/')
      test.set('Content-Encoding', 'gzip')
      test.set('Content-Type', 'application/json')
      test.write(new Buffer('1f8b080000000000000bedc1010d000000c2a0f74f6d0f071400000000000000', 'hex'))
      test.write(new Buffer('0000000000000000000000000000000000000000000000000000000000000000', 'hex'))
      test.write(new Buffer('0000000000000000004f0625b3b71650c30000', 'hex'))
      test.expect(413, done)
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

function createServer (opts) {
  var _bodyParser = typeof opts !== 'function'
    ? bodyParser.json(opts)
    : opts

  return http.createServer(function (req, res) {
    _bodyParser(req, res, function (err) {
      res.statusCode = err ? (err.status || 500) : 200
      res.end(err ? err.message : JSON.stringify(req.body))
    })
  })
}
