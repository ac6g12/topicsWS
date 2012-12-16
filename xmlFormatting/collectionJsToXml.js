var restState = require("./restState");

//POST http://localhost:3000/collection
exports.collectionPostResponse = function(newCollection, hostUrl) {
	//TODO - use optional are mandatory fields
	var serviceFeed = {
		"@": {
			"xmlns" : "http://www.w3.org/2005/Atom",
			"xmlns:app" : "http://www.w3.org/2007/app"
		},
		id : "http://vac.co.uk/collection/" + newCollection.store.id,
		updated : newCollection.store.updateTime,
		"app:edited" : newCollection.store.editTime,
		author : newCollection.entry.author,
		// {
			// name : newCollection.entry.author
		// },
		title : {
			"@": {
				type : "text"
			},
			"#": newCollection.entry.title["_"]
		},
		summary : newCollection.entry.summary,
		link : createCollectionGetOrPostLinks(newCollection.store.id, hostUrl)
	};
	return serviceFeed;
}

//GET http://localhost:3000/collection
exports.collectionGetResponse = function(updateTime, hostUrl, storedCollections) {
	var serviceFeed = {
		"@": {
			"xmlns" : "http://www.w3.org/2005/Atom",
			"xmlns:app" : "http://www.w3.org/2007/app"
		},
		id : "http://vac.co.uk/collection",
		title : {
			"@": {
				type : "text"
			},
			"#": "Image Collections"
		},
		updated : updateTime,
		"app:collection" : {
			"@" : {
				href: hostUrl + "/collection"
			},
			title : "Image Collections Service",
			"app:accept" : "application/atom+xml;type=entry"
		},
				
		entry: getCollectionsToJson(storedCollections, hostUrl)
	};
	return serviceFeed;
}

//TODO - move to images view file
function getJsonCollection(hostUrl, storedCollection) {
	var entry = {
		id: "http://vac.co.uk/collection/" + storedCollection.id,
		updated: storedCollection.updateTime,
		"app:edited" : storedCollection.editTime,
		//todo - refactor author
		author : {
			name : storedCollection.authorName
		},
		title : {
			"@": {
				type : "text"
			},
			"#": storedCollection.title
		},
		summary : storedCollection.summary,
		link : createCollectionGetOrPostLinks(storedCollection.id, hostUrl)
	};
	
	return entry;
}

// content : {
	// "@" : {
		// type : "image/jpeg",
		// //todo - use variable for server url
		// src : serverUrl + "/image/" + storedCollection.fileName
	// }
	
//todo - move to images view file
function getCollectionsToJson(storedCollections, hostUrl) {
	var jsonCollections = [];
	
	for (var i = 0; i < storedCollections.length; i++) {
		jsonCollections[i] = new getJsonCollection(hostUrl, storedCollections[i]);
	}
	
	return jsonCollections;
}

//GET or POST on http://localhost:3000/collection/
function createCollectionGetOrPostLinks(collectionId, hostUrl) {
	var links = []
		,href = hostUrl + "/collection/" + collectionId;
	links[0] = new restState.createLink("alternate", "application/xml", href + "?alt=xml");
	links[1] = new restState.createLink("alternate", "application/json", href + "?alt=json");
	links[2] = new restState.createLink("edit", "application/atom+xml", href);
	links[3] = new restState.createLink("edit-media", "application/xml", href +  "/image");
	links[4] = new restState.createLink("edit", "application/atom+xml", href + "/comment");
	links[5] = new restState.createLink("edit", "application/atom+xml", href + "/metadata");
	return links;
}