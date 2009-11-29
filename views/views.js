var sys = require('sys');

var controller = {
  index: function (req, res) {
    render('views', 'index', {}, function (html) {
      res.simpleHtml(200, html);
    });
  },
  auth: function (req, res) {
    if ('user_id' in req.session.data) {
      var username = Users.get(req.session.data.user_id).username;
      var o = {
        page_title: username + "'s homepage",
        username: username
      };
      render('views', 'userhome', o, function (html) {
        res.simpleHtml(200, html);
      });
    }

    var o = {
      page_title: "Authentication Portal"
    };

    render('views', 'auth', o, function (html) {
      res.simpleHtml(200, html);
    });
  },
  login: function (req, res, post) {
    if(post.register == 'on') {
      return controller.register(req,res,post);
    }

    var username = post.username;
    var password = post.password;
    var user = Users.get(null, username);

    if (user && user.auth(password)) {
      var o = {
        page_title: "Authentication Portal",
        username: user.username
      };
      req.session.data.user_id = user.id;
      render('views', 'userhome', o, function (html) {
        res.simpleHtml(200, html);
      });
    } else {
      var o = {
        page_title: "Authentication Portal",
        failed: true
      };
      render('views', 'auth', o, function (html) {
        res.simpleHtml(200, html);
      });
    }

  },
  register: function (req, res, post) {
    var username = post.username;
    var password = post.password;
    var user = new User(username, password, null); 
    user.save();
    req.session.data.user_id = user.id;

    var o = {
      page_title: "Authentication Portal",
      username: user.username
    };
    req.session.data.user_id = user.id;
    render('views', 'userhome', o, function (html) {
      res.simpleHtml(200, html);
    });
  }
}

exports.urls = ['^/',
  ['GET',   '$',          controller.index                  ],
  ['GET',   'auth$',      controller.auth                   ],
  ['POST',  'login$',     controller.login,     'urlencoded'],
];
