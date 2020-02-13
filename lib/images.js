var _ = require("underscore");

var promises = require("./promises");
var Html = require("./html");

exports.imgElement = imgElement;

function imgElement(func) {
  return function(element) {
    return promises.when(func(element)).then(function(result) {
      console.log(element);
      var attributes = _.clone(result);
      if (element.altText) {
        attributes.alt = element.altText;
      }

      if (element.rawHeight && element.rawWidth) {
        var { rawWidth, rawHeight } = element;
        var aspectRatio = rawWidth / rawHeight;

        var adjustedWidth = rawWidth / 8091.17;
        var adjustedHeight = adjustedWidth / aspectRatio;

        attributes.width = adjustedWidth.toFixed(0);
        attributes.height = adjustedHeight.toFixed(0);
      }
      return [Html.freshElement("img", attributes)];
    });
  };
}

// Undocumented, but retained for backwards-compatibility with 0.3.x
exports.inline = exports.imgElement;

exports.dataUri = imgElement(function(element) {
  return element.read("base64").then(function(imageBuffer) {
    return {
      src: "data:" + element.contentType + ";base64," + imageBuffer
    };
  });
});
