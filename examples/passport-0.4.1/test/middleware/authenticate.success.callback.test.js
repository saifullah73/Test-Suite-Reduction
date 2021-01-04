/* global describe, it, expect, before */
/* jshint expr: true */

var chai = require('chai')
  , authenticate = require('../../lib/middleware/authenticate')
  , Passport = require('../..').Passport;


describe('middleware/authenticate', function() {
  
  describe('success with callback', function() {
    function Strategy() {
    }
    Strategy.prototype.authenticate = function(req) {
      var user = { id: '1', username: 'jaredhanson' };
      this.success(user, { message: 'Hello' });
    };
    
    var passport = new Passport();
    passport.use('success', new Strategy());
    
    var request, error, user, info;

    before(function(done) {
      function callback(e, u, i) {
        error = e;
        user = u;
        info = i;
        done();
      }
      
      chai.connect.use(authenticate(passport, 'success', callback))
        .req(function(req) {
          request = req;
        })
        .dispatch();
    });
    
it('-321-should not error', function() {
      expect(error).to.be.null;
    });
    
it('-322-should pass user to callback', function() {
      expect(user).to.be.an('object');
      expect(user.id).to.equal('1');
      expect(user.username).to.equal('jaredhanson');
    });
    
it('-323-should pass info to callback', function() {
      expect(info).to.be.an('object');
      expect(info.message).to.equal('Hello');
    });
    
it('-324-should not set user on request', function() {
      expect(request.user).to.be.undefined;
    });
    
it('-325-should not set authInfo on request', function() {
      expect(request.authInfo).to.be.undefined;
    });
  });
  
  describe('success with callback and options passed to middleware', function() {
    function Strategy() {
    }
    Strategy.prototype.authenticate = function(req) {
      var user = { id: '1', username: 'jaredhanson' };
      this.success(user, { message: 'Hello' });
    };
    
    var passport = new Passport();
    passport.use('success', new Strategy());
    
    var request, error, user, info;

    before(function(done) {
      function callback(e, u, i) {
        error = e;
        user = u;
        info = i;
        done();
      }
      
      chai.connect.use(authenticate(passport, 'success', { foo: 'bar' }, callback))
        .req(function(req) {
          request = req;
        })
        .dispatch();
    });
    
it('-326-should not error', function() {
      expect(error).to.be.null;
    });
    
it('-327-should pass user to callback', function() {
      expect(user).to.be.an('object');
      expect(user.id).to.equal('1');
      expect(user.username).to.equal('jaredhanson');
    });
    
it('-328-should pass info to callback', function() {
      expect(info).to.be.an('object');
      expect(info.message).to.equal('Hello');
    });
    
it('-329-should not set user on request', function() {
      expect(request.user).to.be.undefined;
    });
    
it('-330-should not set authInfo on request', function() {
      expect(request.authInfo).to.be.undefined;
    });
  });
  
});
