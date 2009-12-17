exports.pretty_date = function(d) {
  var hours = d.getHours();
  var n_hours = (hours > 12)?hours-12:hours;
  return sprintf("%02d:%02d %s on %02d/%02d/%04d",
    n_hours,
    d.getMinutes(),
    (hours>12)?"PM":"AM",
    d.getDate(),
    d.getMonth(),
    d.getFullYear()
  );
}
