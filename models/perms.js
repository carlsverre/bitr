var conf = require('../conf');

var tfriends = conf.tables.friends;
var tusergroup = conf.tables.usergroup;

var has_char = 'r';
var not_char = '-';

var TEXT=0, PHOTO=1, VIDEO=2;

exports.Perm = function (user_id, friend_id, group_id, perms) {
  this.columns = {};
  var that = this;

  var from_row = function (row) {
    for (column in row) {
      var val = row[column];
      that.columns[column] = val;
    }
  }

  if(typeof(user_id) == 'object') {
    // passing in the query row
    from_row(user_id);
  } else {
    // go with the defaults
    this.columns = {
      id:             null,
      user_id:        user_id,
      perms:          perms||'---',
      creation_date:  null
    }

    if (friend_id) {
      this.columns.friend_id = friend_id;
      this.tname = tfriends;
    } else if(group_id) {
      this.columns.group_id = group_id;
      this.tname = tusergroup;
    }
  }

  this.save = function () {
    var promise = new process.Promise();
    if(that.columns.id != null) {
      // update
      DB.simple_update(that.tname, set=that.columns, where={id: that.columns.id}).addCallback(function(results) { 
        puts("Updated Perms: " + that.columns.id);
        promise.emitSuccess();
      });
    } else {
      DB.simple_insert(that.tname, that.columns, true).addCallback(function(results) {
        if('id' in results[0]) {
          that.columns['id'] = results[0].id;
          info("Created Perms: " + that.columns.id + " ["+that.columns.perms+"]");
          promise.emitSuccess();
        }
      }).addErrback(function(err) {
        error("Perms.save unknown error:");
        error("Error Msg: " + err);
        promise.emitError();
      });
    }
    return promise;
  }

  var has_perm = function (num) {
    return (that.columns.perms.charAt(num) == has_char);
  }

  this.text   = function () { return has_perm(TEXT); }
  this.photo  = function () { return has_perm(PHOTO); }
  this.video  = function () { return has_perm(VIDEO); }

  var set_perm = function (num, on) {
    var perms = that.columns.perms.split('');
    perms[num] = (on)?has_char:not_char;
    that.columns.perms = perms.join('');
  }

  this.set_text   = function (on) { set_perm(TEXT, on); }
  this.set_photo  = function (on) { set_perm(PHOTO, on); }
  this.set_video  = function (on) { set_perm(VIDEO, on); }

  this.to_sql_array = function () {
      var perms_a = [];
      if(this.text) perms_a.push("'text'");
      if(this.photo) perms_a.push("'photo'");
      if(this.video) perms_a.push("'video'");

      return "("+perms_a.join(',')+")";
  }

  this.remove = function () {
    var sql = sprintf("DELETE FROM %s WHERE id=?", tname);
    return DB.query(sql, this.columns.id);
  }
  
}

exports.Perms = {
  // gets all users that match hash
  // ex. hash = {id:3}
  get_friends: function (hash) {
    return exports.Perms.get(tfriends, hash);
  },
  get_groups: function (hash) {
    return exports.Perms.get(tusergroup, hash);
  },
  get: function (tname, hash) {
    var promise = new process.Promise();

    DB.simple_select(tname, null, hash).addCallback(function (rows) {
      puts("Selected from Perms:");
      DB.pretty_print(rows);

      var perms = [];

      for (var i in rows) {
        var row = rows[i];
        perms.push(new Perm(row));
      } 

      promise.emitSuccess(perms);
    }).addErrback(function (err) {
      promise.emitError(err);
    });

    return promise;
  }
}
