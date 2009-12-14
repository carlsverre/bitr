var controller = {
  index: function (req, res) {
    if ('user_id' in req.session.data) {
      Users.get({id:req.session.data.user_id}).addCallback(function (rows) {
        var user = rows[0];
        res.redirect("/users/" + user.columns.username);
      });
      return;
    }

    var o = {
      page_title: "Authentication Portal"
    };

    render(req, 'auth', 'index', o, function (html) {
      res.simpleHtml(200, html);
    });
  },
  login: function (req, res, post) {
    if(post.register == 'on') {
      return controller.register(req,res,post);
    }

    var username = post.username;
    var password = post.password;
    Users.get({username:username}).addCallback(function (rows) {
      var user = rows[0];
      if (user && user.auth(password)) {
        req.session.data.user_id = user.columns.id;

        res.redirect("/users/" + username);
      } else {
        req.session.data.flash = "Username/password incorrect!";
        res.redirect("/auth");
      }
    });
  },
  register: function (req, res, post) {
    var username = post.username;
    var password = post.password;
    var user = new User(username, password, req.connection.remoteAddress); 
    user.save().addCallback(function () {
      req.session.data.user_id = user.columns.id;

      res.redirect("/users/" + username);
    });
  },
  logout: function (req, res) {
    if(!('user_id' in req.session.data)) {
      req.session.data.flash = "Your not logged in!";
      res.redirect("/auth");
      return;
    }
    var userid = req.session.data.user_id;
    req.session.destroy();
    Users.get({id: userid}).addCallback(function (rows) {
      var user = rows[0];
      var username = user.columns.username;
      var o = {
        page_title: "Authentication Portal | logout"
      }
      render(req, 'auth', 'logout', o, function (html) {
        res.simpleHtml(200, html);
      });
    });
  }
}

exports.urls = ['^/auth',
  ['GET',   '/?$',          controller.index                 ],
  ['POST',  '/login/?$',    controller.login,     'multipart'],
  ['GET',   '/logout/?$',   controller.logout                ],
];
