/*
*	@author		Ales Cirnfus
*	@date		14/12/2012
*	
*	This client sends a POST request to http://localhost:3000/collection
*	
*	Expected response:	201 Created
*	Location:			http://localhost:3000/collection/{col_ID}
*	Content-Type:		application/atom+xml

*	Body:				Atom Entry - current representation of the created resource
*/

var http = require('http')
var out = require('./output');

var opts = {
	host: 'localhost',
	port: 3000,
	path: '/collection',
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
  		"<title type='text'>Some lovely pics of animals</title>" +
  		"<summary>My favourites</summary>" +
	"</entry>");
req.end();