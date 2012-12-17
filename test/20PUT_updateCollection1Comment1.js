/*
*	@author		Ales Cirnfus
*	@date		17/12/2012
*	
*	This client sends a PUT request to http://localhost:3000/collection/1/comment/1
*
*	The If-Unmodified-Since header is set to current time so the request should 
*	always succeed (as long as collection 1 and comment 1 exist - otherwise 404)
*	
*	Expected response:	200 OK
*	Content-Type:		application/atom+xml
*
*	Body:				Atom Entry - updated representation of the comment resource
*/

var http = require('http')
var out = require('./output');
var date  = new Date();

var opts = {
	host: 'localhost',
	port: 3000,
	path: '/collection/1/comment/1',
    method: 'PUT',
    headers: {
		'Content-Type': 'application/atom+xml',
		'If-Unmodified-Since': date.toUTCString()
	}
}

var req = http.request(opts, function(res) {
	console.log(req._header);
	out.printAll(res);
})

req.write(
	"<entry xmlns='http://www.w3.org/2005/Atom'>" +
  		"<author>"	+
    		"<name>Ales Cirnfus</name>" +
  		"</author>" +
  		"<title>One of the best collections I've ever seen</title>" +
	"</entry>");
req.end();