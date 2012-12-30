exports.formatXML = function(xmlString) {
	var offset = 0;
	var output = '';
	var nodes = xmlString.split('<');
	for(var i=1; i<nodes.length; i++) {
		var node = nodes[i];
		if(node.charAt(0) == '/') {
			offset--;
		} else {
			if(node.substring(node.length-2) != '/>') {
				offset++;
			}
		}
		output += '<' + node;
		if(node.charAt(node.length-1) == '>' && i < nodes.length - 1) {
			output += '\n'
			for(var y=0; y<offset-1; y++) {
				output += '\t';
			}
			if(nodes[i+1].charAt(0) != '/') {
				output += '\t';
			}
		}
	}
	return output;
}

exports.printAll = function (res) {
	res.setEncoding('utf8');
	exports.printHeaders(res);
	var data = "";
	res.on('data', function(d) {
		data += d
	})

	res.on('end', function() {	
		if(res.headers['content-type'].indexOf('xml') != -1) {
			console.log(exports.formatXML(data));
		} else {
			console.log(data);
		}
	})
}

exports.printHeaders = function (res) {
	console.log("Response Code: " + res.statusCode);
	console.log("Headers:");
	console.log(res.headers);
	console.log("\nResponse Body:\n");
}