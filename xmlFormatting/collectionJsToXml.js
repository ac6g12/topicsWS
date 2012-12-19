var restState = require("./restState")
	,formattingObjects = require("./formattingObjects")
	,imageJsToXml = require("./imageJsToXml");

//POST http://localhost:3000/collection
exports.collectionPostResponse = function(newCollection, hostUrl) {
	var serviceFeed = getFormattedCollectionOnPost(hostUrl, newCollection);
	serviceFeed["$"] = formattingObjects.addAtomAttribute();
	return serviceFeed;
}

//GET http://localhost:3000/collection
exports.collectionGetResponse = function(updateTime, hostUrl, storedCollections) {
	var serviceFeed = new Object();
	serviceFeed["$"] = formattingObjects.addAtomAttribute();
	serviceFeed["id"] =  "http://vac.co.uk/collection";
	serviceFeed["title"] = formattingObjects.stringToTitle("Image Collections"); 
	serviceFeed["updated"] = updateTime;
	serviceFeed["app:collection"] = getCollectionReference(hostUrl);
	serviceFeed["entry"] = getFormattedCollections(storedCollections, hostUrl);
	return serviceFeed;
}

//GET http://localhost:3000/collection/{col_ID}/	
function getCollectionReference(hostUrl) {
	return formattingObjects.getCollectionReference(hostUrl + "/collection", "Image Collections Service", 
		"application/atom+xml;type=entry");
}
function getCollectionImagesReference(hostUrl, collectionId) {
	return formattingObjects.getCollectionReference(hostUrl + "/collection/" + collectionId, "Tagging service this collection",
		"multipart/form-data");
}
//GET http://localhost:3000/collection/{col_ID}/
exports.getCollectionImages = function(hostUrl, storedCollection, imageDescriptions) {
	storedCollection["app:collection"] = getCollectionImagesReference(hostUrl, storedCollection.id);
	var imageEntries = imageJsToXml.getFormattedImageDescriptions(hostUrl, 
		storedCollection, imageDescriptions);
	//changing and appending storedCollection
	var serviceFeed = getFormattedCollection(hostUrl, storedCollection);
	serviceFeed["entry"] = imageEntries;
	serviceFeed["$"] = formattingObjects.addAtomAttribute();
	return serviceFeed;
}

exports.updateCollectionProperties = function(hostUrl, storedCollection) {
	var serviceFeed = getFormattedCollection(hostUrl, storedCollection);
	serviceFeed["$"] = formattingObjects.addAtomAttribute();
	return serviceFeed;
}

function getFormattedCollection(hostUrl, storedCollection) {
	var originalId = storedCollection.id;
	storedCollection["id"] =  "http://vac.co.uk/collection/" + storedCollection.id;
	storedCollection["title"] = storedCollection["title"];
	storedCollection["link"] = createCollectionLinks(originalId, hostUrl);
	return storedCollection;
}

function getFormattedCollectionOnPost(hostUrl, storedCollection) {
	var originalId = storedCollection.id;
	storedCollection["id"] =  "http://vac.co.uk/collection/" + storedCollection.id;
	storedCollection["title"] = storedCollection["title"];
	storedCollection["link"] = createCollectionPostLinks(originalId, hostUrl);
	return storedCollection;
}

function getFormattedCollections(storedCollections, hostUrl) {
	var resultCollections = [];
	
	for (var i = 0; i < storedCollections.length; i++) {
		resultCollections[i] = new getFormattedCollection(hostUrl, storedCollections[i]);
	}
	
	return resultCollections;
}

//GET or POST on http://localhost:3000/collection/
function createCollectionLinks(collectionId, hostUrl) {
	var links = []
		,href = hostUrl + "/collection/" + collectionId;
	
	links[0] = new restState.createLink("edit", "application/atom+xml", href);
	//links[1] = new restState.createLink("edit-media", "application/atom+xml", href +  "/image");
	links[1] = new restState.createLink("edit", "application/atom+xml", href + "/comment");
	links[2] = new restState.createLink("edit", "application/atom+xml", href + "/metadata");
	// links[4] = new restState.createLink("alternate", "application/xml", href + "?alt=xml");
	// links[5] = new restState.createLink("alternate", "application/json", href + "?alt=json");
	return links;
}

function createCollectionPostLinks(collectionId, hostUrl) {
	var links = []
		,href = hostUrl + "/collection/" + collectionId;
	
	links[0] = new restState.createLink("edit", "application/atom+xml", href);
	links[1] = new restState.createLink("edit-media", "application/atom+xml", href +  "/image");
	links[2] = new restState.createLink("edit", "application/atom+xml", href + "/comment");
	links[3] = new restState.createLink("edit", "application/atom+xml", href + "/metadata");
	// links[4] = new restState.createLink("alternate", "application/xml", href + "?alt=xml");
	// links[5] = new restState.createLink("alternate", "application/json", href + "?alt=json");
	return links;
}