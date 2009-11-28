process.mixin(GLOBAL, require('sys'));
process.mixin(GLOBAL, require('./database'));

// node requires
var http    = require('http'),
    conf    = require('./conf'),
    server  = require('./lib/node-router/node-router');

// setup controllers
server.map_urls(require('./views/views').urls);

server.listen(8080);

puts('Server running at http://127.0.0.1:8080/');
