//NOTE - some properties of the input objects are optional and may be undefined
//in each of the records - the summary is optional

//GET http://localhost:3000/collection
//returns the "updated" element (the last modified time of all collections)
function getAllCollectionsUpdated() {
  return new Date();
}

//in each function is described the input and the output objects
function getAllCollections() {
	//output
	var collection = new Object();
	collection.id = 1;
	collection.updated = new Date();//last update of a collection
	collection["app:edited"] = new Date();
	collection.author = new Object();
	collection.author.name = "John"; 
	collection.title = "Collection of special cats";
	//optional
	collection.summary = "my collection of cats";
	
	var allCollections = [];
	allCollections[0] = collection;
	return allCollections;
}

function saveCollection(collection) {
	//input - partial collection object
	var collection = new Object();
	collection.author = new Object();
	collection.author.name = "John"; 
	collection.title = "Collection of special cats";
	//optional
	collection.summary = "my collection of cats";
	
	//output
	var resultCollection = new Object();
	//filled in by storage
	resultCollection.id = 1;
	resultCollection.updated = new Date();//last update of a collection
	resultCollection["app:edited"] = new Date();
	
	//the same as input
	resultCollection.author = collection.author;
	resultCollection.title = collection.title;
	//optional
	resultCollection.summary = collection.summary;
	return resultCollection;
}

function getCollection(collectionId) {
	//input: the id of the collection, ie 1
	
	//output - collection object
	var collection = new Object();
	collection.id = 1;
	collection.updated = new Date();//last update of a collection
	collection["app:edited"] = new Date();
	collection.author = new Object();
	collection.author.name = "John"; 
	collection.title = "Collection of special cats";
	//optional
	collection.summary = "my collection of cats";
	
	return collection;	
}

function getCollectionImagesDescription(collectionId) {
	//output - descriptio of the image without the binary data
	var imageDesc = new Object();
	imageDesc.id = 2;
	imageDesc.updated = new Date();//last update of a collection
	imageDesc["app:edited"] = new Date();
	imageDesc.title = "wiki_cat.jpg";//what the autor calls it
	imageDesc.content = "img12_1.jpg";//the actual image name, used to access it's location
	
	var imageDescriptions = [];
	imageDescriptions[0] = imageDesc;
	return imageDescriptions;	
}

function createImage(collectionId, image) {
	//input
	//image - all the necessary details for uploading image
	var image = new Object();
	image.title = "My superb cat";
	//optional
	image.summary = "This is my superb cat";
	image.fileName = "imgOfaCat.jpg";
	image.mimeType = "image/jpeg";
	image.path = req.files.image.path;//the full path to read the image
	
	//output
	var resultImage = new Object();
	resultImage.id = 14;
	resultImage.updated = new Date();//last update of a image
	resultImage["app:edited"] = new Date();
	//the rest are like the input image
	resultImage.title = "My superb cat";
	//optional
	resultImage.summary = "This is my superb cat";
	resultImage.fileName = "imgOfaCat.jpg";
	resultImage.mimeType = "image/jpeg";
	resultImage.path = req.files.image.path;//the full path to read the image
	return resultImage;
}

function getImage(collectionId, imageId) {
	//output - the same as in createImage
	var resultImage = new Object();
	resultImage.id = imageId;
	resultImage.updated = new Date();//last update of a image
	resultImage["app:edited"] = new Date();
	//the rest are like the input image
	resultImage.title = "My superb cat";
	//optional
	resultImage.summary = "This is my superb cat";
	resultImage.fileName = "imgOfaCat.jpg";
	resultImage.mimeType = "image/jpeg";
	resultImage.path = req.files.image.path;//the full path to read the image
	return resultImage;
}

//returns the "updated" element (the last modified time of all comments associated with a collection)
function getAllCollectionCommentsUpdated(collectionId) {
	return new Date();
}

function getAllCollectionComments(collectionId) {
	//filter comments by collection id
	var comment = new Object();
	comment.id = 1;
	comment.updated = new Date();//last update of a collection
	comment["app:edited"] = new Date();
	comment.author = new Object();
	comment.author.name = "John";
	comment.title = "this is my comment";
	
	var comments = [];
	comments[0] = comment;
	return comments;
}

function createCollectionComment(collectionId, comment) {
	//input
	var comment = new Object();
	comment.author = new Object();
	comment.author.name = "John";
	comment.title = "this is my comment";
	
	
	//output - exactly like in getAllCollectionComments
	var resultComment = new Object();
	resultComment.id = 1;
	resultComment.updated = new Date();//last update of a collection
	resultComment["app:edited"] = new Date();
	resultComment.author = comment.author;
	resultComment.title = comment.title;
	return resultComment;
}

function getCollectionComment(collectionId, commentId) {
	//output - the same as a single comment in the getAllCollectionComments
	var comment = new Object();
	comment.id = commentId;
	comment.updated = new Date();//last update of a collection
	comment["app:edited"] = new Date();
	comment.author = new Object();
	comment.author.name = "Jeorge";
	comment.title = "this is my comment";
	return comment;
}

//returns the "updated" element (the last modified time of all tags associated with a collection)
function getAllCollectionTagsUpdated(collectionId) {
	return new Date();
}

//the collection metadata
function getAllCollectionTags(tagId) {
	//filter comments by tag id
	var tag = new Object();
	tag.id = 3;
	tag.updated = new Date();//last update of a collection
	tag["app:edited"] = new Date();
	tag.title = "this is my tag";
	
	var tags = [];
	tags[0] = tag;
	return tags;
}

function createCollectionTag(collectionId, tag) {
	//input
	var tag = new Object();
	tag.title = "lolcats";
	
	//output - the same as a single tag in getAllCollectionTags
	var resultTag = new Object();
	resultTag.id = 3;
	resultTag.updated = new Date();//last update of a collection
	resultTag["app:edited"] = new Date();
	resultTag.title = tag.title;
	
	return resultTag;
}

function getCollectionTag(collectionId, tagId) {
	//output - the same as a single tag in getAllCollectionTags
	var tag = new Object();
	tag.id = tagId;
	tag.updated = new Date();//last update of a collection
	tag["app:edited"] = new Date();
	tag.title = "this is my tag";
	return tag;
}

//the format of functions for image tags is the same as for collections

//returns the "updated" element (the last modified time of all tags associated with a collection)
function getAllImageTagsUpdated(collectionId, imageId) {
	return new Date();
}

//the collection metadata
function getAllImageTags(collectionId, imageId) {
	//filter comments by tag id
	var tag = new Object();
	tag.id = 3;
	tag.updated = new Date();//last update of a collection
	tag["app:edited"] = new Date();
	tag.title = "this is my tag";
	
	var tags = [];
	tags[0] = tag;
	return tags;
}

function createImageTag(collectionId, imageId, tag) {
	//input
	var tag = new Object();
	tag.title = "lolcats";
	
	//output - the same as a single tag in getAllCollectionTags
	var resultTag = new Object();
	resultTag.id = 3;
	resultTag.updated = new Date();//last update of a collection
	resultTag["app:edited"] = new Date();
	resultTag.title = tag.title;
	
	return resultTag;
}

function getImageTag(collectionId, imageId, tagId) {
	//output - the same as a single tag in getAllCollectionTags
	var tag = new Object();
	tag.id = tagId;
	tag.updated = new Date();//last update of a collection
	tag["app:edited"] = new Date();
	tag.title = "this is my tag";
	return tag;
}
