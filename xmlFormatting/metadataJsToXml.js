var formattingObjects = require("./formattingObjects")
	,restState = require("./restState");

exports.getAllCollectionTagsAtomFeed = function(updateTime, hostUrl, collection, tags) {
	var serviceFeed = new Object();
	serviceFeed["$"] = formattingObjects.addAtomAttribute();
	serviceFeed["id"] =  "http://vac.co.uk/collection/" + collection.id + "/metadata/";
	serviceFeed["title"] = collection["title"];
	serviceFeed["updated"] = updateTime;
	serviceFeed["app:edited"] = updateTime;
	var referenceLink = hostUrl + '/collection/' + collection.id + "/metadata";
	serviceFeed["app:collection"] = formattingObjects.getCollectionReference(referenceLink, 
		"Tagging service for this collection", "application/atom+xml;type=entry");
	serviceFeed["link"] = createGetAllCollectionTagLinks(collection.id, hostUrl);
	serviceFeed["entry"] = getAtomFormattedTags(collection, tags, hostUrl);
	return serviceFeed;
}

exports.CollectionTagAtom = function(hostUrl, collection, tag) {
	var entry = new Object();
	entry["$"] = formattingObjects.addAtomAttribute();
	entry["id"] =  "http://vac.co.uk/collection/" + collection.id + "/metadata/" + tag.id;
	entry["title"] = tag["title"];
	entry["updated"] = tag.updated;
	entry["app:edited"] = tag["app:edited"];
	entry["author"] = collection["author"];
	entry["link"] = createTagLinks(collection.id, tag.id, hostUrl);
	return entry;
}

//used for xml and json representation
exports.getAllCollectionTagsXmlJson = function(collection, tags) {
	var resultCollection = new Object();
	resultCollection["$"] = formattingObjects.createSingleAttribute("id", collection.id);
	resultCollection["metadata"] = getCollectionTagsXmlJson(tags);
	return resultCollection;
}

function getCollectionTagsXmlJson(tags) {
	var resultTags = [];
	
	for (var i = 0; i < tags.length; i++) {
		resultTags[i] = exports.getCollectionTagXmlJson(tags[i]);
	}
	
	return resultTags;
}

exports.getCollectionTagXmlJson = function(tag) {
	var metadata = new Object(); 
	metadata["$"] = formattingObjects.createSingleAttribute("id", tag.id);
	//metadata["tag"] =  formattingObjects.titleToString(tag.title);
	metadata["tag"] = tag.title;
	return metadata;
}

function createGetAllCollectionTagLinks(collectionId, hostUrl) {
	var links = []
		,href = hostUrl + "/collection/" + collectionId + "/metadata/?alt=";
	
	links[0] = new restState.createLink("alternate", "application/xml", href + "xml");
	links[1] = new restState.createLink("alternate", "application/json", href + "json");
	return links;
}

//state links for individual tag
function createTagLinks(collectionId, tagId, hostUrl) {
	var links = []
		,href = hostUrl + "/collection/" + collectionId + "/metadata/" + tagId ;
	
	links[0] = new restState.createLink("alternate", "application/xml", href + "?alt=xml");
	links[1] = new restState.createLink("alternate", "application/json", href + "?alt=json");
	links[2] = new restState.createLink("edit", "application/atom+xml", href);
	return links;
}

function getAtomFormattedTag(hostUrl, collection, tag) {
	var originalId = tag.id;
	tag["id"] =  "http://vac.co.uk/collection/" + tag.id;
	tag["author"] = collection["author"];
	tag["link"] = createTagLinks(collection.id, originalId, hostUrl);
	return tag;
}

function getAtomFormattedTags(collection, tags, hostUrl) {
	var resultTags = [];
	
	for (var i = 0; i < tags.length; i++) {
		resultTags[i] = new getAtomFormattedTag(hostUrl, collection, tags[i]);
	}
	
	return resultTags;
}
