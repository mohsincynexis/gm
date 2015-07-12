var assert = require('assert')
var fs = require('fs')

module.exports = function (_, dir, finish, gm) {
  if (!gm.integration)
    return finish();

  var original = dir + '/original.png';
  var resized = dir + '/resize';
  var widths = [300, 700, 400, 800, 200], i, cb;
  var resize = function (width, index) {
    var name = resized + index + '.png';

    if (index == widths.length) {
      return finish();
    } else {
      index++;
    }
    gm(original)
      .resize(width)
      .write(name, function(err){
        if (err) return finish(err);

        gm(name)
          .size(function (err, size) {
            if (err) return finish(err);
            if (size.width !== width) return finish("Wrong resizing on requested:" + width + ", resized:" + size.width);

            if (cb) return cb();
            resize(widths[index], index);
          });
      });
  };

  resize(widths[0], 0);
}