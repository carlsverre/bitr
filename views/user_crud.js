process.mixin(GLOBAL, require('../render'));

var controller = {
  index: function (req, res) {
    render('user', 'index', {}, function (html) {
      res.simpleHtml(200, html);
    });
  },
  show: function (req, res) {
    res.simpleText(200, "auth page");
  },
  create: function (req, res) {
    res.simpleText(200, "login page");
  },
  update: function (req, res) {
    res.simpleText(200, "register page");
  },
  destroy: function (req, res) {
    res.simpleText(200, "register page");
  }

}

exports.urls = ['^/user',
  ['GET',     '$',          controller.index              ],
  ['GET',     '/([^/]+)$',  controller.show               ],
  ['POST',    '$',          controller.create,      'json'],
  ['POST',    '/([^/]+)$',  controller.update,      'json'],
  ['DELETE',  '/([^/]+)$',  controller.destroy            ]
];
