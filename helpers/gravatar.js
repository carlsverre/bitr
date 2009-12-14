var gravatar_url = "http://www.gravatar.com/avatar/%s?d=" + conf.settings.gravatar_default;

exports.gravatar = function (user) {
  if(!('email' in user.columns) || !user.columns.email) {
    return sprintf(gravatar_url, md5(user.columns.username));
  }
  return sprintf(gravatar_url, md5(user.columns.email));
}
