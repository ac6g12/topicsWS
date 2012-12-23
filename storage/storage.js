var fs = require('fs');
var Dom = require('xmldom').DOMParser;
var XMLSerializer = require('xmldom').XMLSerializer;
var collections_xml = "../storage/collections.xml";
//var images_folder = '/public/images/'


  
exports.getAllCollectionsUpdated = function() {
    return new Date().toISOString();
}

function stringToTitle(strTitle) {
    var title = new Object();
    title["$"] = new Object();
    title["$"]["type"] = "text";
    title["_"] = strTitle;
    return title;
}

exports.getAllCollections = function() {
    var allCollections = [];
    var collectionList = new Array();
    
    fs.readFile(collections_xml, 'ascii', function(err,data){
        if(err) {
            console.log("Could not open file"+ err);
            process.exit(1);
        }
        
        //first we check if there are collections available
        var d = new Dom().parseFromString(data);
        var collections = d.getElementsByTagName("collection");
        if(collections.length == 0) { //no collection exists
            console.log("404, no collection exists");
            return null;
        } else { 
            //next we loop through the collection array and get the names
            for (count = 0; count < d.getElementsByTagName('collection').length; count++) {
                try{
                    collectionList.push(d.getElementsByTagName('collection').item(count));
                
                } catch(err) {
                
                }
            }
            //next we loop through the collectionList array and print the ids and names of the collections
            for(var x=0; x < collectionList.length; x++) {
                console.log(collectionList[x].attributes.getNamedItem("id").value + '. ' + collectionList[x].getElementsByTagName('colSummary')[0].childNodes[0].nodeValue);
                
                var collection = new Object();
                collection.id = collectionList[x].attributes.getNamedItem("id").value;
                collection.updated = collectionList[x].getElementsByTagName('colDateUpdated')[0].childNodes[0].nodeValue
                collection["app:edited"] = new Date().toISOString();
                collection.author = new Object();
                collection.author.name = "John";
                collection.title = stringToTitle(collectionList[x].getElementsByTagName('colSummary')[0].childNodes[0].nodeValue);
                
                allCollections[x] = collection;
                
            }
            console.log(allCollections[1].id)
            return allCollections;
        }
        
    });
    
}

exports.saveCollection = function(summary) {   //parameter is summary or title of collection
    
    //input - partial collection object
    var collection = new Object();
    collection.author = new Object();
    collection.author.name = "John"; 
    collection.title = stringToTitle(summary);
    console.log(collection.title);
    //optional
    collection.summary = summary;


    //output
    var resultCollection = new Object();
    //filled in by storage
	
    resultCollection.updated = new Date().toISOString();//last update of a collection
    resultCollection["app:edited"] = new Date().toISOString();

    //the same as input
    resultCollection.author = collection.author;
    resultCollection.title = collection.title;
    //optional
    resultCollection.summary = collection.summary;
	
    
    fs.readFile(collections_xml, 'ascii', function(err,data){
        if(err) {
            console.log("Could not open file"+ err);
            process.exit(1);
        }
        //first obtain the collectionCount
        var d = new Dom().parseFromString(data);
        var collectionCount = d.getElementsByTagName('collectionCount')[0].childNodes[0].nodeValue;
        //next we create a replacement for the collectionCount
        newcollectionCountEntry = d.createElement("collectionCount");
        //increment the collectionCount by 1 and use this value for the id of the new collection
        newCount = parseInt(collectionCount) + 1;
        resultCollection.id = newCount;
        //replace existing collectionCount in the xml doc
        newcollectionCountValue = d.createTextNode(newCount);
        newcollectionCountEntry.appendChild(newcollectionCountValue);
        d.replaceChild(newcollectionCountEntry, d.getElementsByTagName('collectionCount')[0]);
        //next we create the new collection and insert it after the last collection
        newCollection = d.createElement("collection");
        x = d.documentElement;
        y = d.getElementsByTagName("collection")[collectionCount];
        newCollection.setAttribute('id', newCount);
        x.insertBefore(newCollection,y);
        //next we create a summary entry for the new collecton
        newSummary = d.createElement("colSummary");
        newSummaryValue = d.createTextNode(summary);
        newSummary.appendChild(newSummaryValue);
        newCollection.appendChild(newSummary);
        //next we create a metadata count entry for the new collecton
        newmetaDataCount = d.createElement("colMetaDataCount");
        newmetaDataCountValue = d.createTextNode('0');
        newmetaDataCount.appendChild(newmetaDataCountValue);
        newCollection.appendChild(newmetaDataCount);
        //next we create a comment count entry for the new collecton
        newCommentCount = d.createElement("colCommentCount");
        newCommentCountValue = d.createTextNode('0');
        newCommentCount.appendChild(newCommentCountValue);
        newCollection.appendChild(newCommentCount);
        //next we create a dateUpdated entry for the new collecton
        newDateUpdated = d.createElement("colDateUpdated");
        newDateUpdatedValue = d.createTextNode(new Date().toISOString());
        newDateUpdated.appendChild(newDateUpdatedValue);
        newCollection.appendChild(newDateUpdated);
        //next we update XML doc
        updateXML(new XMLSerializer().serializeToString(d), collections_xml);
        return resultCollection;
    });
    
}

exports.getCollection = function (colID) {
    var collection = new Object();
        
    fs.readFile(collections_xml, 'ascii', function(err,data){
        if(err) {
            console.log("Could not open file"+ err);
            process.exit(1);
        }
        
        //first we check if collection exists
        var d = new Dom().parseFromString(data);
        var collection_;
        for (count = 0; count < d.getElementsByTagName('collection').length; count++) {
            try{
                if (colID == d.getElementsByTagName('collection').item(count).attributes.getNamedItem("id").value) {
                    collection_ = d.getElementsByTagName('collection').item(count);
                    break;
                }
            } catch(err) {
                
            }
        }
        if(collection_ == null) {
            console.log('collection with id of ' + id + ' does not exist');
            return null
        } else {
            collection.id = colID;
            collection.updated = collection_.getElementsByTagName('colDateUpdated')[0].childNodes[0].nodeValue;
            collection["app:edited"] = new Date().toISOString();
            collection.author = new Object();
            collection.author.name = "John"; 
            collection.title = stringToTitle(collection_.getElementsByTagName('colSummary')[0].childNodes[0].nodeValue);
            
            return collection;
        }
        
    });
}

