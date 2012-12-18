var js2xml = require("../xmlFormatting/js2xml")
	,collectionJsToXml = require("../xmlFormatting/collectionJsToXml")
	,storage = require("../storage/storage")
	,urlUtils = require("../utils/urlUtils")
	,formattingObjects = require("../xmlFormatting/formattingObjects")
	,imageJsToXml = require("../xmlFormatting/imageJsToXml")
	,checks = require("../utils/checks");

exports.collectionsPost = function (req, res) {
	var newCollection = req.atomEntry["entry"];
	newCollection["title"] = formattingObjects.titleToString(newCollection["title"]);
	//TODO - validate newCollection
	var ifUnmodifiedSince = req.get("If-Unmodified-Since");
	console.log(ifUnmodifiedSince);

	newCollection = storage.saveCollection(newCollection);
	
	var hostUrl = urlUtils.getHostUrl(req);
	
    res.set('Content-Type', 'application/atom+xml.');
	res.set('Location', hostUrl + '/collection/' + newCollection.id);
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
	
	console.dir(updateTime);
	
	res.set('Content-Type', 'application/atom+xml.');
	res.set('Last-Modified', updateTime);
	res.set('Expires', 'Thu, 01 Dec 1994 16:00:00 GMT');
	
    var serviceFeed = new collectionJsToXml.collectionGetResponse(
		updateTime, urlUtils.getHostUrl(req), storedCollections);
	//console.dir(serviceFeed);
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
		
	res.set('Content-Type', 'application/atom+xml.');
	res.set('Last-Modified', storedCollection.updated);
	res.set('Location', hostUrl + '/collection/' + storedCollection.id);
	res.send(js2xml.parseJsonObjectToXml("feed", serviceFeed));
}

exports.addNewImage = function (req, res) {
	
	//console.log(req.files.image.path);
	// console.dir(req.body.title);
	// if (req.body.summary != undefined)
		// console.log(req.body.summary);
	// else
		// console.log("summary is undefined")
	// console.dir(req.files.image.name);
	// console.dir(req.files.image.type);
	// console.dir(req.files.image.path);
	
	var imageDetails = new Object();
	imageDetails.title = req.body.title;
	imageDetails.summary = req.body.summary;
	
	collectionId = req.params.colID;
	
	var storedImage = storage.saveImage(collectionId, imageDetails, req.files.image);
	var collection = storage.getCollection(collectionId);
	var hostUrl = urlUtils.getHostUrl(req);
	
	var serviceFeed = imageJsToXml.getAddNewImageResponse(hostUrl,
		collection, storedImage);
	res.set('Content-Type', 'application/atom+xml.');
	res.set('Location', hostUrl + '/collection/' + collectionId + '/image' );
	res.send(201, js2xml.parseJsonObjectToXml("feed", serviceFeed));
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

exports.updateCollectionProperties = function(req, res) {
	var updatedCollection = req.atomEntry["entry"];
	updatedCollection["title"] = formattingObjects.titleToString(updatedCollection["title"]);
	//TODO - validate newCollection
	var ifUnmodifiedSince = req.get("If-Unmodified-Since");
	console.log(ifUnmodifiedSince);
	
	var hostUrl = urlUtils.getHostUrl(req);
		
	res.set('Content-Type', 'application/atom+xml.');
	res.set('Location', hostUrl + '/collection/' + req.params.colID);
	//to prevent caching resources
	res.set('Expires', 'Thu, 01 Dec 1994 16:00:00 GMT');	
	storedCollection = storage.getCollection(req.params.colID);
	if (checks.isModifiedSince(ifUnmodifiedSince, storedCollection.updated)) {
		var serviceFeed = new collectionJsToXml.updateCollectionProperties(
			urlUtils.getHostUrl(req), storedCollection);
		//console.dir(serviceFeed);	
		res.send(409, js2xml.parseJsonObjectToXml("entry", serviceFeed));
	}
	else {
		updateStoredCollection(updatedCollection, storedCollection);
		var newCollection = storage.saveCollection(storedCollection);
		var serviceFeed = collectionJsToXml.updateCollectionProperties(
			urlUtils.getHostUrl(req), newCollection);
		//console.dir(serviceFeed);
		//res.send(200);
		res.send(200, js2xml.parseJsonObjectToXml("entry", serviceFeed));
	}
}

exports.deleteCollection = function(req, res) {
	var collectionId = req.params.colID;
	var result = storage.deleteCollection(collectionId);
	if (result) {
		res.send(204);
	}
	else
		res.send(404);	
}