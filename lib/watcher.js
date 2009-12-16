/*
* object.watch v0.0.1: Cross-browser object.watch
*
* By Elijah Grey, http://eligrey.com
*
* A shim that partially implements object.watch and object.unwatch
*
* Public Domain.
* NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
*/

// object.watch

var store = "jf3290f9a";

exports.watch = function (obj, prop, handler, args) {
    if(!obj[store]) obj[store] = {};

    getter = function () {
      return obj[store][prop];
    };
    setter = function (val) {
      var oldval = obj[store][prop];
      return obj[store][prop] = handler.call(obj, prop, oldval, val, args);
    };

    if (delete obj[prop]) { // can't watch constants
      if (Object.defineProperty) // ECMAScript 5
        Object.defineProperty(obj, prop, {
          get: getter,
          set: setter
        });
      else if (Object.prototype.__defineGetter__ && Object.prototype.__defineSetter__) { // legacy
        Object.prototype.__defineGetter__.call(obj, prop, getter);
        Object.prototype.__defineSetter__.call(obj, prop, setter);
      }
    }
  };

// object.unwatch
exports.unwatch = function (obj, prop) {
    delete obj[prop]; // remove accessors
    obj[prop] = obj[store][prop];
    delete obj[store][prop];
    var count = 0;
    for(var k in obj[store]) {count = 1;break;};
    if (count == 0) delete obj[store];
  };
