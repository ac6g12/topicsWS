exports.isModifiedSince = function(IfUnmodifiedSinceDate, updated) {
	return (Date.parse(IfUnmodifiedSinceDate) < Date.parse(updated));
}

exports.isEmptyObject = function(obj) {
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      return false;
    }
  }
  return true;
}