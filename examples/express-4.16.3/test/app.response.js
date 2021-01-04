
var express = require('../')
  , request = require('supertest');

describe('app', function(){
  describe('.response', function(){
it('-68-should extend the response prototype', function(done){
      var app = express();

      app.response.shout = function(str){
        this.send(str.toUpperCase());
      };

      app.use(function(req, res){
        res.shout('hey');
      });

      request(app)
      .get('/')
      .expect('HEY', done);
    })

it('-69-should not be influenced by other app protos', function(done){
      var app = express()
        , app2 = express();

      app.response.shout = function(str){
        this.send(str.toUpperCase());
      };

      app2.response.shout = function(str){
        this.send(str);
      };

      app.use(function(req, res){
        res.shout('hey');
      });

      request(app)
      .get('/')
      .expect('HEY', done);
    })
  })
})
