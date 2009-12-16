// get configuration
process.mixin(GLOBAL, {conf:require('./conf')});

// setup global helpers
process.mixin(GLOBAL, require('./console'));    // this implements sys functions
process.mixin(GLOBAL, require('./lib/sprintf'));
process.mixin(GLOBAL, require('./render'));
process.mixin(GLOBAL, require('./lib/watcher'));

// include models
process.mixin(GLOBAL, require('./models/user'));
process.mixin(GLOBAL, require('./models/post'));
process.mixin(GLOBAL, require('./models/perms'));
process.mixin(GLOBAL, require('./models/group'));
process.mixin(GLOBAL, require('./models/sessions'));

// node requires
var requires = {
  server:     require('./lib/node-router/node-router'),
  sessions:   require('./lib/sessions/sessions'),
  DB:         require('./database')
}
process.mixin(GLOBAL, requires);

// heat up the sessions cache
Sessions.get().addCallback(sessions.loadSessions);
// setters/getters to store the sessions in the DB
sessions.set_saveSerializedSession(Sessions.add);
sessions.set_removeSerializedSession(Sessions.remove);
sessions.enableSessionSaving(1000, ['user_id']);

// setup controllers
server.map_urls(require('./views/views').urls);
server.map_urls(require('./views/auth').urls);
server.map_urls(require('./views/user').urls);
server.map_urls(require('./views/posts').urls);
server.map_urls(require('./views/friends').urls);
server.map_urls(require('./views/groups').urls);

// setup middleware
var session_middleware = {
  process_request: function (req,res) {
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

var static_middleware = {
  process_request: function (req, res) {
    var match = req.uri.path.match('^/static/(.+)$');
    if (match && match[0].length > 0) {
      var file = unescape(match[1]);
      server.staticHandler(req,res,conf.settings.static+file);
      return null;
    }
    return req;
  }
}

server.addMiddleware(static_middleware);
server.addMiddleware(session_middleware);

server.listen(8080);
