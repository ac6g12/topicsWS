/*
*	@author		Ales Cirnfus
*	@date		17/12/2012
*	
*	This client sends a PUT request to http://localhost:3000/collection/1/image/1
*	
*	In this case there is no binary data (new image). This test only updates the image
*	details (title, summary).
*	This can fail (404) if collection 1 or image 1 does not exist
*
*	Expected response:	200 OK
*	Content-Type:		application/atom+xml
*
*	Body:				Atom Entry - current representation of image 1 resource
*/

var title = 'Nice Flower';
var summary = 'Beautiful Chrysanthemum';
var http = require('http')
var out = require('./output');
var date  = new Date();

var boundaryKey = Math.random().toString(16);
var data = '--' + boundaryKey + '\r\n' +
	'Content-Disposition: form-data; name="title"\r\n' +
	'\r\n' + title + '\r\n' +
	'--' + boundaryKey + '\r\n' +
	'Content-Disposition: form-data; name="summary"\r\n' +
	'\r\n' + summary;

var opts = {
	host: 'localhost',
	port: 3000,
	path: '/collection/1/image/1',
	method: 'PUT',
	headers: {
		'Content-Type':'multipart/form-data; boundary=' + boundaryKey,
		'If-Unmodified-Since': date.toUTCString()
	}
}

var req = http.request(opts, function(res) {
	console.log(req._header);
	out.printAll(res);
})

req.write(data);
req.end('\r\n--' + boundaryKey + '--');