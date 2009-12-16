var controller = {
  index: function (req, res) {
    var o = {
      page_title: "Bitr"
    }
    var user_id = req.session.data.user_id;
    if(!user_id) {
      render(req, 'views', 'index', o, function (html) {
        res.simpleHtml(200, html);
      });
      return;
    }

    Users.get({id: user_id}).addCallback(function (rows) {
      var user = rows[0];
      o.user = user;
      render(req, 'views', 'index', o, function (html) {
        res.simpleHtml(200, html);
      });
    });

  },
  search: function (req, res, post) {
    var o = {
      page_title: "Bitr"
    }

    var died = false;
    function die(msg, url) {
      req.session.data.flash = "Error" + (msg)?msg:"";
      res.redirect(url||req.headers.referer);
      died = true;
    }

    var query = post.query || die("You have to supply a query!");
    if(query == '') die("You have to supply a query!");

    if(died) return;

    var guest = !(req.session.data['user_id']);
    var user_id = req.session.data['user_id'];

    function exec (user) {
      o.user = user;
      o.posts = [];
      o.query = query;
      render(req, 'views', 'index', o, function (html) {
        res.simpleHtml(200, html);
      });
      /*Posts.search(query).addCallback(function (posts) {
        o.posts = posts;
        o.query = query;
        render(req, 'views', 'index', o, function (html) {
          res.simpleHtml(200, html);
        });
      });*/
    }

    if(guest) exec(null);
    else {
      Users.get({id: user_id}).addCallback(function (rows) {
        exec(rows[0]);
      });
    }
  }
}

exports.urls = ['^/',
  ['GET',       '$',    controller.index                  ],
  ['POST',      '$',    controller.search,     'multipart']
];
