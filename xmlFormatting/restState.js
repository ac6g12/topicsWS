exports.createLink = function(relParam, typeParam, hrefParam) {
	return {
				"@" : {
					rel : relParam,
					type : typeParam,
					href : hrefParam
				}				
			}
}