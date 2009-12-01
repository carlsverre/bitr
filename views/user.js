var gen_o = function () {
  var o = {
    page_title: "Users"
  };

  return o;
}

function render_wrap(view, o, res) {
  render("users", view, o, function(html) {
    res.simpleHtml(200, html);
  });
}

var controller = {
  index: function (req, res, username) {
    var o = gen_o();
    o.page_title += " | List";

    var user = get_user(req);
    o.posts = [];
    o.userpage = false;

    if(typeof(user) !== "number" && user.username == username) {
      // this is the users page
      // TODO: get ALL user's posts
      //
      // o.userpage = true;
      // o.posts.push(user.get_posts());
      // render_wrap("index", o, res);
      // return;
    }

    var profile = Users.get(null, username);

    //o.posts.push(profile.get_posts({visibility: "public"});

    if(typeof(user) !== "number"){
      // this is another user's page
      // TODO: get ALL public users posts and check permissions
      // to get other relevant user posts
      //
      // return permissions for user.id viewing profile:
      // var perms = profile.get_permissions(user.id); 
//      var select = {
//        is_text: perms.text,
//        is_photo: perms.photo,
//        is_video: perms.video
//      };
      // o.posts.push(profile.get_posts(select));
    }

    render_wrap("index", o, res);
  }
}

exports.urls = ['^/user',
  ['GET',     '/([^/]+)$',  controller.index],
];
