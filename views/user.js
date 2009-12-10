var gen_o = function () {
  var o = {
    page_title: "Users"
  };

  return o;
}

function render_wrap(view, o, req, res) {
  render(req, "users", view, o, function(html) {
    res.simpleHtml(200, html);
  });
}

var controller = {
  index: function (req, res, username) {
    var session = req.session.data;

    var o = gen_o();
    o.page_title += " | List";

    render_wrap("index", o, req, res);
    return;

    var guest = !('user_id' in session);

    var index_exec = function (user) {
      o.posts = [];
      o.userpage = false;

      if(user !== null && user.username == username) {
        // this is the users page
        // TODO: get ALL user's posts
        //
        // o.userpage = true;
        // o.posts.push(user.get_posts());
        // render_wrap("index", o, res);
        // return;
      }

      Users.get({username:username}, function (data) {
        var profile = data[0];
        
        //o.posts.push(profile.get_posts({visibility: "public"});

        if(!guest){
          // this is another user's page
          // TODO: get ALL public users posts and check permissions
          // to get other relevant user posts
          //
          // return permissions for user.id viewing profile:
          // var perms = profile.get_permissions(user.id); 
          // var select = {
          //   is_text: perms.text,
          //   is_photo: perms.photo,
          //   is_video: perms.video
          // };
          // o.posts.push(profile.get_posts(select));
        }

        // render_wrap("index", o, res);
      });


    }

    if(guest) index_exec(null);
    else {
      Users.get({id:session.user_id}, function (data) {
        // TODO: make sure that data isn't null
        index_exec(data[0]);
      });
    }
  }
}

exports.urls = ['^/users',
  ['GET',       '/([^/]+)$',  controller.index],
];
