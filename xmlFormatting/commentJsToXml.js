var formattingObjects = require("./formattingObjects")
	,restState = require("./restState");

exports.getCommentAtom = function(hostUrl, comment, colId, imgId) {
	var entry = new Object();
	entry["$"] = formattingObjects.addAtomAttribute();
	entry["id"] =  "http://vac.co.uk/collection/" + colId
	if(imgId) {
		entry["id"] += "/images/" + imgId
	}
	entry["id"] += "/comments/" + comment.id;
	entry["author"] = comment.author;
	entry["title"] = comment.title;
	entry["updated"] = comment.updated;
	entry["app:edited"] = comment["app:edited"];
	entry["link"] = createCommentLinks(hostUrl, comment.id, colId, imgId);
	return entry;
}

exports.getAllCommentsAtomFeed = function(hostUrl, comments, collection, image) {
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
	serviceFeed["id"] += "/comment";
	serviceFeed["author"] = collection.author;
	var referenceLink =	serviceFeed["id"].replace("http://vac.co.uk", hostUrl);
	serviceFeed["app:collection"] = formattingObjects.getCollectionReference(referenceLink, 
		"Comment service", "application/atom+xml;type=entry");
	serviceFeed["link"] = createGetAllCommentsLinks(hostUrl ,collection.id, imgId);
	serviceFeed["entry"] = getAtomFormattedComments(hostUrl, comments, collection.id, imgId);
	return serviceFeed;
}

//used for xml and json representation
exports.getAllCommentsXmlJson = function(comments, colId, imgId) {
	var resultCollection = new Object();
	resultCollection["$"] = formattingObjects.createSingleAttribute("id", colId);
	if(imgId) {
		resultCollection.image = new Object();
		resultCollection.image["$"] = formattingObjects.createSingleAttribute("id", imgId);
		resultCollection.image["comment"] = getAllCommentsXmlJson(comments);
	} else {
		resultCollection["comment"] = getAllCommentsXmlJson(comments);
	}
	return resultCollection;
}

exports.getCommentXmlJson = function(comment) {
	var com = new Object(); 
	com["$"] = formattingObjects.createSingleAttribute("id", comment.id);
	com["content"] = comment.title;
	com["author"] = comment.author.name
	return com;
}

function getAllCommentsXmlJson(comments) {
	var resultComments = [];
	for (var i = 0; i < comments.length; i++) {
		resultComments[i] = exports.getCommentXmlJson(comments[i]);
	}	
	return resultComments;
}

//state links for individual comment
function createCommentLinks(hostUrl, comId, colId, imgId) {
	var links = [];
	var href = hostUrl + "/collection/" + colId ;
	if(imgId) href += "/image/" + imgId;
	href += "/comment/" + comId ;
	
	links[0] = new restState.createLink("edit", "application/atom+xml", href);
	links[1] = new restState.createLink("alternate", "application/xml", href + "?alt=xml");
	links[2] = new restState.createLink("alternate", "application/json", href + "?alt=json");
	return links;
}

function createGetAllCommentsLinks(hostUrl, colId, imgId) {
	var links = []
	var href = hostUrl + "/collection/" + colId;
	if(imgId) href += "/image/" + imgId;
	href += "/comment?alt=";
	links[0] = new restState.createLink("alternate", "application/xml", href + "xml");
	links[1] = new restState.createLink("alternate", "application/json", href + "json");
	return links;
}

function getAtomFormattedComment(hostUrl, comment, colId, imgId) {
	var originalId = comment.id;	
	comment["id"] =  "http://vac.co.uk/collection/" + colId;
	if(imgId) comment["id"] += "/image/" + imgId;
	comment["id"] += "/comment/" + originalId;
	comment["link"] = createCommentLinks(hostUrl, originalId, colId, imgId);
	return comment;
}

function getAtomFormattedComments(hostUrl, comments, colId,  imgId) {
	var resultComments = [];
	
	for (var i = 0; i < comments.length; i++) {
		resultComments[i] = new getAtomFormattedComment(hostUrl, comments[i], colId, imgId);
	}	
	return resultComments;
}