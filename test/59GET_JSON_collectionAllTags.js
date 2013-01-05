/*
*	@author		Ales Cirnfus
*	@date		17/12/2012
*	
*	CONTENT NEGOTIATION TEST
*
*	This client sends a GET request to http://localhost:3000/collection/1/metadata?alt=json
*	This request can fail (404) if collection 1 does not exist
*
*	Expected response:	200 OK
*	Content-Type:		application/json
*
*	Body:				JSON representation of all collection 1 tags
*/

var http = require('http');
var out = require('./output');

http.get("http://localhost:3000/collection/1/metadata?alt=json", function(res) {
	console.log(this._header);
	out.printAll(res);
}).on('error', function(e) {
  console.log("Got error: " + e.message);
});