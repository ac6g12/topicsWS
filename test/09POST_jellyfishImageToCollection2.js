/*
*	@author		Ales Cirnfus
*	@date		14/12/2012
*	
*	This client sends a POST request to http://localhost:3000/collection/2 
*	
*	This loads an image from resource folder and POSTs it to collection 2
*	This test also supplies both Title and Summary fields
*	This can fail (404) if collection 2 does not exist
*
*	Expected response:	201 Created
*	Location:			http://localhost:3000/collection/2/image/{img_ID}
*	Content-Type:		application/atom+xml
*
*	Body:				Atom Entry - current representation of the created image resource
*/

var img = 'Jellyfish.jpg';
var title = 'Lovely Jellyfish';
var summary = 'That\'s what happens when I go swimming :-)';
var fs = require('fs');
var http = require('http')
var out = require('./output');

fs.readFile(__dirname + '/resources/' +img, function(e, imgData) {
	var boundaryKey = Math.random().toString(16);
	var data = '--' + boundaryKey + '\r\n' +
		'Content-Disposition: form-data; name="title"\r\n' +
		'\r\n' + title + '\r\n' +
		'--' + boundaryKey + '\r\n' +
		'Content-Disposition: form-data; name="summary"\r\n' +
		'\r\n' + summary + '\r\n' +
		'--' + boundaryKey + '\r\n' +
		'Content-Disposition: form-data; name="image"; filename="' + img + '"\r\n' +
		'Content-Type: image/jpeg\r\n' +
		'\r\n';

	var opts = {
		host: 'localhost',
		port: 3000,
		path: '/collection/2',
		method: 'POST',
		headers: {'Content-Type':'multipart/form-data; boundary=' + boundaryKey}
	}

	var req = http.request(opts, function(res) {
		console.log(req._header);
		out.printAll(res);
	})

	req.write(data);
	req.write(imgData,'binary');
	req.end('\r\n--' + boundaryKey + '--');
})