/*
*	@author		Ales Cirnfus
*	@date		17/12/2012
*	
*	This client sends a PUT request to http://localhost:3000/collection/1
*
*	The If-Unmodified-Since header is set to current time so the request should 
*	always succeed
*	
*	Expected response:	200 OK
*	Content-Type:		application/atom+xml
*
*	Body:				Atom Entry - updated representation of the collection resource
*/

var http = require('http')
var out = require('./output');
var date  = new Date();

var opts = {
	host: 'localhost',
	port: 3000,
	path: '/collection/1',
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
    		"<name>John Stone</name>" +
  		"</author>" +
  		"<title type='text'>A lovely collection of sky pictures</title>" +
  		"<summary>My favourite pictures of the skies in the UK</summary>" +
	"</entry>");
req.end();