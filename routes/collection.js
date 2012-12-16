var js2xml = require("../xmlFormatting/js2xml")
	,collectionJsToXml = require("../xmlFormatting/collectionJsToXml")
	,storage = require("../storage/storage")
	,urlUtils = require("../utils/urlUtils");

exports.collectionsPost = function (req, res) {
	var newCollection = req.atomEntry;
	//TODO - validate newCollection
	storage.storeNewCollection(newCollection);
		
    res.set('Content-Type', 'application/atomsvc+xml.');
	
    var serviceFeed = new collectionJsToXml.collectionPostResponse(
		newCollection, urlUtils.getHostUrl(req));
	//console.dir(serviceFeed);
	res.send(201, js2xml.parseJsonObjectToXml("entry", serviceFeed));
};

exports.collectionsGet = function (req, res) {
	var storedCollections = storage.getStoredCollections();
	var updateTime = new Date();
	//console.dir(storedCollections);
	
    res.set('Content-Type', 'application/atomsvc+xml.');
	
    var serviceFeed = new collectionJsToXml.collectionGetResponse(
		updateTime, urlUtils.getHostUrl(req), storedCollections);
	//console.dir(serviceFeed);
	res.send(js2xml.parseJsonObjectToXml("feed", serviceFeed));
};