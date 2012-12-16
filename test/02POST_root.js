/*
*	@author		Ales Cirnfus
*	@date		14/12/2012
*	
*	This client sends a POST request to http://localhost:3000 (server root) 
*	Request method can be set to POST, PUT, DELETE - none of these allowed
*
*	Expected response:	405 Method Not Allowed
*	Content-Type:		text/plain
*/

var http = require('http')
var out = require('./output');

var opts = {
	host: 'localhost',
	port: 3000,
	path: '/',
    method: 'POST',
    headers: {'content-type':'application/atom+xml'}
}

var req = http.request(opts, function(res) {	
	console.log(req._header);
	out.printAll(res);
})

req.end();