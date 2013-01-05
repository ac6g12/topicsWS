var formattingObjects = require("./formattingObjects")
	,restState = require("./restState");

exports.getAllTagsAtomFeed = function(hostUrl, tags, collection, image) {
	var imgId = undefined;
	var serviceFeed = new Object();
	serviceFeed["$"] = formattingObjects.addAtomAttribute();
	serviceFeed["id"] =  "http://vac.co.uk/collection/" + collection.id;
	if(image) {
		imgId = image.id;
		serviceFeed["id"] += "/image/" + imgId;
		serviceFeed["title"] = image.title;
		if (image.summary) {
			serviceFeed["summary"] = image.summary;
		}
		serviceFeed["updated"] = image.updated;
		serviceFeed["app:edited"] = image["app:edited"];
	} else {
		serviceFeed["title"] = collection.title;
		serviceFeed["summary"] = collection.summary;
		serviceFeed["updated"] = collection.updated;
		serviceFeed["app:edited"] = collection["app:edited"];
	}
	serviceFeed["id"] += "/metadata/";
	var referenceLink =	serviceFeed["id"].replace("http://vac.co.uk", hostUrl);
	serviceFeed["app:collection"] = formattingObjects.getCollectionReference(referenceLink, 
		"Tagging service", "application/atom+xml;type=entry");
	serviceFeed["link"] = createGetAllTagLinks(hostUrl, collection.id, imgId);
	serviceFeed["entry"] = getAtomFormattedTags(hostUrl, tags, collection, imgId);
	return serviceFeed;
}

exports.getTagAtom = function(hostUrl, tag, collection, imgId) {
	var entry = new Object();
	entry["$"] = formattingObjects.addAtomAttribute();
	entry["id"] =  "http://vac.co.uk/collection/" + collection.id 
	if(imgId) {
		entry["id"] += "/image/" + imgId
	}
	entry["id"] += "/metadata/" + tag.id;
	entry["title"] = tag["title"];
	entry["updated"] = tag.updated;
	entry["app:edited"] = tag["app:edited"];
	entry["author"] = collection["author"];
	entry["link"] = createTagLinks(hostUrl, tag.id, collection.id, imgId);
	return entry;
}

//used for xml and json representation
exports.getAllTagsXmlJson = function(tags, colId, imgId) {
	var resultCollection = new Object();
	resultCollection["$"] = formattingObjects.createSingleAttribute("id", colId);
	if(imgId) {
		resultCollection.image = new Object();
		resultCollection.image["$"] = formattingObjects.createSingleAttribute("id", imgId);
		resultCollection.image["metadata"] = getAllTagsXmlJson(tags);
	} else {
		resultCollection["metadata"] = getAllTagsXmlJson(tags);
	}
	return resultCollection;
}

exports.getTagXmlJson = function(tag) {
	var metadata = new Object(); 
	metadata["$"] = formattingObjects.createSingleAttribute("id", tag.id);
	//metadata["tag"] =  formattingObjects.titleToString(tag.title);
	metadata["tag"] = tag.title;
	return metadata;
}

function getAllTagsXmlJson(tags) {
	var resultTags = [];
	
	for (var i = 0; i < tags.length; i++) {
		resultTags[i] = exports.getTagXmlJson(tags[i]);
	}
	
	return resultTags;
}

function createGetAllTagLinks(hostUrl, collectionId, imgId) {
	var links = []
	var href = hostUrl + "/collection/" + collectionId;
	if(imgId) href += "/image/" + imgId;
	href += "/metadata/?alt=";
	links[0] = new restState.createLink("alternate", "application/xml", href + "xml");
	links[1] = new restState.createLink("alternate", "application/json", href + "json");
	return links;
}

//state links for individual tag
function createTagLinks(hostUrl, tagId, collectionId, imgId) {
	var links = [];
	var href = hostUrl + "/collection/" + collectionId ;
	if(imgId) href += "/image/" + imgId;
	href += "/metadata/" + tagId ;
	
	links[0] = new restState.createLink("edit", "application/atom+xml", href);
	links[1] = new restState.createLink("alternate", "application/xml", href + "?alt=xml");
	links[2] = new restState.createLink("alternate", "application/json", href + "?alt=json");
	return links;
}

function getAtomFormattedTag(hostUrl, collection, tag, imgId) {
	var originalId = tag.id;	
	tag["id"] =  "http://vac.co.uk/collection/" + collection.id;
	if(imgId) tag["id"] += "/image/" + imgId;
	tag["id"] += "/metadata/" + originalId;
	tag["author"] = collection["author"];
	tag["link"] = createTagLinks(hostUrl, originalId, collection.id, imgId);
	return tag;
}

function getAtomFormattedTags(hostUrl, tags, collection, imgId) {
	var resultTags = [];
	
	for (var i = 0; i < tags.length; i++) {
		resultTags[i] = new getAtomFormattedTag(hostUrl, collection, tags[i], imgId);
	}	
	return resultTags;
}
