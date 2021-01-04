/* global describe, it, expect, before */
/* jshint expr: true */

var chai = require('chai')
  , authenticate = require('../../lib/middleware/authenticate')
  , Passport = require('../..').Passport;


describe('middleware/authenticate', function() {
  
  describe('using strategy that specifies message', function() {
    
    describe('success with flash message', function() {
      function Strategy() {
      }
      Strategy.prototype.authenticate = function(req, options) {
        var user = { id: '1', username: 'jaredhanson' };
        this.success(user, { message: 'Welcome!' });
      };
    
      var passport = new Passport();
      passport.use('success', new Strategy());
    
      var request, response;

      before(function(done) {
        chai.connect.use('express', authenticate(passport, 'success', { successFlash: true,
                                                              successRedirect: 'http://www.example.com/account' }))
          .req(function(req) {
            request = req;
            req.session = {};
          
            req.logIn = function(user, options, done) {
              this.user = user;
              done();
            };
            req.flash = function(type, msg) {
              this.message = { type: type, msg: msg };
            };
          })
          .end(function(res) {
            response = res;
            done();
          })
          .dispatch();
      });
    
it('-331-should set user', function() {
        expect(request.user).to.be.an('object');
        expect(request.user.id).to.equal('1');
        expect(request.user.username).to.equal('jaredhanson');
      });
    
it('-332-should flash message', function() {
        expect(request.message.type).to.equal('success');
        expect(request.message.msg).to.equal('Welcome!');
      });
    
it('-333-should redirect', function() {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('http://www.example.com/account');
      });
    });
  
    describe('success with flash message using type set by route', function() {
      function Strategy() {
      }
      Strategy.prototype.authenticate = function(req, options) {
        var user = { id: '1', username: 'jaredhanson' };
        this.success(user, { message: 'Welcome!' });
      };
    
      var passport = new Passport();
      passport.use('success', new Strategy());
    
      var request, response;

      before(function(done) {
        chai.connect.use('express', authenticate(passport, 'success', { successFlash: { type: 'info' },
                                                              successRedirect: 'http://www.example.com/account' }))
          .req(function(req) {
            request = req;
            req.session = {};
          
            req.logIn = function(user, options, done) {
              this.user = user;
              done();
            };
            req.flash = function(type, msg) {
              this.message = { type: type, msg: msg };
            };
          })
          .end(function(res) {
            response = res;
            done();
          })
          .dispatch();
      });
    
it('-334-should set user', function() {
        expect(request.user).to.be.an('object');
        expect(request.user.id).to.equal('1');
        expect(request.user.username).to.equal('jaredhanson');
      });
    
it('-335-should flash message', function() {
        expect(request.message.type).to.equal('info');
        expect(request.message.msg).to.equal('Welcome!');
      });
    
it('-336-should redirect', function() {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('http://www.example.com/account');
      });
    });
    
    describe('success with flash message overridden by route as string', function() {
      function Strategy() {
      }
      Strategy.prototype.authenticate = function(req, options) {
        var user = { id: '1', username: 'jaredhanson' };
        this.success(user, { message: 'Welcome!' });
      };
    
      var passport = new Passport();
      passport.use('success', new Strategy());
    
      var request, response;

      before(function(done) {
        chai.connect.use('express', authenticate(passport, 'success', { successFlash: 'Login complete',
                                                              successRedirect: 'http://www.example.com/account' }))
          .req(function(req) {
            request = req;
            req.session = {};
          
            req.logIn = function(user, options, done) {
              this.user = user;
              done();
            };
            req.flash = function(type, msg) {
              this.message = { type: type, msg: msg };
            };
          })
          .end(function(res) {
            response = res;
            done();
          })
          .dispatch();
      });
    
it('-337-should set user', function() {
        expect(request.user).to.be.an('object');
        expect(request.user.id).to.equal('1');
        expect(request.user.username).to.equal('jaredhanson');
      });
    
it('-338-should flash message', function() {
        expect(request.message.type).to.equal('success');
        expect(request.message.msg).to.equal('Login complete');
      });
    
it('-339-should redirect', function() {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('http://www.example.com/account');
      });
    });
  
    describe('success with flash message overridden by route using options', function() {
      function Strategy() {
      }
      Strategy.prototype.authenticate = function(req, options) {
        var user = { id: '1', username: 'jaredhanson' };
        this.success(user, { message: 'Welcome!' });
      };
    
      var passport = new Passport();
      passport.use('success', new Strategy());
    
      var request, response;

      before(function(done) {
        chai.connect.use('express', authenticate(passport, 'success', { successFlash: { message: 'OK' },
                                                              successRedirect: 'http://www.example.com/account' }))
          .req(function(req) {
            request = req;
            req.session = {};
          
            req.logIn = function(user, options, done) {
              this.user = user;
              done();
            };
            req.flash = function(type, msg) {
              this.message = { type: type, msg: msg };
            };
          })
          .end(function(res) {
            response = res;
            done();
          })
          .dispatch();
      });
    
it('-340-should set user', function() {
        expect(request.user).to.be.an('object');
        expect(request.user.id).to.equal('1');
        expect(request.user.username).to.equal('jaredhanson');
      });
    
it('-341-should flash message', function() {
        expect(request.message.type).to.equal('success');
        expect(request.message.msg).to.equal('OK');
      });
    
it('-342-should redirect', function() {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('http://www.example.com/account');
      });
    });
  
    describe('success with flash message overridden by route using options with type', function() {
      function Strategy() {
      }
      Strategy.prototype.authenticate = function(req, options) {
        var user = { id: '1', username: 'jaredhanson' };
        this.success(user, { message: 'Welcome!' });
      };
    
      var passport = new Passport();
      passport.use('success', new Strategy());
    
      var request, response;

      before(function(done) {
        chai.connect.use('express', authenticate(passport, 'success', { successFlash: { type: 'notice', message: 'Last login was yesterday' },
                                                              successRedirect: 'http://www.example.com/account' }))
          .req(function(req) {
            request = req;
            req.session = {};
          
            req.logIn = function(user, options, done) {
              this.user = user;
              done();
            };
            req.flash = function(type, msg) {
              this.message = { type: type, msg: msg };
            };
          })
          .end(function(res) {
            response = res;
            done();
          })
          .dispatch();
      });
    
it('-343-should set user', function() {
        expect(request.user).to.be.an('object');
        expect(request.user.id).to.equal('1');
        expect(request.user.username).to.equal('jaredhanson');
      });
    
it('-344-should flash message', function() {
        expect(request.message.type).to.equal('notice');
        expect(request.message.msg).to.equal('Last login was yesterday');
      });
    
it('-345-should redirect', function() {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('http://www.example.com/account');
      });
    });
    
  });
  
  
  describe('using strategy that specifies message and type', function() {
  
    describe('success with flash message', function() {
      function Strategy() {
      }
      Strategy.prototype.authenticate = function(req, options) {
        var user = { id: '1', username: 'jaredhanson' };
        this.success(user, { type: 'info', message: 'Hello' });
      };
    
      var passport = new Passport();
      passport.use('success', new Strategy());
    
      var request, response;

      before(function(done) {
        chai.connect.use('express', authenticate(passport, 'success', { successFlash: true,
                                                              successRedirect: 'http://www.example.com/account' }))
          .req(function(req) {
            request = req;
            req.session = {};
          
            req.logIn = function(user, options, done) {
              this.user = user;
              done();
            };
            req.flash = function(type, msg) {
              this.message = { type: type, msg: msg };
            };
          })
          .end(function(res) {
            response = res;
            done();
          })
          .dispatch();
      });
    
it('-346-should set user', function() {
        expect(request.user).to.be.an('object');
        expect(request.user.id).to.equal('1');
        expect(request.user.username).to.equal('jaredhanson');
      });
    
it('-347-should flash message', function() {
        expect(request.message.type).to.equal('info');
        expect(request.message.msg).to.equal('Hello');
      });
    
it('-348-should redirect', function() {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('http://www.example.com/account');
      });
    });
    
    describe('success with flash message using type set by route', function() {
      function Strategy() {
      }
      Strategy.prototype.authenticate = function(req, options) {
        var user = { id: '1', username: 'jaredhanson' };
        this.success(user, { type: 'info', message: 'Hello' });
      };
    
      var passport = new Passport();
      passport.use('success', new Strategy());
    
      var request, response;

      before(function(done) {
        chai.connect.use('express', authenticate(passport, 'success', { successFlash: { type: 'ok' },
                                                              successRedirect: 'http://www.example.com/account' }))
          .req(function(req) {
            request = req;
            req.session = {};
          
            req.logIn = function(user, options, done) {
              this.user = user;
              done();
            };
            req.flash = function(type, msg) {
              this.message = { type: type, msg: msg };
            };
          })
          .end(function(res) {
            response = res;
            done();
          })
          .dispatch();
      });
    
it('-349-should set user', function() {
        expect(request.user).to.be.an('object');
        expect(request.user.id).to.equal('1');
        expect(request.user.username).to.equal('jaredhanson');
      });
    
it('-350-should flash message', function() {
        expect(request.message.type).to.equal('ok');
        expect(request.message.msg).to.equal('Hello');
      });
    
it('-351-should redirect', function() {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('http://www.example.com/account');
      });
    });
  
    describe('success with flash message overridden by route as string', function() {
      function Strategy() {
      }
      Strategy.prototype.authenticate = function(req, options) {
        var user = { id: '1', username: 'jaredhanson' };
        this.success(user, { type: 'info', message: 'Hello' });
      };
    
      var passport = new Passport();
      passport.use('success', new Strategy());
    
      var request, response;

      before(function(done) {
        chai.connect.use('express', authenticate(passport, 'success', { successFlash: 'Success!',
                                                              successRedirect: 'http://www.example.com/account' }))
          .req(function(req) {
            request = req;
            req.session = {};
          
            req.logIn = function(user, options, done) {
              this.user = user;
              done();
            };
            req.flash = function(type, msg) {
              this.message = { type: type, msg: msg };
            };
          })
          .end(function(res) {
            response = res;
            done();
          })
          .dispatch();
      });
    
it('-352-should set user', function() {
        expect(request.user).to.be.an('object');
        expect(request.user.id).to.equal('1');
        expect(request.user.username).to.equal('jaredhanson');
      });
    
it('-353-should flash message', function() {
        expect(request.message.type).to.equal('success');
        expect(request.message.msg).to.equal('Success!');
      });
    
it('-354-should redirect', function() {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('http://www.example.com/account');
      });
    });
    
    describe('success with flash message overridden by route using options', function() {
      function Strategy() {
      }
      Strategy.prototype.authenticate = function(req, options) {
        var user = { id: '1', username: 'jaredhanson' };
        this.success(user, { type: 'info', message: 'Hello' });
      };
    
      var passport = new Passport();
      passport.use('success', new Strategy());
    
      var request, response;

      before(function(done) {
        chai.connect.use('express', authenticate(passport, 'success', { successFlash: { message: 'Okay' },
                                                              successRedirect: 'http://www.example.com/account' }))
          .req(function(req) {
            request = req;
            req.session = {};
          
            req.logIn = function(user, options, done) {
              this.user = user;
              done();
            };
            req.flash = function(type, msg) {
              this.message = { type: type, msg: msg };
            };
          })
          .end(function(res) {
            response = res;
            done();
          })
          .dispatch();
      });
    
it('-355-should set user', function() {
        expect(request.user).to.be.an('object');
        expect(request.user.id).to.equal('1');
        expect(request.user.username).to.equal('jaredhanson');
      });
    
it('-356-should flash message', function() {
        expect(request.message.type).to.equal('success');
        expect(request.message.msg).to.equal('Okay');
      });
    
it('-357-should redirect', function() {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('http://www.example.com/account');
      });
    });
    
    describe('success with flash message overridden by route using options with type', function() {
      function Strategy() {
      }
      Strategy.prototype.authenticate = function(req, options) {
        var user = { id: '1', username: 'jaredhanson' };
        this.success(user, { type: 'info', message: 'Hello' });
      };
    
      var passport = new Passport();
      passport.use('success', new Strategy());
    
      var request, response;

      before(function(done) {
        chai.connect.use('express', authenticate(passport, 'success', { successFlash: { type: 'warn', message: 'Last login from far away place' },
                                                              successRedirect: 'http://www.example.com/account' }))
          .req(function(req) {
            request = req;
            req.session = {};
          
            req.logIn = function(user, options, done) {
              this.user = user;
              done();
            };
            req.flash = function(type, msg) {
              this.message = { type: type, msg: msg };
            };
          })
          .end(function(res) {
            response = res;
            done();
          })
          .dispatch();
      });
    
it('-358-should set user', function() {
        expect(request.user).to.be.an('object');
        expect(request.user.id).to.equal('1');
        expect(request.user.username).to.equal('jaredhanson');
      });
    
it('-359-should flash message', function() {
        expect(request.message.type).to.equal('warn');
        expect(request.message.msg).to.equal('Last login from far away place');
      });
    
it('-360-should redirect', function() {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('http://www.example.com/account');
      });
    });
  
  });
  
  
  describe('using strategy that specifies message as string', function() {
    
    describe('success with flash message', function() {
      function Strategy() {
      }
      Strategy.prototype.authenticate = function(req, options) {
        var user = { id: '1', username: 'jaredhanson' };
        this.success(user, 'Greetings');
      };
    
      var passport = new Passport();
      passport.use('success', new Strategy());
    
      var request, response;

      before(function(done) {
        chai.connect.use('express', authenticate(passport, 'success', { successFlash: true,
                                                              successRedirect: 'http://www.example.com/account' }))
          .req(function(req) {
            request = req;
            req.session = {};
          
            req.logIn = function(user, options, done) {
              this.user = user;
              done();
            };
            req.flash = function(type, msg) {
              this.message = { type: type, msg: msg };
            };
          })
          .end(function(res) {
            response = res;
            done();
          })
          .dispatch();
      });
    
it('-361-should set user', function() {
        expect(request.user).to.be.an('object');
        expect(request.user.id).to.equal('1');
        expect(request.user.username).to.equal('jaredhanson');
      });
    
it('-362-should flash message', function() {
        expect(request.message.type).to.equal('success');
        expect(request.message.msg).to.equal('Greetings');
      });
    
it('-363-should redirect', function() {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('http://www.example.com/account');
      });
    });
    
    describe('success with flash message using type set by route', function() {
      function Strategy() {
      }
      Strategy.prototype.authenticate = function(req, options) {
        var user = { id: '1', username: 'jaredhanson' };
        this.success(user, 'Greetings');
      };
    
      var passport = new Passport();
      passport.use('success', new Strategy());
    
      var request, response;

      before(function(done) {
        chai.connect.use('express', authenticate(passport, 'success', { successFlash: { type: 'info' },
                                                              successRedirect: 'http://www.example.com/account' }))
          .req(function(req) {
            request = req;
            req.session = {};
          
            req.logIn = function(user, options, done) {
              this.user = user;
              done();
            };
            req.flash = function(type, msg) {
              this.message = { type: type, msg: msg };
            };
          })
          .end(function(res) {
            response = res;
            done();
          })
          .dispatch();
      });
    
it('-364-should set user', function() {
        expect(request.user).to.be.an('object');
        expect(request.user.id).to.equal('1');
        expect(request.user.username).to.equal('jaredhanson');
      });
    
it('-365-should flash message', function() {
        expect(request.message.type).to.equal('info');
        expect(request.message.msg).to.equal('Greetings');
      });
    
it('-366-should redirect', function() {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('http://www.example.com/account');
      });
    });
    
    describe('success with flash message overridden by route as string', function() {
      function Strategy() {
      }
      Strategy.prototype.authenticate = function(req, options) {
        var user = { id: '1', username: 'jaredhanson' };
        this.success(user, 'Greetings');
      };
    
      var passport = new Passport();
      passport.use('success', new Strategy());
    
      var request, response;

      before(function(done) {
        chai.connect.use('express', authenticate(passport, 'success', { successFlash: 'Login complete',
                                                              successRedirect: 'http://www.example.com/account' }))
          .req(function(req) {
            request = req;
            req.session = {};
          
            req.logIn = function(user, options, done) {
              this.user = user;
              done();
            };
            req.flash = function(type, msg) {
              this.message = { type: type, msg: msg };
            };
          })
          .end(function(res) {
            response = res;
            done();
          })
          .dispatch();
      });
    
it('-367-should set user', function() {
        expect(request.user).to.be.an('object');
        expect(request.user.id).to.equal('1');
        expect(request.user.username).to.equal('jaredhanson');
      });
    
it('-368-should flash message', function() {
        expect(request.message.type).to.equal('success');
        expect(request.message.msg).to.equal('Login complete');
      });
    
it('-369-should redirect', function() {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('http://www.example.com/account');
      });
    });
    
    describe('success with flash message overridden by route using options', function() {
      function Strategy() {
      }
      Strategy.prototype.authenticate = function(req, options) {
        var user = { id: '1', username: 'jaredhanson' };
        this.success(user, 'Greetings');
      };
    
      var passport = new Passport();
      passport.use('success', new Strategy());
    
      var request, response;

      before(function(done) {
        chai.connect.use('express', authenticate(passport, 'success', { successFlash: { message: 'OK' },
                                                              successRedirect: 'http://www.example.com/account' }))
          .req(function(req) {
            request = req;
            req.session = {};
          
            req.logIn = function(user, options, done) {
              this.user = user;
              done();
            };
            req.flash = function(type, msg) {
              this.message = { type: type, msg: msg };
            };
          })
          .end(function(res) {
            response = res;
            done();
          })
          .dispatch();
      });
    
it('-370-should set user', function() {
        expect(request.user).to.be.an('object');
        expect(request.user.id).to.equal('1');
        expect(request.user.username).to.equal('jaredhanson');
      });
    
it('-371-should flash message', function() {
        expect(request.message.type).to.equal('success');
        expect(request.message.msg).to.equal('OK');
      });
    
it('-372-should redirect', function() {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('http://www.example.com/account');
      });
    });
    
    describe('success with flash message overridden by route using options with type', function() {
      function Strategy() {
      }
      Strategy.prototype.authenticate = function(req, options) {
        var user = { id: '1', username: 'jaredhanson' };
        this.success(user, 'Greetings');
      };
    
      var passport = new Passport();
      passport.use('success', new Strategy());
    
      var request, response;

      before(function(done) {
        chai.connect.use('express', authenticate(passport, 'success', { successFlash: { type: 'notice', message: 'Last login was yesterday' },
                                                              successRedirect: 'http://www.example.com/account' }))
          .req(function(req) {
            request = req;
            req.session = {};
          
            req.logIn = function(user, options, done) {
              this.user = user;
              done();
            };
            req.flash = function(type, msg) {
              this.message = { type: type, msg: msg };
            };
          })
          .end(function(res) {
            response = res;
            done();
          })
          .dispatch();
      });
    
it('-373-should set user', function() {
        expect(request.user).to.be.an('object');
        expect(request.user.id).to.equal('1');
        expect(request.user.username).to.equal('jaredhanson');
      });
    
it('-374-should flash message', function() {
        expect(request.message.type).to.equal('notice');
        expect(request.message.msg).to.equal('Last login was yesterday');
      });
    
it('-375-should redirect', function() {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('http://www.example.com/account');
      });
    });
    
  });
  
  
  describe('using strategy that does not specify message', function() {
    
    describe('success with flash message left up to strategy', function() {
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
        chai.connect.use('express', authenticate(passport, 'success', { successFlash: true,
                                                              successRedirect: 'http://www.example.com/account' }))
          .req(function(req) {
            request = req;
            req.session = {};
          
            req.logIn = function(user, options, done) {
              this.user = user;
              done();
            };
            req.flash = function(type, msg) {
              this.message = { type: type, msg: msg };
            };
          })
          .end(function(res) {
            response = res;
            done();
          })
          .dispatch();
      });
    
it('-376-should set user', function() {
        expect(request.user).to.be.an('object');
        expect(request.user.id).to.equal('1');
        expect(request.user.username).to.equal('jaredhanson');
      });
    
it('-377-should not flash message', function() {
        expect(request.message).to.be.undefined;
      });
    
it('-378-should redirect', function() {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('http://www.example.com/account');
      });
    });
    
    describe('success with flash message left up to strategy using type set by route', function() {
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
        chai.connect.use('express', authenticate(passport, 'success', { successFlash: { type: 'info' },
                                                              successRedirect: 'http://www.example.com/account' }))
          .req(function(req) {
            request = req;
            req.session = {};
          
            req.logIn = function(user, options, done) {
              this.user = user;
              done();
            };
            req.flash = function(type, msg) {
              this.message = { type: type, msg: msg };
            };
          })
          .end(function(res) {
            response = res;
            done();
          })
          .dispatch();
      });
    
it('-379-should set user', function() {
        expect(request.user).to.be.an('object');
        expect(request.user.id).to.equal('1');
        expect(request.user.username).to.equal('jaredhanson');
      });
    
it('-380-should not flash message', function() {
        expect(request.message).to.be.undefined;
      });
    
it('-381-should redirect', function() {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('http://www.example.com/account');
      });
    });
    
    describe('success with flash message specified by route as string', function() {
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
        chai.connect.use('express', authenticate(passport, 'success', { successFlash: 'Login complete',
                                                              successRedirect: 'http://www.example.com/account' }))
          .req(function(req) {
            request = req;
            req.session = {};
          
            req.logIn = function(user, options, done) {
              this.user = user;
              done();
            };
            req.flash = function(type, msg) {
              this.message = { type: type, msg: msg };
            };
          })
          .end(function(res) {
            response = res;
            done();
          })
          .dispatch();
      });
    
