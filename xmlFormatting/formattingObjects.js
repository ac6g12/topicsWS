//transforms plane string to title object
exports.stringToTitle = function(strTitle) {
	var title = new Object();
	title["$"] = new Object();
	title["$"]["type"] = "text";
	title["_"] = strTitle;
	return title;
}

exports.ensureStringIsAtomTitle = function(title) {
	if (title["$"] == undefined || 
			title["$"]["type"] != "text" || title["_"] == undefined)
		return exports.stringToTitle(title);
	else
		return title;
}

// exports.convertCollectionStringToTitle = function(collection) {
	// for (var i = 0; i < collection.length; i++)
		// collection[i]["title"] = exports.stringToTitle(collection[i]["title"]);
// }

exports.titleToString = function(strTitle) {
	return strTitle["_"];
}

exports.addAtomAttribute = function() {
	return {
			"xmlns" : "http://www.w3.org/2005/Atom",
			"xmlns:app" : "http://www.w3.org/2007/app"
		};
}

exports.createSingleAttribute = function(attrName, value) {
	var attribute = new Object();
	attribute[attrName] = value; 
	return attribute;
}

exports.getHttpHeaderLastModified = function(isoUpdateTime) {
	var result = new Date(isoUpdateTime);
	return result.toUTCString();
}

exports.getCollectionReference = function(referenceLink, title, accepts) {
	var collectionReference =  new Object();
	collectionReference["$"] = exports.createSingleAttribute(
			"href", referenceLink);
	collectionReference["title"] = title;
	collectionReference["app:accept"] = accepts;
	return collectionReference;
}