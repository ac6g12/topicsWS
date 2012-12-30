var js2xml = require("../xmlFormatting/js2xml")
	,formattingObjects = require("../xmlFormatting/formattingObjects")
	,storage = require("../storage/storage")
	,metadataJsToXml = require("../xmlFormatting/metadataJsToXml")
	,urlUtils = require("../utils/urlUtils")
	,checks = require("../utils/checks");

//############ COLLECTION METADATA ##########################

exports.deleteCollectionTag = function(req, res) {
	var result = storage.deleteTag(req.params.tagID, req.params.colID, function(result) {
		if (result) {
			res.writeHead(204, {'Content-Type': 'text/plain'});
		} else {
			res.writeHead(404, {'Content-Type': 'text/plain'});
		}
		res.end();
	});
}

exports.deleteAllCollectionTags = function(req, res) {
	storage.deleteAllTags(req.params.colID, function(result) {
		if (result) {
			res.writeHead(204, {'Content-Type': 'text/plain'});
		}
		else {
			res.writeHead(404, {'Content-Type': 'text/plain'});
		}
		res.end();
	});
}

//############ IMAGE METADATA ##########################

exports.addNewTag = function(req, res) {
	if (isInvalidInputTag(req.atomEntry["entry"])) {
		res.send(400, "Invalid tag format");
		return;
	}
	colId = req.params.colID;
	imgId = req.params.imgID;
	storage.getCollection(colId, function(err, collection) {
		if(err) {
			res.send(404, "Comment target not found");
			return;
		}
		var tag = new Object();
		tag.title = req.atomEntry["entry"]["title"];
		tag.title = formattingObjects.ensureStringIsAtomTitle(tag.title);

		storage.saveTag(tag, colId, imgId, function(err, storedTag) {
			if(err) {
				res.send(404, "Comment target not found");
				return;
			}
			var hostUrl = urlUtils.getHostUrl(req);
			var entry = metadataJsToXml.getTagAtom(hostUrl, storedTag, collection, imgId);
			res.set('Content-Type', 'application/atom+xml');
			res.set('Location', entry.link[0]['$']['href']);
			res.send(201, js2xml.parseJsonObjectToXml("entry", entry));
		});
	});
}

exports.getAllTags = function(req, res) {

	storage.getCollection(req.params.colID, function(err1, storedCollection) {
		storage.getAllTags(req.params.colID, req.params.imgID, function(err2, tags) {
			if(err1 || err2) {
				res.send(404, "Tags not found");
				return;
			}
			res.set('Expires', 'Thu, 01 Dec 1994 16:00:00 GMT');
			res.set('Last-Modified', formattingObjects.getHttpHeaderLastModified(storedCollection.updated));
				
			var representation = req.query.alt;
			if (checks.isEmptyObject(req.query) && representation == undefined) {
				res.set('Content-Type', 'application/atom+xml');
				var serviceFeed = metadataJsToXml.getAllTagsAtomFeed(urlUtils.getHostUrl(req), tags, storedCollection, req.params.imgID);
				res.send(js2xml.parseJsonObjectToXml("feed", serviceFeed));
			}
			else if (!checks.isEmptyObject(req.query) && representation == "xml") {
				res.set('Content-Type', 'application/xml');
				var xmlCollection = metadataJsToXml.getAllTagsXmlJson(tags, storedCollection.id, req.params.imgID);
				res.send(js2xml.parseJsonObjectToXml("collection", xmlCollection));
			}
			else if (!checks.isEmptyObject(req.query) && representation == "json") {
				res.set('Content-Type', 'application/json');
				var jsonCollection = metadataJsToXml.getAllTagsXmlJson(tags, storedCollection.id, req.params.imgID);					
				res.send(JSON.stringify(jsonCollection));
			}
			else {
				res.send(400, "Bad requrest, invalid representation required: " + JSON.stringify(req.query));
			}
		});
	});
}

