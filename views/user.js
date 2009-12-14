var controller = {
  index: function (req, res, username) {
    var o = {};
    o.page_title = username + " | Home";

    var guest = !('user_id' in req.session.data);

    var index_exec = function (user) {
      o.userpage = false;
      o.user = user;

      if(user && (user.columns.username == username)) {
        o.userpage = true;
        user.get_posts().addCallback(function (posts) {
          o.posts = posts;
          o.profile = user;
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
  friends: function (req, res, username) {
    var o = {};
    o.page_title = username + " | Friends";

    var guest = !('user_id' in req.session.data);

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

    if(!('user_id' in req.session.data)) {
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
    res.redirect(req.headers.referer);
  }
}

exports.urls = ['^/users',
  ['GET',       '/([^/]+)/?$',          controller.index          ],
  ['GET',       '/([^/]+)/friends/?$',  controller.friends        ],
  ['GET',       '/([^/]+)/groups/?$',   controller.index          ],
  ['GET',       '/([^/]+)/settings/?$', controller.settings       ],
  ['POST',      '/save_settings/?$',    controller.save_settings  ]
];
