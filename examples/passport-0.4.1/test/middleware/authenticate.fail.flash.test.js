/* global describe, it, expect, before */
/* jshint expr: true */

var chai = require('chai')
  , authenticate = require('../../lib/middleware/authenticate')
  , Passport = require('../..').Passport;


describe('middleware/authenticate', function() {
  
  describe('using strategy that specifies message', function() {
    
    describe('fail with flash message', function() {
      function Strategy() {
      }
      Strategy.prototype.authenticate = function(req) {
        this.fail({ message: 'Invalid password' });
      };
    
      var passport = new Passport();
      passport.use('fail', new Strategy());
    
      var request, response;

      before(function(done) {
        chai.connect.use('express', authenticate(passport, 'fail', { failureFlash: true,
                                                           failureRedirect: 'http://www.example.com/login' }))
          .req(function(req) {
            request = req;
            req.session = {};
            
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
    
it('-186-should not set user', function() {
        expect(request.user).to.be.undefined;
      });
    
it('-187-should flash message', function() {
        expect(request.message.type).to.equal('error');
        expect(request.message.msg).to.equal('Invalid password');
      });
    
it('-188-should redirect', function() {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('http://www.example.com/login');
      });
    });
    
    describe('fail with flash message using type set by route', function() {
      function Strategy() {
      }
      Strategy.prototype.authenticate = function(req) {
        this.fail({ message: 'Invalid password' });
      };
    
      var passport = new Passport();
      passport.use('fail', new Strategy());
    
      var request, response;

      before(function(done) {
        chai.connect.use('express', authenticate(passport, 'fail', { failureFlash: { type: 'info' },
                                                           failureRedirect: 'http://www.example.com/login' }))
          .req(function(req) {
            request = req;
            req.session = {};
            
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
    
it('-189-should not set user', function() {
        expect(request.user).to.be.undefined;
      });
    
it('-190-should flash message', function() {
        expect(request.message.type).to.equal('info');
        expect(request.message.msg).to.equal('Invalid password');
      });
    
it('-191-should redirect', function() {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('http://www.example.com/login');
      });
    });
    
    describe('fail with flash message overridden by route as string', function() {
      function Strategy() {
      }
      Strategy.prototype.authenticate = function(req) {
        this.fail({ message: 'Invalid password' });
      };
    
      var passport = new Passport();
      passport.use('fail', new Strategy());
    
      var request, response;

      before(function(done) {
        chai.connect.use('express', authenticate(passport, 'fail', { failureFlash: 'Wrong credentials',
                                                           failureRedirect: 'http://www.example.com/login' }))
          .req(function(req) {
            request = req;
            req.session = {};
            
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
    
it('-192-should not set user', function() {
        expect(request.user).to.be.undefined;
      });
    
it('-193-should flash message', function() {
        expect(request.message.type).to.equal('error');
        expect(request.message.msg).to.equal('Wrong credentials');
      });
    
it('-194-should redirect', function() {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('http://www.example.com/login');
      });
    });
    
    describe('fail with flash message overridden by route using options', function() {
      function Strategy() {
      }
      Strategy.prototype.authenticate = function(req) {
        this.fail({ message: 'Invalid password' });
      };
    
      var passport = new Passport();
      passport.use('fail', new Strategy());
    
      var request, response;

      before(function(done) {
        chai.connect.use('express', authenticate(passport, 'fail', { failureFlash: { message: 'Try again' },
                                                           failureRedirect: 'http://www.example.com/login' }))
          .req(function(req) {
            request = req;
            req.session = {};
            
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
    
it('-195-should not set user', function() {
        expect(request.user).to.be.undefined;
      });
    
it('-196-should flash message', function() {
        expect(request.message.type).to.equal('error');
        expect(request.message.msg).to.equal('Try again');
      });
    
it('-197-should redirect', function() {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('http://www.example.com/login');
      });
    });
    
    describe('fail with flash message overridden by route using options with type', function() {
      function Strategy() {
      }
      Strategy.prototype.authenticate = function(req) {
        this.fail({ message: 'Invalid password' });
      };
    
      var passport = new Passport();
      passport.use('fail', new Strategy());
    
      var request, response;

      before(function(done) {
        chai.connect.use('express', authenticate(passport, 'fail', { failureFlash: { type: 'notice', message: 'Try again' },
                                                           failureRedirect: 'http://www.example.com/login' }))
          .req(function(req) {
            request = req;
            req.session = {};
            
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
    
it('-198-should not set user', function() {
        expect(request.user).to.be.undefined;
      });
    
it('-199-should flash message', function() {
        expect(request.message.type).to.equal('notice');
        expect(request.message.msg).to.equal('Try again');
      });
    
it('-200-should redirect', function() {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('http://www.example.com/login');
      });
    });
    
  });
  
  
  describe('using strategy that specifies message and type', function() {
    
    describe('fail with flash message', function() {
      function Strategy() {
      }
      Strategy.prototype.authenticate = function(req) {
        this.fail({ type: 'notice', message: 'Invite required' });
      };
    
      var passport = new Passport();
      passport.use('fail', new Strategy());
    
      var request, response;

      before(function(done) {
        chai.connect.use('express', authenticate(passport, 'fail', { failureFlash: true,
                                                           failureRedirect: 'http://www.example.com/login' }))
          .req(function(req) {
            request = req;
            req.session = {};
            
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
    
it('-201-should not set user', function() {
        expect(request.user).to.be.undefined;
      });
    
it('-202-should flash message', function() {
        expect(request.message.type).to.equal('notice');
        expect(request.message.msg).to.equal('Invite required');
      });
    
it('-203-should redirect', function() {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('http://www.example.com/login');
      });
    });
    
    describe('fail with flash message using type set by route', function() {
      function Strategy() {
      }
      Strategy.prototype.authenticate = function(req) {
        this.fail({ type: 'notice', message: 'Invite required' });
      };
    
      var passport = new Passport();
      passport.use('fail', new Strategy());
    
      var request, response;

      before(function(done) {
        chai.connect.use('express', authenticate(passport, 'fail', { failureFlash: { type: 'info' },
                                                           failureRedirect: 'http://www.example.com/login' }))
          .req(function(req) {
            request = req;
            req.session = {};
            
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
    
it('-204-should not set user', function() {
        expect(request.user).to.be.undefined;
      });
    
it('-205-should flash message', function() {
        expect(request.message.type).to.equal('info');
        expect(request.message.msg).to.equal('Invite required');
      });
    
it('-206-should redirect', function() {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('http://www.example.com/login');
      });
    });
    
    describe('fail with flash message overridden by route as string', function() {
      function Strategy() {
      }
      Strategy.prototype.authenticate = function(req) {
        this.fail({ type: 'notice', message: 'Invite required' });
      };
    
      var passport = new Passport();
      passport.use('fail', new Strategy());
    
      var request, response;

      before(function(done) {
        chai.connect.use('express', authenticate(passport, 'fail', { failureFlash: 'Wrong credentials',
                                                           failureRedirect: 'http://www.example.com/login' }))
          .req(function(req) {
            request = req;
            req.session = {};
            
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
    
it('-207-should not set user', function() {
        expect(request.user).to.be.undefined;
      });
    
it('-208-should flash message', function() {
        expect(request.message.type).to.equal('error');
        expect(request.message.msg).to.equal('Wrong credentials');
      });
    
it('-209-should redirect', function() {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('http://www.example.com/login');
      });
    });
    
    describe('fail with flash message overridden by route using options', function() {
      function Strategy() {
      }
      Strategy.prototype.authenticate = function(req) {
        this.fail({ type: 'notice', message: 'Invite required' });
      };
    
      var passport = new Passport();
      passport.use('fail', new Strategy());
    
      var request, response;

      before(function(done) {
        chai.connect.use('express', authenticate(passport, 'fail', { failureFlash: { message: 'Try again' },
                                                           failureRedirect: 'http://www.example.com/login' }))
          .req(function(req) {
            request = req;
            req.session = {};
            
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
    
it('-210-should not set user', function() {
        expect(request.user).to.be.undefined;
      });
    
it('-211-should flash message', function() {
        expect(request.message.type).to.equal('error');
        expect(request.message.msg).to.equal('Try again');
      });
    
it('-212-should redirect', function() {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('http://www.example.com/login');
      });
    });
    
    describe('fail with flash message overridden by route using options with type', function() {
      function Strategy() {
      }
      Strategy.prototype.authenticate = function(req) {
        this.fail({ type: 'notice', message: 'Invite required' });
      };
    
      var passport = new Passport();
      passport.use('fail', new Strategy());
    
      var request, response;

      before(function(done) {
        chai.connect.use('express', authenticate(passport, 'fail', { failureFlash: { type: 'info', message: 'Try again' },
                                                           failureRedirect: 'http://www.example.com/login' }))
          .req(function(req) {
            request = req;
            req.session = {};
            
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
    
it('-213-should not set user', function() {
        expect(request.user).to.be.undefined;
      });
    
it('-214-should flash message', function() {
        expect(request.message.type).to.equal('info');
        expect(request.message.msg).to.equal('Try again');
      });
    
it('-215-should redirect', function() {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('http://www.example.com/login');
      });
    });
    
  });
  
  
  describe('using strategy that specifies message as string', function() {
    
    describe('fail with flash message', function() {
      function Strategy() {
      }
      Strategy.prototype.authenticate = function(req) {
        this.fail('Access denied');
      };
    
      var passport = new Passport();
      passport.use('fail', new Strategy());
    
      var request, response;

      before(function(done) {
        chai.connect.use('express', authenticate(passport, 'fail', { failureFlash: true,
                                                           failureRedirect: 'http://www.example.com/login' }))
          .req(function(req) {
            request = req;
            req.session = {};
            
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
    
it('-216-should not set user', function() {
        expect(request.user).to.be.undefined;
      });
    
it('-217-should flash message', function() {
        expect(request.message.type).to.equal('error');
        expect(request.message.msg).to.equal('Access denied');
      });
    
it('-218-should redirect', function() {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('http://www.example.com/login');
      });
    });
    
    describe('fail with flash message using type set by route', function() {
      function Strategy() {
      }
      Strategy.prototype.authenticate = function(req) {
        this.fail('Access denied');
      };
    
      var passport = new Passport();
      passport.use('fail', new Strategy());
    
      var request, response;

      before(function(done) {
        chai.connect.use('express', authenticate(passport, 'fail', { failureFlash: { type: 'info' },
                                                           failureRedirect: 'http://www.example.com/login' }))
          .req(function(req) {
            request = req;
            req.session = {};
            
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
    
it('-219-should not set user', function() {
        expect(request.user).to.be.undefined;
      });
    
it('-220-should flash message', function() {
        expect(request.message.type).to.equal('info');
        expect(request.message.msg).to.equal('Access denied');
      });
    
it('-221-should redirect', function() {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('http://www.example.com/login');
      });
    });
    
    describe('fail with flash message overridden by route as string', function() {
      function Strategy() {
      }
      Strategy.prototype.authenticate = function(req) {
        this.fail('Access denied');
      };
    
      var passport = new Passport();
      passport.use('fail', new Strategy());
    
      var request, response;

      before(function(done) {
        chai.connect.use('express', authenticate(passport, 'fail', { failureFlash: 'Wrong credentials',
                                                           failureRedirect: 'http://www.example.com/login' }))
          .req(function(req) {
            request = req;
            req.session = {};
            
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
    
it('-222-should not set user', function() {
        expect(request.user).to.be.undefined;
      });
    
it('-223-should flash message', function() {
        expect(request.message.type).to.equal('error');
        expect(request.message.msg).to.equal('Wrong credentials');
      });
    
it('-224-should redirect', function() {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('http://www.example.com/login');
      });
    });
    
    describe('fail with flash message overridden by route using options', function() {
      function Strategy() {
      }
      Strategy.prototype.authenticate = function(req) {
        this.fail('Access denied');
      };
    
      var passport = new Passport();
      passport.use('fail', new Strategy());
    
      var request, response;

      before(function(done) {
        chai.connect.use('express', authenticate(passport, 'fail', { failureFlash: { message: 'Try again' },
                                                           failureRedirect: 'http://www.example.com/login' }))
          .req(function(req) {
            request = req;
            req.session = {};
            
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
    
it('-225-should not set user', function() {
        expect(request.user).to.be.undefined;
      });
    
it('-226-should flash message', function() {
        expect(request.message.type).to.equal('error');
        expect(request.message.msg).to.equal('Try again');
      });
    
it('-227-should redirect', function() {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('http://www.example.com/login');
      });
    });
    
    describe('fail with flash message overridden by route using options with type', function() {
      function Strategy() {
      }
      Strategy.prototype.authenticate = function(req) {
        this.fail('Access denied');
      };
    
      var passport = new Passport();
      passport.use('fail', new Strategy());
    
      var request, response;

      before(function(done) {
        chai.connect.use('express', authenticate(passport, 'fail', { failureFlash: { type: 'notice', message: 'Try again' },
                                                           failureRedirect: 'http://www.example.com/login' }))
          .req(function(req) {
            request = req;
            req.session = {};
            
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
    
it('-228-should not set user', function() {
        expect(request.user).to.be.undefined;
      });
    
it('-229-should flash message', function() {
        expect(request.message.type).to.equal('notice');
        expect(request.message.msg).to.equal('Try again');
      });
    
it('-230-should redirect', function() {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('http://www.example.com/login');
      });
    });
    
  });
  
  
  describe('using strategy that does not specify message', function() {
    
    describe('fail with flash message left up to strategy', function() {
      function Strategy() {
      }
      Strategy.prototype.authenticate = function(req) {
        this.fail();
      };
    
      var passport = new Passport();
      passport.use('fail', new Strategy());
    
      var request, response;

      before(function(done) {
        chai.connect.use('express', authenticate(passport, 'fail', { failureFlash: true,
                                                           failureRedirect: 'http://www.example.com/login' }))
          .req(function(req) {
            request = req;
            req.session = {};
            
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
    
it('-231-should not set user', function() {
        expect(request.user).to.be.undefined;
      });
    
it('-232-should not flash message', function() {
        expect(request.message).to.be.undefined;
      });
    
it('-233-should redirect', function() {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('http://www.example.com/login');
      });
    });
    
    describe('fail with flash message left up to strategy using type set by route', function() {
      function Strategy() {
      }
      Strategy.prototype.authenticate = function(req) {
        this.fail();
      };
    
      var passport = new Passport();
      passport.use('fail', new Strategy());
    
      var request, response;

      before(function(done) {
        chai.connect.use('express', authenticate(passport, 'fail', { failureFlash: { type: 'info' },
                                                           failureRedirect: 'http://www.example.com/login' }))
          .req(function(req) {
            request = req;
            req.session = {};
            
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
    
it('-234-should not set user', function() {
        expect(request.user).to.be.undefined;
      });
    
it('-235-should not flash message', function() {
        expect(request.message).to.be.undefined;
      });
    
it('-236-should redirect', function() {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('http://www.example.com/login');
      });
    });
    
    describe('fail with flash message specified by route as string', function() {
      function Strategy() {
      }
      Strategy.prototype.authenticate = function(req) {
        this.fail();
      };
    
      var passport = new Passport();
      passport.use('fail', new Strategy());
    
      var request, response;

      before(function(done) {
        chai.connect.use('express', authenticate(passport, 'fail', { failureFlash: 'Wrong credentials',
                                                           failureRedirect: 'http://www.example.com/login' }))
          .req(function(req) {
            request = req;
            req.session = {};
            
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
    
it('-237-should not set user', function() {
        expect(request.user).to.be.undefined;
      });
    
it('-238-should flash message', function() {
        expect(request.message.type).to.equal('error');
        expect(request.message.msg).to.equal('Wrong credentials');
      });
    
it('-239-should redirect', function() {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('http://www.example.com/login');
      });
    });
    
    describe('fail with flash message specified by route using options', function() {
      function Strategy() {
      }
      Strategy.prototype.authenticate = function(req) {
        this.fail();
      };
    
      var passport = new Passport();
      passport.use('fail', new Strategy());
    
      var request, response;

      before(function(done) {
        chai.connect.use('express', authenticate(passport, 'fail', { failureFlash: { message: 'Try again' },
                                                           failureRedirect: 'http://www.example.com/login' }))
          .req(function(req) {
            request = req;
            req.session = {};
            
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
    
it('-240-should not set user', function() {
        expect(request.user).to.be.undefined;
      });
    
it('-241-should flash message', function() {
        expect(request.message.type).to.equal('error');
        expect(request.message.msg).to.equal('Try again');
      });
    
it('-242-should redirect', function() {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('http://www.example.com/login');
      });
    });
    
    describe('fail with flash message specified by route using options with type', function() {
      function Strategy() {
      }
      Strategy.prototype.authenticate = function(req) {
        this.fail();
      };
    
      var passport = new Passport();
      passport.use('fail', new Strategy());
    
      var request, response;

      before(function(done) {
        chai.connect.use('express', authenticate(passport, 'fail', { failureFlash: { type: 'notice', message: 'Try again' },
                                                           failureRedirect: 'http://www.example.com/login' }))
          .req(function(req) {
            request = req;
            req.session = {};
            
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
    
it('-243-should not set user', function() {
        expect(request.user).to.be.undefined;
      });
    
it('-244-should flash message', function() {
        expect(request.message.type).to.equal('notice');
        expect(request.message.msg).to.equal('Try again');
      });
    
it('-245-should redirect', function() {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('http://www.example.com/login');
      });
    });
    
  });
  
});
