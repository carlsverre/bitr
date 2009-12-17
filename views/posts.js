var controller = {
  create: function (req, res, post) {
    var died = false;
    function die(msg,url) {
      if(!died) {
        req.session.data.flash = "Error" + (msg)?msg:"";
        res.redirect(url||req.headers.referer);
        died = true;
      }
    };

    var content = post.content || die("Your post has to have some content...");
    var private = (post.private=='on');
    var response_to = post.response_to;
    var tags = (post.tags=='Comma-delimited tags')?'':post.tags;

    var userid = req.session.data.user_id || die("Your not logged in!", "/auth");

    if(died) return;

    Users.get({id: userid}).addCallback(function (rows) {
      var user = rows[0];

      var post = new Post(response_to, user, content, tags, private);
      post.save();
      req.session.data.flash = "Success!";
      res.redirect(req.headers.referer);
    });
  },
  remove: function (req, res, post_id) {

    var userid = req.session.data.user_id;
    if(!userid) {
      req.session.data.flash = "Your not logged in!";
      res.redirect("/auth");
      return;
    }

    Users.get({id: userid}).addCallback(function (rows) {
      var user = rows[0];

      Posts.get({user_id: userid, id: post_id})
      .addCallback(function (posts) {
        var post = posts[0];
        post.remove();

        req.session.data.flash = "Success!";
        res.redirect(req.headers.referer);
      });
    });
  }
}

exports.urls = ['^/posts',
  ['POST',      '/create$',            controller.create,     'multipart'],
  ['GET',       '/delete/([^/]+)',     controller.remove                 ],
];
