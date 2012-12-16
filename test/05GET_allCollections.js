/*
*	@author		Ales Cirnfus
*	@date		14/12/2012
*	
*	This client sends a GET request to http://localhost:3000/collection
*
*	Expected response:	200 OK
*	Content-Type:		application/atom+xml
*
*	Body:				Atom Feed - image collections (individual collections as entries)
*/

var http = require('http');
var out = require('./output');

http.get("http://localhost:3000/collection", function(res) {
	console.log(this._header);
	out.printAll(res);
}).on('error', function(e) {
  console.log("Got error: " + e.message);
});