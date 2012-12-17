/*
*	@author		Ales Cirnfus
*	@date		17/12/2012
*	
*	This client sends a POST request to http://localhost:3000/collection/1/comment
*	
*	Expected response:	201 Created
*	Location:			http://localhost:3000/collection/1/comment/{comment_ID}
*	Content-Type:		application/atom+xml
*
*	Body:				Atom Entry - current representation of the created resource (comment)
*/

var http = require('http')
var out = require('./output');

var opts = {
	host: 'localhost',
	port: 3000,
	path: '/collection/1/comment',
    method: 'POST',
    headers: {'content-type':'application/atom+xml'}
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
  		"<title>Best collection I've ever seen</title>" +
	"</entry>");
req.end();