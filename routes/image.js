var	js2xml = require("../xmlFormatting/js2xml")
	,storage = require("../storage/storage")
	,urlUtils = require("../utils/urlUtils")
	,formattingObjects = require("../xmlFormatting/formattingObjects")
	,imageJsToXml = require("../xmlFormatting/imageJsToXml")
	,checks = require("../utils/checks");
	
function ensureImageCorrectTitle(imageDetailsTitle, image) {
	var title;
	if (imageDetailsTitle == undefined)
		title = image.name;
	else
		title =  imageDetailsTitle;
	return formattingObjects.ensureStringIsAtomTitle(title);
}

exports.addNewImage = function (req, res) {
	if (req.files.image == undefined) {
		req.send(400);
		return;
	}

	var hostUrl = urlUtils.getHostUrl(req);
	var imageDetails = new Object();
	imageDetails.title = req.body.title;
	// not compulsory
	if(req.body.summary) {
		imageDetails.summary = req.body.summary;
	}
	
	imageDetails.title = ensureImageCorrectTitle(imageDetails.title, req.files.image);
	collectionId = req.params.colID;
	
	storage.saveImage(collectionId, imageDetails, req.files.image, function(err1, storedImage) {
		storage.getCollection(collectionId, function(err2, collection) {
			if(err1 || err2) {
				req.send(500, "Couldn't save data");
				return;
			}
			res.set('Content-Type', 'application/atom+xml');
			res.set('Location', hostUrl + '/collection/' + collectionId + '/image/' + storedImage.id);
			var entry = imageJsToXml.getAtomImageDescription(hostUrl, collection, storedImage);	
			res.send(201, js2xml.parseJsonObjectToXml("entry", entry));
		});
	});
}

exports.getImage = function (req, res) {
	res.set('Expires', 'Thu, 01 Dec 1994 16:00:00 GMT');
	storage.getCollection(req.params.colID, function(err1, storedCollection) {
		storage.getCollectionImageDescription(req.params.colID, req.params.imgID, function(err2, imageDescription) {
			if (err1 || err2) {
				res.send(404);
				return;
			}
			var hostUrl = urlUtils.getHostUrl(req);

			var entry = imageJsToXml.getAtomImageDescription(hostUrl,
						storedCollection, imageDescription);
		
			res.set('Content-Type', 'application/atom+xml');
			res.set('Last-Modified', formattingObjects.getHttpHeaderLastModified(imageDescription.updated));
			res.send(js2xml.parseJsonObjectToXml("entry", entry));
		});
	});
}

function isValidImageRequest(imageDetails, image) {
	//is there at least one thing to update?
	if (imageDetails.title != undefined || imageDetails.summary != undefined ||
			image != undefined)
		return true;
	else
		return false;
}

function updateImageDescription(storedImageDescription, imageDetails, image) {
	if (image == undefined)
		
	if (imageDetails["title"] == undefined && image == undefined)
		imageDetails["title"] = storedImageDescription["title"];
	else if (imageDetails["title"] == undefined)
		imageDetails["title"] = ensureImageCorrectTitle(imageDetails.title, image);
	if (imageDetails["summary"] == undefined)
		imageDetails["summary"] = storedImageDescription["summary"];
}

exports.updateImage = function(req, res) {
	var imageDetails = new Object();
	imageDetails.title = req.body.title;
	imageDetails.summary = req.body.summary;
	
	if (!isValidImageRequest(imageDetails, req.files.image)) {
		res.send(400);
		return;
	}
	storage.getCollection(req.params.colID, function(err1, storedCollection) {
		storage.getCollectionImageDescription(req.params.colID, req.params.imgID, function(err2, storedImageDescription) {
			if(err1 || err2) {
				res.send(404);
				return;
			}
			var hostUrl = urlUtils.getHostUrl(req);
			res.set('Expires', 'Thu, 01 Dec 1994 16:00:00 GMT');
			res.set('Content-Type', 'application/atom+xml');
			var ifUnmodifiedSince = req.get("If-Unmodified-Since");
			if (checks.isModifiedSince(ifUnmodifiedSince, storedImageDescription.updated)) {
				var entry = imageJsToXml.getAtomImageDescription(hostUrl, storedCollection, storedImageDescription);
				res.send(409, js2xml.parseJsonObjectToXml("entry", entry));
			} else {
				if(imageDetails.title) storedImageDescription.title = imageDetails.title;
				if(imageDetails.summary) storedImageDescription.summary = imageDetails.summary;
//				updateImageDescription(storedImageDescription, imageDetails, req.files.image);		
				storage.saveImage(storedCollection.id, storedImageDescription, req.files.image, function(err, storedImage) {
					if(err) {
						res.send(500, "unable to save details");
						return;
					}
					var entry = imageJsToXml.getAtomImageDescription(hostUrl, storedCollection, storedImage);
					res.send(js2xml.parseJsonObjectToXml("entry", entry));
				});
					
			}
		});
	});	
}

exports.deleteImage = function(req, res) {
	storage.deleteImage(req.params.colID, req.params.imgID, function(result) {
		if (result) {
			res.writeHead(204, {'Content-Type': 'text/plain'});
		} else {
			res.writeHead(404, {'Content-Type': 'text/plain'});
		}
		res.end();
	});
}

