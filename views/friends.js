var controller = {
  add: function (req, res, post) {
    var died = false;

    function die(msg) {
      req.session.data.flash = "Error" + (msg)?msg:"";
      res.redirect(req.headers.referer);
      died = true;
    }

    var friend_username = post.friend || die();
    var text_perm       = (post.text=='on');
    var photo_perm      = (post.photo=='on');
    var video_perm      = (post.video=='on');

    if(died) return;

    var user_id = req.session.data.user_id;
    if(!user_id) {
      req.session.data.flash = "Your not logged in!";
      res.redirect("/auth");
      return;
    }

    Users.get({id: user_id}).addCallback(function (rows) {
      var user = rows[0];

      Users.get({username: friend_username}).addCallback(function (rows2) {
        var friend = rows2[0];
        if(!friend) {
          die("Does not exist");
          return;
        }

        var perm = new Perm(user_id, friend.columns.id);
        perm.set_text(text_perm);
        perm.set_photo(photo_perm);
        perm.set_video(video_perm);
        perm.save();

        res.redirect(req.headers.referer);
      });
    });
  },
  del: function (req, res, friend_id) {
    function die(msg) {
      req.session.data.flash = "Error" + (msg)?msg:"";
      res.redirect(req.headers.referer);
    }

    if(!friend_id) {
      die("Unknown Friend");
      return;
    }

    var user_id = req.session.data.user_id;
    if(!user_id) {
      req.session.data.flash = "Your not logged in!";
      res.redirect("/auth");
      return;
    }

    var sql = sprintf("DELETE FROM %s WHERE friend_id=? AND user_id=?",
                      conf.tables.friends);

    DB.query(sql,[friend_id, user_id])
    .addErrback(function (err) {
      die("Unknown Friend");
      return;
    });

    res.redirect(req.headers.referer);
  }
}

exports.urls = ['^/friends',
  ['POST',      '/add',               controller.add,       'multipart'],
  ['GET',       '/delete/([^/]+)',      controller.del,               ]
];
