
var cl  = require('./lib/consolelog/consolelog');
var sys = require('sys');

var levelmap = [cl.log, cl.info, cl.warn, cl.error];
//var levelmap = [sys.puts, sys.puts, sys.debug, sys.debug];

function mk_pf(pref) {
  return function () {
    var d = new Date();
    var s = "["+pad(d.getHours()) + ":" + pad(d.getMinutes())+"]";
    return s + " " +pref+": ";
  }
}

function pad(x) {return ((x+'').length==1)?'0'+x:x};

cl.setLogPrefix   (mk_pf("LOG  "));
cl.setInfoPrefix  (mk_pf("INFO "));
cl.setWarnPrefix  (mk_pf("DEBUG"));
cl.setErrorPrefix (mk_pf("ERROR"));

function loglvl() {
  var args = Array.prototype.slice.call(arguments);
  var level = args.shift();
  var log_msg = "";
  for (var i=0; i<args.length; i++) {
    log_msg += (args[i]+"") + ((i==args.length-1)?"":", ");
  }
  levelmap[level](log_msg);
}

function l(level,args) {
  args = Array.prototype.slice.call(args);
  args.unshift(level);
  loglvl.apply(null, args);
}

function log()    { l(0, arguments); }
function info()   { l(1, arguments); }
function debug()  { l(2, arguments); }
function error()  { l(3, arguments); }

process.mixin(exports, {
  log:      log,
  puts:     sys.puts,
  info:     info,
  debug:    debug,
  error:    error,
  inspect:  sys.inspect
});
