var controller = {
  listall: function (req, res) {
    var o = {};
    o.page_title = "Users";

    var guest = !(req.session.data['user_id']);

    var exec = function (user) {
      o.userpage = false;
      o.user = user;
      Users.get().addCallback(function (users) {
        o.users = users;
        render(req, "users", "listall", o, function(html) {
          res.simpleHtml(200, html);
        });
      });
    }

    if(guest) exec(null);
    else {
      Users.get({id:req.session.data.user_id}).addCallback(function (data) {
        exec(data[0]);
      });
    }
  },
  index: function (req, res, username, response_to) {
    var o = {};
    o.page_title = username + " | Home";

    var guest = !(req.session.data['user_id']);

    var index_exec = function (user) {
      o.userpage = false;
      o.user = user;

      if(user && (user.columns.username == username)) {
        Posts.get_friend_and_user_posts(user)
        .addCallback(function (posts) {
          o.posts = posts;
          o.profile = user;
          o.userpage = true;
          o.response_to = response_to;
          render(req, "users", "index", o, function(html) {
            res.simpleHtml(200, html);
          });
        });
        return;
      }

      Users.get({username:username}).addCallback(function (data) {
        var profile = data[0];
        o.profile = profile;

        if(!profile) {
          o.username = username;
          o.page_title = "Unknown User";
          render(req, "users", "unknown", o, function(html) {
            res.simpleHtml(200, html);
          });
          return;
        }
        
        if(!guest){
          var perms = profile.get_permissions(user.columns.id);
          perms.addCallback(function (perms) {
            var perm = perms[0];

            profile.get_posts_perms(perm).addCallback(function (posts) {
              o.posts = posts;
              render(req, "users", "index", o, function(html) {
                res.simpleHtml(200, html);
              });
            });
          });
        } else {
          profile.get_posts({private:false}).addCallback(function (posts) {
            o.posts = posts;
            render(req, "users", "index", o, function(html) {
              res.simpleHtml(200, html);
            });
          });
        }
      });
    }

    if(guest) index_exec(null);
    else {
      Users.get({id:req.session.data.user_id}).addCallback(function (data) {
        index_exec(data[0]);
      });
    }
  },
  groups: function (req, res, username) {
    var o = {};
    o.page_title = username + " | Groups";

    var guest = !(req.session.data['user_id']);

    var exec = function (user) {
      o.user = user;
      o.userpage = false;

      if(!guest && user.columns.username == username) {
        o.userpage = true;
        o.profile = user;
        user.get_groups().addCallback(function (groups) {
          o.groups = groups;
          render(req, "users", "groups", o, function(html) {
            res.simpleHtml(200, html);
          });
        });
        return;
      }

      Users.get({username:username}).addCallback(function (data) {
        var profile = data[0];
        o.profile = profile;

        profile.get_groups().addCallback(function (groups) {
          o.groups = groups;
          render(req, "users", "groups", o, function(html) {
            res.simpleHtml(200, html);
          });
        });
      });
    }

    if(guest) exec(null);
    else {
      Users.get({id:req.session.data.user_id}).addCallback(function (data) {
        exec(data[0]);
      });
    }
  },
  friends: function (req, res, username, friendname) {
    var o = {};
    o.page_title = username + " | Friends";
    if(friendname != new String(undefined)) {
      o.flash = "Select your new friend's permissions and click add!";
      o.friendname = friendname;
    }

    var guest = !(req.session.data['user_id']);

    var friends_exec = function (user) {
      o.user = user;
      o.userpage = false;

      if(!guest && user.columns.username == username) {
        o.userpage = true;
        o.profile = user;
        user.get_friends().addCallback(function (friends) {
          o.friends = friends;
          render(req, "users", "friends", o, function(html) {
            res.simpleHtml(200, html);
          });
        });
        return;
      }

      Users.get({username:username}).addCallback(function (data) {
        var profile = data[0];
        o.profile = profile;

        profile.get_friends().addCallback(function (friends) {
          o.friends = friends;
          render(req, "users", "friends", o, function(html) {
            res.simpleHtml(200, html);
          });
        });
      });
    }

    if(guest) friends_exec(null);
    else {
      Users.get({id:req.session.data.user_id}).addCallback(function (data) {
        friends_exec(data[0]);
      });
    }
  },
  settings: function (req, res, username) {
    var o = {};
    o.page_title = username + " | Settings";
    o.userpage = true;

    if(!(req.session.data['user_id'])) {
      req.session.data.flash = "Your not logged in...";
      res.redirect("/auth");
      return;
    }

    Users.get({id:req.session.data.user_id}).addCallback(function (data) {
      var user = data[0];

      if(user.columns.username != username) {
        req.settings.data.flash = "You can't do that!";
        res.redirect('/');
        return;
      }

      o.user = o.profile = user;
      
      render(req, "users", "settings", o, function(html) {
        res.simpleHtml(200, html);
      });
    });
  },
  save_settings: function (req, res, post) {
    var died = false;
    function die(msg, url) {
      if(!died) {
        req.session.data.flash = "Error" + (msg)?msg:" ";
        res.redirect(url || req.headers.referer);
        died = true;
      }
    }

    if(!post) {
      return die();
    }

    // passwords
    var password = post.password || "";
    if(password != "") {
      var check_password = post.password_confirm || die("Must confirm password!");
      if(password != check_password) die("Password doesn't match!");
    }

    if(died) return;

    if(!(req.session.data['user_id'])) {
      die("Your not logged in...", "/auth");
      return;
    }

    Users.get({id:req.session.data.user_id}).addCallback(function (data) {
      var user = data[0];

      if(password) user.set_password(password, req.connection.remoteAddress);

      user.columns.fullname  = post.fullname   || user.columns.fullname;
      user.columns.location  = post.location   || user.columns.location;
      user.columns.email     = post.email      || user.columns.email;
      user.columns.signature = post.signature  || user.columns.signature;
      
      user.save().addCallback(function () {
        req.session.data.flash = "Success!";

        res.redirect(req.headers.referer);
      }).addErrback(function (msg) {
        debug("user.settings_save error: " + msg);
        die();
      });
    });
  }
}

exports.urls = ['^/users',
  ['GET',   '/?$',                        controller.listall                      ],
  ['GET',   '/([^/]+)/?(\\d+)?$',        controller.index                        ],
  ['GET',   '/([^/]+)/friends/?([^/]+)?$',controller.friends                      ],
  ['GET',   '/([^/]+)/groups/?$',         controller.groups                       ],
  ['GET',   '/([^/]+)/settings/?$',       controller.settings                     ],
  ['POST',  '/save_settings/?$',          controller.save_settings,   "multipart" ]
];
