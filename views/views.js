var controller = {
  index: function (req, res) {
    render(req, 'views', 'index', {}, function (html) {
      res.simpleHtml(200, html);
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
