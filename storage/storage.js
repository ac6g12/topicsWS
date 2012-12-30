/*
*	@author		Ales Cirnfus
*	@date		29/12/2012
*	
*	This is a implementation of the storage interface that the server
*	request processers use to respond client requests as defined by the 
*	service API documentation.
*
*	IMAGE FILES
*	-----------
*
*	image binary files to be stored in: /public/images
*
*	- image file naming convention:		img{collectionID}_{imageID}.{extension}  
*		- for example:     		img12_2.jpg  --> belongs to collection id 12, image id 2, content-type: image/jpeg
*
*
*	OTHER DATA storage system
*	-------------------------
*
*	/private/collections
*		|
*		|
*		|---idCounter.txt (contains a sigle number)
*		|
*		|
*		|---update.txt (containts data & time of last udate of any collection)
*		|
*		|---/1 (collection id 1 - folder)
*		|	|
*		|	|
*		|	|---collection.json
*		|	|
*		|	|
*		|	|---update.txt (containts data & time of last udate of this collection inc image updates)
*		|	|
*		|	|
*		|	|---/comments	
*		|	|	|
*		|	|	|
*		|	|	|---idCounter.txt
*		|	|	|
*		|	|	|
*		|	|	|---update.txt (containts data & time of last udate of any of the collection's comments)
*		|	|	|
*		|	|	|
*		|	|	|---1.json (collection comment id 1 - entry)
*		|	|	|
*		|	|	|
*		|	|	|---2.json (collection comment id 2 - entry)
*		|	|	|
*		|	|	V
*		|	|      ... (other comments)
*		|	|
*		|	|	
*		|	|---/metadata	
*		|	|	|
*		|	|	|
*		|	|	|---idCounter.txt
*		|	|	|
*		|	|	|
*		|	|	|---update.txt (containts data & time of last udate of any of the collection's tag)
*		|	|	|
*		|	|	|
*		|	|	|---1.json (collection tag id 1 - entry)
*		|	|	|
*		|	|	|
*		|	|	|---2.json (collection tag id 2 - entry)
*		|	|	|
*		|	|	V
*		|	|      ... (other tags)
*		|	|
*		|	|	
*		|	|---/images	
*		|		|
*		|		|
*		|		|---idCounter.txt
*		|		|
*		|		|
*		|		|---/1 (image id 1 - folder)
*		|		|	|
*		|		|	|
*		|		|	|---image.json
*		|		|	|
*		|		|	|
*		|		|	|---/comments
*		|		|	|	|
*		|		|	|	|
*		|		|	|	|---idCounter.txt
*		|		|	|	|
*		|		|	|	|
*		|		|	|	|---update.txt (containts data & time of last udate of any of the images' comments)
*		|		|	|	|
*		|		|	|	|
*		|		|	|	|---1.json (image comment id 1 - entry)
*		|		|	|	|
*		|		|	|	|
*		|		|	|	|---2.json (image comment id 2 - entry)
*		|		|	|	|
*		|		|	|	V
*		|		|	|      ... (other comments)
*		|		|	|
*		|		|	|---/metadata
*		|		|		|
*		|		|		|
*		|		|		|---idCounter.txt
*		|		|		|
*		|		|		|
*		|		|		|---update.txt (containts data & time of last udate of any of the images' tag)
*		|		|		|
*		|		|		|
*		|		|		|---1.json (image tag id 1 - entry)
*		|		|		|
*		|		|		|
*		|		|		|---2.json (image tag id 2 - entry)
*		|		|		|
*		|		|		V
*		|		|	       ... (other tags)
*		|		|	
*		|		|
*		|		|---/2 (image id 2 - folder)
*		|		|	|
*		|		V	|
*  ... (other imgs)	|---image.json
*		|			|
*		|			|
*		|			|---/comments
*		|			|	|
*		|			|	|
*		|			|	|---idCounter.txt
*		|			|	|
*		|			|	|
*		|			|	|---update.txt (containts data & time of last udate of any of the images' comments)
*		|			|	|
*		|			|	|
*		|			|	|---1.json (image comment id 1 - entry)
*		|			|	|
*		|			|	|
*		|			|	|---2.json (image comment id 2 - entry)
*		|			|	|
*		|			|	V
*		|			|      ... (other comments)
*		|			|
*		|			|
*		|			|---/metadata
*		|				|
*		|				|
*		|				|---idCounter.txt
*		|				|
*		|				|
*		|				|---update.txt (containts data & time of last udate of any of the images' tag)
*		|				|
*		|				|
*		|				|---1.json (image tag id 1 - entry)
*		|				|
*		|				|
*		|				|---2.json (image tag id 2 - entry)
*		|				|
*		|				V
*		|			       ... (other tags)
*		|
*		|
*		|---/2 (collection id 2 - folder)
*		|	|
*		|	|
*		|	v
*		|	... collection content
*		|			
*		V
*	(other collections)
*	
*	
*/

