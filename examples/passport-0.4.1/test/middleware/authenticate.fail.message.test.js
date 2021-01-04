/* global describe, it, expect, before */
/* jshint expr: true */

var chai = require('chai')
  , authenticate = require('../../lib/middleware/authenticate')
  , Passport = require('../..').Passport;


describe('middleware/authenticate', function() {

  describe('fail with message set by route', function() {
    function Strategy() {
    }
    Strategy.prototype.authenticate = function(req) {
      this.fail({ message: 'Invalid password' });
    };
    
    var passport = new Passport();
    passport.use('fail', new Strategy());
    
    var request, response;

    before(function(done) {
      chai.connect.use('express', authenticate(passport, 'fail', { failureMessage: 'Wrong credentials',
                                                         failureRedirect: 'http://www.example.com/login' }))
        .req(function(req) {
          request = req;
          req.session = {};
        })
        .end(function(res) {
          response = res;
          done();
        })
        .dispatch();
    });
    
it('-246-should not set user', function() {
      expect(request.user).to.be.undefined;
    });
    
it('-247-should add message to session', function() {
      expect(request.session.messages).to.have.length(1);
      expect(request.session.messages[0]).to.equal('Wrong credentials');
    });
    
it('-248-should redirect', function() {
      expect(response.statusCode).to.equal(302);
      expect(response.getHeader('Location')).to.equal('http://www.example.com/login');
    });
  });
  
  describe('fail with message set by route that is added to messages', function() {
    function Strategy() {
    }
    Strategy.prototype.authenticate = function(req) {
      this.fail({ message: 'Invalid password' });
    };
    
    var passport = new Passport();
    passport.use('fail', new Strategy());
    
    var request, response;

    before(function(done) {
      chai.connect.use('express', authenticate(passport, 'fail', { failureMessage: 'Wrong credentials',
                                                         failureRedirect: 'http://www.example.com/login' }))
        .req(function(req) {
          request = req;
          req.session = {};
          req.session.messages = [ 'I exist!' ];
        })
        .end(function(res) {
          response = res;
          done();
        })
        .dispatch();
    });
    
it('-249-should not set user', function() {
      expect(request.user).to.be.undefined;
    });
    
it('-250-should add message to session', function() {
      expect(request.session.messages).to.have.length(2);
      expect(request.session.messages[0]).to.equal('I exist!');
      expect(request.session.messages[1]).to.equal('Wrong credentials');
    });
    
it('-251-should redirect', function() {
      expect(response.statusCode).to.equal(302);
      expect(response.getHeader('Location')).to.equal('http://www.example.com/login');
    });
  });
  
  describe('fail with message set by strategy', function() {
    function Strategy() {
    }
    Strategy.prototype.authenticate = function(req) {
      this.fail({ message: 'Invalid password' });
    };
    
    var passport = new Passport();
    passport.use('fail', new Strategy());
    
    var request, response;

    before(function(done) {
      chai.connect.use('express', authenticate(passport, 'fail', { failureMessage: true,
                                                         failureRedirect: 'http://www.example.com/login' }))
        .req(function(req) {
          request = req;
          req.session = {};
        })
        .end(function(res) {
          response = res;
          done();
        })
        .dispatch();
    });
    
it('-252-should not set user', function() {
      expect(request.user).to.be.undefined;
    });
    
it('-253-should add message to session', function() {
      expect(request.session.messages).to.have.length(1);
      expect(request.session.messages[0]).to.equal('Invalid password');
    });
    
it('-254-should redirect', function() {
      expect(response.statusCode).to.equal(302);
      expect(response.getHeader('Location')).to.equal('http://www.example.com/login');
    });
  });
  
  describe('fail with message set by strategy with extra info', function() {
    function Strategy() {
    }
    Strategy.prototype.authenticate = function(req) {
      this.fail({ message: 'Invalid password', scope: 'read' });
    };
    
    var passport = new Passport();
    passport.use('fail', new Strategy());
    
    var request, response;

    before(function(done) {
      chai.connect.use('express', authenticate(passport, 'fail', { failureMessage: true,
                                                         failureRedirect: 'http://www.example.com/login' }))
        .req(function(req) {
          request = req;
          req.session = {};
        })
        .end(function(res) {
          response = res;
          done();
        })
        .dispatch();
    });
    
it('-255-should not set user', function() {
      expect(request.user).to.be.undefined;
    });
    
it('-256-should add message to session', function() {
      expect(request.session.messages).to.have.length(1);
      expect(request.session.messages[0]).to.equal('Invalid password');
    });
    
it('-257-should redirect', function() {
      expect(response.statusCode).to.equal(302);
      expect(response.getHeader('Location')).to.equal('http://www.example.com/login');
    });
  });

});
