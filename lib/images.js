var _ = require("underscore");

var promises = require("./promises");
var Html = require("./html");

exports.imgElement = imgElement;

function imgElement(func) {
  return function(element, extra, messages) {
    return promises.when(func(element)).then(function(result) {
      var attributes = _.clone(result);
      if (element.altText) {
        attributes.alt = element.altText;
      }
      if (element.relationshipId) {
        attributes.relationshipId = element.relationshipId;
      }
      if (extra) {
        attributes.height = extra.rawHeight;
        attributes.width = extra.rawWidth;
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
