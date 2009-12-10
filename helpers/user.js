function get_session_user(req) {
  var session = req.session.data;

  if ('user_id' in session) {
    var user = Users.get({id:req.session.data.user_id});
    return user;
  }

  return null;

}

process.mixin(exports, {
  get_session_user: get_session_user
});