exports.deleteCollection = function(id) {
    
    //collectionId must exist
    //delete all associated images, tags, image tags, comments, and image comments
    //for successful deletion - return true
    //for unsuccessful - return false
    
    fs.readFile(collections_xml, 'ascii', function(err,data){
        if(err) {
            console.log("Could not open file"+ err);
            process.exit(1);
        }
        //first we check if collection exists
        var d = new Dom().parseFromString(data);
        var collection;
        for (count = 0; count < d.getElementsByTagName('collection').length; count++) {
            try{
                if (id == d.getElementsByTagName('collection').item(count).attributes.getNamedItem("id").value) {
                    collection = d.getElementsByTagName('collection').item(count);
                    break;
                }
            } catch(err) {
                
            }
        }
        if(collection == null) {
            console.log('collection with id of ' + id + ' does not exist');
            return false;
        } else {
            //next, delete the collection
            d.documentElement.removeChild(collection);
            updateXML(new XMLSerializer().serializeToString(d), collections_xml);
            console.log('collection ' + id + ' deleted!')
            return true;
        }
    });
    
}

exports.getCollectionImagesDescription = function (colID) {
    
    var collectionImageList = new Array();
    var imageDescriptions = [];
    
    fs.readFile(collections_xml, 'ascii', function(err,data){
        if(err) {
            console.log("Could not open file"+ err);
            process.exit(1);
        }
        //first we check if collection exists
        var d = new Dom().parseFromString(data);
        var collection;
        for (count = 0; count < d.getElementsByTagName('collection').length; count++) {
            try{
                if (colID == d.getElementsByTagName('collection').item(count).attributes.getNamedItem("id").value) {
                    collection = d.getElementsByTagName('collection').item(count);
                    break;
                }
            } catch(err) {
                
            }
        }
        if(collection == null) {
            console.log('collection with id of ' + colID + ' does not exist');
            return null;
        } else {
            //next we check if images exist for collection
            var images = collection.getElementsByTagName("image");
            if(images.length == 0){
                console.log('no images exist for this collection');
                return null;
            } else {
                //next we loop through the images and get their ids, store them in an array
                var imageId;
            
                for(count = 0; count < collection.getElementsByTagName('image').length; count++) {  //use try catch just in case an index for an image doesn't exist
                    try {
                        imageId = collection.getElementsByTagName('image').item(count);
                        collectionImageList.push(imageId);
                    } catch(err) {
                        
                    }       
                }
                //next we print the images in the collection
                for(var x = 0; x < collectionImageList.length; x++) {
                    var imageDesc = new Object();
                    
                    imageDesc.id = collectionImageList[x].attributes.getNamedItem("id").value
                    imageDesc.updated = collectionImageList[x].getElementsByTagName('dateUpdated')[0].childNodes[0].nodeValue
                    imageDesc["app:edited"] = new Date().toISOString();
                    imageDesc.title = stringToTitle(collectionImageList[x].getElementsByTagName('summary')[0].childNodes[0].nodeValue);
                    imageDesc.summary = collectionImageList[x].getElementsByTagName('summary')[0].childNodes[0].nodeValue
                    imageDesc.mimeType = collectionImageList[x].getElementsByTagName('mimeType')[0].childNodes[0].nodeValue
                    imageDesc.path = collectionImageList[x].getElementsByTagName('imagePath')[0].childNodes[0].nodeValue
                    imageDescriptions[x] = imageDesc;
                }
                
                return imageDescriptions;
            }
        }
    });
    
}

exports.getCollectionImageDescription = function (colID,imageID) {
    var imageDesc = new Object();
    
    
    fs.readFile(collections_xml, 'ascii', function(err,data){
        if(err) {
            console.log("Could not open file"+ err);
            process.exit(1);
        }
        //first we check if collection exists
        var d = new Dom().parseFromString(data);
        var collection;
        for (count = 0; count < d.getElementsByTagName('collection').length; count++) {
            try{
                if (colID == d.getElementsByTagName('collection').item(count).attributes.getNamedItem("id").value) {
                    collection = d.getElementsByTagName('collection').item(count);
                    break;
                }
            } catch(err) {
                
            }
        }
        
        if (collection == null) {
            console.log('collection with id of ' + colID + ' does not exist');
            return null;
        }
        else {
            //now we check if the image exists for collection, retrieve the image with the id
            var image;
            var foundIndex
            for(count = 0; count < collection.getElementsByTagName('image').length; count++) {  //use try catch just in case an index for an image doesn't exist
                try {
                    image = collection.getElementsByTagName('image').item(count);//.attributes.getNamedItem("id");
                    if(image.attributes.getNamedItem("id").value == imageID) {
                        foundIndex = 'found'
                        break;   //at this point, the image with the id exists
                    }
                    else {
                        foundIndex = 'image not found'
                    }
                } catch(err) {
                        
                }       
            }
            if(foundIndex != 'image not found' && foundIndex !=  undefined) {
                //print the image
                console.log('the image is ' + imageID);
                imageDesc.id = imageID;
                imageDesc.updated = image.getElementsByTagName('dateUpdated')[0].childNodes[0].nodeValue
                imageDesc["app:edited"] = new Date().toISOString();
                imageDesc.title = stringToTitle(image.getElementsByTagName('summary')[0].childNodes[0].nodeValue);
                imageDesc.summary = image.getElementsByTagName('summary')[0].childNodes[0].nodeValue;
                imageDesc.mimeType = image.getElementsByTagName('mimeType')[0].childNodes[0].nodeValue;
                imageDesc.path = image.getElementsByTagName('imagePath')[0].childNodes[0].nodeValue;
                imageDesc.fileName = image.getElementsByTagName('fileName')[0].childNodes[0].nodeValue;
                
                return imageDesc;
                
            }
            else {
                console.log('image with id of ' + imageID + ' does not exist');
                return null;
            }
                         
        }
    });
    
}

