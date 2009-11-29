process.mixin(GLOBAL, require('sys'));
process.mixin(GLOBAL, require('./database'));

// node requires
var http    = require('http'),
    conf    = require('./conf'),
    server  = require('./lib/node-router/node-router');

// setup controllers
server.map_urls(require('./views/views').urls);
server.map_urls(require('./views/user_crud').urls);

server.listen(8080);
