var controller = {
  index: function (req, res) {
    if ('user_id' in req.session.data) {
      var username = Users.get(req.session.data.user_id).username;
      res.redirect("/users/" + username);
    }

    var o = {
      page_title: "Authentication Portal"
    };

    render('auth', 'index', o, function (html) {
      res.simpleHtml(200, html);
    });
  },
  login: function (req, res, post) {
    debug(inspect(post));
    if(post.register == 'on') {
      return controller.register(req,res,post);
    }

    var username = post.username;
    var password = post.password;
    var user = Users.get(null, username);

    if (user && user.auth(password)) {
      res.redirect("/users/" + username);
    } else {
      res.redirect("/auth");
    }

  },
  register: function (req, res, post) {
    var username = post.username;
    var password = post.password;
    var user = new User(username, password, null); 
    user.save();

    req.session.data.user_id = user.id;

    res.redirect("/users/" + username);
  }
}

exports.urls = ['^/auth',
  ['GET',   '$',          controller.index                 ],
  ['POST',  '/login$',    controller.login,     'multipart'],
];
