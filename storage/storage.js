//storage functions

exports.saveCollection = function(collection) {
	//output
	var resultCollection = new Object();
	//filled in by storage
	resultCollection.id = collection.id;
	resultCollection.updated = new Date();//last update of a collection
	resultCollection["app:edited"] = new Date();
	
	//the same as input
	resultCollection.author = collection.author;
	resultCollection.title = collection.title;
	//optional
	resultCollection.summary = collection.summary;
	return resultCollection;
}
exports.getAllCollections = function() {
	var allCollections = [];
	for (var i=1; i <= 3; i++) {
		allCollections[i-1] = new createStoredCollection(i);
	}
	
	return allCollections;
}

function createStoredCollection(entryId)
{
	var collection = new Object();
	collection.id = entryId;
	collection.updated = new Date();//last update of a collection
	collection["app:edited"] = new Date();
	collection.author = new Object();
	collection.author.name = "Vladimir " + entryId;
	collection.title = "Collection of special cats";
	//optional
	//collection.summary = "favourite lolcatz " + entryId;
	return collection;
} 

exports.getAllCollectionsUpdated = function() {
	return new Date();
}

function getCollection(collectionId) {
	//input: the id of the collection, ie 1
	
	//output - collection object
	var collection = new Object();
	collection.id = 13;
	collection.updated = new Date();//last update of a collection
	collection["app:edited"] = new Date();
	collection.author = new Object();
	collection.author.name = "John Smith"; 
	collection.title = "Collection of incredible dogs";
	//optional
	//collection.summary = "my collection of cats";
	
	return collection;	
}
// //simulates getting entries from storage
// function getStoreImages(collectionId) {
	// var imageEntries = [];
	
	// //TODO - get from node.js settings
	// var serverUrl = "http://localhost:3000";
		
	// for (var i=1; i <= 1; i++) {
		// imageEntries[i-1] = new createStoreImage(collectionId, i);
	// }
	// return imageEntries;
// }
// function createStoreImage(collectionId, entryId)
// {
	// this.id = entryId;
	// this.updateTime = new Date();
	// this.editTime = new Date();
	// this.authorName = "Vladimir " + entryId;
	// this.title = "cats collection";
	// this.fileName = "img" + collectionId + "_" + entryId + ".jpg";
// } 

//end of storage functions