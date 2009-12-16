var conf = require('../conf');

var tname = conf.tables.sessions;

exports.Sessions = {
  get: function () {
    var promise = new process.Promise();

    DB.simple_select(tname, null, null).addCallback(function (rows) {
      var sessions_a = [];

      for (var i in rows) {
        var row = rows[i];
        sessions_a.push(row.session);
      } 

      promise.emitSuccess(sessions_a);
    }).addErrback(function (err) {
      promise.emitError(err);
    });

    return promise;
  },
  add: function (session_id, session, update) {
    debug(((update)?'updating':'saving')+" session",session_id);
    var columns = {
      session_id: session_id,
      session: session
    }

    if(update) DB.simple_update(tname, columns, {session_id: session_id});
    else DB.simple_insert(tname, columns, false);
  },
  remove: function (session_id) {
    debug("removing session",session_id);
    var sql = sprintf("DELETE FROM %s where session_id=?", tname);
    DB.query(sql, [session_id]);
  }
}
