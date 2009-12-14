var controller = {
  create: function (req, res, post) {
    var content = post.content;
    var private = (post.private=='on');
    var response_to = post.response_to;
    var tags = post.tags;

    var userid = req.session.data.user_id;
    if(!userid) {
      req.session.data.flash = "Your not logged in!";
      res.redirect("/auth");
      return;
    }

    Users.get({id: userid}).addCallback(function (rows) {
      var user = rows[0];

      var post = new Post(response_to, user, content, tags, private);
      post.save();
      res.redirect(req.headers.referer);
    });
  }
}

exports.urls = ['^/posts',
  ['POST',      '/create$',     controller.create,     'multipart'],
];
