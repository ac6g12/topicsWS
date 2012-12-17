/*
*	@author		Ales Cirnfus
*	@date		17/12/2012
*	
*	This client sends a PUT request to http://localhost:3000/collection/1/image/1
*	
*	This loads a new image from resource folder and PUTs it to collection 1 instead of
*	the current image 1
*	This test does NOT  supply either Title or Summary fields - these will remain unchanged
*	This can fail (404) if collection 1 or image 1 does not exist
*
*	Expected response:	200 OK
*	Content-Type:		application/atom+xml
*
*	Body:				Atom Entry - current representation of image 1 resource
*/

var img = 'flower.jpg';
var fs = require('fs');
var http = require('http')
var out = require('./output');
var date  = new Date();

fs.readFile(__dirname + '/resources/' + img, function(e, imgData) {
	var boundaryKey = Math.random().toString(16);
	var data = '--' + boundaryKey + '\r\n' +
		'Content-Disposition: form-data; name="image"; filename="' + img + '"\r\n' +
		'Content-Type: image/jpeg\r\n' +
		'\r\n';

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
	req.write(imgData,'binary');
	req.end('\r\n--' + boundaryKey + '--');
})