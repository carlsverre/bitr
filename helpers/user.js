function get_user(req) {
  var session = req.session.data;

  if ('user_id' in session) {
    var user = Users.get(req.session.data.user_id);
    return user;
  }

  return -1;

}

process.mixin(exports, {
  get_user: get_user
});
