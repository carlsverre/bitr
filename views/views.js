process.mixin(GLOBAL, require('../render'));

var controller = {
  index: function (req, res) {
    render('views', 'index', {}, function (html) {
      res.simpleHtml(200, html);
    });
  },
  auth: function (req, res) {
    res.simpleText(200, "auth page");
  },
  login: function (req, res) {
    res.simpleText(200, "login page");
  },
  register: function (req, res) {
    res.simpleText(200, "register page");
  }
}

exports.urls = ['^/',
  ['GET',   '$',          controller.index              ],
  ['GET',   'auth$',      controller.auth               ],
  ['POST',  'login$',     controller.login,       'json'],
  ['POST',  'register$',  controller.register,    'json']
];