exports.getTag = function(req, res) {
	storage.getCollection(req.params.colID, function(err1, collection) {
		storage.getTag(req.params.tagID, req.params.colID, req.params.imgID, function(err2, tag) {
			if(err1 || err2) {
				res.send(404);
				return;
			}

			res.set('Expires', 'Thu, 01 Dec 1994 16:00:00 GMT');
			res.set('Last-Modified', formattingObjects.getHttpHeaderLastModified(tag.updated))
			var hostUrl = urlUtils.getHostUrl(req);
			var representation = req.query.alt;
			if (checks.isEmptyObject(req.query) && representation == undefined) {
				res.set('Content-Type', 'application/atom+xml');
				var entry = metadataJsToXml.getTagAtom(urlUtils.getHostUrl(req), tag, collection, req.params.imgID);
				res.send(js2xml.parseJsonObjectToXml("entry", entry));
			}
			else if (!checks.isEmptyObject(req.query) && representation == "xml") {
				res.set('Content-Type', 'application/xml');
				var metadata = metadataJsToXml.getTagXmlJson(tag);
				res.send(js2xml.parseJsonObjectToXml("metadata", metadata));
			}
			else if (!checks.isEmptyObject(req.query) && representation == "json") {
				res.set('Content-Type', 'application/json');
				var metadata = metadataJsToXml.getTagXmlJson(tag);				
				res.send(JSON.stringify(metadata));
			}
			else {
				res.send(400, "Bad requrest, invalid representation required: " + JSON.stringify(req.query));
			}
		});
	});
}

exports.updateTag = function(req, res) {
	var updatedTag = req.atomEntry["entry"];
	if (isInvalidInputTag(updatedTag)) {
		res.send(400);
		return;
	}
	storage.getCollection(req.params.colID, function(err1, collection) {
		storage.getTag(req.params.tagID, req.params.colID, req.params.imgID, function(err2, storedTag) {
			if(err1 || err2) {
				res.send(404);
				return;
			}
			var ifUnmodifiedSince = req.get("If-Unmodified-Since");
			var hostUrl = urlUtils.getHostUrl(req);

			res.set('Content-Type', 'application/atom+xml');
			//to prevent caching resources
			res.set('Expires', 'Thu, 01 Dec 1994 16:00:00 GMT');

			if (checks.isModifiedSince(ifUnmodifiedSince, storedTag.updated)) {
				var entry = new metadataJsToXml.getTagAtom(urlUtils.getHostUrl(req), storedTag, collection, req.params.imgID);
				res.send(409, js2xml.parseJsonObjectToXml("entry", entry));
			} else {
				storedTag["title"] = formattingObjects.ensureStringIsAtomTitle(updatedTag["title"]);
				storage.saveTag(storedTag, collection.id, req.params.imgID, function(err, newTag) {
					if(err) {
						res.send(404, "Unable to save updated tag");
						return;
					}
					var entry = metadataJsToXml.getTagAtom(urlUtils.getHostUrl(req), newTag, collection, req.params.imgID);
					res.send(200, js2xml.parseJsonObjectToXml("entry", entry));
				});
			}
		});
	});	
}

exports.deleteTag = function(req, res) {
	storage.deleteTag(req.params.tagID, req.params.colID, req.params.imgID, function(result) {
		if (result) {
			res.writeHead(204, {'Content-Type': 'text/plain'});
		} else {
			res.writeHead(404, {'Content-Type': 'text/plain'});
		}
		res.end();
	});
}

exports.deleteAllTags = function(req, res) {
	storage.deleteAllTags(req.params.colID, req.params.imgID, function(result) {
		if (result) {
			res.writeHead(204, {'Content-Type': 'text/plain'});
		}
		else {
			res.writeHead(404, {'Content-Type': 'text/plain'});
		}
		res.end();
	});
}

//############ PRIVATE HELPER METHODS ##########################

function isInvalidInputTag(entry) {
	if (entry == undefined || entry.title == undefined)
		return true;
	else
		return false;
}