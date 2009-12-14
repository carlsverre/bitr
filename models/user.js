var conf = require('../conf');

var tname = conf.tables.users;

function create_salt(ip) {
  var pieces = ip.split('.');
  sum = 0;
  for (var piece in pieces) sum += (piece * 1);

  return md5(ip+sum*1024);
}

function encode_password(password, salt) {
  return md5(salt+password+salt);
}

exports.User = function (username, password, email, ip) {
  this.columns = {};
  var that = this;

  var from_row = function (row) {
    for (column in row) {
      var val = row[column];
      that.columns[column] = val;
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
      creation_date:  null,
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
    if (this.columns.password == encode_password(password, this.columns.salt)) {
      this.save();
      return true;
    }
    return false;
  }

  this.save = function () {
    var promise = new process.Promise();
    if(that.columns.id != null) {
      // update
      DB.simple_update(tname, set=that.columns, where={id: that.columns.id}).addCallback(function(results) { 
        puts("Updated User: " + that.columns.username);
        promise.emitSuccess();
      });
    } else {
      DB.simple_insert(tname, that.columns, true).addCallback(function(results) {
        if('id' in results[0]) {
          that.columns['id'] = results[0].id;
          puts("Created User: " + that.columns.username + " ["+that.columns.id+"]");
          promise.emitSuccess();
        }
      }).addErrback(function(err) {
        error("User.save unknown error:");
        error("Error Msg: " + err);
        promise.emitError();
      });
    }
    return promise;
  }

  //TODO: other user methods such as get_groups
  
  this.get_posts = function(hash) {
    if(!hash) hash = {};
    process.mixin(hash, {
      user_id: this.columns.id
    });
    return Posts.get(hash);
  }

  this.get_posts_perms = function(perms) {
    var hash = {
      user_id: this.columns.id
    };
    return Posts.get(hash, perms);
  }

  this.get_permissions = function(friend_id) {
    return Perms.get_friends({user_id:this.columns.id, friend_id:friend_id});
  }

  this.get_friends = function() {
    var promise = new process.Promise();
    var sql = sprintf("SELECT * FROM %s WHERE id IN "+
                      "(SELECT friend_id FROM friends WHERE user_id = ?)",tname);
    DB.query(sql, [this.columns.id]).addCallback(function (rows) {
      var users = [];

      for(var i in rows) {
        var row = rows[i];
        users.push(new User(row));
      }

      promise.emitSuccess(users);
    });
    return promise;
  }
}

exports.Users = {
  // gets all users that match hash
  // ex. hash = {id:3}
  get: function (hash) {
    var promise = new process.Promise();

    DB.simple_select(tname, null, hash).addCallback(function (rows) {
      puts("Selected from Users:");
      DB.pretty_print(rows);

      var users = [];

      for (var i in rows) {
        var row = rows[i];
        users.push(new User(row));
      } 

      promise.emitSuccess(users);
    }).addErrback(function (err) {
      promise.emitError(err);
    });

    return promise;
  }
}
