
var user_db = [];

exports.User = function (username, password, email) {
  // default params
  this.id = null;

  // default fields
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

  this.auth = function (password) {
    if (this.password == password) {
      return true;
    }
    return false;
  }

  this.save = function () {
    // TODO: postgre update/insert query based on Boolean(this.id)
    user_db.push(this);
    this.id = user_db.length-1;
  }

  //TODO: other user methods such as get_groups
}

exports.Users = {
  //TODO: user querying functions
  
  get: function (user_id, username) {
    if (user_id !== undefined && user_id < user_db.length) {
      return user_db[user_id];

    } else if (username !== undefined) {
      for (var i in user_db) {
        if (user_db[i].username == username) {
          return user_db[i];
        }
      }

    } else {
      debug("User Not found {id: " + user_id + ", username: " + username + "}");
      return;
    }
  }
}