//storage functions
var STORE_ROOT = "./private/collections/";
var IMAGE_ROOT = "./public/images/img";
var fs = require('fs');
var async = require('async');
var wrench = require('wrench');

// return callback(err, String ISOdate)
exports.getAllCollectionsUpdated = function(callback) {
	fs.readFile(STORE_ROOT + "update.txt", 'utf8', callback);
}

exports.saveCollection = function(collection, callback) {
	// add/update dates
	collection.updated = new Date().toISOString();//last update of a collection
	collection["app:edited"] = collection.updated;

	// is it an update
	if(collection.id != undefined) {
		fs.writeFile(STORE_ROOT + collection.id + "/collection.json", JSON.stringify(collection), function(err) {
			if(err) { 
				callback(err, null);
			} else {
				fs.writeFile(STORE_ROOT + "update.txt", collection.updated);
				fs.writeFile(STORE_ROOT + collection.id + "/update.txt", collection.updated);
				callback(null, collection);
			}
		});
		return;
	}
	// it is a new collection if we are here
	getNewId(STORE_ROOT, function(err, colId) {
		if(err) {
			callback(err, null);
			return;
		}
		collection.id = colId;
		// set up all folders and files
		async.forEachSeries([STORE_ROOT + colId, 
							STORE_ROOT + colId + "/comments", 
							STORE_ROOT + colId + "/metadata",
							STORE_ROOT + colId + "/images"], mkDir, function(err) {
			if(err) {
				fs.rmdir(STORE_ROOT + colId); // try to remove collection dir 
				callback(err, null);
				return;
			}
			// save new collection 
			fs.writeFile(STORE_ROOT + colId + "/collection.json", JSON.stringify(collection), function(err) {
				if(err) {
					fs.rmdir(STORE_ROOT + colId);	// try to remove collection dir 
					callback(err, null);
					return;
				}
				fs.writeFile(STORE_ROOT + "update.txt", collection.updated);
				fs.writeFile(STORE_ROOT + colId + "/update.txt", collection.updated);
				callback(null, collection);
			});
        });
	});
}

exports.getAllCollections = function(callback) {
	fs.readdir(STORE_ROOT, function (err, files) {
		var collections = [];
		for(i=0; i<files.length; i++) {
			if(files[i].indexOf(".txt") == -1) {
				collections.push(STORE_ROOT + files[i] + "/collection.json");
			}
		}
		async.map(collections, readJsonFile, callback);
	});
}

exports.getCollection = function(colId, callback) {
	fs.readFile(STORE_ROOT + colId + "/update.txt", 'utf-8', function(err1, date) {
		readJsonFile(STORE_ROOT + colId + "/collection.json", function(err2, collection) {
			if(err2) {
				callback(err2, null);
			} else {
				if(err1 == null) {
					collection.updated = date;
					collection["app:edited"] = date;
				}
				callback(null, collection);
			}
		});
	});
}

exports.deleteCollection = function(colId, callback) {
	//collectionId must exist
	//delete all associated images, tags, image tags, comments, and image comments
	//for successful deletion - return true
	//for unsuccessful - return false
	getAllImages(colId, function(err, storedImages) {
		if(err) {
			callback(false);
			return;
		}
		try {
			// remove collection dir -> can throw exception
			wrench.rmdirSyncRecursive(STORE_ROOT+ colId, false);
			// try to remove binary img files
			async.forEach(storedImages, function(img, cb) {
				fs.unlink("." + img.path, cb);
			}, function(err) {});
			callback(true);
		} catch(err) {
			callback(false);
		}
	});
}

exports.getCollectionImagesDescription = function(colId, callback) {
	getAllImages(colId, callback);
}

