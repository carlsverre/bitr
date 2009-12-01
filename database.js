var postgres  = require('./lib/postgres-js/postgres');
    conf      = require('./conf');

postgres.DEBUG = 2;

var c = postgres.createConnection.apply(null, conf.conninfo);

exports.query = c.query;

exports.seralize = function(element) {
  switch (typeof(element)) {
    case "number":
      return element
    case "string":
      return sprintf("'%s'", element);
    case "boolean":
      return (element)?"TRUE":"FALSE";
    case "undefined":
      return "";
 }
  
  // element is an object
  switch (element.constructor.toString()) {
    case "Date":
      return inspect(element);  // TODO make this work
}

exports.seralize_hash = function(hash, seperator) {
  var first = true;
  for (key in hash) {
    if(typeof(key) !== "function") {
      set_s += ((first)?"":seperator) + key + " = " + hash[key];
    }
    first = false;
  }
}

exports.unzip = function (hash) {
  var keys=[], values=[];
  for(key in hash) {
    keys.push(key);
    values.push(hash[key]);
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
        str += j + "\t\t";
      }
      str += "\n";
      first = false;
    }
    for (j in row) {
			str += row[j] + "\t\t";
		}
		str += "\n";
	}
	return str;
}

exports.pretty_print = function (result) {
	print(exports.pretty(result));
}

// simple queries

exports.simple_update = function (tbl, set_hash, where_hash) {
  var set_str = exports.seralize_hash(set_hash, ", ");
  var where_str = exports.seralize_hash(where_hash, " AND ");
  return sprintf("UPDATE %s SET %s WHERE %s;", tbl, set_str, where_str);
}

exports.simple_select = function (tbl, columns_arr, where_hash) {
  var columns_str = (columns_arr == null) ? "*" : columns_arr.join(", ");
  var where_str = exports.seralize_hash(where_hash, " AND ");
  return sprintf("SELECT %s FROM %s WHERE %s;", columns_str, tbl, where_str);
}

exports.simple_insert = function (tbl, set_hash, return_id) {
  var keys_values = exports.unzip(set_hash);
  var keys_str    = keys_values[0].join(', ');
  var values_str  = keys_values[1].join(', ');
  var return_sql  = " RETURNING id";
  return sprintf("INSERT INTO %s (%s) VALUES (%s)%s;", tbl, set_str, where_str);
}
