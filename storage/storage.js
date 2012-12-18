//storage functions

exports.saveCollection = function(collection) {
	//output
	var resultCollection = new Object();
	//filled in by storage
	resultCollection.id = collection.id;
	resultCollection.updated = new Date().toISOString();//last update of a collection
	resultCollection["app:edited"] = new Date().toISOString();
	
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
	collection.updated = new Date().toISOString();//last update of a collection
	collection["app:edited"] = new Date().toISOString();
	collection.author = new Object();
	collection.author.name = "Vladimir " + entryId;
	collection.title = "Collection of special cats";
	//optional
	//collection.summary = "favourite lolcatz " + entryId;
	return collection;
} 

exports.getAllCollectionsUpdated = function() {
	//console.log(new Date().toISOString());
	return new Date().toISOString();
}

exports.getCollection = function(collectionId) {
	//input: the id of the collection, ie 1
	
	//output - collection object
	var collection = new Object();
	collection.id = 13;
	collection.updated = new Date().toISOString();//last update of a collection
	collection["app:edited"] = new Date().toISOString();
	collection.author = new Object();
	collection.author.name = "John Smith"; 
	collection.title = "Collection of incredible dogs";
	//optional
	//collection.summary = "my collection of cats";
	
	return collection;	
}

exports.getCollectionImagesDescription = function(collectionId) {
	//output - descriptio of the image without the binary data
	var imageDesc = new Object();
	imageDesc.id = 2;
	imageDesc.updated = new Date().toISOString();//last update of a collection
	imageDesc["app:edited"] = new Date().toISOString();
	imageDesc.title = "wiki_cat.jpg";//what the autor calls it
	imageDesc.mimeType = "image/jpeg";
	imageDesc.path = "/public/images/img12_1.jpg" ;//the full path (except the host) where the image is stored
	
	var imageDescriptions = [];
	imageDescriptions[0] = imageDesc;
	return imageDescriptions;	
}

exports.saveImage = function(collectionId, imageDetails, image) {
	//input
	//image - the uploaded image from the multipart/form data - req.files.image
	//all the necessary details for uploading image
	//note - the imageDetails.id might already be created
	//if a binary image is not present as a parameter, imageDetails.id must exist
	var imageDetails = new Object();
	imageDetails.title = "My superb cat";
	//optional
	imageDetails.summary = "This is my superb cat";
	
	//image - format
	// { size: 74643,
  // path: '/tmp/8ef9c52abe857867fd0a4e9a819d1876',
  // name: 'edge.png',
  // type: 'image/png',
  // hash: false,
  // lastModifiedDate: Thu Aug 09 2012 20:07:51 GMT-0700 (PDT),
  // _writeStream: 
   // { path: '/tmp/8ef9c52abe857867fd0a4e9a819d1876',
     // fd: 13,
     // writable: false,
     // flags: 'w',
     // encoding: 'binary',
     // mode: 438,
     // bytesWritten: 74643,
     // busy: false,
     // _queue: [],
     // _open: [Function],
     // drainable: true },
  // length: [Getter],
  // filename: [Getter],
  // mime: [Getter] }
		
	//output
	var resultImage = new Object();
	resultImage.id = 14;
	resultImage.updated = new Date().toISOString();//last update of a image
	resultImage["app:edited"] = new Date().toISOString();
	//the rest are like the input image
	resultImage.title = "My superb cat";
	//optional
	resultImage.summary = "This is my superb cat";
	resultImage.mimeType = "image/jpeg";
	resultImage.path = "/public/images/img12_1.jpg" ;//the full where the image is store
	return resultImage;
}

exports.deleteCollection = function(collectionId) {
	//collectionId must exist
	//delete all associated images, tags, image tags, comments, and image comments
	//for successful deletion - return true
	//for unsuccessful - return false
	return true;
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