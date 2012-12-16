var js2xml = require("../xmlFormatting/js2xml")
	,indexJsToXml = require("../xmlFormatting/indexJsToXml")
	,urlUtils = require("../utils/urlUtils");

exports.index = function (req, res) {
    res.set('Content-Type', 'application/atomsvc+xml.');
    var serviceFeed = new indexJsToXml.constructIndexAtomResponse(urlUtils.getHostUrl(req));
	res.send(js2xml.parseJsonObjectToXml("service", serviceFeed));
}

/*
*	HTTP 405 status should be returned if the request method
*	is not allowed on the resource
*/
exports.NotAllowed405 = function (req, res) {
    res.send(405);
}