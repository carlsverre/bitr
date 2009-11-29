// Util class

var posix = require('posix');
process.mixin(GLOBAL, require('./lib/mojo'));

var rebuilding_cache = {};

var mem_cache = (function () {
  var datastore = {};

  return {
    hash: function (c,v) {
      return c+v;
    },

    add: function (c, v, data) {
      var h = this.hash(c, v);
      datastore[h] = data;
    },

    get: function (c, v) {
      var h = this.hash(c, v);
      return datastore[h];
    },

    has: function (c, v) {
      var h = this.hash(c, v);
      return Boolean(
        datastore[h]
      );
    }
  }
})();

var _puts = require('sys').puts;
function puts (str) {
  _puts('Render: ' + str);
}

function compare_mtimes (file1, file2, callback) {
  posix.stat(file1).addCallback(function (stats) {
    var mtime1 = stats.mtime;
    posix.stat(file2).addCallback(function (stats2) {
      var mtime2 = stats2.mtime;
      callback((mtime1 < mtime2) ? -1 : ((mtime1 == mtime2) ? 0 : 1));
    }).addErrback(function () {
      callback(1);
    });
  });
}

function cat (path, callback) {
  posix.cat(path).addCallback(function (content) {
    callback(content);
  });
}

exports.render = function (controller, view, o, callback) {
  var path  = 'templates/' + controller + '/' + view + '.html',
  path2 = 'cache/'+controller+'.'+ view + '.html.js';

  var hash = mem_cache.hash(controller, view);
  if(rebuilding_cache[hash]) {
    callback("rebuilding cache");
    return;
  }

  compare_mtimes(path, path2, function (compare) {
    if (compare <= 0) {
      if(mem_cache.has(controller,view)) callback(eval(mem_cache.get(controller,view)));
      else cat(path2, function (c) { 
        mem_cache.add(controller, view, c);
        callback(eval(c));
      });
    } else {
      puts("Rebuilding cache for [" + path + "]");
      rebuilding_cache[hash] = true;

      cat(path, function (c) {
        var template = "";
        var flags = process.O_CREAT|process.O_WRONLY|process.O_TRUNC;
        var promise = posix.open(path2, flags, process.S_IRWXU);
        promise.addCallback(function (fd) {
          var mojo = process.createChildProcess("mojo");
          mojo.addListener("output", function (data) {
            if(!data) { mojo.kill(); return; }
            posix.write(fd, data);
            template += data;
          });
          mojo.addListener("exit", function (code) {
            posix.close(fd);
            mem_cache.add(controller, view, template);
            callback(eval(template));

            delete rebuilding_cache[hash];
          });

          mojo.write(c);
          mojo.close();
        });
      });
    }
  });
}
