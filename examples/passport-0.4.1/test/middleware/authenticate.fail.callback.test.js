/* global describe, it, expect, before */
/* jshint expr: true */

var chai = require('chai')
  , authenticate = require('../../lib/middleware/authenticate')
  , Passport = require('../..').Passport;


describe('middleware/authenticate', function() {
  
  describe('fail with callback', function() {
    function Strategy() {
    }
    Strategy.prototype.authenticate = function(req) {
      this.fail();
    };
    
    var passport = new Passport();
    passport.use('fail', new Strategy());
    
    var request, error, user;

    before(function(done) {
      function callback(e, u) {
        error = e;
        user = u;
        done();
      }
      
      chai.connect.use(authenticate(passport, 'fail', callback))
        .req(function(req) {
          request = req;
        })
        .dispatch();
    });
    
it('-155-should not error', function() {
      expect(error).to.be.null;
    });
    
it('-156-should pass false to callback', function() {
      expect(user).to.equal(false);
    });
    
it('-157-should not set user on request', function() {
      expect(request.user).to.be.undefined;
    });
  });
  
  describe('fail with callback, passing info', function() {
    function Strategy() {
    }
    Strategy.prototype.authenticate = function(req) {
      this.fail({ message: 'Invalid password' });
    };
    
    var passport = new Passport();
    passport.use('fail', new Strategy());
    
    var request, error, user, info, status;

    before(function(done) {
      function callback(e, u, i, s) {
        error = e;
        user = u;
        info = i;
        status = s;
        done();
      }
      
      chai.connect.use(authenticate(passport, 'fail', callback))
        .req(function(req) {
          request = req;
        })
        .dispatch();
    });
    
it('-158-should not error', function() {
      expect(error).to.be.null;
    });
    
it('-159-should pass false to callback', function() {
      expect(user).to.equal(false);
    });
    
it('-160-should pass info to callback', function() {
      expect(info).to.be.an('object');
      expect(info.message).to.equal('Invalid password');
    });
    
it('-161-should pass status to callback', function() {
      expect(status).to.be.undefined;
    });
    
it('-162-should not set user on request', function() {
      expect(request.user).to.be.undefined;
    });
  });
  
  describe('fail with callback, passing info and status', function() {
    function Strategy() {
    }
    Strategy.prototype.authenticate = function(req) {
      this.fail({ message: 'Invalid password' }, 403);
    };
    
    var passport = new Passport();
    passport.use('fail', new Strategy());
    
    var request, error, user, info, status;

    before(function(done) {
      function callback(e, u, i, s) {
        error = e;
        user = u;
        info = i;
        status = s;
        done();
      }
      
      chai.connect.use(authenticate(passport, 'fail', callback))
        .req(function(req) {
          request = req;
        })
        .dispatch();
    });
    
it('-163-should not error', function() {
      expect(error).to.be.null;
    });
    
it('-164-should pass false to callback', function() {
      expect(user).to.equal(false);
    });
    
it('-165-should pass info to callback', function() {
      expect(info).to.be.an('object');
      expect(info.message).to.equal('Invalid password');
    });
    
it('-166-should pass status to callback', function() {
      expect(status).to.equal(403);
    });
    
it('-167-should not set user on request', function() {
      expect(request.user).to.be.undefined;
    });
  });
  
  describe('fail with callback, passing challenge', function() {
    function Strategy() {
    }
    Strategy.prototype.authenticate = function(req) {
      this.fail('Bearer challenge');
    };
    
    var passport = new Passport();
    passport.use('fail', new Strategy());
    
    var request, error, user, challenge, status;

    before(function(done) {
      function callback(e, u, c, s) {
        error = e;
        user = u;
        challenge = c;
        status = s;
        done();
      }
      
      chai.connect.use(authenticate(passport, 'fail', callback))
        .req(function(req) {
          request = req;
        })
        .dispatch();
    });
    
it('-168-should not error', function() {
      expect(error).to.be.null;
    });
    
it('-169-should pass false to callback', function() {
      expect(user).to.equal(false);
    });
    
it('-170-should pass challenge to callback', function() {
      expect(challenge).to.equal('Bearer challenge');
    });
    
it('-171-should pass status to callback', function() {
      expect(status).to.be.undefined;
    });
    
it('-172-should not set user on request', function() {
      expect(request.user).to.be.undefined;
    });
  });
  
  describe('fail with callback, passing challenge and status', function() {
    function Strategy() {
    }
    Strategy.prototype.authenticate = function(req) {
      this.fail('Bearer challenge', 403);
    };
    
    var passport = new Passport();
    passport.use('fail', new Strategy());
    
    var request, error, user, challenge, status;

    before(function(done) {
      function callback(e, u, c, s) {
        error = e;
        user = u;
        challenge = c;
        status = s;
        done();
      }
      
      chai.connect.use(authenticate(passport, 'fail', callback))
        .req(function(req) {
          request = req;
        })
        .dispatch();
    });
    
it('-173-should not error', function() {
      expect(error).to.be.null;
    });
    
it('-174-should pass false to callback', function() {
      expect(user).to.equal(false);
    });
    
it('-175-should pass challenge to callback', function() {
      expect(challenge).to.equal('Bearer challenge');
    });
    
it('-176-should pass status to callback', function() {
      expect(status).to.equal(403);
    });
    
it('-177-should not set user on request', function() {
      expect(request.user).to.be.undefined;
    });
  });
  
  describe('fail with callback, passing status', function() {
    function Strategy() {
    }
    Strategy.prototype.authenticate = function(req) {
      this.fail(402);
    };
    
    var passport = new Passport();
    passport.use('fail', new Strategy());
    
    var request, error, user, challenge, status;

    before(function(done) {
      function callback(e, u, c, s) {
        error = e;
        user = u;
        challenge = c;
        status = s;
        done();
      }
      
      chai.connect.use(authenticate(passport, 'fail', callback))
        .req(function(req) {
          request = req;
        })
        .dispatch();
    });
    
it('-178-should not error', function() {
      expect(error).to.be.null;
    });
    
it('-179-should pass false to callback', function() {
      expect(user).to.equal(false);
    });
    
it('-180-should pass challenge to callback', function() {
      expect(challenge).to.be.undefined;
    });
    
it('-181-should pass status to callback', function() {
      expect(status).to.equal(402);
    });
    
it('-182-should not set user on request', function() {
      expect(request.user).to.be.undefined;
    });
  });
  
  describe('fail with callback and options passed to middleware', function() {
    function Strategy() {
    }
    Strategy.prototype.authenticate = function(req) {
      this.fail();
    };
    
    var passport = new Passport();
    passport.use('fail', new Strategy());
    
    var request, error, user;

    before(function(done) {
      function callback(e, u) {
        error = e;
        user = u;
        done();
      }
      
      chai.connect.use(authenticate(passport, 'fail', { foo: 'bar' }, callback))
        .req(function(req) {
          request = req;
        })
        .dispatch();
    });
    
it('-183-should not error', function() {
      expect(error).to.be.null;
    });
    
it('-184-should pass false to callback', function() {
      expect(user).to.equal(false);
    });
    
it('-185-should not set user on request', function() {
      expect(request.user).to.be.undefined;
    });
  });
  
});
