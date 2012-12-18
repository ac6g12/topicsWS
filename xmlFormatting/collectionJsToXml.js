var restState = require("./restState")
	,formattingObjects = require("./formattingObjects");

//POST http://localhost:3000/collection
exports.collectionPostResponse = function(newCollection, hostUrl) {
	//TODO - use optional are mandatory fields
	// var serviceFeed = {
		// "$": {
			// "xmlns" : "http://www.w3.org/2005/Atom",
			// "xmlns:app" : "http://www.w3.org/2007/app"
		// },
		// id : "http://vac.co.uk/collection/" + newCollection.store.id,
		// updated : newCollection.store.updateTime,
		// "app:edited" : newCollection.store.editTime,
		// author : newCollection.entry.author,
		// title : newCollection.entry.title,
		// // title : {
			// // "$": {
				// // type : "text"
			// // },
			// // "_": newCollection.entry.title["_"]
		// // },
		// summary : newCollection.entry.summary,
		// link : createCollectionGetOrPostLinks(newCollection.store.id, hostUrl)
	// };
	var serviceFeed = getFormattedCollection(hostUrl, newCollection);
	serviceFeed["$"] = formattingObjects.addAtomAttribute();
	return serviceFeed;
}

//GET http://localhost:3000/collection
exports.collectionGetResponse = function(updateTime, hostUrl, storedCollections) {
	var serviceFeed = new Object();
	serviceFeed["$"] = formattingObjects.addAtomAttribute();
	serviceFeed["id"] =  "http://vac.co.uk/collection";
	serviceFeed["title"] = new Object();
	serviceFeed["title"]["$"] = formattingObjects.createSingleAttribute("type", "text");
	serviceFeed["title"]["_"] = "Image Collections";
	serviceFeed["updated"] = updateTime;
	serviceFeed["app:collection"] = new Object();
	serviceFeed["app:collection"]["$"] = formattingObjects.createSingleAttribute(
			"href", hostUrl + "/collection");
	serviceFeed["app:collection"]["title"] = "Image Collections Service";
	serviceFeed["app:collection"]["app:accept"] = "application/atom+xml;type=entry";
	serviceFeed["entry"] = getFormattedCollections(storedCollections, hostUrl);
	return serviceFeed;
}

function getFormattedCollection(hostUrl, storedCollection) {
	storedCollection["id"] =  "http://vac.co.uk/collection/" + storedCollection.id;
	storedCollection["title"] = formattingObjects.stringToTitle(storedCollection["title"]);
	storedCollection["link"] = createCollectionGetOrPostLinks(storedCollection.id, hostUrl);
	return storedCollection;
}

function getFormattedCollections(storedCollections, hostUrl) {
	var jsonCollections = [];
	
	for (var i = 0; i < storedCollections.length; i++) {
		jsonCollections[i] = new getFormattedCollection(hostUrl, storedCollections[i]);
	}
	
	return jsonCollections;
}

//GET or POST on http://localhost:3000/collection/
function createCollectionGetOrPostLinks(collectionId, hostUrl) {
	var links = []
		,href = hostUrl + "/collection/" + collectionId;
	
	links[0] = new restState.createLink("edit", "application/atom+xml", href);
	links[1] = new restState.createLink("edit-media", "application/xml", href +  "/image");
	links[2] = new restState.createLink("edit", "application/atom+xml", href + "/comment");
	links[3] = new restState.createLink("edit", "application/atom+xml", href + "/metadata");
	// links[4] = new restState.createLink("alternate", "application/xml", href + "?alt=xml");
	// links[5] = new restState.createLink("alternate", "application/json", href + "?alt=json");
	return links;
}