var js2xml = require("../xmlFormatting/js2xml")
	,formattingObjects = require("../xmlFormatting/formattingObjects")
	,storage = require("../storage/storage")
	,metadataJsToXml = require("../xmlFormatting/metadataJsToXml")
	,urlUtils = require("../utils/urlUtils")
	,checks = require("../utils/checks");

exports.getAllCollectionTags = function(req, res) {
	res.set('Expires', 'Thu, 01 Dec 1994 16:00:00 GMT');
	var storedCollection = storage.getCollection(req.params.colID);
	if (storedCollection == null) {
		res.send(404, "Collection not found");
	}
	
	//storedCollection["title"] = formattingObjects.stringToTitle(storedCollection["title"]);
	var tags = storage.getAllCollectionTags();
	var updateTime = storage.getAllCollectionTagsUpdated();
		
	
	res.set('Last-Modified', formattingObjects.getHttpHeaderLastModified(updateTime));
	res.set('Expires', 'Thu, 01 Dec 1994 16:00:00 GMT');
	
	var representation = req.query.alt;
	if (checks.isEmptyObject(req.query) && representation == undefined) {
		res.set('Content-Type', 'application/atom+xml');
		var serviceFeed = new metadataJsToXml.getAllCollectionTagsAtomFeed(
			updateTime, urlUtils.getHostUrl(req), storedCollection, tags);
		res.send(js2xml.parseJsonObjectToXml("feed", serviceFeed));
	}
	else if (!checks.isEmptyObject(req.query) && representation == "xml") {
		res.set('Content-Type', 'application/xml');
		var xmlCollection = new metadataJsToXml.getAllCollectionTagsXmlJson(
			storedCollection, tags);
		res.send(js2xml.parseJsonObjectToXml("collection", xmlCollection));
	}
	else if (!checks.isEmptyObject(req.query) && representation == "json") {
		res.set('Content-Type', 'application/json');
		var jsonCollection = new metadataJsToXml.getAllCollectionTagsXmlJson(
			storedCollection, tags);
		
		res.send(JSON.stringify(jsonCollection));
	}
	else {
		res.send(400, "Bad requrest, invalid representation required: " + JSON.stringify(req.query));
	}
}

function isInvalidInputTag(entry) {
	if (entry == undefined || entry.title == undefined)
		return true;
	else
		return false;
}

exports.addNewCollectionTag = function(req, res) {
	collectionId = req.params.colID;
	var collection = storage.getCollection(collectionId);
	if (isInvalidInputTag(req.atomEntry["entry"])) {
		res.send(400, "Invalid tag format");
		return;
	}
	if (collection == null) {
		res.send(404, "Collection not found");
	}
	var tag = new Object();
	tag.title = req.atomEntry["entry"]["title"];
	console.log(tag.title);
	tag.title = formattingObjects.ensureStringIsAtomTitle(tag.title);
	console.log(tag.title);
	
	//tag.title = formattingObjects.titleToString(req.atomEntry["entry"]["title"]);
	
	var storedTag = storage.saveCollectionTag(tag, collectionId);
	var hostUrl = urlUtils.getHostUrl(req);
	
	var entry = metadataJsToXml.addNewCollectionTag(hostUrl,
		collection, storedTag);
	res.set('201 Created');
	res.set('Content-Type', 'application/atom+xml');
	var location = hostUrl + '/collection/' + collectionId + '/image' + "/metadata/" + tag.id;
	res.set('Location', location);
	res.send(201, js2xml.parseJsonObjectToXml("entry", entry));
}

function deleteCollectionTags(collectionId) {
	var tags = storage.getAllCollectionTags(collectionId);
	if (tags == null)
		return false;
	for (var i = 0; i < tags.length; i++) {
		var isDeleted = storage.deleteCollectionTag(collectionId, tags[i].id);
		if (!isDeleted)
			return false;
	}

	return true;		
}

exports.deleteAllCollectionTags = function(req, res) {
	var collectionId = req.params.colID;
	
	var result = deleteCollectionTags(collectionId);
	
	if (result) {
		res.writeHead(204, {'Content-Type': 'text/plain'});
		res.end();
	}
	else {
		res.writeHead(404, {'Content-Type': 'text/plain'});
		res.end();
	}
}

exports.getCollectionTag = function(req, res) {
	//TODO
}