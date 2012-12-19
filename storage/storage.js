//storage functions
function stringToTitle(strTitle) {
	var title = new Object();
	title["$"] = new Object();
	title["$"]["type"] = "text";
	title["_"] = strTitle;
	return title;
}

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
	collection.title = stringToTitle("Collection of special cats");
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
	collection.title = stringToTitle("Collection of incredible dogs");
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
	imageDesc.title = stringToTitle("wiki_cat.jpg");//what the autor calls it
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
	imageDetails.title = stringToTitle("My superb cat");
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
	resultImage.title = stringToTitle("My superb cat");
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

//returns the "updated" element (the last modified time of all tags associated with a collection)
exports.getAllCollectionTagsUpdated = function(collectionId) {
	return new Date().toISOString();
}

//the collection metadata
exports.getAllCollectionTags = function(collectionId) {
	//filter comments by collectionId id
	//if collection does not exist - return null
	var tag = new Object();
	tag.id = 3;
	tag.updated = new Date().toISOString();//last update of a collection
	tag["app:edited"] = new Date().toISOString();
	tag.title = stringToTitle("this is my tag");
	var tag2 = new Object();
	
	tag2.id = 4;
	tag2.updated = new Date().toISOString();//last update of a collection
	tag2["app:edited"] = new Date().toISOString();
	tag2.title = stringToTitle("this is my second tag");
		
	var tags = [];
	tags[0] = tag;
	tags[1] = tag2;
	return tags;
}

exports.saveCollectionTag = function(tag, collectionId) {
	//input
	// var tag = new Object();
	// tag.title = "lolcats";
	
	//output - the same as a single tag in getAllCollectionTags
	var resultTag = new Object();
	resultTag.id = 3;
	resultTag.updated = new Date().toISOString();//last update of a collection
	resultTag["app:edited"] = new Date().toISOString();
	resultTag.title = tag.title;
	
	return resultTag;
}

exports.getCollectionTag = function(collectionId, tagId) {
	//output - the same as a single tag in getAllCollectionTags
	//if collectionId or tagId does not exist - return null
	var tag = new Object();
	tag.id = tagId;
	tag.updated = new Date().toISOString();//last update of a collection
	tag["app:edited"] = new Date().toISOString();
	tag.title = stringToTitle("this is my tag " + tagId);
	return tag;
}

exports.deleteCollectionTag = function(collectionId, tagId) {
	//on success - return true
	//on failure - return false
	return false;
}