exports.getCollectionImageDescription = function(collectionId, imageId, callback) {
	readJsonFile(STORE_ROOT + collectionId + "/images/" + imageId + "/image.json", callback);
}

exports.saveImage = function(colId, imageDetails, image, callback) {

	imageDetails.updated = new Date().toISOString(); 
	imageDetails["app:edited"] = imageDetails.updated;
	// is it just update
	if(imageDetails.id != undefined) {
		saveImageFile(colId, imageDetails.id, image, function(err, path) {
			if(err) {
				callback(err, null);
				return;
			}
			// path null if there is no image
			if(path != null) {
				imageDetails.mimeType = image.type;
				imageDetails.path = path.substr(1);		// leave out the leading dot
			}
			// write image details
			fs.writeFile(STORE_ROOT + colId + "/images/" + imageDetails.id + "/image.json", JSON.stringify(imageDetails), function(err) {
				if(err) {
					callback(err, null);
					return;
				}
				fs.writeFile(STORE_ROOT + colId + "/update.txt", imageDetails.updated);
				callback(null, imageDetails);
			});
		});
		return;
	}

	// create new image record
	// it is a new collection if we are here
	getNewId(STORE_ROOT + colId + "/images/", function(err, imgId) {
		if(err) {
			callback(err, null);
			return;
		}
		imageDetails.id = imgId;
		// save image binary
		saveImageFile(colId, imgId, image, function(err, path) {
			if(err) {
				callback(err, null);
				return;
			}
			imageDetails.mimeType = image.type;
			imageDetails.path = path.substr(1);		// leave out the leading dot
			// create imgage folders
			async.forEachSeries([STORE_ROOT + colId + "/images/" + imgId, 
							STORE_ROOT + colId + "/images/" + imgId + "/comments", 
							STORE_ROOT + colId + "/images/" + imgId + "/metadata"], mkDir, function(err) {
				if(err) {
					fs.rmdir(STORE_ROOT + colId + "/images/" + imgId); // try to remove collection dir 
					fs.unlink(path);	// and the image
					callback(err, null);
					return;
				}
				// write image details
				fs.writeFile(STORE_ROOT + colId + "/images/" + imgId + "/image.json", JSON.stringify(imageDetails), function(err) {
					if(err) {
						fs.rmdir(STORE_ROOT + colId + "/images/" + imgId); // try to remove collection dir 
						fs.unlink(path);	// and the image
						callback(err, null);
						return;
					}
					fs.writeFile(STORE_ROOT + colId + "/update.txt", imageDetails.updated);
					callback(null, imageDetails);
				});
			});
		});
	});
}


exports.deleteImage = function(colId, imgId, callback) {
	//collectionId, imageId must exist
	//delete all associated image tags and image comments
	//for successful deletion - return true
	//for unsuccessful - return false
	exports.getCollectionImageDescription(colId, imgId, function(err, imgDetails) {
		if(err) {
			callback(false);
			return;
		}
		try {
			// remove collection dir -> can throw exception
			wrench.rmdirSyncRecursive(STORE_ROOT+ colId + "/images/" + imgId, false);
			// try to remove assoc binary img file
			fs.unlink("." + imgDetails.path);
			fs.writeFile(STORE_ROOT + colId + "/update.txt", new Date().toISOString());
			callback(true);
		} catch(err) {
			callback(false);
		}
	});
}

//returns the "updated" element (the last modified time of all tags associated with a collection)
exports.getAllCollectionTagsUpdated = function(colId, callback) {
	fs.readFile(STORE_ROOT + colId + "/metadata/update.txt", 'utf8', callback);
}

//returns the "updated" element (the last modified time of all tags associated with a collection)
exports.getAllImageTagsUpdated = function(colId, imgId, callback) {
	fs.readFile(STORE_ROOT + colId + "/images/" + imgId + "/metadata/update.txt", 'utf8', callback);
}

//the collection metadata
exports.getAllTags = function(colId, imgId, callback) {
	var path = STORE_ROOT + colId;
	if(imgId == undefined  || imgId == null) {
		// no imgId -> we're after all collection tags
		path += "/metadata";
	} else {
		// this is a request for all image tags
		path += "/images/" + imgId + "/metadata";
	}

	fs.readdir(path , function (err, files) {
		var tags = [];
		for(i=0; i<files.length; i++) {
			if(files[i].indexOf(".json") != -1) {
				tags.push(path + "/" + files[i]);
			}
		}
		async.map(tags, readJsonFile, callback);
	});
}

