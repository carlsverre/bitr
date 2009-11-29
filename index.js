process.mixin(GLOBAL, require('sys'));
process.mixin(GLOBAL, require('./database'));
process.mixin(GLOBAL, require('./render'));
process.mixin(GLOBAL, require('./models/user'));

// node requires
var http      = require('http'),
    conf      = require('./conf'),
    server    = require('./lib/node-router/node-router'),
    sessions  = require('./lib/sessions/sessions');

// setup controllers
server.map_urls(require('./views/views').urls);

// setup middleware
var session_middleware = {
  process_request: function (req) {
    options = {lifetime:604800};
    req.session = sessions.lookupOrCreate(req, options);
    return req;
  },

  headers: function (req) {
    var h = {};
    h["Set-Cookie"] = req.session.setCookieHeader();
    return h;
  }
}

server.addMiddleware(session_middleware);

server.listen(8080);
