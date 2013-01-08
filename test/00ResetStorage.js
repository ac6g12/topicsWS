/*
*	@author		Ales Cirnfus
*	@date		07/01/2013
*	
*	Run this script ONLY IF you want to remove all stored data and images.
*	This is useful when you want to start a new test session from scratch.
*
*	Expected response:	Output will confirm that all storage location have
*						cleared and the system completely reset
*/

var STORE_ROOT = "../private/collections";
var IMAGE_ROOT = "../public/images";
var fs = require('fs');
var async = require('async');
var wrench = require('wrench');

function deleteImageFile(file, callback) {
	if (file.indexOf("img") == 0) {
		fs.unlink(IMAGE_ROOT + "/" + file, function(err) {
			callback(err);
		});
		return;
	}
	callback(null);
}

fs.readdir(IMAGE_ROOT , function (err, imgFiles) {
	if(err) {
		console.log("ERROR: Binary image files could not be found");
		return;
	}
	async.forEach(imgFiles, deleteImageFile , function(err) {
		if(err) {
			console.log("ERROR: Binary image files could not be removed");
		} else { 
			console.log("OK: Binary image files removed");
		}
	});
});

try {
	if(fs.existsSync(STORE_ROOT)) {
		wrench.rmdirSyncRecursive(STORE_ROOT, false);
		console.log("OK: Storage file system removed");
	}
	fs.mkdir(STORE_ROOT, function(err) {
		if(err) {
			console.log("ERROR: The 'collections' folder could not be created");
		} else {
			console.log("OK: Storage root folder created");
			fs.writeFile(STORE_ROOT + "/idCounter.txt", 0, function (err) {
				if(err) {
					console.log("ERROR: The 'idCounter.txt' file could not be created");
				} else {
					console.log("OK: idCounter.txt created");
				}
			});
			fs.writeFile(STORE_ROOT + "/update.txt", new Date().toISOString(), function (err) {
				if(err) {
					console.log("ERROR: The 'update.txt' file could not be created");
				} else {
					console.log("OK: update.txt created");
				}
			});
		}
	});
} catch (err) {
	console.log("ERROR: Data storage could not be removed");
}
