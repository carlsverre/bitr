var posix = require('posix');

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
    var files = post.files || "";

    var post_id;

    if(files != '') {
      var filename,file;for(var k in files){filename=k;file=files[k];break;};

      var index = filename.lastIndexOf(".")+1;
      var ext = ((index <= 0) ? "" : filename.substring(index)).toLowerCase();
      var accepted_filetypes = {jpg:0,jpeg:0,png:0,gif:0,avi:1,mpg:1,mov:1};

      if(!(ext in accepted_filetypes)) {
        return die("Accepted filetypes: jpg, png, gif, avi, mpg, mov");
      }

      var filetype = (accepted_filetypes[ext])?'video':'image';
      var hash = md5(file);

      var path_raw    = conf.settings.encoding_dir   + hash + '.'+ext;
      var path_proc   = conf.settings.abs_upload_dir + hash + '.'+ext;

      var flags = process.O_CREAT|process.O_WRONLY|process.O_TRUNC;

      var errorHandler = function () {
        debug.apply(null,arguments);
      }

// POSIX OPEN
              posix.open(path_raw, flags, process.S_IRWXU)
              .addCallback(function (fd) {
// POSIX WRITE
              posix.write(fd, file)
              .addCallback(function (bytes) {
// POSIX CLOSE
              posix.close(fd)
              .addCallback(function () {
// CALL ENCODER
                var encoder_a = conf.encoders[filetype](path_raw, path_proc);
                var encoder = process.createChildProcess.apply(null, encoder_a);
                encoder.addListener("exit", function (code) {
                  posix.unlink(path_raw);
                  
                  Posts.get({id:post_id}).addCallback(function (posts) {
                    var post = posts[0];
                    post.columns.filename = hash+'.'+ext;
                    post.save();
                  }); // CLOSE POSTS GET

                }); // CLOSE ENCODER
              }).addErrback(errorHandler); // CLOSE CLOSE
            }).addErrback(errorHandler); // CLOSE WRITE
          }).addErrback(errorHandler); // CLOSE OPEN
    }

    var userid = req.session.data.user_id || die("Your not logged in!", "/auth");

    if(died) return;

    Users.get({id: userid}).addCallback(function (rows) {
      var user = rows[0];

      var mediatype = (filetype===undefined)?null:((filetype=='image')?'-r-':'--r');
      var encoding_img = (filetype!==undefined)?'default':null;
      var post = new Post(response_to, user, content, tags, private, mediatype, encoding_img);
      post.save()
      .addCallback(function (id) {
        post_id = id;
      });
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
