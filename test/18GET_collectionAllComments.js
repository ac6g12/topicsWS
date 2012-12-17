/*
*	@author		Ales Cirnfus
*	@date		17/12/2012
*	
*	This client sends a GET request to http://localhost:3000/collection/1/comment
*	This request can fail (404) if collection 1 does not exist
*
*	Expected response:	200 OK
*	Content-Type:		application/atom+xml
*
*	Body:				Atom Feed - collection details (details of individual comments as entries)
*/

var http = require('http');
var out = require('./output');

http.get("http://localhost:3000/collection/1/comment", function(res) {
	console.log(this._header);
	out.printAll(res);
}).on('error', function(e) {
  console.log("Got error: " + e.message);
});