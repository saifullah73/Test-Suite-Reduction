/* global describe, it, expect, before */
/* jshint expr: true */

var chai = require('chai')
  , authenticate = require('../../lib/middleware/authenticate')
  , Passport = require('../..').Passport;


describe('middleware/authenticate', function() {
  
  describe('success', function() {
    function Strategy() {
    }
    Strategy.prototype.authenticate = function(req) {
      var user = { id: '1', username: 'jaredhanson' };
      this.success(user);
    };
    
    var passport = new Passport();
    passport.use('success', new Strategy());
    
    var request, error;

    before(function(done) {
      chai.connect.use(authenticate(passport, 'success'))
        .req(function(req) {
          request = req;
          
          req.logIn = function(user, options, done) {
            this.user = user;
            done();
          };
        })
        .next(function(err) {
          error = err;
          done();
        })
        .dispatch();
    });
    
it('-419-should not error', function() {
      expect(error).to.be.undefined;
    });
    
it('-420-should set user', function() {
      expect(request.user).to.be.an('object');
      expect(request.user.id).to.equal('1');
      expect(request.user.username).to.equal('jaredhanson');
    });
    
it('-421-should set authInfo', function() {
      expect(request.authInfo).to.be.an('object');
      expect(Object.keys(request.authInfo)).to.have.length(0);
    });
  });
  
  describe('success that assigns a specific property', function() {
    function Strategy() {
    }
    Strategy.prototype.authenticate = function(req) {
      var user = { id: '1', username: 'jaredhanson' };
      this.success(user);
    };
    
    var passport = new Passport();
    passport.use('success', new Strategy());
    
    var request, error;

    before(function(done) {
      chai.connect.use(authenticate(passport, 'success', { assignProperty: 'account' }))
        .req(function(req) {
          request = req;
          
          req.logIn = function(user, options, done) {
            this.user = user;
            done();
          };
        })
        .next(function(err) {
          error = err;
          done();
        })
        .dispatch();
    });
    
it('-422-should not error', function() {
      expect(error).to.be.undefined;
    });
    
it('-423-should not set user', function() {
      expect(request.user).to.be.undefined;
    });
    
it('-424-should set account', function() {
      expect(request.account).to.be.an('object');
      expect(request.account.id).to.equal('1');
      expect(request.account.username).to.equal('jaredhanson');
    });
    
it('-425-should not set authInfo', function() {
      expect(request.authInfo).to.be.undefined;
    });
  });
  
  describe('success with strategy-specific options', function() {
    function Strategy() {
    }
    Strategy.prototype.authenticate = function(req, options) {
      var user = { id: '1', username: 'jaredhanson' };
      if (options.scope == 'email') {
        user.email = 'jaredhanson@example.com';
      }
      this.success(user);
    };
    
    var passport = new Passport();
    passport.use('success', new Strategy());
    
    var request, error;

    before(function(done) {
      chai.connect.use(authenticate(passport, 'success', { scope: 'email' }))
        .req(function(req) {
          request = req;
          
          req.logIn = function(user, options, done) {
            if (options.scope != 'email') { return done(new Error('invalid options')); }
            this.user = user;
            done();
          };
        })
        .next(function(err) {
          error = err;
          done();
        })
        .dispatch();
    });
    
it('-426-should not error', function() {
      expect(error).to.be.undefined;
    });
    
it('-427-should set user', function() {
      expect(request.user).to.be.an('object');
      expect(request.user.id).to.equal('1');
      expect(request.user.username).to.equal('jaredhanson');
      expect(request.user.email).to.equal('jaredhanson@example.com');
    });
    
it('-428-should set authInfo', function() {
      expect(request.authInfo).to.be.an('object');
      expect(Object.keys(request.authInfo)).to.have.length(0);
    });
  });
  
  describe('success with redirect', function() {
    function Strategy() {
    }
    Strategy.prototype.authenticate = function(req, options) {
      var user = { id: '1', username: 'jaredhanson' };
      this.success(user);
    };
    
    var passport = new Passport();
    passport.use('success', new Strategy());
    
    var request, response;

    before(function(done) {
      chai.connect.use('express', authenticate(passport, 'success', { successRedirect: 'http://www.example.com/account' }))
        .req(function(req) {
          request = req;
          
          req.logIn = function(user, options, done) {
            this.user = user;
            done();
          };
        })
        .end(function(res) {
          response = res;
          done();
        })
        .dispatch();
    });
    
it('-429-should set user', function() {
      expect(request.user).to.be.an('object');
      expect(request.user.id).to.equal('1');
      expect(request.user.username).to.equal('jaredhanson');
    });
    
it('-430-should set authInfo', function() {
      expect(request.authInfo).to.be.an('object');
      expect(Object.keys(request.authInfo)).to.have.length(0);
    });
    
it('-431-should redirect', function() {
      expect(response.statusCode).to.equal(302);
      expect(response.getHeader('Location')).to.equal('http://www.example.com/account');
    });
  });
  
  describe('success with return to previous location', function() {
    function Strategy() {
    }
    Strategy.prototype.authenticate = function(req, options) {
      var user = { id: '1', username: 'jaredhanson' };
      this.success(user);
    };
    
    var passport = new Passport();
    passport.use('success', new Strategy());
    
    var request, response;

    before(function(done) {
      chai.connect.use('express', authenticate(passport, 'success', { successReturnToOrRedirect: 'http://www.example.com/default' }))
        .req(function(req) {
          request = req;
          req.session = { returnTo: 'http://www.example.com/return' };
          
          req.logIn = function(user, options, done) {
            this.user = user;
            done();
          };
        })
        .end(function(res) {
          response = res;
          done();
        })
        .dispatch();
    });
    
it('-432-should set user', function() {
      expect(request.user).to.be.an('object');
      expect(request.user.id).to.equal('1');
      expect(request.user.username).to.equal('jaredhanson');
    });
    
it('-433-should set authInfo', function() {
      expect(request.authInfo).to.be.an('object');
      expect(Object.keys(request.authInfo)).to.have.length(0);
    });
    
it('-434-should redirect', function() {
      expect(response.statusCode).to.equal(302);
      expect(response.getHeader('Location')).to.equal('http://www.example.com/return');
    });
    
it('-435-should move return to from session', function() {
      expect(request.session.returnTo).to.be.undefined;
    });
  });
  
  describe('success with return to default location', function() {
    function Strategy() {
    }
    Strategy.prototype.authenticate = function(req, options) {
      var user = { id: '1', username: 'jaredhanson' };
      this.success(user);
    };
    
    var passport = new Passport();
    passport.use('success', new Strategy());
    
    var request, response;

    before(function(done) {
      chai.connect.use('express', authenticate(passport, 'success', { successReturnToOrRedirect: 'http://www.example.com/default' }))
        .req(function(req) {
          request = req;
          
          req.logIn = function(user, options, done) {
            this.user = user;
            done();
          };
        })
        .end(function(res) {
          response = res;
          done();
        })
        .dispatch();
    });
    
it('-436-should set user', function() {
      expect(request.user).to.be.an('object');
      expect(request.user.id).to.equal('1');
      expect(request.user.username).to.equal('jaredhanson');
    });
    
it('-437-should set authInfo', function() {
      expect(request.authInfo).to.be.an('object');
      expect(Object.keys(request.authInfo)).to.have.length(0);
    });
    
it('-438-should redirect', function() {
      expect(response.statusCode).to.equal(302);
      expect(response.getHeader('Location')).to.equal('http://www.example.com/default');
    });
  });
  
  describe('success, but login that encounters an error', function() {
    function Strategy() {
    }
    Strategy.prototype.authenticate = function(req) {
      var user = { id: '1', username: 'jaredhanson' };
      this.success(user);
    };
    
    var passport = new Passport();
    passport.use('success', new Strategy());
    
    var request, error;

    before(function(done) {
      chai.connect.use(authenticate(passport, 'success'))
        .req(function(req) {
          request = req;
          
          req.logIn = function(user, options, done) {
            done(new Error('something went wrong'));
          };
        })
        .next(function(err) {
          error = err;
          done();
        })
        .dispatch();
    });
    
it('-439-should error', function() {
      expect(error).to.be.an.instanceOf(Error);
      expect(error.message).to.equal('something went wrong');
    });
    
it('-440-should not set user', function() {
      expect(request.user).to.be.undefined;
    });
    
it('-441-should not set authInfo', function() {
      expect(request.authInfo).to.be.undefined;
    });
  });
  
});
