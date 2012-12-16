/*
*	@author		Ales Cirnfus
*	@date		14/12/2012
*	
*	This client sends a GET request to http://localhost:3000 (server root)
*
*	Expected response:	200 OK
*	Content-Type:		application/atomsvc+xml
*/

var http = require('http');
var out = require('./output');

http.get("http://localhost:3000", function(res) {
	console.log(this._header);
	out.printAll(res);
}).on('error', function(e) {
  console.log("Got error: " + e.message);
});