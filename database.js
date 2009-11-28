process.mixin(GLOBAL, require('sys'));

var postgres  = require('./lib/node_postgres/postgres')
    conf      = require('./conf');

var c = postgres.createConnection(conf.conninfo);

c.addListener("connect", function () {
    puts("postgre connected");
  puts(c.readyState);
});

c.addListener("close", function (e) {
  puts("postgre connection closed.");
  if (e) {
    puts("error: " + e.message);
  }
});

exports.c = c;

exports.pretty_string = function (result) {
	str = "";
	for (i in result) {
		for (j in result[i]) {
			str += result[i][j] + "\t";
		}
		str += '\n';
	}
	return str;
}

exports.pretty_print = function (result) {
	print(exports.pretty_string(result));
}
