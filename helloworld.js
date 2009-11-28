process.mixin(GLOBAL, require('sys'));
process.mixin(GLOBAL, require('./database'));

var http    = require('http'),
	  conf    = require('./conf');

http.createServer(function (req, res) {
	c.query("SELECT * FROM test").addCallback(function(rows) {
		res.sendHeader(200, {'Content-Type': 'text/plain'});
		res.sendBody(pretty_string(rows));
		res.finish();
	});
}).listen(8080);

puts('Server running at http://127.0.3.1:8080/');
