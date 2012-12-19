var js2xml = require("../xmlFormatting/js2xml")
	,collectionJsToXml = require("../xmlFormatting/collectionJsToXml")
	,storage = require("../storage/storage")
	,urlUtils = require("../utils/urlUtils")
	,formattingObjects = require("../xmlFormatting/formattingObjects")
	,imageJsToXml = require("../xmlFormatting/imageJsToXml")
	,checks = require("../utils/checks");

function isValidCollectionPostEntry(newCollection) {
	return true;
}	
exports.collectionsPost = function (req, res) {
	var newCollection = req.atomEntry["entry"];
	if (!isValidCollectionPostEntry(newCollection)) {
		res.send(400);
		return;
	}
	
	newCollection["title"] = formattingObjects.ensureStringIsAtomTitle(newCollection["title"]);
	var ifUnmodifiedSince = req.get("If-Unmodified-Since");
	newCollection = storage.saveCollection(newCollection);
	
	var hostUrl = urlUtils.getHostUrl(req);
	res.set('Location', hostUrl + '/collection/' + newCollection.id);
    res.set('Content-Type', 'application/atom+xml');
	
	//to prevent caching resources
	res.set('Expires', 'Thu, 01 Dec 1994 16:00:00 GMT');
	var serviceFeed = new collectionJsToXml.collectionPostResponse(
		newCollection, urlUtils.getHostUrl(req));
	
	//console.dir(serviceFeed);
	res.send(201, js2xml.parseJsonObjectToXml("entry", serviceFeed));
};

exports.collectionsGet = function (req, res) {
	var storedCollections = storage.getAllCollections();
	var updateTime = storage.getAllCollectionsUpdated();
	if (storedCollections == null || updateTime == null)
		res.send(404);
	//console.dir(updateTime);
	
	res.set('Content-Type', 'application/atom+xml');
	res.set('Last-Modified', formattingObjects.getHttpHeaderLastModified(updateTime));
	res.set('Expires', 'Thu, 01 Dec 1994 16:00:00 GMT');
	
    var serviceFeed = new collectionJsToXml.collectionGetResponse(
		updateTime, urlUtils.getHostUrl(req), storedCollections);
	res.send(js2xml.parseJsonObjectToXml("feed", serviceFeed));
}

exports.getCollectionImages = function(req, res) {
	res.set('Expires', 'Thu, 01 Dec 1994 16:00:00 GMT');
	var storedCollection = storage.getCollection(req.params.colID);
	if (storedCollection == null) {
		res.send(404, "Collection not found");
	}
	var hostUrl = urlUtils.getHostUrl(req);
	var imageDescriptions = storage.getCollectionImagesDescription(
		storedCollection.id);
	if (imageDescriptions == null) {
		res.send(404, "Image descriptions not found");
	}
	
	var serviceFeed = collectionJsToXml.getCollectionImages(hostUrl,
		storedCollection, imageDescriptions);
		
	res.set('Content-Type', 'application/atom+xml');
	res.set('Last-Modified', formattingObjects.getHttpHeaderLastModified(storedCollection.updated));
	res.send(js2xml.parseJsonObjectToXml("feed", serviceFeed));
}

//changes some of the fields of storedCollection according to updateCollection
function updateStoredCollection(updatedCollection, storedCollection) {
	if (updatedCollection["author"] != undefined)
		storedCollection["author"] = updatedCollection["author"];
	if (updatedCollection["title"] != undefined)
		storedCollection["title"] = updatedCollection["title"];
	if (updatedCollection["summary"] != undefined)
		storedCollection["summary"] = updatedCollection["summary"];
}

function isValidInputUpdateCollection(collection) {
	if (collection == undefined)
		return false;
	if (collection["author"] != undefined || collection["title"] != undefined ||
		collection["summary"] != undefined)
		return true;
	else
		return false;
	
}

exports.updateCollectionProperties = function(req, res) {
	var updatedCollection = req.atomEntry["entry"];
	if (!isValidInputUpdateCollection(updatedCollection)) {
		res.send(400);
		return;
	}
		
	//TODO - validate newCollection
	var ifUnmodifiedSince = req.get("If-Unmodified-Since");
		
	var hostUrl = urlUtils.getHostUrl(req);
		
	res.set('Content-Type', 'application/atom+xml');
	//to prevent caching resources
	res.set('Expires', 'Thu, 01 Dec 1994 16:00:00 GMT');	
	var storedCollection = storage.getCollection(req.params.colID);
	if (checks.isModifiedSince(ifUnmodifiedSince, storedCollection.updated)) {
		var entry = new collectionJsToXml.updateCollectionProperties(
			urlUtils.getHostUrl(req), storedCollection);
		res.send(409, js2xml.parseJsonObjectToXml("entry", entry));
	}
	else {
		updateStoredCollection(updatedCollection, storedCollection);
		storedCollection["title"] = formattingObjects.ensureStringIsAtomTitle(storedCollection["title"]);
		var newCollection = storage.saveCollection(storedCollection);
		var entry = collectionJsToXml.updateCollectionProperties(
			urlUtils.getHostUrl(req), newCollection);
		res.send(js2xml.parseJsonObjectToXml("entry", entry));
	}
}

exports.deleteCollection = function(req, res) {
	var collectionId = req.params.colID;
	var result = storage.deleteCollection(collectionId);
	if (result) {
		res.writeHead(204, {'Content-Type': 'text/plain'});
		res.end();
	}
	else {
		res.writeHead(404, {'Content-Type': 'text/plain'});
		res.end();
	}
}