exports.saveImage = function (colID, summary, mimeType) {   //"/public/images/"
    var resultImage = new Object();
    //var http = require('http');
    var imageCount;
    var newImageId;
    var imagePath;
    var imageExtension = mimeType.replace("image/","");
    
    fs.readFile(collections_xml, 'ascii', function(err,data){
        if(err) {
            console.log("Could not open file"+ err);
            process.exit(1);
        }
        //first we check if collection exists
        var d = new Dom().parseFromString(data);
        var collection;
        for (count = 0; count < d.getElementsByTagName('collection').length; count++) {
            try{
                if (colID == d.getElementsByTagName('collection').item(count).attributes.getNamedItem("id").value) {
                    collection = d.getElementsByTagName('collection').item(count);
                    break;
                }
            } catch(err) {
                
            }
        }
        if(collection == null) {
            console.log('collection with id of ' + colID + ' does not exist');
            return null;
        } else {
            //next, we obtain the image count
            imageCount = d.getElementsByTagName('imageCount')[0].childNodes[0].nodeValue;
            //increment this count and use it as id for the next image
            newImageId = parseInt(imageCount) + 1;
            //create a new entry to overwrite the image count
            newImageCount = d.createElement("imageCount");
            newImageCountValue = d.createTextNode(newImageId);
            newImageCount.appendChild(newImageCountValue);
            d.replaceChild(newImageCount, d.getElementsByTagName('imageCount')[0]);
            //add the new image to the collection
            newImage = d.createElement("image");
            newImage.setAttribute('id', newImageId);
            //next we create a dateUpdated entry for the new image
            newDateUpdated = d.createElement("dateUpdated");
            newDateUpdatedValue = d.createTextNode(new Date().toISOString());
            newDateUpdated.appendChild(newDateUpdatedValue);
            newImage.appendChild(newDateUpdated);
            //next we create a summary entry for the new image
            newSummary = d.createElement("summary");
            newSummaryValue = d.createTextNode(summary);
            newSummary.appendChild(newSummaryValue);
            newImage.appendChild(newSummary);
            //next we create a mimeType entry for the new image
            newMimeType = d.createElement("mimeType");
            newMimeTypeValue = d.createTextNode(mimeType);
            newMimeType.appendChild(newMimeTypeValue);
            newImage.appendChild(newMimeType);
            //next we obtain the image path
            imagePath = "/public/images/img" + colID + "_" + newImageId + "." + imageExtension
            //next we create an imagePath entry for the new image
            newImagePath = d.createElement("imagePath");
            newImagePathValue = d.createTextNode(imagePath);
            newImagePath.appendChild(newImagePathValue);
            newImage.appendChild(newImagePath);
            //next we create a fileName entry for the new image
            newFileName = d.createElement("fileName");
            newFileNameValue = d.createTextNode("img" + colID + "_" + newImageId + "." + imageExtension);
            newFileName.appendChild(newFileNameValue);
            newImage.appendChild(newFileName);
            //next we create a metadata count entry for the new image
            newmetaDataCount = d.createElement("metaDataCount");
            newmetaDataCountValue = d.createTextNode('0');
            newmetaDataCount.appendChild(newmetaDataCountValue);
            newImage.appendChild(newmetaDataCount);
            //next we create a comment count entry for the new Image
            newCommentCount = d.createElement("commentCount");
            newCommentCountValue = d.createTextNode('0');
            newCommentCount.appendChild(newCommentCountValue);
            newImage.appendChild(newCommentCount);
            collection.appendChild(newImage);
            
            //update the XML representation
            updateXML(new XMLSerializer().serializeToString(d), collections_xml);
            //now populate the object to be returned
            var imageDetails = new Object();
            imageDetails.title = stringToTitle(summary);
            imageDetails.summary = summary;
            
            
            resultImage.id = newImageId;
            resultImage.updated = new Date().toISOString();//last update of a image
            resultImage["app:edited"] = new Date().toISOString();
            
            resultImage.title = imageDetails.title;
            resultImage.summary = imageDetails.summary;
            resultImage.mimeType = mimeType;
            resultImage.path = imagePath; //the full path where the image is stored
            
            return resultImage;
        } 
    });
/**next, obtain the image from the source address and write to images folder, using the image id as newImageId
    http.get(src, function(res) {
        var x = newImageId + "." + imageExtension;
        res.setEncoding('binary')
        res.pipe(fs.createWriteStream(images_folder + x));
    
        //print the image id
        console.log('Image saved in collection ' + colID + ' with id of ' + newImageId)
        //next we create an entry for the image in the images XML file
        createImageEntry(newImageId);
    }); */
   
}

exports.getImage = function(colID, imageID) {
    
    var resultImage = new Object();
    
    fs.readFile(collections_xml, 'ascii', function(err,data){
        if(err) {
            console.log("Could not open file"+ err);
            process.exit(1);
        }
        //first we check if collection exists
        var d = new Dom().parseFromString(data);
        var collection;
        for (count = 0; count < d.getElementsByTagName('collection').length; count++) {
            try{
                if (colID == d.getElementsByTagName('collection').item(count).attributes.getNamedItem("id").value) {
                    collection = d.getElementsByTagName('collection').item(count);
                    break;
                }
            } catch(err) {
                
            }
        }
        
        if (collection == null) {
            console.log('collection with id of ' + colID + ' does not exist');
            return null;
        }
        else {
            //now we check if the image exists for collection, retrieve the image with the id
            var image;
            var foundIndex
            for(count = 0; count < collection.getElementsByTagName('image').length; count++) {  //use try catch just in case an index for an image doesn't exist
                try {
                    image = collection.getElementsByTagName('image').item(count);//.attributes.getNamedItem("id");
                    if(image.attributes.getNamedItem("id").value == imageID) {
                        foundIndex = 'found'
                        break;   //at this point, the image with the id exists
                    }
                    else {
                        foundIndex = 'image not found'
                    }
                } catch(err) {
                        
                }       
            }
            if(foundIndex != 'image not found' && foundIndex !=  undefined) {
                //print the image
                console.log('the image is ' + imageID);
                resultImage.id = imageID;
                resultImage.updated = image.getElementsByTagName('dateUpdated')[0].childNodes[0].nodeValue
                resultImage["app:edited"] = new Date().toISOString();
                resultImage.title = stringToTitle(image.getElementsByTagName('summary')[0].childNodes[0].nodeValue);
                resultImage.summary = image.getElementsByTagName('summary')[0].childNodes[0].nodeValue;
                resultImage.mimeType = image.getElementsByTagName('mimeType')[0].childNodes[0].nodeValue;
                resultImage.path = image.getElementsByTagName('imagePath')[0].childNodes[0].nodeValue;
                resultImage.fileName = image.getElementsByTagName('fileName')[0].childNodes[0].nodeValue;
                
                return resultImage;
                
            }
            else {
                console.log('image with id of ' + imageID + ' does not exist');
                return null;
            }
                         
        }
    });
    
}

