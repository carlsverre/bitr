var controller = {
  index: function (req, res) {
    if ('user_id' in req.session.data) {
      Users.get({id:req.session.data.user_id}, function (rows) {
        var user = rows[0];
        res.redirect("/users/" + user.username);
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
    var session = req.session.data;

    if(post.register == 'on') {
      return controller.register(req,res,post);
    }

    var username = post.username;
    var password = post.password;
    Users.get({username:username}, function (rows) {
      var user = rows[0];
      if (user && user.auth(password)) {
        res.redirect("/users/" + username);
      } else {
        session.flash = "Username/password incorrect!";
        res.redirect("/auth");
      }
    });
  },
  register: function (req, res, post) {
    var username = post.username;
    var password = post.password;
    var user = new User(username, password, null, req.connection.remoteAddress); 
    user.save();

    req.session.data.user_id = user.id;

    res.redirect("/users/" + username);
  },
  logout: function (req, res) {
    var session = req.session.data;
    if(!('user_id' in session)) {
      session.flash = "Your not logged in!";
      res.redirect("/auth");
    }
    var userid = session.user_id;
    req.session.destroy();
    Users.get({id: userid}, function (rows) {
      var user = rows[0];
      var username = user.username;
      render(req, 'auth', 'logout', {username: username}, function (html) {
        res.simpleHtml(200, html);
      });
    });
  }
}

exports.urls = ['^/auth',
  ['GET',   '$',          controller.index                 ],
  ['POST',  '/login$',    controller.login,     'multipart'],
  ['GET',   '/logout',    controller.logout                ],
];
