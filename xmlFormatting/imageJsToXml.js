var restState = require("./restState")
	,formattingObjects = require("./formattingObjects");

exports.getFormattedImageDescriptions = function(hostUrl, collection, imageDescriptions) {
	var result = [];
	
	for (var i = 0; i < imageDescriptions.length; i++) {
		result[i] = new exports.getFormattedImageDescription(hostUrl, collection, imageDescriptions[i]);
	}
	
	return result;
}

//POST http://localhost:3000/collection/{col_ID}
exports.getAddNewImageResponse = function(hostUrl, collection, imageDescription) {
	var imageResponse = exports.getFormattedImageDescription(hostUrl, collection, imageDescription);
	imageResponse["$"] = formattingObjects.addAtomAttribute();
	return imageResponse;
}
	
exports.getFormattedImageDescription = function(hostUrl, collection, storedImageDesc) {
	storedImageDesc["id"] =  "http://vac.co.uk/collection/" + collection.id + "/image/" + storedImageDesc.id;
	storedImageDesc["author"] = collection.author;
	storedImageDesc["title"] = formattingObjects.stringToTitle(storedImageDesc["title"]);
	storedImageDesc["content"] = formatImageContent(hostUrl, storedImageDesc);
	storedImageDesc["link"] = createImageDescriptionLinks(collection.id, storedImageDesc.id, hostUrl);
	
	delete storedImageDesc.mimeType;
	delete storedImageDesc.path;
	return storedImageDesc;
}

function formatImageContent(hostUrl, storedImageDesc) {
	return {
				"$" : {
					type : storedImageDesc.mimeType,
					src : hostUrl + storedImageDesc.path
				}				
			}
}

//GET or POST on http://localhost:3000/collection/
function createImageDescriptionLinks(collectionId, imageId, hostUrl) {
	var links = []
		,href = hostUrl + "/collection/" + collectionId;
	
	links[0] = new restState.createLink("edit", "application/atom+xml", href);
	links[1] = new restState.createLink("edit-media", "application/xml", href +  "/image" + imageId);
	links[2] = new restState.createLink("edit", "application/atom+xml", href + "/image" + imageId + "/comment");
	links[3] = new restState.createLink("edit", "application/atom+xml", href + "/metadata");
	// links[4] = new restState.createLink("alternate", "application/xml", href + "?alt=xml");
	// links[5] = new restState.createLink("alternate", "application/json", href + "?alt=json");
	return links;
}