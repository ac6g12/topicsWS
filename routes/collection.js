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

	storage.saveCollection(newCollection, function(err, savedCollection) {
		var hostUrl = urlUtils.getHostUrl(req);
		res.set('Location', hostUrl + '/collection/' + savedCollection.id);
		res.set('Content-Type', 'application/atom+xml');
	
		//to prevent caching resources
		res.set('Expires', 'Thu, 01 Dec 1994 16:00:00 GMT');
		var serviceFeed = new collectionJsToXml.collectionPostResponse(savedCollection, urlUtils.getHostUrl(req));
	
		//console.dir(serviceFeed);
		res.send(201, js2xml.parseJsonObjectToXml("entry", serviceFeed));
	});
};

exports.collectionsGet = function (req, res) {
	storage.getAllCollections(function(err1, storedCollections) {
		storage.getAllCollectionsUpdated(function(err2, updateTime) {
			if(err1 || err2) {
				res.send(404);
				return;
			}
			res.set('Content-Type', 'application/atom+xml');
			res.set('Last-Modified', formattingObjects.getHttpHeaderLastModified(updateTime));
			res.set('Expires', 'Thu, 01 Dec 1994 16:00:00 GMT');
			
			var serviceFeed = new collectionJsToXml.collectionGetResponse(
				updateTime, urlUtils.getHostUrl(req), storedCollections);
			res.send(js2xml.parseJsonObjectToXml("feed", serviceFeed));
		});
	});
}

exports.getCollectionImages = function(req, res) {
	storage.getCollection(req.params.colID, function(err, storedCollection) {
		if(err) {
			res.send(404, "Collection not found");
			return;
		}
		var hostUrl = urlUtils.getHostUrl(req);
		storage.getCollectionImagesDescription(storedCollection.id, function(err, imageDescriptions) {
			if(err) {
				res.send(404, "Image descriptions not found");
				return;
			}
			var serviceFeed = collectionJsToXml.getCollectionImages(hostUrl,
						storedCollection, imageDescriptions);

			res.set('Expires', 'Thu, 01 Dec 1994 16:00:00 GMT');
			res.set('Content-Type', 'application/atom+xml');
			res.set('Last-Modified', formattingObjects.getHttpHeaderLastModified(storedCollection.updated));
			res.send(js2xml.parseJsonObjectToXml("feed", serviceFeed));
		});
	});
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

	var ifUnmodifiedSince = req.get("If-Unmodified-Since");
		
	var hostUrl = urlUtils.getHostUrl(req);
		
	storage.getCollection(req.params.colID, function(err, storedCollection ) {
		if(err) {
			res.send(404, "Collection not found");
			return;
		}

		res.set('Content-Type', 'application/atom+xml');
		//to prevent caching resources
		res.set('Expires', 'Thu, 01 Dec 1994 16:00:00 GMT');
		if (checks.isModifiedSince(ifUnmodifiedSince, storedCollection.updated)) {
			var entry = new collectionJsToXml.updateCollectionProperties(urlUtils.getHostUrl(req), storedCollection);
			res.send(409, js2xml.parseJsonObjectToXml("entry", entry));
		}
		else {
			updateStoredCollection(updatedCollection, storedCollection);
			storedCollection["title"] = formattingObjects.ensureStringIsAtomTitle(storedCollection["title"]);
			storage.saveCollection(storedCollection, function(err, newCollection) {
				if(err) {
					res.send(500, "Unable to save updated collection");
					return;
				}
				var entry = collectionJsToXml.updateCollectionProperties(urlUtils.getHostUrl(req), newCollection);
				res.send(js2xml.parseJsonObjectToXml("entry", entry));
			});
		}
	});
}

exports.deleteCollection = function(req, res) {
	var collectionId = req.params.colID;
	storage.deleteCollection(collectionId, function(result) {
		if (result) {
			res.writeHead(204, {'Content-Type': 'text/plain'});
		}
		else {
			res.writeHead(404, {'Content-Type': 'text/plain'});
		}
		res.end();
	});
}