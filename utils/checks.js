exports.isModifiedSince = function(IfUnmodifiedSinceDate, updated) {
	return (Date.parse(IfUnmodifiedSinceDate) < Date.parse(updated));
}