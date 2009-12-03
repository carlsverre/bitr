var conf = require('../conf');

var tname = conf.tables.users;

exports.User = function (username, password, email) {
  if(typeof(username) == 'object') {
    // passing in the query row
    from_row(username);
  } else {
    // go with the defaults
    this.id = null; 
    this.username     = username;
    this.fullname     = "";
    this.last_login   = new Date();
    this.date_joined  = new Date();
    this.groups       = [];
    this.location     = "";
    this.password     = password;
    this.email        = email;
    this.active       = true;
    this.signature    = "";
  }

  this.auth = function (password) {
    if (this.password == password) {
      return true;
    }
    return false;
  }

  this.save = function () {
    if(this.id != null) {
      // update
      DB.query(DB.simple_update(tname, this, {id: this.id}),
      function(results) { 
        debug("user_save results: ");
        p(results);
      });
    } else {
      DB.query(DB.simple_insert(tname, this, true),
      function(results) {
        debug("user_save insert results:");
        p(results);
      });
    }
  }

  var from_row = function (row) {
    for (column in row) {
      var val = row[column];
      this[column] = val;
    }

  }

  //TODO: other user methods such as get_groups
}

exports.Users = {
  // gets all users that match hash
  // ex. hash = {id:3}
  get: function (hash, callback) {
    DB.query(q.simple_select(tname, null, hash),
    function (rows) {
      puts("Selected from Users:");
      DB.pretty_print(rows);

      if(rows.length == 1) {
        var user = new User(rows[0]);
        callback(user);
        return;
      }

      var users = [];

      for (i in rows) {
        var row = rows[i];
        users.push(new User(row));
      } 

      callback(users);
    });
  }
}
