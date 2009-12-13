// Util class

var posix = require('posix');
var haml  = require('./lib/haml-js/haml');
var conf  = require('./conf');

var mem_cache = (function () {
  var datastore = {};

  var is_expired = function(element) {
    if(conf.settings.cache_time == 0) {
      return false;
    }

    var c = element.created;
    var n = new Date();

    var diff = (n.getTime() - c.getTime()) / (1000);

    return diff > conf.settings.cache_time;
  }

  return {
    hash: function (c,v) {
      return c+v;
    },

    add: function (c, v, data) {
      var h = this.hash(c, v);
      datastore[h] = {
        created:  new Date(),
        data:     data
      };
    },

    get: function (c, v) {
      var h = this.hash(c, v);
      return datastore[h].data;
    },

    has: function (c, v) {
      var h = this.hash(c, v);
      var element = datastore[h];

      if(!element) return false;

      return !is_expired(element);
    }
  }
})();

var _puts = require('sys').puts;
function puts (str) {
  _puts('Render: ' + str);
}

function render_haml(context, haml) {
  return haml.render(context, haml);
}

exports.render = function (req, controller, view, context, callback) {
  if(req == null) {
    debug("ERROR: Render must be called like so: render.call(null, args...)");
    return;
  }

  process.mixin(context, req.template_params);

  var path = 'templates/' + controller + '/' + view + '.haml';

  // get template from mem-cache and render
  if (mem_cache.has(controller,view)) {
    var text = mem_cache.get(controller,view);
    callback(haml.render(context, text));
    return;
  }

  // else get from filesystem, cache in mem, and render
  posix.cat(path).addCallback(function (text) {
    mem_cache.add(controller, view, text);
    var html = haml.render(context, text);
    callback(html);
  });

}
