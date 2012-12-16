INSTALLING AND RUNNING THE SERVER
---------------------------------

	1.	Prerequisites
	---------------------

		Node.js and node package manager (npm) must be installed on the host machine.
		If they are not installed already, follow the following instructions.
	
		1.1. Ubuntu 12.04
		-----------------

		Start the terminal and run the following commands
			1)	sudo apt-get install python-software-properties
			2)	sudo add-apt-repository ppa:chris-lea/node.js
			3)	sudo apt-get update
			4)	sudo apt-get install nodejs npm

		1.2. Windows 7
		--------------

		Just run the windows installer from http://nodejs.org/#download

	2.	Install Server Dependancies
	-----------------------------------
		Using command prompt/terminal, navigate to the root folder of the server
		(e.g. C:\CollectionWS) and execute the following command

		npm install

		This will install all packages listed in the package.json file

	3.	Running the Server
	--------------------------
		Using command prompt/terminal, navigate to the root folder of the server
		(e.g. C:\CollectionWS) and execute the following command

		node app

		The server will start on localhost, port 3000.


URI SCHEME - service for collection management
----------------------------------------------

http://localhost:3000/collection
		|
		|
		|
	http://localhost:3000/collection/{col_ID}
			|
			|
			|
			|-----http://localhost:3000/collection/{col_ID}/metadata
			|			|
			|			|
			|			|
			|		http://localhost:3000/collection/{col_ID}/metadata/{tag_ID}
			|
			|
			|
			|-----http://localhost:3000/collection/{col_ID}/comment
			|			|
			|			|
			|			|
			|		http://localhost:3000/collection/{col_ID}/comment/{com_ID}
			|
			|
			|
		http://localhost:3000/collection/{col_ID}/image/{img_ID}
				|
				|
				|
				|-----http://localhost:3000/collection/{col_ID}/image/{img_ID}/metadata
				|			|
				|			|	
				|			|
				|		http://localhost:3000/collection/{col_ID}/image/{img_ID}/metadata/{tag_ID}
				|
				|
				|
				|-----http://localhost:3000/collection/{col_ID}/image/{img_ID}/comment
							|
							|
							|
						http://localhost:3000/collection/{col_ID}/image/{img_ID}/comment/{com_ID}

API DOCUMENTATION - service for collection management
-----------------------------------------------------

Working with Collections
------------------------

	Getting a List of All Collection
	--------------------------------

	GET http://localhost:3000/collection

	Returns HTTP 200 status and an ATOM PUB feed similar to the following:

	<feed xmlns='http://www.w3.org/2005/Atom' xmlns:app=?http://www.w3.org/2007/app >
		<id>http://vac.co.uk/collection</id>
  		<title type='text'>Image Collections</title>
  		<updated>2012-12-18T16:25:00+00:00</updated>  

  		<app:collection href='http://localhost:3000/collection'>
			<title>Image Collections Service</title>
			<app:accept>application/atom+xml;type=entry</app:accept>
		</app:collection>

		<entry>
    			<id>http://vac.co.uk/collection/12</id>
    			<updated>2012-12-18T16:25:00Z</updated>
			<app:edited>2010-03-29T13:00:30Z</app:edited>
    			<author>
      				<name>Edd Stone</name>							
    			</author>
    			<title type='text'>A collection of the best lolcats</title>		
    			<summary>My own personal collection of favourite lolcatz</summary>	
    			<link rel='alternate' type='application/xml' href='http://localhost:3000/collection/12?alt=xml' />
    			<link rel='alternate' type='application/json' href='http://localhost:3000/collection/12?alt=json' />
		   	<link rel='edit' type='application/atom+xml' href='http://localhost:3000/collection/12' />
    			<link rel='edit-media' type='application/atom+xml' href='http://localhost:3000/collection/12/image' />
    			<link rel='edit' type='application/atom+xml' href='http://localhost:3000/collection/12/comment' />
			<link rel='edit' type='application/atom+xml' href='http://localhost:3000/collection/12/metadata' />
		</entry>
		<entry>
			... Other entries representing available collections ...
		</entry>
	</feed>

	Creating a New Collection
	-------------------------

	A new album can be created by sending a POST request with an appropriately ATOM entry as follows:

	POST http://localhost:3000/collection

	<entry xmlns='http://www.w3.org/2005/Atom'>
  		<author>
    			<name>Liz Smith</name>
  		</author>
  		<title type='text'>A collection of sky pictures</title>
  		<summary>My favourite pictures of the skies in the UK</summary>
	</entry>

	The server creates a new collection using the provided data and returns HTTP 201 status code, along with an ATOM entry representing
	the new collection.  The ATOM entry contains various elements added by the server such as id and links (similar to an entry from the 
	list of all collections above).

	Modifying an Existing Collection
	--------------------------------

	Using the <link rel='edit' ... > from a collection entry, the collection properties can be modified by sending a PUT request to 
	the link URL, along with an ATOM entry containing the updated data (in the same format as if creating a new collection).

	PUT http://localhost:3000/collection/{col_ID}

	The server returns HTTP 200 status, along with an updated ATOM entry of the collection.

	Deleting an Existing Collection
	-------------------------------

	A collection can be deleted by sending a DELETE requesst to the <link rel='edit' ... > from the collection entry.

	DELETE http://localhost:3000/collection/{col_ID}

	The server returns HTTP 204 status when the collection is successfully deleted.

