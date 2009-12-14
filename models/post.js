var conf = require('../conf');

var tname = conf.tables.posts;

exports.Post = function (post_id, user, content, tags, private, mediatype, filename) {
  var that = this;

  this.user = user;

  var from_row = function (row) {
    if (!('columns' in that)) that.columns = {};

    for (column in row) {
      var val = row[column];
      that.columns[column] = val;
    }
  }

  if(typeof post_id == "object") {
    // passing in the query row
    from_row(post_id);
  } else {
    // go with the defaults
    this.columns = {
      id:             null,
      user_id:        user.columns.id,
      response_to:    (post_id || null),
      creation_date:  null,
      tags:           tags,
      content:        content,
      private:        private,
      mediatype:     (mediatype)?mediatype:"text",
      filename:       filename
    }

  }

  this.save = function () {
    var promise = new process.Promise();
    if(that.columns.id != null) {
      // update
      DB.simple_update(tname, set=that.columns, where={id: that.columns.id}).addCallback(function(results) { 
        puts("Updated Post: " + that.columns.username);
        promise.emitSuccess();
      });
    } else {
      DB.simple_insert(tname, that.columns, true).addCallback(function(results) {
        if('id' in results[0]) {
          that.columns['id'] = results[0].id;
          puts("Created Post: " + that.columns.content + " ["+that.columns.id+"]");
          promise.emitSuccess();
        } else {
          debug("Post.save unknown error:");
          DB.pretty_print(results);
          promise.emitError();
        }
      });
    }
    return promise;
  }

  //TODO: other post methods?
}

exports.Posts = {
  get_friend_and_user_posts: function(user) {
    var promise = new process.Promise();
    var sql = sprintf("SELECT * FROM %s p WHERE (private=false AND user_id IN"+
                      " (SELECT friend_id FROM %s f WHERE user_id = ?)) OR user_id = ? ORDER BY creation_date DESC", tname, conf.tables.friends);

    DB.query(sql, [user.columns.id, user.columns.id])
    .addCallback(function (rows) {
      var posts = [];
      var users = {};

      function get_next_post(i) {
        if(i >= rows.length) {
          promise.emitSuccess(posts);
          return;
        }
        var post = new Post(rows[i]);
        var user_id = post.columns.user_id;
        var user = users[user_id] || null;

        if(!user) {
          Users.get({id:user_id}).addCallback(function (data) {
            var user = data[0];
            users[user_id] = user;
            post.user = user;
            posts.push(post);
            get_next_post(i+1);
          });
        } else {
          post.user = user;
          posts.push(post);
          get_next_post(i+1);
        }
      }

      get_next_post(0);
    });

    return promise;
  },
  get_posts_in_group: function(group) {
    var promise = new process.Promise();
    var sql = sprintf("SELECT * FROM %s p WHERE (private=false AND user_id IN"+
                      " (SELECT user_id FROM %s WHERE group_id = ?)) ORDER BY creation_date DESC", tname, conf.tables.usergroup);

    DB.query(sql, [group.columns.id])
    .addCallback(function (rows) {
      var posts = [];
      var users = {};

      function get_next_post(i) {
        if(i >= rows.length) {
          promise.emitSuccess(posts);
          return;
        }
        var post = new Post(rows[i]);
        var user_id = post.columns.user_id;
        var user = users[user_id] || null;

        if(!user) {
          Users.get({id:user_id}).addCallback(function (data) {
            var user = data[0];
            users[user_id] = user;
            post.user = user;
            posts.push(post);
            get_next_post(i+1);
          });
        } else {
          post.user = user;
          posts.push(post);
          get_next_post(i+1);
        }
      }

      get_next_post(0);
    });

    return promise;
  },
  // gets all posts that match hash
  // ex. hash = {id:3}
  get: function (hash, perms) {
    var promise = new process.Promise();

    var parse_posts = function(rows) {
      puts("Selected from Posts:");
      DB.pretty_print(rows);

      var posts = [];
      var users = {};

      function get_next_post(i) {
        if(i >= rows.length) {
          promise.emitSuccess(posts);
          return;
        }
        var post = new Post(rows[i]);
        var user_id = post.columns.user_id;
        var user = users[user_id] || null;

        if(!user) {
          Users.get({id:user_id}).addCallback(function (data) {
            var user = data[0];
            users[user_id] = user;
            post.user = user;
            posts.push(post);
            get_next_post(i+1);
          });
        } else {
          post.user = user;
          posts.push(post);
          get_next_post(i+1);
        }
      }

      get_next_post(0);
    };

    if(perms) {
      var sql = sprintf("SELECT * FROM %s WHERE user_id=? " + 
                "AND ( (private=false) OR (mediatype IN "+perms.to_sql_array()+") ) " +
                "ORDER BY creation_date DESC", tname);

      DB.query(sql, [hash.user_id]).addCallback(parse_posts)
      .addErrback(function (err) {
        promise.emitError(err);
      });
    } else {
      DB.simple_select(tname, null, hash, "creation_date DESC").addCallback(parse_posts)
      .addErrback(function (err) {
        promise.emitError(err);
      });
    }

    return promise;
  }
}
