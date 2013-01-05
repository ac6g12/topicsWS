var js2xml = require("../xmlFormatting/js2xml")
	,formattingObjects = require("../xmlFormatting/formattingObjects")
	,storage = require("../storage/storage")
	,commentJsToXml = require("../xmlFormatting/commentJsToXml")
	,urlUtils = require("../utils/urlUtils")
	,checks = require("../utils/checks");

//############ COMMENTS HANDLERS ##########################

exports.addNewComment = function(req, res) {
	if (! isValidComment(req.atomEntry["entry"])) {
		res.send(400, "Invalid comment format");
		return;
	}
	colId = req.params.colID;
	imgId = req.params.imgID;

	var comment = new Object();
	comment.title = formattingObjects.ensureStringIsAtomTitle(req.atomEntry["entry"]["title"]);
	comment.author = new Object();
	comment.author.name = req.atomEntry["entry"]["author"]["name"];

	storage.saveComment(comment, colId, imgId, function(err, storedComment) {
		if(err) {
			res.send(404, "Comment target not found");
			return;
		}
		var hostUrl = urlUtils.getHostUrl(req);
		var entry = commentJsToXml.getCommentAtom(hostUrl, storedComment, colId, imgId);
		res.set('Content-Type', 'application/atom+xml');
		res.set('Location', entry.link[0]['$']['href']);
		res.send(201, js2xml.parseJsonObjectToXml("entry", entry));
	});
}

exports.getAllComments = function(req, res) {

	storage.getCollection(req.params.colID, function(err1, storedCollection) {
		storage.getAllComments(req.params.colID, req.params.imgID, function(err2, comments) {
			if(err1 || err2) {
				res.send(404, "Comments not found");
				return;
			}
			res.set('Expires', 'Thu, 01 Dec 1994 16:00:00 GMT');
			res.set('Last-Modified', formattingObjects.getHttpHeaderLastModified(storedCollection.updated));
				
			var representation = req.query.alt;
			if (checks.isEmptyObject(req.query) && representation == undefined) {
				res.set('Content-Type', 'application/atom+xml');
				var serviceFeed = commentJsToXml.getAllCommentsAtomFeed(urlUtils.getHostUrl(req), comments, storedCollection, req.params.imgID);
				res.send(js2xml.parseJsonObjectToXml("feed", serviceFeed));
			}
			else if (!checks.isEmptyObject(req.query) && representation == "xml") {
				res.set('Content-Type', 'application/xml');
				var xmlCollection = commentJsToXml.getAllCommentsXmlJson(comments, storedCollection.id, req.params.imgID);
				res.send(js2xml.parseJsonObjectToXml("collection", xmlCollection));
			}
			else if (!checks.isEmptyObject(req.query) && representation == "json") {
				res.set('Content-Type', 'application/json');
				var jsonCollection = commentJsToXml.getAllCommentsXmlJson(comments, storedCollection.id, req.params.imgID);					
				res.send(JSON.stringify(jsonCollection));
			}
			else {
				res.send(400, "Bad requrest, invalid representation required: " + JSON.stringify(req.query));
			}
		});
	});
}

exports.getComment = function(req, res) {
	storage.getComment(req.params.comID, req.params.colID, req.params.imgID, function(err, comment) {
		if(err) {
			res.send(404, "Comment not found");
			return;
		}

		res.set('Expires', 'Thu, 01 Dec 1994 16:00:00 GMT');
		res.set('Last-Modified', formattingObjects.getHttpHeaderLastModified(comment.updated))
		var hostUrl = urlUtils.getHostUrl(req);
		var representation = req.query.alt;
		if (checks.isEmptyObject(req.query) && representation == undefined) {
			res.set('Content-Type', 'application/atom+xml');
			var entry = commentJsToXml.getCommentAtom(urlUtils.getHostUrl(req), comment, req.params.colID, req.params.imgID);
			res.send(js2xml.parseJsonObjectToXml("entry", entry));
		}
		else if (!checks.isEmptyObject(req.query) && representation == "xml") {
			res.set('Content-Type', 'application/xml');
			var com = commentJsToXml.getCommentXmlJson(comment);
			res.send(js2xml.parseJsonObjectToXml("comment", com));
		}
		else if (!checks.isEmptyObject(req.query) && representation == "json") {
			res.set('Content-Type', 'application/json');
			var com = commentJsToXml.getCommentXmlJson(comment);				
			res.send(JSON.stringify(com));
		}
		else {
			res.send(400, "Bad requrest, invalid representation required: " + JSON.stringify(req.query));
		}
	});
}

exports.updateComment = function(req, res) {
	var updatedComment = req.atomEntry["entry"];
	if (! isValidComment(updatedComment)) {
		res.send(400, "Invalid comment format");
		return;
	}
	storage.getCollection(req.params.colID, function(err1, collection) {
		storage.getComment(req.params.comID, req.params.colID, req.params.imgID, function(err2, storedComment) {
			if(err1 || err2) {
				res.send(404, "Comment not found");
				return;
			}
			var ifUnmodifiedSince = req.get("If-Unmodified-Since");
			var hostUrl = urlUtils.getHostUrl(req);

			res.set('Content-Type', 'application/atom+xml');
			res.set('Expires', 'Thu, 01 Dec 1994 16:00:00 GMT');

			if (checks.isModifiedSince(ifUnmodifiedSince, storedComment.updated)) {
				var entry = new commentJsToXml.getCommentAtom(urlUtils.getHostUrl(req), storedComment, req.params.colID, req.params.imgID);
				res.send(409, js2xml.parseJsonObjectToXml("entry", entry));
			} else {
				storedComment["title"] = formattingObjects.ensureStringIsAtomTitle(updatedComment["title"]);
				storedComment["author"] = updatedComment["author"];
				storage.saveComment(storedComment, req.params.colID, req.params.imgID, function(err, newComment) {
					if(err) {
						res.send(500, "Unable to save updated comment");
						return;
					}
					var entry = commentJsToXml.getCommentAtom(urlUtils.getHostUrl(req), newComment, req.params.colID, req.params.imgID);
					res.send(200, js2xml.parseJsonObjectToXml("entry", entry));
				});
			}
		});
	});	
}

exports.deleteComment = function(req, res) {
	storage.deleteComment(req.params.comID, req.params.colID, req.params.imgID, function(result) {
		if (result) {
			res.writeHead(204, {'Content-Type': 'text/plain'});
		} else {
			res.writeHead(404, {'Content-Type': 'text/plain'});
		}
		res.end();
	});
}

exports.deleteAllComments = function(req, res) {
	storage.deleteAllComments(req.params.colID, req.params.imgID, function(result) {
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

function isValidComment(entry) {
	if (entry == undefined) return false; 
	if (entry.title == undefined || entry.title.length < 5) return false;
	if (entry.author == undefined || entry.author.name == undefined || entry.author.name.length == 0) return false;
	return true;
}