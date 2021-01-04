
var express = require('../')

describe('app.listen()', function(){
it('-22-should wrap with an HTTP server', function(done){
    var app = express();

    app.del('/tobi', function(req, res){
      res.end('deleted tobi!');
    });

    var server = app.listen(9999, function(){
      server.close();
      done();
    });
  })
})
