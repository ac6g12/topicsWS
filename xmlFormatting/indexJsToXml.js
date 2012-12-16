exports.constructIndexAtomResponse = function(hostUrl) {
	var serviceFeed = {
		"@": {
			"xmlns" : "http://www.w3.org/2007/app",
			"xmlns:atom" : "http://www.w3.org/2005/Atom"
		},
		workspace : {
			"atom:title" : "Image Catalog",
			"collection" : {
				"@": {
					"href" : hostUrl + "/collection"
				},
				"atom:title" : "A service for collection management",
				"accept" : "application/atom+xml;type=entry"
			}
		}
	};
	return serviceFeed;
}