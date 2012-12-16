
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
//  app.set('views', __dirname + '/views');
//  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('The A team'));
  app.use(express.session());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

// root (http://localhost:3000)
app.get('/', routes.NotAllowed405);											//TODO - return service desc
app.post('/', routes.NotAllowed405);										//405
app.put('/', routes.NotAllowed405);											//405
app.delete('/', routes.NotAllowed405);										//405

// /collection
app.get('/collection', routes.NotAllowed405);								//TODO - return a list of all collections
app.post('/collection', routes.NotAllowed405);								//TODO - create a new collection
app.put('/collection', routes.NotAllowed405);								//405
app.delete('/collection', routes.NotAllowed405);							//405

// /collection/{col_ID}
app.get('/collection/:colID', routes.NotAllowed405);						//TODO - return a list of images in the collection
app.post('/collection/:colID', routes.NotAllowed405);						//TODO - add new image
app.put('/collection/:colID', routes.NotAllowed405);						//TODO - update collection properties (title, summary)
app.delete('/collection/:colID', routes.NotAllowed405);						//TODO - delete whole collection (inc images, collection/images metadata and comments)

// /collection/{col_ID}/metadata
app.get('/collection/:colID/metadata', routes.NotAllowed405);				//TODO - return a list of tags associated with the collection
app.post('/collection/:colID/metadata', routes.NotAllowed405);				//TODO - add a new tag
app.put('/collection/:colID/metadata', routes.NotAllowed405);				//405
app.delete('/collection/:colID/metadata', routes.NotAllowed405);			//TODO - delete all tags associated with the collection

// /collection/{col_ID}/metadata/{tag_ID}
app.get('/collection/:colID/metadata/:tagID', routes.NotAllowed405);		//TODO - return tag entry
app.post('/collection/:colID/metadata/:tagID', routes.NotAllowed405);		//405
app.put('/collection/:colID/metadata/:tagID', routes.NotAllowed405);		//TODO - update tag entry
app.delete('/collection/:colID/metadata/:tagID', routes.NotAllowed405);		//TODO - delete the tag

// /collection/{col_ID}/comment
app.get('/collection/:colID/comment', routes.NotAllowed405);				//TODO - return a list of comments associated with the collection
app.post('/collection/:colID/comment', routes.NotAllowed405);				//TODO - add a new comment
app.put('/collection/:colID/comment', routes.NotAllowed405);				//405
app.delete('/collection/:colID/comment', routes.NotAllowed405);				//TODO - delete all comments associated with the collection

// /collection/{col_ID}/comment/{com_ID}
app.get('/collection/:colID/comment/:comID', routes.NotAllowed405);			//TODO - return comment entry
app.post('/collection/:colID/comment/:comID', routes.NotAllowed405);		//405
app.put('/collection/:colID/comment/:comID', routes.NotAllowed405);			//TODO - update comment entry
app.delete('/collection/:colID/comment/:comID', routes.NotAllowed405);		//TODO - delete the comment

// /collection/{col_ID}/image/{img_ID}
app.get('/collection/:colID/image/:imgID', routes.NotAllowed405);			//TODO - return image entry
app.post('/collection/:colID/image/:imgID', routes.NotAllowed405);			//405
app.put('/collection/:colID/image/:imgID', routes.NotAllowed405);			//TODO - update image entry AND/OR image binary data
app.delete('/collection/:colID/image/:imgID', routes.NotAllowed405);		//TODO - delete the image (inc its metadata and comments)

// /collection/{col_ID}/image/{img_ID}/metadata
app.get('/collection/:colID/image/:imgID/metadata', routes.NotAllowed405);		//TODO - return a list of tags associated with the image
app.post('/collection/:colID/image/:imgID/metadata', routes.NotAllowed405);		//TODO - add a new image tag
app.put('/collection/:colID/image/:imgID/metadata', routes.NotAllowed405);		//405
app.delete('/collection/:colID/image/:imgID/metadata', routes.NotAllowed405);	//TODO - delete all tags associated with the image

// /collection/{col_ID}/image/{img_ID}/metadata/{tag_ID}
app.get('/collection/:colID/image/:imgID/metadata/:tagID', routes.NotAllowed405);	//TODO - return tag entry
app.post('/collection/:colID/image/:imgID/metadata/:tagID', routes.NotAllowed405);	//495
app.put('/collection/:colID/image/:imgID/metadata/:tagID', routes.NotAllowed405);	//TODO - update tag entry
app.delete('/collection/:colID/image/:imgID/metadata/:tagID', routes.NotAllowed405);//TODO - delete the tag

// /collection/{col_ID}/image/{img_ID}/comment
app.get('/collection/:colID/image/:imgID/comment', routes.NotAllowed405);		//TODO - return a list of comments associated with the image
app.post('/collection/:colID/image/:imgID/comment', routes.NotAllowed405);		//TODO - add a new image comment
app.put('/collection/:colID/image/:imgID/comment', routes.NotAllowed405);		//405
app.delete('/collection/:colID/image/:imgID/comment', routes.NotAllowed405);	//TODO - delete all comments associated with the image

// /collection/{col_ID}/image/{img_ID}/comment/{com_ID}
app.get('/collection/:colID/image/:imgID/comment/:comID', routes.NotAllowed405);	//TODO - return comment entry
app.post('/collection/:colID/image/:imgID/comment/:comID', routes.NotAllowed405);	//405
app.put('/collection/:colID/image/:imgID/comment/:comID', routes.NotAllowed405);	//TODO - update comment entry
app.delete('/collection/:colID/image/:imgID/comment/:comID', routes.NotAllowed405);	//TODO - delete the comment

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
