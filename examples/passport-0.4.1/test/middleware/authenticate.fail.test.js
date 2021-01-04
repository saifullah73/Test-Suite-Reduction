/* global describe, it, expect, before */
/* jshint expr: true */

var chai = require('chai')
  , authenticate = require('../../lib/middleware/authenticate')
  , Passport = require('../..').Passport;


describe('middleware/authenticate', function() {
  
  describe('fail', function() {
    function Strategy() {
    }
    Strategy.prototype.authenticate = function(req) {
      this.fail();
    };
    
    var passport = new Passport();
    passport.use('fail', new Strategy());
    
    var request, response;

    before(function(done) {
      chai.connect.use(authenticate(passport, 'fail'))
        .req(function(req) {
          request = req;
        })
        .end(function(res) {
          response = res;
          done();
        })
        .dispatch();
    });
    
it('-281-should not set user', function() {
      expect(request.user).to.be.undefined;
    });
    
it('-282-should respond', function() {
      expect(response.statusCode).to.equal(401);
      expect(response.getHeader('WWW-Authenticate')).to.be.undefined;
      expect(response.body).to.equal('Unauthorized');
    });
  });
  
  describe('fail with redirect', function() {
    function Strategy() {
    }
    Strategy.prototype.authenticate = function(req) {
      this.fail();
    };
    
    var passport = new Passport();
    passport.use('fail', new Strategy());
    
    var request, response;

    before(function(done) {
      chai.connect.use('express', authenticate(passport, 'fail', { failureRedirect: 'http://www.example.com/login' }))
        .req(function(req) {
          request = req;
        })
        .end(function(res) {
          response = res;
          done();
        })
        .dispatch();
    });
    
it('-283-should not set user', function() {
      expect(request.user).to.be.undefined;
    });
    
it('-284-should redirect', function() {
      expect(response.statusCode).to.equal(302);
      expect(response.getHeader('Location')).to.equal('http://www.example.com/login');
    });
  });
  
  describe('fail with challenge', function() {
    function Strategy() {
    }
    Strategy.prototype.authenticate = function(req) {
      this.fail('MOCK challenge');
    };
    
    var passport = new Passport();
    passport.use('fail', new Strategy());
    
    var request, response;

    before(function(done) {
      chai.connect.use(authenticate(passport, 'fail'))
        .req(function(req) {
          request = req;
        })
        .end(function(res) {
          response = res;
          done();
        })
        .dispatch();
    });
    
it('-285-should not set user', function() {
      expect(request.user).to.be.undefined;
    });
    
it('-286-should respond', function() {
      expect(response.statusCode).to.equal(401);
      expect(response.body).to.equal('Unauthorized');
    });
    
it('-287-should set authenticate header on response', function() {
      var val = response.getHeader('WWW-Authenticate');
      expect(val).to.be.an('array');
      expect(val).to.have.length(1);
      
      expect(val[0]).to.equal('MOCK challenge');
    });
  });
  
  describe('fail with challenge and status', function() {
    function Strategy() {
    }
    Strategy.prototype.authenticate = function(req) {
      this.fail('MOCK challenge', 403);
    };
    
    var passport = new Passport();
    passport.use('fail', new Strategy());
    
    var request, response;

    before(function(done) {
      chai.connect.use(authenticate(passport, 'fail'))
        .req(function(req) {
          request = req;
        })
        .end(function(res) {
          response = res;
          done();
        })
        .dispatch();
    });
    
it('-288-should not set user', function() {
      expect(request.user).to.be.undefined;
    });
    
it('-289-should respond', function() {
      expect(response.statusCode).to.equal(403);
      expect(response.getHeader('WWW-Authenticate')).to.be.undefined;
      expect(response.body).to.equal('Forbidden');
    });
  });
  
  describe('fail with status', function() {
    function Strategy() {
    }
    Strategy.prototype.authenticate = function(req) {
      this.fail(400);
    };
    
    var passport = new Passport();
    passport.use('fail', new Strategy());
    
    var request, response;

    before(function(done) {
      chai.connect.use(authenticate(passport, 'fail'))
        .req(function(req) {
          request = req;
        })
        .end(function(res) {
          response = res;
          done();
        })
        .dispatch();
    });
    
it('-290-should not set user', function() {
      expect(request.user).to.be.undefined;
    });
    
it('-291-should respond', function() {
      expect(response.statusCode).to.equal(400);
      expect(response.getHeader('WWW-Authenticate')).to.be.undefined;
      expect(response.body).to.equal('Bad Request');
    });
  });
  
  describe('fail with error', function() {
    function Strategy() {
    }
    Strategy.prototype.authenticate = function(req) {
      this.fail();
    };
    
    var passport = new Passport();
    passport.use('fail', new Strategy());
    
    var request, response, error;

    before(function(done) {
      chai.connect.use('express', authenticate(passport, 'fail', { failWithError: true }))
        .req(function(req) {
          request = req;
        })
        .res(function(res) {
          response = res;
        })
        .next(function(err) {
          error = err;
          done();
        })
        .dispatch();
    });
    
it('-292-should error', function() {
      expect(error).to.be.an.instanceOf(Error);
      expect(error.constructor.name).to.equal('AuthenticationError');
      expect(error.message).to.equal('Unauthorized');
      expect(error.status).to.equal(401);
    });
    
it('-293-should not set user', function() {
      expect(request.user).to.be.undefined;
    });
    
it('-294-should not set body of response', function() {
      expect(response.statusCode).to.equal(401);
      expect(response.getHeader('WWW-Authenticate')).to.be.undefined;
      expect(response.body).to.be.undefined;
    });
  });
  
  describe('fail with error, passing info to fail', function() {
    function Strategy() {
    }
    Strategy.prototype.authenticate = function(req) {
      this.fail({ message: 'Invalid credentials' });
    };
    
    var passport = new Passport();
    passport.use('fail', new Strategy());
    
    var request, response, error;

    before(function(done) {
      chai.connect.use('express', authenticate(passport, 'fail', { failWithError: true }))
        .req(function(req) {
          request = req;
        })
        .res(function(res) {
          response = res;
        })
        .next(function(err) {
          error = err;
          done();
        })
        .dispatch();
    });
    
it('-295-should error', function() {
      expect(error).to.be.an.instanceOf(Error);
      expect(error.constructor.name).to.equal('AuthenticationError');
      expect(error.message).to.equal('Unauthorized');
      expect(error.status).to.equal(401);
    });
    
it('-296-should not set user', function() {
      expect(request.user).to.be.undefined;
    });
    
it('-297-should not set body of response', function() {
      expect(response.statusCode).to.equal(401);
      expect(response.getHeader('WWW-Authenticate')).to.be.undefined;
      expect(response.body).to.be.undefined;
    });
  });
  
  describe('fail with error, passing info and status to fail', function() {
    function Strategy() {
    }
    Strategy.prototype.authenticate = function(req) {
      this.fail({ message: 'Multiple credentials' }, 400);
    };
    
    var passport = new Passport();
    passport.use('fail', new Strategy());
    
    var request, response, error;

    before(function(done) {
      chai.connect.use('express', authenticate(passport, 'fail', { failWithError: true }))
        .req(function(req) {
          request = req;
        })
        .res(function(res) {
          response = res;
        })
        .next(function(err) {
          error = err;
          done();
        })
        .dispatch();
    });
    
it('-298-should error', function() {
      expect(error).to.be.an.instanceOf(Error);
      expect(error.constructor.name).to.equal('AuthenticationError');
      expect(error.message).to.equal('Bad Request');
      expect(error.status).to.equal(400);
    });
    
it('-299-should not set user', function() {
      expect(request.user).to.be.undefined;
    });
    
it('-300-should not set body of response', function() {
      expect(response.statusCode).to.equal(400);
      expect(response.getHeader('WWW-Authenticate')).to.be.undefined;
      expect(response.body).to.be.undefined;
    });
  });
  
  describe('fail with error, passing challenge to fail', function() {
    function Strategy() {
    }
    Strategy.prototype.authenticate = function(req) {
      this.fail('Bearer challenge');
    };
    
    var passport = new Passport();
    passport.use('fail', new Strategy());
    
    var request, response, error;

    before(function(done) {
      chai.connect.use('express', authenticate(passport, 'fail', { failWithError: true }))
        .req(function(req) {
          request = req;
        })
        .res(function(res) {
          response = res;
        })
        .next(function(err) {
          error = err;
          done();
        })
        .dispatch();
    });
    
it('-301-should error', function() {
      expect(error).to.be.an.instanceOf(Error);
      expect(error.constructor.name).to.equal('AuthenticationError');
      expect(error.message).to.equal('Unauthorized');
      expect(error.status).to.equal(401);
    });
    
it('-302-should not set user', function() {
      expect(request.user).to.be.undefined;
    });
    
it('-303-should not set body of response', function() {
      expect(response.statusCode).to.equal(401);
      expect(response.body).to.be.undefined;
    });
    
it('-304-should set authenticate header on response', function() {
      var val = response.getHeader('WWW-Authenticate');
      expect(val).to.be.an('array');
      expect(val).to.have.length(1);
      
      expect(val[0]).to.equal('Bearer challenge');
    });
  });
  
  describe('fail with error, passing challenge and status to fail', function() {
    function Strategy() {
    }
    Strategy.prototype.authenticate = function(req) {
      this.fail('Bearer challenge', 403);
    };
    
    var passport = new Passport();
    passport.use('fail', new Strategy());
    
    var request, response, error;

    before(function(done) {
      chai.connect.use('express', authenticate(passport, 'fail', { failWithError: true }))
        .req(function(req) {
          request = req;
        })
        .res(function(res) {
          response = res;
        })
        .next(function(err) {
          error = err;
          done();
        })
        .dispatch();
    });
    
it('-305-should error', function() {
      expect(error).to.be.an.instanceOf(Error);
      expect(error.constructor.name).to.equal('AuthenticationError');
      expect(error.message).to.equal('Forbidden');
      expect(error.status).to.equal(403);
    });
    
it('-306-should not set user', function() {
      expect(request.user).to.be.undefined;
    });
    
it('-307-should not set body of response', function() {
      expect(response.statusCode).to.equal(403);
      expect(response.getHeader('WWW-Authenticate')).to.be.undefined;
      expect(response.body).to.be.undefined;
    });
  });
  
  describe('fail with error, passing status to fail', function() {
    function Strategy() {
    }
    Strategy.prototype.authenticate = function(req) {
      this.fail(402);
    };
    
    var passport = new Passport();
    passport.use('fail', new Strategy());
    
    var request, response, error;

    before(function(done) {
      chai.connect.use('express', authenticate(passport, 'fail', { failWithError: true }))
        .req(function(req) {
          request = req;
        })
        .res(function(res) {
          response = res;
        })
        .next(function(err) {
          error = err;
          done();
        })
        .dispatch();
    });
    
it('-308-should error', function() {
      expect(error).to.be.an.instanceOf(Error);
      expect(error.constructor.name).to.equal('AuthenticationError');
      expect(error.message).to.equal('Payment Required');
      expect(error.status).to.equal(402);
    });
    
it('-309-should not set user', function() {
      expect(request.user).to.be.undefined;
    });
    
it('-310-should not set body of response', function() {
      expect(response.statusCode).to.equal(402);
      expect(response.getHeader('WWW-Authenticate')).to.be.undefined;
      expect(response.body).to.be.undefined;
    });
  });
  
});
