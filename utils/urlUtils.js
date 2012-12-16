exports.getHostUrl = function(request) {
	return "http://" + request.header('host');
}