//transforms plane string to title object
exports.stringToTitle = function(strTitle) {
	var title = new Object();
	title["$"] = new Object();
	title["$"]["type"] = "text";
	title["_"] = strTitle;
	return title;
}

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