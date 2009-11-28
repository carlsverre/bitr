process.mixin(GLOBAL, require('sys'));
process.mixin(GLOBAL, require('./database'));

var http    = require('http'),
    conf    = require('./conf'),
    server  = require('./lib/node-router/node-router');



puts('Server running at http://127.0.3.1:8080/');
