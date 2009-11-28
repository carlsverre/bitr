// Util class

var posix = require('posix');
process.mixin(GLOBAL, require('./lib/mojo'));

var _puts = require('sys').puts;

function puts (str) {
  _puts('Render.js -> ' + str);
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

  compare_mtimes(path, path2, function (compare) {
    if (compare <= 0) {
      cat(path2, function (c) { callback(eval(c)); });
    } else {
      puts("Rebuilding cache for [" + path + "]");
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
            callback(eval(template));
          });

          mojo.write(c);
          mojo.close();
        });
      });
    }
  });
}
