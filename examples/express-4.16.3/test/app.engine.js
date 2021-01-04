
var express = require('../')
  , fs = require('fs');
var path = require('path')

function render(path, options, fn) {
  fs.readFile(path, 'utf8', function(err, str){
    if (err) return fn(err);
    str = str.replace('{{user.name}}', options.user.name);
    fn(null, str);
  });
}

describe('app', function(){
  describe('.engine(ext, fn)', function(){
it('-3-should map a template engine', function(done){
      var app = express();

      app.set('views', path.join(__dirname, 'fixtures'))
      app.engine('.html', render);
      app.locals.user = { name: 'tobi' };

      app.render('user.html', function(err, str){
        if (err) return done(err);
        str.should.equal('<p>tobi</p>');
        done();
      })
    })

it('-4-should throw when the callback is missing', function(){
      var app = express();
      (function(){
        app.engine('.html', null);
      }).should.throw('callback function required');
    })

it('-5-should work without leading "."', function(done){
      var app = express();

      app.set('views', path.join(__dirname, 'fixtures'))
      app.engine('html', render);
      app.locals.user = { name: 'tobi' };

      app.render('user.html', function(err, str){
        if (err) return done(err);
        str.should.equal('<p>tobi</p>');
        done();
      })
    })

it('-6-should work "view engine" setting', function(done){
      var app = express();

      app.set('views', path.join(__dirname, 'fixtures'))
      app.engine('html', render);
      app.set('view engine', 'html');
      app.locals.user = { name: 'tobi' };

      app.render('user', function(err, str){
        if (err) return done(err);
        str.should.equal('<p>tobi</p>');
        done();
      })
    })

it('-7-should work "view engine" with leading "."', function(done){
      var app = express();

      app.set('views', path.join(__dirname, 'fixtures'))
      app.engine('.html', render);
      app.set('view engine', '.html');
      app.locals.user = { name: 'tobi' };

      app.render('user', function(err, str){
        if (err) return done(err);
        str.should.equal('<p>tobi</p>');
        done();
      })
    })
  })
})
