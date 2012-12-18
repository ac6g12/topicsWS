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

function deleteCollection(collectionId) {
	//collectionId must exist
	//delete all associated images, tags, image tags, comments, and image comments
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

function saveImage(collectionId, imageDetails, image) {
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
	resultImage.updated = new Date();//last update of a image
	resultImage["app:edited"] = new Date();
	//the rest are like the input image
	resultImage.title = "My superb cat";
	//optional
	resultImage.summary = "This is my superb cat";
	resultImage.mimeType = "image/jpeg";
	resultImage.path = "/public/images/img12_1.jpg" ;//the full where the image is store
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
	resultImage.path = "/public/images/img12_1.jpg";//the full where the image is store
	return resultImage;
}

function deleteImage(collectionId, imageId) {
	//collectionId, imageId must exist
	//delete all associated image tags and image comments
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

function saveCollectionComment(collectionId, comment) {
	//input
	//collectionId may be specified in the input comment(in updated object)
	//node comment.id will be defined for already saved comment
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

function deleteCollectionComment(collectionId, commentId) {

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

function saveCollectionTag(tag, collectionId) {
	//input
	//note if the tag already exists it will have id
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

function deleteCollectionTag(collectionId, tagId) {

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

function saveImageTag(tag, collectionId, imageId) {
	//input
	//note - if tag exists it will have id(when we call saveImageTag for updating the tag)
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

function deleteImageTag(collectionId, imageId, tagId) {
	//collectionId, imageId, tagId must exists
}