var gen_o = function () {
  var o = {
    page_title: "Users"
  };

  return o;
}

var controller = {
  index: function (req, res, username) {
    var o = gen_o();
    o.page_title += " | List";

    var guest = !('user_id' in req.session.data);

    var index_exec = function (user) {
      o.posts = [];
      o.userpage = false;

      if(user && (user.columns.username == username)) {
        o.userpage = true;
        user.get_posts().addCallback(function (posts) {
          o.posts.push(posts);
          render(req, "users", "index", o, function(html) {
            res.simpleHtml(200, html);
          });
        });
        return;
      }

      Users.get({username:username}).addCallback(function (data) {
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

        //render(req, "users", "index", o, function(html) {
        //  res.simpleHtml(200, html);
        //});
      });


    }

    if(guest) index_exec(null);
    else {
      Users.get({id:req.session.data.user_id}).addCallback(function (data) {
        // TODO: make sure that data isn't null
        index_exec(data[0]);
      });
    }
  }
}

exports.urls = ['^/users',
  ['GET',       '/([^/]+)$',  controller.index],
];
