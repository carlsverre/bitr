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

// initialize partials
var partials = {};

(function () {
  var partials_dir = conf.settings.partials_dir;

  posix.readdir(partials_dir)
  .addCallback(function (list) {
    var get_next = function(i) {
      if(i >= list.length) return;

      var partial_src = list[i];
      var partial = partial_src.replace('.html','');
      var partial_path = partials_dir + partial_src;

      posix.cat(partial_path)
      .addCallback(function (html) {
        partials[partial] = html;
        get_next(i+1);
      });
    }

    get_next(0);
  });
})();

exports.render = function (req, controller, view, context, callback) {
  if(req == null) {
    debug("ERROR: Render must be called like so: render.call(null, args...)");
    return;
  }

  // mixin some magic
  process.mixin(context, req.template_params);
  process.mixin(context, partials);

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
