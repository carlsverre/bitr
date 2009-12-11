// Util class

var posix = require('posix');
var haml  = require('./lib/haml-js/haml');

var mem_cache = (function () {
  var datastore = {};

  var is_expired = function(element) {
    var c = element.created;
    var n = new Date();

    var diff = (n.getTime() - c.getTime()) / 1000*60;

    return diff > 0;   // 0 second cache
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

      return is_expired(element);
    }
  }
})();

var _puts = require('sys').puts;
function puts (str) {
  _puts('Render: ' + str);
}

exports.render = function (req, controller, view, context, callback) {
  if(req == null) {
    debug("ERROR: Render must be called like so: render.call(null, args...)");
    return;
  }

  process.mixin(context, req.template_params);

  var path  = 'templates/' + controller + '/' + view + '.haml';

  // return from mem-cache
  if (mem_cache.has(controller,view)) {
    callback(mem_cache.get(controller,view));
    return;
  }

  haml.render(context, path, function (html) {
    mem_cache.add(controller, view, html);
    callback(html);
  });

}
