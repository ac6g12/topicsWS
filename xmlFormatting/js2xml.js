var js2xmlparser = require("js2xmlparser");

exports.parseJsonObjectToXml = function (rootName, jsonObject) {
	var parsedXml = js2xmlparser(rootName, jsonObject);
	console.log(parsedXml);
	return parsedXml;
}