var controller = {
  index: function (req, res) {
    render(req, 'views', 'index', {}, function (html) {
      res.simpleHtml(200, html);
    });
  }
}

exports.urls = ['^/',
  ['GET',   '$',          controller.index                  ],
];