Working with Images in a Collection
-----------------------------------

	Retrieving a List of All Images in a Collection
	-----------------------------------------------

	GET http://localhost:3000/collection/{col_ID}

	Returns HTTP 200 status and an ATOM PUB feed representation of the collection with entries in the feed listing
	all the images currently in the collection:

	<feed xmlns='http://www.w3.org/2005/Atom' xmlns:app='http://www.w3.org/2007/app'>
  		<id>http://vac.co.uk/collection/12</id>
  		<updated>2012-12-18T16:25:00Z</updated>  
		<app:edited>2012-12-18T16:25:00Z</app:edited>
  		<title type='text'>A collection of the best lolcats</title>
		<summary>My own personal collection of favourite lolcatz</summary>

		<app:collection href='http://localhost:3000/collection/12'>
			<title>A collection of the best lolcats </title>
			<app:accept>multipart/form-data</app:accept>
  		</app:collection>

	  	<link rel='alternate' type='application/xml' href='http://localhost:3000/collection/12?alt=xml' />
 		<link rel='alternate' type='application/json' href='http://localhost:3000/collection/12?alt=json' />
  		<link rel='edit' type='application/atom+xml' href='http://localhost:3000/collection/12' />
  		<link rel='edit' type='application/atom+xml' href='http://localhost:3000/collection/12/comment' />
		<link rel='edit' type='application/atom+xml' href='http://localhost:3000/collection/12/metadata' />
  
		<entry>
    			<id>http://vac.co.uk/collection/12/image/1</id>
    			<updated>2012-12-18T16:25:00Z</updated>  
			<app:edited>2012-12-18T16:25:00Z</app:edited>
    			<author>
      				<name>Edd Stone</name>								
    			</author>
    			<title>Lovely cat</title>
			<summary>This is my lovely cat Tom</summary>
    			<content type='image/jpeg' src='http://localhost:3000/image/img12_1.jpg' />
    			<link rel='edit-media' type='application/atom+xml' href='http://localhost:3000/collection/12/image/1' />
    			<link rel='edit' type='application/atom+xml' href='http://localhost:3000/collection/12/image/1/comment/' />
			<link rel='edit' type='application/atom+xml' href='http://localhost:3000/collection/12/image/1/metadata' />
  		</entry>
		<entry>
			... Another Image ...
		</entry>
		...Other Image Entries ...
	</feed>

	Adding a New Image to The Collection
	------------------------------------

	A new image can be uploaded to the URL provided by the <link rel='edit' ...> link. This link is listed in the feed body when 
	you retrieve a collection of images(e.g. <link rel='edit' type='application/atom+xml' href='http://localhost:3000/collection/12' />)

	Use a POST request with MIME content type 'multipart/form-data' as follows:

	POST http://localhost:3000/collection/{col_ID}

	Content-Type: multipart/form-data; boundary=BOUNDARY_KEY

	-- BOUNDARY_KEY
	Content-Disposition: form-data; name="title"

	...title (text - name of the image)... e.g. Lovely cat
	-- BOUNDARY_KEY
	Content-Disposition: form-data; name="summary"

	...summary (text - description of the image)... e.g. This is my lovely cat Tom
	-- BOUNDARY_KEY
	Content-Disposition: form-data; name="image"; filename="imgOfaCat.jpg"
	Content-Type: image/jpeg					

	...binary image data...
	-- BOUNDARY_KEY --

	There are three parts to this request. The first two fields (title and summary) are optional while the last part, image file, is 
	compulsory.  If 'title' is provided then the filename of the uploaded image will be used instead.

	Acceptable image formats:
		- image/jpeg
		- image/png
		- image/gif

	Following the POST request, the server add the new image to the collection and returns HTTP 201 status code, along with
	an ATOM entry representing the new image (similar to an entry from the list of all images in a collection - see above).

	Modifing an Existing Image
	--------------------------

	It is possible update the image title and summary, or even replace the binary image data using the <link rel='edit' ...> from 
	the ATOM entry representing the image.

	PUT http://localhost:3000/collection/{col_ID}/image/{img_ID}

	The format of the request is exactly at the as when you are adding a new image. The only difference is that in this case all three
	parts of the request are optional. The provided parts will be updated with the rest remaining unmodified.

	The server returns HTTP 200 status, along with an updated ATOM entry of the image.

	Deleting an Existing Image
	--------------------------

	An existing image can be deleted by sending a DELETE request to the URL provided by the <link rel='edit' ...> in 
	the ATOM entry representing the image.

	DELETE http://localhost:3000/collection/{col_ID}/image/{img_ID}

	The server returns HTTP 204 status when the image is successfully deleted.

