process.mixin(GLOBAL, require('../render'));

var gen_o = function () {
  var o = {
    page_title: "Users"
  };

  return o;
}

function render_wrap(view, o, res) {
  render("crud", view, o, function(html) {
    res.simpleHtml(200, html);
  });
}

var controller = {
  index: function (req, res) {
    var o = gen_o();
    o.page_title += " | List";

    render_wrap("index", o, res);
  },
  show: function (req, res, id) {
    res.simpleText(200, "auth page");
  },
  create: function (req, res, json) {
    res.simpleText(200, "login page");
  },
  update: function (req, res, id, json) {
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
