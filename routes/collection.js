var js2xml = require("../xmlFormatting/js2xml")
	,collectionJsToXml = require("../xmlFormatting/collectionJsToXml")
	,storage = require("../storage/storage")
	,urlUtils = require("../utils/urlUtils")
	,formattingObjects = require("../xmlFormatting/formattingObjects");

exports.collectionsPost = function (req, res) {
	var newCollection = req.atomEntry["entry"];
	newCollection["title"] = formattingObjects.titleToString(newCollection["title"]);
	//TODO - validate newCollection
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
	
	//console.dir(storedCollections);
	
	res.set('Content-Type', 'application/atom+xml.');
	res.set('Last modified', updateTime);
	res.set('Expires', 'Thu, 01 Dec 1994 16:00:00 GMT');
	
    var serviceFeed = new collectionJsToXml.collectionGetResponse(
		updateTime, urlUtils.getHostUrl(req), storedCollections);
	//console.dir(serviceFeed);
	res.send(js2xml.parseJsonObjectToXml("feed", serviceFeed));
}

exports.collectionsGetById = function(req, res) {
	if (req.params.colID == undefined)	{
		res.send(404);
		return;
	}
	var storedCollection = storage.getCollection(req.params.colID);
	var hostUrl = urlUtils.getHostUrl(req);
	
	res.set('Location', hostUrl + '/collection/' + collectionId);
	res.send(200, "Created");
}

exports.addNewImage = function (req, res) {
	
	//console.log(req.files.image.path);
	console.dir(req.body.title);
	if (req.body.summary != undefined)
		console.log(req.body.summary);
	else
		console.log("summary is undefined")
	console.dir(req.files.image.name);
	console.dir(req.files.image.type);
	console.dir(req.files.image.path);
	
	image = new Object();
	image.title = req.body.title;
	image.summary = req.body.summary;
	image.fileName = req.files.image.name;
	image.mimeType = req.files.image.type;
	image.path = req.files.image.path;
	
	var hostUrl = urlUtils.getHostUrl(req);
	collectionId = req.params.colID;
	//console.log("collectionId " + collectionId);
	res.set('Location', hostUrl + '/collection/' + collectionId + '/image' );
	res.send(201, "Created");
}