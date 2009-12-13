var conf = require('../conf');

var tname = conf.tables.posts;

exports.Post = function (user, post, content, tags, private, media_type, filename) {
  var that = this;

  var from_row = function (row) {
    if (!('columns' in that)) that.columns = {};

    for (column in row) {
      var val = row[column];
      that.columns[column] = val;
    }
  }

  if(typeof(user) == 'object') {
    // passing in the query row
    from_row(user);
  } else {
    // go with the defaults
    this.columns = {
      id:             null,
      user_id:        user.columns.id,
      response_to:    (post.columns.id || -1),
      creation_date:  null,
      tags:           tags,
      content:        content,
      private:        private,
      media_type:     (media_type)?"text":media_type,
      filename:       filename
    }

  }

  this.save = function () {
    var promise = process.Promise();
    if(that.columns.id != null) {
      // update
      DB.simple_update(that.tname, set=that.columns, where={id: that.columns.id}).addCallback(function(results) { 
        puts("Updated Post: " + that.columns.username);
        promise.emitSuccess();
      });
    } else {
      DB.simple_insert(that.tname, that.columns, true).addCallback(function(results) {
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
  // gets all posts that match hash
  // ex. hash = {id:3}
  get: function (hash, perms) {
    var promise = new process.Promise();

    var parse_posts = function(rows) {
      puts("Selected from Posts:");
      DB.pretty_print(rows);

      var posts = [];

      for (var i in rows) {
        var row = rows[i];
        posts.push(new Post(row));
      } 

      promise.emitSuccess(posts);
    };

    if(perms) {
      var sql = "SELECT * FROM ? WHERE user_id=?" + 
                "AND ( (private=false) OR (mediatype IN ("+perms+")) )";

      DB.query(sql, [tposts, hash.user_id]).addCallback(parse_posts)
      .addErrback(function (err) {
        promise.emitError(err);
      });
    } else {
      DB.simple_select(tname, null, hash).addCallback(parse_posts)
      .addErrback(function (err) {
        promise.emitError(err);
      });
    }

    return promise;
  }
}