exports.getTag = function(tagId, colId, imgId, callback) {
	var path = STORE_ROOT + colId;
	if(imgId == undefined  || imgId == null) {
		// no imgId -> it's a collection tag
		path += "/metadata/";
	} else {
		// this is an image tag
		path += "/images/" + imgId + "/metadata/";
	}
	path += tagId + ".json";

	readJsonFile(path, callback);
}

exports.saveTag = function(tag, colId, imgId, callback) {
	var path = STORE_ROOT + colId;
	if(imgId == undefined  || imgId == null) {
		// no imgId -> it's a collection tag
		path += "/metadata/";
	} else {
		// this is an image tag
		path += "/images/" + imgId + "/metadata/";
	}

	// update dates
	tag.updated = new Date().toISOString(); 
	tag["app:edited"] = tag.updated;

	// is it an update?
	if(tag.id != undefined) {
		// just save it
		fs.writeFile(path + tag.id + ".json", JSON.stringify(tag), function(err) {
			if(err) {
				callback(err, null);
				return;
			}
			// try to update last update date
			fs.writeFile(path + "update.txt", tag.updated);
			callback(null, tag);
		});
		return;
	}

	// create new tag
	getNewId(path, function(err, tagId) {
		if(err) {
			callback(err, null);
			return;
		}
		tag.id = tagId;
		// save new tag
		fs.writeFile(path + tagId + ".json", JSON.stringify(tag), function(err) {
			if(err) {
				callback(err, null);
				return;
			}
			fs.writeFile(path + "update.txt", tag.updated);
			callback(null, tag);
		});
	});
}

exports.deleteTag = function(tagId, colId, imgId, callback) {
	//on success - return true
	//on failure - return false
	var path = STORE_ROOT + colId;
	if(imgId == undefined  || imgId == null) {
		// no imgId -> it's a collection tag
		path += "/metadata/";
	} else {
		// this is an image tag
		path += "/images/" + imgId + "/metadata/";
	}
	path += tagId + ".json";

	fs.unlink(path, function(err) {
		callback(err == null);
	});
}

exports.deleteAllTags = function(colId, imgId, callback) {
	//on success - return true
	//on failure - return false
	var path = STORE_ROOT + colId;
	if(imgId == undefined  || imgId == null) {
		// no imgId -> it's a collection tag
		path += "/metadata";
	} else {
		// this is an image tag
		path += "/images/" + imgId + "/metadata";
	}

	try {
		// remove metadata dir -> can throw exception
		wrench.rmdirSyncRecursive(path, false);
		// ... and recreate it empty
		mkDir(path, function(err) {});
		callback(true);
	} catch(err) {
		console.log(err);
		callback(false);
	}
}

// ######### COMMENTS #########

//returns the "updated" element (the last modified time of all tags associated with a collection)
exports.getAllCollectionCommentsUpdated = function(colId, callback) {
	fs.readFile(STORE_ROOT + colId + "/comments/update.txt", 'utf8', callback);
}

//returns the "updated" element (the last modified time of all tags associated with a collection)
exports.getAllImageCommentsUpdated = function(colId, imgId, callback) {
	fs.readFile(STORE_ROOT + colId + "/images/" + imgID + "/comments/update.txt", 'utf8', callback);
}

//the collection metadata
exports.getAllComments = function(colId, imgId, callback) {
	var path = STORE_ROOT + colId;
	if(imgId == undefined || imgId == null) {
		// no imgId -> we're after all collection comments
		path += "/comments";
	} else {
		// this is a request for all image comments
		path += "/images/" + imgId + "/comments";
	}

	fs.readdir(path , function (err, files) {
		var tags = [];
		for(i=0; i<files.length; i++) {
			if(files[i].indexOf(".json") != -1) {
				tags.push(path + "/" + files[i]);
			}
		}
		async.map(tags, readJsonFile, callback);
	});
}

exports.getComment = function(comId, colId, imgId, callback) {
	var path = STORE_ROOT + colId;
	if(imgId == undefined || imgId == null) {
		// no imgId -> it's a collection comment
		path += "/comments/";
	} else {
		// this is an image tag
		path += "/images/" + imgId + "/comments/";
	}
	path += comId + ".json";

	readJsonFile(path, callback);
}

