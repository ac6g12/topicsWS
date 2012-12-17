/*
*	@author		Ales Cirnfus
*	@date		17/12/2012
*	
*	This client sends a GET request to http://localhost:3000/collection/1/image/1
*	This request can fail (404) if collection 1 or image 1 in the collection do not exist
*
*	Expected response:	200 OK
*	Content-Type:		application/atom+xml
*
*	Body:				Atom Entry - image details
*/

var http = require('http');
var out = require('./output');

http.get("http://localhost:3000/collection/1/image/1", function(res) {
	console.log(this._header);
	out.printAll(res);
}).on('error', function(e) {
  console.log("Got error: " + e.message);
});