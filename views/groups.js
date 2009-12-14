var controller = {
  index: function (req, res) {
    var o = {
      page_title: "Groups"
    }
    var guest = !('user_id' in req.session.data);

    function exec(user) {
      o.user = user;

      Groups.get().addCallback(function (groups) {
        o.groups = groups;
        render(req, "groups", "index", o, function(html) {
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
  show: function (req, res, groupname) {
    var o = {
      page_title: "Groups | " + groupname
    }
    var guest = !('user_id' in req.session.data);

    function exec(user) {
      o.user = user;

      Groups.get({name: groupname}).addCallback(function (rows) {
        var group = rows[0];
        o.group = group;
        group.get_users().addCallback(function (users) {
          o.users = users;
          group.get_posts().addCallback(function (posts) {
            o.posts = posts;
            render(req, "groups", "index", o, function(html) {
              res.simpleHtml(200, html);
            });
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
  create: function (req, res, post) {
    var name = post.name;
    var description = post.description;

    var userid = req.session.data.user_id;
    if(!userid) {
      req.session.data.flash = "Your not logged in!";
      res.redirect("/auth");
      return;
    }

    Users.get({id: userid}).addCallback(function (rows) {
      var user = rows[0];

      var group = new Group(name, user, description);

      group.save().addCallback(function () {
        var perm = new Perm(user.columns.id, null, group.columns.id, 'rrr');
        perm.save();
        res.redirect(req.headers.referer);
      });
    });
  },
  remove_user: function (req, res, groupname, username) {
    var name = post.name;
    var description = post.description;

    var userid = req.session.data.user_id;
    if(!userid) {
      req.session.data.flash = "Your not logged in!";
      res.redirect("/auth");
      return;
    }

    Groups.get({owner: userid}).addCallback(function (groups) {
      for(var i in groups) {
        if(groups[i].columns.name == groupname) {
          groups[i].remove_user(username);
          res.redirect(req.headers.referer);
          return;
        }
      }

      req.session.data.flash = "You don't own that group!";
      res.redirect(req.headers.referer);
    });
  },
  add_user: function (req, res, groupname, username) {
    var name = post.name;
    var description = post.description;

    var userid = req.session.data.user_id;
    if(!userid) {
      req.session.data.flash = "Your not logged in!";
      res.redirect("/auth");
      return;
    }

    Groups.get({owner: userid}).addCallback(function (groups) {
      for(var i in groups) {
        if(groups[i].columns.name == groupname) {
          groups[i].add_user(username);
          res.redirect(req.headers.referer);
          return;
        }
      }

      req.session.data.flash = "You don't own that group!";
      res.redirect(req.headers.referer);
    });

  }
}

exports.urls = ['^/groups',
  ['GET',       '/?$',                      controller.index,                 ],
  ['GET',       '/([^/]+)/?$',              controller.show,                  ],
  ['POST',      '/create$',                 controller.create,     'multipart'],
  ['GET',       '/([^/]+)/([^/]+)$',        controller.remove_user            ],
  ['GET',       '/([^/]+)/([^/]+)$',        controller.add_user               ],
];
