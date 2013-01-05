var js2xmlparser = require("js2xmlparser");

exports.parseJsonObjectToXml = function (rootName, jsonObject) {
	var parsedXml = js2xmlparser(rootName, jsonObject, {
			attributeString: '$',
			valueString : '_'});
	//TODO - remove logging in production code
//	console.log(parsedXml);
	return parsedXml;
}