exports.deleteImage = function(colID, imageID) {
    
    fs.readFile(collections_xml, 'ascii', function(err,data){
        if(err) {
            console.log("Could not open file"+ err);
            process.exit(1);
        }
       
        //first we check if collection exists
        var d = new Dom().parseFromString(data);
        var collection;
        for (count = 0; count < d.getElementsByTagName('collection').length; count++) {
            try{
                if (colID == d.getElementsByTagName('collection').item(count).attributes.getNamedItem("id").value) {
                    collection = d.getElementsByTagName('collection').item(count);
                    break;
                }
            } catch(err) {
                
            }
        }
            
        if (collection == null) {
            console.log('collection with id of ' + colID + ' does not exist');
            return false;
        }
        else {
            //now we check if the image exists in collection, retrieve the image with the id
            var image;
            var foundIndex;
            for(count = 0; count < collection.getElementsByTagName('image').length; count++) { //use try catch block just in case an image index doesn't exist
                try {
                    image = collection.getElementsByTagName('image').item(count)//;
                    if(image.attributes.getNamedItem("id").value == imageID) {
                        foundIndex = count;
                        break;  //at this point, the image with the id exists
                    } else {
                        foundIndex = 'image not found'
                    }
                }catch(err) {
                        
                }  
            }
            if(foundIndex != 'image not found' && foundIndex !=  undefined) {
                //delete the image
                d.removeChild(image);
                updateXML(new XMLSerializer().serializeToString(d), collections_xml);
                console.log('image ' + imageID + ' deleted!')
                return true;
            }
            
            else {
                console.log('image with id of ' + imageID + ' does not exist');
                return false;
            }
                         
        }
    });
    
}

exports.getAllCollectionCommentsUpdated = function(collectionId) {
	return new Date().toISOString();
}

exports.getAllCollectionComments = function(id) {
    var collectionCommentList = new Array();
    var comments = [];
    
    fs.readFile(collections_xml, 'ascii', function(err,data){
        if(err) {
            console.log("Could not open file"+ err);
            process.exit(1);
        }
        //first we check if collection exists
        var d = new Dom().parseFromString(data);
        var collection;
        for (count = 0; count < d.getElementsByTagName('collection').length; count++) {
            try{
                if (id == d.getElementsByTagName('collection').item(count).attributes.getNamedItem("id").value) {
                    collection = d.getElementsByTagName('collection').item(count);
                    break;
                }
            } catch(err) {
                
            }
        }
        if(collection == null) {
            console.log('collection with id of ' + id + ' does not exist');
            return null;
        } else {
            //next we check if comments exist for collection
            var comments_ = collection.getElementsByTagName("colComment");
            if(comments_.length == 0){
                console.log('no comments exist for this collection'); 
                return null;
            } else {
                //next we loop through the comments and get their values, store them in an array
                for(var x = 0; x < comments_.length; x++) {
                    var comment = new Object();
                    comment.id = comments_[x].attributes.getNamedItem("id").value;
                    comment.updated = collection.getElementsByTagName('colDateUpdated')[0].childNodes[0].nodeValue;
                    comment["app:edited"] = new Date().toISOString();
                    comment.author = new Object();
                    comment.author.name = "John";
                    comment.title = stringToTitle(comments_[x].childNodes[0].nodeValue);
                    comments[x] = comment;
                    collectionCommentList.push(comments_[x].childNodes[0].nodeValue);
                }
                //next we publish all the comments obtained
                for(var x = 0; x < collectionCommentList.length; x++) {
                    console.log(collectionCommentList[x]);
                    
                }
                
                return comments;
            }
                  
        }
                
            
    });
}

exports.saveCollectionComment = function (colID, comment_) {
    var comment = new Object();
    var resultComment = new Object();
	
    comment.author = new Object();
    comment.author.name = "John";
    comment.title = stringToTitle(comment);

    fs.readFile(collections_xml, 'ascii', function(err,data){
        if(err) {
            console.log("Could not open file"+ err);
            process.exit(1);
        }
        //first we check if collection exists
        var d = new Dom().parseFromString(data);
        var collection;
        for (count = 0; count < d.getElementsByTagName('collection').length; count++) {
            try{
                if (colID == d.getElementsByTagName('collection').item(count).attributes.getNamedItem("id").value) {
                    collection = d.getElementsByTagName('collection').item(count);
                    break;
                }
            } catch(err) {
                
            }
        }
        if(collection == null) {
            console.log('collection with id of ' + colID + ' does not exist');
            return null;
        } else {
            var commentCount = collection.getElementsByTagName('colCommentCount')[0].childNodes[0].nodeValue;
            //next we create a replacement for the commentCount
            newcommentCountEntry = d.createElement("colCommentCount");
            //increment the commentCount by 1 and use this value for the id of the new comment
            newcommentCount = parseInt(commentCount) + 1;
            resultComment.id = newcommentCount;
            resultComment.updated = collection.getElementsByTagName('colDateUpdated')[0].childNodes[0].nodeValue;
            resultComment["app:edited"] = new Date().toISOString();
            resultComment.author = comment.author;
            resultComment.title = comment.title;
            //replace existing commentCount in the xml doc
            newcommentCountValue = d.createTextNode(newcommentCount);
            newcommentCountEntry.appendChild(newcommentCountValue);
            collection.replaceChild(newcommentCountEntry, collection.getElementsByTagName('colCommentCount')[0]);
            //replace existing dateUpdated for the collection in the xml doc
            newDateUpdated = d.createElement("colDateUpdated");
            newDateUpdatedValue = d.createTextNode(new Date().toISOString());
            newDateUpdated.appendChild(newDateUpdatedValue);
            collection.replaceChild(newDateUpdated, collection.getElementsByTagName('colDateUpdated')[0]);
            //next we create the new comment and insert it after the last comment
            newComment = d.createElement("colComment");
            newCommentValue = d.createTextNode(comment_);
            newComment.appendChild(newCommentValue);
            newComment.setAttribute('id', newcommentCount);
            collection.appendChild(newComment);
            updateXML(new XMLSerializer().serializeToString(d), collections_xml);
            console.log('comment with id of ' + newcommentCount + ' added!')
            return resultComment;
        }
    });
}

