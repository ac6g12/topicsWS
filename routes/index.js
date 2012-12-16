
/*
*	HTTP 405 status should be returned if the request method
*	is not allowed on the resource
*/
exports.NotAllowed405 = function (req, res) {
    res.send(405);
}