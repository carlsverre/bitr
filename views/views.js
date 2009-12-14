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
  static: function (req, res, file) {
    server.staticHandler(req, res, conf.settings.static + file);
  }
}

exports.urls = ['^/',
  ['GET',       '$',    controller.index],
  ['GET',       'static/(.+)$',    controller.static],
];