exports.getCollectionComment = function(id, id2) {    //id is for collection, id2 is for comment
    var comment = new Object();
 
    fs.readFile(collections_xml, 'ascii', function(err,data){
        if(err) {
            console.log("Could not open file"+ err);
            process.exit(1);
        }
        
        //first we check if collection exists
        var d = new Dom().parseFromString(data);
        var collection;
        for (count = 0; count < d.getElementsByTagName('collection').length; count++) {
            try{
                if (id == d.getElementsByTagName('collection').item(count).attributes.getNamedItem("id").value) {
                    collection = d.getElementsByTagName('collection').item(count);
                    break;
                }
            } catch(err) {
                
            }
        }
            
        if (collection == null) {
            console.log('collection with id of ' + id + ' does not exist');
            return null;
        }
        else {
            //now we check if comment exists for collection, retrieve the comment with the id
            var comment_;
            var foundIndex;
            for(count = 0; count < collection.getElementsByTagName('colComment').length; count++) {  //use try catch just in case an index for a comment doesn't exist
                try {
                    comment_ = collection.getElementsByTagName('colComment').item(count);//.attributes.getNamedItem("id");
                    if(comment_.attributes.getNamedItem("id").value == id2) {
                        foundIndex = count;
                        break;
                    } //at this point, the comment with the id exists
                    else {
                        foundIndex = 'comment not found'
                    }
                } catch(err) {
                        
                }       
            }
            if(foundIndex != 'comment not found' && foundIndex !=  undefined) {
                //print the comment
                console.log(comment_.childNodes[0].nodeValue);
                comment.id = comment_.attributes.getNamedItem("id").value
                comment.updated = collection.getElementsByTagName('colDateUpdated')[0].childNodes[0].nodeValue;
                comment["app:edited"] = new Date().toISOString();
                comment.author = new Object();
                comment.author.name = "Jeorge";
                comment.title = stringToTitle(comment_.childNodes[0].nodeValue)
                
                return comment;
            }
            else {
                console.log('comment with id of ' + id2 + ' does not exist');
                return null;
            }
                         
        }
    });
}   

exports.deleteCollectionComment = function (id, id2) {    //id is for collection, id2 is for comment to be deleted
 
    fs.readFile(collections_xml, 'ascii', function(err,data){
        if(err) {
            console.log("Could not open file"+ err);
            process.exit(1);
        }
       
        //first we check if collection exists
        var d = new Dom().parseFromString(data);
        var collection;
        for (count = 0; count < d.getElementsByTagName('collection').length; count++) {
            try{
                if (id == d.getElementsByTagName('collection').item(count).attributes.getNamedItem("id").value) {
                    collection = d.getElementsByTagName('collection').item(count);
                    break;
                }
            } catch(err) {
                
            }
        }
            
        if (collection == null) {
            console.log('collection with id of ' + id + ' does not exist');
            return false
        }
        else {
            //now we check if comment exists for collection, retrieve the comment with the id
            var comment;
            var foundIndex;
            for(count = 0; count < collection.getElementsByTagName('colComment').length; count++) { //use try catch block just in case a comment index doesn't exist
                try {
                    comment = collection.getElementsByTagName('colComment').item(count).attributes.getNamedItem("id");
                    if(comment.value == id2) {
                        foundIndex = count;
                        break;  //at this point, the comment with the id exists
                    } else {
                        foundIndex = 'comment not found'
                        
                    }
                }catch(err) {
                        
                }  
            }
            if(foundIndex != 'comment not found' && foundIndex !=  undefined) {
                //delete the comment
                d.removeChild(collection.getElementsByTagName('colComment').item(foundIndex));
                updateXML(new XMLSerializer().serializeToString(d), collections_xml);
                console.log('comment ' + id2 + ' deleted!')
                return true
            }
            //console.log(collection.getElementsByTagName('comment').item(foundIndex).childNodes[0].nodeValue);
            else {
                console.log('comment with id of ' + id2 + ' does not exist');
                return false
            }
                         
        }
    });
}    

exports.getAllCollectionTagsUpdated = function(collectionId) {
	return new Date().toISOString();
}     

exports.getAllCollectionTags = function(id) {
    
    var collectionTagList = new Array();
    var tags = [];
    
    fs.readFile(collections_xml, 'ascii', function(err,data){
        if(err) {
            console.log("Could not open file"+ err);
            process.exit(1);
        }
        //first we check if collection exists
        var d = new Dom().parseFromString(data);
        var collection;
        for (count = 0; count < d.getElementsByTagName('collection').length; count++) {
            try{
                if (id == d.getElementsByTagName('collection').item(count).attributes.getNamedItem("id").value) {
                    collection = d.getElementsByTagName('collection').item(count);
                    break;
                }
            } catch(err) {
                
            }
        }
        if(collection == null) {
            console.log('collection with id of ' + id + ' does not exist');
            return null;
        } else {
            //next we check if metaData exist for collection
            var metaData_ = collection.getElementsByTagName("colMetaData");
            if(metaData_.length == 0){
                console.log('no metaData exist for this collection'); 
                return null;
            } else {
                //next we loop through the metaData and get their values, store them in an array
                for(var x = 0; x < metaData_.length; x++) {
                    var tag = new Object();
                    tag.id = metaData_[x].attributes.getNamedItem("id").value;
                    tag.updated = collection.getElementsByTagName('colDateUpdated')[0].childNodes[0].nodeValue;
                    tag["app:edited"] = new Date().toISOString();
                    tag.author = new Object();
                    tag.author.name = "John";
                    tag.title = stringToTitle(metaData_[x].childNodes[0].nodeValue);
                    tags[x] = tag;
                    collectionTagList.push(metaData_[x].childNodes[0].nodeValue);
             
                }
                //next we publish all the comments obtained
                for(var x = 0; x < collectionTagList.length; x++) {
                    console.log(collectionTagList[x]);
                    
                }
              
                return tags;
            }
                  
        }
                
            
    });
}  

