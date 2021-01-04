/* global describe, it, expect, before */
/* jshint expr: true */

var http = require('http')
  , Passport = require('../..').Passport;

require('../../lib/framework/connect').__monkeypatchNode();


describe('http.ServerRequest', function() {
  
  describe('prototoype', function() {
    var req = new http.IncomingMessage();
    
it('-101-should be extended with login', function() {
      expect(req.login).to.be.an('function');
      expect(req.login).to.equal(req.logIn);
    });
    
it('-102-should be extended with logout', function() {
      expect(req.logout).to.be.an('function');
      expect(req.logout).to.equal(req.logOut);
    });
    
it('-103-should be extended with isAuthenticated', function() {
      expect(req.isAuthenticated).to.be.an('function');
    });
    
it('-104-should be extended with isUnauthenticated', function() {
      expect(req.isUnauthenticated).to.be.an('function');
    });
  });
  
  describe('#login', function() {
    
    describe('not establishing a session', function() {
      var passport = new Passport();
      
      var req = new http.IncomingMessage();
      req._passport = {};
      req._passport.instance = passport;
      req._passport.session = {};
      
      var error;
      
      before(function(done) {
        var user = { id: '1', username: 'root' };
        
        req.login(user, { session: false }, function(err) {
          error = err;
          done();
        });
      });
      
it('-105-should not error', function() {
        expect(error).to.be.undefined;
      });
      
it('-106-should be authenticated', function() {
        expect(req.isAuthenticated()).to.be.true;
        expect(req.isUnauthenticated()).to.be.false;
      });
      
it('-107-should set user', function() {
        expect(req.user).to.be.an('object');
        expect(req.user.id).to.equal('1');
        expect(req.user.username).to.equal('root');
      });
      
it('-108-should not serialize user', function() {
        expect(req._passport.session.user).to.be.undefined;
      });
    });
    
    describe('not establishing a session and setting custom user property', function() {
      var passport = new Passport();
      passport._userProperty = 'currentUser';
      
      var req = new http.IncomingMessage();
      req._passport = {};
      req._passport.instance = passport;
      req._passport.session = {};
      
      var error;
      
      before(function(done) {
        var user = { id: '1', username: 'root' };
        
        req.login(user, { session: false }, function(err) {
          error = err;
          done();
        });
      });
      
it('-109-should not error', function() {
        expect(error).to.be.undefined;
      });
      
it('-110-should be authenticated', function() {
        expect(req.isAuthenticated()).to.be.true;
        expect(req.isUnauthenticated()).to.be.false;
      });
      
it('-111-should not set user', function() {
        expect(req.user).to.be.undefined;
      });
      
it('-112-should set custom user', function() {
        expect(req.currentUser).to.be.an('object');
        expect(req.currentUser.id).to.equal('1');
        expect(req.currentUser.username).to.equal('root');
      });
      
it('-113-should not serialize user', function() {
        expect(req._passport.session.user).to.be.undefined;
      });
    });
    
    describe('not establishing a session and invoked without a callback', function() {
      var passport = new Passport();
      
      var req = new http.IncomingMessage();
      req._passport = {};
      req._passport.instance = passport;
      req._passport.session = {};
      
      var user = { id: '1', username: 'root' };
      req.login(user, { session: false });
      
it('-114-should be authenticated', function() {
        expect(req.isAuthenticated()).to.be.true;
        expect(req.isUnauthenticated()).to.be.false;
      });
      
it('-115-should set user', function() {
        expect(req.user).to.be.an('object');
        expect(req.user.id).to.equal('1');
        expect(req.user.username).to.equal('root');
      });
      
it('-116-should not serialize user', function() {
        expect(req._passport.session.user).to.be.undefined;
      });
    });
    
    describe('not establishing a session, without passport.initialize() middleware', function() {
      var req = new http.IncomingMessage();
      
      var error;
      
      before(function(done) {
        var user = { id: '1', username: 'root' };
        
        req.login(user, { session: false }, function(err) {
          error = err;
          done();
        });
      });
      
it('-117-should not error', function() {
        expect(error).to.be.undefined;
      });
      
it('-118-should be authenticated', function() {
        expect(req.isAuthenticated()).to.be.true;
        expect(req.isUnauthenticated()).to.be.false;
      });
      
it('-119-should set user', function() {
        expect(req.user).to.be.an('object');
        expect(req.user.id).to.equal('1');
        expect(req.user.username).to.equal('root');
      });
    });
    
    describe('establishing a session', function() {
      var passport = new Passport();
      passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      var req = new http.IncomingMessage();
      req._passport = {};
      req._passport.instance = passport;
      req._passport.session = {};
      
      var error;
      
      before(function(done) {
        var user = { id: '1', username: 'root' };
        
        req.login(user, function(err) {
          error = err;
          done();
        });
      });
      
it('-120-should not error', function() {
        expect(error).to.be.undefined;
      });
      
it('-121-should be authenticated', function() {
        expect(req.isAuthenticated()).to.be.true;
        expect(req.isUnauthenticated()).to.be.false;
      });
      
it('-122-should set user', function() {
        expect(req.user).to.be.an('object');
        expect(req.user.id).to.equal('1');
        expect(req.user.username).to.equal('root');
      });
      
it('-123-should serialize user', function() {
        expect(req._passport.session.user).to.equal('1');
      });
    });
    
    describe('establishing a session and setting custom user property', function() {
      var passport = new Passport();
      passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      passport._userProperty = 'currentUser';
      
      var req = new http.IncomingMessage();
      req._passport = {};
      req._passport.instance = passport;
      req._passport.session = {};
      
      var error;
      
      before(function(done) {
        var user = { id: '1', username: 'root' };
        
        req.login(user, function(err) {
          error = err;
          done();
        });
      });
      
it('-124-should not error', function() {
        expect(error).to.be.undefined;
      });
      
it('-125-should be authenticated', function() {
        expect(req.isAuthenticated()).to.be.true;
        expect(req.isUnauthenticated()).to.be.false;
      });
      
it('-126-should not set user', function() {
        expect(req.user).to.be.undefined;
      });
      
it('-127-should set custom user', function() {
        expect(req.currentUser).to.be.an('object');
        expect(req.currentUser.id).to.equal('1');
        expect(req.currentUser.username).to.equal('root');
      });
      
it('-128-should serialize user', function() {
        expect(req._passport.session.user).to.equal('1');
      });
    });
    
    describe('encountering an error when serializing to session', function() {
      var passport = new Passport();
      passport.serializeUser(function(user, done) {
        done(new Error('something went wrong'));
      });
      
      var req = new http.IncomingMessage();
      req._passport = {};
      req._passport.instance = passport;
      req._passport.session = {};
      
      var error;
      
      before(function(done) {
        var user = { id: '1', username: 'root' };
        
        req.login(user, function(err) {
          error = err;
          done();
        });
      });
      
it('-129-should error', function() {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.message).to.equal('something went wrong');
      });
      
it('-130-should not be authenticated', function() {
        expect(req.isAuthenticated()).to.be.false;
        expect(req.isUnauthenticated()).to.be.true;
      });
      
it('-131-should not set user', function() {
        expect(req.user).to.be.null;
      });
      
it('-132-should not serialize user', function() {
        expect(req._passport.session.user).to.be.undefined;
      });
    });
    
    describe('establishing a session, without passport.initialize() middleware', function() {
      var req = new http.IncomingMessage();
      var user = { id: '1', username: 'root' };
      
it('-133-should throw an exception', function() {
        expect(function() {
          req.login(user, function(err) {});
        }).to.throw(Error, 'passport.initialize() middleware not in use');
      });
    });
    
    describe('establishing a session, but not passing a callback argument', function() {
      var passport = new Passport();
      passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      var req = new http.IncomingMessage();
      req._passport = {};
      req._passport.instance = passport;
      req._passport.session = {};
      
      var user = { id: '1', username: 'root' };
      
it('-134-should throw an exception', function() {
        expect(function() {
          req.login(user);
        }).to.throw(Error, 'req#login requires a callback function');
      });
    });
    
  });
  
  
  describe('#logout', function() {
    
    describe('existing session', function() {
      var passport = new Passport();
      
      var req = new http.IncomingMessage();
      req.user = { id: '1', username: 'root' };
      req._passport = {};
      req._passport.instance = passport;
      req._passport.session = {};
      req._passport.session.user = '1';
      
      req.logout();
      
it('-135-should not be authenticated', function() {
        expect(req.isAuthenticated()).to.be.false;
        expect(req.isUnauthenticated()).to.be.true;
      });
      
it('-136-should clear user', function() {
        expect(req.user).to.be.null;
      });
      
it('-137-should clear serialized user', function() {
        expect(req._passport.session.user).to.be.undefined;
      });
    });
    
    describe('existing session and clearing custom user property', function() {
      var passport = new Passport();
      
      var req = new http.IncomingMessage();
      req.currentUser = { id: '1', username: 'root' };
      req._passport = {};
      req._passport.instance = passport;
      req._passport.instance._userProperty = 'currentUser';
      req._passport.session = {};
      req._passport.session.user = '1';
      
      req.logout();
      
it('-138-should not be authenticated', function() {
        expect(req.isAuthenticated()).to.be.false;
        expect(req.isUnauthenticated()).to.be.true;
      });
      
it('-139-should clear user', function() {
        expect(req.currentUser).to.be.null;
      });
      
it('-140-should clear serialized user', function() {
        expect(req._passport.session.user).to.be.undefined;
      });
    });
    
    describe('existing session, without passport.initialize() middleware', function() {
      var req = new http.IncomingMessage();
      req.user = { id: '1', username: 'root' };
      
      req.logout();
      
it('-141-should not be authenticated', function() {
        expect(req.isAuthenticated()).to.be.false;
        expect(req.isUnauthenticated()).to.be.true;
      });
      
it('-142-should clear user', function() {
        expect(req.user).to.be.null;
      });
    });
    
  });
  
  
  describe('#isAuthenticated', function() {
    
    describe('with a user', function() {
      var req = new http.IncomingMessage();
      req.user = { id: '1', username: 'root' };
      
it('-143-should be authenticated', function() {
        expect(req.isAuthenticated()).to.be.true;
        expect(req.isUnauthenticated()).to.be.false;
      });
    });
    
    describe('with a user set on custom property', function() {
      var req = new http.IncomingMessage();
      req.currentUser = { id: '1', username: 'root' };
      req._passport = {};
      req._passport.instance = {};
      req._passport.instance._userProperty = 'currentUser';
      
it('-144-should be authenticated', function() {
        expect(req.isAuthenticated()).to.be.true;
        expect(req.isUnauthenticated()).to.be.false;
      });
    });
    
    describe('without a user', function() {
      var req = new http.IncomingMessage();
      
it('-145-should not be authenticated', function() {
        expect(req.isAuthenticated()).to.be.false;
        expect(req.isUnauthenticated()).to.be.true;
      });
    });
    
    describe('with a null user', function() {
      var req = new http.IncomingMessage();
      req.user = null;
      
it('-146-should not be authenticated', function() {
        expect(req.isAuthenticated()).to.be.false;
        expect(req.isUnauthenticated()).to.be.true;
      });
    });
    
  });
  
});
