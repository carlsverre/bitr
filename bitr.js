// get configuration
process.mixin(GLOBAL, {conf:require('./conf')});

// setup global helpers
process.mixin(GLOBAL, require('./console'));    // this implements sys functions
process.mixin(GLOBAL, require('./lib/sprintf'));
process.mixin(GLOBAL, require('./render'));

// include models
process.mixin(GLOBAL, require('./models/user'));
process.mixin(GLOBAL, require('./models/post'));
process.mixin(GLOBAL, require('./models/perms'));
process.mixin(GLOBAL, require('./models/group'));

// node requires
var requires = {
  server:     require('./lib/node-router/node-router'),
  sessions:   require('./lib/sessions/sessions'),
  DB:         require('./database')
}
process.mixin(GLOBAL, requires);

// setup controllers
server.map_urls(require('./views/views').urls);
server.map_urls(require('./views/auth').urls);
server.map_urls(require('./views/user').urls);
server.map_urls(require('./views/posts').urls);
server.map_urls(require('./views/friends').urls);
server.map_urls(require('./views/groups').urls);

// setup middleware
var session_middleware = {
  process_request: function (req) {
    options = {lifetime:604800};
    req.session = sessions.lookupOrCreate(req, options);

    if ('flash' in req.session.data) {
      req.template_params.flash = req.session.data.flash;
      delete req.session.data['flash'];
    }

    return req;
  },

  headers: function (req) {
    var h = {};
    h["Set-Cookie"] = req.session.getSetCookieHeaderValue();
    return h;
  }
}

server.addMiddleware(session_middleware);

server.listen(8080);
