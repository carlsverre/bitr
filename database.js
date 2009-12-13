var postgres    = require('./lib/postgres-js/postgres');
var pg_parsers  = require('./lib/postgres-js/lib/parsers');
var pg_OIDS     = require('./lib/postgres-js/lib/type-oids');
conf = require('./conf');

postgres.DEBUG = 1;

var c = new postgres.Connection(conf.dbinfo.dbname,
                                conf.dbinfo.user,
                                conf.dbinfo.password,
                                conf.dbinfo.port,
                                conf.dbinfo.hostaddr);

exports.query = c.query;

exports.seralize = function(element) {
  switch (typeof(element)) {
    case "number":
      return element
    case "string":
      return sprintf("%s", element);
    case "boolean":
      return (element)?"TRUE":"FALSE";
    case "undefined":
      return "";
  }
  
  // element is an object
  var rgx = /function (\w\w*)\(\)/i
  var element_type = rgx.exec(element.constructor.toString())[1];
  switch (element_type) {
    case "Date":
      return pg_parsers.formatDateForPostgres(element, pg_OIDS.TIMESTAMPTZ);
  }
}

function make_esc_func() {
  var chars = md5(md5(Math.random())).replace(/\d/g,'');
  var slice = '';
  for (var i=0;i<chars.length;i++) {
    var rnum = Math.floor(Math.random() * chars.length);
    slice+=chars.substring(rnum,rnum+1);
  }
  var tag = "$"+slice.slice(0,4)+"$";
  return function(s) { return tag+exports.seralize(s)+tag};
}

exports.seralize_hash = function(hash, seperator) {
  var first = true;
  var set_s = "";
  var esc = make_esc_func();
  for (key in hash) {
    if(hash[key] == null) continue;
    set_s += ((first)?"":seperator) + key + " = " + esc(hash[key]);
    first = false;
  }
  return set_s;
}

exports.unzip = function (hash) {
  var esc = make_esc_func();

  var keys=[], values=[];
  for(key in hash) {
    if(hash[key] == null) continue;
    keys.push(key);
    values.push(esc(hash[key]));
  }
  return [keys,values];
}

exports.pretty = function (result) {
  str = "";
  first = true;
  for (i in result) {
    var row = result[i];
    if(first) {
      for (j in row) {
        str += j + ", ";
      }
      str += "\n";
      first = false;
    }
    for (j in row) {
			str += ((row[j])?row[j]+"":"empty").substr(0,15) + ", ";
		}
		str += "\n";
	}
	return str;
}

exports.pretty_print = function (result) {
	puts(exports.pretty(result));
}

// simple queries

exports.simple_update = function (tbl, set, where) {
  var set_str = exports.seralize_hash(set, ", ");
  var where_str = exports.seralize_hash(where, " AND ");

  var sql = sprintf("UPDATE %s SET %s WHERE %s;", tbl, set_str, where_str);

  return c.query(sql);
}

exports.simple_select = function (tbl, columns, where) {
  var columns_str = (columns == null) ? "*" : columns.join(", ");
  var where_str = exports.seralize_hash(where, " AND ");
  
  var sql = sprintf("SELECT %s FROM %s WHERE %s;", columns_str, tbl, where_str);

  return c.query(sql);
}

exports.simple_insert = function (tbl, set, return_id) {
  var keys_values = exports.unzip(set);
  var keys_str    = keys_values[0].join(',');
  var values_str  = keys_values[1].join(',');
  var return_sql  = (return_id)?" RETURNING id":"";
  var sql = sprintf("INSERT INTO %s (%s) VALUES (%s)%s;", tbl, keys_str, values_str, return_sql);

  return c.query(sql);
}