Working with Metadata (Tags)
----------------------------

	The service enables the user to 'tag' both collections of images and individul images.

	Retrievieng a List of Tags
	--------------------------

	To retrieve a list of tag associated with a collection:

	GET http://localhost:3000/collection/{col_ID}/metadata

	For a list of tags associated with an image:

	GET http://localhost:3000/collection/{col_ID}/image/{img_ID}/metadata

	The server responds with HTTP 200 status followed by ATOM PUB feed similar to the following:

	<feed xmlns='http://www.w3.org/2005/Atom' xmlns:app='http://www.w3.org/2007/app'>
  		<id>http://vac.co.uk/collection/12/metadata</id>
  		<updated>2012-12-18T16:25:00Z</updated>  
		<app:edited>2012-12-18T16:25:00Z</app:edited>
  		<title>A collection of the best lolcats</title>
		<summary>My own personal collection of favourite lolcatz</summary>
		<content>Collection metadata (tags)<content>

		<app:collection href='http://localhost:3000/collection/12/metadata'>
			<title>Tagging service this collection</title>
			<app:accept>application/atom+xml;type=entry</app:accept>
  		</app:collection>

  		<link rel='alternate' type='application/xml' href='http://localhost:3000/collection/12/metadata?alt=xml' />
  		<link rel='alternate' type='application/json' href='http://localhost:3000/collection/12/metadata?alt=json' />
  	
		<entry>
    			<id>http://vac.co.uk/collection/12/metadata/3</id>
    			<updated>2012-12-18T16:25:00Z</updated>
			<app:edited>2012-12-18T16:25:00Z</app:edited>
			<author>
      				<name>Liz Smith</name>								
    			</author>
    			<title type='text'>lolcats</title>							  
			<link rel='alternate' type='application/xml' href='http://localhost:3000/collection/12/metadata/3?alt=xml' />
    			<link rel='alternate' type='application/json' href='http://localhost:3000/collection/12/metadata/3?alt=json' />
    			<link rel='edit' type='application/atom+xml' href='http://localhost:3000/collection/12/metadata/3' />
  		</entry>
  		<entry>
    			... another tag details ...
  		</entry>
		... other tag entries ...
	</feed>

	The body of the feed contains data about the corresponding collection/image with each entry representing a tag. 

	Creating a New Tag
	------------------

	A new tag can be added to a collection/image by sending a POST request with an appropriately ATOM entry as follows:

	POST http://localhost:3000/collection/{col_ID}/metadata	 
	(for an image tag: POST http://localhost:3000/collection/{col_ID}/image/{img_ID}/metadata)

	<entry xmlns='http://www.w3.org/2005/Atom'>
  		<title type='text'>lolcats</title>			
	</entry>

	The server creates a new tag using the provided data and returns HTTP 201 status code, along with an ATOM entry representing
	the new tag (similar to an entry in the list of tags feed).  The ATOM entry contains various elements added by the server
	such as id and links. The author element is inherited from the collection/image author.

	Modifying a Tag
	---------------

	Any tag associated with a collection or image can be modified by sending a PUT request to the URL provided by 
	the <link rel='edit' ...> link in the ATOM entry representing the tag. The body of the request must contain a modified tag
	value in the form of an ATOM entry (same as the one used when creating a new tag).

	For a collection tag:	PUT http://localhost:3000/collection/{col_ID}/metadata/{tag_ID}
	For an image tag:	PUT http://localhost:3000/collection/{col_ID}/image/{img_ID}/metadata/{tag_ID}

	The server returns HTTP 200 status, along with an updated ATOM entry of the tag.

	Deleting a Tag
	--------------

	An existing tag can be deleted by sending a DELETE request to the URL provided by the <link rel='edit' ...> in 
	the ATOM entry representing the tag.

	For a collection tag:	DELETE http://localhost:3000/collection/{col_ID}/metadata/{tag_ID}
	For an image tag:	DELETE http://localhost:3000/collection/{col_ID}/image/{img_ID}/metadata/{tag_ID}

	The server returns HTTP 204 status when the tag is successfully deleted.

Working with Comments
---------------------

	The service enables the user to comment on both collections of images and individul images.  The API for comments follows
	closely the API for working with metadata (tags) which is described in the previous section.

	Retrievieng a List of Comments
	--------------------------

	To retrieve a list of comments associated with a collection:

	GET http://localhost:3000/collection/{col_ID}/comment

	For a list of comments associated with an image:

	GET http://localhost:3000/collection/{col_ID}/image/{img_ID}/comment

	The server responds with HTTP 200 status followed by ATOM PUB feed similar to the following:

	<feed xmlns='http://www.w3.org/2005/Atom' xmlns:app='http://www.w3.org/2007/app'>
  		<id>http://vac.co.uk/collection/12/comment</id>
  		<updated>2012-12-18T16:25:00Z</updated>  
		<app:edited>2012-12-18T16:25:00Z </app:edited>
  		<title>A collection of the best lolcats</title>
		<summary>My own personal collection of favourite lolcatz</summary>
		<content>Comments on this collection<content>

		<app:collection href='http://localhost:3000/collection/12/comment'>
			<title>Collection comments service</title>
			<app:accept>application/atom+xml;type=entry</app:accept>
  		</app:collection>

  		<link rel='alternate' type='application/xml' href='http://localhost:3000/collection/12/comment?alt=xml' />
  		<link rel='alternate' type='application/json' href='http://localhost:3000/collection/12/comment?alt=json' />
  	
		<entry>
    			<id>http://vac.co.uk/collection/12/comment/3</id>
    			<updated>2012-12-18T16:25:00Z</updated>
			<app:edited>2012-12-18T16:25:00Z </app:edited>
			<author>
      				<name>Liz Smith</name>							
    			</author>
    			<title type='text'>This cat looks like my cat</title>
    			<link rel='alternate' type='application/xml' href='http://localhost:3000/collection/12/comment/3?alt=xml' />
    			<link rel='alternate' type='application/json' href='http://localhost:3000/collection/12/comment/3?alt=json' />
    			<link rel='edit' type='application/atom+xml' href='http://localhost:3000/collection/12/comment/3' />
  		</entry>
  		<entry>
    			... another comment details ...
  		</entry>
		... other comment entries ...
	</feed>

	The body of the feed contains data about the corresponding collection/image with each entry representing a comment. 

	Creating a New Comment
	----------------------

	A new comment can be added to a collection/image by sending a POST request with an appropriately ATOM entry as follows:

	POST http://localhost:3000/collection/{col_ID}/comment	 
	(for an image comment: POST http://localhost:3000/collection/{col_ID}/image/{img_ID}/comment

	<entry xmlns='http://www.w3.org/2005/Atom'>
		<author>
    			<name>Liz Smith</name>								
  		</author>
  		<title type='text'>This cat looks like my cat</title>			
	</entry>

	The server creates a new comment using the provided data and returns HTTP 201 status code, along with an ATOM entry 
	representing the new comment (similar to an entry in the list of comments feed).  The ATOM entry contains various 
	elements added by the server such as id and links.

	Modifying a Comment
	-------------------

	Any comment associated with a collection or image can be modified by sending a PUT request to the URL provided by 
	the <link rel='edit' ...> link in the ATOM entry representing the comment. The body of the request must contain a 
	modified comment value in the form of an ATOM entry (same as the one used when creating a new comment).

	For a collection comment:	PUT http://localhost:3000/collection/{col_ID}/comment/{com_ID}
	For an image comment:		PUT http://localhost:3000/collection/{col_ID}/image/{img_ID}/comment/{com_ID}

	The server returns HTTP 200 status, along with an updated ATOM entry of the comment.

	Deleting a Comment
	------------------

	An existing comment can be deleted by sending a DELETE request to the URL provided by the <link rel='edit' ...> in 
	the ATOM entry representing the comment.

	For a collection comment:	DELETE http://localhost:3000/collection/{col_ID}/comment/{com_ID}
	For an image comment:		DELETE http://localhost:3000/collection/{col_ID}/image/{img_ID}/comment/{com_ID}

	The server returns HTTP 204 status when the comment is successfully deleted.

Content Negotiation
-------------------

	The data provided by ATOM PUB feeds and entries can usually be requested in a different format.  Availability of 
	representations such as JSON and XML is advertised in the feeds and entries through the <link rel='alternate' ...>
	links.  For example:

	<link rel='alternate' type='application/xml' href='http://localhost:3000/collection/12/metadata/3?alt=xml' />
    	<link rel='alternate' type='application/json' href='http://localhost:3000/collection/12/metadata/3?alt=json' />

	The type attribute specifies the MIME type of the response the client can expect if it sends a GET request to 
	the URL provided by href attribute.

TESTING THE SERVER
------------------

	There is a number of client test scripts provided in the 'test' folder of the application.  These scripts are 
	written in node.js using the HTTP package (ClientRequest class). As such, the scripts can be easily executed 
	from command prompt/terminal by navigating to test folder and using the following command:

	node testname	(e.g. node 03POST_createCollection1)

	Each test ouputs the request headers followed by the response headers and the response body (if applicable).

	For convenience, the test script name starts with a number.  These numbers suggest a natural sequence of events
	that could occur during a client/server session.  However, the scripts can be also executed out of sequence to
	test how the server handles unexpected requests (e.g. uploading an image to a non-existent collection).

	Additional resources (such as image files) are stored in the 'resources' folder.
 
	The test scripts assume that the service for collection management is running on localhost, port 3000.