var conf = require('../conf');

var tname = conf.tables.posts;

exports.Post = function (user, post, content, tags, private, media_type, filename) {
  var from_row = function (row) {
    if (!('columns' in this)) this.columns = {};

    for (column in row) {
      var val = row[column];
      this.columns[column] = val;
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
      private:        private
    }

    if (media_type !== null) {
      this.columns.media_type = media_type;
      this.columns.filename = filename;
    }
  }

  if (this.columns.media_type !== null) {
    this.tname = conf.tables.media_posts;
  }

  this.save = function () {
    var promise = process.Promise();
    var cols = this.columns;
    if(cols.id != null) {
      // update
      DB.simple_update(tname, set=cols, where={id: cols.id}).addCallback(function(results) { 
        puts("Updated Post: " + cols.username);
        promise.emitSuccess();
      });
    } else {
      DB.simple_insert(tname, cols, true).addCallback(function(results) {
        if('id' in results[0]) {
          cols['id'] = results[0].id;
          puts("Created Post: " + cols.content + " ["+cols.id+"]");
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
  get: function (hash) {
    var promise = new process.Promise();
    DB.simple_select(tname, null, hash).addCallback(function (rows) {
      puts("Selected from Posts:");
      DB.pretty_print(rows);

      var posts = [];

      for (i in rows) {
        var row = rows[i];
        posts.push(new Post(row));
      } 

      promise.emitSuccess(posts);
    }).addErrback(function (err) {
      promise.emitError(err);
    });

    return promise;
  }
}