exports.saveCollectionTag = function (metaData_, colID) {  //adds metadata to collection
    
    var tag = new Object();
    tag.title = stringToTitle(metaData_);
    
    var resultTag = new Object();
	

    fs.readFile(collections_xml, 'ascii', function(err,data){
        if(err) {
            console.log("Could not open file"+ err);
            process.exit(1);
        }
        //first we check if collection exists
        var d = new Dom().parseFromString(data);
        var collection;
        for (count = 0; count < d.getElementsByTagName('collection').length; count++) {
            try{
                if (colID == d.getElementsByTagName('collection').item(count).attributes.getNamedItem("id").value) {
                    collection = d.getElementsByTagName('collection').item(count);
                    break;
                }
            } catch(err) {
                
            }
        }
        if(collection == null) {
            console.log('collection with id of ' + colID + ' does not exist');
            return null;
        } else {
            var metaDataCount = collection.getElementsByTagName('colMetaDataCount')[0].childNodes[0].nodeValue;
            //next we create a replacement for the metadataCount
            newmetaDataCountEntry = d.createElement("colMetaDataCount");
            //increment the commentCount by 1 and use this value for the id of the new comment
            newmetaDataCount = parseInt(metaDataCount) + 1;
            resultTag.id  = newmetaDataCount;
            resultTag.updated = collection.getElementsByTagName('colDateUpdated')[0].childNodes[0].nodeValue;
            resultTag["app:edited"] = new Date().toISOString();
            resultTag.title = tag.title;
            //replace existing metaDataCount in the xml doc
            newmetaDataCountValue = d.createTextNode(newmetaDataCount);
            newmetaDataCountEntry.appendChild(newmetaDataCountValue);
            collection.replaceChild(newmetaDataCountEntry, collection.getElementsByTagName('colMetaDataCount')[0]);
            //replace existing dateUpdated for the collection in the xml doc
            newDateUpdated = d.createElement("colDateUpdated");
            newDateUpdatedValue = d.createTextNode(new Date().toISOString());
            newDateUpdated.appendChild(newDateUpdatedValue);
            collection.replaceChild(newDateUpdated, collection.getElementsByTagName('colDateUpdated')[0]);
            //next we create the new metaData and insert it after the last metaData
            newMetaData = d.createElement("colMetaData");
            newMetaDataValue = d.createTextNode(metaData_);
            newMetaData.appendChild(newMetaDataValue);
            newMetaData.setAttribute('id', newmetaDataCount);
            collection.appendChild(newMetaData);
            updateXML(new XMLSerializer().serializeToString(d), collections_xml);
            console.log('metaData with id of ' + newmetaDataCount + ' added!')
            return resultTag;
        }
    });
    
}

exports.getCollectionTag = function(id, id2) {    //id is for collection, id2 is for metadata
    
    var tag = new Object();
 
    fs.readFile(collections_xml, 'ascii', function(err,data){
        if(err) {
            console.log("Could not open file"+ err);
            process.exit(1);
        }
        
        //first we check if collection exists
        var d = new Dom().parseFromString(data);
        var collection;
        for (count = 0; count < d.getElementsByTagName('collection').length; count++) {
            try{
                if (id == d.getElementsByTagName('collection').item(count).attributes.getNamedItem("id").value) {
                    collection = d.getElementsByTagName('collection').item(count);
                    break;
                }
            } catch(err) {
                
            }
        }
            
        if (collection == null) {
            console.log('collection with id of ' + id + ' does not exist');
            return null;
        }
        else {
            //now we check if metaData exists for collection, retrieve the comment with the id
            var metaData_;
            var foundIndex;
            for(count = 0; count < collection.getElementsByTagName('colMetaData').length; count++) {  //use try catch just in case an index for a comment doesn't exist
                try {
                    metaData_ = collection.getElementsByTagName('colMetaData').item(count);//.attributes.getNamedItem("id");
                    if(metaData_.attributes.getNamedItem("id").value == id2) {
                        foundIndex = count;
                        break;
                    } //at this point, the metadata with the id exists
                    else {
                        foundIndex = 'metaData not found'
                    }
                } catch(err) {
                        
                }       
            }
            if(foundIndex != 'metaData not found' && foundIndex !=  undefined) {
                //print the metadata
                console.log(metaData_.childNodes[0].nodeValue);
                tag.id = metaData_.attributes.getNamedItem("id").value
                tag.updated = collection.getElementsByTagName('colDateUpdated')[0].childNodes[0].nodeValue;
                tag["app:edited"] = new Date().toISOString();
                tag.author = new Object();
                tag.author.name = "Jeorge";
                tag.title = stringToTitle(metaData_.childNodes[0].nodeValue)
                
                return tag;
            }
            else {
                console.log('metadata with id of ' + id2 + ' does not exist');
                return null;
            }
                         
        }
    });
    
}

