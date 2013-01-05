/*
*	@author		Ales Cirnfus
*	@date		17/12/2012
*	
*	CONTENT NEGOTIATION TEST
*
*	This client sends a GET request to http://localhost:3000/collection/1/image/1/comment?alt=xml
*	This request can fail (404) if collection 1 or image 1 does not exist
*
*	Expected response:	200 OK
*	Content-Type:		application/xml
*
*	Body:				XML representation of all collection 1 -> image 1 comments
*/

var http = require('http');
var out = require('./output');

http.get("http://localhost:3000/collection/1/image/1/comment?alt=xml", function(res) {
	console.log(this._header);
	out.printAll(res);
}).on('error', function(e) {
  console.log("Got error: " + e.message);
});