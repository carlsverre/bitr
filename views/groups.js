var controller = {
  index: function (req, res) {
    var o = {
      page_title: "Groups"
    }
    var guest = !(req.session.data['user_id']);

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
    var guest = !(req.session.data['user_id']);

    function exec(user) {
      o.user = user;

      Groups.get({name: groupname}).addCallback(function (rows) {
        var group = rows[0];

        o.owner = (user && user.columns.id == group.columns.owner);
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
    function die(msg,url) {
      req.session.data.flash = "Error" + (msg)?msg:"";
      res.redirect(url||req.headers.referer);
    };

    var name = post.name;
    var description = post.description;

    if(name == '') return die("Group name cannot be empty");

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
  remove: function (req, res, groupname) {
    function die(msg,url) {
      req.session.data.flash = "Error" + (msg)?msg:"";
      res.redirect(url||req.headers.referer);
    };
    
    var user_id = req.session.data.user_id;
    if(!user_id) return die("Your not logged in!", "/auth");

    Users.get({id: user_id}).addCallback(function (rows) {
      var user = rows[0];
      Groups.get({name: groupname}).addCallback(function (groups) {
        var group = groups[0];

        if(group.columns.owner != user_id) return die("You don't own that group!");

        group.remove();
        res.redirect(req.headers.referer);
      });
    });
  },
  remove_user: function (req, res, groupname, username) {
    var died = false;
    function die(msg,url) {
      req.session.data.flash = "Error" + (msg)?msg:"";
      res.redirect(url||req.headers.referer);
      died = true;
    }

    var user_id = req.session.data.user_id;
    if(!user_id) return die("Your not logged in!", "/auth");

    Users.get({id: user_id}).addCallback(function (rows) {
      var user = rows[0];
      Groups.get({name: groupname}).addCallback(function (groups) {
        var group = groups[0];

        if(user.columns.username != username) {
          if(group.columns.owner != user_id) return die("You don't own that group!");
        }

        group.remove_user(username);
        res.redirect(req.headers.referer);
      });
    });
  },
  add_user: function (req, res, groupname, post) {
    var died = false;
    function die(msg,url) {
      req.session.data.flash = "Error" + (msg)?msg:"";
      res.redirect(url||req.headers.referer);
      died = true;
    }

    var friend_username = post.friend || die();
    var text_perm       = (post.text=='on');
    var photo_perm      = (post.photo=='on');
    var video_perm      = (post.video=='on');

    var l = function (p) { return (p)?'r':'-' };
    var perms = l(text_perm) + l(photo_perm) + l(video_perm);

    if(died) return;

    var user_id = req.session.data.user_id;
    if(!user_id) return die("Your not logged in!", "/auth");

    Users.get({id: user_id}).addCallback(function (rows) {
      var user = rows[0];

      Groups.get({name: groupname}).addCallback(function (groups) {
        var group = groups[0];
        if(group.columns.owner != user_id) return die("You don't own that group!");

        group.add_user(friend_username, perms);
        res.redirect(req.headers.referer);
      });
    });
  }
}

exports.urls = ['^/groups',
  ['GET',       '/?$',                      controller.index                  ],
  ['GET',       '/([^/]+)/?$',              controller.show                   ],
  ['POST',      '/create$',                 controller.create,     'multipart'],
  ['GET',       '/remove/([^/]+)$',         controller.remove                 ],
  ['GET',       '/([^/]+)/del/([^/]+)$',    controller.remove_user            ],
  ['POST',      '/([^/]+)/add$',            controller.add_user,   'multipart']
];