exports.deleteCollectionTag = function (id, id2) {     //id is for collection, id2 is for metadata to be deleted
    
    fs.readFile(collections_xml, 'ascii', function(err,data){
        if(err) {
            console.log("Could not open file"+ err);
            process.exit(1);
        }
       
        //first we check if collection exists
        var d = new Dom().parseFromString(data);
        var collection;
        for (count = 0; count < d.getElementsByTagName('collection').length; count++) {
            try{
                if (id == d.getElementsByTagName('collection').item(count).attributes.getNamedItem("id").value) {
                    collection = d.getElementsByTagName('collection').item(count);
                    break;
                }
            } catch(err) {
                
            }
        }
            
        if (collection == null) {
            console.log('collection with id of ' + id + ' does not exist');
            return false
        }
        else {
            //now we check if metadata exists for collection, retrieve the metadata with the id
            var metaData;
            var foundIndex;
            for(count = 0; count < collection.getElementsByTagName('colMetaData').length; count++) { //use try catch block just in case a comment index doesn't exist
                try {
                    metaData = collection.getElementsByTagName('colMetaData').item(count).attributes.getNamedItem("id");
                    if(metaData.value == id2) {
                        foundIndex = count;
                        break;  //at this point, the metaData with the id exists
                    } else {
                        foundIndex = 'metaData not found'
                        
                    }
                }catch(err) {
                        
                }  
            }
            if(foundIndex != 'metaData not found' && foundIndex !=  undefined) {
                //delete the metaData
                d.removeChild(collection.getElementsByTagName('colMetaData').item(foundIndex));
                updateXML(new XMLSerializer().serializeToString(d), collections_xml);
                console.log('metaData ' + id2 + ' deleted!')
                return true
            }
            
            else {
                console.log('metaData with id of ' + id2 + ' does not exist');
                return false
            }
                         
        }
    });
    
}

exports.getAllImageTagsUpdated = function(collectionId, imageId) {
	return new Date();
}

exports.getAllImageTags = function (colID, imageID) {
  
    var tags = [];
    
    fs.readFile(collections_xml, 'ascii', function(err,data){
        if(err) {
            console.log("Could not open file"+ err);
            process.exit(1);
        }
       
        //first we check if collection exists
        var d = new Dom().parseFromString(data);
        var collection;
        for (count = 0; count < d.getElementsByTagName('collection').length; count++) {
            try{
                if (colID == d.getElementsByTagName('collection').item(count).attributes.getNamedItem("id").value) {
                    collection = d.getElementsByTagName('collection').item(count);
                    break;
                }
            } catch(err) {
                
            }
        }
            
        if (collection == null) {
            console.log('collection with id of ' + colID + ' does not exist');
            return null;
        }
        else {
            //now we check if the image exists in collection
            var image;
            var foundIndex;
            for(count = 0; count < collection.getElementsByTagName('image').length; count++) { //use try catch block just in case an image index doesn't exist
                try {
                    image = collection.getElementsByTagName('image').item(count);
                    if(image.attributes.getNamedItem("id").value == imageID) {
                        foundIndex = count;
                        break;  //at this point, the image with the id exists
                    } else {
                        foundIndex = 'image not found'
                    }
                }catch(err) {
                        
                }  
            }
            
            if(foundIndex != 'image not found' && foundIndex !=  undefined) {
                //next we get all metadata for the image
                var imageMetaDataList = new Array();
                var meta = image.getElementsByTagName("metaData");
                if(meta.length == 0){
                    console.log('no metadata exist for this image'); 
                    return null;
                } else {
                    //next we loop through the metadata and get their values, store them in an array
                    for(var x = 0; x < meta.length; x++) {
                        var tag = new Object();
                        tag.id = meta[x].attributes.getNamedItem("id").value
                        tag.updated = collection.getElementsByTagName('colDateUpdated')[0].childNodes[0].nodeValue;
                        tag["app:edited"] = new Date().toISOString();
                        tag.title = stringToTitle(meta[x].childNodes[0].nodeValue);
                        tags[x] = tag;
                        imageMetaDataList.push(meta[x].childNodes[0].nodeValue);
                    }
                    //next we print all the metadata obtained
                    for(var x = 0; x < imageMetaDataList.length; x++) {
                        console.log(imageMetaDataList[x]);
                    }
                    console.log(tags[0].id)
                    return tags;
                }
            }
            else {
                console.log('image with id of ' + imageID + ' does not exist');
                return null;
            }
                         
        }
    });
    
}

exports.saveImageTag = function(_metaData, colID, imageID) {
    
    var tag = new Object();
    tag.title = stringToTitle(_metaData);
    var resultTag = new Object();
    
    fs.readFile(collections_xml, 'ascii', function(err,data){
        if(err) {
            console.log("Could not open file"+ err);
            process.exit(1);
        }
       
        //first we check if collection exists
        var d = new Dom().parseFromString(data);
        var collection;
        for (count = 0; count < d.getElementsByTagName('collection').length; count++) {
            try{
                if (colID == d.getElementsByTagName('collection').item(count).attributes.getNamedItem("id").value) {
                    collection = d.getElementsByTagName('collection').item(count);
                    break;
                }
            } catch(err) {
                
            }
        }
            
        if (collection == null) {
            console.log('collection with id of ' + colID + ' does not exist');
            return null;
        }
        else {
            //now we check if the image exists in collection
            var image;
            var foundIndex;
            for(count = 0; count < collection.getElementsByTagName('image').length; count++) { //use try catch block just in case an image index doesn't exist
                try {
                    image = collection.getElementsByTagName('image').item(count);
                    if(image.attributes.getNamedItem("id").value == imageID) {
                        foundIndex = count;
                        break;  //at this point, the image with the id exists
                    } else {
                        foundIndex = 'image not found'
                    }
                }catch(err) {
                        
                }  
            }
            
            if(foundIndex != 'image not found' && foundIndex !=  undefined) {
                //next we create metadata entry for image
                var metaDataCount = image.getElementsByTagName('metaDataCount')[0].childNodes[0].nodeValue;
                //next we create a replacement for the metaDataCount
                var newmetaDataCountEntry = d.createElement("metaDataCount");
                //increment the metaDataCount by 1 and use this value for the id of the new metaData
                var newmetaDataCount = parseInt(metaDataCount) + 1;
                //replace existing metaDataCount in the xml doc
                var newmetaDataCountValue = d.createTextNode(newmetaDataCount);
                newmetaDataCountEntry.appendChild(newmetaDataCountValue);
                image.replaceChild(newmetaDataCountEntry, image.getElementsByTagName('metaDataCount')[0]);
                //next we create the new metaData and insert it after the last
                newMetaData = d.createElement("metaData");
                newMetaDataValue = d.createTextNode(_metaData);
                newMetaData.appendChild(newMetaDataValue);
                newMetaData.setAttribute('id', newmetaDataCount);
                image.appendChild(newMetaData);
                updateXML(new XMLSerializer().serializeToString(d), collections_xml);
                console.log('metaData with id of ' + newmetaDataCount + ' added to image')
            
                resultTag.id = newmetaDataCount;
                resultTag.updated = image.getElementsByTagName('dateUpdated')[0].childNodes[0].nodeValue;
                resultTag["app:edited"] = new Date().toISOString();
                resultTag.title = tag.title;
                console.log(resultTag.id)
                return resultTag;
            }
            else {
                console.log('image with id of ' + imageID + ' does not exist');
                return null;
            }
                         
        }
    });
   
}