exports.saveComment = function(comment, colId, imgId, callback) {
	var path = STORE_ROOT + colId;
	if(imgId == undefined || imgId == null) {
		// no imgId -> it's a collection comment
		path += "/comments/";
	} else {
		// this is an image comment
		path += "/images/" + imgId + "/comments/";
	}

	// update dates
	comment.updated = new Date().toISOString(); 
	comment["app:edited"] = comment.updated;

	// is it an update?
	if(comment.id != undefined) {
		// just save it
		fs.writeFile(path + comment.id + ".json", JSON.stringify(comment), function(err) {
			if(err) {
				callback(err, null);
				return;
			}
			// try to update last update date
			fs.writeFile(path + "update.txt", comment.updated);
			callback(null, comment);
		});
		return;
	}

	// create new comment
	getNewId(path, function(err, comId) {
		if(err) {
			callback(err, null);
			return;
		}
		comment.id = comId;
		// save new comment
		fs.writeFile(path + comId + ".json", JSON.stringify(comment), function(err) {
			if(err) {
				callback(err, null);
				return;
			}
			fs.writeFile(path + "update.txt", comment.updated);
			callback(null, comment);
		});
	});
}

exports.deleteComment = function(comId, colId, imgId, callback) {
	//on success - return true
	//on failure - return false
	var path = STORE_ROOT + colId;
	if(imgId == undefined || imgId == null) {
		// no imgId -> it's a collection comment
		path += "/comments/";
	} else {
		// this is an image comment
		path += "/images/" + imgId + "/comments/";
	}
	path += comId + ".json";

	fs.unlink(path,function(err) {
		callback(err == null);
	});
}

exports.deleteAllComments = function(colId, imgId, callback) {
	//on success - return true
	//on failure - return false
	var path = STORE_ROOT + colId;
	if(imgId == undefined || imgId == null) {
		// no imgId -> it's a collection comment
		path += "/comments";
	} else {
		// this is an image comment
		path += "/images/" + imgId + "/comments";
	}

	try {
		// remove comments dir -> can throw exception
		wrench.rmdirSyncRecursive(path, false);
		// ... and recreate it empty
		mkDir(path, function(err) {});
		callback(true);
	} catch(err) {
		callback(false);
	}
}

// #################################### PRIVATE HELPER FUNCTIONS #################################

function getNewId(path, callback) {
	fs.readFile(path + "idCounter.txt", function(err, data) {
		if(err) {
			callback(err, null);
			return;
		}
		var newId = parseInt(data) + 1;
		fs.writeFile(path + "/idCounter.txt", newId, function (err) {
            if(err) {
				callback(err, null);
			} else {
				callback(null, newId);
			}
		});
	});
}

function mkDir(path, callback) {
	fs.mkdir(path, function(err) {
		if(err) {
			callback(err);
		} else {
			fs.writeFile(path + "/idCounter.txt", 0, function (err) {
				if(err) {
					callback(err);
				} else {
					fs.writeFile(path + "/update.txt", new Date().toISOString(), function (err) {
						callback(err);
					});
				}
			});
		}
	});
}

function readJsonFile(path, callback) {
	fs.readFile(path, 'utf8', function(err,data) {
		if(err) {
			callback(err, null);
		} else {
			callback(null, JSON.parse(data));
		}
	});
}

function saveImageFile(colId, imgId, image, callback) {
	if(image == null || image == undefined) {
		callback(null, null);
		return;
	}
	var ext = image.name.split('.').pop();
	fs.readFile(image.path, function (err, data) {
		if(err) { 
			callback(err, null);
		} else {
			var path = IMAGE_ROOT + colId + "_" + imgId + "." + ext;
			fs.writeFile(path, data, function(err) {
				callback(err, path);
			});
        }
    });
}

function getAllImages(colId, callback) {
	fs.readdir(STORE_ROOT + colId + "/images" , function (err, files) {
		if(err) {
			callback(err,[])
			return;
		}
		var imageFiles = [];
		for(i=0; i<files.length; i++) {
			if(files[i].indexOf(".txt") == -1) {
				imageFiles.push(STORE_ROOT+ colId + "/images/" + files[i] + "/image.json");
			}
		}
		async.map(imageFiles, readJsonFile, callback);
	});
}