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
	//console.log(tag.title);
	tag.title = formattingObjects.ensureStringIsAtomTitle(tag.title);
	//console.log(tag.title);
	
	//tag.title = formattingObjects.titleToString(req.atomEntry["entry"]["title"]);
	
	var storedTag = storage.saveCollectionTag(tag, collectionId);
	var hostUrl = urlUtils.getHostUrl(req);
	
	var entry = metadataJsToXml.CollectionTagAtom(hostUrl,
		collection, storedTag);
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
	collectionId = req.params.colID;
	var collection = storage.getCollection(collectionId);
	var tagId = req.params.tagID;
	var tag = storage.getCollectionTag(collectionId, tagId);
	if (collection == null || tag == null) {
		res.send(404);
		return;
	}
	
	var hostUrl = urlUtils.getHostUrl(req);
	
	var representation = req.query.alt;
	if (checks.isEmptyObject(req.query) && representation == undefined) {
		res.set('Content-Type', 'application/atom+xml');
		var entry = new metadataJsToXml.CollectionTagAtom(
			urlUtils.getHostUrl(req), collection, tag);
		res.send(js2xml.parseJsonObjectToXml("entry", entry));
	}
	else if (!checks.isEmptyObject(req.query) && representation == "xml") {
		res.set('Content-Type', 'application/xml');
		var metadata = new metadataJsToXml.getCollectionTagXmlJson(
			collection, tag);
		res.send(js2xml.parseJsonObjectToXml("metadata", metadata));
	}
	else if (!checks.isEmptyObject(req.query) && representation == "json") {
		res.set('Content-Type', 'application/json');
		var metadata = new metadataJsToXml.getCollectionTagXmlJson(
			collection, tag);
		
		res.send(JSON.stringify(metadata));
	}
	else {
		res.send(400, "Bad requrest, invalid representation required: " + JSON.stringify(req.query));
	}
}

function isValidInputUpdateTag(updatedTag) {
	if (updatedTag != undefined && updatedTag["title"] != undefined)
		return true;
	else
		return false;
	
}

exports.updateCollectionTag = function(req, res) {
	var updatedTag = req.atomEntry["entry"];
	if (!isValidInputUpdateTag(updatedTag)) {
		res.send(400);
		return;
	}
		
	//TODO - validate newCollection
	var ifUnmodifiedSince = req.get("If-Unmodified-Since");
		
	var hostUrl = urlUtils.getHostUrl(req);
		
	res.set('Content-Type', 'application/atom+xml');
	//to prevent caching resources
	res.set('Expires', 'Thu, 01 Dec 1994 16:00:00 GMT');	
	var collection = storage.getCollection(req.params.colID);
	var storedTag = storage.getCollectionTag(req.params.colID, req.params.tagID);
	if (collection == null || storedTag == null) {
		res.send(404);
		return;
	}
	var hostUrl = urlUtils.getHostUrl(req);
	
	console.log("if undmodified since:" + Date.parse(ifUnmodifiedSince));
	console.log("updated:" + Date.parse(storedTag.updated));
	if (checks.isModifiedSince(ifUnmodifiedSince, storedTag.updated)) {
		var entry = new metadataJsToXml.CollectionTagAtom(
			urlUtils.getHostUrl(req), collection, storedTag);
		res.send(409, js2xml.parseJsonObjectToXml("entry", entry));
	}
	else {
		storedTag["title"] = formattingObjects.ensureStringIsAtomTitle(updatedTag["title"]);
		var newTag = storage.saveCollectionTag(storedTag, collection.id);
		var entry = metadataJsToXml.CollectionTagAtom(
			urlUtils.getHostUrl(req), collection, newTag);
		res.send(200, js2xml.parseJsonObjectToXml("entry", entry));
	}
}

exports.deleteTag = function(req, res) {
	var collectionId = req.params.colID;
	var tagId = req.params.tagID;
	var result = storage.deleteCollectionTag(collectionId, tagId);
	
	if (result) {
		res.writeHead(204, {'Content-Type': 'text/plain'});
		res.end();
	}
	else {
		res.writeHead(404, {'Content-Type': 'text/plain'});
		res.end();
	}
}