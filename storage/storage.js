//storage functions

exports.storeNewCollection = function (newCollection) {
	//TODO - pass to Chinedus function
	//access author and title
	console.dir(newCollection.entry.author);
	console.dir(newCollection.entry.title);
	console.dir(newCollection.entry.title["_"]);
	
	//example result from storing data
	newCollection.store = new Object();
	newCollection.store.id = 2;
	newCollection.store.updateTime = new Date();
	newCollection.store.editTime = new Date();
	
	//console.log(newCollection.store.id);
	//console.log(newCollection.store.updateTime);
	//console.log(newCollection.store.imageEntries);
}


function createStoredCollection(entryId)
{
	this.id = entryId;
	this.updateTime = new Date();
	this.editTime = new Date();
	this.authorName = "Vladimir " + entryId;
	this.title = "cats collection";
	this.summary = "favourite lolcatz " + entryId;
} 

exports.getStoredCollections = function() {
	var storedCollections = [];
	for (var i=1; i <= 3; i++) {
		storedCollections[i-1] = new createStoredCollection(i);
	}
	
	return storedCollections;
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