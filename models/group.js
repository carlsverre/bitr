var conf = require('../conf');

var tname = conf.tables.groups;

exports.Group = function (name, owner, description) {
  this.columns = {};
  var self = this;

  var from_row = function (row) {
    for (column in row) {
      var val = row[column];
      self.columns[column] = val;
    }
  }

  if(typeof(name) == 'object') {
    // passing in the query row
    from_row(name);
  } else {
    // go with the defaults
    this.columns = {
      id:               null, 
      name:             name,
      owner:            owner.columns.id,
      creation_date:    null,
      description:      description || ''
    }
  }

  this.save = function () {
    var promise = new process.Promise();
    if(self.columns.id != null) {
      // update
      DB.simple_update(tname, self.columns, {id: self.columns.id})
      .addCallback(function(results) { 
        puts("Updated Group: " + self.columns.name);
        promise.emitSuccess();
      });
    } else {
      DB.simple_insert(tname, self.columns, true).addCallback(function(results) {
        if('id' in results[0]) {
          self.columns['id'] = results[0].id;
          puts("Created Group: " + self.columns.name+ " ["+self.columns.id+"]");
          promise.emitSuccess();
        }
      }).addErrback(function(err) {
        error("Group.save unknown error:");
        error("Error Msg: " + err);
        promise.emitError();
      });
    }
    return promise;
  }

  this.remove = function() {
    var sql = sprintf("DELETE FROM %s WHERE group_id=?;"+
    "DELETE FROM %s WHERE id=?", conf.tables.usergroup, tname);
    return DB.query(sql, [this.columns.id,this.columns.id]);
  }

  this.get_owner = function() {
    return Users.get({user_id:this.columns.owner});
  }

  this.get_posts = function() {
    return Posts.get_posts_in_group(this);
  }

  this.get_users= function() {
    return Users.get_users_in_group(this);
  }

  this.add_user= function(username,perms) {
    Users.get({username:username}).addCallback(function (users) {
      var user = users[0];
      var perm = new Perm(user.columns.id, null, self.columns.id, perms);
      perm.save();
    });
  }

  this.remove_user= function(username) {
    Users.get({username:username}).addCallback(function (users) {
      var user = users[0];
      Perms.get_groups({user_id:user.columns.id,group_id:self.columns.id})
      .addCallback(function (rows) {
        var perm = rows[0];
        perm.remove();
      });
    });
  }
}

exports.Groups = {
  // gets all groups self match hash
  // ex. hash = {id:3}
  get: function (hash) {
    var promise = new process.Promise();

    DB.simple_select(tname, null, hash).addCallback(function (rows) {
      puts("Selected from Groups:");
      DB.pretty_print(rows);

      var groups = [];

      for (var i in rows) {
        var row = rows[i];
        groups.push(new Group(row));
      } 

      promise.emitSuccess(groups);
    }).addErrback(function (err) {
      promise.emitError(err);
    });

    return promise;
  },
  get_users_groups: function (user) {
    var promise = new process.Promise();

    var sql = sprintf("SELECT * FROM %s WHERE id IN" + 
                      " (SELECT group_id FROM %s WHERE user_id = ?)", tname, conf.tables.usergroup);
                    
    DB.query(sql, [user.columns.id])
    .addCallback(function (rows) {
      puts("Selected from Groups:");
      DB.pretty_print(rows);

      var groups = [];

      for (var i in rows) {
        var row = rows[i];
        groups.push(new Group(row));
      } 

      promise.emitSuccess(groups);
    });
    return promise;
  }
}
