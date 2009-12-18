exports.get_media = function (filename,mediatype) {
  var url = conf.settings.url + conf.settings.upload_dir + filename;
  var img = "<img src='%s'>";
  if(filename == 'default' && mediatype != 'r--')
    return sprintf(img,conf.settings.encoding_img);
  if(filename == 'error' && mediatype != 'r--')
    return sprintf(img,conf.settings.error_img);
  switch(mediatype) {
    case 'r--':
      return "";
    case '-r-': //photo
      return sprintf(img, url);
    case '--r': //video
      return sprintf("<a href='%s' class='flowplayer'>"+img+"</a>", url,conf.settings.play_img);
  }

  return "";
}
