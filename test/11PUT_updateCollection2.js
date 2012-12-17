/*
*	@author		Ales Cirnfus
*	@date		17/12/2012
*	
*	This client sends a PUT request to http://localhost:3000/collection/2
*
*	The If-Unmodified-Since header is set to 1 YEAR before now so the request should 
*	always FAIL (provided the collection was not created more than a year ago)
*	
*	Expected response:	409 Conflict
*	Content-Type:		application/atom+xml
*
*	Body:				Atom Entry - current representation of the collection resource
*/

var http = require('http')
var out = require('./output');
var date  = new Date();
date.setFullYear(date.getFullYear() - 1);

var opts = {
	host: 'localhost',
	port: 3000,
	path: '/collection/2',
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
    		"<name>Vlado Trifonov</name>" +
  		"</author>" +
  		"<title type='text'>Lovely pics of animals</title>" +
  		"<summary>My favourite animals</summary>" +
	"</entry>");
req.end();