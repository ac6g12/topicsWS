/*
*	@author		Ales Cirnfus
*	@date		17/12/2012
*	
*	This client sends a DELETE request to http://localhost:3000/collection/1/metadata/1
*
*	Expected response:	204 No Content (as long as collection 1 and tag 1 exist - otherwise 404)
*/

var http = require('http')
var out = require('./output');

var opts = {
	host: 'localhost',
	port: 3000,
	path: '/collection/1/metadata/1',
    method: 'DELETE'
}

var req = http.request(opts, function(res) {
	console.log(req._header);
	out.printAll(res);
})

req.end();