exports.getImageTag = function(colID, imageID, tagID) {
    
    var tag = new Object();
	
    fs.readFile(collections_xml, 'ascii', function(err,data){
        if(err) {
            console.log("Could not open file"+ err);
            process.exit(1);
        }
       
        //first we check if collection exists
        var d = new Dom().parseFromString(data);
        var collection;
        for (count = 0; count < d.getElementsByTagName('collection').length; count++) {
            try{
                if (colID == d.getElementsByTagName('collection').item(count).attributes.getNamedItem("id").value) {
                    collection = d.getElementsByTagName('collection').item(count);
                    break;
                }
            } catch(err) {
                
            }
        }
            
        if (collection == null) {
            console.log('collection with id of ' + colID + ' does not exist');
            return null;
        }
        else {
            //now we check if the image exists in collection
            var image;
            var foundIndex;
            for(count = 0; count < collection.getElementsByTagName('image').length; count++) { //use try catch block just in case an image index doesn't exist
                try {
                    image = collection.getElementsByTagName('image').item(count);
                    if(image.attributes.getNamedItem("id").value == imageID) {
                        foundIndex = count;
                        break;  //at this point, the image with the id exists
                    } else {
                        foundIndex = 'image not found'
                    }
                }catch(err) {
                        
                }  
            }
            
            if(foundIndex != 'image not found' && foundIndex !=  undefined) {
                //next we get the metadata for the image, retrieve with the id
                 
                var meta;
                var foundIndex;
                for(count = 0; count < image.getElementsByTagName('metaData').length; count++) {  //use try catch just in case an index for a comment doesn't exist
                    try {
                        meta = image.getElementsByTagName('metaData').item(count);
                        if(meta.attributes.getNamedItem("id").value == tagID) {
                            foundIndex = count;
                            break;
                        } //at this point, the metadata with the id exists
                        else {
                            foundIndex = 'metadata not found'
                        }
                    } catch(err) {
                        
                    }       
                }
                if(foundIndex != 'metadata not found' && foundIndex !=  undefined) {
                    //print the comment
                    tag.id = tagID;
                    tag.updated = collection.getElementsByTagName('colDateUpdated')[0].childNodes[0].nodeValue;//last update of a collection
                    tag["app:edited"] = new Date().toISOString();
                    tag.title = stringToTitle(meta.childNodes[0].nodeValue);
                    console.log(meta.childNodes[0].nodeValue);
                    console.log(tag.id)
                    return tag;
                }
                else {
                    console.log('metadata with id of ' + tagID + ' does not exist for image ' + imageID);
                    return null;
                }
                
            }
            else {
                console.log('image with id of ' + imageID + ' does not exist');
                return null;
            }
                         
        }
    });
    
}

exports.deleteImageTag = function(colID, imageID, tagID)  {
    
    fs.readFile(collections_xml, 'ascii', function(err,data){
        if(err) {
            console.log("Could not open file"+ err);
            process.exit(1);
        }
       
        //first we check if collection exists
        var d = new Dom().parseFromString(data);
        var collection;
        for (count = 0; count < d.getElementsByTagName('collection').length; count++) {
            try{
                if (colID == d.getElementsByTagName('collection').item(count).attributes.getNamedItem("id").value) {
                    collection = d.getElementsByTagName('collection').item(count);
                    break;
                }
            } catch(err) {
                
            }
        }
            
        if (collection == null) {
            console.log('collection with id of ' + colID + ' does not exist');
            return false;
        }
        else {
            //now we check if the image exists in collection
            var image;
            var foundIndex;
            for(count = 0; count < collection.getElementsByTagName('image').length; count++) { //use try catch block just in case an image index doesn't exist
                try {
                    image = collection.getElementsByTagName('image').item(count);
                    if(image.attributes.getNamedItem("id").value == imageID) {
                        foundIndex = count;
                        break;  //at this point, the image with the id exists
                    } else {
                        foundIndex = 'image not found'
                    }
                }catch(err) {
                        
                }  
            }
            
            if(foundIndex != 'image not found' && foundIndex !=  undefined) {
                //next we get the metadata for the image, retrieve with the id
                 
                var meta;
                var foundIndex;
                for(count = 0; count < image.getElementsByTagName('metaData').length; count++) {  //use try catch just in case an index for a comment doesn't exist
                    try {
                        meta = image.getElementsByTagName('metaData').item(count);
                        if(meta.attributes.getNamedItem("id").value == tagID) {
                            foundIndex = count;
                            break;
                        } //at this point, the metadata with the id exists
                        else {
                            foundIndex = 'metadata not found'
                        }
                    } catch(err) {
                        
                    }       
                }
                if(foundIndex != 'metadata not found' && foundIndex !=  undefined) {
                    //delete the metadata
                    d.removeChild(meta);
                    updateXML(new XMLSerializer().serializeToString(d), collections_xml);
                    console.log('metaData ' + tagID + ' deleted!')
                    return true
                }
                else {
                    console.log('metadata with id of ' + tagID + ' does not exist for image ' + imageID);
                    return false;
                }
                
            }
            else {
                console.log('image with id of ' + imageID + ' does not exist');
                return false;
            }
                         
        }
    });
    
}

function updateXML(xmlData, destination) {
    
    fs.writeFile(destination, xmlData, function (err) {
        if (err) throw err;
        console.log('xml updated!');
    })
}
