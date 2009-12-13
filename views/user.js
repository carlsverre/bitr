var controller = {
  index: function (req, res, username) {
    var o = {};
    o.page_title = username + " | Home";

    var guest = !('user_id' in req.session.data);

    var index_exec = function (user) {
      o.userpage = false;

      if(user && (user.columns.username == username)) {
        o.userpage = true;
        user.get_posts().addCallback(function (posts) {
          o.posts = posts;
          render(req, "users", "index", o, function(html) {
            res.simpleHtml(200, html);
          });
        });
        return;
      }

      Users.get({username:username}).addCallback(function (data) {
        var profile = data[0];

        if(!profile) {
          o.username = username;
          o.page_title = "Unknown User";
          render(req, "users", "unknown", o, function(html) {
            res.simpleHtml(200, html);
          });
          return;
        }
        
        if(!guest){
          var perms = profile.get_permissions(user.columns.id);
          perms.addCallback(function (perms) {
            var perm = perms[0];

            profile.get_posts_perms(perm).addCallback(function (posts) {
              o.posts = posts;
              render(req, "users", "index", o, function(html) {
                res.simpleHtml(200, html);
              });
            });
          });
        } else {
          profile.get_posts({private:false}).addCallback(function (posts) {
            o.posts = posts;
            render(req, "users", "index", o, function(html) {
              res.simpleHtml(200, html);
            });
          });
        }
      });
    }

    if(guest) index_exec(null);
    else {
      Users.get({id:req.session.data.user_id}).addCallback(function (data) {
        index_exec(data[0]);
      });
    }
  }
}

exports.urls = ['^/users',
  ['GET',       '/([^/]+)$',  controller.index],
];
