/*
*	@author		Ales Cirnfus
*	@date		17/12/2012
*	
*	This client sends a POST request to http://localhost:3000/collection/1/comment
*	This test can fail(404) if collection 1 does not exist
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
    		"<name>Vladimir Trifonov</name>" +
  		"</author>" +
  		"<title>I love your pics ... they are awesome!!</title>" +
	"</entry>");
req.end();