it('-382-should set user', function() {
        expect(request.user).to.be.an('object');
        expect(request.user.id).to.equal('1');
        expect(request.user.username).to.equal('jaredhanson');
      });
    
it('-383-should flash message', function() {
        expect(request.message.type).to.equal('success');
        expect(request.message.msg).to.equal('Login complete');
      });
    
it('-384-should redirect', function() {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('http://www.example.com/account');
      });
    });
    
    describe('success with flash message specified by route using options', function() {
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
        chai.connect.use('express', authenticate(passport, 'success', { successFlash: { message: 'OK' },
                                                              successRedirect: 'http://www.example.com/account' }))
          .req(function(req) {
            request = req;
            req.session = {};
          
            req.logIn = function(user, options, done) {
              this.user = user;
              done();
            };
            req.flash = function(type, msg) {
              this.message = { type: type, msg: msg };
            };
          })
          .end(function(res) {
            response = res;
            done();
          })
          .dispatch();
      });
    
it('-385-should set user', function() {
        expect(request.user).to.be.an('object');
        expect(request.user.id).to.equal('1');
        expect(request.user.username).to.equal('jaredhanson');
      });
    
it('-386-should flash message', function() {
        expect(request.message.type).to.equal('success');
        expect(request.message.msg).to.equal('OK');
      });
    
it('-387-should redirect', function() {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('http://www.example.com/account');
      });
    });
    
    describe('success with flash message specified by route using options with type', function() {
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
        chai.connect.use('express', authenticate(passport, 'success', { successFlash: { type: 'notice', message: 'Last login was yesterday' },
                                                              successRedirect: 'http://www.example.com/account' }))
          .req(function(req) {
            request = req;
            req.session = {};
          
            req.logIn = function(user, options, done) {
              this.user = user;
              done();
            };
            req.flash = function(type, msg) {
              this.message = { type: type, msg: msg };
            };
          })
          .end(function(res) {
            response = res;
            done();
          })
          .dispatch();
      });
    
it('-388-should set user', function() {
        expect(request.user).to.be.an('object');
        expect(request.user.id).to.equal('1');
        expect(request.user.username).to.equal('jaredhanson');
      });
    
it('-389-should flash message', function() {
        expect(request.message.type).to.equal('notice');
        expect(request.message.msg).to.equal('Last login was yesterday');
      });
    
it('-390-should redirect', function() {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('http://www.example.com/account');
      });
    });
    
  });
  
});
