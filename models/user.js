var conf = require('../conf');

var tname = conf.tables.users;

function create_salt(ip) {
  var pieces = ip.split('.');
  sum = 0;
  for (var piece in pieces) sum += (piece * 1);
  md5(ip+sum*1024);
}

function encode_password(password, salt) {
  return md5(salt+password+salt);
}

exports.User = function (username, password, email, ip) {
  var from_row = function (row) {
    if (!('columns' in this)) this.columns = {};

    for (column in row) {
      var val = row[column];
      this.columns[column] = val;
    }
  }

  if(typeof(username) == 'object') {
    // passing in the query row
    from_row(username);
  } else {
    // go with the defaults
    this.columns = {
      id:             null, 
      username:       username,
      fullname:       "",
      last_login:     new Date(),
      creation_date:  new Date(),
      location:       "",
      password:       "",
      salt:           "",
      email:          email,
      active:         true,
      signature:      ""
    }

    this.columns.salt = create_salt(ip);
    this.columns.password = encode_password(password, this.columns.salt);
  }

  this.auth = function (password) {
    if (this.password == encode_password(password)) {
      return true;
    }
    return false;
  }

  this.save = function () {
    if(this.id != null) {
      // update
      DB.simple_update(tname, set=this.columns, where={id: this.id}).addCallback(function(results) { 
        debug("user_save results: ");
        p(results);
      });
    } else {
      DB.simple_insert(tname, this.columns, true).addCallback(function(results) {
        debug("user_save insert results:");
        p(results);
      });
    }
  }

  //TODO: other user methods such as get_groups
}

exports.Users = {
  // gets all users that match hash
  // ex. hash = {id:3}
  get: function (hash, callback) {
    DB.simple_select(tname, null, hash).addCallback(function (rows) {
      puts("Selected from Users:");
      DB.pretty_print(rows);

      var users = [];

      for (i in rows) {
        var row = rows[i];
        users.push(new User(row));
      } 

      callback(users);
    });
  }
}
