/*
*	@author		Ales Cirnfus
*	@date		17/12/2012
*	
*	This client sends a POST request to http://localhost:3000/collection/1/metadata
*	
*	Expected response:	201 Created
*	Location:			http://localhost:3000/collection/1/metadata/{tag_ID}
*	Content-Type:		application/atom+xml
*
*	Body:				Atom Entry - current representation of the created resource (tag metadata)
*/

var http = require('http')
var out = require('./output');

var opts = {
	host: 'localhost',
	port: 3000,
	path: '/collection/1/metadata',
    method: 'POST',
    headers: {'content-type':'application/atom+xml'}
}

var req = http.request(opts, function(res) {
	console.log(req._header);
	out.printAll(res);
})

req.write(
	"<entry xmlns='http://www.w3.org/2005/Atom'>" +
  		"<title>UK</title>" +
	"</entry>");
req.end();